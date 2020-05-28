//const AABB = require('./aabb.dev.js');
const Basic = require('./basic.object.js');
const boxModel = require('./box.model.js');
const rocketModel = require('./rocket.model.js');
const Vector3d = require('./vector3d.dev.js');

class Scene{
  constructor(gl){
    this.gl = gl;
    this.bs = new Basic(gl,rocketModel , m4.identity(), {r:200, g:20, b:60});
  }

  render(shaderVariables, deltaTime){
    this.bs.matrix = m4.xRotate(this.bs.matrix, 0.5*deltaTime);
    this.bs.render(shaderVariables);
  }
}

module.exports = Scene;