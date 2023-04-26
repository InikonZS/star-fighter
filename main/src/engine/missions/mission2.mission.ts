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

function mission2(game: Game){
  let baseSpawner = game.addTimer(15, ()=>{
    new Collectable(
      game, new Vector3d(rand(100)-50, rand(100)-50, rand(100)-50), 
      Math.random()<0.5? 'bullets':'health'
    ); 
  });

  let baseLabel = game.addLabel('StartPoint', new Vector3d(0, 0, 0));
  basics.makePhysical(game.world, new Vector3d(0, -1000, 0), 1, game.world.marsModelList, true); 
  basics.makePhysical(game.world, new Vector3d(1500, 300, 300), 0.7, game.world.neptuneModelList, true);
  basics.makePhysical(game.world, new Vector3d(100, 1000, 100), 3, game.world.meteoriteModelList, true);
  basics.makePhysical(game.world, new Vector3d(0, 1000, -100), 1, game.world.meteoriteModelList, true);
  basics.makePhysical(game.world, new Vector3d(1200, -400, 400), 1, game.world.meteoriteModelList, true);
  basics.makePhysical(game.world, new Vector3d(1200, -500, -200), 0.8, game.world.meteoriteModelList, true);
  basics.makePhysical(game.world, new Vector3d(1200, -500, 500), 0.5, game.world.meteoriteModelList, true);
  basics.makePhysical(game.world, new Vector3d(0, 0, -450), 0.5, game.world.meteoriteModelList, true);
  basics.makePhysical(game.world, new Vector3d(1000, 800, 300), 0.3, game.world.meteoriteModelList, true);
  basics.makePhysical(game.world, new Vector3d(0, 1000, 100), 1, game.world.meteoriteModelList, true);
  basics.makePhysical(game.world, new Vector3d(1200, -800, 500), 80, game.world.mete2ModelList, true);
  basics.makePhysical(game.world, new Vector3d(1200, -500, -500), 40, game.world.mete2ModelList, true);
  basics.makePhysical(game.world, new Vector3d(0, 0, 0), 1.7, game.world.corridorModelList, true);
  basics.makePhysical(game.world, new Vector3d(1000, -800, -200), 3, game.world.assaultModelList, true);

  basics.makePhysicalAzi(
    game.world,
    new Vector3d(0, 0, -200),
    1.7,
    1*Math.PI / 180,
    1*Math.PI / 180,

    game.world.corridorModelList
  );
  basics.makePhysicalAzi(
    game.world,
    new Vector3d(1000, 0, 1000),
    50,
    1*Math.PI / 180,
    100*Math.PI / 180,

    game.world.mete2ModelList
  );
  let enBasePos = new Vector3d(2000, 0, 0);

  for (let i=0; i<10; i++){
    let en = new Enemy(game.gl, game, randVector(enBasePos, 500), new Vector3d(0,0,0));
    let target = game.targets.addTarget('kill enemy '+i);
    en.targetPointer = target;
    en.onKilled = ()=>{
      en.targetPointer.setComplete();   
    }
  }
  game.targets.onChange();

  let solidsPos = new Vector3d(1500, 0, 0);
  for (let i=0; i<120; i++){
    game.world.createSolid(randVector(solidsPos, 1200), (rand(60)+10)/500, {r:Math.random(),g:Math.random(),b:0.5}, 'bigModel');
  }

  for (let i=0; i<1; i++){
    let big = game.world.createSolid(randVector(new Vector3d (500,500,0),500), 1, {r:Math.random(),g:Math.random(),b:0.5}, 'bigModel');
  }
  //big.matrix = m4.xRotate(big.matrix, Math.PI/2);
 
  starChunk(game, new Vector3d(0,0,0), 500, 100);
  starChunk(game, enBasePos, 500, 100);
  game.addLabel('target', enBasePos,);
}

export default mission2;