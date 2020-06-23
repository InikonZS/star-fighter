//const Vector3d = require('./vector3d.dev.js');
const Utils = require('../any.utils.js');
const calc = require('../calc.utils.js');
const bulletMaker = require('./bullet.gmob.js');

class Weapon{
  constructor(world, shotTime, bulletLifeTime, bulletSpeed, soundUrl, name='gun', bulletCount=100, damage){
    this.weaponName = name;
    this.bulletCount = bulletCount;

    this.damage = damage;
    this.initialShotTime = shotTime;
    this.shotTime = shotTime;
    this.bulletLifeTime = bulletLifeTime;
    this.bulletSpeed = bulletSpeed;
    this.soundUrl = soundUrl;
    this.world = world;
    if (soundUrl){
      Utils.preloadSoundUrl(soundUrl);
    }
  }
  shot(point, direction, playerPos){
    

    if (calc.isTimeout(this.shotTime)){
    if (this.bulletCount<=0){return;}
    this.bulletCount--;
      //this.world.createBullet(point, direction.mul(this.bulletSpeed), this.bulletLifeTime, false, this.weaponName);
      //console.log('blt ', Bullet);
      //new Bullet(this.world.game, point, direction.mul(this.bulletSpeed), this.bulletLifeTime, calc.makeNormRGBA(), this.weaponName, this.damage);
      if (this.weaponName == 'phaser'){
        bulletMaker.makeAnimatedBullet(this.world.game, point, 15, direction.mul(this.bulletSpeed), this.bulletLifeTime, this.weaponName, this.damage, true);  
      }

      if (this.weaponName == 'laser'){
        bulletMaker.makeBoxBullet(this.world.game, point, direction.mul(this.bulletSpeed), this.bulletLifeTime, calc.makeNormRGBA(), this.weaponName, this.damage, false);  
      }

      if (this.weaponName == 'auto'){
        let el = bulletMaker.makeAnimatedBullet(this.world.game, point, 5, direction.mul(this.bulletSpeed), this.bulletLifeTime, this.weaponName, this.damage, false);  
        el.hitExplosionScale = 15;
      }

      if (this.weaponName == 'gun'){
        bulletMaker.makeAnimatedBullet(this.world.game, point, 15, direction.mul(this.bulletSpeed), this.bulletLifeTime, this.weaponName, this.damage, false);  
      }

      if (this.weaponName == 'railgun'){
        let el = bulletMaker.makeAnimatedBullet(this.world.game, point, 15, direction.mul(this.bulletSpeed), this.bulletLifeTime, this.weaponName, this.damage, false);  
        el.hitExplosionScale = 50;
      }
      
      this.shotTime = this.initialShotTime;
      if (this.soundUrl){
        let vol = 1;
        if (playerPos) {
          vol = 10/(point.subVector(playerPos).abs());
        }
        Utils.playSoundUrl(this.soundUrl, vol); 
      }
      return true;
    }
    return false;
  }

  shotTo(gl, bulletList, pointA, pointB, playerPos){
    return this.shot(gl, bulletList, pointA, pointB.subVector(pointA).normalize(), playerPos);
  }

  render(deltaTime){
    this.shotTime-=deltaTime;
  }
}

module.exports = Weapon;