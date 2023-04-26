import Control from './control.component';

class BarIndicator extends Control{
  wrapperClass: string;
  activeClass: string;
  inactiveClass: string;
  demiClass: string;
  maxValue: number;
  value: number;
  demiValue: number;
  bars: Control[];

  constructor (parentNode: HTMLElement, count: number, wrapperClass: string, activeClass: string, inactiveClass: string, demiClass: string){
    super(parentNode, 'div', wrapperClass);
    this.wrapperClass=wrapperClass;
    this.activeClass=activeClass;
    this.inactiveClass=inactiveClass;
    this.demiClass = demiClass;
    this.maxValue = count;

    this.value=0;
    this.demiValue=0;
    this.bars = [];
    for (let i=0; i<count; i++){
      let bar = new Control(this.node, 'div', inactiveClass);
      this.bars.push(bar);
    }
  }

  setValue(value: number, demiValue: number){
    this.value = value;
    this.demiValue = demiValue;
    let minValue = Math.min(this.demiValue, this.value);
    let maxValue = Math.max(this.demiValue, this.value);
    for (let i=0; i<this.maxValue; i++){
      if (i<minValue){
        this.bars[i].node.className=this.activeClass;
      } else if (i<maxValue){
        this.bars[i].node.className=this.demiClass;
      } else {
        this.bars[i].node.className=this.inactiveClass;
      }
    }  
  }
}

export default BarIndicator;