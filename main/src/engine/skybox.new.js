const RenderableShaderList = require('./renderable-shader-list.new.js');
const RenderableModelList = require('./renderable-model-list.new.js');
const RenderableItem = require('./renderable-item.new.js');
const GLUtils = require('../gl-utils.js');

class ModelList extends RenderableModelList{
  constructor(gl, shaderVariables, modelSource, textureURL){
    super(gl, shaderVariables, modelSource); 
    GLUtils.createTexture(gl, textureURL, (tex)=>{this.texture = tex});

    this.onRender = (gl, props)=>{
      GLUtils.setBuffer(gl, this.mesh.positionBuffer, this.shaderVariables.positionAttr, 3);
      GLUtils.setBuffer(gl, this.mesh.texBuffer, this.shaderVariables.texAttr, 2); 
      gl.bindTexture(gl.TEXTURE_2D, this.texture);
    }

    this.onDelete = ()=>{
      this.mesh.deleteBuffers();
      //deleteTexture
    }
  }

  createStaticItem(matrix, color){
    return this.addChild(new RenderableItem(this.shaderVariables, this.mesh, matrix, color));  
  }
}

class ShaderList extends RenderableShaderList{
  constructor(gl, shaderUnit){
    super(gl, shaderUnit);
    this.onRender = (gl, props)=>{
      shaderUnit.initShader(gl, this.shaderProgram, this.shaderVariables);
      gl.uniformMatrix4fv(this.shaderVariables.viewUniMat4, false, props.viewMatrix);
    }
  }

  createModelList(modelSource, textureURL){
    return this.addChild(new ModelList(this.gl, this.shaderVariables, modelSource, textureURL));
  }
}

module.exports = {SkyboxShaderList:ShaderList, SkyboxModeList:ModelList}