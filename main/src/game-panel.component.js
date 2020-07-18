const Control = require('./control-js/control.component.js');
const BarIndicator = require('./control-js/bar-indicator.component.js');
const {Joy} = require('./joystick2.component.js');

class BarIndicatorCustomized extends BarIndicator{
  constructor (parentNode, value, demiValue){
    super(
      parentNode, 
      24, 
      'bar-indicator', 
      'bar-indicator_bar bar-indicator_bar__active', 
      'bar-indicator_bar bar-indicator_bar__inactive', 
      'bar-indicator_bar bar-indicator_bar__demi'
    );
    this.setValue(value, demiValue);
  }

  setPercent(percent){
    let val = Math.ceil((percent/100)*this.maxValue);
    this.setValue(val, val);
  }
}

class GamIndicator extends Control{
  constructor(parentNode, caption, initValue){
    super(parentNode, 'div', 'ngam_top_item');
    this.caption = caption;
    if (initValue){
      this.setValue(initValue);
    } else {
      this.setValue(0);
    }
  }

  setValue(value){
    this.value=Math.trunc(value*10)/10;
    let strValue = this.value.toString();
    while (strValue.length<4){
      strValue+='⠀';
    }
    this.node.textContent = this.caption+ ': ' +strValue;
  }

  setPercent(value){
    this.setValue(value);
  }
}

class GameMenu extends Control{
  constructor(parentNode, glCanvas){
    super(parentNode, 'div', 'overlay_panel', '', ()=>{

    });

    this.center = new Control(this.node, 'div', 'overlay_center');

    this.view = new Control(this.node, 'div', 'view_panel');

    this.tool = new Control(this.node, 'div', 'machine_panel');
    this.tool.hide();

    this.group =new Control(this.node, 'div', 'ngam_top');
    this.health = new GamIndicator(this.group.node, 'health');
    this.shield = new GamIndicator(this.group.node, 'shield');
    this.speed = new GamIndicator(this.group.node, 'speed');
    this.fuel = new GamIndicator(this.group.node, 'fuel');
    this.money = new GamIndicator(this.group.node, 'money');

    this.joy = new Joy(this.node, glCanvas, (dx, dy, cx, cy)=>{
      //glCanvas.game.player.camera.rotateCam(dx, dy, false);
      glCanvas.game.player.camera.moc=true;
      glCanvas.game.player.camera.roX=cx*3;
      glCanvas.game.player.camera.roY=cy*3;
    },
    (dx, dy, cx, cy)=>{
      //glCanvas.game.player.camera.rotateCam(dx, dy, false);
      glCanvas.game.player.camera.moc=true;
      glCanvas.game.player.camera.crn=cx*0.004;
      glCanvas.game.player.camera.acl=-cy*0.1;
    });
    this.joy.hide();

    this.data = {
      health:0,
      bullets:0,
      weapon:0,
      shield:0,
      speed:0,
      fuel:0,
    };
    
    this.refresh = (data_)=>{
      let data = data_;
      if (!data){
        data = this.data;  
      }
      //this.health.node.textContent = `health: ${data.health}`;

      this.health.setPercent(data.health);
      this.shield.setPercent(data.shield);
      this.speed.setPercent(data.speed);

      this.weapon.node.textContent = `weapon: ${data.weapon}`;
      //this.shield.node.textContent = `shield: ${data.shield}`;
      //this.speed.node.textContent = `speed: ${data.speed}`;
      this.bullets.node.textContent = `bullets: ${data.bullets}`;
    }
    
    //this.group = new Control(this)
    this.group = new Control(this.tool.node, 'div', 'panel_group' ,'');

   // this.health=new BarIndicatorCustomized(this.group.node, 6, 8);
   // this.shield=new BarIndicatorCustomized(this.group.node, 6, 8);
    //this.health = new Control(this.group.node, 'div', 'panel_item' ,'health: ');
    this.bullets = new Control(this.group.node, 'div', 'panel_item','bullets: ');
    this.weapon = new Control(this.group.node, 'div', 'panel_item','bullets: ');
    //this.shield = new Control(this.group.node, 'div', 'panel_item','shield: ');
    //this.speed = new Control(this.group.node, 'div', 'panel_item' ,'speed: ');
    this.missionTarget = new Control(this.tool.node, 'div', 'panel_item','targets: ');
  }
}

module.exports = GameMenu;