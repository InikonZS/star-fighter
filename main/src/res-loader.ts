import glUtils from './gl-utils.js';

export interface IResourceRecord{
  name: string; 
  url: string; 
  tex?: string; 
  class?: string;
}

export const modelConfig: {
  list: IResourceRecord[]
} = {
  list:[
    {
      name: "mete",
      url: "assets/models/tunnel_meteorite.obj",
      tex: "assets/textures/UVW_meteorite.png"
    },
    {
      name: "mete2",
      url: "assets/models/small_meteorite.obj",
      tex: "assets/textures/small_meteorite.jpg"
    },
    { 
      class: "cab",
      name: "cab0",
      url: "assets/models/Cabin_Tie_Interceptor.obj",
      tex: "assets/textures/Cabin_Tie_Interceptor.jpg"
    },
    {
      class: "cab",
      name: "cab1",
      url: "assets/models/Cabin_Tie_Fighter-Bomber.obj",
      tex: "assets/textures/Cabin_Tie_Fighter-Bomber.jpg"
    },
    {
      class: "cab",
      name: "cab2",
      url: "assets/models/Cabin_Tie_Fighter-Bomber.obj",
      tex: "assets/textures/Cabin_Tie_Fighter-Bomber.jpg"
    },
    {
      class: "cab",
      name: "cab3",
      url: "assets/models/cabin_4.obj",
      tex: "assets/textures/cabin_4UVW.png"
    },
    {
      class: "cab",
      name: "cab4",
      url: "assets/models/Cabin_X_Wing.obj",
      tex: "assets/textures/Cabin_X_Wing.png"
    },

    {
      class: "ship",
      name: "tie_interceptor",
      url: "assets/models/Tie_Interceptor.obj",
      tex: "assets/textures/TIE_IN_Diff.png"
    },
    {
      class: "ship",
      name: "tie_bomber",
      url: "assets/models/Tie_Bomber.obj",
      tex: "assets/textures/TIE_sa_DIFF.png"
    },
    {
      class: "ship",
      name: "tie_fighter",
      url: "assets/models/Tie_Fighter.obj",
      tex: "assets/textures/TIE_LN_Diff.png"
    },
    {
      class: "ship",
      name: "z95_headhunter",
      url: "assets/models/Z-95_Headhunter.obj",
      tex: "assets/textures/Z-95_Diff.png"
    },
    {
      class: "ship",
      name: "x-wing",
      url: "assets/models/X-wing.obj",
      tex: "assets/textures/X-wing.png"
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
      name: "neptune",
      url: "assets/models/mars.obj",
      tex: "assets/textures/2k_neptune.jpg"
    },
    {
      name: "fire_meteorite",
      url: "assets/models/fire_meteorite.obj",
      tex: "assets/textures/DefaultMaterial_emissive.jpg"
    },
    {
      name: "space_corridor",
      url: "assets/models/corridor.obj",
      tex: "assets/textures/wall_C.jpg"
    },
    {
      name: "assault_ship",
      url: "assets/models/Assault_ship.obj",
      tex: "assets/textures/ReV_Acclamator1.jpeg"
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
    },

    {
      name: "tun1",
      url: "assets/models/tunnel_block_1_.obj",
      tex: "assets/textures/UVW_meteorite.png"
    },
    {
      name: "tun2",
      url: "assets/models/tunnel_block_2_.obj",
      tex: "assets/textures/UVW_meteorite.png"
    },
    {
      name: "tun11",
      url: "assets/models/tunnel_block_1_1.obj",
      tex: "assets/textures/UVW_meteorite.png"
    },
    {
      name: "tun21",
      url: "assets/models/tunnel_block_2_1.obj",
      tex: "assets/textures/UVW_meteorite.png"
    },
    {
      name: "tun22",
      url: "assets/models/tunnel_block_2_2.obj",
      tex: "assets/textures/UVW_meteorite.png"
    },
  ]
}

let counter = 0;

export function getByName_(config, name){
  let curName;
  for (let i = 0; i<config.list.length; i++){
    curName = config.list[i].name;
    if ( curName === name){
      return config.list[i];
    }
  }
  return false;
}

function loadModels(modelConfig, onLoadedAll, onProgress){
  let max = modelConfig.list.length;
  let counter =0;
  modelConfig.list.forEach(it=>{
    fetch(it.url).then((res)=>{
      return res.text();
    }).then((res)=>{
      it.source = res;
      it.ok = true;
      counter++;
      onProgress('model', it, max, counter);
      console.log('Loaded['+counter+'] '+it.url);
      if (counter===max){
        onLoadedAll(modelConfig);
      }
    });  
  });
}

function loadImages(modelConfig, onLoadedAll, onProgress){
  //let max = modelConfig.list.length;
  let texCount = 0;
  modelConfig.list.forEach(it=>{
    if (it.tex){
      texCount++;
    }
  });
  let texMax = texCount;
  modelConfig.list.forEach(it=>{
    if (it.tex){
      let image = document.createElement('img');
      image.addEventListener('load', function() {
        console.log(it.tex);
        texCount--;
        onProgress('texture', it, texMax, texMax - texCount);
        it.texImage = image;
        if (texCount===0){
          onLoadedAll(modelConfig);
        }
      });
      image.src = it.tex;
    }
  });
}

//function loadAll(onLoad){
//  loadModels(modelConfig, onLoad);
//}

export class ModelLoader{
  data: any;
  constructor(data: {list: IResourceRecord[]}, onLoad: (res: any) => void, onProgress: () => void){
    this.data = data;
    console.log('loading models');
    loadModels(this.data, ()=>{
      console.log('loading textures');
      loadImages(this.data, onLoad, onProgress);
    },
    onProgress);
    //loadModels(this.data, onLoad);
  }

  getByName(name: string){
    return getByName_(this.data, name);
  }
  
}
