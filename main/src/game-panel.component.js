const Control = require('./control-js/control.component.js');

class GameMenu extends Control{
  constructor(parentNode, glCanvas){
    super(parentNode, 'div', 'overlay_panel', '', ()=>{

    });
    this.view = new Control(this.node, 'div', 'view_panel');
    this.tool = new Control(this.node, 'div', 'machine_panel');
    this.health = new Control(this.tool.node, 'div', 'panel_item' ,'health: ');
    this.bullets = new Control(this.tool.node, 'div', 'panel_item','bullets: ');
    this.weapon = new Control(this.tool.node, 'div', 'panel_item','bullets: ');
    this.shield = new Control(this.tool.node, 'div', 'panel_item','shield: ');
    this.missionTarget = new Control(this.tool.node, 'div', 'panel_item','targets: ');
  }

}

module.exports = GameMenu;