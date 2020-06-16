const Control = require('./control-js/control.component.js');
const Pager = require('./control-js/pager.component.js');

class GameMenu extends Control{
  constructor(parentNode, glCanvas){
    super(parentNode, 'div', '', '', ()=>{

    });
    this.glCanvas = glCanvas;
    //this.isActive = true;
    this.menu = new Pager(this.node, '', 'menu_background');

    this.mainMenu = this.menu.addPage('Main Menu');
    this.missionMenu = this.menu.addPage('Select Mission');
    this.gameMenu = this.menu.addPage('Paused');
    this.gameOverMenu = this.menu.addPage('Game Over');
    this.menu.selectPage(this.mainMenu);

    this.startButton = new Control(this.mainMenu.node, 'div', 'menu_item', 'start new',()=>{
      this.menu.selectPage(this.missionMenu);
    });


    ////
    //this.background2 = new Control(this.node, 'div', 'menu_background');
    //this.background2.hide();
    this.m1Button = new Control(this.missionMenu.node, 'div', 'menu_item', 'mission1',()=>{
      this.glCanvas.start();
      this.glCanvas.game.loadMission('1');
      this.isActive = false;
      this.refresh();
      this.menu.selectPage(this.gameMenu);
     // this.background3.show();
      //this.background2.hide();
     // this.background.hide();
      //this.deactivate();
    });

    this.m2Button = new Control(this.missionMenu.node, 'div', 'menu_item', 'mission2',()=>{
      this.glCanvas.start();
      this.glCanvas.game.loadMission('');
      this.isActive = false;
      this.refresh();
      this.menu.selectPage(this.gameMenu);
     /* this.background3.show();
      this.background2.hide();
      this.background.hide();*/
    });

    this.mainMenuButtonM = new Control(this.missionMenu.node, 'div', 'menu_item', 'to main menu',()=>{
      this.menu.selectPage(this.mainMenu);
     // this.background.show();
     // this.background3.hide();
     // this.background2.hide();
      //this.deactivate();
    });

    ///3
    //this.background3 = new Control(this.node, 'div', 'menu_background');
    this.resumeButton = new Control(this.gameMenu.node, 'div', 'menu_item', 'continue',()=>{
      this.deactivate();
    });
    this.mainMenuButton = new Control(this.gameMenu.node, 'div', 'menu_item', 'to main menu',()=>{
      this.menu.selectPage(this.mainMenu);
     // this.background.show();
     // this.background3.hide();
     // this.background2.hide();
      //this.deactivate();
    });
  //  this.background2.hide();
  //    this.background.show();
  //    this.background3.hide();
    this.refresh();
  }

  activate(){
    if (this.glCanvas.isStarted){
      this.glCanvas.pause();
    }
    this.isActive = true;
    this.refresh();
  }

  deactivate(){
    this.glCanvas.resume();
    this.isActive = false;
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

module.exports = GameMenu;