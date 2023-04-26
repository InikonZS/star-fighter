import World from './world.new';
import Player from './player.new';
import Vector3d from '../vector3d.dev';
import calc from '../calc.utils';

import Message from './point-msg.new';
import GameObject from './game-object.new';
import Timer from './timer.new';
import TargetList from './mission-target.new';

import missionLabirint from './missions/labirint.mission';
import missionGarage from './missions/garage.mission';
import mission1 from './missions/mission1.mission';
import mission2 from './missions/mission2.mission';
import mission3 from './missions/mission3.mission';
import mission4 from './missions/mission4.mission';
import mission5 from './missions/mission5.mission';
import GLCanvas from '../gl-canvas.component';

class Game{
  gl: WebGLRenderingContext;
  glCanvas: GLCanvas;
  props: { shipIndex: number; };
  world: World;
  player: Player;
  timers: GameObject;
  messageList: GameObject;
  targets: TargetList;

  constructor(gl: WebGLRenderingContext, glCanvas: GLCanvas){
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

  render(aspect: number, deltaTime: number){
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

  addTimer(interval: number, onTimeout: ()=>void){
    let tm = new Timer(interval, onTimeout);
    this.timers.addChild(tm);
    return tm;
  }

  addLabel(text: string, vector: Vector3d){
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
  
  loadMission(name: string, props: { missionName: string; shipIndex: number; }){
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

  finish(win: boolean){
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

export default Game;