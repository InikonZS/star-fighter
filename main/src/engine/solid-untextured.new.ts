import RenderableShaderList from './renderable-shader-list.new';
import RenderableModelList from './renderable-model-list.new';
import RenderableItem from './renderable-item.new';
import { setBuffer } from '../gl-utils';
import Vector3d from '../vector3d.dev';
import { IShaderUnit, IShaderVars } from './shaders/IShaderUnit';
import GameObject from './game-object.new';

export class SolidUntexturedModelList extends RenderableModelList{
  shaderVariables: IShaderVars;
  childList: RenderableItem[];

  constructor(gl: WebGLRenderingContext, shaderVariables: IShaderVars, modelSource: string, preScaler: number){
    super(gl, shaderVariables, modelSource, preScaler); 
    this.onRender = (gl, props)=>{
      setBuffer(gl, this.mesh.positionBuffer, this.shaderVariables.positionAttr, 3);
      setBuffer(gl, this.mesh.normBuffer, this.shaderVariables.normalAttr, 3); 
    }
  }

  createStaticItem(matrix: Array<number>, color?: { r: number, g: number, b: number, a?: number}, maxVisibleDist?: number){
    return this.addChild(new RenderableItem(this.shaderVariables, this.mesh, matrix, color, maxVisibleDist)) as RenderableItem;  
  }

  createRotatingItem(position: Vector3d, sx: number, sy: number, sz: number, color: { r: number; g: number; b: number; a?: number; }){
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
  
  createMovingItem(posVector: Vector3d, speedVector: Vector3d, color: { r: number; g: number; b: number; a?: number; }){
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

export class SolidUntexturedShaderList extends RenderableShaderList{
  gl: WebGLRenderingContext;
  shaderVariables: {
    viewUniMat4: any
  }
  constructor(gl: WebGLRenderingContext, shaderUnit: IShaderUnit){
    super(gl, shaderUnit);
    this.onRender = (gl, props)=>{
      shaderUnit.initShader(gl, this.shaderProgram, this.shaderVariables);
      gl.uniformMatrix4fv(this.shaderVariables.viewUniMat4, false, props.viewMatrix);
    }
  }
  

  createModelList(modelSource: string, preScaler?: number): SolidUntexturedModelList{
    return this.addChild(new SolidUntexturedModelList(this.gl, this.shaderVariables, modelSource, preScaler)) as SolidUntexturedModelList;
  }
}
