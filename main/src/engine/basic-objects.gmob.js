const calc = require('../calc.utils.js');
const Vector3d = require('../vector3d.dev.js');
const Weapon = require('./weapon.new.js');
const Physic = require('./physic.new.js');

const GameObject = require('./game-object.new.js');
const Message = require('./point-msg.new.js');

const rand = calc.rand;
const anyutils = require('../any.utils.js');

function makePhysical (world, pos, scale, modelList, visible = true, type = 'solid', onContact, onHit){
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

function makeCollactable(world, pos, scale, modelList, onCollect){
  let ob = makePhysical(world, pos, scale, modelList, true, 'collectable', onCollect);
  ob.bonus = '';
  ob.bonus_count = 0;
  return ob;
}

function makeCollactable1(){
  let ob = game.world.createSolid(startPoint, 5, calc.makeNormRGBA('0f0'));
  ob.type = 'collectable';
  ob.bonus = 'bullets';
  ob.bonus_count = 30;
  return ob;
}

module.exports = {
  makePhysical,
  makeCollactable
};