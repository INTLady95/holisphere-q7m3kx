// HOLISPHERE tour app: bilingual (EN default, PL), sections ordered by need, rooms with their own "reception" (booking ledger).
import { createTour } from "./tour-engine.js";
const A = "assets/holi/";
// Optional: a Google Apps Script web-app URL that appends bookings to a Google Sheet. Empty = local ledger only.
const BOOKING_ENDPOINT = "";

// ===================== TEXTS (EN / PL) =====================
// Facts from Tomek's brand bible, project description 01.09.2026, facts & checklist, DOME 4A drawings. "(proposal)" = not decided yet.
const TXT = {
en: {
  onb: { next: "Read it? Click me →", done: "Read it? Click me, we are done →", replay: "Show the guide again", steps: [
    { t: "#menu-toggle", h: "Everything is here", p: "I just opened the menu for you: every section, the most needed first. One click opens it, one click closes it." },
    { t: ".spot", h: "Dots are the same sections", p: "Watch: I hover a dot, a one-line summary appears. Then I click it and we fly into that place." },
    { t: "#m-page", h: "The ordinary page, any time", p: "I opened the split screen: the classic page on the left, the picture still alive on the right. Full page shows only the page." },
    { t: "#infobar", h: "Book where you stand", p: "We are inside a suite. The gold Book button opens a small reception: dates, guests, name. The request lands in our booking list." },
    { t: "#minimap", h: "The map", p: "Every place is a dot. Hover to see its name, click to fly there. Scroll or pinch with two fingers to zoom, drag to move, ⤢ makes it bigger." },
    { t: ".lang-btn", h: "English or Polish", p: "Switch the language here on any screen. That is all. Now the place is yours." } ] },
  ui: { bookStay: "Book your stay", explore: "Explore", discover: "Discover", exploreWorld: "Explore the world", heroK: "Koh Rong · Cambodia  ·  Bali · Indonesia", heroH: "Return to yourself.", heroS: "Regenerative luxury in glass domes among rice terraces and on a private beach. Science for your biology. Space for your soul.", introK: "Welcome", accK: "Accommodation", progK: "Programmes", wellK: "Wellness", dineK: "Dining", natK: "Nature", locK: "Destinations", jourK: "Your journey", steps: [["Before you arrive", "A short, elegant form: sleep, fatigue, diet, allergies, temperature, pillows, privacy. Never a diagnosis."], ["The Exhale", "No desk, no paperwork. A welcome by name, silence, a cool drink, the first contact with nature."], ["The Return", "A simple personal protocol for the days after, and one or two practices to keep."]], news: "Stay in touch", newsPh: "Your e-mail", newsBtn: "Subscribe", newsNote: "(proposal) Newsletter address to be decided.", legal: "© 2026 HOLISPHERE · Return to yourself · Privacy · Terms", colExplore: "Explore", colContact: "Contact", openingBali: "Bali opens Oct/Nov 2026 · Koh Rong stage 1 Dec 2026", lookAround: "Look around", menu: "☰ Menu", collapse: "Collapse ×", menuHead: "Menu · most wanted first", page: "Full page", split: "Split screen", world: "Back to the world", worldSee: "See this place in the world →", pageSee: "See the ordinary page →", hint: "Dots = site sections. Hover = summary, click = enter. ☰ Menu = full list, “Full page” always at hand.", skip: "Skip intro →", introK: "Koh Rong · Cambodia · regenerative premium hospitality", introH: "Return <em>to yourself.</em>", introS: "In a moment you will see the site menu. Explore the pictures or open the ordinary page at any time.", pageTag: "page", imgTag: "picture", both: "picture + page", spin: "Spin", book: "Book this room", bookTitle: "Reception · book here", arrive: "Arrival", depart: "Departure", guests: "Guests", who: "Name · e-mail", send: "Send request", sent: "Request recorded", inCategory: "in category", ledger: "Booking ledger (all rooms, by category)", exportCsv: "Export CSV", noBookings: "No requests yet.", copyHint: "Copy and send (address to be decided).", groups: { stay: "Stay", place: "Place", about: "About", help: "Help" }, footer: "Texts: brand documents (Tomek, 09.2026). Items marked “(proposal)” await a decision.", lang: "PL" },
  sections: {
    booking:   { name: "Booking · calendar", tip: "Pick dates and a programme, send a request. We answer by name.", group: "stay" },
    programs:  { name: "Programmes", tip: "RETURN 3 nights · RECONNECT 4 nights · REVITALISE 5–7 nights · STAY YOUR WAY.", group: "stay", title: "Stay programmes", text: "RETURN · Return to yourself (3 nights): quiet, sleep, massage, nature. RECONNECT · Find each other again (4 nights): privacy, touch, conversation, closeness, rituals for couples. REVITALISE · Regain energy (5–7 nights): movement, recovery, nutrition, biological rhythm. STAY YOUR WAY: full comfort with no obligation to take part. Daily rhythm: morning light, movement and breath; midday rest, water, treatments; sunset for emotions and relationships; evening for sleep." },
    suites:    { name: "Suites · domes", tip: "13 domes in Bali, each different. Polycarbonate that looks like glass, full blackout, bamboo and reclaimed wood, 7 with a 4-person jacuzzi.", group: "stay", title: "A suite inside a dome", text: "A transparent dome of strong polycarbonate that looks like glass: curtains open, a view without walls onto rice fields and jungle; curtains closed, full blackout and a cocoon. Each of the 13 suites has its own character (2 are two-storey). Materials: bamboo, reclaimed wood, slate, Sukabumi stone. Inside: bedroom, bathroom with an opaque zone, shower, desk, pantry and wardrobe, very quiet air-conditioning, separate light scenes for waking, relaxing, intimacy and sleep. An excellent mattress and a pillow menu. Private garden behind bamboo; 7 suites with a jacuzzi for four." },
    prices:    { name: "Prices & payment", tip: "Price list in preparation. Deposit, card or transfer, clear cancellation rules (proposal).", group: "stay" },
    contact:   { name: "Contact · message", tip: "Write to us: an individual stay, a couple, a retreat or a private event.", group: "help" },
    locations: { name: "Locations", tip: "Bali Tegalalang (opening Oct/Nov 2026) · Koh Rong, Cambodia (Dec 2026) · Polish lake district (2027) · Costa Rica (concept).", group: "place", title: "Locations", text: "Bali, Tegalalang near Ubud: 2,000 m² among rice terraces, 13 domes, under construction, opening at the turn of October and November 2026. Koh Rong, Cambodia: 3,040 m² with 75 m of beach; stage 1 from December 2026 (domes on platforms), stage 2 a hotel of 24–30 sea-view rooms, stage 3 villas above the road. Poland, Drawsko lake district: about 10 cabins on land and 5 on water, spring 2027. Costa Rica: concept, first half of 2027." },
    spa:       { name: "Spa & methods", tip: "Spa under the lobby dome: sauna and ice bath. Green methods for everyone; amber (neurofeedback, photobiomodulation) with a specialist.", group: "place", title: "Spa & methods", text: "In Bali a spa with sauna and ice bath under the lobby dome, a shared jacuzzi, a gym, a room for yoga and group sessions. Green level (for everyone): sleep, light, nature, movement, hydration, breath, massage, meditation, digital hygiene. Amber level (after qualification, with a specialist): sauna, cold plunge, stronger breathwork, EEG neurofeedback, photobiomodulation, HRV biofeedback. Outside the programme: IV drips, hormones, invasive procedures. Measurements only voluntary, as trends, and a stay without devices is always possible." },
    kitchen:   { name: "Kitchen", tip: "Fresh, local, organic. Ingredient quality, not ideology or restriction. Food should nourish and give pleasure.", group: "place", title: "Kitchen", text: "A breakfast-and-restaurant dome in Bali. Healthy cooking built on fresh, local, organic produce where possible: ingredient quality, not ideology or restriction. Food should nourish and give pleasure. A private phone-free dinner for couples in RECONNECT. (Menu, chef and room service: to be decided, proposal.)" },
    nature:    { name: "Nature · beach & pool", tip: "Koh Rong: 75 m of private beach. Bali: a 14.6 m pool among rice terraces; stage 2 adds a lagoon and cabins on water.", group: "place", title: "Nature", text: "Koh Rong: two plots by the sea, about 75 m of beach, domes on woven platforms among palms. Bali Tegalalang: a 14.6 m pool (about 105 m²), jacuzzi, stone paths, a shallow pond and a dry creek in the MBLA Studio landscape concept; at night the domes are lit from below, a levitation effect. Bali stage 2: a lagoon and 8 cabins partly on water with water access from the terrace." },
    stay:      { name: "Your stay · The Exhale", tip: "Arrival without a desk or forms, a welcome by name, silence and a drink. Departure with a protocol for home.", group: "place", title: "The guest journey", text: "Before arrival: a short, elegant form (sleep, fatigue, diet, allergies, temperature, pillows, privacy), not a diagnosis. Arrival “The Exhale”: no standing at a desk, no paperwork, luggage disappears from attention, silence, a cool drink, contact with nature. Departure “The Return”: a simple personal protocol for the coming days and one or two practices to continue. Staff do not diagnose and do not “motivate”; they recognise when a guest wants conversation and when silence." },
    reviews:   { name: "Reviews · comments", tip: "Leave a comment or read what guests say.", group: "about" },
    philosophy:{ name: "Philosophy · Return to yourself", tip: "Regenerative premium hospitality: time, silence, space, privacy, choice, no friction.", group: "about", title: "Return to yourself", text: "Science for your biology. Space for your soul. HOLISPHERE is not a hotel with a list of treatments but its own category: regenerative luxury. We understand luxury as time, silence, space, privacy, choice and the absence of friction. People before technology, regulation before optimisation." },
    spheres:   { name: "Five spheres of renewal", tip: "Stillness · Vitality · Connection · Nature · Meaning. Every stay touches all five, in proportions set by the guest.", group: "about", title: "Five Spheres of Renewal", text: "Stillness: fewer stimuli, silence, breath, sleep. Vitality: contact with the body, movement, massage, food, heat and cold. Connection: closeness with yourself and others. Nature: natural rhythm, light, water, greenery, rice fields. Meaning: a new perspective, creativity, gratitude, local culture. The 4R process: Regulate → Restore → Reconnect → Rise." },
    faq:       { name: "Questions & help", tip: "Getting there, children, diet, devices, privacy: short answers.", group: "help" },
    investors: { name: "Investors", tip: "Bali under construction, Koh Rong stage 1 from Dec 2026 ($0.5–0.6M), stage 2 hotel from ~$3M.", group: "about" },
    settings:  { name: "Settings", tip: "Language, currency, default view, less motion.", group: "help" },
  },
  stations: {
    hotel: { label: "Koh Rong · beach hotel", title: "Koh Rong · stage 2 · beach hotel", text: "The goal of stage 2 (in 2–3 years): a hotel of 24–30 rooms, all with sea view, terraces, a pool and direct access to the beach, five-star standard. Stage 3: villas with apartments for sale and rent on the slope above the road. Working name of the place: Coco Cove." },
    beach: { label: "Koh Rong · beach" },
    aerial: { label: "Koh Rong · stage 1 · domes from above", title: "Koh Rong · stage 1 · domes", text: "Domes on removable woven platforms on stilts, with terraces: 6 m cabins and 5 m + 3.5 m sets. A pool zone, a rebuilt restaurant, a spa with jacuzzi. Cabins without a sea view have a jacuzzi in the bathroom. Start: December 2026, for 2–3 seasons; later the stage-2 hotel stands here." },
    "dome-day": { label: "Dome · day (next to it: pool, spa)", link: "See the suite →", nightName: "The dome at night", nightTip: "The same dome after dark." },
    "dome-night": { label: "Dome · night", title: "The dome at night · a cocoon", text: "After dark the dome becomes a cocoon: full blackout, separate light scenes for relaxing, intimacy and sleep, very quiet air-conditioning, no disturbing indicator lights or intrusive screens. At night the domes are lit from below: a levitation effect.", link: "Step inside →", enterName: "Step inside", enterTip: "The RECONNECT suite for couples.", dayName: "The dome by day", dayTip: "The same dome in daylight." },
    "interior-4a": { label: "RETURN suite", link: "Contact · booking →", otherName: "The other suite", otherTip: "The RECONNECT suite.", exitName: "Step outside" },
    "interior-7d": { label: "RECONNECT suite", title: "RECONNECT · 4 nights · for couples", text: "Privacy, touch, conversation, closeness. Rituals for two from the brand document: a shared intention, a private phone-free dinner, a guided conversation about gratitude, learning partner massage, a shared bath, sauna or jacuzzi, breath and movement for two, a sunrise or sunset in silence, a letter to your partner.", exitName: "Step outside" },
    pool: { label: "Pool" },
    restaurant: { label: "Spa & kitchen", enterName: "Enter the spa", enterTip: "Inside the spa zone." },
    "interior-16m": { label: "Spa · inside", title: "The 4R process", text: "Regulate: first take the overload off (breath, silence, nature, soft light). Restore: sleep, daily rhythm, water, food, massage, heat and cold. Reconnect: contact with the body, emotions, partner, nature. Rise: only then focus, creativity, habits and a plan for home. Offer: yoga, meditation, breath sessions, massages, sound therapy, aromatherapy, thermal baths, sleep programmes, digital detox.", exitName: "Exit", gymName: "Gym", gymTip: "Movement under the dome." },
    gym: { label: "Gym in a dome", title: "Vitality · gym", text: "A gym under a transparent dome: treadmill, bike, incline bench, dumbbells, bench (from the construction drawings, May 2026). Mobility, movement and breath as a foundation, not a feat.", backName: "Back to the spa" },
    lobby: { label: "Reception · The Exhale", link: "Open the page →", pageName: "Open the page" },
    bali: { label: "Bali · Tegalalang", title: "Bali · Tegalalang", text: "2,000 m² among rice terraces, 15 minutes from Ubud. 13 domes (2 two-storey, about 26–30 guests in total), a lobby dome with the spa below, a restaurant dome, a 14.6 m pool, jacuzzi, gym. Status 28.08.2026: foundations and platforms, the pool filled, bamboo walls, stone paths, the first dome. Opening: the turn of October and November 2026.", krName: "Koh Rong", krTip: "Back to Cambodia." },
    "bali-dome": { label: "Bali · dome", link: "Step inside →", enterName: "Step inside", topName: "View from above", topTip: "Bali from a bird's eye." },
  },
  page: {
    bookingIntro: "Choose dates and a programme. We send a request, not an automatic reservation: a stay begins with a short conversation about what you need.", calHint: "Click the arrival day, then the departure day.", program: "Programme", location: "Location", programs: ["RETURN · 3 nights", "RECONNECT · 4 nights (couples)", "REVITALISE · 5–7 nights", "STAY YOUR WAY"], locations: ["Bali · Tegalalang", "Koh Rong · Cambodia"], bookingNote: "(proposal) The booking address, confirmation and deposit are to be agreed with the team. The pre-arrival form (sleep, diet, allergies, temperature, pillows) is sent after confirmation.",
    pricesIntro: "The price list for stays and programmes is in preparation. An intimate place for up to about 30 guests; guests pay luxury rates for silence and privacy.", prices: [["Deposit", "30% at confirmation, the rest 14 days before arrival. (proposal)"], ["Payment", "Card, bank transfer, in Asia also local payments. (proposal)"], ["Cancellation", "Free up to 30 days before arrival; one free date change. (proposal)"], ["Included", "The programme, the daily rhythm (movement, breath, nature, sleep ritual), massages and sauna per programme, breakfasts. (proposal based on the opening standard)"]],
    contactIntro: "Write to us and we answer by name. An individual stay, a couple, a retreat, a private event or a long stay.", topic: "Topic", topics: ["Stay", "Couple · RECONNECT", "Retreat / private event", "Cooperation", "Other"], message: "Message", msgPh: "What do you need?", sendMsg: "Send message", contactNote: "(proposal) Target address: contact@holisphere… to be decided. For now the form shows the text to copy.",
    reviewsIntro: "Guest reviews and comments. The Bali resort opens at the turn of October and November 2026, so the first reviews will come after the pilot test stay.", rating: "Rating", comment: "Comment", name: "Name", addComment: "Add comment", reviewsNote: "(proposal) In the demo, comments are saved only in this browser.", noComments: "No comments yet.",
    faq: [["Getting there", "Bali: 15 min from Ubud, the last stretch is narrow, light electric vehicles from the main road. Koh Rong: boat from Sihanoukville. (Koh Rong: proposal)"], ["Devices and data", "Measurements only voluntary, as trends. A stay without devices and without sharing data is always possible."], ["Diet and allergies", "We ask in the pre-arrival form; the kitchen is fresh, local, without ideology."], ["Privacy", "Consent before touch, measurement and data. Confidentiality is part of the product. Rules on drones and photos."], ["Is it treatment?", "No. We do not diagnose and do not replace therapy. Amber methods only after qualification with a specialist."], ["Children", "To be decided. (not in the documents)"]],
    investorsText: "Bali (2,000 m², 13 domes) under construction, opening Oct/Nov 2026; stage 2 with a lagoon and cabins on water. Koh Rong: 3,040 m² with 75 m of beach; stage 1 from Dec 2026 (domes, $0.5–0.6M), stage 2 a hotel of 24–30 rooms (from ~$3M), stage 3 villas ($5–6M+). Drawsko lake district: spring 2027. Costa Rica: concept.", investorsNote: "Investor materials are shared individually (dossier, pipeline). No promises of a “guaranteed return”.",
    language: "Language", currency: "Currency", defaultView: "Default view", viewSplit: "Split screen (page + world)", viewFull: "Ordinary page, full screen", motion: "Motion and effects", motionOn: "Full effects", motionOff: "Less motion", save: "Save", saved: "Saved. Default view: ", programsGrid: [["RETURN", "3 nights", "Quiet, sleep, massage, nature, mental space."], ["RECONNECT", "4 nights · couples", "Privacy, touch, conversation, closeness, rituals for two."], ["REVITALISE", "5–7 nights", "Movement, recovery, nutrition, sleep, biological rhythm."], ["STAY YOUR WAY", "any length", "Full comfort with no obligation to take part."]],
    ledgerCols: ["#", "Date", "Category", "Room / place", "Arrival", "Departure", "Guests", "Who", "Language"], requestFor: "REQUEST", dates: "Dates", tbd: "to be agreed",
  },
},
pl: {
  onb: { next: "Przeczytane? Kliknij mnie →", done: "Przeczytane? Kliknij, to już wszystko →", replay: "Pokaż przewodnik ponownie", steps: [
    { t: "#menu-toggle", h: "Wszystko jest tutaj", p: "Właśnie otworzyłem dla Ciebie menu: wszystkie działy, od najpotrzebniejszych. Jedno kliknięcie otwiera, jedno zamyka." },
    { t: ".spot", h: "Kropki to te same działy", p: "Patrz: najeżdżam na kropkę, pojawia się jedno zdanie. Potem klikam i wlatujemy do tego miejsca." },
    { t: "#m-page", h: "Zwykła strona w każdej chwili", p: "Otworzyłem podzielony ekran: klasyczna strona po lewej, obraz nadal żywy po prawej. „Full page” pokazuje samą stronę." },
    { t: "#infobar", h: "Rezerwuj tam, gdzie stoisz", p: "Jesteśmy w apartamencie. Złoty przycisk Book otwiera małą recepcję: daty, goście, imię. Zapytanie trafia na naszą listę rezerwacji." },
    { t: "#minimap", h: "Mapa", p: "Każde miejsce to punkt. Najedź, żeby zobaczyć nazwę, kliknij, żeby tam polecieć. Kółko albo dwa palce = zoom, przeciągnij = przesuń, ⤢ powiększa mapę." },
    { t: ".lang-btn", h: "English albo polski", p: "Tu zmienisz język na każdym ekranie. To wszystko. Teraz to miejsce jest Twoje." } ] },
  ui: { bookStay: "Zarezerwuj pobyt", explore: "Zobacz", discover: "Odkryj", exploreWorld: "Zwiedzaj świat", heroK: "Koh Rong · Kambodża  ·  Bali · Indonezja", heroH: "Wróć do siebie.", heroS: "Regeneracyjny luksus w szklanych kopułach wśród tarasów ryżowych i na prywatnej plaży. Nauka dla biologii. Przestrzeń dla duszy.", introK: "Witamy", accK: "Apartamenty", progK: "Programy", wellK: "Wellness", dineK: "Kuchnia", natK: "Natura", locK: "Kierunki", jourK: "Twoja podróż", steps: [["Przed przyjazdem", "Krótki, elegancki formularz: sen, zmęczenie, dieta, alergie, temperatura, poduszki, prywatność. Nigdy diagnoza."], ["The Exhale", "Bez lady, bez papierów. Powitanie po imieniu, cisza, chłodny napój, pierwszy kontakt z naturą."], ["The Return", "Prosty osobisty protokół na kolejne dni i jedna–dwie praktyki do zachowania."]], news: "Bądźmy w kontakcie", newsPh: "Twój e-mail", newsBtn: "Zapisz się", newsNote: "(propozycja) Adres newslettera do ustalenia.", legal: "© 2026 HOLISPHERE · Return to yourself · Prywatność · Regulamin", colExplore: "Odkryj", colContact: "Kontakt", openingBali: "Bali: otwarcie X/XI 2026 · Koh Rong etap 1: XII 2026", lookAround: "Rozejrzyj się", menu: "☰ Menu", collapse: "Zwiń ×", menuHead: "Menu · od najczęściej szukanego", page: "Zwykła strona", split: "Podziel ekran", world: "Wróć do świata", worldSee: "Zobacz to miejsce w świecie →", pageSee: "Zobacz zwykłą stronę →", hint: "Kropki = działy strony. Najedź = skrót, kliknij = wejdź. ☰ Menu = cała lista, „Zwykła strona” zawsze pod ręką.", skip: "Pomiń intro →", introK: "Koh Rong · Kambodża · regeneracyjna gościnność premium", introH: "Wróć <em>do siebie.</em>", introS: "Za chwilę zobaczysz menu strony. Możesz zwiedzać obrazy albo w każdej chwili otworzyć zwykłą stronę.", pageTag: "strona", imgTag: "obraz", both: "obraz + strona", spin: "Obróć", book: "Zarezerwuj ten pokój", bookTitle: "Recepcja · rezerwuj tutaj", arrive: "Przyjazd", depart: "Wyjazd", guests: "Goście", who: "Imię · e-mail", send: "Wyślij zapytanie", sent: "Zapytanie zapisane", inCategory: "w kategorii", ledger: "Rejestr rezerwacji (wszystkie pokoje, wg kategorii)", exportCsv: "Eksport CSV", noBookings: "Jeszcze nie ma zapytań.", copyHint: "Skopiuj i wyślij (adres do ustalenia).", groups: { stay: "Pobyt", place: "Miejsce", about: "O nas", help: "Pomoc" }, footer: "Teksty: dokumenty marki (Tomek, 09.2026). Fragmenty oznaczone „(propozycja)” czekają na decyzję.", lang: "EN" },
  sections: {
    booking:   { name: "Rezerwacja · kalendarz", tip: "Wybierz daty i program, wyślij zapytanie. Odpowiadamy po imieniu.", group: "stay" },
    programs:  { name: "Programy", tip: "RETURN 3 noce · RECONNECT 4 noce · REVITALISE 5–7 nocy · STAY YOUR WAY.", group: "stay", title: "Programy pobytu", text: "RETURN · Wróć do siebie (3 noce): wyciszenie, sen, masaż, natura. RECONNECT · Odnajdźcie się na nowo (4 noce): prywatność, dotyk, rozmowa, bliskość, rytuały dla par. REVITALISE · Odzyskaj energię (5–7 nocy): ruch, regeneracja, odżywianie, rytm biologiczny. STAY YOUR WAY: pełen komfort bez obowiązku uczestnictwa. Rytm doby: rano światło, ruch i oddech; w dzień odpoczynek, woda, zabiegi; zachód słońca dla emocji i relacji; wieczór dla snu." },
    suites:    { name: "Apartamenty · kopuły", tip: "13 kopuł na Bali, każda inna. Poliwęglan jak szkło, pełne zaciemnienie, bambus i drewno z odzysku, 7 z jacuzzi dla 4 osób.", group: "stay", title: "Apartament w kopule", text: "Transparentna kopuła z wytrzymałego poliwęglanu, który wygląda jak szkło: po odsłonięciu zasłon widok bez ścian na pola ryżowe i dżunglę, po zasłonięciu pełne zaciemnienie i kokon. Każdy z 13 apartamentów ma inny charakter (2 są dwukondygnacyjne). Materiały: bambus, drewno z odzysku, łupek, kamień Sukabumi. W środku: sypialnia, łazienka z nieprzezroczystą strefą, prysznic, biurko, pantry i garderoba, cicha klimatyzacja, osobne światło na pobudkę, relaks, intymność i sen. Doskonały materac i menu poduszek. Własna strefa prywatna za bambusem; 7 apartamentów z jacuzzi dla 4 osób." },
    prices:    { name: "Ceny i płatność", tip: "Cennik w przygotowaniu. Zaliczka, karta lub przelew, jasne zasady anulowania (propozycja).", group: "stay" },
    contact:   { name: "Kontakt · wiadomość", tip: "Napisz do nas. Pobyt indywidualny, dla par, retreat lub wydarzenie zamknięte.", group: "help" },
    locations: { name: "Lokalizacje", tip: "Bali Tegalalang (otwarcie X/XI 2026) · Koh Rong, Kambodża (XII 2026) · Pojezierze Drawskie (2027) · Kostaryka (koncepcja).", group: "place", title: "Lokalizacje", text: "Bali, Tegalalang koło Ubud: 2 000 m² wśród tarasów ryżowych, 13 kopuł, w budowie, otwarcie przełom X/XI 2026. Koh Rong, Kambodża: 3 040 m² z 75 m plaży; etap 1 od XII 2026 (kopuły na platformach), etap 2 hotel 24–30 pokoi z widokiem na morze, etap 3 wille powyżej drogi. Polska, Pojezierze Drawskie: ok. 10 domków na lądzie i 5 na wodzie, wiosna 2027. Kostaryka: koncepcja, I połowa 2027." },
    spa:       { name: "Spa i metody", tip: "Spa pod kopułą-lobby: sauna i lodowa wanna. Metody zielone dla każdego; bursztynowe (neurofeedback, fotobiomodulacja) ze specjalistą.", group: "place", title: "Spa i metody", text: "Na Bali spa z sauną i lodową wanną pod kopułą-lobby, ogólnodostępne jacuzzi, siłownia, sala do jogi i zajęć grupowych. Poziom zielony (dla wszystkich): sen, światło, natura, ruch, nawodnienie, oddech, masaż, medytacja, higiena cyfrowa. Poziom bursztynowy (po kwalifikacji, ze specjalistą): sauna, cold plunge, intensywniejszy oddech, EEG neurofeedback, fotobiomodulacja, HRV biofeedback. Poza programem: kroplówki, hormony, procedury inwazyjne. Pomiary tylko dobrowolne, jako trendy, i pobyt bez urządzeń zawsze możliwy." },
    kitchen:   { name: "Kuchnia", tip: "Świeże, lokalne, organiczne. Jakość składników, nie ideologia i restrykcja. Jedzenie ma odżywiać i sprawiać przyjemność.", group: "place", title: "Kuchnia", text: "Kopuła śniadaniowo-restauracyjna na Bali. Zdrowa kuchnia oparta na świeżych, możliwie lokalnych i organicznych produktach: jakość składników, nie ideologia i restrykcja. Jedzenie ma odżywiać i sprawiać przyjemność. Prywatna kolacja bez telefonów dla par w programie RECONNECT. (Menu, szef kuchni i room service: do ustalenia, propozycja.)" },
    nature:    { name: "Natura · plaża i basen", tip: "Koh Rong: 75 m własnej plaży. Bali: basen 14,6 m wśród tarasów ryżowych, w etapie 2 laguna i domki na wodzie.", group: "place", title: "Natura", text: "Koh Rong: dwie działki nad morzem, ok. 75 m linii plaży, kopuły na plecionych platformach wśród palm. Bali Tegalalang: basen 14,6 m (ok. 105 m²), jacuzzi, ścieżki kamienne, płytki staw i suchy strumień w koncepcji krajobrazu MBLA Studio; nocą kopuły podświetlone od spodu, efekt lewitacji. Etap 2 na Bali: laguna i 8 domków częściowo na wodzie z wejściem do wody z tarasu." },
    stay:      { name: "Pobyt · The Exhale", tip: "Przyjazd bez lady i formularzy, powitanie po imieniu, cisza i napój. Wyjazd z protokołem na dom.", group: "place", title: "Ścieżka gościa", text: "Przed przyjazdem: krótki, elegancki formularz (sen, zmęczenie, dieta, alergie, temperatura, poduszki, prywatność), nie diagnoza. Przyjazd „The Exhale · Pierwszy wydech”: bez stania przy ladzie, bez papierów, bagaż znika z uwagi, cisza, chłodny napój, kontakt z naturą. Wyjazd „The Return · Powrót”: prosty osobisty protokół na kolejne dni i jedna–dwie praktyki do kontynuowania. Personel nie diagnozuje i nie „motywuje”; rozpoznaje, kiedy gość chce rozmowy, a kiedy ciszy." },
    reviews:   { name: "Opinie · komentarze", tip: "Zostaw komentarz lub przeczytaj, co mówią goście.", group: "about" },
    philosophy:{ name: "Filozofia · Wróć do siebie", tip: "Regeneracyjna gościnność premium: czas, cisza, przestrzeń, prywatność, wybór, brak tarcia.", group: "about", title: "Return to yourself · Wróć do siebie", text: "Nauka dla biologii. Przestrzeń dla duszy. HOLISPHERE to nie hotel z listą zabiegów, tylko własna kategoria: regeneracyjny luksus. Luksus rozumiemy jako czas, ciszę, przestrzeń, prywatność, wybór i brak tarcia. Człowiek przed technologią, regulacja przed optymalizacją." },
    spheres:   { name: "Pięć sfer odnowy", tip: "Stillness · Vitality · Connection · Nature · Meaning. Każdy pobyt dotyka wszystkich pięciu, w proporcjach pod gościa.", group: "about", title: "Five Spheres of Renewal", text: "Stillness: mniej bodźców, cisza, oddech, sen. Vitality: kontakt z ciałem, ruch, masaż, jedzenie, ciepło i zimno. Connection: bliskość z sobą i innymi. Nature: naturalny rytm, światło, woda, zieleń, pola ryżowe. Meaning: nowa perspektywa, twórczość, wdzięczność, lokalna kultura. Proces 4R: Regulate → Restore → Reconnect → Rise." },
    faq:       { name: "Pytania i pomoc", tip: "Dojazd, dzieci, dieta, urządzenia, prywatność: krótkie odpowiedzi.", group: "help" },
    investors: { name: "Inwestorzy", tip: "Bali w budowie, Koh Rong etap 1 od XII 2026 (0,5–0,6 mln USD), etap 2 hotel od ~3 mln USD.", group: "about" },
    settings:  { name: "Ustawienia", tip: "Język, waluta, domyślny widok, mniej ruchu.", group: "help" },
  },
  stations: {
    hotel: { label: "Koh Rong · hotel na plaży", title: "Koh Rong · etap 2 · hotel na plaży", text: "Cel drugiego etapu (za 2–3 lata): hotel 24–30 pokoi, wszystkie z widokiem na morze, tarasy, basen i wyjście na plażę, standard pięciogwiazdkowy. Etap 3: wille z apartamentami na sprzedaż i wynajem na zboczu powyżej drogi. Robocza nazwa miejsca: Coco Cove." },
    beach: { label: "Koh Rong · plaża" },
    aerial: { label: "Koh Rong · etap 1 · kopuły z lotu ptaka", title: "Koh Rong · etap 1 · kopuły", text: "Kopuły na demontowalnych, plecionych platformach na palach, z tarasami: domki 6 m i zestawy 5 m + 3,5 m. Strefa basenowa, przebudowana restauracja, spa z jacuzzi. Domki bez widoku na morze mają jacuzzi w łazience. Start: grudzień 2026, na 2–3 sezony, potem w tym miejscu hotel etapu 2." },
    "dome-day": { label: "Kopuła · dzień (obok: basen, spa)", link: "Zobacz apartament →", nightName: "Kopuła nocą", nightTip: "Ta sama kopuła po zmroku." },
    "dome-night": { label: "Kopuła · noc", title: "Kopuła nocą · kokon", text: "Po zmroku kopuła staje się kokonem: pełne zaciemnienie, osobne światło na relaks, intymność i sen, bardzo cicha klimatyzacja, brak zakłócających kontrolek i inwazyjnych ekranów. Nocą kopuły są podświetlone od spodu: efekt lewitacji.", link: "Wejdź do środka →", enterName: "Wejdź do środka", enterTip: "Apartament RECONNECT dla par.", dayName: "Kopuła w dzień", dayTip: "Ta sama kopuła za dnia." },
    "interior-4a": { label: "Apartament RETURN", link: "Kontakt · rezerwacja →", otherName: "Drugi apartament", otherTip: "Apartament RECONNECT.", exitName: "Wyjdź na zewnątrz" },
    "interior-7d": { label: "Apartament RECONNECT", title: "RECONNECT · 4 noce · dla par", text: "Prywatność, dotyk, rozmowa, bliskość. Rytuały dla dwojga z dokumentu marki: wspólna intencja, prywatna kolacja bez telefonów, prowadzona rozmowa o wdzięczności, nauka masażu partnerskiego, wspólna kąpiel, sauna lub jacuzzi, oddech i ruch dla dwojga, wschód lub zachód w ciszy, list do partnera.", exitName: "Wyjdź na zewnątrz" },
    pool: { label: "Basen" },
    restaurant: { label: "Spa i kuchnia", enterName: "Wejdź do spa", enterTip: "Wnętrze strefy spa." },
    "interior-16m": { label: "Spa · wnętrze", title: "Proces 4R", text: "Regulate: najpierw zdjąć przeciążenie (oddech, cisza, natura, miękkie światło). Restore: sen, rytm dnia, woda, jedzenie, masaż, ciepło i zimno. Reconnect: kontakt z ciałem, emocjami, partnerem, naturą. Rise: dopiero potem koncentracja, kreatywność, nawyki i plan na dom. Oferta: joga, medytacja, sesje oddechowe, masaże, terapia dźwiękiem, aromaterapia, kąpiele termiczne, programy snu, cyfrowy detoks.", exitName: "Wyjdź", gymName: "Siłownia", gymTip: "Ruch pod kopułą." },
    gym: { label: "Siłownia w kopule", title: "Vitality · siłownia", text: "Siłownia pod przezroczystą kopułą: bieżnia, rower, ławka skośna, hantle, ławka (z rysunków wykonawczych, maj 2026). Mobility, ruch i oddech jako fundament, nie wyczyn.", backName: "Wróć do spa" },
    lobby: { label: "Recepcja · The Exhale", link: "Wejdź na stronę →", pageName: "Wejdź na stronę" },
    bali: { label: "Bali · Tegalalang", title: "Bali · Tegalalang", text: "2 000 m² wśród tarasów ryżowych, 15 minut od Ubud. 13 kopuł (2 dwukondygnacyjne, razem ok. 26–30 gości), kopuła-lobby ze spa w przyziemiu, kopuła restauracyjna, basen 14,6 m, jacuzzi, siłownia. Stan 28.08.2026: fundamenty i platformy, basen z wodą, bambusowe ściany, kamienne ścieżki, pierwsza kopuła. Otwarcie: przełom października i listopada 2026.", krName: "Koh Rong", krTip: "Wróć do Kambodży." },
    "bali-dome": { label: "Bali · kopuła", link: "Wejdź do środka →", enterName: "Wejdź do środka", topName: "Widok z góry", topTip: "Bali z lotu ptaka." },
  },
  page: {
    bookingIntro: "Wybierz daty i program. Wysyłamy zapytanie, a nie automatyczną rezerwację: pobyt zaczyna się od krótkiej rozmowy o tym, czego potrzebujesz.", calHint: "Kliknij dzień przyjazdu, potem dzień wyjazdu.", program: "Program", location: "Lokalizacja", programs: ["RETURN · 3 noce", "RECONNECT · 4 noce (dla par)", "REVITALISE · 5–7 nocy", "STAY YOUR WAY"], locations: ["Bali · Tegalalang", "Koh Rong · Kambodża"], bookingNote: "(propozycja) Adres rezerwacji, potwierdzenie i zaliczka do ustalenia z zespołem. Formularz przed przyjazdem (sen, dieta, alergie, temperatura, poduszki) wysyłamy po potwierdzeniu.",
    pricesIntro: "Cennik pobytów i programów jest w przygotowaniu. Kameralny obiekt do ok. 30 gości; za ciszę i prywatność płaci się stawki luksusowe.", prices: [["Zaliczka", "30% przy potwierdzeniu, reszta 14 dni przed przyjazdem. (propozycja)"], ["Płatność", "Karta, przelew, w Azji także lokalne płatności. (propozycja)"], ["Anulowanie", "Bez kosztów do 30 dni przed przyjazdem; zmiana terminu bezpłatna raz. (propozycja)"], ["W cenie", "Program, codzienny rytm (ruch, oddech, natura, rytuał snu), masaże i sauna wg programu, śniadania. (propozycja na bazie standardu otwarcia)"]],
    contactIntro: "Napisz, a odpowiemy po imieniu. Pobyt indywidualny, dla par, retreat, wydarzenie zamknięte lub pobyt długoterminowy.", topic: "Temat", topics: ["Pobyt", "Para · RECONNECT", "Retreat / wydarzenie zamknięte", "Współpraca", "Inne"], message: "Wiadomość", msgPh: "Czego potrzebujesz?", sendMsg: "Wyślij wiadomość", contactNote: "(propozycja) Docelowy adres: kontakt@holisphere… do decyzji. Teraz formularz pokazuje treść do skopiowania.",
    reviewsIntro: "Opinie gości i komentarze. Obiekt na Bali otwiera się na przełomie października i listopada 2026, więc pierwsze opinie pojawią się po pilotażowym pobycie testowym.", rating: "Ocena", comment: "Komentarz", name: "Imię", addComment: "Dodaj komentarz", reviewsNote: "(propozycja) W demo komentarze zapisują się tylko w tej przeglądarce.", noComments: "Jeszcze nie ma komentarzy.",
    faq: [["Dojazd", "Bali: 15 min od Ubud, ostatni odcinek wąski, lekkie pojazdy elektryczne z drogi głównej. Koh Rong: łódź z Sihanoukville. (Koh Rong: propozycja)"], ["Urządzenia i dane", "Pomiary tylko dobrowolne, jako trendy. Pobyt bez urządzeń i bez udostępniania danych zawsze możliwy."], ["Dieta i alergie", "Pytamy w formularzu przed przyjazdem; kuchnia świeża, lokalna, bez ideologii."], ["Prywatność", "Zgoda przed dotykiem, pomiarem i danymi. Poufność jest częścią produktu. Zasady dot. dronów i zdjęć."], ["Czy to leczenie?", "Nie. Nie diagnozujemy i nie zastępujemy terapii. Metody bursztynowe tylko po kwalifikacji ze specjalistą."], ["Dzieci", "Do ustalenia. (brak w dokumentach)"]],
    investorsText: "Bali (2 000 m², 13 kopuł) w budowie, otwarcie X/XI 2026; etap 2 z laguną i domkami na wodzie. Koh Rong: 3 040 m² z 75 m plaży; etap 1 od XII 2026 (kopuły, 0,5–0,6 mln USD), etap 2 hotel 24–30 pokoi (od ~3 mln USD), etap 3 wille (5–6 mln USD+). Pojezierze Drawskie: wiosna 2027. Kostaryka: koncepcja.", investorsNote: "Materiały dla inwestorów udostępniamy indywidualnie (dossier, pipeline). Bez obietnic „gwarantowanego zwrotu”.",
    language: "Język", currency: "Waluta", defaultView: "Domyślny widok", viewSplit: "Podzielony ekran (strona + świat)", viewFull: "Zwykła strona na cały ekran", motion: "Ruch i efekty", motionOn: "Pełne efekty", motionOff: "Mniej ruchu", save: "Zapisz", saved: "Zapisano. Domyślny widok: ", programsGrid: [["RETURN", "3 noce", "Wyciszenie, sen, masaż, natura, przestrzeń mentalna."], ["RECONNECT", "4 noce · pary", "Prywatność, dotyk, rozmowa, bliskość, rytuały dla dwojga."], ["REVITALISE", "5–7 nocy", "Ruch, regeneracja, odżywianie, sen, rytm biologiczny."], ["STAY YOUR WAY", "dowolnie", "Pełen komfort bez obowiązku uczestnictwa."]],
    ledgerCols: ["#", "Data", "Kategoria", "Pokój / miejsce", "Przyjazd", "Wyjazd", "Goście", "Kto", "Język"], requestFor: "ZAPYTANIE", dates: "Daty", tbd: "do ustalenia",
  },
},
};

// ===================== STATE =====================
const settings = Object.assign({ mode: innerWidth > 900 ? "split" : "full", lang: "en", currency: "EUR", motion: "on" }, JSON.parse(localStorage.getItem("holi-settings") || "{}"));
const saveSettings = () => localStorage.setItem("holi-settings", JSON.stringify(settings));
let L = TXT[settings.lang] || TXT.en;
const ORDER = ["booking","programs","suites","prices","contact","locations","spa","kitchen","nature","stay","reviews","philosophy","spheres","faq","investors","settings"];
const STATION_OF = { programs: "dome-day", suites: "interior-4a", locations: "bali", spa: "restaurant", kitchen: "pool", nature: "beach", stay: "lobby", philosophy: "hotel", spheres: "aerial" };
const PAGE_ONLY = new Set(["booking","prices","contact","reviews","faq","investors","settings"]);
const sec = k => L.sections[k];
const st = k => L.stations[k] || {};

// ===================== STATIONS (pictures; hotspots always carry section names) =====================
const S = (key, u, v, extra = {}) => Object.assign({ name: sec(key).name, tip: sec(key).tip, u, v, to: STATION_OF[key], action: PAGE_ONLY.has(key) ? "page" : undefined, section: key }, extra);
const card = (skey, stKey, extra = {}) => Object.assign({ title: (st(stKey).title || sec(skey).title), text: (st(stKey).text || sec(skey).text), section: skey, station: stKey }, extra);
const link = (stKey, to, action) => st(stKey).link ? { label: st(stKey).link, to, action } : undefined;
function buildStations() {
  const Sx = (stKey, prop, base, extra = {}) => Object.assign({}, base, { name: st(stKey)[prop + "Name"] || base.name, tip: st(stKey)[prop + "Tip"] || base.tip }, extra);
  return {
    hotel: { img: A + "kr-approach-last.jpg", arc: 80, label: st("hotel").label, section: "philosophy", card: card("philosophy", "hotel"),
      spots: [ S("spheres", 0.5, 0.3), S("nature", 0.42, 0.78), S("programs", 0.9, 0.4) ] },
    beach: { img: A + "kr-beach.jpg", arc: 80, label: st("beach").label, section: "nature", card: card("nature", "beach"),
      spots: [ S("philosophy", 0.5, 0.35), S("spheres", 0.85, 0.3) ] },
    aerial: { img: A + "kr-aerial.jpg", arc: 72, label: st("aerial").label, section: "spheres", card: card("locations", "aerial"),
      spots: [ S("programs", 0.62, 0.35), S("suites", 0.73, 0.62, { to: "dome-night" }), S("spa", 0.32, 0.23), S("nature", 0.33, 0.69, { to: "pool" }), S("stay", 0.23, 0.5, { cls: "final" }), S("locations", 0.9, 0.5) ] },
    "dome-day": { panels: [ { img: A + "kr-dome-day.jpg", yaw: 0, arc: 121 }, { img: A + "bali-pool-day.jpg", yaw: 120, arc: 121 }, { img: A + "bali-restaurant-day.jpg", yaw: 240, arc: 121 } ], label: st("dome-day").label, section: "programs", card: card("programs", "dome-day", { link: link("dome-day", "interior-4a") }),
      spots: [ S("suites", 0.53, 0.6, { cls: "final" }), S("spheres", 0.08, 0.86), Sx("dome-day", "night", S("suites", 0.93, 0.32, { to: "dome-night" })), S("nature", 0.6, 0.72, { panel: 1, to: "pool" }), S("spa", 0.45, 0.6, { panel: 2 }) ] },
    "dome-night": { img: A + "kr-dome-night.jpg", arc: 84, label: st("dome-night").label, section: "suites", card: card("suites", "dome-night", { link: link("dome-night", "interior-7d") }),
      spots: [ Sx("dome-night", "enter", S("suites", 0.5, 0.6, { to: "interior-7d", cls: "final" })), Sx("dome-night", "day", S("programs", 0.93, 0.32, { to: "dome-day" })), S("spheres", 0.08, 0.86) ] },
    "interior-4a": { panels: [ { img: A + "bali-int-4a.jpg", yaw: 0, arc: 91 }, { img: A + "bali-int-4a-v2.jpg", yaw: 90, arc: 91 }, { img: A + "bali-int-4a-v3.jpg", yaw: 180, arc: 91 }, { img: A + "bali-int-4a-v4.jpg", yaw: 270, arc: 91 } ], label: st("interior-4a").label, section: "suites", room: "RETURN", card: card("suites", "interior-4a"),
      spots: [ Sx("interior-4a", "other", S("suites", 0.28, 0.45, { to: "interior-7d" })), Sx("interior-4a", "exit", S("programs", 0.5, 0.84)), S("booking", 0.8, 0.5, { cls: "final" }) ] },
    "interior-7d": { panels: [ { img: A + "bali-int-7d.jpg", yaw: 0, arc: 121 }, { img: A + "bali-int-7d-v2.jpg", yaw: 120, arc: 121 }, { img: A + "bali-int-7d-v3.jpg", yaw: 240, arc: 121 } ], label: st("interior-7d").label, section: "suites", room: "RECONNECT", card: card("programs", "interior-7d"),
      spots: [ Sx("interior-7d", "exit", S("suites", 0.5, 0.84, { to: "dome-night" })), S("booking", 0.75, 0.45, { cls: "final" }) ] },
    pool: { img: A + "bali-pool-day.jpg", arc: 88, label: st("pool").label, section: "kitchen", card: card("kitchen", "pool"),
      spots: [ S("programs", 0.3, 0.55), S("spheres", 0.5, 0.84) ] },
    restaurant: { img: A + "bali-restaurant-day.jpg", arc: 88, label: st("restaurant").label, section: "spa", card: card("spa", "restaurant"),
      spots: [ Sx("restaurant", "enter", S("spa", 0.42, 0.58, { to: "interior-16m" })), S("spheres", 0.5, 0.84) ] },
    "interior-16m": { panels: [ { img: A + "bali-int-16m.jpg", yaw: 0, arc: 121 }, { img: A + "bali-int-16m-v2.jpg", yaw: 120, arc: 121 }, { img: A + "bali-int-16m-v3.jpg", yaw: 240, arc: 121 } ], label: st("interior-16m").label, section: "spa", room: "SPA", card: card("spa", "interior-16m"),
      spots: [ Sx("interior-16m", "exit", S("spa", 0.5, 0.84, { to: "restaurant" })), S("booking", 0.75, 0.45, { cls: "final" }), Sx("interior-16m", "gym", S("spa", 0.5, 0.5, { panel: 2, to: "gym" })) ] },
    gym: { panels: [ { img: A + "bali-int-gym-v2.jpg", yaw: 0, arc: 181 }, { img: A + "bali-int-gym-v3.jpg", yaw: 180, arc: 181 } ], label: st("gym").label, section: "spa", card: card("spa", "gym"),
      spots: [ Sx("gym", "back", S("spa", 0.5, 0.86, { to: "interior-16m" })), S("booking", 0.8, 0.4, { cls: "final", panel: 1 }) ] },
    lobby: { img: A + "bali-lobby-day.jpg", arc: 88, label: st("lobby").label, section: "stay", card: card("stay", "lobby", { link: link("lobby", null, "page") }),
      spots: [ Sx("lobby", "page", S("booking", 0.62, 0.5, { cls: "final" })), S("spheres", 0.1, 0.9) ] },
    bali: { img: A + "bali-birdeye.jpg", arc: 88, label: st("bali").label, section: "locations", card: card("locations", "bali"),
      spots: [ S("suites", 0.6, 0.52, { to: "bali-dome" }), S("nature", 0.5, 0.4, { to: "pool" }), S("programs", 0.22, 0.32, { to: "dome-night" }), Sx("bali", "kr", S("philosophy", 0.9, 0.85)) ] },
    "bali-dome": { img: A + "bali-dome-day.jpg", arc: 88, label: st("bali-dome").label, section: "suites", room: "RETURN · Bali", card: card("suites", "bali-dome", { link: link("bali-dome", "interior-4a") }),
      spots: [ Sx("bali-dome", "enter", S("suites", 0.56, 0.5, { cls: "final" })), Sx("bali-dome", "top", S("locations", 0.1, 0.9, { to: "bali" })) ] },
  };
}
let stations = buildStations();

// ===================== UI =====================
const $ = id => document.getElementById(id);
const ui = { deg: $("deg"), loader: $("loader"), card: $("card"), site: $("site"), spotsLayer: $("spots"), fade: $("fade"), title: $("title") };
const menu = $("menu"), menuBtn = $("menu-toggle"); let items = {};
function openMenu() { menu.classList.add("open"); menuBtn.classList.add("on"); } function closeMenu() { menu.classList.remove("open"); menuBtn.classList.remove("on"); }
function openSection(key) { const d = sec(key); if (PAGE_ONLY.has(key)) return openPage(key, settings.mode); if (tour.state.key !== STATION_OF[key]) tour.go({ to: STATION_OF[key], _virtual: true }); }
function openPage(anchor, mode) {
  document.body.classList.remove("site-full", "site-split");
  document.body.classList.add(mode === "split" && innerWidth > 900 ? "site-split" : "site-full");
  ui.site.classList.add("show"); tour.setViewport(document.body.classList.contains("site-split") ? 0.5 : 1); closeMenu();
  if (anchor) setTimeout(() => { const el = $("sec-" + anchor); el && el.scrollIntoView({ behavior: "smooth", block: "start" }); }, 60);
}
function closePage() { ui.site.classList.remove("show"); document.body.classList.remove("site-full", "site-split"); tour.setViewport(1); }
const GROUP_KEYS = ["stay", "place", "about", "help"];
function buildDropdowns(host) {
  host.innerHTML = "";
  GROUP_KEYS.forEach(g => { const keys = ORDER.filter(k => sec(k).group === g); const dd = document.createElement("div"); dd.className = "dd";
    dd.innerHTML = `<button type="button">${L.ui.groups[g]} ▾</button><ul>${keys.map(k => `<li><button type="button" data-k="${k}" title="${sec(k).tip.replace(/"/g, "&quot;")}"><span>${sec(k).name}</span><small>${PAGE_ONLY.has(k) ? L.ui.pageTag : L.ui.both}</small></button></li>`).join("")}</ul>`;
    dd.querySelector(":scope > button").onclick = () => { const open = !dd.classList.contains("open"); host.querySelectorAll(".dd").forEach(x => x.classList.remove("open")); dd.classList.toggle("open", open); dd.classList.remove("closed"); };
    dd.querySelectorAll("li button").forEach(b => b.onclick = () => { const k = b.dataset.k; dd.classList.add("closed"); dd.classList.remove("open"); host.id === "dds-site" ? openPage(k, document.body.classList.contains("site-split") ? "split" : "full") : openSection(k); });
    dd.addEventListener("mouseleave", () => dd.classList.remove("closed"));
    host.appendChild(dd); });
}
function buildMenu() {
  menu.innerHTML = `<p class="menu-head"><span><img src="assets/logo-ring-gold.svg" alt="">${L.ui.menuHead}</span><button id="menu-close" type="button">${L.ui.collapse}</button></p>`; items = {};
  ORDER.forEach(key => { const d = sec(key); const b = document.createElement("button"); b.type = "button"; b.className = "menu-item"; items[key] = b;
    b.innerHTML = `<b>${d.name}</b><small>${PAGE_ONLY.has(key) ? L.ui.pageTag : L.ui.imgTag}</small><em class="tip">${d.tip}</em>`; b.onclick = () => { closeMenu(); openSection(key); }; menu.appendChild(b); });
  $("menu-close").onclick = closeMenu;
  if (tour && tour.state.def) items[tour.state.def.section] && items[tour.state.def.section].classList.add("on");
}
function applyUiTexts() {
  menuBtn.textContent = L.ui.menu; $("m-page").textContent = L.ui.page; $("m-split").textContent = L.ui.split; $("s-world").textContent = L.ui.world; $("s-split").textContent = L.ui.split;
  $("hint").textContent = L.ui.hint; $("s-book").textContent = L.ui.bookStay; $("s-book").onclick = e => { e.preventDefault(); const el = $("sec-booking"); el && el.scrollIntoView({ behavior: "smooth" }); }; $("skip").textContent = L.ui.skip; $("intro-k").textContent = L.ui.introK; $("intro-h").innerHTML = L.ui.introH; $("intro-s").textContent = L.ui.introS;
  $("spin").textContent = L.ui.spin; $("deg-label").textContent = L.ui.lookAround; $("info-book").textContent = L.ui.book; $("footer-note").textContent = L.ui.footer; document.documentElement.lang = settings.lang;
  document.querySelectorAll(".lang-btn").forEach(b => b.textContent = L.ui.lang); $("onb-replay").title = L.onb.replay; if (onb.active) onbPlace();
}

// ===================== TOUR =====================
let firstArrival = true;
const tour = createTour({ stations, first: "hotel", ui, onPage: s => openPage(s.section, settings.mode), onArrive(def, key) {
  Object.entries(items).forEach(([k, b]) => b.classList.toggle("on", k === def.section));
  if (firstArrival && localStorage.getItem("holi-onb-done")) openMenu(); else if (!onb.active) closeMenu(); firstArrival = false;
  if (onb.active) onbPlace(); updateMiniMap(key);
  decorateCard(def);
} });
const _go = tour.go; tour.go = (s) => { if (s.action === "page") return openPage(s.section, settings.mode); return _go(s); };

// card: "ordinary page" link + in-room reception (booking) for rooms
function decorateCard(def) {
  ui.card.classList.remove("pin", "peek"); $("info-toggle").classList.remove("on");
  $("info-book").textContent = L.ui.book; $("info-book").style.display = (def.room || def.section === "programs" || def.section === "suites") ? "" : "none";
  const a = ui.card.querySelector("a");
  if (a.style.display === "none" && def.section) { a.textContent = L.ui.pageSee; a.onclick = e => { e.preventDefault(); openPage(def.section, settings.mode); }; a.style.display = "inline"; }
  let box = ui.card.querySelector(".reception"); if (box) box.remove();
  if (!def.room && def.section !== "programs" && def.section !== "suites") return;
  box = document.createElement("div"); box.className = "reception";
  const roomName = def.room || def.label;
  box.innerHTML = `<button type="button" class="book-btn" hidden>${L.ui.book}</button>
    <form class="book-form" hidden><b>${L.ui.bookTitle}</b><span class="room">${roomName}</span>
      <label>${L.ui.arrive}<input type="date" name="in" required></label><label>${L.ui.depart}<input type="date" name="out" required></label>
      <label>${L.ui.guests}<select name="guests"><option>1</option><option selected>2</option><option>3</option><option>4</option></select></label>
      <label>${L.ui.who}<input name="who" required placeholder="Anna · anna@…"></label><button type="submit">${L.ui.send}</button><div class="book-out" hidden></div></form>`;
  ui.card.appendChild(box);
  const form = box.querySelector("form"), btn = box.querySelector(".book-btn");
  btn.onclick = () => { form.hidden = !form.hidden; };
  form.onsubmit = e => { e.preventDefault(); const f = new FormData(form);
    const rec = addBooking({ category: sec(def.section).name, room: roomName, station: tour.state.key, in: f.get("in"), out: f.get("out"), guests: f.get("guests"), who: f.get("who") });
    const o = form.querySelector(".book-out"); o.hidden = false; o.textContent = `${L.ui.sent} #${rec.id} ${L.ui.inCategory} „${rec.category}”. ${L.ui.copyHint}`; form.reset(); };
}
// ===================== BOOKING LEDGER (categories = section; optional Google Sheet endpoint) =====================
const ledger = JSON.parse(localStorage.getItem("holi-bookings") || "[]");
function addBooking(b) {
  const rec = Object.assign({ id: ledger.length + 1, date: new Date().toISOString().slice(0, 16).replace("T", " "), lang: settings.lang }, b);
  ledger.push(rec); localStorage.setItem("holi-bookings", JSON.stringify(ledger)); drawLedger();
  if (BOOKING_ENDPOINT) fetch(BOOKING_ENDPOINT, { method: "POST", mode: "no-cors", headers: { "Content-Type": "text/plain" }, body: JSON.stringify(rec) }).catch(() => {});
  return rec;
}
function drawLedger() {
  const box = $("ledger"); if (!box) return;
  const cols = L.page.ledgerCols;
  box.innerHTML = `<h3>${L.ui.ledger}</h3>` + (ledger.length ? `<div class="tbl"><table><thead><tr>${cols.map(c => `<th>${c}</th>`).join("")}</tr></thead><tbody>${ledger.map(r => `<tr><td>${r.id}</td><td>${r.date}</td><td>${r.category}</td><td>${r.room}</td><td>${r.in || "—"}</td><td>${r.out || "—"}</td><td>${r.guests}</td><td>${r.who}</td><td>${r.lang}</td></tr>`).join("")}</tbody></table></div><button type="button" class="btn small" id="csv">${L.ui.exportCsv}</button>` : `<p style="opacity:.6">${L.ui.noBookings}</p>`);
  const csv = $("csv"); if (csv) csv.onclick = () => { const rows = [cols.join(";")].concat(ledger.map(r => [r.id, r.date, r.category, r.room, r.in, r.out, r.guests, r.who, r.lang].map(v => `"${String(v ?? "").replace(/"/g, '""')}"`).join(";"))); const a = document.createElement("a"); a.href = "data:text/csv;charset=utf-8,﻿" + encodeURIComponent(rows.join("\n")); a.download = "holisphere-bookings.csv"; a.click(); };
}

// ===================== ORDINARY PAGE =====================
function buildPage() {
  const P = L.page, U = L.ui, body = $("site-body"), SM = "assets/holi-sm/";
  const img = (f, alt = "") => `<img src="${SM}${f}" alt="${alt}" loading="lazy" decoding="async">`;
  const worldBtn = (k, label) => STATION_OF[k] ? `<button class="world-link" data-w="${k}">${label || U.worldSee}</button>` : "";
  const head = (kicker, title, sub) => `<div class="s-head"><p class="k">${kicker}</p><h2>${title}</h2>${sub ? `<p class="sub">${sub}</p>` : ""}</div>`;
  const cardsRow = items => `<div class="cards">${items.map(c => `<article class="cardx"><figure>${img(c.img, c.title)}</figure><div><h3>${c.title}</h3>${c.small ? `<small>${c.small}</small>` : ""}<p>${c.text}</p>${c.k ? `<button class="world-link inline" data-w="${c.k}" data-st="${c.st || ""}">${U.explore} →</button>` : ""}</div></article>`).join("")}</div>`;
  const grid = rows => `<div class="grid">${rows.map(r => `<article><strong>${r[0]}</strong>${r.length > 2 ? `<small>${r[1]}</small><p>${r[2]}</p>` : `<p>${r[1]}</p>`}</article>`).join("")}</div>`;
  const BG = { booking: "bali-lobby-day.jpg", programs: "bali-int-4a.jpg", suites: "kr-dome-day.jpg", prices: "bali-pool-day.jpg", contact: "kr-beach.jpg", locations: "bali-birdeye.jpg", spa: "bali-int-16m.jpg", kitchen: "bali-restaurant-day.jpg", nature: "kr-beach.jpg", stay: "bali-lobby-day.jpg", reviews: "bali-dome-day.jpg", spheres: "kr-aerial.jpg", faq: "bali-int-gym-v2.jpg", investors: "kr-approach-last.jpg", settings: "bali-int-4a-v2.jpg" };
  const sec_ = (k, cls, inner) => `<section class="sec ${cls}" id="sec-${k}" style="background-image:url('assets/holi/${BG[k] || "kr-aerial.jpg"}')"><div class="wash"></div><div class="glass">${inner}</div></section>`;
  const S = k => sec(k);
  const parts = [];
  // HERO (philosophy): full-bleed video, one line, one button
  parts.push(`<section class="hero" id="sec-philosophy"><video src="assets/holi/kr-approach.mp4" poster="assets/holi/kr-approach-last.jpg" muted loop playsinline autoplay preload="metadata"></video><div class="hero-in"><p class="k">${U.heroK}</p><h1>${U.heroH}</h1><p class="sub">${U.heroS}</p><div class="hero-cta"><a href="#sec-booking" class="btn gold" data-scroll="booking">${U.bookStay}</a><button class="btn ghost world-link" data-w="philosophy">${U.exploreWorld} →</button></div></div><div class="hero-bar">${U.openingBali}</div></section>`);
  parts.push(`<section class="sec intro" style="background-image:url('assets/holi/kr-dome-night.jpg')"><div class="wash"></div><div class="glass center"><p class="k">${U.introK}</p><p class="lead">${S("philosophy").text}</p>${worldBtn("philosophy", U.worldSee)}</div></section>`);
  ORDER.filter(k => k !== "philosophy").forEach(k => {
    switch (k) {
      case "booking": parts.push(sec_(k, "s-booking", head(U.bookStay, S(k).name, P.bookingIntro) + `<div class="book-wrap"><div class="cal"><div class="cal-head"><button id="cal-prev" type="button">‹</button><b id="cal-title"></b><button id="cal-next" type="button">›</button></div><div class="cal-grid" id="cal-grid"></div><div class="cal-sum" id="cal-sum">${P.calHint}</div></div>
        <form class="f" id="f-book"><label>${P.program}</label><select name="program">${P.programs.map(x => `<option>${x}</option>`).join("")}</select><label>${P.location}</label><select name="loc">${P.locations.map(x => `<option>${x}</option>`).join("")}</select><label>${U.guests}</label><select name="guests"><option>1</option><option selected>2</option><option>3</option><option>4</option></select><label>${U.who}</label><input name="who" placeholder="Anna · anna@…" required><button type="submit" class="btn gold">${U.send}</button><div class="out" id="out-book"></div></form></div><div class="note">${P.bookingNote}</div><div id="ledger" class="ledger"></div>`)); break;
      case "programs": parts.push(sec_(k, "", head(U.progK, S(k).name, S(k).text) + cardsRow([
        { img: "bali-int-4a.jpg", title: "RETURN", small: P.programsGrid[0][1], text: P.programsGrid[0][2], k: "programs" },
        { img: "bali-int-7d.jpg", title: "RECONNECT", small: P.programsGrid[1][1], text: P.programsGrid[1][2], k: "suites" },
        { img: "bali-pool-day.jpg", title: "REVITALISE", small: P.programsGrid[2][1], text: P.programsGrid[2][2], k: "spa" },
        { img: "bali-lobby-day.jpg", title: "STAY YOUR WAY", small: P.programsGrid[3][1], text: P.programsGrid[3][2], k: "stay" }]))); break;
      case "suites": parts.push(sec_(k, "", head(U.accK, S(k).name, S(k).text) + cardsRow([
        { img: "bali-int-4a.jpg", title: st("interior-4a").label, text: S("suites").tip, k: "suites" },
        { img: "bali-int-7d.jpg", title: st("interior-7d").label, text: st("interior-7d").text.split(". ")[0] + ".", k: "suites", st: "interior-7d" },
        { img: "kr-dome-night.jpg", title: st("dome-night").label, text: st("dome-night").text.split(". ")[0] + ".", k: "suites", st: "dome-night" }]))); break;
      case "spa": parts.push(sec_(k, "split-sec", `<figure class="big">${img("bali-int-16m.jpg")}</figure><div class="split-txt">${head(U.wellK, S(k).name)}<p>${S(k).text}</p>${worldBtn(k)}</div>`)); break;
      case "kitchen": parts.push(sec_(k, "split-sec rev", `<figure class="big">${img("bali-restaurant-day.jpg")}</figure><div class="split-txt">${head(U.dineK, S(k).name)}<p>${S(k).text}</p>${worldBtn(k)}</div>`)); break;
      case "nature": parts.push(sec_(k, "", head(U.natK, S(k).name, S(k).text) + `<div class="strip">${img("kr-beach.jpg")}${img("bali-pool-day.jpg")}${img("bali-birdeye.jpg")}</div>${worldBtn(k)}`)); break;
      case "locations": parts.push(sec_(k, "", head(U.locK, S(k).name) + cardsRow([
        { img: "bali-birdeye.jpg", title: "Bali · Tegalalang", small: "2026", text: st("bali").text.split(". ").slice(0, 2).join(". ") + ".", k: "locations" },
        { img: "kr-aerial.jpg", title: "Koh Rong · Cambodia", small: "2026–2029", text: st("aerial").text.split(". ").slice(0, 2).join(". ") + ".", k: "spheres" },
        { img: "kr-approach-last.jpg", title: "Koh Rong · stage 2", small: "2028+", text: st("hotel").text.split(". ")[0] + ".", k: "philosophy" }]) + `<p class="muted">${S(k).text.split(". ").slice(-2).join(". ")}</p>`)); break;
      case "stay": parts.push(sec_(k, "", head(U.jourK, S(k).name) + `<div class="steps">${U.steps.map((x, i) => `<article><span>0${i + 1}</span><h3>${x[0]}</h3><p>${x[1]}</p></article>`).join("")}</div>${worldBtn(k)}`)); break;
      case "spheres": parts.push(sec_(k, "", head(U.introK, S(k).name) + `<p class="lead small">${S(k).text}</p>${worldBtn(k)}`)); break;
      case "prices": parts.push(sec_(k, "", head("", S(k).name, P.pricesIntro) + grid(P.prices))); break;
      case "contact": parts.push(sec_(k, "", head(U.colContact, S(k).name, P.contactIntro) + `<form class="f" id="f-msg"><label>${P.topic}</label><select name="topic">${P.topics.map(x => `<option>${x}</option>`).join("")}</select><label>${P.message}</label><textarea name="msg" rows="4" required placeholder="${P.msgPh}"></textarea><label>${U.who}</label><input name="who" required placeholder="Anna · anna@…"><button type="submit" class="btn gold">${P.sendMsg}</button></form><div class="out" id="out-msg"></div><div class="note">${P.contactNote}</div>`)); break;
      case "reviews": parts.push(sec_(k, "", head("", S(k).name, P.reviewsIntro) + `<div class="comments" id="comments"></div><form class="f" id="f-com"><label>${P.rating}</label><select name="stars"><option>5</option><option>4</option><option>3</option></select><label>${P.comment}</label><textarea name="text" rows="3" required></textarea><label>${P.name}</label><input name="who" required><button type="submit" class="btn gold">${P.addComment}</button></form><div class="note">${P.reviewsNote}</div>`)); break;
      case "faq": parts.push(sec_(k, "", head("", S(k).name) + grid(P.faq))); break;
      case "investors": parts.push(sec_(k, "", head("", S(k).name) + `<p>${P.investorsText}</p><div class="note">${P.investorsNote}</div>`)); break;
      case "settings": parts.push(sec_(k, "", head("", S(k).name) + `<form class="f" id="f-set"><label>${P.language}</label><select name="lang"><option value="en">English</option><option value="pl">Polski</option></select><label>${P.currency}</label><select name="currency"><option>EUR</option><option>USD</option><option>PLN</option></select><label>${P.defaultView}</label><select name="mode"><option value="split">${P.viewSplit}</option><option value="full">${P.viewFull}</option></select><label>${P.motion}</label><select name="motion"><option value="on">${P.motionOn}</option><option value="off">${P.motionOff}</option></select><button type="submit" class="btn">${P.save}</button></form><div class="out" id="out-set"></div>`)); break;
    }
  });
  parts.push(`<div class="foot"><div><span class="brand"><img src="assets/logo-ring-green.svg" alt=""><b>HOLISPHERE</b></span><p class="muted">${U.heroS}</p></div><div><h4>${U.colExplore}</h4>${["suites","programs","spa","kitchen","locations","investors"].map(k => `<a href="#sec-${k}" data-scroll="${k}">${S(k).name}</a>`).join("")}</div><div><h4>${U.colContact}</h4><a href="#sec-contact" data-scroll="contact">${S("contact").name}</a><a href="#sec-booking" data-scroll="booking">${S("booking").name}</a><a href="#sec-faq" data-scroll="faq">${S("faq").name}</a></div><div><h4>${U.news}</h4><form class="news" onsubmit="event.preventDefault(); this.querySelector('small').hidden=false"><input placeholder="${U.newsPh}"><button type="submit" class="btn small">${U.newsBtn}</button><small hidden>${U.newsNote}</small></form></div></div><p class="legal">${U.legal}</p>`);
  body.innerHTML = parts.join("");
  body.querySelectorAll("[data-scroll]").forEach(a => a.onclick = e => { e.preventDefault(); const el = $("sec-" + a.dataset.scroll); el && el.scrollIntoView({ behavior: "smooth", block: "start" }); });
  body.querySelectorAll(".world-link").forEach(b => b.onclick = () => { closePage(); if (b.dataset.st) tour.go({ to: b.dataset.st, _virtual: true }); else openSection(b.dataset.w); });
  // calendar
  let calM = new Date(); calM = new Date(calM.getFullYear(), calM.getMonth(), 1); let dIn = null, dOut = null;
  const loc = settings.lang === "pl" ? "pl-PL" : "en-GB", fmt = d => d.toLocaleDateString(loc, { day: "2-digit", month: "short", year: "numeric" });
  const DOW = settings.lang === "pl" ? ["Pn","Wt","Śr","Cz","Pt","So","Nd"] : ["Mo","Tu","We","Th","Fr","Sa","Su"];
  function drawCal() {
    const g = $("cal-grid"); $("cal-title").textContent = calM.toLocaleDateString(loc, { month: "long", year: "numeric" });
    const first = (calM.getDay() + 6) % 7, days = new Date(calM.getFullYear(), calM.getMonth() + 1, 0).getDate(), today = new Date(); today.setHours(0,0,0,0);
    g.innerHTML = DOW.map(x => `<span>${x}</span>`).join("") + "<i></i>".repeat(first);
    for (let d = 1; d <= days; d++) { const date = new Date(calM.getFullYear(), calM.getMonth(), d); const b = document.createElement("button"); b.type = "button"; b.textContent = d;
      if (date < today) b.className = "past"; else { if (dIn && dOut && date > dIn && date < dOut) b.className = "in"; if ((dIn && +date === +dIn) || (dOut && +date === +dOut)) b.className = "edge";
        b.onclick = () => { if (!dIn || (dIn && dOut)) { dIn = date; dOut = null; } else if (date > dIn) dOut = date; else { dIn = date; dOut = null; } drawCal(); }; }
      g.appendChild(b); }
    const nights = dIn && dOut ? Math.round((dOut - dIn) / 864e5) : 0;
    $("cal-sum").textContent = dIn && dOut ? `${L.ui.arrive} ${fmt(dIn)} · ${L.ui.depart} ${fmt(dOut)} · ${nights} ${settings.lang === "pl" ? "nocy" : "nights"}` : dIn ? `${L.ui.arrive} ${fmt(dIn)}.` : L.page.calHint;
  }
  $("cal-prev").onclick = () => { calM = new Date(calM.getFullYear(), calM.getMonth() - 1, 1); drawCal(); };
  $("cal-next").onclick = () => { calM = new Date(calM.getFullYear(), calM.getMonth() + 1, 1); drawCal(); };
  drawCal();
  $("f-book").onsubmit = e => { e.preventDefault(); const f = new FormData(e.target);
    const rec = addBooking({ category: sec("booking").name, room: `${f.get("program")} · ${f.get("loc")}`, station: "page", in: dIn ? dIn.toISOString().slice(0, 10) : "", out: dOut ? dOut.toISOString().slice(0, 10) : "", guests: f.get("guests"), who: f.get("who") });
    const o = $("out-book"); o.style.display = "block"; o.textContent = `${P.requestFor} #${rec.id}\n${P.dates}: ${dIn && dOut ? fmt(dIn) + " → " + fmt(dOut) : P.tbd}\n${P.program}: ${f.get("program")}\n${P.location}: ${f.get("loc")}\n${L.ui.guests}: ${f.get("guests")}\n${f.get("who")}\n\n${L.ui.copyHint}`; };
  $("f-msg").onsubmit = e => { e.preventDefault(); const f = new FormData(e.target); const o = $("out-msg"); o.style.display = "block"; o.textContent = `${f.get("topic")}\n${f.get("msg")}\n— ${f.get("who")}\n\n${L.ui.copyHint}`; };
  // comments
  const comBox = $("comments"); const coms = JSON.parse(localStorage.getItem("holi-comments") || "[]");
  const drawComs = () => { comBox.innerHTML = coms.length ? coms.map(c => `<article><b>${c.who} · <span class="stars">${"★".repeat(c.stars)}</span></b>${c.text}</article>`).join("") : `<p style='opacity:.6'>${P.noComments}</p>`; };
  drawComs();
  $("f-com").onsubmit = e => { e.preventDefault(); const f = new FormData(e.target); coms.unshift({ who: f.get("who"), stars: +f.get("stars"), text: f.get("text") }); localStorage.setItem("holi-comments", JSON.stringify(coms)); e.target.reset(); drawComs(); };
  // settings
  const fs = $("f-set"); Object.entries(settings).forEach(([k, v]) => { if (fs.elements[k]) fs.elements[k].value = v; });
  fs.onsubmit = e => { e.preventDefault(); const f = new FormData(fs); const oldLang = settings.lang; ["lang","currency","mode","motion"].forEach(k => settings[k] = f.get(k)); saveSettings();
    if (settings.lang !== oldLang) return setLanguage(settings.lang);
    const o = $("out-set"); o.style.display = "block"; o.textContent = P.saved + (settings.mode === "split" ? P.viewSplit : P.viewFull) + "."; };
  drawLedger();
}

// ===================== LANGUAGE =====================
function setLanguage(lang) {
  settings.lang = lang; saveSettings(); L = TXT[lang];
  stations = buildStations(); Object.keys(stations).forEach(k => { tour.stations[k] = stations[k]; });
  applyUiTexts(); buildDropdowns($("dds-world")); buildDropdowns($("dds-site")); buildMenu(); buildPage(); buildMiniMap();
  if (tour.state.key) tour.loadStation(tour.state.key);        // re-create hotspots and card in the new language
}
document.querySelectorAll(".lang-btn").forEach(b => b.onclick = () => setLanguage(settings.lang === "pl" ? "en" : "pl"));
tour.stations = stations;


// ===================== MINI-MAP (like in games): islands, places, "you are here" =====================
const MAP = { islands: [ { key: "kohrong", label: "Koh Rong", d: "M18,58 C14,34 40,22 66,26 C90,30 106,44 102,66 C98,88 70,100 46,94 C26,90 20,76 18,58 Z" }, { key: "bali", label: "Bali", d: "M126,72 C122,50 142,36 164,40 C184,44 196,58 192,78 C188,96 166,106 148,100 C132,96 128,86 126,72 Z" } ],
  pos: { hotel: [40, 80], beach: [26, 62], aerial: [58, 44], "dome-day": [76, 58], "dome-night": [88, 46], "interior-4a": [74, 74], "interior-7d": [90, 70], pool: [60, 88], restaurant: [46, 46], "interior-16m": [34, 40], gym: [30, 50], lobby: [56, 66], bali: [156, 58], "bali-dome": [172, 76] } };
function buildMiniMap() {
  const el = $("minimap"); if (!el) return;
  el.innerHTML = `<div class="mm-tools"><button type="button" data-z="in" title="+">+</button><button type="button" data-z="out" title="−">−</button><button type="button" data-z="reset" title="⟲">⟲</button><button type="button" data-z="big" title="⤢">⤢</button></div>
    <svg viewBox="0 0 210 120">${MAP.islands.map(i => `<path class="isl" d="${i.d}"/>`).join("")}${MAP.islands.map(i => `<text class="lbl" x="${i.key === "bali" ? 158 : 60}" y="112">${i.label}</text>`).join("")}
    ${Object.entries(MAP.pos).map(([k, [x, y]]) => `<g class="pt" data-k="${k}"><circle cx="${x}" cy="${y}" r="3.2"/><text x="${x}" y="${y - 5.5}">${(st(k).label || k)}</text></g>`).join("")}<circle id="mm-you" class="you" r="4.5"/><circle id="mm-you2" class="you2" r="9"/></svg><span id="mm-cap"></span>`;
  const svg = el.querySelector("svg"); const V = { x: 0, y: 0, w: 210, h: 120 };
  const apply = () => { svg.setAttribute("viewBox", `${V.x} ${V.y} ${V.w} ${V.h}`); el.classList.toggle("zoomed", V.w < 140); };
  const zoomAt = (f, px = 0.5, py = 0.5) => { const nw = Math.min(210, Math.max(40, V.w / f)), nh = nw * 120 / 210; V.x += (V.w - nw) * px; V.y += (V.h - nh) * py; V.w = nw; V.h = nh; clamp(); apply(); };
  const clamp = () => { V.x = Math.min(Math.max(V.x, -20), 230 - V.w); V.y = Math.min(Math.max(V.y, -20), 140 - V.h); };
  el.querySelectorAll(".mm-tools button").forEach(b => b.onclick = e => { e.stopPropagation(); const z = b.dataset.z; if (z === "in") zoomAt(1.5); else if (z === "out") zoomAt(1 / 1.5); else if (z === "reset") { V.x = 0; V.y = 0; V.w = 210; V.h = 120; apply(); } else el.classList.toggle("big"); });
  svg.addEventListener("wheel", e => { e.preventDefault(); const r = svg.getBoundingClientRect(); zoomAt(e.deltaY < 0 ? 1.25 : 0.8, (e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height); }, { passive: false });
  const ptrs = new Map(); let drag = null, pinch = null, moved = false;
  svg.addEventListener("pointerdown", e => { e.stopPropagation(); svg.setPointerCapture(e.pointerId); ptrs.set(e.pointerId, [e.clientX, e.clientY]); moved = false;
    if (ptrs.size === 1) drag = { x: e.clientX, y: e.clientY, vx: V.x, vy: V.y }; if (ptrs.size === 2) { const [a, b] = [...ptrs.values()]; pinch = { d: Math.hypot(a[0] - b[0], a[1] - b[1]), w: V.w }; drag = null; } });
  svg.addEventListener("pointermove", e => { if (!ptrs.has(e.pointerId)) return; ptrs.set(e.pointerId, [e.clientX, e.clientY]); const r = svg.getBoundingClientRect();
    if (ptrs.size === 2 && pinch) { const [a, b] = [...ptrs.values()]; const d = Math.hypot(a[0] - b[0], a[1] - b[1]); const nw = Math.min(210, Math.max(40, pinch.w * pinch.d / d)); const cx = (a[0] + b[0]) / 2 - r.left, cy = (a[1] + b[1]) / 2 - r.top; V.x += (V.w - nw) * cx / r.width; V.y += (V.h - nw * 120 / 210) * cy / r.height; V.w = nw; V.h = nw * 120 / 210; clamp(); apply(); moved = true; }
    else if (drag) { const dx = (e.clientX - drag.x) / r.width * V.w, dy = (e.clientY - drag.y) / r.height * V.h; if (Math.abs(e.clientX - drag.x) + Math.abs(e.clientY - drag.y) > 4) moved = true; V.x = drag.vx - dx; V.y = drag.vy - dy; clamp(); apply(); } });
  const up = e => { ptrs.delete(e.pointerId); if (ptrs.size < 2) pinch = null; if (ptrs.size === 0) drag = null; };
  svg.addEventListener("pointerup", up); svg.addEventListener("pointercancel", up);
  el.querySelectorAll(".pt").forEach(g => g.addEventListener("click", e => { e.stopPropagation(); if (moved || tour.state.busy) return; tour.go({ to: g.dataset.k, _virtual: true }); }));
  el.addEventListener("wheel", e => e.preventDefault(), { passive: false });
}
function updateMiniMap(key) { const p = MAP.pos[key]; if (!p) return; ["mm-you", "mm-you2"].forEach(id => { const c = $(id); c.setAttribute("cx", p[0]); c.setAttribute("cy", p[1]); }); document.querySelectorAll("#minimap .pt").forEach(g => g.classList.toggle("on", g.dataset.k === key)); $("mm-cap").textContent = st(key).label || ""; }

// ===================== ONBOARDING: a guided demo that performs each action for the visitor (no skip) =====================
const onb = { i: 0, el: $("onb"), active: false, target: null, busy: false };
const wait = ms => new Promise(r => setTimeout(r, ms));
const waitIdle = async (ms = 7000) => { const t0 = Date.now(); while (tour.state.busy && Date.now() - t0 < ms) await wait(100); await wait(250); };
function onbPlace() {
  const step = L.onb.steps[onb.i]; let t = onb.target || document.querySelector(step.t);
  if (t && step.t === ".spot" && t.style.display === "none") t = [...document.querySelectorAll(".spot")].find(e => e.style.display !== "none");
  const ring = onb.el.querySelector(".onb-ring"), card = onb.el.querySelector(".onb-card");
  const r = t ? t.getBoundingClientRect() : { left: innerWidth / 2 - 30, top: innerHeight / 2 - 20, width: 60, height: 40 };
  ring.style.left = (r.left - 10) + "px"; ring.style.top = (r.top - 10) + "px"; ring.style.width = (r.width + 20) + "px"; ring.style.height = (r.height + 20) + "px";
  card.querySelector("h3").textContent = step.h; card.querySelector("p").textContent = step.p;
  card.querySelector(".onb-dots").innerHTML = L.onb.steps.map((_, k) => `<i class="${k === onb.i ? "on" : ""}"></i>`).join("");
  card.querySelector(".onb-next").textContent = onb.i === L.onb.steps.length - 1 ? L.onb.done : L.onb.next;
  const below = r.top + r.height + 20, cw = Math.min(380, innerWidth - 36); let left = Math.min(Math.max(r.left + r.width / 2 - cw / 2, 18), innerWidth - cw - 18);
  card.style.width = cw + "px"; card.style.left = left + "px";
  if (below + 200 < innerHeight) { card.style.top = below + "px"; card.style.bottom = "auto"; } else { card.style.top = "auto"; card.style.bottom = (innerHeight - r.top + 20) + "px"; }
}
const DEMO = [
  async () => { openMenu(); await wait(500); },                                                    // 1: menu opens by itself
  async () => { closeMenu(); await wait(300);                                                        // 2: hover a dot, then fly into it
    const sp = tour.state.spots.find(x => x.el.style.display !== "none" && x.def.to && !x.def.action);
    if (!sp) return; onb.target = sp.el; onbPlace(); sp.el.classList.add("demo-hover"); await wait(1600); sp.el.classList.remove("demo-hover");
    onb.target = null; tour.go(sp.def); await waitIdle(); },
  async () => { openPage(tour.state.def && tour.state.def.section, "split"); await wait(700); },   // 3: split screen opens by itself
  async () => { closePage(); await wait(300); if (tour.state.key !== "interior-4a") { tour.go({ to: "interior-4a", _virtual: true }); await waitIdle(); }
    $("info-book").click(); await wait(400); },                                                      // 4: inside a suite, the reception opens
  async () => { ui.card.classList.remove("pin", "peek"); $("info-toggle").classList.remove("on"); $("minimap").classList.add("big"); await wait(500); },   // 5: map, enlarged for the demo
  async () => { $("minimap").classList.remove("big"); await wait(200); },   // 6: language
];
async function onbShow() { onb.busy = true; onb.el.querySelector(".onb-next").disabled = true; onbPlace(); try { await DEMO[onb.i](); } catch (e) { console.warn(e); } onbPlace(); onb.busy = false; onb.el.querySelector(".onb-next").disabled = false; }
function onbStart() { onb.i = 0; onb.active = true; onb.el.classList.add("show"); onbShow(); }
function onbEnd() { onb.active = false; onb.el.classList.remove("show"); localStorage.setItem("holi-onb-done", "1"); }
onb.el.querySelector(".onb-next").onclick = () => { if (onb.busy) return; if (onb.i >= L.onb.steps.length - 1) return onbEnd(); onb.i++; onbShow(); };
addEventListener("resize", () => onb.active && onbPlace());
// ===================== WIRING =====================
applyUiTexts(); buildDropdowns($("dds-world")); buildDropdowns($("dds-site")); buildMenu(); buildPage(); buildMiniMap();
menuBtn.onclick = () => menu.classList.contains("open") ? closeMenu() : openMenu();
addEventListener("keydown", e => { if (e.key === "Escape") closeMenu(); });
$("m-page").onclick = () => openPage(tour.state.def && tour.state.def.section, "full");
$("m-split").onclick = () => openPage(tour.state.def && tour.state.def.section, "split");
$("s-split").onclick = () => { document.body.classList.contains("site-split") ? openPage(null, "full") : openPage(null, "split"); };
$("s-world").onclick = closePage; $("sb-close").onclick = closePage; $("sb-full").onclick = () => openPage(null, "full");
$("spin").onclick = () => tour.spin360();
const infoBtn = $("info-toggle"), bookBtn = $("info-book");
infoBtn.onmouseenter = () => ui.card.classList.add("peek"); infoBtn.onmouseleave = () => ui.card.classList.remove("peek");
infoBtn.onclick = () => { const on = !ui.card.classList.contains("pin"); ui.card.classList.toggle("pin", on); if (!on) ui.card.classList.remove("peek"); infoBtn.classList.toggle("on", on); };
ui.card.onmouseenter = () => ui.card.classList.add("peek"); ui.card.onmouseleave = () => { if (!ui.card.classList.contains("pin")) ui.card.classList.remove("peek"); };
bookBtn.onclick = () => { const f = ui.card.querySelector(".book-form"); if (!f) return openPage("booking", settings.mode); ui.card.classList.add("pin"); infoBtn.classList.add("on"); f.hidden = false; };
// intro video → first station
const vid = $("intro-video"), box = $("video"); let started = false;
function endIntro() { if (started) return; started = true; box.classList.add("hide"); gsap.to(ui.fade, { opacity: 0, duration: 1.2 }); setTimeout(() => vid.pause(), 1200);
  if (!localStorage.getItem("holi-onb-done")) setTimeout(() => $("langpick").classList.add("show"), 900); }
$("langpick").querySelectorAll("button").forEach(b => b.onclick = () => { $("langpick").classList.remove("show"); if (settings.lang !== b.dataset.lang) setLanguage(b.dataset.lang); else saveSettings(); setTimeout(onbStart, 500); });
vid.addEventListener("ended", endIntro); vid.addEventListener("error", endIntro); $("skip").onclick = endIntro;
vid.play().catch(endIntro); setTimeout(() => { if (!started && (vid.paused || vid.readyState < 2)) endIntro(); }, 4000);
