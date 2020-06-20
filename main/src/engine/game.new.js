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

    this.world = new World(gl, this);
    this.player = new Player(gl, this, glCanvas.keyboardState);
    this.timers = new GameObject();
    this.messageList = new GameObject();
    this.targets = new TargetList(this);

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
    this.world.clear();
    //this.player.camera.init();
    //this.timers.clear();
    this.messageList.clear();
    this.targets.clear();
    this.targets.refresh();
    this.world = new World(this.gl, this);  
    this.player = new Player(this.gl, this, this.glCanvas.keyboardState);
  }
  
  loadMission(name){
    this.clear();
    if (name=='1'){
      mission3(this);
    } else {
      mission2(this);
    }
  }

  finish(){
    this.glCanvas.keyboardState.shot = false;
    this.glCanvas.menu.activate();
    this.glCanvas.menu.menu.selectPage(this.glCanvas.menu.gameOverMenu);
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


function mission3(game){
  starChunk(game, new Vector3d(0,0,0), 500, 50);
  let baseLabel = game.addLabel('StartPoint', new Vector3d(0, 0, 0));


  let enBasePos = new Vector3d(100, 0, 0);
  starChunk(game, enBasePos, 500, 50);
  //let point1 = new Collectable(game, enBasePos, ''); 
  let point1 = basics.makeCollactable(game.world, enBasePos, 10, game.world.boxModelList);
  
  let target = game.targets.addTarget('come to target');
  point1.onCollect = ()=>{
    console.log('collected!!!');
    anyutils.playSoundUrl('assets/sounds/correct.mp3');
    target.setComplete();
    label1.deleteSelf();

    let en = new Enemy(game.gl, game, randVector(enBasePos, 500), new Vector3d(0,0,0));
    en.targetPointer = game.targets.addTarget('kill enemy');
    en.onKilled = ()=>{
      anyutils.playSoundUrl('assets/sounds/correct.mp3');
      en.targetPointer.setComplete();  
      
      let point1 = new Collectable(game, new Vector3d(0,0,0), ''); 
      game.targets.addTarget('return to start');
      point1.onCollect = ()=>{
        anyutils.playSoundUrl('assets/sounds/success.mp3');
        game.finish();
      }
    }
  }
  var label1 = game.addLabel('target', enBasePos);
console.log (point1);
}

module.exports = Game;