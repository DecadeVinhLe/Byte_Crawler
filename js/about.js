/* About page: intro video. Put a YouTube, Vimeo or .mp4 link in data-video on #introVideo (index.html).
   With no link the placeholder ("Introduction video coming soon") stays visible and the button does nothing. */
(function(){var b=document.getElementById("introVideo");if(!b)return;var src=(b.dataset.video||"").trim(),btn=b.querySelector(".vplay");
 if(!src){b.classList.add("off");btn.disabled=true;btn.setAttribute("aria-label","Introduction video coming soon");return}
 b.querySelector("#vcap").textContent="Watch the introduction";
 btn.onclick=function(){var yt=src.match(/(?:youtu\.be\/|v=|embed\/)([\w-]{11})/),vm=src.match(/vimeo\.com\/(\d+)/),h;
  if(yt)h='<iframe src="https://www.youtube-nocookie.com/embed/'+yt[1]+'?autoplay=1&rel=0" title="Introduction video" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>';
  else if(vm)h='<iframe src="https://player.vimeo.com/video/'+vm[1]+'?autoplay=1" title="Introduction video" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>';
  else h='<video src="'+src.replace(/"/g,"")+'" controls autoplay playsinline></video>';
  b.innerHTML=h}})();
