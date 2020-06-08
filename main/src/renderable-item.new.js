const GameObject = require('./game-object.new.js');

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
      gl.uniform4f(shaderVariables.colorUniVec4, color.r/255, color.g/255, color.b/255, color.a/255); 
      gl.drawArrays(gl.TRIANGLES, 0, this.count);  
    }
  }
}

module.exports = RenderableItem;