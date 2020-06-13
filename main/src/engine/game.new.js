const World = require('./world.new.js');
const Player = require('./player.new.js');
const Vector3d = require('../vector3d.dev.js');
const calc = require('../calc.utils.js');
const rand = calc.rand;

const Enemy = require('./enemy.new.js');

class Game{
  constructor(gl, glCanvas){
    this.gl = gl;
    let world = new World(gl, this);
    this.world = world;
    this.player = new Player(gl, this, glCanvas.keyboardState);

    for (let i=0; i<10; i++){new Enemy(gl, this, new Vector3d(0,0,0), new Vector3d(0,0,0));}

    for (let i=0; i<100; i++){
      world.createSolid(new Vector3d(rand(1000)-500, rand(1000)-500, rand(1000)-500), 10, {r:Math.random(),g:Math.random(),b:0.5});
    }

    for (let i=0; i<100; i++){
      let mt = m4.identity();
      mt = m4.translate(mt, rand(1000)-500, rand(1000)-500, rand(1000)-500);
      world.chunkList.createStaticItem(mt, {r:Math.random(),g:Math.random(),b:0.5});
    }
  }

  render(aspect, deltaTime){
    this.player.render(deltaTime);
    var camera = this.player.camera;
    var viewMatrix = calc.makeCameraMatrix(aspect, camera.camRX, camera.camRY, camera.camRZ, camera.posX, camera.posY, camera.posZ);

    this.world.render(viewMatrix, deltaTime);

  }
}

module.exports = Game;