import Control from './control-js/control.component';

function preloadSoundUrl(url: string){
  let el = document.createElement('audio');
  document.body.appendChild(el);
  el.src = url;  
}

function playSoundUrl(url: string, volume: number){
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

function makeExternalScript(parentNode: HTMLElement, scriptURL: string, onLoad: (data: string) => void, onError: () => void) {
  const elem = new Control<HTMLScriptElement>(parentNode, 'script');
  elem.node.onload = () => {
    //console.log(elem.node);
    onLoad(elem.node.textContent);
    //parentNode.removeChild(elem);
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

export default {
  preloadSoundUrl,
  playSoundUrl,
  makeExternalScript
}