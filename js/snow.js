/* Hero snow (three.js). Square pixel flakes drift down in front of the cave.
   If three.js or WebGL is unavailable the hero simply stays still. */
(function(){
 var cv=document.getElementById("snow"),hero=cv&&cv.parentNode;if(!cv)return;
 if(matchMedia("(prefers-reduced-motion: reduce)").matches)return;
 function boot(){
  var R;try{R=new THREE.WebGLRenderer({canvas:cv,alpha:true,antialias:false})}catch(e){return}
  var N=140,W=1,H=1,sc=new THREE.Scene(),cam=new THREE.OrthographicCamera(0,1,1,0,-1,1);
  var pos=new Float32Array(N*3),sp=new Float32Array(N),ph=new Float32Array(N);
  for(var i=0;i<N;i++){pos[i*3]=Math.random();pos[i*3+1]=Math.random();sp[i]=.04+Math.random()*.09;ph[i]=Math.random()*6.28}
  var g=new THREE.BufferGeometry();g.setAttribute("position",new THREE.BufferAttribute(pos,3));
  var m=new THREE.PointsMaterial({color:0xdfe3ff,size:5,sizeAttenuation:false,transparent:true,opacity:.85,depthWrite:false});
  sc.add(new THREE.Points(g,m));
  function size(){W=hero.clientWidth;H=hero.clientHeight;R.setPixelRatio(1);R.setSize(W,H,false);m.size=W<600?4:5}
  size();addEventListener("resize",size);
  var t0=performance.now(),draw=[];
  function tick(now){requestAnimationFrame(tick);
   if(document.hidden||!hero.offsetParent)return;
   var dt=Math.min(.05,(now-t0)/1000);t0=now;var a=g.attributes.position.array;
   for(var i=0;i<N;i++){a[i*3+1]-=sp[i]*dt;ph[i]+=dt;a[i*3]+=Math.sin(ph[i])*.012*dt*4;
    if(a[i*3+1]<-.02){a[i*3+1]=1.02;a[i*3]=Math.random()}
    if(a[i*3]<0)a[i*3]+=1;if(a[i*3]>1)a[i*3]-=1}
   g.attributes.position.needsUpdate=true;R.render(sc,cam)}
  requestAnimationFrame(tick)}
 function load(){if(window.THREE)return boot();var s=document.createElement("script");
  s.src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";s.onload=boot;s.onerror=function(){};document.head.appendChild(s)}
 load()})();
