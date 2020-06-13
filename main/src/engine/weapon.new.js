//const Vector3d = require('./vector3d.dev.js');
const Utils = require('../any.utils.js');
const calc = require('../calc.utils.js');

class Weapon{
  constructor(world, shotTime, bulletLifeTime, bulletSpeed, soundUrl){
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
      this.world.createBullet(point, direction.mul(this.bulletSpeed), this.bulletLifeTime);
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