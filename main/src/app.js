const GLCanvas = require('./gl-canvas.component.js');
const Control = require('./control-js/control.component.js');
const Loader = require('./res-loader.js');
const SoundLoader = require('./sound-loader.js');
const StartScreen = require('./start-screen.component.js');

class App{
  constructor(parentNode){
    this.parentNode = parentNode;
    this.startScreen = new StartScreen(parentNode, ()=>{
      this.loadApp(()=>{
        this.startScreen.hide();
      },
      (type, it, length, current)=>{
        this.startScreen.loadingIndicator.node.textContent = `Loading ${type} ${current}/${length}, ${Math.round(100*current/length)}% done `;
      });
    });
  }

  loadApp(onLoad, onProgress){
    let parentNode = this.parentNode;
    var sndLoader = new SoundLoader.Sounder(SoundLoader.soundConfig, ()=>{
      var loader = new Loader.ModelLoader(Loader.modelConfig, (res)=>{
        console.log('loaded', res);
        window.gameResource = res;
        this.glCanvas = new GLCanvas (parentNode, 640, 480);
        this.glCanvas.setController(this);
        window.addEventListener('resize',()=>{
        });
        onLoad();
      },
      onProgress);
      window.resBase = loader;
    },
    onProgress);
    window.sndBase = sndLoader;  
  }
}

module.exports = {App};