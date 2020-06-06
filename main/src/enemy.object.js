const Basic = require('./basic.object.js');
const rocketModel = require('./rocket.model.js');
const boxModel = require('./rocket.model.js');
const calc = require('./calc.utils.js');
const Vector3d = require('./vector3d.dev.js');
let Weapon = require('./weapon.object.js');

class Enemy{
  constructor(gl, startPoint, speedVector){
    this.gl = gl;
    this.pos = startPoint;
    //this.pos = new Vector3d(0,0,0);
    this.v = speedVector; 

    //this.weapon = new Weapon(0.75, 5.2, 6.1, 'assets/sounds/laser.mp3');
    this.weapon = new Weapon(0.25, 5.2, 3.1);

    this.nv = new Vector3d(0, 0 ,1);
    this.aziV = new Vector3d (0,0,0);
    this.azi = new Vector3d (0,0,0);

    let mtx = m4.identity();
    mtx = m4.translate(mtx, this.pos.x, this.pos.y, this.pos.z);
    this.model = new Basic(gl,rocketModel , mtx, {r:20, g:200, b:200});
    this.hitPoint = new Basic(gl,boxModel , mtx, {r:20, g:200, b:200});
    this.atack = true;

   // this.time = 1.2;
  }

  render(shadersVariables, deltaTime){
   // this.time-=deltaTime;
    this.weapon.render(deltaTime);
    
    this.pos.addVector(this.v, true);

    this.model.matrix = m4.identity();
    this.model.matrix = m4.translate(this.model.matrix, this.pos.x, this.pos.y, this.pos.z);
    this.model.matrix = m4.zRotate(this.model.matrix, this.azi.x+Math.PI/2);
    this.model.matrix = m4.xRotate(this.model.matrix, this.azi.y+Math.PI/2);
    this.model.matrix = m4.yRotate(this.model.matrix, Math.PI);

    
    //this.azi.addVector(this.torq, true);
    //this.pos = new Vector3d(0,0,0).transform(this.model.matrix);
   // let vv = new Vector3d(Math.sin(this.azi.y)*Math.cos(this.azi.x), Math.sin(this.azi.y)*Math.sin(this.azi.x), Math.cos(this.azi.y));
    /*let mi = m4.identity();
    mi = m4.zRotate(mi, this.azi.x+Math.PI/2);
    mi = m4.xRotate(mi, this.azi.y+Math.PI/2);
    mi = m4.yRotate(mi, Math.PI);*/

    //this.nv = vv;
    //let mtx = m4.identity();
    //mtx = m4.translate(mtx, this.pos.x, this.pos.y, this.pos.z);
    //this.model.matrix = mtx;

    this.nv = toDecart(this.azi);

    this.model.render(shadersVariables);
  }

  logic(playerPosition, playerSpeed, deltaTime){
    let dir;
    if (this.atack){
      if (this.pos.subVector(playerPosition).abs()>40){
        let dist = this.pos.subVector(playerPosition).abs();
        let time = dist/this.weapon.bulletSpeed;
        dir = this.pos.subVector(playerPosition.addVector(playerSpeed.mul(time))).normalize();
        this.weapon.shot(this.gl, app.glCanvas.scene.bullets, this.pos.addVector(this.nv.mul(-3)), 
        this.nv.mul(-1).addVector(this.v.mul(1/this.weapon.bulletSpeed))
        );
        ///this.nv.mul(-1) without speed;
      } else {
        dir = this.pos.subVector(playerPosition).mul(-1).normalize();
        this.atack = false;
      }
    } else {
      if (this.pos.subVector(playerPosition).abs()>(calc.rand(150)+150)){
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

    //dir = this.pos.subVector(playerPosition).normalize();

    //let vs = this.v.addVector(this.pos);
    this.hitPoint.matrix = this.model.matrix;
   
   /* this.model.matrix = m4.lookAt([this.pos.x, this.pos.y, this.pos.z], [vs.x, vs.y, vs.z], [0,0,1] );
    this.model.matrix = m4.xRotate(this.model.matrix,-Math.PI/2);
    this.model.matrix = m4.zRotate(this.model.matrix,Math.PI);*/

    
    //if (this.v.abs()<0.5){
    
    //this.v.subVector(dir.mul(0.05), true); //old

    //let orta = toPolar3d(dir);//toPolar3d(this.nv).subVector(toPolar3d(dir)).mul(0.005);
    let orta = toPolar3d(dir);
    let az = azimutDifference(orta.x, this.azi.x);
    az = az>0 ? 1 : -1;
    //let ortas = orta.subVector()
   // let az = Math.min(Math.abs(orta.x - this.azi.x), Math.abs(orta.x - this.azi.x + Math.PI*2));
   /* if (Math.abs(orta.x - this.azi.x + Math.PI*2)<Math.abs(orta.x - this.azi.x)){az = orta.x - this.azi.x + Math.PI*2} else{
      az =orta.x - this.azi.x;
    }*/
    //az= az*Math.sign((orta.x - this.azi.x));
   // if(this.azi.x<orta.x){az=-az;}
    //if (Math.random()<0.01){console.log(orta, ortas, this.azi)};
    //this.azi = (this.azi.mul(120).addVector(orta)).mul(1/121);
    if (Math.abs(this.aziV.x)<0.2){
      this.aziV.x = this.aziV.x +az/50;
    }
    this.azi.x += this.aziV.x;//this.torq.mul(0.059).addVector(orta);
    let kk=2;
    this.azi.y = ((this.azi.y*kk)+orta.y)/(kk+1);
    this.aziV.x*=0.93;
    //this.azi = this.azi.addVector(ortas.mul(-1));
    //if (orta.y<Math.PI/2){ orta.y}
    //let kk = 20;
    //this.aziV = this.aziV.addVector(orta.mul(1/kk));
    //this.azi = this.azi.addVector(this.aziV.mul(-1));
    //this.aziV = this.aziV.mul(0.179);
    if (this.azi.y>Math.PI-0.01){this.azi.y=Math.PI-0.01};
    if (this.azi.y<0.01){this.azi.y=0.01};
    //if (this.azi.x>Math.PI){this.azi.x=-Math.PI+0.001};
    //if (this.azi.x<-Math.PI){this.azi.x=Math.PI-0.001};

   // if (orta.abs()>2){
      this.v.subVector(this.nv.normalize().mul(0.02), true);
      if (this.v.abs()>0.91){this.v = this.v.normalize().mul(0.91);}
    //} 
  //  } else {
   //   this.v.mul(0.8998, true);  
   // }
    this.v.mul(0.9998, true);
    //this.v = new Vector3d(0,0,0);
  }
}

function azimutDifference(a, b){
  let da = a - b;
  let daOver = a - b + Math.PI*2;
  if (Math.abs(da) < Math.abs(daOver)){
    return da; 
  } else {
    return daOver;
  }
}

function getAngleBetweenVectors(a, b){
  return Math.acos(a.dot(b)/(a.abs()*b.abs()));
}

function toPolar3d(v){
  if (!v){v=new Vector3d(0,0,1);}
  return new Vector3d(Math.atan2(v.y, v.x), Math.acos(v.z/v.abs()), 0);
}

function toDecart(azi){
  return new Vector3d(Math.sin(azi.y)*Math.cos(azi.x), Math.sin(azi.y)*Math.sin(azi.x), Math.cos(azi.y));
}

module.exports = Enemy;