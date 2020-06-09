const GameObject = require('./game-object.new.js');
const BulletItem = require('./bullet-item.new.js');
const Mesh = require('../mesh.object.js');
const GLUtils = require('../gl-utils.js');

class RenderableModelList extends GameObject {
  constructor(gl, shaderVariables, modelSource){
    super();
    this.shaderVariables = shaderVariables;
    this.mesh = new Mesh(gl);
    this.mesh.loadFromSource(modelSource);

    this.onRender = (gl)=>{
      GLUtils.setBuffer(gl, this.mesh.positionBuffer, shaderVariables.positionAttr,3);
      GLUtils.setBuffer(gl, this.mesh.normBuffer, shaderVariables.normalAttr,3); 
    }
  }

  createChild(color, startVector, speedVector){
    let ob = new BulletItem(this.shaderVariables, this.mesh, color, startVector, speedVector);
    this.addChild(ob);
    return ob;
  }

}

module.exports = RenderableModelList;