const Basic = require('./basic.object.js');
const boxModel = require('./rocket.model.js');
const calc = require('./calc.utils.js');

class Enemy{
  constructor(gl, startPoint, speedVector){
    this.gl = gl;
    this.pos = startPoint;
    this.v = speedVector; 
    let mtx = m4.identity();
    mtx = m4.translate(mtx, this.pos.x, this.pos.y, this.pos.z);
    this.model = new Basic(gl,boxModel , mtx, {r:200, g:20, b:60});

   // this.time = 1.2;
  }

  render(shadersVariables, deltaTime){
   // this.time-=deltaTime;
    
    this.model.matrix = m4.translate(this.model.matrix, this.v.x, this.v.y, this.v.z);
    this.pos.addVector(this.v, true);
    //let mtx = m4.identity();
    //mtx = m4.translate(mtx, this.pos.x, this.pos.y, this.pos.z);
    //this.model.matrix = mtx;
    this.model.render(shadersVariables);
  }

  logic(playerPosition){
    let dir = this.pos.subVector(playerPosition).normalize();

    let vs = this.v.addVector(this.pos);
    this.model.matrix = m4.lookAt([this.pos.x, this.pos.y, this.pos.z], [vs.x, vs.y, vs.z], [0,0,1] );
    this.model.matrix = m4.xRotate(this.model.matrix,-Math.PI/2);
    this.model.matrix = m4.zRotate(this.model.matrix,Math.PI);
    if (Math.random()<0.01){console.log(dir)};
    if (this.v.abs()<0.5){
      this.v.subVector(dir.mul(0.05), true);
    } 
    this.v.mul(0.98, true);
  }
}

module.exports = Enemy;