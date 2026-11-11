/* Dungeon map, checkpoint markers, boss door and the Python snake guide. */
/* map */
var MAPS={A:{n:"Flooded Catacombs",img:"mapA",pos:[[6,33],[18,33],[28,24],[41,38],[49,52],[60,62],[72,62],[74,46],[82,22]],door:[89,31]}};
function doorSvg(o){return '<img class="dimg" src="'+IMG.door+'" alt="">'+(o?"":'<i class="dcl"><b></b></i>')}
function map(){var M=MAPS.A,pts=M.pos.concat([M.door]),all=nDone()>=L.length,im=$("mapimg");
 if(im.dataset.k!=M.img){im.dataset.k=M.img;im.src=IMG[M.img]}
 $("route").innerHTML='<polyline points="'+pts.map(function(p){return p[0]+","+p[1]}).join(" ")+'"/>';
 $("mks").innerHTML=M.pos.map(function(p,i){return '<button class="mk'+(S.done[i]?" dn":i==cur?" on":"")+(unlocked(i)?"":" lk")+'" data-i="'+i+'" style="left:'+p[0]+"%;top:"+p[1]+'%" aria-label="Checkpoint '+(i+1)+": "+L[i].t+'">'+(S.done[i]?"✓":unlocked(i)?i+1:"🔒")+"</button>"}).join("")+
 '<button class="door '+(all?"op":"lk")+'" data-b="1" style="left:'+M.door[0]+"%;top:"+M.door[1]+'%" aria-label="Boss room door, '+(all?"open":"locked")+'">'+doorSvg(all)+"<span>"+(all?"OPEN ▶":"BOSS DOOR")+"</span></button>"}

/* ---- Dungeon guide (walks the route) ---- */
(function(){
 var pyEl=$("py"),bub=$("pyb"),mapEl=$("map");if(!pyEl||!mapEl)return;
 var C={K:"#10210a",G:"#8ab833",L:"#c4e66a",D:"#5f8a1f",Y:"#f7dc7a",Z:"#e0bb4e",W:"#ffffff",E:"#10210a",T:"#c4506e"};
 var TOP=["....KKKKKKKK....","...KGLLGGGGGK...","..KGGGGGGGGGGK..","..KGWEGGGGWEGK..","..KYYYYYYYYYYK..","...KYYYYYYYYK..."];
 var W1=TOP.concat(["....KKYTTYKK....",".....KYTTYK.....","....KYYYYYK.....","..KKYYYYYYKKK...",".KGGDGYYGGDGGK..","KGDGGGGGGGGDGGK.","KYYZYYYYYZYYYYK.",".KKKKKKKKKKKKKK."]);
 var W2=TOP.concat(["....KKYYYYKK....",".....KYYYYK.....","....KYYYYYK.....","..KKYYYYYYKKK...",".KGDGGYYGDGGGK..","KGGGDGGGGGGDGGK.","KYYYYZYYYYYZYYK.",".KKKKKKKKKKKKKK."]);
 function g(rows,id){var r="";rows.forEach(function(row,y){for(var x=0;x<row.length;x++){var c=row[x];if(c!=".")r+='<rect x="'+x+'" y="'+y+'" width="1" height="1" fill="'+C[c]+'"/>'}});return'<g id="'+id+'">'+r+"</g>"}
 pyEl.innerHTML='<svg viewBox="0 0 16 14" aria-hidden="true">'+g(W1,"pf1")+g(W2,"pf2").replace('id="pf2"','id="pf2" style="display:none"')+"</svg>";
 var f1=pyEl.querySelector("#pf1"),f2=pyEl.querySelector("#pf2");
 var TIPS=["Say hello: <code>print('Hello!')</code>","Variables are jars: <code>x = 5</code>","Loops repeat: <code>for i in range(3):</code>","Tiny function: <code>lambda x: x*2</code>","Indentation matters in Python. Keep it neat!","Decisions: <code>if hp &gt; 0:</code> else keep fighting"],ti=0,hideT=0,greeted=false;
 var still=matchMedia("(prefers-reduced-motion: reduce)").matches;
 var pts=[],key="",seg=[],cum=[0],tot=0,u=0,fr=0,n=0,snap=true,walking=false,seen=0,lastKey="";
 /* The guide only moves when the learner clears a checkpoint: it stands on the
    current checkpoint, then walks to the next one (or the boss door) as soon as
    S.done grows. Resizing just re-places it, without walking. */
 function load(){var el=document.querySelector("#route polyline");if(!el)return false;var k=el.getAttribute("points");if(k===key)return pts.length>1;key=k;
  pts=k.split(" ").map(function(p){var a=p.split(",");return[+a[0],+a[1]]});snap=true;return pts.length>1}
 function measure(){var W=mapEl.clientWidth,H=mapEl.clientHeight,old=tot;seg=[];cum=[0];tot=0;for(var i=1;i<pts.length;i++){var l=Math.hypot((pts[i][0]-pts[i-1][0])*W/100,(pts[i][1]-pts[i-1][1])*H/100);seg.push(l);tot+=l;cum.push(tot)}
  if(old>0&&!snap)u=u/old*tot}
 function at(d){for(var i=0;i<seg.length;i++){if(d<=seg[i]||i==seg.length-1){var t=seg[i]?Math.min(1,d/seg[i]):0;return[pts[i][0]+(pts[i+1][0]-pts[i][0])*t,pts[i][1]+(pts[i+1][1]-pts[i][1])*t]}d-=seg[i]}}

 function face(d){for(var i=0;i<seg.length;i++){if(d<=cum[i+1]||i==seg.length-1)return pts[i+1][0]<pts[i][0]}return false}
 function say(h){bub.innerHTML=h;bub.hidden=false;place();clearTimeout(hideT);hideT=setTimeout(function(){bub.hidden=true},4200)}
 function place(){if(bub.hidden)return;
  /* keep the bubble inside the map: clamp sideways, flip below the guide when there is no room above */
  var W=mapEl.clientWidth,x=pyEl.offsetLeft,y=pyEl.offsetTop,bw=bub.offsetWidth,bh=bub.offsetHeight,h=pyEl.offsetHeight,m=6;
  var l=Math.max(bw/2+m,Math.min(W-bw/2-m,x));bub.style.left=l+"px";bub.style.setProperty("--ax",Math.max(-bw/2+14,Math.min(bw/2-14,x-l))+"px");
  var up=y-h*.8-14-bh>=m;
  if(up){bub.classList.remove("dn");bub.style.top=(y-h*.8-14)+"px"}else{bub.classList.add("dn");bub.style.top=(y+h*.2+14)+"px"}}

 function arrive(i){say(i<L.length?"Checkpoint "+(i+1)+": "+L[i].t+". Your turn!":"The boss door is open! Click it if you dare.")}
 function tick(){if(document.hidden||!mapEl.offsetParent)return;
  if(!load())return;pyEl.hidden=false;
  var m=mapEl.clientWidth+"x"+mapEl.clientHeight+key;if(m!==lastKey){lastKey=m;measure()}
  var gi=Math.min(nDone(),pts.length-1),gu=cum[gi];
  if(snap){snap=false;u=gu;seen=gi;walking=false}
  if(!greeted){greeted=true;pyEl.classList.add("in");setTimeout(function(){pyEl.classList.remove("in")},700);say("Ssssup! I'm Python, your dungeon guide. Clear a checkpoint and I'll slither on to the next one. Click me for a tip.")}
  else if(gi>seen){seen=gi;say("Nice work! Follow me to the next room.")}
  if(u<gu-.5){walking=true;
   if(still)u=gu;else{u=Math.min(gu,u+6);n++;if(n%2==0){fr^=1;f1.style.display=fr?"none":"";f2.style.display=fr?"":"none"}}}
  else if(u>gu+.5)u=gu;
  if(walking&&u>=gu-.5){walking=false;u=gu;fr=0;f1.style.display="";f2.style.display="none";arrive(gi)}
  var p=at(u);pyEl.style.left=p[0]+"%";pyEl.style.top="calc("+p[1]+"% - 30px)";pyEl.classList.toggle("fl",face(u));place()}
 setInterval(tick,130);
 pyEl.onclick=function(e){e.stopPropagation();say(TIPS[ti++%TIPS.length])};
 document.addEventListener("click",function(e){if(bub.hidden||pyEl.contains(e.target))return;clearTimeout(hideT);bub.hidden=true},true);
})();
