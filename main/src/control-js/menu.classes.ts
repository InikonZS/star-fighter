import Control from './control.component';
import Bar from './bar-ind-custom.component';

export class Slide extends Control{
  slideContainer: Control;
  backImageURL: string;
  index: number;

  constructor(parentNode: HTMLElement, wrapperClass: string, slideClass: string, index: number){
    super(parentNode, 'div', wrapperClass);
    this.slideContainer = new Control (this.node, 'div', slideClass);
    this.backImageURL;
    this.index = index;
    this.setIndex(index);
    this.backImageURL = undefined;
  }

  setIndex(index: number){
    this.index = index;
    this.node.style.cssText = `
      transform: translate(${100*this.index}%, 0px);
      background-image: url('${this.backImageURL}');
    `;
  }
}

class SliderButton extends Control{
  butWrapper: Control;
  button: Control;
  
  constructor(parentNode: HTMLElement, wrapperClass: string, buttonClass: string, onClick: (ev: MouseEvent)=> void){
    super(parentNode, 'div', '');
    this.node.style.cssText ='width:0px';
    this.butWrapper = new Control(this.node, 'div', wrapperClass);
    this.button = new Control(this.butWrapper.node, 'div', buttonClass, '', onClick);
  }
}


export class SliderStd extends Control{
  onSlide: (index: number)=>void;
  currentIndex: number;
  onLeft: ()=>void;
  slidesContainer: Control;
  onRight: ()=>void;
  slides: Slide[];
  constructor(parentNode: HTMLElement){
    super(parentNode, 'div', 'sl_wrapper'); 
    this.onSlide;
    new SliderButton(this.node, 'sl_panel sl_panel_left', 'sl_button sl_button_left', ()=>{
      let ok = this.setIndex(this.currentIndex-1);
      if (ok && this.onLeft){
        this.onLeft();
      }
    });

    this.slidesContainer = new Control(this.node, 'div', 'sl_slides');

    new SliderButton(this.node, 'sl_panel sl_panel_right', 'sl_button sl_button_right', ()=>{
      let ok = this.setIndex(this.currentIndex+1);  
      if (ok && this.onRight){
        this.onRight();
      }
    });
    
    this.slides = [];
    this.currentIndex = 0;
    this.onLeft = undefined;
    this.onRight = undefined;
  }

  addSlide(){
    let sl = new Slide(this.slidesContainer.node, 'sl_slide_truncer', 'sl_slide', this.slides.length);
    this.slides.push(sl);
    return sl;  
  }

  setIndex(index: number){
    if (index<this.slides.length && index>=0){
      this.currentIndex = index;
      this.slides.forEach((it, i)=>{
        it.setIndex(-index+i);
      });
      if (this.onSlide) {this.onSlide(index)};
      return true;
    }
    return false;
  }
}

export class GameSlideredScreen extends Control{
  titleElement: Control;
  slider: SliderStd;
  controlsContainer: Control;
  buttons: Control[];
  constructor(parentNode: HTMLElement){
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

  setTitle(title: string){
    this.titleElement.node.textContent = title;
  }

  addButton(caption: string, onClick: (ev: MouseEvent)=> void){
    let bt = new Control(this.controlsContainer.node, 'div', 'gs_button', caption, onClick);
    this.buttons.push(bt);
    return bt;
  }
}

export class ShipSlide extends Control{
  speedValue: number;
  speedBar: Bar;
  shieldValue: number;
  shieldBar: Bar;

  constructor(parentNode: HTMLElement, shipName: string, shipDecription: string, speedValue: number, shieldValue: number){
    super(parentNode, 'div', '');
    let hWrapper = new Control(this.node, 'div');
    new Control(hWrapper.node, 'h1', '', shipName);
    new Control(hWrapper.node, 'p', '', shipDecription);

    let fWrapper = new Control(this.node, 'div');
    new Control(hWrapper.node, 'h2', '', 'Features: ');

    let mainWrapper = new Control(this.node, 'div');

    let speedWrapper = new Control(mainWrapper.node, 'div', 'bar-wrapper', 'speed');
    this.speedValue = speedValue;
    this.speedBar = new Bar(speedWrapper.node, speedValue, speedValue);

    let shieldWrapper = new Control(mainWrapper.node, 'div', 'bar-wrapper', 'shield');
    this.shieldValue = shieldValue;
    this.shieldBar = new Bar(shieldWrapper.node, shieldValue, shieldValue);
  }
}
/*
<div class="sl_slide">
                <div>
                  <h1>
                    Tie Fighter
                  </h1>
                  <p>
                    Curabitur vestibulum eget mauris quis laoreet. Phasellus in quam laoreet, viverra lacus ut, ultrices velit. 
                  </p>
                </div>
                <div>
                  <h2>
                    Features:
                  </h2>
                </div>
                <div id="app-main">
                  <div class=bar-wrapper> speed 
                    <div class="bar-indicator"><div class="bar-indicator_bar bar-indicator_bar__active"></div><div class="bar-indicator_bar bar-indicator_bar__active"></div><div class="bar-indicator_bar bar-indicator_bar__active"></div><div class="bar-indicator_bar bar-indicator_bar__demi"></div><div class="bar-indicator_bar bar-indicator_bar__demi"></div><div class="bar-indicator_bar bar-indicator_bar__inactive"></div><div class="bar-indicator_bar bar-indicator_bar__inactive"></div><div class="bar-indicator_bar bar-indicator_bar__inactive"></div><div class="bar-indicator_bar bar-indicator_bar__inactive"></div><div class="bar-indicator_bar bar-indicator_bar__inactive"></div><div class="bar-indicator_bar bar-indicator_bar__inactive"></div><div class="bar-indicator_bar bar-indicator_bar__inactive"></div><div class="bar-indicator_bar bar-indicator_bar__inactive"></div><div class="bar-indicator_bar bar-indicator_bar__inactive"></div><div class="bar-indicator_bar bar-indicator_bar__inactive"></div><div class="bar-indicator_bar bar-indicator_bar__inactive"></div><div class="bar-indicator_bar bar-indicator_bar__inactive"></div><div class="bar-indicator_bar bar-indicator_bar__inactive"></div><div class="bar-indicator_bar bar-indicator_bar__inactive"></div><div class="bar-indicator_bar bar-indicator_bar__inactive"></div><div class="bar-indicator_bar bar-indicator_bar__inactive"></div><div class="bar-indicator_bar bar-indicator_bar__inactive"></div><div class="bar-indicator_bar bar-indicator_bar__inactive"></div><div class="bar-indicator_bar bar-indicator_bar__inactive"></div></div>
                  </div>
                  <div class=bar-wrapper> shield 
                    <div class="bar-indicator"><div class="bar-indicator_bar bar-indicator_bar__active"></div><div class="bar-indicator_bar bar-indicator_bar__active"></div><div class="bar-indicator_bar bar-indicator_bar__active"></div><div class="bar-indicator_bar bar-indicator_bar__demi"></div><div class="bar-indicator_bar bar-indicator_bar__demi"></div><div class="bar-indicator_bar bar-indicator_bar__inactive"></div><div class="bar-indicator_bar bar-indicator_bar__inactive"></div><div class="bar-indicator_bar bar-indicator_bar__inactive"></div><div class="bar-indicator_bar bar-indicator_bar__inactive"></div><div class="bar-indicator_bar bar-indicator_bar__inactive"></div><div class="bar-indicator_bar bar-indicator_bar__inactive"></div><div class="bar-indicator_bar bar-indicator_bar__inactive"></div><div class="bar-indicator_bar bar-indicator_bar__inactive"></div><div class="bar-indicator_bar bar-indicator_bar__inactive"></div><div class="bar-indicator_bar bar-indicator_bar__inactive"></div><div class="bar-indicator_bar bar-indicator_bar__inactive"></div><div class="bar-indicator_bar bar-indicator_bar__inactive"></div><div class="bar-indicator_bar bar-indicator_bar__inactive"></div><div class="bar-indicator_bar bar-indicator_bar__inactive"></div><div class="bar-indicator_bar bar-indicator_bar__inactive"></div><div class="bar-indicator_bar bar-indicator_bar__inactive"></div><div class="bar-indicator_bar bar-indicator_bar__inactive"></div><div class="bar-indicator_bar bar-indicator_bar__inactive"></div><div class="bar-indicator_bar bar-indicator_bar__inactive"></div></div>
                  </div>
                </div>
                
                <div style="height: 70px;">
                  <p></p>
                </div>
*/
