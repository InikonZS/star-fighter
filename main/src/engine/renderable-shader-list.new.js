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
    
  /* this.onDelete = ()=>{
      gl.deleteProgram(this.shaderProgram);
      console.log('delshader');
    }*/
  }
}

module.exports = RenderableShaderList;