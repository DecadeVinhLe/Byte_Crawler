/* End-of-boss flow, boss records and the login demo.
   Boss fight (js/boss.js) calls BCEnd.start() on the first Attack, then BCEnd.win(first) or BCEnd.lose().
   WIN : papyrus "Mission Complete" -> click anywhere -> cutscene (hold to skip) -> "Continue a journey" -> Dashboard.
   LOSE: papyrus "Game Over" -> Continue = Learning path, Quit = Dashboard.
   Preview without fighting the boss: open index.html?preview=win or ?preview=lose, or run BCEnd.preview("win") in the console. */
(function(){
var $=function(i){return document.getElementById(i)},root=document.documentElement,
 end=$("end"),res=$("esRes"),cut=$("esCut"),vid=$("csv"),skip=$("csSkip"),ui=$("csUi"),fin=$("csFin"),endImg=$("csEnd"),
 OUT="win",STAGE="",T0=0,tmr=0,opener=null,done=false,HOLD=1100,hr=0,hs=0,
 REC={best:null,last:null,wins:0,losses:0,hist:[]},USER=null,VOL=0.5;

/* ================= helpers ================= */
function fmt(ms){if(ms==null||!isFinite(ms))return"--:--";var s=ms/1000,m=Math.floor(s/60),r=s-m*60;return(m<10?"0":"")+m+":"+(r<10?"0":"")+r.toFixed(1)}
function rnd(s){return function(){s=s*16807%2147483647;return(s-1)/2147483646}}
function inert(on){["header","main","footer"].forEach(function(t){var e=document.querySelector(t);if(e)e.inert=on})}
function lsGet(k){try{return localStorage.getItem(k)}catch(e){return null}}
function lsSet(k,v){try{localStorage.setItem(k,v)}catch(e){}}

/* ================= pixel art (tiny sprite renderer) ================= */
function px(rows,pal){var w=rows[0].length,s="";rows.forEach(function(r,y){var x=0;while(x<r.length){var c=r[x];if(c==="."){x++;continue}var e=x;while(e<r.length&&r[e]===c)e++;s+='<rect x="'+x+'" y="'+y+'" width="'+(e-x)+'" height="1" fill="'+pal[c]+'"/>';x=e}});
 return{w:w,h:rows.length,body:s}}
function svgPx(sp){return'<svg viewBox="0 0 '+sp.w+" "+sp.h+'" aria-hidden="true">'+sp.body+"</svg>"}
var TROPHY=["..ooooooo..","occhcccccso","occhcccccso",".occhccsso.","..occhcso..","...ochso...","....oco....","....oco....",".ooooooooo.","occchcccsso","ooooooooooo"],
 STAR=["....y....","....y....","...yyy...","yyyyyyyyy",".yyyyyyy.","..yyyyy..","..yy.yy..",".yy...yy."],
 SPARK=["...y...","...y...","..yyy..","yyyyyyy","..yyy..","...y...","...y..."],
 CHECK=["........ggg",".......ggg.","......ggg..","g....ggg...","gg..ggg....",".gggggg....","..gggg.....","...gg......"],
 TOMB=["....ooooo....","...oggggho...","..oggggggho..","..ogggdgggso.","..oggdddggso.","..ogggdgggso.","..ogggdgggso.","..oggggggsso.","..oggggggsso.","..oggggggsso.",".gooooooooog.","vwvvwvvvwvvwv"];
function trophy(c,h,s){return px(TROPHY,{o:"#2b1a0a",c:c,h:h,s:s})}
var TG=trophy("#3fbf5a","#9af0a8","#238a3c"),TR=trophy("#e0483a","#ff9d8f","#a3281f"),TB=trophy("#3d6df2","#9db8ff","#2548b0"),
 SY=px(STAR,{y:"#ffd23f"}),SR=px(SPARK,{y:"#e0483a"}),SG=px(SPARK,{y:"#3fbf5a"}),SB=px(SPARK,{y:"#3d6df2"}),SW=px(SPARK,{y:"#fff4c2"}),
 CK=px(CHECK,{g:"#2fbf4f"}),
 TM=px(TOMB,{o:"#1d2b3a",g:"#8fbcb0",h:"#c9e0d8",s:"#5c8a85",d:"#2d4a52",v:"#3f7a3a",w:"#6fa04a"});
function dc(sp,l,t,w,cls){return'<span class="dc '+(cls||"")+'" style="left:'+l+"%;top:"+t+"%;width:"+w+'%">'+svgPx(sp)+"</span>"}
function decoWin(){return dc(SY,20.5,15,4.6,"tw")+dc(TG,21.5,31,5.2,"fl")+dc(TR,73.5,14,5.2,"fl")+dc(TB,73.5,31,5.2,"fl")+dc(CK,47.2,86,5.4)+
 dc(SR,28,11,2.2,"tw")+dc(SG,69,10,2.4,"tw")+dc(SW,80,27,2,"tw")+dc(SB,17,29,2,"tw")+dc(SR,31,76,2.2,"tw")+dc(SW,63,78,2,"tw")+dc(SG,16,52,2,"tw")}

/* ================= papyrus map (SVG) ================= */
function sheetPath(){var r=rnd(11),p=[],i,x0=64,x1=936,y0=48,y1=552;
 for(i=0;i<=26;i++)p.push([x0+(x1-x0)*i/26,y0+(r()-.5)*10]);
 for(i=1;i<=15;i++)p.push([x1+(r()-.5)*10,y0+(y1-y0)*i/15]);
 for(i=1;i<=26;i++)p.push([x1-(x1-x0)*i/26,y1+(r()-.5)*10]);
 for(i=1;i<15;i++)p.push([x0+(r()-.5)*10,y1-(y1-y0)*i/15]);
 return"M"+p.map(function(q){return q[0].toFixed(1)+" "+q[1].toFixed(1)}).join("L")+"Z"}
function palm(x,y,s){return'<g transform="translate('+x+" "+y+") scale("+(s||1)+')" fill="none" stroke-linecap="round"><path d="M0 0C2-12 6-24 4-36" stroke="#6b4a1f" stroke-width="4"/><g stroke="#3f7d3a" stroke-width="5"><path d="M4-36C-12-42-22-34-26-24"/><path d="M4-36C16-46 28-40 34-30"/><path d="M4-36C-6-54 8-62 18-56"/><path d="M4-36C-2-46-18-52-24-46"/></g></g>'}
function mount(x,y,s){return'<g transform="translate('+x+" "+y+") scale("+(s||1)+')"><path d="M0 0L26-50 40-30 56-64 84 0Z" fill="#a8743c" stroke="#5a3513" stroke-width="2" stroke-linejoin="round"/><path d="M56-64L84 0H60L50-24Z" fill="#7a4e24" opacity=".6"/><path d="M-12 0H96" stroke="#3f7d3a" stroke-width="6" stroke-linecap="round"/></g>'}
function pool(d,r){return'<path d="'+d+'" fill="#62b9c6" stroke="#3f8fa0" stroke-width="3"/><g fill="none" stroke="#c4eef2" stroke-width="2.5" stroke-linecap="round" opacity=".8">'+r+"</g>"}
function ship(x,y){return'<g transform="translate('+x+" "+y+')"><path d="M-26 0H26L16 13H-16Z" fill="#6b3f18" stroke="#3b2208" stroke-width="2"/><path d="M0 0V-38" stroke="#3b2208" stroke-width="3"/><path d="M2-36L26-8H2Z" fill="#f4ead0" stroke="#6b4a1f" stroke-width="2"/><path d="M-2-30L-20-8H-2Z" fill="#f4ead0" stroke="#6b4a1f" stroke-width="2"/></g>'}
function compass(x,y){return'<g transform="translate('+x+" "+y+')"><circle r="36" fill="none" stroke="#5a3513" stroke-width="3"/><circle r="28" fill="none" stroke="#5a3513" stroke-opacity=".45" stroke-width="2"/><path d="M0-48L9-9 48 0 9 9 0 48-9 9-48 0-9-9Z" fill="#8c3f22" stroke="#4a2a10" stroke-width="2"/><path d="M0-20L5-5 20 0 5 5 0 20-5 5-20 0-5-5Z" fill="#ecd9a6"/><text y="-56" text-anchor="middle" font-family="VT323,monospace" font-size="24" fill="#4a2a10">N</text></g>'}
function papyrus(out,portrait){
 var D=sheetPath(),win=out==="win",
  route='M214 452C300 510 440 530 560 500',rest='C640 480 660 380 700 300C730 244 790 232 846 252',
  s='<svg class="pap-bg" viewBox="0 0 1000 600" preserveAspectRatio="'+(portrait?"xMidYMid slice":"xMidYMid meet")+'" aria-hidden="true"><defs>'+
  '<linearGradient id="pgr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#efdcab"/><stop offset=".55" stop-color="#e3c689"/><stop offset="1" stop-color="#d2ad66"/></linearGradient>'+
  '<linearGradient id="rol" x1="0" x2="1"><stop offset="0" stop-color="#7d4f20"/><stop offset=".3" stop-color="#e7c885"/><stop offset=".5" stop-color="#f4dfa6"/><stop offset=".78" stop-color="#c79a54"/><stop offset="1" stop-color="#7d4f20"/></linearGradient>'+
  '<filter id="grn" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" seed="4"/><feColorMatrix values="0 0 0 0 .36 0 0 0 0 .22 0 0 0 0 .08 0 0 0 .2 0"/></filter>'+
  '<filter id="blr"><feGaussianBlur stdDeviation="9"/></filter><clipPath id="cps"><path d="'+D+'"/></clipPath></defs>'+
  '<path d="'+D+'" fill="url(#pgr)"/><rect width="1000" height="600" filter="url(#grn)" clip-path="url(#cps)"/>'+
  '<path d="'+D+'" fill="none" stroke="#5a3513" stroke-opacity=".6" stroke-width="24" filter="url(#blr)" clip-path="url(#cps)"/>'+
  '<path d="'+D+'" fill="none" stroke="#7a4a1c" stroke-width="2.5"/>'+
  '<path d="M282 50V550M500 50V550M720 50V550M66 214H934M66 384H934" stroke="#8a5a2a" stroke-opacity=".3" stroke-width="2"/><path d="M285 50V550M503 50V550M723 50V550M66 217H934M66 387H934" stroke="#fff6d8" stroke-opacity=".28" stroke-width="2"/>'+
  '<g clip-path="url(#cps)">'+compass(152,136)+mount(780,120,1)+mount(96,388,.7)+palm(110,262,.9)+palm(560,540,.8)+
  pool("M92 420C120 392 200 396 250 418C300 440 330 480 300 512C250 540 150 536 110 512C84 490 76 446 92 420Z",'<path d="M120 440q14-8 28 0t28 0"/><path d="M190 482q14-8 28 0t28 0"/><path d="M130 500q14-8 28 0t28 0"/>')+
  pool("M690 340C730 318 810 330 860 360C900 390 900 440 860 462C810 486 730 470 700 430C676 400 670 360 690 340Z",'<path d="M730 360q14-8 28 0t28 0"/><path d="M790 420q14-8 28 0t28 0"/><path d="M720 434q14-8 28 0t28 0"/>')+
  ship(176,470)+palm(870,470,.8)+palm(330,520,.8)+
  '<path d="M214 452V418" stroke="#4a2a10" stroke-width="4"/><path d="M214 418L242 429 214 440Z" fill="#a3281f"/>';
 if(win){
  s+='<path d="'+route+rest+'" fill="none" stroke="#5a2f10" stroke-width="5" stroke-linecap="round" stroke-dasharray="2 13" class="route"/>'+
   '<path d="M826 232L866 272M866 232L826 272" stroke="#a3281f" stroke-width="10" stroke-linecap="round"/>'+
   '<image href="assets/images/crown.png" x="810" y="170" width="72" height="53" style="image-rendering:pixelated"/>'}
 else{
  s+='<path d="M214 452C226 410 204 366 178 336" fill="none" stroke="#5a2f10" stroke-width="5" stroke-linecap="round" stroke-dasharray="2 13" class="route"/>'+
   '<path d="M178 336C300 300 600 380 700 300C730 244 790 232 846 252" fill="none" stroke="#5a2f10" stroke-opacity=".28" stroke-width="5" stroke-linecap="round" stroke-dasharray="2 13"/>'+
   '<path d="M826 232L866 272M866 232L826 272" stroke="#5a3513" stroke-opacity=".3" stroke-width="10" stroke-linecap="round"/>'+
   '<svg x="140" y="268" width="58" height="67" viewBox="0 0 '+TM.w+" "+TM.h+'" shape-rendering="crispEdges">'+TM.body+"</svg>"}
 s+="</g>";
 [30,918].forEach(function(x){s+='<rect x="'+(x-4)+'" y="34" width="52" height="532" rx="16" fill="url(#rol)" stroke="#4a2a10" stroke-width="3"/>'+
  '<ellipse cx="'+(x+22)+'" cy="36" rx="26" ry="10" fill="#e7c885" stroke="#4a2a10" stroke-width="3"/><ellipse cx="'+(x+22)+'" cy="36" rx="11" ry="4" fill="#6b3f18"/>'+
  '<ellipse cx="'+(x+22)+'" cy="564" rx="26" ry="10" fill="#c79a54" stroke="#4a2a10" stroke-width="3"/><ellipse cx="'+(x+22)+'" cy="564" rx="11" ry="4" fill="#6b3f18"/>'+
  '<rect x="'+(x-6)+'" y="150" width="56" height="8" fill="#5a3513"/><rect x="'+(x-6)+'" y="440" width="56" height="8" fill="#5a3513"/>'});
 return s+"</svg>"}

/* ================= records + user (kept in this browser only) ================= */
function recKey(){return"bc_rec_"+(USER?USER.email:"")}
function saveRec(){if(USER)lsSet(recKey(),JSON.stringify(REC))}
function mergeRec(){var r=null;try{r=JSON.parse(lsGet(recKey())||"null")}catch(e){}
 if(r){REC.best=REC.best==null?r.best:(r.best==null?REC.best:Math.min(REC.best,r.best));REC.last=REC.last==null?r.last:REC.last;
  REC.wins+=r.wins||0;REC.losses+=r.losses||0;REC.hist=(REC.hist.concat(r.hist||[])).sort(function(a,b){return b.at-a.at}).slice(0,8)}
 saveRec()}
function clearRec(){REC={best:null,last:null,wins:0,losses:0,hist:[]}}
function renderRec(){var e=$("rBest");if(!e)return;
 e.textContent=fmt(REC.best);$("rLast").textContent=fmt(REC.last);$("rW").textContent=REC.wins;$("rL").textContent=REC.losses;
 $("rHist").innerHTML=REC.hist.length?REC.hist.map(function(h){return'<div class="dn"><span class="'+(h.ok?"w":"l")+'">'+(h.ok?"✓ Victory":"✗ Defeat")+"</span><span>"+fmt(h.ms)+"</span></div>"}).join(""):'<div><span>No boss runs yet</span><span>Beat the Wyrm to set a time</span></div>';
 $("rNote").textContent=USER?"Saved to "+USER.name+"’s account in this browser.":"Guest mode: your record is lost when you close the tab. Log in to keep it.";
 $("rLogin").hidden=!!USER}
function userInit(){var u=null;try{u=JSON.parse(lsGet("bc_user")||"null")}catch(e){}USER=u&&u.email?u:null;if(USER)mergeRec();renderUser()}
function renderUser(){
 var n=USER?USER.name.split(" ")[0]:"Log in",a=$("hLogin"),b=$("hLoginI");
 if(a){a.querySelector("span").textContent=n;a.classList.toggle("lg-on",!!USER);a.title=USER?"Account: "+USER.name:"Log in";a.setAttribute("aria-label",a.title)}
 if(b){b.title=USER?"Account: "+USER.name:"Log in";b.setAttribute("aria-label",b.title)}
 var f=$("lgForm"),w=$("lgIn");if(f){f.hidden=!!USER;w.hidden=!USER;
  if(USER){$("lgAv").textContent=USER.name.charAt(0).toUpperCase();$("lgName").textContent=USER.name;$("lgMail").textContent=USER.email;
   $("lgBest").textContent=fmt(REC.best)+" best time · "+REC.wins+" win"+(REC.wins==1?"":"s")}}
 renderRec()}

/* ================= overlay: open / close ================= */
function build(out,d){
 var win=out==="win",ti=$("endTitle");
 res.dataset.out=out;OUT=out;
 ti.innerHTML=win?"<span>Mission</span><span>Complete</span>":"<span>Game</span><span>Over</span>";
 $("papWrap").innerHTML=papyrus(out,matchMedia("(max-width:700px) and (orientation:portrait)").matches);
 $("endDeco").innerHTML=win?decoWin():dc(SW,24,16,2.2,"tw")+dc(SB,76,18,2.2,"tw");
 if(win){
  $("endBan").textContent="Promotion quest cleared";
  $("endSub").textContent=d.first?"Rank up! You are now a Wyrm Slayer.":"The Wyrm falls again. Your record is updated.";
  $("endStats").innerHTML='<div class="st"><dt>CLEAR TIME</dt><dd>'+fmt(d.ms)+'</dd></div><div class="st'+(d.rec?" new":"")+'"><dt>BEST TIME</dt><dd>'+fmt(d.best!=null?d.best:REC.best)+"</dd>"+(d.rec?'<span class="nr">NEW!</span>':"")+'</div><div class="st"><dt>XP</dt><dd>+'+(d.first?200:0)+'</dd></div><div class="st"><dt>RANK</dt><dd>Slayer</dd></div>';
  $("endTap").hidden=false;$("endMenu").hidden=true;
  res.classList.add("tap");res.setAttribute("role","button");res.tabIndex=0;res.setAttribute("aria-label","Continue to the victory cutscene")}
 else{
  $("endBan").textContent="The Wyrm survived";
  $("endSub").textContent="Study the lesson, fix your code and come back stronger.";
  $("endStats").innerHTML='<div class="st"><dt>TIME SURVIVED</dt><dd>'+fmt(d.ms)+'</dd></div><div class="st"><dt>DEFEATS</dt><dd>'+REC.losses+"</dd></div>";
  $("endTap").hidden=true;$("endMenu").hidden=false;
  res.classList.remove("tap");res.removeAttribute("role");res.removeAttribute("aria-label");res.removeAttribute("tabindex");
  selMenu($("endMenu").querySelector("button"))}
 $("endLive").textContent=win?"Mission complete. Clear time "+fmt(d.ms)+". Click anywhere or press Enter to continue.":"Game over. Choose Continue for the learning path, or Quit for the dashboard."}
function open(out,d){
 clearTimeout(tmr);opener=document.activeElement;build(out,d);if(out==="win"){vid.preload="auto";vid.load()}
 STAGE="res";res.hidden=false;cut.hidden=true;end.hidden=false;root.classList.add("end-lock");inert(true);
 setTimeout(function(){(out==="win"?res:$("endMenu").querySelector("button")).focus({preventScroll:true})},60)}
function close(hash){
 clearTimeout(tmr);holdEnd();try{vid.pause()}catch(e){}
 end.hidden=true;root.classList.remove("end-lock");inert(false);STAGE="";
 if(hash){if(location.hash==="#"+hash)window.route&&route();else location.hash="#"+hash}
 else if(opener&&opener.focus)opener.focus({preventScroll:true})}

/* ---- Game Over menu ---- */
function selMenu(b){[].forEach.call($("endMenu").querySelectorAll("button"),function(x){x.classList.toggle("sel",x===b)})}
$("endMenu").addEventListener("click",function(e){var b=e.target.closest("button");if(b)close(b.dataset.go)});
$("endMenu").addEventListener("mouseover",function(e){var b=e.target.closest("button");if(b)selMenu(b)});
$("endMenu").addEventListener("focusin",function(e){var b=e.target.closest("button");if(b)selMenu(b)});
$("endMenu").addEventListener("keydown",function(e){if(e.key!=="ArrowDown"&&e.key!=="ArrowUp")return;e.preventDefault();
 var bs=[].slice.call($("endMenu").querySelectorAll("button")),i=bs.indexOf(document.activeElement);bs[(i+(e.key==="ArrowDown"?1:bs.length-1))%bs.length].focus()});

/* ================= cutscene ================= */
function setVol(v,save){VOL=Math.max(0,Math.min(1,v));vid.volume=VOL;vid.muted=VOL===0;$("csVol").value=Math.round(VOL*100);$("csVl").textContent=Math.round(VOL*100)+"%";
 $("csMute").setAttribute("aria-label",VOL===0?"Unmute":"Mute");$("csMute").classList.toggle("off",VOL===0);if(save)lsSet("bc_vol",String(VOL))}
function toCut(){
 if(STAGE!=="res"||OUT!=="win")return;STAGE="cut";done=false;
 res.hidden=true;cut.hidden=false;endImg.classList.remove("on");fin.hidden=true;ui.hidden=false;
 setVol(VOL,false);vid.currentTime=0;
 var p=vid.play();
 if(p&&p.catch)p.catch(function(){vid.muted=true;var q=vid.play();if(q&&q.catch)q.catch(function(){finish(true)})});
 skip.focus({preventScroll:true})}
function finish(){
 if(done)return;done=true;STAGE="fin";holdEnd();try{vid.pause()}catch(e){}
 endImg.classList.add("on");ui.hidden=true;fin.hidden=false;
 $("endLive").textContent="Cutscene finished. Press Continue a journey to see your record on the dashboard.";
 setTimeout(function(){$("csGo").focus({preventScroll:true})},500)}
vid.addEventListener("ended",finish);
vid.addEventListener("error",finish);

/* hold to skip: press and keep holding the button (mouse, touch, or Enter / Space) */
function holdStart(){if(hr||done)return;hs=performance.now();skip.classList.add("hold");
 (function step(){var p=Math.min(1,(performance.now()-hs)/HOLD);skip.style.setProperty("--p",p);if(p>=1){holdEnd();finish();return}hr=requestAnimationFrame(step)})()}
function holdEnd(){if(hr)cancelAnimationFrame(hr);hr=0;skip.classList.remove("hold");skip.style.setProperty("--p",0)}
skip.addEventListener("pointerdown",function(e){e.preventDefault();holdStart()});
["pointerup","pointerleave","pointercancel","blur"].forEach(function(t){skip.addEventListener(t,holdEnd)});
skip.addEventListener("keydown",function(e){if(e.key==="Enter"||e.key===" "){e.preventDefault();if(!e.repeat)holdStart()}});
skip.addEventListener("keyup",function(e){if(e.key==="Enter"||e.key===" ")holdEnd()});
skip.addEventListener("contextmenu",function(e){e.preventDefault()});
skip.addEventListener("click",function(){skip.classList.remove("nudge");void skip.offsetWidth;skip.classList.add("nudge")});

$("csVol").addEventListener("input",function(){setVol(this.value/100,true)});
$("csMute").addEventListener("click",function(){setVol(VOL===0?0.5:0,true)});
$("csGo").addEventListener("click",function(){close("dashboard")});
$("csReplay").addEventListener("click",function(){done=false;STAGE="cut";endImg.classList.remove("on");fin.hidden=true;ui.hidden=false;vid.currentTime=0;var p=vid.play();if(p&&p.catch)p.catch(function(){finish()});skip.focus({preventScroll:true})});

/* click anywhere / Enter / Space on the papyrus (win only) */
res.addEventListener("click",function(){if(OUT==="win")toCut()});
res.addEventListener("keydown",function(e){if(OUT==="win"&&(e.key==="Enter"||e.key===" ")&&e.target===res){e.preventDefault();toCut()}});
document.addEventListener("keydown",function(e){if(e.key!=="Escape"||end.hidden)return;if(STAGE==="res"||STAGE==="fin"){e.preventDefault();close()}});
matchMedia("(max-width:700px) and (orientation:portrait)").addEventListener&&matchMedia("(max-width:700px) and (orientation:portrait)").addEventListener("change",function(){if(!end.hidden&&STAGE==="res"&&$("papWrap").firstChild)$("papWrap").innerHTML=papyrus(OUT,matchMedia("(max-width:700px) and (orientation:portrait)").matches)});

/* ================= public API used by boss.js ================= */
function onBoss(){var b=$("boss");return!b||b.classList.contains("show")}
window.BCEnd={
 start:function(){if(!T0)T0=Date.now()},
 win:function(first){var ms=T0?Date.now()-T0:null;T0=0;
  REC.last=ms;REC.wins++;var rec=ms!=null&&(REC.best==null||ms<REC.best);if(rec)REC.best=ms;
  REC.hist.unshift({ok:1,ms:ms,at:Date.now()});REC.hist=REC.hist.slice(0,8);saveRec();renderRec();
  clearTimeout(tmr);tmr=setTimeout(function(){if(onBoss())open("win",{ms:ms,rec:rec,first:first,best:REC.best})},1900)},
 lose:function(){var ms=T0?Date.now()-T0:null;T0=0;REC.losses++;REC.hist.unshift({ok:0,ms:ms,at:Date.now()});REC.hist=REC.hist.slice(0,8);saveRec();renderRec();
  clearTimeout(tmr);tmr=setTimeout(function(){if(onBoss())open("lose",{ms:ms})},1500)},
 preview:function(out){if(out==="lose"){REC.losses=Math.max(REC.losses,1);open("lose",{ms:131400})}else{var b=REC.best==null?204300:REC.best;open("win",{ms:b,rec:true,first:true,best:b})}}};
window.BCREC={render:renderRec};

/* ================= login page (demo: no server, nothing is sent anywhere) ================= */
var mode="in";
function setMode(m){mode=m;$("tabIn").setAttribute("aria-selected",m==="in");$("tabUp").setAttribute("aria-selected",m==="up");
 $("lgNameRow").hidden=m!=="up";$("lgSubmit").textContent=m==="in"?"Log in":"Create account";$("lgErr").textContent="";$("lgPw").autocomplete=m==="in"?"current-password":"new-password"}
$("tabIn").onclick=function(){setMode("in")};$("tabUp").onclick=function(){setMode("up")};
$("lgf").onsubmit=function(e){e.preventDefault();
 var em=$("lgEm").value.trim().toLowerCase(),pw=$("lgPw").value,nm=$("lgNm").value.trim(),err=$("lgErr");
 if(mode==="up"&&nm.length<2){err.textContent="Please enter your name (at least 2 letters).";$("lgNm").focus();return}
 if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(em)){err.textContent="Enter a valid email, for example you@university.edu.";$("lgEm").focus();return}
 if(pw.length<6){err.textContent="Use a password with at least 6 characters.";$("lgPw").focus();return}
 var old=null;try{old=JSON.parse(lsGet("bc_acct_"+em)||"null")}catch(x){}
 USER={name:mode==="up"?nm:(old&&old.name)||em.split("@")[0],email:em};
 lsSet("bc_user",JSON.stringify(USER));lsSet("bc_acct_"+em,JSON.stringify({name:USER.name}));
 $("lgPw").value="";mergeRec();renderUser();$("lgGo").focus()};
$("lgGuest").onclick=function(){location.hash="#course"};
$("lgGo").onclick=function(){location.hash="#dashboard"};
$("lgOut").onclick=function(){USER=null;try{localStorage.removeItem("bc_user")}catch(e){}clearRec();setMode("in");renderUser();$("lgEm").focus()};
document.querySelectorAll("[data-lg]").forEach(function(a){a.addEventListener("click",function(){location.hash="#login"})});
setMode("in");userInit();

/* index.html?preview=win | lose opens the result screen straight away (handy for design review) */
var m=/[?&]preview=(win|lose)/.exec(location.search);
if(m)setTimeout(function(){location.hash="#boss";BCEnd.preview(m[1])},700);
})();
