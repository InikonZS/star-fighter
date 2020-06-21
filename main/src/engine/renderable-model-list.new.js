const GameObject = require('./game-object.new.js');
const RenderableItem = require('./renderable-item.new.js');
const Mesh = require('../mesh.object.js');
const GLUtils = require('../gl-utils.js');

class RenderableModelList extends GameObject {
  constructor(gl, shaderVariables, modelSource, preScaler){
    super();
    this.shaderVariables = shaderVariables;
    this.mesh = new Mesh(gl);
    this.mesh.loadFromSource(modelSource, preScaler);
    //this.mesh.center = this.mesh.getCenter();
    //console.log(this.mesh.center)

  /*  this.onDelete = ()=>{
      this.mesh.deleteBuffers(); 
      if (this.texture){
        gl.deleteTexture(this.texture);
      }
      console.log('delbuffers'); 
    }*/
  }
}

module.exports = RenderableModelList;