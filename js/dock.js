/* Phone: collapse / expand the docked terminal. */
document.querySelectorAll(".dk-t").forEach(function(b){b.onclick=function(){
 var d=b.parentNode,shut=d.classList.toggle("shut");b.setAttribute("aria-expanded",!shut);b.textContent=shut?"▴ Show code":"▾ Hide code"}});

/* phones: the lesson text lives on its own page (#lesson); desktop keeps it beside the code */
(function(){var mq=window.matchMedia('(max-width:760px)'),les=document.querySelector('.les'),home=document.getElementById('lesHome'),box=document.getElementById('lesBox');
 function place(){if(mq.matches){box.appendChild(les)}else{home.parentNode.insertBefore(les,home.nextSibling);if(location.hash=='#lesson')location.hash='#course'}
  les.querySelectorAll('.fold').forEach(function(f){f.open=true})}
 place();(mq.addEventListener?mq.addEventListener('change',place):mq.addListener(place))})();

/* lesson page (phones): jump back to the progress list or the terminal on the Learning path page */
document.querySelectorAll('[data-go]').forEach(function(b){b.addEventListener('click',function(e){e.preventDefault();var to=b.getAttribute('data-go');
 function go(){var dk=document.querySelector('.dock');
  if(to==='terminal'){if(dk.classList.contains('shut'))dk.querySelector('.dk-t').click();dk.scrollIntoView({block:'end'})}
  else{var sd=document.querySelector('.side');if(sd)sd.scrollIntoView({block:'start'})}}
 if(location.hash==='#course'){go()}else{location.hash='#course';setTimeout(go,80)}})});

/* keep the course page clear of the fixed bottom dock */
(function(){var dk=document.querySelector(".cg>.dock"),pg=document.getElementById("course");if(!dk||!pg||!window.ResizeObserver)return;
 new ResizeObserver(function(){pg.style.setProperty("--dkh",dk.offsetHeight+"px")}).observe(dk)})();
