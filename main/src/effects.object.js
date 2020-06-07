const Basic = require('./basic.object.js');
const Textured = require('./textured-new.object.js');
const Animation = require('./animation.object.js');
const Sprite = require('./sprite.object.js');
const SpriteList = require('./sprite-list.object.js');
const Mesh = require('./mesh.object.js');
const GLUtils = require('./gl-utils.js');

const boxModel = require('./point-sprite.model.js');
const Vector3d = require('./vector3d.dev.js');

const calc = require('./calc.utils.js');

class Effects{
  constructor(glCanvas){
    this.glCanvas = glCanvas;
    this.gl = glCanvas.glContext;
    let gl = this.gl;

    this.mesh = new Mesh(gl);
    this.mesh.loadFromSource(boxModel);
    let textureURL = 'https://raw.githubusercontent.com/InikonZS/textures/master/kisspng-sprite-explosion-animated-film-2d-computer-graphic-5b320d937c5263.6802436815300069315092.png';
    let bulTextureURL = 'https://raw.githubusercontent.com/InikonZS/textures/master/lazer.png';
    GLUtils.createTexture(this.gl, textureURL, (tex)=>{this.texture = tex});
    this.color = {r:200, g:20, b:60};

    this.spritelist = new SpriteList(gl, boxModel, textureURL);
    this.bulletlist = new SpriteList(gl, boxModel, bulTextureURL);
  }

  addEffect(p){
    let mtx = m4.identity();
    mtx = m4.scale(mtx, 50,50,50);
    mtx[12]=p.x;
    mtx[13]=p.y;
    mtx[14]=p.z;
    
    let animation = new Animation(this.gl, 5, 4, 0.08);
    animation.onFinished = (self) => {
      this.spritelist.deleteItem(self);
    }
    let sprite = new Sprite(this.gl, this.spritelist.mesh, this.spritelist.texture, animation, mtx);
    this.spritelist.addItem(sprite);
  }

  addBullet(p){
    let mtx = m4.identity();
    mtx = m4.scale(mtx, 10,10,10);
    mtx[12]=p.x;
    mtx[13]=p.y;
    mtx[14]=p.z;
    
    let animation = new Animation(this.gl, 3, 1, 0.08);
    animation.onFinished = (self) => {
      //this.spritelist.deleteItem(self);
    }
    let sprite = new Sprite(this.gl, this.bulletlist.mesh, this.bulletlist.texture, animation, mtx);
    this.bulletlist.addItem(sprite);
  }

  render(shaderVariables, deltaTime){
    this.spritelist.render(shaderVariables, deltaTime);
    this.bulletlist.render(shaderVariables, deltaTime);
  }
}

module.exports = Effects;