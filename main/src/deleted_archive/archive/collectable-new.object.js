const Basic = require('./basic.object.js');
const boxModel = require('./box.model.js');
const calc = require('./calc.utils.js');
//const physPoint = require('./phys-point.model.js');

class Collectable{
  constructor(gl, posVector, modelPointer){
    this.gl = gl;
    this.pos = posVector;
    let mtx = m4.identity();
    mtx = m4.translate(mtx, this.pos.x, this.pos.y, this.pos.z);
    this.ownMatrix = mtx;
    this.model = modelPointer;
    this.isExist = true;
    this.resMatrix = m4.multiply(this.ownMatrix, this.model.matrix);
    this.physModel = calc.transformVertexList(this.model.vertexList, this.getMatrix());
    
  }

  getMatrix(){
    return this.resMatrix;
  }

  react(a, v, onCrossed){
    let pos = this.pos;
    //let obj = calc.transformVertexList(this.model.vertexList, this.matrix);
    res = isCrossedSimple(pos, a, v) && calc.isCrossedMeshByLine(this.physModel, a, a.addVector(v));
    if (res) {onCrossed(this);}
    return res;
  }
  
}

function isCrossedSimple(pos, a, v){
  return (pos.subVector(a).abs()<(v.abs()+10));
}

module.exports = Collectable;