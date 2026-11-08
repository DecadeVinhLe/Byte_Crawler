(function(){
var $=function(i){return document.getElementById(i)};
var IMG={door:"assets/images/door.png",rogue:"assets/images/rogue.png",ruins:"assets/images/ruins.jpg",arches:"assets/images/arches.png",mapA:"assets/images/mapA.jpg",mapB:"assets/images/mapB.jpg",knight:"assets/images/knight.png",mage:"assets/images/mage.png",ranger:"assets/images/ranger.png",dragon:"assets/images/dragon.png",dragon2:"assets/images/dragon2.png"};
document.querySelectorAll("img[data-k]").forEach(function(i){i.src=IMG[i.dataset.k]});
function py(src,limit){
var steps=0,out=[],limit=limit||3e6,BRK={},CNT={};
function str(v){return v===true?"True":v===false?"False":v===null?"None":Array.isArray(v)?"["+v.map(rp).join(", ")+"]":String(v)}
function rp(v){return typeof v=="string"?"'"+v+"'":str(v)}
var B={print:function(){out.push([].slice.call(arguments).map(str).join(" "))},
range:function(a,b,c){var r=[],s=c||1;if(b===undefined){b=a;a=0}if(s>0)for(var i=a;i<b;i+=s)r.push(i);else for(var i=a;i>b;i+=s)r.push(i);return r},
int:function(x){return typeof x=="string"?parseInt(x,10):Math.trunc(x)},str:str,len:function(x){return x.length},abs:Math.abs,
sum:function(a){return a.reduce(function(s,x){return s+x},0)},max:function(){var a=arguments.length==1?arguments[0]:[].slice.call(arguments);return Math.max.apply(null,a)},min:function(){var a=arguments.length==1?arguments[0]:[].slice.call(arguments);return Math.min.apply(null,a)}};
function T(s){var r=[],re=/\s*(\d+\.?\d*|[A-Za-z_]\w*|"[^"]*"|'[^']*'|\/\/|\*\*|==|!=|<=|>=|[-+*\/%()<>,:\[\]])/y,m;
 while(re.lastIndex<s.length){if(/^\s*$/.test(s.slice(re.lastIndex)))break;m=re.exec(s);if(!m)throw Error("SyntaxError: invalid syntax near '"+s.slice(re.lastIndex,re.lastIndex+6)+"'");r.push(m[1])}return r}
function P(s){var t=T(s),p=0;
 function pk(){return t[p]}function nx(){return t[p++]}function ex(x){if(nx()!==x)throw Error("SyntaxError: expected '"+x+"'")}
 function or(){var l=and();while(pk()==="or"){nx();l=["or",l,and()]}return l}
 function and(){var l=nt();while(pk()==="and"){nx();l=["and",l,nt()]}return l}
 function nt(){if(pk()==="not"){nx();return["not",nt()]}return cmp()}
 function cmp(){var l=add(),o;while(["==","!=","<",">","<=",">="].indexOf(pk())>=0){o=nx();l=["b",o,l,add()]}return l}
 function add(){var l=mul(),o;while(pk()==="+"||pk()==="-"){o=nx();l=["b",o,l,mul()]}return l}
 function mul(){var l=un(),o;while(["*","/","//","%"].indexOf(pk())>=0){o=nx();l=["b",o,l,un()]}return l}
 function un(){if(pk()==="-"){nx();return["neg",un()]}return pw()}
 function pw(){var l=cl();if(pk()==="**"){nx();return["b","**",l,un()]}return l}
 function cl(){var a=at();while(pk()==="("){nx();var g=[];while(pk()!==")"&&pk()!==undefined){g.push(or());if(pk()===",")nx()}ex(")");a=["call",a,g]}return a}
 function at(){var x=nx();if(x===undefined)throw Error("SyntaxError: unexpected end of line");
  if(x==="("){var e=or();ex(")");return e}
  if(x==="["){var g=[];while(pk()!=="]"&&pk()!==undefined){g.push(or());if(pk()===",")nx()}ex("]");return["list",g]}
  if(/^\d/.test(x))return["n",parseFloat(x)];if(x[0]==='"'||x[0]==="'")return["n",x.slice(1,-1)];
  if(x==="True")return["n",true];if(x==="False")return["n",false];if(x==="None")return["n",null];
  if(x==="lambda"){var ps=[];while(pk()!==":"&&pk()!==undefined){ps.push(nx());if(pk()===",")nx()}ex(":");return["lam",ps,or()]}
  if(/^[A-Za-z_]/.test(x))return["v",x];throw Error("SyntaxError: unexpected '"+x+"'")}
 var r=or();if(p<t.length)throw Error("SyntaxError: unexpected '"+t[p]+"'");return r}
function bin(o,a,b){switch(o){
 case"+":if(typeof a!=typeof b&&(typeof a=="string"||typeof b=="string"))throw Error("TypeError: can't add text and number");return a+b;
 case"-":return a-b;case"*":return a*b;
 case"/":if(b===0)throw Error("ZeroDivisionError: division by zero");return a/b;
 case"//":if(b===0)throw Error("ZeroDivisionError: division by zero");return Math.floor(a/b);
 case"%":if(b===0)throw Error("ZeroDivisionError: modulo by zero");return((a%b)+b)%b;
 case"**":return Math.pow(a,b);case"==":return a===b;case"!=":return a!==b;case"<":return a<b;case">":return a>b;case"<=":return a<=b;case">=":return a>=b}}
function V(n,env){if(++steps>limit)throw Error("TimeoutError: too many steps (infinite loop?)");
 switch(n[0]){case"n":return n[1];
 case"v":if(n[1] in env)return env[n[1]];if(n[1] in B)return B[n[1]];throw Error("NameError: name '"+n[1]+"' is not defined");
 case"list":return n[1].map(function(x){return V(x,env)});
 case"neg":return -V(n[1],env);case"not":return !V(n[1],env);
 case"or":var a=V(n[1],env);return a?a:V(n[2],env);
 case"and":var c=V(n[1],env);return c?V(n[2],env):c;
 case"lam":return{ps:n[1],body:n[2],env:env,lam:1};
 case"call":var f=V(n[1],env),g=n[2].map(function(x){return V(x,env)});return cf(f,g);
 case"b":return bin(n[1],V(n[2],env),V(n[3],env))}}
function cf(f,g){if(typeof f=="function")return f.apply(null,g);
 if(!f||!f.ps)throw Error("TypeError: object is not callable");
 if(g.length!==f.ps.length)throw Error("TypeError: expected "+f.ps.length+" argument(s), got "+g.length);
 var e=Object.create(f.env);f.ps.forEach(function(k,i){e[k]=g[i]});
 if(f.lam)return V(f.body,e);
 try{X(f.b,e)}catch(x){if(x&&x.ret)return x.v;throw x}return null}
var lines=src.split("\n").map(function(l,i){var t=l.trim();if(t[0]==="#")t="";t=t.replace(/\s+#[^"']*$/,"");return{i:i+1,ind:l.match(/^ */)[0].length,t:t}}).filter(function(l){return l.t});
function blk(i,ind){var r=[];while(i<lines.length&&lines[i].ind===ind){var L=lines[i],t=L.t;i++;
 if(/:$/.test(t)&&/^(if|elif|else|for|while|def)\b/.test(t)){
  if(!(i<lines.length&&lines[i].ind>ind))throw Error("IndentationError: expected an indented block (line "+L.i+")");
  var s=blk(i,lines[i].ind);i=s[1];r.push({k:t.match(/^\w+/)[0],t:t,b:s[0],L:L.i})}
 else r.push({k:"s",t:t,L:L.i})}
 if(i<lines.length&&lines[i].ind>ind)throw Error("IndentationError: unexpected indent (line "+lines[i].i+")");
 return[r,i]}
function X(b,env){for(var j=0;j<b.length;j++){var s=b[j];try{
 if(s.k==="if"){var d=false,m;if(V(P(s.t.slice(2,-1)),env)){X(s.b,env);d=true}
  while(j+1<b.length&&(b[j+1].k==="elif"||b[j+1].k==="else")){j++;var q=b[j];if(!d){if(q.k==="else"){X(q.b,env);d=true}else if(V(P(q.t.slice(4,-1)),env)){X(q.b,env);d=true}}}}
 else if(s.k==="for"){var m=s.t.match(/^for\s+(\w+)\s+in\s+(.+):$/);if(!m)throw Error("SyntaxError: bad for loop");var it=V(P(m[2]),env);if(typeof it=="string")it=it.split("");
  for(var k=0;k<it.length;k++){env[m[1]]=it[k];try{X(s.b,env)}catch(e){if(e===BRK)break;if(e!==CNT)throw e}}}
 else if(s.k==="while"){var m=s.t.match(/^while\s+(.+):$/);while(V(P(m[1]),env)){try{X(s.b,env)}catch(e){if(e===BRK)break;if(e!==CNT)throw e}}}
 else if(s.k==="def"){var m=s.t.match(/^def\s+(\w+)\s*\((.*)\)\s*:$/);if(!m)throw Error("SyntaxError: bad def");env[m[1]]={ps:m[2].split(",").map(function(x){return x.trim()}).filter(Boolean),b:s.b,env:env}}
 else if(s.k==="elif"||s.k==="else")throw Error("SyntaxError: "+s.k+" without if");
 else{var t=s.t,m;
  if(t==="break")throw BRK;if(t==="continue")throw CNT;if(t==="pass"){}
  else if(/^return\b/.test(t))throw{ret:1,v:/^return\s*$/.test(t)?null:V(P(t.slice(6)),env)};
  else if(m=t.match(/^(\w+)\s*(\+|-|\*\*|\*|\/\/|\/|%)=\s*(.+)$/)){if(!(m[1] in env))throw Error("NameError: name '"+m[1]+"' is not defined");env[m[1]]=bin(m[2],env[m[1]],V(P(m[3]),env))}
  else if(m=t.match(/^(\w+)\s*=(?!=)\s*(.+)$/)){env[m[1]]=V(P(m[2]),env)}
  else V(P(t),env)}
}catch(e){if(e&&!e.L&&e.message&&e!==BRK&&e!==CNT)e.L=s.L;throw e}}}
try{if(lines.length){var r=blk(0,lines[0].ind);if(r[1]<lines.length)throw Error("IndentationError: unindent does not match (line "+lines[r[1]].i+")");X(r[0],Object.create(null))}
 return{out:out.join("\n"),err:""}}
catch(e){if(e===BRK||e===CNT)return{out:out.join("\n"),err:"SyntaxError: break/continue outside loop"};
 return{out:out.join("\n"),err:(e.L?"Line "+e.L+": ":"")+(e.message||"Error")}}}

var L=[
{t:"Python Syntax",r:"🗝️ Key of Syntax",k:[["Indentation","Spaces at the start of a line that show which lines belong together."],["Comment","A note after # that Python ignores."],["Statement","One complete instruction, usually one line."]],p:"Python reads top to bottom, one instruction per line. Layout matters: indentation is part of the grammar.",th:"Maths has strict notation so everyone reads a formula the same way. Python syntax is the same idea for code.",ex:"Example: 2 + 3 on paper and print(2 + 3) in Python are both one clear step.",c:"# add two numbers\nprint(2 + 3)",o:"5",q:["Which symbol starts a comment?",["#","//","--"],0]},
{t:"Variables",r:"🧪 Potion of Variables",k:[["Variable","A named box that holds a value."],["Assignment","The = sign stores a value in the box."],["Identifier","The name you choose, such as x or total."]],p:"Give a value a name once, then reuse it instead of retyping the number.",th:"A variable is an unknown or a stored value, like x in algebra.",ex:"Let x = 4. Then y = x² + 1 = 17.",c:"x = 4\ny = x ** 2 + 1\nprint(y)",o:"17",q:["x = 4 and y = x ** 2 + 1. What is y?",["9","17","8"],1]},
{t:"Data Types",r:"💎 Gem of Types",k:[["int","Whole numbers such as 7."],["float","Decimal numbers such as 7.5."],["str","Text in quotes, such as \"seven\"."]],p:"Every value has a type, and the type decides what you can do with it.",th:"Number sets: integers ℤ are whole numbers, reals ℝ include decimals.",ex:"Example: 7 is in ℤ, 7.5 is only in ℝ.",c:"print(7)\nprint(7.5)\nprint(\"seven\")",o:"7\n7.5\nseven",q:["What type is 7.5?",["int","float","str"],1]},
{t:"Operators",r:"⚔️ Blade of Operators",k:[["Arithmetic","+ − * / // % ** do maths."],["Comparison","== < > ask a yes/no question."],["Logical","and, or, not combine yes/no answers."]],p:"Operators are the verbs of an expression. // gives the whole-number quotient and % gives the remainder.",th:"Division with remainder: 17 = 5 × 3 + 2.",ex:"So 17 // 5 = 3, 17 % 5 = 2, and 2 ** 10 = 1024.",c:"print(17 // 5)\nprint(17 % 5)\nprint(2 ** 10)",o:"3\n2\n1024",q:["What is 17 % 5?",["3","2","12"],1]},
{t:"Input / Output",r:"📜 Scroll of Output",k:[["print()","Shows a value on screen."],["input()","Asks the user to type something."],["Expression","A calculation that gives a value."]],p:"Programs talk to people: input() listens, print() answers. This demo uses fixed values instead of input().",th:"The mean of two numbers is (a + b) ÷ 2. The // operator keeps it a whole number.",ex:"Example: a = 6 and b = 10 give a mean of 8.",c:"a = 6\nb = 10\nprint((a + b) // 2)",o:"8",q:["Which function shows output?",["input()","print()","type()"],1]},
{t:"if / elif / else",r:"🛡️ Shield of Choices",k:[["Condition","A yes/no question, such as x >= 0."],["Branch","The path the program takes."],["Block","Indented lines that run together."]],p:"Code can choose. Python checks each condition in order and runs the first true one.",th:"A piecewise function: |x| = x if x ≥ 0, otherwise −x.",ex:"Example: |−7| = 7.",c:"x = -7\nif x >= 0:\n    print(x)\nelse:\n    print(-x)",o:"7",q:["For x = -7, does the block under if x >= 0 run?",["Yes","No"],1]},
{t:"for / while Loops",r:"🔥 Torch of Loops",k:[["Iteration","One trip around the loop."],["for","Repeat for each item in a sequence."],["while","Repeat as long as a condition is true."]],p:"Loops repeat work so you do not copy and paste. range(1, 6) gives 1, 2, 3, 4, 5.",th:"Summation Σ adds a pattern of terms.",ex:"Example: 1 + 2 + 3 + 4 + 5 = 15.",c:"total = 0\nfor n in range(1, 6):\n    total += n\nprint(total)",o:"15",q:["range(1, 6) gives…",["1 to 5","1 to 6","0 to 5"],0]},
{t:"Functions",r:"🔮 Orb of Functions",k:[["def","Starts a function definition."],["Parameter","The input the function receives."],["return","Sends the answer back."]],p:"A function is a reusable recipe: write it once, use it anywhere.",th:"A function maps inputs to outputs, like f(x) = x² + 1.",ex:"Example: f(3) = 3² + 1 = 10.",c:"def f(x):\n    return x ** 2 + 1\nprint(f(3))",o:"10",q:["If f(x) = x ** 2 + 1, what is f(3)?",["7","10","9"],1]},
{t:"Lambda Expressions",r:"👑 Lambda Crown",k:[["lambda","A tiny function written on one line."],["Anonymous","A function without a def name."],["Expression","One calculation that gives a value."]],p:"A lambda is a shortcut for simple one-line functions, handy for quick rules.",th:"Function notation f(x) = 2x + 3 written in one line.",ex:"Example: f(4) = 2·4 + 3 = 11.",c:"f = lambda x: 2 * x + 3\nprint(f(4))",o:"11",q:["lambda x: 2 * x + 3 at x = 4 gives…",["11","8","14"],0]}
];
var EZ=[
{s:"Syntax is the grammar of Python: the rules that let the computer understand your code.",a:"punctuation in a sentence. Miss a colon or mess up the spacing and the meaning breaks.",st:["<code>#</code> starts a comment. Python skips it; it is a note for humans.","<code>print(2 + 3)</code> asks Python to work out 2 + 3 and show it.","Python shows <b>5</b>."],w:"Spaces at the start of a line (indentation) matter in Python."},
{s:"A variable is a labelled box that stores a value so you can reuse it.",a:"a name tag on a jar. You can change what is inside, but the label stays.",st:["<code>x = 4</code> puts 4 into a box called x.","<code>y = x ** 2 + 1</code> takes x (4), squares it (16), adds 1 and stores 17 in y.","<code>print(y)</code> shows <b>17</b>."],w:"<code>=</code> means “store”, not “equals”. To compare, use <code>==</code>."},
{s:"A data type says what kind of thing a value is: a whole number, a decimal, or text.",a:"three jars: one for whole numbers, one for decimals, one for words. Each holds a different kind of thing.",st:["<code>print(7)</code> is a whole number (int).","<code>print(7.5)</code> has a decimal point, so it is a float.","<code>print(\"seven\")</code> is inside quotes, so it is text (str)."],w:"<code>\"7\"</code> (text) and <code>7</code> (number) are not the same thing."},
{s:"Operators are symbols that calculate or compare values.",a:"the buttons on a calculator: + − × ÷, plus a button for “what is left over”.",st:["<code>17 // 5</code>: how many whole 5s fit in 17? <b>3</b>.","<code>17 % 5</code>: what is left over? <b>2</b>.","<code>2 ** 10</code>: 2 multiplied by itself 10 times = <b>1024</b>."],w:"<code>//</code> throws away the decimals, but <code>/</code> keeps them."},
{s:"print() shows results to the user. input() lets the user type something in.",a:"a conversation: input is listening, print is talking.",st:["<code>a = 6</code> and <code>b = 10</code> store two numbers.","<code>(a + b) // 2</code> adds them (16), then halves the total (8).","<code>print(...)</code> shows <b>8</b>."],w:"Brackets matter: <code>a + b // 2</code> gives 11, not 8."},
{s:"if lets your program choose what to do, based on a yes/no question.",a:"a fork in the road: check the sign of the number, then take one path.",st:["<code>x = -7</code> stores −7.","<code>if x >= 0:</code> asks “is x at least 0?”. For −7 the answer is no, so that block is skipped.","<code>else:</code> runs instead, so <code>print(-x)</code> shows <b>7</b>."],w:"Do not forget the colon <code>:</code> and indent the lines under if/else."},
{s:"A loop repeats the same steps so you do not have to write them again and again.",a:"running laps: the same route every time, and you count as you go.",st:["<code>total = 0</code> starts a running sum.","<code>for n in range(1, 6):</code> sets n to 1, 2, 3, 4, 5, one at a time.","<code>total += n</code> adds each n: the total goes 1, 3, 6, 10, 15.","<code>print(total)</code> shows <b>15</b>."],w:"<code>range(1, 6)</code> stops <i>before</i> 6."},
{s:"A function is a named recipe: give it an input and it hands back a result.",a:"a vending machine: put in a coin (input) and a snack comes out (output).",st:["<code>def f(x):</code> creates a recipe called f that takes one input, x.","<code>return x ** 2 + 1</code> is the answer it hands back.","<code>f(3)</code> runs the recipe with x = 3: 9 + 1 = <b>10</b>."],w:"Defining a function does nothing until you <i>call</i> it, like <code>f(3)</code>."},
{s:"A lambda is a tiny function with no name, written on a single line.",a:"a sticky note with a quick formula. It is perfect for a one-off calculation.",st:["<code>lambda x: 2 * x + 3</code> means “given x, give back 2x + 3”.","<code>f = ...</code> stores that mini function in a variable named f.","<code>f(4)</code> works out 2 · 4 + 3 = <b>11</b>."],alt:["The same thing written with def (longer, same result)","def f(x):\n    return 2 * x + 3\nprint(f(4))"],w:"Use lambda for short one-liners. If you need more than one line, use <code>def</code>."}
];
function ez(i){var e=EZ[i],d=L[i];
 $("ez").innerHTML='<div class="ezs"><b>IN ONE SENTENCE</b>'+e.s+'</div><p class="an">🧠 Think of it like <b>'+e.a+'</b></p><div class="lh">Example code</div><pre class="cb">'+esc(d.c)+'</pre><div class="lh">Step by step</div><ol class="stp">'+e.st.map(function(x){return"<li>"+x+"</li>"}).join("")+'</ol><div class="outl">Output: <b>'+esc(d.o).replace(/<br>/g," ")+'</b></div>'+(e.alt?'<div class="lh">'+e.alt[0]+'</div><pre class="cb">'+esc(e.alt[1])+'</pre>':"");
 $("ez2").innerHTML='<div class="wo"><b>⚠ WATCH OUT</b> '+e.w+'</div>'}

var S={xp:0,done:{},qd:{},boss:0},cur=0;
try{localStorage.removeItem("bc_save")}catch(e){}
function save(){}
function esc(t){return String(t).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/\n/g,"<br>")}
function term(el,o,err){el.innerHTML=(err?'<b style="color:#ff8fa3">✗</b> ':"<b>▸</b> ")+esc(o)}
function nDone(){return Object.keys(S.done).length}
function unlocked(i){return i==0||S.done[i-1]||S.done[i]}
/* map */
var MAPS={A:{n:"Flooded Catacombs",img:"mapA",pos:[[6,33],[18,33],[28,24],[41,38],[49,52],[60,62],[72,62],[74,46],[82,22]],door:[89,31]},
B:{n:"Crimson Crypt",img:"mapB",pos:[[7,12],[16,30],[27,40],[28,61],[27,78],[47,52],[57,37],[65,63],[88,52]],door:[91,19]}};
function doorSvg(o){return '<img class="dimg" src="'+IMG.door+'" alt="">'+(o?"":'<i class="dcl"><b></b></i>')}
function map(){var M=MAPS[S.map||"A"],pts=M.pos.concat([M.door]),all=nDone()>=L.length,im=$("mapimg");
 if(im.dataset.k!=M.img){im.dataset.k=M.img;im.src=IMG[M.img]}
 document.querySelectorAll("#mtabs button").forEach(function(b){b.classList.toggle("on",b.dataset.m==(S.map||"A"))});
 $("route").innerHTML='<polyline points="'+pts.map(function(p){return p[0]+","+p[1]}).join(" ")+'"/>';
 $("mks").innerHTML=M.pos.map(function(p,i){return '<button class="mk'+(S.done[i]?" dn":i==cur?" on":"")+(unlocked(i)?"":" lk")+'" data-i="'+i+'" style="left:'+p[0]+"%;top:"+p[1]+'%" aria-label="Checkpoint '+(i+1)+": "+L[i].t+'">'+(S.done[i]?"✓":unlocked(i)?i+1:"🔒")+"</button>"}).join("")+
 '<button class="door '+(all?"op":"lk")+'" data-b="1" style="left:'+M.door[0]+"%;top:"+M.door[1]+'%" aria-label="Boss room door, '+(all?"open":"locked")+'">'+doorSvg(all)+"<span>"+(all?"OPEN ▶":"BOSS DOOR")+"</span></button>"}
$("mtabs").onclick=function(e){var b=e.target.closest("button");if(!b)return;S.map=b.dataset.m;save();map()};

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
    S.done grows. Switching maps or resizing just re-places it, without walking. */
 function load(){var el=document.querySelector("#route polyline");if(!el)return false;var k=el.getAttribute("points");if(k===key)return pts.length>1;key=k;
  pts=k.split(" ").map(function(p){var a=p.split(",");return[+a[0],+a[1]]});snap=true;return pts.length>1}
 function measure(){var W=mapEl.clientWidth,H=mapEl.clientHeight,old=tot;seg=[];cum=[0];tot=0;for(var i=1;i<pts.length;i++){var l=Math.hypot((pts[i][0]-pts[i-1][0])*W/100,(pts[i][1]-pts[i-1][1])*H/100);seg.push(l);tot+=l;cum.push(tot)}
  if(old>0&&!snap)u=u/old*tot}
 function at(d){for(var i=0;i<seg.length;i++){if(d<=seg[i]||i==seg.length-1){var t=seg[i]?Math.min(1,d/seg[i]):0;return[pts[i][0]+(pts[i+1][0]-pts[i][0])*t,pts[i][1]+(pts[i+1][1]-pts[i][1])*t]}d-=seg[i]}}

 function face(d){for(var i=0;i<seg.length;i++){if(d<=cum[i+1]||i==seg.length-1)return pts[i+1][0]<pts[i][0]}return false}
 function say(h){bub.innerHTML=h;bub.hidden=false;place();clearTimeout(hideT);hideT=setTimeout(function(){bub.hidden=true},4200)}
 function place(){if(bub.hidden)return;bub.style.left=pyEl.style.left;bub.style.top="calc("+pyEl.style.top+" - "+(pyEl.offsetHeight*.9+14)+"px)"}

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
  term($("out"),r.out);side();dash()}
 else{res.style.color="#dc2626";res.textContent=r.err?r.err:"Not yet. Expected output: "+d.o.replace(/\n/g," ")}}});
$("res").onclick=function(e){if(e.target.closest(".nx")){if(cur<L.length-1)lesson(cur+1);else location.hash="#boss"}};
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
/* boss */
var TESTS1=[[8128,"True"],[1000,"False"],[4096,"False"],[9999,"False"]];
/* Phase 2 (Storm Wyrm): same code, more rounds, tougher numbers (primes and abundant numbers) */
var TESTS2=[[7919,"False"],[5040,"False"],[8128,"True"],[9973,"False"],[6000,"False"]];
var phase=1,TESTS=TESTS1,HPMAX=TESTS1.length,won=false;
var START="n = 8128   # the boss changes this number each round\ntotal = 0\nfor i in range(1, n):\n    # add i to total when i divides n evenly\n    pass\nprint(total == n)   # True if n is perfect";
var SOL="n = 8128\ntotal = 0\nfor i in range(1, n):\n    if n % i == 0:\n        total += i\nprint(total == n)";
$("bed").value=START;var hp=HPMAX,hearts=3,busy=false,hs=0;
function hud(){$("bhp").style.width=hp/HPMAX*100+"%";$("bname").textContent=phase==1?"🐉 Wyrm · Phase 1":"⚡ Storm Wyrm · Phase 2";$("bhr").textContent="♥♥♥".slice(0,hearts)+"♡♡♡".slice(0,3-hearts)}
function log(t,c){$("blog").innerHTML+='<div class="'+(c||"")+'">'+esc(t)+"</div>"}
$("bhint").onclick=function(){var h=$("bh");h.hidden=false;hs++;h.innerHTML=hs==1?"<b>Hint 1:</b> Loop <code>i</code> from 1 up to <code>n - 1</code>. A divisor satisfies <code>n % i == 0</code>.":hs==2?"<b>Hint 2:</b> Inside the loop: <code>if n % i == 0:</code> then <code>total += i</code>. Mind the indentation.":"<b>Solution:</b><br><code style='white-space:pre;display:block;padding:8px'>"+esc(SOL).replace(/<br>/g,"\n")+"</code>"};
$("batk").onclick=function(){if(busy)return;var code=$("bed").value;
 if(!/^n\s*=/m.test(code)){$("blog").innerHTML="";log("Keep the line  n = ...  at the top so the boss can change it.","x");return}
 if(won){won=false;phase=1;TESTS=TESTS1;HPMAX=TESTS1.length}
 busy=true;hp=HPMAX;hearts=3;hud();$("blog").innerHTML="";if(phase==2)log("⚡ Phase 2: miss a round and the Storm Wyrm hurls lightning!","x");if(F.setPhase)F.setPhase(phase);var i=0;
 (function rd(){if(i>=TESTS.length){busy=false;
   if(hp==0){if(phase==1){log("🐉 The Wyrm falls! ...but the sky cracks open.","g");busy=true;F.phase2();
    setTimeout(function(){phase=2;TESTS=TESTS2;HPMAX=TESTS2.length;hp=HPMAX;hearts=3;hud();log("⚡ PHASE 2: the Storm Wyrm awakens! Press Attack to fight it.","g");busy=false},2400)}
   else{log("⚡ The Storm Wyrm falls! "+(S.boss?"":"+200 XP · Reward: 🐉 Wyrm Slayer"),"g");if(!S.boss){S.boss=1;S.xp+=200;save();side();dash()}won=true;F.win()}}
   else log("The "+(phase==1?"Wyrm":"Storm Wyrm")+" survives with "+hp+"/"+HPMAX+" HP. Fix your code and attack again.","x");return}
  var t=TESTS[i],r=py(code.replace(/^n\s*=.*$/m,"n = "+t[0])),ok=!r.err&&r.out.trim()==t[1];
  log("Round "+(i+1)+": n = "+t[0]+" → "+(r.err||r.out||"(no output)")+" · expected "+t[1]+(ok?"  ✓ HIT":"  ✗ MISS"),ok?"g":"x");
  if(ok)hp--;else hearts--;F.atk(ok);hud();i++;
  if(hearts<=0){busy=false;setTimeout(function(){log("💀 You fell. Debug your code and try again.","x");F.lose()},1000);return}
  setTimeout(rd,1500)})()};
var F={atk:function(){},win:function(){},lose:function(){},reset:null,cls:function(){},phase2:function(){},setPhase:function(){}},arenaOn=false;
function clsUi(){document.querySelectorAll("#cls button").forEach(function(x){x.classList.toggle("on",x.dataset.c==(S.cls||"knight"))})}
$("cls").onclick=function(e){var b=e.target.closest("button");if(!b)return;S.cls=b.dataset.c;save();clsUi();F.cls(S.cls)};
function load3(cb){if(window.THREE)return cb();var s=document.createElement("script");s.src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";s.onload=cb;s.onerror=function(){$("bfb").hidden=false;$("bcv").hidden=true};document.head.appendChild(s)}
function arena(){if(arenaOn)return;arenaOn=true;load3(function(){
 var W=384,H=216,R;try{R=new THREE.WebGLRenderer({canvas:$("bcv"),antialias:false})}catch(e){$("bfb").hidden=false;$("bcv").hidden=true;return}
 R.setPixelRatio(1);R.setSize(W,H,false);R.setClearColor(0x05050f);R.autoClear=false;
 var sc=new THREE.Scene(),cam=new THREE.PerspectiveCamera(36,W/H,.1,100);cam.position.set(0,2.4,14);cam.lookAt(0,2.4,0);
 var TL=new THREE.TextureLoader(),T={},keys=["ruins","knight","mage","ranger","rogue","dragon","dragon2"],left=keys.length;
 keys.forEach(function(k){TL.load(IMG[k],function(t){t.magFilter=t.minFilter=THREE.NearestFilter;t.generateMipmaps=false;T[k]=t;if(--left==0)go()})});
 function ct(fn,w,h){var c=document.createElement("canvas");c.width=w;c.height=h;fn(c.getContext("2d"),w,h);var t=new THREE.CanvasTexture(c);t.magFilter=t.minFilter=THREE.NearestFilter;return t}
 function plane(map,w,h,o){var m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial(Object.assign({map:map,transparent:true,alphaTest:.04,side:THREE.DoubleSide},o||{})));sc.add(m);return m}
 function sp(k,h){var im=T[k].image;return plane(T[k],h*im.width/im.height,h)}
 function rad(c1){return ct(function(g,w,h){var r=g.createRadialGradient(w/2,h/2,0,w/2,h/2,w/2);r.addColorStop(0,"#fff");r.addColorStop(.3,c1);r.addColorStop(1,"rgba(0,0,0,0)");g.fillStyle=r;g.fillRect(0,0,w,h)},32,32)}
 function go(){
  var bg=plane(T.ruins,23,13);bg.position.set(0,2.4,-6);bg.material.color.setRGB(1.05,1.05,1.05);
  var gl=rad("#ffc857"),g1=plane(gl,12,12,{blending:THREE.AdditiveBlending,depthWrite:false,opacity:.3}),g2=plane(gl,8,8,{blending:THREE.AdditiveBlending,depthWrite:false,opacity:.2});
  g1.position.set(4.5,1.2,-5.9);g2.position.set(1,-1,-5.9);
  var shT=ct(function(g,w,h){g.fillStyle="rgba(0,0,0,.55)";g.beginPath();g.ellipse(w/2,h/2,w/2-1,h/2-1,0,0,6.3);g.fill()},32,8);
  var hsh=plane(shT,3,.7),dsh=plane(shT,6,1.1);
  var HX=-4.2,DX=3.8,DY=2.1,FL=-1.2,HH={knight:3.6,mage:3.2,ranger:3.6,rogue:3.4},hs={};
  ["knight","mage","ranger","rogue"].forEach(function(k){hs[k]=sp(k,HH[k]);hs[k].visible=false});
  var dragon=sp("dragon",5.6);dragon.scale.x=-1;
  var dragon2=sp("dragon2",6.3);dragon2.visible=false;
  var D=dragon,ph=1,pend=0,pat=0,intro=0,flash=0,nextAmb=0,fail=0,MP={x:0,y:0},HP={x:0,y:0},BL=[],nextPaint=0,lastAny=false;
  /* lightning overlay: a screen-sized canvas drawn in pixel steps, plus a white flash quad */
  var ov=new THREE.Scene(),oc=new THREE.OrthographicCamera(-1,1,1,-1,0,10),bc=document.createElement("canvas");bc.width=W;bc.height=H;
  var bgx=bc.getContext("2d"),btex=new THREE.CanvasTexture(bc);btex.magFilter=btex.minFilter=THREE.NearestFilter;btex.generateMipmaps=false;
  var bq=new THREE.Mesh(new THREE.PlaneGeometry(2,2),new THREE.MeshBasicMaterial({map:btex,transparent:true,depthTest:false,depthWrite:false,blending:THREE.AdditiveBlending}));bq.position.z=-1;ov.add(bq);
  var fq=new THREE.Mesh(new THREE.PlaneGeometry(2,2),new THREE.MeshBasicMaterial({color:0xcfe8ff,transparent:true,opacity:0,depthTest:false,depthWrite:false,blending:THREE.AdditiveBlending}));fq.position.z=-2;ov.add(fq);
  var sv=new THREE.Vector3();
  function scr(x,y){sv.set(x,y,.8).project(cam);return[(sv.x*.5+.5)*W,(1-(sv.y*.5+.5))*H]}
  function seg(g,p,q,sz,c){g.fillStyle=c;var n=Math.max(1,Math.ceil(Math.max(Math.abs(q[0]-p[0]),Math.abs(q[1]-p[1]))));for(var i=0;i<=n;i++)g.fillRect(Math.round(p[0]+(q[0]-p[0])*i/n-sz/2),Math.round(p[1]+(q[1]-p[1])*i/n-sz/2),sz,sz)}
  function bolt(g,a,b,w,j,fk){var dx=b[0]-a[0],dy=b[1]-a[1],L=Math.hypot(dx,dy)||1,n=Math.max(4,Math.round(L/14)),nx=-dy/L,ny=dx/L,p=[a],i;
   for(i=1;i<n;i++){var t=i/n,o=(Math.random()-.5)*2*j;p.push([a[0]+dx*t+nx*o,a[1]+dy*t+ny*o])}p.push(b);
   var Ls=[[w+4,"#0369a1"],[w+1,"#38bdf8"],[Math.max(1,w-1),"#ffffff"]];
   Ls.forEach(function(l){for(var k=1;k<p.length;k++)seg(g,p[k-1],p[k],l[0],l[1])});
   if(fk)for(i=0;i<2;i++){var s0=p[1+Math.floor(Math.random()*(p.length-2))],an=Math.atan2(dy,dx)+(Math.random()<.5?-1:1)*(.5+Math.random()*.6),ln=18+Math.random()*22,e=[s0[0]+Math.cos(an)*ln,s0[1]+Math.sin(an)*ln],m=[(s0[0]+e[0])/2+(Math.random()-.5)*8,(s0[1]+e[1])/2+(Math.random()-.5)*8];
    Ls.forEach(function(l){var z=Math.max(1,l[0]-3);seg(g,s0,m,z,l[1]);seg(g,m,e,z,l[1])})}}
  function paint(now){if(now<nextPaint)return;nextPaint=now+55;bgx.clearRect(0,0,W,H);var any=false;
   for(var i=BL.length-1;i>=0;i--){var b=BL[i];if(now>b.end){BL.splice(i,1);continue}any=true;if(now<b.t0)continue;
    if(!b.on){b.on=1;if(b.fl)flash=Math.max(flash,b.fl)}bolt(bgx,b.a(),b.b(),b.w,b.j,b.fk)}
   if(any||lastAny)btex.needsUpdate=true;lastAny=any}
  function sky(now,x,delay,fl){var x0=x==null?40+Math.random()*300:x,a=[x0,0],b=[x0+(Math.random()-.5)*90,150+Math.random()*40],d=delay||0;
   BL.push({t0:now+d,end:now+d+230,a:function(){return a},b:function(){return b},w:3,j:16,fk:1,fl:fl==null?.5:fl})}
  var chg=plane(rad("#a5f3fc"),1.8,1.8,{blending:THREE.AdditiveBlending,depthWrite:false});chg.visible=false;
  var orb=plane(rad("#7dd3fc"),1.4,1.4,{blending:THREE.AdditiveBlending,depthWrite:false}),fire=plane(rad("#ff6a1a"),2,2,{blending:THREE.AdditiveBlending,depthWrite:false});
  var arrow=plane(ct(function(g){g.fillStyle="#e6d3a3";g.fillRect(0,3,22,2);g.fillStyle="#cbd5e1";g.fillRect(22,1,2,6);g.fillRect(24,2,2,4);g.fillRect(26,3,2,2);g.fillStyle="#7a4dff";g.fillRect(0,1,3,6)},28,8),1.8,.5);
  var dag=plane(ct(function(g){g.fillStyle="#cfe9ff";g.fillRect(1,6,10,3);g.fillStyle="#8fb4d8";g.fillRect(1,8,10,1);g.fillStyle="#6b4a2a";g.fillRect(11,5,3,5);g.fillStyle="#ffd23f";g.fillRect(10,4,1,7)},16,16),1.3,1.3);var slash=plane(ct(function(g){g.strokeStyle="#bff6ff";g.lineWidth=7;g.lineCap="square";g.beginPath();g.arc(8,32,26,-1.2,1.2);g.stroke();g.strokeStyle="#fff";g.lineWidth=3;g.beginPath();g.arc(8,32,26,-1.2,1.2);g.stroke()},64,64),3.2,3.2);
  var hero=hs.knight,hy=FL+HH.knight/2,curC="knight";
  function setCls(c){if(!hs[c])c="knight";hero.visible=false;hero=hs[c];hero.visible=true;hy=FL+HH[c]/2;curC=c;hero.material.opacity=1;hero.rotation.z=0}
  setCls(S.cls||"knight");F.cls=setCls;
  var sparks=[];function burst(x,y,col,n){for(var i=0;i<n;i++){var m=new THREE.Mesh(new THREE.PlaneGeometry(.2,.2),new THREE.MeshBasicMaterial({color:col,transparent:true}));m.position.set(x,y,1.5);m.userData={vx:(Math.random()-.3)*6,vy:Math.random()*5+1,t:performance.now()};sc.add(m);sparks.push(m)}}
  var TI={knight:.35,mage:.65,ranger:.55,rogue:.5},act=null,dead=0,down=0,wt=0,lt=0,last=performance.now();
  F.atk=function(h){act={t:performance.now(),hit:h,c:curC}};F.win=function(){dead=1;wt=performance.now();burst(DX,DY,0xffd23f,26)};F.lose=function(){down=1;lt=performance.now()};
  F.phase2=function(){if(dead)return;dead=1;wt=performance.now();burst(DX,DY,0xffd23f,26);pend=1;pat=wt+1100};
  F.reset=function(){dead=0;down=0;act=null;pend=0;intro=0;flash=0;BL.length=0;nextAmb=0;dragon.visible=ph==1;dragon2.visible=ph==2;D=ph==1?dragon:dragon2;D.rotation.z=0;D.material.opacity=1;hero.rotation.z=0;hero.material.opacity=1};
  F.setPhase=function(p){ph=p;F.reset()};
  function loop(now){requestAnimationFrame(loop);if(!$("boss").classList.contains("show")){last=now;return}
   var dt=Math.min(.05,(now-last)/1000),s=now/1000;last=now;
   var hx=HX,dx=DX,dy=DY+Math.sin(s*1.6)*.25,hf=0,df=0,shake=0;var pop=1;hero.position.y=hy+Math.abs(Math.sin(s*2.4))*.05;
   orb.visible=arrow.visible=slash.visible=fire.visible=dag.visible=chg.visible=false;
   if(pend&&now>=pat){pend=0;ph=2;dragon.visible=false;dragon.rotation.z=0;D=dragon2;D.visible=true;D.rotation.z=0;D.material.opacity=0;dead=0;intro=now;sky(now,80,0,.8);sky(now,200,160,.6);sky(now,310,320,.8);burst(DX,DY,0x7dd3fc,24)}
   if(intro){var qi=(now-intro)/1000;if(qi>=1.3){intro=0;D.material.opacity=1}else{var ie=Math.min(1,qi/.7);D.material.opacity=ie;pop=.82+.18*ie;if(qi<.7)shake=.3}}
   if(ph==2&&!intro&&!dead&&!pend){if(!nextAmb)nextAmb=now+2500;if(now>nextAmb){nextAmb=now+3500+Math.random()*3500;sky(now,null,0,.28)}}
   D.scale.x=(D===dragon?-1:1)*pop;D.scale.y=pop*(1+Math.sin(s*3.2)*.025);
   if(act){var k=(now-act.t)/1000,c=act.c,ti=TI[c],hit=act.hit,tx=DX-(ph==2?1.5:1.9),ty=DY-(ph==2?.6:.3),p;
    if(c=="knight"){var d=k<.3?k/.3:k<.55?1:k<1?1-(k-.55)/.45:0;hx=HX+5.2*d}else if(k<.25)hx=HX-.35*Math.sin(k/.25*Math.PI);
    if(c=="mage"&&k>.2&&k<ti){p=(k-.2)/(ti-.2);if(hit||p<.6){orb.visible=true;orb.position.set(HX+1.4+(tx-HX-1.4)*p,hy+.6+(ty-hy-.6)*p,1);orb.scale.setScalar(1+Math.sin(k*40)*.15)}}
    if(c=="ranger"&&k>.15&&k<ti){p=(k-.15)/(ti-.15);if(hit||p<.6){arrow.visible=true;arrow.position.set(HX+1.4+(tx-HX-1.4)*p,hy+.9+(ty-hy-.9)*p+Math.sin(p*Math.PI)*.9,1);arrow.rotation.z=.35-p*.7}}
    if(c=="rogue"&&k>.15&&k<ti){p=(k-.15)/(ti-.15);if(hit||p<.6){dag.visible=true;dag.position.set(HX+1.2+(tx-HX-1.2)*p,hy+.9+(ty-hy-.9)*p+Math.sin(p*Math.PI)*.5,1);dag.rotation.z=-k*38}}
    if(c=="knight"&&k>ti-.1&&k<ti+.18){slash.visible=true;slash.position.set(tx+.8,DY-.2,1.2);slash.rotation.z=(k-ti)*7}
    if(hit&&k>=ti){var q=k-ti;if(!act.f1){act.f1=1;burst(tx+1,DY,0xffffff,14);burst(tx+1,DY,0x7dd3fc,10)}if(q<.25){df=1;dx=DX+.6*Math.sin(q/.25*Math.PI);shake=.25}}
    if(!hit&&k>=ti&&ph==2){var q6=k-ti;dx=DX-.9*Math.sin(Math.min(1,q6/.55)*Math.PI);
     if(q6<.4){chg.visible=true;chg.position.set(dx-1.5,dy-1.8,1.2);chg.scale.setScalar(.4+q6*3+Math.sin(q6*70)*.12);
      var cn=(q6/.09)|0;if(act.cn!==cn){act.cn=cn;var an2=Math.random()*6.283,ln2=20+Math.random()*26;BL.push({t0:now,end:now+95,a:function(){return scr(MP.x,MP.y)},b:(function(a,l){return function(){var m=scr(MP.x,MP.y);return[m[0]+Math.cos(a)*l,m[1]+Math.sin(a)*l]}})(an2,ln2),w:2,j:4})}}
     if(q6>=.4&&q6<.85){if(!act.f3){act.f3=1;BL.push({t0:now,end:now+420,a:function(){return scr(MP.x,MP.y)},b:function(){return scr(HP.x,HP.y)},w:3,j:11,fk:1,fl:.6})}
      hf=2;hx+=(Math.random()-.5)*.22;shake=.4;if(!act.f2){act.f2=1;burst(HX+.5,hy,0x7dd3fc,14);burst(HX+.5,hy,0xffffff,8)}}}
    else if(!hit&&k>=ti){var q2=k-ti;dx=DX-4.2*Math.sin(Math.min(1,q2/.6)*Math.PI);
     if(q2>.12&&q2<.5){var f=(q2-.12)/.38;fire.visible=true;fire.position.set(dx-1.8+(HX+1.2-dx+1.8)*f,DY-.8+(hy-DY+.8)*f,1.2);fire.scale.setScalar(1+Math.sin(q2*50)*.2)}
     if(q2>.45&&q2<.85){hf=1;hx-=.5*Math.sin((q2-.45)/.4*Math.PI);shake=.35;if(!act.f2){act.f2=1;burst(HX+.5,hy,0xff6a1a,16)}}}
    if(k>1.5)act=null}
   if(dead){var q3=Math.min(1,(now-wt)/1000);D.rotation.z=-q3*1.2;dy=DY-q3*2.2;D.material.opacity=1-q3*.85}
   if(down){var q4=Math.min(1,(now-lt)/500);hero.rotation.z=-q4*1.4;hero.material.opacity=1-q4*.5}
   if(hf==2)hero.material.color.setRGB(1.8,2.6,3.2);else hero.material.color.setRGB(hf?3:1,hf?.35:1,hf?.35:1);D.material.color.setRGB(df?3:1,df?3:1,df?3:1);
   hero.position.x=hx;D.position.set(dx,dy,0);hsh.position.set(hx,FL-.1,.1);dsh.position.set(dx,FL-.15,.1);dsh.scale.x=1-(dy-DY)*.1;
   for(var i=sparks.length-1;i>=0;i--){var m=sparks[i],u=m.userData,age=(now-u.t)/1000;u.vy-=14*dt;m.position.x+=u.vx*dt;m.position.y+=u.vy*dt;m.material.opacity=Math.max(0,1-age/.7);if(age>.7){sc.remove(m);m.geometry.dispose();m.material.dispose();sparks.splice(i,1)}}
   g1.material.opacity=.3+Math.sin(s*2)*.06+Math.random()*.02;g2.material.opacity=.2+Math.sin(s*3+2)*.05+Math.random()*.02;
   MP.x=dx-1.5;MP.y=dy-1.8;HP.x=hx;HP.y=hy+.5;flash=Math.max(0,flash-dt*2.6);fq.material.opacity=Math.min(1,flash);paint(now);
   cam.position.x=Math.sin(now*.07)*shake;try{R.clear();R.render(sc,cam);R.render(ov,oc)}catch(e){if(!fail){fail=1;$("bfb").hidden=false;$("bcv").hidden=true}}}
  requestAnimationFrame(loop)}
})}
$("dxb").onclick=function(){var n=parseInt($("dxn").value,10),o=$("dxo");if(!(n>1&&n<=100000)){o.textContent="Enter a whole number from 2 to 100000.";return}
 var d=[],t=0;for(var i=1;i<n;i++)if(n%i==0){d.push(i);t+=i}
 o.innerHTML=d.map(function(x){return"<i>"+x+"</i>"}).join('<em>+</em>')+'<div class="dxs">Sum = <b>'+t+'</b> '+(t==n?'= '+n+' → <b class="g">perfect ✓</b>':'≠ '+n+' → <b class="x">not perfect ✗</b>')+"</div>"};
$("dxb").onclick();
/* router */
var PG=["home","about","course","boss","contact","dashboard","community"];
function route(){var h=(location.hash||"#home").slice(1),all=h=="all";if(h=="problem-solving")h="boss";if(!all&&PG.indexOf(h)<0)h="home";
 document.querySelectorAll(".pg").forEach(function(p){p.classList.toggle("show",all||p.id==h)});
 if(all||h=="boss")arena();if(all||h=="dashboard")dash();window.scrollTo(0,0)}
if(location.hash&&location.hash!="#all")history.replaceState(null,"",location.pathname+location.search);addEventListener("hashchange",route);clsUi();hud();lesson(Math.min(nDone(),L.length-1));dash();route();
})();
