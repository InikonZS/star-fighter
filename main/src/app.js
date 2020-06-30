const GLCanvas = require('./gl-canvas.component.js');
const Control = require('./control-js/control.component.js');
const Loader = require('./res-loader.js');
const SoundLoader = require('./sound-loader.js');
const StartScreen = require('./start-screen.component.js');

class App{
  constructor(parentNode){
    this.parentNode = parentNode;
    this.stWidth = 640;
    this.stHeight = 480;
    if (document.documentElement.clientWidth<768){
      this.stWidth = 320;
      this.stHeight = 240;  
    }

    window.addEventListener('resize', ()=>{
      let brDetected = false;
      let nw;
      let nh;
      if (document.documentElement.clientWidth>=768){
        if (this.stWidth!=640){
          brDetected = true;  
        }
        nw = 640;
        nh = 480;  
      } 

      else if (document.documentElement.clientWidth>=520){
        if (this.stWidth!=480){
          brDetected = true;  
        }
        nw = 480;
        nh = 320; 
      }

      else if (document.documentElement.clientWidth<520){
        if (this.stWidth!=320){
          brDetected = true;  
        }
        nw = 320;
        nh = 240; 
      }
      this.stWidth = nw;
      this.stHeight = nh; 
      

      if (brDetected){
        if (!this.startScreen.isHidden){
          this.startScreen.refresh(this.stWidth, this.stHeight);
        }
        if (this.glCanvas){
          this.glCanvas.node.width = this.stWidth;
          this.glCanvas.node.height = this.stHeight; 
          this.glCanvas.overlayRefresh();
          this.glCanvas.menuRefresh(); 
        }
      } 
    });

    this.startScreen = new StartScreen(parentNode, this.stWidth, this.stHeight, ()=>{
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
        this.glCanvas = new GLCanvas (parentNode, this.stWidth, this.stHeight);
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