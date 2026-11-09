/* Dashboard stats and the free sandbox. */
/* dashboard */
var SBC='print("Hello, ByteCrawler!")\nfor i in range(1, 4):\n    print(i * i)';
function dash(){var n=nDone(),lv=Math.floor(S.xp/250)+1;
 $("dxp").textContent=S.xp;$("dbar").style.width=(S.xp%250)/250*100+"%";$("dlv").textContent="Level "+lv+" · "+(250-S.xp%250)+" XP to next level";
 $("dmn").textContent=n+" / "+L.length;$("dboss").textContent=S.boss?"🐉 Wyrm Slayer · boss defeated":"Boss not defeated yet";
 $("dfl").innerHTML="<i>🔥</i>".repeat(7);
 $("dmods").innerHTML=L.map(function(d,i){return '<div class="'+(S.done[i]?"dn":"")+'"><span>'+(S.done[i]?"✓ ":"")+d.t+"</span><span>"+(S.done[i]?d.r:"🔒")+"</span></div>"}).join("")+'<div class="'+(S.boss?"dn":"")+'"><span>Boss: Perfect Number Wyrm</span><span>'+(S.boss?"🐉 Wyrm Slayer":"🔒")+"</span></div>"}
$("sb").value=SBC;
$("sbrun").onclick=function(){var r=py($("sb").value);term($("sbo"),r.err?(r.out?r.out+"\n":"")+r.err:(r.out||"(no output)"),!!r.err)};
$("sbrst").onclick=function(){$("sb").value=SBC;term($("sbo"),"Sandbox ready")};
