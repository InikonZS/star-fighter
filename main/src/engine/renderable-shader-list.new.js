const GameObject = require('./game-object.new.js');
const GLUtils = require('../gl-utils.js');

class RenderableShaderList extends GameObject {
  constructor(gl, shaderUnit){
    super();
    this.gl = gl;
    let shaderProgram = GLUtils.createShaderFromSource(gl, shaderUnit.vertexShaderSource, shaderUnit.fragmentShaderSource);
    let shaderVariables = shaderUnit.getShaderVariables(gl, shaderProgram);
    this.shaderProgram = shaderProgram;
    this.shaderVariables = shaderVariables;
  
  }
}

/*
 this.onRender = (gl, viewMatrix)=>{
      this.shaderUnit.initShader(gl, shaderProgramm, shaderVariables.positionAttr, shaderVariables.normalAttr);
      gl.uniformMatrix4fv(shaderVariables.viewUniMat4, false, viewMatrix);
    }
    */

module.exports = RenderableShaderList;