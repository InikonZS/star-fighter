import RenderableShaderList from './renderable-shader-list.new';
import RenderableModelList from './renderable-model-list.new';
import RenderableItem from './renderable-item.new';
import { createTextureFromImg, setBuffer } from '../gl-utils';
import { IShaderUnit, IShaderVars } from './shaders/IShaderUnit';
import { IResourceRecord } from '../res-loader';

export class SkyboxModelList extends RenderableModelList{
  constructor(gl: WebGLRenderingContext, shaderVariables: IShaderVars, record: IResourceRecord){
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

  createStaticItem(matrix: number[], color?: { r: number; g: number; b: number; a?:number}){
    return this.addChild(new RenderableItem(this.shaderVariables, this.mesh, matrix, color));  
  }
}

export class SkyboxShaderList extends RenderableShaderList{
  constructor(gl: WebGLRenderingContext, shaderUnit: IShaderUnit){
    super(gl, shaderUnit);
    this.onRender = (gl, props)=>{
      shaderUnit.initShader(gl, this.shaderProgram, this.shaderVariables);
      gl.uniformMatrix4fv(this.shaderVariables.viewUniMat4, false, props.viewMatrix);
    }
  }

  createModelList(record: IResourceRecord){
    return this.addChild(new SkyboxModelList(this.gl, this.shaderVariables, record)) as SkyboxModelList;
  }
}

//export const SkyboxShaderList = ShaderList;
//export const SkyboxModeList = ModelList;