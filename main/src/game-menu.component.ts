import Control from './control-js/control.component';
import Pager from './control-js/pager.component';
import { loadOptions, saveOptions } from './options.utils';
import joyUtils from './joystick.component';
import { GameSlideredScreen } from './control-js/menu.classes';
import { ShipSlide } from './control-js/menu.classes';
import misTexts from './mis.texts';
import GLCanvas from './gl-canvas.component';

class GameMenu extends Control{
  glCanvas: GLCanvas;
  menu: Pager;
  mainMenu: Control;
  optionsMenu: Control;
  missionMenu: Control;
  startMenu: Control;
  gameMenu: Control;
  gameOverMenu: Control;
  gameWinMenu: Control;
  missionOptions: { missionName: string; shipIndex: number; };
  startButton: Control;
  optionsButton: Control;
  optionMouseSense: Control;
  exitButton: Control;
  touchPad: TouchPad;
  prevShip: Control;
  nextShip: Control;
  startMissionButton: Control;
  mainMenuButtonO: Control;
  mainMenuButtonW: Control;
  resumeButton: Control;
  mainMenuButton: Control;
  isActive: boolean;

  constructor(parentNode: HTMLElement, glCanvas:GLCanvas){
    super(parentNode, 'div', '', '', ()=>{

    });
    this.glCanvas = glCanvas;
    //this.isActive = true;
    this.menu = new Pager(this.node, '', 'menu_background');

    this.mainMenu = this.menu.addPage('Main Menu');
    this.optionsMenu = this.menu.addPage('Options');
    this.missionMenu = this.menu.addPage('Select Mission');
    this.startMenu = this.menu.addPage('Start Mission');
    this.gameMenu = this.menu.addPage('Paused');
    this.gameOverMenu = this.menu.addPage('Game Over');
    this.gameWinMenu = this.menu.addPage('Mission Complete');
    //this.detailMenu = this.menu.addPage('Detail');
    this.menu.selectPage(this.mainMenu);

    this.missionOptions = {
      missionName: '1',
      shipIndex:0
    }

    this.startButton = new Control(this.mainMenu.node, 'div', 'menu_item', 'start new',()=>{
      this.menu.selectPage(this.missionMenu);
    });


    ///options
    let curOptions = loadOptions();
    this.optionsButton = new Control(this.mainMenu.node, 'div', 'menu_item', 'options',()=>{
      this.menu.selectPage(this.optionsMenu);

    });
    this.optionMouseSense = new Control(this.optionsMenu.node, 'input', 'menu_item');
    this.optionMouseSense.node.type = 'range';
    this.optionMouseSense.node.min=1;
    this.optionMouseSense.node.max=100;
    this.optionMouseSense.node.value = curOptions.mouseSens;
    this.optionMouseSense.node.addEventListener('change', (e)=>{
      curOptions.mouseSens = this.optionMouseSense.node.value;
    })

    new Control(this.optionsMenu.node, 'div', 'menu_item', 'to main menu',()=>{
      saveOptions(curOptions);
      this.menu.selectPage(this.mainMenu);
    });
    ///


    this.exitButton = new Control(this.mainMenu.node, 'div', 'menu_item', 'exit',()=>{
      if (document.fullscreenElement!=null){
        document.exitFullscreen();
      }
    });

    //////////
    this.missionMenu.node.innerHTML='';
    let gs = new GameSlideredScreen(this.missionMenu.node);
    for (let i=0; i<6; i++){
      let sl = gs.slider.addSlide();
      sl.backImageURL= `../assets/back_images/back${i%4+1}.jpg`;
      sl.slideContainer.node.innerHTML = misTexts[i];
    }
    gs.slider.setIndex(0);
    gs.setTitle('Select mission');
    gs.addButton('Back', ()=>{
      this.menu.selectPage(this.mainMenu);
    });
    gs.addButton('Select', ()=>{
      this.glCanvas.start();
      this.glCanvas.game.loadMission('garage', this.missionOptions);
      this.missionOptions.missionName=(gs.slider.currentIndex+1).toString();
      this.glCanvas.useControls = false;
      this.menu.selectPage(this.startMenu);  
      console.log('mission selected')
    });
    ///////

   /* let missionCount = 5;
    for (let i=0; i<missionCount; i++){
      new Control(this.missionMenu.node, 'div', 'menu_item', 'mission'+(i+1),()=>{
        
        this.glCanvas.start();
        this.glCanvas.game.loadMission('garage', this.missionOptions);
        this.missionOptions.missionName=(i+1).toString();
        this.glCanvas.useControls = false;
        this.menu.selectPage(this.startMenu);
      }); 
    }*/

//////
    this.startMenu.node.innerHTML="";
    this.touchPad = new joyUtils.TouchPad(this.startMenu.node, ()=>{});
    this.touchPad.node.className = 'but fullScreenTouch';
    this.touchPad.node.style = 'z-index:2'
    //this.startMenu.node.innerHTML='';

    let bs = new GameSlideredScreen(this.startMenu.node);
   // for (let i=0; i<5; i++){
    let sl;
    sl = bs.slider.addSlide();
    new ShipSlide(sl.slideContainer.node, 'Tie Interceptor', 'Quisque luctus, quam eget molestie commodo, lacus purus cursus purus, nec rutrum tellus dolor id lorem. Quisque luctus, quam eget molestie commodo, lacus purus cursus purus, nec rutrum tellus dolor id lorem. Quisque luctus, quam eget molestie commodo, lacus purus cursus purus, nec rutrum tellus dolor id lorem.',
    20, 10);
    sl = bs.slider.addSlide();
    new ShipSlide(sl.slideContainer.node, 'Tie Bomber', 'Quisque luctus, quam eget molestie commodo, lacus purus cursus purus, nec rutrum tellus dolor id lorem. Quisque luctus, quam eget molestie commodo, lacus purus cursus purus, nec rutrum tellus dolor id lorem. Quisque luctus, quam eget molestie commodo, lacus purus cursus purus, nec rutrum tellus dolor id lorem.',
    10, 20);
    sl = bs.slider.addSlide();
    new ShipSlide(sl.slideContainer.node, 'Tie Fighter', 'Quisque luctus, quam eget molestie commodo, lacus purus cursus purus, nec rutrum tellus dolor id lorem. Quisque luctus, quam eget molestie commodo, lacus purus cursus purus, nec rutrum tellus dolor id lorem. Quisque luctus, quam eget molestie commodo, lacus purus cursus purus, nec rutrum tellus dolor id lorem.',
    15, 15);
    sl = bs.slider.addSlide();
    new ShipSlide(sl.slideContainer.node, 'Z95', 'Quisque luctus, quam eget molestie commodo, lacus purus cursus purus, nec rutrum tellus dolor id lorem. Quisque luctus, quam eget molestie commodo, lacus purus cursus purus, nec rutrum tellus dolor id lorem. Quisque luctus, quam eget molestie commodo, lacus purus cursus purus, nec rutrum tellus dolor id lorem.',
    19, 10);
    sl = bs.slider.addSlide();
    new ShipSlide(sl.slideContainer.node, 'X-wing', 'Quisque luctus, quam eget molestie commodo, lacus purus cursus purus, nec rutrum tellus dolor id lorem. Quisque luctus, quam eget molestie commodo, lacus purus cursus purus, nec rutrum tellus dolor id lorem. Quisque luctus, quam eget molestie commodo, lacus purus cursus purus, nec rutrum tellus dolor id lorem.',
    15, 18);
    
  //  }
    bs.slider.setIndex(0);
    bs.setTitle('Select ship');
    bs.addButton('Back', ()=>{
      this.activate();
      this.menu.selectPage(this.missionMenu);
    });
   // gs.addButton('Select', ()=>{

////
    this.prevShip = new Control(this.startMenu.node, 'div', 'menu_item', 'prevShip',()=>{
    });
    this.prevShip.hide();
    this.nextShip = new Control(this.startMenu.node, 'div', 'menu_item', 'nextShip',()=>{
    });
    this.nextShip.hide();

    bs.slider.onLeft=()=>{
      this.prevShip.click();
    }

    bs.slider.onRight=()=>{
      this.nextShip.click();
    }

    this.startMissionButton = new Control(this.startMenu.node, 'div', 'menu_item menu_item_clikit', 'Fight!',()=>{
      //this.glCanvas.start();
      this.glCanvas.useControls = true;
      //this.glCanvas.stop();
      //this.glCanvas.start();
      this.glCanvas.game.loadMission(this.missionOptions.missionName, this.missionOptions);
      this.menu.selectPage(this.gameMenu);
      this.deactivate(true);
    });
    this.startMissionButton.hide();
    bs.addButton('Fight', ()=>{this.startMissionButton.click()});
/*
    new Control(this.startMenu.node, 'div', 'menu_item', 'to main menu',()=>{
      this.activate();
      this.menu.selectPage(this.mainMenu);
    });*/


   /* this.m1Button = new Control(this.missionMenu.node, 'div', 'menu_item', 'mission1',()=>{
      this.menu.selectPage(this.startMenu);

      this.glCanvas.start();
      this.glCanvas.game.loadMission('1');
      this.menu.selectPage(this.gameMenu);
      this.deactivate(true);
    });
   
    this.m2Button = new Control(this.missionMenu.node, 'div', 'menu_item', 'mission2',()=>{
      this.glCanvas.start();
      this.glCanvas.game.loadMission('2');
      this.menu.selectPage(this.gameMenu);
      this.deactivate(true);
    });

    this.m3Button = new Control(this.missionMenu.node, 'div', 'menu_item', 'mission3',()=>{
      this.glCanvas.start();
      this.glCanvas.game.loadMission('3');
      this.menu.selectPage(this.gameMenu);
      this.deactivate(true);
    });

    this.m4Button = new Control(this.missionMenu.node, 'div', 'menu_item', 'mission4',()=>{
      this.glCanvas.start();
      this.glCanvas.game.loadMission('4');
      this.menu.selectPage(this.gameMenu);
      this.deactivate(true);
    });
    */

    /*this.mainMenuButtonM = new Control(this.missionMenu.node, 'div', 'menu_item', 'to main menu',()=>{
      this.menu.selectPage(this.mainMenu);
    });*/

    this.mainMenuButtonO = new Control(this.gameOverMenu.node, 'div', 'menu_item', 'to main menu',()=>{
      this.menu.selectPage(this.mainMenu);
    });

    this.mainMenuButtonW = new Control(this.gameWinMenu.node, 'div', 'menu_item', 'to main menu',()=>{
      this.menu.selectPage(this.mainMenu);
    });

    this.resumeButton = new Control(this.gameMenu.node, 'div', 'menu_item', 'continue',()=>{
      this.deactivate();
    });
    this.mainMenuButton = new Control(this.gameMenu.node, 'div', 'menu_item', 'to main menu',()=>{
      this.menu.selectPage(this.mainMenu);
    });
    this.refresh();
  }

  activate(){
    if (this.glCanvas.isStarted){
      this.glCanvas.pause();
    }
    this.glCanvas.gamePanel.hide();
    this.isActive = true;

    this.glCanvas.sndPlayer.node.pause();

    this.refresh();
  }

  deactivate(res?: boolean){
    if (!res){
      this.glCanvas.resume();
    }
    this.glCanvas.gamePanel.show();
    this.isActive = false;
    if (this.glCanvas.sndAllow){
      this.glCanvas.sndPlayer.node.play();
    }
    this.refresh();
  }

  refresh(){
    this.node.style = `
      position:absolute;
      width:${this.glCanvas.node.clientWidth}px;
      height:${this.glCanvas.node.clientHeight}px;
      top:0px;
      left:0px;
      display:${this.isActive ? 'block' : 'none'};
      z-index:10;
    `;
    if (this.glCanvas.isPaused){
      this.resumeButton.show();
    } else {
      this.resumeButton.hide();
    }
  };
  
}

export default GameMenu;