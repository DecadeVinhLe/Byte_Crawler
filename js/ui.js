(function(){
var $=function(i){return document.getElementById(i)},root=document.documentElement,t=null;
try{t=localStorage.getItem("theme")}catch(e){}
t=t||(matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");
function ap(v){root.setAttribute("data-theme",v);$("th").setAttribute("aria-label",v=="dark"?"Switch to light mode":"Switch to dark mode")}
ap(t);$("th").onclick=function(){t=t=="dark"?"light":"dark";ap(t);try{localStorage.setItem("theme",t)}catch(e){}};
var jb=$("jb"),jm=$("jm"),bg=$("bg"),nv=$("nv");
function js(o){jm.classList.toggle("open",o);jb.setAttribute("aria-expanded",o)}
jb.onclick=function(e){e.stopPropagation();js(!jm.classList.contains("open"))};
bg.onclick=function(){var o=!nv.classList.contains("open");nv.classList.toggle("open",o);bg.setAttribute("aria-expanded",o)};
document.addEventListener("click",function(e){if(!jm.contains(e.target))js(false)});
document.addEventListener("keydown",function(e){if(e.key=="Escape"){js(false);jb.focus()}});
document.querySelectorAll(".menu a,.nav>li>a").forEach(function(a){a.addEventListener("click",function(){js(false);nv.classList.remove("open")})});
$("cf").onsubmit=function(e){e.preventDefault();$("ok").textContent="Quest accepted! We’ll reply soon.";e.target.reset()};
})();
