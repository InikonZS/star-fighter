const resLoader = require('./res-loader.js');
const sndUtils = require('./any.utils.js');
const calc = require('./calc.utils.js');


const soundConfig = {
  list:[
    { 
      class: "hit",
      name: "hit1",
      url: "assets/sounds/hit1.mp3"
    },
    { 
      class: "hit",
      name: "hit2",
      url: "assets/sounds/hit2.mp3"
    },
    { 
      class: "explosion",
      name: "expl1",
      url: "assets/sounds/expl1.mp3"
    },
    { 
      class: "explosion",
      name: "expl2",
      url: "assets/sounds/expl2.mp3"
    },
    { 
      class: "near",
      name: "near1",
      url: "assets/sounds/near1.mp3"
    },
    { 
      class: "near",
      name: "near2",
      url: "assets/sounds/near2.mp3"
    },
    { 
      class: "error",
      name: "error",
      url: "assets/sounds/error.mp3"
    },
    { 
      class: "correct",
      name: "correct",
      url: "assets/sounds/correct.mp3"
    },
    { 
      class: "healthBonus",
      name: "hb",
      url: "assets/sounds/correct.mp3"
    },
    { 
      class: "bulletBonus",
      name: "bb",
      url: "assets/sounds/reload.mp3"
    },

    { 
      class: "laserShot",
      name: "laserShot",
      url: "assets/sounds/laser.mp3"
    },
    { 
      class: "autoShot",
      name: "autoShot",
      url: "assets/sounds/auto.mp3"
    },
    { 
      class: "phaserShot",
      name: "phaserShot",
      url: "assets/sounds/laser_med.mp3"
    },
    { 
      class: "railShot",
      name: "railShot",
      url: "assets/sounds/laser_power.mp3"
    }
  ]
}

function loadSoundBlob(url, onLoad){
  fetch(url).then((res)=>res.blob()).then(blob=>onLoad(blob));  
}

function loadSounds(modelConfig, onLoadedAll, onProgress){
  let sndCount = modelConfig.list.length;
  let max = sndCount;
  modelConfig.list.forEach(it=>{
    if (it.url){
      loadSoundBlob(it.url, function(blob) {
        console.log(it.url);
        
        sndCount--;
        onProgress('sound', it, max, max-sndCount);
        it.blob = blob;
        it.locURL = URL.createObjectURL(blob);
        if (sndCount===0){
          onLoadedAll(modelConfig);
        }
      });
    }
  });
}

function getByClass_(config, name){
  let curName;
  let res = [];
  for (let i = 0; i<config.list.length; i++){
    curName = config.list[i].class;
    if ( curName === name){
      res.push(config.list[i]);
    }
  }

  let ret;
  if (res.length){
    ret = res[calc.rand(res.length)];
  }
  return ret;
}


class Sounder {
  constructor (soundConfig, onLoad, onProgress){
    this.data = soundConfig;
    loadSounds(this.data, onLoad, onProgress);
  }

  getByName(name){
    return resLoader.getByName_(this.data, name);
  }

  getByClass(name){
    return getByClass_(this.data, name);
  }

  playByName(name, volume){
    let nm = this.getByName(name);
    sndUtils.playSoundUrl(nm.locURL, volume);
  }

  playByClass(name, volume){
    let nm = this.getByClass(name);
    sndUtils.playSoundUrl(nm.locURL, volume);  
  }
}

module.exports = {
  Sounder,
  soundConfig
};