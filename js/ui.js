(function(){
var $=function(i){return document.getElementById(i)},root=document.documentElement,t=null;
try{t=localStorage.getItem("theme")}catch(e){}
t=t||(matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");
function ap(v){root.setAttribute("data-theme",v);$("th").setAttribute("aria-label",v=="dark"?"Switch to light mode":"Switch to dark mode")}
ap(t);$("th").onclick=function(){t=t=="dark"?"light":"dark";ap(t);try{localStorage.setItem("theme",t)}catch(e){}};
var jb=$("jb"),jm=$("jm"),bg=$("bg"),nv=$("nv"),hd=document.querySelector("header"),strip=hd.querySelector(".top"),ov=$("nvo"),mq=matchMedia("(max-width:860px)");
function js(o){jm.classList.toggle("open",o);jb.setAttribute("aria-expanded",o)}
function nvo(){return nv.classList.contains("open")}
function nvs(o){nv.classList.toggle("open",o);bg.setAttribute("aria-expanded",o);bg.setAttribute("aria-label",o?"Close menu":"Menu");root.classList.toggle("nv-lock",o);if(o)show();else js(false)}
jb.onclick=function(e){e.stopPropagation();js(!jm.classList.contains("open"))};
bg.onclick=function(){nvs(!nvo())};
ov.onclick=function(){nvs(false)};
document.addEventListener("click",function(e){if(!jm.contains(e.target)&&e.target!==jb)js(false)});
document.addEventListener("keydown",function(e){if(e.key=="Escape"){var was=nvo();js(false);if(was){nvs(false);bg.focus()}else jb.focus()}});
document.querySelectorAll(".menu a,.nav>li>a").forEach(function(a){a.addEventListener("click",function(){js(false);nvs(false)})});
(mq.addEventListener?mq.addEventListener("change",function(){nvs(false)}):mq.addListener(function(){nvs(false)}));
/* active page marker */
function mark(){var h=location.hash||"#home",j=false;document.querySelectorAll(".nav a").forEach(function(a){var on=a.getAttribute("href")==h;if(on){a.setAttribute("aria-current","page");if(a.closest(".menu"))j=true}else a.removeAttribute("aria-current")});jb.classList.toggle("on",j)}
addEventListener("hashchange",function(){mark();nvs(false)});mark();
/* header: full at the top, hides on scroll down, returns on scroll up (like robonation.org) */
var lastY=Math.max(0,scrollY),busy=false,stripH=0,TH=6;
function measure(){stripH=strip?strip.offsetHeight:0;hd.style.setProperty("--strip",stripH+"px")}
function state(s){if(hd.getAttribute("data-nav")!==s){hd.setAttribute("data-nav",s);root.setAttribute("data-hdr",s)}}
function show(){state(Math.max(0,scrollY)<=stripH+2?"top":"compact")}
function upd(){busy=false;var y=Math.max(0,Math.min(scrollY,document.documentElement.scrollHeight-innerHeight)),dy=y-lastY;
 if(nvo()||jm.classList.contains("open")||hd.querySelector(":focus-visible")){show();lastY=y;return}
 if(y<=stripH+2){state("top");lastY=y;return}
 if(Math.abs(dy)<TH)return;
 state(dy>0&&y>hd.offsetHeight?"hidden":"compact");lastY=y}
function req(){if(!busy){busy=true;requestAnimationFrame(upd)}}
addEventListener("scroll",req,{passive:true});addEventListener("resize",function(){measure();req()});
hd.addEventListener("focusin",function(){if(hd.querySelector(":focus-visible"))show()});
measure();upd();
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(measure);
$("cf").onsubmit=function(e){e.preventDefault();$("ok").textContent="Quest accepted! We’ll reply soon.";e.target.reset()};
$("hcf").onsubmit=function(e){e.preventDefault();$("hok").textContent="Quest accepted! We’ll reply soon.";e.target.reset()};
})();
