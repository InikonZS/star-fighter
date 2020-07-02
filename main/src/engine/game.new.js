const World = require('./world.new.js');
const Player = require('./player.new.js');
const Vector3d = require('../vector3d.dev.js');
const calc = require('../calc.utils.js');
const rand = calc.rand;

const Enemy = require('./enemy.new.js');
const Message = require('./point-msg.new.js');
const GameObject = require('./game-object.new.js');
const Timer = require('./timer.new.js');
const Collectable = require('./collectable.new.js');//require('./collectable.new.js');
const TargetList = require('./mission-target.new.js');
const anyutils = require('../any.utils.js');
const utils = require('../any.utils.js');

const basics = require('./basic-objects.gmob.js');

const missionLabirint = require('./missions/labirint.mission.js');
const missionGarage = require('./missions/garage.mission.js');
const mission1 = require('./missions/mission1.mission.js');
const mission2 = require('./missions/mission2.mission.js');
const mission3 = require('./missions/mission3.mission.js');
const mission4 = require('./missions/mission4.mission.js');

class Game{
  constructor(gl, glCanvas){
    this.gl = gl;
    this.glCanvas = glCanvas;
    console.log('restarting game');
    this.props = {
      shipIndex:0
    }
    if (!this.world){
      this.world = new World(gl, this);
    }
    this.player = new Player(gl, this, glCanvas.keyboardState);
    this.timers = new GameObject();
    this.messageList = new GameObject();
    this.targets = new TargetList(this);

   /* document.addEventListener('beforeunload', ()=>{
      this.clear();
    })*/
  }

  render(aspect, deltaTime){
    this.player.render_(deltaTime);
    //this.targets.render(deltaTime);
    var camera = this.player.camera;

    var viewMatrix = calc.makeCameraMatrix(aspect, camera.getMatrix());//camera.camRX, camera.camRY, camera.camRZ, camera.posX, camera.posY, camera.posZ);

    this.world.render(viewMatrix, deltaTime);
    //this.message.refresh(viewMatrix, new Vector3d(0,0,0), 'Kill_It '+Math.round(this.player.camera.getPosVector().subVector(new Vector3d(0,0,0)).abs()*10)/10+ 'km');
    this.messageList.process(deltaTime);
    this.timers.process(deltaTime);
    this.messageList.render(this.gl, {viewMatrix});
    //this.player.render_(deltaTime);
  }

  addTimer(interval, onTimeout){
    let tm = new Timer(interval, onTimeout);
    this.timers.addChild(tm);
    return tm;
  }

  addLabel(text, vector){
    let msg = new Message(this.glCanvas, '', 'f4f', vector);
    msg.onProcess = ()=>{
      let dist = this.getPlayerPos().subVector(msg.vector).abs()*10;
      msg.text = text+ ': '+Math.round(dist)/10+ 'km';
    }
    this.messageList.addChild(msg);
    return msg;
  }

  getPlayerPos(){
    return this.player.camera.getPosVector();
  }

  clear(){
   // this.glCanvas.stop();
    //this.world.clear();
  
    this.world.graphicList.childList.forEach(it=>{
      it.childList.forEach(jt=>{
        jt.deleteAllChild();
      });
    });
    this.world.createSkybox();
    this.player = new Player(this.gl, this, this.glCanvas.keyboardState); 
    this.player.camera.init();
    this.timers.clear();

    this.messageList.clear();
    this.targets.clear();
    this.targets.refresh();

    //this.world = new World(this.gl, this);  
   // this.glCanvas.start();
  }
  
  loadMission(name, props){
    this.clear();
    this.props = props;
    this.player.model.visible=true;
    if (name=='1'){
      missionLabirint(this);
     // mission3(this);
    } 

    if (name=='2'){
      mission4(this);
    } 

    if (name=='3'){
      mission2(this);
    } 

    if (name=='4'){
      mission1(this);
    } 

    if (name=='5'){
      mission3(this);
    } 

    if (name=='garage'){
      missionGarage(this);
    } 
  }

  finish(win){
    this.glCanvas.keyboardState.shot = false;
    this.glCanvas.menu.activate();
    if (win){
      this.glCanvas.menu.menu.selectPage(this.glCanvas.menu.gameOverMenu); 
    } else {
      this.glCanvas.menu.menu.selectPage(this.glCanvas.menu.gameOverMenu);  
    }
    document.exitPointerLock();
  }
}











/*
function missionLabirint(game){
  let len = 10;
  /*let spline = [
    {cp:new Vector3d(0,100,0), orot:0, cur:0}, 
    {cp:new Vector3d(0,200,0), orot:0, cur:0},
    {cp:new Vector3d(0,300,0), orot:0, cur:0}, 
    {cp:new Vector3d(0,400,0), orot:1, cur:-Math.PI+0*Math.PI/2 },
    {cp:new Vector3d(-100,400,0), orot:0, cur:-Math.PI/2}, 
    {cp:new Vector3d(-200,400,0), orot:0, cur:-Math.PI/2},  
    {cp:new Vector3d(-300,400,0), orot:1, cur:-Math.PI-Math.PI/2-1*Math.PI/2 },
    {cp:new Vector3d(-300,500,0), orot:0, cur:0}, 
    {cp:new Vector3d(-300,600,0), orot:0, cur:0}, 
  ];*/
  /*let spline = [
    {cp:new Vector3d(0,100,0), orot:1, cur:0},
    {cp:new Vector3d(100,100,0), orot:0, cur:Math.PI/2},
    {cp:new Vector3d(200,100,0), orot:-1, cur:0}  
  ];
  
  spline.forEach(it=>{
    if (it.orot){
      block = basics.makePhysicalAzi(game.world, it.cp, 10, it.cur -(it.orot<0)*Math.PI/2, Math.PI/2, game.world.tun2); 
    } else {
      block = basics.makePhysicalAzi(game.world, it.cp, 10, it.cur, Math.PI/2, game.world.tun1); 
    }
  });*/
/*  let spline = makeLineSpline(len, new Vector3d (0, 0, -200), -200);
  recLabi(game, spline , 0, []);
}

function makeLineSpline(cnt, startVector, step){
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
    rt = seq[i]//calc.rand(6);
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

function recLabi(game, rou, i, blocks){
  console.log('recpoint '+i);
  if (rou[i]){
    
    let block;
    let ci = i;
    if (rou[i].orot){
      if (rou[i].orot==1){
      block = basics.makePhysicalAzi(game.world, rou[i].cp, 20, -rou[i].cur - +(rou[i].orot<0)*Math.PI/2, Math.PI/2, game.world.tun2); 
      }
      if (rou[i].orot==-1){
      block = basics.makePhysicalAzi(game.world, rou[i].cp, 20, -rou[i].cur - +(rou[i].orot<0)*Math.PI/2, Math.PI/2, game.world.tun2); 
      }

    } else {
      block = basics.makePhysicalAzi(game.world, rou[i].cp, 20, rou[i].cur, Math.PI/2, game.world.tun1); 
    }
    block.onContact = (player)=>{
      player.damage(0, 1);
    };
    blocks.push(block);

    /*if (blocks.length<3){
      recLabi(game,rou, i+1, blocks);
      return;  
    }*/

/*    let tg = game.addLabel('target', rou[i].cp);
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
        anyutils.playSoundUrl('assets/sounds/success.mp3');
        game.finish(true);
      }
      console.log('collected');
      tg.deleteSelf();
      anyutils.playSoundUrl('assets/sounds/correct.mp3');
      recLabi(game,rou, i+1, blocks);
    }); 
    el.visible=false; 
    
  }
 /* if (blocks.length<3){
    recLabi(game,rou, i+1, blocks);
    return;  
  }*/
//}

module.exports = Game;