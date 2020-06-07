const Vector3d = require('./vector3d.dev.js');
let Bullet = require('./bullet.object.js');
let Utils = require('./any.utils.js');

class Weapon{
  constructor(shotTime, bulletLifeTime, bulletSpeed, soundUrl){
    this.initialShotTime = shotTime;
    this.shotTime = shotTime;
    this.bulletLifeTime = bulletLifeTime;
    this.bulletSpeed = bulletSpeed;
    this.soundUrl = soundUrl;
    if (soundUrl){
      Utils.preloadSoundUrl(soundUrl);
    }
  }
  shot(gl, bulletList, point, direction, playerPos){
    if (this.shotTime<=0 || this.shotTime>=1000){
      let bul = new Bullet(gl, point, direction.mul(this.bulletSpeed));
      bul.time = this.bulletLifeTime;
      bulletList.push(bul);
      this.shotTime = this.initialShotTime;
      if (this.soundUrl){
        let vol = 1;
        if (playerPos) {
          vol = 10/(point.subVector(playerPos).abs());
        }
        Utils.playSoundUrl(this.soundUrl, vol);
      }
    }
  }

  shotTo(gl, bulletList, pointA, pointB, playerPos){
    this.shot(gl, bulletList, pointA, pointB.subVector(pointA).normalize(), playerPos);
  }

  render(deltaTime){
    this.shotTime-=deltaTime;
  }
}

module.exports = Weapon;