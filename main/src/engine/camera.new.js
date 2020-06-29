const Vector3d = require('../vector3d.dev.js');


class Camera{
  constructor(world, keyboardState){
    this.keyboardState = keyboardState;
    //this.tmat = m4.identity();
    this.dmat = m4.identity();
    this.lmat = m4.identity();
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

  applySpeed(spd){
    let cam = this;
    cam.posX+=spd.x;
    cam.posY+=spd.y;
    cam.posZ+=spd.z;
  }

  getCamNormal(){
    return getCameraNormal(this);
  }

  getNormalMatrix(){
    let matrix = camRotMatrix(this);
    matrix = m4.inverse(matrix);
    return matrix;
  }

  getMatrix(){
    let matrix = camRotMatrix(this);
    matrix = m4.translate(matrix, this.posX, this.posY, this.posZ);
    return matrix;
  }

  getSelfModelMatrix(){
    return getCameraSelfMatrix(this);
  }

  init(){
    this.camRX=0;
    this.camRY=0;
    this.camRZ=0
    this.posX=-2;
    this.posY=-2;
    this.posZ =-3;
    this.vX=0;
    this.vY=0;
    this.vZ=0;    

    this.roX=0;
    this.roY=0;
    this.crn=0;
    this.acl=0;
    this.moc=false;
  }

  rotateCam(dx, dy, shoter=false){
    if (shoter){
      this.camRX += (dx / 200);
      this.camRY += (dy / 200);  
      this.camRZ += 0;
      if (this.camRY>0){ this.camRY=0 }
      if (this.camRY<-Math.PI){ this.camRY=-Math.PI}
    } else {
      let crenSpeed = 0.0032;
      //this.lmat = m4.translate(this.dmat, 0,0,0);
      this.dmat = m4.axisRotate(this.dmat, getCameraNormal(this, 1).toVec4(), crenSpeed*dx);
      this.dmat = m4.axisRotate(this.dmat, getCameraNormal(this, 2).toVec4(), crenSpeed*dy);
    }
  }

  process(deltaTime){
    this.dt = deltaTime;
    
    let k=4;
    for (let i=0; i<16; i++){
      this.lmat[i]=(this.lmat[i]*(k-1)+this.dmat[i])/k;
    }

    //mobile
    if (this.moc){
      this.rotateCam(this.roX*deltaTime, this.roY*deltaTime, false);
      this.dmat = m4.axisRotate(this.dmat, this.getCamNormal().toVec4(), this.crn*deltaTime);
      if (this.acl>0){
        this.keyboardState.backward=false;
        if (this.acl>30){ this.acl=30}
        trueVolumeCamera(this, this.acl, deltaTime, [0,0,1,0]);
      }
      if (this.acl<0){
        this.keyboardState.backward =true;
        //this.getSpeedVector().normalize().mul(-1)
        //trueVolumeCamera(this, this.acl, deltaTime, [0,0,1,0]);
      }
    }
    ///

    let crenSpeed = 0.62;
    if (this.keyboardState.crenleft){
      this.dmat = m4.axisRotate(this.dmat, this.getCamNormal().toVec4(), -crenSpeed*deltaTime);
    }

    if (this.keyboardState.crenright){
      this.dmat = m4.axisRotate(this.dmat, this.getCamNormal().toVec4(), crenSpeed*deltaTime);
    }

   /* if (this.keyboardState.left){
      this.dmat = m4.axisRotate(this.dmat, getCameraNormal(this, 2).toVec4(), -crenSpeed*deltaTime);
    }

    if (this.keyboardState.right){
      this.dmat = m4.axisRotate(this.dmat, getCameraNormal(this, 2).toVec4(), crenSpeed*deltaTime);
    }*/

   /* if (this.keyboardState.up){
      this.dmat = m4.axisRotate(this.dmat, getCameraNormal(this, 2).toVec4(), -crenSpeed*deltaTime);
    }

    if (this.keyboardState.down){
      this.dmat = m4.axisRotate(this.dmat, getCameraNormal(this, 2).toVec4(), crenSpeed*deltaTime);
    }
*/
    if (this.keyboardState.left){
      //this.camRX -= (1 / 200);
      let moveSpeed =-0.3;
      //this.dmat = m4.axisRotate(this.dmat, getCameraNormal(this, 1).toVec4(), moveSpeed*deltaTime);

      let matrix = m4.identity();//m4.translate(this.tmat,0,0,0); 
      matrix = m4.axisRotate(matrix, getCameraNormal(this, 1).toVec4(), -moveSpeed*deltaTime);//m4.zRotate(matrix, moveSpeed * deltaTime);
      let spd = this.getSpeedVector().toVec4();
      let sp = m4.transformVector(matrix, spd);
      this.setSpeedVector(new Vector3d(0,0,0).fromList(sp, 0));
      //let moveSpeed = 5;
      //trueVolumeCamera(this, moveSpeed, deltaTime, [1,0,0,0]); 
    }

    if (this.keyboardState.right){
      //this.camRX += (1 / 200);
      
      let moveSpeed =0.3;
      //this.dmat = m4.axisRotate(this.dmat, getCameraNormal(this, 1).toVec4(), moveSpeed*deltaTime);

      let matrix = m4.identity();//m4.translate(this.tmat,0,0,0); 
      matrix = m4.axisRotate(matrix, getCameraNormal(this, 1).toVec4(), -moveSpeed*deltaTime);//m4.zRotate(matrix, moveSpeed * deltaTime);
      let spd = this.getSpeedVector().toVec4();
      let sp = m4.transformVector(matrix, spd);
      this.setSpeedVector(new Vector3d(0,0,0).fromList(sp, 0));
      //let moveSpeed = 5;
      //trueVolumeCamera(this, moveSpeed, deltaTime, [-1,0,0,0]); 
    }

    if (this.keyboardState.forward){
      let moveSpeed = 30.3;
      trueVolumeCamera(this, moveSpeed, deltaTime, [0,0,1,0]);
    }

    //let cam = glCanvas.camera;
    let cam = this;
    //todo SYNC it with game time!!!
    
    let friction = 0.992;
    if (!this.keyboardState.forward){
      friction = 0.9995;  
    }
    if (this.keyboardState.backward){
      friction = 0.980;  
    }

    if (this.getSpeedVector().abs()>30){
      friction = 0.930;  
    }

    cam.vX*=friction;
    cam.vY*=friction;
    cam.vZ*=friction;
    cam.lastPos = cam.getPosVector();
    cam.posX+=cam.vX*deltaTime;
    cam.posY+=cam.vY*deltaTime;
    cam.posZ+=cam.vZ*deltaTime;
  }
}

function trueVolumeCamera(cam, moveSpeed, deltaTime, accv){
  let nvv =accv;
  let matrix = camRotMatrix(cam);
  matrix = m4.inverse(matrix);
  nvv=m4.transformVector(matrix,nvv);
  let nv = new Vector3d(0,0,0).fromList(nvv, 0).mul(-1 * moveSpeed * deltaTime);
  cam.vX-=nv.x;
  cam.vY-=nv.y;
  cam.vZ-=nv.z;
  return new Vector3d(-nv.x, -nv.y, -nv.z);
}

function getCameraNormal(cam, ax){
  let nvv =[0,0,1,0];

  if (ax == 1){
    nvv = [0,1,0,0];
  }
  if (ax == 2){
    nvv = [1,0,0,0];
  }

  let matrix = camRotMatrix(cam);
  matrix = m4.inverse(matrix);
  nvv=m4.transformVector(matrix,nvv);
  let nv = new Vector3d(0,0,0).fromList(nvv, 0);
  return new Vector3d(nv.x, nv.y, nv.z);  
}



let slowCam = true;
function getCameraSelfMatrix(cam){
  let nvc = cam.getPosVector().addVector(cam.getCamNormal().mul(-1));
  let mmt = m4.identity();//m4.translate(cam.tmat,0,0,0);

  mmt[12]= nvc.x;
  mmt[13]= nvc.y;
  mmt[14]= nvc.z;

  let mts;
  if(!slowCam){
    mts = cam.getNormalMatrix();
  } else {
    mts = cam.lmat;
    mts= m4.inverse(mts);
  }

  mts = m4.xRotate(mts,Math.PI/2);
  //mts = m4.yRotate(mts,Math.PI/2);
  mts = m4.multiply(mmt, mts);
  //mts = m4.multiply(mts, cam.dmat);
  return mts;
}

function camRotMatrix(cam){
  let matrix = m4.identity();
  matrix = m4.xRotate(matrix, cam.camRY);
  matrix = m4.yRotate(matrix, cam.camRZ);
  matrix = m4.zRotate(matrix, cam.camRX);
  matrix = m4.multiply(matrix, cam.dmat);
  return matrix;
}

module.exports = Camera;