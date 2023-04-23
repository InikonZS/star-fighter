import anyutils from '../../any.utils';
import basics from '../basic-objects.gmob';
import Vector3d from '../../vector3d.dev';
import calc from '../../calc.utils';
const rand =calc.rand;

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

export default missionGarage;