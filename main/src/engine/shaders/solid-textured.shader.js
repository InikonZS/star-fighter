let vertexShaderSource = `
  attribute vec4 a_position;
  attribute vec2 a_texcoord;
  attribute vec4 a_norm;

  uniform mat4 u_view;
  uniform mat4 u_world;
  uniform vec4 u_texpos;

  varying vec4 v_position;
  varying vec2 v_texcoord;
  varying vec4 v_normal;

  void main() {
    gl_Position = u_view * u_world * a_position;
    v_position = gl_Position;
    v_texcoord = vec2((a_texcoord.x+u_texpos.z)*u_texpos.x, (a_texcoord.y+u_texpos.a)*u_texpos.y);
    v_normal = vec4(mat3(u_world) * vec3(a_norm), 1);
  }
`;

let fragmentShaderSource =`
  precision mediump float;

  uniform vec4 u_color;
  uniform sampler2D u_texture;

  varying vec4 v_position;
  varying vec2 v_texcoord;
  varying vec4 v_normal;
  
  void main() {
    float light = dot(normalize(v_normal.xyz),normalize(vec3(1,1,0)));
    light = light+1.0;
    vec4 texColor = texture2D(u_texture, v_texcoord);
    gl_FragColor = vec4(light*texColor.r, light*texColor.g, light*texColor.b, 1);
  }
`;

function getShaderVariables(gl, program){
  //gl.useProgram(program);
  var positionAttr = gl.getAttribLocation(program, "a_position");
  var normalAttr = gl.getAttribLocation(program, "a_norm");
  var texAttr = gl.getAttribLocation(program, "a_texcoord");
  var colorUniVec4 = gl.getUniformLocation(program, "u_color");
  var posUniVec4 = gl.getUniformLocation(program, "u_texpos");
  var viewUniMat4 = gl.getUniformLocation(program, "u_view");
  var worldUniMat4 = gl.getUniformLocation(program, "u_world");
  var texture = gl.getUniformLocation(program, "u_texture");

  return {
    positionAttr,
    texAttr,
    normalAttr,
    colorUniVec4,
    viewUniMat4,
    worldUniMat4,
    posUniVec4,
    texture
  }
}

function initShader(gl, shaderProgram, shaderVariables){
  gl.clearColor(0, 0, 0, 0);
  gl.enable(gl.DEPTH_TEST);
  gl.depthMask(true);
  gl.disable(gl.BLEND);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.useProgram(shaderProgram);
  gl.enableVertexAttribArray(shaderVariables.positionAttr);
  gl.enableVertexAttribArray(shaderVariables.normalAttr);
  gl.enableVertexAttribArray(shaderVariables.texAttr);
}

module.exports = {
  vertexShaderSource,
  fragmentShaderSource,
  getShaderVariables,
  initShader
}