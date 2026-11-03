const ATLAS = (() => {
  const view = $('aView'), pc = $('aPins'), px = pc.getContext('2d'), card = $('aCard');
  let T, renderer, sc3, cam, grp, ready = false, loading = false, running = false, W = 0, H = 0, D = 1, last = 0;
  let lastTouch = 0; const FOV = 40; let cin = null, fly = null, glowName = null, glowT = 0, zMax = 3.1, fitted = false, rotX = .4, rotY = -1.1, vel = [0, 0], zoom = 3.1, zT = 3.1, ptrs = new Map(), drag = null, pinch = null, lastTap = 0, moved = 0, sp = [];
  const vec = (la, ln) => { const a = (ln + 180) / 360 * Math.PI * 2, p = (90 - la) * Math.PI / 180; return [-Math.cos(a) * Math.sin(p), Math.cos(p), Math.sin(a) * Math.sin(p)]; };
  const PV = ATLAS_DATA.map(r => vec(r[1], r[2]));
  const OV = {}, GA = {}; let LENS = 0, LSig = '', LCOL = {}, LTIER = {}; let GOLD = new Set(), gSig = '';
  const CPL = {}; const cpool = cc => { if (cc in CPL) return CPL[cc]; let s = [0, 0, 0], L = []; ATLAS_DATA.forEach((r, i) => { if (r[6] === cc) { L.push(PV[i]); s[0] += PV[i][0]; s[1] += PV[i][1]; s[2] += PV[i][2]; } }); const l = Math.hypot(...s); if (!l) return (CPL[cc] = null); const v = s.map(x => x / l); let r = .03; L.forEach(q => { r = Math.max(r, Math.acos(clamp(q[0] * v[0] + q[1] * v[1] + q[2] * v[2], -1, 1))); }); return (CPL[cc] = { v, r: Math.min(r, .35) }); };
  const ovOf = cc => { if (OV[cc]) return OV[cc]; return (OV[cc] = (OUTL[cc] || []).map(q => { const a = new Float32Array(q.length / 2 * 3); for (let i = 0; i < q.length; i += 2) a.set(vec(q[i] / 5, q[i + 1] / 5), i / 2 * 3); return a; })); };
  let SUN = null, sunT = 0, zSlow = false, EMAT = null, SUNW = null, JOUR = false, jT = 0, BEAM = 0, jStart = 0, jFollow = -1, jOrder = null, jSig = '';
  function placeSun() { if (!SUN) return; const d = new Date(), doy = Math.floor((d - new Date(d.getFullYear(), 0, 0)) / 864e5), dec = -23.44 * Math.cos(2 * Math.PI / 365 * (doy + 10)), utc = d.getUTCHours() + d.getUTCMinutes() / 60 + d.getUTCSeconds() / 3600; let lng = (12 - utc) * 15; lng = ((lng + 540) % 360) - 180; const [x, y, z] = vec(dec, lng); SUN.position.set(x * 5, y * 5, z * 5); sunT = performance.now(); }
  const GI = (() => { const m = new Map(); ATLAS_DATA.forEach((r, i) => { const key = r[1].toFixed(2) + ',' + r[2].toFixed(2); (m.get(key) || m.set(key, []).get(key)).push(i); }); const o = []; m.forEach((L, key) => L.forEach((i, k) => o[i] = { key, k, n: L.length })); return o; })(); let SPR = 0;
  function loadThree(cb) { if (window.THREE) return cb(); if (loading) return; loading = true; const s = document.createElement('script'); s.crossOrigin = 'anonymous'; s.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js'; s.onload = () => { loading = false; cb(); }; s.onerror = () => { loading = false; $('aCount').textContent = 'the globe needs a connection'; }; document.head.appendChild(s); }
  function init() {
    T = THREE; renderer = new T.WebGLRenderer({ antialias: (devicePixelRatio || 1) < 2, powerPreference: 'low-power', alpha: true, premultipliedAlpha: true }); renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.6)); renderer.setClearColor(0x000000, 0); renderer.outputEncoding = T.sRGBEncoding;
    view.insertBefore(renderer.domElement, pc); sc3 = new T.Scene(); cam = new T.PerspectiveCamera(FOV, 1, .01, 200);
    grp = new T.Group(); sc3.add(grp);
    renderer.toneMapping = T.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.2; EMAT = null; SUN = null;
    const PI = Math.PI, RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
    // lights (fixed in the scene; legacy-light units, so the approved values are divided by PI)
    { const key = new T.DirectionalLight(0xfff6ea, 2.1 / PI); key.position.set(-3.2, 2.4, 2.4); sc3.add(key); AERO.key = key; sc3.add(new T.HemisphereLight(0xdff6ff, 0x1a3a4a, .7 / PI)); const fr = new T.DirectionalLight(0xffffff, .45 / PI); fr.position.set(.5, .3, 5); sc3.add(fr); const rim = new T.DirectionalLight(0x9fe8ff, 1.0 / PI); rim.position.set(3.4, .8, -2.6); sc3.add(rim); const kick = new T.DirectionalLight(0x7dffc4, .5 / PI); kick.position.set(1, -3, 1); sc3.add(kick); }
    // water (approved soft values)
    const WU = { t: { value: 0 }, hm: { value: null }, sunV: { value: new T.Vector3(-.4, .5, .77) } }; AERO.WU = WU;
    const ocean = new T.Mesh(new T.SphereGeometry(1, 160, 80), new T.ShaderMaterial({ uniforms: WU,
      vertexShader: 'varying vec2 vUv; varying vec3 vP; varying vec3 vN; varying vec3 vV; void main(){ vUv = uv; vP = normalize(position); vec4 mv = modelViewMatrix*vec4(position,1.); vN = normalize(normalMatrix*normal); vV = normalize(-mv.xyz); gl_Position = projectionMatrix*mv; }',
      fragmentShader: `precision highp float; uniform float t; uniform sampler2D hm; uniform vec3 sunV; varying vec2 vUv; varying vec3 vP; varying vec3 vN; varying vec3 vV;
      float h(vec3 p){ return fract(sin(dot(p, vec3(127.1,311.7,74.7)))*43758.5453); }
      float n3(vec3 p){ vec3 i=floor(p), f=fract(p); f=f*f*(3.-2.*f); return mix(mix(mix(h(i),h(i+vec3(1,0,0)),f.x),mix(h(i+vec3(0,1,0)),h(i+vec3(1,1,0)),f.x),f.y),mix(mix(h(i+vec3(0,0,1)),h(i+vec3(1,0,1)),f.x),mix(h(i+vec3(0,1,1)),h(i+vec3(1,1,1)),f.x),f.y),f.z); }
      float fbm(vec3 p){ float a=.5, r=0.; for(int k=0;k<4;k++){ r+=a*n3(p); p=p*2.03+vec3(1.7,9.2,3.1); a*=.5; } return r; }
      float fbw(vec3 p){ float a=.5, r=0.; for(int k=0;k<2;k++){ r+=a*n3(p); p=p*2.1+vec3(3.1,1.7,5.3); a*=.5; } return r; }
      void main(){
        vec3 p = vP*2.2;
        vec3 q = vec3(fbm(p + vec3(0., t*.035, 0.)), fbm(p + vec3(5.2, 1.3, t*.03)), fbm(p + vec3(2.1, t*.025, 7.7)));
        float r = fbm(p + q*1.8 + vec3(t*.02));
        float r2 = fbm(p*1.6 - q*1.2 + vec3(0., -t*.018, 3.));
        vec3 deep = vec3(.06,.28,.58), sky = vec3(.3,.6,.9), aqua = vec3(.12,.5,.8), mint = vec3(.3,.8,.74), lav = vec3(.52,.48,.88);
        vec3 c = mix(deep, aqua, smoothstep(.25,.6,r));
        c = mix(c, sky, smoothstep(.55,.8,r)*.7);
        c = mix(c, mint, smoothstep(.55,.8,r2)*.45);
        c = mix(c, lav, smoothstep(.6,.85,q.x)*.35);
        vec4 tx = texture2D(hm, vUv); float shelf = tx.g * (1. - step(.5, tx.b));
        c = mix(c, vec3(.22,.9,.88), pow(shelf, 1.3)*.7);
        c = mix(c, vec3(.6,1.,.95), smoothstep(.75,.98,shelf)*.35);
        float foam = smoothstep(.86,.99,shelf) * (.5 + .5*sin(t*.9 - shelf*28.));
        c += vec3(.85,1.,1.) * foam * .09;
        vec3 wp = vP*16. + vec3(t*.12, t*.08, -t*.1);
        float w0 = fbw(wp), wx = fbw(wp + vec3(.05,0,0)), wy = fbw(wp + vec3(0,.05,0));
        vec3 nrm = normalize(vN + vec3((wx-w0), (wy-w0), 0.)*3.0);
        vec3 L = normalize(vec3(-.45,.55,.8)); vec3 Hh = normalize(L + vV);
        float spec = pow(max(dot(nrm, Hh), 0.), 70.);
        float glint = step(.975, n3(vP*90. + vec3(t*.5, -t*.4, t*.3))) * pow(max(dot(nrm, Hh), 0.), 18.);
        float cn = n3(vP*11. + q*2. + vec3(t*.15));
        float caust = pow(1. - abs(cn*2. - 1.), 10.) * (.05 + shelf*.25);
        float l = dot(nrm, L)*.5 + .5;
        c *= .78 + .32*l;
        c += vec3(.75,.95,1.) * caust;
        c += vec3(1.) * (spec*.22 + glint*.3);
        c *= .86;
        float f = pow(1. - max(dot(vN, vV), 0.), 2.4);
        c = mix(c, vec3(.8,.92,1.), f*.38);
        float dl = smoothstep(-.3, .4, dot(normalize(vN), normalize(sunV))); c *= mix(vec3(.42,.46,.62), vec3(1.), dl); gl_FragColor = vec4(c, 1.);
      }` }));
    grp.add(ocean);
    // land: faceted, from the embedded height map (R height, G inland, B land mask)
    const himg = new Image(); himg.onload = () => { try { const hmTex = new T.Texture(himg); hmTex.needsUpdate = true; hmTex.wrapS = T.RepeatWrapping; WU.hm.value = hmTex; const Wd = himg.width, Hd = himg.height, cv = document.createElement('canvas'); cv.width = Wd; cv.height = Hd; const cx = cv.getContext('2d'); cx.drawImage(himg, 0, 0); AERO.D = cx.getImageData(0, 0, Wd, Hd).data; AERO.W = Wd; AERO.H = Hd; AERO.land(60, m => { AERO.lo = m; grp.add(m); }); } catch (e) { console.warn('[mix.io] earth', e); } }; himg.src = AERO_HM;
    // sky: twinkling stars, faint haze band, low-poly moon, shooting star (fixed; never rotates with the globe)
    { // real night sky: dense pinpoint stars, a Milky Way made of faint stars (no haze, no moon)
      const N = 9000, sp2 = new Float32Array(N * 3), ss = new Float32Array(N), sph = new Float32Array(N), scl = new Float32Array(N * 3), bn = new T.Vector3(.35, 1, -.25).normalize(), tA = new T.Vector3(1, 0, 0).cross(bn).normalize(), tB = bn.clone().cross(tA).normalize();
      for (let i = 0; i < N; i++) { let x, y, z; if (i < N * .45) { const a = Math.random() * 6.283, w = (Math.random() + Math.random() + Math.random() - 1.5) * .16; x = tA.x * Math.cos(a) + tB.x * Math.sin(a) + bn.x * w; y = tA.y * Math.cos(a) + tB.y * Math.sin(a) + bn.y * w; z = tA.z * Math.cos(a) + tB.z * Math.sin(a) + bn.z * w; const l = Math.hypot(x, y, z); x /= l; y /= l; z /= l; } else { const u = Math.random() * 2 - 1, a = Math.random() * 6.283, rr = Math.sqrt(1 - u * u); x = rr * Math.cos(a); y = u; z = rr * Math.sin(a); }
        const R = 28; sp2.set([x * R, y * R, z * R], i * 3); const band = i < N * .45; ss[i] = band ? Math.pow(Math.random(), 6) * 1.6 + .35 : Math.pow(Math.random(), 4.5) * 3.2 + .4; sph[i] = Math.random() * 6.283;
        const k = Math.random(); scl.set(k < .12 ? [.72, .82, 1] : k < .2 ? [1, .88, .72] : k < .23 ? [1, .76, .62] : [1, 1, .98], i * 3); }
      const sg = new T.BufferGeometry(); sg.setAttribute('position', new T.BufferAttribute(sp2, 3)); sg.setAttribute('sz', new T.BufferAttribute(ss, 1)); sg.setAttribute('ph', new T.BufferAttribute(sph, 1)); sg.setAttribute('cl', new T.BufferAttribute(scl, 3));
      const SU = { t: { value: 0 }, dpr: { value: renderer.getPixelRatio() }, tw: { value: RM ? 0 : 1 } };
      const stars = new T.Points(sg, new T.ShaderMaterial({ uniforms: SU, transparent: true, depthWrite: false, blending: T.AdditiveBlending,
        vertexShader: 'attribute float sz; attribute float ph; attribute vec3 cl; uniform float t; uniform float dpr; uniform float tw; varying float vA; varying vec3 vC; void main(){ vec4 mv = modelViewMatrix*vec4(position,1.); gl_Position = projectionMatrix*mv; float w = mix(1., .82 + .18*sin(t*(.5 + fract(ph)*1.2) + ph), tw); vA = w * clamp(sz*.42, .18, 1.); vC = cl; gl_PointSize = max(1., sz * dpr * .9); }',
        fragmentShader: 'varying float vA; varying vec3 vC; void main(){ vec2 d = gl_PointCoord - .5; float r = length(d); float a = smoothstep(.5, 0., r); a = a*a*a; gl_FragColor = vec4(vC * a * vA, a * vA); }' })); sc3.add(stars);
      AERO.tick = tt => { WU.t.value = RM ? 0 : tt; SU.t.value = tt; stars.rotation.y = tt * .002; }; }
    { // T2: country borders (internal borders only; coasts untouched), progress-warmed, drawn once
      const P2C = new Map(), K = (x, y) => x * 4000 + y; Object.entries(OUTL).forEach(([cc, RR]) => RR.forEach(q => { for (let i = 0; i < q.length; i += 2) { const k = K(q[i], q[i + 1]); let s = P2C.get(k); if (!s) P2C.set(k, s = new Set()); s.add(cc); } }));
      const pos = [], cid = [], CC = Object.keys(OUTL), R = 1.046;
      CC.forEach((cc, ci) => OUTL[cc].forEach(q => { const n = q.length / 2; for (let i = 0; i < n; i++) { const j = (i + 1) % n, ka = K(q[i * 2], q[i * 2 + 1]), kb = K(q[j * 2], q[j * 2 + 1]), sa = P2C.get(ka), sb = P2C.get(kb); let sh = false; for (const o of sa) if (o !== cc && sb.has(o)) { sh = true; break; } if (!sh) continue;
        const A = vec(q[i * 2] / 5, q[i * 2 + 1] / 5), B = vec(q[j * 2] / 5, q[j * 2 + 1] / 5); pos.push(A[0] * R, A[1] * R, A[2] * R, B[0] * R, B[1] * R, B[2] * R); cid.push(ci, ci); } }));
      const g = new T.BufferGeometry(); g.setAttribute('position', new T.Float32BufferAttribute(pos, 3)); const pr = new Float32Array(cid.length); g.setAttribute('pr', new T.BufferAttribute(pr, 1));
      const BU = { op: { value: .22 } };
      const L = new T.LineSegments(g, new T.ShaderMaterial({ uniforms: BU, transparent: true, depthTest: false, depthWrite: false,
        vertexShader: 'attribute float pr; varying float vP; varying float vV; void main(){ vec4 wp = modelMatrix*vec4(position,1.); vV = smoothstep(1.02, 1.16, dot(normalize(wp.xyz), cameraPosition)); vP = pr; gl_Position = projectionMatrix*viewMatrix*wp; }',
        fragmentShader: 'uniform float op; varying float vP; varying float vV; void main(){ float d = step(1.5, vP); float p = clamp(vP, 0., 1.); vec3 c = mix(vec3(1.), vec3(1., .82, .5), p*.75); c = mix(c, vec3(1., .86, .56), d); float a = op*(1. + p*.7)*(1. + d*1.6); gl_FragColor = vec4(c, min(a, .85)*vV); }' }));
      L.renderOrder = 5; grp.add(L);
      AERO.bord = { BU, upd: () => { let m = {}; try { m = countryProg(); } catch (e) {} for (let i = 0; i < cid.length; i++) { const v = m[CC[cid[i]]]; pr[i] = v ? (v.done ? 2 : v.k / v.n) : 0; } g.attributes.pr.needsUpdate = true; } }; AERO.bord.upd(); }
    ready = true;
  }
  function resize() { const w = view.clientWidth, h = view.clientHeight; if (!w || (w === W && h === H)) return; W = w; H = h; D = Math.min(devicePixelRatio || 1, 2); renderer.setSize(W, H, false); cam.aspect = W / H; cam.updateProjectionMatrix(); pc.width = W * D; pc.height = H * D; const vh = FOV / 2 * Math.PI / 180, hh = Math.atan(Math.tan(vh) * W / H); zMax = 1.16 / Math.sin(Math.min(vh, hh)); if (!fitted && W > 50 && H > 50) { fitted = true; zoom = zT = zMax; } zT = Math.min(zT, zMax); }
  let fmC = null, fmK = ''; const found = () => { const pl = save.palette || [], k = pl.length + ':' + (pl[0] ? pl[0].n + pl[0].p : ''); if (fmC && k === fmK) return fmC; const m = {}; pl.forEach(p => m[p.n] = p); fmC = m; fmK = k; return m; };
  function frame(now) {
    if (!running) return; requestAnimationFrame(frame); if (document.hidden) { last = 0; return; }
    if (!drag && !pinch && !fly && !cin && !JOUR && Math.abs(vel[0]) + Math.abs(vel[1]) < .05 && Math.abs(zT - zoom) < .003 && last && now - last < 31) return;
    const dt = last ? Math.min(.05, (now - last) / 1000) : 0; last = now; resize(); if (now - sunT > 30000) placeSun();
    if (!drag && !pinch) { rotY += vel[0] * dt; rotX += vel[1] * dt; const dmp = Math.exp(-2.1 * dt); vel[0] *= dmp; vel[1] *= dmp; if (Math.abs(vel[0]) < .04 && performance.now() - lastTouch > 5000) rotY += (Math.PI * 2 / 120) * dt; }
    if (cin) { if (cin.t0 == null) cin.t0 = now; const k = Math.min(1, (now - cin.t0) / 2500), e = k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2; rotY = cin.ry0 + cin.dy * e; rotX = cin.rx0 + (cin.rx - cin.rx0) * e; vel = [0, 0]; zT = k < .55 ? zMax : Math.max(1.4, zMax - (zMax - 1.5) * ((k - .55) / .45)); if (k >= 1 && !cin.done) { cin.done = true; zT = 1.5; const cb = cin.cb; setTimeout(() => { cin = null; cb && cb(); }, 650); } }
    else if (fly) { const k = 1 - Math.exp(-(fly.k || 4) * dt); let d = fly.ry - rotY; d = Math.atan2(Math.sin(d), Math.cos(d)); rotY += d * k; rotX += (fly.rx - rotX) * k; vel = [0, 0]; if (Math.abs(d) < .002 && Math.abs(fly.rx - rotX) < .002) fly = null; }
    rotX = clamp(rotX, -1.25, 1.25); zoom += (zT - zoom) * (1 - Math.exp(-(zSlow ? 1.7 : 8) * dt));
    grp.rotation.set(rotX, rotY, 0, 'XYZ'); cam.position.set(0, 0, zoom); cam.lookAt(0, 0, 0); cam.updateMatrixWorld(); if (AERO.tick) AERO.tick((now / 1000) % 3600); if (AERO.key) { if (!AERO.sunL || now - AERO.sunT > 60000) { AERO.sunT = now; const d = new Date(), doy = Math.floor((d - new Date(d.getFullYear(), 0, 0)) / 864e5), dec = -23.44 * Math.cos(2 * Math.PI / 365 * (doy + 10)), utc = d.getUTCHours() + d.getUTCMinutes() / 60; let lng = (12 - utc) * 15; lng = ((lng + 540) % 360) - 180; AERO.sunL = new T.Vector3(...vec(dec, lng)); } const sw = AERO.sunL.clone().applyQuaternion(grp.quaternion); const cf = new T.Vector3(.35, .25, 1).normalize(); sw.lerp(cf, .12).normalize(); if (AERO.WU && AERO.WU.sunV) AERO.WU.sunV.value.copy(sw); AERO.key.position.copy(sw.clone().multiplyScalar(5)); } if (AERO.bord) AERO.bord.BU.op.value = .14 + .12 * clamp((3.1 - zoom) / 1.6, 0, 1); if (zoom < 2.1 && AERO.lo && !AERO.hi && !AERO.busy) { AERO.busy = 1; setTimeout(() => AERO.land(100, m => { AERO.hi = m; m.visible = false; grp.add(m); }), 60); } if (AERO.hi) { const fine = zoom < 2.2; AERO.hi.visible = fine; if (AERO.lo) AERO.lo.visible = !fine; } renderer.render(sc3, cam);
    // pins
    const cx = Math.cos(rotX), sx = Math.sin(rotX), cy = Math.cos(rotY), sy = Math.sin(rotY), fm = found(), lim = 1 / zoom;
    px.setTransform(D, 0, 0, D, 0, 0); px.clearRect(0, 0, W, H); sp = [];
    { const pl = save.palette || [], sig = pl.length + '|' + (pl[0] && pl[0].n + pl[0].p); if (sig !== gSig) { gSig = sig; try { GOLD = doneSet(); } catch (e) {} try { AERO.bord && AERO.bord.upd(); } catch (e) {} }
      { if (LSig !== gSig) { LSig = gSig; LCOL = {}; LTIER = {}; try { const CP = countryProg(); for (const cc in CP) LTIER[cc] = medalOf(CP[cc]); } catch (e) {} const acc = {}; (save.palette || []).forEach(p => { if (!p.h || (p.p || 0) < 50) return; const r = atlasOf(p.n); const cc = r && r[6]; if (!cc) return; const v = [1, 3, 5].map(i => parseInt(p.h.substr(i, 2), 16)); const a = acc[cc] || (acc[cc] = [0, 0, 0, 0]); a[0] += v[0]; a[1] += v[1]; a[2] += v[2]; a[3]++; }); for (const cc in acc) { const a = acc[cc]; LCOL[cc] = `rgb(${Math.round(a[0] / a[3])},${Math.round(a[1] / a[3])},${Math.round(a[2] / a[3])})`; } }
        const f0 = 1 / Math.tan(FOV / 2 * Math.PI / 180), hr = Math.sqrt(Math.max(0, 1 - lim * lim)); px.save(); px.lineJoin = 'round';
        for (const cc in LCOL) { const RR = ovOf(cc); for (const ring of RR) { const n = ring.length / 3; let vis = 0; px.beginPath(); for (let i = 0; i < n; i++) { const x0 = ring[i * 3], y0 = ring[i * 3 + 1], z0 = ring[i * 3 + 2]; let x1 = x0 * cy + z0 * sy; const z1 = -x0 * sy + z0 * cy; let y2 = y0 * cx - z1 * sx, z2 = y0 * sx + z1 * cx; if (z2 < lim) { const l = Math.hypot(x1, y2) || 1; x1 = x1 / l * hr; y2 = y2 / l * hr; z2 = lim; } else vis++; const dz = zoom - z2, X = W / 2 + x1 * f0 / dz * H / 2, Y = H / 2 - y2 * f0 / dz * H / 2; i ? px.lineTo(X, Y) : px.moveTo(X, Y); } if (vis < n * .8) continue; px.closePath(); px.globalCompositeOperation = 'source-over'; px.globalAlpha = .38 + .2 * LENS; px.fillStyle = LCOL[cc]; px.fill(); const md = LTIER[cc] || 0; if (md === 1 || md === 2) { const mc = md === 1 ? ['#e2a46a', '#ffd2a6'] : ['#cfd9e6', '#ffffff'], sh = .55 + .45 * Math.sin(now / 900 + cc.charCodeAt(0)); px.globalCompositeOperation = 'lighter'; px.globalAlpha = .2 + .1 * sh; px.lineWidth = 5; px.strokeStyle = mc[0]; px.stroke(); px.globalAlpha = .75 + .2 * sh; px.lineWidth = 1.4; px.strokeStyle = mc[1]; px.stroke(); } } } px.restore(); }
      if (GOLD.size) { const f0 = 1 / Math.tan(FOV / 2 * Math.PI / 180), hr = Math.sqrt(Math.max(0, 1 - lim * lim)); px.save(); px.globalCompositeOperation = 'lighter'; px.lineJoin = 'round';
        for (const cc of GOLD) { const a = GA[cc] || (GA[cc] = { v: 1 }); if (a.t0) { const k = clamp((now - a.t0) / 1200, 0, 1); a.v = k * k * (3 - 2 * k); if (k >= 1) a.t0 = 0; } if (a.v <= .001) continue;
          const RR = ovOf(cc); if (!RR.length) { const c = cpool(cc); if (c) { const [x0, y0, z0] = c.v, x1 = x0 * cy + z0 * sy, z1 = -x0 * sy + z0 * cy, y2 = y0 * cx - z1 * sx, z2 = y0 * sx + z1 * cx; if (z2 > lim + .02) { const dz = zoom - z2, X = W / 2 + x1 * f0 / dz * H / 2, Y = H / 2 - y2 * f0 / dz * H / 2, rr = Math.max(10, c.r * f0 / dz * H / 2 * 1.4), g = px.createRadialGradient(X, Y, 0, X, Y, rr); g.addColorStop(0, `rgba(255,216,154,${.32 * a.v})`); g.addColorStop(.55, `rgba(255,200,120,${.12 * a.v})`); g.addColorStop(1, 'rgba(255,200,120,0)'); px.globalAlpha = 1; px.fillStyle = g; px.beginPath(); px.arc(X, Y, rr, 0, 7); px.fill(); } } continue; }
          for (const ring of RR) { const n = ring.length / 3; let vis = 0; px.beginPath();
            for (let i = 0; i < n; i++) { const x0 = ring[i * 3], y0 = ring[i * 3 + 1], z0 = ring[i * 3 + 2]; let x1 = x0 * cy + z0 * sy; const z1 = -x0 * sy + z0 * cy; let y2 = y0 * cx - z1 * sx, z2 = y0 * sx + z1 * cx;
              if (z2 < lim) { const l = Math.hypot(x1, y2) || 1; x1 = x1 / l * hr; y2 = y2 / l * hr; z2 = lim; } else vis++; const dz = zoom - z2, X = W / 2 + x1 * f0 / dz * H / 2, Y = H / 2 - y2 * f0 / dz * H / 2; i ? px.lineTo(X, Y) : px.moveTo(X, Y); }
            if (vis < n * .8) continue; px.closePath(); px.globalCompositeOperation = 'source-over'; px.globalAlpha = .22 * a.v; px.fillStyle = '#ffc04a'; px.fill(); px.globalCompositeOperation = 'lighter'; px.globalAlpha = .18 * a.v; px.lineWidth = 5; px.strokeStyle = '#ffcf80'; px.stroke(); px.globalAlpha = Math.min(1, .8 * a.v + (a.t0 ? Math.sin(a.v * Math.PI) * .7 : 0)); px.lineWidth = 1.4; px.strokeStyle = '#ffe2a0'; px.stroke(); } }
        px.restore(); px.globalAlpha = 1; } }
    const f = 1 / Math.tan(FOV / 2 * Math.PI / 180);
    ATLAS_DATA.forEach((r, i) => {
      const [x0, y0, z0] = PV[i], x1 = x0 * cy + z0 * sy, z1 = -x0 * sy + z0 * cy, y2 = y0 * cx - z1 * sx, z2 = y0 * sx + z1 * cx;
      if (z2 < lim + .02) return; const vis = clamp((z2 - lim) * 7, 0, 1), dz = zoom - z2, X = W / 2 + x1 * f / dz * H / 2, Y = H / 2 - y2 * f / dz * H / 2;
      sp.push({ i, X, Y, vis, m: fm[r[0]] });
    });
    SPR += ((zoom < zMax * .6 ? 1 : 0) - SPR) * (1 - Math.exp(-dt / .1));
    if (SPR < .04) { const keep = [], seen = new Map(); for (const q of sp) { const g = GI[q.i]; if (g.n < 2) { keep.push(q); continue; } const pv = seen.get(g.key); if (!pv) { q.cnt = g.n; q._k = keep.length; seen.set(g.key, q); keep.push(q); } else { if (q.m) pv.mf = 1; if (q.m && !pv.m) { q.cnt = g.n; q.mf = 1; q._k = pv._k; keep[pv._k] = q; seen.set(g.key, q); } } } sp = keep; }
    else for (const q of sp) { const g = GI[q.i]; if (g.n > 1) { const a = -Math.PI / 2 + g.k / g.n * Math.PI * 2; q.X += Math.cos(a) * 13 * SPR; q.Y += Math.sin(a) * 13 * SPR; } }
    BEAM = (BEAM + dt * .55) % 1e6; jT += (JOUR ? 1 : 0) - jT > 0 ? Math.min(1, dt * 2.2) * (1 - jT) : -Math.min(jT, dt * 3);
    if (jT > .01) { const pl = save.palette || [], sig = pl.length + '|' + (pl[0] && pl[0].n); if (sig !== jSig) { jSig = sig; const idx = new Map(ATLAS_DATA.map((r, i) => [r[0], i])); jOrder = pl.map((p, k) => [p, k]).filter(([p]) => idx.has(p.n)).sort((a, b) => ((a[0].d || 0) - (b[0].d || 0)) || (b[1] - a[1])).map(([p]) => ({ i: idx.get(p.n), h: p.h })); }
      const O = jOrder || [], NS = 18, prj = v => { const x1 = v[0] * cy + v[2] * sy, z1 = -v[0] * sy + v[2] * cy, y2 = v[1] * cx - z1 * sx, z2 = v[1] * sx + z1 * cx, dz = zoom - z2; return [W / 2 + x1 * f / dz * H / 2, H / 2 - y2 * f / dz * H / 2, z2]; };
      const segs = Math.max(0, O.length - 1), sd = clamp(14 / Math.max(1, segs), .1, .55), jp = jStart ? (now - jStart) / 1000 / sd : segs, full = Math.min(segs, Math.floor(jp)), part = jp < segs ? jp - full : 0, shown = Math.min(segs, full + (part > 0 ? 1 : 0)), playing = jp < segs;
      if (playing && O[full + 1] && jFollow !== full) { jFollow = full; const v = PV[O[full + 1].i]; fly = { rx: Math.atan2(v[1], Math.hypot(v[0], v[2])), ry: Math.atan2(-v[0], v[2]), k: 1.6 }; }
      px.save(); px.lineCap = 'round'; px.globalCompositeOperation = 'lighter';
      for (let k = 0; k < shown; k++) { const a = PV[O[k].i], b = PV[O[k + 1].i], dot = clamp(a[0] * b[0] + a[1] * b[1] + a[2] * b[2], -1, 1), om = Math.acos(dot); if (om < 1e-3) continue; const so = Math.sin(om), lift = .012 + .07 * om / Math.PI, pts = [];
        const tEnd = playing && k === full ? part : 1; for (let j = 0; j <= NS; j++) { const t = j / NS * tEnd, w1 = Math.sin((1 - t) * om) / so, w2 = Math.sin(t * om) / so, r = 1 + lift * Math.sin(Math.PI * t); pts.push(prj([(a[0] * w1 + b[0] * w2) * r, (a[1] * w1 + b[1] * w2) * r, (a[2] * w1 + b[2] * w2) * r])); }
        const g = px.createLinearGradient(pts[0][0], pts[0][1], pts[NS][0], pts[NS][1]); g.addColorStop(0, O[k].h); g.addColorStop(1, O[k + 1].h); px.strokeStyle = g;
        for (const [lw, al] of [[2.6, .14], [1.15, .95]]) { px.lineWidth = lw; px.globalAlpha = al * jT; px.beginPath(); let pen = false; for (const q of pts) { if (q[2] > lim - .015) { pen ? px.lineTo(q[0], q[1]) : px.moveTo(q[0], q[1]); pen = true; } else pen = false; } px.stroke(); }
        if (playing ? k === full : k === Math.floor(BEAM) % Math.max(1, shown)) { const fr = playing ? part : BEAM % 1, t0 = Math.max(0, fr - .42), m = 26; let prev = null; for (let j = 0; j <= m; j++) { const t = t0 + (fr - t0) * j / m, w1 = Math.sin((1 - t) * om) / so, w2 = Math.sin(t * om) / so, r = 1 + lift * Math.sin(Math.PI * t), q = prj([(a[0] * w1 + b[0] * w2) * r, (a[1] * w1 + b[1] * w2) * r, (a[2] * w1 + b[2] * w2) * r]); if (prev && q[2] > lim - .015 && prev[2] > lim - .015) { const e = j / m; px.globalAlpha = jT * e * e; px.strokeStyle = '#fff'; px.lineWidth = .8 + 2.4 * e; px.beginPath(); px.moveTo(prev[0], prev[1]); px.lineTo(q[0], q[1]); px.stroke(); if (j === m) { const hg = px.createRadialGradient(q[0], q[1], 0, q[0], q[1], 9); hg.addColorStop(0, 'rgba(255,255,255,.95)'); hg.addColorStop(1, 'rgba(180,230,255,0)'); px.fillStyle = hg; px.globalAlpha = jT; px.beginPath(); px.arc(q[0], q[1], 9, 0, Math.PI * 2); px.fill(); } } prev = q; } } }
      px.restore(); px.globalAlpha = 1; }
    const pulse = .85 + .15 * Math.sin(now / 600);
    { px.fillStyle = 'rgba(40,60,80,.55)'; for (const [lo, hi, al] of [[0, .5, .2], [.5, 1.01, .5]]) { px.globalAlpha = al; px.beginPath(); for (const q of sp) if (!q.m && q.vis >= lo && q.vis < hi) { px.moveTo(q.X + 1.1, q.Y); px.arc(q.X, q.Y, 1.1, 0, Math.PI * 2); } px.fill(); } px.globalAlpha = 1; }
    for (const q of sp.filter(q => q.m).sort((a, b) => a.Y - b.Y)) {
      if (!q.m) continue;
      if (q.m) { const c = q.m.h, spr = pinSprite(c), ps = clamp(1.25 / (zoom - .78), .62, 1.5); let dy = 0, sq = 1; const isNew = glowName && ATLAS_DATA[q.i][0] === glowName; if (isNew) { const e = (now - glowT) / 1000; if (e < 0) continue; if (e < .55) { const k = e / .55; dy = -70 * (1 - k * k); } else if (e < 1.1) { const k = (e - .55) / .55; dy = -6 * Math.sin(k * Math.PI) * (1 - k); sq = 1 + .25 * Math.sin(Math.min(1, k * 3) * Math.PI) * (1 - k); if (!q._hit) { q._hit = 1; if (!PINHIT.has(glowName)) { PINHIT.add(glowName); try { haptic([14, 20, 8]); plip(.7); } catch (x) {} } } }
          if (e > .5 && e < 1.6) { const k = (e - .5) / 1.1; px.globalAlpha = (1 - k) * .9; px.strokeStyle = c; px.lineWidth = 1.6; px.beginPath(); px.ellipse(q.X, q.Y, 4 + k * 22, (4 + k * 22) * .45, 0, 0, Math.PI * 2); px.stroke(); } }
        { const Y = q.Y + dy, R = 5.2 * ps * sq, fl = .55 + .45 * q.vis; px.globalAlpha = q.vis;
          px.globalCompositeOperation = 'lighter'; const gg = px.createRadialGradient(q.X, Y, 0, q.X, Y, R * 2.6); gg.addColorStop(0, c + '88'); gg.addColorStop(.45, c + '33'); gg.addColorStop(1, c + '00'); px.fillStyle = gg; px.beginPath(); px.ellipse(q.X, Y, R * 2.6, R * 2.6 * fl, 0, 0, Math.PI * 2); px.fill(); px.globalCompositeOperation = 'source-over';
          px.lineWidth = 1.1 * ps; px.strokeStyle = 'rgba(8,20,30,.45)'; px.beginPath(); px.ellipse(q.X, Y, R + .9, (R + .9) * fl, 0, 0, Math.PI * 2); px.stroke(); px.strokeStyle = c; px.lineWidth = 1.2 * ps; px.beginPath(); px.ellipse(q.X, Y, R, R * fl, 0, 0, Math.PI * 2); px.stroke();
          px.fillStyle = 'rgba(8,20,30,.5)'; px.beginPath(); px.arc(q.X, Y, 2.5 * ps, 0, Math.PI * 2); px.fill(); px.fillStyle = c; px.beginPath(); px.arc(q.X, Y, 2.1 * ps, 0, Math.PI * 2); px.fill(); px.fillStyle = 'rgba(255,255,255,.9)'; px.beginPath(); px.arc(q.X - .5 * ps, Y - .5 * ps, .8 * ps, 0, Math.PI * 2); px.fill(); } }
    }
    { px.font = '600 9px ' + (getComputedStyle(document.body).fontFamily || 'system-ui'); px.textAlign = 'left'; px.textBaseline = 'middle'; if (zoom < zMax * .8) for (const q of sp) if (q.cnt > 1 && q.vis > .3) { px.globalAlpha = q.vis * .55; px.fillStyle = '#e6edf5'; px.textAlign = 'center'; px.fillText(q.cnt, q.X + 6, q.Y - 5); } px.globalAlpha = 1; }
    if (glowName) { const q = sp.find(q => ATLAS_DATA[q.i][0] === glowName); const e = (now - glowT) / 1000; if (q && e >= 0 && e < 6) { for (let k = 0; k < 2; k++) { const ph = ((e + k * .6) % 1.2) / 1.2; px.globalAlpha = (1 - ph) * .9; px.beginPath(); px.arc(q.X, q.Y, 6 + ph * 26, 0, Math.PI * 2); px.lineWidth = 1.5; px.strokeStyle = q.m ? q.m.h : '#fff'; px.stroke(); } } }
    px.globalAlpha = 1;
  }
  function showCard(q) {
    const r = ATLAS_DATA[q.i];
    if (!q.m) card.innerHTML = `${placeBadge(r, 'abig')}<div class="await">something waits in ${r[3]}</div>`;
    else { const k = STARS(q.m.p || 0); card.innerHTML = `<div class="acrow"><div class="asw" style="background:${q.m.h};--g:${q.m.h}"></div><div style="min-width:0;flex:1"><div class="anm"${wAttr(r[0])}>${r[0]}</div><div class="apl"><i>${r[4] ? 'origin' : 'found in'}</i>${placeBadge(r, 'aflag')}${placeText(r)}</div></div><div class="apc">${fmtP(q.m.p)}%<s>${starStr(k)}</s></div></div><div class="aln">${r[5]}</div><div class="abtns"><button class="abtn lq" data-pc="${r[0]}">postcard</button><button class="abtn primary" data-rp="${r[0]}">${k >= 3 ? 'replay' : 'replay for ★'}</button></div>`; }
    card.hidden = false; card.style.animation = 'none'; void card.offsetWidth; card.style.animation = ''; tick(); buzz(5);
  }
  card.addEventListener('click', e => { const pcb = e.target.closest('[data-pc]'), rpb = e.target.closest('[data-rp]'); if (pcb) { const n = pcb.dataset.pc; buzz(5); const pos = () => { const q = sp.find(q => ATLAS_DATA[q.i][0] === n), rc = view.getBoundingClientRect(); return q ? { x: rc.left + q.X, y: rc.top + q.Y } : null; }; card.hidden = true; STORY.openName(n, pos); } else if (rpb) { buzz(8); card.hidden = true; startReplay(rpb.dataset.rp); } });
  { const jb = $('jBtn'); const sync = () => { jb.classList.toggle('on', JOUR); }; sync(); jb.addEventListener('click', e => { e.stopPropagation(); JOUR = !JOUR; save.jline = JOUR; persist(); sync(); buzz(JOUR ? [6, 30, 6] : 5); if (JOUR) { zT = zMax * .82; vel = [0, 0]; jStart = performance.now(); jFollow = -1; } else fly = null; }); }
  view.addEventListener('pointerdown', e => {
    lastTouch = performance.now(); if (cin || cine) return;
    if (card.contains(e.target)) return; view.setPointerCapture(e.pointerId); ptrs.set(e.pointerId, [e.clientX, e.clientY]);
    if (ptrs.size === 1) { drag = { x: e.clientX, y: e.clientY, t: performance.now() }; moved = 0; vel = [0, 0]; }
    if (ptrs.size === 2) { const [a, b] = [...ptrs.values()]; pinch = { d: Math.hypot(a[0] - b[0], a[1] - b[1]), z: zT }; drag = null; }
  });
  view.addEventListener('pointermove', e => {
    if (!ptrs.has(e.pointerId)) return; ptrs.set(e.pointerId, [e.clientX, e.clientY]);
    if (pinch && ptrs.size >= 2) { const [a, b] = [...ptrs.values()]; zT = clamp(pinch.z * pinch.d / Math.max(10, Math.hypot(a[0] - b[0], a[1] - b[1])), 1.35, zMax); moved = 99; return; }
    if (drag) { const now = performance.now(), dx = e.clientX - drag.x, dy = e.clientY - drag.y, k = .0042 * (zoom - .95) / 2.1, ddt = Math.max(.008, (now - drag.t) / 1000); rotY += dx * k; rotX += dy * k; vel = [lerp(vel[0], dx * k / ddt, .5), lerp(vel[1], dy * k / ddt, .5)]; moved += Math.abs(dx) + Math.abs(dy); drag = { x: e.clientX, y: e.clientY, t: now }; }
  });
  const up = e => {
    lastTouch = performance.now();
    if (!ptrs.has(e.pointerId)) return; ptrs.delete(e.pointerId);
    if (ptrs.size < 2) pinch = null;
    if (ptrs.size === 0 && drag) {
      if (performance.now() - drag.t > 90) vel = [0, 0];
      if (moved < 6) {
        const r = view.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top; let best = null, bd = 20;
        for (const q of sp) { const d = Math.hypot(q.X - x, q.Y - y) * (q.m ? 1 : 1.6); if (d < bd) { bd = d; best = q; } }
        const now = performance.now();
        if (best && best.m) { const n = ATLAS_DATA[best.i][0]; ATLAS.flyTo(n, true); STORY.prep(n); showCard(best); } else if (best) showCard(best); else { if (!card.hidden) card.hidden = true; else if (now - lastTap < 320) zT = Math.max(1.35, zT * .62); lastTap = now; }
      }
      drag = null;
    }
  };
  view.addEventListener('pointerup', up); view.addEventListener('pointercancel', up);
  view.addEventListener('wheel', e => { e.preventDefault(); lastTouch = performance.now(); zT = clamp(zT * Math.exp(e.deltaY * .0012), 1.35, zMax); }, { passive: false });
  return {
    zoomOut(cb) { fly = null; vel = [0, 0]; zSlow = true; zT = zMax; glowName = null; setTimeout(() => { zSlow = false; cb && cb(); }, 1700); },
    pins() { return sp; }, open() { try { HOMEBG.ensure(); HOMEBG.host(view); if (!view._bgT) { view._bgT = 1; const mv = e => { try { HOMEBG.touchPx(e.clientX, e.clientY); } catch (x) {} }, up = () => { try { HOMEBG.release(); } catch (x) {} }; view.addEventListener('pointerdown', mv, { passive: true }); view.addEventListener('pointermove', e => { if (e.buttons || e.pointerType === 'touch') mv(e); }, { passive: true }); view.addEventListener('pointerup', up, { passive: true }); view.addEventListener('pointercancel', up, { passive: true }); } } catch (e) {} W = 0; if (!cin) { fitted = false; fly = null; vel = [0, 0]; rotX = .4; if (JOUR) { jStart = performance.now() + 600; jFollow = -1; } } const fm = found(); $('aCount').textContent = `${ALLN.filter(n => fm[n]).length} / ${ALLN.length} found`; card.hidden = true; if (running) return; running = true; last = 0; loadThree(() => { if (!ready) init(); W = 0; resize(); requestAnimationFrame(frame); }); },
    toggleLens() { LENS = LENS ? 0 : 1; LSig = ''; return LENS; }, close() { running = false; card.hidden = true; try { HOMEBG.release(); HOMEBG.host($('home')); } catch (e) {} },
    country(cc) { try { GOLD = doneSet(); gSig = ''; } catch (e) {} const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches; GA[cc] = { v: 0, t0: performance.now() + (reduce ? 300 : 1100) }; let s = [0, 0, 0]; ATLAS_DATA.forEach((r, i) => { if (r[6] === cc) { s[0] += PV[i][0]; s[1] += PV[i][1]; s[2] += PV[i][2]; } }); const l = Math.hypot(...s); if (!l) return; const [x0, y0, z0] = s.map(v => v / l), ry = Math.atan2(-x0, z0), rx = Math.atan2(y0, Math.hypot(x0, z0)); glowName = null; if (reduce) { rotX = rx; rotY = ry; fly = null; } else { fly = { rx, ry, k: 2.2 }; zT = Math.max(1.6, zMax * .72); } },
    cinematic(n, cb) { const i = ATLAS_DATA.findIndex(r => r[0] === n); if (i < 0) { cb(); return; } { const t0 = performance.now(), chk = () => { if (!cin || cin.cb !== cb) return; if (cin.done) return; if ((!ready && performance.now() - t0 > 2500) || performance.now() - t0 > 7000) { cin = null; cb(); } else setTimeout(chk, 500); }; setTimeout(chk, 500); } const [x0, y0, z0] = PV[i], ry = Math.atan2(-x0, z0), rx = Math.atan2(y0, Math.hypot(x0, z0)); let dy = ry - rotY; dy = Math.atan2(Math.sin(dy), Math.cos(dy)); if (Math.abs(dy) < 1.2) dy += dy >= 0 ? Math.PI * 2 * 0 + 1.6 : -1.6; cin = { ry0: rotY - (Math.abs(ry - rotY) < 1.2 ? 1.6 * Math.sign(dy || 1) : 0), rx0: rotX, rx, dy: 0, cb, t0: null }; { let d2 = ry - cin.ry0; d2 = Math.atan2(Math.sin(d2), Math.cos(d2)); cin.dy = d2; } fly = null; zoom = zT = zMax; glowName = n; glowT = performance.now() + 2500; },
    flyTo(n, fast) { const i = ATLAS_DATA.findIndex(r => r[0] === n); if (i < 0) return; const [x0, y0, z0] = PV[i], ry = Math.atan2(-x0, z0), z1 = Math.hypot(x0, z0), rx = Math.atan2(y0, z1); fly = { rx, ry, k: fast ? 10 : 4 }; if (!fast) zT = Math.max(1.35, zMax * .58); glowName = n; glowT = performance.now(); },
  };
})();

/* ================= Boot ================= */
function start() {
  $('coinVal').textContent = save.coins;
  beads[0].classList.add('sel'); layoutDial(); requestAnimationFrame(layoutDial);
  computeLayout();
  try { initGL(); fluidOK = true; initFBOs(); }
  catch (e) {
    fluidOK = false; fluidC.style.display = 'none';
    const n = document.createElement('div'); n.className = 'nogl'; n.textContent = 'Your browser is showing the simple version (no WebGL 2).'; scene.appendChild(n);
  }
  $('home').hidden = false; showHome();
  { const h = $('home'); let lp = null; h.addEventListener('pointerdown', e => { if (e.target.closest('button') || e.target.closest('.dnaorb')) return; lp = [e.clientX, e.clientY]; });
    h.addEventListener('pointermove', e => { if (!lp || e.target.closest('button')) return; const r = h.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = 1 - (e.clientY - r.top) / r.height; HOMEBG.touch(x, y); lp = [e.clientX, e.clientY]; });
    ['pointerup', 'pointercancel', 'pointerleave'].forEach(ev => h.addEventListener(ev, () => { lp = null; HOMEBG.release(); })); }
  if (window.__askAcct && !SB.signedIn()) setTimeout(() => { try { openAccountSheet(false, 'import'); } catch (e) {} }, 2600);
  if (!save.idn && !save.idSkip) { const bc = $('bootc'); if (bc) { bc.style.transition = 'opacity .6s'; bc.style.opacity = '0'; bc.style.pointerEvents = 'none'; setTimeout(() => { bc.style.display = 'none'; }, 650); } $('intro').hidden = true; openWelcome(); } else runIntro(() => {});
  { let hidAt = 0; const cover = () => { const bc = $('bootc'); if (!bc) return; bc.style.transition = 'none'; bc.style.display = ''; bc.style.opacity = '1'; bc.style.pointerEvents = 'all'; };
    const back = () => { const away = hidAt ? Date.now() - hidAt : 0; hidAt = 0; const bc = $('bootc');
      if (false) {}
      else if (bc) { bc.style.transition = 'opacity .35s'; requestAnimationFrame(() => { bc.style.opacity = '0'; bc.style.pointerEvents = 'none'; setTimeout(() => { if (bc.style.opacity === '0') bc.style.display = 'none'; }, 380); }); } };
    document.addEventListener('visibilitychange', () => { if (document.hidden) { hidAt = Date.now(); try { if (state === 'play' && glassLog.length) saveGlass(); persist(); SB.push(true); } catch (e) {} cover(); } else back(); });
    addEventListener('pagehide', () => { hidAt = Date.now(); try { persist(); SB.push(true); } catch (e) {} cover(); });
    addEventListener('pageshow', e => { if (e.persisted) { if (!hidAt) hidAt = Date.now() - 16000; back(); } }); }
  $('hPlay').addEventListener('click', () => { audio(); $('hPlay').classList.remove('nudge'); if (ONB.newPlayer() && !save.tutDone) setTimeout(() => { if (state === 'play' && !TUT.on()) TUT.start(); }, 1700); hideHome(); setNav('play'); if (MODE !== 'level') { REPLAY = null; if (state === 'play' && glassLog.length) saveGlass(); resetGlass(); MODE = 'level'; started = false; } if (!started) { started = true; setTarget(); updateStat(); cbLine(); } });
  $('homeBtn').addEventListener('click', () => goTab('home'));
  document.querySelectorAll('#nav button').forEach(b => b.addEventListener('click', () => goTab(b.dataset.t)));
  setNav('home');
  $('hYou').addEventListener('click', () => goTab('you'));
  $('hDaily').addEventListener('click', e => { const day = dayNo(); if (save.daily && save.daily.d === day) return; audio(); if (state === 'play' && glassLog.length) saveGlass(); resetGlass(); MODE = 'daily'; started = false; hideHome(); setNav('play'); setTarget(); updateStat(); cbLine(); setTimeout(() => DRIP.say('daily'), 1200); });
  new ResizeObserver(() => { computeLayout(); }).observe(scene);
  requestAnimationFrame(t => { last = t; frame(t); });
}
function migrateChroma(o) { const sv = o || save; if (!sv || sv.chv) return; const A = [0, 900, 1050, 1200, 1350, 1500, 1650, 1800, 2100], B = [0, 15, 30, 45, 58, 70, 81, 90, 100], m = v => { if (v == null) return v; v = +v; if (v <= 0) return 0; for (let i = 1; i < A.length; i++) if (v <= A[i]) return Math.round((B[i - 1] + (B[i] - B[i - 1]) * (v - A[i - 1]) / (A[i] - A[i - 1])) * 10) / 10; return 100; }; if (sv.eye != null) sv.eye = m(sv.eye); if (sv.eyeBest != null) sv.eyeBest = m(sv.eyeBest); if (sv.eyeHist) sv.eyeHist = sv.eyeHist.map(m); if (sv.eyeAll) sv.eyeAll = sv.eyeAll.map(m); sv.chv = 1; if (!o) persist(); }
function capChroma() { if ((save.chv || 0) < 3) { save.chRaw = save.chRaw ?? save.eye ?? 20; const P = chParts(); save.eye = P.v > 100 ? 100 : Math.round(P.v * 10) / 10; save.wr = P.v > 100 ? Math.round((P.v - 100) * 50) : 0; save.eyeBest = save.eye; save.eyeHist = []; save.eyeAll = []; save.chv = 3; persist(); } return; if ((save.chv || 0) >= 2) return; save.chRaw = save.chRaw ?? save.eye; const c = chCap(); if (save.eye != null && save.eye > c) save.eye = c < 100 ? c - .1 : c; if (save.eyeBest != null) save.eyeBest = Math.min(save.eyeBest, Math.max(save.eye ?? 0, c < 100 ? c - .1 : c)); save.chv = 2; persist(); }
function boot() { try { migrateChroma(); capChroma(); recount50(); try { checkBadges(-1); } catch (e) {} start(); setEyeTop((save.eye ?? CH0)); } catch (e) { $('intro').hidden = true; $('home').hidden = false; throw e; } }
{ let done = false; const go = () => { if (!done) { done = true; BOOTED = true; try { SB.boot(); } catch (e) {}; boot(); } }; setTimeout(go, hadLocal ? 1500 : 2500); cloudReady.then(go, go);
  cloudReady.then(() => { if (CLOUD.late) { CLOUD.late = false; try { if (state === 'play' && !drops && !$('home').hidden) setTarget(); showHome(); persist(); } catch (e) {} } }); }
addEventListener('pagehide', () => { if (state === 'play' && glassLog.length) saveGlass(); persist(); cloudPush(true); }); document.addEventListener('visibilitychange', () => { if (document.hidden) { if (state === 'play' && glassLog.length) saveGlass(); persist(); cloudPush(true); } });
/* ================= Base Set cards: packs, opening, collection (shadow DOM, isolated styles) ================= */