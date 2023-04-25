//const World = require('./world.new');
import Vector3d from '../vector3d.dev';
import Camera from './camera.new';
import calc from '../calc.utils';
const rand = calc.rand;
import Weapon from './weapon.new';
import Timer from './timer.new';
import GameObject from './game-object.new';
//const anyutils = require('../any.utils');

import Phys from './physic.new';
import Game from './game.new';

const shieldTimeStd = 0.03;

class Player extends GameObject {
  game: Game;
  keyStates: Record<string, boolean>;
  isAlive: boolean;
  health: number;
  shieldEnergy: number;
  shieldTime: number;
  weapons: Weapon[];
  camera: Camera;
  model: GameObject;
  shieldModelScaler: number;
  shieldModel: any;
  shieldActivated: any;
  hitbox: GameObject;
  nearbox: GameObject;
  touch: any;
  speedVectorSync: any;
  currentWeaponIndex: number;
  refTimer: Timer;
  envTimer: Timer;

  constructor(gl: WebGLRenderingContext, game: Game, keyStates: Record<string, boolean>){
    super();
    this.game = game;
    this.keyStates = keyStates;
    let world = this.game.world

    this.isAlive = true;

    this.health = 100;
    this.game.glCanvas.gamePanel.data.health = this.health;
    this.game.glCanvas.gamePanel.refresh();

    this.shieldEnergy = 100;
    this.game.glCanvas.gamePanel.data.shield = this.shieldEnergy;
    this.game.glCanvas.gamePanel.refresh();
    //this.game.glCanvas.gamePanel.shield.node.textContent = 'shield: '+this.shieldEnergy;
    this.shieldTime = shieldTimeStd;

    //this.domStates = 

    this.weapons=[
      new Weapon(world, 0.15, 1.2, 130.1, 'laserShot', 'laser',100 , 2),
      new Weapon(world, 0.08, 0.7, 130.1, 'autoShot', 'auto', 1000, 1),
      new Weapon(world, 0.35, 5.2, 260.1, 'phaserShot', 'phaser', 60, 4),
      new Weapon(world, 0.65, 3.2, 740.1, 'railShot', 'railgun',70, 6),
    ];
    this.setWeapon(1);

    this.camera = new Camera(game.world, keyStates);
    this.camera.init();

    ///as gameobject
    let mtx = this.camera.getSelfModelMatrix();
    //this.model = this.game.world.selfModelList.createStaticItem(mtx);
    this.model = this.game.world.selfModelLists[game.props.shipIndex].createStaticItem(mtx);
    this.shieldModelScaler = 0.008;
    this.shieldModel = this.game.world.createFogMagicSphere(new Vector3d(0,0,0), this.shieldModelScaler, false);
    this.shieldModel.visible = false;
 
    let hitbox = makeHitBox(this, 2, (bullet)=>{
      if (this.shieldActivated) {return;}
      console.log('hit');
      bullet.deleteSelf();
      this.damage(4, 12);
    });
    this.hitbox = hitbox;
    
    let nearbox = makeHitBox(this, 5, (bullet)=>{
      console.log('near');
      window.sndBase.playByClass('near');
      //rand(10)<5 ? anyutils.playSoundUrl('assets/sounds/near1.mp3') : anyutils.playSoundUrl('assets/sounds/near2.mp3');
    });
    this.nearbox = nearbox;

    let shieldbox = makeHitBox(this, 3, (bullet)=>{
      if (!this.shieldActivated) {return;}
      console.log('shielded');
      window.sndBase.playByClass('error');
      //rand(10)<5 ? anyutils.playSoundUrl('assets/sounds/error.mp3') : anyutils.playSoundUrl('assets/sounds/error.mp3');
    });
    this.nearbox = nearbox;
//this.touch = new Phys(this.nearbox.mesh.vertexList);
    this.onProcess = (deltaTime) =>{
      this.model.matrix = this.camera.getSelfModelMatrix();

      let mt = m4.identity();
      let pos = this.camera.getPosVector();
      mt = m4.translate(mt, pos.x, pos.y, pos.z);
      let scale_ = this.shieldModelScaler;
      mt = m4.scale(mt, scale_, scale_, scale_);
      this.shieldModel.matrix = mt;
      //this.shieldModel.matrix = m4.scale(this.camera.getSelfModelMatrix(), this.shieldModelScaler,this.shieldModelScaler,this.shieldModelScaler);
      hitbox.process_(deltaTime);
      nearbox.process_(deltaTime);
      shieldbox.process_(deltaTime);
      //this.shieldModel.process_(deltaTime);
      //this.camera.vZ+=1*deltaTime; GRAVITY
      if (this.touch){
        this.touch.destroy();
        this.touch = undefined;
      }
      this.touch = new Phys(this.nearbox.hitTransformed);
      this.speedVectorSync = this.camera.getSpeedVector().mul(deltaTime);
      //this.render_(deltaTime);
    }

    this.onReact = (ob)=>{
    if (!(this.camera.lastPos)){ return;}
      if (ob.type == 'solid'){
        if (calc.isCrossedSimple(ob.hitPosition, this.camera.lastPos, this.camera.getPosVector().subVector(this.camera.lastPos), ob.hitDist*1.2)){
          //if (calc.rand(100)==1){console.log('shit!!!')}
          //let spv = this.speedVectorSync;
          //if (this.speedVectorSync.abs()<0.01){spv = this.camera.getSpeedVector().normalize().mul(0.01); }
          if (ob.physicList.isCrossedByPhys(this.touch)){
            let reflected = ob.physicList.mirrorVector(this.camera.lastPos, this.camera.getPosVector().subVector(this.camera.lastPos).mul(100));
            if (reflected){
              this.camera.applySpeed(this.speedVectorSync);
              this.camera.setSpeedVector (reflected.normalize().mul(this.camera.getSpeedVector().abs()*0.73)); 
              if (ob.onContact){
                ob.onContact(this);
              } 
            } else {
              //this.camera.applySpeed(this.speedVectorSync);
              //this.camera.setSpeedVector(this.camera.getSpeedVector().mul(-1)); ???
            }
          }
         /* */
        };
      }

      if (ob.type == 'collectable'){
        if (calc.isCrossedSimple(ob.hitPosition, this.camera.getPosVector(), this.speedVectorSync, ob.hitDist)){
          if (ob.bonus == 'bullets'){
            this.weapons[this.currentWeaponIndex-1].bulletCount+=ob.bonus_count;
            window.sndBase.playByClass('bulletBonus')
            //anyutils.playSoundUrl('assets/sounds/reload.mp3')
            ob.deleteSelf();
            //this.game.glCanvas.gamePanel.bullets.node.textContent = 'bullets: '+;
            
            let bullets = this.weapons[this.currentWeaponIndex-1].bulletCount;
            this.game.glCanvas.gamePanel.data.bullets = bullets;
            this.game.glCanvas.gamePanel.refresh();
            
          }

          if (ob.bonus == 'health'){
            this.health = incLim(this.health, ob.bonus_count, 100);
            //anyutils.playSoundUrl('assets/sounds/correct.mp3')
            window.sndBase.playByClass('healthBonus');
            ob.deleteSelf();
            //this.game.glCanvas.gamePanel.health.node.textContent = 'health: '+this.health;
            this.game.glCanvas.gamePanel.data.health = this.health;
            this.game.glCanvas.gamePanel.refresh();
          }

          if (ob.bonus == ''){
            //anyutils.playSoundUrl('assets/sounds/error.mp3');
            ob.deleteSelf();
          }
          
          if (ob.onCollect){
            ob.onCollect(this);
          }
        };
      }
    }

    this.refTimer = new Timer(0.1, ()=>{
      //this.game.glCanvas.gamePanel.speed.node.textContent = 'speed: '+;
      let speed = Math.round(this.camera.getSpeedVector().abs()*10)/10;
      this.game.glCanvas.gamePanel.data.speed = speed;
      this.game.glCanvas.gamePanel.refresh();
    });

    this.envTimer = new Timer(0.3, ()=>{
      let sv = this.camera.getSpeedVector().mul(4);
      if (sv.abs()>12){
        starChunk(this.game, sv.addVector(this.camera.getPosVector()), 100, 3);  
      } 
    });

    this.game.world.objectList.addChild(this);
    /////////
  }

 // destructor(){

 // }

  damage(pointsMin: number, pointsRand=0){
    window.sndBase.playByClass('hit');
    //rand(10)<5 ? anyutils.playSoundUrl('assets/sounds/hit1.mp3') : anyutils.playSoundUrl('assets/sounds/hit2.mp3');
    this.health-=rand(pointsRand)+pointsMin;
    //this.game.glCanvas.gamePanel.health.node.textContent = 'health: '+this.health;
    this.game.glCanvas.gamePanel.data.health = this.health;
    this.game.glCanvas.gamePanel.refresh();
    if (this.health<0){
      console.log('dead');
      this.isAlive = false;
      this.game.glCanvas.keyboardState.shot = false;
      this.game.world.createExplosion(this.camera.getPosVector().subVector(this.camera.getCamNormal().mul(2.10)),40);
      window.sndBase.playByClass('explosion');
     
      setTimeout(()=>{
        this.game.finish(false);
      },50);
    }
  }

  render_(deltaTime: number){
    this.refTimer.process(deltaTime);
    this.envTimer.process(deltaTime);
    if (this.keyStates.shot){
      this.shot(this.currentWeaponIndex-1);
    }

    this.shieldTime-=deltaTime;
    if (this.keyStates.space){
      this.shieldActivate(deltaTime);
    } else {
      this.shieldCharge(deltaTime);
      this.shieldActivated = false;
      this.shieldModel.visible = false;
    }

    this.camera.process(deltaTime);  

    this.weapons.forEach(it=>it.render(deltaTime)); 
  }

  shot(weaponIndex: number){

    //if (this.bullets>0){
      if (this.weapons[weaponIndex].shot(this.camera.getPosVector().subVector(this.camera.getCamNormal().mul(2.10)), 
      this.camera.getCamNormal().mul(-1).addVector(this.camera.getSpeedVector().mul(1/this.weapons[weaponIndex].bulletSpeed))
      )){
        //this.bullets--;
        //this.game.glCanvas.gamePanel.bullets.node.textContent = 'bullets: '+this.weapons[weaponIndex].bulletCount;
        let bullets = this.weapons[weaponIndex].bulletCount;
        this.game.glCanvas.gamePanel.data.bullets = bullets;
        this.game.glCanvas.gamePanel.refresh();
      }
    //}
  }
  
  shieldActivate(deltaTime: number){
    if (this.shieldEnergy>0){
      this.shieldModel.visible = true;
      //console.log(this.shieldTime);
      this.shieldActivated = true;
      if (calc.isTimeout(this.shieldTime)){
        this.shieldEnergy-=2;
        this.shieldTime = shieldTimeStd;
        //this.game.glCanvas.gamePanel.shield.node.textContent = 'shield: '+this.shieldEnergy;
        this.game.glCanvas.gamePanel.data.shield = this.shieldEnergy;
        this.game.glCanvas.gamePanel.refresh();
      }
    } else {
      this.shieldActivated = false;
      this.shieldModel.visible = false;
      //this.shieldTime = 0;  
    }
  }

  shieldCharge(deltaTime:number){
    if (this.shieldEnergy<100){
      if (calc.isTimeout(this.shieldTime)){
        this.shieldEnergy+=0.2;
        this.shieldTime = shieldTimeStd;
        this.game.glCanvas.gamePanel.data.shield = this.shieldEnergy;
        this.game.glCanvas.gamePanel.refresh();
      }
    }
  }

  setWeapon(weaponIndex: number){
    this.currentWeaponIndex = weaponIndex;
    //this.game.glCanvas.gamePanel.weapon.node.textContent = this.weapons[this.currentWeaponIndex-1].weaponName;
    //this.game.glCanvas.gamePanel.bullets.node.textContent = 'bullets: '+this.weapons[weaponIndex-1].bulletCount;
    
    this.game.glCanvas.gamePanel.data.weapon = this.weapons[this.currentWeaponIndex-1].weaponName;
    let bullets = this.weapons[weaponIndex-1].bulletCount;
    this.game.glCanvas.gamePanel.data.bullets = bullets;
    this.game.glCanvas.gamePanel.refresh();
  }
}

function makeHitBox(gameObject:GameObject & {game: Game, camera: Camera}, scale_: number, onHit: (bullet: GameObject)=>void){
  let hitbox = gameObject.game.world.createBreakable(gameObject.camera.getPosVector(), scale_);
  hitbox.type = 'object';
  hitbox.visible = false;
  hitbox.scale = scale_;
  hitbox.onHit = onHit;
  hitbox.process_ = (deltaTime)=>{
    //hitbox.matrix = gameObject.model.matrix;
    let mt = m4.identity();
    let pos = gameObject.camera.getPosVector();
    mt = m4.translate(mt, pos.x, pos.y, pos.z);
    mt = m4.scale(mt, scale_, scale_, scale_);

    hitbox.matrix = mt;

    hitbox.hitTransformed = hitbox.meshPointer.getTransformedVertexList(hitbox.matrix);
    hitbox.hitPosition = calc.getPosFromMatrix(hitbox.matrix);
    hitbox.hitDist = hitbox.meshPointer.maxDistance*hitbox.scale;
  }  
  return hitbox;
}

function starChunk(game: Game, center: Vector3d, size: number, count: number){
  for (let i=0; i<count; i++){
    
    let a = new Vector3d(Math.random()-0.5, Math.random()-0.5, Math.random()-0.5);
   // a = a.normalize();
    a = a.mul(size).addVector(center);
    
    let mt = m4.identity();
    mt = m4.translate(mt, a.x, a.y, a.z);
    mt = m4.xRotate(mt, Math.random()*Math.PI*2);
    mt = m4.yRotate(mt, Math.random()*Math.PI);

    let fl = true;
    game.world.chunkList.childList.forEach(it=>{
      if (it.centerPoint && it.centerPoint.subVector(center).abs()<10){
        fl = false;
      }
    });
    if (fl){
      let cl = game.world.chunkList.createStaticItem(mt, {r:Math.random(),g:Math.random(),b:0.5}, 500);//del magic num
      cl.centerPoint=center;
      cl.onProcess=()=>{
        if (game.player.camera.getPosVector().subVector(center).abs()>300){
          cl.deleteSelf();
        }
      }
    }
  }  
}

function incLim(val: number, inc: number, lim: number){
  let nv = val+=inc;
  return nv < lim ? nv : lim;
}

/*function qubeLines(size, pos){
  p = [
    new Vector3d(-1, -1, -1).mul(size).addVector(pos),
    new Vector3d(-1, -1, 1).mul(size).addVector(pos),
    new Vector3d(-1, 1, -1).mul(size).addVector(pos),
    new Vector3d(-1, 1, 1).mul(size).addVector(pos),
    new Vector3d(1, -1, -1).mul(size).addVector(pos),
    new Vector3d(1, -1, 1).mul(size).addVector(pos),
    new Vector3d(1, 1, -1).mul(size).addVector(pos),
    new Vector3d(1, 1, 1).mul(size).addVector(pos),
  ];
  lines = [
    p[0], p[1],
    p[1], p[3],
    p[3], p[2],
    p[2], p[0],
    p[4], p[5],
    p[5], p[7],
    p[7], p[6],
    p[6], p[4],
    p[0], p[4],
    p[1], p[5],
    p[2], p[6],
    p[3], p[7],
  ];
  return lines;
}
*/
/*
else { 

  let po = qubeLines(1, this.camera.getPosVector());
  for (let i=0; i<po.length/2; i++){
    reflected = calc.mirrorVectorFromMesh(ob.hitTransformed, po[i*2], po[i*2+1]);
    if (reflected){
      this.camera.setSpeedVector (this.camera.getSpeedVector().mul(-1));  
      break;
    }
  }
}*/

export default Player;