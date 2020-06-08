const GameObject = require('./game-object.new.js');
const RenderableItem = require('./renderable-item.new.js');
const Mesh = require('./mesh.object.js');
const GLUtils = require('./gl-utils.js');

class RenderableModelList extends GameObject {
  constructor(gl, shaderVariables, modelSource, color){
    super();
    this.shaderVariables = shaderVariables;
    this.mesh = new Mesh(gl);
    this.mesh.loadFromSource(modelSource);
    this.color = color;

    this.onRender = (gl)=>{
      GLUtils.setBuffer(gl, this.mesh.positionBuffer, shaderVariables.positionAttr,3);
      GLUtils.setBuffer(gl, this.mesh.normBuffer, shaderVariables.normalAttr,3);
      let color = this.color;
      gl.uniform4f(shaderVariables.colorUniVec4, color.r/255, color.g/255, color.b/255, color.a/255);  
    }
  }
}

module.exports = RenderableModelList;