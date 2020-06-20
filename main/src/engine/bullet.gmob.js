const calc = require('../calc.utils.js');
const GameObject = require('./game-object.new.js');
const Message = require('./point-msg.new.js');

const rand = calc.rand;
const anyutils = require('../any.utils.js');

class Bullet extends GameObject{
  constructor(game, pos, speed, lifetime, color, weaponName){
    super();
    let world = game.world;
    let el;
    if (weaponName=="laser"){
      el = world.boxModelList.createStaticItem(m4.identity(), color);
      el.scale = 1;
    } else {
      let mt = m4.identity();
      el = world.bulPlasm.createStaticItem(mt, 3, 1, 0.05);
      el.scale = 5;
    }

    if (weaponName == 'phaser'){
      el.scale =15;
    }

    if (weaponName == 'railgun'){
      el.scale =45;
    }

    el.type = 'bullet';
    el.weaponName = weaponName

    el.position = pos.mul(1);
    el.speedVector = speed.mul(1);
    el.lifetime = lifetime;

    el.onProcess = (deltaTime) => {
      el.lifetime-=deltaTime;
      if (calc.isTimeout(el.lifetime)){
        el.deleteSelf();
      } else {
        let mt = m4.identity();
        
        el.speedVectorSync = el.speedVector.mul(deltaTime);
        el.position = el.position.addVector(el.speedVectorSync); //add deltaTime
        mt = m4.translate(mt,  el.position.x, el.position.y, el.position.z);
        mt = m4.scale(mt, el.scale, el.scale, el.scale);
        el.matrix = mt;
      }
    }

    el.onReact=(ob)=>{
      if (!(el && el.speedVectorSync)){ return;}

      if (ob.type == 'object'){
        if (calc.isCrossedSimple(ob.hitPosition, el.position, el.speedVectorSync, ob.hitDist)){
          if (calc.isCrossedMeshByLine(ob.hitTransformed, el.position, el.position.addVector(el.speedVectorSync))){
            ob.onHit(el);
          };  
        };
      }

      if (ob.type == 'breakable'){
        if (calc.isCrossedSimple(ob.hitPosition, el.position, el.speedVectorSync, ob.hitDist)){
          if (calc.isCrossedMeshByLine(ob.hitTransformed, el.position, el.position.addVector(el.speedVectorSync))){
            ob.deleteSelf();
            el.deleteSelf();
            world.createExplosion(ob.hitPosition, 15);
          };  
        };
      }

      if (ob.type == 'solid'){
        if (calc.isCrossedSimple(ob.hitPosition, el.position, el.speedVectorSync, ob.hitDist)){
          let reflected = ob.physicList.mirrorVector(el.position, el.speedVectorSync);//calc.mirrorVectorFromMesh(ob.hitTransformed, el.position, el.speedVectorSync);
          let mx =10;
          let npos = el.position;
          if (weaponName === 'phaser'){
            if (reflected){
              let vol = 130/(el.position.subVector(game.player.camera.getPosVector()).abs());
              anyutils.playSoundUrl('assets/sounds/hit1.mp3', vol)  
            }
            while (reflected && mx>=0){
              mx--;
              el.speedVector = reflected.normalize().mul(el.speedVector.abs()*0.5);
              npos = npos.addVector(reflected);
              reflected = ob.physicList.mirrorVector(npos, reflected)//calc.mirrorVectorFromMesh(ob.hitTransformed, npos, reflected);
              if (mx==0){
                world.createExplosion(npos, 5);
              }  
            }
          } else {
            let hp = calc.hitMeshPoint(ob.hitTransformed, el.position, el.speedVectorSync);
            if (hp){
              el.deleteSelf();
              if (weaponName == 'railgun'){
                world.createExplosion(hp, 435); 
              } else {
                world.createExplosion(hp, 35); 
              }
              let vol = 130/(hp.subVector(game.player.camera.getPosVector()).abs());
              anyutils.playSoundUrl('assets/sounds/hit2.mp3', vol)    
            };  
            
          }
        };
      }

      if (ob.type == 'danger'){//bug with incorrect near point
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
  }
}

module.exports = Bullet;