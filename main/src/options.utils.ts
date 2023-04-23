export function getDefault(){
  return {
    mouseSens:1
  }
}

export function loadOptions(){
  let op = window.localStorage.getItem('gm_options');
  let options;
  if (op){
    options=JSON.parse(op);  
  } else {
    options = getDefault();
  }
  return options;
}

export function saveOptions(options){
  window.localStorage.setItem('gm_options', JSON.stringify(options));   
}
