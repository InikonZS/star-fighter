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
    v_normal = vec4(mat3(u_world) * vec3(a_normal), 1);
  }
`;

let fragmentShaderSource =`
  precision mediump float;
  uniform vec4 u_color;
  varying vec4 v_position;
  varying vec4 v_normal;
  void main() {
    float light = dot(normalize(v_normal.xyz),normalize(vec3(1,1,0)));
    light = light+1.0;
    gl_FragColor = vec4(light*u_color.r, light*u_color.g, light*u_color.b, 1);
  }
`;

//gl_FragColor = vec4((light.x+0.0)*0.95*u_color.r, (light.y+0.0)*0.95*u_color.r, (light.z+0.0)*0.95*u_color.r, 1);

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
  gl.disable(gl.BLEND);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.useProgram(program);
  gl.enableVertexAttribArray(positionAttr);
  gl.enableVertexAttribArray(normalAttr);
}

module.exports = {
  vertexShaderSource,
  fragmentShaderSource,
  getShaderVariables,
  initShader
}