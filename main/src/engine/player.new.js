const World = require('./world.new.js');
const Vector3d = require('../vector3d.dev.js');
const Camera = require('./camera.new.js');
const calc = require('../calc.utils.js');
const rand = calc.rand;
const Weapon = require('./weapon.new.js');
const GameObject = require('./game-object.new.js');
const anyutils = require('../any.utils.js');

class Player extends GameObject {
  constructor(gl, game, keyStates){
    super();
    this.game = game;
    this.keyStates = keyStates;
    let world = this.game.world
    this.currentWeaponIndex = 1;

    this.health = 100;
    this.bullets = 50;

    this.weapons=[
      new Weapon(world, 0.15, 1.2, 130.1, 'assets/sounds/laser.mp3'),
      new Weapon(world, 0.08, 0.7, 130.1, 'assets/sounds/auto.mp3'),
      new Weapon(world, 0.35, 5.2, 260.1, 'assets/sounds/laser_med.mp3'),
      new Weapon(world, 0.65, 1.2, 440.1, 'assets/sounds/laser_power.mp3'),
    ];

    this.camera = new Camera(game.world, keyStates);
    this.camera.init();


    ///as gameobject
    let mtx = this.camera.getSelfModelMatrix();
    this.model = this.game.world.selfModelList.createStaticItem(mtx);
   /* let hitbox = this.game.world.createBreakable(this.camera.getPosVector(), 5);
    hitbox.type = 'object';
    hitbox.visible = false;
    hitbox.scale = 5;
    hitbox.pos = this.camera.getPosVector();
    hitbox.onHit = (bullet)=>{
      console.log('dead');
      //this.hitbox.deleteSelf();
      //this.model.deleteSelf();
      bullet.deleteSelf();
      //this.deleteSelf();
    }
    this.onProcess = (deltaTime)=>{
      this.model.matrix = this.camera.getSelfModelMatrix();
      hitbox.matrix = this.model.matrix;
      hitbox.hitTransformed = hitbox.meshPointer.getTransformedVertexList(hitbox.matrix);
      hitbox.hitPosition = calc.getPosFromMatrix(hitbox.matrix);
      hitbox.hitDist = hitbox.meshPointer.maxDistance;;//*hitbox.scale;
      this.speedVectorSync = this.camera.getSpeedVector().mul(deltaTime);
      this.render_(deltaTime);
    }*/
   /* let vol = 130/(enobj.pos.subVector(this.glCanvas.camera.getPosVector()).abs());
          rand(10)<5 ? anyutils.playSoundUrl('assets/sounds/hit1.mp3') : anyutils.playSoundUrl('assets/sounds/hit2.mp3');
            rand(10)<5 ? anyutils.playSoundUrl('assets/sounds/expl1.mp3', vol) : anyutils.playSoundUrl('assets/sounds/expl2.mp3', vol);
          rand(10)<5 ? anyutils.playSoundUrl('assets/sounds/near1.mp3') : anyutils.playSoundUrl('assets/sounds/near2.mp3');
*/
    let hitbox = makeHitBox(this, 2, (bullet)=>{
      console.log('dead');
      bullet.deleteSelf();
      //let vol = 130/(bullet.position.subVector(this.camera.getPosVector()).abs());
      rand(10)<5 ? anyutils.playSoundUrl('assets/sounds/hit1.mp3') : anyutils.playSoundUrl('assets/sounds/hit2.mp3');
    });
    this.hitbox = hitbox;
    
    let nearbox = makeHitBox(this, 5, (bullet)=>{
      console.log('near');
      rand(10)<5 ? anyutils.playSoundUrl('assets/sounds/near1.mp3') : anyutils.playSoundUrl('assets/sounds/near2.mp3');
    });
    this.nearbox = nearbox;

    this.onProcess = (deltaTime) =>{
      this.model.matrix = this.camera.getSelfModelMatrix();
      hitbox.process_(deltaTime);
      nearbox.process_(deltaTime);

      this.speedVectorSync = this.camera.getSpeedVector().mul(deltaTime);
      this.render_(deltaTime);
    }

    this.onReact = (ob)=>{
    //if (!(el && el.speedVectorSync)){ return;}
      if (ob.type == 'solid'){
        if (calc.isCrossedSimple(ob.hitPosition, this.camera.getPosVector(), this.speedVectorSync, ob.hitDist)){
          let reflected = calc.mirrorVectorFromMesh(ob.hitTransformed, this.camera.getPosVector(), this.speedVectorSync);
          if (reflected){
            this.camera.setSpeedVector (reflected.normalize().mul(this.camera.getSpeedVector().abs()));  
          };  
        };
      }
    }


    
    this.game.world.objectList.addChild(this);
    /////////
  }

  render_(deltaTime){
    if (this.keyStates.shot){
      this.shot(this.currentWeaponIndex-1);
    }
    this.camera.process(deltaTime);  

    this.weapons.forEach(it=>it.render(deltaTime));

    
  }

  shot(weaponIndex){
    if (this.weapons[weaponIndex].shot(this.camera.getPosVector().subVector(this.camera.getCamNormal().mul(2.10)), 
    this.camera.getCamNormal().mul(-1).addVector(this.camera.getSpeedVector().mul(1/this.weapons[weaponIndex].bulletSpeed))
    )){
      this.bullets--;
      //glCanvas.gamePanel.bullets.node.textContent = 'bullets: '+this.bullets;
    }
  }

  setWeapon(weaponIndex){
    this.currentWeaponIndex = weaponIndex;
  }
}

function makeHitBox(gameObject, scale_, onHit){
  let hitbox = gameObject.game.world.createBreakable(gameObject.camera.getPosVector(), scale_);
  hitbox.type = 'object';
  hitbox.visible = false;
  hitbox.scale = scale_;
  
  hitbox.onHit = onHit;
  hitbox.process_ = (deltaTime)=>{
   // hitbox.matrix = gameObject.model.matrix;
    let mt = m4.identity();
    let pos = gameObject.camera.getPosVector();
    mt = m4.translate(mt, pos.x, pos.y, pos.z);
    mt = m4.scale(mt, scale_, scale_, scale_);

    hitbox.matrix = mt;

    hitbox.hitTransformed = hitbox.meshPointer.getTransformedVertexList(hitbox.matrix);
    hitbox.hitPosition = calc.getPosFromMatrix(hitbox.matrix);
    hitbox.hitDist = hitbox.meshPointer.maxDistance*hitbox.scale;//;
    //gameObject.speedVectorSync = gameObject.camera.getSpeedVector().mul(deltaTime);
    //gameObject.render_(deltaTime);
  }  
  return hitbox;
}

module.exports = Player;