const Control = require('./control.component.js');
const Camera = require('./camera.object.js');
const Scene = require('./scene.object.js');
const GLUtils = require('./gl-utils.js');
const Shaders = require('./shaders.const.js');
const SkyShader = require('./skybox.shader.js');
const AniShader = require('./ani-texture.shader.js');
const Skybox = require('./skybox.object.js');
const Effects = require('./effects.object.js');
const Controller = require('./controller.object.js');
const GameMenu = require('./game-menu.component.js');
const GamePanel = require('./game-panel.component.js');

const World = require('./engine/world.new.js');
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
    //this.camera = new Camera(this);
    //this.weapon=1;

    this.averageRenderTime =0;
    this.info = new Control(parentNode,'div');
    this.fullScreenButton = new Control(parentNode, 'div', '', 'fullScreen', ()=>{
      parentNode.requestFullscreen();
      //let rect = document.documentElement.getBoundingClientRect();
       
      //this.node.requestPointerLock();
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
 /* let shaderProgramm = GLUtils.createShaderFromSource(glCanvas.glContext, Shaders.vertexShaderSource, Shaders.fragmentShaderSource);
  let shaderVariables = Shaders.getShaderVariables(glCanvas.glContext, shaderProgramm);
  glCanvas.shaderProgramm = shaderProgramm;
  glCanvas.shaderVariables = shaderVariables;

  let skyProgramm = GLUtils.createShaderFromSource(glCanvas.glContext, SkyShader.vertexShaderSource, SkyShader.fragmentShaderSource);
  let skyVariables = SkyShader.getShaderVariables(glCanvas.glContext, skyProgramm);
  glCanvas.skyProgramm = skyProgramm;
  glCanvas.skyVariables = skyVariables;

  glCanvas.aniProgramm = GLUtils.createShaderFromSource(glCanvas.glContext, AniShader.vertexShaderSource, AniShader.fragmentShaderSource);
  glCanvas.aniVariables = AniShader.getShaderVariables(glCanvas.glContext, glCanvas.aniProgramm);
  */
  //glCanvas.camera.init();

  glCanvas.game = new Game(glCanvas.glContext, glCanvas);
  //glCanvas.game.camera = glCanvas.camera;

  /*
  glCanvas.scene = new Scene(glCanvas);
  glCanvas.skybox = new Skybox(glCanvas);
  glCanvas.effects = new Effects(glCanvas);
  */
}

function glRender(glCanvas, deltaTime){
  if (deltaTime<1000 && deltaTime>0){
    glCanvas.averageRenderTime =  (glCanvas.averageRenderTime * 31 + deltaTime)/32;
  }
  glCanvas.info.node.textContent = 'FPS: '+ Math.round(1/glCanvas.averageRenderTime);

  var aspect = glCanvas.glContext.canvas.clientWidth / glCanvas.glContext.canvas.clientHeight;
  //glCanvas.camera.process(glCanvas, deltaTime);
  //var camera = glCanvas.camera;
  var camera = glCanvas.game.player.camera;
  //let matrix = m4.perspective(1, aspect, 0.1, 2000);
  //matrix = m4.multiply(matrix, glCanvas.scene.bs.matrix)
  var viewMatrix = calc.makeCameraMatrix(aspect, camera.camRX, camera.camRY, camera.camRZ, camera.posX, camera.posY, camera.posZ);
  glCanvas.viewMatrix = viewMatrix;
  
  /*
  let skyProgramm = glCanvas.skyProgramm;
  let skyVariables = glCanvas.skyVariables;
  SkyShader.initShader(glCanvas.glContext, skyProgramm, skyVariables.positionAttr, skyVariables.normalAttr, skyVariables.texAttr);
  glCanvas.glContext.uniformMatrix4fv(glCanvas.skyVariables.viewUniMat4, false, viewMatrix);
  glCanvas.skybox.render(glCanvas.skyVariables, deltaTime);

  let shaderProgramm = glCanvas.shaderProgramm;
  let shaderVariables = glCanvas.shaderVariables;
  Shaders.initShader(glCanvas.glContext, shaderProgramm, shaderVariables.positionAttr, shaderVariables.normalAttr);
  glCanvas.glContext.uniformMatrix4fv(glCanvas.shaderVariables.viewUniMat4, false, viewMatrix);
  glCanvas.scene.render(glCanvas.shaderVariables, deltaTime);

  let aniProgramm = glCanvas.aniProgramm;
  let aniVariables = glCanvas.aniVariables;
  AniShader.initShader(glCanvas.glContext, aniProgramm, aniVariables.positionAttr, aniVariables.texAttr);
  glCanvas.glContext.uniformMatrix4fv(glCanvas.aniVariables.viewUniMat4, false, viewMatrix);
  glCanvas.effects.render(glCanvas.aniVariables, deltaTime);
//*/
  glCanvas.game.render(viewMatrix, deltaTime);

/*  renderWithShader(glCanvas, deltaTime, glCanvas.skyProgramm, glCanvas.skyVariables, glCanvas.skybox);
  renderWithShader(glCanvas, deltaTime, glCanvas.shaderProgramm, glCanvas.shaderVariables, glCanvas.scene);
  renderWithShader(glCanvas, deltaTime, glCanvas.aniProgramm, glCanvas.aniVariables, glCanvas.effects);
*/
}

/*function renderWithShader(glCanvas, deltaTime, shaderProgramm, shaderVariables, scene){
  let gl = glCanvas.glContext;
  Shaders.initShader(gl, shaderProgramm, shaderVariables.positionAttr, shaderVariables.normalAttr);
  gl.uniformMatrix4fv(shaderVariables.viewUniMat4, false, glCanvas.viewMatrix);
  scene.render(shaderVariables, deltaTime);  
}*/

module.exports = GLCanvas;