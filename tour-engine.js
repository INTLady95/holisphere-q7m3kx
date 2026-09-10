// Photo-tour engine: real renders/photos as curved "stations"; click a hotspot → fly INTO it → next station.
// No 3D scan needed: every station is one of the resort's own renders. three 0.180 + GSAP.
import * as THREE from "three";

export function createTour(opts) {
  const { stations, first, ui, onArrive, onPage } = opts;
  const R = 10;                                   // radius of the curved photo wall
  const scene = new THREE.Scene(); scene.background = new THREE.Color(0x0f2f25);
  // sky dome behind the photo walls: soft blue above, light haze at the horizon, warm ground tone below
  { const c = document.createElement("canvas"); c.width = 4; c.height = 512; const g = c.getContext("2d"); const gr = g.createLinearGradient(0, 0, 0, 512);
    gr.addColorStop(0, "#7fb3e0"); gr.addColorStop(0.28, "#b9d6ec"); gr.addColorStop(0.47, "#e3ecf1"); gr.addColorStop(0.52, "#dfe7dc"); gr.addColorStop(0.7, "#a9b79b"); gr.addColorStop(1, "#6e7f66");
    g.fillStyle = gr; g.fillRect(0, 0, 4, 512);
    const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace;
    const sky = new THREE.Mesh(new THREE.SphereGeometry(60, 32, 24), new THREE.MeshBasicMaterial({ map: tex, side: THREE.BackSide, depthWrite: false })); sky.renderOrder = -1; scene.add(sky); }
  const camera = new THREE.PerspectiveCamera(46, innerWidth / innerHeight, 0.1, 100);
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  const view = { x: 0, w: innerWidth, h: innerHeight };            // where the world is drawn (split view moves it right)
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5)); renderer.setSize(view.w, view.h);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  document.body.prepend(renderer.domElement);

  const texLoader = new THREE.TextureLoader(); const texCache = {};
  const loadTex = (url) => texCache[url] || (texCache[url] = texLoader.loadAsync(url).then(t => { t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; t.minFilter = THREE.LinearMipmapLinearFilter; return t; }));

  // --- cinematic layer: floating dust in the air between you and the picture (gives real depth) ---
  const dustCanvas = document.createElement("canvas"); dustCanvas.width = dustCanvas.height = 64;
  { const g = dustCanvas.getContext("2d"); const r = g.createRadialGradient(32, 32, 0, 32, 32, 32); r.addColorStop(0, "rgba(255,245,220,1)"); r.addColorStop(0.4, "rgba(255,240,210,.5)"); r.addColorStop(1, "rgba(255,240,210,0)"); g.fillStyle = r; g.fillRect(0, 0, 64, 64); }
  const N = 220, dustPos = new Float32Array(N * 3), dustVel = [];
  for (let i = 0; i < N; i++) { dustPos[i * 3] = (Math.random() - 0.5) * 9; dustPos[i * 3 + 1] = (Math.random() - 0.5) * 5; dustPos[i * 3 + 2] = -1.5 - Math.random() * 7.5; dustVel.push([(Math.random() - 0.5) * 0.08, (Math.random() - 0.3) * 0.05, (Math.random() - 0.5) * 0.05]); }
  const dustGeo = new THREE.BufferGeometry(); dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPos, 3));
  const dust = new THREE.Points(dustGeo, new THREE.PointsMaterial({ map: new THREE.CanvasTexture(dustCanvas), size: 0.055, transparent: true, opacity: 0.42, depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true }));
  scene.add(dust);
  let rush = 0;                                   // >0 during a flight: particles streak towards you
  const state = { key: null, def: null, mesh: null, spots: [], busy: false, lim: { yaw: 0, pitch: 0 }, geo: null };
  const cam = { yaw: 0, pitch: 0, fov: 46, x: 0, y: 0, z: 0 };
  const look = { yaw: 0, pitch: 0 };              // mouse-driven look target
  const base = { yaw: 0 };                        // 360 stations: drag moves the base, mouse position adds ±0.5 rad around it
  const dirVec = () => new THREE.Vector3(-Math.sin(cam.yaw) * Math.cos(cam.pitch), Math.sin(cam.pitch), -Math.cos(cam.yaw) * Math.cos(cam.pitch));
  function applyCam() { camera.position.set(cam.x, cam.y, cam.z); camera.lookAt(camera.position.clone().add(dirVec())); camera.fov = cam.fov; camera.aspect = view.w / view.h; camera.updateProjectionMatrix(); }
  function setViewport(fraction) {                                  // 1 = full window, 0.5 = right half
    view.w = Math.round(innerWidth * fraction); view.x = innerWidth - view.w; view.h = innerHeight;
    renderer.setPixelRatio(Math.min(devicePixelRatio, fraction < 1 ? 1.25 : 1.5)); renderer.setSize(view.w, view.h); renderer.domElement.style.left = view.x + "px"; renderer.domElement.style.width = view.w + "px";
    ui.spotsLayer.style.left = view.x + "px"; ui.spotsLayer.style.width = view.w + "px";
    applyCam(); updateLimits();
  }
  let viewFraction = 1;

  // ---------- station geometry ----------
  function buildWall(tex, arcDeg, centerYaw = 0) {
    const aspect = tex.image.width / tex.image.height;
    const A = THREE.MathUtils.degToRad(arcDeg);
    const W = R * A, H = W / aspect;
    const thetaStart = Math.PI + centerYaw - A / 2;                       // camera yaw ψ looks at cylinder θ = ψ + π
    const geo = new THREE.CylinderGeometry(R, R, H, 96, 1, true, thetaStart, A);
    tex.wrapS = THREE.RepeatWrapping; tex.repeat.x = -1; tex.offset.x = 1;   // seen from inside → un-mirror
    const mesh = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ map: tex, side: THREE.BackSide }));
    return { mesh, A, H, thetaStart, centerYaw };
  }
  const uvToWorld = (u, v, g, r = R * 0.985) => { const th = g.thetaStart + (1 - u) * g.A; return new THREE.Vector3(r * Math.sin(th), (0.5 - v) * g.H, r * Math.cos(th)); };
  function updateLimits() {
    const g = state.geo; if (!g) return;
    const vFov = THREE.MathUtils.degToRad(cam.fov), hFov = 2 * Math.atan(Math.tan(vFov / 2) * camera.aspect);
    const vAng = 2 * Math.atan((g.H / 2) / R);
    state.lim.yaw = state.full360 ? Infinity : Math.max(0, (g.A - hFov) / 2 - 0.01); state.lim.pitch = Math.max(0, (vAng - vFov) / 2 - 0.01);
  }

  async function loadStation(key, entry) {
    const def = stations[key]; state.def = def; state.key = key; state.busy = true;
    ui.loader && ui.loader.classList.remove("hide");
    const panels = def.panels || [{ img: def.img, yaw: 0, arc: def.arc || 84 }];
    const texes = await Promise.all(panels.map(pn => loadTex(pn.img)));
    (state.meshes || []).forEach(m => { scene.remove(m); m.geometry.dispose(); m.material.dispose(); });
    state.spots.forEach(s => s.el.remove()); state.spots = [];
    state.full360 = !!def.panels;
    state.geos = panels.map((pn, i) => buildWall(texes[i], pn.arc || def.arc || 84, THREE.MathUtils.degToRad(pn.yaw || 0)));
    state.meshes = state.geos.map(g => g.mesh); state.meshes.forEach(m => scene.add(m));
    const g = state.geos[0]; state.geo = g; state.mesh = g.mesh;
    cam.x = cam.y = cam.z = 0; cam.yaw = def.yaw || 0; cam.pitch = def.pitch || 0; look.yaw = cam.yaw; look.pitch = cam.pitch; base.yaw = cam.yaw;
    zoomFov = 46; cam.fov = entry ? 34 : 46; applyCam(); updateLimits();
    state.spots = (def.spots || []).map(s => makeSpot(s, state.geos[s.panel || 0]));
    ui.deg && (ui.deg.style.display = state.full360 ? "flex" : "none");
    ui.loader && ui.loader.classList.add("hide");
    ui.title && (ui.title.textContent = def.label || "");
    document.body.classList.remove("flight");
    ui.fade && gsap.to(ui.fade, { opacity: 0, duration: entry ? 1.1 : 0.7, ease: "power2.out" });
    gsap.to(cam, { fov: 46, duration: 1.4, ease: "power3.out", onUpdate: updateLimits, onComplete() { state.busy = false; } });
    if (def.card) showCard(def.card);
    onArrive && onArrive(def, key);
    // preload neighbours
    (def.spots || []).forEach(s => { const st = s.to && stations[s.to]; if (!st) return; const img = st.panels ? st.panels[0].img : st.img; img && loadTex(img).catch(() => {}); });
  }

  // ---------- hotspots ----------
  function makeSpot(s, g) {
    const el = document.createElement("button"); el.type = "button"; el.className = "spot" + (s.cls ? " " + s.cls : "");
    el.innerHTML = `<i></i><span>${s.name}</span>` + (s.tip ? `<em class="tip">${s.tip}</em>` : "");
    el.onclick = (e) => { e.stopPropagation(); if (state.busy) return; if (s.action === "page" && onPage) return onPage(s); go(s); };
    ui.spotsLayer.appendChild(el);
    return { el, def: s, world: uvToWorld(s.u, s.v, g) };
  }
  function go(s) {
    if (s.action === "site") { ui.site.classList.add("show"); return; }
    if (s.action === "look") { turnTo(s); return; }
    if (!s.to || !stations[s.to]) return;
    state.busy = true; ui.card.classList.remove("show");
    const target = s._virtual ? new THREE.Vector3(0, 0, -R * 0.985) : state.spots.find(x => x.def === s).world;
    const yp = yawPitchTo(target);
    const dest = target.clone().multiplyScalar(0.42);                                // fly ~half-way into the picture
    document.body.classList.add("flight");
    const rushObj = { v: 0 };
    gsap.timeline({ onComplete: () => { rush = 0; loadStation(s.to, true); } })
      .to(cam, { yaw: yp.yaw, pitch: yp.pitch, duration: 0.45, ease: "power2.inOut" }, 0)
      .to(cam, { x: dest.x, y: dest.y, z: dest.z, fov: 22, duration: 1.15, ease: "power3.in" }, 0.15)
      .to(rushObj, { v: 1, duration: 1.0, ease: "power2.in", onUpdate() { rush = rushObj.v; } }, 0.15)
      .to(ui.fade, { opacity: 1, duration: 0.4, ease: "power2.in" }, 0.9);
  }
  function turnTo(s) { const t = state.spots.find(x => x.def === s).world; const yp = yawPitchTo(t); look.yaw = THREE.MathUtils.clamp(yp.yaw, -state.lim.yaw, state.lim.yaw); look.pitch = THREE.MathUtils.clamp(yp.pitch, -state.lim.pitch, state.lim.pitch); }
  const yawPitchTo = (t) => { const d = t.clone().normalize(); return { yaw: Math.atan2(-d.x, -d.z), pitch: Math.asin(THREE.MathUtils.clamp(d.y, -1, 1)) }; };
  function showCard(c) {
    ui.card.querySelector("h2").textContent = c.title || ""; ui.card.querySelector("p").textContent = c.text || "";
    const img = ui.card.querySelector("img"); if (c.img) { img.src = c.img; img.style.display = "block"; } else img.style.display = "none";
    const a = ui.card.querySelector("a"); if (c.link) { a.textContent = c.link.label; a.onclick = (e) => { e.preventDefault(); c.link.action === "site" ? ui.site.classList.add("show") : (c.link.to && go({ to: c.link.to, u: 0.5, v: 0.5, _virtual: true })); }; a.style.display = "inline"; } else a.style.display = "none";
    ui.card.classList.add("show");
  }
  const _v = new THREE.Vector3();
  function updateSpots() {
    for (const s of state.spots) {
      _v.copy(s.world).project(camera);
      const vis = _v.z < 1 && Math.abs(_v.x) < 1 && Math.abs(_v.y) < 1 && !state.busy;
      s.el.style.display = vis ? "flex" : "none";
      if (vis) { s.el.style.left = ((_v.x + 1) / 2 * view.w) + "px"; s.el.style.top = ((1 - _v.y) / 2 * view.h) + "px"; }
    }
  }

  // ---------- input: mouse position = gentle look-around; drag also works; click on picture = fly to nearest hotspot ----------
  let down = null, dragged = false;
  // pinch with two fingers (or trackpad pinch = wheel+ctrl) = zoom the view
  const pz = new Map(); let pinchStart = null; let zoomFov = 46;
  const setZoom = f => { zoomFov = Math.min(64, Math.max(26, f)); cam.fov = zoomFov; updateLimits(); };
  renderer.domElement.addEventListener("pointerdown", e => { pz.set(e.pointerId, [e.clientX, e.clientY]); if (pz.size === 2) { const [a, b] = [...pz.values()]; pinchStart = { d: Math.hypot(a[0] - b[0], a[1] - b[1]), fov: zoomFov }; down = null; } });
  addEventListener("pointermove", e => { if (pz.has(e.pointerId)) { pz.set(e.pointerId, [e.clientX, e.clientY]); if (pz.size === 2 && pinchStart) { const [a, b] = [...pz.values()]; const d = Math.hypot(a[0] - b[0], a[1] - b[1]); setZoom(pinchStart.fov * pinchStart.d / Math.max(20, d)); } } });
  const pzUp = e => { pz.delete(e.pointerId); if (pz.size < 2) pinchStart = null; }; addEventListener("pointerup", pzUp); addEventListener("pointercancel", pzUp);
  renderer.domElement.addEventListener("wheel", e => { if (e.ctrlKey || e.metaKey) { e.preventDefault(); setZoom(zoomFov * (e.deltaY > 0 ? 1.05 : 0.95)); } }, { passive: false });
  addEventListener("pointermove", e => {
    if (state.busy || pinchStart) return;
    const nx = THREE.MathUtils.clamp(((e.clientX - view.x) / view.w) * 2 - 1, -1, 1), ny = (e.clientY / view.h) * 2 - 1;
    if (!down && e.clientX < view.x) return;                      // mouse over the page half: leave the world still
    if (down) { const dx = e.clientX - down.x, dy = e.clientY - down.y; if (Math.abs(dx) + Math.abs(dy) > 4) dragged = true;
      if (state.full360) { base.yaw = down.base + dx * 0.004; look.yaw = base.yaw - nx * 0.5; }
      else look.yaw = THREE.MathUtils.clamp(down.yaw + dx * 0.0025, -state.lim.yaw, state.lim.yaw);
      look.pitch = THREE.MathUtils.clamp(down.pitch + dy * 0.0025, -state.lim.pitch, state.lim.pitch); }
    else if (!("ontouchstart" in window)) { look.yaw = state.full360 ? base.yaw - nx * 0.35 : -nx * state.lim.yaw * 0.5; look.pitch = -ny * state.lim.pitch * 0.5; }
  });
  renderer.domElement.addEventListener("pointerdown", e => { down = { x: e.clientX, y: e.clientY, yaw: cam.yaw, pitch: cam.pitch, base: base.yaw }; dragged = false; });
  // full 360° turn on demand (button), 9 s, cinematic
  function spin360() { if (state.busy || !state.full360) return; state.spinning = true; gsap.to(base, { yaw: base.yaw + Math.PI * 2, duration: 9, ease: "power1.inOut", onUpdate() { look.yaw = base.yaw; }, onComplete() { state.spinning = false; } }); }
  addEventListener("pointerup", () => { down = null; });
  addEventListener("resize", () => setViewport(viewFraction));

  const clock = new THREE.Clock();
  // compass readout for 360 stations
  const degEl = ui.deg && ui.deg.querySelector("b");
  function updateDeg() { if (degEl && state.full360) degEl.textContent = ((Math.round(-THREE.MathUtils.radToDeg(cam.yaw)) % 360) + 360) % 360 + "°"; }
  let paused = false; const loop = () => {
    const t = clock.getElapsedTime(), dt = 0.016;
    if (!state.busy) { cam.yaw += (look.yaw - cam.yaw) * 0.06; cam.pitch += (look.pitch - cam.pitch) * 0.06;
      cam.y = Math.sin(t * 0.5) * 0.02; cam.x = Math.sin(t * 0.31) * 0.015; cam.fov = zoomFov + Math.sin(t * 0.25) * 0.5; }
    const P = dust.geometry.attributes.position.array;
    for (let i = 0; i < N; i++) { const v = dustVel[i];
      P[i * 3] += v[0] * dt + Math.sin(t + i) * 0.0006; P[i * 3 + 1] += v[1] * dt; P[i * 3 + 2] += v[2] * dt + rush * 0.35;
      if (P[i * 3 + 2] > 0.2) { P[i * 3 + 2] = -9; P[i * 3] = (Math.random() - 0.5) * 9; P[i * 3 + 1] = (Math.random() - 0.5) * 5; }
      if (P[i * 3 + 1] < -2.6) P[i * 3 + 1] = 2.6; if (P[i * 3 + 1] > 2.6) P[i * 3 + 1] = -2.6; if (Math.abs(P[i * 3]) > 4.6) P[i * 3] = -P[i * 3] * 0.98; }
    dust.geometry.attributes.position.needsUpdate = true; dust.material.size = 0.055 + rush * 0.12; dust.material.opacity = 0.42 + rush * 0.35;
    applyCam(); updateSpots(); updateDeg(); renderer.render(scene, camera);
  };
  let userPaused = false, autoPaused = false;
  function applyPause() { const v = userPaused || autoPaused; if (v === paused) return; paused = v; renderer.setAnimationLoop(v ? null : loop); }
  function setPaused(v) { userPaused = v; applyPause(); }
  // sleep when the tab is hidden or the window loses focus (several open windows must not all render)
  document.addEventListener("visibilitychange", () => { autoPaused = document.hidden; applyPause(); });
  addEventListener("blur", () => { autoPaused = true; applyPause(); }); addEventListener("focus", () => { autoPaused = document.hidden; applyPause(); });
  const api = { go, loadStation, showCard, spin360, cam, state, camera, base, look, setPaused, setViewport: f => { viewFraction = f; setViewport(f); } };
  window.__tour = api;
  loadStation(first); paused = true; renderer.setAnimationLoop(null); userPaused = true;   // stays asleep until the app says go (after the intro)
  return api;
}
