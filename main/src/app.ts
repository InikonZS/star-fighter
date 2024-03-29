import GLCanvas from './gl-canvas.component';
//import Control from './control-js/control.component.js';
import { IResourceRecord, ModelLoader, modelConfig } from './res-loader';
import { Sounder, soundConfig } from './sound-loader';
import { StartScreen } from './start-screen.component';

export class App{
  private parentNode: HTMLElement;
  stWidth: number;
  stHeight: number;
  startScreen: StartScreen;
  glCanvas: GLCanvas;

  constructor(parentNode: HTMLElement){
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
        this.startScreen.loadingUpdate(type, it, length, current);
      });
    });
  }

  loadApp(onLoad: ()=>void, onProgress:(type: string, it: IResourceRecord, length: number, current: number)=>void){
    const parentNode = this.parentNode;
    const sndLoader = new Sounder(soundConfig, ()=>{
      const loader = new ModelLoader(modelConfig, (res)=>{
        console.log('loaded', res);
        window.gameResource = res;
        this.glCanvas = new GLCanvas (parentNode, this.stWidth, this.stHeight);
        this.glCanvas.setController();
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
