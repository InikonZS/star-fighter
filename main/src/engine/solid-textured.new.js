const RenderableShaderList = require('./renderable-shader-list.new.js');
const RenderableModelList = require('./renderable-model-list.new.js');
const RenderableItem = require('./renderable-item.new.js');
const GameObject = require('./game-object.new.js');
const GLUtils = require('../gl-utils.js');

class TexturedItem extends GameObject {
  constructor(shaderVariables, meshPointer, matrix){
    super();
    this.meshPointer = meshPointer;
    this.shaderVariables = shaderVariables;
    this.matrix = matrix || m4.identity();
    this.count = meshPointer.vertexList.length / 3;
    //this.animation = new Animation(xmax, ymax, timeStep);

    this.onRender = (gl, props)=>{
      //this.animation.render(gl, this.shaderVariables, props.deltaTime);
      gl.uniform4f(this.shaderVariables.posUniVec4, 
        1,
        1, 
        0, 
        0
      );
      gl.uniformMatrix4fv(this.shaderVariables.worldUniMat4, false, this.matrix); 
      //gl.uniform4f(shaderVariables.colorUniVec4, color.r, color.g, color.b, color.a); 
      gl.drawArrays(gl.TRIANGLES, 0, this.count);  
    }
  }
}

class SolidUntexturedModelList extends RenderableModelList{
  constructor(gl, shaderVariables, modelSource, textureURL){
    super(gl, shaderVariables, modelSource); 
    GLUtils.createTexture(gl, textureURL, (tex)=>{this.texture = tex});

    this.onRender = (gl, props)=>{
      GLUtils.setBuffer(gl, this.mesh.positionBuffer, this.shaderVariables.positionAttr, 3);
      GLUtils.setBuffer(gl, this.mesh.texBuffer, this.shaderVariables.texAttr, 2); 
      gl.bindTexture(gl.TEXTURE_2D, this.texture);
    }

    this.onDelete = ()=>{
      this.mesh.deleteBuffers();
      //deleteTexture
    }
  }

  createStaticItem(matrix, maxVisibleDist){
    return this.addChild(new TexturedItem(this.shaderVariables, this.mesh, matrix, maxVisibleDist));  
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

  createModelList(modelSource, textureURL){
    return this.addChild(new SolidUntexturedModelList(this.gl, this.shaderVariables, modelSource, textureURL));
  }
}

module.exports = {SolidTexturedShaderList:SolidUntexturedShaderList, SolidTexturedModelList:SolidUntexturedModelList}