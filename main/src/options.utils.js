function getDefault(){
  return {
    mouseSens:1
  }
}

function loadOptions(){
  let op = window.localStorage.getItem('gm_options');
  let options;
  if (op){
    options=JSON.parse(op);  
  } else {
    options = getDefault();
  }
  return options;
}

function saveOptions(options){
  window.localStorage.setItem('gm_options', JSON.stringify(options));   
}

module.exports = {
  getDefault,
  loadOptions,
  saveOptions
}