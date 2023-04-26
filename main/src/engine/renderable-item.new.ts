import GameObject from './game-object.new';
import Vector3d from '../vector3d.dev';
import { IShaderVars } from './shaders/IShaderUnit';
import Mesh from '../mesh.object';

class RenderableItem extends GameObject {
  meshPointer: Mesh;
  shaderVariables: IShaderVars;
  count: number;
  color: { r: number; g: number; b: number; a?: number};
  visible: boolean;
  maxVisibleDistance: number;
  pos_: Vector3d;

  constructor(shaderVariables: IShaderVars, meshPointer: Mesh, matrix: number[], color: { r: number; g: number; b: number; a?: number}, maxVisibleDist?: number){
    super();
    this.meshPointer = meshPointer;
    this.shaderVariables = shaderVariables;
    this.matrix = matrix || m4.identity();
    this.count = meshPointer.vertexList.length / 3;
    this.color = color || randomColor();
    this.visible = true;
    this.maxVisibleDistance = maxVisibleDist;

    this.pos_ = new Vector3d(this.matrix[12], this.matrix[13], this.matrix[14]);

    this.onRender = (gl, props)=>{
      if (this.maxVisibleDistance && (props.game.player.camera.getPosVector().subVector(this.pos_).abs()>this.maxVisibleDistance)){
        return;
      }
      if (this.visible){
        gl.uniformMatrix4fv(this.shaderVariables.worldUniMat4, false, this.matrix); 
        let color = this.color;
        gl.uniform4f(shaderVariables.colorUniVec4, color.r, color.g, color.b, color.a); 
        gl.drawArrays(gl.TRIANGLES, 0, this.count);  
      }
    }
  }
}

function randomColor(){
  return {r:Math.random(), g:Math.random(), b:Math.random()};
}


export default RenderableItem;