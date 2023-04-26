import { transformVertexList } from './calc.utils';
import Mesh from './mesh.object';

function makeChunkedMesh (gl: WebGLRenderingContext, modelSource: string, count: number, matrixFunction: (index: number)=>Array<number>){
  const inputModel = new Mesh(gl);
  inputModel.loadFromSource(modelSource);
  const outVertexList: Array<number> = [];
  const outNormalList: Array<number> = [];
  const outTexList: Array<number> = [];

  let mtx: Array<number>;
  let transformed: Array<number>;
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
  const outputMesh = new Mesh(gl);
  outputMesh.loadFromLists(outVertexList, outNormalList, outTexList);
  return outputMesh;
}

export default makeChunkedMesh;