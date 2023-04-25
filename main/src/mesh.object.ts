import calc from './calc.utils';
import Vector3d from './vector3d.dev';
import GLUtils from './gl-utils';
import {getModList} from './obj-loader.utils';

class Mesh{
  gl: WebGLRenderingContext;
  maxDistance: number;
  vertexList: Array<number>;
  normalList: Array<number>;
  texList: Array<number>;
  positionBuffer: any;
  normBuffer: any;
  texBuffer: any;

  constructor(gl: WebGLRenderingContext){
    this.gl = gl;
    this.maxDistance = 0;  
  }

  loadFromSource(modelSource: string, preScaler?: number){
    let modelObject = getModList(modelSource, false , preScaler);
    this.vertexList = modelObject.triangleList;
    this.normalList = modelObject.normalList;
    this.texList = modelObject.texList;
    this.maxDistance = getMaxDistance(this.vertexList);
    //this.center = this.getCenter();
    this.makeBuffers();
    return this;
  }

  loadFromLists(vertexList: Array<number>, normalList: Array<number>, texList: Array<number>){
    this.vertexList = vertexList;
    this.normalList = normalList;
    this.texList = texList;
    this.maxDistance = getMaxDistance(this.vertexList);
    this.makeBuffers();
    return this;
  }

  getTransformedMesh(matrix: Array<number>){ //bad it eats much memory
    let mesh = new Mesh(this.gl);
    let newVertexList = calc.transformVertexList(this.vertexList, matrix);
    let trMatrix = m4.transpose(matrix);
    let newNormList = calc.transformVertexList(this.normalList, trMatrix);
    return mesh.loadFromLists(newVertexList, newNormList, this.texList);  
  }

  getTransformedVertexList(matrix: Array<number>){
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

function getMaxDistance(vertexList: Array<number>){
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

function getCenter(vertexList: Array<number>){
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

export default Mesh;