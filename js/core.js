/* Shared helpers and state. Loaded first; every other file uses these. */
var $=function(i){return document.getElementById(i)};
var S={xp:0,done:{},qd:{},boss:0},cur=0;
try{localStorage.removeItem("bc_save")}catch(e){}
function save(){}
function esc(t){return String(t).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/\n/g,"<br>")}
function term(el,o,err){el.innerHTML=(err?'<b style="color:#ff8fa3">✗</b> ':"<b>▸</b> ")+esc(o)}
function nDone(){return Object.keys(S.done).length}
function unlocked(i){return i==0||S.done[i-1]||S.done[i]}
