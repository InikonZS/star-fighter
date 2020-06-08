const GameObject = require('./game-object.new.js');

const GLUtils = require('../gl-utils.js');


class RenderableItem extends GameObject {
  constructor(shaderVariables, meshPointer, matrix, color){
    super();
    this.shaderVariables = shaderVariables;
    this.matrix = matrix;
    this.count = meshPointer.vertexList.length / 3;
    this.color = color;

    this.onRender = (gl)=>{
      gl.uniformMatrix4fv(this.shaderVariables.worldUniMat4, false, this.matrix); 
      let color = this.color;
      gl.uniform4f(shaderVariables.colorUniVec4, color.r, color.g, color.b, color.a); 
      gl.drawArrays(gl.TRIANGLES, 0, this.count);  
    }
  }
}

module.exports = RenderableItem;