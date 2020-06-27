const GLCanvas = require('./gl-canvas.component.js');
const Loader = require('./res-loader.js');
const SoundLoader = require('./sound-loader.js');

class App{
  constructor(parentNode){
    var sndLoader = new SoundLoader.Sounder(SoundLoader.soundConfig, ()=>{
      var loader = new Loader.ModelLoader(Loader.modelConfig, (res)=>{
        console.log('loaded', res);
        window.gameResource = res;
        this.glCanvas = new GLCanvas (parentNode, 640, 480);
        this.glCanvas.setController(this);
        window.addEventListener('resize',()=>{
        });
      });
      window.resBase = loader;
    });
    window.sndBase = sndLoader;
  }
}

module.exports = {App};