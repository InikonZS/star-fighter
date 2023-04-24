import calc from '../calc.utils';
import Vector3d from '../vector3d.dev';
import Weapon from './weapon.new';
import Physic from './physic.new';

import GameObject from './game-object.new';
import Message from './point-msg.new';

const rand = calc.rand;
import anyutils from '../any.utils';
import World from './world.new';
import RenderableModelList from './renderable-model-list.new';

function makePhysicalAzi (world: World, pos: Vector3d, scale: number, azi: number, theta: number, modelList, visible = true, type = 'solid', onContact: ()=>void, onHit: ()=>void){
  let niMat = m4.identity();
  niMat = m4.translate(niMat, pos.x, pos.y, pos.z);
  niMat = m4.scale(niMat, scale, scale, scale);
  niMat = m4.zRotate(niMat, azi);
  niMat = m4.xRotate(niMat, theta);

  var el = modelList.createStaticItem(niMat, calc.makeNormRGBA());
  el.visible = visible;
  el.type = type;

  el.hitTransformed = el.meshPointer.getTransformedVertexList(el.matrix);
  el.hitPosition = calc.getPosFromMatrix(el.matrix);
  el.hitDist = el.meshPointer.maxDistance*scale;
  el.physicList = new Physic (el.hitTransformed);

  el.onContact = onContact;
  el.onHit = onHit;

  world.breakableList.addChild(el);
  return el;
}


function makePhysical (world: World, pos: Vector3d, scale: number, modelList: RenderableModelList, visible = true, type = 'solid', onContact, onHit: ()=>void){
  let niMat = m4.identity();
  niMat = m4.translate(niMat, pos.x, pos.y, pos.z);
  niMat = m4.scale(niMat, scale, scale, scale);

  var el = modelList.createStaticItem(niMat, calc.makeNormRGBA());
  el.visible = visible;
  el.type = type;

  el.hitTransformed = el.meshPointer.getTransformedVertexList(el.matrix);
  el.hitPosition = calc.getPosFromMatrix(el.matrix);
  el.hitDist = el.meshPointer.maxDistance*scale;
  el.physicList = new Physic (el.hitTransformed);

  el.onContact = onContact;
  el.onHit = onHit;

  world.breakableList.addChild(el);
  return el;
}

function makeCollactable(world: World, pos: Vector3d, scale: number, modelList, onCollect){
  let ob = makePhysical(world, pos, scale, modelList, true, 'collectable', onCollect);
  ob.onCollect = onCollect;
  ob.bonus = '';
  ob.bonus_count = 0;
  return ob;
}

function makeBreakable(world: World, pos: Vector3d, scale: number, modelList, onHit: ()=>void){
  let ob = makePhysical(world, pos, scale, modelList, true, 'solid', false, onHit);
  return ob;
}

function makeBreakableStrong(world: World, pos: Vector3d, scale: number, modelList, health, onKilled: ()=>void, onHurt: ()=>void){
  let ob = makePhysical(world, pos, scale, modelList, true, 'solid', false, (bullet)=>{
    if (bullet.damage!==undefined){
      ob.health-=bullet.damage;
    } else {
      ob.health--;
    }
    if (ob.health<=0){
      onKilled();
    }
    if (onHurt){
      onHurt(ob.health);
    }
  });
  ob.health = health;
  return ob;
}

function makeBreakableExplosive(world: World, pos: Vector3d, scale: number, modelList, health: number, exscale, onKilled: ()=>void){
  return makeBreakableStrong(world, pos, scale, modelList, health, (bullet)=>{
    world.createExplosion(pos, exscale);
    let vol = 130/(pos.subVector(world.game.player.camera.getPosVector()).abs());
    rand(10)<5 ? anyutils.playSoundUrl('assets/sounds/expl1.mp3', vol) : anyutils.playSoundUrl('assets/sounds/expl2.mp3', vol);
    onKilled();
  });
}

export default {
  makePhysicalAzi,
  makePhysical,
  makeCollactable,
  makeBreakable,
  makeBreakableStrong,
  makeBreakableExplosive
};