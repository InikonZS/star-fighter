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

function starChunk(game, center, size, count){
  for (let i=0; i<count; i++){
    
    let a = new Vector3d(Math.random()-0.5, Math.random()-0.5, Math.random()-0.5);
   // a = a.normalize();
    a = a.mul(size).addVector(center);
    
    let mt = m4.identity();
    mt = m4.translate(mt, a.x, a.y, a.z);
    mt = m4.xRotate(mt, Math.random()*Math.PI*2);
    mt = m4.yRotate(mt, Math.random()*Math.PI);
    game.world.chunkList.createStaticItem(mt, {r:Math.random(),g:Math.random(),b:0.5}, 1000);//del magic num
  }  
}

function randVector(center, size){
  let a = new Vector3d(Math.random()-0.5, Math.random()-0.5, Math.random()-0.5);
  a = a.mul(size).addVector(center);  
  return a;
}

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


function mission4(game){
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


function mission3(game){
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
    let brp = basics.makeBreakableExplosive(game.world, it, 0.1, game.world.meteModelList, 10, 30, (bullet)=>{
      brp.deleteSelf();  
    });  
  })
  console.log(rou);
  recCollectable(game, rou ,0);
}

function missionGarage(game){
  game.player.camera.posY=0;
  game.player.camera.posX=0;
  game.player.camera.posZ=-5;

  let cx=0;
  let cy=0;
  let ks = 0.01;

  let autoRot = true;

  game.glCanvas.menu.touchPad.onChange = (dx_, dy_, cx_, cy_)=>{
    cx = cx_*ks;
    cy = cy_*ks;  
    autoRot = false;
  }

  let currentIndex =game.glCanvas.menu.missionOptions.shipIndex||0;
  

  game.glCanvas.menu.prevShip.click = ()=>{
    currentIndex-=1;
    if (currentIndex<0){
      currentIndex = game.world.shipLists.length-1;
    }
    game.glCanvas.menu.missionOptions.shipIndex = currentIndex;
    autoRot=true;
  }

  game.glCanvas.menu.nextShip.click = ()=>{
    currentIndex+=1;
    if (currentIndex>game.world.shipLists.length-1){
      currentIndex = 0;
    }
    game.glCanvas.menu.missionOptions.shipIndex = currentIndex;
    autoRot = true;
  }

  

  for (let i=0; i< game.world.shipLists.length; i++){
    let model = game.world.shipLists[i].createStaticItem(calc.matrixFromPos(new Vector3d(0,0,0), 1, 0, 0));
    game.player.model.visible=false;
    model.menuIndex = i;
    model.onProcess = (deltaTime)=>{ //TODO use axis rotation
      if (autoRot==true){
        cx=0.1;
        cy=0.63;
      }

      if (model.menuIndex!=currentIndex){
        model.visible = false;
      } else { 
        model.visible = true;
        model.matrix = m4.zRotate(model.matrix, cx*deltaTime);
        model.matrix = m4.xRotate(model.matrix, cy*deltaTime);  
      }
    }
  }

}

function recCollectable(game, rou, i){
  console.log('recpoint '+i);
  if (rou[i]){
    let tg = game.addLabel('target', rou[i]);
    let ele = game.world.createMagic(rou[i], 90, false);
    let el = basics.makeCollactable(game.world, rou[i], 30, game.world.boxModelList, (player)=>{
      ele.deleteSelf();
      if (!rou[i+1]){
        anyutils.playSoundUrl('assets/sounds/success.mp3');
        game.finish(true);
      }
      console.log('collected');
      tg.deleteSelf();
      anyutils.playSoundUrl('assets/sounds/correct.mp3');
      let en = new Enemy(game.gl, game, randVector(rou[i],500), new Vector3d(0,0,0), game.world.shipLists[rand(3)]);
      en.targetPointer = game.targets.addTarget('kill enemy');
      en.onKilled = ()=>{
        anyutils.playSoundUrl('assets/sounds/correct.mp3');
        en.targetPointer.setComplete();
      }  
      recCollectable(game,rou, i+1);
    }); 
    el.visible=false; 
    
  }
}

function makeRingSpline(r){
  let ir;
  let x;
  let y;
  let z;
  res = [];
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
  let spline = makeLineSpline(len, new Vector3d (0, 0, -200), -200);
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
}

module.exports = Game;