/* Tiny Python interpreter used by lessons, sandbox and boss fight: py(source, stepLimit, inputs). */
function py(src,limit,inputs){
var steps=0,out=[],limit=limit||3e6,BRK={},CNT={},inp=(inputs||[]).slice();
function str(v){return v===true?"True":v===false?"False":v===null?"None":Array.isArray(v)?"["+v.map(rp).join(", ")+"]":String(v)}
function rp(v){return typeof v=="string"?"'"+v+"'":str(v)}
var B={print:function(){out.push([].slice.call(arguments).map(str).join(" "))},
input:function(){if(!inp.length)throw Error("EOFError: input() ran out of values. Check how many times your code calls input().");return String(inp.shift())},
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
