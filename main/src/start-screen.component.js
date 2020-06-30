const Control = require('./control-js/control.component.js');
const calc = require('./calc.utils.js')

class StartScreen extends Control{
  constructor(parentNode, width, height, onClickStart){
    super(parentNode, 'div', 'startBackground', '');
    this.refresh(width, height);
    /*this.node.style = `
      width:${width}px;
      height:${height}px;
      background-image: url('../assets/back_images/back${calc.rand(4)+1}.jpg');
    `;*/
    
    this.startButton = new Control(this.node, 'div', 'startButton', 'Click To Load', onClickStart);
    this.loadingIndicator = new Control(this.node, 'div', 'loadingIndicator', ' ');
  }

  refresh(width, height){
    this.node.style = `
      width:${width}px;
      height:${height}px;
      background-image: url('../assets/back_images/back${calc.rand(4)+1}.jpg');
    `;
  }
}

module.exports = StartScreen;