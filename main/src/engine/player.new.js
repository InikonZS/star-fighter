const World = require('./world.new.js');
const Vector3d = require('../vector3d.dev.js');
const Camera = require('./camera.new.js');
const calc = require('../calc.utils.js');
const rand = calc.rand;

class Player{
  constructor(gl, game, keyStates){
    this.game = game;
    this.camera = new Camera(game.world, keyStates);
    this.camera.init();
  }

  render(viewMatrix, deltaTime){
    this.camera.process(deltaTime);  
  }
}

module.exports = Player;