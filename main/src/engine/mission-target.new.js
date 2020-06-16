//const Control = require('../control-js/control.component.js');
const calc = require('../calc.utils.js');
const GameObject = require('./game-object.new.js');

class Target extends GameObject{
  constructor(game, text){
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

  setComplete(){
    this.status = 'completed';
    if (this.onChange){
      this.onChange(this.status);
    }
  }
}

class TargetList extends GameObject{
  constructor(game){
    super();
    this.game=game;
    this.onChange = () => {
      this.refresh();
    };
  }

  addTarget(text){
    let target = new Target(this.game, text);
    target.onChange = (status) =>{
      if (status == 'completed'){

      }

      if (status == 'failed'){

      }
      this.refresh();
    }
    this.addChild(target);
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


module.exports = TargetList;