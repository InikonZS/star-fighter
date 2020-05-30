const Basic = require('./basic.object.js');
const Textured = require('./textured.object.js');

const boxModel = require('./point-sprite.model.js');
const Vector3d = require('./vector3d.dev.js');

const calc = require('./calc.utils.js');

class Effects{
  constructor(glCanvas){
    this.glCanvas = glCanvas;
    this.gl = glCanvas.glContext;
    let gl = this.gl;
    this.frame = 0;
    this.xmax = 5;
    this.ymax = 4;
    this.time = 0;

    this.list = [];

  }

  addEffect(p){
    let mtx = m4.identity();
    mtx = m4.scale(mtx, 50,50,50);
    mtx[12]=p.x;
    mtx[13]=p.y;
    mtx[14]=p.z;
    let model = new Textured(this.gl, boxModel, 'https://raw.githubusercontent.com/InikonZS/textures/master/kisspng-sprite-explosion-animated-film-2d-computer-graphic-5b320d937c5263.6802436815300069315092.png', mtx, {r:200, g:20, b:60});
    model.frame=0;
    this.list.push(model);
  }

  render(shaderVariables, deltaTime){
    let glCanvas = this.glCanvas;
    let cam = glCanvas.camera;
    //let mtx = m4.identity();
   // mtx = m4.translate(mtx -cam.posX, -cam.posY, -cam.posZ);
   // mtx = m4.scale(mtx, 1,1,1);
   // this.model.matrix = mtx;// 
    let reqFilter = false;

    this.time-=deltaTime;
    if (this.time<0||this.time>10000){
      this.list.forEach((it)=>{
        it.frame++;
        if (it.frame>=this.xmax*this.ymax){it.frame=0; it.isFinished=true; reqFilter = true;}
        it.time = 0.08;
      //this.time = 0.03;
      });
      //this.frame++;
      //if (this.frame>=this.xmax*this.ymax){this.frame=0; this.isFinished=true;}
      //this.time = 0.03;
    }
    if (reqFilter){
      this.list = this.list.filter(it=>!it.isFinished)
    }

    this.list.forEach((it)=>{
      this.gl.uniform4f(shaderVariables.posUniVec4, 1/5,1/4,it.frame%this.xmax,Math.trunc(it.frame/this.xmax));
      it.render(shaderVariables);    
    });
    //this.gl.uniform4f(shaderVariables.posUniVec4, 1/5,1/4,this.frame%this.xmax,Math.trunc(this.frame/this.xmax));
    //this.model.render(shaderVariables);
  }
}

function rand(lim){
  return Math.trunc(Math.random()*lim);
}

module.exports = Effects;