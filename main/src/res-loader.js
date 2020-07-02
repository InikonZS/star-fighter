const modelConfig = {
  list:[
    {
      name: "mete",
      url: "assets/models/small_meteorite.obj",
      tex: "assets/textures/small_meteorite.jpg"
    },
    {
      name: "cab0",
      url: "assets/models/Cabin_Tie_Interceptor.obj",
      tex: "assets/textures/Cabin_Tie_Interceptor.jpg"
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

    {
      name: "tie_interceptor",
      url: "assets/models/Tie_Interceptor.obj",
      tex: "assets/textures/TIE_IN_Diff.png"
    },
    {
      name: "tie_bomber",
      url: "assets/models/Tie_Bomber.obj",
      tex: "assets/textures/TIE_sa_DIFF.png"
    },
    {
      name: "tie_fighter",
      url: "assets/models/Tie_Fighter.obj",
      tex: "assets/textures/TIE_LN_Diff.png"
    },
    {
      name: "z95_headhunter",
      url: "assets/models/Z-95_Headhunter.obj",
      tex: "assets/textures/Z-95_Diff.png"
    },
    {
      name: "mete1",
      url: "assets/models/tunnel_meteorite.obj",
      tex: "assets/textures/UVW_meteorite.png"
    },

    {
      name: "mars",
      url: "assets/models/mars.obj",
      tex: "assets/textures/2k_mars.jpg"
    },
    {
      name: "mercury",
      url: "assets/models/mars.obj",
      tex: "assets/textures/2k_mercury.jpg"
    }
    
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