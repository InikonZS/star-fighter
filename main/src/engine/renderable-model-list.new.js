const GameObject = require('./game-object.new.js');
const RenderableItem = require('./renderable-item.new.js');
const Mesh = require('../mesh.object.js');
const GLUtils = require('../gl-utils.js');

class RenderableModelList extends GameObject {
  constructor(gl, shaderVariables, modelSource){
    super();
    this.shaderVariables = shaderVariables;
    this.mesh = new Mesh(gl);
    this.mesh.loadFromSource(modelSource);
  }

}

module.exports = RenderableModelList;