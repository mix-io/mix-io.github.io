function goTab(t) {
  audio(); try { document.body.classList.toggle('covered', t === 'cards' || t === 'atlas' || t === 'you'); let tb = $('tabBack'); if (!tb) { tb = document.createElement('div'); tb.id = 'tabBack'; $('app').appendChild(tb); } tb.classList.toggle('on', t !== 'play'); tb.classList.toggle('dk', t === 'atlas' || t === 'cards'); } catch (e) {} $('shop').hidden = true; $('settings').hidden = true; if (t !== 'cards') try { CARDS.shut(); } catch (e) {} if (t !== 'atlas') { $('atlas').hidden = true; ATLAS.close(); } $('coinVal').textContent = save.coins; coinShown = save.coins;
  if (t === 'home') { showHome(); setNav('home'); }
  else if (t === 'play') { if (!$('home').hidden) $('hPlay').click(); setNav('play'); }
  else if (t === 'atlas') { $('atlas').hidden = false; tabIn($('atlas')); ATLAS.open(); setNav('atlas'); }
  else if (t === 'shop') { pendingBuy = null; renderShop(); $('shop').hidden = false; setNav('shop'); }
  else if (t === 'cards') { try { CARDS.open(); } catch (e) {} setNav('cards'); }
  else { $('settings').hidden = false; tabIn($('settings')); renderSettings(); setNav('you'); requestAnimationFrame(drawEyeGraph); }
  if (t === 'home') tabIn($('home'));
}
function tabIn(el) { if (!el || matchMedia('(prefers-reduced-motion: reduce)').matches) return; el.classList.remove('tabin'); void el.offsetWidth; el.classList.add('tabin'); clearTimeout(el._ti); el._ti = setTimeout(() => el.classList.remove('tabin'), 600); }
let started = false;
let MODE = 'level';
function dayNo() { return Math.floor((Date.now() - Date.UTC(2026, 10, 1)) / 864e5) + 1; }
function streakNow() { return save.dlast >= dayNo() - 1 ? (save.dstreak || 0) : 0; }
function shareDaily(btn) {
  const d = save.daily; if (!d) return; const txt = `mix.io #${d.d} · ${fmtP(d.p)}%`;
  const ok = () => { if (btn) { const o = btn.textContent; btn.textContent = 'copied ✓'; setTimeout(() => btn.textContent = o, 1300); } };
  if (navigator.share) navigator.share({ text: txt }).catch(() => {}); else try { navigator.clipboard.writeText(txt).then(ok, ok); } catch (e) { ok(); }
}
function resetGlass() { $('shareIc').hidden = true; $('res').hidden = true; $('rev').hidden = true; SPLIT = null; GLOW = null; holdCoins = false; state = 'play'; auto = null; emptyGlass(true); DRIP.clearTint(); }
function dailyCD() { const n = Date.now(), m = (Date.UTC(2026, 10, 1) + dayNo() * 864e5) - n, h = Math.floor(m / 3.6e6), mm = Math.floor(m / 6e4) % 60; const el = document.querySelector('#hDaily .dcd'); if (el) { const dd = save.daily && save.daily.d === dayNo() && save.daily.beat != null ? `beat ${save.daily.beat}% of the world · ` : ''; el.textContent = `${dd}next in ${h}h ${String(mm).padStart(2, '0')}m`; } }
setInterval(() => { if (!$('home').hidden) dailyCD(); }, 30000);
function dnaToHome() { try { const G = dnaGL(); if (!G) return; if (!DNA.sig) { DNA.sig = dnaAccent() || [.7, .74, .8]; DNA.energy = DNA.energy || 1; DNA.speed = DNA.speed || 1; } const hb = $('hBlob'); if (G.cv.parentNode !== hb) hb.appendChild(G.cv); DNA.cv = G.cv; if (!DNA.raf) DNA.raf = requestAnimationFrame(dnaLoop); } catch (e) {} }
function isBday() { const d = new Date(); return !!(save.idn && save.idn.m === d.getMonth() + 1 && save.idn.d === d.getDate()); }
function bdayMoment() { if (!isBday()) return; const y = new Date().getFullYear(); save.bdays = save.bdays || []; if (save.bdays.includes(y)) return; save.bdays.push(y); persist(); const c = idColor(save.idn), hx = rgbToHex(c), nm = (save.idn.name || '').toLowerCase();
  const o = document.createElement('div'); o.className = 'bdov'; o.innerHTML = `<div class="bdcard" style="--c:${hx}"><div class="bdart"></div><div class="bdnm">happy birthday${nm ? ', ' + nm : ''}</div><div class="bdft"><span>birthday card</span><span>${y}</span></div></div><small>tap to keep it</small>`; $('app').appendChild(o); requestAnimationFrame(() => o.classList.add('on')); try { buzz([6, 80, 6]); } catch (e) {}
  o.addEventListener('click', () => { o.classList.remove('on'); setTimeout(() => o.remove(), 500); }); }
function showHome() { try { let bl = $('hBday'); if (isBday()) { if (!bl) { bl = document.createElement('div'); bl.id = 'hBday'; bl.className = 'hbday'; const f = $('hFound'); f.parentNode.insertBefore(bl, f.nextSibling); } bl.textContent = 'happy birthday ✦ your glass is glowing today'; setTimeout(bdayMoment, 1600); } else if (bl) bl.remove(); } catch (e) {}
  setTimeout(() => HOMEBG.ensure(), 0); setTimeout(dnaToHome, 0);
  const ey = (save.eye ?? CH0), rk = rankOf(ey), day = dayNo(), sk = streakNow();
  const nx = nextRank(ey), pr = nx ? clamp((ey - rk[0]) / (nx[0] - rk[0]), 0, 1) : 1;
  $('hNum').textContent = fmtC(ey); $('hRk').textContent = 'eye'; $('hRank').style.setProperty('--gc', rk[2]); $('hRank').innerHTML = `<span class="rkg">${gemSVG(rk, 26)}</span><span class="hrt"><b>${rk[1]}</b><small>ranks & leaderboards</small></span><span class="hrc">›</span>`; { const got = new Set((save.palette || []).map(p => p.n)); $('hFound').textContent = `${ALLN.filter(n => got.has(n)).length.toLocaleString('en-US')} / ${ALLN.length.toLocaleString('en-US')} colors found`; }
  setTimeout(() => { try { HRING.show(); } catch (e) {} }, 30);
  const dDone = save.daily && save.daily.d === day, hd = $('hDaily'); hd.classList.toggle('done', !!dDone); hd.disabled = !!dDone; hd.querySelector('.ddot').style.setProperty('--c', css(dailyTarget(day).rgb)); const dt0 = dailyTarget(day); hd.querySelector('.dlab').textContent = (dDone ? '✓ ' : '') + 'daily · ' + dt0.name; dailyCD();
  $('hPlay').textContent = (started || save.level > 1 || (save.stats && save.stats.n)) ? 'continue' : 'play';
  const h = $('home'); h.classList.remove('bye'); h.hidden = false;
}
function hideHome() { const h = $('home'); h.classList.add('bye'); setTimeout(() => HOMEBG.free(), 520); setTimeout(() => { h.hidden = true; h.classList.remove('bye'); }, 500); }

/* ================= Scene geometry ================= */
const scene = $('scene'), bgC = $('bg'), fgC = $('fg'), fluidC = $('fluid');
const bgx = bgC.getContext('2d'), fgx = fgC.getContext('2d');
let SW = 0, SH = 0, DPR = 1;
const G = {};
function computeLayout() {
  SW = scene.clientWidth; SH = scene.clientHeight; DPR = Math.min(window.devicePixelRatio || 1, 2);
  if (SW < 10 || SH < 10) return false;
  const gh = Math.min(SH * 0.74, SW * 0.56 * 1.62);
  const gw = gh / 1.62;
  G.gh = gh; G.gw = gw; G.cx = SW / 2; G.gx = G.cx - gw / 2;
  G.bottom = SH * 0.885; G.top = G.bottom - gh;
  G.wt = Math.max(3, gw * 0.032);
  G.ry = gw / 2 * 0.15;                  // rim ellipse half-height (perspective)
  G.iw = gw - 2 * G.wt;
  G.ryIn = G.iw / 2 * 0.15;
  G.y0 = G.top + gh * 0.17;             // water line
  G.y1 = G.bottom - gh * 0.085;         // inner floor
  G.wx = Math.round(G.gx + G.wt); G.wy = Math.round(G.y0 - G.ryIn);
  G.ww = Math.round(G.iw); G.wh = Math.round(G.y1 + G.ryIn - G.wy);
  for (const c of [bgC, fgC]) { c.width = Math.round(SW * DPR); c.height = Math.round(SH * DPR); }
  Object.assign(fluidC.style, { left: G.wx + 'px', top: G.wy + 'px', width: G.ww + 'px', height: G.wh + 'px' });
  fluidC.width = Math.round(G.ww * DPR); fluidC.height = Math.round(G.wh * DPR);
  drawBG();
  return true;
}
let refrW = null, refrT = null, refrKey = '';
function drawRefr(c, T) {
  if (!refrW) return; const key = T.map(v => Math.round(v * 24)).join();
  if (key !== refrKey) { refrKey = key; refrT = refrT || document.createElement('canvas'); refrT.width = refrW.width; refrT.height = refrW.height; const x = refrT.getContext('2d'); x.clearRect(0, 0, refrT.width, refrT.height); for (let i = 0; i < 5; i++) x.drawImage(refrW, 0, 0); x.globalCompositeOperation = 'source-in'; x.fillStyle = css(T.map(v => v * .5)); x.fillRect(0, 0, refrT.width, refrT.height); }
  const { gx, wt, iw, ryIn, cx, y0, y1 } = G; c.save(); c.beginPath(); c.ellipse(cx, y0, iw / 2, ryIn, 0, Math.PI, 0, false); c.lineTo(gx + wt + iw, y1); c.ellipse(cx, y1, iw / 2, ryIn, 0, 0, Math.PI, false); c.closePath(); c.clip();
  c.globalAlpha *= .9; c.drawImage(refrT, gx + wt, y0 - ryIn, iw, y1 + ryIn - y0 + ryIn); c.restore();
}