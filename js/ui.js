/* Header, theme toggle, mobile menu, contact forms. */
(function(){
var $=function(i){return document.getElementById(i)},root=document.documentElement;

/* ---- Theme (light / dark), remembered in localStorage ---- */
var t=null;
try{t=localStorage.getItem("theme")}catch(e){}
t=t||(matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");
var ths=document.querySelectorAll(".th");  /* one in the top strip, one in the scrolled icon bar */
function applyTheme(v){root.setAttribute("data-theme",v);var l=v=="dark"?"Switch to light mode":"Switch to dark mode";
  ths.forEach(function(b){b.setAttribute("aria-label",l);b.title=l})}
applyTheme(t);
ths.forEach(function(b){b.onclick=function(){t=t=="dark"?"light":"dark";applyTheme(t);try{localStorage.setItem("theme",t)}catch(e){}}});

/* ---- Menus: Journey dropdown (desktop) and hamburger tray (phone) ---- */
var hd=document.querySelector("header"),
    jb=$("jb"),jm=$("jm"),bg=$("bg"),nv=$("nv"),ov=$("nvo"),mq=matchMedia("(max-width:860px)");
function journey(o){jm.classList.toggle("open",o);jb.setAttribute("aria-expanded",o)}
function menu(o){nv.classList.toggle("open",o);bg.setAttribute("aria-expanded",o);bg.setAttribute("aria-label",o?"Close menu":"Menu");
  root.classList.toggle("nv-lock",o);if(!o)journey(false)}
function menuOpen(){return nv.classList.contains("open")}
jb.onclick=function(e){e.stopPropagation();journey(!jm.classList.contains("open"))};
bg.onclick=function(){menu(!menuOpen())};
ov.onclick=function(){menu(false)};
document.addEventListener("click",function(e){if(!jm.contains(e.target)&&e.target!==jb)journey(false)});
document.addEventListener("keydown",function(e){if(e.key!="Escape")return;var was=menuOpen();journey(false);if(was){menu(false);bg.focus()}else jb.focus()});
document.querySelectorAll(".menu a,.nav>li>a,.ico a").forEach(function(a){a.addEventListener("click",function(){journey(false);menu(false)})});
(mq.addEventListener?mq.addEventListener("change",function(){menu(false)}):mq.addListener(function(){menu(false)}));

/* ---- Mark the current page in the menu ---- */
function markCurrent(){var h=location.hash||"#home",inMenu=false;
  document.querySelectorAll(".nav a,.ico a,.top a").forEach(function(a){var on=a.getAttribute("href")==h;
    if(on){a.setAttribute("aria-current","page");if(a.closest(".menu"))inMenu=true}else a.removeAttribute("aria-current")});
  jb.classList.toggle("on",inMenu)}
addEventListener("hashchange",function(){markCurrent();menu(false)});markCurrent();

/* ---- RoboNation-style scroll: the utility strip slides away and its links return as icons in the bar.
   --strip = strip height, so the header can slide up by exactly that much without changing size (no jitter). ---- */
var strip=hd.querySelector(".top");
function measure(){hd.style.setProperty("--strip",strip.offsetHeight+"px")}
function shadow(){hd.classList.toggle("scrolled",scrollY>24)}
addEventListener("scroll",shadow,{passive:true});addEventListener("resize",measure);measure();shadow();
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(measure);

/* ---- Contact forms (front-end only for now) ---- */
$("cf").onsubmit=function(e){e.preventDefault();$("ok").textContent="Quest accepted! We\u2019ll reply soon.";e.target.reset()};
$("hcf").onsubmit=function(e){e.preventDefault();$("hok").textContent="Quest accepted! We\u2019ll reply soon.";e.target.reset()};
})();
