//const Animation = require('./animation.object.js');
const Mesh = require('./mesh.object.js');
const GLUtils = require('./gl-utils.js');

class ObList{
  constructor(gl, modelSource, textureURL){
    this.gl = gl;
    this.list = [];
    this.reqFilter = false;

    this.mesh = new Mesh(gl);
    this.mesh.loadFromSource(modelSource);
    GLUtils.createTexture(this.gl, textureURL, (tex)=>{this.texture = tex});
    this.color = {r:200, g:20, b:60};
  }

  addItem(sprite){
    this.list.push(sprite);
  }

  deleteItem(item){
    item.isExist = false;
    this.reqFilter = true;
  };

  render(shaderVariables, deltaTime){
    if (this.reqFilter){
      this.list = this.list.filter(it=>it.isExist);
    }

    let gl = this.gl;
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
    GLUtils.setBuffer(gl, this.mesh.positionBuffer, shaderVariables.positionAttr,3);
    GLUtils.setBuffer(this.gl, this.mesh.texBuffer, shaderVariables.texAttr, 2);
    let color = this.color;
    gl.uniform4f(shaderVariables.colorUniVec4, color.r/255, color.g/255, color.b/255, color.a/255);

    this.list.forEach(it=>{
      it.render(shaderVariables, deltaTime);
    });
    
  }

}

module.exports = ObList;