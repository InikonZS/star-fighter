//const Vector3d = require('./vector3d.dev.js');
import Utils from '../any.utils';
import calc from '../calc.utils';
import Vector3d from '../vector3d.dev';
import bulletMaker from './bullet.gmob';
import World from './world.new';

class Weapon{
  weaponName: string;
  bulletCount: number;
  damage: number;
  initialShotTime: number;
  shotTime: number;
  bulletLifeTime: number;
  bulletSpeed: number;
  world: World;
  sndClass: string;
  
  constructor(world: World, shotTime: number, bulletLifeTime: number, bulletSpeed: number, soundClass: string, name='gun', bulletCount=100, damage: number){
    this.weaponName = name;
    this.bulletCount = bulletCount;

    this.damage = damage;
    this.initialShotTime = shotTime;
    this.shotTime = shotTime;
    this.bulletLifeTime = bulletLifeTime;
    this.bulletSpeed = bulletSpeed;
    //this.soundUrl = soundUrl;
    this.world = world;
    //if (soundUrl){
    //  Utils.preloadSoundUrl(soundUrl);
    //}
    this.sndClass = soundClass;
  }

  shot(point: Vector3d, direction: Vector3d, playerPos: Vector3d){

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
      if (this.sndClass){
        let vol = 1;
        if (playerPos) {
          vol = 10/(point.subVector(playerPos).abs());
        }
        window.sndBase.playByClass(this.sndClass, vol);
        //Utils.playSoundUrl(this.soundUrl, vol); 
      }
      return true;
    }
    return false;
  }

  shotTo(gl: Vector3d, bulletList: Vector3d, pointA: Vector3d, pointB: Vector3d, playerPos: Vector3d){
    return this.shot(gl, bulletList, pointA, pointB.subVector(pointA).normalize(), playerPos);
  }

  render(deltaTime: number){
    this.shotTime-=deltaTime;
  }
}

export default Weapon;