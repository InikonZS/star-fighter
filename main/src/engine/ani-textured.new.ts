import RenderableShaderList from './renderable-shader-list.new';
import RenderableModelList from './renderable-model-list.new';
import GameObject from './game-object.new';
import Animation from './animation.new';
import { createTextureFromImg, setBuffer } from '../gl-utils';
import { IShaderUnit } from './shaders/IShaderUnit';
import Mesh from '../mesh.object';

export class AnimatedTextureItem extends GameObject {
  meshPointer: Mesh;
  shaderVariables: {worldUniMat4: WebGLUniformLocation, posUniVec4:WebGLUniformLocation};
  count: number;
  animation: Animation;
  visible: boolean;

  constructor(shaderVariables: {worldUniMat4: WebGLUniformLocation, posUniVec4:WebGLUniformLocation}, meshPointer: Mesh, matrix: number[], xmax: number, ymax: number, timeStep: number){
    super();
    this.meshPointer = meshPointer;
    this.shaderVariables = shaderVariables;
    this.matrix = matrix || m4.identity();
    this.count = meshPointer.vertexList.length / 3;
    this.animation = new Animation(xmax, ymax, timeStep);
    this.visible = true;

    this.onRender = (gl, props)=>{
      if (this.visible){
        this.animation.render(gl, this.shaderVariables, props.deltaTime);
        gl.uniformMatrix4fv(this.shaderVariables.worldUniMat4, false, this.matrix); 
        //gl.uniform4f(shaderVariables.colorUniVec4, color.r, color.g, color.b, color.a); 
        gl.drawArrays(gl.TRIANGLES, 0, this.count);  
      }
    }
  }
}


export class AnimatedModelList extends RenderableModelList{
  constructor(gl: WebGLRenderingContext, shaderVariables: any, record: { source: string; texImage: HTMLImageElement; }){
    super(gl, shaderVariables, record.source); 
    //GLUtils.createTexture(gl, record.textureURL, (tex)=>{this.texture = tex});
    createTextureFromImg(gl, record.texImage, (tex)=>{this.texture = tex});
    this.onRender = (gl, props)=>{
      setBuffer(gl, this.mesh.positionBuffer, this.shaderVariables.positionAttr, 3);
      setBuffer(gl, this.mesh.texBuffer, this.shaderVariables.texAttr, 2); 
      gl.bindTexture(gl.TEXTURE_2D, this.texture);
    }

 /*   this.onDelete = ()=>{
      this.mesh.deleteBuffers();
      gl.deleteTexture(this.texture);
      //deleteTexture
    }*/
  }

  createStaticItem(matrix: Array<number>, xmax: number, ymax: number, timeStep: number){
    return this.addChild(new AnimatedTextureItem(this.shaderVariables, this.mesh, matrix, xmax, ymax, timeStep)) as AnimatedTextureItem;  
  }
}

export class AnimatedShaderList extends RenderableShaderList{
  constructor(gl: WebGLRenderingContext, shaderUnit: IShaderUnit){
    super(gl, shaderUnit);
    this.onRender = (gl, props)=>{
      shaderUnit.initShader(gl, this.shaderProgram, this.shaderVariables);
      gl.uniformMatrix4fv(this.shaderVariables.viewUniMat4, false, props.viewMatrix);
    }
  }

  createModelList(record: { source: string; texImage: HTMLImageElement; }){
    return this.addChild(new AnimatedModelList(this.gl, this.shaderVariables, record)) as AnimatedModelList;
  }
}

//export const AnimatedShaderList = ShaderList;
//export const AnimatedModelList = ModelList;