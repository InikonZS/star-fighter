const Control = require('./control.component.js');

class GameMenu extends Control{
  constructor(parentNode, glCanvas){
    super(parentNode, 'div', '', '', ()=>{

    });
    this.glCanvas = glCanvas;
    //this.isActive = true;
    this.background = new Control(this.node, 'div', 'menu_background');

    this.startButton = new Control(this.background.node, 'div', 'menu_item', 'start',()=>{
      this.glCanvas.start();
      this.isActive = false;
      this.refresh();
     // this.deactivate();
    });

    this.resumeButton = new Control(this.background.node, 'div', 'menu_item', 'resume',()=>{
      this.deactivate();
    });
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