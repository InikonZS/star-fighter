const GameObject = require('./game-object.new.js');
const calc = require('../calc.utils.js');

class RenderableItem extends GameObject {
  constructor(shaderVariables, meshPointer, matrix, color){
    super();
    this.meshPointer = meshPointer;
    this.shaderVariables = shaderVariables;
    this.matrix = matrix;
    this.count = meshPointer.vertexList.length / 3;
    this.color = color;

    this.hitTransformed = this.meshPointer.getTransformedVertexList(this.matrix);
    this.hitPosition = calc.getPosFromMatrix(this.matrix);
    this.hitDist = this.meshPointer.maxDistance*5;
    

    this.onRender = (gl)=>{
    
    //this.hitTransformed.deleteBuffers();
      gl.uniformMatrix4fv(this.shaderVariables.worldUniMat4, false, this.matrix); 
      let color = this.color;
      gl.uniform4f(shaderVariables.colorUniVec4, color.r, color.g, color.b, color.a); 
      gl.drawArrays(gl.TRIANGLES, 0, this.count);  
    }

   // this.onProcess = (deltaTime)=>{
      
   // }
  }
}


module.exports = RenderableItem;