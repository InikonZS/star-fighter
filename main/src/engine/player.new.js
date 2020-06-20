const World = require('./world.new.js');
const Vector3d = require('../vector3d.dev.js');
const Camera = require('./camera.new.js');
const calc = require('../calc.utils.js');
const rand = calc.rand;
const Weapon = require('./weapon.new.js');
const Timer = require('./timer.new.js');
const GameObject = require('./game-object.new.js');
const anyutils = require('../any.utils.js');

const Phys = require('./physic.new.js');


class Player extends GameObject {
  constructor(gl, game, keyStates){
    super();
    this.game = game;
    this.keyStates = keyStates;
    let world = this.game.world

    //this.currentWeaponIndex = 1;
    
    this.isAlive = true;
    this.health = 100;
    //this.bullets = 5000;

    this.shieldEnergy = 100;
    this.shieldTime = 2;

    //this.domStates = 

    this.weapons=[
      new Weapon(world, 0.15, 1.2, 130.1, 'assets/sounds/laser.mp3', 'laser',100),
      new Weapon(world, 0.08, 0.7, 130.1, 'assets/sounds/auto.mp3', 'auto', 1000),
      new Weapon(world, 0.35, 5.2, 260.1, 'assets/sounds/laser_med.mp3', 'phaser', 60),
      new Weapon(world, 0.65, 3.2, 740.1, 'assets/sounds/laser_power.mp3', 'railgun',70),
    ];
    this.setWeapon(1);

    this.camera = new Camera(game.world, keyStates);
    this.camera.init();


    ///as gameobject
    let mtx = this.camera.getSelfModelMatrix();
    this.model = this.game.world.selfModelList.createStaticItem(mtx);
 
    let hitbox = makeHitBox(this, 2, (bullet)=>{
      if (this.shieldActivated) {return;}
      console.log('hit');
      bullet.deleteSelf();
      rand(10)<5 ? anyutils.playSoundUrl('assets/sounds/hit1.mp3') : anyutils.playSoundUrl('assets/sounds/hit2.mp3');
      this.health-=rand(15)+3;
      this.game.glCanvas.gamePanel.health.node.textContent = 'health: '+this.health;
      if (this.health<0){
        console.log('dead');
        this.isAlive = false;
        this.game.glCanvas.keyboardState.shot = false;
        this.game.world.createExplosion(this.camera.getPosVector().subVector(this.camera.getCamNormal().mul(2.10)),40);
        rand(10)<5 ? anyutils.playSoundUrl('assets/sounds/expl1.mp3') : anyutils.playSoundUrl('assets/sounds/expl2.mp3');
       
        setTimeout(()=>{
          this.game.glCanvas.keyboardState.shot = false;
          this.game.glCanvas.menu.activate();
          this.game.glCanvas.menu.menu.selectPage(this.game.glCanvas.menu.gameOverMenu);
          document.exitPointerLock();
        },50);
      }
    });
    this.hitbox = hitbox;

    
    
    let nearbox = makeHitBox(this, 5, (bullet)=>{
      console.log('near');
      rand(10)<5 ? anyutils.playSoundUrl('assets/sounds/near1.mp3') : anyutils.playSoundUrl('assets/sounds/near2.mp3');
    });
    this.nearbox = nearbox;

    let shieldbox = makeHitBox(this, 3, (bullet)=>{
      if (!this.shieldActivated) {return;}
      console.log('shielded');
      rand(10)<5 ? anyutils.playSoundUrl('assets/sounds/error.mp3') : anyutils.playSoundUrl('assets/sounds/error.mp3');
    });
    this.nearbox = nearbox;
//this.touch = new Phys(this.nearbox.mesh.vertexList);
    this.onProcess = (deltaTime) =>{
      this.model.matrix = this.camera.getSelfModelMatrix();
      hitbox.process_(deltaTime);
      nearbox.process_(deltaTime);
      shieldbox.process_(deltaTime);
      //this.camera.vZ+=1*deltaTime; GRAVITY
      this.touch = new Phys(this.nearbox.hitTransformed);
      this.speedVectorSync = this.camera.getSpeedVector().mul(deltaTime);
      //this.render_(deltaTime);
    }

    this.onReact = (ob)=>{
    //if (!(el && el.speedVectorSync)){ return;}
      if (ob.type == 'solid'){
        if (calc.isCrossedSimple(ob.hitPosition, this.camera.getPosVector(), this.speedVectorSync, ob.hitDist*1.2)){
          //let spv = this.speedVectorSync;
          //if (this.speedVectorSync.abs()<0.01){spv = this.camera.getSpeedVector().normalize().mul(0.01); }
          if (ob.physicList.isCrossedByPhys(this.touch)){
            let reflected = ob.physicList.mirrorVector(this.camera.getPosVector(), this.speedVectorSync.mul(1000));
            if (reflected){
              this.camera.applySpeed(this.speedVectorSync);
              this.camera.setSpeedVector (reflected.normalize().mul(this.camera.getSpeedVector().abs()*0.73));  
            } else {
              //this.camera.setSpeedVector(this.camera.getSpeedVector().mul(-1)); ???
            }
          }
         /* */
        };
      }

      if (ob.type == 'collectable'){
        if (calc.isCrossedSimple(ob.hitPosition, this.camera.getPosVector(), this.speedVectorSync, ob.hitDist)){
          if (ob.bonus == 'bullets'){
            this.weapons[this.currentWeaponIndex-1].bulletCount+=ob.bonus_count;
            anyutils.playSoundUrl('assets/sounds/reload.mp3')
            ob.deleteSelf();
            this.game.glCanvas.gamePanel.bullets.node.textContent = 'bullets: '+this.weapons[this.currentWeaponIndex-1].bulletCount;
            
          }

          if (ob.bonus == 'health'){
            this.health = incLim(this.health, ob.bonus_count, 100);
            anyutils.playSoundUrl('assets/sounds/correct.mp3')
            ob.deleteSelf();
            this.game.glCanvas.gamePanel.health.node.textContent = 'health: '+this.health;
          }

          if (ob.bonus == ''){
            //anyutils.playSoundUrl('assets/sounds/error.mp3');
            ob.deleteSelf();
          }
          
          if (ob.onCollect){
            ob.onCollect();
          }
        };
      }
    }

    this.refTimer = new Timer(0.1, ()=>{
      this.game.glCanvas.gamePanel.speed.node.textContent = 'speed: '+Math.round(this.camera.getSpeedVector().abs()*10)/10;
    });
    //this.game.t

    this.game.world.objectList.addChild(this);
    /////////
  }

  render_(deltaTime){
    this.refTimer.process(deltaTime);
    if (this.keyStates.shot){
      this.shot(this.currentWeaponIndex-1);
    }

    this.shieldTime-=deltaTime;
    if (this.keyStates.space){
      this.shieldActivate(deltaTime);
    } else {
      this.shieldActivated = false;
    }

    this.camera.process(deltaTime);  

    this.weapons.forEach(it=>it.render(deltaTime));

    
  }

  shot(weaponIndex){

    //if (this.bullets>0){
      if (this.weapons[weaponIndex].shot(this.camera.getPosVector().subVector(this.camera.getCamNormal().mul(2.10)), 
      this.camera.getCamNormal().mul(-1).addVector(this.camera.getSpeedVector().mul(1/this.weapons[weaponIndex].bulletSpeed))
      )){
        //this.bullets--;
        this.game.glCanvas.gamePanel.bullets.node.textContent = 'bullets: '+this.weapons[weaponIndex].bulletCount;
      }
    //}
  }
  
  shieldActivate(deltaTime){
    if (this.shieldEnergy>0){
      //console.log(this.shieldTime);
      this.shieldActivated = true;
      if (calc.isTimeout(this.shieldTime)){
        this.shieldEnergy-=1;
        this.shieldTime = 0.5;
        this.game.glCanvas.gamePanel.shield.node.textContent = 'shield: '+this.shieldEnergy;
      }
    } else {
      this.shieldActivated = false;
      //this.shieldTime = 0;  
    }
  }

  setWeapon(weaponIndex){
    this.currentWeaponIndex = weaponIndex;
    this.game.glCanvas.gamePanel.weapon.node.textContent = this.weapons[this.currentWeaponIndex-1].weaponName;
    this.game.glCanvas.gamePanel.bullets.node.textContent = 'bullets: '+this.weapons[weaponIndex-1].bulletCount;
  }
}

function makeHitBox(gameObject, scale_, onHit){
  let hitbox = gameObject.game.world.createBreakable(gameObject.camera.getPosVector(), scale_);
  hitbox.type = 'object';
  hitbox.visible = false;
  hitbox.scale = scale_;
  hitbox.onHit = onHit;
  hitbox.process_ = (deltaTime)=>{
    //hitbox.matrix = gameObject.model.matrix;
    let mt = m4.identity();
    let pos = gameObject.camera.getPosVector();
    mt = m4.translate(mt, pos.x, pos.y, pos.z);
    mt = m4.scale(mt, scale_, scale_, scale_);

    hitbox.matrix = mt;

    hitbox.hitTransformed = hitbox.meshPointer.getTransformedVertexList(hitbox.matrix);
    hitbox.hitPosition = calc.getPosFromMatrix(hitbox.matrix);
    hitbox.hitDist = hitbox.meshPointer.maxDistance*hitbox.scale;
  }  
  return hitbox;
}

function incLim(val, inc, lim){
  let nv = val+=inc;
  return nv < lim ? nv : lim;
}

/*function qubeLines(size, pos){
  p = [
    new Vector3d(-1, -1, -1).mul(size).addVector(pos),
    new Vector3d(-1, -1, 1).mul(size).addVector(pos),
    new Vector3d(-1, 1, -1).mul(size).addVector(pos),
    new Vector3d(-1, 1, 1).mul(size).addVector(pos),
    new Vector3d(1, -1, -1).mul(size).addVector(pos),
    new Vector3d(1, -1, 1).mul(size).addVector(pos),
    new Vector3d(1, 1, -1).mul(size).addVector(pos),
    new Vector3d(1, 1, 1).mul(size).addVector(pos),
  ];
  lines = [
    p[0], p[1],
    p[1], p[3],
    p[3], p[2],
    p[2], p[0],
    p[4], p[5],
    p[5], p[7],
    p[7], p[6],
    p[6], p[4],
    p[0], p[4],
    p[1], p[5],
    p[2], p[6],
    p[3], p[7],
  ];
  return lines;
}
*/
/*
else { 

  let po = qubeLines(1, this.camera.getPosVector());
  for (let i=0; i<po.length/2; i++){
    reflected = calc.mirrorVectorFromMesh(ob.hitTransformed, po[i*2], po[i*2+1]);
    if (reflected){
      this.camera.setSpeedVector (this.camera.getSpeedVector().mul(-1));  
      break;
    }
  }
}*/

module.exports = Player;