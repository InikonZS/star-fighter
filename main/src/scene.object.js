

const Basic = require('./basic.object.js');
const Textured = require('./textured.object.js');

const boxModel = require('./box.model.js');
const rocketModel = require('./rocket.model.js');
const Vector3d = require('./vector3d.dev.js');
let Bullet = require('./bullet.object.js');
let Enemy = require('./enemy.object.js')

const calc = require('./calc.utils.js');

class Scene{
  constructor(glCanvas){
    preloadSoundUrl('assets/sounds/laser.mp3');
    preloadSoundUrl('assets/sounds/expl1.mp3');
    preloadSoundUrl('assets/sounds/expl2.mp3');

    let el = document.createElement('div');
    el.textContent = 'X';
    document.body.appendChild(el);
    el.style = 'position:absolute; top:0px; left:0px';
    this.el = el;

    let el1 = document.createElement('div');
    el1.textContent = 'X';
    document.body.appendChild(el1);
    el1.style = 'position:absolute; top:0px; left:0px';
    this.el1 = el1;

    this.glCanvas = glCanvas;
    this.gl = glCanvas.glContext;
    let gl = this.gl;

    this.enemy = new Enemy(gl, new Vector3d(50, 50, 50), new Vector3d(0,0,0));
    this.bs = new Basic(gl,rocketModel , m4.identity(), {r:200, g:20, b:60});

    this.bd = new Basic(gl,boxModel , m4.identity(), {r:200, g:20, b:60});
    this.bs.matrix = m4.translate(this.bs.matrix, 10,3,20);
    //this.bd.matrix = m4.scale(this.bd.matrix, 10,3,20);

    this.particles = [];
    for (let i=0; i< 3000; i++){
      let mtx = m4.identity();
      mtx = m4.translate(mtx, rand(1000)-500, rand(1000)-500, rand(1000)-500);
      let pt = new Basic(gl, boxModel , mtx, {r:rand(255), g:rand(155)+100, b:60});
      this.particles.push(pt);
    }

    this.bullets = [];
    this.shotTime = 0;
  }

  render(shaderVariables, deltaTime){
    let glCanvas = this.glCanvas;
    this.shotTime-=deltaTime;
    if (this.glCanvas.keyboardState.shot){
      if (this.glCanvas.weapon ==1){
        if (this.shotTime<=0 || this.shotTime>=1000){
          let bul = new Bullet(glCanvas.glContext, glCanvas.camera.getPosVector().subVector(glCanvas.camera.getCamNormal().mul(2.10)), glCanvas.camera.getCamNormal().mul(-3.10));
          glCanvas.scene.bullets.push(bul);
          this.shotTime = 0.15;

          playSoundUrl('assets/sounds/laser.mp3');
        }
      }

      if (this.glCanvas.weapon ==2){
        if (this.shotTime<=0 || this.shotTime>=1000){
          let bul = new Bullet(glCanvas.glContext, glCanvas.camera.getPosVector().subVector(glCanvas.camera.getCamNormal().mul(2.10)), glCanvas.camera.getCamNormal().mul(-3.10));
          bul.time = 0.6;
          glCanvas.scene.bullets.push(bul);
          this.shotTime = 0.07;

          playSoundUrl('assets/sounds/laser.mp3');
        }
      }

      if (this.glCanvas.weapon ==3){
        if (this.shotTime<=0 || this.shotTime>=1000){
          let bul = new Bullet(glCanvas.glContext, glCanvas.camera.getPosVector().subVector(glCanvas.camera.getCamNormal().mul(2.10)), glCanvas.camera.getCamNormal().mul(-3.10));
          bul.time = 5;
          glCanvas.scene.bullets.push(bul);
          this.shotTime = 0.35;

          playSoundUrl('assets/sounds/laser_power.mp3');
        }
      }

      if (this.glCanvas.weapon ==4){
        if (this.shotTime<=0 || this.shotTime>=1000){
          let bul = new Bullet(glCanvas.glContext, glCanvas.camera.getPosVector().subVector(glCanvas.camera.getCamNormal().mul(2.10)), glCanvas.camera.getCamNormal().mul(-12.10));
          bul.time = 5;
          glCanvas.scene.bullets.push(bul);
          this.shotTime = 0.45;

          playSoundUrl('assets/sounds/laser_power.mp3');
        }
      }
    }

    this.bs.matrix = m4.xRotate(this.bs.matrix, 0.5*deltaTime);
    this.bs.render(shaderVariables);

    this.bd.matrix=this.bs.matrix;
    //this.bd.matrix = m4.xRotate(this.bd.matrix, 0.5*deltaTime);
    this.bd.render(shaderVariables);
    
    this.particles.forEach(it=>{
      if (this.glCanvas.camera.getPosVector().subVector(new Vector3d(it.matrix[12], it.matrix[13], it.matrix[14])).abs()<400){
        it.render(shaderVariables);
      }
    });

    //// HTML connection
    /*let ps = this.enemy.pos;
    var point = [ps.x, ps.y, ps.z, 1];  // это верхний правый угол фронтальной части
    // вычисляем координаты пространства отсечения,
    // используя матрицу, которую мы вычисляли для F
    var clipspace = m4.transformVector(this.glCanvas.viewMatrix, point);
    // делим X и Y на W аналогично видеокарте
    clipspace[0] /= clipspace[3];
    clipspace[1] /= clipspace[3];
    // конвертация из пространства отсечения в пиксели
    var pixelX = (clipspace[0] *  0.5 + 0.5) * 640;
    var pixelY = (clipspace[1] * -0.5 + 0.5) * 480;
    if (clipspace[3]<0){
      pixelX*=1000;
      pixelY*=1000;
    }
    pixelY = pixelY > 470 ? 470 : pixelY;
    pixelX = pixelX > 630 ? 630 : pixelX;
    pixelY = pixelY < 0 ? 0 : pixelY;
    pixelX = pixelX < 0 ? 0 : pixelX;
    this.el.textContent = 'X '+Math.round(glCanvas.camera.getPosVector().subVector(this.enemy.pos).abs()*10)/10+ 'km';
    //if (clipspace[3]>0){
      */

    let ps = getScreenPos(this.glCanvas.viewMatrix, this.enemy.pos, {top:0, left:0, right:600, bottom:450});
    this.el.style=`position:absolute; top:${ps.y}px; left:${ps.x}px; color:#fff`;
    this.el.textContent = 'Enemy '+Math.round(glCanvas.camera.getPosVector().subVector(this.enemy.pos).abs()*10)/10+ 'km';

    let zp = getScreenPos(this.glCanvas.viewMatrix, new Vector3d(0,0,0), {top:0, left:0, right:600, bottom:450});
    this.el1.style=`position:absolute; top:${zp.y}px; left:${zp.x}px; color:#f99`;
    this.el1.textContent = 'Base '+Math.round(glCanvas.camera.getPosVector().abs()*10)/10+ 'km';
    //} else {
     // this.el.style=`visibility: hidden; position:absolute; top:${pixelY}px; left:${pixelX}px; color:#fff`;
    //}
    //////
    

    let bsl = calc.transformVertexList(this.bd.vertexList, this.bd.matrix);
    let bsl1 = calc.transformVertexList(this.enemy.hitPoint.vertexList, this.enemy.model.matrix);
    let reqFilter = false;
    this.bullets.forEach((it, i, arr)=>{
      it.render(shaderVariables, deltaTime);
      if (it.time<=0 || it.time>=10000){
        arr[i] = undefined;
        reqFilter = true;
      }
  /*    if (it && (it.react(bsl, this.bd.pos))){
        this.bs.color={r:rand(255), g:rand(155)+100, b:60};
        arr[i] = undefined;
        reqFilter = true;
      };*/
      if (it && (it.react(bsl1, this.enemy.pos))){

        this.glCanvas.effects.addEffect(this.enemy.pos);
        this.enemy.model.color={r:rand(255), g:rand(155)+100, b:60};
        this.enemy.pos = new Vector3d(Math.random()*140-70, Math.random()*140-80, Math.random()*140-70);
        let mtx = m4.identity();
        mtx = m4.translate(mtx, this.enemy.pos.x, this.enemy.pos.y, this.enemy.pos.z);
        this.enemy.model.matrix=mtx;
        arr[i] = undefined;
        reqFilter = true;
        rand(10)<5 ? playSoundUrl('assets/sounds/expl1.mp3') : playSoundUrl('assets/sounds/expl2.mp3');
      };
    });
    if (reqFilter){
      this.bullets = this.bullets.filter(it=>it);
      reqFilter = false;
    }
    this.enemy.logic(this.glCanvas.camera.getPosVector());
    this.enemy.render(shaderVariables, deltaTime);
  }
}

function preloadSoundUrl(url){
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
}

function getScreenPos(viewMatrix, vector, clipRect){
  var point = [vector.x, vector.y, vector.z, 1];  
  // это верхний правый угол фронтальной части
  // вычисляем координаты пространства отсечения,
  // используя матрицу, которую мы вычисляли для F
  var clipspace = m4.transformVector(viewMatrix, point);
  // делим X и Y на W аналогично видеокарте
  clipspace[0] /= clipspace[3];
  clipspace[1] /= clipspace[3];
  // конвертация из пространства отсечения в пиксели
  var pixelX = (clipspace[0] *  0.5 + 0.5) * clipRect.right;
  var pixelY = (clipspace[1] * -0.5 + 0.5) * clipRect.bottom;
  if (clipspace[3]<0){
    pixelX*=-10000;
    pixelY*=-10000;
  }
  pixelY = pixelY > clipRect.bottom ? clipRect.bottom : pixelY;
  pixelX = pixelX > clipRect.right ? clipRect.right : pixelX;
  pixelY = pixelY < clipRect.top ? clipRect.top : pixelY;
  pixelX = pixelX < clipRect.left ? clipRect.left : pixelX;
  return {x:pixelX, y:pixelY, back:(clipspace[3]<0)}
}

function rand(lim){
  return Math.trunc(Math.random()*lim);
}

module.exports = Scene;