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

function mission1(game){
  let baseSpawner = game.addTimer(15, ()=>{
    new Collectable(
      game, new Vector3d(rand(100)-50, rand(100)-50, rand(100)-50), 
      Math.random()<0.5? 'bullets':'health'
    ); 
  });



  

  //for (let i=0; i<10; i++){new Enemy(game.gl, game, randVector(enBasePos, 500), new Vector3d(0,0,0));}

  let solidsPos = new Vector3d(1000, 0, 0);
  for (let i=0; i<160; i++){
    game.world.createSolid(randVector(solidsPos, 500), rand(60)+10, {r:Math.random(),g:Math.random(),b:0.5});
  }

  for (let i=0; i<1; i++){
    let big = game.world.createSolid(randVector(new Vector3d (500,0,0),500), 1, {r:Math.random(),g:Math.random(),b:0.5}, 'bigModel');
  }
  //big.matrix = m4.xRotate(big.matrix, Math.PI/2);

  starChunk(game, new Vector3d(0,0,0), 500, 200);
  
  
  let baseLabel = game.addLabel('StartPoint', new Vector3d(0, 0, 0));
  let enBasePos = new Vector3d(2000, 0, 0);
  starChunk(game, enBasePos, 500, 200);
  game.addLabel('target', enBasePos,);
}

module.exports = mission1;