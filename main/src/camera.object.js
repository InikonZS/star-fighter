class Camera{
  constructor(){ 
  }
  getPosVector(){
    return new Vector3d(-this.posX, -this.posY, -this.posZ);
  }
  init(){
    this.camRX=0;
    this.camRY=0;
    this.camRZ=0;
    this.posX=-2;
    this.posY=-2;
    this.posZ =-3;
  }

  rotateCam(dx, dy){
    this.camRX += (dx / 100);
    this.camRY += (dy / 100);
    this.camRZ += 0;
    if (this.camRY>0){ this.camRY=0 }
    if (this.camRY<-Math.PI){ this.camRY=-Math.PI}
  }

  process(glCanvas, deltaTime){
    if (glCanvas.keyboardState.forward){
      let moveSpeed = 3;
      planeCamera(this, moveSpeed, deltaTime);
    }
  }

/*  rotateCam(dx, dy){
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
  cam.posX-=nv.x;
  cam.posY-=nv.y;
  cam.posZ-=nv.z;
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