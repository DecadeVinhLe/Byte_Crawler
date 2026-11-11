/* Phone: collapse / expand the docked terminal. */
document.querySelectorAll(".dk-t").forEach(function(b){b.onclick=function(){
 var d=b.parentNode,shut=d.classList.toggle("shut");b.setAttribute("aria-expanded",!shut);b.textContent=shut?"▴ Show code":"▾ Hide code"}});

(function(){var mq=window.matchMedia('(max-width:760px)');function f(){document.querySelectorAll('.les .fold').forEach(function(d){d.open=!mq.matches})}f();(mq.addEventListener?mq.addEventListener('change',f):mq.addListener(f))})();
