/* Loading screen: stays up until fonts and images are ready, but never for less than MIN ms so it never just flashes.
   Click "Skip" to enter early. If anything stalls, it closes by itself after MAX ms. */
(function(){
 var el=document.getElementById("loader"),root=document.documentElement;
 if(!el){root.classList.remove("is-loading");return}
 var blocks=el.querySelectorAll(".ld-bar i"),msg=document.getElementById("ldMsg"),pct=document.getElementById("ldPct"),
     reduce=matchMedia("(prefers-reduced-motion: reduce)").matches,MIN=reduce?400:1500,MAX=7000,
     t0=performance.now(),ready=false,p=0,fin=false,waiting=2,
     MSG=[[0,"Lighting the torches…"],[35,"Waking the Python guide…"],[70,"Sharpening the pixels…"],[100,"Ready!"]];
 function paint(){var n=Math.round(p/100*blocks.length),m=MSG[0][1];
  for(var i=0;i<blocks.length;i++)blocks[i].classList.toggle("on",i<n);
  MSG.forEach(function(x){if(p>=x[0])m=x[1]});if(msg.textContent!==m)msg.textContent=m;pct.textContent=Math.round(p)+"%"}
 function finish(){if(fin)return;fin=true;p=100;paint();el.classList.add("done");root.classList.remove("is-loading");
  setTimeout(function(){if(el.parentNode)el.parentNode.removeChild(el)},700)}
 function loop(now){if(fin)return;var e=now-t0,target=Math.min(ready?100:88,e/MIN*100);
  p+=(target-p)*.14;if(Math.abs(target-p)<.4)p=target;paint();
  if(ready&&e>=MIN&&p>=99.5){finish();return}requestAnimationFrame(loop)}
 function one(){if(--waiting<=0)ready=true}
 if(document.readyState=="complete")one();else addEventListener("load",one);
 (document.fonts&&document.fonts.ready?document.fonts.ready:Promise.resolve()).then(one,one);
 document.getElementById("ldSkip").onclick=finish;
 setTimeout(finish,MAX);
 requestAnimationFrame(loop);
})();
