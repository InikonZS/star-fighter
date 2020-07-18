const Joys = require('./joystick.component.js');
const Control = require('./control-js/control.component.js');

class RadioButton extends Control{
  constructor(parentNode, className, classNameActive, onClick){
    super(parentNode, 'div', className);
    this.className = className;
    this.classNameActive = classNameActive;
    this.isActive = false;
    this.onClick = onClick;
    this.node.addEventListener('click',()=>{
      if (this.onClick){
        this.onClick();
      }  
    });
  }

  setActive(){
    this.node.className = this.className+' '+ this.classNameActive;
  }

  setInactive(){
    this.node.className = this.className;
  }
}

class RadioGroup extends Control{
  constructor(parentNode, wrapperClass){
    super(parentNode, 'div', wrapperClass);
    this.buttons = [];
  }

  addButton(buttonClass, buttonClassActive, onClick){
    let bt = new RadioButton(this.node, buttonClass, buttonClassActive, ()=>{
      this.buttons.forEach(it=>{
        it.setInactive();
      })
      bt.setActive();
      if (onClick){
        onClick();
      }
    });
    this.buttons.push(bt);
    return(bt);
  }
}

class Joy extends Control{
  constructor(parentNode, glCanvas, onChange, onChangeLeft){
    super(parentNode, 'div', 'njoy_wrapper_with_panel');
    //left
    let leftPanel = new Control(this.node, 'div', "njoy_panel njoy_panel_left");

    let weaponSelect = new RadioGroup(leftPanel.node, 'njoy_buttons_group');
    weaponSelect.addButton('njoy_button njoy_weap1_ico', 'njoy_button_active').setActive();
    weaponSelect.addButton('njoy_button njoy_weap2_ico', 'njoy_button_active');
    weaponSelect.addButton('njoy_button njoy_weap3_ico', 'njoy_button_active');
    weaponSelect.addButton('njoy_button njoy_weap4_ico', 'njoy_button_active');

    let leftPad = new Joys.TouchPad(leftPanel.node, onChangeLeft);
    leftPad.node.className = 'njoy_touch_wrapper njoy_touch_wrapper_left';
    let leftPadIco = new Control(leftPad.node, 'div', 'njoy_touch njoy_touch_left');

    let leftDown = new Control(leftPanel.node, 'div', 'njoy_down_left');
    let shotButton = new Control(leftDown.node, 'div', 'njoy_shot_button');
    let shotButtonIco = new Control(shotButton.node, 'div', "njoy_button njoy_shot_ico njoy_button_lighten");

    let shieldButton = new Control(leftDown.node, 'div', 'njoy_shot_button');
    let shieldButtonIco = new Control(shieldButton.node, 'div', "njoy_button njoy_shield_ico njoy_button_lighten");

    //right
    let rightPanel = new Control(this.node, 'div', "njoy_panel njoy_panel_right");

    let rightButtons = new Control(rightPanel.node, 'div','njoy_buttons_group njoy_buttons_group_right');
    let menuButton = new Control(rightButtons.node, 'div', 'njoy_button njoy_pause_ico njoy_button_lighten');

    let rightPad = new Joys.TouchPad(rightPanel.node, onChange);
    rightPad.node.className = 'njoy_touch_wrapper njoy_touch_wrapper_right';
    let rightPadIco = new Control(rightPad.node, 'div', 'njoy_touch njoy_touch_right');
  }
}

module.exports = {
  Joy
}