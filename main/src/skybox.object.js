const Basic = require('./basic.object.js');
const Textured = require('./textured.object.js');

const boxModel = require('./skybox.model.js');
const Vector3d = require('./vector3d.dev.js');

const calc = require('./calc.utils.js');

class Skybox{
  constructor(glCanvas){
    this.glCanvas = glCanvas;
    this.gl = glCanvas.glContext;
    let gl = this.gl;

    let mtx = m4.identity();
    mtx = m4.scale(mtx, 100,100,100);
    this.model = new Textured(gl, boxModel, 'https://raw.githubusercontent.com/InikonZS/textures/master/skybox.png', mtx, {r:200, g:20, b:60});

  }

  render(shaderVariables, deltaTime){
    let glCanvas = this.glCanvas;
    let cam = glCanvas.camera;
    let mtx = m4.identity();
   // mtx = m4.translate(mtx -cam.posX, -cam.posY, -cam.posZ);
    mtx = m4.scale(mtx, 1000,1000,1000);
    mtx[12]=-cam.posX;
    mtx[13]=-cam.posY;
    mtx[14]=-cam.posZ;
    this.model.matrix = mtx;// 
    this.model.render(shaderVariables);
  }
}

function rand(lim){
  return Math.trunc(Math.random()*lim);
}

module.exports = Skybox;