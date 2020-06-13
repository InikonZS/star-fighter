const calc = require('./calc.utils.js');
const Vector3d = require('./vector3d.dev.js');
const Mesh = require('./mesh.object.js');

function makeChunkedMesh (gl, modelSource, count, matrixFunction){
  let inputModel = new Mesh(gl);
  inputModel.loadFromSource(modelSource);
  let outVertexList = [];
  let outNormalList = [];
  let outTexList = [];

  let rand = calc.rand;
  let mtx;
  let transformed;
  for (let i = 0; i<count; i++){
    mtx = matrixFunction(i);
    transformed = calc.transformVertexList(inputModel.vertexList, mtx);
    transformed.forEach(it=>{
      outVertexList.push(it);
    });

    transformed = calc.transformVertexList(inputModel.normalList, m4.transpose(mtx));
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

module.exports = makeChunkedMesh;