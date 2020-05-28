const Basic = require('./basic.object.js');
const boxModel = require('./box.model.js');
const rocketModel = require('./rocket.model.js');
const Vector3d = require('./vector3d.dev.js');
let Bullet = require('./bullet.object.js')

const calc = require('./calc.utils.js');

class Scene{
  constructor(glCanvas){
    this.glCanvas = glCanvas;
    this.gl = glCanvas.glContext;
    let gl = this.gl;

    this.bs = new Basic(gl,rocketModel , m4.identity(), {r:200, g:20, b:60});

    this.bd = new Basic(gl,boxModel , m4.identity(), {r:200, g:20, b:60});
    this.bs.matrix = m4.translate(this.bs.matrix, 10,3,20);
    //this.bd.matrix = m4.scale(this.bd.matrix, 10,3,20);

    this.particles = [];
    for (let i=0; i< 300; i++){
      let mtx = m4.identity();
      mtx = m4.translate(mtx, rand(300)-150, rand(300)-150, rand(300)-150);
      let pt = new Basic(gl, boxModel , mtx, {r:rand(255), g:rand(155)+100, b:60});
      this.particles.push(pt);
    }

    this.bullets = [];
    this.shotTime = 0;
  }

  render(shaderVariables, deltaTime){
    let glCanvas = this.glCanvas;
    this.shotTime-=deltaTime;
    if (this.glCanvas.keyboardState.shot){
      //console.log(this.shotTime);
      if (this.shotTime<=0 || this.shotTime>=1000){
        let bul = new Bullet(glCanvas.glContext, glCanvas.camera.getPosVector().subVector(glCanvas.camera.getCamNormal().mul(2.10)), glCanvas.camera.getCamNormal().mul(-3.10));
        glCanvas.scene.bullets.push(bul);
        this.shotTime = 0.15;
      }
    }

    this.bs.matrix = m4.xRotate(this.bs.matrix, 0.5*deltaTime);
    this.bs.render(shaderVariables);

    this.bd.matrix=this.bs.matrix;
    //this.bd.matrix = m4.xRotate(this.bd.matrix, 0.5*deltaTime);
    this.bd.render(shaderVariables);
    
    this.particles.forEach(it=>{
      it.render(shaderVariables);
    });

    let bsl = calc.transformVertexList(this.bd.vertexList, this.bd.matrix);
    let reqFilter = false;
    this.bullets.forEach(it=>{
      it.render(shaderVariables, deltaTime);
      if (it.time<=0 || it.time>=10000){
        it = undefined;
        reqFilter = true;
      }
      if (it && it.react(bsl)){
        this.bs.color={r:rand(255), g:rand(155)+100, b:60};
        it = undefined;
        reqFilter = true;
      };
    });
    if (reqFilter){
      this.bullets = this.bullets.filter(it=>!it);
      reqFilter = false;
    }
  }
}

function rand(lim){
  return Math.trunc(Math.random()*lim);
}

module.exports = Scene;