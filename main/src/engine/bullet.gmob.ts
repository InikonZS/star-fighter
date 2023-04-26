import calc from '../calc.utils';
import GameObject from './game-object.new';
import Timer from './timer.new';
import Message from './point-msg.new';

const rand = calc.rand;
import anyutils from '../any.utils';
import Game from './game.new';
import Vector3d from '../vector3d.dev';
export interface IGenericBullet {
  reflectable: boolean,
  scale: number,
  azi: number,
  theta: number,
  type: string,
  damage: number,
  timer: Timer,
  hitExplosionScale: number,
  reflectionAcceleration: number,
  lastSpeedVectorSync: Vector3d,
  lastPosition: Vector3d,
  speedVectorSync: Vector3d,
  //onHit: (bullet: IGenericBullet)=>void;
}

function makeGenericBullet(game: Game, basicObject:any, pos: Vector3d, scale=1, azi=0, theta=0, speed: Vector3d, lifetime=1, damage=1, reflectable=false){
  let el: GameObject & IGenericBullet = basicObject;
  let world = game.world;

  el.reflectable = reflectable;
  //el.position = pos;
  el.scale = scale;
  el.azi = azi;
  el.theta = theta;
  el.type = 'bullet';
  el.damage = damage;
  //el.weaponName = weaponName;
  el.position = pos.mul(1);
  el.speedVector = speed.mul(1);

  el.hitExplosionScale = 35;
  el.reflectionAcceleration = 0.5;
  //el.hitSoundUrl = 

  el.timer = new Timer (lifetime, ()=>{
    el.deleteSelf();
  });

  el.onProcess = (deltaTime) => {
    el.timer.process(deltaTime);
    el.lastSpeedVectorSync = el.speedVectorSync;
    el.lastPosition = el.position;
    el.speedVectorSync = el.speedVector.mul(deltaTime);
    //if (el.lastSpeedVectorSync){
    el.position = el.position.addVector(el.speedVectorSync);
    //}
    let mt = calc.matrixFromPos(el.position, el.scale, el.azi, el.theta);
    el.matrix = mt;
  }

  el.onReact=(ob)=>{
    if (!(el && el.speedVectorSync&& el.lastPosition)){ return;}

    if (ob.type == 'object'){
      if (calc.isCrossedSimple(ob.hitPosition, el.position, el.speedVectorSync, ob.hitDist)){
        if (calc.isCrossedMeshByLine(ob.hitTransformed, el.position, el.position.addVector(el.speedVectorSync))){
          ob.onHit(el);
        };  
      };
    }

    if (ob.type == 'breakable'){ //legacy
      if (calc.isCrossedSimple(ob.hitPosition, el.position, el.speedVectorSync, ob.hitDist)){
        if (calc.isCrossedMeshByLine(ob.hitTransformed, el.position, el.position.addVector(el.speedVectorSync))){
          ob.deleteSelf();
          el.deleteSelf();
          world.createExplosion(ob.hitPosition, 15);
        };  
      };
    }

    if (ob.type == 'solid'){ //main modern func 
      if (calc.isCrossedSimple(ob.hitPosition, el.lastPosition, el.position.subVector(el.lastPosition), ob.hitDist)){
        let reflected = ob.physicList.mirrorVector(el.lastPosition, el.position.subVector(el.lastPosition));//calc.mirrorVectorFromMesh(ob.hitTransformed, el.position, el.speedVectorSync);
        let mx =10;
        let npos = el.position;
        let hp;
        let hitted;
        if (el.reflectable){
          if (reflected){
            hitted = true;
            let vol = 130/(el.position.subVector(game.player.camera.getPosVector()).abs());
            //anyutils.playSoundUrl('assets/sounds/hit1.mp3', vol)  
            window.sndBase.playByName('hit1', vol); 
          }
          while (reflected && mx>=0){
            mx--;
            el.speedVector = reflected.normalize().mul(el.speedVector.abs()*el.reflectionAcceleration);
            npos = npos.addVector(reflected);
            reflected = ob.physicList.mirrorVector(npos, reflected);
            if (mx==0){
              world.createExplosion(npos, 5);
            }  
          }
        } else {
          hp = ob.physicList.hitMeshPoint(el.lastPosition, el.position.subVector(el.lastPosition));

          if (hp&&hp.dv){
            el.deleteSelf();
            world.createExplosion(hp.dv, el.hitExplosionScale); 
            let vol = 130/(hp.dv.subVector(game.player.camera.getPosVector()).abs());
            //anyutils.playSoundUrl('assets/sounds/hit2.mp3', vol)   
            window.sndBase.playByName('hit2', vol/3); 
          };  
          
        }
        if(hp||hitted){
          el.position =el.lastPosition;
          if (ob.onHit){
            ob.onHit(el);
          }
       }
      };
    }
    
    if (ob.type == 'danger'){//bug with incorrect near point // legacy
      if (calc.isCrossedSimple(ob.hitPosition, el.position, el.speedVectorSync, ob.hitDist)){
        let hp = calc.hitMeshPoint(ob.hitTransformed, el.position, el.speedVectorSync);
        if (hp){
          el.deleteSelf();
          world.createExplosion(hp, 5);
        };  
      };
    }
  }

  world.bulletList.addChild(el);
  return el;
}

function makeBoxBullet(game: Game, pos: Vector3d, speed: Vector3d, lifetime: number, color: any, weaponName: string, damage: number, reflectable: boolean){
  let el = game.world.boxModelList.createStaticItem(m4.identity(), color); 
  el.weaponName = weaponName;
  let elm = makeGenericBullet(game, el, pos, 1, 0, 0, speed, lifetime, damage, reflectable);
  return elm;
}

function makeAnimatedBullet(game: Game, pos: Vector3d, scale: number, speed: Vector3d, lifetime: number, weaponName: string, damage: number, reflectable: boolean){
  let el = game.world.bulPlasm.createStaticItem(m4.identity(), 3, 1, 0.05);
  el.weaponName = weaponName;
  let elm = makeGenericBullet(game, el, pos, scale, 0, 0, speed, lifetime, damage, reflectable);
  return elm;
}

export default {
  makeGenericBullet,
  makeBoxBullet,
  makeAnimatedBullet
};