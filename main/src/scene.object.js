

const Basic = require('./basic.object.js');
const Textured = require('./textured.object.js');

const boxModel = require('./box.model.js');
const rocketModel = require('./tf.model.js');
const rocketModel1 = require('./rocket.model.js');
const Vector3d = require('./vector3d.dev.js');
let Bullet = require('./bullet.object.js');
let Weapon = require('./weapon.object.js');
let Enemy = require('./enemy.object.js');
let Chunk = require('./static-chunk.object.js');
let Message = require('./point-message.object.js')

const calc = require('./calc.utils.js');
const anyutils = require('./any.utils.js');

class Scene{
  constructor(glCanvas){

    this.glCanvas = glCanvas;
    this.gl = glCanvas.glContext;
    let gl = this.gl;

    this.messages = [];
    this.messages.push(new Message(glCanvas.overlay.node,'','fff'));
    this.messages.push(new Message(glCanvas.overlay.node,'','f88'));

    this.enemy = new Enemy(gl, new Vector3d(50, 50, 50), new Vector3d(0,0,0));
    this.enemy.weapon = new Weapon(1.75, 5.2, 6.1, 'assets/sounds/laser.mp3');

    this.hs = new Basic(gl,boxModel , m4.identity(), {r:200, g:20, b:60});
    let plpos = glCanvas.camera.getPosVector();
    this.hs.matrix = m4.translate(this.hs.matrix, plpos.x, plpos.y, plpos.z);

    this.bs = new Basic(gl,rocketModel , m4.identity(), {r:200, g:20, b:60});
    this.bs.matrix = m4.translate(this.bs.matrix, 30,3,40);

    this.tur = new Basic(gl,rocketModel , m4.identity(), {r:200, g:20, b:60});
    this.tur.matrix = m4.translate(this.tur.matrix, 30,3,40);
    this.tur.weapon = new Weapon(1.75, 5.2, 1.1, 'assets/sounds/laser.mp3');


    this.bd = new Basic(gl,boxModel , m4.identity(), {r:200, g:20, b:60});
    

    this.bd.matrix = m4.translate(this.bd.matrix, 30,30,40);
    this.bd.matrix = m4.scale(this.bd.matrix, 10,3,20);

    this.particles = [];
    this.partMtx= [];
    for (let i=0; i< 300; i++){
      let mtx = m4.identity();
      mtx = m4.translate(mtx, rand(1000)-500, rand(1000)-500, rand(1000)-500);
      this.partMtx.push(mtx);
      //let pt = new Basic(gl, boxModel , mtx, {r:rand(255), g:rand(155)+100, b:60});
    }
    let pt = new Chunk(gl , m4.identity(), {r:rand(255), g:rand(155)+100, b:60});
    this.particles.push(pt);

    this.bullets = [];
    //this.shotTime = 0;
  }

  render(shaderVariables, deltaTime){
    let glCanvas = this.glCanvas;

    if (this.glCanvas.keyboardState.shot){
      if (this.glCanvas.weapon ==1){
        this.glCanvas.camera.shot(glCanvas, 0);
      }

      if (this.glCanvas.weapon ==2){
        this.glCanvas.camera.shot(glCanvas, 1);
      }

      if (this.glCanvas.weapon ==3){
        this.glCanvas.camera.shot(glCanvas, 2);
      }

      if (this.glCanvas.weapon ==4){
        this.glCanvas.camera.shot(glCanvas, 3);
      }
    }

    //this.bs.matrix = m4.xRotate(this.bs.matrix, 0.5*deltaTime);
    let cam = glCanvas.camera;
    let matrix = m4.identity();
    matrix = m4.xRotate(matrix, cam.camRY);
    matrix = m4.yRotate(matrix, cam.camRZ);
    matrix = m4.zRotate(matrix, cam.camRX);
    matrix = m4.inverse(matrix);
    this.bs.matrix = matrix;
    //this.bs.matrix = this.glCanvas.
    this.bs.render(shaderVariables);

    //this.bd.matrix=this.bs.matrix;
    //this.bd.matrix = m4.xRotate(this.bd.matrix, 0.5*deltaTime);
    let bsl = calc.transformVertexList(this.bd.vertexList, this.bd.matrix);
    glCanvas.camera.intersect = (p, v) =>{
      let dtt = mirrorVector(bsl, p, v);
      if (dtt){
        let k=-0.6;
        glCanvas.camera.vX = dtt.x*k;
        glCanvas.camera.vY = dtt.y*k;
        glCanvas.camera.vZ = dtt.z*k;
        return glCanvas.camera.getSpeedVector().mul(k);
      } else {
        return v.mul(-1);
      }
 
    }
    this.bd.render(shaderVariables);
    
    this.particles.forEach(it=>{
    //  if (this.glCanvas.camera.getPosVector().subVector(new Vector3d(it.matrix[12], it.matrix[13], it.matrix[14])).abs()<400){
        it.renderMany(shaderVariables,this.partMtx);
    //  }
    });

    this.messages[0].refresh(this.glCanvas.viewMatrix, this.enemy.pos, 'Enemy '+Math.round(glCanvas.camera.getPosVector().subVector(this.enemy.pos).abs()*10)/10+ 'km');
    this.messages[1].refresh(this.glCanvas.viewMatrix, new Vector3d(0,0,0), 'Base '+Math.round(glCanvas.camera.getPosVector().abs()*10)/10+ 'km');


    //////
    this.tur.render(shaderVariables);
    this.tur.weapon.shotTo(this.glCanvas.glContext, this.bullets, this.tur.getPosVector(), this.glCanvas.camera.getPosVector());
    this.tur.weapon.render(deltaTime);
    ////


    //let bsl = calc.transformVertexList(this.bd.vertexList, this.bd.matrix);
    let bsl1 = calc.transformVertexList(this.enemy.hitPoint.vertexList, this.enemy.model.matrix);
    let reqFilter = false;

    let plpos = this.glCanvas.camera.getPosVector();
    this.hs.matrix = m4.identity();
    this.hs.matrix = m4.translate(this.hs.matrix, plpos.x, plpos.y, plpos.z);
    let phs = calc.transformVertexList(this.hs.vertexList, this.hs.matrix);

    this.bullets.forEach((it, i, arr)=>{
      it.render(shaderVariables, deltaTime);
      if (it.time<=0 || it.time>=10000){
        arr[i] = undefined;
        reqFilter = true;
      }

      if (it && (it.react(phs, plpos))){
        this.glCanvas.effects.addEffect(plpos);  
        anyutils.playSoundUrl('assets/sounds/expl1.mp3');
      }

      if (it && (it.react(bsl1, this.enemy.pos))){

        this.glCanvas.effects.addEffect(this.enemy.pos);
        this.enemy.model.color={r:rand(255), g:rand(155)+100, b:60};
        this.enemy.pos = new Vector3d(Math.random()*140-70, Math.random()*140-80, Math.random()*140-70);
        let mtx = m4.identity();
        mtx = m4.translate(mtx, this.enemy.pos.x, this.enemy.pos.y, this.enemy.pos.z);
        this.enemy.model.matrix=mtx;
        arr[i] = undefined;
        reqFilter = true;
        rand(10)<5 ? anyutils.playSoundUrl('assets/sounds/expl1.mp3') : anyutils.playSoundUrl('assets/sounds/expl2.mp3');
      };
    });
    if (reqFilter){
      this.bullets = this.bullets.filter(it=>it);
      reqFilter = false;
    }
    this.enemy.logic(this.glCanvas.camera.getPosVector());
    this.enemy.weapon.render(deltaTime);
    this.enemy.render(shaderVariables, deltaTime);
  }
}

function mirrorVector(vertexList, p, v){
  let b = p.addVector(v);
  let cpl = calc.crossMeshByLineT(vertexList,p,b);
  if (cpl.length){///reflection
    let tr = calc.getNearest(p, cpl).triangle;
    let nor = calc.getNormal(tr[0], tr[1], tr[2]);
    let norm = new Vector3d(nor.x, nor.y, nor.z);
    let dtt = v.subVector(norm.mul(2*v.dot(norm)));
    return dtt;
  }
  return false;
}

/*function preloadSoundUrl(url){
  let el = document.createElement('audio');
  document.body.appendChild(el);
  el.src = url;  
}

function playSoundUrl(url){
  let el = document.createElement('audio');
  document.body.appendChild(el);
  el.oncanplay = ()=>{
    el.play();
  }
  el.onended = ()=>{ 
    document.body.removeChild(el); 
    el = undefined;
  }
  el.src = url;  
}*/


function rand(lim){
  return Math.trunc(Math.random()*lim);
}

module.exports = Scene;