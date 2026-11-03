function renderYou() {
  const ey = (save.eye ?? CH0), r = rankOf(ey), nx = nextRank(ey), st = save.stats || {}; let P = { stamped: 0, gold: 0 }; try { P = passportSummary(); } catch (e) {}
  const me = YLB && YLB.me, H = $('yHero'); if (H) H.innerHTML = `<button class="hs" data-y="lb" style="--hc:#9fd4ff"><small>world rank</small><b>${me ? '#' + me.toLocaleString('en-US') : '—'}</b><em>${me ? 'on the leaderboard' : ACCOUNT.signedIn() ? 'loading…' : 'sign in to join'}</em></button><button class="hs" data-y="lv" style="--hc:rgb(var(--dna-rgb))"><small>level</small><b>${save.level || 1}</b><em>${(st.perfects || 0)} perfects</em></button><button class="hs" data-y="pp" style="--hc:#ffd58a"><small>countries</small><b>${P.stamped}<i>/ ${P.nC || ''}</i></b><em class="${P.gold ? 'g' : ''}">${P.gold ? P.gold + ' complete ✦' : 'none complete yet'}</em></button><button class="hs" data-y="cc" style="--hc:#b45aff"><small>chroma</small><b>${(save.chroma || 0).toLocaleString('en-US')}</b><em>spend it on packs</em></button>`;
  const M = $('yMeter'); if (M) { const pos = v => clamp(v, 0, 100); M.style.setProperty('--gc', r[2]);
    M.innerHTML = `<div class="mh"><span class="rkg">${gemSVG(r, 30)}</span><div><small>rank</small><b>${r[1]}</b></div><span class="nx">${ey >= 100 ? 'world ranked' : nx ? `${(nx[0] - ey).toFixed(1)} to ${nx[1]}` : `${(100 - ey).toFixed(1)} to world ranked`}</span></div><div class="trk"><div class="bar" style="--bw:${(100 / Math.max(1, pos(ey)) * 100).toFixed(0)}%"><u style="width:0%"></u></div>${RANKS.map(q => `<i class="tk${ey >= q[0] ? ' on' : ''}" style="left:${pos(q[0])}%;--tc:${q[2]}"></i>`).join('')}<i class="me" style="left:0%"></i></div><div class="lbls"><span>0</span><span>${fmtC(ey)} eye</span><span>100</span></div>`;
    requestAnimationFrame(() => requestAnimationFrame(() => { const u = M.querySelector('.bar u'), m = M.querySelector('.me'); if (u) u.style.width = pos(ey) + '%'; if (m) m.style.left = pos(ey) + '%'; })); }
  const L = $('yL'); if (L) { const draw = () => { if (!YLB || !YLB.rows) return; const uid = SB.signedIn() ? (save.acct && save.acct.id) : null, rows = YLB.rows, top = rows.slice(0, 5), mi = rows.findIndex(x => x.id === uid);
      const row = (x, n) => `<div class="lbr${x.id === uid ? ' me' : ''}"><span class="lbn">${n}</span><span class="lbd" style="background:${/^#[0-9a-f]{6}$/i.test(x.dna || '') ? x.dna : '#8a96a8'}"></span><span class="lbm"></span><span class="lbc">${Number(x.chroma).toFixed(1)}</span></div>`;
      let html = top.map((x, k) => row(x, k + 1)).join(''), names = top.map(x => x.name); if (mi >= 5) { html += '<div class="lbgap">···</div>' + row(rows[mi], mi + 1); names.push(rows[mi].name); } else if (mi < 0 && YLB.me && uid) { html += `<div class="lbgap">···</div><div class="lbr me"><span class="lbn">${YLB.me}</span><span class="lbd" style="background:rgb(var(--dna-rgb))"></span><span class="lbm"></span><span class="lbc">${fmtC(ey)}</span></div>`; names.push(SB.uname() || 'you'); }
      L.innerHTML = html || '<div class="lbmsg">no one yet. be the first.</div>'; L.querySelectorAll('.lbm').forEach((el, k) => el.textContent = ((names[k] || 'player') + '').toLowerCase()); $('yMe').textContent = YLB.me ? 'you · #' + YLB.me.toLocaleString('en-US') : ''; };
    draw(); if (Date.now() - YLBt > 30000) { YLBt = Date.now(); (async () => { try { const [rows, mr] = await Promise.all([SB.top(50), SB.myRank().catch(() => 0)]); YLB = { rows: rows || [], me: mr || 0 }; draw(); const H2 = $('yHero'); if (H2 && YLB.me) { const b = H2.querySelector('[data-y=lb] b'), e = H2.querySelector('[data-y=lb] em'); if (b) b.textContent = '#' + YLB.me.toLocaleString('en-US'); if (e) e.textContent = 'on the leaderboard'; } } catch (e) { if (!YLB) L.innerHTML = '<div class="lbmsg">the leaderboard is offline right now. your progress is safe.</div>'; } })(); } }
}
{ const H = $('yHero'); if (H) H.addEventListener('click', e => { const b = e.target.closest('[data-y]'); if (!b) return; buzz(5); const k = b.dataset.y; if (k === 'lb') { if (ACCOUNT.signedIn()) openRanks(); else openAccountSheet(false, 'lb'); } else if (k === 'pp') { goTab('cards'); try { CARDS.seg && CARDS.seg('pp'); } catch (x) {} } else if (k === 'cc') goTab('cards'); else openRanks(); }); }
$('yMeter') && $('yMeter').addEventListener('click', () => { buzz(5); openRanks(); });
$('yAll') && $('yAll').addEventListener('click', () => { buzz(5); openRanks(); });
$('yPP') && $('yPP').addEventListener('click', () => { buzz(5); goTab('cards'); try { CARDS.seg && CARDS.seg('pp'); } catch (x) {} });
function renderSettings(quiet) {
  renderFav();
  const st = save.stats, ey = (save.eye ?? CH0), rk = rankOf(ey);
  $('eNum').textContent = fmtC(ey); $('eRank').innerHTML = badge(rk) + ' ' + rk[1]; 
  ERING.show(quiet === true); renderRankRow(); renderDNA();
  drawEyeGraph();
  { $('sAvg').textContent = st.n ? (st.sum / st.n).toFixed(1) + '%' : '–'; $('sPerf').textContent = st.perfects || 0; $('sStreak').textContent = save.daysN || 1; }
  const got = {}; save.palette.forEach(p => got[p.n] = p); const nGot = ALLN.filter(n => got[n]).length;
  $('palCount').innerHTML = `${nGot.toLocaleString('en-US')} / ${ALLN.length.toLocaleString('en-US')} collected<div class="wbar"><i style="width:${(nGot / ALLN.length * 100).toFixed(1)}%"></i></div>`;
  renderPPRow(); renderColls(got);
  save.seenWall = ALLN.filter(n => got[n]);
  renderBadges(); try { renderJournal(); } catch (e) {} try { renderYou(); } catch (e) { console.warn('[mix.io] you', e); }
  $('tSound').classList.toggle('on', !save.muted); $('tHap').classList.toggle('on', !!save.haptics); $('tCB').classList.toggle('on', !!save.cb);
}
$('gearBtn').addEventListener('click', () => goTab('home'));
$('setX').addEventListener('click', () => { $('settings').hidden = true; });
$('settings').addEventListener('click', e => { if (e.target === $('settings')) $('settings').hidden = true; });
$('tSound').addEventListener('click', () => { save.muted = !save.muted; persist(); if (save.muted && noiseGain) noiseGain.gain.value = 0; if (!save.muted) tick(); renderSettings(true); });
$('tHap').addEventListener('click', () => { save.haptics = !save.haptics; persist(); buzz(8); renderSettings(true); });
$('tCB').addEventListener('click', () => { save.cb = !save.cb; persist(); $('thex').hidden = !save.cb; cbLine(); if (!save.cb && target) $('thex').textContent = rgbToHex(target.rgb); renderSettings(true); });

/* ================= Main loop ================= */
let last = performance.now(), coinShown = save.coins, focusA = 1, idleT = 0, perfN = 0, perfSum = 0, perfLvl = 0; const homeEl = $('home'), appEl = $('app'), atlasEl = $('atlas');
function frame(now) {
  const dt = Math.min((now - last) / 1000, 1 / 30); last = now;
  if (!SW && !computeLayout()) { requestAnimationFrame(frame); return; }
  if ((!homeEl.hidden && !homeEl.classList.contains('bye')) || !atlasEl.hidden || !$('settings').hidden || window.__kOn) { last = now; requestAnimationFrame(frame); return; }

  // stirring by hand
  if (gp && gp.stir && state === 'play') {
    // stir smoothing: exponential, time-based (~35ms) so the feel is the same at 60/120Hz and on dropped frames
    if (gp.fx == null) { gp.fx = gp.x; gp.fy = gp.y; } { const ks = 1 - Math.exp(-dt / .035); gp.fx += (gp.x - gp.fx) * ks; gp.fy += (gp.y - gp.fy) * ks; } const sx = gp.fx, sy = gp.fy; if (gp.sx == null) { gp.sx = sx; gp.sy = sy; }
    if (inWater(gp.x, gp.y)) {
      rod = { px: gp.x, py: gp.y };
      if (fluidOK && (gp.sx !== sx || gp.sy !== sy)) stirAt(gp.sx, gp.sy, sx, sy, dt);
    } else rod = null;
    if (inWater(gp.x, gp.y)) { if (vortS < .05) vortX = gp.x; vortX += (gp.x - vortX) * (1 - Math.exp(-dt / .1)); const cr = (gp.x - vortX) * (gp.y - gp.ly) - (gp.y - G.y0) * (gp.x - gp.lx); if (Math.abs(cr) > 1) stirDir = cr > 0 ? 1 : -1; }
    if (inWater(gp.x, gp.y)) { const spd = Math.hypot(gp.x - gp.lx, gp.y - gp.ly) / Math.max(dt, .008); if (spd > 380 && mbub.length < 90 && Math.random() < Math.min(.9, (spd - 380) / 900)) { const n = 1 + (spd > 1100 ? 2 : spd > 700 ? 1 : 0); for (let q = 0; q < n; q++) mbub.push({ x: gp.x + (Math.random() - .5) * 16, y: Math.max(G.y0 + 6, gp.y + (Math.random() - .5) * 14), r: .5 + Math.random() * 1.5, vy: 14 + Math.random() * 18, ph: Math.random() * 6.3, t: 0 }); } WET = Math.min(1, WET + Math.min(spd, 1500) / 1500 * dt * .5); }
    if (inWater(gp.x, gp.y) && (gp.lx !== gp.x || gp.ly !== gp.y)) trail.push({ x: gp.x, y: gp.y, t: 0, sp: Math.hypot(gp.x - gp.lx, gp.y - gp.ly) / Math.max(dt, .008) });
    { const cyw = (G.y0 + G.y1) / 2, a1 = Math.atan2((sy - cyw) / (G.wh * .5), (sx - G.cx) / (G.ww * .5)), a0 = Math.atan2((gp.sy - cyw) / (G.wh * .5), (gp.sx - G.cx) / (G.ww * .5)); let da = a1 - a0; da = Math.atan2(Math.sin(da), Math.cos(da)); const rr = Math.hypot((sx - G.cx) / (G.ww * .5), (sy - cyw) / (G.wh * .5));
      if (inWater(gp.x, gp.y) && rr > .12) spinW += (clamp(da / Math.max(dt, .008), -9, 9) * Math.min(1, rr * 1.4) - spinW) * (1 - Math.exp(-dt * 1.6)); }
    { const vx = (sx - gp.sx) / Math.max(dt, .008), vy = (sy - gp.sy) / Math.max(dt, .008), sp = Math.hypot(vx, vy);
      if (inWater(gp.x, gp.y)) { tiltV += clamp(vx * .00006, -.05, .05);
        if (sp > 550 && Math.random() < Math.min(.85, (sp - 550) / 1400)) { const n = 1 + (sp > 1400 ? 2 : sp > 900 ? 1 : 0); for (let i = 0; i < n; i++) splashFx.push({ x: clamp(vortX + (Math.random() - .5) * G.iw * .4, G.wx + 6, G.wx + G.ww - 6), y: G.y0 - 1, vx: vx * .12 + (Math.random() - .5) * 90, vy: -(120 + Math.random() * 160) * Math.min(1.6, sp / 900), r: .9 + Math.random() * 1.8, t: 0 }); } } }
    gp.lx = gp.x; gp.ly = gp.y; gp.sx = sx; gp.sy = sy;
  }
  // auto stir on "Check match"
  if (auto) {
    auto.t += dt;
    const k = auto.t / auto.dur;
    const ang = auto.t * Math.PI * 2 * 1.5;
    const px = G.cx + Math.sin(ang) * G.ww * 0.3, py = G.y0 + (G.y1 - G.y0) * (0.55 + Math.cos(ang) * 0.22);
    rod = { px, py };
    if (fluidOK && auto.last) stirAt(auto.last[0], auto.last[1], px, py, dt, 0.8);
    auto.last = [px, py];
    forcedMix = k > 0.55 ? 6 : 1.5;
    if (k >= 1) { auto = null; rod = null; forcedMix = 0; unmixed = 0; if (fluidOK) homogenize(1); reveal(); }
  }

  // mixing model
  stirEnergy *= Math.exp(-3 * dt);
  if (!(gp && gp.stir)) spinW *= Math.exp(-.75 * dt);
  { const SMAX = Math.max(0, Math.min(22, (G.y0 - G.top - G.ryIn - G.ry - 4) * 1.5)), Dt = Math.min(SMAX, .3 * spinW * spinW); SURF.d += (Dt - SURF.d) * (1 - Math.exp(-dt * 4));
    for (let i = SURF.bumps.length - 1; i >= 0; i--) { SURF.bumps[i].t += dt; if (SURF.bumps[i].t > 1.4) SURF.bumps.splice(i, 1); }
    SURF.E = Math.min(1, Math.abs(spinW) * .12 + stirEnergy * .45 + Math.abs(tiltV) * 4 + SURF.bumps.length * .15);
    SURF.wa += (Math.min(2.6, SURF.E * 3) - SURF.wa) * (1 - Math.exp(-dt * 3)); for (let k = 0; k < 3; k++) SURF.ph[k] += dt * (2.2 + k * 1.4) * (1 + Math.abs(spinW) * .15); }
  if (fluidOK && Math.abs(spinW) > .04 && state !== 'result') { const R0 = .3, asp = G.ww / G.wh; for (let k = 0; k < 6; k++) { const a = k / 6 * Math.PI * 2 + spinPh, ux = Math.cos(a) * R0, uy = Math.sin(a) * R0 * asp; const spd = spinW * R0 * F.vel.w * .55; splat(F.vel, .5 + ux, .5 + uy, [Math.sin(a) * spd, -Math.cos(a) * spd, 0], .0045); } spinPh += dt * spinW * .5; stirEnergy = Math.max(stirEnergy, Math.min(.5, Math.abs(spinW) * .05)); }
  const lam = 0.03 + stirEnergy * 0.24 + Math.abs(spinW) * .035 + forcedMix;
  const rate = 1 - Math.exp(-lam * dt);
  unmixed *= (1 - rate);

  // dilute / empty animations
  let scale = 1;
  if (diluting > 0) { const d = Math.min(dt, diluting); scale *= Math.pow(0.5, d / 0.8); diluting -= d; if (diluting <= 0) { diluting = 0; } }
  if (emptying > 0) { const d = Math.min(dt, emptying); scale *= Math.pow(0.004, d / 0.55); emptying -= d; if (emptying <= 0) { emptying = 0; meanA = [0, 0, 0]; wCount = 0; scale = 0; } }
  if (scale !== 1) meanA = meanA.map(v => v * scale);
  { const acc = (tiltT - tiltA) * 40 - tiltV * 3.2; tiltV += acc * dt; tiltA += tiltV * dt; tiltA = clamp(tiltA, -.105, .105);
    if (!DRAIN && fluidOK && fluidC.style.clipPath) fluidC.style.clipPath = ''; }
  if (DRAIN) {
    DRAIN.t += dt; const e2 = k => k * k * (3 - 2 * k), dt2 = DRAIN.t;
    const rf = DRAIN.fill ? 1.0 : .6; DRAIN.lvl = dt2 < .9 ? lerp(G.y0, G.y1 + G.ryIn, e2(dt2 / .9)) : lerp(G.y1 + G.ryIn, G.y0, e2(clamp((dt2 - .9) / rf, 0, 1)));
    if (DRAIN.fill && Math.random() < .3) bubbles.push({ x: G.cx + G.gw * .12 + (Math.random() - .5) * 16, y: G.y1 - 6, r: .8 + Math.random() * 1.8, vy: 40 + Math.random() * 50, ph: Math.random() * 6 });
    if (dt2 >= .9 && !DRAIN.z) { DRAIN.z = 1; meanA = [0, 0, 0]; wCount = 0; unmixed = 0; if (fluidOK) scaleDye(0); }
    if (dt2 >= .9 + (DRAIN.fill ? 1.0 : .6)) { DRAIN = null; fluidC.style.clipPath = ''; ripples.push({ x: G.cx, t: 0, a: .5 }); }
    else fluidC.style.clipPath = `inset(${Math.max(0, DRAIN.lvl - G.y0)}px 0 0 0)`;
  }
  if (pour) { pour.t += dt; if (Math.random() < .12) ripples.push({ x: G.cx + G.gw * 0.12, t: 0, a: .45 }); if (pour.t > 0.8) pour = null; else if (fluidOK && Math.random() < 0.5) { splat(F.vel, 0.5 + 0.12 * 1.1 + (Math.random() - 0.5) * 0.04, surfaceV() - 0.02, [(Math.random() - 0.5) * 40, -160, 0], 0.0009); if (Math.random() < 0.4) bubbles.push({ x: G.cx + G.gw * 0.12 + (Math.random() - 0.5) * 10, y: G.y0 + 10 + Math.random() * 40, r: 0.8 + Math.random() * 2, vy: 50 + Math.random() * 40, ph: Math.random() * 6 }); } }

  // particles
  for (const d of droplets) {
    if (d.state === 'done') continue;
    d.t += dt; if (d.tx != null) d.x += (d.tx - d.x) * (1 - Math.exp(-dt * 10));
    if (d.state === 'form' && d.t > 0.22) { d.state = 'fall'; }
    if (d.state === 'fall') { d.vy += 2400 * dt; d.y += d.vy * dt; if (d.y >= G.y0) { d.state = 'done'; landDrop(d); } }
  }
  for (let i = droplets.length - 1; i >= 0; i--) if (droplets[i].state === 'done') droplets.splice(i, 1);
  for (let i = CROWN.length - 1; i >= 0; i--) { CROWN[i].t += dt; if (CROWN[i].t > .55) CROWN.splice(i, 1); }
  for (let i = beadsFx.length - 1; i >= 0; i--) { const b = beadsFx[i]; b.t += dt; b.vy += 900 * dt; b.x += b.vx * dt; b.y += b.vy * dt; if (b.t > 0.5 || b.y > G.y0 + 2 && b.vy > 0) beadsFx.splice(i, 1); }
  for (let i = bubbles.length - 1; i >= 0; i--) { const b = bubbles[i]; b.t = (b.t || 0) + dt; b.y -= b.vy * dt; b.ph += dt * 9; if (b.y < G.y0 + 2 || b.t > .8) bubbles.splice(i, 1); }
  for (let i = ripples.length - 1; i >= 0; i--) { ripples[i].t += dt; if (ripples[i].t > 1.1) ripples.splice(i, 1); }

  const busy = droplets.length || stirEnergy > .015 || auto || pour || DRAIN || diluting > 0 || emptying > 0 || unmixed > .004 || forcedMix || scale !== 1 || (gp && gp.stir);
  idleT = busy ? 0 : idleT + dt; if (state === 'play' && !document.hidden) save.mixMs = (save.mixMs || 0) + dt * 1000;
  if (fluidOK && (idleT < 4 || Math.abs(G.ww / G.wh - F.aspect) > 0.04)) {
    if (Math.abs(G.ww / G.wh - F.aspect) > 0.04) initFBOs();
    if (scale !== 1) scaleDye(scale);
    step(Math.min(dt, 1 / 30));
    homogenize(rate);
    renderFluid();
  } else if (fluidOK && !document.hidden && state !== 'result' && idleT < 14) { fluidAcc2 = (fluidAcc2 || 0) + 1; if (fluidAcc2 % 3 === 0) renderFluid(); }
  if (fluidOK && perfN < 240 && state === 'play') { perfN++; perfSum += dt; if (perfN === 120 || perfN === 240) { const avg = perfSum / 120; perfSum = 0; if (avg > 1 / 48 && perfLvl < 2) { perfLvl++; CFG.DYE = perfLvl === 1 ? 300 : 224; CFG.ITER = perfLvl === 1 ? 14 : 10; initFBOs(); } } }
  fgAcc += dt; fgFlip = !fgFlip; if (!(idleT > 1.5 && state === 'play' && !SPLIT && !GLOW && !burst.length && !mbub.length && !wdrops.length && fgFlip)) { drawFG(Math.min(fgAcc, 1 / 20)); fgAcc = 0; }
  const stirNow = !!(gp && gp.stir && state === 'play'); appEl.classList.toggle('stir', stirNow);
  focusA = stirNow ? focusA + (0.3 - focusA) * (1 - Math.exp(-dt / .1)) : focusA + (1 - focusA) * (1 - Math.exp(-dt / .17));
  

  // stir swish
  if (noiseGain && actx) { noiseGain.gain.setTargetAtTime(save.muted || state !== 'play' ? 0 : Math.min(0.045, SURF.E * 0.04), actx.currentTime, 0.08); if (noiseBP) noiseBP.frequency.setTargetAtTime(320 + SURF.E * 900, actx.currentTime, 0.1); }
  if (noiseBP && actx) noiseBP.frequency.setTargetAtTime(380 + Math.min(1400, stirEnergy * 260), actx.currentTime, 0.08);


  if (!holdCoins && coinShown !== save.coins) { coinShown = Math.abs(save.coins - coinShown) < 1 ? save.coins : lerp(coinShown, save.coins, 1 - Math.exp(-5 * dt)); $('coinVal').textContent = Math.round(coinShown); }
  updateStat(); if (save.cb && (droplets.length || scale !== 1 || rate > 0.002)) cbLine();
  requestAnimationFrame(frame);
}

/* ================= Line room ================= */
function lineRoom(c, W, H, b, k, mask) {
  const [x0, y0, x1, y1] = b, A = (a0, a1, xa, ya, xb, yb) => { const g = c.createLinearGradient(xa, ya, xb, yb); g.addColorStop(0, `rgba(255,255,255,${a0 * k})`); g.addColorStop(1, `rgba(255,255,255,${a1 * k})`); c.strokeStyle = g; c.beginPath(); c.moveTo(xa, ya); c.lineTo(xb, yb); c.stroke(); };
  c.save(); c.lineWidth = 1;
  const bk = c.createLinearGradient(0, y1, 0, H); bk.addColorStop(0, 'rgba(0,0,0,0)'); bk.addColorStop(1, 'rgba(255,255,255,0.02)'); c.fillStyle = bk; c.fillRect(0, y1, W, H - y1);
  c.strokeStyle = `rgba(255,255,255,${.1 * k})`; c.strokeRect(x0 + .5, y0 + .5, x1 - x0, y1 - y0);
  A(.1, .16, x0, y1, -W * .08, H * 1.04); A(.1, .16, x1, y1, W * 1.08, H * 1.04);
  A(.1, .14, x0, y0, -W * .08, -H * .14); A(.1, .14, x1, y0, W * 1.08, -H * .14);
  const sp = c.createRadialGradient(W / 2, (y1 + H) / 2, 0, W / 2, (y1 + H) / 2, W * .45); sp.addColorStop(0, `rgba(255,255,255,${.05 * k})`); sp.addColorStop(1, 'rgba(255,255,255,0)'); c.fillStyle = sp; c.fillRect(0, 0, W, H);
  c.restore();
}

/* ================= Atlas ================= */