import RenderableShaderList from './renderable-shader-list.new';
import RenderableModelList from './renderable-model-list.new';
import RenderableItem from './renderable-item.new';
import GameObject from './game-object.new';
import { createTextureFromImg, setBuffer } from '../gl-utils';
import Vector3d from '../vector3d.dev';
import Mesh from '../mesh.object';
import { IShaderUnit, IShaderVars } from './shaders/IShaderUnit';
import { IResourceRecord } from '../res-loader';

export class TexturedItem extends GameObject {
  meshPointer: Mesh;
  shaderVariables: IShaderVars;
  count: number;
  visible: boolean;
  scale?: number;
  pos?: Vector3d;
  //hitTransformed: Array<number>;
  
  constructor(shaderVariables: IShaderVars, meshPointer: Mesh, matrix: Array<number>){
    super();
    this.meshPointer = meshPointer;
    this.shaderVariables = shaderVariables;
    this.matrix = matrix || m4.identity();
    this.count = meshPointer.vertexList.length / 3;
    //this.animation = new Animation(xmax, ymax, timeStep);
    this.visible = true;
    this.onRender = (gl, props)=>{
      if (this.visible){
        //this.animation.render(gl, this.shaderVariables, props.deltaTime);
        gl.uniform4f(this.shaderVariables.posUniVec4, 
          1,
          1, 
          0, 
          0
        );
        gl.uniformMatrix4fv(this.shaderVariables.worldUniMat4, false, this.matrix); 
        //gl.uniform4f(shaderVariables.colorUniVec4, color.r, color.g, color.b, color.a); 
        gl.drawArrays(gl.TRIANGLES, 0, this.count);
      }  
    }
  }
}

export class SolidTexturedModelList extends RenderableModelList{
 // constructor(gl, shaderVariables, modelSource, textureURL, preScaler){
  constructor(gl: WebGLRenderingContext, shaderVariables: IShaderVars, record: IResourceRecord, preScaler: number){
    super(gl, shaderVariables, record.source, preScaler); 
    //GLUtils.createTexture(gl, textureURL, (tex)=>{this.texture = tex});
    createTextureFromImg(gl, record.texImage, (tex)=>{this.texture = tex});
    this.onRender = (gl, props)=>{
      setBuffer(gl, this.mesh.positionBuffer, this.shaderVariables.positionAttr, 3);
      setBuffer(gl, this.mesh.normBuffer, this.shaderVariables.normalAttr, 3); 
      setBuffer(gl, this.mesh.texBuffer, this.shaderVariables.texAttr, 2); 
      gl.bindTexture(gl.TEXTURE_2D, this.texture);
    }

    

  /*  this.onDelete = ()=>{
      this.mesh.deleteBuffers();
      gl.deleteTexture(this.texture);
      //deleteTexture
    }*/
  }

  createStaticItem(matrix: Array<number>, color?: { r: number; g: number; b: number; a?: number}){
    return this.addChild(new TexturedItem(this.shaderVariables, this.mesh, matrix)) as TexturedItem;  
  }

  createRotatingItem(position: Vector3d, sx: number, sy: number, sz: number, color: { r: number; g: number; b: number; a?: number}){
    let el = this.addChild(new RenderableItem(this.shaderVariables, this.mesh, m4.identity(), color)); 
    el.position = position;
    el.sx = 0;
    el.sy = 0;
    el.sz = 0;
    el.onProcess = (deltaTime)=>{
      let mt = m4.identity();
      mt = m4.translate(mt, el.position.x, el.position.y, el.position.z);
      el.sx +=sx*deltaTime;
      el.sy +=sy*deltaTime;
      el.sz +=sz*deltaTime;
      mt = m4.xRotate(mt, el.sx);
      mt = m4.yRotate(mt, el.sy);
      mt = m4.zRotate(mt, el.sz);
      el.matrix = mt;
    }
    return el;
  }
  
  createMovingItem(posVector: Vector3d, speedVector: Vector3d, color: { r: number; g: number; b: number; }){
    let el = this.addChild(new RenderableItem(this.shaderVariables, this.mesh, m4.identity(), color));
    el.position = posVector.mul(1);
    el.speedVector = speedVector.mul(1);
    el.onProcess = (deltaTime) => {
      let mt = m4.identity();
      el.position = el.position.addVector(el.speedVector.mul(1)); //add deltaTime
      mt = m4.translate(mt,  el.position.x, el.position.y, el.position.z);
      el.matrix = mt;
    }
    return el;
  }
}

export class SolidTexturedShaderList extends RenderableShaderList{
  constructor(gl: WebGLRenderingContext, shaderUnit: IShaderUnit){
    super(gl, shaderUnit);
    this.onRender = (gl, props)=>{
      shaderUnit.initShader(gl, this.shaderProgram, this.shaderVariables);
      gl.uniformMatrix4fv(this.shaderVariables.viewUniMat4, false, props.viewMatrix);
    }
  }

  createModelList(record: IResourceRecord, preScaler?: number){
    return this.addChild(new SolidTexturedModelList(this.gl, this.shaderVariables, record, preScaler)) as SolidTexturedModelList;
  }
}

//export const SolidTexturedShaderList = SolidUntexturedShaderList;
//export const SolidTexturedModelList = SolidUntexturedModelList;