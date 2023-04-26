const calc = require('./calc.utils.js');
const GLUtils = require('./gl-utils.js');
const ObjUtils = require('./obj-loader.utils');

class Textured{
  constructor(gl, modelSource, textureURL, matrix, color){
    this.gl = gl;
    let modelObject = ObjUtils.getModList(modelSource);
    this.vertexList = modelObject.triangleList;
    this.normalList = modelObject.normalList;
    this.texList = modelObject.texList;
    //console.log(this.texList, this.vertexList, this.normalList);

    this.texture;

    GLUtils.createTexture(this.gl, textureURL, (tex)=>{this.texture = tex});

    this.color = color;
    this.matrix = matrix;

    this.positionBuffer = createBuffer(gl, this.vertexList);
    this.texBuffer = createBuffer(gl, this.texList);
    //this.normBuffer = createBuffer(gl, this.normalList);
  }

  render(shaderVariables, matrix, color){
    if (color){
      this.color = color;
    }
    if (matrix){
      this.matrix = matrix;
    }
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
    this.gl.uniformMatrix4fv(shaderVariables.worldUniMat4, false, this.matrix);
    GLUtils.setBuffer(this.gl, this.texBuffer, shaderVariables.texAttr, 2);
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

function setTexBuffer(gl, buffer, location){
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  // Указываем атрибуту, как получать данные от positionBuffer (ARRAY_BUFFER)
  var size = 2;          // 2 компоненты на итерацию
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
  //setBuffer(gl, normBuf, positionNormLocation);

  var primitiveType = gl.TRIANGLES;
  var count = triCount; 
  gl.drawArrays(primitiveType, 0, count); 
}

function getModList(oob){
  let vreg=/[ \t]+/;
  let oreg=/[\n]+/;

  let arr = oob.split(oreg);
  let vertexList = [];
  let vertexListUV =[];
  let texList = [];
  let triangleList =[];
  let normalList = [];
  for (let i=0; i< arr.length; i++){
    let spl = arr[i].split(vreg);
    switch (spl[0]){
      case 'v': 
        vertexList.push({x:spl[1], y:spl[2], z:spl[3]});
      break;

      case 'vt': 
        vertexListUV.push({u:spl[1], v:spl[2]});
      break;

      case 'f':
        for (let j=1; j<4; j++){
          let spj = spl[j].split('/');
          let sp = spj[0]-1;
          triangleList.push(vertexList[sp].x/10);
          triangleList.push(vertexList[sp].y/10);
          triangleList.push(vertexList[sp].z/10);

          sp = spj[1]-1;
          texList.push(vertexListUV[sp].u);
          texList.push(vertexListUV[sp].v);
        }

        for (let j=0; j<3; j++){
          let sp1 = spl[1].split('/')[0]-1;
          let sp2 = spl[2].split('/')[0]-1;
          let sp3 = spl[3].split('/')[0]-1;
          let norm = calc.getNormal(vertexList[sp1],vertexList[sp2],vertexList[sp3]);
          normalList.push(norm.x);
          normalList.push(norm.y);
          normalList.push(norm.z);
        }
      break;
    }
  }

  return {triangleList, texList};
}

module.exports = Textured;