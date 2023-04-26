import { IShaderVars } from "./IShaderUnit";

let vertexShaderSource = `
  attribute vec4 a_position;
  attribute vec2 a_texcoord;
  
  uniform mat4 u_view;
  uniform mat4 u_world;

  varying vec4 v_position;
  varying vec2 v_texcoord;

  void main() {
    gl_Position = u_view * u_world * a_position;
    v_position = gl_Position;
    v_texcoord = a_texcoord;
  }
`;

let fragmentShaderSource =`
  precision mediump float;

  uniform vec4 u_color;
  uniform sampler2D u_texture;

  varying vec4 v_position;
  varying vec2 v_texcoord;
  
  void main() {
    gl_FragColor = texture2D(u_texture, v_texcoord);
  }
`;

function getShaderVariables(gl: WebGLRenderingContext, program: WebGLProgram){
  var positionAttr = gl.getAttribLocation(program, "a_position");
  var texAttr = gl.getAttribLocation(program, "a_texcoord");
  var colorUniVec4 = gl.getUniformLocation(program, "u_color");
  var viewUniMat4 = gl.getUniformLocation(program, "u_view");
  var worldUniMat4 = gl.getUniformLocation(program, "u_world");
  var texture = gl.getUniformLocation(program, "u_texture");

  return {
    positionAttr,
    texAttr,
    colorUniVec4,
    viewUniMat4,
    worldUniMat4,
    texture
  }
}

function initShader(gl: WebGLRenderingContext, program: WebGLProgram, vars: IShaderVars){
  gl.clearColor(0, 0, 0, 0);
  gl.disable(gl.DEPTH_TEST);
  gl.disable(gl.BLEND);
  gl.depthMask(false);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.useProgram(program);
  gl.enableVertexAttribArray(vars.positionAttr);
  gl.enableVertexAttribArray(vars.texAttr);
}

export default {
  vertexShaderSource,
  fragmentShaderSource,
  getShaderVariables,
  initShader
}