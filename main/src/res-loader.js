const modelConfig = {
  list:[
    {
      name: "mete",
      url: "assets/models/mete-scaled.obj",
    },
    {
      name: "mete",
      url: "assets/models/Tie_Interceptor.obj",
    },
    {
      name: "mete",
      url: "assets/models/Kabina1.obj",
    },
    {
      name: "mete",
      url: "assets/models/Kabina2.obj",
    },
    {
      name: "mete",
      url: "assets/models/Kabina3.obj",
    },
  ]
}

let counter = 0;

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

module.exports = loadAll;