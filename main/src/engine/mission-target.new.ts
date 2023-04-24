//const Control = require('../control-js/control.component.js');
import calc from '../calc.utils';
import GameObject from './game-object.new';
import Game from './game.new';

class Target extends GameObject{
  text: string;
  status: string;
  onChange: (status: string)=>void;

  constructor(game: Game, text: string){
    super();
    this.text = text;
    this.status = 'pending';
    this.onChange;
  }

  setFail(){
    this.status = 'failed';
    if (this.onChange){
      this.onChange(this.status);
    }
  }

  setText(text: string){
    this.text = text;
    if (this.onChange){
      this.onChange(this.status);
    }  
  }

  setComplete(){
    this.status = 'completed';
    if (this.onChange){
      this.onChange(this.status);
    }
  }
}

class TargetList extends GameObject{
  game: any;
  onChange: () => void;
  onCompletedAll: any;
  constructor(game: Game){
    super();
    this.game=game;
    this.onChange = () => {
      this.refresh();
    };
  }

  addTarget(text: string){
    let target = new Target(this.game, text);
    target.onChange = (status) =>{
      if (status == 'completed'){

      }

      if (status == 'failed'){

      }
      this.refresh();
    }
    this.addChild(target);
    this.refresh();
    return target;
  }

  refresh(){
    let msg = '';
    this.childList.forEach(it=>{
        msg += '<div>'+it.text +' ' +it.status +'</div>';
    });
    this.game.glCanvas.gamePanel.missionTarget.node.innerHTML = msg;  
  }

  checkAll(){
    let res = true;
    for (let i=0; i<this.childList.lenght; i++){
      if (this.childList[i].status!='completed'){
        return false;
      }
    }
    if (this.onCompletedAll){
      this.onCompletedAll();
    }
    return res;
  }
}


export default TargetList;