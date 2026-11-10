/* Learning path: lesson view, quick challenge, run/submit buttons. */
function ez(i){var e=EZ[i],d=L[i];
 $("ez").innerHTML='<div class="ezs"><b>IN ONE SENTENCE</b>'+e.s+'</div><p class="an">🧠 Think of it like <b>'+e.a+'</b></p><div class="lh">Example code</div><pre class="cb">'+esc(d.c)+'</pre><div class="lh">Step by step</div><ol class="stp">'+e.st.map(function(x){return"<li>"+x+"</li>"}).join("")+'</ol><div class="outl">Output: <b>'+esc(d.o).replace(/<br>/g," ")+'</b></div>'+(e.alt?'<div class="lh">'+e.alt[0]+'</div><pre class="cb">'+esc(e.alt[1])+'</pre>':"");
 $("ez2").innerHTML='<div class="wo"><b>⚠ WATCH OUT</b> '+e.w+'</div>'}

$("mks").onclick=function(e){var b=e.target.closest(".mk,.door");if(!b)return;
 if(b.dataset.b){if(nDone()>=L.length)location.hash="#boss";else{$("res").style.color="#dc2626";$("res").textContent="The boss door is locked. Clear all "+L.length+" checkpoints first ("+nDone()+"/"+L.length+")."}return}
 var i=+b.dataset.i;if(!unlocked(i)){$("res").style.color="#dc2626";$("res").textContent="Locked. Clear checkpoint "+i+" first.";return}lesson(i)};
function side(){var n=nDone();
 $("tree").innerHTML=L.map(function(d,i){return '<button class="tm1'+(i==cur?" on":"")+(S.done[i]?" dn":"")+'" data-i="'+i+'"><i>'+(S.done[i]?"✓":unlocked(i)?"":"🔒")+"</i>"+d.t+"</button>"}).join("");
 $("pb").style.width=n/L.length*100+"%";$("pt").textContent=n+" / "+L.length+" checkpoints cleared";$("xpt").textContent=S.xp+" XP";
 var q=L[cur].q,r=S.qd[cur];$("challenge").innerHTML="<b>QUICK CHALLENGE</b>"+q[0]+q[1].map(function(o,i){return '<button class="opt'+(r?(i==q[2]?" ok":(i==r.p?" no":"")):"")+'" data-o="'+i+'">'+esc(o)+"</button>"}).join("");map()}
function lesson(i){cur=i;var d=L[i];$("lno").textContent="CHECKPOINT "+(i+1)+" / "+L.length;$("lt").textContent=d.t;
 $("terms").innerHTML=d.k.map(function(x){return "<div><dt>"+x[0]+"</dt><dd>"+x[1]+"</dd></div>"}).join("");
 $("plain").textContent=d.p;$("mth").textContent=d.th;$("ex").textContent=d.ex;$("ed").value=d.c;term($("out"),"Terminal ready");$("res").textContent="";ez(i);side()}
$("tree").onclick=function(e){var b=e.target.closest(".tm1");if(!b)return;var i=+b.dataset.i;if(unlocked(i))lesson(i);else{$("res").style.color="#dc2626";$("res").textContent="Locked. Clear checkpoint "+i+" first."}};
$("challenge").onclick=function(e){var b=e.target.closest(".opt");if(!b||S.qd[cur])return;var i=+b.dataset.o;S.qd[cur]={p:i};if(i==L[cur].q[2])S.xp+=10;save();side();dash()};
document.querySelectorAll(".run").forEach(function(b){b.onclick=function(){var r=py($("ed").value);term($("out"),r.err?(r.out?r.out+"\n":"")+r.err:(r.out||"(no output)"),!!r.err)}});
document.querySelectorAll(".sub").forEach(function(b){b.onclick=function(){var r=py($("ed").value),res=$("res"),d=L[cur];
 if(!r.err&&r.out.trim()==d.o){res.style.color="#16a34a";
  if(!S.done[cur]){S.done[cur]=1;S.xp+=50;save()}
  res.innerHTML='✓ Checkpoint cleared! +50 XP · Reward: '+d.r+(cur<L.length-1?' <button class="btn s nx" type="button" style="margin-left:8px">Next →</button>':' <button class="btn s nx" type="button" style="margin-left:8px">To the boss ☠</button>');
  term($("out"),r.out);side();dash();
  /* bring the map into view so the learner sees the guide walk on */
  var mp=$("map");if(mp)setTimeout(function(){var q=mp.getBoundingClientRect();if(q.top<0||q.bottom>innerHeight)mp.scrollIntoView({behavior:"smooth",block:"center"})},200)}
 else{res.style.color="#dc2626";res.textContent=r.err?r.err:"Not yet. Expected output: "+d.o.replace(/\n/g," ")}}});
$("res").onclick=function(e){if(e.target.closest(".nx")){if(cur<L.length-1)lesson(cur+1);else location.hash="#boss"}};
