function preloadSoundUrl(url){
  let el = document.createElement('audio');
  document.body.appendChild(el);
  el.src = url;  
}

function playSoundUrl(url){
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
}

module.exports = {
  preloadSoundUrl,
  playSoundUrl
}