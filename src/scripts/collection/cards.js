const CARDS=(()=>{
const host=document.createElement('div');host.id='kHost';host.hidden=true;
const nav=document.getElementById('nav');(nav&&nav.parentNode?nav.parentNode:document.body).insertBefore(host,nav||null);
const R=host.attachShadow({mode:'open'});
R.innerHTML=`<style>:host{--bg:#000;--fg:#eef3f7;--mut:#8b97a3;--line:rgba(255,255,255,.08);--dna:65,227,170;--f:var(--f-display,system-ui,sans-serif);--m:ui-monospace,'SF Mono',Menlo,monospace;position:absolute;inset:0;z-index:25;pointer-events:none;display:block;color:var(--fg);font:15px/1.45 var(--f);-webkit-font-smoothing:antialiased}
:host([hidden]){display:none}
:host(.kstage){z-index:60}
*{box-sizing:border-box;-webkit-tap-highlight-color:transparent;touch-action:manipulation}
button{font:inherit;color:inherit;border:0;background:none;cursor:pointer}
button:focus-visible{outline:2px solid rgb(var(--dna));outline-offset:2px}
.page{position:absolute;inset:0;bottom:0;pointer-events:auto;background:#000;overflow-y:auto;overflow-x:hidden;overscroll-behavior:contain;-webkit-overflow-scrolling:touch;touch-action:pan-y;padding:calc(env(safe-area-inset-top,0px) + 12px) max(16px,env(safe-area-inset-right)) calc(120px + env(safe-area-inset-bottom,0px)) max(16px,env(safe-area-inset-left));}
.page>.in{animation:pgIn .42s cubic-bezier(.2,.8,.25,1) both}
.page::before{content:"";position:fixed;inset:-30%;z-index:-1;pointer-events:none;background:conic-gradient(from 0deg at 50% 40%,rgba(82,209,255,.10),rgba(46,140,242,.08),rgba(92,242,199,.10),rgba(82,209,255,.10));filter:blur(60px)}
@keyframes pgIn{from{opacity:0;transform:translateY(10px)}}
.in{max-width:520px;margin:0 auto}
.hd{display:flex;justify-content:space-between;align-items:center;padding:6px 0 12px}
.ttl{font:600 20px var(--f);letter-spacing:-.02em}
.chroma{display:flex;align-items:center;gap:7px;font:800 14px var(--f);padding:7px 12px;border-radius:999px;background:rgba(255,255,255,.06);box-shadow:inset 0 0 0 .5px rgba(255,255,255,.12)}
.chroma i{width:12px;height:15px;background:url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%228 3 48 62%22%3E%3Cdefs%3E%3ClinearGradient id=%22a%22 x1=%220%22 y1=%220%22 x2=%221%22 y2=%221%22%3E%3Cstop offset=%220%22 stop-color=%22%235ff0ff%22/%3E%3Cstop offset=%22.3%22 stop-color=%22%237c8bff%22/%3E%3Cstop offset=%22.55%22 stop-color=%22%23ff6fd8%22/%3E%3Cstop offset=%22.8%22 stop-color=%22%23ffd36b%22/%3E%3Cstop offset=%221%22 stop-color=%22%236bffb0%22/%3E%3C/linearGradient%3E%3CradialGradient id=%22b%22 cx=%22.5%22 cy=%22.7%22 r=%22.6%22%3E%3Cstop offset=%220%22 stop-color=%22%23fff%22 stop-opacity=%220%22/%3E%3Cstop offset=%221%22 stop-color=%22%23001%22 stop-opacity=%22.35%22/%3E%3C/radialGradient%3E%3C/defs%3E%3Cpath d=%22M32 5C32 5 11 29 11 42a21 21 0 0 0 42 0C53 29 32 5 32 5Z%22 fill=%22url%28%23a%29%22/%3E%3Cpath d=%22M32 5C32 5 11 29 11 42a21 21 0 0 0 42 0C53 29 32 5 32 5Z%22 fill=%22url%28%23b%29%22/%3E%3Cpath d=%22M22 40c0-7 5-14 8-18%22 stroke=%22%23fff%22 stroke-width=%224%22 stroke-linecap=%22round%22 fill=%22none%22 opacity=%22.75%22/%3E%3Ccircle cx=%2221%22 cy=%2247%22 r=%222.4%22 fill=%22%23fff%22 opacity=%22.6%22/%3E%3Cpath d=%22M32 5C32 5 11 29 11 42a21 21 0 0 0 42 0C53 29 32 5 32 5Z%22 fill=%22none%22 stroke=%22%23fff%22 stroke-opacity=%22.5%22 stroke-width=%221.2%22/%3E%3C/svg%3E") center/contain no-repeat;filter:drop-shadow(0 0 5px rgba(180,90,255,.55))}
.chroma.bump{animation:bump .5s}
@keyframes bump{40%{transform:scale(1.15)}}
.seg{position:relative;display:flex;gap:0;padding:5px;height:50px;border-radius:25px;margin-bottom:16px;isolation:isolate;background:linear-gradient(180deg,rgba(255,255,255,.2) 0%,rgba(255,255,255,.09) 46%,rgba(255,255,255,.015) 50.5%,rgba(255,255,255,0) 70%,rgba(140,215,255,.07) 100%),linear-gradient(180deg,rgba(40,70,95,.28),rgba(14,22,32,.42));box-shadow:inset 0 1px 0 rgba(255,255,255,.55),inset 0 -1px 0 rgba(160,225,255,.18),inset 0 0 0 .5px rgba(255,255,255,.16),inset 0 -14px 22px -12px rgba(110,200,255,.22),0 20px 44px -12px rgba(0,0,0,.75),0 2px 8px rgba(0,0,0,.4);contain:layout paint}
.seg::before{content:"";position:absolute;left:6%;right:6%;top:1.5px;height:44%;border-radius:999px 999px 50% 50%/100% 100% 40% 40%;background:linear-gradient(180deg,rgba(255,255,255,.14),rgba(255,255,255,.02));pointer-events:none;z-index:0}
.seg .lens{position:absolute;top:5px;bottom:5px;left:0;width:0;border-radius:20px;z-index:1;pointer-events:none;transition:none;will-change:transform;background:radial-gradient(110% 80% at 50% 0%,rgba(255,255,255,.22),rgba(255,255,255,.04) 60%),radial-gradient(120% 80% at 50% 115%,rgba(150,225,255,.24),rgba(150,225,255,0) 60%),rgba(255,255,255,.05);box-shadow:inset 0 8px 12px -9px rgba(255,255,255,.6),inset 0 -8px 12px -9px rgba(170,230,255,.45),inset 0 0 0 .5px rgba(255,255,255,.22),0 8px 22px -10px rgba(120,200,255,.45)}
.seg .lens.sq{transition:transform .22s cubic-bezier(.4,0,.6,1),width .22s cubic-bezier(.4,0,.6,1)}
.seg button{position:relative;z-index:2;flex:1;font:650 13.5px var(--f);letter-spacing:.01em;border-radius:20px;color:rgba(255,255,255,.58);text-shadow:0 1px 1px rgba(0,0,0,.35);transition:color .3s,transform .18s}
.seg button:active{transform:scale(.94)}
.seg button[aria-pressed="true"]{color:#fff}

#v-pp{padding-top:4px}
.pphint{text-align:center;font:600 11px var(--f);letter-spacing:.2em;text-transform:uppercase;color:rgba(255,255,255,.45);margin:14px 0 0;transition:opacity .4s}
.book{position:relative;margin:4px auto 0;width:min(86vw,340px,calc((100dvh - 330px - env(safe-area-inset-top,0px) - env(safe-area-inset-bottom,0px)) * .7));aspect-ratio:.7;perspective:1600px;touch-action:pan-y pinch-zoom;user-select:none;-webkit-user-select:none}
.book .pg{position:absolute;inset:0;transform-origin:0 50%;transform-style:preserve-3d;-webkit-transform-style:preserve-3d;transition:transform .9s cubic-bezier(.3,.7,.2,1),opacity .3s .7s;will-change:transform}
.book .pg.fl{transform:rotateY(-178deg);opacity:0;pointer-events:none}
.book .pg.fl.qk{transition:transform .9s cubic-bezier(.3,.7,.2,1),opacity .2s .75s}
.book .sd{position:absolute;inset:0;backface-visibility:hidden;-webkit-backface-visibility:hidden;border-radius:4px 14px 14px 4px;overflow:hidden}
.book .sd.bk{transform:rotateY(180deg);background:#efe9dc}
.book::after{content:"";position:absolute;left:4%;right:-2%;bottom:-6%;height:10%;background:radial-gradient(50% 50% at 50% 50%,rgba(0,0,0,.6),transparent);filter:blur(10px);z-index:-1}
/* cover */
.cov{background:radial-gradient(120% 90% at 30% 20%,#23305a,#141c38 55%,#0b1024);box-shadow:inset 0 0 0 1px rgba(255,255,255,.06),inset 6px 0 10px -4px rgba(0,0,0,.6),inset -2px 0 2px rgba(255,255,255,.06);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:5%;color:#e9c876}
.cov::before{content:"";position:absolute;inset:0;opacity:.35;background:repeating-linear-gradient(45deg,rgba(255,255,255,.025) 0 2px,transparent 2px 5px),repeating-linear-gradient(-45deg,rgba(0,0,0,.08) 0 2px,transparent 2px 6px)}
.cov::after{content:"";position:absolute;inset:0;background:linear-gradient(105deg,transparent 35%,rgba(255,240,200,.16) 48%,transparent 60%);background-size:260% 100%;animation:covsh 6s ease-in-out infinite}
@keyframes covsh{0%{background-position:120% 0}60%,100%{background-position:-60% 0}}
.cov .t1{text-transform:uppercase;position:relative;font:800 13px var(--f);letter-spacing:.42em;text-indent:.42em;text-shadow:0 1px 0 rgba(0,0,0,.6),0 -1px 0 rgba(255,235,180,.25)}
.cov svg{position:relative;width:42%;filter:drop-shadow(0 1px 0 rgba(0,0,0,.6))}
.cov .t2{position:relative;font:900 30px var(--f);letter-spacing:-.04em;background:linear-gradient(180deg,#fff2c4,#d9ac4c 55%,#f6dc93);-webkit-background-clip:text;background-clip:text;color:transparent;filter:drop-shadow(0 1px 0 rgba(0,0,0,.6))}
.cov .t3{position:relative;font:700 10px var(--f);letter-spacing:.3em;text-transform:uppercase;opacity:.75}
.cov .chip{position:absolute;right:9%;bottom:7%;width:13%;aspect-ratio:1.3;border-radius:3px;border:1.5px solid rgba(233,200,118,.75)}
/* paper pages */
.paper{background:radial-gradient(140% 100% at 0% 50%,rgba(120,96,60,.16),transparent 30%),repeating-radial-gradient(circle at 70% 40%,rgba(90,120,150,.07) 0 1px,transparent 1px 7px),linear-gradient(160deg,#f6f1e6,#ece4d2);color:#2a241b;box-shadow:inset 8px 0 14px -10px rgba(60,40,10,.5),inset 0 0 0 1px rgba(120,96,60,.12)}
.paper .pn{position:absolute;bottom:3.5%;right:6%;font:600 9px var(--f);color:rgba(42,36,27,.4)}
.paper .ph{position:absolute;top:4%;left:9%;right:6%;display:flex;justify-content:space-between;font:800 8.5px var(--f);letter-spacing:.24em;text-transform:uppercase;color:rgba(42,36,27,.45)}
/* identity page */
.idp{padding:15% 7% 7% 10%;display:flex;flex-direction:column;gap:4%}
.idrow{display:flex;gap:6%}
.idph{width:36%;aspect-ratio:.78;border-radius:6px;background:radial-gradient(circle at 36% 30%,#fff,var(--dna) 28%,color-mix(in srgb,var(--dna) 55%,#000) 90%);box-shadow:inset 0 0 0 1px rgba(0,0,0,.12),0 2px 6px rgba(60,40,10,.2);position:relative;overflow:hidden}
.idph::after{content:"";position:absolute;inset:0;background:repeating-linear-gradient(135deg,rgba(255,255,255,.12) 0 2px,transparent 2px 6px)}
.idf{flex:1;display:flex;flex-direction:column;gap:7px;min-width:0}
.idf div{display:flex;flex-direction:column}
.idf small{font:700 7.5px var(--f);letter-spacing:.18em;text-transform:uppercase;color:rgba(42,36,27,.45)}
.idf b{font:700 13px var(--f);color:#2a241b;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.idst{display:grid;grid-template-columns:repeat(2,1fr);gap:8px;margin-top:2%}
.idst div{padding:7px 8px;border-radius:8px;background:rgba(42,36,27,.05);box-shadow:inset 0 0 0 1px rgba(42,36,27,.08)}
.idst small{display:block;font:700 7.5px var(--f);letter-spacing:.16em;text-transform:uppercase;color:rgba(42,36,27,.45)}
.idst b{font:800 17px var(--f)}.idst b.g{color:#b0801f}
.mrz{text-transform:uppercase;margin-top:auto;font:600 9.5px ui-monospace,Menlo,monospace;letter-spacing:.08em;color:rgba(42,36,27,.55);line-height:1.5;word-break:break-all}
.ppmore{position:relative;margin-top:6px;align-self:flex-start;font:700 10px var(--f);letter-spacing:.06em;color:#2a241b;padding:6px 10px;border-radius:99px;background:rgba(42,36,27,.07);box-shadow:inset 0 0 0 1px rgba(42,36,27,.12)}
/* stamps page */
.stp{display:grid;grid-template-columns:1fr 1fr;grid-template-rows:repeat(3,1fr);gap:4%;padding:15% 7% 10% 11%}
.stamp{position:relative;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;padding:6px;color:var(--ink);transform:rotate(var(--r));mix-blend-mode:multiply;opacity:.88;border:2px solid var(--ink);border-radius:var(--br);box-shadow:inset 0 0 0 3px #f2ecdf,inset 0 0 0 4px var(--ink);text-align:center}
.stamp img{width:30px;height:21px;border-radius:2px;object-fit:cover;filter:saturate(.85);mix-blend-mode:normal}
.stamp b{font:800 9.5px/1.1 var(--f);letter-spacing:.12em;text-transform:uppercase!important;max-width:100%;overflow:hidden;text-overflow:ellipsis}
.stamp small{font:700 8px var(--f);letter-spacing:.14em;opacity:.8}
.stamp i{font:600 7px var(--f);font-style:normal;letter-spacing:.1em;opacity:.6}
.stamp.gold{--ink:#b07d18;mix-blend-mode:normal;opacity:1;background:radial-gradient(120% 120% at 30% 20%,rgba(255,236,180,.55),rgba(233,190,90,.18) 60%,transparent);box-shadow:inset 0 0 0 3px #f2ecdf,inset 0 0 0 4px #c9962a,0 0 14px -4px rgba(220,170,60,.6)}
.stamp.gold b{background:linear-gradient(90deg,#8a5d0c,#d9a83e,#8a5d0c);-webkit-background-clip:text;background-clip:text;color:transparent}
.stamp.empty{border-style:dashed;opacity:.25;box-shadow:none}
.ppnav{display:flex;justify-content:center;align-items:center;gap:14px;margin-top:16px}
.ppnav button{width:44px;height:44px;border-radius:50%;font:700 18px var(--f);color:#fff;background:radial-gradient(110% 80% at 50% 0%,rgba(255,255,255,.22),rgba(255,255,255,.04) 60%),radial-gradient(120% 80% at 50% 115%,rgba(150,225,255,.22),rgba(150,225,255,0) 60%),rgba(255,255,255,.05);box-shadow:inset 0 8px 12px -9px rgba(255,255,255,.6),inset 0 -8px 12px -9px rgba(170,230,255,.45),inset 0 0 0 .5px rgba(255,255,255,.22),0 8px 22px -10px rgba(120,200,255,.45);transition:transform .2s cubic-bezier(.3,1.5,.5,1),opacity .3s}.ppnav button:active{transform:scale(.88)}
.ppnav button:disabled{opacity:.3}
.ppnav span{font:600 12px var(--f);color:var(--mut);min-width:70px;text-align:center}

.vp{position:relative;overflow:hidden;margin:0 -16px;padding:0 16px 8px;touch-action:pan-y}
.track{display:flex;align-items:flex-start;gap:32px;transition:transform .5s cubic-bezier(.22,1,.36,1);will-change:transform;transform:translate3d(0,0,0)}
.track.drag{transition:none}
.track>.view{flex:0 0 100%;min-width:0;display:block!important;animation:none!important;transition:opacity .35s ease;opacity:.3}
.track>.view.on{opacity:1}
.seg{touch-action:none}
.seg .lens.drag{transition:none;transform-origin:center}
.seg .lens::after{content:"";position:absolute;left:12%;right:12%;top:2px;height:40%;border-radius:999px;background:linear-gradient(180deg,rgba(255,255,255,.35),rgba(255,255,255,0));opacity:.6}
.seg button.hov{color:#fff}

.track>.view:not(.on) *,.track>.view:not(.on){animation-play-state:paused!important}
.track.drag>.view *{animation-play-state:paused!important}
.cgrid .slot{transform:translateZ(0)}.cgrid .slot.offs *{animation-play-state:paused!important}
.stage:not(.on) *{animation:none!important}
.pinnote{margin:10px 2px 0;font:600 12px var(--f);color:rgba(255,255,255,.6)}.pinnote b{color:#fff}
.acts .act{min-width:0;flex:1}
.empty{font-size:13px;color:var(--mut);text-align:center;padding:10px 0 0}

button{font:inherit;color:inherit;border:0;background:none;cursor:pointer}
button:focus-visible{outline:2px solid rgb(var(--dna));outline-offset:2px}
.chroma{display:flex;align-items:center;gap:7px;font:800 14px var(--f);padding:7px 12px;border-radius:999px;background:rgba(255,255,255,.06);box-shadow:inset 0 0 0 .5px var(--line)}
.chroma i{width:12px;height:15px;background:url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%228 3 48 62%22%3E%3Cdefs%3E%3ClinearGradient id=%22a%22 x1=%220%22 y1=%220%22 x2=%221%22 y2=%221%22%3E%3Cstop offset=%220%22 stop-color=%22%235ff0ff%22/%3E%3Cstop offset=%22.3%22 stop-color=%22%237c8bff%22/%3E%3Cstop offset=%22.55%22 stop-color=%22%23ff6fd8%22/%3E%3Cstop offset=%22.8%22 stop-color=%22%23ffd36b%22/%3E%3Cstop offset=%221%22 stop-color=%22%236bffb0%22/%3E%3C/linearGradient%3E%3CradialGradient id=%22b%22 cx=%22.5%22 cy=%22.7%22 r=%22.6%22%3E%3Cstop offset=%220%22 stop-color=%22%23fff%22 stop-opacity=%220%22/%3E%3Cstop offset=%221%22 stop-color=%22%23001%22 stop-opacity=%22.35%22/%3E%3C/radialGradient%3E%3C/defs%3E%3Cpath d=%22M32 5C32 5 11 29 11 42a21 21 0 0 0 42 0C53 29 32 5 32 5Z%22 fill=%22url%28%23a%29%22/%3E%3Cpath d=%22M32 5C32 5 11 29 11 42a21 21 0 0 0 42 0C53 29 32 5 32 5Z%22 fill=%22url%28%23b%29%22/%3E%3Cpath d=%22M22 40c0-7 5-14 8-18%22 stroke=%22%23fff%22 stroke-width=%224%22 stroke-linecap=%22round%22 fill=%22none%22 opacity=%22.75%22/%3E%3Ccircle cx=%2221%22 cy=%2247%22 r=%222.4%22 fill=%22%23fff%22 opacity=%22.6%22/%3E%3Cpath d=%22M32 5C32 5 11 29 11 42a21 21 0 0 0 42 0C53 29 32 5 32 5Z%22 fill=%22none%22 stroke=%22%23fff%22 stroke-opacity=%22.5%22 stroke-width=%221.2%22/%3E%3C/svg%3E") center/contain no-repeat;filter:drop-shadow(0 0 5px rgba(180,90,255,.55))}
.chroma.bump{animation:bump .5s}
@keyframes bump{40%{transform:scale(1.15)}}
.view{display:none}.view.on{display:block;animation:tabIn .35s cubic-bezier(.2,.8,.2,1)}
@keyframes tabIn{from{opacity:0;transform:translateY(10px)}}
.sub{font:700 11px var(--f);letter-spacing:.22em;text-transform:uppercase;color:rgba(var(--dna),.85);margin:22px 0 10px}
.note{font-size:13px;color:var(--mut);margin:0 0 6px}
.packs{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}
.pk{display:flex;flex-direction:column;align-items:center;gap:8px;padding:0}
.pkx{position:relative;width:100%;aspect-ratio:2/3;border-radius:10px;overflow:hidden;animation:bob 4.5s ease-in-out infinite}
.pk:nth-child(2) .pkx{animation-delay:-1.5s}.pk:nth-child(3) .pkx{animation-delay:-3s}
@keyframes bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
.pkx .lab{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6%}
.pkx .lab b{font:900 clamp(18px,6vw,30px)/1 var(--f);letter-spacing:-.05em}
.pkx .lab span{font:800 8px var(--f);letter-spacing:.3em}
.pkx .crimp{position:absolute;left:0;right:0;height:7%}
.pkx .crimp.t{top:0}.pkx .crimp.b{bottom:0}
.pkx .sh{position:absolute;top:-20%;bottom:-20%;width:38%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.55),transparent);animation:sheen 3.4s ease-in-out infinite}
@keyframes sheen{0%{transform:translateX(-120%) rotate(18deg)}100%{transform:translateX(320%) rotate(18deg)}}
.p-std{background:linear-gradient(160deg,#5b636d,#2a3037 55%,#1a1e23);box-shadow:inset 0 1px 0 rgba(255,255,255,.25),inset 0 0 0 1px rgba(255,255,255,.08),0 24px 40px -20px #000}
.p-std .crimp{background:repeating-linear-gradient(90deg,rgba(255,255,255,.18) 0 6px,rgba(0,0,0,.2) 6px 12px)}.p-std .lab span{color:rgba(255,255,255,.6)}
.p-rare{background:linear-gradient(160deg,#ff5a6a,#c3132f 50%,#5e0716);box-shadow:inset 0 1px 0 rgba(255,255,255,.35),inset 0 0 0 1px rgba(255,180,190,.25),0 24px 50px -18px rgba(220,30,60,.55)}
.p-rare .crimp{background:repeating-linear-gradient(90deg,rgba(255,255,255,.25) 0 6px,rgba(0,0,0,.2) 6px 12px)}.p-rare .lab span{color:rgba(255,230,232,.85)}
.p-prem{background:linear-gradient(155deg,#ffe6a0 0%,#d4a33a 22%,#6c2bd9 55%,#2a0f5e 100%);box-shadow:inset 0 1px 0 rgba(255,255,255,.6),inset 0 0 0 1.5px rgba(255,220,140,.6),0 24px 60px -16px rgba(150,80,255,.7)}
.p-prem::before{content:"";position:absolute;inset:0;background:conic-gradient(from 0deg at 50% 40%,rgba(255,80,160,.25),rgba(255,210,90,.25),rgba(90,230,200,.25),rgba(110,140,255,.25),rgba(255,80,160,.25));mix-blend-mode:overlay}
.p-prem .crimp{background:repeating-linear-gradient(90deg,rgba(255,235,170,.6) 0 6px,rgba(80,30,150,.4) 6px 12px)}.p-prem .lab b{color:#fff7dd;text-shadow:0 0 20px rgba(255,210,110,.6)}.p-prem .lab span{color:#ffe6a0}
.pk .nm{font:800 14px var(--f)}.pk .pr{font:700 12px var(--f);color:var(--mut);display:flex;align-items:center;gap:5px}.pk .fpk{color:#7dffc4;letter-spacing:.04em;text-shadow:0 0 10px rgba(125,255,196,.5)}
.pk .pr i{width:9px;height:11px;background:url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%228 3 48 62%22%3E%3Cdefs%3E%3ClinearGradient id=%22a%22 x1=%220%22 y1=%220%22 x2=%221%22 y2=%221%22%3E%3Cstop offset=%220%22 stop-color=%22%235ff0ff%22/%3E%3Cstop offset=%22.3%22 stop-color=%22%237c8bff%22/%3E%3Cstop offset=%22.55%22 stop-color=%22%23ff6fd8%22/%3E%3Cstop offset=%22.8%22 stop-color=%22%23ffd36b%22/%3E%3Cstop offset=%221%22 stop-color=%22%236bffb0%22/%3E%3C/linearGradient%3E%3CradialGradient id=%22b%22 cx=%22.5%22 cy=%22.7%22 r=%22.6%22%3E%3Cstop offset=%220%22 stop-color=%22%23fff%22 stop-opacity=%220%22/%3E%3Cstop offset=%221%22 stop-color=%22%23001%22 stop-opacity=%22.35%22/%3E%3C/radialGradient%3E%3C/defs%3E%3Cpath d=%22M32 5C32 5 11 29 11 42a21 21 0 0 0 42 0C53 29 32 5 32 5Z%22 fill=%22url%28%23a%29%22/%3E%3Cpath d=%22M32 5C32 5 11 29 11 42a21 21 0 0 0 42 0C53 29 32 5 32 5Z%22 fill=%22url%28%23b%29%22/%3E%3Cpath d=%22M22 40c0-7 5-14 8-18%22 stroke=%22%23fff%22 stroke-width=%224%22 stroke-linecap=%22round%22 fill=%22none%22 opacity=%22.75%22/%3E%3Ccircle cx=%2221%22 cy=%2247%22 r=%222.4%22 fill=%22%23fff%22 opacity=%22.6%22/%3E%3Cpath d=%22M32 5C32 5 11 29 11 42a21 21 0 0 0 42 0C53 29 32 5 32 5Z%22 fill=%22none%22 stroke=%22%23fff%22 stroke-opacity=%22.5%22 stroke-width=%221.2%22/%3E%3C/svg%3E") center/contain no-repeat}
.pk:disabled{opacity:.45}
.odds{margin-top:18px;padding:14px 12px 12px;border-radius:20px;background:linear-gradient(180deg,rgba(255,255,255,.05),rgba(255,255,255,.015));box-shadow:inset 0 1px 0 rgba(255,255,255,.1),inset 0 0 0 .5px rgba(255,255,255,.08)}
.odds .oh{font:700 11px var(--f);letter-spacing:.2em;text-transform:uppercase;color:rgba(255,255,255,.45);margin:0 4px 12px}
.odds .og{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}
.odds .oc{display:flex;flex-direction:column;align-items:center;gap:8px;min-width:0}
.odds .dn{position:relative;width:64px;height:64px;border-radius:50%;box-shadow:0 6px 18px -8px rgba(0,0,0,.8)}
.odds .dn i{position:absolute;inset:11px;border-radius:50%;background:#0a0d12;box-shadow:inset 0 1px 0 rgba(255,255,255,.06)}
.odds .oc>b{font:800 13px var(--f);color:#fff}
.odds ul{list-style:none;margin:0;padding:0;width:100%;display:flex;flex-direction:column;gap:3px}
.odds li{display:flex;align-items:center;gap:5px;font:600 10.5px var(--f);color:rgba(255,255,255,.55);white-space:nowrap}
.odds li i{flex:none;width:6px;height:6px;border-radius:50%}
.odds li span{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis}
.odds li em{font-style:normal;color:rgba(255,255,255,.85);font-variant-numeric:tabular-nums}
.odds .oc small{font:600 9.5px var(--f);color:rgba(65,227,170,.85);text-align:center}
.dev{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px}
.chipb{font:700 12px var(--f);padding:7px 12px;border-radius:999px;background:rgba(255,255,255,.06);box-shadow:inset 0 0 0 .5px var(--line);color:var(--mut)}
.chipb[aria-pressed="true"]{background:rgba(var(--dna),.16);color:rgb(var(--dna))}
.cb{position:relative;width:var(--w,240px);aspect-ratio:5/7;container-type:inline-size;perspective:900px;touch-action:none;user-select:none;-webkit-user-select:none}
.rot{position:absolute;inset:0;transform-style:preserve-3d;-webkit-transform-style:preserve-3d;will-change:transform}
.face{position:absolute;inset:0;font-size:5cqw;border-radius:5.5cqw;overflow:hidden;backface-visibility:hidden;-webkit-backface-visibility:hidden;transform:translateZ(.5px)}
.face.bk{transform:rotateY(180deg) translateZ(.5px)}
.glare{position:absolute;inset:0;pointer-events:none;z-index:9;border-radius:inherit;background:linear-gradient(calc(110deg + var(--gx,0)*1deg),transparent 30%,rgba(255,255,255,var(--ga,.18)) 48%,transparent 62%);background-size:250% 100%;background-position:calc(50% + var(--gp,0)*1%) 0;mix-blend-mode:soft-light}
/* front layout */
.fr{display:flex;flex-direction:column;gap:.55em;padding:.55em}
.fr .nm{display:flex;justify-content:space-between;align-items:baseline;gap:.4em;font:800 1.05em/1.15 var(--f);padding:.1em .15em 0;white-space:nowrap}
.fr .nm span:first-child{overflow:hidden;text-overflow:ellipsis}
.fr .art{flex:1;position:relative;overflow:hidden;border-radius:.4em}
.fr .ft{display:flex;justify-content:space-between;gap:.5em;font:600 .78em/1 var(--f);padding:0 .2em .25em}
.fr .ft span:first-child{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.fr .no{font:500 .74em/1 var(--m);flex:none}
/* standard: white border, matte */
.f-std{background:#f3f1ec;color:#16181c;box-shadow:inset 0 0 0 .08em rgba(0,0,0,.06)}
.f-std .ft{color:#5d6168}.f-std .art{background:var(--c);box-shadow:inset 0 0 0 .06em rgba(0,0,0,.08)}
/* holo: silver, shiny, not rainbow */
.f-holo{background:linear-gradient(160deg,#fbfcfd,#d6dbe1 45%,#f4f6f8);color:#16181c}
.f-holo .ft{color:#5d6168}.f-holo .art{background:linear-gradient(180deg,color-mix(in srgb,var(--c) 78%,#fff),var(--c) 55%,color-mix(in srgb,var(--c) 75%,#000))}
.f-holo .art::after{content:"";position:absolute;inset:0;background:linear-gradient(calc(160deg + var(--gx,0)*1deg),rgba(255,255,255,.5),transparent 40%,rgba(255,255,255,.18) 70%,transparent)}
.f-holo .sw{position:absolute;inset:-40% auto -40% 0;width:34%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.6),transparent);animation:glide 3.6s ease-in-out infinite;z-index:4;pointer-events:none}
@keyframes glide{0%{transform:translateX(-160%) rotate(22deg)}100%{transform:translateX(420%) rotate(22deg)}}
/* liquid */
.f-liquid{background:linear-gradient(170deg,#1d2533,#0d1119);color:#eef3f7;box-shadow:inset 0 0 0 .1em color-mix(in srgb,var(--c) 60%,#fff)}
.f-liquid .ft{color:#b9c6d2}
.f-liquid .art{background:color-mix(in srgb,var(--c) 70%,#000) center/cover no-repeat}
.f-liquid .art i{position:absolute;border-radius:50%;background:radial-gradient(circle,color-mix(in srgb,var(--c) 70%,#fff),transparent 70%);width:90%;height:80%;left:-20%;top:-10%;animation:drift 5s ease-in-out infinite;opacity:.22;mix-blend-mode:screen}
.f-liquid .art i+i{left:30%;top:30%;animation-duration:7s;animation-direction:reverse}
.f-liquid .art b{position:absolute;left:-20%;right:-20%;top:64%;bottom:-10%;background:var(--c);border-radius:46% 54% 0 0/1em 1.4em 0 0;opacity:.2;mix-blend-mode:screen;animation:slosh 2.6s ease-in-out infinite}
.f-liquid .art .pan{position:absolute;inset:-6%;background:inherit;background-size:cover;animation:pan 12s ease-in-out infinite alternate}
@keyframes drift{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(14%,-10%) scale(1.25)}}
@keyframes slosh{0%,100%{transform:translateX(0) rotate(-3deg)}50%{transform:translateX(-10%) rotate(3deg)}}
@keyframes pan{0%{transform:scale(1) translate(0,0)}100%{transform:scale(1.08) translate(-2%,-1.5%)}}
.f-liquid.full{padding:0;box-shadow:inset 0 0 0 .14em color-mix(in srgb,var(--c) 70%,#fff)}
.f-liquid.full .art{position:absolute;inset:0;border-radius:0}
.f-liquid.full .nm,.f-liquid.full .ft{position:relative;z-index:2;color:#fff;text-shadow:0 .05em .3em rgba(0,0,0,.6)}
.f-liquid.full .nm{padding:.65em .7em 0}.f-liquid.full .ft{margin-top:auto;padding:1.6em .7em .7em;background:linear-gradient(transparent,rgba(0,0,0,.55))}
/* gold prism: all gold */
.f-liquid.full .hf{position:absolute;inset:0;z-index:1;pointer-events:none;background:repeating-linear-gradient(115deg,#ff6fd8 0%,#ffd36b 8%,#6bffb0 16%,#5ff0ff 24%,#7c8bff 32%,#ff6fd8 40%);background-size:250% 250%;mix-blend-mode:color-dodge;opacity:.3;animation:hfx 6s linear infinite}
.f-liquid.full .hl{position:absolute;inset:0;z-index:1;pointer-events:none;background:repeating-linear-gradient(0deg,rgba(255,255,255,.07) 0 1px,transparent 1px 3px);mix-blend-mode:overlay}
.f-liquid.full .nm{background:linear-gradient(rgba(0,0,0,.5),transparent);padding:.65em .7em 1.2em!important}
.f-liquid.full .nm::after{content:"✦";flex:none;opacity:.9}
@keyframes hfx{to{background-position:200% 50%}}
.f-gold2{background:#120d05;color:#3a2604;padding:0;overflow:hidden}
.f-gold2 .gart{position:absolute;inset:0;background:radial-gradient(circle at 35% 30%,color-mix(in srgb,var(--c) 55%,#fff),var(--c) 55%,color-mix(in srgb,var(--c) 60%,#000))}
.f-gold2 .gglass{position:absolute;inset:0;background:linear-gradient(160deg,rgba(255,255,255,.25),transparent 40%)}
.f-gold2 .melt{position:absolute;left:0;right:0;top:-2%;width:100%;height:34%;animation:gdrip 4s ease-in-out infinite;filter:drop-shadow(0 .15em .25em rgba(80,50,5,.45))}
.f-gold2 .nm{position:relative;z-index:2;justify-content:center;padding:.75em .6em 0!important;text-shadow:0 1px 0 rgba(255,250,220,.6)}
.f-gold2 .ft{position:absolute;left:0;right:0;bottom:0;z-index:2;padding:.75em .7em .6em!important;color:#3a2604;text-shadow:0 1px 0 rgba(255,250,220,.5)}
.f-gold2 .gfoil{background:linear-gradient(110deg,#6e4f10,#c9962a 14%,#fff1bd 24%,#e3b23c 34%,#83600f 48%,#f0cc62 60%,#fffae2 68%,#c58f25 80%,#6e4f10);background-size:300% 100%;animation:hfx 7s linear infinite}
.f-gold2 .gsh{position:absolute;inset:0;z-index:3;pointer-events:none;background:linear-gradient(110deg,transparent 35%,rgba(255,255,255,.35) 47%,transparent 58%);background-size:250% 100%;animation:gsw 4.5s ease-in-out infinite;mix-blend-mode:overlay}
@keyframes gdrip{0%,100%{transform:translateY(0)}50%{transform:translateY(4%)}}@keyframes gsw{0%{background-position:150% 0}100%{background-position:-50% 0}}
@media (prefers-reduced-motion:reduce){.f-gold2 .melt,.f-gold2 .gsh,.f-gold2 .gfoil,.f-liquid.full .hf{animation:none}}
.f-gold2{color:#fff}.f-gold2 .kseam{position:absolute;inset:0;width:100%;height:100%;filter:drop-shadow(0 0 .25em rgba(255,214,120,.55))}
.f-gold2 .kseam .kg{animation:kglow 3.6s ease-in-out infinite}@keyframes kglow{0%,100%{opacity:.75}50%{opacity:1}}
.f-gold2 .nm{justify-content:flex-start!important;padding:.7em .7em 0!important;color:#fff;text-shadow:0 1px .4em rgba(0,0,0,.4)!important}
.f-gold2 .ft{color:#fff!important;text-shadow:0 1px .4em rgba(0,0,0,.45)!important;background:linear-gradient(transparent,rgba(0,0,0,.25))}
.f-gold2::after{content:"";position:absolute;inset:0;border-radius:inherit;box-shadow:inset 0 0 0 .2em #e8c66a,inset 0 0 0 .32em rgba(0,0,0,.25);pointer-events:none;z-index:4}
.f-gold{background:linear-gradient(110deg,#6e4f10,#c9962a 14%,#fff1bd 24%,#e3b23c 34%,#83600f 48%,#f0cc62 60%,#fffae2 68%,#c58f25 80%,#6e4f10);background-size:300% 100%;background-position:calc(var(--gp,0)*1% + var(--gs,0%)) 50%;color:#3a2604;animation:goldsh 6s linear infinite}
.f-gold .ft{color:#4a3206}
.f-gold .art{background:linear-gradient(180deg,color-mix(in srgb,var(--c) 75%,#fff),var(--c) 55%,color-mix(in srgb,var(--c) 70%,#000));box-shadow:inset 0 0 0 .14em #fff1bd,inset 0 0 0 .3em rgba(160,115,25,.85),inset 0 0 1.2em rgba(80,52,6,.45)}
.f-gold .art::after{content:"";position:absolute;inset:0;background:linear-gradient(110deg,transparent 20%,rgba(255,240,190,.55) 32%,transparent 44%,transparent 60%,rgba(255,225,140,.35) 70%,transparent 80%);background-size:300% 100%;animation:goldsh 5s linear infinite;mix-blend-mode:screen}
@keyframes goldsh{0%{background-position:0% 50%}100%{background-position:300% 50%}}
/* secret rare */
.f-secret{padding:.18em;background:conic-gradient(from var(--a,0deg),#ff5ad1,#ffd66b,#5affc8,#5aa8ff,#b45aff,#ff5ad1);animation:spinb 4s linear infinite}
@property --a{syntax:'<angle>';inherits:false;initial-value:0deg}
@keyframes spinb{to{--a:360deg}}
.f-secret .in{position:relative;height:100%;border-radius:5em;border-radius:5cqw;overflow:hidden;display:flex;flex-direction:column;background:#05030c}
.f-secret .qbg{position:absolute;inset:0;background-size:cover;background-position:center;animation:qdrift 14s ease-in-out infinite alternate}
@keyframes qdrift{0%{transform:scale(1.04)}100%{transform:scale(1.12) translate(-3%,-2%)}}
.f-secret .neb{position:absolute;inset:-40%;background:conic-gradient(from 0deg at 50% 45%,rgba(255,90,210,0),rgba(255,90,210,.3),rgba(90,255,200,.2),rgba(90,170,255,.3),rgba(255,214,107,.2),rgba(255,90,210,0));filter:blur(1em);mix-blend-mode:screen;opacity:.35;animation:spinn 9s linear infinite}
@keyframes spinn{to{transform:rotate(360deg)}}
.f-secret .shade{position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,.4),transparent 25%,transparent 68%,rgba(0,0,0,.65))}
.f-secret .spark{position:absolute;width:.18em;height:.18em;border-radius:50%;background:#fff;box-shadow:0 0 .4em #fff;animation:tw 2.4s ease-in-out infinite}
@keyframes tw{0%,100%{opacity:0;transform:scale(.5)}50%{opacity:1;transform:scale(1.4)}}
.f-secret .nm2{position:relative;z-index:2;margin-top:auto;padding:0 .7em;font:900 1.45em/1.05 var(--f);letter-spacing:-.03em;color:#fff;text-shadow:0 0 1em color-mix(in srgb,var(--c) 60%,#fff),0 .1em .4em rgba(0,0,0,.6)}
.f-secret .ft2{position:relative;z-index:2;display:flex;justify-content:space-between;padding:.4em .7em .75em;font:700 .78em var(--f);color:rgba(255,255,255,.82)}
.f-secret .ft2 .no{font:500 .78em var(--m);background:linear-gradient(90deg,#ff5ad1,#ffd66b,#5affc8);-webkit-background-clip:text;background-clip:text;color:transparent}
.bk{display:flex;align-items:center;justify-content:center}
.bk .wm{position:relative;z-index:3;display:flex;flex-direction:column;align-items:center;gap:.5em}
.bk .wm b{font:900 3.1em/1 var(--f);letter-spacing:-.06em}
.bk .wm span{font:800 .62em/1 var(--f);letter-spacing:.34em;text-transform:uppercase}
.bk .frame{position:absolute;inset:.5em;border-radius:.75em;pointer-events:none}
.b-std{background:#ecebe7;color:#2a2d33}
.b-std .frame{background:#dedcd6;box-shadow:inset 0 0 0 .06em rgba(0,0,0,.06)}
.b-std .wm span{color:#7a7e86}
.b-std .grain{position:absolute;inset:0;opacity:.35;background:repeating-linear-gradient(45deg,rgba(0,0,0,.025) 0 .15em,transparent .15em .4em)}
.b-holo{background:linear-gradient(160deg,#fbfcfd,#c9cfd6 45%,#f4f6f8);color:#3a4048}
.b-holo .frame{background:repeating-linear-gradient(calc(115deg + var(--gx,0)*1deg),rgba(255,255,255,.0) 0 .5em,rgba(255,255,255,.55) .5em .6em,rgba(150,160,175,.15) .6em 1.1em);box-shadow:inset 0 0 0 .08em rgba(255,255,255,.9),inset 0 0 1.5em rgba(120,130,145,.25)}
.b-holo .wm b{background:linear-gradient(180deg,#5d6670,#2c3238 55%,#6d7680);-webkit-background-clip:text;background-clip:text;color:transparent;filter:drop-shadow(0 .06em 0 rgba(255,255,255,.9))}
.b-holo .wm span{color:#6f7882}
.b-holo .sw{position:absolute;inset:-40% auto -40% 0;width:34%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.7),transparent);animation:glide 3.6s ease-in-out infinite;z-index:4}
.b-liquid{background:#0b1018;color:#eef3f7}
.b-liquid .frame{box-shadow:inset 0 0 0 .08em rgba(120,200,255,.35);overflow:hidden}
.b-liquid .wv{position:absolute;left:-30%;right:-30%;bottom:-6%;height:46%;border-radius:45% 55% 0 0/1.2em 1.6em 0 0;background:linear-gradient(180deg,rgba(65,227,170,.85),rgba(40,110,220,.85));animation:slosh 3.2s ease-in-out infinite}
.b-liquid .wv+.wv{height:40%;opacity:.6;background:linear-gradient(180deg,rgba(120,150,255,.8),rgba(30,60,160,.9));animation-duration:4.4s;animation-direction:reverse}
.b-liquid .bub{position:absolute;bottom:4%;width:.35em;height:.35em;border-radius:50%;background:rgba(255,255,255,.5);animation:rise 4s linear infinite}
@keyframes rise{0%{transform:translateY(0);opacity:0}15%{opacity:.8}100%{transform:translateY(-14em);opacity:0}}
.b-liquid .wm b{text-shadow:0 0 .6em rgba(65,227,170,.6)}.b-liquid .wm span{color:#9fd4ff}
.b-gold{background:linear-gradient(110deg,#6e4f10,#c9962a 14%,#fff1bd 24%,#e3b23c 34%,#83600f 48%,#f0cc62 60%,#fffae2 68%,#c58f25 80%,#6e4f10);background-size:300% 100%;animation:goldsh 6s linear infinite;color:#3a2604}
.b-gold .frame{box-shadow:inset 0 0 0 .1em rgba(255,248,210,.9),inset 0 0 0 .35em rgba(110,79,16,.35),inset 0 0 1.4em rgba(80,52,6,.4)}
.b-gold .wm b{color:#5a3d07;text-shadow:0 .06em 0 rgba(255,248,210,.75),0 -.04em 0 rgba(60,40,5,.5)}
.b-gold .wm span{color:#5a3d07}
.b-gold .rays{position:absolute;inset:-50%;background:repeating-conic-gradient(from 0deg,rgba(255,250,220,.22) 0 6deg,transparent 6deg 18deg);animation:spinn 30s linear infinite}
.b-secret{padding:.18em;background:conic-gradient(from var(--a,0deg),#ff5ad1,#ffd66b,#5affc8,#5aa8ff,#b45aff,#ff5ad1);animation:spinb 4s linear infinite}
.b-secret .in{position:absolute;inset:.18em;border-radius:5cqw;overflow:hidden;background:radial-gradient(120% 80% at 50% 40%,#1b1240,#05030c 70%);display:flex;align-items:center;justify-content:center}
.b-secret .au{position:absolute;inset:-30%;background:conic-gradient(from 0deg at 50% 50%,rgba(90,255,200,.0),rgba(90,255,200,.35),rgba(150,120,255,.35),rgba(255,110,210,.35),rgba(90,255,200,0));filter:blur(1.4em);animation:spinn 12s linear infinite}
.b-secret .wm b{background:linear-gradient(90deg,#ff5ad1,#ffd66b,#5affc8,#5aa8ff,#b45aff);background-size:200% 100%;-webkit-background-clip:text;background-clip:text;color:transparent;animation:goldsh 5s linear infinite;filter:drop-shadow(0 0 .4em rgba(255,255,255,.25))}
.b-secret .wm span{color:rgba(255,255,255,.75)}
.b-secret .spark{position:absolute;width:.16em;height:.16em;border-radius:50%;background:#fff;box-shadow:0 0 .4em #fff;animation:tw 2.4s ease-in-out infinite}
/* rarity glow under the card */
.cb::after{content:"";position:absolute;inset:8% 6% -4%;border-radius:12%;z-index:-1;filter:blur(18px);opacity:.55;background:var(--glow,transparent);transition:opacity .4s}
.bgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:16px 12px}
.bitem{display:flex;flex-direction:column;align-items:center;gap:6px}
.bitem .cb{--w:100%}
.bitem small{font:700 12px var(--f);color:var(--mut)}
.prog{display:flex;align-items:center;gap:10px;font:700 13px var(--f);color:var(--mut)}
.bar{flex:1;height:6px;border-radius:9px;background:rgba(255,255,255,.07);overflow:hidden}.bar i{display:block;height:100%;background:linear-gradient(90deg,rgb(var(--dna)),#9fd4ff)}
.cgrid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin-top:12px}
.slot{position:relative;padding:0;display:block}
.slot .cb{--w:100%}
.slot .ghost{width:100%;aspect-ratio:5/7;border-radius:9px;background:rgba(255,255,255,.03);box-shadow:inset 0 0 0 1px rgba(255,255,255,.06);display:flex;align-items:center;justify-content:center;font:500 11px var(--m);color:rgba(255,255,255,.25)}
.slot .qty{position:absolute;right:-4px;top:-6px;z-index:5;font:800 11px var(--f);padding:2px 7px;border-radius:99px;background:#eef3f7;color:#05070a}
.slot .tag{position:absolute;left:-4px;top:-6px;z-index:5;font:900 9px var(--f);letter-spacing:.1em;padding:2px 6px;border-radius:99px;background:rgb(var(--dna));color:#05070a}
.stage{position:fixed;inset:0;z-index:50;pointer-events:auto;display:none;flex-direction:column;align-items:center;justify-content:center;overflow:hidden;background:#04050a}
.stage.on{display:flex}
.swirl{position:absolute;inset:-50%;background:conic-gradient(from 0deg at 50% 50%,var(--s1),var(--s2),var(--s3),var(--s1));filter:blur(70px);opacity:.55;animation:spinn 22s linear infinite}
.swirl+.swirl{inset:-30%;animation-duration:31s;animation-direction:reverse;opacity:.35;background:conic-gradient(from 120deg at 40% 60%,var(--s3),transparent,var(--s1),transparent,var(--s2))}
.swirl,.dim{pointer-events:none}
.hbg{position:absolute;inset:0;width:100%;height:100%;z-index:0;pointer-events:none}
.swirl{display:none}
.dim{position:absolute;inset:0;background:radial-gradient(70% 55% at 50% 45%,transparent,rgba(0,0,0,.65))}
#fx{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:40}
.flash{position:absolute;inset:0;background:#fff;opacity:0;pointer-events:none;z-index:41}
.close{position:absolute;top:calc(env(safe-area-inset-top,0px) + 12px);right:16px;z-index:45;width:38px;height:38px;border-radius:50%;background:rgba(255,255,255,.08);font:700 18px var(--f)}
.hint{position:absolute;left:0;right:0;top:calc(env(safe-area-inset-top,0px) + 22px);text-align:center;font:700 12px var(--f);letter-spacing:.2em;text-transform:uppercase;color:rgba(255,255,255,.65);z-index:44;pointer-events:none;transition:opacity .3s}
.count{position:absolute;left:0;right:0;top:calc(env(safe-area-inset-top,0px) + 44px);text-align:center;font:700 12px var(--f);color:rgba(255,255,255,.45);z-index:44}
.packbig{position:relative;width:min(56vw,230px);aspect-ratio:2/3;z-index:30;touch-action:none;cursor:grab}
.packbig .pkx{width:100%;height:100%;animation:none;transform-style:preserve-3d}
.packbig .cap{position:absolute;left:0;right:0;top:0;height:14%;z-index:5;overflow:hidden;border-radius:10px 10px 0 0}
.packbig .cap .pkx{position:absolute;top:0;height:714%}
.packbig .tear{position:absolute;left:0;top:14%;height:3px;margin-top:-1px;border-radius:3px;width:0;z-index:6;background:linear-gradient(90deg,transparent,#fff);box-shadow:0 0 12px 3px rgba(255,255,255,.9),0 0 30px 6px var(--s2)}
.packbig .arrow{position:absolute;left:8%;right:8%;top:calc(14% - 9px);height:18px;z-index:6;pointer-events:none;background:linear-gradient(90deg,transparent,rgba(255,255,255,.75),transparent) no-repeat;background-size:30% 2px;background-position:-30% 50%;animation:swipe 1.6s ease-in-out infinite}
@keyframes swipe{to{background-position:130% 50%}}
.deck{position:absolute;z-index:20;left:50%;top:50%;width:var(--cw);aspect-ratio:5/7;transform:translate(-50%,-50%)}
.deck .slotc{position:absolute;inset:0}
.dock{position:absolute;left:0;right:0;bottom:calc(env(safe-area-inset-bottom,0px) + 22px);z-index:44;display:flex;flex-direction:column;align-items:center;gap:10px;padding:0 16px;opacity:0;transform:translateY(12px);transition:opacity .3s,transform .3s;pointer-events:none}
.dock.on{opacity:1;transform:none;pointer-events:auto}
.info{text-align:center;max-width:340px}
.info .rr{font:800 10px var(--f);letter-spacing:.24em;text-transform:uppercase}
.info .ff{font-size:12.5px;color:rgba(255,255,255,.7);margin-top:2px}
.info .rc{font:500 11px var(--m);color:rgba(255,255,255,.5);margin-top:3px}
.acts{display:flex;gap:10px}
.act{min-width:120px;padding:13px 18px;border-radius:999px;font:800 14px var(--f);background:rgba(255,255,255,.1);box-shadow:inset 0 0 0 .5px rgba(255,255,255,.18);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px)}
.act.keep{background:linear-gradient(180deg,rgba(65,227,170,.95),rgba(30,170,130,.95));color:#04140e;box-shadow:0 8px 24px -8px rgba(65,227,170,.7)}
.act small{font:700 11px var(--f);opacity:.75;margin-left:4px}
.tip{font:600 11px var(--f);color:rgba(255,255,255,.45)}
.sum{position:absolute;inset:0;z-index:43;display:none;flex-direction:column;align-items:center;justify-content:center;gap:18px;padding:20px}
.sum.on{display:flex;animation:tabIn .4s}
.sum h2{margin:0;font:900 28px var(--f);letter-spacing:-.03em}
.sum .row{display:flex;gap:10px}
.sum .row .cb{--w:min(26vw,110px)}
.rl{position:absolute;inset:0;z-index:15;pointer-events:none;opacity:0;background:repeating-conic-gradient(from 0deg at 50% 50%,rgba(255,255,255,.14) 0 4deg,transparent 4deg 16deg);animation:spinn 18s linear infinite}
.shake{animation:shk .45s}
@keyframes shk{20%{transform:translate(-6px,3px)}40%{transform:translate(5px,-4px)}60%{transform:translate(-4px,-2px)}80%{transform:translate(3px,4px)}}
@media (prefers-reduced-motion:reduce){.face *,.face,.swirl,.pkx{animation:none!important}}
</style><div class="page" id="page"><div class="in">
 <div class="hd"><div class="ttl">collection</div><div class="chroma" id="bal" aria-label="chroma"><i></i><span id="balN">0</span></div></div>
 <div class="seg" role="tablist"><i class="lens"></i><button data-s="packs" aria-pressed="true">packs</button><button data-s="col" aria-pressed="false">cards</button><button data-s="pp" aria-pressed="false">passport</button></div>
 <div class="vp" id="vp"><div class="track" id="track"><section class="view on" id="v-packs"><div class="sub" style="margin-top:0">base set packs</div><div class="packs" id="packs"></div><div class="odds" id="odds"></div></section><section class="view" id="v-col"><div class="prog"><span id="pN">0/50</span><div class="bar"><i id="pB" style="width:0"></i></div><span id="pS"></span></div><div class="pinnote" id="pinNote" hidden></div><div class="cgrid" id="cgrid"></div><div class="empty" id="cEmpty" hidden>open a pack to start your collection</div></section><section class="view" id="v-pp"><div class="book" id="book"></div></section></div></div>
</div></div><div class="stage" id="stage">
  <canvas class="hbg" id="hbg"></canvas><div class="swirl"></div><div class="dim" style="background:radial-gradient(70% 55% at 50% 45%,transparent,rgba(0,0,0,.45))"></div><div class="rl" id="rl"></div>
  <div class="hint" id="hint"></div><div class="count" id="count"></div>
  <button class="close" id="close" aria-label="close">✕</button>
  <div id="slotPack"></div>
  <div class="deck" id="deck"></div>
  <div class="dock" id="dock"><div class="info" id="info"></div><div class="acts" id="acts"></div></div>
  <div class="sum" id="sum"></div>
  <canvas id="fx"></canvas><div class="flash" id="flash"></div>
</div>

`;
const SET = [{"no":1,"r":"std","n":"cherry","hex":"#D01832","place":"giresun, turkey","fact":"the word cherry traces back to cerasus, the ancient name of giresun","tier":1,"recipe":"scarlet ×3"},{"no":2,"r":"std","n":"hot pink","hex":"#D31C7A","place":"jaipur, india","fact":"jaipur was painted pink in 1876 to welcome the prince of wales","tier":1,"recipe":"rose ×3"},{"no":3,"r":"std","n":"canary","hex":"#E6CF1E","place":"canary islands, spain","fact":"canary yellow comes from canaries, birds named after these islands","tier":1,"recipe":"lemon ×3"},{"no":4,"r":"std","n":"blood orange","hex":"#D1151D","place":"sicily, italy","fact":"cool nights around etna deepen the red of sicily's oranges","tier":1,"recipe":"scarlet ×3, tangerine ×1"},{"no":5,"r":"std","n":"clementine","hex":"#E6651B","place":"misserghin, algeria","fact":"named after brother clément, who grew it here around 1902","tier":1,"recipe":"tangerine ×3"},{"no":6,"r":"std","n":"apricot","hex":"#E6C69D","place":"armenia","fact":"its latin name, prunus armeniaca, links it to armenia","tier":1,"recipe":"tangerine ×1 + water"},{"no":7,"r":"std","n":"peach","hex":"#E2898D","place":"china","fact":"peaches were first domesticated in china","tier":2,"recipe":"tangerine ×1, rose ×1 + water"},{"no":8,"r":"std","n":"mauve","hex":"#CD77C7","place":"london, england","fact":"william perkin accidentally made mauve, the first synthetic dye, here in 1856","tier":2,"recipe":"violet ×1, rose ×1 + water"},{"no":9,"r":"std","n":"jet","hex":"#373742","place":"whitby, england","fact":"whitby jet was hugely popular in victorian jewelry","tier":1,"recipe":"ink ×3"},{"no":10,"r":"std","n":"wheat","hex":"#E6D39F","place":"karacadağ, turkey","fact":"einkorn wheat was first domesticated near here","tier":2,"recipe":"lemon ×1, tangerine ×1 + water"},{"no":11,"r":"std","n":"burgundy","hex":"#8E1429","place":"burgundy, france","fact":"named after the deep red wines of the region","tier":1,"recipe":"scarlet ×3, ink ×1"},{"no":12,"r":"std","n":"grape","hex":"#7F2AC0","place":"georgia","fact":"some of the oldest evidence of winemaking, about 8,000 years old","tier":1,"recipe":"violet ×3"},{"no":13,"r":"std","n":"magenta","hex":"#B31F8D","place":"magenta, italy","fact":"the dye was named after the battle of magenta in 1859","tier":1,"recipe":"rose ×2, violet ×1"},{"no":14,"r":"std","n":"lavender","hex":"#DAC7E2","place":"provence, france","fact":"provence's lavender fields bloom every summer","tier":1,"recipe":"violet ×1 + water"},{"no":15,"r":"std","n":"indigo","hex":"#152489","place":"india","fact":"from the greek for \"from india,\" where the dye was traded for millennia","tier":2,"recipe":"cobalt ×2, violet ×2, ink ×1"},{"no":16,"r":"std","n":"sienna","hex":"#652014","place":"siena, italy","fact":"earth pigment from the hills around siena","tier":2,"recipe":"tangerine ×2, scarlet ×1, ink ×2"},{"no":17,"r":"std","n":"ochre","hex":"#976D17","place":"roussillon, france","fact":"famous for its ochre cliffs and quarries","tier":2,"recipe":"lemon ×2, tangerine ×1, ink ×1"},{"no":18,"r":"std","n":"olive","hex":"#627C1A","place":"jaén, spain","fact":"one of the world's largest olive oil producing regions","tier":2,"recipe":"lemon ×2, leaf ×1, ink ×1"},{"no":19,"r":"std","n":"sage","hex":"#B7D37A","place":"dalmatian coast, croatia","fact":"common sage is native to the mediterranean","tier":2,"recipe":"leaf ×1, lemon ×1 + water"},{"no":20,"r":"std","n":"blush","hex":"#D21B5A","place":"petra, jordan","fact":"petra's rock glows soft pink at sunrise","tier":1,"recipe":"rose ×2, scarlet ×1"},{"no":21,"r":"std","n":"sand","hex":"#B59A5A","place":"the empty quarter, arabia","fact":"the largest continuous sand desert on earth","tier":3,"recipe":"lemon ×1, tangerine ×1, ink ×1 + water"},{"no":22,"r":"std","n":"cairo date","hex":"#714011","place":"cairo, egypt","fact":"cairo's khan el-khalili market dates back to the 14th century","tier":1,"recipe":"marigold ×1, cocoa ×4"},{"no":23,"r":"std","n":"angkor bronze","hex":"#6B5713","place":"angkor, cambodia","fact":"angkor wat is the largest religious monument in the world","tier":1,"recipe":"marigold ×2, ink ×2"},{"no":24,"r":"std","n":"tunis brass","hex":"#B5953F","place":"tunis, tunisia","fact":"the ruins of ancient carthage lie just outside tunis","tier":1,"recipe":"lemon ×1, cocoa ×1"},{"no":25,"r":"std","n":"kano mulberry","hex":"#7F295F","place":"kano, nigeria","fact":"kano's dye pits have been in use for centuries","tier":1,"recipe":"lemon ×1, violet ×3"},{"no":26,"r":"std","n":"honey","hex":"#E68514","place":"bicorp, spain","fact":"an 8,000-year-old cave painting here shows people gathering honey","tier":1,"recipe":"lemon ×2, tangerine ×2"},{"no":27,"r":"std","n":"vienna peony","hex":"#DF6DB8","place":"vienna, austria","fact":"vienna's coffee houses have been part of city life since the late 1600s","tier":1,"recipe":"rose ×1"},{"no":28,"r":"std","n":"hangzhou blossom","hex":"#D9A4B3","place":"hangzhou, china","fact":"hangzhou's longjing tea is one of china's most famous green teas","tier":3,"recipe":"lemon ×1, rose ×1, violet ×1 + water"},{"no":29,"r":"std","n":"white sands dune","hex":"#B69567","place":"white sands, usa","fact":"white sands is the largest gypsum dune field in the world","tier":2,"recipe":"lemon ×1, tangerine ×1, indigo ×1 + water"},{"no":30,"r":"std","n":"drakensberg meadow","hex":"#5DB14B","place":"drakensberg, south africa","fact":"the drakensberg holds thousands of ancient san rock paintings","tier":1,"recipe":"leaf ×2"},{"no":31,"r":"holo","n":"sapphire","hex":"#103795","place":"ratnapura, sri lanka","fact":"\"city of gems,\" known for sapphires","tier":2,"recipe":"cobalt ×3, violet ×1, ink ×1"},{"no":32,"r":"holo","n":"jade","hex":"#238249","place":"hotan, china","fact":"a source of nephrite jade since ancient times","tier":1,"recipe":"leaf ×2, cobalt ×1"},{"no":33,"r":"holo","n":"amber","hex":"#E6A21D","place":"baltic coast","fact":"the baltic is the world's largest source of amber","tier":1,"recipe":"lemon ×2, tangerine ×1"},{"no":34,"r":"holo","n":"turquoise","hex":"#6FB8AA","place":"nishapur, iran","fact":"\"turkish stone\"; persian turquoise was mined near nishapur","tier":2,"recipe":"cobalt ×1, leaf ×1 + water"},{"no":35,"r":"holo","n":"cusco sapphire","hex":"#1C4BC9","place":"cusco, peru","fact":"cusco was the capital of the inca empire","tier":1,"recipe":"violet ×1, cobalt ×2"},{"no":36,"r":"holo","n":"aswan bright lapis","hex":"#1615B0","place":"aswan, egypt","fact":"the granite for many ancient egyptian monuments was quarried at aswan","tier":1,"recipe":"violet ×4, cobalt ×2"},{"no":37,"r":"holo","n":"istanbul amethyst","hex":"#764DBD","place":"istanbul, türkiye","fact":"istanbul's grand bazaar has more than 60 covered streets","tier":1,"recipe":"violet ×1, indigo ×1"},{"no":38,"r":"holo","n":"saffron","hex":"#E6BC36","place":"khorasan, iran","fact":"most of the world's saffron is grown here","tier":2,"recipe":"lemon ×3, tangerine ×1 + water"},{"no":39,"r":"holo","n":"gold","hex":"#E6A415","place":"witwatersrand, south africa","fact":"a huge share of all gold ever mined came from here","tier":1,"recipe":"lemon ×3, tangerine ×1"},{"no":40,"r":"holo","n":"cerulean","hex":"#197480","place":"capri, italy","fact":"the blue grotto glows with light through the water","tier":1,"recipe":"cobalt ×2, leaf ×1"},{"no":41,"r":"holo","n":"santorini aubergine","hex":"#4A1232","place":"santorini, greece","fact":"santorini's cliffs are the rim of a flooded volcanic caldera","tier":2,"recipe":"scarlet ×3, violet ×1, teal ×1"},{"no":42,"r":"holo","n":"coral","hex":"#DF3D28","place":"great barrier reef, australia","fact":"the largest coral reef system on earth","tier":1,"recipe":"tangerine ×2, rose ×1"},{"no":43,"r":"liquid","n":"halong bay seafoam","hex":"#4BC7BD","place":"ha long bay, vietnam","fact":"ha long bay has around 1,600 limestone islands","tier":1,"recipe":"teal ×1","full":true},{"no":44,"r":"liquid","n":"glacier","hex":"#BFD9D5","place":"perito moreno, argentina","fact":"one of patagonia's best-known glaciers","tier":3,"recipe":"cobalt ×1, leaf ×1 + water","full":true},{"no":45,"r":"liquid","n":"red sea ocean","hex":"#207DD4","place":"red sea","fact":"the red sea is one of the saltiest seas on earth","tier":1,"recipe":"cobalt ×2","full":true},{"no":46,"r":"liquid","n":"baja night sea","hex":"#1F1282","place":"baja california, mexico","fact":"gray whales migrate to baja's lagoons to give birth","tier":1,"recipe":"violet ×1, indigo ×5","full":false},{"no":47,"r":"liquid","n":"lake bled reed","hex":"#423E17","place":"lake bled, slovenia","fact":"lake bled has slovenia's only natural island","tier":1,"recipe":"lemon ×2, ink ×3","full":false},{"no":48,"r":"liquid","n":"lake como basil","hex":"#1D7F11","place":"lake como, italy","fact":"lake como is one of the deepest lakes in europe","tier":1,"recipe":"leaf ×6","full":false},{"no":49,"r":"gold","n":"amethyst","hex":"#BD83D8","place":"artigas, uruguay","fact":"famous for deep purple amethyst geodes","tier":1,"recipe":"violet ×2 + water"},{"no":50,"r":"gold","n":"emerald","hex":"#1A782F","place":"muzo, colombia","fact":"muzo is famous for some of the finest emeralds","tier":1,"recipe":"leaf ×3, cobalt ×1"},{"no":51,"r":"secret","n":"quebec blueberry","hex":"#2E2157","place":"quebec, canada","fact":"quebec's lac-saint-jean region is famous for its wild blueberries","tier":1,"recipe":"indigo ×3, cocoa ×1"}];
@@ data/art.js @@
const BG=(()=>{const cv=R.getElementById('hbg');let fl=null,on=false,last=0,t=0,acc=0,fade=0,cols=[[.32,.82,1],[.18,.55,.95],[.36,.95,.78],[.62,.9,1]];
 const EM=[[23,31,0,1.3],[29,19,2.1,.4],[37,26,4.2,2.8],[18,40,1.1,5.0],[33,22,3.3,3.9]].map(([tx,ty,a,b],i)=>({tx,ty,a,b,sp:6+i,next:1+i*.45}));
 const fg={tx:0,ty:0,x:0,y:0,px:0,py:0,on:false,fresh:true,dyeT:0,col:null};
 const ep=(e,tt)=>[.5+.36*Math.sin(2*Math.PI*tt/e.tx+e.a),.5+.36*Math.sin(2*Math.PI*tt/e.ty+e.b)];
 function build(){cv.width=Math.max(64,Math.round(innerWidth*.48));cv.height=Math.max(64,Math.round(innerHeight*.48));if(fl)fl.free();fl=introFluid(cv,{sim:56,dye:224,it:7,sc:.48,curl:1.5,vdis:.35,ddis:.07});for(let i=0;i<6;i++)fl.splatD(.5+(Math.random()-.5)*.5,.5+(Math.random()-.5)*.5,cols[i%cols.length].map(v=>v*.6),.03);}
 function step(dt){t+=dt;for(const e of EM){const [x,y]=ep(e,t),[x2,y2]=ep(e,t+.1);let dx=x2-x,dy=y2-y;const l=Math.hypot(dx,dy)||1;fl.push(x,y,dx/l*e.sp,dy/l*e.sp,.04,.05);if(t>=e.next){e.next=t+4+Math.random()*2.5;fl.splatD(x,y,cols[Math.random()*cols.length|0].map(v=>v*.3),.03);}}
  if(fg.on){const k=1-Math.exp(-dt/.08);if(fg.fresh){fg.x=fg.tx;fg.y=fg.ty;fg.fresh=false;}fg.px=fg.x;fg.py=fg.y;fg.x+=(fg.tx-fg.x)*k;fg.y+=(fg.ty-fg.y)*k;let vx=(fg.x-fg.px)/dt*160,vy=(fg.y-fg.py)/dt*160;const m=Math.hypot(vx,vy);if(m>90){vx*=90/m;vy*=90/m;}if(m>.5){fl.push(fg.x,fg.y,vx,vy,.008,.5);fg.dyeT+=dt;if(fg.dyeT>.06){fg.dyeT=0;fl.splatD(fg.x,fg.y,(fg.col||cols[Math.random()*cols.length|0]).map(v=>v*.12),.005);}}}
  fl.swirl(.5+.07*Math.sin(t*.13),.5+.07*Math.cos(t*.11),.11,.02);fl.step(dt);}
 function loop(now){if(!on)return;requestAnimationFrame(loop);const ft=last?now-last:16;last=now;const dt=Math.min(.1,ft/1000);acc+=dt;let n=0;try{while(acc>=1/60&&n<2){step(1/60);acc-=1/60;n++;}if(acc>.04)acc=0;fade+=(1-fade)*(1-Math.exp(-dt/.5));fl.show(fade,9);}catch(e){on=false;cv.style.display='none';}}
 return{start(p){try{if(!fl)build();}catch(e){cv.style.display='none';return;}if(p)cols=p;for(let i=0;i<5;i++)fl.splatD(Math.random(),Math.random(),cols[i%cols.length].map(v=>v*.5),.03);if(!on){on=true;fade=.15;last=0;requestAnimationFrame(loop);}},
  stop(){on=false;},
  warm(){try{if(!fl)build();}catch(e){}},
  touchPx(cx,cy,col){if(!fl)return;fg.tx=clamp(cx/innerWidth,0,1);fg.ty=1-clamp(cy/innerHeight,0,1);fg.col=col||null;if(!fg.on){fg.on=true;fg.fresh=true;}},
  release(){fg.on=false;},
  splash(cx,cy,rgb,amt=.6,rad=.03,n=1){if(!fl)return;const x=clamp(cx/innerWidth,0,1),y=1-clamp(cy/innerHeight,0,1);for(let i=0;i<n;i++){const a=Math.random()*6.28,s=20+Math.random()*40;fl.push(x,y,Math.cos(a)*s,Math.sin(a)*s,.02,.6);fl.splatD(x+(Math.random()-.5)*.08,y+(Math.random()-.5)*.08,rgb.map(v=>v*amt),rad);}}};})();
const hex2=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16)/255);

const RAR = {std:{label:'Standard',col:'#c9ccd2',glow:'rgba(255,255,255,.25)',sell:2},holo:{label:'Holo',col:'#dfe6ee',glow:'rgba(200,215,235,.6)',sell:5},liquid:{label:'Liquid',col:'#5ff0d0',glow:'var(--c)',sell:10},gold:{label:'Gold Prism',col:'#ffd58a',glow:'rgba(255,195,80,.85)',sell:30},secret:{label:'Secret Rare',col:'#ff9ae6',glow:'conic-gradient(#ff5ad1,#ffd66b,#5affc8,#5aa8ff,#b45aff,#ff5ad1)',sell:100}};
const RANK = {std:0,holo:1,liquid:2,gold:3,secret:4};
const PACKS = [
  {id:'std',fp:[[.55,.6,.68],[.32,.36,.42],[.75,.78,.84],[.45,.5,.58]],cls:'p-std',name:'Standard',cost:15,odds:{std:86,holo:11.6,liquid:2.1,gold:.3},sw:['rgba(140,150,165,.6)','rgba(60,70,85,.6)','rgba(200,205,215,.5)']},
  {id:'rare',fp:[[1,.25,.35],[.7,.06,.2],[1,.55,.45],[.85,.15,.3]],cls:'p-rare',name:'Rare',cost:40,odds:{std:54,holo:33,liquid:11,gold:2},floor:'holo',sw:['rgba(255,60,90,.75)','rgba(120,10,40,.7)','rgba(255,150,120,.5)']},
  {id:'prem',fp:[[1,.8,.35],[.5,.25,1],[1,.4,.8],[.75,.55,1]],cls:'p-prem',name:'Premium',cost:100,odds:{std:22,holo:45,liquid:24,gold:8.85,secret:.15},floor:'liquid',sw:['rgba(255,205,90,.75)','rgba(130,60,255,.8)','rgba(255,90,200,.5)']}];
/* ---------- state ---------- */
const st={get bal(){return save.chroma||0},set bal(v){save.chroma=Math.max(0,Math.round(v))},get own(){return save.cards||(save.cards={})}};const keep=()=>{try{persist();}catch(e){}};
const $=s=>R.querySelector(s);
const esc=s=>String(s).replace(/[&<>"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));
let balShown=null,balRaf=0;function rollBal(){const el=$('#balN'),to=st.bal;cancelAnimationFrame(balRaf);if(balShown===to)return;if(balShown==null||host.hidden||matchMedia('(prefers-reduced-motion: reduce)').matches){balShown=to;el.textContent=to;return;}const from=balShown,t0=performance.now();cancelAnimationFrame(balRaf);const f=now=>{const k=Math.min(1,(now-t0)/420),e=1-Math.pow(1-k,3);balShown=Math.round(from+(to-from)*e);el.textContent=balShown;if(k<1)balRaf=requestAnimationFrame(f);};balRaf=requestAnimationFrame(f);}
function setBal(d){st.bal+=d;if(d)keep();rollBal();if(d){const b=$('#bal');b.classList.remove('bump');void b.offsetWidth;b.classList.add('bump');}R.querySelectorAll('.pk').forEach(p=>p.disabled=st.bal<+p.dataset.cost);}
/* ---------- card markup ---------- */
function front(c){const no=c.no===51?'51/50':String(c.no).padStart(2,'0')+'/50';
  if(c.r==='secret'){let sp='';for(let i=0;i<14;i++)sp+=`<i class="spark" style="left:${(i*37)%100}%;top:${(i*53)%90}%;animation-delay:${(i*.31).toFixed(2)}s"></i>`;
    return `<div class="face f-secret"><div class="in"><div class="qbg" style="background-image:url(${ART.__quebec})"></div><div class="neb"></div><div class="shade"></div>${sp}<div class="nm2">${esc(c.n)}</div><div class="ft2"><span>${esc(c.place)}</span><span class="no">${no}</span></div></div><div class="glare"></div></div>`;}
  const art=c.r==='liquid'?`<div class="art"><div class="pan" style="background-image:url(${ART[c.n]})"></div><i></i><i></i><b></b></div>`:`<div class="art"></div>`;
  if(c.r==='gold')return `<div class="face fr f-gold2"><div class="gart"></div><svg class="kseam" viewBox="0 0 63 88" preserveAspectRatio="none"><g fill="none" stroke-linecap="round"><path d="M-2 30 C10 28 14 36 22 34 S34 22 40 26 52 40 66 36" stroke="#a8781c" stroke-width="1.44"/><path class="kg" d="M-2 30 C10 28 14 36 22 34 S34 22 40 26 52 40 66 36" stroke="#fff1bd" stroke-width="0.60"/><path d="M22 34 C24 46 18 54 26 64 S30 80 28 92" stroke="#a8781c" stroke-width="1.20"/><path class="kg" d="M22 34 C24 46 18 54 26 64 S30 80 28 92" stroke="#ffe08a" stroke-width="0.48"/><path d="M40 26 C44 18 42 10 48 -2" stroke="#a8781c" stroke-width="0.96"/><path class="kg" d="M40 26 C44 18 42 10 48 -2" stroke="#fff1bd" stroke-width="0.36"/><path d="M26 64 C36 62 44 70 66 66" stroke="#a8781c" stroke-width="0.96"/><path class="kg" d="M26 64 C36 62 44 70 66 66" stroke="#ffe08a" stroke-width="0.36"/></g></svg><div class="nm"><span>${esc(c.n)} ★</span></div><div class="ft"><span>${esc(c.place)}</span><span class="no">${no}</span></div><div class="gsh"></div><div class="glare"></div></div>`;
  return `<div class="face fr f-${c.r}${c.full?' full':''}"><div class="nm"><span>${esc(c.n)}</span>${c.r==='gold'?'<span>★</span>':''}</div>${art}<div class="ft"><span>${esc(c.place)}</span><span class="no">${no}</span></div>${c.r==='holo'?'<i class="sw"></i>':''}${c.r==='liquid'&&c.full?'<i class="hf"></i><i class="hl"></i>':''}<div class="glare"></div></div>`;}
function back(r){const wm=`<div class="wm"><b>mix.io</b><span>base set</span></div>`;
  if(r==='std')return `<div class="face bk b-std"><div class="frame"></div><div class="grain"></div>${wm}</div>`;
  if(r==='holo')return `<div class="face bk b-holo"><div class="frame"></div><i class="sw"></i>${wm}<div class="glare"></div></div>`;
  if(r==='liquid'){let bb='';for(let i=0;i<6;i++)bb+=`<i class="bub" style="left:${10+i*15}%;animation-delay:${(i*.7).toFixed(1)}s"></i>`;return `<div class="face bk b-liquid"><div class="frame"></div><div class="wv"></div><div class="wv"></div>${bb}${wm}</div>`;}
  if(r==='gold')return `<div class="face bk b-gold"><div class="rays"></div><div class="frame"></div>${wm}<div class="glare"></div></div>`;
  let sp='';for(let i=0;i<16;i++)sp+=`<i class="spark" style="left:${(i*41)%100}%;top:${(i*29)%100}%;animation-delay:${(i*.27).toFixed(2)}s"></i>`;
  return `<div class="face bk b-secret"><div class="in"><div class="au"></div>${sp}${wm}</div></div>`;}
function makeCard(c,{showBack=false,w}={}){const el=document.createElement('div');el.className='cb';el.style.setProperty('--c',c.hex);if(w)el.style.setProperty('--w',w);
  el.style.setProperty('--glow',RAR[c.r].glow==='var(--c)'?c.hex:RAR[c.r].glow);
  el.innerHTML=`<div class="rot">${front(c)}${back(c.r)}</div>`;el._c=c;el._ry=showBack?180:0;el._rx=0;applyRot(el);return el;}
function applyRot(el){const r=el.querySelector('.rot');r.style.transform=`rotateX(${el._rx}deg) rotateY(${el._ry}deg)`;
  const n=((el._ry%360)+360)%360, g=Math.sin(n*Math.PI/180);el.style.setProperty('--gp',(g*60).toFixed(1));el.style.setProperty('--gx',(g*30+el._rx).toFixed(1));el.style.setProperty('--ga',(0.12+Math.abs(g)*.45).toFixed(2));}
/* drag to rotate (full turn side to side), tap to flip, snaps to nearest face */
function interactive(el,onTap){let sx,sy,ry0,rx0,moved,vx=0,lx,lt,raf;
  const snap=(target)=>{cancelAnimationFrame(raf);const from=el._ry,fx=el._rx,t0=performance.now(),D=520;
    const step=t=>{const k=Math.min(1,(t-t0)/D),e=1-Math.pow(1-k,3)+Math.sin(k*Math.PI)*0.06*(1-k);el._ry=from+(target-from)*e;el._rx=fx*(1-e);applyRot(el);if(k<1)raf=requestAnimationFrame(step);else{el._ry=target;el._rx=0;applyRot(el);}};raf=requestAnimationFrame(step);};
  el._snap=snap;el._flip=()=>snap(Math.round(el._ry/180)*180+180);
  el.addEventListener('pointerdown',e=>{cancelAnimationFrame(raf);el.setPointerCapture(e.pointerId);sx=lx=e.clientX;sy=e.clientY;ry0=el._ry;rx0=el._rx;moved=false;vx=0;lt=performance.now();});
  el.addEventListener('pointermove',e=>{if(sx==null)return;const dx=e.clientX-sx,dy=e.clientY-sy;if(Math.abs(dx)+Math.abs(dy)>6)moved=true;if(!moved)return;
    const now=performance.now();vx=(e.clientX-lx)/Math.max(1,now-lt);lx=e.clientX;lt=now;el._ry=ry0+dx*.75;el._rx=Math.max(-22,Math.min(22,rx0-dy*.25));applyRot(el);});
  const up=e=>{if(sx==null)return;sx=null;if(!moved){onTap?onTap(el):el._flip();return;}const proj=el._ry+vx*220;snap(Math.round(proj/180)*180);};
  el.addEventListener('pointerup',up);el.addEventListener('pointercancel',up);
  el.tabIndex=0;el.setAttribute('role','button');el.setAttribute('aria-label',el._c.n+' card, press to flip');
  el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();el._flip();}if(e.key==='ArrowLeft')snap(Math.round(el._ry/180)*180-180);if(e.key==='ArrowRight')snap(Math.round(el._ry/180)*180+180);});}
/* ---------- packs view ---------- */
function packArt(p,big){return `<div class="pkx ${p.cls}">${p.id!=='std'?'<div class="sh"'+(p.id==='rare'?' style="opacity:.45"':'')+'></div>':''}<div class="crimp t"></div><div class="crimp b"></div><div class="lab"><b>mix.io</b><span>${p.name.toUpperCase()}</span></div></div>`;}
function renderPacks(){const FP=save.freePk||{};$('#packs').innerHTML=PACKS.map(p=>{const f=FP[p.id]||0;return `<button class="pk${f?' free':''}" data-id="${p.id}" data-cost="${f?0:p.cost}">${packArt(p)}<span class="nm">${p.name}</span><span class="pr">${f?`<b class="fpk">free${f>1?' ×'+f:''}</b>`:`<i></i>${p.cost}`}</span></button>`}).join('');
  R.querySelectorAll('.pk').forEach(b=>b.onclick=()=>openPack(PACKS.find(p=>p.id===b.dataset.id)));
  const fmt=o=>Object.entries(o).map(([k,v])=>`${RAR[k].label.toLowerCase()} ${v}%`).join(' · ');
  {const OC={std:'#b9bec7',holo:'#dfeaf7',liquid:'#41e3aa',gold:'#ffc24a',secret:'#ff6ad5'};
   const donut=o=>{let a=0;const st=Object.entries(o).map(([k,v])=>{const s=a;a+=v;return `${OC[k]} ${s}% ${a}%`;}).join(',');return `<div class="dn" style="background:conic-gradient(from -90deg,${st})"><i></i></div>`;};
   const pc=v=>v>=1?Math.round(v)+'%':v+'%';
   $('#odds').innerHTML=`<div class="oh">pack odds</div><div class="og">`+PACKS.map(p=>`<div class="oc">${donut(p.odds)}<b>${p.name.toLowerCase()}</b><ul>${Object.entries(p.odds).map(([k,v])=>`<li><i style="background:${OC[k]}"></i><span>${({std:'standard',holo:'holo',liquid:'liquid',gold:'gold',secret:'secret'})[k]}</span><em>${pc(v)}</em></li>`).join('')}</ul>${p.floor?`<small>${RAR[p.floor].label.toLowerCase()}+ guaranteed</small>`:''}</div>`).join('')+`</div>`;}
  setBal(0);}
/* ---------- rolling ---------- */
function rollR(p){let x=Math.random()*100;for(const [k,v] of Object.entries(p.odds)){if((x-=v)<0)return k;}return 'std';}
function pickCard(r){const pool=SET.filter(c=>c.r===r);return pool[Math.floor(Math.random()*pool.length)];}
function roll(p){let rs=[rollR(p),rollR(p),rollR(p)];if(p.floor&&!rs.some(r=>RANK[r]>=RANK[p.floor]))rs[2]=p.floor;if(force){rs[0]='secret';}
  const cards=rs.map(r=>Object.assign({},pickCard(r)));cards.sort((a,b)=>RANK[a.r]-RANK[b.r]);return cards;}  /* rarest sits at the very back */
let force=false;
/* ---------- fx ---------- */
const fx=$('#fx'),cx=fx.getContext('2d');let parts=[],fxOn=false;
function sizeFx(){const d=Math.min(2,devicePixelRatio||1);fx.width=innerWidth*d;fx.height=innerHeight*d;cx.setTransform(d,0,0,d,0,0);}
addEventListener('resize',sizeFx);
function burst(x,y,cols,n=60,spd=7,size=3,grav=.12){for(let i=0;i<n;i++){const a=Math.random()*Math.PI*2,s=spd*(.3+Math.random());parts.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s-1.5,l:1,d:.008+Math.random()*.014,c:cols[i%cols.length],s:size*(.5+Math.random()),g:grav,rot:Math.random()*6,sq:Math.random()<.5});}if(!fxOn){fxOn=true;requestAnimationFrame(tick);}}
let trail=[];
function tick(){cx.clearRect(0,0,innerWidth,innerHeight);const tn=performance.now();trail=trail.filter(q=>tn-q.t<260);if(trail.length>1){cx.lineCap='round';cx.lineJoin='round';for(let i=1;i<trail.length;i++){const a=1-(tn-trail[i].t)/260;cx.strokeStyle=`rgba(255,255,255,${a})`;cx.shadowColor='rgba(255,255,255,.9)';cx.shadowBlur=14;cx.lineWidth=1+a*6;cx.beginPath();cx.moveTo(trail[i-1].x,trail[i-1].y);cx.lineTo(trail[i].x,trail[i].y);cx.stroke();}cx.shadowBlur=0;}parts=parts.filter(p=>p.l>0);for(const p of parts){p.x+=p.vx;p.y+=p.vy;p.vy+=p.g;p.vx*=.985;p.l-=p.d;p.rot+=.1;cx.globalAlpha=Math.max(0,p.l);cx.fillStyle=p.c;if(p.sq){cx.save();cx.translate(p.x,p.y);cx.rotate(p.rot);cx.fillRect(-p.s,-p.s/2,p.s*2,p.s);cx.restore();}else{cx.beginPath();cx.arc(p.x,p.y,p.s,0,7);cx.fill();}}cx.globalAlpha=1;if(parts.length||trail.length)requestAnimationFrame(tick);else fxOn=false;}
function flash(o=.9,d=500){$('#flash').animate([{opacity:o},{opacity:0}],{duration:d,easing:'ease-out'});}
const vib=p=>{try{navigator.vibrate&&navigator.vibrate(p);}catch(e){}};
/* ---------- opening ---------- */
let cur=null,gen=0;
function openPack(p){gen++;const FP=save.freePk||(save.freePk={});if(FP[p.id]>0){FP[p.id]--;keep();}else{if(st.bal<p.cost)return;setBal(-p.cost);}try{renderPacks();}catch(e){}cur={p,cards:roll(p),i:0,res:[],g:gen};
  const S=$('#stage');S.style.setProperty('--s1',p.sw[0]);S.style.setProperty('--s2',p.sw[1]);S.style.setProperty('--s3',p.sw[2]);
  host.classList.add('kstage');S.classList.add('on');sizeFx();setTimeout(()=>{if(S.classList.contains('on'))BG.start(p.fp);},720);$('#deck').innerHTML='';$('#sum').classList.remove('on');$('#dock').classList.remove('on');$('#rl').style.opacity=0;$('#count').textContent='';
  $('#hint').textContent='swipe across the pack to open';$('#hint').style.opacity=1;
  const W=Math.min(innerWidth*.56,230);$('#deck').style.setProperty('--cw',Math.min(innerWidth*.72,300)+'px');
  const pk=document.createElement('div');pk.className='packbig';pk.innerHTML=`${packArt(p)}<div class="cap">${packArt(p)}</div><div class="tear"></div><div class="arrow"></div>`;
  $('#slotPack').innerHTML='';$('#slotPack').appendChild(pk);
  pk.animate([{transform:'translateY(60vh) rotate(-8deg) scale(.7)',opacity:0},{transform:'translateY(-10px) rotate(2deg) scale(1.02)',opacity:1,offset:.7},{transform:'none',opacity:1}],{duration:700,easing:'cubic-bezier(.2,.8,.2,1)'});
  // tilt + tear
  let sx=null,prog=0,done=false,pr=null,prT=0;const tear=pk.querySelector('.tear'),rect=()=>{const t=performance.now();if(!pr||(sx==null&&t-prT>250)){pk.style.transform='';pr=pk.getBoundingClientRect();prT=t;}return pr;};
  const zone=R.getElementById('stage');
  zone.onpointermove=e=>{if(!pk.isConnected||done)return;const r=rect();if(sx==null){const ax=(e.clientX-r.left)/r.width-.5,ay=(e.clientY-r.top)/r.height-.5;pk.style.transform=`perspective(700px) rotateY(${Math.max(-.6,Math.min(.6,ax))*18}deg) rotateX(${-Math.max(-.6,Math.min(.6,ay))*14}deg)`;return;}
    const dir=Math.sign(e.clientX-sx)||1;prog=Math.max(prog,Math.min(1,Math.abs(e.clientX-sx)/(r.width*.55)));
    tear.style.width=(prog*100)+'%';tear.style.left=dir>0?'0':'auto';tear.style.right=dir>0?'auto':'0';tear.style.background=`linear-gradient(${dir>0?90:270}deg,transparent,#fff)`;
    pk.querySelector('.arrow').style.opacity=0;pk.style.transform=`perspective(700px) rotateZ(${dir*prog*3}deg) scale(${1+prog*.04})`;
    trail.push({x:e.clientX,y:e.clientY,t:performance.now()});if(!fxOn){fxOn=true;requestAnimationFrame(tick);}
    const ex=dir>0?r.left+r.width*prog:r.right-r.width*prog;burst(ex,r.top+r.height*.14,['#fff','#fff',p.sw[2],p.sw[0]],3,3.5,1.6,.08);vib(4);
    if(prog>=1){BG.splash(ex,r.top+r.height*.14,p.fp[0],.9,.05,4);done=true;zone.onpointermove=zone.onpointerdown=zone.onpointerup=null;tearOpen(pk,dir);}};
  zone.onpointerdown=e=>{if(done||e.target.closest('.close'))return;pr=null;const r=rect();if(e.clientY>r.bottom+60||e.clientY<r.top-140)return;sx=e.clientX;prog=0;};
  zone.onpointerup=zone.onpointercancel=()=>{if(done)return;sx=null;tear.animate([{width:tear.style.width},{width:'0%'}],{duration:250});tear.style.width='0%';pk.style.transform='';};
}
function tearOpen(pk,dir=1){const p=cur.p,r=pk.getBoundingClientRect();vib(30);$('#hint').style.opacity=0;
  const cap=pk.querySelector('.cap');cap.style.transformOrigin=dir>0?'100% 100%':'0% 100%';cap.animate([{transform:'none'},{transform:`rotate(${dir*-14}deg) translateY(-12%)`,offset:.25},{transform:`translate(${dir*140}%,-260%) rotate(${dir*50}deg)`,opacity:0}],{duration:800,easing:'cubic-bezier(.3,.6,.3,1)',fill:'forwards'});
  const glow=document.createElement('div');glow.style.cssText=`position:absolute;left:-10%;right:-10%;top:10%;height:10%;z-index:7;background:radial-gradient(50% 100% at 50% 50%,#fff,${p.sw[2]} 40%,transparent 70%);filter:blur(6px);pointer-events:none`;pk.appendChild(glow);glow.animate([{opacity:0,transform:'scaleY(.2)'},{opacity:1,transform:'scaleY(3)'},{opacity:0,transform:'scaleY(6)'}],{duration:700,fill:'forwards'});
  for(let k=0;k<3;k++)setTimeout(()=>burst(r.left+r.width*(.2+Math.random()*.6),r.top+r.height*.14,['#fff',p.sw[0],p.sw[2]],25,5,2,.12),k*90);
  pk.querySelector('.tear').style.opacity=0;burst(r.left+r.width/2,r.top+r.height*.14,['#fff',p.sw[0],p.sw[2]],50,6,2.5,.1);flash(.5,350);
  // cards rise out of the pack
  const deck=$('#deck');deck.innerHTML='';const cw=parseFloat(deck.style.getPropertyValue('--cw'));
  const order=cur.cards.slice().reverse(); // last appended sits on top -> first card (rarest) on top
  order.forEach((c,k)=>{const el=makeCard(c,{w:cw+'px'});const s=document.createElement('div');s.className='slotc';s.appendChild(el);s.style.zIndex=k;deck.appendChild(s);c._el=el;c._s=s;});
  const pkTop=r.top+r.height*.14, deckMid=innerHeight/2;
  [...deck.children].forEach((s,k)=>{s.animate([{transform:`translateY(${pkTop-deckMid+cw*.7}px) scale(.62)`,clipPath:'inset(0 0 100% 0)'},{transform:`translateY(${pkTop-deckMid-40}px) scale(.7)`,clipPath:'inset(0 0 0 0)',offset:.55},{transform:`translateY(${(k-2)*-4}px) rotate(${(k-2)*2.5}deg)`}],{duration:1100,delay:250,easing:'cubic-bezier(.2,.8,.2,1)',fill:'both'});});
  pk.animate([{transform:pk.style.transform||'none',opacity:1},{transform:'translateY(70vh) rotate(8deg)',opacity:0}],{duration:800,delay:650,easing:'cubic-bezier(.5,0,.8,.4)',fill:'forwards'});
  const g=gen;setTimeout(()=>{if(g!==gen||!cur)return;$('#slotPack').innerHTML='';showTop();},1500);}
function showTop(){if(!cur||!$('#stage').classList.contains('on'))return;const c=cur.cards[cur.i];$('#count').textContent=`${cur.i+1} of 3`;$('#hint').style.opacity=0;$('#dock').classList.remove('on');
  const el=c._el;el.style.setProperty('--glow',RAR[c.r].glow==='var(--c)'?c.hex:RAR[c.r].glow);
  // rarer backs pulse before the flip
  interactive(el);if(cur.i>0)c._s.animate([{transform:'translateY(-18px) scale(.92) rotateX(18deg)',filter:'brightness(.6)'},{transform:'translateY(6px) scale(1.04)',filter:'brightness(1.25)',offset:.6},{transform:'none',filter:'brightness(1)'}],{duration:520,easing:'cubic-bezier(.2,.8,.2,1)'});reveal(c);}
function reveal(c){const el=c._el;el._rev=true;$('#hint').style.opacity=0;c._s.getAnimations().forEach(a=>{if(a.iterations===Infinity)a.cancel();});
  const r=el.getBoundingClientRect(),x=r.left+r.width/2,y=r.top+r.height/2;const R=c.r;const S=$('#stage');
  const dur=R==='secret'?1600:R==='gold'?1100:R==='liquid'?800:420;
  if(R==='secret'){$('#rl').animate([{opacity:0},{opacity:1}],{duration:900,fill:'forwards'});S.animate([{filter:'brightness(1)'},{filter:'brightness(.35)'},{filter:'brightness(1)'}],{duration:1400});vib([40,60,40,60,120]);}
  else if(R==='gold'){$('#rl').animate([{opacity:0},{opacity:.6}],{duration:700,fill:'forwards'});vib([30,40,80]);}
  else{$('#rl').style.opacity=0;}
  c._s.animate([{transform:'scale(1)'},{transform:'scale(1.12) translateY(-12px)',offset:.5},{transform:'scale(1)'}],{duration:dur,easing:'cubic-bezier(.2,.8,.2,1)'});
  const from=el._ry,t0=performance.now();const spins=R==='secret'?2:R==='gold'||R==='liquid'?1:0;const target=from+spins*360;
  const step=t=>{const k=Math.min(1,(t-t0)/dur),e=1-Math.pow(1-k,4);el._ry=from+(target-from)*e;el._rx=0;applyRot(el);if(k<1)requestAnimationFrame(step);else{el._ry=target%360;applyRot(el);}};requestAnimationFrame(step);
  setTimeout(()=>{const cols={std:['#fff',c.hex],holo:['#fff','#dfe6ee','#b8c2cc',c.hex],liquid:['#fff',c.hex,'#5ff0d0','#9fd4ff'],gold:['#fff1bd','#e3b23c','#fffae2','#c9962a'],secret:['#ff5ad1','#ffd66b','#5affc8','#5aa8ff','#b45aff','#fff']}[R];
    const n={std:24,holo:45,liquid:70,gold:140,secret:260}[R];burst(x,y,cols,n,{std:4,holo:6,liquid:7,gold:10,secret:13}[R],{std:2,holo:2.5,liquid:3,gold:3.5,secret:3.5}[R],R==='liquid'?.04:.12);
    if(RANK[R]>=1){const ring=document.createElement('div');ring.style.cssText=`position:absolute;left:${x}px;top:${y}px;width:40px;height:40px;margin:-20px 0 0 -20px;border-radius:50%;z-index:39;pointer-events:none;border:3px solid ${R==='gold'?'#ffe7a0':R==='secret'?'#fff':R==='liquid'?c.hex:'#e6ecf3'};box-shadow:0 0 30px ${R==='gold'?'#ffc24a':'rgba(255,255,255,.7)'}`;S.appendChild(ring);ring.animate([{transform:'scale(.5)',opacity:1},{transform:`scale(${R==='secret'?22:R==='gold'?16:10})`,opacity:0}],{duration:R==='secret'?1100:800,easing:'cubic-bezier(.2,.8,.2,1)'}).onfinish=()=>ring.remove();}
    if(RANK[R]>=3){flash(R==='secret'?1:.7,R==='secret'?900:500);S.classList.remove('shake');void S.offsetWidth;S.classList.add('shake');}
    if(R==='secret')setTimeout(()=>burst(x,y,cols,180,9,3,.05),350);
    if(R==='liquid')burst(x,y+r.height*.3,[c.hex,'#fff'],40,4,4,.18);
    const rgb=hex2(c.hex);if(R==='std')BG.splash(x,y,rgb,.35,.03,1);if(R==='holo')BG.splash(x,y,[.85,.9,1],.5,.04,2);if(R==='liquid'){BG.splash(x,y,rgb,.9,.06,4);}if(R==='gold'){BG.splash(x,y,[1,.78,.3],1,.07,5);BG.splash(x,y,rgb,.7,.05,2);}if(R==='secret'){[[1,.35,.82],[1,.84,.42],[.35,1,.78],[.35,.66,1],[.7,.35,1]].forEach((cc,i)=>setTimeout(()=>BG.splash(innerWidth*(.15+i*.18),innerHeight*(.3+Math.random()*.4),cc,1,.08,3),i*120));}
    showDock(c);},dur*.6);}
function showDock(c){const own=st.own[c.no]||0;const dupe=own>0;const sv=RAR[c.r].sell;
  $('#info').innerHTML=`<div class="rr" style="color:${RAR[c.r].col};font-size:13px">${RAR[c.r].label}${dupe?' · duplicate':''}</div>`;
  $('#acts').innerHTML=`<button class="act sell">Sell<small>+${sv}</small></button><button class="act keep">Keep</button>`;
  $('#acts .keep').onclick=()=>decide(c,'keep');$('#acts .sell').onclick=()=>decide(c,'sell');$('#dock').classList.add('on');}
function decide(c,how){if(c._done||!cur)return;c._done=true;$('#dock').classList.remove('on');const s=c._s,r=c._el.getBoundingClientRect();
  if(how==='keep'){st.own[c.no]=(st.own[c.no]||0)+1;keep();s.animate([{transform:'none',opacity:1},{transform:'translateY(55vh) scale(.25) rotate(-10deg)',opacity:0}],{duration:520,easing:'cubic-bezier(.5,0,.75,0)',fill:'forwards'});}
  else{setBal(RAR[c.r].sell);s.animate([{transform:'none',opacity:1,filter:'blur(0)'},{transform:'scale(1.15)',opacity:0,filter:'blur(8px)'}],{duration:500,fill:'forwards'});burst(r.left+r.width/2,r.top+r.height/2,['#ff5ad1','#ffd66b','#5affc8','#5aa8ff','#b45aff'],70,6,2.5,-.04);}
  cur.res.push({c,how});s.style.pointerEvents='none';setTimeout(()=>s.remove(),520);$('#rl').animate([{opacity:getComputedStyle($('#rl')).opacity},{opacity:0}],{duration:300,fill:'forwards'});
  const g=gen;setTimeout(()=>{if(g!==gen||!cur)return;cur.i++;if(cur.i<3)showTop();else summary();},480);}
function summary(){$('#count').textContent='';$('#hint').style.opacity=0;const sm=$('#sum');
  sm.innerHTML=`<h2>Pack opened</h2><div class="row"></div><div class="acts"><button class="act" id="again">Open another</button><button class="act keep" id="toCol">See collection</button></div>`;
  const row=sm.querySelector('.row');cur.res.forEach(({c,how},k)=>{const w=document.createElement('div');w.style.opacity=how==='sell'?.35:1;const el=makeCard(c,{w:Math.min(innerWidth*.26,110)+'px'});w.appendChild(el);row.appendChild(w);w.animate([{transform:'translateY(20px)',opacity:0},{transform:'none',opacity:how==='sell'?.35:1}],{duration:400,delay:k*90,fill:'backwards'});});
  sm.classList.add('on');$('#again').onclick=()=>{const p=cur.p;closeStage();if(st.bal>=p.cost)openPack(p);};$('#toCol').onclick=()=>{closeStage();seg('col');};}
function closeStage(){gen++;$('#stage').classList.remove('on');host.classList.remove('kstage');BG.stop();$('#sum').classList.remove('on');parts=[];renderCol();}
$('#close').onclick=()=>{if(cur&&cur.i<3&&$('#deck').children.length){cur.cards.slice(cur.i).forEach(c=>{st.own[c.no]=(st.own[c.no]||0)+1;});keep();}closeStage();};
/* ---------- inspect from collection ---------- */
function inspect(c){gen++;const S=$('#stage');S.style.setProperty('--s1','rgba(65,227,170,.5)');S.style.setProperty('--s2',c.hex);S.style.setProperty('--s3','rgba(90,130,255,.5)');host.classList.add('kstage');S.classList.add('on');sizeFx();BG.start([hex2(c.hex),[.32,.82,1],[.36,.95,.78],hex2(c.hex)]);cur=null;
  $('#slotPack').innerHTML='';$('#sum').classList.remove('on');$('#hint').style.opacity=0;$('#count').textContent='';$('#rl').style.opacity=RANK[c.r]>=3?.4:0;
  const deck=$('#deck');const cw=Math.min(innerWidth*.72,300);deck.style.setProperty('--cw',cw+'px');deck.innerHTML='';const s=document.createElement('div');s.className='slotc';const el=makeCard(c,{w:cw+'px'});s.appendChild(el);deck.appendChild(s);interactive(el);
  s.animate([{transform:'scale(.6) translateY(40px)',opacity:0},{transform:'none',opacity:1}],{duration:450,easing:'cubic-bezier(.2,.8,.2,1)'});
  const n=st.own[c.no]||0,sv=RAR[c.r].sell;try{buzz(5);}catch(e){}
  $('#info').innerHTML=`<div class="rr" style="color:${RAR[c.r].col};font-size:13px">${RAR[c.r].label} · ×${n}</div>`;
  $('#acts').innerHTML=`<button class="act sell">Sell one<small>+${sv}</small></button><button class="act pin">${save.pinCard===c.no?'Unpin':'Pin'}</button><button class="act keep">Done</button>`;$('#acts .pin').onclick=()=>{save.pinCard=save.pinCard===c.no?0:c.no;keep();try{buzz([6,30,8]);}catch(e){}colSig='';renderCol();inspect(c);};
  $('#acts .keep').onclick=closeStage;$('#acts .sell').onclick=()=>{st.own[c.no]--;if(st.own[c.no]<=0)delete st.own[c.no];keep();setBal(sv);const r=el.getBoundingClientRect();burst(r.left+r.width/2,r.top+r.height/2,['#ff5ad1','#ffd66b','#5affc8','#5aa8ff','#b45aff'],60,6,2.5,-.04);
    if(!st.own[c.no]){s.animate([{opacity:1},{opacity:0,transform:'scale(1.1)',filter:'blur(8px)'}],{duration:450,fill:'forwards'});setTimeout(closeStage,460);}else inspect(c);};
  $('#dock').classList.add('on');}
/* ---------- collection ---------- */
let colSig='';function renderCol(){const g=$('#cgrid');const sg=JSON.stringify(st.own);if(sg===colSig&&g.children.length)return;colSig=sg;g.innerHTML='';let have=0;
  SET.forEach(c=>{const n=st.own[c.no]||0;if(c.no<=50&&n)have++;if(c.no===51&&!n)return;
    const b=document.createElement('button');b.className='slot';
    if(n){const el=makeCard(c);b.appendChild(el);if(save.pinCard===c.no)b.insertAdjacentHTML('beforeend','<span class="tag">pinned</span>');if(n>1)b.insertAdjacentHTML('beforeend',`<span class="qty">×${n}</span>`);b.onclick=()=>inspect(c);b.setAttribute('aria-label',c.n);}
    else{b.innerHTML=`<div class="ghost">${String(c.no).padStart(2,'0')}</div>`;b.disabled=true;}
    g.appendChild(b);});
  $('#pN').textContent=have+'/50';{const pc=save.pinCard&&st.own[save.pinCard]?SET.find(x=>x.no===save.pinCard):null,pn=$('#pinNote');if(pn){pn.hidden=!pc;if(pc)pn.innerHTML=`<b></b> pinned · +${RANK[pc.r]>=1?2:1} chroma on colors from its country or hue`;if(pc)pn.querySelector('b').textContent=pc.n;}}$('#pB').style.width=(have*2)+'%';$('#pS').textContent=st.own[51]?'+ secret':'';}
/* ---------- backs + fronts gallery ---------- */

{const _rc=renderCol;renderCol=function(){_rc();try{const io=renderCol._io||(renderCol._io=new IntersectionObserver(es=>es.forEach(x=>x.target.classList.toggle('offs',!x.isIntersecting)),{rootMargin:'160px'}));$('#cgrid').querySelectorAll('.slot').forEach(s=>io.observe(s));}catch(e){}};}
function lens(v){const b=R.querySelector(`.seg button[data-s="${v}"]`),L=R.querySelector('.seg .lens');if(!b||!L||!b.offsetWidth)return;L.style.width=b.offsetWidth+'px';L.style.transform=`translateX(${b.offsetLeft}px)`;}
let ppI=0,ppN=0;
let ppSig='';function renderPP(){const B=$('#book');{const pl=save.palette||[],sg=pl.length+'|'+(save.level||1)+'|'+(save.eye||0)+'|'+pl.reduce((a,p)=>a+(p.p||0),0).toFixed(1);if(sg===ppSig&&B.children.length)return;ppSig=sg;}const got={};(save.palette||[]).forEach(p=>{if((p.p||0)>=50)got[p.n]=p;});let CP={};try{CP=countryProg();}catch(e){}
 const cs=getCountries().map(c=>{const f=c.ns.filter(n=>got[n]);return{c,f,p:CP[c.cc],d:f.reduce((m,n)=>Math.min(m,got[n].d||Infinity),Infinity)};}).filter(x=>x.f.length).sort((a,b)=>((b.p&&b.p.done)?1:0)-((a.p&&a.p.done)?1:0)||b.f.length-a.f.length);
 let name='player';try{name=(SB.uname()||(save.idn&&save.idn.name)||'player');}catch(e){}
 let dna='#7fd7ff';try{const c=idColor(save.idn);dna='#'+c.map(v=>Math.round(v*255).toString(16).padStart(2,'0')).join('');}catch(e){}
 const S=(()=>{try{return passportSummary();}catch(e){return{stars:0,maxStars:0,stamped:cs.length}}})();
 const gold=cs.filter(x=>x.p&&x.p.done).length, found=Object.keys(got).length, eye=(Math.round((save.eye||0)*10)/10).toFixed(1);
 const INK=['#24407a','#7a2430','#2a5e3c','#5a2f7a','#7a4a1c','#1f5d6b'];const h=s=>{let x=7;for(const ch of s)x=(x*31+ch.charCodeAt(0))%9973;return x;};
 const mrz=('P<MIX'+name.toUpperCase().replace(/[^A-Z]/g,'')+'<<'+'<'.repeat(30)).slice(0,30)+'\n'+('L'+String(save.level||1).padStart(3,'0')+'<C'+String(cs.length).padStart(3,'0')+'<G'+String(gold).padStart(2,'0')+'<'.repeat(30)).slice(0,30);
 const pages=[];
 pages.push(`<div class="sd cov"><span class="t1">PASSPORT</span><svg viewBox="0 0 100 100" fill="none" stroke="#e9c876" stroke-width="2.2"><circle cx="50" cy="50" r="40"/><ellipse cx="50" cy="50" rx="17" ry="40"/><path d="M10 50h80M16 30h68M16 70h68"/></svg><span class="t2">mix.io</span><span class="t3">${esc(name)}</span><i class="chip"></i></div><div class="sd bk paper"></div>`);
 pages.push(`<div class="sd paper idp" style="--dna:${dna}"><div class="ph"><span>mix.io · passport</span><span>p. 1</span></div><div class="idrow"><div class="idph"></div><div class="idf"><div><small>name</small><b>${esc(name)}</b></div><div><small>level</small><b>${save.level||1}</b></div><div><small>eye</small><b>${eye}</b></div><div><small>issued</small><b>${new Date(save.first||Date.now()).toLocaleDateString('en-US',{month:'short',year:'numeric'}).toLowerCase()}</b></div></div></div>
  <div class="idst"><div><small>colors found</small><b>${found}</b></div><div><small>countries</small><b>${cs.length}</b></div><div><small>complete</small><b class="g">${gold}</b></div><div><small>stars</small><b>${S.stars||0}</b></div></div><div class="mrz">${esc(mrz).replace('\n','<br>')}</div><span class="pn">1</span></div><div class="sd bk paper"></div>`);
 const per=6;const np=Math.max(1,Math.ceil(cs.length/per));
 for(let k=0;k<np;k++){const sl=cs.slice(k*per,k*per+per);let cells='';for(let j=0;j<per;j++){const x=sl[j];if(!x){cells+=`<div class="stamp empty" style="--ink:#8a7a60;--r:0deg;--br:10px"></div>`;continue;}const hh=h(x.c.cc),g=x.p&&x.p.done,ink=INK[hh%INK.length],r=((hh%11)-5)*1.2,br=hh%3===0?'50%':hh%3===1?'10px':'18px 4px';
   const nm=(x.c.cc==='aq'?'antarctica':(COUNTRY[x.c.cc]||x.c.name||x.c.cc)).toString();const dt=isFinite(x.d)?new Date(x.d).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'2-digit'}).toUpperCase():'';
   cells+=`<div class="stamp${g?' gold':''}" style="--ink:${ink};--r:${r}deg;--br:${br}">${FLAGS&&FLAGS[x.c.cc]?`<img alt="" src="${FLAGS[x.c.cc]}">`:''}<b>${esc(nm)}</b><small>${g?'complete':x.p?`${x.p.k}/${x.p.n}`:x.f.length+' found'}</small><i>${dt}</i></div>`;}
  pages.push(`<div class="sd paper stp"><div class="ph"><span>entries · visas</span><span>p. ${k+2}</span></div>${cells}<span class="pn">${k+2}</span></div><div class="sd bk paper"></div>`);}
 ppN=pages.length;B.innerHTML=pages.map((h,k)=>`<div class="pg${k<ppI?' fl':''}" style="z-index:${ppN-k}">${h}</div>`).join('');
 const more=$('#ppMore');if(more)more.onclick=e=>{e.stopPropagation();try{buzz(5);openPassport();}catch(x){}};
 ppUpd();}
function ppUpd(){R.querySelectorAll('#book .pg').forEach((p,k)=>p.classList.toggle('fl',k<ppI));}
function ppGo(d){const n=Math.max(0,Math.min(ppN-1,ppI+d));if(n===ppI)return;ppI=n;try{buzz(d>0?8:5);}catch(e){}ppUpd();}

{const B=$('#book');let d=null;
 B.addEventListener('pointerdown',e=>{if(e.target.closest('#ppMore'))return;d={x0:e.clientX,y0:e.clientY,t:performance.now(),ax:0,id:e.pointerId,W:B.clientWidth||300,p:0,ang:0};});
 B.addEventListener('pointermove',e=>{if(!d||d.id!==e.pointerId)return;const dx=e.clientX-d.x0,dy=e.clientY-d.y0;
  if(!d.ax){if(Math.abs(dx)<7&&Math.abs(dy)<7)return;d.ax=Math.abs(dx)>Math.abs(dy)?1:2;if(d.ax===1){try{B.setPointerCapture(e.pointerId);}catch(x){}const pgs=[...B.querySelectorAll('.pg')];d.dir=dx<0?1:-1;d.pg=d.dir>0?(ppI<ppN-1?pgs[ppI]:null):(ppI>0?pgs[ppI-1]:null);if(d.pg){d.pg.style.transition='none';d.pg.style.opacity='1';}}}
  if(d.ax!==1||!d.pg)return;e.preventDefault();const p=Math.max(0,Math.min(1,d.dir>0?-dx/(d.W*.9):dx/(d.W*.9)));d.p=p;d.ang=d.dir>0?-178*p:-178*(1-p);if(!d.rq)d.rq=requestAnimationFrame(()=>{if(!d||!d.pg)return;d.rq=0;d.pg.style.transform=`rotateY(${d.ang.toFixed(1)}deg)`;});});
 const up=e=>{if(!d||d.id!==e.pointerId)return;const q=d;d=null;const dx=e.clientX-q.x0,dy=e.clientY-q.y0;
  if(q.ax===1&&q.pg){const v=dx/Math.max(1,performance.now()-q.t),commit=q.p>.32||(q.dir>0?v<-.45:v>.45);if(q.rq)cancelAnimationFrame(q.rq);q.pg.style.transition='transform .5s cubic-bezier(.22,1,.36,1),opacity .2s .45s';q.pg.style.transform='';q.pg.style.opacity='';setTimeout(()=>{if(q.pg)q.pg.style.transition='';},520);if(commit)ppGo(q.dir);else ppUpd();return;}
  if(!q.ax&&Math.abs(dx)<8&&Math.abs(dy)<8){const r=B.getBoundingClientRect();ppGo(ppI===0||e.clientX>r.left+r.width*.4?1:-1);}};
 B.addEventListener('pointerup',up);B.addEventListener('pointercancel',e=>{if(d&&d.pg){d.pg.style.transition='';d.pg.style.transform='';d.pg.style.opacity='';}d=null;});}

const SORD=['packs','col','pp'];let segV='packs',lx=0,lw=0;
const LL={x:0,v:0,tx:0,w:0,tw:0,raf:0,last:0,drag:false,init:false,fr:0,lt:0};
function lpaint(){const L=R.querySelector('.seg .lens');if(!L)return;const st=Math.max(-.32,Math.min(.32,LL.v/1700)),a=Math.abs(st),q=LL.drag?1:0,sx=1+a*.42+q*.06,sy=1-a*.16-q*.04;{const w=LL.w.toFixed(1)+'px';if(LL._w!==w){LL._w=w;L.style.width=w;}}L.style.transform=`translate3d(${LL.x.toFixed(2)}px,0,0) scale(${sx.toFixed(4)},${sy.toFixed(4)}) skewX(${(-st*7).toFixed(2)}deg)`;}
function lstep(now){const dt=Math.min(.033,LL.last?(now-LL.last)/1000:.016);LL.last=now;for(let i=0,h=dt/4;i<4;i++){const ac=(LL.tx-LL.x)*150-LL.v*19.5;LL.v+=ac*h;LL.x+=LL.v*h;}LL.w+=(LL.tw-LL.w)*(1-Math.exp(-dt*10));lpaint();if(Math.abs(LL.tx-LL.x)<.2&&Math.abs(LL.v)<4&&Math.abs(LL.tw-LL.w)<.2){LL.x=LL.tx;LL.v=0;LL.w=LL.tw;lpaint();LL.raf=0;LL.last=0;return;}LL.raf=requestAnimationFrame(lstep);}
function lkick(){if(!LL.raf){LL.last=0;LL.raf=requestAnimationFrame(lstep);}}
function lensAt(x,w){const now=performance.now();if(!LL.drag){LL.drag=true;LL.lt=now;if(LL.raf){cancelAnimationFrame(LL.raf);LL.raf=0;}}LL.v=Math.max(-2400,Math.min(2400,(x-LL.x)/Math.max(8,now-LL.lt)*1000))*.6;LL.lt=now;LL.x=LL.tx=x;LL.w=LL.tw=w;lx=x;lw=w;if(!LL.fr)LL.fr=requestAnimationFrame(()=>{LL.fr=0;lpaint();});}
function lens(v){const b=R.querySelector(`.seg button[data-s="${v}"]`);if(!b||!b.offsetWidth)return;LL.drag=false;LL.tx=b.offsetLeft;LL.tw=b.offsetWidth;if(!LL.init||host.hidden){LL.init=true;LL.x=LL.tx;LL.w=LL.tw;LL.v=0;lpaint();return;}LL.v*=.4;lkick();}
let tRaf=0,tQ=null,VW=0;function trackTo(v,dx,settle){tQ=[v,dx||0,settle];if(tRaf)return;tRaf=requestAnimationFrame(()=>{tRaf=0;const [V,D,St]=tQ,T=$('#track'),el=$('#v-'+V);if(!T||!el)return;if(St||!VW)VW=$('#vp').clientWidth;const i=SORD.indexOf(V)<0?0:[...T.children].indexOf(el);T.style.transform=`translate3d(${(-i*VW+D).toFixed(1)}px,0,0)`;if(St)T.style.height=el.offsetHeight+'px';if(!T._ro&&window.ResizeObserver){T._ro=new ResizeObserver(()=>{const on=T.querySelector('.view.on')||el;if(on)T.style.height=on.offsetHeight+'px';});[...T.children].forEach(c=>T._ro.observe(c));}});}
function flowChroma(n,B){const fg=document.getElementById('fg')||document.getElementById('scene'),nb=document.querySelector('#nav [data-t=cards]');if(!fg||!nb||document.hidden){toast(`+${n} chroma`);return;}
 const a=fg.getBoundingClientRect(),b=nb.getBoundingClientRect(),x0=a.left+a.width/2,y0=a.top+a.height*.45,x1=b.left+b.width/2,y1=b.top+b.height*.38,cxp=(x0+x1)/2+(x1>x0?-60:60),cyp=Math.min(y0,y1)-140;
 const mk=(s,d)=>{const e=document.createElement('i');e.style.cssText=`position:fixed;left:0;top:0;width:${s}px;height:${s}px;margin:${-s/2}px 0 0 ${-s/2}px;border-radius:50% 50% 50% 50%/55% 55% 45% 45%;z-index:90;pointer-events:none;background:radial-gradient(circle at 35% 30%,#fff 0 12%,transparent 40%),conic-gradient(#ff5ad1,#ffd66b,#5affc8,#5aa8ff,#b45aff,#ff5ad1);box-shadow:0 0 14px rgba(180,90,255,.7),0 0 4px rgba(255,255,255,.8)`;document.body.appendChild(e);const K=[];for(let i=0;i<=16;i++){const t=i/16,u=1-t,x=u*u*x0+2*u*t*cxp+t*t*x1,y=u*u*y0+2*u*t*cyp+t*t*y1,sc=(1-.45*t)*(i===0?.2:1);K.push({transform:`translate(${x}px,${y}px) scale(${sc})`,opacity:i===16?0:1});}const an=e.animate(K,{duration:900,delay:d,easing:'cubic-bezier(.45,.05,.4,1)',fill:'both'});an.onfinish=()=>e.remove();return an;};
 const main=mk(20,0);mk(11,90);mk(7,170);try{buzz(4);}catch(e){}
 main.finished.then(()=>{try{buzz([8,20,10]);}catch(e){}const sv=nb.querySelector('svg');if(sv)sv.animate([{transform:'scale(1)'},{transform:'scale(1.35) translateY(-3px)'},{transform:'scale(1)'}],{duration:520,easing:'cubic-bezier(.3,1.6,.45,1)'});
  const tag=document.createElement('div');tag.style.cssText=`position:fixed;left:${x1}px;top:${b.top-8}px;transform:translate(-50%,-100%);z-index:90;pointer-events:none;text-align:center;font:800 15px var(--f-display,system-ui);color:#fff;text-shadow:0 0 14px rgba(180,90,255,.8);white-space:nowrap`;
  tag.innerHTML=`+${n} chroma<small style="display:block;font:600 10.5px var(--f-ui,system-ui);color:rgba(255,255,255,.65);text-shadow:none;margin-top:2px"></small>`;tag.querySelector('small').textContent=B.map(([k,v])=>typeof v==='number'?`${k} +${v}`:`${k} ${v}`).join(' · ');
  const W=innerWidth;document.body.appendChild(tag);const r=tag.getBoundingClientRect();if(r.right>W-8)tag.style.left=(x1-(r.right-W+8))+'px';if(r.left<8)tag.style.left=(x1+(8-r.left))+'px';
  tag.animate([{opacity:0,transform:'translate(-50%,-80%) scale(.8)'},{opacity:1,transform:'translate(-50%,-100%) scale(1)',offset:.15},{opacity:1,transform:'translate(-50%,-110%)',offset:.8},{opacity:0,transform:'translate(-50%,-130%)'}],{duration:2600,easing:'ease-out',fill:'both'}).onfinish=()=>tag.remove();}).catch(()=>{});}

function seg(v){segV=v;R.querySelectorAll('.seg button').forEach(b=>{b.setAttribute('aria-pressed',b.dataset.s===v);b.classList.remove('hov');});R.querySelectorAll('.track>.view').forEach(s=>s.classList.toggle('on',s.id==='v-'+v));if(v==='col')renderCol();if(v==='pp')renderPP();lens(v);trackTo(v,0,true);}
R.querySelectorAll('.seg button').forEach(b=>b.onclick=()=>{if(segEat){segEat=false;return;}try{buzz(5);}catch(e){}seg(b.dataset.s);});
let segEat=false;
{const S=R.querySelector('.seg'),L=R.querySelector('.seg .lens');let d=null;const btns=()=>[...S.querySelectorAll('button')];
 const near=x=>btns().reduce((a,b)=>Math.abs(b.offsetLeft+b.offsetWidth/2-x)<Math.abs(a.offsetLeft+a.offsetWidth/2-x)?b:a);
 S.addEventListener('pointerdown',e=>{const bs=btns();d={x0:e.clientX,on:false,id:e.pointerId,r:S.getBoundingClientRect(),cur:segV,c:bs.map(b=>[b,b.offsetLeft+b.offsetWidth/2]),w:bs[0].offsetWidth,step:bs[1].offsetLeft-bs[0].offsetLeft,i0:bs.findIndex(b=>b.dataset.s===segV),vw:$('#vp').clientWidth};});
 S.addEventListener('pointermove',e=>{if(!d||d.id!==e.pointerId)return;if(!d.on){if(Math.abs(e.clientX-d.x0)<6)return;d.on=true;try{S.setPointerCapture(e.pointerId);}catch(x){}L.classList.add('drag');}
  const w=d.w,x=Math.max(5,Math.min(d.r.width-w-5,e.clientX-d.r.left-w/2));lensAt(x,w,1);const cx=x+w/2;let nb=d.c[0];for(const q of d.c)if(Math.abs(q[1]-cx)<Math.abs(nb[1]-cx))nb=q;if(nb[0].dataset.s!==d.cur){d.cur=nb[0].dataset.s;d.c.forEach(q=>q[0].classList.toggle('hov',q===nb));try{buzz(4);}catch(x){}}
  const fx=(cx-d.c[d.i0][1])/(d.step||1);if(!d.tk){d.tk=1;$('#track').classList.add('drag');}trackTo(segV,-fx*d.vw);});
 const up=e=>{if(!d)return;const on=d.on,cur=d.cur;d=null;L.classList.remove('drag');$('#track').classList.remove('drag');if(on){segEat=true;setTimeout(()=>segEat=false,50);seg(cur);}};
 S.addEventListener('pointerup',up);S.addEventListener('pointercancel',up);}
{const V=$('#vp');let d=null;
 V.addEventListener('pointerdown',e=>{if(e.target.closest('.book'))return;d={x0:e.clientX,y0:e.clientY,ax:0,t:performance.now(),id:e.pointerId};});
 V.addEventListener('pointermove',e=>{if(!d||d.id!==e.pointerId)return;const dx=e.clientX-d.x0,dy=e.clientY-d.y0;if(!d.ax){if(Math.abs(dx)<9&&Math.abs(dy)<9)return;d.ax=Math.abs(dx)>Math.abs(dy)*1.2?1:2;if(d.ax===1){try{V.setPointerCapture(e.pointerId);}catch(x){}$('#track').classList.add('drag');R.querySelector('.seg .lens').classList.add('drag');const bs=[...R.querySelectorAll('.seg button')],b=bs.find(q=>q.dataset.s===segV);d.bl=b.offsetLeft;d.bw=b.offsetWidth;d.step=bs[1].offsetLeft-bs[0].offsetLeft;d.W=V.clientWidth;}}
  if(d.ax!==1)return;const i=SORD.indexOf(segV),edge=(i===0&&dx>0)||(i===SORD.length-1&&dx<0),ddx=edge?Math.sign(dx)*d.W*.2*(1-Math.exp(-Math.abs(dx)/(d.W*.45))):dx;trackTo(segV,ddx);
  lensAt(d.bl-ddx/d.W*d.step,d.bw,Math.min(1,Math.abs(ddx)/d.W*3));});
 const up=e=>{if(!d)return;const dd=d;d=null;$('#track').classList.remove('drag');R.querySelector('.seg .lens').classList.remove('drag');if(dd.ax!==1)return;const dx=e.clientX-dd.x0,v=dx/Math.max(1,performance.now()-dd.t),W=V.clientWidth,i=SORD.indexOf(segV);let n=i;if(dx<-W*.18||v<-.5)n=i+1;else if(dx>W*.18||v>.5)n=i-1;n=Math.max(0,Math.min(SORD.length-1,n));if(n!==i)try{buzz(6);}catch(x){}seg(SORD[n]);};
 V.addEventListener('pointerup',up);V.addEventListener('pointercancel',up);}
addEventListener('resize',()=>{try{if(!host.hidden)seg(segV);}catch(e){}});

if(save.chroma==null&&(save.level||1)<=1)save.chroma=100;
renderPacks();
return{open(){host.hidden=false;window.__kOn=1;setTimeout(()=>BG.warm(),350);rollBal();setBal(0);try{renderCol();renderPP();}catch(e){}seg(segV||'packs');const pg=$('#page>.in')||$('#page .in');if(pg){pg.style.animation='none';void pg.offsetWidth;pg.style.animation='';}},
 close(){if($('#stage').classList.contains('on'))return;host.hidden=true;window.__kOn=0;},
 seg(v){try{seg(v);}catch(e){}},
 shut(){host.hidden=true;window.__kOn=0;if($('#stage').classList.contains('on')){$('#stage').classList.remove('on');host.classList.remove('kstage');BG.stop();}},
 earned(n,B){if(!(n>0))return;setTimeout(()=>{try{flowChroma(n,B||[]);}catch(e){try{toast(`+${n} chroma`);}catch(x){}}},1150);},
 pinBonus(tg){const no=save.pinCard;if(!no)return 0;const c=SET.find(x=>x.no===no);if(!c||!st.own[no])return 0;const a1=atlasOf(c.n),a2=atlasOf(tg.name);const sameC=a1&&a2&&a1[6]&&a1[6]===a2[6];const hue=rgb=>{const [r,g,b]=rgb,mx=Math.max(r,g,b),mn=Math.min(r,g,b),d=mx-mn;if(d<.12)return null;let h=mx===r?((g-b)/d)%6:mx===g?(b-r)/d+2:(r-g)/d+4;return (h*60+360)%360;};const h1=hue(hex2(c.hex)),h2=hue(tg.rgb);const sameH=h1!=null&&h2!=null&&Math.min(Math.abs(h1-h2),360-Math.abs(h1-h2))<16;return (sameC||sameH)?(RANK[c.r]>=1?2:1):0;}};
})();

})();
</script>