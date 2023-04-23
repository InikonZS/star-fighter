import Control from './control-js/control.component';
import calc from './calc.utils';

export class StartScreen extends Control{
  startButton: Control;
  loadingIndicator: Control;

  constructor(parentNode: HTMLElement, width:number, height: number, onClickStart: ()=>void){
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

  refresh(width: number, height: number){
    this.node.style = `
      width:${width}px;
      height:${height}px;
      background-image: url('../assets/back_images/back${calc.rand(4)+1}.jpg');
    `;
  }
}
