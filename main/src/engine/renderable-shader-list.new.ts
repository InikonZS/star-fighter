import GameObject from './game-object.new';
import { createShaderFromSource } from '../gl-utils';
import { IShaderUnit } from './shaders/IShaderUnit';
class RenderableShaderList extends GameObject {
  gl: WebGLRenderingContext;
  shaderVariables: any;

  constructor(gl: WebGLRenderingContext, shaderUnit: IShaderUnit){
    super();
    this.gl = gl;
    let shaderProgram = createShaderFromSource(gl, shaderUnit.vertexShaderSource, shaderUnit.fragmentShaderSource);
    let shaderVariables = shaderUnit.getShaderVariables(gl, shaderProgram);
    this.shaderProgram = shaderProgram;
    this.shaderVariables = shaderVariables;
    
  /* this.onDelete = ()=>{
      gl.deleteProgram(this.shaderProgram);
      console.log('delshader');
    }*/
  }
}

export default RenderableShaderList;