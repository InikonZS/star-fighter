const Basic = require('./basic.object.js');
const rocketModel = require('./rocket.model.js');
const boxModel = require('./rocket.model.js');
const calc = require('./calc.utils.js');
const Vector3d = require('./vector3d.dev.js');

class Enemy{
  constructor(gl, startPoint, speedVector){
    this.gl = gl;
    this.pos = startPoint;
    this.v = speedVector; 
    let mtx = m4.identity();
    mtx = m4.translate(mtx, this.pos.x, this.pos.y, this.pos.z);
    this.model = new Basic(gl,rocketModel , mtx, {r:20, g:200, b:200});
    this.hitPoint = new Basic(gl,boxModel , mtx, {r:20, g:200, b:200});
    this.atack = true;

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
    let dir;
    if (this.atack){
      if (this.pos.subVector(playerPosition).abs()>20){
        dir = this.pos.subVector(playerPosition).normalize();
        this.weapon.shot(this.gl, app.glCanvas.scene.bullets, this.pos.addVector(dir.mul(-3)), dir.mul(-1));
      } else {
        dir = this.pos.subVector(playerPosition).mul(-1).normalize();
        this.atack = false;
      }
    } else {
      if (this.pos.subVector(playerPosition).abs()>70){
        dir = this.pos.subVector(playerPosition).normalize();
        this.atack = true;
      } else {
        dir = this.pos.subVector(playerPosition).mul(-1);
        dir.x = dir.x+Math.random()*10-5;
        dir.y = dir.y+Math.random()*10-5;
        dir.z = dir.z+Math.random()*10-5;
        dir=dir.normalize(); 
      }
    }

    let vs = this.v.addVector(this.pos);
    this.hitPoint.matrix = this.model.matrix;
    this.model.matrix = m4.lookAt([this.pos.x, this.pos.y, this.pos.z], [vs.x, vs.y, vs.z], [0,0,1] );
    this.model.matrix = m4.xRotate(this.model.matrix,-Math.PI/2);
    this.model.matrix = m4.zRotate(this.model.matrix,Math.PI);
    //if (Math.random()<0.01){console.log(dir)};
    //if (this.v.abs()<0.5){
      this.v.subVector(dir.mul(0.05), true);
    if (this.v.abs()>0.51){this.v = this.v.normalize().mul(0.51);}
    //} 
    this.v.mul(0.9998, true);
  }
}

module.exports = Enemy;