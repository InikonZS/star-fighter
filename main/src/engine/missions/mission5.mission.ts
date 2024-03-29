import anyutils from '../../any.utils';
import basics from '../basic-objects.gmob';
import Vector3d from '../../vector3d.dev';
import calc from '../../calc.utils';
const rand =calc.rand;
import Enemy from '../enemy.new';
import { createBulletBox, createHealthBox } from '../collectable.new';

import mUtils from './mission.utils';
import Game from '../game.new';
const randVector = mUtils.randVector;
const starChunk = mUtils.starChunk;

function mission2(game: Game){
  let baseSpawner = game.addTimer(15, ()=>{
    (Math.random()<0.5? createBulletBox : createHealthBox)(game, new Vector3d(rand(100)-50, rand(100)-50, rand(100)-50));
  });

  let baseLabel = game.addLabel('StartPoint', new Vector3d(0, 0, 0));

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
    game.world.createSolid(randVector(solidsPos, 1500), (rand(60)+10)/500, {r:Math.random(),g:Math.random(),b:0.5}, 'bigModel');
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