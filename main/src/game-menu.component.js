const Control = require('./control-js/control.component.js');
const Pager = require('./control-js/pager.component.js');
const options = require('./options.utils.js');

class GameMenu extends Control{
  constructor(parentNode, glCanvas){
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
    this.menu.selectPage(this.mainMenu);

    this.startButton = new Control(this.mainMenu.node, 'div', 'menu_item', 'start new',()=>{
      this.menu.selectPage(this.missionMenu);
    });


    ///options
    let curOptions = options.loadOptions();
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
      options.saveOptions(curOptions);
      this.menu.selectPage(this.mainMenu);
    });
    ///


    this.exitButton = new Control(this.mainMenu.node, 'div', 'menu_item', 'exit',()=>{
      document.exitFullscreen();
    });

    this.m1Button = new Control(this.missionMenu.node, 'div', 'menu_item', 'mission1',()=>{
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

    this.mainMenuButtonM = new Control(this.missionMenu.node, 'div', 'menu_item', 'to main menu',()=>{
      this.menu.selectPage(this.mainMenu);
    });

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
    this.refresh();
  }

  deactivate(res){
    if (!res){
      this.glCanvas.resume();
    }
    this.glCanvas.gamePanel.show();
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