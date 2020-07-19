const GameObject = require('./game-object.new.js');

const Physic = require('./physic.new.js');

const getChunked = require('../chunked-mesh.func.js');
const calc = require('../calc.utils.js');
const Vector3d = require('../vector3d.dev.js');

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
    const skyboxModel = window.resBase.getByName('skybox');
    const bigModel = window.resBase.getByName('bigShip');
    const meteModel = window.resBase.getByName('mete');
    const mete2Model = window.resBase.getByName('mete2');
    const boxModel = window.resBase.getByName('box').source;
    //const selfModel = window.gameResource.list[calc.rand(1)+game.props.shipIndex+1];

   /* const selfModels = [
      window.gameResource.list[1],
      window.gameResource.list[2],
      window.gameResource.list[3],
      window.gameResource.list[4],
    ];

    const ships = [
      window.gameResource.list[5],
      window.gameResource.list[6],
      window.gameResource.list[7],
      window.gameResource.list[8]
    ];*/

    const selfModels = [
      window.resBase.getByName('cab0'),
      window.resBase.getByName('cab1'),
      window.resBase.getByName('cab2'),
      window.resBase.getByName('cab3'),
      window.resBase.getByName('cab4'),
    ];

    const ships = [
      window.resBase.getByName('tie_interceptor'),
      window.resBase.getByName('tie_bomber'),
      window.resBase.getByName('tie_fighter'),
      window.resBase.getByName('z95_headhunter'),
      window.resBase.getByName('x-wing'),
    ];


    const marsModel = window.resBase.getByName('mars');
    const mercuryModel = window.resBase.getByName('mercury');
    const neptuneModel = window.resBase.getByName('neptune');
    const meteoriteModel = window.resBase.getByName('fire_meteorite');
    const corridorModel = window.resBase.getByName('space_corridor');
    const assaultModel = window.resBase.getByName('assault_ship');
    //

    console.log('making world');
    this.gl = gl;
    this.game = game;
    this.viewMatrix = m4.identity();

    this.skyboxShaderList = new SkyboxShaderList(gl, skyboxShaderUnit);
    this.skyboxModelList = this.skyboxShaderList.createModelList(skyboxModel);
    

    this.animatedShaderList = new AnimatedShaderList(gl, animatedShaderUnit);
    this.explosions = this.animatedShaderList.createModelList(window.resBase.getByName('explosion'));
    this.magics = this.animatedShaderList.createModelList(window.resBase.getByName('magic'));
    //this.magicSpheres = this.animatedShaderList.createModelList(marsModel.source, 'assets/textures/magic.png');
    this.magicFogSpheres = this.animatedShaderList.createModelList(window.resBase.getByName('fogmagic'));

    this.bulPlasm = this.animatedShaderList.createModelList(window.resBase.getByName('bulletSprite'));

    

    //making list for rendering with shader
    this.solidUntexturedShaderList = new SolidUntexturedShaderList(gl, solidUntexturedShaderUnit);
    this.solidTexturedShaderList = new SolidTexturedShaderList(gl, solidTexturedShaderUnit);

    //loading models and making lists
    //this.tun1 = this.solidUntexturedShaderList.createModelList(window.resBase.getByName('tun1').source);
    //this.tun2 = this.solidUntexturedShaderList.createModelList(window.resBase.getByName('tun2').source);
    this.tun1 = [
      this.solidTexturedShaderList.createModelList(window.resBase.getByName('tun1')),
      this.solidTexturedShaderList.createModelList(window.resBase.getByName('tun11')),
    ];
    this.tun2 = [
      this.solidTexturedShaderList.createModelList(window.resBase.getByName('tun2')),
      this.solidTexturedShaderList.createModelList(window.resBase.getByName('tun21')),
      this.solidTexturedShaderList.createModelList(window.resBase.getByName('tun22')),
    ];

    this.meteModelList = this.solidTexturedShaderList.createModelList(meteModel, 1);
    this.mercuryModelList = this.solidTexturedShaderList.createModelList(mercuryModel, 1);
    this.marsModelList = this.solidTexturedShaderList.createModelList(marsModel, 1);

    this.mete2ModelList = this.solidTexturedShaderList.createModelList(mete2Model, 1);
    this.neptuneModelList = this.solidTexturedShaderList.createModelList(neptuneModel, 1);
    this.meteoriteModelList = this.solidTexturedShaderList.createModelList(meteoriteModel, 1);
    this.corridorModelList = this.solidTexturedShaderList.createModelList(corridorModel, 1);
    this.assaultModelList = this.solidTexturedShaderList.createModelList(assaultModel, 1);

    this.boxModelList = this.solidUntexturedShaderList.createModelList(boxModel);
   
   // this.tieModelList = this.solidUntexturedShaderList.createModelList(rocketModel);
   // this.rocketList = this.solidUntexturedShaderList.createModelList(rocketModel1);

    this.selfModelLists=[];
    selfModels.forEach(it=>{
      let model;
      if (it.tex){
        model=this.solidTexturedShaderList.createModelList(it);
      } else {
        model=this.solidUntexturedShaderList.createModelList(it.source);  
      }
      this.selfModelLists.push(model);
    });
    /*if (selfModel.tex){
      this.selfModelList = this.solidTexturedShaderList.createModelList(selfModel);
    } else {
      this.selfModelList = this.solidUntexturedShaderList.createModelList(selfModel.source);  
    }*/
    
    this.bigModelList = this.solidTexturedShaderList.createModelList(bigModel)//, 'assets/textures/Trident_UV_Dekol_Color.png');

    this.shipLists = [];
    for (let i = 0; i<ships.length; i++){
      let ship = this.solidTexturedShaderList.createModelList(ships[i]);
      this.shipLists.push(ship);
    }
    //Trident_UV_Dekol_Color.tif

    let chunkMesh = getChunked(gl, boxModel, 130, (i)=>{
      let sz = 50;
      let sc = 0.3
      mtx = m4.identity();
      mtx = m4.translate(mtx, calc.rand(sz)-sz/2, calc.rand(sz)-sz/2, calc.rand(sz)-sz/2);
      mtx = m4.scale(mtx, sc, sc, sc);
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
    //this.graphicList.tryFilter();
    //this.objectList.clear();
  }

  createSkybox(){
    let skyboxElement = this.skyboxModelList.createStaticItem(m4.identity());
    skyboxElement.onProcess = (deltaTime)=>{
      let mt = m4.identity();
      let pos = this.game.player.camera.getPosVector();
      mt = m4.translate(mt, pos.x, pos.y, pos.z);
      mt = m4.scale(mt, 300,300,300);

      skyboxElement.matrix = mt;
    }
    return skyboxElement;
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

  /// generics
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

  createGenericAnimatedAzi (modelList, pos, scale, azi, theta,  xmax, ymax, frametime, single){
    let mt = m4.identity();
    mt = m4.translate(mt, pos.x, pos.y, pos.z);
    mt = m4.scale(mt, scale, scale, scale);
    mt = m4.zRotate(mt, azi);
    mt = m4.xRotate(mt, theta);
    let el = modelList.createStaticItem(mt, xmax, ymax, frametime); 
    if (single){
      el.animation.onFinished = ()=>{
        el.deleteSelf();
      }
    }
    return el;
  }
  //////

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