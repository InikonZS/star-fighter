const Control = require('./control-js/control.component.js');

class GameMenu extends Control{
  constructor(parentNode, glCanvas){
    super(parentNode, 'div', 'overlay_panel', '', ()=>{

    });

    this.center = new Control(this.node, 'div', 'overlay_center');

    this.view = new Control(this.node, 'div', 'view_panel');

    this.tool = new Control(this.node, 'div', 'machine_panel');

    this.group = new Control(this.tool.node, 'div', 'panel_group' ,'');

    this.health = new Control(this.group.node, 'div', 'panel_item' ,'health: ');
    this.bullets = new Control(this.group.node, 'div', 'panel_item','bullets: ');
    this.weapon = new Control(this.group.node, 'div', 'panel_item','bullets: ');
    this.shield = new Control(this.group.node, 'div', 'panel_item','shield: ');
    this.speed = new Control(this.group.node, 'div', 'panel_item' ,'speed: ');
    this.missionTarget = new Control(this.tool.node, 'div', 'panel_item','targets: ');
  }

}

module.exports = GameMenu;