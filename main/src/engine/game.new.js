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
const mission5 = require('./missions/mission5.mission.js');

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
    msg.textPref = text;
    msg.onProcess = ()=>{
      let dist = this.getPlayerPos().subVector(msg.vector).abs()*10;
      msg.text = msg.textPref+ ': '+Math.round(dist)/10+ 'km';
    }
    this.messageList.addChild(msg);
    return msg;
  }

  getPlayerPos(){
    return this.player.camera.getPosVector();
  }

  clear(){
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
  }
  
  loadMission(name, props){
    this.clear();
    this.props = props;
    this.player.model.visible=true;
    if (name=='1'){missionLabirint(this);} 
    if (name=='2'){mission4(this);} 
    if (name=='3'){mission2(this);} 
    if (name=='4'){mission1(this);} 
    if (name=='5'){mission3(this);} 
    if (name=='6'){mission5(this);} 
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

module.exports = Game;