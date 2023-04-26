import anyutils from '../../any.utils';
import basics from '../basic-objects.gmob';
import Vector3d from '../../vector3d.dev';
import calc from '../../calc.utils';
const rand =calc.rand;
import Enemy from '../enemy.new';


import mUtils from './mission.utils';
import Game from '../game.new';
const randVector = mUtils.randVector;
const starChunk = mUtils.starChunk;

function mission3(game: Game){
  let rou = makeRingSpline(1000);
  game.player.camera.posY=-1050;
  game.player.camera.posX=0;
  game.player.camera.posZ=0;

  basics.makePhysicalAzi(game.world, new Vector3d(0, 1050, 100), 10, Math.PI/2, Math.PI/2, game.world.bigModelList);
  //basics.makePhysical(game.world, new Vector3d(0, 1050, 100), 10, game.world.bigModelList);
  basics.makePhysical(game.world, new Vector3d(0, 0, -1000), 1, game.world.marsModelList);
  let seczone = basics.makeCollactable(game.world, new Vector3d(0, 0, -1000), 1.25, game.world.marsModelList, ()=>{
    for (let i=0; i<12; i++){
      let en = new Enemy(game.gl, game, randVector(new Vector3d(0, -500, -500),500), new Vector3d(0,0,0), game.world.shipLists[rand(3)]);  
    }
  });
  seczone.visible=false;

  rou.forEach(it=>{
    starChunk(game, it, 400, 50);
    let brp = basics.makeBreakableExplosive(game.world, it, 0.1, game.world.meteModelList, 10, 30, ()=>{
      brp.deleteSelf();  
    });  
  })
  console.log(rou);
  recCollectable(game, rou ,0);
}

function recCollectable(game: Game, rou: Array<Vector3d>, i: number){
  console.log('recpoint '+i);
  if (rou[i]){
    let tg = game.addLabel('target', rou[i]);
    let ele = game.world.createMagic(rou[i], 90, false);
    let el = basics.makeCollactable(game.world, rou[i], 30, game.world.boxModelList, (player)=>{
      ele.deleteSelf();
      if (!rou[i+1]){
        //anyutils.playSoundUrl('assets/sounds/success.mp3');
        window.sndBase.playByClass('success');
        game.finish(true);
      }
      console.log('collected');
      tg.deleteSelf();
      //anyutils.playSoundUrl('assets/sounds/correct.mp3');
      window.sndBase.playByClass('correct');
      let en = new Enemy(game.gl, game, randVector(rou[i],500), new Vector3d(0,0,0), game.world.shipLists[rand(3)]);
      en.targetPointer = game.targets.addTarget('kill enemy');
      en.onKilled = ()=>{
        //anyutils.playSoundUrl('assets/sounds/correct.mp3');
        window.sndBase.playByClass('correct');
        en.targetPointer.setComplete();
      }  
      recCollectable(game,rou, i+1);
    }); 
    el.visible=false; 
    
  }
}

function makeRingSpline(r: number){
  let ir;
  let x;
  let y;
  let z;
  let res: Array<Vector3d> = [];
  let n=9
  for (let i=0; i<9; i++){
    ir = calc.degToRad(i*360/n);
    x = Math.sin(ir)*r;
    y = Math.cos(ir)*r;
    z = Math.sin(ir*4)*r/10;
    res.push(new Vector3d(x,y,z));
  }
  return res;
}

export default mission3;