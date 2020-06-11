const World = require('./world.new.js');
const Vector3d = require('../vector3d.dev.js');
const calc = require('../calc.utils.js');
const rand = calc.rand;

class Game{
  constructor(gl){
    this.gl = gl;
    let world = new World(gl);
    this.world = world;

    for (let i=0; i<100; i++){
      world.createDanger(new Vector3d(rand(100)-50, rand(100)-50, rand(100)-50), 15, {r:Math.random(),g:Math.random(),b:0.5});
    }
  }

  render(viewMatrix, deltaTime){
    this.world.render(viewMatrix, deltaTime);
  }
}

module.exports = Game;