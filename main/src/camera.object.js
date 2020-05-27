class Camera{
  constructor(){ 
  }
  getPosVector(){
    return new Vector3d(-this.posX, -this.posY, -this.posZ);
  }
  init(){
    this.camRX=0;
    this.camRY=0;
    this.posX=-2;
    this.posY=-2;
    this.posZ =-3;
  }

  rotateCam(dx, dy){
    this.camRX += dx / 100;
    this.camRY += dy / 100;
    if (this.camRY>0){ this.camRY=0 }
    if (this.camRY<-Math.PI){ this.camRY=-Math.PI}
  }
}

module.exports = Camera;