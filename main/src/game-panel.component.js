const Control = require('./control.component.js');

class GameMenu extends Control{
  constructor(parentNode, glCanvas){
    super(parentNode, 'div', 'overlay_panel', '', ()=>{

    });
    this.view = new Control(this.node, 'div', 'view_panel');
    this.tool = new Control(this.node, 'div', 'machine_panel');
  }

}

module.exports = GameMenu;