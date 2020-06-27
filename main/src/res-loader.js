const glUtils = require('./gl-utils.js');

const modelConfig = {
  list:[
    {
      name: "mete",
      url: "assets/models/tunnel_meteorite.obj",
      tex: "assets/textures/UVW_meteorite.png"
    },
    {
      name: "cab0",
      url: "assets/models/cabin_4.obj",
      tex: "assets/textures/cabin_4UVW.png"
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
    },
    {
      name: "bigShip",
      url: "assets/models/big_ship.obj",
      tex: "assets/textures/Trident_UV_Dekol_Color.png"
    },

    {
      name: "box",
      url: "assets/models/box.obj",
    },
    {
      name: "skybox",
      url: "assets/models/skybox.obj",
      tex: "assets/textures/skybox.png"
    },
    {
      name: "explosion",
      url: "assets/models/point_sprite.obj",
      tex: "assets/textures/explosion.png"
    },
    {
      name: "magic",
      url: "assets/models/point_sprite.obj",
      tex: "assets/textures/magic.png"
    },
    {
      name: "fogmagic",
      url: "assets/models/mars.obj",
      tex: "assets/textures/fogmagic.png"
    },
    {
      name: "bulletSprite",
      url: "assets/models/point_sprite.obj",
      tex: "assets/textures/bul1.png"
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

function loadImages(modelConfig, onLoadedAll){
  //let max = modelConfig.list.length;
  let texCount = 0;
  modelConfig.list.forEach(it=>{
    if (it.tex){
      texCount++;
    }
  });

  modelConfig.list.forEach(it=>{
    if (it.tex){
      let image = document.createElement('img');
      image.addEventListener('load', function() {
        console.log(it.tex);
        texCount--;
        it.texImage = image;
        if (texCount===0){
          onLoadedAll(modelConfig);
        }
      });
      image.src = it.tex;
    }
  });
}

function loadAll(onLoad){
  loadModels(modelConfig, onLoad);
}

class ModelLoader{
  constructor(data, onLoad){
    this.data = data;
    console.log('loading models');
    loadModels(this.data, ()=>{
      console.log('loading textures');
      loadImages(this.data, onLoad);
    });
    //loadModels(this.data, onLoad);
  }

  getByName(name){
    return getByName_(this.data, name);
  }
  
}

module.exports = {
  ModelLoader,
  loadAll,
  modelConfig,
  getByName_
};