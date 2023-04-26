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
    this.node.style.cssText = 'display:none';
  }

  show() {
    this.isHidden = false;
    this.node.style.cssText = '';
  }

  animate(animationCssClass, inlineStyle) {
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        if (animationCssClass) {
          this.node.className = animationCssClass;
        }
        if (inlineStyle) {
          this.node.style.cssText = inlineStyle;
        }
      });
    });
  }
}

let mis1 = `
  <div>
  <h1>
    Mission 1: Lorem Ipsum
  </h1>
  <p>

  </p>
  </div>
  <div>
    <h2>
      Tasks:
    </h2>
  <p>
    Curabitur vestibulum eget mauris quis laoreet. Phasellus in quam laoreet, viverra lacus ut, ultrices velit. 
  </p>
  </div>
  <div> 

    <h2>
      Details:
    </h2>
  <p>
    Quisque luctus, quam eget molestie commodo, lacus purus cursus purus, nec rutrum tellus dolor id lorem. Quisque luctus, quam eget molestie commodo, lacus purus cursus purus, nec rutrum tellus dolor id lorem. Quisque luctus, quam eget molestie commodo, lacus purus cursus purus, nec rutrum tellus dolor id lorem. 
  </p>
  </div>
  <div style="height: 70px;">
  <p></p>
  </div>
`;

class Slide extends Control{
  constructor(parentNode, wrapperClass, index){
    super(parentNode, 'div', wrapperClass);
    this.index = index;
    this.setIndex(index);
  }

  setIndex(index){
    this.index = index;
    this.node.style.cssText = `transform: translate(${100*this.index}%, 0px)`;
  }
}

/*class MissionScreen extends Control{
  constructor(parentNode, wrapperClass, slideClass, content, index){
    super(parentNode, 'div', wrapperClass);
    this.index = index;
    this.slide = new Control(this.node, 'div', slideClass);
    this.slide.node.innerHTML = content; 
    this.setIndex(index);
  }

  setIndex(index){
    this.index = index;
    this.node.style.cssText = `transform: translate(${100*this.index}%, 0px)`;
  }
}*/

class SliderButton extends Control{
  constructor(parentNode, wrapperClass, buttonClass, onClick){
    super(parentNode, 'div', '');
    this.node.style.cssText ='width:0px';
    this.butWrapper = new Control(this.node, 'div', wrapperClass);
    this.button = new Control(this.butWrapper.node, 'div', buttonClass, '', onClick);
  }
}


class SliderStd extends Control{
  constructor(parentNode){
    super(parentNode, 'div', 'sl_wrapper'); 

    new SliderButton(this.node, 'sl_panel sl_panel_left', 'sl_button sl_button_left', ()=>{
      this.setIndex(this.currentIndex-1);
    });

    this.slidesContainer = new Control(this.node, 'div', 'sl_slides');

    new SliderButton(this.node, 'sl_panel sl_panel_right', 'sl_button sl_button_right', ()=>{
      this.setIndex(this.currentIndex+1);  
    });
    
    this.slides = [];
    this.currentIndex = 0;
  }

  addSlide(){
    let sl = new Slide(this.slidesContainer.node, 'sl_slide_truncer', this.slides.length);
    this.slides.push(sl);
    return sl;  
  }

  setIndex(index){
    if (index<this.slides.length && index>=0){
      this.currentIndex = index;
      this.slides.forEach((it, i)=>{
        it.setIndex(-index+i);
      });
    }
  }
}

class GameSlideredScreen extends Control{
  constructor(parentNode){
    super(parentNode, 'div', 'gs_wrapper');
    let titleWrapper = new Control (this.node, 'div', 'gs_title');
    this.titleElement = new Control (titleWrapper.node, 'div', 'gs_path');

    let centerWrapper = new Control (this.node, 'div', 'gs_center');
    this.slider = new SliderStd(centerWrapper.node);

    let controlsWrapper = new Control(this.node, 'div', 'gs_controls_wrapper');
    let controlsShadow = new Control(controlsWrapper.node, 'div', 'gs_controls_shadow');
    this.controlsContainer = new Control(controlsShadow.node, 'div', 'gs_controls');

    this.buttons = [];
  }

  setTitle(title){
    this.titleElement.node.textContent = title;
  }

  addButton(caption, onClick){
    let bt = new Control(this.controlsContainer.node, 'div', 'gs_button', caption, onClick);
    this.buttons.push(bt);
    return bt;
  }
}

let gs = new GameSlideredScreen(document.body);
for (let i=0; i<5; i++){
  let sl = gs.slider.addSlide();
  let sw = new Control (sl.node, 'div', 'sl_slide');
  sw.node.innerHTML = mis1;
}

gs.setTitle('Select mission');
gs.addButton('Back');
gs.addButton('Select');

