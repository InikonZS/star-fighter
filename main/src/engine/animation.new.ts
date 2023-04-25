import calc from '../calc.utils';

class Animation{
  frame: number;
  xmax: number;
  ymax: number;
  count: number;
  time: number;
  timeStep: number;
  isFinished: boolean;
  onFinished: (animation: Animation) => void;
  
  constructor(xmax: number, ymax: number, timeStep: number){
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

  render(gl: WebGLRenderingContext, shaderVariables: { posUniVec4: WebGLUniformLocation; }, deltaTime: number){
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

export default Animation;