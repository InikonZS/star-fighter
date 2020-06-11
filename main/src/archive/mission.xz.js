
const Basic = require('./basic.object.js');
const Textured = require('./textured.object.js');

const boxModel = require('./box.model.js');
const rocketModel = require('./tf.model.js');
const rocketModel1 = require('./rocket.model.js');
const Vector3d = require('./vector3d.dev.js');
let Bullet = require('./bullet.object.js');
let Weapon = require('./weapon.object.js');
let Enemy = require('./enemy.object.js');
let Chunk = require('./static-chunk.object.js');
let Message = require('./point-message.object.js');
let Collect = require('./collectable.object.js');
let CollectN = require('./collectable-new.object.js');
let ObList = require('./object-list.object.js');

function create(glCanvas){
  let gl = glCanvas.glContext;
}

function render(glCanvas){

}

module.exports = {create, render};