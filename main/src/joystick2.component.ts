import Joys from './joystick.component';
import Control from './control-js/control.component';
import GLCanvas from './gl-canvas.component';

class RadioButton extends Control{
  className: string;
  classNameActive: string;
  isActive: boolean;
  onClick: () => void;

  constructor(parentNode: HTMLElement, className:string, classNameActive:string, onClick: ()=>void){
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
  buttons: any[];
  constructor(parentNode: HTMLElement, wrapperClass: string){
    super(parentNode, 'div', wrapperClass);
    this.buttons = [];
  }

  addButton(buttonClass:string, buttonClassActive: string, onClick: ()=>void){
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

export class Joy extends Control{
  constructor(parentNode: HTMLElement, glCanvas: GLCanvas, onChange: (dx: number, dy: number, cx: number, cy: number)=>void, onChangeLeft: (dx: number, dy: number, cx: number, cy: number)=>void){
    super(parentNode, 'div', 'njoy_wrapper_with_panel');
    //left
    let leftPanel = new Control(this.node, 'div', "njoy_panel njoy_panel_left");

    let weaponSelect = new RadioGroup(leftPanel.node, 'njoy_buttons_group');

    weaponSelect.addButton('njoy_button njoy_weap1_ico', 'njoy_button_active',
    ()=>{
      glCanvas.game.player.setWeapon(1);   
    }).setActive();
    weaponSelect.addButton('njoy_button njoy_weap2_ico', 'njoy_button_active',
    ()=>{
      glCanvas.game.player.setWeapon(2);   
    });
    weaponSelect.addButton('njoy_button njoy_weap3_ico', 'njoy_button_active',
    ()=>{
      glCanvas.game.player.setWeapon(3);   
    });
    weaponSelect.addButton('njoy_button njoy_weap4_ico', 'njoy_button_active',
    ()=>{
      glCanvas.game.player.setWeapon(4);   
    });

    let leftPad = new Joys.TouchPad(leftPanel.node, onChangeLeft);
    leftPad.node.className = 'njoy_touch_wrapper njoy_touch_wrapper_left';
    let leftPadIco = new Control(leftPad.node, 'div', 'njoy_touch njoy_touch_left');

    let leftDown = new Control(leftPanel.node, 'div', 'njoy_down_left');
    let shotButton = new Joys.TouchButton(leftDown.node, 'njoy_shot_button', (st)=>{
      glCanvas.keyboardState.shot= st;  
    });
    let shotButtonIco = new Control(shotButton.node, 'div', "njoy_button njoy_shot_ico njoy_button_lighten");

    let shieldButton = new Joys.TouchButton(leftDown.node, 'njoy_shot_button', (st)=>{
      glCanvas.keyboardState.space= st;  
    });
    let shieldButtonIco = new Control(shieldButton.node, 'div', "njoy_button njoy_shield_ico njoy_button_lighten");

    //right
    let rightPanel = new Control(this.node, 'div', "njoy_panel njoy_panel_right");

    let rightButtons = new Control(rightPanel.node, 'div','njoy_buttons_group njoy_buttons_group_right');
    let menuButton = new Joys.TouchButton(rightButtons.node, 'njoy_button njoy_pause_ico njoy_button_lighten',(st)=>{
      if (!glCanvas.menu.isActive){
        glCanvas.menu.activate();
        glCanvas.keyboardState.shot = false;
        document.exitPointerLock();
      } 
    });

    let rightPad = new Joys.TouchPad(rightPanel.node, onChange);
    rightPad.node.className = 'njoy_touch_wrapper njoy_touch_wrapper_right';
    let rightPadIco = new Control(rightPad.node, 'div', 'njoy_touch njoy_touch_right');
  }
}
