const calc = require('./calc.utils.js');
const Vector3d = require('./vector3d.dev.js');
const GLUtils = require('./gl-utils.js');
const ObjUtils = require('./obj-loader.utils.js');

class Mesh{
  constructor(gl){
    this.gl = gl;
    this.maxDistance = 0;  
  }

  loadFromSource(modelSource, preScaler){
    let modelObject = ObjUtils.getModList(modelSource, false , preScaler);
    this.vertexList = modelObject.triangleList;
    this.normalList = modelObject.normalList;
    this.texList = modelObject.texList;
    this.maxDistance = getMaxDistance(this.vertexList);
    //this.center = this.getCenter();
    this.makeBuffers();
    return this;
  }

  loadFromLists(vertexList, normalList, texList){
    this.vertexList = vertexList;
    this.normalList = normalList;
    this.texList = texList;
    this.maxDistance = getMaxDistance(this.vertexList);
    this.makeBuffers();
    return this;
  }

  getTransformedMesh(matrix){ //bad it eats much memory
    let mesh = new Mesh(this.gl);
    let newVertexList = calc.transformVertexList(this.vertexList, matrix);
    let trMatrix = m4.transpose(matrix);
    let newNormList = calc.transformVertexList(this.normalList, trMatrix);
    return mesh.loadFromLists(newVertexList, newNormList, this.texList);  
  }

  getTransformedVertexList(matrix){
    return calc.transformVertexList(this.vertexList, matrix);
  }

  makeBuffers(){
    let gl = this.gl;
    this.positionBuffer = GLUtils.createBuffer(gl, this.vertexList);
    this.normBuffer = GLUtils.createBuffer(gl, this.normalList);
    this.texBuffer = GLUtils.createBuffer(gl, this.texList);  
  }

  deleteBuffers(){
    let gl = this.gl;
    gl.deleteBuffer(this.positionBuffer);
    gl.deleteBuffer(this.normBuffer);
    gl.deleteBuffer(this.texBuffer);
  }

  getCenter(){
    return getCenter(this.vertexList);
  }
}

function getMaxDistance(vertexList){
  let max = 0;
  for (let i=0; i<vertexList.length; i+=3){
    let v = new Vector3d(vertexList[i+0], vertexList[i+1], vertexList[i+2]);
    let dist = v.abs();
    if (dist>max){
      max = dist;
    }
  }
  return max;
}

function getCenter(vertexList){
  let res;
  for (let i=0; i<vertexList.length; i+=3){
    let v = new Vector3d(vertexList[i+0], vertexList[i+1], vertexList[i+2]);
    if (!res){
      res = v;
    } else {
      res = res.addVector(v).mul(0.5);
    }
  }
  return res;
}

module.exports = Mesh;