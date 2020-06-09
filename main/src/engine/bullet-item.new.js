const GameObject = require('./game-object.new.js');
const Vector3d = require('../vector3d.dev.js');
const calc = require('../calc.utils.js');

class RenderableItem extends GameObject {
  constructor(shaderVariables, meshPointer, color, startVector, speedVector){
    super();
    this.shaderVariables = shaderVariables;
    this.count = meshPointer.vertexList.length / 3;
    this.color = color;
    this.startVector = startVector;
    this.speedVector = speedVector;
    this.pos = startVector;
    let mtx = m4.identity();
    mtx = m4.translate(mtx, this.pos.x, this.pos.y, this.pos.z);
    this.matrix =mtx;
    this.time =1.2;

    this.onRender = (gl)=>{
      gl.uniformMatrix4fv(this.shaderVariables.worldUniMat4, false, this.matrix); 
      let color = this.color;
      gl.uniform4f(shaderVariables.colorUniVec4, color.r, color.g, color.b, color.a); 
      gl.drawArrays(gl.TRIANGLES, 0, this.count);  
     
    }

    this.onProcess = (deltaTime)=>{
      this.time -= deltaTime;
      if (this.time<=0 || this.time>=10000){
        this.deleteSelf();
      }
      let mtx = m4.identity();
      mtx = m4.translate(mtx, this.pos.x, this.pos.y, this.pos.z);
      this.pos.addVector(this.speedVector.mul(deltaTime));
      this.matrix =mtx;
    }

    this.onReact = (ob)=>{
      if (ob.hitTransformed){
        if (isCrossedSimple(ob.hitPosition, this.pos, this.speedVector, ob.hitDist)){
          if (calc.isCrossedMeshByLine(ob.hitTransformed, this.pos, this.pos.addVector(this.speedVector))){
            //ob.color = calc.makeNormRGBA('f11');
            ob.deleteSelf();
          };  
        };
      }
    }
  }
}

function isCrossedSimple(pos, a, v, d){
  return (pos.subVector(a).abs()<(v.abs()+d));
}

module.exports = RenderableItem;