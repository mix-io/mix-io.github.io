function bigBang(W, rgb, onBang) {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches; if (reduce) { setTimeout(onBang, 300); return; }
  const cv = document.createElement('canvas'); cv.className = 'wbang'; W.appendChild(cv); const D = Math.min(2, devicePixelRatio || 1), R = W.getBoundingClientRect(), Wd = R.width, Ht = R.height; cv.width = Wd * D; cv.height = Ht * D; const x = cv.getContext('2d'); x.scale(D, D);
  const ob = W.querySelector('#wBlob'), orc = ob.getBoundingClientRect(), cx = orc.left - R.left + orc.width / 2, cy = orc.top - R.top + orc.height / 2, M = Math.max(Wd, Ht);
  const cc = v => Math.round(clamp(v, 0, 1) * 255), rgbs = [rgb, rgb.map(v => v * 1.25 + .12), rgb.map(v => 1 - v * .55), [1, 1, 1], rgb.map(v => v * .7 + .3)], cols = rgbs.map(c => `rgb(${c.map(cc).join(',')})`), c0 = rgbs[0].map(cc).join(',');
  const P = []; for (let i = 0; i < 300; i++) { const r0 = M * (.35 + Math.random() * .7); P.push({ a: Math.random() * 6.283, r0, sp: .5 + Math.random() * 1.5, s: .5 + Math.random() * 1.7, c: cols[i % cols.length] }); }
  const B = []; let banged = false; const T0 = performance.now(), PULL = 1.75; let last = T0;
  const step = now => { if (!cv.isConnected || W.hidden) return; const t = (now - T0) / 1000, dt = Math.min(.05, (now - last) / 1000); last = now; x.globalCompositeOperation = 'source-over'; x.clearRect(0, 0, Wd, Ht); x.globalCompositeOperation = 'lighter';
    if (t < PULL) { const k = t / PULL; for (const p of P) { const rr = p.r0 * Math.pow(1 - k, 1.4 + p.sp * .5); p.a += dt * p.sp * (1.2 + 7 * k * k); const px = cx + Math.cos(p.a) * rr, py = cy + Math.sin(p.a) * rr * .92; x.globalAlpha = Math.min(1, k * 2.2) * .85; x.fillStyle = p.c; x.beginPath(); x.arc(px, py, p.s * (1 + k * .8), 0, 7); x.fill(); }
      const sr = 6 + 70 * k * k, g = x.createRadialGradient(cx, cy, 0, cx, cy, sr); g.addColorStop(0, `rgba(255,255,255,${(.35 + .65 * k).toFixed(3)})`); g.addColorStop(.4, `rgba(${c0},${(.4 * k).toFixed(3)})`); g.addColorStop(1, 'rgba(0,0,0,0)'); x.globalAlpha = 1; x.fillStyle = g; x.beginPath(); x.arc(cx, cy, sr, 0, 7); x.fill();
      const pr = 2 + 3 * Math.sin(t * 22) * k; x.fillStyle = '#fff'; x.beginPath(); x.arc(cx, cy, 2 + k * 3 + pr * .3, 0, 7); x.fill(); }
    else { const k = t - PULL; if (!banged) { banged = true; for (let i = 0; i < 520; i++) { const a = Math.random() * 6.283, v = (160 + Math.random() * 1000) * (Math.random() < .15 ? 1.7 : 1); B.push({ x: cx, y: cy, vx: Math.cos(a) * v, vy: Math.sin(a) * v, s: .7 + Math.random() * 2.8, c: cols[i % cols.length], l: 1, d: .28 + Math.random() * .5, tr: Math.random() < .35 }); } try { onBang(); } catch (e) {} }
      const neb = Math.min(1, k * 1.5) * Math.max(0, 1 - Math.max(0, k - 2.6) / 1.4), n = x.createRadialGradient(cx, cy, 0, cx, cy, M * .55); n.addColorStop(0, `rgba(${c0},${(.42 * neb).toFixed(3)})`); n.addColorStop(.45, `rgba(${c0},${(.12 * neb).toFixed(3)})`); n.addColorStop(1, 'rgba(0,0,0,0)'); x.globalAlpha = 1; x.fillStyle = n; x.fillRect(0, 0, Wd, Ht);
      for (let j = 0; j < 3; j++) { const kk = k - j * .13; if (kk < 0 || kk > 1.3) continue; const e = 1 - Math.pow(1 - kk / 1.3, 3), rad = 10 + e * M * .95; x.globalAlpha = Math.max(0, 1 - kk / 1.3) * (j === 1 ? .9 : .6); x.strokeStyle = j === 1 ? cols[0] : '#fff'; x.lineWidth = 1 + 5 * (1 - kk / 1.3); x.beginPath(); x.arc(cx, cy, rad, 0, 7); x.stroke(); }
      for (const b of B) { if (b.l <= 0) continue; const ox = b.x, oy = b.y; b.x += b.vx * dt; b.y += b.vy * dt; const f = Math.pow(.18, dt); b.vx *= f; b.vy *= f; b.l -= dt * b.d; x.globalAlpha = Math.max(0, b.l); if (b.tr) { x.strokeStyle = b.c; x.lineWidth = b.s * .8; x.beginPath(); x.moveTo(ox, oy); x.lineTo(b.x, b.y); x.stroke(); } else { x.fillStyle = b.c; x.beginPath(); x.arc(b.x, b.y, b.s, 0, 7); x.fill(); } }
      if (k < .45) { x.globalCompositeOperation = 'source-over'; x.globalAlpha = Math.pow(1 - k / .45, 2) * .95; x.fillStyle = '#fff'; x.fillRect(0, 0, Wd, Ht); }
      if (k > 4.2) { cv.style.transition = 'opacity .8s'; cv.style.opacity = '0'; setTimeout(() => cv.remove(), 850); return; } }
    requestAnimationFrame(step); };
  requestAnimationFrame(step);
}
function hexToRgb255(h) { h = h.replace('#', ''); return [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16)).join(','); }
function openIdSheet(first) {
  const sh = $('idSheet'), P = $('idPanel'), cur = save.idn || { name: '', m: 0, d: 0, fav: '' }; let st = Object.assign({}, cur);
  const days = m => [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][(m || 1) - 1];
  P.innerHTML = `<div class="rkh"><div><small>${first ? 'welcome to mix.io' : 'edit'}</small><b>your color dna</b></div>${first ? '' : '<button class="rkx" data-x="1" aria-label="Close">×</button>'}</div>
  <div class="idlead">three things about you become one color that's yours. it tints your app, your liquid and your dna orb.</div>
  <div class="idprev"><div class="idorb" id="idOrb"></div><div><small>your color</small><b id="idHex">—</b></div></div>
  <label class="idl">first name<input id="idName" class="idin" maxlength="24" autocomplete="given-name" placeholder="your name" value="${(st.name || '').replace(/"/g, '&quot;')}"></label>
  <div class="idl">birthday<div class="idbd"><div class="whl" id="idM"></div><div class="whl" id="idD"></div></div></div>
  <div class="idl">favorite color<div class="idfav">${IDFAV.map(f => `<button class="idf${st.fav === f[0] ? ' on' : ''}" data-f="${f[0]}" style="--c:${f[2]}" aria-label="${f[0]}"></button>`).join('')}</div></div>
  <button class="primary idgo" id="idGo">${first ? 'create my dna' : 'save'}</button>${first ? '<button class="idskip" data-skip="1">maybe later</button>' : ''}`;
  const wheel = (el, items, sel, onPick) => { el.innerHTML = `<div class="wsc">${items.map(t => `<div class="wi">${t}</div>`).join('')}</div><div class="wlens"></div>`; const sc = el.firstChild, its = [...sc.children], IH = 36; let cur = -1, raf = 0;
    const paint = () => { raf = 0; const y = sc.scrollTop / IH; its.forEach((it, k) => { const d = k - y, a = clamp(d, -3, 3); it.style.transform = `translate3d(0,0,0) scale(${(1 - Math.min(.3, Math.abs(a) * .1)).toFixed(3)})`; it.style.opacity = (1 - Math.min(1, Math.abs(d) * .32)).toFixed(3); it.style.color = Math.abs(d) < .5 ? '#fff' : 'rgba(255,255,255,.75)'; }); const i = clamp(Math.round(y), 0, items.length - 1); if (i !== cur) { cur = i; if (el._ready) { buzz(3); try { dialClick(); } catch (x) {} } onPick(i); } };
    let snT = 0, tch = false; const snap = () => { if (tch) return; const k = clamp(Math.round(sc.scrollTop / IH), 0, items.length - 1); if (Math.abs(sc.scrollTop - k * IH) > 2) sc.scrollTo({ top: k * IH, behavior: 'smooth' }); }; sc.addEventListener('touchstart', () => { tch = true; clearTimeout(snT); }, { passive: true }); sc.addEventListener('touchend', () => { tch = false; clearTimeout(snT); snT = setTimeout(snap, 140); }, { passive: true }); sc.addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(paint); clearTimeout(snT); snT = setTimeout(snap, 140); }, { passive: true });
    its.forEach((it, k) => it.addEventListener('click', () => sc.scrollTo({ top: k * IH, behavior: 'smooth' })));
    requestAnimationFrame(() => { sc.scrollTop = Math.max(0, sel) * IH; paint(); el._ready = true; }); };
  const fillD = () => { const n = days(st.m || 1); if (st.d > n) st.d = n; wheel($('idD'), Array.from({ length: n }, (_, i) => String(i + 1)), (st.d || 1) - 1, i => { st.d = i + 1; upd(); }); };
  const ok = () => st.name.trim() && st.m && st.d && st.fav;
  const upd = () => { const c = ok() ? idColor(st) : null, o = $('idOrb'), hx = $('idHex'); if (c) { const hex = rgbToHex(c).toUpperCase(); o.style.setProperty('--c', hex); o.classList.add('on'); hx.textContent = hex; } else { o.classList.remove('on'); hx.textContent = 'fill in all three'; } $('idGo').disabled = !ok(); };
  if (!st.m) st.m = 1; if (!st.d) st.d = 1; wheel($('idM'), MONTHS, st.m - 1, i => { const was = st.m; st.m = i + 1; if (was !== st.m && $('idD').firstChild) { const n = days(st.m); if (st.d > n) { st.d = n; } fillD(); } upd(); }); fillD(); upd();
  $('idName').addEventListener('input', e => { st.name = e.target.value; upd(); });
  P.querySelectorAll('.idf').forEach(b => b.addEventListener('click', () => { st.fav = b.dataset.f; P.querySelectorAll('.idf').forEach(x => x.classList.toggle('on', x === b)); buzz(5); upd(); }));
  const close = () => { sh.hidden = true; };
  $('idGo').addEventListener('click', () => { if (!ok()) return; save.idn = { name: st.name.trim().slice(0, 24), m: st.m, d: st.d, fav: st.fav }; persist(); buzz([8, 40, 12]); try { clink(); } catch (e) {} DNA.sig = idColor(save.idn); dnaKey = ''; if (first) setTimeout(ONB.next, 450); applyDNA(); try { HOMEBG.recolor(); } catch (e) {} try { if (!$('settings').hidden) renderSettings(true); } catch (e) {} close(); toast('your color dna is set'); });
  P.onclick = e => { if (e.target.closest('[data-x]')) close(); else if (e.target.closest('[data-skip]')) { save.idSkip = Date.now(); persist(); close(); if (first) setTimeout(ONB.next, 450); } };
  sh.onclick = e => { if (e.target === sh && !first) close(); };
  sh.hidden = false;
}
function dnaHueMix(list, tot) { const hs = ([r, g, b]) => { const mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn, l = (mx + mn) / 2; let h = 0; if (d > 1e-6) h = (mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4) * 60; return [(h + 360) % 360, d > 1e-6 ? d / (1 - Math.abs(2 * l - 1)) : 0]; };
  let X = 0, Y = 0, W = 0; list.forEach(x => { const [h, sa] = hs(x.d.rgb), w = Math.pow(x.n / tot, 1.5) * (.08 + sa * sa); X += Math.cos(h * Math.PI / 180) * w; Y += Math.sin(h * Math.PI / 180) * w; W += w; });
  if (W <= 0) return [.6, .62, .66]; const R = Math.hypot(X, Y) / W, H = (Math.atan2(Y, X) * 180 / Math.PI + 360) % 360, S = .5 + .45 * Math.min(1, R * 1.15), L = .5;
  const C = (1 - Math.abs(2 * L - 1)) * S, Xc = C * (1 - Math.abs((H / 60) % 2 - 1)), m = L - C / 2, [a, b, c] = H < 60 ? [C, Xc, 0] : H < 120 ? [Xc, C, 0] : H < 180 ? [0, C, Xc] : H < 240 ? [0, Xc, C] : H < 300 ? [Xc, 0, C] : [C, 0, Xc]; return [a + m, b + m, c + m]; }
function dnaAccent() { try { if (save.idn) return idColor(save.idn); const dc = save.dyeCount || {}, H = save.dnaHist || [], at = Object.values(dc).reduce((a, b) => a + b, 0), rc = {}; H.forEach(g => Object.entries(g.d || {}).forEach(([k, v]) => rc[k] = (rc[k] || 0) + v)); const rt = Object.values(rc).reduce((a, b) => a + b, 0);
  const W = n => (at ? (dc[n] || 0) / at : 0) * (rt ? .4 : 1) + (rt ? .6 * (rc[n] || 0) / rt : 0); const list = DYES.map(d => ({ d, n: Math.round(W(d.name) * 1000) })).filter(x => !x.d.water && x.n > 0), tot = list.reduce((s, x) => s + x.n, 0); if (!tot) return null;
  const [r, g, b] = dnaHueMix(list, tot), mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn; let h = 0; if (d > 1e-6) { h = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; h = (h * 60 + 360) % 360; }
  const wr = H.length ? H.reduce((s, q) => s + (q.n ? q.w / q.n : 0), 0) / H.length : .1, L0 = (mx + mn) / 2, Sa = d > 1e-6 ? d / (1 - Math.abs(2 * L0 - 1)) : 0, S2 = Math.max(.55, Math.min(.85, Sa * 1.3)) * (1 - .55 * Math.min(1, wr * 1.6)), LL = .58 + .16 * Math.min(1, wr * 1.6);
  const C = (1 - Math.abs(2 * LL - 1)) * S2, X = C * (1 - Math.abs((h / 60) % 2 - 1)), m = LL - C / 2, [a1, b1, c1] = h < 60 ? [C, X, 0] : h < 120 ? [X, C, 0] : h < 180 ? [0, C, X] : h < 240 ? [0, X, C] : h < 300 ? [X, 0, C] : [C, 0, X]; return [a1 + m, b1 + m, c1 + m]; } catch (e) { return null; } }
let dnaKey = ''; function applyDNA() { const c = dnaAccent(), v = c ? c.map(x => Math.round(clamp(x, 0, 1) * 255)).join(',') : '142,151,163'; if (v === dnaKey) return; dnaKey = v; document.documentElement.style.setProperty('--dna-rgb', v); try { if (SW) drawBG(); } catch (e) {} }
function persist() { setTimeout(applyDNA, 0); save.t = Date.now(); try { const o = Object.assign({}, save); delete o.coins; const j = JSON.stringify(o); localStorage.setItem(KEY, j); const bk = JSON.parse(localStorage.getItem(KEY + '.best') || 'null'); if (!bk || (o.level || 1) >= (bk.level || 1)) localStorage.setItem(KEY + '.best', j); } catch (e) {} cloudPush(); try { SB.push(); } catch (e) {} }
const BUILD = '__BUILD__'; const SITE = 'https://mix-io.github.io/', ON_SITE = /github\.io$/.test(location.hostname);
(() => { try { const m = location.hash.match(/[#&]mx=([^&]+)/); if (!m) return; const r = JSON.parse(decodeURIComponent(escape(atob(decodeURIComponent(m[1]))))); if (r && typeof r.level === 'number') { const better = r.level >= (save.level || 1); Object.assign(save, mergeSaves(save, r, better)); save.acctAsked = 0; save.acctOffline = 0; save.acct = null; window.__askAcct = 1; try { const o = Object.assign({}, save); delete o.coins; localStorage.setItem(KEY, JSON.stringify(o)); localStorage.setItem(KEY + '.best', JSON.stringify(o)); } catch (e) {} setTimeout(() => { try { persist(); } catch (e) {} }, 0); setTimeout(() => { try { toast('your save is here ✦'); } catch (e) {} }, 2500); } history.replaceState(null, '', location.pathname + location.search); } catch (e) {} })();
function mainLevel() { try { const m = JSON.parse(localStorage.getItem('mixio.v1') || 'null'), b = JSON.parse(localStorage.getItem('mixio.v1.best') || 'null'); return Math.max((m && m.level) || 0, (b && b.level) || 0); } catch (e) { return 0; } }
function bringMain() { buzz(8); const u = saveLink(); try { const w = window.open(u, '_blank'); if (!w) location.href = u; } catch (e) { location.href = u; } }
function updCheck() { if (!ON_SITE || /__BUILD/.test(BUILD)) return; try { fetch('/?b=' + Date.now(), { cache: 'no-store' }).then(r => r.text()).then(t => { const m = t.match(/const BUILD = '([0-9a-z]+)'/); if (m && m[1] !== BUILD && sessionStorage.getItem('mixio.upd') !== m[1]) { sessionStorage.setItem('mixio.upd', m[1]); try { persist(); } catch (e) {} location.replace('/?b=' + m[1] + location.hash); } }).catch(() => {}); } catch (e) {} }
updCheck(); document.addEventListener('visibilitychange', () => { if (!document.hidden) setTimeout(() => { try { if (typeof state === 'undefined' || state !== 'play' || !glassLog.length) updCheck(); } catch (e) { updCheck(); } }, 400); });
function saveLink() { let m = null; try { m = JSON.parse(localStorage.getItem('mixio.v1') || 'null'); const b = JSON.parse(localStorage.getItem('mixio.v1.best') || 'null'); if (b && (!m || (b.level || 1) > (m.level || 1))) m = b; } catch (e) {} const o = Object.assign({}, m && m.level ? m : save); delete o.coins; delete o.acct; o.eyeAll = (o.eyeAll || []).slice(-300); return SITE + '#mx=' + encodeURIComponent(btoa(unescape(encodeURIComponent(JSON.stringify(o))))); }
/* cloud save: survives new versions, cleared site data and other devices */
const CLOUD = { ref: null, busy: false, again: false, tm: 0, pushedT: 0 };
function cloudPush(now) { if (!CLOUD.ref) return; clearTimeout(CLOUD.tm); CLOUD.tm = setTimeout(cloudWrite, now ? 0 : 1500); }
function cloudWrite() { if (!CLOUD.ref || (save.t || 0) <= CLOUD.pushedT) return; if (CLOUD.busy) { CLOUD.again = true; return; } CLOUD.busy = true; const t = save.t || Date.now(), o = Object.assign({}, save); delete o.coins; let j = JSON.stringify(o); if (j.length > 200000) { o.eyeAll = (o.eyeAll || []).slice(-600); delete o.seenWall; j = JSON.stringify(o); }
  CLOUD.ref.set({ j, t, level: save.level || 1 }).then(() => { CLOUD.pushedT = t; }).catch(() => {}).finally(() => { CLOUD.busy = false; if (CLOUD.again) { CLOUD.again = false; cloudWrite(); } }); }
let BOOTED = false;
function mergeSaves(loc, rem, remWins) {
  try { migrateChroma(loc); migrateChroma(rem); } catch (e) {}
  const base = Object.assign({}, remWins ? loc : rem, remWins ? rem : loc), other = remWins ? loc : rem;
  base.stats = Object.assign({}, other.stats || {}, base.stats || {});
  const pm = {}; [...(other.palette || []), ...(base.palette || [])].forEach(p => { if (!p || !p.n) return; const q = pm[p.n]; if (!q) pm[p.n] = Object.assign({}, p); else { if ((p.p || 0) > (q.p || 0)) { q.p = p.p; if (p.m) q.m = p.m; } if (p.d && (!q.d || p.d < q.d)) q.d = p.d; } });
  base.palette = Object.values(pm).sort((a, b) => (b.d || 0) - (a.d || 0));
  base.flown = Array.from(new Set([...(other.flown || []), ...(base.flown || [])]));
  base.played = Array.from(new Set([...(other.played || []), ...(base.played || [])]));
  base.badges = Object.assign({}, other.badges || {}, base.badges || {}); Object.keys(other.badges || {}).forEach(k => { if (base.badges[k] && other.badges[k] < base.badges[k]) base.badges[k] = other.badges[k]; });
  base.setPips = Object.assign({}, other.setPips || {}); Object.entries(base.setPips || {}).forEach(() => {}); Object.entries((remWins ? rem : loc).setPips || {}).forEach(([k, v]) => { base.setPips[k] = Math.max(base.setPips[k] || 0, v); }); base.eyeBest = Math.max(loc.eyeBest || 0, rem.eyeBest || 0, base.eye || 0); base.bestStreak = Math.max(loc.bestStreak || 0, rem.bestStreak || 0);
  base.cards = Object.assign({}, other.cards || {}); Object.entries(((remWins ? rem : loc).cards) || {}).forEach(([k, v]) => { base.cards[k] = Math.max(base.cards[k] || 0, v); }); if (base.chroma == null) base.chroma = other.chroma;
  base.level = Math.max(loc.level || 1, rem.level || 1); base.totDrops = Math.max(loc.totDrops || 0, rem.totDrops || 0);
  if (!base.first || (other.first && other.first < base.first)) base.first = other.first || base.first;
  return base;
}
const cloudReady = (async () => { try { if (PROFILE === 'demo') return null; const C = window.claude; if (!C || !C.use) return null; const [db, user] = await Promise.all([C.use('db'), C.use('user')]); if (!db || !user) return null; const uid = await user.id(); if (!uid) return null;
  const ref = db.doc('data/users/' + uid + '/save'), snap = await ref.get(); let adopted = false;
  if (snap.exists) { const d = snap.data() || {}; let r = null; try { r = JSON.parse(d.j || 'null'); } catch (e) {}
    if (r && typeof r.level === 'number') { const better = !hadLocal || r.level > (save.level || 1) || (r.level === (save.level || 1) && (r.t || d.t || 0) > (save.t || 0));
      const merged = mergeSaves(save, r, better); Object.assign(save, merged); renameSave(); try { const o = Object.assign({}, save); delete o.coins; localStorage.setItem(KEY, JSON.stringify(o)); } catch (e) {} save.t = Math.max(save.t || 0, r.t || d.t || 0) + 1; CLOUD.pushedT = 0; adopted = better; CLOUD.late = better && BOOTED; } }
  CLOUD.ref = ref; cloudPush(true); return adopted; } catch (e) { return null; } })();
try { window.claude?.hot?.snapshot?.(() => save); } catch (e) {}
const LIGHT_BG = { white: 1, gray: 1 };
save.bg = 'black'; save.glass = 'tumbler'; ['face', 'acc', 'hat', 'drip', 'room', 'plantAt', 'plantStage', 'perf', 'lastRgb', 'music'].forEach(k => delete save[k]); save.owned = (save.owned || []).filter(x => ['black', 'white', 'tumbler'].includes(x));
function applyBg() { const r = document.documentElement; r.dataset.bg = save.bg; if (LIGHT_BG[save.bg]) r.setAttribute('data-light', ''); else r.removeAttribute('data-light'); if (typeof SW === 'number' && SW) drawBG(); }
(function () { const r = document.documentElement; r.dataset.bg = save.bg; if (LIGHT_BG[save.bg]) r.setAttribute('data-light', ''); })();

/* ================= Audio ================= */
let actx = null, noiseGain = null, noiseBP = null;
function audio() {
  if (save.muted) return null;
  if (!actx) {
    try {
      actx = new (window.AudioContext || window.webkitAudioContext)();
      const len = Math.floor(actx.sampleRate * .6), buf = actx.createBuffer(1, len, actx.sampleRate), d = buf.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
      const src = actx.createBufferSource(); src.buffer = buf; src.loop = true;
      const bp = actx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 500; bp.Q.value = 1.1; noiseBP = bp;
      noiseGain = actx.createGain(); noiseGain.gain.value = 0;
      src.connect(bp).connect(noiseGain).connect(actx.destination); src.start();
    } catch (e) { actx = null; }
  }
  if (actx && actx.state === 'suspended') actx.resume();
  return actx;
}
const DYE_ST = [-2, -3, -3.5, -4, -1, 1, 2, 3, 4, 3.5, 1, -4, 0, 6];
let SPLASH = null;
function plink(i) {
  const a = audio(); if (!a) return; const t = a.currentTime, water = DYES[i] && DYES[i].water, st = (DYE_ST[i] || 0) + (Math.random() * 2 - 1), f0 = 820 * Math.pow(2, st / 12), v = water ? .1 : .17;
  const o = a.createOscillator(), g = a.createGain(); o.type = 'sine'; o.frequency.setValueAtTime(f0 * 1.35, t); o.frequency.exponentialRampToValueAtTime(f0 * .55, t + .075);
  g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(v, t + .006); g.gain.exponentialRampToValueAtTime(.0001, t + .13); o.connect(g).connect(a.destination); o.start(t); o.stop(t + .15);
  if (!SPLASH) { const n = Math.floor(a.sampleRate * .07); SPLASH = a.createBuffer(1, n, a.sampleRate); const d = SPLASH.getChannelData(0); for (let k = 0; k < n; k++) d[k] = (Math.random() * 2 - 1) * Math.pow(1 - k / n, 3); }
  const ns = a.createBufferSource(), hp = a.createBiquadFilter(), ng = a.createGain(); ns.buffer = SPLASH; hp.type = 'highpass'; hp.frequency.value = water ? 3200 : 2200; ng.gain.value = water ? .025 : .04; ns.connect(hp).connect(ng).connect(a.destination); ns.start(t + .004);
}
function clink() {
  const a = audio(); if (!a) return; const t = a.currentTime;
  [[2637, .06, .32], [3951, .03, .22], [5274, .012, .14]].forEach(([f, v, d]) => { const o = a.createOscillator(), g = a.createGain(); o.type = 'sine'; o.frequency.value = f; g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(v, t + .004); g.gain.exponentialRampToValueAtTime(.0001, t + d); o.connect(g).connect(a.destination); o.start(t); o.stop(t + d + .02); });
}
function plip(pitch = 1) {
  const a = audio(); if (!a) return; const t = a.currentTime;
  [[1, 0.22], [1.9, 0.06]].forEach(([mul, vol]) => {
    const o = a.createOscillator(), g = a.createGain(); o.type = 'sine';
    o.frequency.setValueAtTime(380 * pitch * mul, t); o.frequency.exponentialRampToValueAtTime(1150 * pitch * mul, t + 0.07);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.008); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.16);
    o.connect(g).connect(a.destination); o.start(t); o.stop(t + 0.2);
  });
}
function tick() { return;
  const a = audio(); if (!a) return; const t = a.currentTime;
  const o = a.createOscillator(), g = a.createGain(); o.type = 'triangle'; o.frequency.value = 2100;
  g.gain.setValueAtTime(0.045, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.03);
  o.connect(g).connect(a.destination); o.start(t); o.stop(t + 0.04);
}
function chime(good) { return;
  const a = audio(); if (!a) return; const t = a.currentTime;
  const notes = good ? [659, 988, 1319] : [523, 659];
  notes.forEach((f, i) => {
    const o = a.createOscillator(), g = a.createGain(); o.type = 'sine'; o.frequency.value = f;
    const s = t + i * 0.09; g.gain.setValueAtTime(0.0001, s); g.gain.exponentialRampToValueAtTime(0.12, s + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, s + 1.1);
    o.connect(g).connect(a.destination); o.start(s); o.stop(s + 1.2);
  });
}
function dripSnd(pitch, vol) {
  const a = audio(); if (!a) return; const t = a.currentTime, o = a.createOscillator(), g = a.createGain(); o.type = 'sine';
  o.frequency.setValueAtTime(420 * pitch, t); o.frequency.exponentialRampToValueAtTime(1100 * pitch, t + 0.05);
  g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol || 0.09, t + 0.006); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);
  o.connect(g).connect(a.destination); o.start(t); o.stop(t + 0.14);
}
function chord() { return;
  const a = audio(); if (!a) return; const t = a.currentTime;
  [523, 659, 784, 1047, 1319].forEach((f, i) => { const o = a.createOscillator(), g = a.createGain(); o.type = i % 2 ? 'triangle' : 'sine'; o.frequency.value = f; const s = t + i * 0.07; g.gain.setValueAtTime(0.0001, s); g.gain.exponentialRampToValueAtTime(0.1, s + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, s + 1.8); o.connect(g).connect(a.destination); o.start(s); o.stop(s + 1.9); });
}
const IOSH = (() => { try { if ('vibrate' in navigator) return null; const l = document.createElement('label'); l.style.cssText = 'position:fixed;left:-99px;top:-99px;width:1px;height:1px;overflow:hidden;opacity:0;pointer-events:none'; const i = document.createElement('input'); i.type = 'checkbox'; i.setAttribute('switch', ''); l.appendChild(i); document.body.appendChild(l); let lastT = 0; return () => { const n = performance.now(); if (n - lastT < 40) return; lastT = n; try { l.click(); } catch (e) {} }; } catch (e) { return null; } })();
const haptic = p => { if (!save.haptics) return; try { if (navigator.vibrate) { navigator.vibrate(p); return; } } catch (e) {} if (IOSH) { const n = Array.isArray(p) ? Math.ceil(p.length / 2) : 1; for (let k = 0; k < n; k++) setTimeout(IOSH, k * 70); } };
const buzz = ms => { if (!navigator.vibrate) { haptic(ms); return; } if (!save.haptics) return; try { navigator.vibrate && navigator.vibrate(ms); } catch (e) {} };


/* ================= Drip ================= */
const DRIP = {
  onTarget() {}, onDrop() {}, onEmpty() {}, onResult() {}, onStir() {}, onDye() {}, clearTint() {}, wake() {}, hit() { return false; }, onTap() {}, update() {}, draw() {}, say() {},
  toss(pct, rgb, done) {
    if (!SW) { done(); return; }
    const app = $('app').getBoundingClientRect(), sc = scene.getBoundingClientRect(), cr = $('coins').getBoundingClientRect();
    const sx = sc.left - app.left + G.cx, sy = sc.top - app.top + G.y0, tx = cr.left - app.left + 16, ty = cr.top - app.top + cr.height / 2;
    const sad = pct < 45, size = sad ? 5 : 7 + pct / 100 * 15;
    const gl = document.createElement('div'); gl.className = 'glob'; gl.style.background = css(rgb);
    Object.assign(gl.style, { width: size + 'px', height: size + 'px', left: (sx - size / 2) + 'px', top: (sy - size / 2) + 'px' });
    $('app').appendChild(gl); ripples.push({ x: G.cx, t: 0, a: .5 }); plip(1.1);
    const ex = sad ? sx + (tx - sx) * 0.3 : tx, ey = sad ? sy - 20 : ty, peak = Math.min(sy, ty) - (sad ? 30 : 90), fr = [];
    for (let i = 0; i <= 22; i++) { const t = i / 22, lift = t < .18 ? t / .18 : 1, x = sx + (ex - sx) * Math.max(0, (t - .12) / .88), y0 = sy - 26 * lift, tt = Math.max(0, (t - .12) / .88), y = t < .12 ? sy - 26 * (t / .12) : (1 - tt) * (1 - tt) * y0 + 2 * (1 - tt) * tt * peak + tt * tt * ey; fr.push({ transform: `translate(${x - sx}px,${y - sy}px) scale(${sad ? 1 - t * .5 : (t < .12 ? .6 + t * 3.3 : 1 - tt * .25)})`, opacity: sad && t > .6 ? 1 - (t - .6) / .4 : 1 }); }
    gl.animate(fr, { duration: sad ? 1000 : 900, easing: 'cubic-bezier(.45,0,.55,1)' }).onfinish = () => { gl.remove(); done(); };
  },
};

/* ================= Intro ================= */
const ALLN = Array.from(new Set([...FIRST.map(f => f[0]), ...COLORS.map(c => c[0])]));
function introFluid(cv, o) {
  o = o || {};
  const g = cv.getContext('webgl2', { alpha: false, depth: false, stencil: false, antialias: false });
  if (!g) return null;
  g.getExtension('EXT_color_buffer_float'); g.getExtension('EXT_color_buffer_half_float');
  const VS = `#version 300 es
in vec2 p; out vec2 v; void main(){ v=p*.5+.5; gl_Position=vec4(p,0.,1.); }`;
  const HD = `#version 300 es
precision highp float; in vec2 v; out vec4 o; uniform vec2 tx;
`;
  const SRC = {
    splat: `uniform sampler2D T; uniform vec2 pt; uniform vec3 col; uniform float r; uniform float asp; void main(){ vec2 d=v-pt; d.x*=asp; o=vec4(texture(T,v).xyz+exp(-dot(d,d)/r)*col,1.); }`,
    swirl: `uniform sampler2D V; uniform vec2 ctr; uniform float w; uniform float k; uniform float asp; void main(){ vec2 d=(v-ctr)/tx; vec2 n=(v-ctr)*vec2(asp,1.)*2.; vec2 tg=w*vec2(-d.y,d.x)*exp(-dot(n,n)*.55); vec2 u=texture(V,v).xy; o=vec4(mix(u,tg,k),0,1); }`,
    advect: `uniform sampler2D V; uniform sampler2D S; uniform float dt; uniform float dis; uniform vec2 vt; void main(){ vec2 c=v-dt*texture(V,v).xy*vt; o=texture(S,c)/(1.+dis*dt); }`,
    curl: `uniform sampler2D V; void main(){ float L=texture(V,v-vec2(tx.x,0)).y,R=texture(V,v+vec2(tx.x,0)).y,Tt=texture(V,v+vec2(0,tx.y)).x,B=texture(V,v-vec2(0,tx.y)).x; o=vec4(.5*(R-L-Tt+B),0,0,1); }`,
    vort: `uniform sampler2D V; uniform sampler2D C; uniform float k; uniform float dt; void main(){ float L=texture(C,v-vec2(tx.x,0)).x,R=texture(C,v+vec2(tx.x,0)).x,Tt=texture(C,v+vec2(0,tx.y)).x,B=texture(C,v-vec2(0,tx.y)).x,M=texture(C,v).x; vec2 f=.5*vec2(abs(Tt)-abs(B),abs(R)-abs(L)); f/=length(f)+1e-4; f*=k*M; f.y*=-1.; o=vec4(texture(V,v).xy+f*dt,0,1); }`,
    div: `uniform sampler2D V; void main(){ float L=texture(V,v-vec2(tx.x,0)).x,R=texture(V,v+vec2(tx.x,0)).x,Tt=texture(V,v+vec2(0,tx.y)).y,B=texture(V,v-vec2(0,tx.y)).y; o=vec4(.5*(R-L+Tt-B),0,0,1); }`,
    pres: `uniform sampler2D P; uniform sampler2D Dv; void main(){ float L=texture(P,v-vec2(tx.x,0)).x,R=texture(P,v+vec2(tx.x,0)).x,Tt=texture(P,v+vec2(0,tx.y)).x,B=texture(P,v-vec2(0,tx.y)).x; o=vec4((L+R+Tt+B-texture(Dv,v).x)*.25,0,0,1); }`,
    grad: `uniform sampler2D P; uniform sampler2D V; void main(){ float L=texture(P,v-vec2(tx.x,0)).x,R=texture(P,v+vec2(tx.x,0)).x,Tt=texture(P,v+vec2(0,tx.y)).x,B=texture(P,v-vec2(0,tx.y)).x; o=vec4(texture(V,v).xy-vec2(R-L,Tt-B),0,1); }`,
    show: `uniform sampler2D D; uniform float fade; uniform float rev; uniform float asp; uniform float uT;
float rip(vec2 q){ q*=vec2(asp,1.); float t=uT; return sin(q.x*9.+t*.55+sin(q.y*7.-t*.4)*1.6)*sin(q.y*8.5-t*.45+sin(q.x*6.+t*.3)*1.5)+.5*sin(q.x*17.-t*.8+sin(q.y*15.+t*.6))*sin(q.y*19.+t*.7); }
float M(vec2 q){ vec3 d=max(texture(D,q).rgb,vec3(0.)); return max(max(d.r,d.g),d.b); }
float Hf(vec2 q){ float m=M(q); float b=1.-exp(-m*.9); return b+.06*b*rip(q); }
void main(){
 vec2 e=vec2(.004,.004*asp);
 float m=M(v), h=Hf(v), hx=Hf(v+vec2(e.x,0.))-Hf(v-vec2(e.x,0.)), hy=Hf(v+vec2(0.,e.y))-Hf(v-vec2(0.,e.y));
 vec3 n=normalize(vec3(-hx/(2.*e.x)*.24,-hy/(2.*e.y)*.24,1.)); float slope=clamp(1.-n.z,0.,1.);
 vec3 hu=texture(D,v+n.xy*.02).rgb; float hm=max(max(hu.r,hu.g),hu.b); hu=hm>1e-4?hu/hm:vec3(0.);
 vec3 c=hu*h*(.16+.16*n.z)+vec3(.55,.6,.66)*h*h*.07;
 c+=mix(hu,vec3(.8,.96,1.),.35)*pow(slope,1.25)*1.4*smoothstep(.02,.2,h);
 vec3 Hh=normalize(vec3(-.38,.6,1.)); float sp=pow(max(dot(n,Hh),0.),70.)*smoothstep(.05,.4,h)*smoothstep(.01,.08,slope);
 float sp2=pow(max(dot(n,normalize(vec3(.5,-.4,1.))),0.),20.)*slope;
 c+=vec3(1.)*sp*1.0+vec3(.78,.9,1.)*sp2*.32; c=c/(1.+c*.55);
 float glow=0.; for(int i=0;i<8;i++){ float a=float(i)*.785398; glow+=M(v+vec2(cos(a),sin(a)*asp)*.05); } c+=hu*.06*glow/8.;
 float msk=1.; if(rev<1.6){ vec2 q=(v-.5)*vec2(asp,1.); msk=smoothstep(rev,rev-.35,length(q)*1.2); }
 c*=fade*msk; float nz=fract(52.9829189*fract(dot(gl_FragCoord.xy,vec2(.06711056,.00583715)))); c+=(nz-.5)/255.; o=vec4(c,1.); }`,
    push: `uniform sampler2D V; uniform vec2 pt; uniform vec2 tv; uniform float r; uniform float k; uniform float asp; void main(){ vec2 d=v-pt; d.x*=asp; vec2 u=texture(V,v).xy; o=vec4(mix(u,tv,k*exp(-dot(d,d)/r)),0,1); }`,
  };
  const sh = (t, s) => { const x = g.createShader(t); g.shaderSource(x, s); g.compileShader(x); if (!g.getShaderParameter(x, g.COMPILE_STATUS)) throw new Error(g.getShaderInfoLog(x)); return x; };
  const vs = sh(g.VERTEX_SHADER, VS), P = {};
  for (const k in SRC) { const pr = g.createProgram(); g.attachShader(pr, vs); g.attachShader(pr, sh(g.FRAGMENT_SHADER, HD + SRC[k])); g.bindAttribLocation(pr, 0, 'p'); g.linkProgram(pr); const u = {}; const n = g.getProgramParameter(pr, g.ACTIVE_UNIFORMS); for (let i = 0; i < n; i++) { const nm = g.getActiveUniform(pr, i).name; u[nm] = g.getUniformLocation(pr, nm); } P[k] = { pr, u: new Proxy(u, { get: (o, key) => (key in o ? o[key] : null) }) }; }
  g.bindBuffer(g.ARRAY_BUFFER, g.createBuffer()); g.bufferData(g.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), g.STATIC_DRAW); g.enableVertexAttribArray(0); g.vertexAttribPointer(0, 2, g.FLOAT, false, 0, 0);
  const mk = (w, h) => { const t = g.createTexture(); g.bindTexture(g.TEXTURE_2D, t); g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MIN_FILTER, g.LINEAR); g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MAG_FILTER, g.LINEAR); g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_S, g.CLAMP_TO_EDGE); g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_T, g.CLAMP_TO_EDGE); g.texImage2D(g.TEXTURE_2D, 0, g.RGBA16F, w, h, 0, g.RGBA, g.HALF_FLOAT, null); const f = g.createFramebuffer(); g.bindFramebuffer(g.FRAMEBUFFER, f); g.framebufferTexture2D(g.FRAMEBUFFER, g.COLOR_ATTACHMENT0, g.TEXTURE_2D, t, 0); if (g.checkFramebufferStatus(g.FRAMEBUFFER) !== g.FRAMEBUFFER_COMPLETE) throw new Error('fb'); g.clearColor(0, 0, 0, 1); g.clear(g.COLOR_BUFFER_BIT); return { t, f, w, h }; };
  const dbl = (w, h) => { let a = mk(w, h), b = mk(w, h); return { get r() { return a; }, get w() { return b; }, sw() { const x = a; a = b; b = x; } }; };
  const asp = cv.width / cv.height, sw = o.sim || 96, shh = Math.round(sw / asp), dw = o.dye || 512, dh = Math.round(dw / asp), IT = o.it || 16;
  const vel = dbl(sw, shh), dye = dbl(dw, dh), dv = mk(sw, shh), cu = mk(sw, shh), pr = dbl(sw, shh), all = [vel.r, vel.w, dye.r, dye.w, dv, cu, pr.r, pr.w];
  const bind = (u, n, tex, unit) => { g.activeTexture(g.TEXTURE0 + unit); g.bindTexture(g.TEXTURE_2D, tex.t); g.uniform1i(u[n], unit); };
  const run = (k, tgt, set) => { const p = P[k]; g.useProgram(p.pr); g.uniform2f(p.u.tx, 1 / sw, 1 / shh); set(p.u); if (tgt) { g.bindFramebuffer(g.FRAMEBUFFER, tgt.f); g.viewport(0, 0, tgt.w, tgt.h); } else { g.bindFramebuffer(g.FRAMEBUFFER, null); g.viewport(0, 0, cv.width, cv.height); } g.drawArrays(g.TRIANGLE_STRIP, 0, 4); };
  const splat = (d, x, y, col, r) => { run('splat', d.w, u => { bind(u, 'T', d.r, 0); g.uniform2f(u.pt, x, y); g.uniform3f(u.col, col[0], col[1], col[2]); g.uniform1f(u.r, r); g.uniform1f(u.asp, asp); }); d.sw(); };
  return {
    splatV: (x, y, vx, vy, r) => splat(vel, x, y, [vx, vy, 0], r), splatD: (x, y, c, r) => splat(dye, x, y, c, r),
    swirl(cx, cy, w, k) { run('swirl', vel.w, u => { bind(u, 'V', vel.r, 0); g.uniform2f(u.ctr, cx, cy); g.uniform1f(u.w, w); g.uniform1f(u.k, k); g.uniform1f(u.asp, asp); }); vel.sw(); },
    step(dt) {
      run('curl', cu, u => bind(u, 'V', vel.r, 0));
      run('vort', vel.w, u => { bind(u, 'V', vel.r, 0); bind(u, 'C', cu, 1); g.uniform1f(u.k, o.curl != null ? o.curl : 8); g.uniform1f(u.dt, dt); }); vel.sw();
      run('div', dv, u => bind(u, 'V', vel.r, 0));
      for (let i = 0; i < IT; i++) { run('pres', pr.w, u => { bind(u, 'P', pr.r, 0); bind(u, 'Dv', dv, 1); }); pr.sw(); }
      run('grad', vel.w, u => { bind(u, 'P', pr.r, 0); bind(u, 'V', vel.r, 1); }); vel.sw();
      run('advect', vel.w, u => { bind(u, 'V', vel.r, 0); bind(u, 'S', vel.r, 1); g.uniform1f(u.dt, dt); g.uniform1f(u.dis, o.vdis != null ? o.vdis : .1); g.uniform2f(u.vt, 1 / sw, 1 / shh); }); vel.sw();
      run('advect', dye.w, u => { bind(u, 'V', vel.r, 0); bind(u, 'S', dye.r, 1); g.uniform1f(u.dt, dt); g.uniform1f(u.dis, o.ddis != null ? o.ddis : .02); g.uniform2f(u.vt, 1 / sw, 1 / shh); }); dye.sw();
    },
    show(f, rv) { run('show', null, u => { bind(u, 'D', dye.r, 0); g.uniform1f(u.fade, f); g.uniform1f(u.rev, rv == null ? 9 : rv); g.uniform1f(u.asp, asp); g.uniform1f(u.uT, (performance.now() / 1000) % 600); }); },
    push(x, y, tx, ty, r, k) { run('push', vel.w, u => { bind(u, 'V', vel.r, 0); g.uniform2f(u.pt, x, y); g.uniform2f(u.tv, tx, ty); g.uniform1f(u.r, r); g.uniform1f(u.k, k); g.uniform1f(u.asp, asp); }); vel.sw(); },
    free() { try { all.forEach(o => { g.deleteTexture(o.t); g.deleteFramebuffer(o.f); }); Object.values(P).forEach(q => g.deleteProgram(q.pr)); } catch (e) {} },
  };
}
function runIntro(done) {
  { const bc = $('bootc'); if (bc) { bc.style.opacity = '0'; bc.style.pointerEvents = 'none'; setTimeout(() => { bc.style.display = 'none'; }, 520); } }
  const el = $('intro'), wm = $('iwm'), home = $('home'); el.hidden = false; el.classList.remove('bye', 'handoff');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  home.classList.add('introing'); HOMEBG.ensure(false, true); const nv = $('nav'); nv.style.transition = 'opacity .6s'; nv.style.opacity = '0';
  wm.classList.remove('on', 'pop', 'cond'); let ready = false, touched = false, down = null, gone = false;
  setTimeout(() => { wm.classList.add(reduce ? 'on' : 'cond'); }, reduce ? 100 : 600);
  setTimeout(() => { ready = true; }, reduce ? 500 : 900);
  const auto = setTimeout(() => { if (!touched) go(); }, 4500);
  el.addEventListener('pointerdown', e => { touched = true; try { audio(); } catch (e2) {} down = { x: e.clientX, y: e.clientY, t: performance.now(), m: 0 }; HOMEBG.touchPx(e.clientX, e.clientY); });
  el.addEventListener('pointermove', e => { if (!down) return; down.m = Math.max(down.m, Math.hypot(e.clientX - down.x, e.clientY - down.y)); HOMEBG.touchPx(e.clientX, e.clientY); });
  el.addEventListener('pointerup', e => { const d = down; down = null; HOMEBG.release(); if (!d) return; if (performance.now() - d.t < 250 && d.m < 10) { if (ready) go(); else setTimeout(go, 400); } });
  ['pointercancel', 'pointerleave'].forEach(ev => el.addEventListener(ev, () => { down = null; HOMEBG.release(); }));
  function go() {
    if (gone) return; gone = true; clearTimeout(auto); HOMEBG.release();
    const fin = () => { const h2 = document.querySelector('.home .hwm'); if (h2) h2.style.opacity = ''; nv.style.opacity = ''; el.hidden = true; try { wm.getAnimations && wm.getAnimations().forEach(x => x.cancel()); } catch (e) {} setTimeout(() => home.classList.remove('fadeup'), 700); try { done(); } catch (e4) {} };
    try {
      const hw = document.querySelector('.home .hwm'), a = wm.getBoundingClientRect(), b = hw.getBoundingClientRect();
      hw.style.opacity = '0'; home.classList.add('fadeup'); requestAnimationFrame(() => home.classList.remove('introing')); nv.style.opacity = ''; HOMEBG.dim();
      wm.animate([{ transform: 'none' }, { transform: `translateY(${(b.top + b.height / 2) - (a.top + a.height / 2)}px) scale(${b.height / Math.max(1, a.height)})` }], { duration: 700, easing: 'cubic-bezier(.45,0,.55,1)', fill: 'forwards' });
      setTimeout(fin, 720);
    } catch (e) { fin(); }
  }
}

/* ================= Home background swirl (one instance for intro + home) ================= */
const HOMEBG = (() => {
  const LV = [{ sim: 56, dye: 224, it: 7, sc: .48 }, { sim: 44, dye: 176, it: 6, sc: .4 }, { sim: 36, dye: 144, it: 5, sc: .32 }];
  const FL = { curl: 1.5, vdis: .35, ddis: .07 };
  let BRIGHT = .35, fl = null, cv = null, cols = null, last = 0, t = 0, acc = 0, fade = 0, lvl = 0, on = false, gain = 1, gainT = 1, rev = 9, revT0 = 0, bench = null, picked = false;
  const fg = { tx: 0, ty: 0, x: 0, y: 0, px: 0, py: 0, on: false, fresh: true, dyeT: 0 };
  const EM = [[23, 31, 0, 1.3], [29, 19, 2.1, .4], [37, 26, 4.2, 2.8], [18, 40, 1.1, 5.0], [33, 22, 3.3, 3.9]].map(([tx, ty, a, b], i) => ({ tx, ty, a, b, sp: 6 + i, next: 1 + i * .45 }));
  const reduce = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  function palette() { if (save.idn) { const c = idColor(save.idn), L = (c[0] + c[1] + c[2]) / 3, comp = c.map(v => clamp(L * 2 - v, 0, 1)), g = [.56, .6, .66]; BRIGHT = .78; return [g, [.3, .34, .4], comp.map((v, k) => v * .45 + g[k] * .55), [.42, .46, .52], c.map((v, k) => v * .25 + g[k] * .75)]; } const d = save.fav != null && DYES[save.fav] && !DYES[save.fav].water ? DYES[save.fav] : null; if (!d) { BRIGHT = .82; return [[.62, .64, .7], [.36, .38, .44], [.5, .56, .62], [.72, .72, .76]]; } BRIGHT = .72; const c = d.rgb; return [c, c.map(v => v * .72), c.map(v => Math.min(1, v * 1.08 + .04))]; }
  function build() {
    const L = Object.assign({}, LV[lvl], FL), H = $('home'); if (!cv) { cv = document.createElement('canvas'); cv.className = 'hbg'; H.insertBefore(cv, H.firstChild); }
    cv.width = Math.max(64, Math.round(innerWidth * L.sc)); cv.height = Math.max(64, Math.round(innerHeight * L.sc));
    if (fl) fl.free(); fl = introFluid(cv, L); cv.style.display = ''; cv.style.opacity = '1';
    for (let i = 0; i < 6; i++) fl.splatD(.5 + (Math.random() - .5) * .5, .5 + (Math.random() - .5) * .5, cols[i % cols.length].map(v => v * .6), .03);
  }
  const ep = (e, tt) => [.5 + .36 * Math.sin(2 * Math.PI * tt / e.tx + e.a), .5 + .36 * Math.sin(2 * Math.PI * tt / e.ty + e.b)];
  function step(dt) {
    t += dt;
    for (const e of EM) { const [x, y] = ep(e, t), [x2, y2] = ep(e, t + .1); let dx = (x2 - x), dy = (y2 - y); const l = Math.hypot(dx, dy) || 1; dx /= l; dy /= l; fl.push(x, y, dx * e.sp, dy * e.sp, .04, .05);
      if (t >= e.next) { e.next = t + 4 + Math.random() * 2.5; const c = cols[Math.random() * cols.length | 0]; fl.splatD(x, y, c.map(v => v * .3), .03); } }
    if (fg.on) { const k = 1 - Math.exp(-dt / .08); if (fg.fresh) { fg.x = fg.tx; fg.y = fg.ty; fg.fresh = false; } fg.px = fg.x; fg.py = fg.y; fg.x += (fg.tx - fg.x) * k; fg.y += (fg.ty - fg.y) * k;
      let vx = (fg.x - fg.px) / dt * 64 * 2.5, vy = (fg.y - fg.py) / dt * 64 * 2.5; const m = Math.hypot(vx, vy), cap = 70; if (m > cap) { vx *= cap / m; vy *= cap / m; }
      if (m > .5) { fl.push(fg.x, fg.y, vx, vy, .007, .45); fg.dyeT += dt; if (fg.dyeT > .12) { fg.dyeT = 0; fl.splatD(fg.x, fg.y, cols[Math.random() * cols.length | 0].map(v => v * .06), .004); } } }
    fl.swirl(.5 + .07 * Math.sin(t * .13), .5 + .07 * Math.cos(t * .11), .11, .02); fl.step(dt);
  }
  function loop(now) {
    if (!on) return; requestAnimationFrame(loop);
    const vis = ((!$('home').hidden && $('settings').hidden && $('atlas').hidden) || !$('intro').hidden) && !window.__kOn; if (!vis || document.hidden || !fl) { last = 0; return; }
    const lite = !fg.on && !revT0 && !bench; if (lite && last && now - last < 31) return;
    const ft = last ? now - last : 16; last = now; const dt = Math.min(.1, ft / 1000);
    if (bench) { bench.n++; if (bench.n > 2) bench.sum += ft; if (bench.n >= 22) { const avg = bench.sum / 20; bench = null; picked = true; if (avg > 21 && lvl < LV.length - 1) { lvl += avg > 32 ? 2 : 1; lvl = Math.min(lvl, LV.length - 1); try { build(); } catch (e) { on = false; return; } } revT0 = now; } }
    acc += dt; let n = 0; try { const SD = lite ? 1 / 30 : 1 / 60; while (acc >= SD && n < 2) { step(SD); acc -= SD; n++; } if (acc > SD * 2) acc = 0;
      gain += (gainT - gain) * (1 - Math.exp(-dt / .35));
      let target = BRIGHT * gain; if (revT0) { const k = clamp((now - revT0) / 1600, 0, 1), e = k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2; rev = e * 1.6; fade = target * e; if (k >= 1) { revT0 = 0; rev = 9; } } else if (bench) { fade = 0; } else fade += (target - fade) * (1 - Math.exp(-dt / .35));
      fl.show(fade, rev); } catch (e) { on = false; if (cv) cv.style.display = 'none'; }
  }
  return {
    ensure(bloom, fromBlack) {
      if (reduce()) { const H = $('home'), c = palette()[0]; H.style.background = `radial-gradient(120% 80% at 50% 35%, ${css(c, .22)}, rgba(0,0,0,0) 70%), #000`; return; }
      if (on && fl) return; cols = palette();
      try { build(); } catch (e) { return; } on = true; last = 0;
      if (fromBlack) { fade = 0; gain = gainT = 1.35; rev = 0; bench = picked ? null : { n: 0, sum: 0 }; if (picked) revT0 = performance.now(); } else { fade = .2; gain = gainT = 1; rev = 9; bench = null; picked = true; }
      requestAnimationFrame(loop);
    },
    dim() { gainT = 1; },
    recolor() { cols = palette(); if (fl) for (let i = 0; i < 6; i++) fl.splatD(Math.random(), Math.random(), cols[i % cols.length].map(v => v * .6), .02); },
    free() { on = false; if (fl) { try { fl.free(); } catch (e) {} fl = null; } if (cv) { cv.remove(); cv = null; } },
    touchPx(cx, cy) { if (!fl) return; fg.tx = clamp(cx / innerWidth, 0, 1); fg.ty = 1 - clamp(cy / innerHeight, 0, 1); if (!fg.on) { fg.on = true; fg.fresh = true; } },
    touch(x, y) { if (!fl) return; fg.tx = x; fg.ty = y; if (!fg.on) { fg.on = true; fg.fresh = true; } },
    release() { fg.on = false; },
  };
})();

/* ================= Share card ================= */
let lastShare = null;
function shareCard(info) {
  const S = 1080, cv = document.createElement('canvas'); cv.width = cv.height = S; const x = cv.getContext('2d');
  x.fillStyle = '#000'; x.fillRect(0, 0, S, S);
  const F = getComputedStyle(document.documentElement).getPropertyValue('--f-display').trim() || 'system-ui, sans-serif';
  const g = x.createRadialGradient(540, 360, 0, 540, 360, 420); g.addColorStop(0, 'rgba(255,255,255,.06)'); g.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = g; x.fillRect(0, 0, S, S);
  x.beginPath(); x.arc(540, 350, 230, 0, Math.PI * 2); x.fillStyle = css(info.rgb); x.fill();
  x.textAlign = 'center'; x.fillStyle = '#fff'; x.font = `600 60px ${F}`; x.fillText(info.name.toLowerCase(), 540, 680);
  if (info.date) { x.fillStyle = '#8A8F98'; x.font = `500 36px ${F}`; x.fillText(info.date, 540, 732); }
  x.fillStyle = '#fff'; x.font = `800 170px ${F}`; try { x.letterSpacing = '-6px'; } catch (e) {} x.fillText(fmtP(info.pct) + '%', 540, info.date ? 912 : 890);
  try { x.letterSpacing = '-1px'; } catch (e) {} x.font = `800 38px ${F}`; x.fillStyle = 'rgba(255,255,255,.85)'; x.fillText('mix.io', 540, 1030);
  return cv;
}
function shareDailyCard(o) {
  const S = 1080, cv = document.createElement('canvas'); cv.width = cv.height = S; const x = cv.getContext('2d');
  const F = getComputedStyle(document.documentElement).getPropertyValue('--f-display').trim() || 'system-ui, sans-serif';
  x.fillStyle = '#000'; x.fillRect(0, 0, S, S);
  const sq = (cx, col, lab) => { const r = 210; x.save(); x.shadowColor = css(col, .5); x.shadowBlur = 60; x.beginPath(); x.arc(cx, 400, r, 0, Math.PI * 2); x.fillStyle = css(col); x.fill(); x.restore(); x.fillStyle = '#7E858F'; x.font = `500 30px ${F}`; x.textAlign = 'center'; x.fillText(lab, cx, 670); };
  sq(300, o.t, 'target'); sq(780, o.y, 'your mix');
  x.fillStyle = '#fff'; x.textAlign = 'center'; x.font = `800 150px ${F}`; try { x.letterSpacing = '-5px'; } catch (e) {} x.fillText(fmtP(o.pct) + '%', 540, 850); try { x.letterSpacing = '0px'; } catch (e) {}
  x.fillStyle = '#9AA1AB'; x.font = `500 34px ${F}`; x.fillText(`${o.n} drop${o.n === 1 ? '' : 's'}`, 540, 915);
  x.fillStyle = 'rgba(255,255,255,.9)'; x.font = `800 40px ${F}`; x.fillText(`mix.io #${o.day}`, 540, 1020);
  cv.toBlob(b => {
    const f = new File([b], `mixio-${o.day}.png`, { type: 'image/png' }), dl = () => { const o2 = document.createElement('div'); o2.className = 'shareov'; o2.innerHTML = `<img alt="mix.io daily" src="${cv.toDataURL('image/png')}"><p>press and hold to save · tap outside to close</p>`; o2.addEventListener('click', e => { if (e.target === o2 || e.target.tagName === 'P') o2.remove(); }); document.body.appendChild(o2); };
    try { if (navigator.canShare && navigator.canShare({ files: [f] })) { navigator.share({ files: [f], text: `mix.io #${o.day}` }).catch(e => { if (e && e.name !== 'AbortError') dl(); }); return; } } catch (e) {}
    dl();
  }, 'image/png');
}
function showShare() {
  if (!lastShare) return; if (lastShare.y) return sharePostcard({ name: lastShare.name, mix: lastShare.y, tgt: lastShare.rgb, pct: lastShare.pct, date: Date.now(), day: lastShare.day }); const cv = shareCard(lastShare), url = cv.toDataURL('image/png');
  const fallback = () => { const o = document.createElement('div'); o.className = 'shareov'; o.innerHTML = `<img alt="mix.io result" src="${url}"><p>press and hold to save · tap outside to close</p>`; o.addEventListener('click', e => { if (e.target === o || e.target.tagName === 'P') o.remove(); }); document.body.appendChild(o); };
  cv.toBlob(b => {
    try { const f = new File([b], 'mixio.png', { type: 'image/png' }); if (navigator.canShare && navigator.canShare({ files: [f] })) { navigator.share({ files: [f], text: 'mix.io' }).catch(e => { if (e && e.name !== 'AbortError') fallback(); }); return; } } catch (e) {}
    fallback();
  }, 'image/png');
}

/* ================= Home ================= */
let navMode = 'home', navT = 0;
function navIdle() { $('nav').classList.remove('hid'); }
document.addEventListener('pointerdown', () => navIdle(), true);
function setNav(t) { navMode = t; document.querySelectorAll('#nav button').forEach(b => b.classList.toggle('on', b.dataset.t === t)); navIdle(); navDrop(t); if (t !== 'play') try { if (TUT.on()) TUT.stop(); } catch (e) {} }
function navDrop(t) { const nv = $('nav'); if (!nv) return; let d = $('navDrop'); if (!d) { d = document.createElement('span'); d.id = 'navDrop'; nv.insertBefore(d, nv.firstChild); } const b = nv.querySelector(`button[data-t="${t}"]`); if (!b || !b.offsetWidth) { d.style.opacity = '0'; return; } const x = b.offsetLeft, w = b.offsetWidth, px = d._x, pw = d._w || w; d.style.opacity = '1';
  if (px == null || matchMedia('(prefers-reduced-motion: reduce)').matches) { d.style.transition = 'none'; d.style.transform = `translateX(${x}px)`; d.style.width = w + 'px'; } else if (px !== x) { const l = Math.min(px, x), r = Math.max(px + pw, x + w); d.style.transition = 'transform .22s cubic-bezier(.4,0,.6,1), width .22s cubic-bezier(.4,0,.6,1)'; d.style.transform = `translateX(${l}px) scaleY(.82)`; d.style.width = (r - l) + 'px'; clearTimeout(d._t); d._t = setTimeout(() => { d.style.transition = 'transform .55s cubic-bezier(.3,1.5,.45,1), width .55s cubic-bezier(.3,1.5,.45,1)'; d.style.transform = `translateX(${x}px)`; d.style.width = w + 'px'; }, 200); }
  d._x = x; d._w = w; }
addEventListener('resize', () => { try { const d = $('navDrop'); if (d) d._x = null; navDrop(navMode); } catch (e) {} });