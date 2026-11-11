/* Phone: collapse / expand the docked terminal. */
document.querySelectorAll(".dk-t").forEach(function(b){b.onclick=function(){
 var d=b.parentNode,shut=d.classList.toggle("shut");b.setAttribute("aria-expanded",!shut);b.textContent=shut?"▴ Show code":"▾ Hide code"}});

/* phones: the lesson text lives on its own page (#lesson); desktop keeps it beside the code */
(function(){var mq=window.matchMedia('(max-width:760px)'),les=document.querySelector('.les'),home=document.getElementById('lesHome'),box=document.getElementById('lesBox');
 function place(){if(mq.matches){box.appendChild(les)}else{home.parentNode.insertBefore(les,home.nextSibling);if(location.hash=='#lesson')location.hash='#course'}
  les.querySelectorAll('.fold').forEach(function(f){f.open=true})}
 place();(mq.addEventListener?mq.addEventListener('change',place):mq.addListener(place))})();
