import calc from '../calc.utils';

import GameObject from './game-object.new';

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

export default Timer;