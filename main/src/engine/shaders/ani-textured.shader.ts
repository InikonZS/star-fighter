import { IShaderVars } from "./IShaderUnit";

let vertexShaderSource = `
  attribute vec4 a_position;
  attribute vec2 a_texcoord;
  
  uniform mat4 u_view;
  uniform mat4 u_world;
  uniform vec4 u_texpos;

  varying vec4 v_position;
  varying vec2 v_texcoord;

  void main() {
    gl_Position = u_view * u_world * a_position;
    v_position = gl_Position;
    v_texcoord = vec2((a_texcoord.x+u_texpos.z)*u_texpos.x, (a_texcoord.y+u_texpos.a)*u_texpos.y);
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
  var posUniVec4 = gl.getUniformLocation(program, "u_texpos");
  var viewUniMat4 = gl.getUniformLocation(program, "u_view");
  var worldUniMat4 = gl.getUniformLocation(program, "u_world");
  var texture = gl.getUniformLocation(program, "u_texture");

  return {
    positionAttr,
    texAttr,
    colorUniVec4,
    viewUniMat4,
    worldUniMat4,
    posUniVec4,
    texture
  }
}

function initShader(gl: WebGLRenderingContext, program: WebGLProgram, vars: IShaderVars){
  gl.clearColor(0, 0, 0, 0);
  //gl.disable(gl.DEPTH_TEST);
  gl.depthMask(false);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
  gl.enable(gl.BLEND);
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