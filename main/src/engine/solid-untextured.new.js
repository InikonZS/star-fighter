const RenderableShaderList = require('./renderable-shader-list.new.js');
const RenderableModelList = require('./renderable-model-list.new.js');
const RenderableItem = require('./renderable-item.new.js');
const GLUtils = require('../gl-utils.js');

class SolidUntexturedModelList extends RenderableModelList{
  constructor(gl, shaderVariables, modelSource){
    super(gl, shaderVariables, modelSource); 
    this.onRender = (gl, props)=>{
      GLUtils.setBuffer(gl, this.mesh.positionBuffer, this.shaderVariables.positionAttr, 3);
      GLUtils.setBuffer(gl, this.mesh.normBuffer, this.shaderVariables.normalAttr, 3); 
    }
  }

  createStaticItem(matrix, color){
    return this.addChild(new RenderableItem(this.shaderVariables, this.mesh, matrix, color));  
  }

  createRotatingItem(position, sx, sy, sz, color){
    let el = this.addChild(new RenderableItem(this.shaderVariables, this.mesh, m4.identity(), color)); 
    el.position = position;
    el.sx = 0;
    el.sy = 0;
    el.sz = 0;
    el.onProcess = (deltaTime)=>{
      let mt = m4.identity();
      mt = m4.translate(mt, el.position.x, el.position.y, el.position.z);
      el.sx +=sx*deltaTime;
      el.sy +=sy*deltaTime;
      el.sz +=sz*deltaTime;
      mt = m4.xRotate(mt, el.sx);
      mt = m4.yRotate(mt, el.sy);
      mt = m4.zRotate(mt, el.sz);
      el.matrix = mt;
    }
    return el;
  }
  
  createMovingItem(posVector, speedVector, color){
    let el = this.addChild(new RenderableItem(this.shaderVariables, this.mesh, m4.identity(), color));
    el.position = posVector.mul(1);
    el.speedVector = speedVector.mul(1);
    el.onProcess = (deltaTime) => {
      let mt = m4.identity();
      el.position = el.position.addVector(el.speedVector.mul(1)); //add deltaTime
      mt = m4.translate(mt,  el.position.x, el.position.y, el.position.z);
      el.matrix = mt;
    }
    return el;
  }
}

class SolidUntexturedShaderList extends RenderableShaderList{
  constructor(gl, shaderUnit){
    super(gl, shaderUnit);
    this.onRender = (gl, props)=>{
      shaderUnit.initShader(gl, this.shaderProgram, this.shaderVariables);
      gl.uniformMatrix4fv(this.shaderVariables.viewUniMat4, false, props.viewMatrix);
    }
  }

  createModelList(modelSource){
    return this.addChild(new SolidUntexturedModelList(this.gl, this.shaderVariables, modelSource));
  }
}

module.exports = {SolidUntexturedShaderList, SolidUntexturedModelList}