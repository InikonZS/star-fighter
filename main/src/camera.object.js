const Vector3d = require('./vector3d.dev.js');
const Weapon = require('./weapon.object.js');

class Camera{
  constructor(glCanvas){
    this.weapons=[
      new Weapon(0.15, 1.2, 3.1, 'assets/sounds/laser.mp3'),
      new Weapon(0.08, 0.7, 3.1, 'assets/sounds/laser.mp3'),
      new Weapon(0.35, 5.2, 3.1, 'assets/sounds/laser_power.mp3'),
      new Weapon(0.65, 1.2, 14.1, 'assets/sounds/laser_power.mp3'),
    ];
    this.intersect;
    this.glCanvas = this.glCanvas
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
    matrix = m4.translate(matrix, px, py, pz);
    return matrix;
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
    this.weapons.forEach(it=>it.render(deltaTime));

    this.dt = deltaTime;
    if (glCanvas.keyboardState.forward){
      let moveSpeed = 0.3;
      trueVolumeCamera(this, moveSpeed, deltaTime);
    }
    let cam = glCanvas.camera;
    //todo SYNC it with game time!!!
    cam.vX*=0.999;
    cam.vY*=0.999;
    cam.vZ*=0.999;
    if (this.intersect){
      let nv = this.intersect(this.getPosVector(), this.getSpeedVector());
      cam.posX+=nv.x;
      cam.posY+=nv.y;
      cam.posZ+=nv.z;
    } else {
    cam.posX+=cam.vX;
    cam.posY+=cam.vY;
    cam.posZ+=cam.vZ;
    }
  }

  shot(glCanvas, weaponIndex){
    this.weapons[weaponIndex].shot(glCanvas.glContext, glCanvas.scene.bullets, this.getPosVector().subVector(glCanvas.camera.getCamNormal().mul(2.10)), this.getCamNormal().mul(-1));
  }

  rotateCamg(dx, dy){
   /* this.camRX += (dx / 100) * Math.sin(this.camRY);
    this.camRY += (dy / 100);
    this.camRZ += (dx / 100) * Math.cos(this.camRY);*/
  /*  let nc = this.getCamNormal().normalize();
    this.camRX += (dx / 100) * -Math.sin(this.camRY)// + (dy/100)*Math.cos(this.camRZ);
    this.camRY += (dy / 100) * Math.cos(this.camRZ) - (dx/100)*Math.sin(this.camRZ);
    this.camRZ += (dx / 100) * Math.cos(this.camRY);*/
    let matrix = m4.identity();
    matrix = m4.xRotate(matrix, this.camRY);
    matrix = m4.yRotate(matrix, this.camRZ);
    matrix = m4.zRotate(matrix, this.camRX);
    matrix = m4.inverse(matrix);

    let v= new Vector3d(dx/100, dy/100, 0).transform(matrix);
    this.camRX += v.y;
    this.camRY += v.z;
    this.camRZ += v.x;
    //this.camRZ += (dx / 100) * nc.z;
  }

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

function getCameraNormalg(cam){
  let ny = Math.cos(cam.camRX);
  let nx = Math.sin(cam.camRX);
  let nv = {x:-nx*Math.sin(cam.camRY), y:-ny*Math.sin(cam.camRY), z:-Math.cos(cam.camRY)};  
  return new Vector3d(-nv.x, -nv.y, -nv.z);
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
module.exports = Camera;