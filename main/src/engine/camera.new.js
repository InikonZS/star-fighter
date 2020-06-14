const Vector3d = require('../vector3d.dev.js');


class Camera{
  constructor(world, keyboardState){
    this.keyboardState = keyboardState;
    //this.intersect;
    //this.glCanvas = this.glCanvas;
  }
  getPosVector(){
    return new Vector3d(-this.posX, -this.posY, -this.posZ);
  }
  getSpeedVector(){
    return new Vector3d(-this.vX, -this.vY, -this.vZ);
  }

  setSpeedVector(v){
    this.vX=-v.x;
    this.vY=-v.y;
    this.vZ=-v.z;
  }

  getCamNormal(){
    return getCameraNormal(this);
  }

  getNormalMatrix(){
    let matrix = m4.identity();
    matrix = m4.xRotate(matrix, this.camRY);
    matrix = m4.yRotate(matrix, this.camRZ);
    matrix = m4.zRotate(matrix, this.camRX);
    matrix = m4.inverse(matrix);
    return matrix;
  }

  getMatrix(){
    let matrix = m4.identity();
    matrix = m4.xRotate(matrix, this.camRY);
    matrix = m4.yRotate(matrix, this.camRZ);
    matrix = m4.zRotate(matrix, this.camRX);
    matrix = m4.translate(matrix, this.posX, this.posY, this.posZ);
    return matrix;
  }

  getSelfModelMatrix(){
    return getCameraSelfMatrix(this);
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

  process(deltaTime){
    this.dt = deltaTime;
    if (this.keyboardState.forward){
      let moveSpeed = 10.3;
      trueVolumeCamera(this, moveSpeed, deltaTime);
    }
    //let cam = glCanvas.camera;
    let cam = this;
    //todo SYNC it with game time!!!
    let friction = 0.997;
    cam.vX*=friction;
    cam.vY*=friction;
    cam.vZ*=friction;
    cam.posX+=cam.vX*deltaTime;
    cam.posY+=cam.vY*deltaTime;
    cam.posZ+=cam.vZ*deltaTime;
  }
}

function trueVolumeCamera(cam, moveSpeed, deltaTime){
  let nvv =[0,0,1,0];
  let matrix = m4.identity(); 
  matrix = m4.xRotate(matrix, cam.camRY);
  matrix = m4.yRotate(matrix, cam.camRZ);
  matrix = m4.zRotate(matrix, cam.camRX);
  matrix = m4.inverse(matrix);
  nvv=m4.transformVector(matrix,nvv);
  let nv = new Vector3d(0,0,0).fromList(nvv, 0).mul(-1 * moveSpeed * deltaTime);
 /* cam.posX+=(moveSpeed * deltaTime) *nv[0];
  cam.posY+=(moveSpeed * deltaTime) *nv[1];
  cam.posZ+=(moveSpeed * deltaTime) *nv[2];*/
  cam.vX-=nv.x;
  cam.vY-=nv.y;
  cam.vZ-=nv.z;
  return new Vector3d(-nv.x, -nv.y, -nv.z);
}

function getCameraNormal(cam){
  let nvv =[0,0,1,0];
  let matrix = m4.identity(); 
  matrix = m4.xRotate(matrix, cam.camRY);
  matrix = m4.yRotate(matrix, cam.camRZ);
  matrix = m4.zRotate(matrix, cam.camRX);
  matrix = m4.inverse(matrix);
  nvv=m4.transformVector(matrix,nvv);
  let nv = new Vector3d(0,0,0).fromList(nvv, 0);//.mul(-1 * moveSpeed * deltaTime);
  return new Vector3d(nv.x, nv.y, nv.z);  
}

function getCameraSelfMatrix(cam){
  let nvc = cam.getPosVector().addVector(cam.getCamNormal().mul(-1));
  let mmt = m4.identity();
  mmt[12]= nvc.x;
  mmt[13]= nvc.y;
  mmt[14]= nvc.z;

  let mts = cam.getNormalMatrix();
  mts = m4.xRotate(mts,Math.PI/2);
  mts = m4.yRotate(mts,Math.PI/2);
  mts = m4.multiply(mmt, mts);
  return mts;
}

module.exports = Camera;