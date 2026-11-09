/* About page: scroll reveal and intro video. */
/* About: gentle reveal on scroll (skipped for reduced motion and #all) */
(function(){if(matchMedia("(prefers-reduced-motion: reduce)").matches||location.hash=="#all"||!("IntersectionObserver" in window))return;
 var els=document.querySelectorAll("#about .ab-rv");if(!els.length)return;document.documentElement.classList.add("js-rv");
 var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target)}})},{threshold:.15});
 els.forEach(function(el){io.observe(el)})})();

/* About: introduction video. Set data-video on #introVideo (YouTube, Vimeo or .mp4 URL). */
(function(){var b=document.getElementById("introVideo");if(!b)return;var src=(b.dataset.video||"").trim(),btn=b.querySelector(".vplay");
 if(!src){b.classList.add("empty");btn.setAttribute("aria-disabled","true");return}
 document.getElementById("vcap").textContent="Watch the introduction";
 btn.onclick=function(){var yt=src.match(/(?:youtu\.be\/|v=|embed\/)([\w-]{11})/),vm=src.match(/vimeo\.com\/(\d+)/),h;
  if(yt)h='<iframe src="https://www.youtube-nocookie.com/embed/'+yt[1]+'?autoplay=1&rel=0" title="Introduction video" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>';
  else if(vm)h='<iframe src="https://player.vimeo.com/video/'+vm[1]+'?autoplay=1" title="Introduction video" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>';
  else h='<video src="'+src.replace(/"/g,"")+'" controls autoplay playsinline></video>';
  b.innerHTML=h}})();
