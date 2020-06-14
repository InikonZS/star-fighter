const calc = require('./calc.utils.js');
const Vector3d = require('./vector3d.dev.js');
const Basic = require('./basic.object.js');
const boxModel = require('./box.model.js');

class Chunk{
  constructor(gl, matrix, color){
    this.model = new Basic(gl, boxModel, m4.identity(), {r:200, g:20, b:60} );
    this.vertexList = [];
    this.normalList = [];
    let mtx;
    let transformed;
    for (let i = 0; i<30; i++){
      mtx = m4.identity();
      mtx = m4.translate(mtx, rand(40)-5, rand(40)-5, rand(40)-5);
      transformed = calc.transformVertexList(this.model.vertexList, mtx);
      transformed.forEach(it=>{
        this.vertexList.push(it);
      });

      transformed = calc.transformVertexList(this.model.normalList, mtx);
      transformed.forEach(it=>{
        this.normalList.push(it);
      });
    }

    this.color = color;
    this.matrix = matrix;
    this.gl = gl;

    this.model.vertexList = this.vertexList;
    this.model.normalList = this.normalList;
    this.model.positionBuffer = createBuffer(gl, this.vertexList);
    this.model.normBuffer = createBuffer(gl, this.normalList);
    this.model.matrix = matrix;
    this.model.color = color;
  }

  render(shaderVariables){
    this.model.render(shaderVariables);
  }

  renderMany(shaderVariables, mtList){
    this.model.renderMany(shaderVariables, mtList);
  }
}

function createBuffer(gl, list){
  var positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(list), gl.STATIC_DRAW); 
  return positionBuffer;
}

function rand(lim){
  return Math.trunc(Math.random()*lim);
}

module.exports = Chunk;