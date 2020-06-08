const GameObject = require('./game-object.new.js');

class RenderableItem extends GameObject {
  constructor(shaderVariables, meshPointer, matrix){
    super();
    this.shaderVariables = shaderVariables;
    this.matrix = matrix;
    this.count = meshPointer.vertexList.length / 3;
    this.onRender = (gl)=>{
      gl.uniformMatrix4fv(this.shaderVariables.worldUniMat4, false, this.matrix); 
      gl.drawArrays(gl.TRIANGLES, 0, this.count);  
    }
  }
}

module.exports = RenderableItem;