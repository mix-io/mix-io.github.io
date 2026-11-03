const SB = (() => {
  const URL0 = 'https://mfbomxwxixobhtvykrhv.supabase.co', KEY0 = 'sb_publishable_SdKYCeuHNDXBXci-hfJL7Q_pvzBtJVN', SK = PROFILE === 'demo' ? 'mixio.sb.demo' : 'mixio.sb';
  const ON = true; // flip to false to switch everything online off
  let sess = null; try { sess = JSON.parse(localStorage.getItem(SK) || 'null'); } catch (e) {}
  const keep = () => { try { sess ? localStorage.setItem(SK, JSON.stringify(sess)) : localStorage.removeItem(SK); } catch (e) {} };
  const req = async (path, { method = 'GET', body, auth = true, headers = {}, raw = false } = {}) => {
    if (!ON) throw new Error('off'); const ctl = new AbortController(), tm = setTimeout(() => ctl.abort(), 9000);
    try { const h = Object.assign({ apikey: KEY0, 'Content-Type': 'application/json' }, headers); if (auth && sess && sess.access_token) h.Authorization = 'Bearer ' + sess.access_token;
      const r = await fetch(URL0 + path, { method, headers: h, body: body ? JSON.stringify(body) : undefined, signal: ctl.signal, keepalive: !!(body && JSON.stringify(body).length < 60000) }); if (raw) return r;
      const t = await r.text(); let j = null; try { j = t ? JSON.parse(t) : null; } catch (e) {} if (!r.ok) { const er = new Error((j && (j.msg || j.message || j.error_description || j.error)) || ('http ' + r.status)); er.status = r.status; throw er; } return j; } finally { clearTimeout(tm); } };
  const setSess = j => { if (!j || !j.access_token) return false; sess = { access_token: j.access_token, refresh_token: j.refresh_token, exp: Date.now() + (j.expires_in || 3600) * 1000 - 60000, user: j.user ? { id: j.user.id, email: j.user.email || '', anon: !!j.user.is_anonymous } : (sess && sess.user) }; keep(); return true; };
  const fresh = async () => { if (!sess) return false; if (Date.now() < (sess.exp || 0)) return true; try { return setSess(await req('/auth/v1/token?grant_type=refresh_token', { method: 'POST', auth: false, body: { refresh_token: sess.refresh_token } })); } catch (e) { if (e.status === 400 || e.status === 401) { sess = null; keep(); } return false; } };
  const uid = () => sess && sess.user && sess.user.id;
  const hex = () => { try { const c = save.idn ? idColor(save.idn) : dnaAccent(); return c ? rgbToHex(c) : null; } catch (e) { return null; } };
  const row = () => ({ id: uid(), name: (SB.uname() || (save.idn && save.idn.name) || 'player').slice(0, 24) || 'player', chroma: clamp(Math.round((save.eye || 0) * 10) / 10, 0, 100), wr: clamp(Math.round(save.wr || 0), 0, 100000), level: Math.max(1, save.level || 1), found: (() => { try { return chParts().n; } catch (e) { return 0; } })(), dna: hex() });
  let pt = 0, busy = false, last = '';
  const push = async now => { if (!ON || !uid()) return; clearTimeout(pt); if (!now) { pt = setTimeout(() => push(true), 12000); return; } if (busy) return; busy = true;
    try { if (!(await fresh())) return; const r = row(), k = JSON.stringify(r); const o = Object.assign({}, save); delete o.coins;
      await req('/rest/v1/saves?on_conflict=id', { method: 'POST', headers: { Prefer: 'resolution=merge-duplicates,return=minimal' }, body: { id: uid(), data: o } });
      if (k !== last) { await req('/rest/v1/profiles?on_conflict=id', { method: 'POST', headers: { Prefer: 'resolution=merge-duplicates,return=minimal' }, body: r }); last = k; }
      SB.online = true; } catch (e) { SB.online = false; } finally { busy = false; } };
  const pull = async () => { try { if (!(await fresh())) return false; const j = await req('/rest/v1/saves?select=data,updated_at&id=eq.' + uid()); const r = j && j[0] && j[0].data; if (r && typeof r.level === 'number') { const better = r.level > (save.level || 1) || (r.level === (save.level || 1) && (r.t || 0) > (save.t || 0)); const m = mergeSaves(save, r, better); Object.assign(save, m); save.acct = { id: uid(), email: sess.user.email, name: (save.idn && save.idn.name) || '', p: 'email', t: Date.now() }; save.acctMode = 'account'; persist(); return better; } } catch (e) {} return false; };
  return {
    online: null, ON,
    signedIn: () => !!uid(), email: () => sess && sess.user && sess.user.email,
    async sendCode(email) { await req('/auth/v1/otp', { method: 'POST', auth: false, body: { email, create_user: true } }); return true; },
    async verify(email, code) { const j = await req('/auth/v1/verify', { method: 'POST', auth: false, body: { type: 'email', email, token: String(code).trim() } }); if (!setSess(j)) throw new Error('bad code'); save.acct = { id: uid(), email, name: (save.idn && save.idn.name) || '', p: 'email', t: Date.now() }; save.acctMode = 'account'; const adopted = await pull(); persist(); await push(true); return adopted; },
    signOut() { try { if (sess) req('/auth/v1/logout', { method: 'POST' }).catch(() => {}); } catch (e) {} sess = null; keep(); },
    push, pull,
    async top(n = 50) { const j = await req('/rest/v1/profiles?select=id,name,chroma,wr,level,found,dna&order=score.desc,updated_at.asc&limit=' + n, { auth: false }); SB.online = true; return j || []; },
    async myRank() { if (!uid()) return 0; const r = row(), sc = r.chroma + r.wr / 1000; const res = await req('/rest/v1/profiles?select=id&score=gt.' + sc, { method: 'HEAD', auth: false, raw: true, headers: { Prefer: 'count=exact' } }); const cr = res.headers.get('content-range') || ''; const n = parseInt(cr.split('/')[1], 10); if (!isFinite(n)) return 0; save.worldRank = n + 1; return n + 1; },
    mail: u => String(u).toLowerCase() + '@players.mixio.app',
    uname: () => (sess && sess.user && (sess.user.uname || (sess.user.email || '').split('@')[0])) || '',
    async create(u, pw) { const j = await req('/auth/v1/signup', { method: 'POST', auth: false, body: { email: SB.mail(u), password: pw, data: { username: u } } }); if (!j || !j.access_token) { const e = new Error(j && j.id ? 'confirm' : 'failed'); throw e; } setSess(j); sess.user.uname = u; keep(); return SB.after(); },
    async login(u, pw) { const j = await req('/auth/v1/token?grant_type=password', { method: 'POST', auth: false, body: { email: SB.mail(u), password: pw } }); setSess(j); sess.user.uname = u; keep(); return SB.after(); },
    async after() { save.acct = { id: uid(), name: SB.uname(), p: 'pw', t: Date.now() }; save.acctMode = 'account'; save.acctOffline = 0; const adopted = await pull(); save.acct.name = SB.uname(); persist(); await push(true); SB.myRank().catch(() => {}); return adopted; },
    async postDaily(day, pct) { if (!uid() || SB.isAnon()) return null; if (!(await fresh())) return null; try { await req('/rest/v1/daily_scores', { method: 'POST', headers: { Prefer: 'return=minimal' }, body: { user_id: uid(), day, pct: clamp(Math.round(pct * 10) / 10, 0, 100) } }); } catch (e) { if (e.status !== 409) throw e; } return SB.dailyRank(day, pct); },
    async dailyDist(day) { const j = await req('/rest/v1/rpc/daily_dist', { method: 'POST', auth: false, body: { d: day } }); return Array.isArray(j) ? j : null; },
    async dailyRank(day, pct) { const j = await req('/rest/v1/rpc/daily_rank', { method: 'POST', auth: false, body: { d: day, p: pct } }); return j; },
    async deleteMe() { if (!(await fresh())) throw new Error('not signed in'); await req('/rest/v1/rpc/delete_my_account', { method: 'POST', body: {} }); sess = null; keep(); },
    async anon() { if (sess) return true; const j = await req('/auth/v1/signup', { method: 'POST', auth: false, body: { data: {} } }); return setSess(j); },
    isAnon: () => !!(sess && sess.user && sess.user.anon),
    boot() { if (!ON) return; if (!sess) { return; SB.anon().then(ok => { if (ok) { save.acct = { id: uid(), name: (save.idn && save.idn.name) || '', p: 'auto', t: Date.now() }; persist(); push(true); SB.myRank().catch(() => {}); } }).catch(() => {}); return; } fresh().then(ok => { if (!ok) return; pull().then(() => { push(true); SB.myRank().then(() => { try { checkBadges(-1); } catch (e) {} }).catch(() => {}); }); }).catch(() => {}); }
  };
})();
const ACCOUNT = {
  signedIn() { return (SB.signedIn() && !SB.isAnon()) || !!(save.acct && save.acct.id && save.acct.p !== 'email' && save.acct.p !== 'auto' && save.acct.p !== 'pw'); },
  mode() { return this.signedIn() ? 'account' : 'guest'; },
  async signIn(provider) { // the native app plugs in Sign in with Apple here (window.MIXIO_AUTH)
    if (window.MIXIO_AUTH && typeof window.MIXIO_AUTH.signIn === 'function') { try { const u = await window.MIXIO_AUTH.signIn(provider); if (u && u.id) { save.acct = { id: u.id, name: u.name || '', p: provider, t: Date.now() }; save.acctMode = 'account'; persist(); return true; } } catch (e) {} return false; }
    return null; },
  signOut() { SB.signOut(); save.acct = null; save.acctMode = 'guest'; persist(); }
};
function openAccountSheet(first, why) {
  const W = $('mixAuth'); if (!W.hidden) return; const si = SB.signedIn() && !SB.isAnon();
  const close = () => { W.classList.add('out'); setTimeout(() => { W.hidden = true; W.classList.remove('out'); W.innerHTML = ''; BGP.off(); if (first) setTimeout(ONB.next, 300); }, 600); };
  if (si) { W.innerHTML = `<div class="wbg"></div><button class="mxx" data-x="1" aria-label="Close">×</button><div class="mxin"><div class="wk">you're in the mix</div><h2>${SB.uname().toLowerCase()}</h2><div class="wsub">your progress is saved to your account and you're on the world leaderboard.</div><button class="primary wgo" data-x="1">back to mixing</button><button class="mxlink" data-out="1">sign out</button><button class="mxdel" data-del="1">delete my account</button><div id="mxDelC"></div></div>`;
    W.hidden = false; BGP.on(W); W.onclick = async e => { if (e.target.closest('[data-del]')) { $('mxDelC').innerHTML = `<div class="mxdelc">this permanently deletes your account, your cloud save and your leaderboard spot. it can't be undone.<div class="row2"><button class="no" data-delno="1">keep it</button><button class="yes" data-delyes="1">delete forever</button></div></div>`; return; } if (e.target.closest('[data-delno]')) { $('mxDelC').innerHTML = ''; return; } if (e.target.closest('[data-delyes]')) { const c = $('mxDelC'); c.innerHTML = '<div class="mxdelc">deleting…</div>'; try { await SB.deleteMe(); try { ['mixio.demo', 'mixio.demo.best', 'mixio.sb.demo', 'mixio.sb'].forEach(k => localStorage.removeItem(k)); localStorage.removeItem('mixio.profile'); } catch (x) {} c.innerHTML = '<div class="mxdelc">your account is deleted.</div>'; setTimeout(() => location.reload(), 1400); } catch (er) { c.innerHTML = '<div class="mxdelc">couldn\'t delete right now. check your connection and try again.</div>'; } return; } if (e.target.closest('[data-out]')) { ACCOUNT.signOut(); buzz(5); renderAcSet(); toast('signed out'); close(); } else if (e.target.closest('[data-x]')) close(); }; return; }
  let mode = why === 'in' ? 'in' : 'new', failed = false;
  const draw = () => { W.innerHTML = `<div class="wbg"></div>${first ? '' : '<button class="mxx" data-x="1" aria-label="Close">×</button>'}<div class="mxin">
    <div class="wk">${why === 'lb' ? 'world leaderboard' : why === 'import' ? 'your progress made it' : 'one account, every color'}</div><h1 class="mxh">get in the mix</h1>
    <div class="wsub">${why === 'import' && mode === 'new' ? 'lock your progress into a real account so it\'s safe, syncs everywhere and counts on the world leaderboard.' : mode === 'new' ? 'make your account to climb the world leaderboard, earn world awards and keep your progress safe.' : 'welcome back. sign in to pick up where you left off.'}</div>
    <div class="mxtabs"><button class="${mode === 'new' ? 'on' : ''}" data-m="new">create account</button><button class="${mode === 'in' ? 'on' : ''}" data-m="in">sign in</button><i style="transform:translateX(${mode === 'new' ? 0 : 100}%)"></i></div>
    <div class="mxf"><input class="idin" id="mxU" maxlength="20" autocomplete="username" autocapitalize="none" spellcheck="false" placeholder="username" value="${(W._u || (mode === 'new' && save.idn ? save.idn.name.toLowerCase().replace(/[^a-z0-9_.]/g, '') : '')).replace(/"/g, '')}">
    <input class="idin" id="mxP" type="password" maxlength="64" autocomplete="${mode === 'new' ? 'new-password' : 'current-password'}" placeholder="password${mode === 'new' ? ' (6+ characters)' : ''}"></div>
    <button class="primary wgo" id="mxGo">${mode === 'new' ? 'create my account' : 'sign in'}</button>
    <div class="mxnote" id="mxN"></div>
    ${!ON_SITE && mainLevel() > 1 ? `<button class="mxbring" data-bring="1"><b>bring my saved game</b><small>level ${mainLevel()} · opens mix-io.github.io with your progress</small></button>` : ''}
    ${failed ? '<button class="mxlink" data-off="1">play offline for now</button>' : ''}</div>`; };
  draw(); W.hidden = false; BGP.on(W);
  const note = t => { const n = $('mxN'); n.textContent = t; n.classList.remove('pop'); void n.offsetWidth; n.classList.add('pop'); };
  W.onclick = async e => {
    if (e.target.closest('[data-x]')) return close();
    if (e.target.closest('[data-bring]')) return bringMain();
    if (e.target.closest('[data-off]')) { save.acctOffline = Date.now(); save.acctMode = 'guest'; persist(); return close(); }
    const m = e.target.closest('[data-m]'); if (m) { W._u = $('mxU').value; mode = m.dataset.m; buzz(4); draw(); return; }
    if (e.target.closest('#mxGo')) { const u = ($('mxU').value || '').trim().toLowerCase(), pw = $('mxP').value || '';
      if (!/^[a-z0-9_.]{3,20}$/.test(u)) return note('username: 3–20 letters, numbers, _ or .');
      if (pw.length < 6) return note('password needs at least 6 characters');
      const g = $('mxGo'); g.disabled = true; note(mode === 'new' ? 'creating your account…' : 'signing in…');
      try { if (mode === 'new') await SB.create(u, pw); else await SB.login(u, pw); buzz([8, 40, 12]); try { clink(); } catch (x) {} renderAcSet(); toast(`welcome to the mix, ${u} ✦`); close(); }
      catch (er) { g.disabled = false; const msg = String(er.message || ''); W._u = u;
        if (/already|registered|exists/i.test(msg)) note('that username is taken. try another, or sign in.');
        else if (/invalid login|credentials/i.test(msg)) note('wrong username or password');
        else if (/confirm/i.test(msg)) note('account made, but email confirmation is still on in the server settings');
        else if (/rate|seconds|too many/i.test(msg)) note('slow down a sec, then try again');
        else { if (!failed) { failed = true; draw(); $('mxU').value = u; } note("can't reach mix.io online right now. check your connection."); } } }
  };
  W.addEventListener('keydown', e => { if (e.key === 'Enter') { const g = $('mxGo'); if (g && !g.disabled) g.click(); } });
}
function renderAcSet() { const v = $('acSetV'); if (v) v.textContent = (SB.signedIn() && !SB.isAnon() ? SB.uname() : 'sign in / create') + ' ›'; }
/* ===== first-time flow: intro → color dna → guest/account → guided first mix ===== */
const ONB = {
  newPlayer() { return (save.level || 1) <= 3 && !((save.stats && save.stats.n) || 0); },
  next() { if (!save.idn && !save.idSkip) return openWelcome(); if (!SB.signedIn() && !save.acctOffline && !save.acctAsked) { save.acctAsked = 1; persist(); return openAccountSheet(true); } if (!save.acctMode) { save.acctMode = 'guest'; persist(); } if (ONB.newPlayer() && !save.tutDone && !save.tutNudged) { save.tutNudged = 1; persist(); const b = $('hPlay'); if (b && !$('home').hidden) { b.classList.add('nudge'); toast('tap play to mix your first color'); } } }
};
const TUT = (() => {
  let on = false, step = 0, raf = 0, t0 = 0, base = 0;
  const STEPS = [
    { el: () => $('swatch'), txt: 'this is your target. make your glass match this color.', next: 'btn' },
    { el: () => $('strip'), txt: 'swipe the dye wheel to pick a color. water makes it lighter.', next: 'btn', g: 'swipe' },
    { el: () => $('fg'), txt: 'tap the glass to add a drop.', done: () => drops > base, pad: -20, g: 'tap' },
    { el: () => $('fg'), txt: 'drag your finger in the water to stir.', done: () => glassStir > .5 || (stirEnergy > .6 && unmixed < .2), pad: -20, g: 'stir' },
    { el: () => $('checkBtn'), txt: 'when it looks right, press and hold lock it in.', done: () => state !== 'play' && state !== 'mixing', g: 'hold' }
  ];
  function place() { if (!on) return; const S = STEPS[step], el = S && S.el(); const app = $('app').getBoundingClientRect(), sp = $('cSpot'), bub = $('cBub');
    if (el) { const r = el.getBoundingClientRect(), pad = S.pad ?? 8, x = r.left - app.left - pad, y = r.top - app.top - pad, w = r.width + pad * 2, h = r.height + pad * 2; sp.style.transform = `translate3d(${x}px,${y}px,0)`; sp.style.width = w + 'px'; sp.style.height = h + 'px'; const below = y + h + 150 < app.height - 90; bub.style.top = (below ? y + h + 14 : Math.max(60, y - bub.offsetHeight - 14)) + 'px'; bub.classList.toggle('up', !below); }
    { const f = $('cFing'); if (f && el && S.g) { const r = el.getBoundingClientRect(); f.style.left = (r.left - app.left + r.width / 2) + 'px'; f.style.top = (r.top - app.top + r.height * (S.g === 'hold' ? .5 : .55)) + 'px'; } }
    if (S && S.done && S.done()) go(step + 1);
    raf = requestAnimationFrame(place); }
  function go(i) { step = i; if (step >= STEPS.length) return finish(true); const S = STEPS[step]; $('cStep').textContent = `${step + 1} / ${STEPS.length}`; $('cTxt').textContent = S.txt; $('cNext').hidden = S.next !== 'btn'; if (step === 2) base = drops; { let f = $('cFing'); if (!f) { f = document.createElement('i'); f.id = 'cFing'; f.className = 'cfing'; $('coach').appendChild(f); } f.className = 'cfing' + (S.g ? ' g-' + S.g : ''); } const b = $('cBub'); b.classList.remove('pop'); void b.offsetWidth; b.classList.add('pop'); buzz(4); }
  function finish(done) { on = false; cancelAnimationFrame(raf); $('coach').hidden = true; save.tutDone = 1; persist(); if (done) setTimeout(() => toast('every color you match lands in your passport & atlas ✦'), 2600); }
  $('cNext').addEventListener('click', e => { e.stopPropagation(); go(step + 1); });
  $('cSkip').addEventListener('click', e => { e.stopPropagation(); finish(false); });
  return { start() { if (on) return; on = true; $('coach').hidden = false; go(0); cancelAnimationFrame(raf); raf = requestAnimationFrame(place); }, on: () => on, stop: () => finish(false) };
})();

const BGP = { n: 0, on(W) { BGP.n++; try { $('home').hidden = false; $('home').classList.add('bgonly'); document.body.classList.add('bgp'); HOMEBG.ensure(false, false); } catch (e) {} if (W._bgp) return; W._bgp = 1; let dn = false; const ok = e => !e.target.closest('button,input,.whl,.idfav,.wblob,.mxtabs');
    W.addEventListener('pointerdown', e => { if (!ok(e)) return; dn = true; try { HOMEBG.touchPx(e.clientX, e.clientY); } catch (x) {} }, { passive: true });
    W.addEventListener('pointermove', e => { if (dn || e.pointerType === 'mouse') try { HOMEBG.touchPx(e.clientX, e.clientY); } catch (x) {} }, { passive: true });
    const up = () => { dn = false; try { HOMEBG.release(); } catch (x) {} }; ['pointerup', 'pointercancel', 'pointerleave'].forEach(t => W.addEventListener(t, up)); },
  off() { BGP.n = Math.max(0, BGP.n - 1); if (!BGP.n) try { $('home').classList.remove('bgonly'); document.body.classList.remove('bgp'); } catch (e) {} } };
function openWelcome() {
  const W = $('wel'); if (!W.hidden) return; const st = { name: '', m: 1, d: 1, fav: '' }; const days = m => [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][(m || 1) - 1];
  W.innerHTML = `<div class="wbg"></div>
  <div class="wstep" data-s="0"><div class="wwm"><div class="wdrop"></div><div class="wrip"></div><div class="wk">welcome to</div><h1>mix.io</h1></div><div class="wplay wlate"><i></i>take a pause · stir the water to begin</div><button class="primary wgo wbeg wait" aria-disabled="true"><span class="lq"></span><span class="bt">begin</span></button>${!ON_SITE && mainLevel() > 1 ? `<button class="mxbring wbring" style="max-width:300px;margin:16px auto 0"><b>already playing? bring my game</b><small>level ${mainLevel()} · one tap, opens on mix-io.github.io</small></button>` : ON_SITE ? '<button class="mxlink wsignin">already have an account? sign in ›</button>' : ''}</div>
  <div class="wstep" data-s="1"><div class="wk">let's make your color dna</div><h2>what's your name?</h2><div class="wbody"><input id="wName" class="idin" maxlength="24" autocomplete="given-name" placeholder="first name" enterkeyhint="next"></div><button class="primary wgo" id="wG1" disabled>continue</button></div>
  <div class="wstep" data-s="2"><div class="wk" id="wHi">nice to meet you</div><h2>what's your birthday?</h2><div class="wbody"><div class="idbd"><div class="whl" id="wM"></div><div class="whl" id="wD"></div></div></div><button class="primary wgo" id="wG2">continue</button></div>
  <div class="wstep" data-s="3"><div class="wk">last one</div><h2>favorite color?</h2><div class="wbody"><div class="idfav">${IDFAV.map(f => `<button class="idf" data-f="${f[0]}" style="--c:${f[2]}" aria-label="${f[0]}"></button>`).join('')}</div></div><button class="primary wgo" id="wG3" disabled>create my dna</button></div>
  <div class="wstep rev" data-s="4"><div class="wblob" id="wBlob"><div class="wring"></div><div class="wring b"></div></div><div class="wk" id="wMix">mixing your color…</div><h2 id="wYou">this is you.</h2><div class="whex" id="wHex"></div><button class="primary wgo" id="wG4">enter mix.io</button></div>
  <div class="wdots"><i></i><i></i><i></i><i></i></div>`;
  W.hidden = false; BGP.on(W); const steps = [...W.querySelectorAll('.wstep')], dots = [...W.querySelectorAll('.wdots i')]; let cur = -1;
  const go = i => { if (cur >= 0) { steps[cur].classList.remove('on'); steps[cur].classList.add('gone'); } cur = i; setTimeout(() => steps[i].classList.add('on'), cur ? 260 : 60); dots.forEach((d, k) => d.classList.toggle('on', k === i - 1)); W.querySelector('.wdots').style.opacity = i >= 1 && i <= 3 ? 1 : 0; buzz(4); try { if (i) dialClick(); } catch (e) {} };
  const wheel = (el, items, sel, onPick) => { el.innerHTML = `<div class="wsc">${items.map(t => `<div class="wi">${t}</div>`).join('')}</div><div class="wlens"></div>`; const sc = el.firstChild, its = [...sc.children], IH = 36; let c = -1, raf = 0;
    const paint = () => { raf = 0; const y = sc.scrollTop / IH; its.forEach((it, k) => { const d = k - y, a = clamp(d, -3, 3); it.style.transform = `rotateX(${(-a * 22).toFixed(1)}deg) scale(${(1 - Math.abs(a) * .08).toFixed(3)})`; it.style.opacity = (1 - Math.min(1, Math.abs(d) * .32)).toFixed(3); }); const i = clamp(Math.round(y), 0, items.length - 1); if (i !== c) { c = i; if (el._ready) { buzz(3); try { dialClick(); } catch (x) {} } onPick(i); } };
    let snT = 0, tch = false; const snap = () => { if (tch) return; const k = clamp(Math.round(sc.scrollTop / IH), 0, items.length - 1); if (Math.abs(sc.scrollTop - k * IH) > 2) sc.scrollTo({ top: k * IH, behavior: 'smooth' }); }; sc.addEventListener('touchstart', () => { tch = true; clearTimeout(snT); }, { passive: true }); sc.addEventListener('touchend', () => { tch = false; clearTimeout(snT); snT = setTimeout(snap, 140); }, { passive: true }); sc.addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(paint); clearTimeout(snT); snT = setTimeout(snap, 140); }, { passive: true }); its.forEach((it, k) => it.addEventListener('click', () => sc.scrollTo({ top: k * IH, behavior: 'smooth' })));
    requestAnimationFrame(() => { sc.scrollTop = sel * IH; paint(); el._ready = true; }); };
  const fillD = () => { const n = days(st.m); if (st.d > n) st.d = n; $('wD')._ready = false; wheel($('wD'), Array.from({ length: n }, (_, i) => String(i + 1)), st.d - 1, i => st.d = i + 1); };
  steps[0].addEventListener('click', e => { if (e.target.closest('.wbring')) return bringMain(); if (e.target.closest('.wsignin')) { buzz(5); W.classList.add('out'); openAccountSheet(true, 'in'); setTimeout(() => { W.hidden = true; W.classList.remove('out'); W.innerHTML = ''; BGP.off(); }, 900); return; } if (cur !== 0 || !e.target.closest('.wbeg')) return; if (e.target.closest('.wbeg').classList.contains('wait')) { buzz(3); return; } go(1); setTimeout(() => { try { $('wName').focus({ preventScroll: true }); } catch (e) {} }, 700); });
  const nm = $('wName'); nm.addEventListener('input', () => $('wG1').disabled = !nm.value.trim()); nm.addEventListener('keydown', e => { if (e.key === 'Enter' && nm.value.trim()) $('wG1').click(); });
  $('wG1').addEventListener('click', () => { st.name = nm.value.trim().slice(0, 24); if (!st.name) return; nm.blur(); $('wHi').textContent = `nice to meet you, ${st.name.toLowerCase()}`; go(2); if (!$('wM').firstChild) { wheel($('wM'), MONTHS, 0, i => { const was = st.m; st.m = i + 1; if (was !== st.m && $('wD').firstChild) fillD(); }); fillD(); } });
  $('wG2').addEventListener('click', () => go(3));
  W.querySelectorAll('.idf').forEach(b => b.addEventListener('click', () => { st.fav = b.dataset.f; W.querySelectorAll('.idf').forEach(x => x.classList.toggle('on', x === b)); const f = IDFAV.find(x => x[0] === st.fav); W.style.setProperty('--wc', hexToRgb255(f[2])); $('wG3').disabled = false; buzz(5); }));
  $('wG3').addEventListener('click', () => { if (!st.fav) return; const c = idColor(st), hex = rgbToHex(c).toUpperCase(); W.style.setProperty('--wc', c.map(x => Math.round(clamp(x, 0, 1) * 255)).join(',')); $('wHex').textContent = hex; go(4);
    const S = steps[4], O = $('wBlob'), G = dnaGL(); const c0 = [.82, .86, .9]; if (G) { G.cv.classList.add('dnaorb'); O.insertBefore(G.cv, O.firstChild); DNA.cv = G.cv; DNA.sig = c0.slice(); if (!DNA.raf) DNA.raf = requestAnimationFrame(dnaLoop); }
    O.classList.add('bang'); try { bigBang(W, c, () => { O.classList.add('in'); try { W.animate([{ transform: 'translate(0,0)' }, { transform: 'translate(-7px,4px)' }, { transform: 'translate(6px,-5px)' }, { transform: 'translate(-4px,-3px)' }, { transform: 'translate(3px,4px)' }, { transform: 'none' }], { duration: 520, easing: 'ease-out' }); } catch (e) {} buzz([40, 20, 70]); try { clink(); } catch (e) {} }); } catch (e) { O.classList.add('in'); } const t0 = performance.now() + 1850; const ease = k => k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2; const tw = () => { const k = clamp((performance.now() - t0) / 2000, 0, 1), e = ease(k); DNA.sig = c0.map((v, i) => v + (c[i] - v) * e); dnaKey = ''; if (k < 1 && !W.hidden) requestAnimationFrame(tw); else DNA.sig = c; }; requestAnimationFrame(tw); setTimeout(() => buzz([6, 80, 6, 70, 8, 60, 10, 40, 14]), 250); setTimeout(() => { O.classList.add('burst'); DNA.pulseT = 1; try { dnaBurst(O); } catch (e) {} buzz([10, 30, 16]); try { clink(); } catch (e) {} $('wMix').textContent = 'your color dna'; $('wHex').style.opacity = 1; S.classList.add('done'); }, 3900);
    save.idn = { name: st.name, m: st.m, d: st.d, fav: st.fav }; persist(); dnaKey = ''; applyDNA(); try { HOMEBG.recolor(); } catch (e) {} });
  $('wG4').addEventListener('click', () => { buzz(8); if (!SB.signedIn() && !save.acctOffline) { save.acctAsked = 1; save.acctMode = save.acctMode || 'guest'; persist(); openAccountSheet(true); } W.classList.add('out'); try { goTab('home'); } catch (e) {} setTimeout(() => { DNA.sig = idColor(save.idn); W.hidden = true; try { dnaToHome(); } catch (e) {} W.classList.remove('out'); W.innerHTML = ''; BGP.off(); toast(`welcome, ${st.name.toLowerCase()} ✦`); setTimeout(ONB.next, 900); }, 900); });
  go(0); { const b = W.querySelector('.wbeg'), lq = b && b.querySelector('.lq'), chip = W.querySelector('.wplay'); let prog = 0, dn = false, lx = 0, ly = 0, done = false, t0 = performance.now(), lastBuzz = 0;
    const set = () => { if (lq) lq.style.height = (prog * 112).toFixed(1) + '%'; if (chip) chip.style.setProperty('--wp', prog.toFixed(3)); };
    const add = (d) => { if (done || cur !== 0 || performance.now() - t0 < 900) return; prog = Math.min(1, prog + d / 2600); set(); const n = performance.now(); if (n - lastBuzz > 120) { lastBuzz = n; try { buzz(3); } catch (e) {} } if (prog >= 1) { done = true; b.classList.remove('wait'); b.removeAttribute('aria-disabled'); b.classList.add('ready'); chip && chip.classList.add('done'); try { buzz([10, 40, 18]); } catch (e) {} } };
    W.addEventListener('pointerdown', e => { if (e.target.closest('button')) return; dn = true; lx = e.clientX; ly = e.clientY; add(40); }, { passive: true });
    W.addEventListener('pointermove', e => { if (!dn && e.pointerType !== 'mouse') return; const d = Math.hypot(e.clientX - lx, e.clientY - ly); lx = e.clientX; ly = e.clientY; if (d < 80) add(d * (dn ? 1 : .5)); }, { passive: true });
    const up = () => { dn = false; }; W.addEventListener('pointerup', up); W.addEventListener('pointercancel', up);
    setTimeout(() => { if (!done && prog < .05 && chip) chip.classList.add('nudge'); }, 5000); set(); }
}