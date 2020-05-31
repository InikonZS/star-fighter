const Basic = require('./basic.object.js');
const boxModel = require('./box.model.js');
const calc = require('./calc.utils.js');

class Bullet{
  constructor(gl, startPoint, speedVector){
    this.gl = gl;
    this.pos = startPoint;
    this.v = speedVector; 
    let mtx = m4.identity();
    mtx = m4.translate(mtx, this.pos.x, this.pos.y, this.pos.z);
    this.model = new Basic(gl,boxModel , mtx, {r:200, g:20, b:60});

    this.time = 1.2;
  }

  render(shadersVariables, deltaTime){
    this.time-=deltaTime;
    
    //this.model.matrix = m4.translate(this.model.matrix, this.v.x, this.v.y, this.v.z);
    this.pos.addVector(this.v, true);
    let mtx = m4.identity();
    mtx = m4.translate(mtx, this.pos.x, this.pos.y, this.pos.z);
    this.model.matrix = mtx;
    this.model.render(shadersVariables);
  }

  react(obj, pos){
    return isCrossedSimple(pos, this.pos, this.v) && calc.isCrossedMeshByLine(obj, this.pos, this.pos.addVector(this.v));

  }
}

function isCrossedSimple(pos, a, v){
  return (pos.subVector(a).abs()<(v.abs()+10));
}

module.exports = Bullet;