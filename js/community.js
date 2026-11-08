(function(){
function $(i){return document.getElementById(i)}
function esc(t){return String(t).replace(/[&<>"']/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})}
var C=[{k:"bytecrawler",n:"r/ByteCrawler",c:"#3b46e0",m:"12.4k",d:"The official hangout: boss-room wins, feedback and tips."},
{k:"learnpython",n:"r/LearnPython",c:"#2f8f5b",m:"8.1k",d:"Beginner-friendly Python questions, no silly questions allowed."},
{k:"mathhelp",n:"r/MathHelp",c:"#c0504d",m:"5.7k",d:"Maths twins for every coding idea. Ask, explain, repeat."},
{k:"pixelart",n:"r/PixelArt",c:"#7b5bd6",m:"3.2k",d:"Sprites, potions, swords and dungeon tiles."},
{k:"bossroom",n:"r/BossRoom",c:"#d6892a",m:"2.6k",d:"Strategies and stories from the problem-solving boss fights."}];
function ago(t){var m=Math.floor((Date.now()-t)/60000);if(m<1)return"just now";if(m<60)return m+" min ago";if(m<1440)return Math.floor(m/60)+" h ago";return Math.floor(m/1440)+" d ago"}
var H=60000,N=Date.now();
var P=[
{id:1,k:"bytecrawler",u:"mage_mia",at:N-35*H,t:"Cleared the boss room on my first try. Here is what worked",b:"I wrote the loop first, tested it on the smallest case, and only then added the second condition. Boss went down in three hits.",v:128,my:0,cm:[{u:"knight_ken",at:N-20*H,t:"Testing the smallest case first is such a good habit."},{u:"rogue_ro",at:N-12*H,t:"Did you use a for loop or while?"}]},
{id:2,k:"learnpython",u:"ranger_rin",at:N-3*60*H,t:"Why do print(7) and print(\"7\") look the same but behave differently?",b:"They print the same thing on screen, but one is a number and one is text. Try adding 1 to each and see what happens.",v:96,my:0,cm:[{u:"coder_cat",at:N-2*60*H,t:"7 + 1 gives 8, but \"7\" + 1 is a TypeError. Types matter!"}]},
{id:3,k:"mathhelp",u:"calc_cleo",at:N-5*60*H,t:"Perfect numbers: a quick way to check them",b:"Add every divisor smaller than the number. If the sum equals the number, it is perfect. 6 = 1 + 2 + 3 and 28 = 1 + 2 + 4 + 7 + 14.",v:74,my:0,cm:[]},
{id:4,k:"pixelart",u:"pixel_pip",at:N-9*60*H,t:"Made a 16x16 potion for the hero banner",b:"Three shades of glass, one highlight pixel, and a tiny cork. Colour palette is soft so it is easy on the eyes.",v:211,my:0,cm:[{u:"mage_mia",at:N-8*60*H,t:"Love the highlight pixel!"},{u:"knight_ken",at:N-7*60*H,t:"Can you share the palette?"}]},
{id:5,k:"bossroom",u:"knight_ken",at:N-26*60*H,t:"Dragon phase two tips?",b:"I keep losing hearts when the fire breath starts. Any pattern you noticed for dodging?",v:45,my:0,cm:[{u:"ranger_rin",at:N-24*60*H,t:"Wait for the glow, then answer. Rushing costs hearts."}]},
{id:6,k:"bytecrawler",u:"coder_cat",at:N-2*1440*H/24*24,t:"Feature request: save my place in a lesson",b:"It would be nice to resume exactly where I stopped after closing the tab.",v:63,my:0,cm:[]},
{id:7,k:"learnpython",u:"calc_cleo",at:N-3*1440*H,t:"Loops or recursion for beginners?",b:"I understand loops but recursion feels like magic. What helped you?",v:52,my:0,cm:[{u:"mage_mia",at:N-2*1440*H,t:"Draw the calls on paper first. It clicks fast."}]},
{id:8,k:"mathhelp",u:"rogue_ro",at:N-4*1440*H,t:"Lambda functions explained with a maths analogy",b:"A lambda is just f(x) = x + 1 written inline. Same idea, shorter notation.",v:88,my:0,cm:[]}];
var nid=100,st={cur:"all",sort:"best",q:"",open:{},saved:{},joined:{bytecrawler:1}};
function com(k){for(var i=0;i<C.length;i++)if(C[i].k==k)return C[i]}
function sc(p){return p.v+p.my}
function toast(t){var e=$("rdToast");if(!e){e=document.createElement("div");e.id="rdToast";e.className="rd-toast";e.setAttribute("role","status");document.body.appendChild(e)}e.textContent=t;e.classList.add("on");clearTimeout(e._t);e._t=setTimeout(function(){e.classList.remove("on")},1600)}
function avatar(c){return'<span class="rd-av" style="--c:'+c.c+'">'+esc(c.n.charAt(2).toUpperCase())+'</span>'}
function list(){var q=st.q.toLowerCase(),a=P.filter(function(p){return(st.cur=="all"||p.k==st.cur)&&(!q||(p.t+" "+p.b+" "+com(p.k).n).toLowerCase().indexOf(q)>=0)});
 a.sort(function(x,y){return st.sort=="new"?y.at-x.at:st.sort=="top"?sc(y)-sc(x):(sc(y)+y.cm.length*3)-(sc(x)+x.cm.length*3)});return a}
function side(){var h='<div class="rd-hd">Feeds</div><button class="rd-nav'+(st.cur=="all"&&st.sort!="top"?" on":"")+'" data-k="all" type="button">Home</button><button class="rd-nav'+(st.cur=="all"&&st.sort=="top"?" on":"")+'" data-k="pop" type="button">Popular</button><div class="rd-hd">Communities</div>';
 C.forEach(function(c){h+='<button class="rd-nav'+(st.cur==c.k?" on":"")+'" data-k="'+c.k+'" type="button">'+avatar(c)+esc(c.n)+(st.joined[c.k]?'<em>★</em>':'')+'</button>'});$("rdNav").innerHTML=h}
function post(p){var c=com(p.k),o=st.open[p.id],h='<article class="rd-post" id="rp'+p.id+'" data-id="'+p.id+'"><div class="rd-vt"><button type="button" class="up'+(p.my==1?" on":"")+'" data-a="up" aria-label="Upvote">▲</button><b>'+sc(p)+'</b><button type="button" class="dn'+(p.my==-1?" on":"")+'" data-a="dn" aria-label="Downvote">▼</button></div><div class="rd-bd"><div class="rd-meta">'+avatar(c)+'<b>'+esc(c.n)+'</b><span>• u/'+esc(p.u)+' • '+ago(p.at)+'</span></div><h3>'+esc(p.t)+'</h3>'+(p.b?'<p>'+esc(p.b)+'</p>':'')+
 '<div class="rd-ac"><button type="button" data-a="cm" class="'+(o?"on":"")+'">Comments ('+p.cm.length+')</button><button type="button" data-a="sh">Share</button><button type="button" data-a="sv" class="'+(st.saved[p.id]?"on":"")+'">'+(st.saved[p.id]?"Saved":"Save")+'</button></div><div class="rd-cms"'+(o?"":" hidden")+'>';
 p.cm.forEach(function(m){h+='<div class="rd-c"><b>u/'+esc(m.u)+'</b><span>'+ago(m.at)+'</span><p>'+esc(m.t)+'</p></div>'});
 return h+'<div class="rd-reply"><input maxlength="300" placeholder="Add a comment" aria-label="Add a comment"><button type="button" class="rd-btn pri" data-a="rp">Reply</button></div></div></div></article>'}
function feed(){var a=list();$("rdFeed").innerHTML=a.length?a.map(post).join(""):'<div class="rd-box rd-empty">No posts here yet. Be the first to create one!</div>';
 Array.prototype.forEach.call($("rdTabs").children,function(b){b.classList.toggle("on",b.dataset.s==st.sort)})}
function right(){var c=com(st.cur),h;
 if(c)h='<h4>'+avatar(c)+' '+esc(c.n)+'</h4><p>'+esc(c.d)+'</p><div class="st"><div><b>'+c.m+'</b>members</div><div><b>'+P.filter(function(p){return p.k==c.k}).length+'</b>posts</div></div><button type="button" class="rd-btn pri" data-a="join">'+(st.joined[c.k]?"Joined ★":"Join")+'</button>';
 else h='<h4>Home feed</h4><p>Posts from every ByteCrawler community, in one place.</p><div class="st"><div><b>'+C.length+'</b>communities</div><div><b>'+P.length+'</b>posts</div></div>';
 h+='<button type="button" class="rd-btn" data-a="new">Create post</button>';$("rdAbout").innerHTML=h;
 var r=P.slice().sort(function(x,y){return y.at-x.at}).slice(0,5),g='<div class="rd-hd">Recent posts</div>';
 r.forEach(function(p){g+='<button type="button" class="rd-rp" data-id="'+p.id+'">'+esc(p.t)+'<small>'+esc(com(p.k).n)+' • '+sc(p)+' votes • '+p.cm.length+' comments</small></button>'});$("rdRecent").innerHTML=g}
function all(){side();feed();right()}
function openForm(){var f=$("rdForm");f.hidden=false;$("rdFc").innerHTML=C.map(function(c){return'<option value="'+c.k+'"'+(c.k==st.cur?" selected":"")+'>'+esc(c.n)+'</option>'}).join("");$("rdFt").focus()}
$("rdNav").onclick=function(e){var b=e.target.closest("[data-k]");if(!b)return;var k=b.dataset.k;if(k=="pop"){st.cur="all";st.sort="top"}else{st.cur=k;if(st.sort=="top"&&k=="all")st.sort="best"}all()};
$("rdTabs").onclick=function(e){var b=e.target.closest("[data-s]");if(!b)return;st.sort=b.dataset.s;all()};
$("rdQ").oninput=function(){st.q=this.value;feed()};
$("rdNew").onclick=openForm;$("rdFx").onclick=function(){$("rdForm").hidden=true};
$("rdFp").onclick=function(){var t=$("rdFt").value.trim();if(!t){toast("Add a title first");$("rdFt").focus();return}
 var k=$("rdFc").value;P.unshift({id:nid++,k:k,u:"you",at:Date.now(),t:t,b:$("rdFb").value.trim(),v:0,my:1,cm:[]});$("rdFt").value="";$("rdFb").value="";$("rdForm").hidden=true;st.cur=k;st.sort="new";st.q="";$("rdQ").value="";all();toast("Post created")};
function addC(art){var i=art.querySelector(".rd-reply input"),t=i.value.trim();if(!t)return;var p=P.filter(function(x){return x.id==art.dataset.id})[0];p.cm.push({u:"you",at:Date.now(),t:t});st.open[p.id]=true;all();var n=$("rp"+p.id).querySelector(".rd-reply input");if(n)n.focus()}
$("rdFeed").onclick=function(e){var b=e.target.closest("[data-a]");if(!b)return;var art=b.closest(".rd-post"),p=P.filter(function(x){return x.id==art.dataset.id})[0],a=b.dataset.a;
 if(a=="up")p.my=p.my==1?0:1;else if(a=="dn")p.my=p.my==-1?0:-1;else if(a=="cm")st.open[p.id]=!st.open[p.id];else if(a=="sv"){st.saved[p.id]=!st.saved[p.id]}
 else if(a=="sh"){var u=location.href.split("#")[0]+"#community";try{navigator.clipboard.writeText(u).then(function(){toast("Link copied")},function(){toast("Copy not available")})}catch(x){toast("Copy not available")}return}
 else if(a=="rp"){addC(art);return}
 var y=window.scrollY;all();window.scrollTo(0,y)};
$("rdFeed").onkeydown=function(e){if(e.key=="Enter"&&e.target.matches(".rd-reply input"))addC(e.target.closest(".rd-post"))};
$("rdAbout").onclick=function(e){var b=e.target.closest("[data-a]");if(!b)return;if(b.dataset.a=="new")openForm();else if(b.dataset.a=="join"){st.joined[st.cur]=st.joined[st.cur]?0:1;all()}};
$("rdRecent").onclick=function(e){var b=e.target.closest("[data-id]");if(!b)return;st.cur="all";st.q="";$("rdQ").value="";st.open[b.dataset.id]=true;all();var el=$("rp"+b.dataset.id);if(el)el.scrollIntoView({block:"center"})};
all();
})();
