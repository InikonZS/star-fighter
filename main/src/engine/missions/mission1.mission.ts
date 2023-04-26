import anyutils from '../../any.utils';
import basics from '../basic-objects.gmob';
import Vector3d from '../../vector3d.dev';
import calc from '../../calc.utils';
const rand =calc.rand;
import Enemy from '../enemy2.new';
import { createBulletBox, createHealthBox} from '../collectable.new';

import mUtils from './mission.utils';
import Game from '../game.new';
import { TexturedItem } from '../solid-textured.new';
const randVector = mUtils.randVector;
const starChunk = mUtils.starChunk;

function mission1(game: Game){
  let baseSpawner = game.addTimer(15, ()=>{
    (Math.random()<0.5? createBulletBox : createHealthBox)(game, new Vector3d(rand(100)-50, rand(100)-50, rand(100)-50));
  });


  let brpHealthMax =200;
  let brf = game.world.createMagic(new Vector3d(150, 0, 0), 230, false);
  let brp = basics.makeBreakableStrong(game.world, new Vector3d(150, 0, 0), 5, game.world.boxModelList, brpHealthMax, (bullet)=>{
    brp.deleteSelf(); 
    brf.deleteSelf();
    prLab.deleteSelf();
    enList.forEach(it=>{
      it.atackObject = undefined;
    });
    window.sndBase.playByClass('failure');
    game.finish(false);
    //en.atactObject = undefined;
  },
  (health)=>{
    prLab.textPref = 'Protect It '+health+'/'+brpHealthMax;
    misTarget3.setText('Protect base '+health+'/'+brpHealthMax);
  });
  var prLab = game.addLabel('Protect It', brp.hitPosition);
  
  let enList: Array<Enemy> = [];

  let enMax = 30;
  let enKilled = 0;

  let makeEnemy = ()=>{
    let en: Enemy;
    if (calc.rand(5)<4){
      en = new Enemy (game.gl, game, randVector(new Vector3d(1000,0,0), 500), new Vector3d(0,0,0), game.world.shipLists[0] );
      en.atackObject = brp;
    } else {
      en = new Enemy (game.gl, game, randVector(new Vector3d(1000,0,0), 500), new Vector3d(0,0,0), game.world.shipLists[2] );
      en.TORQUE = 0.24;   
      en.ACCELARATION = 15; 
      en.THETA_VAL=8;  
    }
    enList.push(en);
    en.onKilled=()=>{
      enKilled++;
      misTarget1.setText('Kill all enemies '+enKilled+'/'+enMax);
      let nt: TexturedItem = big;
      for (let i=0; i< enList.length; i++){
        if (enList[i].isExists && enList[i].hitbox){
          nt = enList[i].hitbox;
          console.log('new friend target ',nt);
          break;
        }
      }
      //new Enemy (game.gl, game, randVector(new Vector3d(500,0,0), 500), new Vector3d(0,0,0), game.world.shipLists[0] );
      if(enList.length<enMax){
        setTimeout(()=>{
          makeEnemy();
        },2000);
      }
      friend.atackObject  = nt;
    }  
  }

  for (let i = 0; i<5; i++){
    makeEnemy();  
  }

  

  let friend = new Enemy (game.gl, game, new Vector3d(-50,0,0), new Vector3d(0,0,0), game.world.shipLists[3] );
  friend.atackObject = enList[0].hitbox;
  friend.weapon.bulletSpeed=320;
  friend.weapon.bulletCount =5000;
  friend.weapon.shotTime=0.015;
  friend.TORQUE = 0.54;   
  friend.ACCELARATION = 25; 
  friend.THETA_VAL=2;
  friend.msgPref = 'friend ';
  friend.msg.messageNode.color = '9f9';


  starChunk(game, new Vector3d(0,0,0), 500, 200);
  
  
  let baseLabel = game.addLabel('StartPoint', new Vector3d(0, 0, 0));
  let enBasePos = new Vector3d(1000, 0, 0);
  for (let i=0; i<30; i++){
    basics.makePhysicalAzi(game.world, randVector(new Vector3d(500,0,0), 150), 0.1, Math.random()*Math.PI*2, Math.random()*Math.PI, game.world.meteModelList);
  }
  var big = basics.makeBreakableStrong(game.world, enBasePos, 5, game.world.bigModelList, 50, ()=>{
    window.sndBase.playByClass('success');
    game.finish(true);
  },
  (health)=>{
    if(enKilled<enMax){
      big.health=50;
    } else {
      trg.textPref = 'target '+health+'/'+50;  
    }
  });

  starChunk(game, enBasePos, 500, 200);
  let trg = game.addLabel('target', enBasePos,);

  let misTarget1 = game.targets.addTarget('kill all enemies');
  let misTarget2 = game.targets.addTarget('Protect base');
  let misTarget3 = game.targets.addTarget('Destroy enemy base');
}

export default mission1;