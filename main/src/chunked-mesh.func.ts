import { rand as _rand, transformVertexList } from './calc.utils';
import Vector3d from './vector3d.dev';
import Mesh from './mesh.object';

function makeChunkedMesh (gl: WebGLRenderingContext, modelSource: string, count: number, matrixFunction: (index: number)=>Array<number>){
  let inputModel = new Mesh(gl);
  inputModel.loadFromSource(modelSource);
  let outVertexList: Array<number> = [];
  let outNormalList: Array<number> = [];
  let outTexList: Array<number> = [];

  let rand = _rand;
  let mtx;
  let transformed;
  for (let i = 0; i<count; i++){
    mtx = matrixFunction(i);
    transformed = transformVertexList(inputModel.vertexList, mtx);
    transformed.forEach(it=>{
      outVertexList.push(it);
    });

    transformed = transformVertexList(inputModel.normalList, m4.transpose(mtx));
    transformed.forEach(it=>{
      outNormalList.push(it);
    });

    transformed = inputModel.texList;
    transformed.forEach(it=>{
      outTexList.push(it);
    });
  }

  inputModel.deleteBuffers();
  let outputMesh = new Mesh(gl);
  outputMesh.loadFromLists(outVertexList, outNormalList, outTexList);
  return outputMesh;
}

export default makeChunkedMesh;