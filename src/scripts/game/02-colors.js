const DYES = [
  { name: 'Lemon',     hex: '#FFE41C' },
  { name: 'Marigold',  hex: '#FFAC00' },
  { name: 'Tangerine', hex: '#FF6618' },
  { name: 'Scarlet',   hex: '#E3132C' },
  { name: 'Rose',      hex: '#E8197F' },
  { name: 'Violet',    hex: '#8A2CD4' },
  { name: 'Indigo',    hex: '#3B30A8' },
  { name: 'Cobalt',    hex: '#0B60E0' },
  { name: 'Lagoon',    hex: '#00AAD8' },
  { name: 'Teal',      hex: '#00A48A' },
  { name: 'Leaf',      hex: '#3EAA2C' },
  { name: 'Cocoa',     hex: '#7A4A28' },
  { name: 'Ink',       hex: '#3A3A46' },
  { name: 'Water',     hex: '#E6EEF5', water: true },
];
const WATER = 13, WF = Math.pow(0.5, 1 / 3);
const DROP = 0.32; // absorbance one drop adds to the whole glass
const hexToRgb = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16) / 255);
const rgbToHex = c => '#' + c.map(v => Math.round(clamp(v, 0, 1) * 255).toString(16).padStart(2, '0')).join('').toUpperCase();
const mixW = (c, k) => c.map(v => v + (1 - v) * k);
const css = (c, a = 1) => `rgba(${c.map(v => Math.round(clamp(v, 0, 1) * 255)).join(',')},${a})`;
const transmit = A => A.map(v => Math.exp(-v));
const LIGHT = 0.9;
const displayColor = A => { const a = A.map(v => Math.max(0, v)), m = Math.max(a[0], a[1], a[2]), K = 1.7, S = 0.75, gm = m < K ? m : K + S * Math.log(1 + (m - K) / S), k = m > 1e-4 ? gm / m : 1; return a.map(v => LIGHT * Math.exp(-v * k)); };
const powc = (c, p) => c.map(v => Math.pow(clamp(v, 0, 1), p));
DYES.forEach(d => {
  d.rgb = hexToRgb(d.hex);
  d.a = d.water ? [0, 0, 0] : d.rgb.map(v => -Math.log(Math.max(v, 0.03)));
  d.dark = powc(d.rgb, 1.9);
});

function toLab(rgb) {
  const lin = c => c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  const [r, g, b] = rgb.map(v => lin(clamp(v, 0, 1)));
  const X = (r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047;
  const Y = (r * 0.2126 + g * 0.7152 + b * 0.0722);
  const Z = (r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883;
  const f = t => t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116;
  const fx = f(X), fy = f(Y), fz = f(Z);
  return [116 * fy - 16, 500 * (fx - fy), 200 * (fy - fz)];
}
function dE00([L1, a1, b1], [L2, a2, b2]) {
  const rad = Math.PI / 180, deg = 180 / Math.PI, p7 = Math.pow(25, 7);
  const C1 = Math.hypot(a1, b1), C2 = Math.hypot(a2, b2), Cb = (C1 + C2) / 2;
  const G = 0.5 * (1 - Math.sqrt(Math.pow(Cb, 7) / (Math.pow(Cb, 7) + p7)));
  const a1p = (1 + G) * a1, a2p = (1 + G) * a2;
  const C1p = Math.hypot(a1p, b1), C2p = Math.hypot(a2p, b2);
  const hue = (b, a) => { if (b === 0 && a === 0) return 0; const x = Math.atan2(b, a) * deg; return x < 0 ? x + 360 : x; };
  const h1p = hue(b1, a1p), h2p = hue(b2, a2p);
  const dLp = L2 - L1, dCp = C2p - C1p;
  let dhp = 0;
  if (C1p * C2p !== 0) { dhp = h2p - h1p; if (dhp > 180) dhp -= 360; else if (dhp < -180) dhp += 360; }
  const dHp = 2 * Math.sqrt(C1p * C2p) * Math.sin(dhp * rad / 2);
  const Lbp = (L1 + L2) / 2, Cbp = (C1p + C2p) / 2;
  let hbp = h1p + h2p;
  if (C1p * C2p !== 0) {
    if (Math.abs(h1p - h2p) > 180) hbp = (h1p + h2p < 360) ? (h1p + h2p + 360) / 2 : (h1p + h2p - 360) / 2;
    else hbp = (h1p + h2p) / 2;
  }
  const T = 1 - 0.17 * Math.cos((hbp - 30) * rad) + 0.24 * Math.cos(2 * hbp * rad) + 0.32 * Math.cos((3 * hbp + 6) * rad) - 0.2 * Math.cos((4 * hbp - 63) * rad);
  const dTheta = 30 * Math.exp(-Math.pow((hbp - 275) / 25, 2));
  const Rc = 2 * Math.sqrt(Math.pow(Cbp, 7) / (Math.pow(Cbp, 7) + p7));
  const Sl = 1 + 0.015 * Math.pow(Lbp - 50, 2) / Math.sqrt(20 + Math.pow(Lbp - 50, 2));
  const Sc = 1 + 0.045 * Cbp, Sh = 1 + 0.015 * Cbp * T;
  const Rt = -Math.sin(2 * dTheta * rad) * Rc;
  return Math.sqrt(Math.pow(dLp / Sl, 2) + Math.pow(dCp / Sc, 2) + Math.pow(dHp / Sh, 2) + Rt * (dCp / Sc) * (dHp / Sh));
}
function rgbToHsl([r, g, b]) {
  const max = Math.max(r, g, b), min = Math.min(r, g, b); let h = 0, s = 0; const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min; s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = (g - b) / d + (g < b ? 6 : 0); else if (max === g) h = (b - r) / d + 2; else h = (r - g) / d + 4;
    h *= 60;
  }
  return [h, s, l];
}

/* ================= Targets ================= */
function mulberry32(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
/* mix.io color expansion: 1004 new colors (total with the original 193: 1197).
   MORE_PLACES: [place shown, lat, lng, country code, note]
   MORE_COLORS: [name, recipe [[dyeIndex, drops]...], dilution (0-2 = 3 water drops each), tier, placeIndex, pinLat, pinLng]
   Recipes use the existing DYES indices and DROP math; every target is exactly reachable. All new atlas entries are "found" (flag 0). */
@@ data/more-places.js @@
@@ data/more-colors.js @@
const COLORS=[["cherry",[[3,3]],0,1],["tomato",[[3,2],[2,1]],0,2],["coral",[[2,2],[4,1]],0,2],["blood orange",[[3,3],[2,1]],0,2],["clementine",[[2,3]],0,1],["apricot",[[2,1]],1,3],["peach",[[2,1],[4,1]],1,3],["golden marigold",[[0,2],[2,1]],0,2],["butter",[[0,1]],1,3],["citron",[[0,3]],0,1],["canary",[[0,3]],0,1],["honey",[[0,2],[2,2]],0,2],["mustard",[[0,3],[2,1]],0,2],["lime",[[0,2],[10,1]],0,2],["chartreuse",[[10,2],[0,1]],0,2],["spring green",[[10,2],[7,1]],0,2],["kelly green",[[10,3]],0,1],["mint",[[10,1]],1,3],["seafoam",[[10,1],[7,1]],1,3],["pistachio",[[10,2],[0,1]],1,3],["grass",[[10,2],[0,1]],0,2],["fern",[[10,3],[12,1]],0,2],["emerald",[[10,3],[7,1]],0,2],["jade",[[10,2],[7,1]],0,2],["deep teal",[[7,2],[10,2]],0,2],["turquoise",[[7,1],[10,1]],1,3],["aqua",[[7,2],[10,1]],0,2],["sky",[[7,1]],1,3],["baby blue",[[7,1]],1,3],["powder blue",[[7,1]],2,3],["cornflower",[[7,2]],1,3],["royal blue",[[7,3]],0,1],["deep cobalt",[[7,3]],0,1],["navy",[[7,3],[12,1]],0,2],["periwinkle",[[7,1],[5,1]],1,3],["lavender",[[5,1]],2,3],["lilac",[[5,1],[4,1]],1,3],["ultraviolet",[[5,2],[7,1]],0,2],["grape",[[5,3]],0,1],["plum",[[5,2],[3,1]],0,2],["magenta",[[4,2],[5,1]],0,2],["hot pink",[[4,3]],0,1],["bubblegum",[[4,1]],1,3],["blush",[[4,2],[3,1]],0,2],["wild rose",[[4,2],[3,1]],0,2],["raspberry",[[3,2],[4,2]],0,2],["watermelon",[[3,1],[4,2]],0,2],["salmon",[[3,1],[2,1],[4,1]],1,3],["strawberry",[[4,2],[3,1]],0,2],["ruby",[[3,3],[4,1]],0,2],["crimson",[[3,3]],0,1],["brick",[[3,2],[12,1]],0,2],["rust",[[3,2],[2,2],[12,1]],0,3],["burnt orange",[[2,3],[3,1],[12,1]],0,3],["pumpkin",[[2,3],[3,1]],0,2],["amber",[[0,2],[2,1]],0,2],["gold",[[0,3],[2,1]],0,2],["saffron",[[0,3],[2,1]],1,3],["sunflower",[[0,3]],0,1],["olive",[[0,2],[10,1],[12,1]],0,3],["moss",[[10,2],[0,1],[12,1]],0,3],["sage",[[10,1],[0,1]],1,3],["forest",[[10,3],[12,1]],0,2],["hunter",[[10,3],[7,1],[12,1]],0,3],["pine",[[10,2],[7,1],[12,1]],0,3],["ocean",[[7,3],[10,1]],0,2],["cerulean",[[7,2],[10,1]],0,2],["steel blue",[[7,2],[12,1]],1,3],["denim",[[7,3]],1,3],["midnight",[[7,3],[12,2]],0,2],["indigo",[[7,2],[5,2],[12,1]],0,3],["amethyst",[[5,2]],1,3],["orchid",[[4,2],[5,1]],1,3],["mauve",[[5,1],[4,1]],1,3],["wisteria",[[5,1]],1,3],["eggplant",[[5,2],[12,2]],0,2],["wine",[[3,2],[5,1],[12,1]],0,3],["burgundy",[[3,3],[12,1]],0,2],["maroon",[[3,3],[12,2]],0,2],["mahogany",[[3,2],[2,1],[12,1]],0,3],["chestnut",[[3,2],[2,1],[12,2]],0,3],["chocolate",[[2,2],[12,2]],0,2],["coffee",[[2,1],[0,1],[12,2]],0,3],["caramel",[[2,2],[0,1],[12,1]],0,3],["tan",[[2,1],[0,1],[12,1]],1,3],["sand",[[0,1],[2,1],[12,1]],1,3],["khaki",[[0,1],[10,1],[12,1]],1,3],["cream",[[0,1]],2,3],["charcoal",[[12,3],[7,1]],0,2],["slate",[[12,2],[7,1]],1,3],["graphite",[[12,3]],0,1],["ash",[[12,1],[10,1]],2,3],["smoke",[[12,2]],1,3],["jet",[[12,3]],0,1],["squid ink",[[12,3],[7,1]],0,2],["pearl",[[0,1],[4,1]],2,3],["harbor fog",[[7,1],[12,1],[0,1]],2,3],["late peach",[[2,1],[4,1],[0,1]],1,3],["dusty rose",[[4,1],[2,1],[12,1]],1,3],["terracotta",[[2,2],[3,1],[12,1]],0,3],["clay",[[2,2],[3,1],[12,1]],1,3],["sienna",[[2,2],[3,1],[12,2]],0,3],["ochre",[[0,2],[2,1],[12,1]],0,3],["dijon",[[0,3],[12,1]],0,2],["goldenrod",[[0,2],[2,1],[12,1]],0,3],["brass",[[0,2],[10,1],[12,1]],0,3],["bronze",[[2,2],[0,1],[12,1]],0,3],["copper",[[2,2],[3,1],[0,1],[12,1]],0,3],["wheat",[[0,1],[2,1]],2,3],["oat",[[0,1],[2,1],[12,1]],2,3],["mushroom",[[0,1],[4,1],[12,1]],2,3],["taupe",[[2,1],[5,1],[12,3]],0,3],["mocha",[[2,1],[4,1],[12,2]],1,3],["espresso",[[2,1],[3,1],[12,3]],0,3],["walnut",[[2,1],[3,1],[12,3]],1,3],["cinnamon",[[2,3],[3,1],[12,1]],0,3],["paprika",[[3,2],[2,2],[12,2]],0,3],["cayenne",[[3,3],[12,1]],1,3],["oxblood",[[3,3],[12,3]],0,2],["merlot",[[3,2],[5,1],[12,2]],0,3],["sangria",[[3,3],[5,1],[12,1]],0,3],["cranberry",[[3,3],[4,1],[12,1]],0,3],["mulberry",[[5,2],[3,1],[12,2]],0,3],["boysenberry",[[5,2],[4,1],[12,1]],0,3],["blackberry",[[5,2],[3,1],[12,3]],0,3],["fig",[[5,2],[12,2]],1,3],["heather",[[5,1],[7,1],[12,1]],1,3],["thistle",[[5,1],[4,1]],2,3],["smoky quartz",[[3,1],[12,2]],2,3],["storm",[[7,1],[10,1],[12,2]],0,3],["deep sea",[[7,3],[10,1],[12,2]],0,3],["petrol",[[7,2],[10,2],[12,1]],0,3],["peacock",[[7,2],[10,1],[12,1]],0,3],["blue lagoon",[[10,2],[7,1]],1,3],["sea glass",[[10,1],[7,1]],2,3],["eucalyptus",[[10,2],[7,1],[12,1]],1,3],["celadon",[[10,1],[0,1]],2,3],["matcha",[[10,2],[0,2],[12,1]],0,3],["avocado",[[10,3],[0,1],[12,1]],0,3],["artichoke",[[10,1],[0,1],[12,1]],2,3],["seaweed",[[10,2],[0,1],[12,3]],0,3],["juniper",[[10,2],[7,1],[12,2]],0,3],["spruce",[[10,1],[7,1],[12,3]],0,3],["basil",[[10,3],[0,1],[12,1]],0,3],["pistachio cream",[[10,1],[0,1]],2,3],["glacier",[[7,1],[10,1]],3,3],["dusk",[[7,2],[5,1],[12,1]],0,3],["twilight",[[7,2],[5,2],[12,1]],0,3],["iris",[[7,2],[5,2]],0,2],["blueberry",[[7,3],[5,1]],1,3],["sapphire",[[7,3],[5,1],[12,1]],0,3],["lapis",[[7,3],[12,1]],1,3],["prussian",[[7,3],[10,1],[12,2]],0,3],["hydrangea",[[7,2],[5,1]],2,3],["cornsilk",[[0,1],[2,1]],3,3],["flamingo",[[4,2],[2,1]],1,3],["guava",[[3,1],[4,1],[2,1]],0,3],["papaya",[[2,2],[4,1]],1,3],["cantaloupe",[[2,2],[0,1]],1,3],["mango",[[0,2],[2,2]],1,3],["nectarine",[[2,3],[0,1]],1,3],["grapefruit",[[3,2],[4,1],[2,1]],0,3],["persimmon",[[2,3],[3,1]],0,2],["vermilion",[[3,2],[2,1]],0,2],["firecracker",[[3,3],[2,1]],0,2],["sea-glass gray",[[10,1],[7,1],[12,1]],3,3],["pale oyster",[[0,1],[4,1],[12,1]],3,3],["driftwood",[[2,1],[7,1],[12,2]],2,3],["cool putty",[[2,1],[7,1],[12,1]],3,3],["lichen",[[10,1],[0,1],[5,1],[12,1]],2,3],["verdigris",[[10,2],[7,1],[0,1]],1,3],["patina",[[10,2],[7,1],[12,1],[0,1]],1,3],["oxidized copper",[[10,2],[7,1],[2,1],[12,1]],0,3],["antique gold",[[0,2],[5,1],[12,1]],1,3],["old brass",[[0,2],[7,1],[12,2]],1,3],["tarnished silver",[[12,1],[7,1],[0,1]],3,3],["gunmetal",[[12,3],[7,1],[10,1]],0,3],["obsidian",[[12,3],[7,1],[10,1]],0,3],["raven",[[12,3],[5,1]],0,2],["midnight plum",[[5,2],[12,3]],0,2],["bruised violet",[[5,1],[3,1],[7,1],[12,1]],1,3],["thunder",[[12,2],[5,1],[7,1]],0,3],["ash rose",[[4,1],[3,1],[12,1]],2,3],["faded brick",[[3,1],[2,1],[7,1],[12,1]],1,3],["toasted mauve",[[4,1],[5,1],[2,1],[12,1]],1,3],["desert dusk",[[2,1],[4,1],[7,1],[12,1]],2,3],["dune",[[0,1],[2,1],[7,1]],3,3],["moth wing",[[0,1],[5,1],[12,2]],2,3],["bottle green",[[10,3],[7,1],[3,1],[12,1]],0,3],["deep teal ink",[[7,2],[10,2],[3,1],[12,2]],0,3],["ultramarine shadow",[[7,3],[5,1],[12,2]],1,3],["northern lights",[[10,2],[7,2],[4,1]],1,3],["slate rose",[[4,1],[7,1],[12,2]],2,3]];
MORE_COLORS.forEach(c => COLORS.push([c[0], c[1], c[2], c[3]]));
const LET = { R: 3, Y: 0, B: 7, G: 10, O: 2, P: 5, K: 4, X: 12 };
const TIER_NAME = ['', 'easy', 'medium', 'hard', 'extra hard'], TIER_HUE = [0, 5, 12, 30, 45];
const BY_TIER = [[], [], [], []]; COLORS.forEach((c, i) => BY_TIER[c[3]].push(i));
const DIFF = c => { const dy = c[1].length, dr = c[1].reduce((s, r) => s + r[1], 0); return (dy - 1) * 3 + dr * 0.5 + c[2] * 2.5 + (dy >= 3 ? 2 : 0); };
const ORDER = COLORS.map((c, i) => i).sort((a, b) => DIFF(COLORS[a]) - DIFF(COLORS[b]) || a - b);
function recipeA(recipe, dil) {
  const A = [0, 0, 0];
  recipe.forEach(([i, n]) => { for (let k = 0; k < 3; k++) A[k] += n * DROP * DYES[i].a[k]; });
  return A.map(v => v * Math.pow(0.5, dil));
}
const FIRST = [['hot pink', [[4, 2]]], ['canary', [[0, 3]]], ['royal blue', [[7, 2]]]];
function dailyTarget(day) {
  const key = 'utc-' + day; let h = 7; for (const ch of key) h = Math.imul(31, h) + ch.charCodeAt(0) | 0;
  const rnd = mulberry32(h); let idx = Math.floor(rnd() * COLORS.length); for (let k = 0; k < 400 && xTier(COLORS[idx]) > 2; k++) idx = Math.floor(rnd() * COLORS.length); const c = COLORS[idx];
  const recipe = c[1].map(([i, k]) => ({ i, n: k })), A = recipeA(c[1], c[2]);
  return { A, rgb: displayColor(A), recipe, dil: c[2], drops: recipe.reduce((s, r) => s + r.n, 0), name: c[0], tier: xTier(c), idx };
}
function bagNext(level) {
  // every player gets their own shuffled order of all colors (seeded per save), walked one by one — no tiers, no patterns
  if (!save.played) { save.played = save.bag && save.bag.o ? save.bag.o.slice(0, save.bag.p || 0) : []; }
  const N = COLORS.length, first = FIRST[0][0], played = new Set(save.played);
  if (!save.seed) { save.seed = (crypto && crypto.getRandomValues ? crypto.getRandomValues(new Uint32Array(1))[0] : Math.floor(Math.random() * 4294967296)) >>> 0 || 1; save.op = 0; }
  const perm = () => { if (bagNext._s === save.seed && bagNext._p) return bagNext._p; let a = save.seed >>> 0; const r = () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; const P = Array.from({ length: N }, (_, i) => i); for (let i = N - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); const t = P[i]; P[i] = P[j]; P[j] = t; } bagNext._s = save.seed; bagNext._p = P; return P; };
  { const rq = save.retry || []; for (let r = 0; r < rq.length; r++) if (rq[r].at <= level && COLORS[rq[r].i]) { const it = rq.splice(r, 1)[0]; save.retry = rq; save.retryNow = COLORS[it.i][0]; return it.i; } }
  if (level <= 10) { const P = perm(); for (let k = save.op || 0; k < N; k++) { const i = P[k]; if (played.has(i) || COLORS[i][0] === first || xTier(COLORS[i]) >= 3) continue; save.played.push(i); if (k === (save.op || 0)) save.op = k + 1; return i; } }
  for (let lap = 0; lap < 2; lap++) { const P = perm(); while ((save.op || 0) < N) { const i = P[save.op++]; if (!played.has(i) && COLORS[i][0] !== first) { save.played.push(i); return i; } }
    save.played = []; played.clear(); save.seed = ((save.seed * 1103515245 + 12345) >>> 0) || 7; save.op = 0; }
  return Math.floor(Math.random() * N);
}
let XT = null; function xScore(c) { const n = c[1].reduce((s, r) => s + r[1], 0); return c[1].length * 3 + n * .6 + (c[2] || 0) * 2.5 + c[3] * 2 + (idHash(c[0]) % 100) / 400; }
function xTier(c) { if (!c) return 1; if (!XT) { const sc = COLORS.map(xScore).sort((a, b) => a - b), q = f => sc[Math.floor(sc.length * f)]; XT = [q(.22), q(.52), q(.82)]; } const v = xScore(c); return v < XT[0] ? 1 : v < XT[1] ? 2 : v < XT[2] ? 3 : 4; }
function makeTarget(level) {
  if (level <= 1) { const f = FIRST[0], A = recipeA(f[1], 0); return { A, rgb: displayColor(A), recipe: f[1].map(([i, n]) => ({ i, n })), dil: 0, drops: f[1][0][1], name: f[0], tier: 1, idx: -1 }; }
  let idx;
  if (save.cur && save.cur.l === level && COLORS[save.cur.i]) idx = save.cur.i;
  else {
    idx = bagNext(level);
    save.cur = { l: level, i: idx }; save.lastTier = xTier(COLORS[idx]); persist();
  }
  const c = COLORS[idx], tier = xTier(c);
  const recipe = c[1].map(([i, n]) => ({ i, n }));
  const A = recipeA(c[1], c[2]);
  return { A, rgb: displayColor(A), recipe, dil: c[2], drops: recipe.reduce((s, r) => s + r.n, 0), name: c[0], tier, idx };
}

/* ================= Persisted progress ================= */
const PROFILE = (() => { try { if (/[#&]mx=/.test(location.hash)) localStorage.setItem('mixio.profile', 'main'); const p = localStorage.getItem('mixio.profile') === 'main' ? 'main' : 'demo'; if (p === 'demo') { let signed = false; try { const sb = JSON.parse(localStorage.getItem('mixio.sb.demo') || 'null'); signed = !!(sb && sb.refresh_token && sb.user && !sb.user.anon); } catch (e) {} let played = false; try { const d = JSON.parse(localStorage.getItem('mixio.demo') || 'null'); played = !!(d && ((d.level || 1) > 1 || d.acctOffline)); } catch (e) {} if (!signed && !played) ['mixio.demo', 'mixio.demo.best', 'mixio.sb.demo'].forEach(k => localStorage.removeItem(k)); } return p; } catch (e) { return 'demo'; } })(); const KEY = PROFILE === 'demo' ? 'mixio.demo' : 'mixio.v1';
function recount50() { try { const have = new Set((save.palette || []).map(p => p.n)); (save.flown || []).forEach(n => { if (have.has(n)) return; const c = COLORS.find(c => c[0] === n); if (!c) return; save.palette.push({ n, h: rgbToHex(displayColor(recipeA(c[1], c[2]))), p: 50, d: Date.now() }); }); } catch (e) {} }
let save = { level: 1, coins: 0, muted: false, haptics: true, cb: false, bg: 'black', glass: 'tumbler', owned: ['black', 'white', 'tumbler'], stats: { sum: 0, n: 0, perfects: 0, mixed: 0, streak: 0, lastDay: '' }, palette: [] };
try {
  let s = JSON.parse(localStorage.getItem(KEY) || 'null');
  if (!s && PROFILE !== 'demo') { const o = JSON.parse(localStorage.getItem('tint.progress.v1') || 'null'); if (o) s = { level: o.level, coins: o.coins, muted: o.muted }; }
  if (s && typeof s.level === 'number') { const st = Object.assign({}, save.stats, s.stats || {}); save = Object.assign(save, s); save.stats = st; save.owned = Array.from(new Set([...(s.owned || []), 'black', 'white', 'tumbler'])); }
} catch (e) {}
let hadLocal = false; try { hadLocal = !!localStorage.getItem(KEY); const bk = JSON.parse(localStorage.getItem(KEY + '.best') || 'null'); if (bk && typeof bk.level === 'number' && bk.level > (save.level || 1)) { Object.assign(save, mergeSaves(save, bk, true)); hadLocal = true; } } catch (e) {}
function renameSave() { const RN = {"lake bled swamp": "lake bled reed", "lake bled deep peat": "lake bled deep reed", "lucerne swamp": "lucerne reed", "lucerne deep peat": "lucerne deep reed", "hallstatt deep swamp": "hallstatt deep reed", "hallstatt mud": "hallstatt lakebed", "udaipur swamp": "udaipur reed", "udaipur deep peat": "udaipur deep reed", "chicago deep swamp": "chicago river", "dead sea deep swamp": "dead sea deep mud", "lac rose swamp": "lac rose mud", "lake hillier peat": "lake hillier bush", "laguna colorada peat": "colorada vicuña", "lake titicaca peat": "lake titicaca reed", "makgadikgadi peat": "makgadikgadi mud", "new orleans peat": "new orleans bayou", "guilin swamp": "guilin paddy", "seattle swamp": "seattle wetland", "queenstown swamp": "queenstown tussock", "congo papaya": "congo palm oil", "chicago cranberry": "chicago brick", "yosemite eucalyptus": "yosemite sage", "tenerife eucalyptus": "tenerife laurel", "jeju eucalyptus": "jeju camellia leaf", "bora bora eucalyptus": "bora bora palm", "skye eucalyptus": "skye bracken", "socotra eucalyptus": "socotra dragon tree", "galapagos eucalyptus": "galapagos cactus", "corsica eucalyptus": "corsica maquis", "vatnajokull thistle": "vatnajokull twilight", "kamchatka thistle": "kamchatka fireweed", "lalibela matcha": "lalibela juniper", "lalibela wisteria": "lalibela jacaranda", "luxor matcha": "luxor papyrus", "luxor wisteria": "luxor blue lotus", "djenne matcha": "djenne neem", "djenne tile": "djenne indigo cloth", "djenne dusty peony": "djenne bissap", "djenne teak": "djenne banco", "meteora matcha": "meteora oak", "angkor matcha": "angkor paddy", "varanasi matcha": "varanasi neem", "varanasi tile": "varanasi silk", "luang prabang matcha": "luang prabang mekong", "cameron army": "cameron jungle", "kentucky army": "kentucky moss", "okavango army": "okavango papyrus", "maasai mara army": "maasai mara acacia", "ngorongoro army": "ngorongoro acacia", "gobi bright army": "gobi bright saxaul", "ulaanbaatar army": "ulaanbaatar steppe", "chefchaouen stone": "chefchaouen mist", "blue lagoon spruce": "blue lagoon moss", "kimberley lotus": "kimberley waterlily", "miami dusty lotus": "miami dusty flamingo", "lake natron dune": "natron salt crust", "tekapo cranberry": "tekapo lupin", "vinales rosehip": "vinales flamboyan", "oaxaca rosehip": "oaxaca cochineal", "munnar dusty rosehip": "munnar red earth", "kigali dusty rosehip": "kigali red earth", "cano cristales cacao": "cano cristales rock", "victoria falls cacao": "victoria falls gorge", "everglades cacao": "everglades mangrove", "kauai cacao": "kauai red dirt", "quebec nightshade": "quebec blueberry", "redwood nightshade": "redwood huckleberry", "plitvice nightshade": "plitvice bilberry", "salalah teak": "salalah frankincense", "agra wisteria": "agra jamun", "bagan wisteria": "bagan dusk", "darjeeling lavender": "darjeeling dusk", "banaue pale lavender": "banaue pale ube", "banaue heather": "banaue taro", "banaue thistle": "banaue dusty ube", "boseong heather": "boseong azalea", "boseong thistle": "boseong dusk", "darjeeling thistle": "darjeeling twilight", "drakensberg pear": "drakensberg aloe", "cape cod olive": "cape cod marsh", "cape cod persimmon": "cape cod sunset", "granada orchid": "granada geranium", "shiraz orchid": "shiraz damask rose", "salalah orchid": "salalah desert rose", "maldives orchid": "maldives hibiscus", "lagos malachite": "lagos palm frond", "kano malachite": "kano neem", "mumbai malachite": "mumbai monsoon", "fes malachite": "fes zellige", "samarkand malachite": "samarkand dome", "istanbul malachite": "istanbul iznik", "hoi an malachite": "hoi an river", "isfahan jade": "isfahan tilework", "sri lanka jade": "sri lanka tea hills", "paro jade": "paro blue pine", "valencia pale jade": "valencia pale tile", "kerala ube": "kerala brinjal", "mumbai ube": "mumbai jamun", "rio ube": "rio açaí", "grenada ube": "grenada sorrel", "jaipur dusty ube": "jaipur dusty jamun", "banda dusty ube": "banda dusty clove", "salalah ube": "salalah dusk", "red sea hibiscus": "red sea coral", "raja ampat hibiscus": "raja ampat sea fan", "camargue paprika": "camargue red rice", "camargue heather": "camargue statice", "cameron paprika": "cameron strawberry", "burgundy berry": "burgundy cassis", "burgundy tobacco": "burgundy oak", "bavaria tobacco": "bavaria pretzel", "kentucky heather": "kentucky redbud", "vermont heather": "vermont lilac", "almaty olive": "almaty poplar", "yerevan marmalade": "yerevan apricot", "mumbai caramel": "mumbai chai", "tunis toffee": "tunis date", "valencia toffee": "valencia tiger nut", "miami coffee": "miami cuban coffee", "miami tobacco": "miami cigar", "accra coffee": "accra cocoa", "olympic bluebell": "olympic huckleberry", "hoi an lapis": "hoi an silk", "penang dusty lapis": "penang dusty batik", "penang amethyst": "penang dusk", "hoi an amethyst": "hoi an lantern", "tulum tobacco": "tulum cacao", "bangkok peony": "bangkok lotus", "savannah peony": "savannah azalea", "angkor dusty peony": "angkor dusty lotus", "varanasi dusty peony": "varanasi dusty lotus", "paro deep peony": "paro deep blossom", "faroe spruce": "faroe grass roof", "lofoten deep spruce": "lofoten deep kelp", "tasmania spruce": "tasmania myrtle", "redwood deep pine": "redwood deep fern", "big sur spruce": "big sur cypress", "giza bright midnight": "giza night sky", "baja bright midnight": "baja night sea", "atacama camel": "atacama vicuña", "makgadikgadi camel": "makgadikgadi grass", "etosha camel": "etosha dust", "red sea dusty atoll": "red sea dusty shoal", "hawaii dusty atoll": "hawaii dusty surf", "bali atoll": "bali surf", "phuket atoll": "phuket andaman", "mauritius atoll": "mauritius lagoon"}; (save.palette || []).forEach(p => { if (RN[p.n]) p.n = RN[p.n]; }); if (save.flown) save.flown = save.flown.map(n => RN[n] || n); if (save.cur && RN[save.cur.n]) save.cur.n = RN[save.cur.n];  }
renameSave();
const hotData = (window.claude && window.claude.hot && window.claude.hot.data) || null;
if (hotData && hotData.level && ((hotData.t || 0) > (save.t || 0) || hotData.level > (save.level || 1))) save = Object.assign(save, mergeSaves(save, hotData, true));



/* identity color DNA: name + birthday + favorite color -> your color, fixed until you change it */
const IDFAV = [['red', 356, '#ff3b4f'], ['coral', 12, '#ff6a55'], ['orange', 28, '#ff9a2e'], ['gold', 46, '#ffc93a'], ['lime', 88, '#a6e83a'], ['green', 142, '#2fd27a'], ['teal', 172, '#19d3b5'], ['aqua', 192, '#2fd0ff'], ['blue', 216, '#3c86ff'], ['indigo', 240, '#5a62ff'], ['violet', 268, '#9a5cff'], ['pink', 322, '#ff5cc0']];
const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
function idHash(str) { let h = 2166136261; for (const ch of String(str || '').trim().toLowerCase()) { h ^= ch.codePointAt(0); h = Math.imul(h, 16777619) >>> 0; } return h; }
function idColor(id) { if (!id) return null; const f = IDFAV.find(x => x[0] === id.fav) || IDFAV[7], h1 = idHash(id.name), n1 = (h1 % 1000) / 1000, n2 = ((h1 >>> 10) % 1000) / 1000, m = (id.m || 1) - 1, d = id.d || 1;
  const H = (f[1] + Math.sin(m / 12 * Math.PI * 2) * 12 + (d / 31 - .5) * 10 + (n1 - .5) * 26 + 360) % 360, S = .62 + .22 * n2, L = .56 + .05 * Math.cos(m / 12 * Math.PI * 2) + (n1 - .5) * .04;
  const C = (1 - Math.abs(2 * L - 1)) * S, X = C * (1 - Math.abs((H / 60) % 2 - 1)), o = L - C / 2, [a, b, c] = H < 60 ? [C, X, 0] : H < 120 ? [X, C, 0] : H < 180 ? [0, C, X] : H < 240 ? [0, X, C] : H < 300 ? [X, 0, C] : [C, 0, X]; return [a + o, b + o, c + o]; }

/* ===== accounts: guest by default, account unlocks the world ===== */
/* ===== online: Supabase (accounts, cloud save, world leaderboard). Fully optional: any failure = keep playing offline ===== */