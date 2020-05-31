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

const calc = require('./calc.utils.js');

class GLCanvas extends Control{
  constructor(parentNode, width, height){
    super (parentNode, 'canvas', '', '', ()=>{
      this.node.requestPointerLock();
    });
    parentNode.style = 'position:relative';
    this.node.width = width;
    this.node.height = height;
    this.glContext = this.node.getContext('webgl');
    this.isStarted = false;
    this.keyboardState = {};
    this.camera = new Camera();
    this.weapon=1;

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
      } else {
        this.node.width = 640;
        this.node.height = 480; 
        this.overlayRefresh();
      }
    });
    this.overlay = new Control(parentNode, 'div', '', '', ()=>{
      this.node.requestPointerLock();
    });
    this.overlayRefresh();
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

  start(){
    this.isStarted = true;

    setController(this);

    glInitialize(this);

    var lastTime = Date.now();
    var drawScene = (currentTime)=>{
      currentTime*= 0.001;
      var deltaTime = currentTime - lastTime;
      lastTime = currentTime;
      
      glRender(this, deltaTime);

      if (this.isStarted){
        requestAnimationFrame(drawScene);
      }
    }
    requestAnimationFrame(drawScene);
  }

  stop(){
    this.isStarted = false;
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
  let shaderProgramm = GLUtils.createShaderFromSource(glCanvas.glContext, Shaders.vertexShaderSource, Shaders.fragmentShaderSource);
  let shaderVariables = Shaders.getShaderVariables(glCanvas.glContext, shaderProgramm);
  glCanvas.shaderProgramm = shaderProgramm;
  glCanvas.shaderVariables = shaderVariables;

  let skyProgramm = GLUtils.createShaderFromSource(glCanvas.glContext, SkyShader.vertexShaderSource, SkyShader.fragmentShaderSource);
  let skyVariables = SkyShader.getShaderVariables(glCanvas.glContext, skyProgramm);
  glCanvas.skyProgramm = skyProgramm;
  glCanvas.skyVariables = skyVariables;

  glCanvas.aniProgramm = GLUtils.createShaderFromSource(glCanvas.glContext, AniShader.vertexShaderSource, AniShader.fragmentShaderSource);
  glCanvas.aniVariables = AniShader.getShaderVariables(glCanvas.glContext, glCanvas.aniProgramm);
  
  glCanvas.camera.init();
  glCanvas.scene = new Scene(glCanvas);
  glCanvas.skybox = new Skybox(glCanvas);
  glCanvas.effects = new Effects(glCanvas);

}

function glRender(glCanvas, deltaTime){
  if (deltaTime<1000 && deltaTime>0){
    glCanvas.averageRenderTime =  (glCanvas.averageRenderTime * 31 + deltaTime)/32;
  }
  glCanvas.info.node.textContent = 'FPS: '+ Math.round(1/glCanvas.averageRenderTime);

  var aspect = glCanvas.glContext.canvas.clientWidth / glCanvas.glContext.canvas.clientHeight;
  glCanvas.camera.process(glCanvas, deltaTime);
  var camera = glCanvas.camera;
  var viewMatrix = calc.makeCameraMatrix(aspect, camera.camRX, camera.camRY, camera.camRZ, camera.posX, camera.posY, camera.posZ);
  glCanvas.viewMatrix = viewMatrix;
  
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