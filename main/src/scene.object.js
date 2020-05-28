const Basic = require('./basic.object.js');
const boxModel = require('./box.model.js');
const rocketModel = require('./rocket.model.js');
const Vector3d = require('./vector3d.dev.js');

class Scene{
  constructor(gl){
    this.gl = gl;
    this.bs = new Basic(gl,rocketModel , m4.identity(), {r:200, g:20, b:60});

    this.particles = [];
    for (let i=0; i< 300; i++){
      let mtx = m4.identity();
      mtx = m4.translate(mtx, rand(300)-150, rand(300)-150, rand(300)-150);
      let pt = new Basic(gl, boxModel , mtx, {r:rand(255), g:rand(155)+100, b:60});
      this.particles.push(pt);
    }
  }

  render(shaderVariables, deltaTime){
    this.bs.matrix = m4.xRotate(this.bs.matrix, 0.5*deltaTime);
    this.bs.render(shaderVariables);

    this.particles.forEach(it=>{
      it.render(shaderVariables);
    });
  }
}

function rand(lim){
  return Math.trunc(Math.random()*lim);
}

module.exports = Scene;