function preloadSoundUrl(url){
  let el = document.createElement('audio');
  document.body.appendChild(el);
  el.src = url;  
}

function playSoundUrl(url, volume){
  let el = document.createElement('audio');
  document.body.appendChild(el);
  el.oncanplay = ()=>{
    el.play();
  }
  el.onended = ()=>{ 
    document.body.removeChild(el); 
    el = undefined;
  }
  el.src = url;

  let vol = volume;
  if (!vol || vol>=1){
    vol = 1;
  }
  el.volume = vol; 
}

module.exports = {
  preloadSoundUrl,
  playSoundUrl
}