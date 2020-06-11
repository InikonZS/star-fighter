const calc = require('../calc.utils.js');

class Animation{
  constructor(xmax, ymax, timeStep){
    //this.gl = gl;
    this.frame = 0;
    this.xmax = xmax;
    this.ymax = ymax;
    this.count = xmax * ymax;
    this.time = timeStep;  
    this.timeStep = timeStep;
    this.isFinished = false;

    this.onFinished = ()=>{this.start()};
  }

  start(){
    this.isFinished = false;
    this.frame = 0;
    this.time = this.timeStep;
  }

  render(gl, shaderVariables, deltaTime){
    gl.uniform4f(shaderVariables.posUniVec4, 
          1 / this.xmax,
          1 / this.ymax, 
          this.frame % this.xmax, 
          Math.trunc(this.frame / this.xmax)
        );
    if (!this.isFinished){
      this.time-=deltaTime;
      if (calc.isTimeout(this.time)){
        this.frame++;
        if (this.frame>=this.count){
          this.isFinished = true;
          if (this.onFinished){
            this.onFinished(this);
          }
        }
        this.time = this.timeStep;
      }
    }
  }
}

module.exports = Animation;