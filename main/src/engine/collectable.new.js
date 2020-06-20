const calc = require('../calc.utils.js');
const Vector3d = require('../vector3d.dev.js');
const Weapon = require('./weapon.new.js');

const GameObject = require('./game-object.new.js');
const Message = require('./point-msg.new.js');

const rand = calc.rand;
const anyutils = require('../any.utils.js');

class Collectable extends GameObject{
  constructor(game, startPoint, type , count){
    super();
    this.game = game;
    if (type == 'bullets'){
      let ob = game.world.createSolid(startPoint, 5, calc.makeNormRGBA('0f0'));
      ob.type = 'collectable';
      ob.bonus = 'bullets';
      ob.bonus_count = 30;
      //this.game.world.objectList.addChild(this);
      return ob;
    }

    if (type == 'health'){
      let ob = game.world.createSolid(startPoint, 5, calc.makeNormRGBA('f00'));
      ob.type = 'collectable';
      ob.bonus = 'health';
      ob.bonus_count = 25;
      //this.game.world.objectList.addChild(this);
      return ob;
    }

//    if (){
      let ob = game.world.createSolid(startPoint, 5, calc.makeNormRGBA('0f0'));
      ob.type = 'collectable';
      ob.bonus = '';
      ob.bonus_count = 0;
      //this.game.world.objectList.addChild(this);
      return ob;
//    }
  }
}

module.exports = Collectable;