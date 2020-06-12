const GameObject = require('./game-object.new.js');

class RenderableItem extends GameObject {
  constructor(shaderVariables, meshPointer, matrix, color){
    super();
    this.meshPointer = meshPointer;
    this.shaderVariables = shaderVariables;
    this.matrix = matrix || m4.identity();
    this.count = meshPointer.vertexList.length / 3;
    this.color = color || randomColor();
    this.visible = true;

    this.onRender = (gl)=>{
      if (this.visible){
        gl.uniformMatrix4fv(this.shaderVariables.worldUniMat4, false, this.matrix); 
        let color = this.color;
        gl.uniform4f(shaderVariables.colorUniVec4, color.r, color.g, color.b, color.a); 
        gl.drawArrays(gl.TRIANGLES, 0, this.count);  
      }
    }
  }
}

function randomColor(){
  return {r:Math.random(), g:Math.random(), b:Math.random()};
}


module.exports = RenderableItem;