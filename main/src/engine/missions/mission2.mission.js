const anyutils = require('../../any.utils.js');
const basics = require('../basic-objects.gmob.js');
const Vector3d = require('../../vector3d.dev.js');
const calc = require('../../calc.utils.js');
const rand =calc.rand;
const Enemy = require('../enemy.new.js');
const Collectable = require('../collectable.new.js');

const mUtils = require('./mission.utils.js');
const randVector = mUtils.randVector;
const starChunk = mUtils.starChunk;

function mission2(game){
  let baseSpawner = game.addTimer(15, ()=>{
    new Collectable(
      game, new Vector3d(rand(100)-50, rand(100)-50, rand(100)-50), 
      Math.random()<0.5? 'bullets':'health'
    ); 
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

module.exports = mission2;