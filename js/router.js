/* Hash router: shows one page at a time and starts page-specific code. */
/* router */
var PG=["home","about","course","boss","contact","dashboard","community"];
function route(){var h=(location.hash||"#home").slice(1),all=h=="all";if(h=="problem-solving")h="boss";if(!all&&PG.indexOf(h)<0)h="home";
 document.querySelectorAll(".pg").forEach(function(p){p.classList.toggle("show",all||p.id==h)});
 if(all||h=="boss")arena();if(all||h=="dashboard")dash();window.scrollTo(0,0)}
if(location.hash&&location.hash!="#all")history.replaceState(null,"",location.pathname+location.search);addEventListener("hashchange",route);clsUi();hud();lesson(Math.min(nDone(),L.length-1));dash();route();
