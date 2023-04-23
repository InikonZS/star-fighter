export function getDefault(){
  return {
    mouseSens:1
  }
}

interface IGameOptions{
  mouseSens: number;
}

export function loadOptions(): IGameOptions{
  let op = window.localStorage.getItem('gm_options');
  let options;
  if (op){
    options=JSON.parse(op);  
  } else {
    options = getDefault();
  }
  return options;
}

export function saveOptions(options: IGameOptions){
  window.localStorage.setItem('gm_options', JSON.stringify(options));   
}
