const AABB = require('./aabb.dev.js');
const Vector3d = require('./vector3d.dev.js');

class Scene{
  constructor(gl){
    this.gl = gl;
    this.model = new AABB(gl, new Vector3d(0,0,-20),  new Vector3d(1,1,0),
      {r:Math.random()*100+100, g:Math.random()*100+100, b:Math.random()*100+100, a:255}
    );
  }

  render(shaderVariables, deltaTime){
    let worldMatrix = m4.identity();
    this.gl.uniformMatrix4fv(shaderVariables.worldUniMat4, false, worldMatrix);
    this.model.render(this.gl, shaderVariables.positionAttr, shaderVariables.colorUniVec4);
  }
}

module.exports = Scene;