//const Basic = require('./basic.object.js');
//const rocketModel = require('./rocket.model.js');
//const boxModel = require('./rocket.model.js');
import calc from '../calc.utils';
import Vector3d from '../vector3d.dev';
import Weapon from './weapon.new';

import GameObject from './game-object.new';
import Message from './point-msg.new';

const rand = calc.rand;
import anyutils from '../any.utils';

class Enemy extends GameObject{
  constructor(gl, game, startPoint, speedVector, modelList, extLogic){
    super();
    this.MAX_SPEED = 55;
    this.ACCELARATION = 5;
    this.FRICTION = 0.999;
    this.TORQUE = 0.03;
    this.RADIAL_FRICTION = 0.93;
    this.THETA_VAL=52;

    this.extLogic = extLogic;

    this.gl = gl;
    this.game = game;
    this.pos = startPoint;

    this.v = speedVector; 

    this.weapon = new Weapon(game.world, 0.75, 1.2, 200.41);

    this.nv = new Vector3d(0, 0 ,1);
    this.aziV = new Vector3d (0,0,0);
    this.azi = new Vector3d (0,0,0);

    let mtx = m4.identity();
    mtx = m4.translate(mtx, this.pos.x, this.pos.y, this.pos.z);

    ///as gameobject
    let msg = new Message(game.glCanvas, '', 'f99', new Vector3d(0,0,0));
    msg.onProcess = ()=>{
      msg.vector = this.pos;
      msg.text = 'enemy '+Math.round(game.player.camera.getPosVector().subVector(msg.vector).abs()*10)/10+ 'km';
    }
    game.messageList.addChild(msg);
    this.msg = msg;

    //this.model = this.game.world.tieModelList.createStaticItem(mtx);
    if (modelList){
      this.model = modelList.createStaticItem(mtx);
    } else {
      this.model = this.game.world.shipLists[calc.rand(this.game.world.shipLists.length)].createStaticItem(mtx);
    }

    let hitbox = this.game.world.createBreakable(this.pos, 2);
    hitbox.type = 'object';
    hitbox.visible = false;
    hitbox.scale = 2;
    hitbox.pos = this.pos;
    hitbox.onHit = (bullet)=>{
      console.log('killed');
      this.hitbox.deleteSelf();
      this.model.deleteSelf();
      bullet.deleteSelf();
      this.msg.deleteSelf();
      this.deleteSelf();
      this.game.world.createExplosion(this.hitbox.pos,30);
      let vol = 130/(this.hitbox.pos.subVector(this.game.player.camera.getPosVector()).abs());
      window.sndBase.playByClass('explosion', vol);
      //rand(10)<5 ? anyutils.playSoundUrl('assets/sounds/expl1.mp3', vol) : anyutils.playSoundUrl('assets/sounds/expl2.mp3', vol);
      if (this.onKilled){
        this.onKilled();
      }
    }
    this.onProcess = (deltaTime)=>{
      hitbox.matrix = this.model.matrix;
      hitbox.matrix  = m4.scale(hitbox.matrix, hitbox.scale, hitbox.scale, hitbox.scale);
      hitbox.hitTransformed = hitbox.meshPointer.getTransformedVertexList(hitbox.matrix);
      hitbox.hitPosition = calc.getPosFromMatrix(hitbox.matrix);
      hitbox.hitDist = hitbox.meshPointer.maxDistance*hitbox.scale;;//;
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
 // onDelete(){
 //   this.model.deleteBuffers();
 // }

  render_( deltaTime){
    if (this.extLogic){
      this.extLogic(this);
    } else {
      this.logic(this.game.player.camera.getPosVector(), this.game.player.camera.getSpeedVector(), deltaTime);
    }
    this.weapon.render(deltaTime);
    this.pos.addVector(this.v.mul(deltaTime), true);
    this.model.matrix = polarToMatrix(this.pos, this.azi.x, this.azi.y);
    this.model.matrix = m4.scale(this.model.matrix, 1.5, 1.5, 1.5);
    this.nv = toDecart(this.azi);
  }

  shot(){
    let startPoint = this.pos.addVector(this.nv.mul(-3));
    let targetPoint = this.nv.mul(-1).addVector(this.v.mul(1/this.weapon.bulletSpeed));
    this.weapon.shot(startPoint, targetPoint, this.game.player.camera.getPosVector());  ////
  }

  accelerate(deltaTime){
    this.v.subVector(this.nv.normalize().mul(deltaTime * this.ACCELARATION), true);
    if (this.v.abs()>this.MAX_SPEED){this.v = this.v.normalize().mul(this.MAX_SPEED);}
  }

  directTo(dir, deltaTime){
    let orta = toPolar3d(dir);
    let az = azimutDifference(orta.x, this.azi.x);
    az = az>0 ? 1 : -1;  
    if (Math.abs(this.aziV.x)<0.2){
      this.aziV.x = this.aziV.x +az * this.TORQUE * deltaTime;
    }
    this.azi.x += this.aziV.x;//this.torq.mul(0.059).addVector(orta);
    this.aziV.x*=this.RADIAL_FRICTION;

    let kk=this.THETA_VAL;//1/(this.TORQUE * deltaTime);
    this.azi.y = ((this.azi.y*kk)+orta.y)/(kk+1);
    

    if (this.azi.y>Math.PI-0.01){this.azi.y=Math.PI-0.01};
    if (this.azi.y<0.01){this.azi.y=0.01};
  }
  
  /*shotMovingTarget(targetPos, targetSpeed){
    let dist = this.pos.subVector(targetPos).abs();
    let time = dist/this.weapon.bulletSpeed;
    let dir = this.pos.subVector(targetPos.addVector(targetSpeed.subVector(this.v.mul(1)).mul(time))).normalize();
    if (Math.abs(getAngleBetweenVectors(dir, this.nv))<Math.random()*0.61){
      if (Math.random()<0.3) {this.shot();}
    }
  }*/

  logic(playerPosition, playerSpeed, deltaTime){
    let dir;
    if (this.atack){
      if (this.pos.subVector(playerPosition).abs()>30){
        let dist = this.pos.subVector(playerPosition).abs();
        let time = dist/this.weapon.bulletSpeed;
       // dir = this.pos.subVector(playerPosition).normalize();
        dir = this.pos.subVector(playerPosition.addVector(playerSpeed.subVector(this.v.mul(1)).mul(time))).normalize();
        if (Math.abs(getAngleBetweenVectors(dir, this.nv))<Math.random()*0.61){
          if (dist<300){
            if (Math.random()<0.3) {this.shot();}
          }
        }

        //this.shotMovingTarget(playerPosition, playerSpeed);
        //this.weapon.shot(this.gl, app.glCanvas.scene.bullets, this.pos.addVector(this.nv.mul(-3)), 
        //this.nv.mul(-1).addVector(this.v.mul(1/this.weapon.bulletSpeed))
        //);
        ///this.nv.mul(-1) without speed;
      } else {
        dir = this.pos.subVector(playerPosition).mul(-1).normalize();
        this.atack = false;
      }
    } else {
      if (this.pos.subVector(playerPosition).abs()>(calc.rand(90)+50)){
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
   
    this.directTo(dir, deltaTime);

    if (Math.abs(getAngleBetweenVectors(dir, this.nv))<Math.PI/2){
      this.accelerate(deltaTime);
    }
    this.v.mul(this.FRICTION, true);
  }
}

function polarToMatrix(point, azimuth, theta){
  let mt = m4.identity();
  mt = m4.translate(mt, point.x, point.y, point.z);
  mt = m4.zRotate(mt, azimuth+Math.PI/2);
  mt = m4.xRotate(mt, theta+Math.PI/2);
  mt = m4.yRotate(mt, Math.PI);  
  return mt;
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

export default Enemy;