//const anyutils = require('../../any.utils');
import basics from '../basic-objects.gmob';
import Vector3d from '../../vector3d.dev';
import calc from '../../calc.utils';
import Game from '../game.new';
import GameObject from '../game-object.new';

const lScaler = 15;

function missionLabirint(game: Game){
  let len = 10;
  let spline = makeLineSpline(len, new Vector3d (0, 0, 0), -10*lScaler);
  recLabi(game, spline , 0, []);
}

function makeLineSpline(cnt: number, startVector: Vector3d, step: number){
  let res =[];
  let cp = startVector;
  let rot = 0;
  let cr = 0;
  let stepVector = new Vector3d(0,step,0);
  let seq = [0,2,2,1,2,0,1,1,2,0,0,2,0,0];
  let cont =seq.length;
  let orot =0;
  for (let i=0; i<cont; i++){
    res.push({cp, orot, cur:cr*Math.PI/2});
    let rt = seq[i]//calc.rand(6);
    if (rt==1){
      cr = cr-1;
      if (cr<0){cr=3}
      orot=1;
    }
    if (rt==2){
      cr = cr+1;
      if (cr>3){cr=0}
      orot=-1;
    }
    if (rt!=1 && rt!=2){
      orot =0;
    }
    cp=cp.addVector(stepVector);

    if (cr==0){stepVector = new Vector3d(0,step,0); }
    if (cr==1){stepVector = new Vector3d(step,0,0); }
    if (cr==2){stepVector = new Vector3d(0,-step,0); }
    if (cr==3){stepVector = new Vector3d(-step,0,0); }
    
    
  }
  return res;
};

function recLabi(game: Game, rou: { cp: Vector3d; orot: number; cur: number; }[], i: string | number, blocks: GameObject[]){
  console.log('recpoint '+i);
  basics.makePhysical(game.world, new Vector3d (0, 10*lScaler, 0 ),lScaler,game.world.tun2[0]);
  if (rou[i]){
    
    let block;
    let ci = i;
    if (rou[i].orot){
      if (rou[i].orot==1){
      block = basics.makePhysicalAzi(game.world, rou[i].cp, lScaler, -rou[i].cur - +(rou[i].orot<0)*Math.PI/2, Math.PI/2, game.world.tun2[calc.rand(game.world.tun2.length)]); 
      }
      if (rou[i].orot==-1){
      block = basics.makePhysicalAzi(game.world, rou[i].cp, lScaler, -rou[i].cur - +(rou[i].orot<0)*Math.PI/2, Math.PI/2, game.world.tun2[calc.rand(game.world.tun2.length)]); 
      }

    } else {
      block = basics.makePhysicalAzi(game.world, rou[i].cp, lScaler, rou[i].cur, Math.PI/2, game.world.tun1[calc.rand(game.world.tun1.length)]); 
    }
    block.onContact = (player)=>{
      player.damage(5, 1);
    };
    blocks.push(block);

    /*if (blocks.length<3){
      recLabi(game,rou, i+1, blocks);
      return;  
    }*/

    let tg = game.addLabel('target', rou[i].cp);
    let ele = game.world.createMagic(rou[i].cp, 190, false);
    let el = basics.makeCollactable(game.world, rou[i].cp, 100, game.world.boxModelList, (player)=>{
      //if (ci-i>3){
      if(blocks.length>=3){
        blocks[0].deleteSelf();
        blocks.shift();
      }
      //}
      ele.deleteSelf();
      if (!rou[i+1]){
        window.sndBase.playByClass('success');
        game.finish(true);
      }
      console.log('collected');
      tg.deleteSelf();
      window.sndBase.playByClass('correct');
      recLabi(game,rou, i+1, blocks);
    }); 
    el.visible=false; 
    
  }
 /* if (blocks.length<3){
    recLabi(game,rou, i+1, blocks);
    return;  
  }*/
}

export default missionLabirint;