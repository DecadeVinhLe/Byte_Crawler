/* Phone: collapse / expand the docked terminal. */
document.querySelectorAll(".dk-t").forEach(function(b){b.onclick=function(){
 var d=b.parentNode,shut=d.classList.toggle("shut");b.setAttribute("aria-expanded",!shut);b.textContent=shut?"▴ Show code":"▾ Hide code"}});
