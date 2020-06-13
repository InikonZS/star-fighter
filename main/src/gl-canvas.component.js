const Control = require('./control-js/control.component.js');
const Controller = require('./controller.object.js');
const GameMenu = require('./game-menu.component.js');
const GamePanel = require('./game-panel.component.js');

const Game = require('./engine/game.new.js');

const calc = require('./calc.utils.js');

class GLCanvas extends Control{
  constructor(parentNode, width, height){
    super (parentNode, 'canvas', '', '', ()=>{
      //this.node.requestPointerLock();
    });
    parentNode.style = 'position:relative';
    this.node.width = width;
    this.node.height = height;
    this.glContext = this.node.getContext('webgl');
    this.isStarted = false;
    this.keyboardState = {};

    this.averageRenderTime =0;
    this.info = new Control(parentNode,'div');

    this.fullScreenButton = new Control(parentNode, 'div', '', 'fullScreen', ()=>{
      parentNode.requestFullscreen();
    });

    parentNode.addEventListener('fullscreenchange', (e)=>{
      if (document.fullscreen){
        this.node.width = screen.width;
        this.node.height = screen.height;   
        this.overlayRefresh();
        this.menuRefresh();
      } else {
        this.node.width = 640;
        this.node.height = 480; 
        this.overlayRefresh();
        this.menuRefresh();
      }
    });

    this.overlay = new Control(parentNode, 'div', '', '', ()=>{
      if (!this.menu.isActive){
        this.node.requestPointerLock();
      }
    });
    this.overlayRefresh();
    this.gamePanel = new GamePanel(this.overlay.node, this);

    this.menu = new GameMenu(parentNode, this);
    this.menu.activate();
    this.menuRefresh();
  }

  overlayRefresh(){
    this.overlay.node.style = `
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

  start(res){
    this.isPaused = false;
    this.isStarted = true;
    if (!res){
      this.gamePanel.view.clear();
      glInitialize(this);
    }
    //let lastTime = Date.now();
    let drawScene = (currentTime)=>{
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

function setController(glCanvas){
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
    Controller.keyDownHandler(glCanvas, e)
  });

  document.addEventListener('keyup', (e)=>{
    Controller.keyUpHandler(glCanvas, e);
  });
}

function glInitialize(glCanvas){
  glCanvas.game = new Game(glCanvas.glContext, glCanvas);
}

function glRender(glCanvas, deltaTime){
  if (deltaTime<1000 && deltaTime>0){
    glCanvas.averageRenderTime =  (glCanvas.averageRenderTime * 31 + deltaTime)/32;
  }
  glCanvas.info.node.textContent = 'FPS: '+ Math.round(1/glCanvas.averageRenderTime);

  var aspect = glCanvas.glContext.canvas.clientWidth / glCanvas.glContext.canvas.clientHeight;
  
  glCanvas.game.render(aspect, deltaTime);

}

module.exports = GLCanvas;