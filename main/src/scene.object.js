const Basic = require('./basic.object.js');
const boxModel = require('./box.model.js');
const rocketModel = require('./rocket.model.js');
const Vector3d = require('./vector3d.dev.js');

const calc = require('./calc.utils.js');

class Scene{
  constructor(gl){
    this.gl = gl;
    this.bs = new Basic(gl,rocketModel , m4.identity(), {r:200, g:20, b:60});

    this.bd = new Basic(gl,boxModel , m4.identity(), {r:200, g:20, b:60});
    //this.bd.matrix = m4.translate(this.bd.matrix, 10,3,20);
    //this.bd.matrix = m4.scale(this.bd.matrix, 10,3,20);

    this.particles = [];
    for (let i=0; i< 300; i++){
      let mtx = m4.identity();
      mtx = m4.translate(mtx, rand(300)-150, rand(300)-150, rand(300)-150);
      let pt = new Basic(gl, boxModel , mtx, {r:rand(255), g:rand(155)+100, b:60});
      this.particles.push(pt);
    }

    this.bullets = [];
  }

  render(shaderVariables, deltaTime){
    this.bs.matrix = m4.xRotate(this.bs.matrix, 0.5*deltaTime);
    this.bs.render(shaderVariables);

    this.bd.matrix=this.bs.matrix;
    //this.bd.matrix = m4.xRotate(this.bd.matrix, 0.5*deltaTime);
    this.bd.render(shaderVariables);
    
    this.particles.forEach(it=>{
      it.render(shaderVariables);
    });

    this.bullets.forEach(it=>{
      it.render(shaderVariables);
      //let trf = calc.transformVertexList(it.model.vertexList, it.model.matrix);
      let bsl = calc.transformVertexList(this.bd.vertexList, this.bd.matrix);
      if (it.react(bsl)){
        this.bs.color={r:rand(255), g:rand(155)+100, b:60};
      };
    });
  }
}

function rand(lim){
  return Math.trunc(Math.random()*lim);
}

module.exports = Scene;