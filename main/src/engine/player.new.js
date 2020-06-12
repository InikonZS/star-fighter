const World = require('./world.new.js');
const Vector3d = require('../vector3d.dev.js');
const Camera = require('./camera.new.js');
const calc = require('../calc.utils.js');
const rand = calc.rand;
const Weapon = require('./weapon.new.js');

class Player{
  constructor(gl, game, keyStates){
    this.game = game;
    this.keyStates = keyStates;
    let world = this.game.world
    this.weapon = 1;

    this.weapons=[
      new Weapon(world, 0.15, 1.2, 30.1, 'assets/sounds/laser.mp3'),
      new Weapon(world, 0.08, 0.7, 30.1, 'assets/sounds/auto.mp3'),
      new Weapon(world, 0.35, 5.2, 60.1, 'assets/sounds/laser_med.mp3'),
      new Weapon(world, 0.65, 1.2, 140.1, 'assets/sounds/laser_power.mp3'),
    ];

    this.camera = new Camera(game.world, keyStates);
    this.camera.init();
  }

  render(viewMatrix, deltaTime){
    this.camera.process(deltaTime);  

    this.weapons.forEach(it=>it.render(deltaTime));

    if (this.keyStates.shot){
      this.shot(this.weapon-1);
    }


  }

  shot(weaponIndex){
    
    if (this.weapons[weaponIndex].shot(this.camera.getPosVector().subVector(this.camera.getCamNormal().mul(2.10)), 
    this.camera.getCamNormal().mul(-1).addVector(this.camera.getSpeedVector().mul(1/this.weapons[weaponIndex].bulletSpeed))
    )){
      //this.bullets--;
      //glCanvas.gamePanel.bullets.node.textContent = 'bullets: '+this.bullets;
    }
  }
}

module.exports = Player;