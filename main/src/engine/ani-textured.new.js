const RenderableShaderList = require('./renderable-shader-list.new.js');
const RenderableModelList = require('./renderable-model-list.new.js');
const GameObject = require('./game-object.new.js');
const Animation = require('./animation.new.js');
const GLUtils = require('../gl-utils.js');

class AnimatedTextureItem extends GameObject {
  constructor(shaderVariables, meshPointer, matrix, xmax, ymax, timeStep){
    super();
    this.meshPointer = meshPointer;
    this.shaderVariables = shaderVariables;
    this.matrix = matrix || m4.identity();
    this.count = meshPointer.vertexList.length / 3;
    this.animation = new Animation(xmax, ymax, timeStep);

    this.onRender = (gl, props)=>{
      this.animation.render(gl, this.shaderVariables, props.deltaTime);
      gl.uniformMatrix4fv(this.shaderVariables.worldUniMat4, false, this.matrix); 
      //gl.uniform4f(shaderVariables.colorUniVec4, color.r, color.g, color.b, color.a); 
      gl.drawArrays(gl.TRIANGLES, 0, this.count);  
    }
  }
}


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

  createStaticItem(matrix, xmax, ymax, timeStep){
    return this.addChild(new AnimatedTextureItem(this.shaderVariables, this.mesh, matrix, xmax, ymax, timeStep));  
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

module.exports = {AnimatedShaderList:ShaderList, AnimatedModelList:ModelList}