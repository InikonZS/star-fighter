//const Basic = require('./basic.object.js');
//const rocketModel = require('./rocket.model.js');
//const boxModel = require('./rocket.model.js');
const calc = require('../calc.utils.js');
const Vector3d = require('../vector3d.dev.js');
let Weapon = require('./weapon.new.js');

const GameObject = require('./game-object.new.js');

class Enemy extends GameObject{
  constructor(gl, game, startPoint, speedVector){
    super();
    this.gl = gl;
    this.game = game;
    this.pos = startPoint;

    this.v = speedVector; 

    this.weapon = new Weapon(game.world, 0.75, 1.2, 500.41);

    this.nv = new Vector3d(0, 0 ,1);
    this.aziV = new Vector3d (0,0,0);
    this.azi = new Vector3d (0,0,0);

    let mtx = m4.identity();
    mtx = m4.translate(mtx, this.pos.x, this.pos.y, this.pos.z);

    ///as gameobject
    this.model = this.game.world.tieModelList.createStaticItem(mtx);
    let hitbox = this.game.world.createBreakable(this.pos, 5);
    hitbox.type = 'object';
    hitbox.scale = 5;
    hitbox.pos = this.pos;
    hitbox.onHit = (bullet)=>{
      console.log('killed');
      this.hitbox.deleteSelf();
      this.model.deleteSelf();
      bullet.deleteSelf();
      this.deleteSelf();
    }
    this.onProcess = (deltaTime)=>{
      hitbox.matrix = this.model.matrix;
      hitbox.hitTransformed = hitbox.meshPointer.getTransformedVertexList(hitbox.matrix);
      hitbox.hitPosition = calc.getPosFromMatrix(hitbox.matrix);
      hitbox.hitDist = hitbox.meshPointer.maxDistance;;//*hitbox.scale;
      this.speedVectorSync = this.v;
      this.render_(deltaTime);
    }
    this.onReact = (ob)=>{
    //if (!(el && el.speedVectorSync)){ return;}
      if (ob.type == 'solid'){
        if (calc.isCrossedSimple(ob.hitPosition, this.pos, this.speedVectorSync, ob.hitDist)){
          let reflected = calc.mirrorVectorFromMesh(ob.hitTransformed, this.pos, this.speedVectorSync);
          if (reflected){
            this.v = (reflected.normalize().mul(this.pos.abs()));  
          };  
        };
      }
    }

    this.hitbox = hitbox;
    this.game.world.objectList.addChild(this);
    /////////

    this.atack = true;

   // this.time = 1.2;
  }

  render_( deltaTime){
   // this.time-=deltaTime;
    this.logic(this.game.player.camera.getPosVector(), this.game.player.camera.getSpeedVector(), deltaTime);
    
    this.weapon.render(deltaTime);
    
    this.pos.addVector(this.v.mul(deltaTime), true);

    this.model.matrix = m4.identity();
    this.model.matrix = m4.translate(this.model.matrix, this.pos.x, this.pos.y, this.pos.z);
    this.model.matrix = m4.zRotate(this.model.matrix, this.azi.x+Math.PI/2);
    this.model.matrix = m4.xRotate(this.model.matrix, this.azi.y+Math.PI/2);
    this.model.matrix = m4.yRotate(this.model.matrix, Math.PI);

    

    //this.model.render(shadersVariables);
    this.nv = toDecart(this.azi);
    //this.shot();
    
  }

  shot(){
    let startPoint = this.pos.addVector(this.nv.mul(-3));
    let targetPoint = this.nv.mul(-1).addVector(this.v.mul(1/this.weapon.bulletSpeed));
    this.weapon.shot(startPoint, targetPoint, this.game.player.camera.getPosVector());  ////
  }

  accelerate(deltaTime){
    this.v.subVector(this.nv.normalize().mul(deltaTime * 10), true);
    if (this.v.abs()>30.91){this.v = this.v.normalize().mul(30.91);}
  }

  directTo(dir){
    let orta = toPolar3d(dir);
    let az = azimutDifference(orta.x, this.azi.x);
    az = az>0 ? 1 : -1;  
    if (Math.abs(this.aziV.x)<0.2){
      this.aziV.x = this.aziV.x +az/500;
    }
    this.azi.x += this.aziV.x;//this.torq.mul(0.059).addVector(orta);
    let kk=12;
    this.azi.y = ((this.azi.y*kk)+orta.y)/(kk+1);
    this.aziV.x*=0.93;

    if (this.azi.y>Math.PI-0.01){this.azi.y=Math.PI-0.01};
    if (this.azi.y<0.01){this.azi.y=0.01};
  }

  logic(playerPosition, playerSpeed, deltaTime){
    let dir;
    if (this.atack){
      if (this.pos.subVector(playerPosition).abs()>40){
        let dist = this.pos.subVector(playerPosition).abs();
        let time = dist/this.weapon.bulletSpeed;
       // dir = this.pos.subVector(playerPosition).normalize();
        dir = this.pos.subVector(playerPosition.addVector(playerSpeed.subVector(this.v.mul(1)).mul(time))).normalize();
        if (Math.abs(getAngleBetweenVectors(dir, this.nv))<Math.random()*0.61){
          if (Math.random()<0.3) {this.shot();}
        }
        //this.weapon.shot(this.gl, app.glCanvas.scene.bullets, this.pos.addVector(this.nv.mul(-3)), 
        //this.nv.mul(-1).addVector(this.v.mul(1/this.weapon.bulletSpeed))
        //);
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

    /////////this.hitPoint.matrix = this.model.matrix;
   
    this.directTo(dir);

    if (Math.abs(getAngleBetweenVectors(dir, this.nv))<Math.PI/2){
      this.accelerate(deltaTime);
    }
    this.v.mul(0.999, true);
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