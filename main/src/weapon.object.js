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
    Utils.preloadSoundUrl(soundUrl);
  }
  shot(gl, bulletList, point, direction){
    if (this.shotTime<=0 || this.shotTime>=1000){
      let bul = new Bullet(gl, point, direction.mul(this.bulletSpeed));
      bul.time = this.bulletLifeTime;
      bulletList.push(bul);
      this.shotTime = this.initialShotTime;
      Utils.playSoundUrl(this.soundUrl);
    }
  }
  render(deltaTime){
    this.shotTime-=deltaTime;
  }
}

module.exports = Weapon;