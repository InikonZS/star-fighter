import calc from '../calc.utils';
import Vector3d from '../vector3d.dev';
import Weapon from './weapon.new';

import GameObject from './game-object.new';
import Message from './point-msg.new';

const rand = calc.rand;
import anyutils from '../any.utils';
import Game from './game.new';

class Collectable extends GameObject{
  game: Game;
  
  constructor(game: Game, startPoint: Vector3d, type: string , count?: number){
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

export default Collectable;