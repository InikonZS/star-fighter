class Control {
  
  constructor(parentNode, tagName, className, textContent, click, fromParent) {
    const classNameV = className || '';
    const textContentV = textContent || '';
    const tagNameV = tagName || 'div';
    this.isDisabled = false;
    this.isHidden = false;

    if (!fromParent) {
      this.node = document.createElement(tagNameV);
      parentNode.appendChild(this.node);
      this.node.className = classNameV;
      this.node.textContent = textContentV;
    } else {
      this.node = parentNode;
      this.node.className = classNameV;
    }

    if (click) {
      this.click = click;
      this.node.addEventListener('click', (e) => {
        if (!this.isDisabled) {
          this.click(e);
        }
      });
    }
  }

  clear() {
    this.node.innerHTML = '';
  }

  hide() {
    this.isHidden = true;
    this.node.style = 'display:none';
  }

  show() {
    this.isHidden = false;
    this.node.style = '';
  }

  animate(animationCssClass, inlineStyle) {
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        if (animationCssClass) {
          this.node.className = animationCssClass;
        }
        if (inlineStyle) {
          this.node.style = inlineStyle;
        }
      });
    });
  }
}

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
  constructor(parentNode){
    super(parentNode, 'div', 'joy_wrapper_with_panel');
    let leftPanel = new Control(this.node, 'div', "joy_panel joy_panel_left");

    let weaponSelect = new RadioGroup(leftPanel.node, 'joy_buttons_group');
    weaponSelect.addButton('joy_button joy_weap1_ico', 'joy_button_active').setActive();
    weaponSelect.addButton('joy_button joy_weap2_ico', 'joy_button_active');
    weaponSelect.addButton('joy_button joy_weap3_ico', 'joy_button_active');
    weaponSelect.addButton('joy_button joy_weap4_ico', 'joy_button_active');

    let rightPanel = new Control(this.node, 'div', "joy_panel joy_panel_right");
  }
}
/*<div class = "joy_wrapper_with_panel">
        <div class = "joy_panel joy_panel_left">
          <div class = "joy_buttons_group">
            <div class = "joy_button joy_weap1_ico">
              <div>100</div>
            </div>  
            <div class = "joy_button joy_weap2_ico joy_button_active">
              <div>35</div>
            </div>  
            <div class = "joy_button joy_weap3_ico">
          
            </div>  
            <div class = "joy_button joy_weap4_ico">
        
            </div>  
          </div>
          <div class = "joy_touch_wrapper joy_touch_wrapper_left">
            <div class = "joy_touch joy_touch_left">
            
            </div>  
          </div>
          <div class = "joy_down_left">
            <div class = "joy_shot_button">
              <div class = "joy_button joy_shot_ico joy_button_lighten">
        
              </div>   
            </div>
            <div class = "joy_shot_button">
              <div class = "joy_button joy_shield_ico joy_button_lighten">
      
              </div>  
            </div>
          </div>
        </div>
        <div class = "joy_panel joy_panel_right">
          <div class = "joy_buttons_group joy_buttons_group_right">
            <div class = "joy_button joy_pause_ico joy_button_lighten">
          
            </div>  
          </div>
          <div class = "joy_touch_wrapper">
            <div class = "joy_touch joy_touch_right">

            </div>
          </div>   
        </div>
      </div>
    </div> */
new Joy(document.body);