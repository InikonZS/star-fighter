const calc = require('../calc.utils.js');

const GameObject = require('./game-object.new.js');

class Timer extends GameObject{
  constructor(interval, onTimeout){
    super();
    this.interval = interval;
    this.counter = interval;
    this.onProcess = (deltaTime)=>{
      this.counter-=deltaTime;
      if (calc.isTimeout(this.counter)){
        onTimeout();
        this.counter = interval;
      }  
    }
  }
}

module.exports = Timer;