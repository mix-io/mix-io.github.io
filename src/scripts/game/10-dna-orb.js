function dnaBind(cv) { if (cv._dnaL) return; cv._dnaL = 1; const pos = e => [e.clientX, e.clientY];
  cv.addEventListener('pointerdown', e => { e.stopPropagation(); DNA.drag = { p: pos(e), t: performance.now(), m: 0 }; DNA.wx = DNA.wy = 0; DNA.press = 1; haptic(4); try { cv.setPointerCapture(e.pointerId); } catch (x) {} });
  cv.addEventListener('pointermove', e => { const d = DNA.drag; if (!d) return; e.stopPropagation(); const p = pos(e), dx = p[0] - d.p[0], dy = p[1] - d.p[1], dt = Math.max(.012, (performance.now() - d.t) / 1000), k = .011; dnaRot(dy * k, dx * k); DNA.wy = clamp(DNA.wy * .6 + dx * k / dt * .4, -3.2, 3.2); DNA.wx = clamp(DNA.wx * .6 + dy * k / dt * .4, -3.2, 3.2); const sp = Math.hypot(dx, dy) / dt; DNA.svx += clamp(Math.abs(dx) / dt * .00026, 0, .55) - clamp(Math.abs(dy) / dt * .00012, 0, .3); DNA.svy += clamp(Math.abs(dy) / dt * .00026, 0, .55) - clamp(Math.abs(dx) / dt * .00012, 0, .3); d.m += Math.hypot(dx, dy); d.p = p; d.t = performance.now(); if (sp > 1800 && Math.random() < .2) buzz(3); });
  const up = e => { const d = DNA.drag; DNA.drag = null; DNA.press = 0; if (d && performance.now() - d.t > 90) { DNA.wx *= .2; DNA.wy *= .2; } if (d && d.m < 6) { try { if ($('settings').contains(cv)) { let el = $('oCar'); if (!el) { el = document.createElement('div'); el.id = 'oCar'; el.className = 'ocar'; const er = $('eRing'); er.parentNode.insertBefore(el, er.nextSibling); } const tx = orbCarryLine(); if (tx) { el.textContent = tx; el.classList.add('on'); clearTimeout(el._t); el._t = setTimeout(() => el.classList.remove('on'), 3000); } } } catch (x) {} DNA.pulseT = .55; DNA.svx += .16; DNA.svy -= .12; DNA.ripT = performance.now(); haptic([5, 60, 5]); try { chime(); } catch (x) {} } };
  cv.addEventListener('pointerup', up); cv.addEventListener('pointercancel', up); }

const HFAM = ['red', 'coral', 'amber', 'gold', 'lime', 'green', 'mint', 'teal', 'sky', 'blue', 'violet', 'rose'];
function orbHints() { const pl = (save.palette || []).filter(p => p && p.h && /^#[0-9a-f]{6}$/i.test(p.h)), n = pl.length, rgb = h => [1, 3, 5].map(i => parseInt(h.substr(i, 2), 16) / 255);
  const KP = [[0, 0], [10, .05], [50, .10], [150, .15], [400, .20]]; let k = 0; if (n >= 3) { if (n >= 400) k = .2; else for (let i = 1; i < KP.length; i++) if (n <= KP[i][0]) { const [a, ka] = KP[i - 1], [b, kb] = KP[i], f = a ? Math.log(n / a) / Math.log(b / a) : n / b, s = f * f * (3 - 2 * f); k = ka + (kb - ka) * (a ? s : f); break; } }
  const hs = c => { const mx = Math.max(...c), mn = Math.min(...c), d = mx - mn, l = (mx + mn) / 2; if (d < 1e-6) return [0, 0, l]; const s = d / (1 - Math.abs(2 * l - 1)); let h = mx === c[0] ? ((c[1] - c[2]) / d) % 6 : mx === c[1] ? (c[2] - c[0]) / d + 2 : (c[0] - c[1]) / d + 4; return [(h * 60 + 360) % 360, s, l]; };
  const fam = {}; pl.forEach(p => { const c = rgb(p.h), [h, s, l] = hs(c); const f = s < .15 || l < .08 || l > .94 ? 'n' : Math.floor(((h + 15) % 360) / 30); (fam[f] = fam[f] || { c: [0, 0, 0], k: 0, best: null }); const F = fam[f]; F.k++; F.c = F.c.map((v, i) => v + c[i]); if (!F.best || s > F.best.s) F.best = { s, c }; });
  const order = Object.keys(fam).filter(f => f !== 'n').sort((a, b) => fam[b].k - fam[a].k || a - b); const sf = order[0] ?? (fam.n ? 'n' : null);
  const byNew = pl.slice().sort((a, b) => (a.d || 0) - (b.d || 0)); let best = null; byNew.forEach(p => { if (!best || (p.p || 0) >= (best.p || 0)) best = p; }); const late = byNew.filter(p => (p.p || 0) >= 85).pop() || null;
  const sig = sf == null ? null : fam[sf].best.c; const c = [sig || [0, 0, 0], best ? rgb(best.h) : [0, 0, 0], late ? rgb(late.h) : [0, 0, 0]], o = [sig ? 1 : 0, best ? 1 : 0, late ? 1 : 0];
  let fl = 0; try { fl = Math.min(12, doneSet().size); } catch (e) {} let gl = 0; try { const r = rankOf(save.eye ?? CH0), i = RANKS.indexOf(r); gl = .15 * i / (RANKS.length - 1); } catch (e) {}
  return { k: k, c, o, fl, gl, sigName: sf == null ? '' : sf === 'n' ? 'soft neutrals' : HFAM[sf], best: best && best.n, late: late && late.n }; }
function orbHintStep() { const now = performance.now(); if (!DNA.hT || now - DNA.hChk > 4000) { DNA.hChk = now; const T = orbHints(), key = JSON.stringify([T.k.toFixed(3), T.c, T.o, T.fl, T.gl]); if (key !== DNA.hKey) { DNA.hKey = key; DNA.hInfo = T; if (!DNA.hT) DNA.hC = JSON.parse(JSON.stringify({ k: T.k, c: T.c, o: T.o, fl: T.fl, gl: T.gl })); DNA.hT = T; DNA.hB0 = now; DNA.hFrom = JSON.parse(JSON.stringify(DNA.hC)); } }
  const T = DNA.hT, F = DNA.hFrom; let e = Math.min(1, (now - DNA.hB0) / 3000); e = e * e * (3 - 2 * e); DNA.hBlend = e < 1;
  const L = (a, b) => a + (b - a) * e, LC = (a, b, oa, ob) => oa ? (ob ? a.map((v, i) => L(v, b[i])) : a) : b;
  DNA.hC = { k: L(F.k, T.k), c: T.c.map((c, i) => LC(F.c[i], c, F.o[i], T.o[i])), o: T.o.map((o, i) => L(F.o[i], o)), fl: T.fl, gl: L(F.gl, T.gl) }; return DNA.hC; }
function orbCarryLine() { const I = orbHints(); if (!I.k) return ''; const P = []; if (I.sigName) P.push('carrying ' + I.sigName); if (I.best) P.push('your best mix ' + I.best.toLowerCase()); if (I.fl) P.push(I.fl + ' gold fleck' + (I.fl > 1 ? 's' : '')); return P.join(', '); }
function dnaGL() { if (DNA.G !== undefined) return DNA.G; DNA.G = null; try {
  const cv = document.createElement('canvas'); cv.className = 'dnaorb'; cv.width = cv.height = 400; const g = cv.getContext('webgl', { premultipliedAlpha: true, alpha: true, antialias: false }); if (!g) return null;
  const VS = 'attribute vec2 p; varying vec2 v; void main(){ v=p; gl_Position=vec4(p,0.,1.); }';
  const FS = `precision highp float; varying vec2 v; uniform float uT; uniform mat3 uR; uniform vec3 uSig; uniform float uAmp; uniform float uSpd; uniform float uPul; uniform vec2 uSq; uniform float uRip; uniform vec3 uA0; uniform vec3 uA1; uniform vec3 uA2; uniform vec3 uAo; uniform float uAk; uniform float uFl; uniform float uGl;
float gooE(){ return uRip>0. ? (1.-exp(-uRip*2.6))*exp(-uRip*.95) : 0.; }
float sdf(vec3 q){ q.xy/=(1.+uSq); q.z*=1.+.5*(uSq.x+uSq.y); vec3 p=uR*q; float t=uT*uSpd*.6; float r=length(p); vec3 n=p/max(r,1e-4);
 float d=0.12*sin(1.6*n.x+t*.8)*sin(1.4*n.y+t*.6+1.3)*sin(1.8*n.z+t*.5+.4)*2.0 + 0.05*sin(2.4*n.x+1.6*n.y+t*.4)*cos(2.0*n.z-n.y+t*.3);
 float g=gooE(); if(g>0.){ d+=.05*sin(n.y*4.5+n.x*1.5-uRip*5.)*g + .03*sin(length(n.xz)*6.-uRip*6.)*g; }
 return (r-(0.92+uPul*.05)-d*uAmp)*0.62; }
vec3 nrm(vec3 p){ vec2 e=vec2(.007,-.007); return normalize(e.xyy*sdf(p+e.xyy)+e.yyx*sdf(p+e.yyx)+e.yxy*sdf(p+e.yxy)+e.xxx*sdf(p+e.xxx)); }
vec3 env(vec3 d){ vec3 c=vec3(.015,.016,.022)+vec3(.05,.055,.07)*max(d.y,0.);
 c+=vec3(1.,.95,.9)*1.5*smoothstep(.86,.99,dot(d,normalize(vec3(.35,.85,.45))));
 c+=vec3(.8,.85,1.)*.5*smoothstep(.9,.99,dot(d,normalize(vec3(-.7,.2,.6))));
 return c; }
float cloud(vec3 p){ float t=uT*.18; return .5+.25*sin(dot(p,vec3(2.1,1.3,-1.7))*1.6+t)+.17*sin(dot(p,vec3(-1.2,2.6,1.1))*2.3-t*1.3)+.08*sin(dot(p,vec3(3.1,-2.2,2.7))*3.4+t*1.7); }
void main(){ vec3 ro=vec3(0.,0.,4.3), rd=normalize(vec3(v*.62,-1.6)); float t=2.0, md=9.; bool hit=false;
 for(int i=0;i<40;i++){ vec3 p=ro+rd*t; float d=sdf(p); md=min(md,d); if(d<.0025){hit=true;break;} t+=d*.95; if(t>6.) break; }
 vec3 col=vec3(0.); float a=0.; vec3 S=clamp(uSig,0.,1.); float lum=dot(S,vec3(.3,.55,.15)); vec3 rich=clamp(mix(vec3(lum),S,1.25),0.,1.);
 if(hit){ vec3 p=ro+rd*t, n=nrm(p), vv=-rd; float ndv=clamp(dot(n,vv),0.,1.), fr=.025+.5*pow(1.-ndv,3.2);
  vec3 L1=normalize(vec3(.35,.85,.45));
  // cloudy jelly body: march a few steps inside the blob
  vec3 tr=refract(rd,n,1./1.25); float acc=0., wt=0.; vec3 q=uR*p;
  for(int k=0;k<6;k++){ vec3 s=q+(uR*tr)*(float(k)*.16+.05); float dn=cloud(s); float w=exp(-float(k)*.35); acc+=dn*w; wt+=w; }
  acc/=wt; float depth=pow(ndv,1.2);
  vec3 deep=rich*rich*.22, mid=rich*.85, milk=mix(rich,vec3(1.),.5);
  vec3 body=mix(deep,mid,smoothstep(.15,.85,depth));
  body=mix(body,milk,smoothstep(.45,.9,acc)*.7*(.35+.65*depth));
  body*= .62+.6*acc;
  float wrap=.55+.45*dot(n,L1); body*= .7+.45*wrap;
  if(uAk>0.){ float tw=uT*.07; vec3 qa=q+(uR*tr)*.3;
   float b0=uAo.x*exp(-pow(sin(dot(qa,vec3(1.7,.6,-1.1))*2.2+tw+.4*sin(dot(qa,vec3(-.8,1.9,.7))*1.6-tw*.8)),2.)*26.);
   float b1=uAo.y*exp(-pow(sin(dot(qa,vec3(-1.2,1.5,.9))*2.0-tw*1.1+2.1+.4*sin(dot(qa,vec3(1.4,.3,-1.8))*1.7+tw)),2.)*30.);
   float b2=uAo.z*exp(-pow(sin(dot(qa,vec3(.5,-1.3,1.6))*2.4+tw*.9+4.2+.4*sin(dot(qa,vec3(1.1,1.2,.4))*1.5-tw*1.2)),2.)*34.);
   float ws=b0+b1+b2; if(ws>.001){ vec3 ac=(uA0*b0+uA1*b1+uA2*b2)/ws; ac=ac*.85*(.62+.6*acc)*(.7+.45*wrap); body=mix(body,ac,min(ws,1.)*uAk*(.4+.6*depth)); } }
  vec3 sss=rich*pow(1.-ndv,2.6)*.3*(.6+.4*wrap);
  vec3 rf=reflect(rd,n); vec3 refl=env(rf)*mix(vec3(1.),rich*1.1+.25,.4);
  float th=.5+.5*sin(dot(q,vec3(2.3,3.1,1.7))+uT*.3)+.3*sin(dot(q,vec3(-4.,1.,2.5))-uT*.2);
  vec3 film=.5+.5*cos(6.2832*(vec3(0.,.33,.67)+th*1.1+ndv*1.4));
  vec3 bk=env(tr*vec3(-1.,-1.,1.))*mix(vec3(1.),rich*1.6,.75);
  float sp=pow(max(dot(rf,L1),0.),14.)*.35+pow(max(dot(rf,L1),0.),60.)*.7;
  float g=gooE(); float rimw=pow(1.-ndv,2.4);
  vec3 jelly=(body*.72+bk*.42+sss)*(1.+uGl);
  if(uFl>0.){ vec3 ww=vec3(0.); for(int j=0;j<12;j++){ if(float(j)>=uFl) break; float fj=float(j); vec3 fo=.55*vec3(sin(fj*2.399+uT*.05),cos(fj*1.713+uT*.04)*.8,sin(fj*3.11+1.3-uT*.045)); vec3 fw=fo*uR; float dd=length(cross(fw-ro,rd)); ww+=vec3(1.,.8,.42)*exp(-dd*dd*5200.)*(.55+.45*sin(uT*1.3+fj*1.9)); } jelly+=ww*.9; }
  col=mix(jelly,refl*mix(vec3(1.),film*1.3,.5),fr)+vec3(1.,.98,.95)*sp+film*mix(vec3(1.),rich,.45)*rimw*.34+rich*rimw*(.18+g*.35)+rich*g*.1;
  a=clamp(.5+.42*rimw+.25*(1.-acc)*0.+sp*.5,0.,1.); }
 else { float h=exp(-max(md,0.)*8.); col=rich*h*.2; a=0.; }
 col=1.-exp(-col*1.35); col=pow(col,vec3(.95)); float ed=1.-smoothstep(.62,.96,length(v)); col*=hit?1.:ed; float al=hit?max(a,max(col.r,max(col.g,col.b))*.9):max(col.r,max(col.g,col.b)); col=min(col,vec3(al)+.25); gl_FragColor=vec4(col*step(.004,al), al*step(.004,al)); }`;
  const mk = (ty, src) => { const sh = g.createShader(ty); g.shaderSource(sh, src); g.compileShader(sh); if (!g.getShaderParameter(sh, g.COMPILE_STATUS)) throw new Error(g.getShaderInfoLog(sh)); return sh; };
  const pr = g.createProgram(); g.attachShader(pr, mk(g.VERTEX_SHADER, VS)); g.attachShader(pr, mk(g.FRAGMENT_SHADER, FS)); g.linkProgram(pr); if (!g.getProgramParameter(pr, g.LINK_STATUS)) throw new Error('link'); g.useProgram(pr);
  const b = g.createBuffer(); g.bindBuffer(g.ARRAY_BUFFER, b); g.bufferData(g.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), g.STATIC_DRAW); const loc = g.getAttribLocation(pr, 'p'); g.enableVertexAttribArray(loc); g.vertexAttribPointer(loc, 2, g.FLOAT, false, 0, 0);
  const U = n => g.getUniformLocation(pr, n), u = { T: U('uT'), R: U('uR'), S: U('uSig'), A: U('uAmp'), P: U('uSpd'), L: U('uPul'), Q: U('uSq'), W: U('uRip'), A0: U('uA0'), A1: U('uA1'), A2: U('uA2'), Ao: U('uAo'), Ak: U('uAk'), Fl: U('uFl'), Gl: U('uGl') };
  DNA.G = { cv, draw(t) { g.viewport(0, 0, cv.width, cv.height); g.clearColor(0, 0, 0, 0); g.clear(g.COLOR_BUFFER_BIT);
    g.uniform1f(u.T, t); const M = DNA.M; g.uniformMatrix3fv(u.R, false, new Float32Array([M[0], M[3], M[6], M[1], M[4], M[7], M[2], M[5], M[8]])); g.uniform2f(u.Q, DNA.sqx || 0, DNA.sqy || 0); { const rt = DNA.ripT ? (performance.now() - DNA.ripT) / 1000 : -1; g.uniform1f(u.W, rt > 0 && rt < 5 ? rt : -1); } const sg = DNA.sig || [.78, .8, .84]; g.uniform3f(u.S, sg[0], sg[1], sg[2]); g.uniform1f(u.A, .42 + .3 * Math.min(1.4, DNA.energy || 1) + DNA.pulse * .5); g.uniform1f(u.P, DNA.speed || 1); { const H = orbHintStep(); g.uniform3fv(u.A0, H.c[0]); g.uniform3fv(u.A1, H.c[1]); g.uniform3fv(u.A2, H.c[2]); g.uniform3fv(u.Ao, H.o); g.uniform1f(u.Ak, H.k); g.uniform1f(u.Fl, H.fl); g.uniform1f(u.Gl, H.gl); } g.uniform1f(u.L, DNA.pulse); g.drawArrays(g.TRIANGLES, 0, 3); } };
  dnaBind(cv); return DNA.G; } catch (e) { console.warn('[mix.io] dna gl', e); DNA.G = null; return null; } }
function renderDNA() {
  const el = $('dna'); if (!el) return; const dc = save.dyeCount || {}, H = save.dnaHist || [], at = Object.values(dc).reduce((a, b) => a + b, 0), rc = {}; H.forEach(g => Object.entries(g.d).forEach(([k, v]) => rc[k] = (rc[k] || 0) + v)); const rt = Object.values(rc).reduce((a, b) => a + b, 0);
  const W = n => (at ? (dc[n] || 0) / at : 0) * (rt ? .4 : 1) + (rt ? .6 * (rc[n] || 0) / rt : 0);
  const list = DYES.map((d, i) => ({ d, i, n: Math.round(W(d.name) * 1000) })).filter(x => !x.d.water && x.n > 0).sort((a, b) => b.n - a.n), tot = list.reduce((s, x) => s + x.n, 0);
  const avg = f => H.length ? H.reduce((s, g) => s + f(g), 0) / H.length : null, wr = avg(g => g.n ? g.w / g.n : 0) ?? .1, acc = (avg(g => g.p) ?? 60) / 100, stir = avg(g => g.st) ?? 3, dpg = avg(g => g.n) ?? 5;
  DNA.tr = { wr, acc, stir, dpg }; DNA.energy = .55 + .9 * Math.max(0, acc - .3); DNA.speed = .55 + Math.min(1.3, stir / 5); DNA.calm = wr;
  const IDC = save.idn ? idColor(save.idn) : null; let sig = [.78, .8, .84], hex = ''; if (IDC) { sig = IDC; hex = rgbToHex(sig).toUpperCase(); } else if (tot) { sig = dnaHueMix(list, tot); hex = rgbToHex(sig).toUpperCase(); }
  const idl = save.idn ? `<button class="idrow lq" data-idedit="1"><span class="idsw" style="background:${hex}"></span><span class="idtx"><small>made from</small><b>${save.idn.name.toLowerCase()} · ${MONTHS[save.idn.m - 1]} ${save.idn.d} · ${save.idn.fav}</b></span><span class="idedit">edit</span></button>` : `<button class="idrow lq" data-idedit="1"><span class="idsw" style="background:conic-gradient(#ff3b4f,#ffc93a,#2fd27a,#2fd0ff,#9a5cff,#ff3b4f)"></span><span class="idtx"><small>make it yours</small><b>set your color dna</b></span><span class="idedit">start</span></button>`;
  el.innerHTML = `<div class="dnahex"><span>your color dna</span>${IDC || tot ? `<b>${hex}</b>` : '<small>it forms as you add drops</small>'}</div>${idl}`;
  if (!el._idl) { el._idl = 1; el.addEventListener('click', e => { if (e.target.closest('[data-idedit]')) { buzz(5); openIdSheet(false); } }); }
  const GG = dnaGL(); let cv = GG ? GG.cv : null; const onHome = !$('home').hidden && !$('home').classList.contains('bye') && $('settings').hidden; if (GG) { const host = onHome ? $('hBlob') : $('eBlob'); if (cv.parentNode !== host) host.appendChild(cv); } DNA.cv = cv; DNA.sig = sig;
  // palette: signature-led, with a whisper of your top dyes
  const toHsl = ([r, g, b]) => { const mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2, d = mx - mn; let h = 0, s2 = 0; if (d > 1e-6) { s2 = d / (1 - Math.abs(2 * l - 1)); h = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; h = (h * 60 + 360) % 360; } return [h, s2, l]; };
  const fromHsl = (h, s2, l) => { const C = (1 - Math.abs(2 * l - 1)) * s2, X = C * (1 - Math.abs((h / 60) % 2 - 1)), m = l - C / 2; const [r, g, b] = h < 60 ? [C, X, 0] : h < 120 ? [X, C, 0] : h < 180 ? [0, C, X] : h < 240 ? [0, X, C] : h < 300 ? [X, 0, C] : [C, 0, X]; return [r + m, g + m, b + m]; };
  const [Hh, Sa] = toHsl(sig), S2 = IDC ? Math.max(.55, Sa) : tot ? Math.max(.55, Math.min(.85, Sa * 1.3)) * (1 - .55 * Math.min(1, wr * 1.6)) : .08, LL = IDC ? toHsl(sig)[2] : .58 + .16 * Math.min(1, wr * 1.6), viv = IDC ? sig : fromHsl(Hh, S2, LL); if (tot && !IDC) { sig = viv; hex = rgbToHex(viv).toUpperCase(); const hb = el.querySelector('.dnahex b'); if (hb) hb.textContent = hex; } DNA.sig = sig;
  const cols = [fromHsl(Hh, S2, LL), fromHsl(Hh, S2, Math.min(.85, LL + .12)), fromHsl(Hh, S2, LL - .12), fromHsl((Hh + 14) % 360, S2, LL), fromHsl((Hh + 346) % 360, S2, LL), fromHsl(Hh, S2 * .5, .82)];
  DNA.spr = cols.map(c => { const o = document.createElement('canvas'); o.width = o.height = 32; const k = o.getContext('2d'), g = k.createRadialGradient(16, 16, 0, 16, 16, 16); g.addColorStop(0, css(c.map(v => Math.min(1, v + (1 - v) * .45)), 1)); g.addColorStop(.3, css(c, .85)); g.addColorStop(1, css(c, 0)); k.fillStyle = g; k.fillRect(0, 0, 32, 32); return o; });
  const wt = [6, 3, 3, 2, 2, 1], ws = wt.reduce((a, b) => a + b, 0), pick = () => { let r = Math.random() * ws; for (let i = 0; i < wt.length; i++) { r -= wt[i]; if (r <= 0) return i; } return 0; };
  DNA.P = []; const n = DNA.G ? 0 : Math.round(clamp(500 + dpg * 70, 550, 1300)); for (let i = 0; i < n; i++) { const r = Math.pow(Math.random(), .55), th = Math.random() * 6.283, ph = Math.acos(2 * Math.random() - 1); DNA.P.push({ r, th, ph, w: (.15 + Math.random() * .55) * (Math.random() < .5 ? -1 : 1), br: .6 + Math.random() * 2.2, bp: Math.random() * 6.28, s: pick(), sz: .25 + Math.random() * .5, tw: Math.random() * 6.28 }); }
  if (!DNA.raf) DNA.raf = requestAnimationFrame(dnaLoop);
}
try { const er = document.getElementById('eRing'); if (er && window.IntersectionObserver) new IntersectionObserver(es => { DNA.vis = es[0].isIntersecting; if (DNA.vis && !DNA.raf && DNA.cv) DNA.raf = requestAnimationFrame(dnaLoop); }, { threshold: 0 }).observe(er); } catch (e) {}
function dnaLoop(now) {
  DNA.raf = 0; const cv = DNA.cv; if (DNA.vis === false && !$('settings').hidden && $('settings').contains(cv)) return; if (!cv || !cv.isConnected || ((($('settings').hidden) || !$('settings').contains(cv)) && ($('home').hidden || !$('hBlob').contains(cv)) && !($('wBlob') && $('wBlob').contains(cv))) || document.hidden) return; DNA.raf = requestAnimationFrame(dnaLoop);
  const x = DNA.G && cv === DNA.G.cv ? null : cv.getContext('2d'), N = cv.width, c = N / 2, R = N * .33, t = now / 1000, red = matchMedia('(prefers-reduced-motion: reduce)').matches, dt = Math.min(.05, DNA.lt ? (now - DNA.lt) / 1000 : .016); DNA.lt = now;
  if (!DNA.drag) { DNA.wy += ((red ? 0 : .22) - DNA.wy) * (1 - Math.exp(-dt * 1.6)); DNA.wx += (0 - DNA.wx) * (1 - Math.exp(-dt * 1.1)); DNA.wx = clamp(DNA.wx, -3.2, 3.2); DNA.wy = clamp(DNA.wy, -3.2, 3.2); dnaRot(DNA.wx * dt, DNA.wy * dt); DNA.yaw += DNA.wy * dt; }
  { const tx = DNA.press * .1, ty = -DNA.press * .08; for (const [a, v] of [['sqx', 'svx'], ['sqy', 'svy']]) { const tg = a === 'sqx' ? tx : ty, acc = (tg - DNA[a]) * 48 - DNA[v] * 3.4; DNA[v] += acc * dt; DNA[a] += DNA[v] * dt; DNA[a] = clamp(DNA[a], -.38, .5); } }
  if (DNA.pulseT) { DNA.pulse += (DNA.pulseT - DNA.pulse) * (1 - Math.exp(-dt * 3)); if (DNA.pulse > .9 * DNA.pulseT) DNA.pulseT = 0; } else DNA.pulse *= Math.exp(-dt * 1.15);
  if (DNA.G && cv === DNA.G.cv) { const busy = DNA.drag || DNA.pulse > .02 || Math.abs(DNA.sqx) + Math.abs(DNA.sqy) + Math.abs(DNA.svx) + Math.abs(DNA.svy) > .01 || (DNA.ripT && now - DNA.ripT < 5000) || Math.abs(DNA.wx) + Math.abs(DNA.wy) > .6 || DNA.hBlend; if (!busy && DNA.ld && now - DNA.ld < 40) return; DNA.ld = now; DNA.G.draw(red ? 0 : t); return; }
  x.clearRect(0, 0, N, N); x.globalCompositeOperation = 'source-over';
  const EN = DNA.energy || 1, SPD = DNA.speed || 1, pul = 1 + (red ? 0 : .04 * Math.sin(t * 1.3 * SPD)) + DNA.pulse * .25;
  x.globalCompositeOperation = 'lighter';
  const gl = x.createRadialGradient(c, c, 0, c, c, R * 1.6 * pul); gl.addColorStop(0, css(DNA.sig, .55 * EN)); gl.addColorStop(.3, css(DNA.sig, .22 * EN)); gl.addColorStop(.65, css(DNA.sig, .06)); gl.addColorStop(1, css(DNA.sig, 0)); x.fillStyle = gl; x.fillRect(0, 0, N, N);
  const core = x.createRadialGradient(c, c, 0, c, c, R * .55 * pul); core.addColorStop(0, `rgba(255,255,255,${Math.min(.95, .75 * EN)})`); core.addColorStop(.25, css(DNA.sig.map(v => Math.min(1, v + (1 - v) * .5)), .55)); core.addColorStop(1, css(DNA.sig, 0)); x.fillStyle = core; x.fillRect(0, 0, N, N);
  const cy = Math.cos(DNA.yaw), sy = Math.sin(DNA.yaw), cp = Math.cos(DNA.pit), sp = Math.sin(DNA.pit), tt = red ? 0 : t * SPD;
  for (const p of DNA.P) { const th = p.th + p.w * tt, rr = p.r * (1 + .12 * Math.sin(tt * p.br + p.bp)) * pul, sph = Math.sin(p.ph + .3 * Math.sin(tt * .4 + p.bp));
    let X = rr * sph * Math.cos(th), Y = rr * Math.cos(p.ph), Z = rr * sph * Math.sin(th); const X2 = X * cy + Z * sy, Z2 = -X * sy + Z * cy, Y2 = Y * cp - Z2 * sp; Z = Y * sp + Z2 * cp;
    const f = (Z + 1) / 2, edge = 1 - Math.min(1, rr), tw = .65 + .35 * Math.sin(tt * 3 + p.tw), a = Math.min(1, (.08 + .5 * f) * (.25 + .75 * edge) * tw * (.7 + .4 * EN)), sz = (2 + 4 * f) * p.sz * (N / 440);
    x.globalAlpha = a; x.drawImage(DNA.spr[p.s], c + X2 * R - sz, c + Y2 * R - sz, sz * 2, sz * 2); }
  x.globalAlpha = 1; x.globalCompositeOperation = 'source-over';
}
function renderRankRow() { const ey = (save.eye ?? CH0), r = rankOf(ey), i = RANKS.indexOf(r), nx = nextRank(ey); $('rkRow').style.setProperty('--gc', r[2]); $('rkRow').innerHTML = `<span class="rkg">${gemSVG(r, 30)}</span><span class="rkt"><small>rank</small><b>${r[1]}</b></span><span class="rkr">${ey >= 100 ? 'world ranked' : nx ? `${(nx[0] - ey).toFixed(1)} to ${nx[1]}` : `${(100 - ey).toFixed(1)} to world ranked`}</span><span class="rkc2">›</span>`; }
function openRanks() {
  const ey = (save.eye ?? CH0), cur = rankOf(ey), ci = RANKS.indexOf(cur), best = save.eyeBest ?? ey, sh = $('rkSheet');
  const nx2 = nextRank(ey), lo = cur[0], hi = nx2 ? nx2[0] : 100, prg = clamp((ey - lo) / Math.max(.001, hi - lo), 0, 1), RR = 92, CC = 2 * Math.PI * RR;
  $('rkPanel').innerHTML = `<div class="rkh"><div><small>your rank</small></div><button class="rkx" aria-label="Close">×</button></div>` +
    `<div class="rkhero" style="--gc:${cur[2]}"><div class="rkring"><svg viewBox="0 0 200 200"><circle cx="100" cy="100" r="${RR}" class="rkr0"/><circle cx="100" cy="100" r="${RR}" class="rkr1" style="--dash:${(CC * Math.max(.015, prg)).toFixed(1)};stroke-dasharray:${(CC * Math.max(.015, prg)).toFixed(1)} ${CC.toFixed(1)}"/></svg><div class="rkin"><span class="rkgem">${gemSVG(cur, 58)}</span><b class="rkeye">${fmtC(ey)}</b><small>${cur[1]}</small></div></div>` +
    `<div class="rknext">${ey >= 100 ? 'world ranked · ' + Math.round(save.wr || 0).toLocaleString('en-US') + ' world points' : nx2 ? `${(nx2[0] - ey).toFixed(1)} to <b style="color:${nx2[2]}">${nx2[1]}</b>` : `${(100 - ey).toFixed(1)} to world ranked`}</div>` +
    `<div class="rkrow">${RANKS.map((r, i) => `<span class="rkchip${i < ci ? ' done' : i === ci ? ' cur' : ''}${i === ci && save.rkNew === cur[1] ? ' fresh' : ''}" style="--gc:${r[2]};--i:${i}" title="${r[1]} · ${r[0]}+">${gemSVG(r, 24)}</span>`).join('')}</div></div>` +
    (() => { const P = chParts(); return `<div class="rkcap"><div class="rkbd"><span><small>colors</small><b>${P.n.toLocaleString('en-US')}<i> / ${ALLN.length.toLocaleString('en-US')}</i></b></span><span><small>accuracy</small><b>${Math.round(P.q * 100)}%</b></span><span><small>skill</small><b>${Math.round(P.sk * 100)}</b></span></div>your eye grows as you find more of the world's colors, match them well, and beat harder ones. find all ${ALLN.length.toLocaleString('en-US')} with great accuracy and you break 100.</div>`; })() +
    `<div class="lbw" id="lbW"><div class="lbh"><span>world leaderboard</span><small id="lbMe"></small></div><div id="lbL"><div class="lbmsg">loading the world…</div></div></div>` + (ACCOUNT.signedIn() ? '' : `<button class="lbcard lq" data-lb="1"><span><b>world leaderboard</b><small>make an account to join the world rankings and earn world awards.</small></span><span class="lbgo">sign in ›</span></button>`);
  (async () => { const L = $('lbL'); try { await SB.push(true); const [rows, me] = await Promise.all([SB.top(50), SB.myRank().catch(() => 0)]); if (!L.isConnected) return; const uid = SB.signedIn() ? (save.acct && save.acct.id) : null;
      L.innerHTML = rows.length ? rows.map((r, k) => `<div class="lbr${r.id === uid ? ' me' : ''}"><span class="lbn">${k + 1}</span><span class="lbd" style="background:${/^#[0-9a-f]{6}$/i.test(r.dna || '') ? r.dna : '#8a96a8'}"></span><span class="lbm"></span><span class="lbc">${Number(r.chroma).toFixed(1)}${r.wr > 0 ? `<small>+${Math.round(r.wr).toLocaleString('en-US')}</small>` : ''}</span></div>`).join('') : '<div class="lbmsg">no one yet. be the first.</div>';
      L.querySelectorAll('.lbm').forEach((el, k) => el.textContent = (rows[k].name || 'player').toLowerCase());
      if (me) { $('lbMe').textContent = 'you · #' + me.toLocaleString('en-US'); try { checkBadges(-1); } catch (e) {} } }
    catch (e) { if (L.isConnected) L.innerHTML = '<div class="lbmsg">the leaderboard is offline right now. your progress is safe.</div>'; } })();
  if (save.rkNew === cur[1]) { $('rkPanel').querySelector('.rkring').classList.add('fresh'); setTimeout(() => { try { HAP.success(); } catch (e) {} }, 500); save.rkNew = null; persist(); }
  sh.hidden = false; sh.querySelector('.rkx').onclick = () => { sh.hidden = true; }; sh.onclick = e => { if (e.target === sh) sh.hidden = true; else if (e.target.closest('[data-lb]')) { sh.hidden = true; openAccountSheet(false, 'lb'); } }; tick();
}
$('rkRow').addEventListener('click', openRanks); $('idSet').addEventListener('click', () => { $('setSheet').hidden = true; openIdSheet(false); });
{ let asked = false; const tryAsk = () => { if (asked) return; if ((save.idn || save.idSkip) && save.acctMode && (save.tutNudged || !ONB.newPlayer())) return; const fresh = !save.idn && !save.idSkip; if ($('intro').hidden && !$('home').hidden && BOOTED) { asked = true; setTimeout(() => { if ($('intro').hidden) ONB.next(); }, fresh ? 0 : 900); } else setTimeout(tryAsk, fresh ? 120 : 800); }; setTimeout(tryAsk, 400); }
{ const dt = $('demoT'), dv = $('demoV'); if (PROFILE === 'main') { dt.textContent = 'saved game loaded'; dv.textContent = 'new player ›'; } $('demoSet').addEventListener('click', () => { try { if (PROFILE === 'demo') { localStorage.setItem('mixio.profile', 'main'); } else { persist(); localStorage.removeItem('mixio.demo'); localStorage.removeItem('mixio.demo.best'); localStorage.setItem('mixio.profile', 'demo'); } } catch (e) {} buzz(8); setTimeout(() => location.reload(), 150); }); }
{ const b = $('siteSet'); if (ON_SITE) b.style.display = 'none'; b.addEventListener('click', () => { buzz(6); persist(); const u = saveLink(); try { window.open(u, '_blank'); } catch (e) { location.href = u; } }); }
$('acSet').addEventListener('click', () => { $('setSheet').hidden = true; openAccountSheet(false); }); $('tutSet').addEventListener('click', () => { $('setSheet').hidden = true; save.tutDone = 0; persist(); goTab('play'); setTimeout(() => TUT.start(), 900); }); renderAcSet(); $('ppRow').addEventListener('click', () => { buzz(6); openPassport(); }); $('ppSheet').addEventListener('click', e => { const sh = $('ppSheet'); if (e.target === sh || e.target.closest('#ppX') || e.target.closest('[data-close]')) { sh.hidden = true; return; } const b = e.target.closest('[data-set],[data-cc],[data-back],[data-n],[data-colls]'); if (!b) return; buzz(5); if (b.dataset.colls) openPassport({ colls: 1, solo: 1 }); else if (b.dataset.back) openPassport(); else if (b.dataset.set) openPassport({ set: b.dataset.set, fromColls: !!sh.querySelector('[data-colls],.rkh b') && /collections/.test(sh.querySelector('.rkh b')?.textContent || '') }); else if (b.dataset.cc) openPassport({ cc: b.dataset.cc }); else if (b.dataset.n) STORY.openName(b.dataset.n, b); });
$('hGear').addEventListener('click', e => { e.stopPropagation(); audio(); renderSettings(true); $('setSheet').hidden = false; });
$('setClose').addEventListener('click', () => { $('setSheet').hidden = true; });
$('setSheet').addEventListener('click', e => { if (e.target === $('setSheet')) $('setSheet').hidden = true; });
let wallSig = null;
const SPEC = (() => {
  let wrap = null, cv, tip, ctx, W = 0, D = 1, TW = 0, X = 0, vx = 0, raf = 0, layer = null, sig = '', list = [], got = {}, fresh = new Set(), freshT = 0, drag = null, lastN = null;
  const H = 112, STEP = () => Math.max(1.05, W * 3 / Math.max(1, list.length));
  function ensure() { if (wrap) return; wrap = $('pal'); wrap.className = 'spec'; wrap.innerHTML = '<canvas></canvas><div class="etip" hidden><i></i><span></span></div>'; cv = wrap.querySelector('canvas'); tip = wrap.querySelector('.etip'); bind(); }
  function size() { const w = wrap.clientWidth; if (!w) return false; if (w !== W) { W = w; D = Math.min(devicePixelRatio || 1, 2); cv.width = W * D; cv.height = H * D; ctx = cv.getContext('2d'); sig = ''; } return true; }
  function build() { const st = STEP(); TW = st * list.length + 24; const sg = W + '|' + D + '|' + Object.keys(got).length; if (sg === sig && layer) return; sig = sg;
    layer = document.createElement('canvas'); layer.width = Math.ceil(TW * D); layer.height = H * D; const k = layer.getContext('2d'); k.setTransform(D, 0, 0, D, 0, 0);
    k.beginPath(); list.forEach((it, i) => { if (got[it.n]) return; const x = 12 + i * st; k.moveTo(x, H * .3); k.lineTo(x, H * .7); }); k.strokeStyle = 'rgba(220,228,236,.16)'; k.lineWidth = 1; k.stroke();
    k.lineWidth = Math.min(2.2, st * .9); list.forEach((it, i) => { const p = got[it.n]; if (!p) return; const x = 12 + i * st; k.shadowColor = p.h; k.shadowBlur = 6; k.strokeStyle = p.h; k.beginPath(); k.moveTo(x, H * .16); k.lineTo(x, H * .84); k.stroke(); }); }
  function draw(now) { if (!size()) return; build(); const c = ctx; c.setTransform(1, 0, 0, 1, 0, 0); c.clearRect(0, 0, cv.width, cv.height); c.drawImage(layer, -X * D, 0);
    const pt = now ? (now - freshT) / 900 : 1; if (pt < 1 && fresh.size) { const st = STEP(); c.setTransform(D, 0, 0, D, 0, 0); c.save(); c.globalCompositeOperation = 'lighter'; list.forEach((it, i) => { if (!fresh.has(it.n) || !got[it.n]) return; const x = 12 + i * st - X; if (x < -10 || x > W + 10) return; const a = Math.sin(pt * Math.PI); c.strokeStyle = got[it.n].h; c.globalAlpha = a; c.shadowColor = got[it.n].h; c.shadowBlur = 16; c.lineWidth = 3; c.beginPath(); c.moveTo(x, 4); c.lineTo(x, H - 4); c.stroke(); }); c.restore(); } }
  const maxX = () => Math.max(0, TW - W);
  function loop(now) { raf = 0; let go = false; if (!drag && Math.abs(vx) > 5) { X = clamp(X + vx / 60, 0, maxX()); vx *= .94; if (X <= 0 || X >= maxX()) vx = 0; go = true; } if (now - freshT < 950) go = true; draw(now); if (go) raf = requestAnimationFrame(loop); }
  const kick = () => { if (!raf) raf = requestAnimationFrame(loop); };
  function nearestAt(px) { const st = STEP(), i0 = Math.round((px + X - 12) / st); let best = null, bd = 14 / st; for (let d = 0; d <= bd; d++) for (const i of [i0 - d, i0 + d]) { const it = list[i]; if (it && got[it.n]) return { it, p: got[it.n], x: 12 + i * st - X }; } return best; }
  function tipAt(px) { const h = nearestAt(px); if (!h) { tip.hidden = true; lastN = null; return null; } if (h.p.n !== lastN) { lastN = h.p.n; haptic(4); tip.style.setProperty('--c', h.p.h); tip.querySelector('span').textContent = h.p.n; } tip.hidden = false; tip.style.left = clamp(h.x, 60, W - 60) + 'px'; tip.style.top = '22px'; return h; }
  function bind() {
    cv.addEventListener('pointerdown', e => { const r = cv.getBoundingClientRect(); drag = { id: e.pointerId, x: e.clientX, x0: e.clientX, y0: e.clientY, t: performance.now(), lx: e.clientX - r.left, scrub: false, moved: 0, h: null }; vx = 0; drag.hold = setTimeout(() => { if (drag && drag.moved < 8) { drag.scrub = true; try { cv.setPointerCapture(drag.id); } catch (x) {} drag.h = tipAt(drag.lx); } }, 260); });
    cv.addEventListener('pointermove', e => { if (!drag || drag.id !== e.pointerId) return; const r = cv.getBoundingClientRect(), dx = e.clientX - drag.x; drag.moved = Math.max(drag.moved, Math.abs(e.clientX - drag.x0)); if (drag.scrub) { drag.h = tipAt(e.clientX - r.left); } else if (Math.abs(e.clientX - drag.x0) > Math.abs(e.clientY - drag.y0)) { const now = performance.now(), dt = Math.max(8, now - drag.t); X = clamp(X - dx, 0, maxX()); vx = -dx / dt * 1000 * .9 + vx * .1; drag.t = now; draw(); } drag.x = e.clientX; });
    const up = e => { if (!drag || drag.id !== e.pointerId) return; clearTimeout(drag.hold); const d = drag; drag = null; tip.hidden = true; lastN = null; const r = cv.getBoundingClientRect();
      let h = d.scrub ? d.h : (d.moved < 6 && e.type !== 'pointercancel' ? nearestAt(e.clientX - r.left) : null);
      if (h && e.type !== 'pointercancel') { const list2 = list.filter(it => got[it.n]).map(it => got[it.n]); STORY.openList(list2, list2.indexOf(h.p), { x: r.left + h.x, y: r.top + H / 2 }); } else kick(); };
    cv.addEventListener('pointerup', up); cv.addEventListener('pointercancel', up);
  }
  function show(g, seen) { ensure(); got = g; list = RING_ITEMS || []; fresh = new Set(Object.keys(g).filter(n => !seen.has(n))); if (seen.size === 0) fresh.clear(); freshT = performance.now(); requestAnimationFrame(t => { size(); build(); X = clamp(X, 0, maxX()); kick(); }); }
  return { show };
})();
function openAllPostcards() {
  const sh = $('ppSheet'), P = $('ppPanel'), L = (save.palette || []).slice().sort((a, b) => (b.p || 0) - (a.p || 0)), G = new Map();
  L.forEach(p => { const a = atlasOf(p.n), cc = (a && a[6]) || '~'; if (!G.has(cc)) G.set(cc, []); G.get(cc).push(p); });
  const groups = [...G.entries()].sort((a, b) => b[1].length - a[1].length || (a[0] === '~') - (b[0] === '~'));
  const nm = cc => cc === '~' ? 'open waters' : cc === 'aq' ? 'antarctica' : (COUNTRY[cc] || cc);
  let k = 0; P.innerHTML = `<div class="rkh"><div><small>all your</small><b>postcards</b></div><button class="rkx" aria-label="Close">×</button></div><div class="apc">` + groups.map(([cc, ps]) => `<div class="apg"><div class="apgh">${FLAGS && FLAGS[cc] ? `<img alt="" src="${FLAGS[cc]}">` : '<i></i>'}<b></b><small>${ps.length}</small></div><div class="jpc">${ps.map(p => `<button class="jcard" data-n="${p.n.replace(/"/g, '&quot;')}" style="--t:${p.h};--m:${p.m || p.h};--d:${Math.min(12, k++) * 30}ms"><span class="jink"><i></i></span><span class="jtx"><b></b><small></small></span><span class="jpct">${fmtP(p.p)}%</span></button>`).join('')}</div></div>`).join('') + `</div>`;
  P.querySelectorAll('.apg').forEach((g, i) => { g.querySelector('.apgh b').textContent = nm(groups[i][0]); g.querySelectorAll('.jcard').forEach((b, j) => { const p = groups[i][1][j], a = atlasOf(p.n); b.querySelector('b').textContent = p.n; b.querySelector('small').textContent = a ? a[3] : ''; }); });
  sh.hidden = false; P.scrollTop = 0; P.querySelector('.rkx').onclick = () => { sh.hidden = true; };
  P.onclick = e => { const c = e.target.closest('.jcard'); if (c) { buzz(5); try { STORY.openName(c.dataset.n, c); } catch (x) {} } }; sh.onclick = e => { if (e.target === sh) sh.hidden = true; };
}
function renderJournal() { const W = $('jPc'); if (!W) return; const L = (save.palette || []).slice().sort((a, b) => (b.p || 0) - (a.p || 0) || (b.d || 0) - (a.d || 0));
  W.innerHTML = L.length ? L.slice(0, 12).map((p, k) => { const a = atlasOf(p.n), pl = a ? a[3] : ''; return `<button class="jcard" data-n="${p.n.replace(/"/g, '&quot;')}" style="--t:${p.h};--m:${p.m || p.h};--d:${k * 35}ms"><span class="jink"><i></i></span><span class="jtx"><b></b><small></small></span><span class="jpct">${fmtP(p.p)}%</span></button>`; }).join('') + (L.length > 12 ? `<button class="jmore" data-all="1">all ${L.length} postcards ›</button>` : '') : '<div class="jempty">your first postcard arrives when you match a color.</div>';
  W.querySelectorAll('.jcard').forEach((b, k) => { const p = L[k], a = atlasOf(p.n); b.querySelector('b').textContent = p.n; b.querySelector('small').textContent = a ? a[3] : ''; });
  const st = $('jSt'); if (st) { try { const got = {}; (save.palette || []).forEach(p => got[p.n] = 1); const CP = countryProg(); let seen = []; try { seen = JSON.parse(localStorage.getItem('mixio.goldSeen') || '[]'); } catch (e) {} const ns = [];
    const cs = getCountries().filter(c => c.ns.some(n => got[n])).map(c => ({ c, p: CP[c.cc] })).sort((a, b) => ((b.p && b.p.done) ? 1 : 0) - ((a.p && a.p.done) ? 1 : 0));
    st.innerHTML = cs.slice(0, 24).map(({ c, p }) => { const g = p && p.done, sh = g && !seen.includes(c.cc); if (sh) ns.push(c.cc); return `<span class="jstamp${g ? ' gold' : ''}${sh ? ' sheen' : ''}" title="${c.cc}">${FLAGS && FLAGS[c.cc] ? `<img alt="" src="${FLAGS[c.cc]}">` : ''}<em>${(c.name || c.cc || '').toString().toLowerCase()}</em>${p && !g ? `<small>${p.k}/${p.n}</small>` : ''}</span>`; }).join('') || '<div class="jempty">stamps appear as you find colors in new countries.</div>';
    if (ns.length) try { localStorage.setItem('mixio.goldSeen', JSON.stringify(seen.concat(ns))); } catch (e) {} } catch (e) { st.innerHTML = ''; } } }
{ const T = $('jTabs'); if (T) T.addEventListener('click', e => { const b = e.target.closest('[data-p]'); if (!b) return; buzz(4); T.querySelectorAll('[data-p]').forEach(x => x.classList.toggle('on', x === b)); const i = [...T.querySelectorAll('[data-p]')].indexOf(b); T.style.setProperty('--ji', i); document.querySelectorAll('.jpg').forEach(pg => { const on = pg.dataset.p === b.dataset.p; pg.hidden = !on; if (on) tabIn(pg); }); }); }
{ const W = $('jPc'); if (W) W.addEventListener('click', e => { const c = e.target.closest('.jcard'); if (c) { buzz(5); try { STORY.openName(c.dataset.n, c); } catch (x) {} return; } if (e.target.closest('[data-all]')) { try { openAllPostcards(); } catch (x) {} } }); }

let YLB = null, YLBt = 0;