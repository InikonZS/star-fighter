const Control = require('./control.component.js');
const Camera = require('./camera.object.js');
const Scene = require('./scene.object.js');
const GLUtils = require('./gl-utils.js');
const Shaders = require('./shaders.const.js');
const calc = require('./calc.utils.js');

const AABB = require('./aabb.dev.js');
const Vector3d = require('./vector3d.dev.js');

class GLCanvas extends Control{
  constructor(parentNode, width, height){
    super (parentNode, 'canvas', '', '', ()=>{
      this.node.requestPointerLock();
    });
    this.node.width = width;
    this.node.height = height;
    this.glContext = this.node.getContext('webgl');
    this.isStarted = false;
    this.keyboardState;
    this.camera = new Camera();
    //this.scene = new Scene();
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
      
      glRender(this);

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
  glCanvas.node.addEventListener('mousemove', (e)=>{
    mouseMoveHandler(glCanvas, e.movementX, e.movementY);
  });

  document.addEventListener('keydown', (e)=>{
    if (e.code == 'KeyW'){
      glCanvas.keyboardState.forward = true;
      keyboardHandler(glCanvas, 'forward', true);
    } 
    if (e.code == 'Space'){
      glCanvas.keyboardState.space = true;
      keyboardHandler(glCanvas, 'space', true);
    } 
  });

  document.addEventListener('keyup', (e)=>{
    if (e.code == 'KeyW'){
      glCanvas.keyboardState.forward = false;
      keyboardHandler(glCanvas, 'forward', false);
    }  
    if (e.code == 'Space'){
      glCanvas.keyboardState.space = false;
      keyboardHandler(glCanvas, 'space', false);
    }
  })
}

function glInitialize(glCanvas){
  let shaderProgramm = GLUtils.createShaderFromSource(glCanvas.glContext, Shaders.vertexShaderSource, Shaders.fragmentShaderSource);
  let shaderVariables = Shaders.getShaderVariables(glCanvas.glContext, shaderProgramm);
  glCanvas.shaderProgramm = shaderProgramm;
  glCanvas.shaderVariables = shaderVariables;
  Shaders.initShader(glCanvas.glContext, shaderProgramm, shaderVariables.positionAttr, shaderVariables.normalAttr);
  
  glCanvas.camera.init();

  ///dev
  glCanvas.model = new AABB(glCanvas.glContext, new Vector3d(0,0,-20),  new Vector3d(1,1,0),
      {r:Math.random()*100+100, g:Math.random()*100+100, b:Math.random()*100+100, a:255}
    );
}

function glRender(glCanvas){
  var aspect = glCanvas.glContext.canvas.clientWidth / glCanvas.glContext.canvas.clientHeight;
  var camera = glCanvas.camera;
  var viewMatrix = calc.makeShooterCameraMatrix(aspect, camera.camRX, camera.camRY, camera.posX, camera.posY, camera.posZ);
  glCanvas.glContext.uniformMatrix4fv(glCanvas.shaderVariables.viewUniMat4, false, viewMatrix);

  let worldMatrix = m4.identity();
  glCanvas.glContext.uniformMatrix4fv(glCanvas.shaderVariables.worldUniMat4, false, worldMatrix);

  ///dev
  glCanvas.model.render(glCanvas.glContext, glCanvas.shaderVariables.positionAttr, glCanvas.shaderVariables.colorUniVec4);
}

function mouseMoveHandler(glCanvas, dx, dy){
  glCanvas.camera.rotateCam(dx, dy);
}

function keyboardHandler(glCanvas, keyName, state){

}

module.exports = GLCanvas;