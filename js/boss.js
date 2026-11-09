/* Boss fight: two phases. Each phase is plain data (tests, starter code, hints, checks),
   so adding a Phase 3 means adding one more entry to PHASES and one more quest panel in index.html. */

var PHASES={
 1:{label:"🐉 Wyrm · Phase 1",who:"Wyrm",
  tests:[{n:8128,out:"True"},{n:1000,out:"False"},{n:4096,out:"False"},{n:9999,out:"False"}],
  start:"n = 8128   # the boss changes this number each round\ntotal = 0\nfor i in range(1, n):\n    # add i to total when i divides n evenly\n    pass\nprint(total == n)   # True if n is perfect",
  sol:"n = 8128\ntotal = 0\nfor i in range(1, n):\n    if n % i == 0:\n        total += i\nprint(total == n)",
  hints:["<b>Hint 1:</b> Loop <code>i</code> from 1 up to <code>n - 1</code>. A divisor satisfies <code>n % i == 0</code>.",
         "<b>Hint 2:</b> Inside the loop: <code>if n % i == 0:</code> then <code>total += i</code>. Mind the indentation."],
  check:function(code){return /^n\s*=/m.test(code)?"":"Keep the line  n = ...  at the top so the boss can change it."},
  run:function(code,t){return py(code.replace(/^n\s*=.*$/m,"n = "+t.n))},
  show:function(t){return "n = "+t.n}},
 /* Phase 2: the player must listen with input() and loop over what the Storm Wyrm shouts. */
 2:{label:"⚡ Storm Wyrm · Phase 2",who:"Storm Wyrm",
  tests:[{inp:["3","4","5","6"],out:"15"},{inp:["1","9"],out:"9"},{inp:["5","1","2","3","4","5"],out:"15"},
         {inp:["4","10","20","30","40"],out:"100"},{inp:["6","2","4","6","8","10","12"],out:"42"}],
  start:"# The Storm Wyrm shouts how many bolts it throws,\n# then the power of each bolt, one number per input().\nn = int(input())\ntotal = 0\nfor i in range(n):\n    # read one bolt with input(), turn it into a number, add it to total\n    pass\nprint(total)",
  sol:"n = int(input())\ntotal = 0\nfor i in range(n):\n    bolt = int(input())\n    total += bolt\nprint(total)",
  hints:["<b>Hint 1:</b> Read the count first: <code>n = int(input())</code>. Then repeat that many times with <code>for i in range(n):</code>.",
         "<b>Hint 2:</b> Inside the loop read one bolt, <code>bolt = int(input())</code>, and add it: <code>total += bolt</code>. Mind the indentation."],
  check:function(code){
   if(!/\binput\s*\(/.test(code))return "Use input() to listen: the Storm Wyrm shouts its numbers, and your code has to read them.";
   if(!/^\s*(for|while)\b/m.test(code))return "Add a loop (for or while) so you read every bolt, not just the first one.";
   return ""},
  run:function(code,t){return py(code,undefined,t.inp)},
  show:function(t){return "Wyrm shouts "+t.inp.join(", ")}}
};
var phase=1,HPMAX=PHASES[1].tests.length,won=false,hp=HPMAX,hearts=3,busy=false,hs=0,code1="";

function hud(){$("bhp").style.width=hp/HPMAX*100+"%";$("bname").textContent=PHASES[phase].label;
 $("bhr").textContent="♥♥♥".slice(0,hearts)+"♡♡♡".slice(0,3-hearts)}
function log(t,c){$("blog").innerHTML+='<div class="'+(c||"")+'">'+esc(t)+"</div>"}

/* Switch the quest panel, starter code and hints to the given phase. */
function enterPhase(n){
 if(n==2)code1=$("bed").value;
 phase=n;HPMAX=PHASES[n].tests.length;hp=HPMAX;hearts=3;hs=0;
 $("q1").hidden=n!=1;$("q2").hidden=n!=2;$("bh").hidden=true;
 $("bed").value=n==1&&code1?code1:PHASES[n].start;hud()}

$("bed").value=PHASES[1].start;

$("bhint").onclick=function(){var P=PHASES[phase],h=$("bh");h.hidden=false;hs++;
 h.innerHTML=hs<=P.hints.length?P.hints[hs-1]:"<b>Solution:</b><br><code style='white-space:pre;display:block;padding:8px'>"+esc(P.sol)+"</code>"};

$("batk").onclick=function(){if(busy)return;
 if(won){won=false;enterPhase(1)}
 var P=PHASES[phase],code=$("bed").value,msg=P.check(code);
 if(msg){$("blog").innerHTML="";log(msg,"x");return}
 busy=true;hp=HPMAX=P.tests.length;hearts=3;hud();$("blog").innerHTML="";
 if(phase==2)log("⚡ Phase 2: miss a round and the Storm Wyrm hurls lightning!","x");
 if(F.setPhase)F.setPhase(phase);var i=0;
 (function rd(){if(i>=P.tests.length){busy=false;
   if(hp==0){
    if(phase==1){log("🐉 The Wyrm falls! ...but the sky cracks open.","g");busy=true;F.phase2();
     setTimeout(function(){enterPhase(2);
      log("⚡ PHASE 2: the Storm Wyrm awakens! It shouts numbers now. Use input() and a loop to catch them, then press Attack.","g");busy=false},2400)}
    else{log("⚡ The Storm Wyrm falls! "+(S.boss?"":"+200 XP · Reward: 🐉 Wyrm Slayer"),"g");if(!S.boss){S.boss=1;S.xp+=200;save();side();dash()}won=true;F.win()}}
   else log("The "+P.who+" survives with "+hp+"/"+HPMAX+" HP. Fix your code and attack again.","x");return}
  var t=P.tests[i],r=P.run(code,t),ok=!r.err&&r.out.trim()==t.out;
  log("Round "+(i+1)+": "+P.show(t)+" → "+(r.err||r.out||"(no output)")+" · expected "+t.out+(ok?"  ✓ HIT":"  ✗ MISS"),ok?"g":"x");
  if(ok)hp--;else hearts--;F.atk(ok);hud();i++;
  if(hearts<=0){busy=false;setTimeout(function(){log("💀 You fell. Debug your code and try again.","x");F.lose()},1000);return}
  setTimeout(rd,1500)})()};

/* Phase 2 helper: type your own input (one value per line) and see what your code prints. */
$("p2run").onclick=function(){
 var lines=$("p2in").value.split("\n").map(function(x){return x.trim()}).filter(function(x){return x!==""}),
     r=py($("bed").value,undefined,lines);
 term($("p2o"),r.err?(r.out?r.out+"\n":"")+r.err:(r.out||"(no output)"),!!r.err)};

/* Phase 1 helper: list the divisors of any number. */
$("dxb").onclick=function(){var n=parseInt($("dxn").value,10),o=$("dxo");if(!(n>1&&n<=100000)){o.textContent="Enter a whole number from 2 to 100000.";return}
 var d=[],t=0;for(var i=1;i<n;i++)if(n%i==0){d.push(i);t+=i}
 o.innerHTML=d.map(function(x){return"<i>"+x+"</i>"}).join('<em>+</em>')+'<div class="dxs">Sum = <b>'+t+'</b> '+(t==n?'= '+n+' → <b class="g">perfect ✓</b>':'≠ '+n+' → <b class="x">not perfect ✗</b>')+"</div>"};
$("dxb").onclick();
