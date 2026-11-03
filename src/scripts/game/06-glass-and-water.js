function drawBG() {
  const c = bgx; c.setTransform(DPR, 0, 0, DPR, 0, 0);
  const light = !!LIGHT_BG[save.bg];
  const paper = getComputedStyle(document.documentElement).getPropertyValue('--paper').trim() || '#000';
  c.fillStyle = paper; c.fillRect(0, 0, SW, SH);
  if (0) { const gg = c.createLinearGradient(0, 0, 0, SH); gg.addColorStop(0, paper); gg.addColorStop(1, save.bg === 'sunset' ? '#C2410C' : '#0C1B4D'); c.fillStyle = gg; c.fillRect(0, 0, SW, SH); }
  if (save.bg === 'marble') { for (let i = 0; i < 14; i++) { c.strokeStyle = 'rgba(0,0,0,0.05)'; c.lineWidth = 1 + (i % 3); c.beginPath(); c.moveTo(-20, i * SH / 12 + 10); c.bezierCurveTo(SW * 0.3, i * SH / 12 + 60 * Math.sin(i), SW * 0.6, i * SH / 12 - 50 * Math.cos(i * 1.3), SW + 20, i * SH / 12 + 30); c.stroke(); } }
  if (save.bg === 'wood') { for (let x = 0; x < SW; x += 3) { c.fillStyle = `rgba(0,0,0,${0.05 + 0.07 * Math.abs(Math.sin(x * 0.11) * Math.sin(x * 0.023))})`; c.fillRect(x, 0, 3, SH); } }
  if (light) {
    const v = c.createRadialGradient(G.cx, G.top + G.gh * 0.45, G.gw * 0.3, G.cx, G.top + G.gh * 0.45, Math.max(SW, SH) * 0.8);
    v.addColorStop(0, 'rgba(255,255,255,0.55)'); v.addColorStop(1, 'rgba(255,255,255,0)');
    c.fillStyle = v; c.fillRect(0, 0, SW, SH);
  } else {
    const v = c.createRadialGradient(G.cx, G.top + G.gh * 0.5, 0, G.cx, G.top + G.gh * 0.5, G.gw * 1.4);
    v.addColorStop(0, 'rgba(255,255,255,0.10)'); v.addColorStop(1, 'rgba(255,255,255,0)');
    c.fillStyle = v; c.fillRect(0, 0, SW, SH);
    { const dr = (getComputedStyle(document.documentElement).getPropertyValue('--dna-rgb') || '142,151,163').trim(), dg = c.createRadialGradient(G.cx, -SH * .05, 0, G.cx, -SH * .05, SH * .7); dg.addColorStop(0, `rgba(${dr},.10)`); dg.addColorStop(1, `rgba(${dr},0)`); c.fillStyle = dg; c.fillRect(0, 0, SW, SH); const dg2 = c.createRadialGradient(G.cx, SH * 1.05, 0, G.cx, SH * 1.05, SH * .5); dg2.addColorStop(0, `rgba(${dr},.06)`); dg2.addColorStop(1, `rgba(${dr},0)`); c.fillStyle = dg2; c.fillRect(0, 0, SW, SH); }
    // lightbox panel behind the glass
    { const pw = G.gw * 1.26, ph = G.gh * 1.18, px = G.cx - pw / 2, py = G.top - G.gh * .1, o = document.createElement('canvas'); o.width = Math.ceil(SW * DPR); o.height = Math.ceil(SH * DPR); const k = o.getContext('2d'); k.setTransform(DPR, 0, 0, DPR, 0, 0);
      const rr = (x, y, w, h, r) => { k.beginPath(); k.moveTo(x + r, y); k.arcTo(x + w, y, x + w, y + h, r); k.arcTo(x + w, y + h, x, y + h, r); k.arcTo(x, y + h, x, y, r); k.arcTo(x, y, x + w, y, r); k.closePath(); };
      for (let i = 0; i < 10; i++) { const e = (10 - i) * G.gw * .022; rr(px - e, py - e, pw + e * 2, ph + e * 2, G.gw * .2 + e); k.fillStyle = 'rgba(255,255,255,.022)'; k.fill(); }
      k.globalCompositeOperation = 'destination-in'; const fg = k.createLinearGradient(0, py - G.gh * .1, 0, py + ph + G.gh * .1); fg.addColorStop(0, 'rgba(0,0,0,0)'); fg.addColorStop(.25, 'rgba(0,0,0,1)'); fg.addColorStop(.75, 'rgba(0,0,0,1)'); fg.addColorStop(1, 'rgba(0,0,0,0)'); k.fillStyle = fg; k.fillRect(0, 0, SW, SH);
      c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.drawImage(o, 0, 0); c.restore(); }
  }
  const off = document.createElement('canvas'); off.width = Math.round(SW * DPR); off.height = Math.round(SH * DPR); const oc = off.getContext('2d'); oc.setTransform(DPR, 0, 0, DPR, 0, 0);
  if (0) { const ty = G.bottom + G.ry * .55, fw = G.gw * .95, bw = G.gw * .78, dy = G.ry * 1.6, ly = Math.min(SH - 2, ty + dy + G.gh * .22);
    oc.save(); oc.lineWidth = 1; oc.strokeStyle = 'rgba(255,255,255,.14)';
    oc.beginPath(); oc.moveTo(G.cx - bw, ty - dy * .35); oc.lineTo(G.cx + bw, ty - dy * .35); oc.lineTo(G.cx + fw, ty + dy * .65); oc.lineTo(G.cx - fw, ty + dy * .65); oc.closePath(); oc.stroke();
    oc.beginPath(); oc.moveTo(G.cx - fw, ty + dy * .65); oc.lineTo(G.cx - fw, ty + dy * .65 + 4); oc.lineTo(G.cx + fw, ty + dy * .65 + 4); oc.lineTo(G.cx + fw, ty + dy * .65); oc.stroke();
    oc.strokeStyle = 'rgba(255,255,255,.11)'; for (const sx of [-1, 1]) { oc.beginPath(); oc.moveTo(G.cx + sx * fw * .9, ty + dy * .65 + 4); oc.lineTo(G.cx + sx * fw * .9, ly); oc.moveTo(G.cx + sx * bw * .9, ty - dy * .35); oc.lineTo(G.cx + sx * bw * .9, Math.min(ly - G.ry, ty - dy * .35 + (ly - ty) * .8)); oc.stroke(); }
    oc.restore(); }
  c.drawImage(off, 0, 0, SW, SH);
  const ix0 = G.gx + G.wt, iw2 = G.iw / 2, gcx = G.cx;
  c.save(); c.globalCompositeOperation = 'destination-out'; c.fillRect(ix0, G.top, G.iw, G.bottom - G.top); c.restore();
  const warpCols = (ctx, yA, yB, sc, vm, cyM, dx0) => { for (let x = 0; x < G.iw; x++) { const n = (x + .5 - iw2) / iw2, ns = (n * .5 + .5 * Math.asin(clamp(n, -1, 1)) / (Math.PI / 2)) * sc, sx = gcx + ns * iw2, sy0 = cyM + (yA - cyM) * vm, sh = (yB - yA) * vm; ctx.drawImage(off, sx * DPR, sy0 * DPR, DPR, sh * DPR, dx0 + x, yA - (dx0 ? 0 : 0), 1.02, yB - yA); } };
  c.save(); c.globalAlpha = .85; warpCols(c, G.top, G.y0, .92, .97, (G.top + G.y0) / 2, ix0); c.restore();
  refrW = document.createElement('canvas'); refrW.width = Math.round(G.iw * DPR); refrW.height = Math.round((G.y1 + G.ryIn - G.y0 + G.ryIn) * DPR);
  { const rc = refrW.getContext('2d'); rc.setTransform(DPR, 0, 0, DPR, 0, 0); rc.translate(-ix0, -(G.y0 - G.ryIn)); for (let x = 0; x < G.iw; x++) { const n = (x + .5 - iw2) / iw2, ns = (n * .5 + .5 * Math.asin(clamp(n, -1, 1)) / (Math.PI / 2)) * .8, sx = gcx + ns * iw2, yA = G.y0 - G.ryIn, yB = G.y1 + G.ryIn, cyM = (yA + yB) / 2, vm = .9; rc.drawImage(off, sx * DPR, (cyM + (yA - cyM) * vm) * DPR, DPR, (yB - yA) * vm * DPR, ix0 + x, yA, 1.02, yB - yA); } }
  { const rc = refrW.getContext('2d'); rc.setTransform(DPR, 0, 0, DPR, 0, 0); rc.translate(-ix0, -(G.y0 - G.ryIn)); rc.globalCompositeOperation = 'destination-out'; const ocx = G.cx, ocy = (G.y0 + G.y1) / 2, og = rc.createRadialGradient(ocx, ocy, 0, ocx, ocy, G.iw * .42); og.addColorStop(0, 'rgba(0,0,0,1)'); og.addColorStop(.55, 'rgba(0,0,0,.9)'); og.addColorStop(1, 'rgba(0,0,0,0)'); rc.save(); rc.translate(ocx, ocy); rc.scale(1, 1.6); rc.translate(-ocx, -ocy); rc.fillStyle = og; rc.fillRect(ocx - G.iw, ocy - G.iw, G.iw * 2, G.iw * 2); rc.restore(); }
  refrKey = '';
  const sy = G.bottom + G.ry * 0.6;
  c.save(); c.translate(G.cx, sy); c.scale(1, 0.18);
  const s = c.createRadialGradient(0, 0, 0, 0, 0, G.gw * 0.78);
  if (light) { s.addColorStop(0, 'rgba(30,40,55,0.30)'); s.addColorStop(0.55, 'rgba(30,40,55,0.10)'); s.addColorStop(1, 'rgba(30,40,55,0)'); }
  else { s.addColorStop(0, 'rgba(255,255,255,0.16)'); s.addColorStop(0.55, 'rgba(255,255,255,0.05)'); s.addColorStop(1, 'rgba(255,255,255,0)'); }
  c.fillStyle = s; c.beginPath(); c.arc(0, 0, G.gw * 0.78, 0, Math.PI * 2); c.fill(); c.restore();
}
const warp = x => lerp(x, Math.asin(clamp(x * 0.995, -1, 1)) / (Math.PI / 2), 0.55);
function screenToSim(px, py) {
  const xn = clamp((px - G.wx) / G.ww * 2 - 1, -1, 1);
  return [warp(xn) * 0.5 + 0.5, clamp(1 - (py - G.wy) / G.wh, 0, 1)];
}
const surfaceV = () => 1 - (G.ryIn + 2) / G.wh;

/* ================= WebGL fluid ================= */
let gl = null, fluidOK = false, F = null;
const CFG = { SIM: 96, DYE: 448, VEL_DISS: 0.17, PRESSURE: 0.8, ITER: 20, CURL: 15, GRAV: 3.2 };
function initGL() {
  gl = fluidC.getContext('webgl2', { alpha: true, depth: false, stencil: false, antialias: false, premultipliedAlpha: true, preserveDrawingBuffer: false });
  if (!gl) throw new Error('no webgl2');
  gl.getExtension('EXT_color_buffer_float'); gl.getExtension('EXT_color_buffer_half_float');
  const HF = gl.HALF_FLOAT;
  const canRender = () => {
    const t = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, t);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, 4, 4, 0, gl.RGBA, HF, null);
    const f = gl.createFramebuffer(); gl.bindFramebuffer(gl.FRAMEBUFFER, f);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, t, 0);
    const ok = gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE;
    gl.bindFramebuffer(gl.FRAMEBUFFER, null); gl.deleteFramebuffer(f); gl.deleteTexture(t); return ok;
  };
  if (!canRender()) throw new Error('no float render');

  const VS = `precision highp float;
attribute vec2 aPosition; varying vec2 vUv; varying vec2 vL; varying vec2 vR; varying vec2 vT; varying vec2 vB; uniform vec2 texelSize;
void main(){ vUv=aPosition*0.5+0.5; vL=vUv-vec2(texelSize.x,0.0); vR=vUv+vec2(texelSize.x,0.0); vT=vUv+vec2(0.0,texelSize.y); vB=vUv-vec2(0.0,texelSize.y); gl_Position=vec4(aPosition,0.0,1.0); }`;
  const H = `precision highp float; precision highp sampler2D; varying vec2 vUv; varying vec2 vL; varying vec2 vR; varying vec2 vT; varying vec2 vB;\n`;
  const FS = {
    clear: H + `uniform sampler2D uTexture; uniform float value; void main(){ gl_FragColor=value*texture2D(uTexture,vUv); }`,
    splat: H + `uniform sampler2D uTarget; uniform float aspectRatio; uniform vec3 color; uniform vec2 point; uniform float radius;
void main(){ vec2 p=vUv-point; p.x*=aspectRatio; vec3 s=exp(-dot(p,p)/radius)*color; gl_FragColor=vec4(texture2D(uTarget,vUv).xyz+s,1.0); }`,
    advect: H + `uniform sampler2D uVelocity; uniform sampler2D uSource; uniform vec2 texelSize; uniform float dt; uniform float dissipation;
void main(){ vec2 coord=vUv-dt*texture2D(uVelocity,vUv).xy*texelSize; gl_FragColor=texture2D(uSource,coord)/(1.0+dissipation*dt); }`,
    divergence: H + `uniform sampler2D uVelocity;
void main(){ float L=texture2D(uVelocity,vL).x; float R=texture2D(uVelocity,vR).x; float T=texture2D(uVelocity,vT).y; float B=texture2D(uVelocity,vB).y; vec2 C=texture2D(uVelocity,vUv).xy;
 if(vL.x<0.0){L=-C.x;} if(vR.x>1.0){R=-C.x;} if(vT.y>1.0){T=-C.y;} if(vB.y<0.0){B=-C.y;}
 gl_FragColor=vec4(0.5*(R-L+T-B),0.0,0.0,1.0); }`,
    curl: H + `uniform sampler2D uVelocity;
void main(){ float L=texture2D(uVelocity,vL).y; float R=texture2D(uVelocity,vR).y; float T=texture2D(uVelocity,vT).x; float B=texture2D(uVelocity,vB).x; gl_FragColor=vec4(0.5*(R-L-T+B),0.0,0.0,1.0); }`,
    vorticity: H + `uniform sampler2D uVelocity; uniform sampler2D uCurl; uniform float curl; uniform float dt;
void main(){ float L=texture2D(uCurl,vL).x; float R=texture2D(uCurl,vR).x; float T=texture2D(uCurl,vT).x; float B=texture2D(uCurl,vB).x; float C=texture2D(uCurl,vUv).x;
 vec2 force=0.5*vec2(abs(T)-abs(B),abs(R)-abs(L)); force/=length(force)+0.0001; force*=curl*C; force.y*=-1.0;
 vec2 v=texture2D(uVelocity,vUv).xy+force*dt; v=clamp(v,-1000.0,1000.0); gl_FragColor=vec4(v,0.0,1.0); }`,
    buoyancy: H + `uniform sampler2D uVelocity; uniform sampler2D uDye; uniform float grav; uniform float dt; uniform vec3 uMean;
void main(){ vec2 v=texture2D(uVelocity,vUv).xy; vec3 a=texture2D(uDye,vUv).rgb; float d=dot(max(a-uMean,vec3(0.0)),vec3(0.3333)); d=min(d,30.0); v.y-=grav*d*dt; gl_FragColor=vec4(v,0.0,1.0); }`,
    pressure: H + `uniform sampler2D uPressure; uniform sampler2D uDivergence;
void main(){ float L=texture2D(uPressure,vL).x; float R=texture2D(uPressure,vR).x; float T=texture2D(uPressure,vT).x; float B=texture2D(uPressure,vB).x; float d=texture2D(uDivergence,vUv).x; gl_FragColor=vec4((L+R+B+T-d)*0.25,0.0,0.0,1.0); }`,
    gradient: H + `uniform sampler2D uPressure; uniform sampler2D uVelocity;
void main(){ float L=texture2D(uPressure,vL).x; float R=texture2D(uPressure,vR).x; float T=texture2D(uPressure,vT).x; float B=texture2D(uPressure,vB).x; vec2 v=texture2D(uVelocity,vUv).xy-vec2(R-L,T-B); gl_FragColor=vec4(v,0.0,1.0); }`,
    homog: H + `uniform sampler2D uTarget; uniform vec3 uMean; uniform float uRate;
void main(){ vec3 a=max(texture2D(uTarget,vUv).rgb,vec3(0.0)); gl_FragColor=vec4(mix(a,uMean,uRate),1.0); }`,
    display: H + `uniform sampler2D uDye; uniform float uTop; uniform float uBot; uniform vec2 uPx; uniform float uWarp; uniform vec3 uLight; uniform float uTime; uniform float uE;
float warp(float x){ return mix(x, asin(clamp(x*0.995,-1.0,1.0))/1.5707963, uWarp); }
void main(){
 float x=vUv.x*2.0-1.0; float ax=abs(x); float circ=sqrt(max(1.0-x*x,0.0));
 float topB=1.0-uTop*(1.0-circ); float botB=uBot*(1.0-circ);
 float mask=(1.0-smoothstep(topB-uPx.y,topB+uPx.y,vUv.y))*smoothstep(botB-uPx.y,botB+uPx.y,vUv.y)*(1.0-smoothstep(1.0-2.0*uPx.x,1.0,ax));
 float yn=clamp((vUv.y-botB)/max(topB-botB,0.001),0.0,1.0); float edge=smoothstep(0.12,0.7,ax);
 vec2 rf=vec2((0.0022+0.007*uE)*sin(vUv.y*38.0+uTime*2.3+sin(x*5.0+uTime*.9)*1.4)+(0.0016+0.004*uE)*sin(vUv.y*11.0-uTime*1.1), (0.0012+0.004*uE)*sin(x*21.0+uTime*1.7))*edge;
 vec3 a=max(texture2D(uDye,vec2(warp(x)*0.5+0.5,vUv.y)+rf).rgb,vec3(0.0));
 a*=1.0+0.13*(0.5-yn)*2.0*(0.6+0.4*circ);
 float m=max(max(a.r,a.g),a.b);
 float K=1.7; float S=0.75;
 float gm = m<K ? m : K+S*log(1.0+(m-K)/S);
 a *= m>0.0001 ? gm/m : 1.0;
 vec3 T=exp(-a*(0.72+0.28*circ));
 T*=mix(vec3(1.0),vec3(0.986,0.993,1.0),smoothstep(0.0,1.0,ax));
 T*=1.0-0.16*smoothstep(0.80,1.0,ax);
 T*=1.0+0.025*(vUv.y-0.5);
 T=mix(T,vec3(1.0),0.07*exp(-(x+0.58)*(x+0.58)/0.02)*mask);
 T*=1.0+edge*(0.03+0.04*uE)*sin(x*7.0+uTime*.6+sin(vUv.y*6.0+uTime*.45)*1.6);
 float us=exp(-pow((1.0-yn)/0.035,2.0)); T=mix(T,min(T*1.35+0.08,vec3(1.0)),us*0.55*(0.5+0.5*circ));
 T*=1.0-0.06*exp(-pow(yn/0.08,2.0));
 float dn=clamp((1.0-min(T.r,min(T.g,T.b)))*4.0,0.0,1.0); float al=max(mix(0.1,1.0,dn),us*0.4+0.14*smoothstep(0.86,1.0,ax)); gl_FragColor=vec4(T*uLight*mask*al,mask*al); }`,
  };
  const compile = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s)); return s; };
  const vs = compile(gl.VERTEX_SHADER, VS);
  const P = {};
  for (const k in FS) {
    const p = gl.createProgram(); gl.attachShader(p, vs); gl.attachShader(p, compile(gl.FRAGMENT_SHADER, FS[k]));
    gl.bindAttribLocation(p, 0, 'aPosition'); gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p));
    const u = {}; const n = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS);
    for (let i = 0; i < n; i++) { const nm = gl.getActiveUniform(p, i).name; u[nm] = gl.getUniformLocation(p, nm); }
    P[k] = { p, u: new Proxy(u, { get: (o, key) => (key in o ? o[key] : null) }) };
  }
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]), gl.STATIC_DRAW);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 0, 2, 3]), gl.STATIC_DRAW);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0); gl.enableVertexAttribArray(0);
  F = { P, HF, aspect: 0 };
}
function fbo(w, h) {
  gl.activeTexture(gl.TEXTURE0);
  const tex = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, w, h, 0, gl.RGBA, F.HF, null);
  const fb = gl.createFramebuffer(); gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
  gl.viewport(0, 0, w, h); gl.clearColor(0, 0, 0, 1); gl.clear(gl.COLOR_BUFFER_BIT);
  return { tex, fb, w, h, tx: 1 / w, ty: 1 / h, attach(id) { gl.activeTexture(gl.TEXTURE0 + id); gl.bindTexture(gl.TEXTURE_2D, tex); return id; } };
}
function dfbo(w, h) { let a = fbo(w, h), b = fbo(w, h); return { w, h, tx: 1 / w, ty: 1 / h, get read() { return a; }, get write() { return b; }, swap() { const t = a; a = b; b = t; } }; }
function res(base) { const asp = G.ww / G.wh; return asp < 1 ? [Math.round(base), Math.round(base / asp)] : [Math.round(base * asp), Math.round(base)]; }
function initFBOs() {
  const [sw, sh] = res(CFG.SIM); const [dw, dh] = res(CFG.DYE);
  F.vel = dfbo(sw, sh); F.dye = dfbo(dw, dh); F.div = fbo(sw, sh); F.curl = fbo(sw, sh); F.pres = dfbo(sw, sh);
  F.aspect = G.ww / G.wh;
  homogenize(1); // refill with the current mixture
}
function blit(t) {
  if (t) { gl.viewport(0, 0, t.w, t.h); gl.bindFramebuffer(gl.FRAMEBUFFER, t.fb); }
  else { gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight); gl.bindFramebuffer(gl.FRAMEBUFFER, null); }
  gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
}
function use(name) { const pr = F.P[name]; gl.useProgram(pr.p); return pr.u; }
function splat(target, x, y, col, r) {
  const u = use('splat');
  gl.uniform1i(u.uTarget, target.read.attach(0)); gl.uniform1f(u.aspectRatio, G.ww / G.wh);
  gl.uniform2f(u.point, x, y); gl.uniform3f(u.color, col[0], col[1], col[2]); gl.uniform1f(u.radius, r);
  blit(target.write); target.swap();
}
function splatDye(x, y, amount, r) { const k = (G.ww / G.wh) / (Math.PI * r); splat(F.dye, x, y, amount.map(v => v * k), r); }
function scaleDye(v) { const u = use('clear'); gl.uniform1i(u.uTexture, F.dye.read.attach(0)); gl.uniform1f(u.value, v); blit(F.dye.write); F.dye.swap(); }
function homogenize(rate) {
  const u = use('homog'); gl.uniform1i(u.uTarget, F.dye.read.attach(0)); gl.uniform3f(u.uMean, meanA[0], meanA[1], meanA[2]); gl.uniform1f(u.uRate, rate);
  blit(F.dye.write); F.dye.swap();
}
function step(dt) {
  gl.disable(gl.BLEND);
  let u = use('curl'); gl.uniform2f(u.texelSize, F.vel.tx, F.vel.ty); gl.uniform1i(u.uVelocity, F.vel.read.attach(0)); blit(F.curl);
  u = use('vorticity'); gl.uniform2f(u.texelSize, F.vel.tx, F.vel.ty); gl.uniform1i(u.uVelocity, F.vel.read.attach(0)); gl.uniform1i(u.uCurl, F.curl.attach(1));
  gl.uniform1f(u.curl, CFG.CURL); gl.uniform1f(u.dt, dt); blit(F.vel.write); F.vel.swap();
  u = use('buoyancy'); gl.uniform2f(u.texelSize, F.vel.tx, F.vel.ty); gl.uniform1i(u.uVelocity, F.vel.read.attach(0)); gl.uniform1i(u.uDye, F.dye.read.attach(1));
  gl.uniform1f(u.grav, CFG.GRAV); gl.uniform1f(u.dt, dt); gl.uniform3f(u.uMean, meanA[0], meanA[1], meanA[2]); blit(F.vel.write); F.vel.swap();
  u = use('divergence'); gl.uniform2f(u.texelSize, F.vel.tx, F.vel.ty); gl.uniform1i(u.uVelocity, F.vel.read.attach(0)); blit(F.div);
  u = use('clear'); gl.uniform1i(u.uTexture, F.pres.read.attach(0)); gl.uniform1f(u.value, CFG.PRESSURE); blit(F.pres.write); F.pres.swap();
  u = use('pressure'); gl.uniform2f(u.texelSize, F.vel.tx, F.vel.ty); gl.uniform1i(u.uDivergence, F.div.attach(0));
  for (let i = 0; i < CFG.ITER; i++) { gl.uniform1i(u.uPressure, F.pres.read.attach(1)); blit(F.pres.write); F.pres.swap(); }
  u = use('gradient'); gl.uniform2f(u.texelSize, F.vel.tx, F.vel.ty); gl.uniform1i(u.uPressure, F.pres.read.attach(0)); gl.uniform1i(u.uVelocity, F.vel.read.attach(1)); blit(F.vel.write); F.vel.swap();
  u = use('advect'); gl.uniform2f(u.texelSize, F.vel.tx, F.vel.ty); gl.uniform1i(u.uVelocity, F.vel.read.attach(0)); gl.uniform1i(u.uSource, F.vel.read.attach(0));
  gl.uniform1f(u.dt, dt); gl.uniform1f(u.dissipation, CFG.VEL_DISS); blit(F.vel.write); F.vel.swap();
  gl.uniform1i(u.uVelocity, F.vel.read.attach(0)); gl.uniform1i(u.uSource, F.dye.read.attach(1)); gl.uniform1f(u.dissipation, 0); blit(F.dye.write); F.dye.swap();
}
window.__mixio = { verify() { const bad = [], near = [], WT = DYES.findIndex(d => d.water); const L = COLORS.map(c => { const rgb = displayColor(recipeA(c[1], c[2])); let m = [0, 0, 0]; for (const [i, n] of c[1]) { if (!DYES[i] || DYES[i].water || !(n > 0)) bad.push(c[0] + ' bad dye ' + i); else for (let k = 0; k < n; k++) for (let j = 0; j < 3; j++) m[j] += DYES[i].a[j] * DROP; } for (let k = 0; k < c[2] * 3; k++) if (m[0] + m[1] + m[2] > 0) m = m.map(v => v * WF); const dE = dE00(toLab(rgb), toLab(displayColor(m))), pR = 100 * Math.exp(-Math.pow(dE / 18, 1.3)), pct = pR >= 99.95 ? 100 : Math.min(99.9, Math.round(pR * 10) / 10); if (pct < 100) bad.push(c[0] + ' scores ' + pct); return toLab(rgb); });
    for (let i = 0; i < L.length; i++) for (let j = i + 1; j < L.length; j++) { const d = dE00(L[i], L[j]); if (d < 1) near.push(COLORS[i][0] + ' ≈ ' + COLORS[j][0] + ' (' + d.toFixed(2) + ')'); }
    return { n: COLORS.length, uniqNames: new Set(COLORS.map(c => c[0])).size, atlas: COLORS.filter(c => atlasOf(c[0])).length, bad, near, maxDrops: Math.max(...COLORS.map(c => c[1].reduce((s, r) => s + r[1], 0) + c[2] * 3)) }; }, w() { return { G, SURF, spinW, tiltA, missLine, ATLAS, COLORS, ATLAS_DATA, save, target, STORY, postcard, badgeMoment, RANKS, sceneKind, displayColor, recipeA, toLab, dE00, DYES, FIRST, ALLN }; }, sim(n) { const keep = JSON.stringify(save); const out = []; for (let k = 0; k < n; k++) { const L = save.level; const t = makeTarget(L); out.push(L + ':' + t.name + ':' + t.tier); if (k === 0) (save.retry = save.retry || []).push({ i: t.idx, at: L + 1 + 7 + Math.floor(Math.random() * 5) }); save.lastPct = k === 0 ? 20 : 70; save.level++; } const r = out.slice(); Object.assign(save, JSON.parse(keep)); return r; }, dbg() { return JSON.stringify({ D: DRAIN, state, drops, pour: !!pour, hidden: $('home').hidden, dl: droplets.map(d => [d.state, Math.round(d.y)]), y0: G.y0, sel, log: glassLog, m: meanA, lastF: last }); }, selfTest() {
  if (!fluidOK) return 'no gl'; const keep = meanA.slice(), out = [];
  const T = [['light', [[0, 1]], 1], ['dark', [[12, 4], [6, 2]], 0], ['saturated', [[4, 3]], 0], ['gray', [[12, 1]], 1], ['watered', [[7, 2], [9, 1]], 2]];
  for (const [nm, rec, dil] of T) { const A = recipeA(rec, dil); meanA = A.slice(); homogenize(1); renderFluid(); const px = new Uint8Array(4); gl.readPixels(gl.drawingBufferWidth >> 1, gl.drawingBufferHeight >> 1, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, px); const got = [px[0] / 255, px[1] / 255, px[2] / 255], want = displayColor(A), d = dE00(toLab(want), toLab(got)); out.push(nm + ' ΔE ' + d.toFixed(2) + (d < 1.5 ? ' ok' : ' FAIL')); }
  meanA = keep; homogenize(1); renderFluid(); console.log('[mixio selftest]', out.join(' | ')); return out;
} };
function renderFluid() {
  const u = use('display');
  gl.uniform1i(u.uDye, F.dye.read.attach(0));
  gl.uniform1f(u.uTop, G.ryIn / G.wh); gl.uniform1f(u.uBot, G.ryIn / G.wh);
  gl.uniform2f(u.uPx, 1.2 / G.ww, 1.2 / G.wh); gl.uniform1f(u.uWarp, 0.55);
  gl.uniform3f(u.uLight, LIGHT, LIGHT, LIGHT); gl.uniform1f(u.uTime, (performance.now() / 1000) % 1000); gl.uniform1f(u.uE, Math.min(1, SURF.E || 0));
  gl.clearColor(0, 0, 0, 0); gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight); gl.bindFramebuffer(gl.FRAMEBUFFER, null); gl.clear(gl.COLOR_BUFFER_BIT);
  blit(null);
}

/* ================= Game state ================= */
let meanA = [0, 0, 0];
let drops = 0, unmixed = 0, stirEnergy = 0, forcedMix = 0, wCount = 0;
let state = 'play', target = null, auto = null, diluting = 0, emptying = 0;
const used = new Map();
const droplets = [], beadsFx = [], bubbles = [], ripples = [], trail = [];
let vortS = 0, vortX = 0, stirDir = 1, fluidAcc = 0, spinW = 0, spinPh = 0;
const SURF = { d: 0, wa: 0, ph: [0, 1.3, 2.1], bumps: [], E: 0 };
function surfH(th) { const xn = Math.cos(th); let h = -SURF.d * 2 / 3 + Math.tan(tiltA) * xn * G.iw / 2; h += SURF.wa * (Math.sin(2 * th + SURF.ph[0]) * .55 + Math.sin(3 * th + SURF.ph[1]) * .3 + Math.sin(5 * th + SURF.ph[2]) * .15); for (const b of SURF.bumps) h -= b.a * Math.exp(-b.t * 3.2) * Math.cos(b.t * 15) * Math.exp(-Math.pow(xn - b.xn, 2) / .05) * (Math.sin(th) > 0 ? 1 : .6); return h; }
function surfPath(c, oy, a0, a1) { const { cx, iw, y0, ryIn } = G, N = 40; c.beginPath(); for (let i = 0; i <= N; i++) { const th = a0 + (a1 - a0) * i / N, x = cx + iw / 2 * Math.cos(th), y = y0 + (oy || 0) + ryIn * Math.sin(th) + surfH(th); i ? c.lineTo(x, y) : c.moveTo(x, y); } } const splashFx = [];
let rod = null, pour = null, DRAIN = null;

function showLevel() {
  const card = $('targetCard'), b = $('bloom'), app = $('app').getBoundingClientRect(), sr = $('swatch').getBoundingClientRect();
  const done = () => { b.hidden = true; b.style.transform = ''; card.classList.remove('pending'); if (typeNext) { typeNext = false; typeName(); } else $('tname').style.opacity = ''; };
  card.classList.add('pending');
  if (!sr.width || matchMedia('(prefers-reduced-motion: reduce)').matches) { done(); return; }
  const ds = 12, sw = sr.width, tx = sr.left - app.left + sr.width / 2, ty = sr.top - app.top + sr.height / 2, col = css(target.rgb);
  Object.assign(b.style, { width: ds + 'px', height: ds + 'px', left: (tx - ds / 2) + 'px', top: (ty - ds / 2) + 'px', background: col, filter: 'none' });
  b.hidden = false; const fall = sw / 2 + 44;
  const a1 = b.animate([{ transform: `translateY(${-fall}px) scale(.75,1.05)`, opacity: 0 }, { transform: `translateY(${-fall * .8}px) scale(.8,1.25)`, opacity: 1, offset: .15 }, { transform: 'translateY(0) scale(.85,1.45)', opacity: 1 }], { duration: 350, easing: 'cubic-bezier(.55,0,.9,.6)' });
  a1.onfinish = () => {
    const k = sw / ds, a2 = b.animate([{ transform: 'scale(.9,1.1)' }, { transform: `scale(${k})` }], { duration: 300, easing: 'cubic-bezier(.2,.8,.3,1)', fill: 'forwards' });
    const ring = document.createElement('div'); ring.className = 'sring'; Object.assign(ring.style, { width: sw + 'px', height: sw + 'px', left: (tx - sw / 2) + 'px', top: (ty - sw / 2) + 'px', borderColor: col }); $('app').appendChild(ring);
    ring.animate([{ transform: 'scale(.6)', opacity: .7 }, { transform: 'scale(1.45)', opacity: 0 }], { duration: 520, easing: 'cubic-bezier(.2,.8,.3,1)' }).onfinish = () => ring.remove();
    a2.onfinish = () => { a2.cancel(); done(); };
  };
}
let typeNext = false;
function typeName() {
  const el = $('tname'), nm = target.name; let d = 0, h = '';
  for (const ch of nm) { if (ch === ' ') { h += ' '; d += 70; continue; } h += `<span class="tl" style="animation-delay:${d}ms">${ch}</span>`; d += 35; }
  el.innerHTML = h; el.style.opacity = '';
}
function replayTarget(n) { const i = COLORS.findIndex(c => c[0] === n); if (i >= 0) { const c = COLORS[i], recipe = c[1].map(([a, k]) => ({ i: a, n: k })), A = recipeA(c[1], c[2]); return { A, rgb: displayColor(A), recipe, dil: c[2], drops: recipe.reduce((s, r) => s + r.n, 0), name: c[0], tier: xTier(c), idx: i }; } const f = FIRST.find(f => f[0] === n); if (f) { const A = recipeA(f[1], 0); return { A, rgb: displayColor(A), recipe: f[1].map(([a, k]) => ({ i: a, n: k })), dil: 0, drops: f[1][0][1], name: f[0], tier: 1, idx: -1 }; } return null; }
let REPLAY = null;
function startReplay(n) { if (!replayTarget(n)) return; audio(); if (state === 'play' && glassLog.length) saveGlass(); resetGlass(); REPLAY = n; MODE = 'replay'; started = true; $('atlas').hidden = true; ATLAS.close(); hideHome(); setNav('play'); setTarget(); updateStat(); cbLine(); }

const HINT_COST = [0, 6, 14]; // % taken off this color's score after one / both hints
function hintKey() { return target ? (MODE + ':' + target.name) : ''; }
function hintN() { return save.hint && save.hint.k === hintKey() ? save.hint.n : 0; }
function hintText(n) { if (!target || !n) return ''; const R = target.recipe.filter(r => DYES[r.i] && !DYES[r.i].water).slice().sort((a, b) => b.n - a.n), nm = r => DYES[r.i].name;
  if (n === 1) return `mostly <b>${nm(R[0])}</b>` + (R.length > 1 ? ` · ${R.length} dyes total` : ' · just one dye');
  const tot = R.reduce((s, r) => s + r.n, 0) || 1; return R.map(r => `<b>${nm(r)}</b> ${r.n >= tot * .5 ? 'lots' : r.n >= tot * .25 ? 'some' : 'a touch'}`).join(' · ') + (target.dil ? ' · <b>+ water</b>' : ''); }
function renderHint() { const n = hintN(), ln = $('hintLn'), b = $('hintBtn'); if (!ln || !b) return; ln.innerHTML = hintText(n); ln.hidden = !n; b.classList.toggle('used', n > 0); $('hintCost').textContent = n >= 2 ? `−${HINT_COST[2]}%` : n ? `−${HINT_COST[1]}%` : 'hint'; b.disabled = n >= 2 || MODE === 'replay' || state === 'result' || (MODE === 'level' && (save.level || 1) <= 1); }
function openHint() { if (!target || state === 'result') return; const n = hintN(), P = $('hintPanel'), sh = $('hintSheet');
  P.innerHTML = `<div class="rkh"><div><small>stuck?</small><b>get a hint</b></div><button class="rkx" data-x="1" aria-label="Close">×</button></div>
  <div class="idlead">hints cost part of this color's score, which feeds your eye score. on a tough color it can still be worth it.</div>
  <button class="hintopt" data-h="1"${n >= 1 ? ' disabled' : ''}><i>−${HINT_COST[1]}%</i><b>${n >= 1 ? '✓ ' : ''}main dye</b><small>the dye that does most of the work</small></button>
  <button class="hintopt" data-h="2"${n >= 2 ? ' disabled' : ''}><i>−${HINT_COST[2]}% total</i><b>full recipe feel</b><small>every dye, roughly how much, and if it needs water</small></button>`;
  P.onclick = e => { if (e.target.closest('[data-x]')) { sh.hidden = true; return; } const o = e.target.closest('[data-h]'); if (!o || o.disabled) return; save.hint = { k: hintKey(), n: Math.max(n, +o.dataset.h) }; persist(); buzz([6, 30, 10]); sh.hidden = true; renderHint(); };
  sh.onclick = e => { if (e.target === sh) sh.hidden = true; }; sh.hidden = false; }
$('hintBtn').addEventListener('click', () => { buzz(5); openHint(); });
function setTarget() {
  target = MODE === 'replay' && REPLAY ? replayTarget(REPLAY) : MODE === 'daily' ? dailyTarget(dayNo()) : makeTarget(save.level);
  document.documentElement.style.setProperty('--target', css(target.rgb));
  $('lvlNo').textContent = MODE === 'replay' ? 'replay' : MODE === 'daily' ? 'daily #' + dayNo() : 'no. ' + String(save.level).padStart(3, '0');
  $('tierLbl').textContent = TIER_NAME[target.tier];
  $('tname').textContent = target.name; setTnameWord();
  $('thex').textContent = rgbToHex(target.rgb); $('thex').hidden = !save.cb; renderHint(); if (save.retryNow && MODE === 'level' && target.name === save.retryNow) { save.retryNow = null; setTimeout(() => toast('back for another try ↺'), 1400); }
  const wg = MODE === 'replay' ? null : MODE === 'daily' ? (save.wipD && save.wipD.day === dayNo() ? save.wipD : null) : (save.wip && save.wip.lvl === save.level ? save.wip : null);
  if (wg && wg.drops && wg.drops.length) { restoreGlass(wg); showLevel(); }
  else { DRAIN = { t: .9, z: 1, lvl: G.y1 + G.ryIn, fill: true }; pour = { t: 0 }; typeNext = true; $('tname').style.opacity = '0'; setTimeout(showLevel, 1000); }
}
function updateStat() {
  try { renderHint(); } catch (e) {}
  $('checkBtn').disabled = !(drops > 0 && state === 'play');
  document.querySelector('.actions').classList.toggle('show', drops > 0 || state !== 'play');
}
let toastT = 0;
function toast(msg) { const t = $('toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('show'), 1600); }
let hintUses = 0;
function bumpHint() {}
function cbLine() { if (!save.cb || !target) return; const dE = dE00(toLab(target.rgb), toLab(displayColor(meanA))); $('thex').textContent = rgbToHex(target.rgb) + '  ·  ΔE ' + dE.toFixed(1); }

function addDrop(px) {
  if (state !== 'play' || DRAIN) return;
  if (droplets.filter(d => d.state !== 'done').length > 4) return;
  const d = DYES[sel];
  const x = clamp(px, G.wx + G.ww * 0.1, G.wx + G.ww * 0.9);
  droplets.push({ x, y: G.top - G.gh * 0.16, vy: 0, t: 0, state: 'form', dye: sel, wob: Math.random() * 6 });
}
function saveGlass() { if (state !== 'play' && state !== 'mixing') return; if (MODE === 'replay') return; if (MODE === 'daily') save.wipD = { day: dayNo(), drops: glassLog.slice() }; else save.wip = { lvl: save.level, drops: glassLog.slice(), stirred: unmixed < .05 }; persist(); }
function restoreGlass(g) {
  g = g || save.wip; emptying = 0; DRAIN = null; diluting = 0; meanA = [0, 0, 0]; drops = 0; wCount = 0; used.clear(); glassLog = g.drops.slice();
  for (const i of g.drops) { const d = DYES[i]; if (!d) continue; used.set(i, (used.get(i) || 0) + 1); if (d.water) { meanA = meanA.map(v => v * WF); wCount++; } else { for (let k = 0; k < 3; k++) meanA[k] += d.a[k] * DROP * Math.pow(WF, wCount); drops++; } }
  unmixed = 0; if (fluidOK) homogenize(1); updateStat();
}
let glassLog = [], glassStir = 0; const CROWN = [];
const PERS = {
  def: { v: 170, r: 1, w: 1, n: 1, side: 60, up: 20 },
  Lemon: { v: 40, r: 1.8, w: 2, n: 3, side: 160, up: 10 }, Marigold: { v: 55, r: 1.6, w: 1.8, n: 3, side: 140, up: 10 },
  Tangerine: { v: 170, r: 1.1, w: 1.1, n: 2, side: 110, up: 40 }, Scarlet: { v: 190, r: 1.1, w: 1, n: 2, side: 120, up: 40 }, Rose: { v: 175, r: 1.1, w: 1.1, n: 2, side: 120, up: 40 },
  Violet: { v: 230, r: .8, w: .8, n: 1, side: 40, up: 10 }, Indigo: { v: 240, r: .8, w: .8, n: 1, side: 36, up: 10 }, Cobalt: { v: 230, r: .85, w: .8, n: 1, side: 40, up: 10 },
  Lagoon: { v: 110, r: 1.3, w: 1.6, n: 3, side: 180, up: 30 }, Teal: { v: 115, r: 1.3, w: 1.5, n: 3, side: 170, up: 30 }, Leaf: { v: 120, r: 1.3, w: 1.5, n: 3, side: 170, up: 30 },
  Cocoa: { v: 320, r: .65, w: .6, n: 0, side: 20, up: 0, late: 160 }, Ink: { v: 460, r: .45, w: .4, n: 0, side: 10, up: 0, late: 220 },
};
function landDrop(dp) {
  SURF.bumps.push({ xn: clamp((dp.x - G.cx) / (G.iw / 2), -1, 1), t: 0, a: 2.4 });
  { const td = new Date().toDateString(); if (save.lastPlay !== td) { save.lastPlay = td; save.daysN = (save.daysN || 0) + 1; } if (!save.first) save.first = Date.now(); }
  const d = DYES[dp.dye]; glassLog.push(dp.dye); save.totDrops = (save.totDrops || 0) + 1; if (!d.water) { save.dyeCount = save.dyeCount || {}; save.dyeCount[d.name] = (save.dyeCount[d.name] || 0) + 1; }
  setTimeout(saveGlass, 0);
  if (d.water) {
    used.set(WATER, (used.get(WATER) || 0) + 1);
    wCount++; if (meanA[0] + meanA[1] + meanA[2] > 0) { meanA = meanA.map(v => v * WF); if (fluidOK) scaleDye(WF); idleT = 0; }
    ripples.push({ x: dp.x, t: 0, a: .45 }); for (let i = 0; i < 3; i++) bubbles.push({ x: dp.x + (Math.random() - 0.5) * 10, y: G.y0 + 6 + Math.random() * 20, r: 0.8 + Math.random() * 1.6, vy: 40 + Math.random() * 40, ph: Math.random() * 6 });
    plink(WATER); buzz(6); updateStat(); return;
  }
  const amt = d.a.map(v => v * DROP * Math.pow(WF, wCount));
  const oldTot = meanA[0] + meanA[1] + meanA[2];
  for (let k = 0; k < 3; k++) meanA[k] += amt[k];
  const newTot = meanA[0] + meanA[1] + meanA[2];
  unmixed = newTot > 0 ? (unmixed * oldTot + (amt[0] + amt[1] + amt[2])) / newTot : 0;
  drops++; used.set(dp.dye, (used.get(dp.dye) || 0) + 1);
  const [u, v] = screenToSim(dp.x, G.y0);
  const sv = surfaceV();
  if (fluidOK) {
    const j = () => (Math.random() - 0.5);
    const P = PERS[d.name] || PERS.def;
    splatDye(u, sv - 0.014, amt.map(a => a * 0.45), 0.0009 * P.r);
    splatDye(u + j() * 0.05 * P.w, sv - 0.03, amt.map(a => a * 0.25), 0.0005 * P.r);
    splatDye(u + j() * 0.03 * P.w, sv - 0.003, amt.map(a => a * 0.15), 0.0003 * P.r);
    splat(F.vel, u, sv - 0.03, [j() * 30 * P.w, -P.v - Math.random() * P.v * .3, 0], 0.0016 * P.r);
    for (let k = 0; k < P.n; k++) splat(F.vel, u + 0.04 * (k % 2 ? 1 : -1) * P.w, sv - 0.05 - k * .02, [j() * P.side, P.up * j(), 0], 0.0012 * P.r);
    { const dn = P.v; setTimeout(() => { if (!fluidOK) return; const sv2 = surfaceV(); splat(F.vel, u, sv2 - .07, [0, -dn * .55, 0], .0011); splat(F.vel, u - .03, sv2 - .06, [-dn * .12, dn * .22, 0], .0008); splat(F.vel, u + .03, sv2 - .06, [dn * .12, dn * .22, 0], .0008); }, 110);
      setTimeout(() => { if (!fluidOK) return; const sv2 = surfaceV(); for (let k = 0; k < 3; k++) { const ox = (k - 1) * .022 * P.w + j() * .01, oy = sv2 - .1 - Math.random() * .05; splatDye(u + ox, oy, amt.map(a => a * .05), .00022 * P.r); splat(F.vel, u + ox, oy, [ox * 260, -dn * (.35 + Math.random() * .25), 0], .0005); } }, 260); }
    if (P.late) setTimeout(() => { if (!fluidOK) return; for (let k = 0; k < 2; k++) splat(F.vel, u + (k ? .05 : -.05), .12, [(k ? 1 : -1) * P.late, 30, 0], .002); }, 650);
  }
  ripples.push({ x: dp.x, t: 0 });
  for (let i = 0; i < 5; i++) { const a = -Math.PI / 2 + (Math.random() - .5) * 1.6, v = 90 + Math.random() * 110; splashFx.push({ x: dp.x, y: G.y0 - 1, vx: Math.cos(a) * v, vy: Math.sin(a) * v, r: .7 + Math.random() * 1.3, t: 0, col: d.rgb }); }
  CROWN.push({ x: dp.x, t: 0, dye: dp.dye, n: 11 + (Math.random() * 4 | 0), ph: Math.random() * 6 });
  for (let i = 0; i < 6; i++) { const a = Math.random() * Math.PI * 2; beadsFx.push({ x: dp.x + Math.cos(a) * 6, y: G.y0, vx: Math.cos(a) * (70 + Math.random() * 70), vy: -150 - Math.random() * 170, r: .9 + Math.random() * 1.3, t: 0, dye: dp.dye }); }
  for (let i = 0, nb = 2 + (Math.random() < .5 ? 1 : 0); i < nb; i++) bubbles.push({ x: dp.x + (Math.random() - 0.5) * 14, y: G.y0 + 8 + Math.random() * 30, r: 0.8 + Math.random() * 2.2, vy: 40 + Math.random() * 50, ph: Math.random() * 6 });
  plink(dp.dye); buzz(8); DRIP.onDrop();
  updateStat(); bumpHint();
}
function emptyGlass(fast) {
  if (!fast && (state !== 'play' || drops === 0)) return;
  if (!fast) DRIP.onEmpty();
  if (fast) emptying = 0.4; else { DRAIN = { t: 0, lvl: G.y0 }; buzz(12); }
  drops = 0; wCount = 0; used.clear(); unmixed = 0; glassLog = []; glassStir = 0; spinW = 0;
  updateStat();
}
function dilute() {
  if (state !== 'play' || drops === 0 || diluting > 0) return;
  diluting = 0.8; pour = { t: 0 }; buzz(8);
  used.set('dil', (used.get('dil') || 0) + 1);
  plip(0.6);
}
function check() {
  if (state !== 'play' || drops === 0) return;
  state = 'mixing';
  auto = { t: 0, dur: unmixed > 0.08 ? 1.7 : 0.7, last: null };
  updateStat();
}