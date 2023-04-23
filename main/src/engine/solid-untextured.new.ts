import RenderableShaderList from './renderable-shader-list.new';
import RenderableModelList from './renderable-model-list.new';
import RenderableItem from './renderable-item.new';
import { setBuffer } from '../gl-utils';
import Vector3d from '../vector3d.dev';

export class SolidUntexturedModelList extends RenderableModelList{
  shaderVariables: any;
  
  constructor(gl: WebGLRenderingContext, shaderVariables: any, modelSource: string, preScaler: number){
    super(gl, shaderVariables, modelSource, preScaler); 
    this.onRender = (gl, props)=>{
      setBuffer(gl, this.mesh.positionBuffer, this.shaderVariables.positionAttr, 3);
      setBuffer(gl, this.mesh.normBuffer, this.shaderVariables.normalAttr, 3); 
    }
  }

  createStaticItem(matrix: Array<number>, color: string, maxVisibleDist: number){
    return this.addChild(new RenderableItem(this.shaderVariables, this.mesh, matrix, color, maxVisibleDist));  
  }

  createRotatingItem(position: Vector3d, sx: number, sy: number, sz: number, color: string){
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
  
  createMovingItem(posVector: Vector3d, speedVector: Vector3d, color: string){
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
  constructor(gl: WebGLRenderingContext, shaderUnit: string){
    super(gl, shaderUnit);
    this.onRender = (gl, props)=>{
      shaderUnit.initShader(gl, this.shaderProgram, this.shaderVariables);
      gl.uniformMatrix4fv(this.shaderVariables.viewUniMat4, false, props.viewMatrix);
    }
  }
  shaderVariables(gl: WebGLRenderingContext, shaderProgram: any, shaderVariables: any) {
    throw new Error('Method not implemented.');
  }

  createModelList(modelSource: string, preScaler: number){
    return this.addChild(new SolidUntexturedModelList(this.gl, this.shaderVariables, modelSource, preScaler));
  }
}
