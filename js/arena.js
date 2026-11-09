/* 3D boss arena (three.js) and its effects bridge F. */
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
