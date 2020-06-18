const modelConfig = {
  list:[
    {
      name: "mete",
      url: "assets/models/mete-scaled.obj",
    },
    {
      name: "tie_interceptor",
      url: "assets/models/Tie_Interceptor.obj",
    },
    {
      name: "cab1",
      url: "assets/models/Kabina1.obj",
    },
    {
      name: "cab2",
      url: "assets/models/Kabina2.obj",
    },
    {
      name: "cab3",
      url: "assets/models/Kabina3.obj",
    },
  ]
}

let counter = 0;

function getByName_(config, name){
  let curName;
  for (let i = 0; i<config.list.length; i++){
    curName = config.list[i].name;
    if ( curName === name){
      return config.list[i];
    }
  }
  return false;
}

function loadModels(modelConfig, onLoadedAll){
  let max = modelConfig.list.length;
  modelConfig.list.forEach(it=>{
    fetch(it.url).then((res)=>{
      return res.text();
    }).then((res)=>{
      it.source = res;
      it.ok = true;
      counter++;
      console.log('Loaded['+counter+'] '+it.url);
      if (counter===max){
        onLoadedAll(modelConfig);
      }
    });  
  });
}

function loadAll(onLoad){
  loadModels(modelConfig, onLoad);
}

class ModelLoader{
  constructor(data, onLoad){
    this.data = data;
    loadModels(this.data, onLoad);
  }

  getByName(name){
    return getByName_(this.data, name);
  }
  
}

module.exports = loadAll;