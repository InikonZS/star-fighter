let vertexShaderSource = `
  attribute vec4 a_position;
  attribute vec4 a_normal;
  uniform mat4 u_view;
  uniform mat4 u_world;
  varying vec4 v_position;
  varying vec4 v_normal;
  void main() {
    gl_Position = u_view * u_world * a_position;
    v_position = gl_Position;
    v_normal = u_world * a_normal;
  }
`;

let fragmentShaderSource =`
  precision mediump float;
  uniform vec4 u_color;
  varying vec4 v_position;
  varying vec4 v_normal;
  void main() {
    gl_FragColor = normalize(vec4(v_normal.x, v_normal.y, v_normal.z, 1));
  }
`;

function getShaderVariables(gl, program){
  var positionAttr = gl.getAttribLocation(program, "a_position");
  var normalAttr = gl.getAttribLocation(program, "a_normal");
  var colorUniVec4 = gl.getUniformLocation(program, "u_color");
  var viewUniMat4 = gl.getUniformLocation(program, "u_view");
  var worldUniMat4 = gl.getUniformLocation(program, "u_world");
  return {
    positionAttr,
    normalAttr,
    colorUniVec4,
    viewUniMat4,
    worldUniMat4
  }
}

function initShader(gl, program, positionAttr, normalAttr){
  gl.clearColor(0, 0, 0, 0);
  gl.enable(gl.DEPTH_TEST);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.useProgram(program);
  gl.enableVertexAttribArray(positionAttr);
 // gl.enableVertexAttribArray(normalAttr);
}

module.exports = {
  vertexShaderSource,
  fragmentShaderSource,
  getShaderVariables,
  initShader
}