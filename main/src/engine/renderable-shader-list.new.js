const GameObject = require('./game-object.new.js');
const RenderableModelList = require('./renderable-model-list.new.js');
const GLUtils = require('../gl-utils.js');

class RenderableShaderList extends GameObject {
  constructor(gl, Shaders, viewMatrix){
    super();
    this.gl = gl;
    let shaderProgramm = GLUtils.createShaderFromSource(gl, Shaders.vertexShaderSource, Shaders.fragmentShaderSource);
    let shaderVariables = Shaders.getShaderVariables(gl, shaderProgramm);
    this.shaderProgramm = shaderProgramm;
    this.shaderVariables = shaderVariables;
    this.Shaders = Shaders;
    this.viewMatrix = viewMatrix;

    this.onRender = (gl)=>{
      this.Shaders.initShader(gl, shaderProgramm, shaderVariables.positionAttr, shaderVariables.normalAttr);
      gl.uniformMatrix4fv(shaderVariables.viewUniMat4, false, this.viewMatrix);
    }
  }

  createChild(modelSource){
    let ob = new RenderableModelList(this.gl, this.shaderVariables, modelSource);
    this.addChild(ob);
    return ob;
  }
}

module.exports = RenderableShaderList;