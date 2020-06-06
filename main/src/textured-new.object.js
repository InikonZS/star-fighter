const calc = require('./calc.utils.js');
const GLUtils = require('./gl-utils.js');
const Basic = require('./basic.object.js');
const ObjUtils = require('./obj-loader.utils.js');

class Textured extends Basic{
  constructor(gl, modelSource, textureURL, matrix, color){
    super(gl, modelSource, matrix, color);
    let modelObject = ObjUtils.getModList(modelSource);
    this.texList = modelObject.texList;
    this.texture;

    GLUtils.createTexture(this.gl, textureURL, (tex)=>{this.texture = tex});

    this.texBuffer = GLUtils.createBuffer(gl, this.texList);
    //this.normBuffer = createBuffer(gl, this.normalList);
  }

  render(shaderVariables, matrix, color){
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
    super.render(shaderVariables, matrix, color)
  }
}

module.exports = Textured;