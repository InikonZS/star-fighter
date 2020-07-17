const BarIndicator = require('./bar-indicator.component.js');

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

module.exports = BarIndicatorCustomized;