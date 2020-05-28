const calc = require('./calc.utils.js');

class Basic{
  constructor(gl, modelSource, matrix, color){
    let modelObject = getModList(modelSource);
    this.vertexList = modelObject.triangleList;
    this.normalList = modelObject.normalList;
    this.color = color;
    this.matrix = matrix;
    this.gl = gl;

    this.positionBuffer = createBuffer(gl, this.vertexList);
    this.normBuffer = createBuffer(gl, this.normalList);
  }

  render(shaderVariables, matrix, color){
    if (color){
      this.color = color;
    }
    if (matrix){
      this.matrix = matrix;
    }
    this.gl.uniformMatrix4fv(shaderVariables.worldUniMat4, false, this.matrix);
    renderModel(this.gl, this.positionBuffer, this.normBuffer, this.vertexList.length/3, shaderVariables.positionAttr, shaderVariables.normalAttr, this.color, shaderVariables.colorUniVec4);
  }
}

function createBuffer(gl, list){
  var positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(list), gl.STATIC_DRAW); 
  return positionBuffer;
}

function setBuffer(gl, buffer, location){
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  // Указываем атрибуту, как получать данные от positionBuffer (ARRAY_BUFFER)
  var size = 3;          // 2 компоненты на итерацию
  var type = gl.FLOAT;   // наши данные - 32-битные числа с плавающей точкой
  var normalize = false; // не нормализовать данные
  var stride = 0;        // 0 = перемещаться на size * sizeof(type) каждую итерацию для получения следующего положения
  var offset = 0;        // начинать с начала буфера
  gl.vertexAttribPointer(
  location, size, type, normalize, stride, offset);  
}

function renderModel(gl, vertexBuf, normBuf ,triCount, positionAttributeLocation, positionNormLocation, color, colorLocation){
  gl.uniform4f(colorLocation, color.r/255, color.g/255, color.b/255, color.a/255);

  setBuffer(gl, vertexBuf, positionAttributeLocation);
  setBuffer(gl, normBuf, positionNormLocation);

  var primitiveType = gl.TRIANGLES;
  var count = triCount; 
  gl.drawArrays(primitiveType, 0, count); 
}

function getModList(oob){
  let vreg=/[ \t]+/;
  let oreg=/[\n]+/;

  let arr = oob.split(oreg);
  let vertexList = [];
  let triangleList =[];
  let normalList = [];
  for (let i=0; i< arr.length; i++){
    let spl = arr[i].split(vreg);
    switch (spl[0]){
      case 'v': 
        vertexList.push({x:spl[1], y:spl[2], z:spl[3]});
      break;

      case 'f':
        for (let j=1; j<4; j++){
          triangleList.push(vertexList[spl[j]-1].x/10);
          triangleList.push(vertexList[spl[j]-1].y/10);
          triangleList.push(vertexList[spl[j]-1].z/10);
        }

        for (let j=0; j<3; j++){
          normalList.push(calc.getNormal(vertexList[spl[1]-1],vertexList[spl[2]-1],vertexList[spl[3]-1]).x);
          normalList.push(calc.getNormal(vertexList[spl[1]-1],vertexList[spl[2]-1],vertexList[spl[3]-1]).y);
          normalList.push(calc.getNormal(vertexList[spl[1]-1],vertexList[spl[2]-1],vertexList[spl[3]-1]).z);
        }
      break;
    }
  }

  return {triangleList, normalList};
}

module.exports = Basic;