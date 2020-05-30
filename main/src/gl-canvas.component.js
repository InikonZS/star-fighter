const Control = require('./control.component.js');
const Camera = require('./camera.object.js');
const Scene = require('./scene.object.js');
const GLUtils = require('./gl-utils.js');
const Shaders = require('./shaders.const.js');
const SkyShader = require('./skybox.shader.js');
const Skybox = require('./skybox.object.js');
const Controller = require('./controller.object.js');

const calc = require('./calc.utils.js');

class GLCanvas extends Control{
  constructor(parentNode, width, height){
    super (parentNode, 'canvas', '', '', ()=>{
      this.node.requestPointerLock();
    });
    this.node.width = width;
    this.node.height = height;
    this.glContext = this.node.getContext('webgl');
    this.isStarted = false;
    this.keyboardState = {};
    this.camera = new Camera();
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
  
  glCanvas.camera.init();
  glCanvas.scene = new Scene(glCanvas);

  glCanvas.skybox = new Skybox(glCanvas);

}

function glRender(glCanvas, deltaTime){
  var aspect = glCanvas.glContext.canvas.clientWidth / glCanvas.glContext.canvas.clientHeight;
  glCanvas.camera.process(glCanvas, deltaTime);
  var camera = glCanvas.camera;
  var viewMatrix = calc.makeCameraMatrix(aspect, camera.camRX, camera.camRY, camera.camRZ, camera.posX, camera.posY, camera.posZ);
  
  
  let skyProgramm = glCanvas.skyProgramm;
  let skyVariables = glCanvas.skyVariables;
  SkyShader.initShader(glCanvas.glContext, skyProgramm, skyVariables.positionAttr, skyVariables.normalAttr, skyVariables.texAttr);
  glCanvas.glContext.uniformMatrix4fv(glCanvas.skyVariables.viewUniMat4, false, viewMatrix);
  glCanvas.skybox.render(glCanvas.skyVariables, deltaTime);

  let shaderProgramm = glCanvas.shaderProgramm;
  let shaderVariables = glCanvas.shaderVariables;
  Shaders.initShader(glCanvas.glContext, shaderProgramm, shaderVariables.positionAttr, shaderVariables.normalAttr);
  glCanvas.glContext.uniformMatrix4fv(glCanvas.shaderVariables.viewUniMat4, false, viewMatrix);
  //glCanvas.skybox.render(glCanvas.shaderVariables, deltaTime);*/
  glCanvas.scene.render(glCanvas.shaderVariables, deltaTime);
}

module.exports = GLCanvas;