import anyutils from '../../any.utils';
import basics from '../basic-objects.gmob';
import Vector3d from '../../vector3d.dev';
import calc from '../../calc.utils';
const rand =calc.rand;
import Enemy from '../enemy.new';
import Collectable from '../collectable.new';

import mUtils from './mission.utils';
import Game from '../game.new';
const randVector = mUtils.randVector;
const starChunk = mUtils.starChunk;

function mission4(game: Game){
  starChunk(game, new Vector3d(0,0,0), 500, 50);
  let baseLabel = game.addLabel('StartPoint', new Vector3d(0, 0, 0));
  
  basics.makePhysical(game.world, new Vector3d(0, 1000, 0), 1, game.world.mercuryModelList, true);

  basics.makePhysical(game.world, new Vector3d(0, -1000, 0), 1, game.world.marsModelList, true);

  let enBasePos = new Vector3d(100, 0, 0);
  starChunk(game, enBasePos, 500, 50);
  //let point1 = new Collectable(game, enBasePos, ''); 
  let point1 = basics.makeCollactable(game.world, enBasePos, 10, game.world.boxModelList);

  let p2 = game.world.createMagic(new Vector3d(0,0,0), 100, false);

  let brp = basics.makeBreakableStrong(game.world, new Vector3d(50, 0, 0), 1, game.world.bigModelList, 10, (bullet)=>{
    brp.deleteSelf();  
  });

  let target = game.targets.addTarget('come to target');
  point1.onCollect = ()=>{
    console.log('collected!!!');
    //anyutils.playSoundUrl('assets/sounds/correct.mp3');
    window.sndBase.playByClass('correct');
    target.setComplete();
    label1.deleteSelf();

    let en = new Enemy(game.gl, game, randVector(enBasePos, 500), new Vector3d(0,0,0));
    en.targetPointer = game.targets.addTarget('kill enemy');
    en.onKilled = ()=>{
      //anyutils.playSoundUrl('assets/sounds/correct.mp3');
      window.sndBase.playByClass('correct');
      en.targetPointer.setComplete();  
      
      let point1 = new Collectable(game, new Vector3d(0,0,0), ''); 
      game.targets.addTarget('return to start');
      point1.onCollect = ()=>{
        //anyutils.playSoundUrl('assets/sounds/success.mp3');
        window.sndBase.playByClass('success');
        game.finish();
      }
    }
  }
  var label1 = game.addLabel('target', enBasePos);
console.log (point1);
}

export default mission4;