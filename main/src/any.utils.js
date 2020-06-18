const Control = require('./control-js/control.component.js');

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

function makeExternalScript(parentNode, scriptURL, onLoad, onError) {
  const elem = new Control(parentNode, 'script');
  elem.node.onload = () => {
    //console.log(elem.node);
    onLoad(elem.node.textContent);
    parentNode.removeChild(elem);
  };
  elem.node.onerror = () => {
    onError();
  };
  elem.node.type = 'model-source';
  elem.node.async = true;
  //parentNode.appendChild(elem.node);
  elem.node.src = scriptURL;
  return elem;
}

module.exports = {
  preloadSoundUrl,
  playSoundUrl,
  makeExternalScript
}