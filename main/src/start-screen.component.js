const Control = require('./control-js/control.component.js');

class StartScreen extends Control{
  constructor(parentNode, onClickStart){
    super(parentNode, 'div', 'startBackground', '');
    this.node.style = `
      width:640px;
      height:480px;
      display:flex;
      justify-content:center;
      align-items:center;
      background-image: url('../assets/back_images/back3.jpg');
      opacity:100%;
      flex-direction:column;
    `;
    
    this.startButton = new Control(this.node, 'div', 'startButton', 'Click To Load', onClickStart);
    this.loadingIndicator = new Control(this.node, 'div', 'loadingIndicator', ' ');
  }
}

module.exports = StartScreen;