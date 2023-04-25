import Control from './control-js/control.component';
import Controller from './controller.object';
import GameMenu from './game-menu.component';
import GamePanel from './game-panel.component';

import Game from './engine/game.new';
import Timer from './engine/timer.new';

import calc from './calc.utils';

export default class GLCanvas extends Control<HTMLCanvasElement>{
  stWidth: number;
  stHeight: number;
  glContext: any;
  isStarted: boolean;
  useControls: boolean;
  keyboardState: Record<string, boolean>;
  joyShow: boolean;
  infoTimer: Timer;
  info: any;
  averageRenderTime: number;
  fullScreenButton: Control;
  joyButton: Control;
  gamePanel: GamePanel;
  sndPlayer: Control<HTMLAudioElement>;
  sndButton: Control;
  sndAllow: boolean;
  overlay: Control;
  menu: GameMenu;
  isPaused: boolean;
  lastTime: any;
  game: Game;

  constructor(parentNode: HTMLElement, width: number, height: number){
    super (parentNode, 'canvas', 'canvas_style', '', ()=>{
      //this.node.requestPointerLock();
    });
    parentNode.style.cssText = 'position:relative';
    this.stWidth = width;
    this.stHeight = height;

    this.node.width = width;
    this.node.height = height;
    this.glContext = this.node.getContext('webgl');
    this.isStarted = false;
    this.useControls = true;
    this.keyboardState = {};
    this.joyShow = false;
    this.infoTimer = new Timer(0.1, ()=>{
      this.info.node.textContent = 'FPS: '+ Math.round(1/this.averageRenderTime);
    });

    this.averageRenderTime =0;
    this.info = new Control(parentNode,'div');
    
    let gameButtons = new Control(parentNode, 'div', 'game__buttons');
    this.fullScreenButton = new Control(gameButtons.node, 'button', 'fullscreen__button button_bordered', 'fullScreen', ()=>{
        parentNode.requestFullscreen();
    });

    this.joyButton = new Control(gameButtons.node, 'button', 'fullscreen__button button_colored', 'joystick', ()=>{
      this.joyShow = !this.joyShow;
      if (!this.joyShow) {this.gamePanel.joy.hide();}
      else {this.gamePanel.joy.show();}
    });

    this.sndPlayer = new Control(gameButtons.node, 'audio');
    this.sndPlayer.node.src = window.sndBase.getByName('backSound').locURL;
    this.sndPlayer.node.volume = 0.3;
    this.sndPlayer.node.addEventListener('ended', ()=>{
      this.sndPlayer.node.play();
    })
    this.sndButton = new Control(gameButtons.node, 'button', 'fullscreen__button button_colored', 'snd', ()=>{
      this.sndAllow = !this.sndAllow;
      if (this.sndAllow){
        this.sndPlayer.node.play();
      } else {
        this.sndPlayer.node.pause();
      }
    });

    parentNode.addEventListener('fullscreenchange', (e)=>{
      if (document.fullscreen){
        this.node.width = screen.width;
        this.node.height = screen.height;   
        this.overlayRefresh();
        this.menuRefresh();
      } else {
        this.node.width = this.stWidth;
        this.node.height = this.stHeight; 
        this.overlayRefresh();
        this.menuRefresh();
      }
    });

    this.overlay = new Control(parentNode, 'div', '', '', ()=>{
      if (!this.menu.isActive){
        if (!this.joyShow){
          this.node.requestPointerLock();
        }
      }
    });
    this.overlayRefresh();
    this.gamePanel = new GamePanel(this.overlay.node, this);

    this.menu = new GameMenu(parentNode, this);
    this.menu.activate();
    this.menuRefresh();
  }

  overlayRefresh(){
    this.overlay.node.style.cssText = `
      position:absolute;
      width:${this.node.clientWidth}px;
      height:${this.node.clientHeight}px;
      top:0px;
      left:0px;
    `;
  }

  menuRefresh(){
    this.menu.refresh();
  }

  start(res?: boolean){
    this.isPaused = false;
    this.isStarted = true;
    if (!res){
      this.gamePanel.view.clear();
      glInitialize(this);
    }
    //let lastTime = Date.now();
    let drawScene = (currentTime: number)=>{
      currentTime*= 0.001;
      if (!this.lastTime){this.lastTime=currentTime};
      var deltaTime = currentTime - this.lastTime;
      this.lastTime = currentTime;
      
      glRender(this, deltaTime);

      if (this.isStarted){
        requestAnimationFrame(drawScene);
      }
    }
    requestAnimationFrame(drawScene);
  }

  stop(){
    this.isStarted = false;
    this.isPaused = false;
    this.lastTime = undefined;
  }

  pause(){
    this.isStarted = false;
    this.isPaused = true;
    this.lastTime = undefined;
  }

  resume(){
    this.lastTime=undefined;
    this.start(true);
  }

  setController(){
    setController(this);
  }
}

function setController(glCanvas: GLCanvas){
  glCanvas.node.addEventListener('mouseup', (e)=>{
    Controller.mouseUpHandler(glCanvas, e);
  });

  glCanvas.node.addEventListener('mousedown', (e)=>{
    Controller.mouseDownHandler(glCanvas, e);
  });

  glCanvas.node.addEventListener('mousemove', (e)=>{
    Controller.mouseMoveHandler(glCanvas, e.movementX, e.movementY);
  });

  document.addEventListener('keydown', (e)=>{
    e.preventDefault();
    Controller.keyDownHandler(glCanvas, e)
  });

  document.addEventListener('keyup', (e)=>{
    e.preventDefault();
    Controller.keyUpHandler(glCanvas, e);
  });
}

function glInitialize(glCanvas: GLCanvas){
  if (glCanvas.game){
   // glCanvas.game.clear();
  }
  glCanvas.game = new Game(glCanvas.glContext, glCanvas);
}

function glRender(glCanvas: GLCanvas, deltaTime: number){
  if (deltaTime<1000 && deltaTime>0){
    glCanvas.averageRenderTime =  (glCanvas.averageRenderTime * 31 + deltaTime)/32;
  }
  glCanvas.infoTimer.process(deltaTime);
  //glCanvas.info.node.textContent = 'FPS: '+ Math.round(1/glCanvas.averageRenderTime);

  var aspect = glCanvas.glContext.canvas.clientWidth / glCanvas.glContext.canvas.clientHeight;
  
  glCanvas.game.render(aspect, deltaTime);

}
