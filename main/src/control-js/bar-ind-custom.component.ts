import BarIndicator from './bar-indicator.component';

class BarIndicatorCustomized extends BarIndicator{
  constructor (parentNode: HTMLElement, value: number, demiValue: number){
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

  setPercent(percent: number){
    let val = Math.ceil((percent/100)*this.maxValue);
    this.setValue(val, val);
  }
}

export default BarIndicatorCustomized;