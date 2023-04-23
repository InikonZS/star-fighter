import RenderableShaderList from './renderable-shader-list.new';
import RenderableModelList from './renderable-model-list.new';
import RenderableItem from './renderable-item.new';
import { createTextureFromImg, setBuffer } from '../gl-utils';

class ModelList extends RenderableModelList{
  constructor(gl, shaderVariables, record){
    super(gl, shaderVariables, record.source); 
    createTextureFromImg(gl, record.texImage, (tex)=>{this.texture = tex});

    this.onRender = (gl, props)=>{
      setBuffer(gl, this.mesh.positionBuffer, this.shaderVariables.positionAttr, 3);
      setBuffer(gl, this.mesh.texBuffer, this.shaderVariables.texAttr, 2); 
      gl.bindTexture(gl.TEXTURE_2D, this.texture);
    }

  /*  this.onDelete = ()=>{
      this.mesh.deleteBuffers();
      //deleteTexture
    }*/
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

  createModelList(record){
    return this.addChild(new ModelList(this.gl, this.shaderVariables, record));
  }
}

export const SkyboxShaderList = ShaderList;
export const SkyboxModeList = ModelList;