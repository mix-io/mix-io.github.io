const STORY = (() => {
  const el = $('story'), body = $('storyBody'); let x0 = null, y0 = null, cur = null, origin = null, closing = false;
  const fmtD = t => t ? new Date(t).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toLowerCase() : '';
  const rgbOf = h => { const n = parseInt((h || '#888888').slice(1), 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; };
  let cineCb = null;
  const pcInfo = p => { const c = COLORS.find(c => c[0] === p.n); return { name: p.n, mix: rgbOf(p.m || p.h).map(v => v / 255), tgt: c ? displayColor(recipeA(c[1], c[2])) : rgbOf(p.h).map(v => v / 255), pct: p.p, date: p.d || Date.now() }; };
  const PCC = new Map();
  function buildPC(p) { const key = (() => { try { const P = countryProg()[(atlasOf(p.n) || [])[6]]; return P ? P.k + '/' : ''; } catch (e) { return ''; } })() + p.n + '|' + (p.m || p.h) + '|' + p.p + '|' + p.d; let pr = PCC.get(key); if (!pr) { pr = postcard(Object.assign(pcInfo(p), { inApp: true })); PCC.set(key, pr); if (PCC.size > 12) PCC.delete(PCC.keys().next().value); } return pr; }
  async function render(p) {
    cur = p; const cv = await buildPC(p);
    if (cur !== p) return false;
    body.className = 'sbody pcard'; body.style.background = ''; body.innerHTML = ''; body.appendChild(cv); return true;
  }
  const oPos = () => { const o = typeof origin === 'function' ? origin() : origin; return o || { x: innerWidth / 2, y: innerHeight / 2 }; };
  function grow(back, done) {
    const rc = body.getBoundingClientRect(), o = oPos(), dx = o.x - (rc.left + rc.width / 2), dy = o.y - (rc.top + rc.height / 2);
    const from = { transform: `translate(${dx}px,${dy}px) scale(.06)`, opacity: 0 }, to = { transform: 'none', opacity: 1 };
    const a = body.animate(back ? [to, from] : [from, to], { duration: back ? 380 : 500, easing: back ? 'cubic-bezier(.5,0,.75,0)' : 'cubic-bezier(.16,1,.3,1)', fill: 'both' });
    el.animate(back ? [{ opacity: 1 }, { opacity: 0 }] : [{ opacity: 0 }, { opacity: 1 }], { duration: back ? 380 : 320, easing: 'ease-out', fill: 'both' });
    a.onfinish = () => { a.cancel(); done && done(); };
  }
  async function show(p, o) { closing = false; el.style.pointerEvents = ''; origin = o || null; el.classList.remove('cin'); body.style.opacity = '0'; el.hidden = false; const ok = await render(p); if (!ok) return false; try { const rb = $('storyRemix'), b = Math.round(p.p || 0); rb.hidden = !(p && p.n && b >= 50 && !document.body.classList.contains('cine')); rb.textContent = b >= 95 ? `✦ mastered · ${b}%  ·  remix` : `remix · beat your ${b}%`; } catch (e) {} body.style.opacity = ''; grow(false); tick(); return true; }
  function open(i, o) { const p = save.palette[i]; if (p) show(p, o); }
  function openList(list, i, o) { const p = list[i]; if (p) show(p, o); }
  function cineOpen(n, fx, cb) { const p = save.palette.find(p => p.n === n) || fx; cineCb = null; const pr = show(p, null); el.classList.add('cin'); pr.then(() => { el.classList.add('cin'); if (body.querySelector('.stap')) return; const tp = document.createElement('div'); tp.className = 'stap'; tp.textContent = 'tap to continue'; body.appendChild(tp); }); setTimeout(() => { cineCb = cb; }, 900); }
  function close(now) { if (el.hidden || closing) return; closing = true; el.style.pointerEvents = 'none'; let done = false; const fin = () => { if (done) return; done = true; el.hidden = true; closing = false; el.style.pointerEvents = ''; body.getAnimations().forEach(a => a.cancel()); el.getAnimations().forEach(a => a.cancel()); }; if (now === true) return fin(); grow(true, fin); setTimeout(fin, 430); }
  $('storyX').addEventListener('click', e => { e.stopPropagation(); close(); });
  $('storyShare').addEventListener('click', e => { e.stopPropagation(); if (cur) sharePostcard(pcInfo(cur)); });
  $('storyRemix').addEventListener('click', e => { e.stopPropagation(); if (!cur) return; const n = cur.n; close(); setTimeout(() => { try { startReplay(n); } catch (x) {} }, 320); });
  el.addEventListener('pointerdown', e => { x0 = e.clientX; y0 = e.clientY; });
  el.addEventListener('pointerup', e => { if (el.classList.contains('cin')) { x0 = null; if (cineCb) { const f = cineCb; cineCb = null; close(); setTimeout(() => { el.classList.remove('cin'); f(); }, 400); } return; } if (x0 == null) return; const dx = e.clientX - x0, dy = e.clientY - y0; x0 = null; if (dy > 80 && Math.abs(dy) > Math.abs(dx)) close(); else if (Math.hypot(dx, dy) < 8 && !body.contains(e.target) && !e.target.closest('.sx')) close(); });
  return { open, openList, cine: cineOpen, close, prep(n) { const p = save.palette.find(p => p.n === n); if (p) buildPC(p); }, openName(n, o) { const p = save.palette.find(p => p.n === n); if (p) show(p, o); } };
})();
function cardPlace(r) { const pl = r[3], c = placeCountry(r), al = (CC_ALIAS[r[6]] || []).concat(c ? [c] : []), parts = pl.split(','); if (parts.length > 1) { const last = parts[parts.length - 1].trim(); if (al.includes(last)) return parts.slice(0, -1).join(',').trim() + ' · ' + c; } return placeText(r); }
/* mini globe (2D orthographic, reuses the atlas earth texture) */
let EARTH_PX = null, EARTH_W = 1024, EARTH_H = 512, earthWait = [];
function earthPixels(cb) { if (EARTH_PX) return cb(); earthWait.push(cb); if (earthWait.length > 1) return; const im = new Image(); im.onload = () => { const c = document.createElement('canvas'); c.width = EARTH_W; c.height = EARTH_H; const x = c.getContext('2d'); x.drawImage(im, 0, 0, EARTH_W, EARTH_H); try { EARTH_PX = x.getImageData(0, 0, EARTH_W, EARTH_H).data; } catch (e) { EARTH_PX = null; } const w = earthWait; earthWait = []; if (EARTH_PX) w.forEach(f => f()); }; im.src = EARTH_TEX; }
function miniGlobe(cv, lat, lng, hex) {
  const N = cv.width, R = N / 2 - 14, cx = N / 2, cy = N / 2, x = cv.getContext('2d');
  const paint = () => {
    const img = x.createImageData(N, N), d = img.data, la0 = lat * Math.PI / 180, lo0 = lng * Math.PI / 180, sl = Math.sin(la0), cl = Math.cos(la0);
    for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) { const px = (i - cx) / R, py = (cy - j) / R, rr = px * px + py * py; if (rr > 1) continue; const z = Math.sqrt(1 - rr), la = Math.asin(py * cl + z * sl), lo = lo0 + Math.atan2(px, z * cl - py * sl);
      let u = ((lo / (2 * Math.PI) + .5) % 1 + 1) % 1, v = .5 - la / Math.PI; const ti = (Math.min(EARTH_H - 1, Math.floor(v * EARTH_H)) * EARTH_W + Math.floor(u * EARTH_W)) * 4, sh = .38 + .62 * Math.pow(z, .6), o = (j * N + i) * 4, ed = Math.min(1, (1 - Math.sqrt(rr)) * R / 1.2);
      d[o] = EARTH_PX[ti] * sh; d[o + 1] = EARTH_PX[ti + 1] * sh; d[o + 2] = EARTH_PX[ti + 2] * sh; d[o + 3] = 255 * ed; }
    x.clearRect(0, 0, N, N); const g = x.createRadialGradient(cx, cy, R * .9, cx, cy, R + 13); g.addColorStop(0, 'rgba(110,170,255,0)'); g.addColorStop(.55, 'rgba(110,170,255,.32)'); g.addColorStop(1, 'rgba(110,170,255,0)'); x.fillStyle = g; x.fillRect(0, 0, N, N);
    const t = document.createElement('canvas'); t.width = t.height = N; t.getContext('2d').putImageData(img, 0, 0); x.drawImage(t, 0, 0);
    const hl = x.createRadialGradient(cx - R * .45, cy - R * .5, 0, cx - R * .45, cy - R * .5, R * 1.1); hl.addColorStop(0, 'rgba(255,255,255,.14)'); hl.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = hl; x.beginPath(); x.arc(cx, cy, R, 0, Math.PI * 2); x.fill();
    const pg = x.createRadialGradient(cx, cy, 0, cx, cy, 34); pg.addColorStop(0, hex + 'ee'); pg.addColorStop(.35, hex + '88'); pg.addColorStop(1, hex + '00'); x.fillStyle = pg; x.beginPath(); x.arc(cx, cy, 34, 0, Math.PI * 2); x.fill();
    x.beginPath(); x.arc(cx, cy, 7, 0, Math.PI * 2); x.fillStyle = hex; x.fill(); x.lineWidth = 2.5; x.strokeStyle = 'rgba(255,255,255,.9)'; x.stroke();
  };
  earthPixels(paint);
}
/* postcard share image */
let GRAIN = null;
function grainTile() { if (GRAIN) return GRAIN; const c = document.createElement('canvas'); c.width = c.height = 256; const k = c.getContext('2d'), id = k.createImageData(256, 256), d = id.data; for (let i = 0; i < d.length; i += 4) { const r = Math.random(); if (r < .22) { d[i] = 60; d[i + 1] = 48; d[i + 2] = 30; d[i + 3] = Math.random() * 18; } else if (r < .4) { d[i] = d[i + 1] = d[i + 2] = 255; d[i + 3] = Math.random() * 40; } } k.putImageData(id, 0, 0); return GRAIN = c; }
function loadImg(src) { return new Promise(r => { if (!src) return r(null); const i = new Image(); i.onload = () => r(i); i.onerror = () => r(null); i.src = src; }); }
function badgeSrc(r) { if (r && r[6] && r[6] !== 'aq' && FLAGS[r[6]]) return FLAGS[r[6]]; if (!r) return null; const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 18" width="240" height="180"><rect width="24" height="18" rx="2" fill="#1b1f25"/><g transform="translate(0,-3)" fill="none" stroke="#e6ebf0" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">${EMB[emblemKind(r)]}</g></svg>`; return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg); }
/* ===== postcard scenes: duotone illustrations of each place ===== */
const NAME_RULES = [
  ['volcano', /lava|volcan|ember|magma|basalt|obsidian|ash\b|sulfur|sulphur|crater/], ['aurora', /aurora|northern light|polar night|midnight sun/], ['sakura', /sakura|blossom|plum blossom/],
  ['lavender', /lavender|heather|lupin/], ['tulips', /tulip/], ['flamingo', /flamingo/], ['reef', /coral|reef|sea fan|anemone/], ['lanterns', /lantern/],
  ['ice', /glacier|\bice\b|iceberg|frost|snow|arctic/], ['palms', /lagoon|atoll|coconut|tropic/], ['dunes', /\bsand\b|dune|desert|camel|sahara/],
  ['waterfall', /waterfall|\bfalls\b|cascade/], ['tea', /\btea\b|matcha|chai|camellia/], ['savanna', /acacia|savanna|safari|lion|giraffe/], ['saltflat', /\bsalt\b|salar|mirror/],
];
const SCENE_RULES = [
  ['temple', /angkor|siem reap|borobudur|ayutthaya|tikal|copán|copan|hampi|khajuraho|sigiriya|abu simbel|jerash|byblos|chiang rai/],
  ['castle', /neuschwanstein|heidelberg|sintra|carcassonne|krumlov|salzburg|brașov|brasov|sighișoara|dubrovnik|kotor|edinburgh|valletta|gozo|mont saint-michel|loire|bergamo|toledo|kraków|krakow|bruges|ghent|trondheim|gotland|dresden/],
  ['palms', /lombok|siargao|el nido|moorea|yasawa|negril|eleuthera|san blas|bacalar|noronha|nosy be|la digue|le morne|langkawi|krabi|ishigaki|byron|fraser|rock islands|coromandel|bay of islands|menorca|zakynthos|bonito/],
  ['canyon', /arches|charyn|zhangye|fish river|karijini|ronda|verdon|bohol|rainbow mountain|danxia/],
  ['mountains', /torres del paine|whistler|jasper|glacier national|cortina|huangshan|altai|simien|roraima|ladakh|hunza|pokhara|innsbruck|picos|preikestolen|tatra|rila|bumthang|thimphu|baños|issyk|great ocean/],
  ['dunes', /huacachina|siwa|white desert|kolmanskop/],
  ['gondola', /giethoorn|colmar|annecy/],
  ['lighthouse', /skagen|étretat|etretat|acadia|outer banks|galle|ushuaia|cape coast|gorée|goree|tofino|essaouira|valparaíso|valparaiso/],
  ['lanterns', /pingyao|lijiang|macau|melaka/],
  ['onion', /harbin/],
  ['mosque', /kashan|tabriz|khiva|lahore|nizwa|al ain|mardin|djerba|sidi bou said|ait benhaddou|manama/],
  ['ice', /churchill|kiruna|anchorage|chamonix glacier/],
  ['volcano', /aeolian|stromboli|arenal|lake urmia|flores|kelimutu/],
  ['forest', /bwindi|manuel antonio|yakushima|meghalaya|phong nha|chiapas|ouro preto|nikko|black forest/],
  ['savanna', /amboseli|chobe|avenue of baobabs|kakadu/],
  ['pagoda', /busan|gyeongju|\bhue\b|miyajima|takayama|chengdu|kanazawa|shirakawa/],
  ['fields', /wachau|val d'orcia|alsace|dordogne|évora|evora|lake balaton|prince edward|salta|cape winelands|mekong|danube delta|kakheti/],
  ['treasury', /petra/], ['gondola', /venice|burano|murano|gondola/], ['balloons', /cappadocia|balloon/], ['monastery', /meteora|monaster/], ['saltflat', /uyuni|salar|salt flat|dead sea/],
  ['waterfall', /iguazu|victoria falls|niagara|angel falls|plitvice|skogafoss|gullfoss/], ['savanna', /serengeti|maasai|okavango|etosha|kruger|ngorongoro|savanna|masai/],
  ['aurora', /tromso|tromsø|lapland|yukon|abisko|rovaniemi|fairbanks/], ['lavender', /provence|valensole|hvar|furano/], ['tulips', /lisse|keukenhof/], ['lanterns', /hoi an/],
  ['reef', /great barrier|raja ampat|red sea|reef/], ['tea', /darjeeling|munnar|nuwara|cameron highlands|boseong|uji\b|sri lanka/], ['flamingo', /natron|camargue|nakuru|laguna colorada/],
  ['eiffel', /paris/], ['bigben', /london/], ['colosseum', /\brome\b/], ['pyramids', /giza|cairo|luxor|aswan/], ['taj', /\bagra\b|taj mahal/], ['fuji', /fuji|hakone|tokyo/],
  ['liberty', /new york/], ['bridge', /san francisco|golden gate/], ['opera', /sydney/], ['christ', /\brio\b|rio de janeiro/], ['santorini', /santorini|mykonos|milos|oia/],
  ['onion', /moscow|st petersburg|kyiv/], ['mosque', /istanbul|marrakech|isfahan|samarkand|\bfes\b|bukhara|dubai|abu dhabi|shiraz|yazd|tunis|kairouan|jerusalem|muscat/],
  ['pagoda', /kyoto|\bnara\b|bagan|chiang mai|hoi an|luang prabang|hangzhou|beijing|seoul|hanoi|bangkok|angkor|\buji\b|jeju|lhasa|kathmandu|\bparo\b/],
  ['windmill', /lisse|amsterdam|kinderdijk|netherlands|holland|la mancha/], ['lighthouse', /cornwall|nova scotia|maine|cape cod|brittany|newfoundland|lofoten|faroe/],
  ['palms', /maldives|bora bora|tahiti|fiji|bahamas|seychelles|palau|zanzibar|phuket|mauritius|hawaii|kauai|maui|tulum|key west|miami|\bbali\b|\bgoa\b|kerala|grenada|jamaica|belize|okinawa|palawan|raja ampat|komodo|caribbean|barbados|antigua|yucatan|cancun/],
  ['ice', /antarctica|greenland|svalbard|glacier|vatnajokull|iceland|reykjavik|arctic|tromso|lapland|yukon|kamchatka pale|alaska slate|pole/],
  ['volcano', /\betna\b|kilimanjaro|lanzarote|ijen|vesuvius|volcan|tenerife/], ['terraces', /banaue|sapa|guilin|longji|yunnan|boseong|cameron|darjeeling|munnar|sri lanka/],
  ['mountains', /alps|zermatt|chamonix|dolomites|everest|patagonia|banff|himalaya|rwenzori|pamir|kamchatka|queenstown|denali|yosemite|tatra|andes|cusco|machu|swiss|switzerland|tibet|kashmir|skye|highlands|drakensberg|atlas/],
  ['dunes', /sahara|desert|gobi|namib|sossusvlei|wadi rum|merzouga|atacama|rub al khali|wahiba|timbuktu|alula|death valley|danakil|uyuni|thar|rajasthan|jaisalmer/],
  ['canyon', /canyon|sedona|antelope|uluru|petra|cappadocia|roussillon|zhangjiajie|meteora|monument valley|bryce/],
  ['fields', /tuscany|provence|cotswolds|napa|douro|rioja|burgundy|bordeaux|champagne|barossa|mendoza|kazanlak|hokkaido|valensole|normandy|bavaria|puglia|alentejo|kentucky|vermont|lake district|connemara|transylvania|serengeti|maasai|savanna|okavango|etosha/],
  ['lake', /lake|baikal|como|bled|titicaca|tekapo|lucerne|hallstatt|plitvice|crater|great lakes|fjord|geiranger|inle|udaipur/],
  ['forest', /forest|redwood|daintree|amazon|congo|borneo|olympic|cocora|costa rica|jungle|madagascar|blue ridge|tasmania|yakushima|pantanal|iguazu/],
  ['ocean', /ocean|sea\b|reef|coast|atoll|nemo|trench|lagoon|bay|island|beach|cliff|algarve|amalfi|cinque terre|capri|hvar|ibiza|mallorca|corsica|sicily|crete|cyclades|big sur|biarritz|lofoten|great barrier|mediterranean|baltic/],
];
const CITY_RE = /city|tokyo|london|chicago|seattle|vancouver|singapore|hong kong|shanghai|seoul|mumbai|lagos|nairobi|berlin|madrid|lisbon|vienna|prague|budapest|copenhagen|stockholm|helsinki|oslo|toronto|montreal|bogota|lima|buenos aires|sao paulo|melbourne|auckland|cape town|johannesburg|doha|riyadh|tel aviv|athens|warsaw|dublin|edinburgh|glasgow|munich|hamburg|milan|barcelona|porto|zurich|geneva|brussels|kuala lumpur|jakarta|manila|taipei|osaka|delhi|kolkata|chennai|karachi|tehran|accra|addis|dakar|casablanca|havana|los angeles|las vegas|boston|atlanta|houston|denver|new orleans|savannah|austin|nashville|philadelphia|washington|riga|tallinn|vilnius|krakow|belgrade|bucharest|sofia|beirut|amman|baku|tbilisi|yerevan|almaty|tashkent|ulaanbaatar|kigali|kampala|lusaka|harare|abuja|kano|valencia|seville|granada|florence|venice|naples|lyon|marseille|nice|bordeaux|quebec|montevideo|santiago|quito|cartagena|panama|guatemala|san juan|kingston/;
function sceneKind(ad, name) { const nm = (name || '').toLowerCase(), t = ((ad ? ad[3] : '') + ' ' + nm).toLowerCase(); for (const [k, re] of NAME_RULES) if (re.test(nm)) return k; for (const [k, re] of SCENE_RULES) if (re.test(t)) return k; if (ad && Math.abs(ad[1]) > 62) return 'ice'; return CITY_RE.test(t) ? 'city' : 'village'; }
function drawScene(x, X, Y, W, H, mix, kind, seed) {
  const L = (c, k) => css(c.map(v => Math.min(1, v + (1 - v) * k))), D = (c, k) => css(c.map(v => v * (1 - k)));
  let sd = seed || 7; const rnd = () => (sd = (sd * 16807) % 2147483647) / 2147483647;
  const u = W / 100, v = H / 64; x.save(); x.translate(X, Y); x.scale(u, v);
  const P = (pts, fill) => { x.beginPath(); pts.forEach(([a, b], i) => i ? x.lineTo(a, b) : x.moveTo(a, b)); x.closePath(); x.fillStyle = fill; x.fill(); };
  const R = (a, b, w, h, fill) => { x.fillStyle = fill; x.fillRect(a, b, w, h); };
  const E = (a, b, rx, ry, fill) => { x.beginPath(); x.ellipse(a, b, rx, ry, 0, 0, Math.PI * 2); x.fillStyle = fill; x.fill(); };
  const hills = (base, amp, fill, ph) => { x.beginPath(); x.moveTo(0, 64); for (let i = 0; i <= 50; i++) { const a = i * 2; x.lineTo(a, base - amp * (Math.sin(a * .07 + ph) * .6 + Math.sin(a * .19 + ph * 2) * .4)); } x.lineTo(100, 64); x.closePath(); x.fillStyle = fill; x.fill(); };
  // sky
  const sky = x.createLinearGradient(0, 0, 0, 64); sky.addColorStop(0, L(mix, .62)); sky.addColorStop(.7, L(mix, .3)); sky.addColorStop(1, L(mix, .18)); x.fillStyle = sky; x.fillRect(0, 0, 100, 64);
  E(74, 16, 7, 7 * u / v * (v / u), L(mix, .82)); E(74, 16, 11, 11, css(mix.map(v => Math.min(1, v + (1 - v) * .8)), .25));
  for (let i = 0; i < 3; i++) { const cx = 10 + rnd() * 70, cy = 8 + rnd() * 14; x.fillStyle = L(mix, .75); x.globalAlpha = .55; x.beginPath(); x.ellipse(cx, cy, 9, 1.6, 0, 0, 7); x.ellipse(cx + 4, cy - 1.2, 5, 1.6, 0, 0, 7); x.fill(); x.globalAlpha = 1; }
  const far = L(mix, .12), mid = css(mix), near = D(mix, .3), ink = D(mix, .55);
  const ground = (y, fill) => R(0, y, 100, 64 - y, fill);
  const water = y => { const g = x.createLinearGradient(0, y, 0, 64); g.addColorStop(0, L(mix, .35)); g.addColorStop(1, D(mix, .15)); x.fillStyle = g; x.fillRect(0, y, 100, 64 - y); x.strokeStyle = L(mix, .6); x.lineWidth = .35; for (let i = 0; i < 9; i++) { const yy = y + 2 + i * (64 - y) / 9, xx = rnd() * 80; x.beginPath(); x.moveTo(xx, yy); x.lineTo(xx + 6 + rnd() * 10, yy); x.stroke(); } };
  const city = (base, fill) => { let a = 0; while (a < 100) { const w = 3 + rnd() * 6, h = 6 + rnd() * 16; R(a, base - h, w, h + 30, fill); a += w + rnd() * 1.2; } };
  const K = {
    eiffel() { hills(50, 2, far, 1); city(54, far); ground(54, mid); x.fillStyle = ink; x.beginPath(); x.moveTo(50, 6); x.lineTo(51.2, 18); x.lineTo(54, 34); x.lineTo(60, 56); x.lineTo(55.5, 56); x.quadraticCurveTo(50, 44, 44.5, 56); x.lineTo(40, 56); x.lineTo(46, 34); x.lineTo(48.8, 18); x.closePath(); x.fill(); R(45.5, 33.5, 9, 1.4, ink); R(48, 17.5, 4, 1, ink); R(49.6, 2, .8, 5, ink); },
    bigben() { city(52, far); water(54); R(40, 12, 9, 44, ink); P([[40, 12], [44.5, 3], [49, 12]], ink); E(44.5, 17, 3, 3, L(mix, .7)); R(49, 34, 34, 22, near); for (let i = 0; i < 8; i++) R(50 + i * 4, 31, 1.2, 4, near); },
    colosseum() { hills(46, 3, far, 2); ground(52, mid); x.fillStyle = ink; x.beginPath(); x.moveTo(18, 54); x.lineTo(18, 24); x.quadraticCurveTo(50, 16, 82, 26); x.lineTo(82, 54); x.closePath(); x.fill(); x.fillStyle = L(mix, .45); for (let r = 0; r < 3; r++) for (let i = 0; i < 12; i++) { const a = 21 + i * 5, b = 30 + r * 8; x.beginPath(); x.moveTo(a, b + 5); x.lineTo(a, b + 1.6); x.arc(a + 1.6, b + 1.6, 1.6, Math.PI, 0); x.lineTo(a + 3.2, b + 5); x.fill(); } },
    pyramids() { ground(48, L(mix, .1)); hills(50, 1.5, mid, 3); P([[18, 50], [36, 18], [54, 50]], near); P([[36, 18], [54, 50], [44, 50]], ink); P([[52, 52], [66, 28], [80, 52]], near); P([[66, 28], [80, 52], [72, 52]], ink); P([[78, 54], [86, 40], [94, 54]], near); },
    taj() { ground(50, mid); water(54); x.fillStyle = ink; R(32, 30, 36, 22, ink); E(50, 28, 10, 11, ink); R(49.4, 13, 1.2, 6, ink); for (const a of [26, 72]) { R(a, 16, 2.2, 36, ink); E(a + 1.1, 16, 1.8, 2, ink); } x.fillStyle = L(mix, .4); x.beginPath(); x.moveTo(46, 52); x.lineTo(46, 40); x.arc(50, 40, 4, Math.PI, 0); x.lineTo(54, 52); x.fill(); },
    fuji() { hills(52, 3, mid, 1); P([[8, 54], [42, 16], [58, 16], [92, 54]], near); P([[42, 16], [58, 16], [64, 24], [58, 22], [53, 26], [48, 21], [42, 25], [36, 24]], L(mix, .85)); ground(54, ink); if (rnd() > -1) { R(14, 40, 1.2, 14, ink); R(11, 40, 7, 1.4, ink); R(11.6, 43, 5.8, 1, ink); R(16, 40, 1.2, 14, ink); } },
    liberty() { water(50); city(48, far); R(48, 40, 6, 14, ink); P([[49, 40], [51, 22], [53, 40]], ink); E(51, 20, 1.6, 2, ink); R(52.6, 10, .9, 10, ink); E(53, 9, 1.2, 1.6, L(mix, .7)); for (let i = -2; i <= 2; i++) R(50.4 + i * .8, 16.5, .4, 1.6, ink); },
    bridge() { hills(42, 4, far, 2); water(44); x.fillStyle = ink; for (const a of [28, 70]) { R(a, 12, 3, 40, ink); R(a - 1, 20, 5, 1.2, ink); R(a - 1, 28, 5, 1.2, ink); } R(0, 40, 100, 2, ink); x.strokeStyle = ink; x.lineWidth = .7; x.beginPath(); x.moveTo(0, 26); x.quadraticCurveTo(15, 40, 29.5, 13); x.quadraticCurveTo(50, 44, 71.5, 13); x.quadraticCurveTo(86, 40, 100, 26); x.stroke(); },
    opera() { water(48); city(46, far); for (const [a, h] of [[30, 20], [40, 26], [50, 22], [60, 16]]) { x.fillStyle = L(mix, .8); x.beginPath(); x.moveTo(a, 48); x.quadraticCurveTo(a + 2, 48 - h, a + 12, 48 - h * .95); x.quadraticCurveTo(a + 8, 40, a + 8, 48); x.closePath(); x.fill(); } R(26, 47, 48, 3, ink); },
    christ() { hills(56, 3, mid, 0); P([[30, 64], [48, 30], [70, 64]], near); R(48.5, 12, 3, 20, ink); R(38, 15, 24, 2.2, ink); E(50, 10.5, 1.6, 2, ink); water(58); },
    santorini() { water(44); P([[0, 44], [0, 26], [30, 22], [60, 30], [100, 34], [100, 44]], near); for (let i = 0; i < 9; i++) { const a = 6 + i * 9 + rnd() * 3, b = 24 + rnd() * 6; R(a, b, 6, 6, L(mix, .9)); if (i % 3 === 0) { E(a + 3, b, 3, 3, ink); } } },
    onion() { city(54, far); ground(54, mid); for (const [a, s] of [[34, .8], [50, 1.2], [66, .8]]) { R(a - 3 * s, 30 - 6 * s, 6 * s, 30, ink); x.fillStyle = ink; x.beginPath(); x.moveTo(a, 10 - 4 * s); x.quadraticCurveTo(a + 7 * s, 18, a + 3 * s, 24 - 6 * s); x.lineTo(a - 3 * s, 24 - 6 * s); x.quadraticCurveTo(a - 7 * s, 18, a, 10 - 4 * s); x.fill(); } },
    mosque() { ground(52, mid); city(52, far); R(34, 34, 32, 20, ink); E(50, 33, 11, 10, ink); R(49.5, 19, 1, 5, ink); for (const a of [26, 72]) { R(a, 12, 2.4, 42, ink); P([[a - .4, 12], [a + 1.2, 6], [a + 2.8, 12]], ink); } E(40, 36, 4, 4, ink); E(60, 36, 4, 4, ink); },
    pagoda() { hills(44, 6, far, 1); hills(52, 3, mid, 3); for (let i = 0; i < 5; i++) { const w = 22 - i * 3.5, y = 50 - i * 7; R(50 - w * .35, y - 5, w * .7, 5, ink); P([[50 - w / 2 - 2, y - 4.5], [50 + w / 2 + 2, y - 4.5], [50 + w * .3, y - 7.5], [50 - w * .3, y - 7.5]], ink); } R(49.6, 8, .8, 7, ink); ground(54, ink); },
    castle() { hills(40, 8, far, .6); hills(50, 5, mid, 2.2); const k = ink; R(30, 30, 40, 22, k); for (let i = 0; i < 10; i++) R(30 + i * 4, 28, 2.2, 3, k); for (const [a, h] of [[26, 30], [66, 34], [46, 40]]) { R(a, 52 - h, 8, h, k); for (let i = 0; i < 3; i++) R(a + i * 3, 50 - h, 1.8, 2.6, k); P([[a - 1, 52 - h], [a + 4, 52 - h - 9], [a + 9, 52 - h]], D(mix, .7)); } x.fillStyle = L(mix, .85); for (const [a, b] of [[35, 38], [42, 38], [56, 40], [61, 36]]) { x.fillRect(a, b, 1.6, 2.6); } R(48, 44, 4, 8, D(mix, .75)); ground(52, near); },
    temple() { water(50); const k = ink; for (const [cx, w, h] of [[50, 30, 30], [30, 16, 18], [70, 16, 18]]) { for (let i = 0; i < 5; i++) { const ww = w * (1 - i * .17), y = 50 - h * i / 5; R(cx - ww / 2, y - h / 5, ww, h / 5 + .3, k); } P([[cx - w * .14, 50 - h + 1], [cx, 50 - h - 9], [cx + w * .14, 50 - h + 1]], k); } x.save(); x.globalAlpha = .28; x.translate(0, 100); x.scale(1, -1); for (const [cx, w, h] of [[50, 30, 30], [30, 16, 18], [70, 16, 18]]) { for (let i = 0; i < 5; i++) { const ww = w * (1 - i * .17), y = 50 - h * i / 5; R(cx - ww / 2, y - h / 5, ww, h / 5, k); } } x.restore(); for (let i = 0; i < 6; i++) E(12 + i * 15, 57 + (i % 2) * 2, 2.6, .9, L(mix, .5)); },
    windmill() { ground(48, mid); for (let i = 0; i < 8; i++) R(i * 13, 48 + i % 2, 12, 16, i % 2 ? near : L(mix, .1)); P([[44, 48], [47, 24], [53, 24], [56, 48]], ink); P([[46, 25], [50, 19], [54, 25]], ink); x.strokeStyle = ink; x.lineWidth = 1.6; x.beginPath(); for (const a of [.6, 2.17, 3.74, 5.31]) { x.moveTo(50, 24); x.lineTo(50 + Math.cos(a) * 18, 24 + Math.sin(a) * 18); } x.stroke(); },
    lighthouse() { water(46); P([[50, 46], [60, 30], [100, 32], [100, 46]], near); P([[62, 32], [64, 8], [68, 8], [70, 32]], L(mix, .9)); R(63.4, 14, 5.2, 3, ink); R(63.4, 22, 5.2, 3, ink); R(63, 5, 6, 3.4, ink); x.fillStyle = css(mix.map(v => Math.min(1, v + (1 - v) * .9)), .5); x.beginPath(); x.moveTo(66, 6.5); x.lineTo(20, 0); x.lineTo(20, 13); x.closePath(); x.fill(); },
    palms() { water(42); E(50, 64, 60, 12, L(mix, .55)); for (const [a, h, l] of [[30, 30, -1], [42, 36, 1], [70, 26, 1]]) { x.strokeStyle = ink; x.lineWidth = 1.4; x.beginPath(); x.moveTo(a, 60); x.quadraticCurveTo(a + 4 * l, 60 - h * .5, a + 2 * l, 60 - h); x.stroke(); x.fillStyle = ink; for (let k = 0; k < 6; k++) { const an = k / 6 * Math.PI * 2; x.beginPath(); x.ellipse(a + 2 * l + Math.cos(an) * 5, 60 - h + Math.sin(an) * 2, 6, 1.1, an, 0, 7); x.fill(); } } },
    ice() { water(46); P([[0, 46], [10, 30], [22, 36], [34, 20], [48, 34], [60, 26], [76, 38], [90, 28], [100, 34], [100, 46]], L(mix, .85)); P([[34, 20], [40, 46], [28, 46]], L(mix, .55)); P([[60, 26], [66, 46], [56, 46]], L(mix, .55)); },
    volcano() { ground(54, ink); P([[6, 56], [38, 20], [52, 20], [92, 56]], near); P([[38, 20], [52, 20], [48, 26], [42, 26]], ink); for (let i = 0; i < 4; i++) E(45 + rnd() * 6, 14 - i * 3.4, 4 + i * 1.6, 2.4 + i * .5, L(mix, .6)); },
    terraces() { for (let i = 0; i < 9; i++) hills(26 + i * 4.6, 3, i % 2 ? near : mid, i * .4); ground(62, ink); },
    mountains() { P([[0, 50], [18, 22], [30, 34], [46, 12], [62, 32], [76, 18], [100, 46], [100, 64], [0, 64]], far); P([[46, 12], [42, 20], [46, 18], [50, 21]], L(mix, .9)); P([[18, 22], [15, 28], [19, 27], [22, 29]], L(mix, .9)); P([[76, 18], [72, 25], [77, 23], [80, 25]], L(mix, .9)); hills(50, 4, near, 1); for (let i = 0; i < 14; i++) { const a = i * 7.5 + rnd() * 3, b = 52 + rnd() * 4; P([[a, b + 7], [a + 2.2, b - 4], [a + 4.4, b + 7]], ink); } ground(60, ink); },
    dunes() { ground(44, L(mix, .25)); for (let i = 0; i < 3; i++) { x.beginPath(); x.moveTo(0, 64); for (let k = 0; k <= 50; k++) { const a = k * 2; x.lineTo(a, 40 + i * 7 - 6 * Math.sin(a * .05 + i * 2) - 3 * Math.sin(a * .13 + i)); } x.lineTo(100, 64); x.closePath(); x.fillStyle = [far, mid, near][i]; x.fill(); } },
    canyon() { ground(46, mid); P([[0, 20], [22, 20], [24, 30], [30, 32], [32, 64], [0, 64]], near); P([[100, 24], [76, 24], [74, 34], [68, 36], [66, 64], [100, 64]], near); P([[40, 64], [44, 34], [52, 32], [56, 64]], ink); R(0, 36, 30, 1, ink); R(70, 40, 30, 1, ink); },
    fields() { hills(40, 4, far, 2); for (let i = 0; i < 4; i++) hills(46 + i * 5, 3, i % 2 ? mid : near, i * 1.3); x.strokeStyle = D(mix, .45); x.lineWidth = .4; for (let i = 0; i < 16; i++) { x.beginPath(); x.moveTo(50, 46); x.lineTo(i * 7 - 4, 64); x.stroke(); } for (const a of [20, 23, 78]) { R(a, 30, .8, 12, ink); E(a + .4, 29, 1.6, 6, ink); } },
    lake() { P([[0, 40], [16, 20], [30, 32], [46, 14], [62, 30], [80, 18], [100, 38], [100, 42], [0, 42]], far); hills(42, 2, near, 1); water(44); x.globalAlpha = .25; x.scale(1, -1); P([[0, -44], [16, -66], [30, -56], [46, -74], [62, -58], [80, -70], [100, -48]], far); x.scale(1, -1); x.globalAlpha = 1; },
    forest() { hills(36, 4, far, 1); for (let r = 0; r < 3; r++) for (let i = 0; i < 16; i++) { const a = i * 6.8 + rnd() * 3 - 2, b = 40 + r * 9 + rnd() * 3, h = 12 + rnd() * 6; P([[a, b + 6], [a + 2.6, b - h + 6], [a + 5.2, b + 6]], [mid, near, ink][r]); } ground(60, ink); },
    ocean() { water(40); P([[64, 40], [74, 24], [100, 22], [100, 40]], near); for (let i = 0; i < 3; i++) { x.strokeStyle = L(mix, .8); x.lineWidth = .8; x.beginPath(); const y = 48 + i * 5; for (let k = 0; k <= 25; k++) { const a = k * 4; x.lineTo(a, y + Math.sin(a * .3 + i) * 1.2); } x.stroke(); } x.strokeStyle = ink; x.lineWidth = .5; x.beginPath(); x.moveTo(26, 22); x.quadraticCurveTo(28, 20, 30, 22); x.quadraticCurveTo(32, 20, 34, 22); x.stroke(); },
    city() { hills(46, 3, far, 2); city(50, near); city(56, ink); },
    aurora() { const g = x.createLinearGradient(0, 0, 0, 64); g.addColorStop(0, D(mix, .82)); g.addColorStop(1, D(mix, .55)); x.fillStyle = g; x.fillRect(0, 0, 100, 64); for (let i = 0; i < 40; i++) E(rnd() * 100, rnd() * 34, .25, .25, L(mix, .9)); x.globalCompositeOperation = 'lighter'; for (let k = 0; k < 3; k++) { const ag = x.createLinearGradient(0, 8, 0, 40); ag.addColorStop(0, css(mix.map(v => Math.min(1, v + (1 - v) * .5)), 0)); ag.addColorStop(.5, css(mix.map(v => Math.min(1, v + (1 - v) * .4)), .45)); ag.addColorStop(1, css(mix, 0)); x.fillStyle = ag; x.beginPath(); x.moveTo(-5, 40); for (let i = 0; i <= 22; i++) { const a = i * 5 - 5; x.lineTo(a, 14 + k * 5 + 7 * Math.sin(a * .06 + k * 1.7)); } for (let i = 22; i >= 0; i--) { const a = i * 5 - 5; x.lineTo(a, 34 + k * 3 + 5 * Math.sin(a * .05 + k)); } x.fill(); } x.globalCompositeOperation = 'source-over'; P([[0, 50], [20, 34], [34, 44], [52, 30], [70, 42], [86, 32], [100, 44], [100, 64], [0, 64]], D(mix, .7)); x.globalAlpha = .35; P([[0, 64], [100, 64], [100, 56], [0, 56]], L(mix, .3)); x.globalAlpha = 1; },
    lavender() { hills(36, 3, far, 1); ground(40, L(mix, .2)); for (let i = 0; i < 18; i++) { x.strokeStyle = i % 2 ? mid : near; x.lineWidth = 2.6; x.beginPath(); x.moveTo(50 + (i - 8.5) * .8, 40); x.lineTo((i - 8.5) * 13 + 50, 66); x.stroke(); } R(66, 30, 9, 7, L(mix, .85)); P([[65, 30], [70.5, 26], [76, 30]], ink); R(72, 33, 2, 4, ink); for (const a of [80, 84]) { R(a, 26, .8, 12, ink); E(a + .4, 25, 1.5, 6, ink); } },
    tulips() { hills(38, 2, far, 2); const T = [mid, L(mix, .45), near, L(mix, .7)]; for (let i = 0; i < 8; i++) { x.fillStyle = T[i % 4]; x.beginPath(); x.moveTo(50 + (i - 4) * 3, 40); x.lineTo(50 + (i - 3) * 3, 40); x.lineTo((i - 3) * 25 + 50, 66); x.lineTo((i - 4) * 25 + 50, 66); x.fill(); } P([[78, 40], [80, 26], [83, 26], [85, 40]], ink); x.strokeStyle = ink; x.lineWidth = 1; x.beginPath(); for (const a of [.6, 2.17, 3.74, 5.31]) { x.moveTo(81.5, 26); x.lineTo(81.5 + Math.cos(a) * 9, 26 + Math.sin(a) * 9); } x.stroke(); },
    sakura() { hills(46, 3, far, 1); for (let i = 0; i < 3; i++) { const w = 12 - i * 3, y = 46 - i * 5; R(74 - w * .3, y - 4, w * .6, 4, near); P([[74 - w / 2, y - 3.6], [74 + w / 2, y - 3.6], [74, y - 6.5]], near); } x.strokeStyle = ink; x.lineWidth = 1.6; x.beginPath(); x.moveTo(-2, 10); x.quadraticCurveTo(20, 16, 40, 12); x.moveTo(18, 14); x.quadraticCurveTo(24, 24, 34, 26); x.stroke(); for (let i = 0; i < 70; i++) { const t2 = rnd(), a = t2 < .6 ? rnd() * 42 : 16 + rnd() * 20, b = t2 < .6 ? 8 + rnd() * 8 : 18 + rnd() * 10; E(a, b, 1 + rnd(), 1 + rnd(), rnd() > .5 ? L(mix, .55) : L(mix, .8)); } for (let i = 0; i < 12; i++) E(rnd() * 100, 30 + rnd() * 30, .5, .35, L(mix, .7)); ground(58, near); },
    flamingo() { hills(38, 3, far, 1); water(42); for (let i = 0; i < 6; i++) { const a = 18 + i * 12 + rnd() * 4, b = 50 + rnd() * 6; x.strokeStyle = ink; x.lineWidth = .5; x.beginPath(); x.moveTo(a, b); x.lineTo(a, b + 7); x.stroke(); E(a, b - 1, 2.6, 1.6, mid); x.strokeStyle = mid; x.lineWidth = .7; x.beginPath(); x.moveTo(a + 2, b - 1.5); x.quadraticCurveTo(a + 4, b - 8, a + 2, b - 9); x.stroke(); E(a + 1.6, b - 9, .9, .7, mid); } },
    reef() { const g = x.createLinearGradient(0, 0, 0, 64); g.addColorStop(0, L(mix, .55)); g.addColorStop(1, D(mix, .35)); x.fillStyle = g; x.fillRect(0, 0, 100, 64); x.globalAlpha = .18; for (let i = 0; i < 5; i++) P([[20 + i * 16, 0], [26 + i * 16, 0], [12 + i * 20, 64], [4 + i * 20, 64]], L(mix, .9)); x.globalAlpha = 1; for (let i = 0; i < 9; i++) { const a = i * 12 + rnd() * 4; x.strokeStyle = i % 2 ? near : ink; x.lineWidth = 1.2; x.beginPath(); x.moveTo(a, 64); x.quadraticCurveTo(a - 3, 54, a + 1, 48 - rnd() * 6); x.moveTo(a, 58); x.quadraticCurveTo(a + 4, 54, a + 5, 50); x.stroke(); E(a + 6, 60, 4, 3, i % 2 ? mid : near); } for (let i = 0; i < 5; i++) { const a = 15 + rnd() * 70, b = 18 + rnd() * 22; E(a, b, 2.4, 1.1, ink); P([[a + 2, b], [a + 3.6, b - 1.2], [a + 3.6, b + 1.2]], ink); } for (let i = 0; i < 10; i++) E(30 + rnd() * 40, 6 + rnd() * 30, .5, .5, L(mix, .85)); },
    lanterns() { const g = x.createLinearGradient(0, 0, 0, 64); g.addColorStop(0, D(mix, .75)); g.addColorStop(1, D(mix, .45)); x.fillStyle = g; x.fillRect(0, 0, 100, 64); for (let i = 0; i < 6; i++) R(i * 17 + rnd() * 3, 26 + rnd() * 6, 14, 40, D(mix, .62)); water(52); x.strokeStyle = D(mix, .3); x.lineWidth = .3; for (let r = 0; r < 3; r++) { x.beginPath(); x.moveTo(0, 8 + r * 7); x.quadraticCurveTo(50, 16 + r * 7, 100, 8 + r * 7); x.stroke(); for (let i = 0; i < 9; i++) { const a = 6 + i * 11 + r * 3, b = 9.5 + r * 7 + 7 * Math.sin(a / 100 * Math.PI) * .9; x.globalCompositeOperation = 'lighter'; E(a, b + 2, 3, 3, css(mix.map(v => Math.min(1, v + (1 - v) * .5)), .25)); x.globalCompositeOperation = 'source-over'; E(a, b + 2, 1.3, 1.8, L(mix, .65)); } } },
    balloons() { P([[0, 64], [0, 44], [8, 40], [12, 30], [16, 40], [26, 44], [32, 34], [36, 44], [50, 46], [60, 36], [66, 46], [80, 44], [86, 32], [92, 44], [100, 42], [100, 64]], near); for (const [a, b, r] of [[22, 14, 5], [44, 22, 3.6], [62, 10, 6], [80, 24, 3], [34, 34, 2.4], [90, 12, 2]]) { E(a, b, r, r * 1.15, rnd() > .5 ? mid : L(mix, .5)); x.strokeStyle = ink; x.lineWidth = .25; x.beginPath(); x.moveTo(a - r * .5, b + r); x.lineTo(a - r * .25, b + r * 1.6); x.moveTo(a + r * .5, b + r); x.lineTo(a + r * .25, b + r * 1.6); x.stroke(); R(a - r * .3, b + r * 1.6, r * .6, r * .4, ink); } },
    gondola() { R(0, 0, 18, 46, near); R(82, 0, 18, 46, near); R(16, 10, 2, 36, ink); R(82, 10, 2, 36, ink); for (let i = 0; i < 4; i++) { R(4, 6 + i * 9, 5, 4, L(mix, .6)); R(89, 6 + i * 9, 5, 4, L(mix, .6)); } x.strokeStyle = near; x.lineWidth = 1.4; x.beginPath(); x.moveTo(18, 24); x.quadraticCurveTo(50, 14, 82, 24); x.stroke(); R(18, 24, 64, 1.2, near); water(46); x.fillStyle = ink; x.beginPath(); x.moveTo(30, 52); x.quadraticCurveTo(50, 56, 72, 50); x.lineTo(74, 47); x.quadraticCurveTo(52, 54, 30, 50); x.fill(); R(58, 38, .8, 12, ink); E(58.4, 37, 1, 1.2, ink); },
    monastery() { P([[0, 64], [6, 26], [14, 20], [22, 30], [26, 64]], near); P([[34, 64], [38, 18], [46, 10], [56, 14], [62, 64]], near); P([[72, 64], [76, 30], [86, 24], [94, 34], [100, 64]], near); R(40, 4, 14, 8, L(mix, .85)); P([[39, 4], [47, 0], [55, 4]], ink); R(44, 7, 2, 2.6, ink); R(49, 7, 2, 2.6, ink); hills(58, 2, ink, 1); },
    treasury() { R(0, 0, 100, 64, near); x.fillStyle = L(mix, .25); x.fillRect(22, 6, 56, 58); x.fillStyle = mid; for (let i = 0; i < 6; i++) R(26 + i * 9.6, 34, 2.4, 30, mid); R(24, 30, 52, 3, mid); P([[24, 30], [50, 22], [76, 30]], mid); for (let i = 0; i < 3; i++) R(38 + i * 10, 8, 2, 12, mid); E(50, 10, 5, 3, mid); R(46, 46, 8, 18, ink); x.globalAlpha = .4; x.fillStyle = ink; x.fillRect(0, 0, 14, 64); x.fillRect(86, 0, 14, 64); x.globalAlpha = 1; },
    saltflat() { const g = x.createLinearGradient(0, 0, 0, 32); g.addColorStop(0, L(mix, .55)); g.addColorStop(1, L(mix, .2)); x.fillStyle = g; x.fillRect(0, 0, 100, 32); P([[0, 32], [14, 26], [30, 30], [52, 24], [74, 30], [100, 27], [100, 32]], near); x.save(); x.translate(0, 64); x.scale(1, -1); x.globalAlpha = .9; x.fillStyle = g; x.fillRect(0, 0, 100, 32); P([[0, 32], [14, 26], [30, 30], [52, 24], [74, 30], [100, 27], [100, 32]], near); x.restore(); R(0, 31.6, 100, .6, L(mix, .9)); E(40, 31, .7, 1.6, ink); E(40, 33, .7, 1.6, css(mix.map(v => v * .45), .5)); },
    waterfall() { hills(26, 3, far, 1); P([[0, 64], [0, 20], [34, 22], [36, 64]], near); P([[100, 64], [100, 18], [62, 22], [60, 64]], near); const fg = x.createLinearGradient(0, 22, 0, 54); fg.addColorStop(0, L(mix, .85)); fg.addColorStop(1, L(mix, .55)); x.fillStyle = fg; x.fillRect(36, 22, 24, 34); x.strokeStyle = L(mix, .95); x.lineWidth = .4; for (let i = 0; i < 10; i++) { const a = 37 + i * 2.4; x.beginPath(); x.moveTo(a, 22); x.lineTo(a + rnd() - .5, 56); x.stroke(); } water(54); E(48, 55, 16, 3, L(mix, .85)); for (const a of [6, 12, 88, 94]) { R(a, 12, .7, 10, ink); E(a + .35, 12, 3, 2.4, ink); } },
    savanna() { const g = x.createLinearGradient(0, 0, 0, 44); g.addColorStop(0, L(mix, .45)); g.addColorStop(1, L(mix, .75)); x.fillStyle = g; x.fillRect(0, 0, 100, 44); E(50, 40, 12, 12, L(mix, .9)); ground(42, mid); hills(46, 1.5, near, 2); for (const [a, s] of [[22, 1], [74, 1.3], [88, .7]]) { R(a - .4 * s, 30 - 4 * s, .8 * s, 16 + 4 * s, ink); E(a, 28 - 4 * s, 9 * s, 2 * s, ink); } x.strokeStyle = ink; x.lineWidth = .4; for (let i = 0; i < 4; i++) { const a = 36 + i * 6 + rnd() * 3, b = 16 + rnd() * 6; x.beginPath(); x.moveTo(a - 1.4, b); x.quadraticCurveTo(a - .7, b - .8, a, b); x.quadraticCurveTo(a + .7, b - .8, a + 1.4, b); x.stroke(); } },
    tea() { hills(30, 5, far, 1); for (let i = 0; i < 7; i++) { hills(36 + i * 4.4, 3.5, i % 2 ? mid : near, i * .6); x.fillStyle = i % 2 ? near : mid; for (let k = 0; k < 20; k++) E(k * 5.2 + (i % 2) * 2.6, 35.5 + i * 4.4 - 3.5 * Math.sin((k * 5.2) * .07 + i * .6) * .6, 2.4, 1.2, i % 2 ? near : mid); } for (const a of [14, 82]) { R(a, 22, .8, 12, ink); E(a + .4, 20, 3, 4, ink); } },
    village() { hills(36, 5, far, 1); hills(44, 4, mid, 2.5); for (let i = 0; i < 7; i++) { const a = 18 + i * 9 + rnd() * 3, b = 44 + rnd() * 3, w = 4 + rnd() * 2; R(a, b, w, 5, L(mix, .85)); P([[a - .6, b], [a + w / 2, b - 3], [a + w + .6, b]], ink); } R(60, 33, 2.4, 11, L(mix, .85)); P([[59.6, 33], [61.2, 27], [62.8, 33]], ink); hills(52, 3, near, 4); for (const a of [10, 86]) { R(a, 42, .9, 12, ink); E(a + .45, 40, 3.4, 4.6, ink); } ground(60, ink); },
  };
  try { (K[kind] || K.city)(); } catch (e) {}
  x.restore();
}

async function postcard(o) {
  const W = 1080, H = 1350, cv = document.createElement('canvas'); cv.width = W; cv.height = H; const x = cv.getContext('2d');
  const F = getComputedStyle(document.documentElement).getPropertyValue('--f-display').trim() || 'system-ui, sans-serif', INK = '#2a241b', ad = atlasOf(o.name), flag = await loadImg(badgeSrc(ad));
  const rr = (X, Y, w, h, r) => { x.beginPath(); x.moveTo(X + r, Y); x.arcTo(X + w, Y, X + w, Y + h, r); x.arcTo(X + w, Y + h, X, Y + h, r); x.arcTo(X, Y + h, X, Y, r); x.arcTo(X, Y, X + w, Y, r); x.closePath(); };
  // paper
  if (!o.inApp) { x.fillStyle = '#1b1814'; x.fillRect(0, 0, W, H); } x.save(); x.shadowColor = 'rgba(0,0,0,.45)'; x.shadowBlur = 40; rr(24, 24, W - 48, H - 48, 22); x.fillStyle = '#f3efe6'; x.fill(); x.restore();
  x.save(); rr(24, 24, W - 48, H - 48, 22); x.clip(); x.fillStyle = x.createPattern(grainTile(), 'repeat'); x.fillRect(0, 0, W, H);
  const vg = x.createRadialGradient(W / 2, H / 2, H * .35, W / 2, H / 2, H * .78); vg.addColorStop(0, 'rgba(120,96,60,0)'); vg.addColorStop(1, 'rgba(120,96,60,.14)'); x.fillStyle = vg; x.fillRect(0, 0, W, H); x.restore();
  // photo
  const PX = 84, PY = 84, PW = W - 168, PH = 620; x.save(); x.shadowColor = 'rgba(40,30,15,.28)'; x.shadowBlur = 24; x.shadowOffsetY = 8; rr(PX, PY, PW, PH, 26); x.fillStyle = css(o.mix); x.fill(); x.restore();
  x.save(); rr(PX, PY, PW, PH, 26); x.clip(); { let sd = 7; for (const ch of o.name) sd = (sd * 31 + ch.charCodeAt(0)) % 2147483647; drawScene(x, PX, PY, PW, PH, o.tgt, sceneKind(ad, o.name), sd || 7); }
  { const bx = PX + 30, by = PY + PH - 72; x.save(); x.fillStyle = 'rgba(255,255,255,.82)'; rr(bx, by, 196, 46, 23); x.fill(); x.beginPath(); x.arc(bx + 23, by + 23, 15, 0, 7); x.fillStyle = css(o.mix); x.fill(); x.lineWidth = 2; x.strokeStyle = 'rgba(42,36,27,.15)'; x.stroke(); x.fillStyle = '#2a241b'; x.font = `600 22px ${F}`; x.textAlign = 'left'; x.textBaseline = 'middle'; x.fillText('your mix', bx + 48, by + 24); x.restore(); } const hg = x.createRadialGradient(PX + PW * .28, PY + PH * .2, 0, PX + PW * .28, PY + PH * .2, PW * .8); hg.addColorStop(0, 'rgba(255,255,255,.32)'); hg.addColorStop(.5, 'rgba(255,255,255,.06)'); hg.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = hg; x.fillRect(PX, PY, PW, PH); x.strokeStyle = 'rgba(255,255,255,.35)'; x.lineWidth = 3; rr(PX + 1.5, PY + 1.5, PW - 3, PH - 3, 25); x.stroke(); x.restore();
  // stamp
  const SW = 230, SH = 286, SX = W - 84 - SW + 30, SY = 54; { const s = document.createElement('canvas'); s.width = SW; s.height = SH; const k = s.getContext('2d'); k.fillStyle = '#fbfaf6'; k.fillRect(0, 0, SW, SH); k.globalCompositeOperation = 'destination-out'; const pr = 9, st = 23; for (let X = st / 2; X < SW; X += st) { k.beginPath(); k.arc(X, 0, pr, 0, 7); k.arc(X, SH, pr, 0, 7); k.fill(); } for (let Y = st / 2; Y < SH; Y += st) { k.beginPath(); k.arc(0, Y, pr, 0, 7); k.arc(SW, Y, pr, 0, 7); k.fill(); }
    k.globalCompositeOperation = 'source-over'; k.fillStyle = css(o.tgt); k.fillRect(22, 22, SW - 44, SH - 44); { const lum0 = o.tgt[0] * .3 + o.tgt[1] * .59 + o.tgt[2] * .11; k.save(); k.textAlign = 'center'; k.textBaseline = 'middle'; k.font = `800 46px ${F}`; try { k.letterSpacing = '-2px'; } catch (e) {} k.fillStyle = lum0 > .55 ? 'rgba(42,36,27,.88)' : 'rgba(255,255,255,.95)'; k.shadowColor = lum0 > .55 ? 'rgba(255,255,255,.3)' : 'rgba(0,0,0,.25)'; k.shadowBlur = 6; k.fillText('mix.io', SW / 2, SH / 2 - 8); try { k.letterSpacing = '0px'; } catch (e) {} k.restore(); } const sg = k.createLinearGradient(0, 22, 0, SH - 22); sg.addColorStop(0, 'rgba(255,255,255,.12)'); sg.addColorStop(1, 'rgba(0,0,0,.1)'); k.fillStyle = sg; k.fillRect(22, 22, SW - 44, SH - 44);
    { const ci = COLORS.findIndex(c => c[0] === o.name); k.save(); k.fillStyle = 'rgba(255,255,255,.92)'; k.font = `800 22px ${F}`; k.textAlign = 'left'; k.shadowColor = 'rgba(0,0,0,.35)'; k.shadowBlur = 3; k.fillText(ci >= 0 ? String(ci + 1) : '', 32, 48); k.restore(); }
    const cn = ad ? placeCountry(ad).toUpperCase() : ''; const lum = o.tgt[0] * .3 + o.tgt[1] * .59 + o.tgt[2] * .11; k.fillStyle = lum > .55 ? 'rgba(42,36,27,.85)' : 'rgba(255,255,255,.92)'; k.textAlign = 'center'; let fs = 20; k.font = `700 ${fs}px ${F}`; try { k.letterSpacing = '3px'; } catch (e) {} while (k.measureText(cn).width + cn.length * 3 > SW - 60 && fs > 10) { fs--; k.font = `700 ${fs}px ${F}`; } k.fillText(cn, SW / 2, SH - 36);
    if (flag) { k.save(); k.shadowColor = 'rgba(0,0,0,.25)'; k.shadowBlur = 4; k.drawImage(flag, SW - 22 - 12 - 44, 34, 44, 33); k.restore(); }
    x.save(); x.translate(SX + SW / 2, SY + SH / 2); x.rotate(.035); x.shadowColor = 'rgba(40,30,15,.3)'; x.shadowBlur = 16; x.shadowOffsetY = 6; x.drawImage(s, -SW / 2, -SH / 2); x.restore(); }
  // postmark
  { const city = ad ? ad[3].split(',')[0].toUpperCase() : o.name.toUpperCase(), dt = new Date(o.date || Date.now()), ds = dt.toLocaleDateString('en-US', { month: 'short' }).toUpperCase() + ' ' + dt.getDate() + ' ' + dt.getFullYear(), txt = `${city} · ${ds} · ${fmtP(o.pct)}%`;
    const mx = SX - 20, my = SY + SH - 30, R1 = 118, R2 = 84; x.save(); x.translate(mx, my); x.rotate(-.21); x.globalAlpha = .45; x.strokeStyle = INK; x.fillStyle = INK; x.lineWidth = 5; x.beginPath(); x.arc(0, 0, R1, 0, 7); x.stroke(); x.lineWidth = 3; x.beginPath(); x.arc(0, 0, R2, 0, 7); x.stroke();
    let fs = 24; x.font = `700 ${fs}px ${F}`; const chars = [...txt], RM = (R1 + R2) / 2; let tw = x.measureText(txt).width * 1.18; while (tw / RM > Math.PI * 1.8 && fs > 14) { fs--; x.font = `700 ${fs}px ${F}`; tw = x.measureText(txt).width * 1.18; } const span = Math.max(Math.PI * .9, tw / RM); x.textAlign = 'center'; x.textBaseline = 'middle'; const cw = chars.map(ch => x.measureText(ch).width * 1.18), tot = cw.reduce((a, b) => a + b, 0); let acc = 0; chars.forEach((ch, i) => { const a = -Math.PI / 2 - span / 2 + (acc + cw[i] / 2) / tot * span; acc += cw[i]; x.save(); x.rotate(a + Math.PI / 2); x.fillText(ch, 0, -(R1 + R2) / 2); x.restore(); });
    x.font = `800 30px ${F}`; x.fillText('mix.io', 0, 2); x.lineWidth = 4; for (let k = 0; k < 4; k++) { x.beginPath(); const yy = -42 + k * 28; for (let t = 0; t <= 1; t += .05) { const X = R1 + 14 + t * 230, Y = yy + Math.sin(t * Math.PI * 4) * 8; t ? x.lineTo(X, Y) : x.moveTo(X, Y); } x.stroke(); } x.restore(); }
  // text
  const wrap = (t, X, Y, mw, lh, maxL) => { const ws = t.split(' '); let line = '', n = 0; for (let i = 0; i < ws.length; i++) { const tt = line ? line + ' ' + ws[i] : ws[i]; if (x.measureText(tt).width > mw && line) { x.fillText(line, X, Y); Y += lh; line = ws[i]; if (++n >= maxL - 1) { line = ws.slice(i).join(' '); while (x.measureText(line + '…').width > mw && line.length) line = line.slice(0, -1); if (line !== ws.slice(i).join(' ')) line += '…'; break; } } else line = tt; } if (line) { x.fillText(line, X, Y); Y += lh; } return Y; };
  x.textAlign = 'left'; x.textBaseline = 'alphabetic'; x.fillStyle = INK; let ty = PY + PH + 128; let ns = 100; x.font = `800 ${ns}px ${F}`; try { x.letterSpacing = '-3px'; } catch (e) {} while (x.measureText(o.name).width > PW && ns > 50) { ns -= 4; x.font = `800 ${ns}px ${F}`; } x.fillText(o.name, PX, ty); try { x.letterSpacing = '0px'; } catch (e) {}
  ty += 62; if (ad) { let tx = PX; if (flag) { x.save(); rr(PX, ty - 32, 48, 36, 5); x.clip(); x.drawImage(flag, PX, ty - 32, 48, 36); x.restore(); tx += 64; } x.font = `500 38px ${F}`; x.fillStyle = 'rgba(42,36,27,.78)'; x.fillText(cardPlace(ad), tx, ty); { const P = countryProg()[ad[6]]; if (P) { const cn = (COUNTRY[ad[6]] || placeCountry(ad) || '').toLowerCase(); x.font = `500 27px ${F}`; x.fillStyle = P.done ? 'rgba(178,128,36,.95)' : 'rgba(42,36,27,.48)'; x.fillText(P.done ? `${cn} · complete` : `${cn} · ${P.k} of ${P.n} colors found`, tx, ty + 42); ty += 42; } } ty += 70;
    x.fillStyle = INK; x.font = `400 36px ${F}`; ty = wrap(ad[5], PX, ty, PW, 50, 3); }
  const w = wordOf(o.name); if (w) { ty += 10; x.save(); x.setLineDash([10, 10]); x.strokeStyle = 'rgba(42,36,27,.35)'; x.lineWidth = 2; x.beginPath(); x.moveTo(PX, ty); x.lineTo(PX + PW, ty); x.stroke(); x.restore(); ty += 54; x.font = `700 30px ${F}`; x.fillStyle = INK; const wl = w[0] + ' — '; x.fillText(wl, PX, ty); const ww = x.measureText(wl).width; x.font = `400 30px ${F}`; x.fillStyle = 'rgba(42,36,27,.8)'; const rest = w[1].split(' '); let line = '', X0 = PX + ww, lines = 0; for (const word of rest) { const tt = line ? line + ' ' + word : word; if (x.measureText(tt).width > PX + PW - X0 && line) { x.fillText(line, X0, ty); ty += 42; X0 = PX; line = word; if (++lines >= 2) { line += '…'; break; } } else line = tt; } x.fillText(line, X0, ty); }
  // footer
  x.font = `800 30px ${F}`; x.fillStyle = 'rgba(42,36,27,.7)'; x.textAlign = 'left'; x.fillText('mix.io', PX, H - 74); if (o.day) { x.textAlign = 'right'; x.font = `600 26px ${F}`; x.fillText('daily #' + o.day, PX + PW, H - 74); }
  return cv;
}
async function sharePostcard(o) {
  let cv; try { cv = await postcard(o); } catch (e) { console.warn('[mix.io] postcard failed', e); return; }
  const fallback = () => { const ov = document.createElement('div'); ov.className = 'shareov'; ov.innerHTML = `<img alt="mix.io postcard" src="${cv.toDataURL('image/png')}"><p>press and hold to save · tap outside to close</p>`; ov.addEventListener('click', e => { if (e.target === ov || e.target.tagName === 'P') ov.remove(); }); document.body.appendChild(ov); };
  cv.toBlob(b => { try { const f = new File([b], 'mixio-postcard.png', { type: 'image/png' }); if (navigator.canShare && navigator.canShare({ files: [f] })) { navigator.share({ files: [f], text: o.day ? `mix.io #${o.day}` : 'mix.io' }).catch(e => { if (e && e.name !== 'AbortError') fallback(); }); return; } } catch (e) {} fallback(); }, 'image/png');
}
function missLine(pct, yours, tg, wUsed) {
  if (pct >= 97) return 'nothing to fix';
  const a = toLab(yours), b = toLab(tg.rgb), dL = a[0]-b[0], da = a[1]-b[1], db = a[2]-b[2], Ca = Math.hypot(a[1],a[2]), Cb = Math.hypot(b[1],b[2]), dC = Ca - Cb;
  const wNeed = (tg.dil||0)*3, q = m => m > 18 ? 'much ' : m > 9 ? '' : m > 5 ? 'a little ' : 'just a touch ';
  const c = [];
  if (Math.abs(dL) > 3) { let t; if (dL > 0 && wUsed > wNeed) t = 'a little watered down'; else if (dL < 0 && wNeed > wUsed) t = 'wanted a splash more water'; else t = q(Math.abs(dL)) + (dL > 0 ? 'too pale' : 'too deep'); c.push([Math.abs(dL), t]); }
  const hm = Math.hypot(da, db) * (Cb < 10 && Ca < 10 ? .5 : 1);
  if (hm > 4) { const t = Math.abs(da) > Math.abs(db) ? (da > 0 ? 'leaning red' : b[1] > 20 ? 'wanted more red' : 'leaning green') : (db > 0 ? (b[2] < -20 ? 'wanted more blue' : 'leaning yellow') : (b[2] > 20 ? 'wanted more yellow' : 'leaning blue')); c.push([hm, (t.startsWith('leaning') ? q(hm).replace(/^much /, 'leaning hard ').replace(/^(.+) $/, '$1 ') : '') + t]); }
  if (Math.abs(dC) > 7) c.push([Math.abs(dC) * .8, dC < 0 ? 'a little muddy' : 'a little too vivid']);
  c.sort((x, y) => y[0] - x[0]);
  return c.length ? c.slice(0, 2).map(x => x[1].replace(/^leaning hard leaning/, 'leaning hard')).join(', and ') : 'so close, just a hair off';
}
function nextRank(e) { return RANKS.find(r => r[0] > e) || null; }
function orbSize() { const v = clamp((save.eye ?? 0) + Math.min(60, (save.wr || 0) / 50), 0, 160); const px = 240 + 110 * Math.sqrt(clamp(v / 100, 0, 1.6)); try { $('home').style.setProperty('--orb', px.toFixed(0) + 'px'); } catch (e) {} }
function setEyeTop(v) { try { orbSize(); } catch (e) {} const rk = rankOf(v); $('eyeBdg').innerHTML = badge(rk); $('eyeTop').textContent = fmtC(v); }
function eyeTick(a, b) {
  const c = $('coins'), t0 = performance.now(), D = 600, et = $('eyeTop');
  if (b !== a) { et.classList.remove('shine'); void et.offsetWidth; et.classList.add('shine'); const d = document.createElement('span'); d.className = 'edelta ' + (b > a ? 'up' : 'dn'); d.textContent = (b > a ? '+' : '−') + Math.abs(b - a); c.appendChild(d); setTimeout(() => d.remove(), 1500); }
  const f = now => { const k = Math.min(1, (now - t0) / D), e = k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2; setEyeTop(a + (b - a) * e); if (k < 1) requestAnimationFrame(f); else { setEyeTop(b); c.classList.remove('bump'); void c.offsetWidth; c.classList.add('bump'); if (b !== a) { tick(); buzz(6); } } };
  requestAnimationFrame(f);
}
function pourFX(c, tc, S, k) {
  const { gx, wt, cx, y0, ryIn, top, gh } = G, xs = gx + wt + (cx - gx - wt) * .5, yTop = top - gh * .3, yHit = y0 - ryIn * .2, t = S.t;
  if (!S.splashed && t > .14) { S.splashed = true; for (let i = 0; i < 7; i++) { const a = -Math.PI / 2 + (Math.random() - .5) * 1.6, v = 90 + Math.random() * 120; burst.push({ x: xs, y: yHit, vx: Math.cos(a) * v, vy: Math.sin(a) * v, r: 1 + Math.random() * 1.8, t: 0, col: target.rgb }); } ripples.push({ x: xs, t: 0 }); }
  if (t < .85) {
    const head = Math.min(1, t / .14), thin = 1 - clamp((t - .62) / .23, 0, 1), y1s = yTop + (yHit - yTop) * head, yStart = t > .62 ? yTop + (yHit - yTop) * (1 - thin) : yTop;
    if (thin > 0) {
      c.save(); c.beginPath(); const N = 14, wTop = 3.2 * thin, wBot = 2.2 * thin;
      for (let i = 0; i <= N; i++) { const f = i / N, y = yStart + (y1s - yStart) * f, w = wTop + (wBot - wTop) * f, wob = Math.sin(y * .09 + t * 26) * .7 * f; c.lineTo(xs - w + wob, y); }
      for (let i = N; i >= 0; i--) { const f = i / N, y = yStart + (y1s - yStart) * f, w = wTop + (wBot - wTop) * f, wob = Math.sin(y * .09 + t * 26) * .7 * f; c.lineTo(xs + w + wob, y); }
      c.closePath(); c.shadowColor = css(tc, .6); c.shadowBlur = 3; c.fillStyle = css(tc, .96); c.fill(); c.shadowBlur = 0;
      c.beginPath(); c.moveTo(xs - wTop * .45, yStart + 2); c.lineTo(xs - wBot * .45, y1s - 2); c.lineWidth = Math.max(.6, thin); c.strokeStyle = 'rgba(255,255,255,.55)'; c.stroke(); c.restore();
    }
  }
  if (t > .62 && t < 1.1) for (let i = 0; i < 3; i++) { const dt0 = t - .66 - i * .07; if (dt0 < 0) continue; const y = yTop + 30 * i + dt0 * dt0 * 1600 + dt0 * 120; if (y > yHit) continue; c.beginPath(); c.arc(xs + (i - 1) * .6, y, 2.2 - i * .4, 0, Math.PI * 2); c.fillStyle = css(tc, .95); c.fill(); }
}
/* result reveal timers: every delayed beat is registered here so resetGlass()/next() can cancel a reveal that is mid-flight
   (tab switch, early tap, replay from the atlas) instead of letting stale timers land on the next color */
const REV_T = []; let REV_ID = 0;
function revT(f, ms) { const id = setTimeout(() => { const k = REV_T.indexOf(id); if (k >= 0) REV_T.splice(k, 1); f(); }, ms); REV_T.push(id); return id; }
function clearRevT() { REV_ID++; REV_T.forEach(clearTimeout); REV_T.length = 0; }
function reveal() {
  if (state === 'result') return; // can't double-fire (auto-stir end + any stray caller)
  clearRevT(); const rid = REV_ID;
  state = 'result';
  const yours = displayColor(meanA);
  const dE = dE00(toLab(target.rgb), toLab(yours));
  const pRaw = 100 * Math.exp(-Math.pow(dE / 18, 1.3)), pct0 = pRaw >= 99.95 ? 100 : Math.min(99.9, Math.round(pRaw * 10) / 10), hUsed = hintN(), hCut = HINT_COST[hUsed] || 0, pct = Math.max(0, Math.round((pct0 - hCut) * 10) / 10); save.hint = null;
  const verdict = pct >= 97 ? 'perfect' : pct >= 90 ? 'excellent' : pct >= 80 ? 'great' : pct >= 65 ? 'close' : pct >= 45 ? 'getting there' : 'way off';
  let coins = TIER_HUE[target.tier] * (pct >= 90 ? 1 : pct >= 65 ? 0.5 : 0.25);
  if (pct >= 97) coins *= 2;
  coins = Math.round(coins);
  const daily = MODE === 'daily' || MODE === 'replay', isRep = MODE === 'replay', eye0 = (save.eye ?? CH0); let dEye = 0, extra = 0, msg = '', day = 0, ds = 0;
  {
    const D = clamp([0, 26, 40, 53, 62][target.tier] + (target.dil ? 3 : 0) + (target.recipe.length >= 3 ? 3 : 0) + Math.max(0, Math.min(2, target.drops - 8)), 8, 92);
    const r0 = save.chRaw ?? eye0, E = clamp(50 + 48 * Math.tanh((r0 - D) / 22), 5, 98), nG = (save.stats && save.stats.n) || 0, K = (nG < 15 ? 5 : nG < 50 ? 3.6 : 2.6) * (isRep ? .5 : 1);
    const TM = ch0 => ch0 > 0 ? [1, .85, 1, 1.2, 1.4][target.tier] : [1, 1.1, 1, .95, .85][target.tier]; let ch = clamp(K * (pct - E) / 25, -K * 1.6, K * 1.6); ch *= TM(ch); if (hUsed) ch -= .4 * hUsed; dEye = Math.round(ch * 10) / 10; if (dEye === 0) dEye = pct >= E ? .1 : -.1;
    let nv = r0 + dEye; if (nv > 100) { save.wr = Math.round(((save.wr || 0) + (nv - 100) * 10) * 10) / 10; nv = 100; } else if (r0 >= 100 && dEye < 0 && (save.wr || 0) > 0) { save.wr = Math.max(0, (save.wr || 0) + dEye * 10); nv = save.wr > 0 ? 100 : 100 + dEye; }
    save.chRaw = Math.round(clamp(nv, 0, 100) * 10) / 10; save.eyeBest = Math.max(save.eyeBest ?? 0, save.eye);
    save.eyeHist = (save.eyeHist || []).concat(save.eye).slice(-30); save.eyeAll = (save.eyeAll || (save.eyeHist || []).slice(0, -1)).concat(save.eye).slice(-3000);
    const ms = save.level; if (!daily && ([10, 25, 50, 100].includes(ms) || (ms > 100 && ms % 50 === 0))) msg = `level ${ms} ✦`;
  }
  if (daily && !isRep) {
    day = dayNo(); ds = save.dlast === day - 1 ? (save.dstreak || 0) + 1 : save.dlast === day ? (save.dstreak || 1) : 1;
    save.dstreak = ds; save.dlast = day; save.daily = { d: day, p: pct }; extra = 0;
  }
  const rankUp = rankOf(save.eye)[0] > rankOf(eye0)[0]; if (rankUp) save.rkNew = rankOf(save.eye)[1];
  if (isRep && pct > REPLAY_BEST) { const dd = dayNo(), RM = save.remix && save.remix.d === dd ? save.remix : (save.remix = { d: dd, m: {} }), have = RM.m[target.name] || 0, g = Math.min(3 - have, Math.floor((pct - REPLAY_BEST) / 5)); if (g > 0) { RM.m[target.name] = have + g; save.chroma = (save.chroma || 0) + g; try { CARDS.earned(g, [['new best +' + Math.round(pct - REPLAY_BEST) + '%', g]]); } catch (e) {} } REPLAY_BEST = Math.max(REPLAY_BEST, pct); }
  if (!isRep) { const CB = []; let cg = 0; if (pct >= 50) { const tb = target.tier || 1, ab = pct >= 97 ? 4 : pct >= 85 ? 2 : pct >= 70 ? 1 : 0; cg = tb + ab + 1; CB.push(['match', 1]); CB.push(['difficulty', tb]); if (ab) CB.push(['accuracy', ab]); save.cStreak = (save.cStreak || 0) + 1; { const s = save.cStreak, sb = s >= 10 ? 5 : s >= 5 ? 3 : s >= 3 ? 2 : s >= 2 ? 1 : 0; if (sb) { cg += sb; CB.push(['streak ×' + s, sb]); } } if (pct >= 90 && drops > 0 && drops <= (target.drops || 99) + 2) { cg += 1; CB.push(['clean mix', 1]); } try { const pb = CARDS.pinBonus(target); if (pb) { cg += pb; CB.push(['pinned card', pb]); } } catch (e) {} if (daily) { cg *= 2; CB.push(['daily', '×2']); } } else save.cStreak = 0; if (cg) { save.chroma = (save.chroma || 0) + cg; try { CARDS.earned(cg, CB); } catch (e) {} } }
  if (!isRep && pct >= 70) { save.pk70 = (save.pk70 || 0) + 1; if (save.pk70 % 5 === 0) { const FP = save.freePk || (save.freePk = {}); FP.std = (FP.std || 0) + 1; setTimeout(() => { try { toast('free standard pack · open it in collection'); } catch (e) {} }, 2600); } }
  holdCoins = true; if (!daily) { save.level += 1; save.lastPct = pct; if (pct < 50 && target.idx >= 0) (save.retry = save.retry || []).push({ i: target.idx, at: save.level + 7 + Math.floor(Math.random() * 5) }); }
  const st = save.stats; st.sum += pct; st.n += 1; st.mixed += 1; if (pct >= 97) st.perfects += 1;
  const today = new Date().toDateString(), yd = new Date(Date.now() - 864e5).toDateString();
  if (st.lastDay !== today) { st.streak = st.lastDay === yd ? st.streak + 1 : 1; st.lastDay = today; } save.bestStreak = Math.max(save.bestStreak || 0, st.streak);
  const _cb = doneSet(), _tb = countryTiers();
  const prevBest = ((save.palette.find(x => x.n === target.name) || {}).p) || 0; let isNew = false; if (pct >= 50) { const old = save.palette.find(x => x.n === target.name); isNew = !old; save.palette = save.palette.filter(x => x.n !== target.name); save.palette.unshift({ n: target.name, h: rgbToHex(target.rgb), m: old && old.p > pct && old.m ? old.m : rgbToHex(yours), p: Math.max(pct, old ? old.p : 0), d: old && old.d ? old.d : Date.now() }); }
  { try { const _ca = doneSet(), nw = [..._ca].filter(c => !_cb.has(c)); if (MODE !== 'replay') { try { const ta = countryTiers(), up = Object.keys(ta).filter(cc => ta[cc] > (_tb[cc] || 0) && ta[cc] < 3); if (up.length) { const cc = up[0], nm = (COUNTRY[cc] || cc).toLowerCase(), md = ['', 'bronze', 'silver'][ta[cc]]; setTimeout(() => { try { toast(`${nm} · ${md} ✦`); buzz(8); } catch (e) {} }, 2200); } } catch (e) {} }
  if (nw.length && MODE !== 'replay') { CMP_PEND = nw[0]; const FP = save.freePk || (save.freePk = {}); FP.rare = (FP.rare || 0) + nw.length; } } catch (e) {} }
  { const P = chParts(); if (P.v > 100) { save.wr = Math.round((P.v - 100) * 50); save.eye = 100; } else { save.wr = 0; save.eye = Math.round(P.v * 10) / 10; } dEye = Math.round((save.eye - eye0) * 10) / 10; save.eyeBest = Math.max(save.eyeBest ?? 0, save.eye); if (save.eyeHist && save.eyeHist.length) save.eyeHist[save.eyeHist.length - 1] = save.eye; if (save.eyeAll && save.eyeAll.length) save.eyeAll[save.eyeAll.length - 1] = save.eye; }
  const flyNew = pct >= 50 && !!atlasOf(target.name) && !(save.flown || []).includes(target.name); if (flyNew) save.flown = (save.flown || []).concat(target.name);
  const nDrops = glassLog.length || drops; { const g = {}; let w = 0; glassLog.forEach(i => { const d = DYES[i]; if (!d) return; if (d.water) w++; else g[d.name] = (g[d.name] || 0) + 1; }); save.dnaHist = (save.dnaHist || []).concat([{ d: g, w, n: glassLog.length, p: pct, st: Math.round(glassStir * 10) / 10 }]).slice(-20); } glassStir = 0; if (isRep) {} else if (daily) save.wipD = null; else save.wip = null; glassLog = [];
  { const td = new Date().toDateString(); if (save.lastPlay !== td) { save.lastPlay = td; save.daysN = (save.daysN || 0) + 1; } save.last10 = (save.last10 || []).concat(pct).slice(-10); }
  const newBadges = checkBadges(pct); const newSets = checkSets();
  persist();
  SPLIT = { t: 0 };
  $('rVerd').textContent = pct >= 100 ? 'perfect' : pct >= 95 ? 'spot on' : pct >= 85 ? 'great job' : pct >= 70 ? 'well done' : pct >= 50 ? 'decent' : 'not quite'; if (hCut) $('rVerd').insertAdjacentHTML('beforeend', `<span class="rhint">hint −${hCut}% · mixed ${pct0}%</span>`); $('rVerd').classList.remove('on'); { const s0 = STARS(prevBest), s1 = STARS(Math.max(prevBest, pct)), rs = $('rStars'); rs.classList.remove('on'); rs.innerHTML = [0, 1, 2].map(i => `<i class="${i < s1 ? 'f' : ''}${i >= s0 && i < s1 ? ' nw' : ''}" style="animation-delay:${.15 + (i - s0) * .18}s">★</i>`).join(''); rs._new = s1 > s0; } $('rPct').textContent = '0'; const rv = $('rev'); rv.style.top = Math.round(G.top + G.gh * 0.42 - 50) + 'px'; rv.style.opacity = '0'; rv.hidden = false;
  const rec = $('rRec'); rec.innerHTML = '';
  target.recipe.forEach(r => { const w = document.createElement('div'); w.className = 'rb2'; const bd = document.createElement('span'); bd.className = 'bd'; bd.style.setProperty('--c', css(DYES[r.i].rgb)); bd.style.setProperty('--cd', css(DYES[r.i].dark)); w.append(bd, '×' + r.n); rec.appendChild(w); });
  if (target.dil) { const w = document.createElement('div'); w.className = 'rb2'; const bd = document.createElement('span'); bd.className = 'bd water'; w.append(bd, '×' + target.dil * 3); rec.appendChild(w); }
  if (0) { const w = document.createElement('div'); w.className = 'rb2'; w.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"><path d="M12 3.5s5.5 6 5.5 10.2a5.5 5.5 0 0 1-11 0C6.5 9.5 12 3.5 12 3.5z"/></svg>'; w.append('½' + (target.dil > 1 ? ' ×' + target.dil : '')); rec.appendChild(w); }
  $('rWhy').textContent = missLine(pct, yours, target, used.get(WATER) || 0);
  { const ad = atlasOf(target.name); const pl = $('rPlace'); if (!flyNew && pct >= 50 && ad) { pl.innerHTML = `${placeBadge(ad, 'pflag')}${target.name} · ${placeText(ad)} — ${ad[5]}`; pl.hidden = false; pl.style.animation = 'none'; void pl.offsetWidth; pl.style.animation = ''; } else pl.hidden = true;
    $('rNew').hidden = true; }
  const dl = $('rDelta');
  if (isRep) msg = 'replay ★'; else if (daily) msg = `daily #${day}`;
  { $('rEye').textContent = 'eye ' + fmtC(save.eye) + (save.eye >= 100 ? ' · world ranked' : ''); dl.textContent = fmtD(dEye); dl.className = dEye > 0 ? 'up' : 'dn'; }
  $('rHex').textContent = `ΔE ${dE.toFixed(1)} · ${rgbToHex(target.rgb).toLowerCase()}`; $('rTap').textContent = `ΔE ${dE.toFixed(1)} · ${rgbToHex(target.rgb).toUpperCase()} · tap to continue`;
  const rr = $('rRank'), parts = [];
  if (rankOf(save.eye)[0] < rankOf(eye0)[0]) parts.push(`<span style="color:var(--muted)">rank: ${rankOf(save.eye)[1]}</span>`);
  const moments = (rankUp ? [{ rank: rankOf(save.eye) }] : []).concat(newBadges); if (rankUp && !ACCOUNT.signedIn() && !save.acctAsk2) { save.acctAsk2 = 1; setTimeout(() => { const w = setInterval(() => { if ($('bMom').hidden && $('res').classList.contains('ready')) { clearInterval(w); openAccountSheet(false, 'lb'); } }, 400); setTimeout(() => clearInterval(w), 20000); }, 2600); }
  if (msg) parts.push(msg);
  rr.innerHTML = parts.join(' · '); rr.hidden = !parts.length;
  const dd = new Date(); if (daily && !isRep) { const line = document.createElement('div'); line.className = 'dwb'; line.textContent = SB.signedIn() ? 'checking the world…' : 'sign in to see how the world did'; rr.appendChild(line); rr.hidden = false; if (SB.signedIn()) SB.postDaily(day, pct).then(r => { if (!r) { line.textContent = ''; return; } const n = Math.max(1, r.n || 1), beat = n > 1 ? Math.round(100 * (r.below || 0) / (n - 1)) : 100; save.daily.beat = beat; persist(); line.innerHTML = `you beat <b>${beat}%</b> of the world today · ${n.toLocaleString('en-US')} ${n === 1 ? 'player' : 'players'}`; SB.dailyDist(day).then(D => { if (!D || !D.length || !line.isConnected) return; const mx = Math.max(1, ...D), mb = Math.min(19, Math.floor(pct / 5)), h = document.createElement('div'); h.className = 'dwh'; h.innerHTML = D.map((v, k) => `<i class="${k === mb ? 'me' : ''}" style="height:2px"></i>`).join(''); line.after(h); requestAnimationFrame(() => requestAnimationFrame(() => h.querySelectorAll('i').forEach((el, k) => el.style.height = Math.max(2, Math.round(D[k] / mx * 34)) + 'px'))); }).catch(() => {}); }).catch(() => { line.textContent = 'world board offline right now'; }); }
  if (daily && !isRep) { const db = document.createElement('button'); db.className = 'sharebtn'; db.textContent = 'share'; db.addEventListener('click', ev => { ev.stopPropagation(); sharePostcard({ name: target.name, mix: yours, tgt: target.rgb, pct, date: Date.now(), day }); }); rr.appendChild(document.createElement('br')); rr.appendChild(db); rr.hidden = false; }
  lastShare = { rgb: target.rgb, y: yours, day: daily ? day : 0, name: target.name, pct, date: daily ? dd.toLocaleString('en-US', { month: 'short' }).toLowerCase() + ' ' + dd.getDate() : '' };
  $('shareIc').hidden = !daily || isRep;
  $('res').hidden = false; $('res').classList.remove('ready'); resReady = false;
  const pe = $('rPct'), tk = v => { pe.textContent = v; dripSnd(0.6 + v / 100 * 1.4, 0.07); buzz(4); };
  const land = () => {
    if (rid !== REV_ID || state !== 'result') return;
    $('rVerd').classList.add('on'); $('rStars').classList.add('on'); if ($('rStars')._new) { $('rStars').querySelectorAll('i.nw').forEach((el, n) => revT(() => { starBurst(el); if (n === 0) { clink(); haptic([8, 30, 8]); } else buzz(5); }, 330 + n * 180)); } if (newSets.length) revT(() => { const [t, k] = newSets[newSets.length - 1]; toast(k >= 3 ? `collection complete · ${t}` : `${t} · ${k}/3`); }, 1400); haptic(15); pe.parentNode.style.setProperty('--f', '102%'); if (SPLIT) { if (pct >= 95) { SPLIT.fuse = SPLIT.t; haptic([12, 40, 30]); } else SPLIT.gap = SPLIT.t; } pe.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.12)' }, { transform: 'scale(1)' }], { duration: 380, easing: 'cubic-bezier(.3,1.6,.5,1)' });
    payoff(pct, yours); DRIP.onResult(pct, yours);
    if (msg && !daily) revT(() => { chord(); buzz([20, 30, 20]); for (let i = 0; i < 50; i++) { const a = Math.random() * Math.PI * 2, v = 250 + Math.random() * 380; burst.push({ x: G.cx, y: G.y0, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 150, r: 1.5 + Math.random() * 3.5, t: 0, col: DYES[(Math.random() * DYES.length) | 0].rgb.map(v => v * 255) }); } DRIP.say('milestone'); }, 700); revT(() => { resReady = true; $('res').classList.add('ready'); }, pct === 100 ? 2600 : 2000);
    revT(() => { holdCoins = false; eyeTick(eye0, save.eye); }, 700);
    if (moments.length) revT(() => badgeMoment(moments), 1600);
    if (flyNew) { const nm = target.name, fx = { n: nm, h: rgbToHex(target.rgb), p: pct, d: Date.now() }; resReady = false; revT(() => { if (!$('bMom').hidden || moments.length) { const w = setInterval(() => { if ($('bMom').hidden) { clearInterval(w); flyIn(nm, fx); } }, 200); } else flyIn(nm, fx); }, moments.length ? 2000 : 1500); }
  };
  revT(() => {
    if (rid !== REV_ID) return;
    $('rev').style.opacity = '1'; $('rPct').parentNode.style.setProperty('--f', '0%');
    const dec = pct < 100, I = Math.floor(pct), nI = String(I).length, P0 = dec ? -1 : 0, cols = [];
    pe.innerHTML = ''; const mk = pl => { const c = document.createElement('span'); c.className = 'odc'; const r = document.createElement('span'); r.className = 'odr'; r.innerHTML = '0123456789'.split('').concat('0').map(d => `<b>${d}</b>`).join(''); c.appendChild(r); pe.appendChild(c); cols.push({ pl, c, r }); };
    for (let j = nI - 1; j >= 0; j--) mk(j); if (dec) { const d = document.createElement('span'); d.className = 'odd'; d.textContent = '.'; pe.appendChild(d); mk(-1); }
    const setX = (x, exact) => { let prev = 0; for (let n = cols.length - 1; n >= 0; n--) { const o = cols[n], q = x / Math.pow(10, o.pl); let pos; if (exact) pos = Math.floor(Math.round(x * 10) / Math.pow(10, o.pl + 1) + 1e-6) % 10; else if (o.pl === P0) pos = q % 10; else pos = (Math.floor(q + 1e-6) % 10) + (prev >= 9 ? prev - 9 : 0); prev = pos; o.r.style.transform = `translateY(${(-pos).toFixed(3)}em)`; if (o.pl > 0) o.c.style.opacity = x >= Math.pow(10, o.pl) - .5 || exact ? '1' : '.18'; } };
    setX(0); const t0 = performance.now(), FD = 1250 + pct * 4; let lastU = -1, lastS = 0;
    const fast = now => {
      if (rid !== REV_ID) return; // reveal was cancelled mid count-up
      const k = clamp((now - t0) / FD, 0, 1), x = pct * (1 - Math.pow(1 - k, 3.2));
      setX(x, k >= 1); pe.parentNode.style.setProperty('--f', x.toFixed(1) + '%');
      const u = Math.floor(x * (k > .8 ? 10 : 1)); if (u !== lastU && now - lastS > 45) { lastU = u; lastS = now; dripSnd(0.6 + x / 100 * 1.4, 0.05); buzz(3); }
      if (k < 1) requestAnimationFrame(fast); else land();
    };
    requestAnimationFrame(fast);
  }, 1050);
}
let GLOW = null, CAU = null, fluidAcc2 = 0, fgAcc = 0, fgFlip = false, WET = 0; const mbub = [], mpop = [], glints = [], wdrops = []; const burst = [];
let SWEEP = null;
function bell() { return; const a = audio(); if (!a) return; const t = a.currentTime; [[1568, .16], [3136, .05], [4704, .02]].forEach(([f, v]) => { const o = a.createOscillator(), g = a.createGain(); o.type = 'sine'; o.frequency.value = f; g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(v, t + .01); g.gain.exponentialRampToValueAtTime(.0001, t + 2.6); o.connect(g).connect(a.destination); o.start(t); o.stop(t + 2.7); }); }
function payoff(pct, yours) {
  const sy = G.y0, tc = target.rgb;
  if (pct < 65) { chime(false); return; }
  if (pct < 90) { for (let i = 0; i < 3; i++) ripples.push({ x: G.cx + (i - 1) * G.iw * 0.28, t: -i * 0.12 }); chime(false); buzz(10); return; }
  if (pct >= 95) { SWEEP = { t: 0 }; chime(true); if (pct === 100) setTimeout(() => { bell(); haptic([50, 30, 50, 30, 160]); }, 260); return; }
  const big = pct >= 97, n = big ? 70 : 10;
  GLOW = { t: 0, a: big ? 1 : 0.45, col: tc };
  for (let i = 0; i < n; i++) {
    const a = big ? Math.random() * Math.PI * 2 : -Math.PI / 2 + (Math.random() - .5) * 1.4, v = (big ? 260 : 180) + Math.random() * (big ? 420 : 160);
    burst.push({ x: G.cx + (Math.random() - .5) * G.iw * (big ? .8 : .5), y: big ? sy + Math.random() * (G.y1 - sy) * .6 : sy, vx: Math.cos(a) * v, vy: Math.sin(a) * v - (big ? 120 : 0), r: 1.5 + Math.random() * (big ? 4 : 2.5), t: 0, col: tc });
  }
  ripples.push({ x: G.cx, t: 0 });
  if (big) { chord(); buzz([30, 40, 30, 40, 80]); } else { chime(true); buzz([10, 40, 10]); }
  if (pct === 100) { SWEEP = { t: 0 }; setTimeout(() => { bell(); buzz([50, 30, 50, 30, 160]); }, 260); }
}

function levelMoment(L, done) { const el = $('lvUp'), eye = save.eye ?? 0, snap = save.lvSnap && save.lvSnap.l < L ? save.lvSnap : null, base = snap ? snap.e : ((save.eyeAll || []).slice(-11)[0] ?? eye), d = Math.round((eye - base) * 10) / 10, step = L < 100 ? 10 : L < 1000 ? 25 : 50, nx = Math.ceil((L + 1) / step) * step;
  el.innerHTML = `<div class="lglow"></div><i class="lrip"></i><i class="lrip b"></i><div class="lk">level</div><div class="ln" id="lvN">${L}</div><div class="lch"><small>eye</small><span>${fmtChroma(eye)}</span><span class="${d >= 0 ? 'up' : 'dn'}">${d >= 0 ? '▲ +' : '▼ '}${Math.abs(d).toFixed(1)}</span></div><div class="lnx">${snap ? `since level ${snap.l}` : `over your last ${Math.min(10, L)} levels`} · next stop level ${nx}</div><div class="lbar"><i></i></div><div class="ltap">tap to continue</div>`;
  el.hidden = false; el.classList.remove('bye', 'lit'); const N = $('lvN'); let t0 = 0; const FD = 1100;
  const fill = now => { if (!t0) t0 = now; const k = clamp((now - t0) / FD, 0, 1), e = 1 - Math.pow(1 - k, 3); N.style.setProperty('--lf', (e * 100).toFixed(1) + '%'); if (k < 1 && !el.hidden) requestAnimationFrame(fill); else { N.classList.add('full'); el.classList.add('lit'); el.querySelector('.lbar i').style.width = '100%'; try { chord(); } catch (x) {} haptic([14, 40, 14, 40, 26]); } };
  setTimeout(() => requestAnimationFrame(fill), 450); buzz(6);
  save.lvSnap = { l: L, e: eye }; persist();
  let ok = false; setTimeout(() => ok = true, 1500);
  el.onclick = e => { e.stopPropagation(); if (!ok) return; el.onclick = null; buzz(5); el.classList.add('bye'); setTimeout(() => { el.hidden = true; el.innerHTML = ''; done && done(); }, 560); }; }
function fmtChroma(v) { return (Math.round((v || 0) * 10) / 10).toFixed(1); }
function next() {
  if (CMP_PEND && !cmpBusy) { const cc = CMP_PEND; CMP_PEND = null; resReady = false; countryMoment(cc, () => { resReady = true; next(); }); return; }
  if (MODE === 'replay') { resetGlass(); MODE = 'level'; REPLAY = null; started = false; goTab('atlas'); return; }
  if (MODE === 'daily') { resetGlass(); MODE = 'level'; started = false; showHome(); setNav('home'); return; }
  if (nexting) return; nexting = true; resReady = false; clearRevT(); $('shareIc').hidden = true;
  const rs = $('res'); rs.style.transition = 'opacity .4s ease, transform .5s cubic-bezier(.4,0,.6,1)'; rs.style.opacity = '0'; rs.style.transform = 'translateY(24px)'; $('rev').style.opacity = '0'; if (SPLIT) SPLIT.out = 0;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  setTimeout(() => {
    rs.hidden = true; rs.style.opacity = ''; rs.style.transform = ''; rs.style.transition = ''; $('rev').hidden = true; GLOW = null; SPLIT = null; holdCoins = false;
    state = 'play'; const flow = !reduce && fluidOK; emptyGlass(true); if (flow) { emptying = 0; DRAIN = { t: 0, lvl: G.y0 }; } DRIP.clearTint();
    const L = save.level - 1, every = L < 100 ? 10 : L < 1000 ? 25 : 50; const go = () => setTimeout(() => { nexting = false; if (flow) { DRAIN = null; fluidC.style.clipPath = ''; meanA = [0, 0, 0]; wCount = 0; unmixed = 0; try { if (fluidOK) scaleDye(0); } catch (e) {} } setTarget(); updateStat(); }, flow ? 920 : 300); if (L > 1 && L % every === 0 && !(save.lvSeen >= L)) { save.lvSeen = L; levelMoment(L, go); } else go();
  }, 400);
}
let nexting = false;
$('shareIc').addEventListener('click', e => { e.stopPropagation(); showShare(); });
document.addEventListener('pointerdown', e => { const b = e.target.closest && e.target.closest('button'); if (b && !b.closest('#strip')) buzz(6); }, true);
$('app').addEventListener('pointerdown', e => { if (state === 'result' && resReady && !nexting && !e.target.closest('button,.ov,.home,.intro,.bmom,.story')) next(); });

/* ================= Glass & effects drawing ================= */
function drawFG(dt) {
  const c = fgx; c.setTransform(DPR, 0, 0, DPR, 0, 0); c.clearRect(0, 0, SW, SH);
  const vis = 1 - 0.85 * unmixed;
  const T = transmit(meanA.map(v => v * vis)), Td = powc(T, 1.8), tint = 1 - (T[0] + T[1] + T[2]) / 3;
  const { gx, gw, gh, cx, top, bottom, wt, ry, iw, ryIn, y1 } = G; const y0 = DRAIN ? DRAIN.lvl : G.y0;
  const PI = Math.PI;

  // colored light pool + reflection on the table
  { const tt = performance.now() / 1000, cs = 1 + .06 * Math.sin(tt * .7), cxo = Math.sin(tt * .45) * gw * .03, tc2 = tint > .01 ? T : [1, 1, 1];
    c.save(); c.translate(cx + cxo, bottom + ry * .9); c.scale(1, 0.24);
    const cg = c.createRadialGradient(0, 0, 0, 0, 0, gw * .62 * cs); cg.addColorStop(0, css(tc2, .14)); cg.addColorStop(.5, css(tc2, .05)); cg.addColorStop(1, css(tc2, 0));
    c.fillStyle = cg; c.beginPath(); c.arc(0, 0, gw * .62 * cs, 0, PI * 2); c.fill(); c.restore(); }
  if (tint > 0.01) {
    const lum = (T[0] + T[1] + T[2]) / 3;
    const boost = T.map(v => clamp(lum + (v - lum) * 1.7, 0, 1));
    c.save(); c.translate(cx + gw * 0.08, bottom + ry * 1.9); c.scale(1, 0.2);
    const g = c.createRadialGradient(0, 0, 0, 0, 0, gw * 0.8);
    g.addColorStop(0, css(boost, 0.55 * Math.min(1, tint * 1.6))); g.addColorStop(1, css(boost, 0));
    c.fillStyle = g; c.beginPath(); c.arc(0, 0, gw * 0.8, 0, PI * 2); c.fill(); c.restore();
  }

  // caustics: light focused through the water onto the table
  try { if (!CAU) { const n = 160, o = document.createElement('canvas'); o.width = o.height = n; const k = o.getContext('2d'), im = k.createImageData(n, n), P2 = PI * 2;
      for (let yy = 0; yy < n; yy++) for (let xx = 0; xx < n; xx++) { const u = xx / n * P2, v = yy / n * P2; const f = Math.sin(u * 2 + Math.sin(v * 3) * 1.4) + Math.sin(v * 2 + Math.sin(u * 3 + 1) * 1.3) + Math.sin(u + v + Math.sin(u * 2 - v) * 1.6); const q = Math.pow(clamp(1 - Math.abs(f) / 1.25, 0, 1), 5); const j = (yy * n + xx) * 4; im.data[j] = im.data[j + 1] = im.data[j + 2] = 255; im.data[j + 3] = Math.round(q * 255); }
      k.putImageData(im, 0, 0); CAU = { tile: o, c: document.createElement('canvas') }; }
    const tt = performance.now() / 1000, R = gw * .56, Dp = Math.min(2, DPR), sz = Math.ceil(R * 2 * Dp), oc = CAU.c; if (oc.width !== sz) { oc.width = oc.height = sz; CAU.pat = null; }
    const k = oc.getContext('2d'); k.setTransform(1, 0, 0, 1, 0, 0); k.globalCompositeOperation = 'source-over'; k.clearRect(0, 0, sz, sz); k.globalCompositeOperation = 'lighter';
    const pat = CAU.pat || (CAU.pat = k.createPattern(CAU.tile, 'repeat')), en = clamp(SURF.E || 0, 0, 1), sp = 1 + en * 2.2;
    [[.9 * Dp, 9, 5, .9], [.62 * Dp, -6, 8, .7]].forEach(([sc, vx, vy, al], li) => { const ph = tt * sp; pat.setTransform(new DOMMatrix().translateSelf(vx * ph * Dp + li * 37, vy * ph * Dp + li * 53).rotateSelf(li * 23 + Math.sin(tt * .2) * 6).scaleSelf(sc)); k.globalAlpha = al; k.fillStyle = pat; k.fillRect(0, 0, sz, sz); });
    k.globalAlpha = 1; const tc = tint > .01 ? T.map(v => clamp(.25 + v * .9, 0, 1)) : [1, 1, 1]; k.globalCompositeOperation = 'source-in'; k.fillStyle = css(tc); k.fillRect(0, 0, sz, sz);
    k.globalCompositeOperation = 'destination-in'; const fg2 = k.createRadialGradient(sz / 2, sz / 2, 0, sz / 2, sz / 2, sz / 2); fg2.addColorStop(0, 'rgba(0,0,0,1)'); fg2.addColorStop(.55, 'rgba(0,0,0,.55)'); fg2.addColorStop(1, 'rgba(0,0,0,0)'); k.fillStyle = fg2; k.fillRect(0, 0, sz, sz);
    { const nw = performance.now(); if (!window.__clT || nw - window.__clT > 250) { window.__clT = nw; let k = 0; try { if (target && drops > 0 && (state === 'play' || state === 'mixing')) { const dE = dE00(toLab(target.rgb), toLab(displayColor(meanA))); k = Math.exp(-Math.pow(dE / 18, 2)); } } catch (e) {} window.__clK = k; } window.__clS = (window.__clS || 0) + ((window.__clK || 0) - (window.__clS || 0)) * .08; }
    { const ck = window.__clS || 0; if (ck > .02) { c.save(); c.globalCompositeOperation = 'lighter'; c.globalAlpha = ck * .5; const cg = c.createRadialGradient(cx, bottom + ry * 1.15, 0, cx, bottom + ry * 1.15, R * (1.1 - ck * .45)); const tc = displayColor(meanA); cg.addColorStop(0, css(tc, .55)); cg.addColorStop(.35 + ck * .4, css(tc, .22)); cg.addColorStop(1, css(tc, 0)); c.fillStyle = cg; c.beginPath(); c.ellipse(cx, bottom + ry * 1.15, R * (1.1 - ck * .45), R * (1.1 - ck * .45) * .25, 0, 0, Math.PI * 2); c.fill(); if (ck > .9 && target) { c.globalAlpha = (ck - .9) * 6; c.strokeStyle = css(target.rgb, .7); c.lineWidth = 1.5; c.beginPath(); c.ellipse(cx, bottom + ry * 1.15, R * .42, R * .42 * .25, 0, 0, Math.PI * 2); c.stroke(); } c.restore(); } }
    c.save(); c.globalCompositeOperation = 'lighter'; c.globalAlpha = (LIGHT_BG[save.bg] ? .1 : .2) + en * .16; c.translate(cx + Math.sin(tt * .45) * gw * .03, bottom + ry * 1.15); c.scale(1, .25); c.drawImage(oc, -R, -R, R * 2, R * 2); c.restore();
  } catch (e) {}

  // fallback water when WebGL is unavailable
  if (!fluidOK) {
    c.save(); c.beginPath(); c.ellipse(cx, y0, iw / 2, ryIn, 0, PI, 0, false); c.lineTo(gx + wt + iw, y1); c.ellipse(cx, y1, iw / 2, ryIn, 0, 0, PI, false); c.closePath();
    const L = LIGHT_BG[save.bg] ? 1 : 0.72; c.fillStyle = css([T[0] * 0.985 * L, T[1] * 0.993 * L, T[2] * L], 1); c.globalAlpha = 0.14 + 0.81 * Math.min(1, tint * 2.5); c.fill(); c.restore();
  }

  if (!DRAIN) { c.save(); c.globalAlpha = .25 + .75 * Math.min(1, tint * 2.5); drawRefr(c, T); c.restore(); }
  // walls: water-tinted where the water is
  for (const side of [0, 1]) {
    const x0 = side ? gx + gw - wt : gx;
    { const yw = y0 + surfH(side ? 0 : PI); if (tint > 0.005 || yw < y0 - .5) { c.fillStyle = css(tint > 0.005 ? Td : displayColor(meanA), 0.6); c.fillRect(x0, yw, wt, y1 - yw); } }
    const g = c.createLinearGradient(side ? gx + gw : gx, 0, side ? gx + gw - wt * 1.8 : gx + wt * 1.8, 0);
    g.addColorStop(0, 'rgba(26,38,52,0.30)'); g.addColorStop(0.3, 'rgba(255,255,255,0.62)'); g.addColorStop(1, 'rgba(255,255,255,0)');
    c.fillStyle = g; c.fillRect(side ? gx + gw - wt * 1.8 : gx, top, wt * 1.8, bottom - top);
  }
  // empty glass above the water
  const ag = c.createLinearGradient(0, top, 0, y0);
  ag.addColorStop(0, 'rgba(255,255,255,0.10)'); ag.addColorStop(1, 'rgba(255,255,255,0.02)');
  c.fillStyle = ag; c.fillRect(gx + wt, top, iw, y0 - top);

  // base (thick glass floor refracting the water color)
  c.beginPath(); c.moveTo(gx, y1); c.lineTo(gx, bottom);
  c.ellipse(cx, bottom, gw / 2, ry, 0, PI, 0, true);
  c.lineTo(gx + gw, y1); c.ellipse(cx, y1, iw / 2, ryIn, 0, 0, PI, false); c.closePath();
  const bg = c.createLinearGradient(0, y1, 0, bottom + ry);
  bg.addColorStop(0, css(Td, 0.10 + 0.5 * Math.min(1, tint * 1.4)));
  bg.addColorStop(0.45, css(T, 0.12 + 0.25 * Math.min(1, tint * 1.4)));
  bg.addColorStop(0.75, 'rgba(255,255,255,0.35)'); bg.addColorStop(1, 'rgba(28,40,55,0.22)');
  c.fillStyle = bg; c.fill();
  c.lineWidth = 1.2;
  c.strokeStyle = 'rgba(255,255,255,0.75)'; c.beginPath(); c.ellipse(cx, y1, iw / 2, ryIn, 0, 0, PI); c.stroke();
  c.strokeStyle = 'rgba(28,40,55,0.30)'; c.beginPath(); c.ellipse(cx, bottom, gw / 2, ry, 0, 0, PI); c.stroke();
  c.strokeStyle = 'rgba(255,255,255,0.8)'; c.beginPath(); c.ellipse(cx, bottom - 2, gw / 2 - 2, ry - 1, 0, 0.15 * PI, 0.85 * PI); c.stroke();

  if (!SPLIT && y1 - y0 > 8) { const xl = cx - iw / 2, yt = y0 + ryIn, hh = y1 - yt;
    const st = c.createLinearGradient(xl + iw * .1, 0, xl + iw * .32, 0); st.addColorStop(0, 'rgba(255,255,255,0)'); st.addColorStop(.45, 'rgba(255,255,255,.24)'); st.addColorStop(.55, 'rgba(255,255,255,.24)'); st.addColorStop(1, 'rgba(255,255,255,0)');
    const vf = c.createLinearGradient(0, yt, 0, y1); c.save(); c.globalAlpha = 1; c.fillStyle = st; c.fillRect(xl + iw * .1, yt, iw * .22, hh);
    for (const sd of [0, 1]) { const x0 = sd ? xl + iw : xl, x1 = sd ? xl + iw * .9 : xl + iw * .1, eg = c.createLinearGradient(x0, 0, x1, 0); eg.addColorStop(0, 'rgba(8,14,22,.26)'); eg.addColorStop(1, 'rgba(8,14,22,0)'); c.fillStyle = eg; c.fillRect(Math.min(x0, x1), yt, iw * .1, hh); }
    c.restore(); }
  // water surface
  const sg = c.createLinearGradient(0, y0 - ryIn, 0, y0 + ryIn);
  sg.addColorStop(0, 'rgba(255,255,255,0.45)'); sg.addColorStop(1, 'rgba(255,255,255,0.06)');
  { const wc = displayColor(meanA); c.save(); surfPath(c, 0, 0, PI * 2); c.closePath(); c.ellipse(cx, y0, iw / 2, ryIn, 0, 0, PI * 2); c.fillStyle = css(wc, .22 + .74 * Math.min(1, tint * 2.5)); c.fill('evenodd'); c.restore(); }
  surfPath(c, 0, 0, PI * 2); c.closePath();
  if (tint > 0.005) { c.fillStyle = css(T, 0.5); c.fill(); }
  c.fillStyle = sg; c.fill();
  if (SURF.d > 1) { const fy = y0 + SURF.d / 3, rg = c.createRadialGradient(cx, fy, ryIn * .2, cx, fy, iw * .42); rg.addColorStop(0, 'rgba(255,255,255,0)'); rg.addColorStop(.55, `rgba(255,255,255,${Math.min(.16, SURF.d * .012)})`); rg.addColorStop(1, 'rgba(255,255,255,0)'); c.save(); surfPath(c, 0, 0, PI * 2); c.closePath(); c.clip(); c.translate(cx, fy); c.scale(1, ryIn / (iw * .42)); c.translate(-cx, -fy); c.fillStyle = rg; c.fillRect(cx - iw, fy - iw, iw * 2, iw * 2); c.restore(); }
  c.save(); surfPath(c, 0, 0, PI * 2); c.closePath(); c.clip();
  for (const r of ripples) {
    const k = r.t / 1.1, rad = 4 + k * iw * 0.55;
    for (const off of [0, 0.18]) {
      const kk = k - off; if (kk < 0) continue;
      const rr = 4 + kk * iw * 0.55;
      c.strokeStyle = `rgba(255,255,255,${0.75 * (r.a || 1) * (1 - kk)})`; c.lineWidth = 1.3;
      c.beginPath(); c.ellipse(r.x, y0, rr, rr * 0.15, 0, 0, PI * 2); c.stroke();
    }
  }
  if (false && rod && rod.py > y0) { // dimple where the rod meets the surface
    c.strokeStyle = 'rgba(255,255,255,0.7)'; c.lineWidth = 1;
    c.beginPath(); c.ellipse(rod.sx, y0, 9, 2, 0, 0, PI * 2); c.stroke();
  }
  c.restore();
  c.lineWidth = 1;
  c.strokeStyle = 'rgba(28,40,55,0.22)'; surfPath(c, 0, PI, PI * 2); c.stroke();
  c.strokeStyle = 'rgba(255,255,255,0.92)'; c.lineWidth = 1.5; surfPath(c, 0, 0, PI); c.stroke();
  if (tint > 0.005) { c.strokeStyle = css(Td, 0.45); c.lineWidth = 1; surfPath(c, 1.6, 0.05 * PI, 0.95 * PI); c.stroke(); }

  trail.length = 0;
  // bubbles
  for (const b of bubbles) {
    const al = Math.max(0, 1 - (b.t || 0) / .8) * .8, rr = Math.min(1.4, b.r * .6);
    const bg = c.createRadialGradient(b.x, b.y, 0, b.x, b.y, rr * 2.2); bg.addColorStop(0, `rgba(255,255,255,${al})`); bg.addColorStop(1, 'rgba(255,255,255,0)');
    c.fillStyle = bg; c.beginPath(); c.arc(b.x + Math.sin(b.ph) * 1.2, b.y, rr * 2.2, 0, PI * 2); c.fill();
  }

  // micro bubbles from hard stirring: rise, wobble with the swirl, pop at the surface
  { const ddt = Math.min(dt, .05); c.save(); c.beginPath(); c.ellipse(cx, y0, iw / 2, ryIn, 0, PI, 0, false); c.lineTo(gx + wt + iw, y1); c.ellipse(cx, y1, iw / 2, ryIn, 0, 0, PI, false); c.closePath(); c.clip();
    for (let i = mbub.length - 1; i >= 0; i--) { const b = mbub[i]; b.t += ddt; b.vy += 22 * ddt; b.y -= b.vy * ddt; b.ph += ddt * (6 + b.r * 2); b.x += (Math.sin(b.ph) * 6 + spinW * (b.y - (y0 + y1) / 2) * -.25) * ddt; b.x = clamp(b.x, G.wx + 4, G.wx + G.ww - 4);
      if (b.y <= y0 + 1.5 || b.t > 6) { if (b.y <= y0 + 1.5) mpop.push({ x: b.x, t: 0, r: b.r }); mbub.splice(i, 1); continue; }
      const al = Math.min(1, b.t * 4) * .7, rr = b.r; c.strokeStyle = `rgba(255,255,255,${al * .75})`; c.lineWidth = .7; c.beginPath(); c.arc(b.x, b.y, rr, 0, PI * 2); c.stroke(); c.fillStyle = `rgba(255,255,255,${al * .9})`; c.beginPath(); c.arc(b.x - rr * .35, b.y - rr * .35, Math.max(.35, rr * .32), 0, PI * 2); c.fill(); }
    c.restore();
    for (let i = mpop.length - 1; i >= 0; i--) { const q = mpop[i]; q.t += ddt; if (q.t > .35) { mpop.splice(i, 1); continue; } const k = q.t / .35, rr = q.r + k * 5; c.strokeStyle = `rgba(255,255,255,${.6 * (1 - k)})`; c.lineWidth = .8; c.beginPath(); c.ellipse(q.x, y0 + surfH(Math.PI / 2) * .3, rr, rr * .3, 0, 0, PI * 2); c.stroke(); } }
  // surface sparkle: glints of light that dance when the water moves
  { const ddt = Math.min(dt, .05), E = clamp(SURF.E || 0, 0, 1), rate = (state === 'result' ? 1 : 2.5) + E * 38 + (ripples.length ? 6 : 0); let n = rate * ddt; while (n > 0) { if (Math.random() < n) { const th = Math.random() * PI * 2, rr = Math.sqrt(Math.random()), lx = cx + Math.cos(th) * iw / 2 * rr * .94, ly = y0 + Math.sin(th) * ryIn * rr * .9; if (glints.length < 40 && (lx < cx + iw * .15 || Math.random() < .35)) glints.push({ x: lx, y: ly, t: 0, L: .18 + Math.random() * .35, s: 1.4 + Math.random() * 2.4 + E * 1.5 }); } n -= 1; }
    c.save(); c.globalCompositeOperation = 'lighter';
    for (let i = glints.length - 1; i >= 0; i--) { const g = glints[i]; g.t += ddt; if (g.t > g.L) { glints.splice(i, 1); continue; } const k = Math.sin(g.t / g.L * PI), sz = g.s * k; c.strokeStyle = `rgba(255,255,255,${.85 * k})`; c.lineWidth = .8; c.beginPath(); c.moveTo(g.x - sz, g.y); c.lineTo(g.x + sz, g.y); c.moveTo(g.x, g.y - sz * .55); c.lineTo(g.x, g.y + sz * .55); c.stroke(); c.fillStyle = `rgba(255,255,255,${.9 * k})`; c.beginPath(); c.arc(g.x, g.y, .7 + sz * .18, 0, PI * 2); c.fill(); }
    c.restore(); }
  // meniscus: the water climbs the wall a touch, catching a bright line
  { const xl = cx - iw / 2, xr = cx + iw / 2, mh = 3.2 + 1.2 * clamp(SURF.E || 0, 0, 1); c.save();
    for (const [xe, dir] of [[xl, 1], [xr, -1]]) { const yb = y0 + surfH(dir > 0 ? Math.PI : 0); const g = c.createLinearGradient(0, yb - mh, 0, yb + 1); g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(1, 'rgba(255,255,255,.55)'); c.fillStyle = g; c.beginPath(); c.moveTo(xe, yb - mh); c.quadraticCurveTo(xe + dir * 1.2, yb - 1, xe + dir * 9, yb + .4); c.lineTo(xe, yb + .8); c.closePath(); c.fill();
      c.strokeStyle = 'rgba(255,255,255,.7)'; c.lineWidth = 1; c.beginPath(); c.moveTo(xe + dir * .4, yb - mh); c.quadraticCurveTo(xe + dir * 1.2, yb - .6, xe + dir * 11, yb + .5); c.stroke(); }
    c.strokeStyle = 'rgba(255,255,255,.14)'; c.lineWidth = 3; surfPath(c, 2.2, .08 * PI, .92 * PI); c.stroke(); c.restore(); }

  if (SPLIT && target) {
    SPLIT.t += dt; c.globalAlpha = SPLIT.out != null ? Math.max(0, 1 - (SPLIT.out += dt) / .4) : 1;
    const k = clamp(SPLIT.t / 1.1, 0, 1), e = 1 - Math.pow(1 - k, 3);
    const tc = target.rgb;
    const topY = y0 - ryIn, botY = y1 + ryIn;
    c.save(); c.beginPath(); c.ellipse(cx, y0, iw / 2, ryIn, 0, PI, 0, false); c.lineTo(gx + wt + iw, y1); c.ellipse(cx, y1, iw / 2, ryIn, 0, 0, PI, false); c.closePath(); c.clip();
    c.beginPath(); c.rect(gx, 0, cx - gx, SH); c.clip();
    const xs = gx + wt + (cx - gx - wt) * .5, fa = clamp((SPLIT.t - .12) / .95, 0, 1), fe = fa * fa * (3 - 2 * fa);
    c.globalAlpha *= 1; c.fillStyle = css(tc, fe); c.fillRect(gx, topY, cx - gx, botY - topY);
    if (fa > 0 && fa < 1) { for (let i = 0; i < 3; i++) { const bt = clamp(SPLIT.t - .12 - i * .12, 0, 2), r = (cx - gx) * (.15 + bt * 1.1), by = y0 + ryIn + (botY - y0) * (.15 + bt * .5) + Math.sin(i * 2.1) * 6, bx = xs + Math.sin(i * 1.7 + SPLIT.t * 2) * 6; const bg = c.createRadialGradient(bx, by, 0, bx, by, r); bg.addColorStop(0, css(tc, .8 * (1 - fe))); bg.addColorStop(.6, css(tc, .35 * (1 - fe))); bg.addColorStop(1, css(tc, 0)); c.fillStyle = bg; c.fillRect(gx, topY, cx - gx, botY - topY); } }
    c.restore();
    pourFX(c, tc, SPLIT, k);
    { const br = SPLIT.fuse == null ? Math.sin(SPLIT.t * 2.4) * 1.6 * Math.min(1, Math.max(0, SPLIT.t - 1)) : 0, fz = SPLIT.fuse != null ? clamp((SPLIT.t - SPLIT.fuse) / .7, 0, 1) : 0, fe2 = 1 - Math.pow(1 - fz, 3);
      c.save(); c.globalAlpha *= (1 - fe2); c.strokeStyle = 'rgba(255,255,255,0.85)'; c.lineWidth = 1.5; c.beginPath(); c.moveTo(cx + br, topY + ryIn * 0.2); c.quadraticCurveTo(cx - br, (topY + botY) / 2, cx + br, botY); c.stroke();
      if (SPLIT.gap != null && SPLIT.fuse == null) { const ga = clamp((SPLIT.t - SPLIT.gap) / .5, 0, 1); const lg = c.createLinearGradient(cx - 10, 0, cx + 10, 0); lg.addColorStop(0, 'rgba(255,255,255,0)'); lg.addColorStop(.5, `rgba(255,255,255,${.22 * ga})`); lg.addColorStop(1, 'rgba(255,255,255,0)'); c.fillStyle = lg; c.fillRect(cx - 10, topY, 20, botY - topY); }
      c.restore();
      if (SPLIT.fuse != null && fz < 1) { const my = (y0 + y1) / 2, rr0 = 8 + fe2 * gw * .9; c.save(); c.globalCompositeOperation = 'lighter'; c.strokeStyle = `rgba(255,255,255,${.75 * (1 - fz)})`; c.lineWidth = 3 + 8 * (1 - fz); c.beginPath(); c.ellipse(cx, my, rr0, rr0 * 1.25, 0, 0, PI * 2); c.stroke(); const fl = c.createRadialGradient(cx, my, 0, cx, my, gw * .8); fl.addColorStop(0, css(tc.map(v => Math.min(1, v + (1 - v) * .6)), .55 * (1 - fz))); fl.addColorStop(1, css(tc, 0)); c.fillStyle = fl; c.fillRect(cx - gw, my - gh, gw * 2, gh * 2); c.restore(); } }
  }
  c.globalAlpha = 1;
  if (GLOW) {
    GLOW.t += dt; const ga = GLOW.a * Math.max(0, 1 - GLOW.t / 2.2) * Math.min(1, GLOW.t / .15);
    if (ga <= 0) GLOW = null; else { const gg = c.createRadialGradient(cx, (y0 + y1) / 2, gw * .2, cx, (y0 + y1) / 2, gw * 1.15); gg.addColorStop(0, css(GLOW.col, .55 * ga)); gg.addColorStop(1, css(GLOW.col, 0)); c.save(); c.globalCompositeOperation = 'lighter'; c.fillStyle = gg; c.fillRect(cx - gw * 1.2, top - gh * .3, gw * 2.4, gh * 1.6); c.restore(); }
  }
  { const wc = mixW(T, .25); for (let i = splashFx.length - 1; i >= 0; i--) { const q = splashFx[i]; q.t += dt; q.vy += 1300 * dt; q.x += q.vx * dt; q.y += q.vy * dt; if ((q.y > y0 && q.vy > 0) || q.t > 1.2) { if (q.y > y0 && Math.random() < .35) ripples.push({ x: q.x, t: 0, a: .25 }); splashFx.splice(i, 1); continue; }
    c.beginPath(); c.arc(q.x, q.y, q.r, 0, PI * 2); c.fillStyle = css(q.col ? mixW(q.col, .15) : wc, .85); c.fill(); c.beginPath(); c.arc(q.x - q.r * .3, q.y - q.r * .35, q.r * .38, 0, PI * 2); c.fillStyle = 'rgba(255,255,255,.75)'; c.fill(); } }
  for (let i = burst.length - 1; i >= 0; i--) { const b = burst[i]; b.t += dt; b.vy += 1300 * dt; b.x += b.vx * dt; b.y += b.vy * dt; if (b.t > 1.6 || b.y > SH + 10) { burst.splice(i, 1); continue; } c.beginPath(); c.arc(b.x, b.y, b.r, 0, PI * 2); c.fillStyle = css(b.col, .9 * Math.min(1, (1.6 - b.t) * 2)); c.fill(); c.strokeStyle = 'rgba(255,255,255,.5)'; c.lineWidth = .7; c.stroke(); }
  if (SWEEP) { SWEEP.t += dt; const k = SWEEP.t / 1.3; if (k > 1) SWEEP = null; else { const bx = gx - gw * .6 + (gw * 2.2) * k; c.save(); c.beginPath(); c.rect(gx, top, gw, bottom - top); c.clip(); const g = c.createLinearGradient(bx - gw * .35, top, bx + gw * .35, bottom); g.addColorStop(0, 'rgba(255,240,200,0)'); g.addColorStop(.5, `rgba(255,246,220,${.55 * Math.sin(k * Math.PI)})`); g.addColorStop(1, 'rgba(255,240,200,0)'); c.globalCompositeOperation = 'lighter'; c.fillStyle = g; c.fillRect(gx, top, gw, bottom - top); c.restore(); } }
  // wet wall above the waterline after stirring, with drips sliding back down
  { const ddt = Math.min(dt, .05); WET = Math.max(0, WET - ddt * .035); const hw = Math.min(y0 - top - ry * 1.2, 14 + WET * 46);
    if (WET > .02 && hw > 4) { const fa = .1 * Math.min(1, WET * 1.6), wf = c.createLinearGradient(0, y0 - hw, 0, y0); wf.addColorStop(0, 'rgba(255,255,255,0)'); wf.addColorStop(.7, `rgba(255,255,255,${fa * .6})`); wf.addColorStop(1, `rgba(255,255,255,${fa})`); c.save(); c.globalCompositeOperation = 'lighter'; c.fillStyle = wf; for (const [x0, w] of [[G.wx + 1, iw * .09], [G.wx + G.ww - iw * .09 - 1, iw * .09], [cx - iw * .3, iw * .05], [cx + iw * .18, iw * .03]]) c.fillRect(x0, y0 - hw, w, hw); c.restore();
      if (wdrops.length < 18 && Math.random() < WET * ddt * 2.4) { const side = Math.random(), x = side < .35 ? G.wx + 3 + Math.random() * iw * .1 : side < .7 ? G.wx + G.ww - 3 - Math.random() * iw * .1 : G.wx + iw * (.15 + Math.random() * .7); wdrops.push({ x, y: y0 - hw * (.3 + Math.random() * .7), r: .9 + Math.random() * 1.5, v: 0, stick: Math.random() * .8, tr: [] }); } }
    const wc2 = tint > .01 ? T.map(v => .55 + v * .45) : [1, 1, 1];
    for (let i = wdrops.length - 1; i >= 0; i--) { const d = wdrops[i]; if (d.stick > 0) d.stick -= ddt; else { d.v = Math.min(10 + d.r * 14, d.v + (30 + d.r * 20) * ddt); if (Math.random() < ddt * .6) d.stick = .2 + Math.random() * .6, d.v *= .3; d.y += d.v * ddt; d.x += Math.sin(d.y * .15) * .08; d.tr.push([d.x, d.y]); if (d.tr.length > 26) d.tr.shift(); }
      if (d.y >= y0 + surfH(Math.PI / 2) * .2 - 1) { ripples.push({ x: d.x, t: 0, a: .14 }); wdrops.splice(i, 1); continue; }
      if (d.tr.length > 1) { c.strokeStyle = 'rgba(255,255,255,.12)'; c.lineWidth = d.r * .9; c.lineCap = 'round'; c.beginPath(); d.tr.forEach(([x, y], k) => k ? c.lineTo(x, y) : c.moveTo(x, y)); c.stroke(); }
      c.fillStyle = css(wc2, .28); c.beginPath(); c.ellipse(d.x, d.y, d.r * .85, d.r * 1.15, 0, 0, PI * 2); c.fill(); c.strokeStyle = 'rgba(20,30,40,.25)'; c.lineWidth = .5; c.stroke(); c.fillStyle = 'rgba(255,255,255,.85)'; c.beginPath(); c.arc(d.x - d.r * .3, d.y - d.r * .4, Math.max(.35, d.r * .3), 0, PI * 2); c.fill(); } }
  // highlights on the front of the glass
  const hl = (x, w, a) => {
    const g = c.createLinearGradient(0, top, 0, bottom);
    g.addColorStop(0, `rgba(255,255,255,0)`); g.addColorStop(0.12, `rgba(255,255,255,${a})`); g.addColorStop(0.8, `rgba(255,255,255,${a * 0.7})`); g.addColorStop(1, 'rgba(255,255,255,0)');
    c.fillStyle = g; c.fillRect(x, top + ry, w, bottom - top - ry * 0.5);
  };
  hl(gx + gw * 0.12, gw * 0.032, 0.6);
  hl(gx + gw * 0.17, gw * 0.008, 0.45);
  hl(gx + gw * 0.64, gw * 0.15, 0.09);
  hl(gx + gw * 0.885, gw * 0.012, 0.7);

  // silhouette + rim
  c.lineWidth = 1.1; c.strokeStyle = 'rgba(26,38,52,0.32)';
  c.beginPath(); c.moveTo(gx + 0.5, top); c.lineTo(gx + 0.5, bottom); c.moveTo(gx + gw - 0.5, top); c.lineTo(gx + gw - 0.5, bottom); c.stroke();
  c.strokeStyle = 'rgba(26,38,52,0.20)'; c.beginPath(); c.ellipse(cx, top, gw / 2, ry, 0, PI, 0); c.stroke();
  c.strokeStyle = 'rgba(255,255,255,0.55)'; c.beginPath(); c.ellipse(cx, top, iw / 2, ryIn, 0, PI, 0); c.stroke();
  c.strokeStyle = 'rgba(26,38,52,0.22)'; c.beginPath(); c.ellipse(cx, top + 1.6, gw / 2, ry, 0, 0.04 * PI, 0.96 * PI); c.stroke();
  c.strokeStyle = 'rgba(255,255,255,0.95)'; c.lineWidth = 1.6; c.beginPath(); c.ellipse(cx, top, gw / 2, ry, 0, 0, PI); c.stroke();

  // pour stream (dilute)
  if (pour) {
    const k = pour.t / 0.8, a = Math.min(1, Math.sin(clamp(k, 0, 1) * PI) * 2.5);
    const w = 4.5 * a + 0.5, x = cx + gw * 0.12;
    const sgr = c.createLinearGradient(x - w, 0, x + w, 0);
    sgr.addColorStop(0, 'rgba(160,180,200,0.35)'); sgr.addColorStop(0.4, 'rgba(255,255,255,0.9)'); sgr.addColorStop(1, 'rgba(160,180,200,0.35)');
    c.fillStyle = sgr;
    c.beginPath(); c.moveTo(x - w * 0.6, 0);
    for (let y = 0; y <= y0 + 6; y += 8) c.lineTo(x - w + Math.sin(y * 0.08 + pour.t * 30) * 0.8, y);
    for (let y = y0 + 6; y >= 0; y -= 8) c.lineTo(x + w + Math.sin(y * 0.08 + pour.t * 30) * 0.8, y);
    c.closePath(); c.globalAlpha = a; c.fill(); c.globalAlpha = 1;
  }

  // stirring rod
  { if (Math.abs(spinW) > .3 && !(gp && gp.stir)) vortX += (cx - vortX) * Math.min(1, dt * 2); const vs = Math.min(1, Math.max(stirEnergy * .55, Math.abs(spinW) * .14)); vortS += (vs - vortS) * (1 - Math.exp(-dt * (vs > vortS ? 8 : 6)));
    if (vortS > .02) { const vx = clamp(vortX, cx - iw * .3, cx + iw * .3), r = iw * (.1 + .2 * vortS), dep = (y1 - y0) * .16 * vortS, tt = performance.now() / 1000;
      c.save(); c.beginPath(); c.ellipse(cx, y0, iw / 2, ryIn, tiltA, 0, PI * 2); c.rect(gx, y0, gw, dep + 4); c.clip();
      const rr = r * (1.1 + .3 * vortS), dir = stirDir || 1;
      c.translate(vx, y0 + dep * .25); c.scale(1, .26); c.filter = 'blur(3px)';
      const hg = c.createRadialGradient(0, 0, rr * .35, 0, 0, rr); hg.addColorStop(0, 'rgba(255,255,255,0)'); hg.addColorStop(.7, `rgba(255,255,255,${.18 * vortS})`); hg.addColorStop(1, 'rgba(255,255,255,0)');
      c.beginPath(); const a0 = tt * 2.2 * dir; c.arc(0, 0, rr, a0, a0 + PI * .9 * dir, dir < 0); c.arc(0, 0, rr * .55, a0 + PI * .9 * dir, a0, dir > 0); c.closePath(); c.fillStyle = hg; c.fill(); c.filter = 'none';
      c.restore(); } }

  // crown splash + rebound jet
  for (const cr of CROWN) { const dye = DYES[cr.dye], col = dye.rgb.map(v => lerp(v, 1, .35)), k = cr.t / .32, R0 = 7 + cr.t * 70, hgt = Math.sin(Math.min(1, k) * Math.PI) * 16 * Math.max(.9, gw / 220), al = Math.max(0, 1 - cr.t / .5);
    if (k < 1) { c.save(); c.globalAlpha = al * .9; for (let i = 0; i < cr.n; i++) { const a = cr.ph + i / cr.n * PI * 2, sx = Math.cos(a), sy = Math.sin(a) * .28, bx = cr.x + sx * R0, by = G.y0 + sy * R0, hh = hgt * (.75 + .25 * Math.sin(i * 2.3 + cr.ph)), w = 2.2; const g = c.createLinearGradient(bx, by, bx, by - hh); g.addColorStop(0, css(col, .9)); g.addColorStop(1, css(col.map(v => lerp(v, 1, .4)), .9)); c.fillStyle = g; c.beginPath(); c.moveTo(bx - w, by); c.quadraticCurveTo(bx - w * .3, by - hh * .6, bx + sx * 2, by - hh); c.quadraticCurveTo(bx + w * .3, by - hh * .6, bx + w, by); c.fill(); c.beginPath(); c.arc(bx + sx * 2, by - hh - 1.6, 1.6, 0, PI * 2); c.fill(); }
      c.strokeStyle = css(col, .6); c.lineWidth = 1.2; c.beginPath(); c.ellipse(cr.x, G.y0, R0, R0 * .28, 0, 0, PI * 2); c.stroke(); c.restore(); }
    const jt = (cr.t - .16) / .3; if (jt > 0 && jt < 1) { const jh = Math.sin(jt * PI) * 22 * Math.max(.9, gw / 220); c.save(); c.globalAlpha = .9 * (1 - jt * .5); const g = c.createLinearGradient(cr.x, G.y0, cr.x, G.y0 - jh); g.addColorStop(0, css(col)); g.addColorStop(1, css(col.map(v => lerp(v, 1, .5)))); c.fillStyle = g; c.beginPath(); c.moveTo(cr.x - 2.6, G.y0); c.quadraticCurveTo(cr.x - 1, G.y0 - jh * .6, cr.x, G.y0 - jh); c.quadraticCurveTo(cr.x + 1, G.y0 - jh * .6, cr.x + 2.6, G.y0); c.fill(); if (jt > .35) { c.beginPath(); c.arc(cr.x, G.y0 - jh - 4 - jt * 10, 2.2, 0, PI * 2); c.fill(); } c.restore(); } }
  // splash beads
  for (const b of beadsFx) {
    const col = DYES[b.dye].rgb.map(v => lerp(v, 1, 0.45));
    c.fillStyle = css(col, 1 - b.t / 0.5); c.beginPath(); c.arc(b.x, b.y, b.r, 0, PI * 2); c.fill();
  }
  if (state === 'play' && typeof isBday === 'function' && (window.__bd ?? (window.__bd = isBday()))) { const tt = performance.now() / 1000, dc = idColor(save.idn); c.save(); c.globalCompositeOperation = 'lighter'; c.lineWidth = 1.6; c.shadowBlur = 12; c.shadowColor = 'rgba(255,214,120,.8)'; c.strokeStyle = `rgba(255,214,120,${.35 + .12 * Math.sin(tt * 1.4)})`; c.beginPath(); c.ellipse(G.cx, G.top, G.gw / 2, G.gw * .085, 0, 0, Math.PI * 2); c.stroke(); c.shadowColor = css(dc, .8); c.strokeStyle = css(dc, .25 + .1 * Math.sin(tt * 1.4 + 1.5)); c.beginPath(); c.ellipse(G.cx, G.top, G.gw / 2 + 2, G.gw * .085 + 1.5, 0, 0, Math.PI * 2); c.stroke(); c.restore(); }
  if (gp && !gp.stir && state === 'play') { const gk = Math.min(1, (performance.now() - gp.t0) / 160); c.save(); c.globalCompositeOperation = 'lighter'; c.strokeStyle = css(DYES[sel].rgb, .55 * gk); c.lineWidth = 2; c.shadowColor = css(DYES[sel].rgb, .9); c.shadowBlur = 14 * gk; c.beginPath(); c.ellipse(G.cx, G.top, G.gw / 2, G.gw * .085, 0, 0, Math.PI * 2); c.stroke(); c.restore(); }
  // falling droplets
  for (const d of droplets) {
    if (d.state === 'done') continue;
    const dye = DYES[d.dye]; if (dye.water) c.globalAlpha = .7;
    const s = d.state === 'form' ? Math.max(.02, Math.min(1, d.t / 0.2) * (1 + .06 * Math.sin(d.t * 40) * Math.max(0, 1 - d.t / .22))) : 1;
    const r = 6.5 * s * Math.max(0.9, gw / 220);
    const stretch = 1 + Math.min(d.vy / 1600, 0.7);
    c.save(); c.translate(d.x, d.y); c.scale(1 / Math.sqrt(stretch), stretch);
    const g = c.createRadialGradient(-r * 0.35, -r * 0.35, r * 0.05, 0, 0, r);
    g.addColorStop(0, 'rgba(255,255,255,0.95)'); g.addColorStop(0.25, css(dye.rgb)); g.addColorStop(1, css(dye.dark));
    c.fillStyle = g; c.beginPath();
    c.moveTo(0, -r * 1.35); c.bezierCurveTo(r * 0.55, -r * 0.6, r, -r * 0.1, r, r * 0.25);
    c.arc(0, r * 0.25, r, 0, PI, false); c.bezierCurveTo(-r, -r * 0.1, -r * 0.55, -r * 0.6, 0, -r * 1.35);
    c.fill();
    c.strokeStyle = 'rgba(255,255,255,.55)'; c.lineWidth = .9; if (r > 1.2) { c.beginPath(); c.arc(0, r * .25, r - .6, .15 * PI, .85 * PI); c.stroke(); }
    c.fillStyle = 'rgba(255,255,255,.85)'; c.beginPath(); c.ellipse(-r * .38, -r * .15, r * .16, r * .42, -.35, 0, PI * 2); c.fill();
    c.restore(); c.globalAlpha = 1;
    if (d.state === 'fall' && G.y0 - d.y < 60) { const q = 1 - (G.y0 - d.y) / 60; c.fillStyle = css(dye.rgb, .25 * q); c.beginPath(); c.ellipse(d.x, G.y0 + 1, 4 + q * 5, (4 + q * 5) * .25, 0, 0, PI * 2); c.fill(); }
    if (d.state === 'form') { // tip it hangs from
      c.fillStyle = 'rgba(26,38,52,0.18)'; c.fillRect(d.x - 0.5, d.y - r * 1.4 - 10, 1, 10);
    }
  }
}
function drawRod(c, rd, T, tint) {
  const { cx, gw, top, gh, y0 } = G;
  const tx = rd.px * 0.6 + cx * 0.4 + gw * 0.22, ty = top - gh * 0.26;
  const seg = (x1, y1, x2, y2, under) => {
    const dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy) || 1, nx = -dy / L, ny = dx / L;
    c.lineCap = 'round';
    c.strokeStyle = under ? css(powc(T, 1.4), 0.45) : 'rgba(225,232,240,0.45)'; c.lineWidth = 9;
    c.beginPath(); c.moveTo(x1, y1); c.lineTo(x2, y2); c.stroke();
    c.lineWidth = 1; c.strokeStyle = 'rgba(26,38,52,0.38)';
    for (const o of [-4.2, 4.2]) { c.beginPath(); c.moveTo(x1 + nx * o, y1 + ny * o); c.lineTo(x2 + nx * o, y2 + ny * o); c.stroke(); }
    c.lineWidth = 1.6; c.strokeStyle = 'rgba(255,255,255,0.95)';
    c.beginPath(); c.moveTo(x1 + nx * 1.8, y1 + ny * 1.8); c.lineTo(x2 + nx * 1.8, y2 + ny * 1.8); c.stroke();
  };
  if (rd.py <= y0) { seg(tx, ty, rd.px, rd.py, false); rd.sx = rd.px; return; }
  const k = (y0 - ty) / (rd.py - ty), sx = tx + (rd.px - tx) * k; rd.sx = sx;
  seg(tx, ty, sx, y0, false);
  seg(sx + 3.5, y0, rd.px + 3.5, rd.py, true);
}

/* ================= Input: glass ================= */
let gp = null; // glass pointer
let tiltA = 0, tiltV = 0, tiltT = 0, tiltAsked = false;
addEventListener('deviceorientation', e => { if (e.gamma == null) return; tiltT = clamp(-e.gamma * Math.PI / 180 * .35, -.105, .105); });
document.addEventListener('pointerdown', () => { if (tiltAsked) return; tiltAsked = true; try { if (window.DeviceOrientationEvent && DeviceOrientationEvent.requestPermission) DeviceOrientationEvent.requestPermission().catch(() => {}); } catch (e) {} }, { once: false });
fgC.addEventListener('pointerdown', e => {
  if (state === 'result') return;
  audio();
  const r = fgC.getBoundingClientRect(); const x = e.clientX - r.left, y = e.clientY - r.top;
  DRIP.wake();
  if (DRIP.hit(x, y)) { DRIP.onTap(); return; }
  fgC.setPointerCapture(e.pointerId);
  gp = { id: e.pointerId, x0: x, y0: y, x, y, lx: x, ly: y, t0: performance.now(), stir: false, moved: 0 };
});
fgC.addEventListener('pointermove', e => {
  if (!gp || e.pointerId !== gp.id) return;
  const r = fgC.getBoundingClientRect(); gp.x = e.clientX - r.left; gp.y = e.clientY - r.top;
  if (!gp.stir && Math.hypot(gp.x - gp.x0, gp.y - gp.y0) > 9) gp.stir = true;
});
const endGlass = e => {
  if (!gp || e.pointerId !== gp.id) return;
  const quick = performance.now() - gp.t0 < 450;
  const inX = gp.x0 > G.gx - 40 && gp.x0 < G.gx + G.gw + 40;
  if (!gp.stir && quick && inX && e.type === 'pointerup') { if (!DRAIN) ripples.push({ x: clamp(gp.x0, G.wx + 8, G.wx + G.ww - 8), t: 0, a: 0.55 }); addDrop(gp.x0); }
  if (gp.stir) bumpHint();
  gp = null; rod = null;
};
fgC.addEventListener('pointerup', endGlass);
fgC.addEventListener('pointercancel', endGlass);
const inWater = (x, y) => x > G.wx + 2 && x < G.wx + G.ww - 2 && y > G.y0 + 2 && y < G.y1 + G.ryIn * 0.5;

let stirHap = 0;
function stirAt(x0, y0, x1, y1, dt, gain = 1) { if (SURF.E > .35) WET = Math.min(1, WET + dt * .25 * SURF.E);
  const [u0, v0] = screenToSim(x0, y0), [u1, v1] = screenToSim(x1, y1);
  const du = u1 - u0, dv = v1 - v0;
  if (Math.abs(du) + Math.abs(dv) < 1e-5) return;
  const vx = du / dt * F.vel.w * gain, vy = dv / dt * F.vel.h * gain;
  const lim = 900, m = Math.hypot(vx, vy), s = m > lim ? lim / m : 1;
  splat(F.vel, u1, v1, [vx * s * .85, vy * s * .85, 0], 0.0052);
  const speed = Math.hypot(du * (G.ww / G.wh), dv) / dt;
  stirEnergy += Math.min(speed, 4) * dt * 3.2; DRIP.onStir();
  stirHap += dt; if (SURF.E > .08) glassStir += dt; if (gain === 1 && SURF.E > .12 && stirHap > .22 - SURF.E * .12) { stirHap = 0; haptic(SURF.E > .6 ? 6 : 4); }
}

/* ================= Input: dye strip ================= */
let dyeNT = 0;
const N = DYES.length; let sel = 0;
const strip = $('strip');
const beads = DYES.map((d, i) => {
  const b = document.createElement('button'); b.className = 'bead' + (d.water ? ' water' : ''); b.type = 'button'; b.tabIndex = -1;
  b.setAttribute('aria-label', d.name.toLowerCase() + ' dye');
  b.style.setProperty('--c', css(d.rgb)); b.style.setProperty('--cd', css(d.dark));
  strip.appendChild(b); return b;
});
function setSel(i) {
  if (i === sel) return; save.selDye = DYES[i].name;
  beads[sel].classList.remove('sel'); sel = i; beads[sel].classList.add('sel');
  const dn = $('dyeName'); dn.textContent = DYES[i].name.toLowerCase(); dn.classList.add('on'); dn.classList.toggle('water', !!DYES[i].water); DRIP.onDye();
}
/* curved loop dial */
const DIAL = { p: 0, v: 0, tgt: null, drag: null, raf: 0, last: 0, ci: 0, SP: 50 };
const wrapI = i => ((i % N) + N) % N, wrapK = k => { k = ((k + N / 2) % N + N) % N - N / 2; return k; };
function dialClick() { if (!actx || save.muted) return; try { const t = actx.currentTime, o = actx.createOscillator(), g = actx.createGain(); o.type = 'triangle'; o.frequency.setValueAtTime(2400, t); o.frequency.exponentialRampToValueAtTime(1200, t + .02); g.gain.setValueAtTime(.025, t); g.gain.exponentialRampToValueAtTime(.0001, t + .03); o.connect(g); g.connect(actx.destination); o.start(t); o.stop(t + .035); } catch (e) {} }
function layoutDial() {
  const half = Math.max(120, strip.clientWidth / 2), SP = DIAL.SP, dt = DIAL.ldt || .016, kk = 1 - Math.exp(-dt * 14);
  const fT = 0; DIAL.fx = (DIAL.fx || 0) + (fT - (DIAL.fx || 0)) * (1 - Math.exp(-dt * (DIAL.drag ? 26 : 9))); const fx = DIAL.fx; let busy = Math.abs(fT - fx) > .5;
  for (let i = 0; i < N; i++) { const k = wrapK(i - DIAL.p), x0 = SP * (.66 * k + .62 * Math.tanh(k * .85)), b = beads[i];
    if (Math.abs(x0) > half + 24) { if (b.style.visibility !== 'hidden') b.style.visibility = 'hidden'; b._s = .5; continue; }
    if (b.style.visibility) b.style.visibility = '';
    const d = x0 - fx, m = Math.exp(-d * d / (SP * SP * 1.35)), x = x0 + Math.sign(d) * SP * .3 * (1 - Math.exp(-Math.abs(d) / SP)) * (.4 + .6 * Math.exp(-fx * fx / (SP * SP * 9))), tS = .5 + .82 * m;
    b._s = b._s == null ? tS : b._s + (tS - b._s) * kk; if (Math.abs(tS - b._s) > .003) busy = true; const sc = b._s, t = Math.min(1, Math.abs(x) / half), y = 26 * (1.32 - sc) - 2;
    b.style.transform = `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0) scale(${sc.toFixed(3)})`; b.style.opacity = (1 - .6 * t * t).toFixed(3); b.style.zIndex = String(100 - Math.round(Math.abs(d) / SP * 10)); }
  DIAL.busy = busy;
  const ci = wrapI(Math.round(DIAL.p)); if (ci !== DIAL.ci) { DIAL.ci = ci; setSel(ci); haptic(4); dialClick(); }
}
function dialStep(now) {
  const dt = Math.min(.05, (now - (DIAL.last || now)) / 1000); DIAL.last = now; DIAL.ldt = dt || .016; let go = true;
  if (!DIAL.drag) {
    if (DIAL.coast) { const c = DIAL.coast; DIAL.p += DIAL.v * dt; DIAL.v *= Math.exp(-c.k * dt); if (Math.abs(c.tgt - DIAL.p) < .04 || Math.abs(DIAL.v) < .6 || Math.sign(c.tgt - DIAL.p) !== c.dir) { DIAL.coast = null; DIAL.tgt = c.tgt; } }
    else if (DIAL.tgt === null && Math.abs(DIAL.v) > 2.5) { const d0 = DIAL.v / 3.2, tg = Math.round(DIAL.p + d0), dist = tg - DIAL.p; if (Math.sign(dist) === Math.sign(DIAL.v) && Math.abs(dist) > .2) DIAL.coast = { tgt: tg, k: Math.max(1.2, DIAL.v / dist), dir: Math.sign(dist) }; else DIAL.tgt = tg; }
    else { if (DIAL.tgt === null) DIAL.tgt = Math.round(DIAL.p + DIAL.v * .12); const acc = (DIAL.tgt - DIAL.p) * 150 - DIAL.v * 17.5; DIAL.v += acc * dt; DIAL.p += DIAL.v * dt;
      if (Math.abs(DIAL.tgt - DIAL.p) < .002 && Math.abs(DIAL.v) < .05) { DIAL.p = DIAL.tgt = wrapI(Math.round(DIAL.tgt)); DIAL.v = 0; DIAL.tgt = null; go = false; } }
  }
  layoutDial(); if (go || DIAL.drag || DIAL.busy) DIAL.raf = requestAnimationFrame(dialStep); else DIAL.raf = 0;
}
function dialKick() { if (!DIAL.raf) { DIAL.last = 0; DIAL.raf = requestAnimationFrame(dialStep); } }
strip.addEventListener('pointerdown', e => { audio(); try { strip.setPointerCapture(e.pointerId); } catch (x) {} DIAL.drag = { id: e.pointerId, x0: e.clientX, x: e.clientX, t: performance.now(), moved: 0, tgtEl: e.target.closest && e.target.closest('.bead') }; DIAL.v = 0; DIAL.tgt = null; DIAL.coast = null; dialKick(); e.preventDefault(); });
strip.addEventListener('pointermove', e => { const d = DIAL.drag; if (!d || d.id !== e.pointerId) return; const now = performance.now(), dx = e.clientX - d.x, dtt = Math.max(1, now - d.t) / 1000; d.moved = Math.max(d.moved, Math.abs(e.clientX - d.x0)); DIAL.p -= dx / (DIAL.SP * 1.22); const vi = -dx / (DIAL.SP * 1.22) / dtt; DIAL.v = DIAL.v * .6 + vi * .4; d.x = e.clientX; d.t = now; });
const dialUp = e => { const d = DIAL.drag; if (!d || d.id !== e.pointerId) return; DIAL.drag = null;
  if (performance.now() - d.t > 90) DIAL.v = 0;
  if (d.moved < 7) { DIAL.v = 0; const el = d.tgtEl, i = el ? beads.indexOf(el) : -1;
    if (i >= 0) { el.animate([{ filter: 'brightness(1.25)' }, { filter: 'none' }], { duration: 260 });
      if (i === sel && Math.abs(wrapK(i - DIAL.p)) < .3) { DIAL.tgt = Math.round(DIAL.p); haptic(4); } // same light tick as a detent, so a tap never feels dead
      else DIAL.tgt = DIAL.p + wrapK(i - DIAL.p); }
    else DIAL.tgt = Math.round(DIAL.p); }
  DIAL.v = Math.max(-30, Math.min(30, DIAL.v)); dialKick(); };
strip.addEventListener('pointerup', dialUp); strip.addEventListener('pointercancel', dialUp);
try { new ResizeObserver(() => layoutDial()).observe(strip); } catch (e) { addEventListener('resize', () => layoutDial()); }
function updateDial() {}

/* ================= Buttons ================= */
$('emptyBtn').addEventListener('click', () => { audio(); if (drops === 0) return toast('the glass is already clear'); if (state === 'play') { emptyGlass(false); saveGlass(); } });
$('diluteBtn').addEventListener('click', () => { audio(); if (drops === 0) return toast('add some color first'); dilute(); });
{ const cb = $('checkBtn'); let h = null;
  const stop = () => { if (!h) return; cancelAnimationFrame(h.raf); h = null; cb.classList.remove('holding'); cb.style.setProperty('--p', 0); cb.textContent = 'lock it in'; };
  cb.addEventListener('pointerdown', e => { if (cb.disabled || h) return; audio(); h = { t0: performance.now(), last: 0 }; cb.classList.add('holding'); cb.textContent = 'hold…'; try { cb.setPointerCapture(e.pointerId); } catch (x) {}
    const f = now => { if (!h) return; const k = Math.min(1, (now - h.t0) / 600); cb.style.setProperty('--p', k); const step = Math.floor(k * 6); if (step > h.last) { h.last = step; buzz(2 + step); } if (k >= 1) { stop(); haptic(25); clink(); cb.classList.remove('locked'); void cb.offsetWidth; cb.classList.add('locked'); setTimeout(() => cb.classList.remove('locked'), 700); try { ripples.push({ x: G.cx, t: 0, a: .7 }); } catch (x) {} check(); return; } h.raf = requestAnimationFrame(f); }; h.raf = requestAnimationFrame(f); });
  ['pointerup', 'pointercancel', 'pointerleave'].forEach(ev => cb.addEventListener(ev, stop)); }
$('nextBtn').addEventListener('click', next);
/* ================= Shop ================= */
const SHOP = {
  drip: [['winky', 'winky eyes', 150], ['dots', 'dot eyes', 150], ['shades', 'shades', 300], ['chain', 'chain', 500]],
  room: [['plant', 'plant', 200], ['clock', 'clock', 300], ['fish', 'fishbowl', 600], ['rec', 'record player', 1200]],
};
const DRIP_KIND = { dots: 'face', winky: 'face', shades: 'face', sleepy: 'face', heart: 'face', starry: 'face', monocle: 'face', chain: 'acc', beanie: 'hat', bucket: 'hat', chef: 'hat', crown: 'hat' };
if (save.owned.includes('squinty')) { save.owned = save.owned.filter(x => x !== 'squinty'); if (!save.owned.includes('dots')) save.owned.push('dots'); }
if (save.face && !DRIP_KIND[save.face]) save.face = save.face === 'squinty' ? 'dots' : null;
function equipDrip(id) { const k = DRIP_KIND[id]; if (k === 'face') save.face = save.face === id ? null : id; else if (k === 'hat') save.hat = save.hat === id ? null : id; else save.acc = save.acc === id ? null : id; persist(); }
const BG_PREV = { black: '#000', white: '#F4F6F8', gray: '#D9DCE0', cream: '#F1E9DA', navy: '#0B1326', forest: '#0F2A1E', blush: '#F2DCE0', slate: '#2E3A4A', sunset: '#4A1D2C', midnight: '#0A1433', marble: 'repeating-linear-gradient(135deg,#E9E7E3 0 12px,#D8D5D0 12px 14px)', wood: 'repeating-linear-gradient(90deg,#2B1B12 0 6px,#35221A 6px 9px)' };
let shopTab = 'drip', pendingBuy = null;
function equipped(cat, id) { return (cat === 'drip' && (save.face === id || save.acc === id || save.hat === id)) || (cat === 'room' && save.owned.includes(id)) || (cat === 'backgrounds' && save.bg === id) || (cat === 'glasses' && save.glass === id); }
let freshId = null;
function drainHue(a, b, done) {
  const t0 = performance.now(), D = 800; let lastV = a, lastT = 0;
  const f = now => { const k = Math.min(1, (now - t0) / D), e = k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2, v = Math.round(a + (b - a) * e);
    if (v !== lastV) { lastV = v; $('coinVal').textContent = v; $('shopHue').textContent = v; if (now - lastT > 55) { lastT = now; dripSnd(1.2 - k * .4, 0.035); buzz(3); } }
    if (k < 1) requestAnimationFrame(f); else { coinShown = b; $('coinVal').textContent = b; $('shopHue').textContent = b; done && done(); } };
  requestAnimationFrame(f);
}
function renderShop() {
  $('shopHue').textContent = save.coins; $('tabs').innerHTML = '';
  $('shopGrid').innerHTML = `<div class="shopempty"><p>new things coming soon</p></div>`;
}
function toastShop(m) { $('shopHue').textContent = m; setTimeout(() => $('shopHue').textContent = save.coins, 1400); }
$('shopBtn').addEventListener('click', () => goTab('shop'));
$('shopX').addEventListener('click', () => { $('shop').hidden = true; $('coinVal').textContent = save.coins; coinShown = save.coins; });

/* ================= Settings & stats ================= */
function renderFav() {
  const r = $('favRow'); r.innerHTML = '';
  DYES.forEach((d, i) => { if (d.water) return; const b = document.createElement('button'); b.className = 'fav' + (save.fav === i ? ' on' : ''); b.setAttribute('aria-label', d.name); b.style.setProperty('--c', css(d.rgb)); b.style.setProperty('--cd', css(d.dark)); b.addEventListener('click', () => { save.fav = save.fav === i ? null : i; persist(); tick(); renderFav(); HOMEBG.recolor(); }); r.appendChild(b); });
}
function drawEyeGraph() {
  if (!$('eGraph')) return;
  const cv = $('eGraph'), W = cv.clientWidth || 340, H = 120, D = Math.min(devicePixelRatio || 1, 2); cv.width = W * D; cv.height = H * D; const x = cv.getContext('2d'); x.setTransform(D, 0, 0, D, 0, 0); x.clearRect(0, 0, W, H);
  let a = (save.eyeAll && save.eyeAll.length ? save.eyeAll : (save.eyeHist || [])).slice(); a = [1000].concat(a);
  const N = 90; if (a.length > N) { const o = []; for (let i = 0; i < N; i++) { const s0 = Math.floor(i * a.length / N), s1 = Math.max(s0 + 1, Math.floor((i + 1) * a.length / N)); let sm = 0; for (let k = s0; k < s1; k++) sm += a[k]; o.push(sm / (s1 - s0)); } a = o; }
  if (a.length > 3) { const sm = a.map((v, i) => (a[Math.max(0, i - 1)] + v * 2 + a[Math.min(a.length - 1, i + 1)]) / 4); a = sm; }
  const best = save.eyeBest || 0; let mn = Math.min(...a) - 40, mx = Math.max(...a, best) + 40; if (mx - mn < 160) { const c = (mx + mn) / 2; mn = c - 80; mx = c + 80; }
  const X = i => 6 + i / Math.max(1, a.length - 1) * (W - 12), Y = v => H - 8 - (v - mn) / (mx - mn) * (H - 16);
  x.font = '9px ' + (getComputedStyle(document.body).fontFamily || 'system-ui'); x.textBaseline = 'bottom';
  RANKS.slice(1).map(r => [r[0], r[1]]).forEach(([v, n]) => { if (v < mn || v > mx) return; const y = Y(v); x.setLineDash([3, 4]); x.strokeStyle = 'rgba(255,255,255,.12)'; x.lineWidth = 1; x.beginPath(); x.moveTo(0, y); x.lineTo(W, y); x.stroke(); x.setLineDash([]); x.fillStyle = 'rgba(255,255,255,.3)'; x.fillText(n, 4, y - 2); });
  if (!(save.eyeAll && save.eyeAll.length) && !(save.eyeHist && save.eyeHist.length)) { x.clearRect(0, 0, W, H); x.fillStyle = 'rgba(255,255,255,.38)'; x.font = '12px ' + (getComputedStyle(document.body).fontFamily || 'system-ui'); x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('your eye graph starts after your first level', W / 2, H / 2); x.textAlign = 'left'; return; }
  if (best) { const y = Y(best); x.setLineDash([2, 4]); x.strokeStyle = 'rgba(255,255,255,.22)'; x.lineWidth = 1; x.beginPath(); x.moveTo(0, y); x.lineTo(W, y); x.stroke(); x.setLineDash([]); x.fillStyle = 'rgba(255,255,255,.4)'; x.textAlign = 'right'; x.fillText('best', W - 4, y - 2); x.textAlign = 'left'; }
  if (a.length < 2) return;
  const g = x.createLinearGradient(0, 0, W, 0); g.addColorStop(0, '#7E8792'); g.addColorStop(.6, '#DDE3EA'); g.addColorStop(1, '#fff');
  x.beginPath(); x.moveTo(X(0), Y(a[0])); for (let i = 1; i < a.length; i++) { const xc = (X(i - 1) + X(i)) / 2, yc = (Y(a[i - 1]) + Y(a[i])) / 2; x.quadraticCurveTo(X(i - 1), Y(a[i - 1]), xc, yc); } x.lineTo(X(a.length - 1), Y(a[a.length - 1]));
  x.strokeStyle = g; x.lineWidth = 1.6; x.shadowColor = 'rgba(220,230,240,.5)'; x.shadowBlur = 6; x.stroke(); x.shadowBlur = 0;
  x.beginPath(); x.arc(X(a.length - 1), Y(a[a.length - 1]), 2.6, 0, Math.PI * 2); x.fillStyle = '#fff'; x.fill();
}
/* eye ring centerpiece */
let RING_ITEMS = null;
function makeRing(wrap, cv, tip, opt) {
  const LY = { sig: null }; let ctx, W = 0, D = 1, items = null, anim = 0, t0 = 0, foundList = [], scrub = null, lastTipN = null;
  const BAND_END = i => i < RANKS.length - 1 ? RANKS[i + 1][0] : 100;
  function build() { if (items) return; if (RING_ITEMS) { items = RING_ITEMS; return; } items = RING_ITEMS = COLORS.map(c => { const rgb = displayColor(recipeA(c[1], c[2])), [r, g, b] = rgb, mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn; let h = 0; if (d > 1e-6) { h = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; h = (h * 60 + 360) % 360; } const sat = mx ? d / mx : 0; return { n: c[0], h: h + (sat < .12 ? 360 : 0) + (1 - mx) * .5 }; }).sort((a, b) => a.h - b.h); items.forEach((it, i) => it.a = -Math.PI / 2 + (i + .5) / items.length * Math.PI * 2); }
  function progress(e) { let i = 0; for (let k = 0; k < RANKS.length; k++) if (e >= RANKS[k][0]) i = k; const a = RANKS[i][0], b = BAND_END(i), f = clamp((e - a) / (b - a), 0, 1); return { band: i, t: (i + f) / RANKS.length }; }
  function size() { const w = wrap.clientWidth; if (!w) return false; if (w !== W) { W = w; D = Math.min(devicePixelRatio || 1, 3); cv.width = W * D; cv.height = W * D; ctx = cv.getContext('2d'); } return true; }
  function draw(arcK, shimmer) {
    if (!size()) return; const c = ctx, S = W / 330, cx = W / 2, cy = W / 2, got = {}; (save.palette || []).forEach(p => got[p.n] = p);
    c.setTransform(D, 0, 0, D, 0, 0); c.clearRect(0, 0, W, W);
    const R0 = 128 * S, sig = W + '|' + D + '|' + (save.palette || []).length;
    if (LY.sig !== sig) { LY.sig = sig; const mk = () => { const o = document.createElement('canvas'); o.width = cv.width; o.height = cv.height; const k = o.getContext('2d'); k.setTransform(D, 0, 0, D, 0, 0); return [o, k]; };
      const [u, uk] = mk(); uk.beginPath(); for (const it of items) if (!got[it.n]) { const ca = Math.cos(it.a), sa = Math.sin(it.a); uk.moveTo(cx + ca * R0, cy + sa * R0); uk.lineTo(cx + ca * (R0 + 8 * S), cy + sa * (R0 + 8 * S)); } uk.strokeStyle = 'rgba(220,228,236,.16)'; uk.lineWidth = 1; uk.stroke();
      const [f, fk] = mk(); fk.lineWidth = 1.6; fk.globalAlpha = .95; for (const it of items) { const p = got[it.n]; if (!p) continue; const ca = Math.cos(it.a), sa = Math.sin(it.a); fk.shadowColor = p.h; fk.shadowBlur = 6; fk.strokeStyle = p.h; fk.beginPath(); fk.moveTo(cx + ca * (R0 - 2 * S), cy + sa * (R0 - 2 * S)); fk.lineTo(cx + ca * (R0 + 13 * S), cy + sa * (R0 + 13 * S)); fk.stroke(); }
      LY.u = u; LY.f = f; }
    c.setTransform(1, 0, 0, 1, 0, 0); c.drawImage(LY.u, 0, 0);
    const swA = -Math.PI / 2 + shimmer * Math.PI * 2;
    if (shimmer >= 1) c.drawImage(LY.f, 0, 0);
    else if (shimmer > 0) { c.save(); c.beginPath(); c.moveTo(cx * D, cy * D); c.arc(cx * D, cy * D, W * D, -Math.PI / 2, swA); c.closePath(); c.clip(); c.drawImage(LY.f, 0, 0); c.restore();
      c.setTransform(D, 0, 0, D, 0, 0); c.save(); c.globalCompositeOperation = 'lighter'; c.lineCap = 'round'; c.strokeStyle = 'rgba(255,255,255,.22)'; c.shadowColor = 'rgba(255,255,255,.9)'; c.shadowBlur = 14 * S; c.lineWidth = 12 * S; c.beginPath(); c.arc(cx, cy, R0 + 6 * S, Math.max(-Math.PI / 2, swA - .22), swA); c.stroke(); c.restore(); }
    c.setTransform(D, 0, 0, D, 0, 0);
    // inner silver journey ring
    const R1 = 106 * S, lw = 14 * S, ey = (save.eye ?? CH0), pg = progress(ey);
    c.beginPath(); c.arc(cx, cy, R1, 0, Math.PI * 2); c.strokeStyle = 'rgba(255,255,255,.06)'; c.lineWidth = lw; c.stroke();
    const end = pg.t * arcK; if (end > .001) { const g = c.createLinearGradient(cx - R1, cy - R1, cx + R1, cy + R1); g.addColorStop(0, '#ffffff'); g.addColorStop(.35, '#c9d1d9'); g.addColorStop(.65, '#f4f7fa'); g.addColorStop(1, '#8e97a3');
      c.save(); c.shadowColor = 'rgba(255,255,255,.55)'; c.shadowBlur = 12 * S; c.lineCap = 'round'; c.strokeStyle = g; c.lineWidth = lw; c.beginPath(); c.arc(cx, cy, R1, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * end); c.stroke(); c.restore(); }
    for (let k = 0; k < RANKS.length; k++) { const a = -Math.PI / 2 + k / RANKS.length * Math.PI * 2, reached = ey >= RANKS[k][0] && (k / RANKS.length) <= end + 1e-6, cur = k === pg.band; c.beginPath(); c.arc(cx + Math.cos(a) * R1, cy + Math.sin(a) * R1, (cur ? 4.6 : 3) * S, 0, Math.PI * 2); c.fillStyle = reached ? '#fff' : '#3a3f46'; if (reached) { c.shadowColor = 'rgba(255,255,255,.8)'; c.shadowBlur = cur ? 10 : 5; } c.fill(); c.shadowBlur = 0;
 }
    foundList = items.filter(it => got[it.n]).map(it => ({ a: it.a, p: got[it.n] }));
  }
  function show(quiet) {
    build(); const ey = (save.eye ?? CH0), rk = rankOf(ey), nx = nextRank(ey), got = {}; (save.palette || []).forEach(p => got[p.n] = p); const nGot = ALLN.filter(n => got[n]).length, fmtN = v => Math.round(v).toLocaleString('en-US');
    if (opt.you) {
    $('eBest').textContent = 'best ' + fmtC(save.eyeBest ?? ey);
    $('eLeg').textContent = `${fmtN(nGot)} / ${fmtN(ALLN.length)} colors found`;
    const days = save.first ? Math.max(1, Math.floor((Date.now() - save.first) / 864e5) + 1) : (save.daysN || 0);
    $('eAge').textContent = !(save.totDrops || (save.stats && save.stats.n)) ? 'your eye: brand new' : `your eye: ${fmtN(days)} day${days === 1 ? '' : 's'} · ${fmtN((save.stats && save.stats.n) || 0)} levels · ${fmtN(save.totDrops || 0)} drops`;
    }
    cancelAnimationFrame(anim); if (tip) tip.hidden = true;
    if (quiet || matchMedia('(prefers-reduced-motion: reduce)').matches) { requestAnimationFrame(() => draw(1, 1)); return; }
    t0 = 0; const f = now => { if (!t0) t0 = now; const t = (now - t0) / 1000, k = Math.min(1, t / .75), arcK = 1 - Math.pow(1 - k, 3), sh = clamp((t - .55) / .65, 0, 1); draw(arcK, sh); if (t < 1.25) anim = requestAnimationFrame(f); else draw(1, 1); }; anim = requestAnimationFrame(f);
  }
  // scrub
  if (opt.scrub) {
  const polar = e => { const r = cv.getBoundingClientRect(), x = e.clientX - r.left - r.width / 2, y = e.clientY - r.top - r.height / 2, S = r.width / 330; return { x: x + r.width / 2, y: y + r.height / 2, d: Math.hypot(x, y) / S, a: Math.atan2(y, x) }; };
  const onRing = q => q.d > 112 && q.d < 162;
  function nearest(a) { let best = null, bd = .09; for (const f of foundList) { let d = Math.abs(Math.atan2(Math.sin(a - f.a), Math.cos(a - f.a))); if (d < bd) { bd = d; best = f; } } return best; }
  function moveTip(q) { const f = nearest(q.a); if (!f) { tip.hidden = true; scrub.f = null; lastTipN = null; return; } scrub.f = f; if (f.p.n !== lastTipN) { lastTipN = f.p.n; haptic(4); tip.style.setProperty('--c', f.p.h); tip.querySelector('span').textContent = f.p.n; } tip.hidden = false; tip.style.left = clamp(q.x, 60, W - 60) + 'px'; tip.style.top = Math.max(18, q.y - 26) + 'px'; }
  cv.addEventListener('touchstart', e => { const t = e.touches[0]; if (t && onRing(polar(t))) e.preventDefault(); }, { passive: false });
  cv.addEventListener('pointerdown', e => { const q = polar(e); if (!onRing(q)) return; scrub = { id: e.pointerId, f: null }; lastTipN = null; try { cv.setPointerCapture(e.pointerId); } catch (x) {} moveTip(q); });
  cv.addEventListener('pointermove', e => { if (scrub && scrub.id === e.pointerId) moveTip(polar(e)); });
  const end = e => { if (!scrub || scrub.id !== e.pointerId) return; const f = scrub.f, cancel = e.type === 'pointercancel'; scrub = null; tip.hidden = true; lastTipN = null; if (f && !cancel) { const list = foundList.map(x => x.p); STORY.openList(list, list.indexOf(f.p), { x: e.clientX, y: e.clientY }); } };
  cv.addEventListener('pointerup', end); cv.addEventListener('pointercancel', end);
  }
  return { show };
}
const ERING = makeRing($('eRing'), $('eRingC'), $('eTip'), { you: true, scrub: true });
const HRING = makeRing($('hRing'), $('hRingC'), null, {});
$('hRank').addEventListener('click', () => { buzz(5); openRanks(); });
const DNA = { raf: 0, P: [], spr: [], yaw: 0, pit: -.25, vy: .25, vp: 0, drag: null, cv: null, sig: null, pulse: 0, M: [1, 0, 0, 0, 1, 0, 0, 0, 1], wx: 0, wy: .25, sqx: 0, sqy: 0, svx: 0, svy: 0, press: 0 };
function dnaRot(ax, ay) { // rotate around screen X by ax and screen Y by ay (world space, pre-multiply)
  const M = DNA.M, cx = Math.cos(ax), sx = Math.sin(ax), cy = Math.cos(ay), sy = Math.sin(ay);
  const R = [cy, sx * sy, cx * sy, 0, cx, -sx, -sy, sx * cy, cx * cy], O = new Array(9);
  for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) O[r * 3 + c] = R[r * 3] * M[c] + R[r * 3 + 1] * M[3 + c] + R[r * 3 + 2] * M[6 + c];
  // re-orthonormalize
  const n = (a, b, c) => { const l = Math.hypot(a, b, c) || 1; return [a / l, b / l, c / l]; }; let x = n(O[0], O[3], O[6]), y = [O[1], O[4], O[7]]; const d = x[0] * y[0] + x[1] * y[1] + x[2] * y[2]; y = n(y[0] - d * x[0], y[1] - d * x[1], y[2] - d * x[2]); const z = [x[1] * y[2] - x[2] * y[1], x[2] * y[0] - x[0] * y[2], x[0] * y[1] - x[1] * y[0]];
  DNA.M = [x[0], y[0], z[0], x[1], y[1], z[1], x[2], y[2], z[2]]; }

function dnaBurst(host) { if (!host) return; const c = DNA.sig || [.6, .8, .9], hx = rgbToHex(c), lt = rgbToHex(c.map(v => Math.min(1, v * .5 + .5))), box = document.createElement('div'); box.className = 'dburst'; host.appendChild(box);
  box.innerHTML = `<i class="dbf" style="--c:${hx}"></i><i class="dbr" style="--c:${lt}"></i><i class="dbr r2" style="--c:${hx}"></i>`;
  for (let k = 0; k < 9; k++) { const a = Math.random() * Math.PI * 2, d = 60 + Math.random() * 55, z = 4 + Math.random() * 7, sp = document.createElement('b'); sp.className = 'dbd'; sp.style.cssText = `--x:${(Math.cos(a) * d).toFixed(0)}px;--y:${(Math.sin(a) * d).toFixed(0)}px;width:${z.toFixed(1)}px;height:${z.toFixed(1)}px;--c:${Math.random() < .5 ? hx : lt};animation-delay:${(Math.random() * .08).toFixed(2)}s;animation-duration:${(1.7 + Math.random() * .9).toFixed(2)}s`; box.appendChild(sp); }
  const amb = host.parentNode && host.parentNode.querySelector('.eamb'); if (amb) { amb.classList.remove('kick'); void amb.offsetWidth; amb.classList.add('kick'); }
  setTimeout(() => box.remove(), 1500); }
try { $('aLens').addEventListener('click', e => { e.stopPropagation(); const on = ATLAS.toggleLens(); const b = $('aLens'); b.classList.toggle('on', !!on); b.setAttribute('aria-pressed', on ? 'true' : 'false'); buzz(5); }); } catch (e) {}
