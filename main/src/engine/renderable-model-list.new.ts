import GameObject from './game-object.new';
import RenderableItem from './renderable-item.new';
import Mesh from '../mesh.object';
import GLUtils from '../gl-utils';
import { IShaderVars } from './shaders/IShaderUnit';

class RenderableModelList extends GameObject {
  shaderVariables: IShaderVars;

  constructor(gl: WebGLRenderingContext, shaderVariables: IShaderVars, modelSource: string, preScaler?: number){
    super();
    this.shaderVariables = shaderVariables;
    this.mesh = new Mesh(gl);
    this.mesh.loadFromSource(modelSource, preScaler);
    //this.mesh.center = this.mesh.getCenter();
    //console.log(this.mesh.center)

  /*  this.onDelete = ()=>{
      this.mesh.deleteBuffers(); 
      if (this.texture){
        gl.deleteTexture(this.texture);
      }
      console.log('delbuffers'); 
    }*/
  }
 /* clear(){
    this.childList.forEach(it=>{
      it.deleteSelf();
      console.log('deleted');
    });  
  }*/
  createStaticItem(matrix: number[], color?: { r: number; g: number; b: number; a?:number}):GameObject{
    //abstract
    return null;
  }
}

export default RenderableModelList;