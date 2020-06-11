

class Sprite{
  constructor(gl, meshPointer, texturePointer, animationPointer, matrix){
    this.gl = gl;
    this.animation = animationPointer;
    this.mesh = meshPointer;
    this.texture = texturePointer;
    this.matrix = matrix;
    this.count = meshPointer.vertexList.length/3;
    this.isExist = true;
  }

  render(shaderVariables, deltaTime){
    let gl = this.gl;
    this.animation.render(shaderVariables, deltaTime);
    gl.uniformMatrix4fv(shaderVariables.worldUniMat4, false, this.matrix); 
    gl.drawArrays(gl.TRIANGLES, 0, this.count);  
  }
}

module.exports = Sprite;