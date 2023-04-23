import GameObject from './game-object.new';
import { createShaderFromSource } from '../gl-utils';

class RenderableShaderList extends GameObject {
  gl: WebGLRenderingContext;
  shaderVariables: any;
  
  constructor(gl: WebGLRenderingContext, shaderUnit){
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