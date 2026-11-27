/* 3D boss arena (three.js) and its effects bridge F. */
var F={atk:function(){},win:function(){},lose:function(){},reset:null,cls:function(){},phase2:function(){},setPhase:function(){}},arenaOn=false;
function clsUi(){document.querySelectorAll("#cls button").forEach(function(x){x.classList.toggle("on",x.dataset.c==(S.cls||"knight"))})}
$("cls").onclick=function(e){var b=e.target.closest("button");if(!b)return;S.cls=b.dataset.c;save();clsUi();F.cls(S.cls)};
function load3(cb){if(window.THREE)return cb();var s=document.createElement("script");s.src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";s.onload=cb;s.onerror=function(){$("bfb").hidden=false;$("bcv").hidden=true};document.head.appendChild(s)}
function arena(){if(arenaOn)return;arenaOn=true;load3(function(){
 var W=384,H=216,R;try{R=new THREE.WebGLRenderer({canvas:$("bcv"),antialias:false})}catch(e){$("bfb").hidden=false;$("bcv").hidden=true;return}
 R.setPixelRatio(1);R.setSize(W,H,false);R.setClearColor(0x05050f);R.autoClear=false;
 var sc=new THREE.Scene(),cam=new THREE.PerspectiveCamera(36,W/H,.1,100);cam.position.set(0,2.4,14);cam.lookAt(0,2.4,0);
 var TL=new THREE.TextureLoader(),T={},keys=["ruins","sheetKnight","sheetMage","sheetRanger","sheetRogue","dragon","dragon2"],left=keys.length;
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
  var HX=-3.6,DX=3.8,DY=2.1,FL=-1.2,HH={knight:3.6,mage:3.2,ranger:3.6,rogue:3.4},hs={};
  /* Heroes: every hero is one 256px frame of a 3x3 sprite sheet (assets/images/sheet-*.png) drawn onto a canvas texture.
     feet / top / cx = where the character stands inside a frame (pixels). flip:1 mirrors a sheet that faces left. Every hero sheet (knight included) already faces right, toward the dragon. */
  var HERO={knight:{sheet:"sheetKnight",feet:227,top:138,cx:126.5},mage:{sheet:"sheetMage",feet:209,top:116,cx:126.5},
   ranger:{sheet:"sheetRanger",feet:210,top:128,cx:128.5},rogue:{sheet:"sheetRogue",feet:211,top:110,cx:128.5}};
  function drawFrame(k,f){var H=HERO[k];if(H.f===f)return;H.f=f;var g=H.g;g.clearRect(0,0,256,256);g.save();if(H.flip){g.translate(256,0);g.scale(-1,1)}
   g.drawImage(H.img,(f%3)*256,Math.floor(f/3)*256,256,H.feet+2,0,0,256,H.feet+2);g.restore();H.tex.needsUpdate=true}   /* rows below the feet (a mirror reflection in the art) are left out */
  function pxY(k,r){return FL+(HERO[k].feet-r)*HERO[k].s}            /* world height of a pixel row in a frame */
  function pxX(k,x,hx){return hx+(x-HERO[k].cx)*HERO[k].s}           /* world x of a pixel column when the hero stands at hx */
  Object.keys(HERO).forEach(function(k){var H=HERO[k],c=document.createElement("canvas");c.width=c.height=256;H.g=c.getContext("2d");H.img=T[H.sheet].image;
   H.tex=new THREE.CanvasTexture(c);H.tex.magFilter=H.tex.minFilter=THREE.NearestFilter;H.tex.generateMipmaps=false;
   H.s=HH[k]/(H.feet-H.top);H.ox=(128-H.cx)*H.s;H.oy=((H.feet+H.top)/2-128)*H.s;H.f=-1;
   hs[k]=plane(H.tex,256*H.s,256*H.s);hs[k].visible=false;drawFrame(k,0)});
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
  var fire=plane(rad("#ff6a1a"),2,2,{blending:THREE.AdditiveBlending,depthWrite:false});
  /* The attack art already contains each hero's effect, but it stops at the frame edge. These projectiles are crops of the same sheet
     that carry the effect on to the dragon: f = sheet frame, c = crop [x,y,w,h], cy = pixel row it flies along, sx = start column,
     t0 / t1 = take-off and landing time, y1 = world height it lands at (omit = straight), dy = extra height, sc = size. */
  var EXT={mage:[{f:6,c:[180,116,74,30],cy:131,sx:251,t0:.66,t1:.8}],
   rogue:[{f:4,c:[186,128,70,24],cy:140,sx:255,t0:.4,t1:.56},{f:4,c:[186,128,70,24],cy:140,sx:255,t0:.46,t1:.62,dy:.6,sc:.8}],
   ranger:[{f:6,c:[188,166,66,10],cy:171,sx:215,t0:.68,t1:.8,y1:1.4,sc:1.4},{f:6,c:[188,166,66,10],cy:171,sx:215,t0:.72,t1:.86,y1:2.2,sc:1.4}]},exs={};
  Object.keys(EXT).forEach(function(k){var H=HERO[k];exs[k]=EXT[k].map(function(E){var m=plane(ct(function(g){g.drawImage(H.img,(E.f%3)*256+E.c[0],Math.floor(E.f/3)*256+E.c[1],E.c[2],E.c[3],0,0,E.c[2],E.c[3])},E.c[2],E.c[3]),E.c[2]*H.s,E.c[3]*H.s);m.visible=false;return m})});
  function hideExt(){for(var k in exs)exs[k].forEach(function(m){m.visible=false})}
  var hero=hs.knight,hy=FL+HH.knight/2,curC="knight",hoX=0,hoY=0;
  function setCls(c){if(!hs[c])c="knight";hero.visible=false;hero=hs[c];hero.visible=true;hy=FL+HH[c]/2;curC=c;hero.material.opacity=1;hero.rotation.z=0;hoX=HERO[c].ox;hoY=HERO[c].oy;drawFrame(c,0)}
  setCls(S.cls||"knight");F.cls=setCls;
  var sparks=[];function burst(x,y,col,n){for(var i=0;i<n;i++){var m=new THREE.Mesh(new THREE.PlaneGeometry(.2,.2),new THREE.MeshBasicMaterial({color:col,transparent:true}));m.position.set(x,y,1.5);m.userData={vx:(Math.random()-.3)*6,vy:Math.random()*5+1,t:performance.now()};sc.add(m);sparks.push(m)}}
  /* Each hero's attack: d = seconds each of the 9 frames is shown, ti = when a hit lands, tm / mf = when and after which frame a miss fizzles,
     rel = release moment (small recoil), shk / fl = screen shake and flash on impact, c1 c2 n1 n2 = impact spark colours and counts. */
  var ATK={knight:{d:[.08,.1,.1,.1,.16,.1,.1,.1,.12],ti:.42,tm:.4,mf:3,iy:1.9,shk:.45,fl:.2,c1:0x67e8f9,c2:0xffffff,n1:18,n2:10},
   mage:{d:[.1,.1,.12,.12,.12,.1,.1,.1,.1],ti:.8,tm:.58,mf:4,rel:.56,iy:1.55,shk:.3,fl:.25,c1:0x7dd3fc,c2:0xffffff,n1:18,n2:12},
   ranger:{d:[.1,.1,.1,.12,.12,.12,.1,.1,.1],ti:.8,tm:.68,mf:5,rel:.66,iy:1.1,v:.06,shk:.25,fl:.08,c1:0xe6d3a3,c2:0x8fd16a,n1:12,n2:8},
   rogue:{d:[.1,.1,.1,.1,.1,.1,.1,.1,.1],ti:.56,tm:.22,mf:1,rel:.2,iy:1.35,v:.06,shk:.3,fl:.12,c1:0xcfe9ff,c2:0x8fb4d8,n1:14,n2:8}};
  function frameAt(A,k,hit){var lim=hit?9:A.mf+1,acc=0;for(var q=0;q<lim;q++){acc+=A.d[q];if(k<acc)return q}return 0}
  var act=null,dead=0,down=0,wt=0,lt=0,last=performance.now();
  F.atk=function(h){act={t:performance.now(),hit:h,c:curC}};F.win=function(){dead=1;wt=performance.now();burst(DX,DY,0xffd23f,26)};F.lose=function(){down=1;lt=performance.now()};
  F.phase2=function(){if(dead)return;dead=1;wt=performance.now();burst(DX,DY,0xffd23f,26);pend=1;pat=wt+1100};
  F.reset=function(){dead=0;down=0;act=null;pend=0;intro=0;flash=0;BL.length=0;nextAmb=0;dragon.visible=ph==1;dragon2.visible=ph==2;D=ph==1?dragon:dragon2;D.rotation.z=0;D.material.opacity=1;hero.rotation.z=0;hero.material.opacity=1};
  F.setPhase=function(p){ph=p;F.reset()};
  function loop(now){requestAnimationFrame(loop);if(!$("boss").classList.contains("show")){last=now;return}
   var dt=Math.min(.05,(now-last)/1000),s=now/1000;last=now;
   var hx=HX,dx=DX,dy=DY+Math.sin(s*1.6)*.25,hf=0,df=0,shake=0,af=0;var pop=1;hero.position.y=hy+hoY+Math.abs(Math.sin(s*2.4))*.05;
   fire.visible=chg.visible=false;hideExt();
   if(pend&&now>=pat){pend=0;ph=2;dragon.visible=false;dragon.rotation.z=0;D=dragon2;D.visible=true;D.rotation.z=0;D.material.opacity=0;dead=0;intro=now;sky(now,80,0,.8);sky(now,200,160,.6);sky(now,310,320,.8);burst(DX,DY,0x7dd3fc,24)}
   if(intro){var qi=(now-intro)/1000;if(qi>=1.3){intro=0;D.material.opacity=1}else{var ie=Math.min(1,qi/.7);D.material.opacity=ie;pop=.82+.18*ie;if(qi<.7)shake=.3}}
   if(ph==2&&!intro&&!dead&&!pend){if(!nextAmb)nextAmb=now+2500;if(now>nextAmb){nextAmb=now+3500+Math.random()*3500;sky(now,null,0,.28)}}
   D.scale.x=(D===dragon?-1:1)*pop;D.scale.y=pop*(1+Math.sin(s*3.2)*.025);
   if(act){var k=(now-act.t)/1000,c=act.c,A=ATK[c],hit=act.hit,ti=hit?A.ti:A.tm,tx=DX-(ph==2?1.5:1.9),ty=DY-(ph==2?.6:.3),p;
    af=frameAt(A,k,hit);
    if(c=="knight"){var d=hit?(k<.08?0:k<.38?(k-.08)/.3:k<.66?1:k<1.04?1-(k-.66)/.38:0):(k<.08?0:k<.38?.35*(k-.08)/.3:k<.5?.35:k<.8?.35*(1-(k-.5)/.3):0);hx=HX+4.6*d}
    else if(hit&&k>A.rel&&k<A.rel+.2)hx=HX-.3*Math.sin((k-A.rel)/.2*Math.PI);
    if(hit&&exs[c])EXT[c].forEach(function(E,i){if(k<E.t0||k>E.t1+.1)return;var H=HERO[c],pp=Math.min(1,(k-E.t0)/(E.t1-E.t0)),w=E.c[2]*H.s*(E.sc||1),x0=pxX(c,E.sx,HX),x1=tx+.5,y0=pxY(c,E.cy)+(E.dy||0),y1=E.y1===undefined?y0:E.y1,m=exs[c][i];
     m.visible=true;m.scale.x=m.scale.y=E.sc||1;m.position.set(x0+(x1-x0)*pp-w/2*Math.cos(Math.atan2(y1-y0,x1-x0)),y0+(y1-y0)*pp,1);m.rotation.z=Math.atan2(y1-y0,x1-x0);m.material.opacity=k>E.t1?Math.max(0,1-(k-E.t1)/.1):1});
    if(!hit&&k>=A.tm&&!act.fz){act.fz=1;burst(HX+1.7,hy+.4,A.c1,8);burst(HX+1.7,hy+.4,0xffffff,4)}
    if(hit&&k>=ti){var q=k-ti;if(!act.f1){act.f1=1;burst(tx+.8,A.iy,A.c1,A.n1);burst(tx+.8,A.iy,A.c2,A.n2);flash=Math.max(flash,A.fl)}if(A.v&&k>=ti+A.v&&!act.f4){act.f4=1;burst(tx+.9,A.iy+.5,A.c2,A.n2);burst(tx+.9,A.iy+.5,A.c1,6)}if(q<.25){df=1;dx=DX+.6*Math.sin(q/.25*Math.PI);shake=A.shk}}
    if(!hit&&k>=ti&&ph==2){var q6=k-ti;dx=DX-.9*Math.sin(Math.min(1,q6/.55)*Math.PI);
     if(q6<.4){chg.visible=true;chg.position.set(dx-1.5,dy-1.8,1.2);chg.scale.setScalar(.4+q6*3+Math.sin(q6*70)*.12);
      var cn=(q6/.09)|0;if(act.cn!==cn){act.cn=cn;var an2=Math.random()*6.283,ln2=20+Math.random()*26;BL.push({t0:now,end:now+95,a:function(){return scr(MP.x,MP.y)},b:(function(a,l){return function(){var m=scr(MP.x,MP.y);return[m[0]+Math.cos(a)*l,m[1]+Math.sin(a)*l]}})(an2,ln2),w:2,j:4})}}
     if(q6>=.4&&q6<.85){if(!act.f3){act.f3=1;BL.push({t0:now,end:now+420,a:function(){return scr(MP.x,MP.y)},b:function(){return scr(HP.x,HP.y)},w:3,j:11,fk:1,fl:.6})}
      hf=2;hx+=(Math.random()-.5)*.22;shake=.4;if(!act.f2){act.f2=1;burst(HX+.5,hy,0x7dd3fc,14);burst(HX+.5,hy,0xffffff,8)}}}
    else if(!hit&&k>=ti){var q2=k-ti;dx=DX-3.7*Math.sin(Math.min(1,q2/.6)*Math.PI);
     if(q2>.12&&q2<.5){var f=(q2-.12)/.38;fire.visible=true;fire.position.set(dx-1.8+(HX+1.2-dx+1.8)*f,DY-.8+(hy-DY+.8)*f,1.2);fire.scale.setScalar(1+Math.sin(q2*50)*.2)}
     if(q2>.45&&q2<.85){hf=1;hx-=.5*Math.sin((q2-.45)/.4*Math.PI);shake=.35;if(!act.f2){act.f2=1;burst(HX+.5,hy,0xff6a1a,16)}}}
    if(k>1.5)act=null}
   if(dead){var q3=Math.min(1,(now-wt)/1000);D.rotation.z=-q3*1.2;dy=DY-q3*2.2;D.material.opacity=1-q3*.85}
   if(down){var q4=Math.min(1,(now-lt)/500);hero.rotation.z=-q4*1.4;hero.material.opacity=1-q4*.5}
   if(hf==2)hero.material.color.setRGB(1.8,2.6,3.2);else hero.material.color.setRGB(hf?3:1,hf?.35:1,hf?.35:1);D.material.color.setRGB(df?3:1,df?3:1,df?3:1);
   drawFrame(curC,af);hero.position.x=hx+hoX;D.position.set(dx,dy,0);hsh.position.set(hx,FL-.1,.1);dsh.position.set(dx,FL-.15,.1);dsh.scale.x=1-(dy-DY)*.1;
   for(var i=sparks.length-1;i>=0;i--){var m=sparks[i],u=m.userData,age=(now-u.t)/1000;u.vy-=14*dt;m.position.x+=u.vx*dt;m.position.y+=u.vy*dt;m.material.opacity=Math.max(0,1-age/.7);if(age>.7){sc.remove(m);m.geometry.dispose();m.material.dispose();sparks.splice(i,1)}}
   g1.material.opacity=.3+Math.sin(s*2)*.06+Math.random()*.02;g2.material.opacity=.2+Math.sin(s*3+2)*.05+Math.random()*.02;
   MP.x=dx-1.5;MP.y=dy-1.8;HP.x=hx;HP.y=hy+.5;flash=Math.max(0,flash-dt*2.6);fq.material.opacity=Math.min(1,flash);paint(now);
   cam.position.x=Math.sin(now*.07)*shake;try{R.clear();R.render(sc,cam);R.render(ov,oc)}catch(e){if(!fail){fail=1;$("bfb").hidden=false;$("bcv").hidden=true}}}
  requestAnimationFrame(loop)}
})}
