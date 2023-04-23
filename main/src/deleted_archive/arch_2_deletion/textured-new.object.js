const calc = require('./calc.utils.js');
const GLUtils = require('./gl-utils.js');
const Basic = require('./basic.object.js');
const ObjUtils = require('./obj-loader.utils');

class Textured extends Basic{
  constructor(gl, modelSource, textureURL, matrix, color){
    super(gl, modelSource, matrix, color);
    let modelObject = ObjUtils.getModList(modelSource);
    this.texList = modelObject.texList;
    this.texture;
    this.frame = 0;
    this.xmax = 5;
    this.ymax = 4;
    this.time = 0;

    GLUtils.createTexture(this.gl, textureURL, (tex)=>{this.texture = tex});

    this.texBuffer = GLUtils.createBuffer(gl, this.texList);
    //this.normBuffer = createBuffer(gl, this.normalList);
  }

  render(shaderVariables, matrix, color){
    if (color){
      this.color = color;
    }
    if (matrix){
      this.matrix = matrix;
    }
    this.gl.uniform4f(shaderVariables.posUniVec4, 1/this.xmax,1/this.ymax, this.frame%this.xmax, Math.trunc(this.frame/this.xmax));

    this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
    this.gl.uniformMatrix4fv(shaderVariables.worldUniMat4, false, this.matrix);
    GLUtils.setBuffer(this.gl, this.texBuffer, shaderVariables.texAttr, 2);
    //super.render(shaderVariables, matrix, color)
    renderModel(this.gl, this.positionBuffer, this.normBuffer, this.vertexList.length/3, shaderVariables.positionAttr, shaderVariables.normalAttr, this.color, shaderVariables.colorUniVec4);
  }

/*  renderMany(shaderVariables, matList){
    let gl = this.gl;
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
    GLUtils.setBuffer(gl, this.positionBuffer, shaderVariables.positionAttr,3);
    //setBuffer(gl, this.normBuffer, shaderVariables.normalAttr);
    var primitiveType = gl.TRIANGLES;
    var count = this.vertexList.length/3; 
    matList.forEach(it=>{
      gl.uniformMatrix4fv(shaderVariables.worldUniMat4, false, it.matrix);
      let color = this.color;
      gl.uniform4f(shaderVariables.colorUniVec4, color.r/255, color.g/255, color.b/255, color.a/255);
      gl.drawArrays(primitiveType, 0, count); 
    });
    
  }*/
}

function renderModel(gl, vertexBuf, normBuf ,triCount, positionAttributeLocation, positionNormLocation, color, colorLocation){
  gl.uniform4f(colorLocation, color.r/255, color.g/255, color.b/255, color.a/255);

  GLUtils.setBuffer(gl, vertexBuf, positionAttributeLocation, 3);
  //setBuffer(gl, normBuf, positionNormLocation);

  var primitiveType = gl.TRIANGLES;
  var count = triCount; 
  gl.drawArrays(primitiveType, 0, count); 
}

module.exports = Textured;