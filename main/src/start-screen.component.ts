import Control from './control-js/control.component';
import calc from './calc.utils';
import { IResourceRecord } from './res-loader';

export class StartScreen extends Control{
  private startButton: Control;
  private loadingIndicator: Control;

  constructor(parentNode: HTMLElement, width:number, height: number, onClickStart: ()=>void){
    super(parentNode, 'div', 'startBackground', '');
    this.refresh(width, height);
    /*this.node.style.cssText = `
      width:${width}px;
      height:${height}px;
      background-image: url('../assets/back_images/back${calc.rand(4)+1}.jpg');
    `;*/
    
    this.startButton = new Control(this.node, 'div', 'startButton', 'Click To Load', onClickStart);
    this.loadingIndicator = new Control(this.node, 'div', 'loadingIndicator', ' ');
  }

  loadingUpdate(type: string, it: IResourceRecord, length: number, current: number){
    this.loadingIndicator.node.textContent = `Loading ${type} ${current}/${length}, ${Math.round(100*current/length)}% done `;
  }

  refresh(width: number, height: number){
    this.node.style.cssText = `
      width:${width}px;
      height:${height}px;
      background-image: url('../assets/back_images/back${calc.rand(4)+1}.jpg');
    `;
  }
}
