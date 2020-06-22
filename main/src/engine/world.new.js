const GameObject = require('./game-object.new.js');
const RenderableShaderList = require('./renderable-shader-list.new.js');
const RenderableModelList = require('./renderable-model-list.new.js');
const RenderableItem = require('./renderable-item.new.js');
const GLUtils = require('../gl-utils.js');
//window.gameResource.list[0].source;
//const meteModel = require('../models/mete.model.js');
const rocketModel = require('../models/tf.model.js');
const rocketModel1 = require('../models/rocket.model.js');
//const selfModel = require('../models/self1.model.js');
const selfModel1 = require('../models/self.model.js');
const bigModel = require('../models/big.model.js');
const boxModel = require('../models/box.model.js');
const skyboxModel = require('../models/skybox.model.js');
const pointSpriteModel = require('../models/point-sprite.model.js');

const Physic = require('./physic.new.js');
const Mesh = require('../mesh.object.js');

const anyutils = require('../any.utils.js');

const basics = require('./basic-objects.gmob.js');

const getChunked = require('../chunked-mesh.func.js');
const calc = require('../calc.utils.js');
const Vector3d = require('../vector3d.dev.js');

const Bullet = require('./bullet.gmob.js');

const solidUntexturedShaderUnit = require('./shaders/solid-untextured.shader.js');
const {SolidUntexturedShaderList} = require('./solid-untextured.new.js');
const solidTexturedShaderUnit = require('./shaders/solid-textured.shader.js');
const {SolidTexturedShaderList} = require('./solid-textured.new.js');
const skyboxShaderUnit = require('./shaders/skybox.shader.js');
const {SkyboxShaderList} = require('./skybox.new.js');
const animatedShaderUnit = require('./shaders/ani-textured.shader.js');
const {AnimatedShaderList} = require('./ani-textured.new.js');

const utils = require('../any.utils.js');

class World{
  constructor(gl, game){
    //dynamic loaded res
    const meteModel = window.gameResource.list[0];
    const selfModel = window.gameResource.list[calc.rand(1)+1];
    const ships = [
      window.gameResource.list[5],
      window.gameResource.list[6],
      window.gameResource.list[7],
      window.gameResource.list[8]
    ];

    const marsModel = window.gameResource.list[10];
    const mercuryModel = window.gameResource.list[11];
    //

    console.log('making world');
    this.gl = gl;
    this.game = game;
    this.viewMatrix = m4.identity();

    this.skyboxShaderList = new SkyboxShaderList(gl, skyboxShaderUnit);
    this.skyboxModelList = this.skyboxShaderList.createModelList(skyboxModel, 'assets/textures/skybox.png');
    let skyboxElement = this.skyboxModelList.createStaticItem(m4.identity());
    skyboxElement.onProcess = (deltaTime)=>{
      let mt = m4.identity();
      let pos = game.player.camera.getPosVector();
      mt = m4.translate(mt, pos.x, pos.y, pos.z);
      mt = m4.scale(mt, 300,300,300);

      skyboxElement.matrix = mt;
    }

    this.animatedShaderList = new AnimatedShaderList(gl, animatedShaderUnit);
    this.explosions = this.animatedShaderList.createModelList(pointSpriteModel, 'assets/textures/explosion.png');
    this.magics = this.animatedShaderList.createModelList(pointSpriteModel, 'assets/textures/magic.png');
    this.magicSpheres = this.animatedShaderList.createModelList(marsModel.source, 'assets/textures/magic.png');
    this.magicFogSpheres = this.animatedShaderList.createModelList(marsModel.source, 'assets/textures/fogmagic.png');

    this.bulPlasm = this.animatedShaderList.createModelList(pointSpriteModel, 'assets/textures/bul1.png');

    //making list for rendering with shader
    this.solidUntexturedShaderList = new SolidUntexturedShaderList(gl, solidUntexturedShaderUnit);
    this.solidTexturedShaderList = new SolidTexturedShaderList(gl, solidTexturedShaderUnit);

    //loading models and making lists
    this.meteModelList = this.solidTexturedShaderList.createModelList(meteModel.source, meteModel.tex, 1);
    this.mercuryModelList = this.solidTexturedShaderList.createModelList(mercuryModel.source, mercuryModel.tex, 1);
    this.marsModelList = this.solidTexturedShaderList.createModelList(marsModel.source, marsModel.tex, 1);

    this.boxModelList = this.solidUntexturedShaderList.createModelList(boxModel);
    this.tieModelList = this.solidUntexturedShaderList.createModelList(rocketModel);
    this.rocketList = this.solidUntexturedShaderList.createModelList(rocketModel1);
    if (selfModel.tex){
      this.selfModelList = this.solidTexturedShaderList.createModelList(selfModel.source, selfModel.tex);
    } else {
      this.selfModelList = this.solidUntexturedShaderList.createModelList(selfModel.source);  
    }
    
    this.bigModelList = this.solidTexturedShaderList.createModelList(bigModel, 'assets/textures/Trident_UV_Dekol_Color.png');

    this.shipLists = [];
    for (let i = 0; i<ships.length; i++){
      let ship = this.solidTexturedShaderList.createModelList(ships[i].source, ships[i].tex);
      this.shipLists.push(ship);
    }
    //Trident_UV_Dekol_Color.tif

    let chunkMesh = getChunked(gl, boxModel, 130, (i)=>{
      mtx = m4.identity();
      mtx = m4.translate(mtx, calc.rand(400)-200, calc.rand(400)-200, calc.rand(400)-20);
      mtx = m4.scale(mtx, 0.4, 0.4, 0.4);
      return mtx;
    });
    this.chunkList = this.solidUntexturedShaderList.createModelList(boxModel);
    this.chunkList.mesh = chunkMesh;

    //combine all list in root
    this.graphicList = new GameObject();
    this.graphicList.addChild(this.skyboxShaderList);
    this.graphicList.addChild(this.solidUntexturedShaderList);
    this.graphicList.addChild(this.solidTexturedShaderList);
    this.graphicList.addChild(this.animatedShaderList);
    
    //making physics
    this.physicsList = new GameObject();

    //all game classes
    this.bulletList = new GameObject();
    this.breakableList = new GameObject();
    this.objectList = new GameObject();

  }

  clear(){
    this.graphicList.clear();
    //this.objectList.clear();
  }

  render(viewMatrix, deltaTime){
    this.graphicList.process(deltaTime);

    this.objectList.process(deltaTime);
    this.bulletList.tryFilter();
    this.breakableList.tryFilter();

    this.bulletList.react(this.breakableList);
    this.objectList.react(this.breakableList);
    //this.bulletList.react(this.objectList);
    this.graphicList.render(this.gl, {viewMatrix, deltaTime, game:this.game});
  }

  createExplosion (pos, scale){
    let mt = m4.identity();
    mt = m4.translate(mt, pos.x, pos.y, pos.z);
    mt = m4.scale(mt, scale, scale, scale);
    let el = this.explosions.createStaticItem(mt, 5, 4, 0.05);
    el.animation.onFinished = ()=>{
      el.deleteSelf();
    }
  }

  createMagic (pos, scale, single){
    let mt = m4.identity();
    mt = m4.translate(mt, pos.x, pos.y, pos.z);
    mt = m4.scale(mt, scale, scale, scale);
    let el = this.magics.createStaticItem(mt, 5, 5, 0.05); 
    if (single){
      el.animation.onFinished = ()=>{
        el.deleteSelf();
      }
    }
    return el;
  }

  createMagicSphere (pos, scale, single){
    let mt = m4.identity();
    mt = m4.translate(mt, pos.x, pos.y, pos.z);
    mt = m4.scale(mt, scale, scale, scale);
    let el = this.magicSpheres.createStaticItem(mt, 5, 5, 0.05); 
    if (single){
      el.animation.onFinished = ()=>{
        el.deleteSelf();
      }
    }
    return el;
  }

  createFogMagicSphere (pos, scale, single){
    let mt = m4.identity();
    mt = m4.translate(mt, pos.x, pos.y, pos.z);
    mt = m4.scale(mt, scale, scale, scale);
    let el = this.magicFogSpheres.createStaticItem(mt, 5, 1, 0.10); 
    if (single){
      el.animation.onFinished = ()=>{
        el.deleteSelf();
      }
    }
    return el;
  }

  createGenericAnimated (modelList, pos, scale, xmax, ymax, frametime, single){
    let mt = m4.identity();
    mt = m4.translate(mt, pos.x, pos.y, pos.z);
    mt = m4.scale(mt, scale, scale, scale);
    let el = modelList.createStaticItem(mt, xmax, ymax, frametime); 
    if (single){
      el.animation.onFinished = ()=>{
        el.deleteSelf();
      }
    }
    return el;
  }

  createBreakable (pos, scale, color){
    let niMat = m4.identity();
    niMat = m4.translate(niMat, pos.x, pos.y, pos.z);
    niMat = m4.scale(niMat, scale, scale, scale);
    let el = this.boxModelList.createStaticItem(niMat, color);
    el.type = 'breakable';
    //el.scale=scale;

    el.hitTransformed = el.meshPointer.getTransformedVertexList(el.matrix);
    el.hitPosition = calc.getPosFromMatrix(el.matrix);
    el.hitDist = el.meshPointer.maxDistance*scale;
    //el.pos = pos;
    this.breakableList.addChild(el);
    return el;
  }

  createSolid (pos, scale, color, bm){
    let niMat = m4.identity();
    niMat = m4.translate(niMat, pos.x, pos.y, pos.z);
    niMat = m4.scale(niMat, scale, scale, scale);
    if (!bm){ ///kostil'
      var el = this.boxModelList.createStaticItem(niMat, color);
    } else {
      var el = this.meteModelList.createStaticItem(niMat, color);
    }
    el.type='solid';

    el.hitTransformed = el.meshPointer.getTransformedVertexList(el.matrix);
    el.hitPosition = calc.getPosFromMatrix(el.matrix);
    el.hitDist = el.meshPointer.maxDistance*scale;
    el.physicList = new Physic (el.hitTransformed);
    //el.pos = pos;
    this.breakableList.addChild(el);
    return el;
  }

  createDanger (pos, scale, color){
    let niMat = m4.identity();
    niMat = m4.translate(niMat, pos.x, pos.y, pos.z);
    niMat = m4.scale(niMat, scale, scale, scale);
    let el = this.boxModelList.createStaticItem(niMat, color);
    el.type='danger';

    el.hitTransformed = el.meshPointer.getTransformedVertexList(el.matrix);
    el.hitPosition = calc.getPosFromMatrix(el.matrix);
    el.hitDist = el.meshPointer.maxDistance*scale;
    //el.pos = pos;
    this.breakableList.addChild(el);
    return el;
  }
  
}


module.exports = World;