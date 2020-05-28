const Vector3d = require('./vector3d.dev.js');

class Camera{
  constructor(){ 
  }
  getPosVector(){
    return new Vector3d(-this.posX, -this.posY, -this.posZ);
  }
  getSpeedVector(){
    return new Vector3d(-this.vX, -this.vY, -this.vZ);
  }
  getCamNormal(){
    return getCameraNormal(this);
  }
  init(){
    this.camRX=0;
    this.camRY=0;
    this.camRZ=0;
    this.posX=-2;
    this.posY=-2;
    this.posZ =-3;

    this.vX=0;
    this.vY=0;
    this.vZ=0;    
  }

  rotateCam(dx, dy){
    this.camRX += (dx / 100);
    this.camRY += (dy / 100);
    this.camRZ += 0;
    if (this.camRY>0){ this.camRY=0 }
    if (this.camRY<-Math.PI){ this.camRY=-Math.PI}
  }

  process(glCanvas, deltaTime){
    this.dt = deltaTime;
    if (glCanvas.keyboardState.forward){
      let moveSpeed = 3;
      volumeCamera(this, moveSpeed, deltaTime);
    }
    let cam = glCanvas.camera;
    cam.vX*=0.999;
    cam.vY*=0.999;
    cam.vZ*=0.999;
    cam.posX+=cam.vX;
    cam.posY+=cam.vY;
    cam.posZ+=cam.vZ;
  }

 /* rotateCam(dx, dy){
    this.camRX += (dx / 100) * Math.sin(this.camRY);
    this.camRY += (dy / 100);
    this.camRZ += (dx / 100) * Math.cos(this.camRY);
  }*/

}


function planeCamera(cam, moveSpeed, deltaTime){
  let ny = cam.posY - (moveSpeed * deltaTime)* Math.cos(cam.camRX);
  let nx = cam.posX - (moveSpeed * deltaTime)* Math.sin(cam.camRX);
  cam.posY = ny;
  cam.posX = nx;
}

function volumeCamera(cam, moveSpeed, deltaTime){
  let ny = (moveSpeed * deltaTime) * Math.cos(cam.camRX);
  let nx = (moveSpeed * deltaTime) * Math.sin(cam.camRX);
  let nv = {x:-nx*Math.sin(cam.camRY), y:-ny*Math.sin(cam.camRY), z:-(moveSpeed * deltaTime)*Math.cos(cam.camRY)};  
  cam.vX-=nv.x;
  cam.vY-=nv.y;
  cam.vZ-=nv.z;
}

function getCameraNormal(cam){
  let ny = Math.cos(cam.camRX);
  let nx = Math.sin(cam.camRX);
  let nv = {x:-nx*Math.sin(cam.camRY), y:-ny*Math.sin(cam.camRY), z:-Math.cos(cam.camRY)};  
  return new Vector3d(-nv.x, -nv.y, -nv.z);
}

function trueVolumeCamera(cam, moveSpeed, deltaTime){
  let nv =[0,0,1,0];
  let matrix = m4.identity(); 
  matrix = m4.xRotate(matrix, cam.camRY);
  matrix = m4.yRotate(matrix, cam.camRZ);
  matrix = m4.zRotate(matrix, cam.camRX);
  matrix = m4.inverse(matrix);
  nv=m4.transformVector(matrix,nv);
  cam.posX+=(moveSpeed * deltaTime) *nv[0];
  cam.posY+=(moveSpeed * deltaTime) *nv[1];
  cam.posZ+=(moveSpeed * deltaTime) *nv[2];
}
module.exports = Camera;