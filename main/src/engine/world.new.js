const GameObject = require('./game-object.new.js');
const RenderableShaderList = require('./renderable-shader-list.new.js');
const RenderableModelList = require('./renderable-model-list.new.js');
const RenderableItem = require('./renderable-item.new.js');
//const BulletList = require('./bullet-list.new.js');
const GLUtils = require('../gl-utils.js');



const SkyboxShader = require('../skybox.shader.js');
const AniTextureShader = require('../ani-texture.shader.js');

const rocketModel = require('../models/tf.model.js');
const boxModel = require('../models/box.model.js');
const skyboxModel = require('../models/skybox.model.js');
const pointSpriteModel = require('../models/point-sprite.model.js');

const calc = require('../calc.utils.js');
const rand = calc.rand;
const Vector3d = require('../vector3d.dev.js');

const solidUntexturedShaderUnit = require('./shaders/solid-untextured.shader.js');
const {SolidUntexturedShaderList} = require('./solid-untextured.new.js');
const skyboxShaderUnit = require('./shaders/skybox.shader.js');
const {SkyboxShaderList} = require('./skybox.new.js');
const animatedShaderUnit = require('./shaders/ani-textured.shader.js');
const {AnimatedShaderList} = require('./ani-textured.new.js');

class World{
  constructor(gl){
    this.gl = gl;
    this.viewMatrix = m4.identity();

    this.skyboxShaderList = new SkyboxShaderList(gl, skyboxShaderUnit);
    this.skyboxModelList = this.skyboxShaderList.createModelList(skyboxModel, 'assets/skybox.png');
    let skyboxElement = this.skyboxModelList.createStaticItem(m4.identity());
    skyboxElement.onProcess = (deltaTime)=>{
      let mt = m4.identity();
      mt = m4.scale(mt, 300,300,300);
      skyboxElement.matrix = mt;
    }

    this.animatedShaderList = new AnimatedShaderList(gl, animatedShaderUnit);
    this.explosions = this.animatedShaderList.createModelList(pointSpriteModel, 'assets/skybox.png');

    //making list for rendering with shader
    this.solidUntexturedShaderList = new SolidUntexturedShaderList(gl, solidUntexturedShaderUnit);

    //loading models and making lists
    this.boxModelList = this.solidUntexturedShaderList.createModelList(boxModel);
    this.tieModelList = this.solidUntexturedShaderList.createModelList(rocketModel);

    //combine all list in root
    this.graphicList = new GameObject();
    this.graphicList.addChild(this.skyboxShaderList);
    this.graphicList.addChild(this.solidUntexturedShaderList);
    this.graphicList.addChild(this.animatedShaderList);
    
    //making physics
    this.physicsList = new GameObject();

    //all game classes
    this.bulletList = new GameObject();
    this.breakableList = new GameObject();

  }

  render(viewMatrix, deltaTime){
    this.graphicList.process(deltaTime);
    this.bulletList.react(this.breakableList);
    this.graphicList.render(this.gl, {viewMatrix, deltaTime});
  }

  createBullet (pos, speed, color){
    let el = this.boxModelList.createMovingItem(pos, speed, color);
    attachBulletPhysics(el);
    this.bulletList.addChild(el);
  }

  createBreakable (pos, color){
    let niMat = m4.identity();
    niMat = m4.translate(niMat, pos.x, pos.y, pos.z);
    let el = this.boxModelList.createStaticItem(niMat, color);

    el.hitTransformed = el.meshPointer.getTransformedVertexList(el.matrix);
    el.hitPosition = calc.getPosFromMatrix(el.matrix);
    el.hitDist = el.meshPointer.maxDistance;
    //el.pos = pos;
    this.breakableList.addChild(el);
  }

}

function attachBulletPhysics(el){
  el.onReact=(ob)=>{
    if (ob.hitTransformed){
      if (isCrossedSimple(ob.hitPosition, el.position, el.speedVector, ob.hitDist)){
        if (calc.isCrossedMeshByLine(ob.hitTransformed, el.position, el.position.addVector(el.speedVector))){
          ob.deleteSelf();
        };  
      };
    }
  }
  return el;
}

function isCrossedSimple(pos, a, v, d){
  return (pos.subVector(a).abs()<(v.abs()+d));
}

function makeExternalScript(parentNode, scriptURL, onLoad, onError) {
  const elem = new Control(parentNode, 'script');
  elem.node.onload = () => {
    //console.log(elem.node);
    onLoad(elem.node.textContent);
  };
  elem.node.onerror = () => {
    onError();
  };
  elem.node.type = 'model-source';
  elem.node.async = true;
  //parentNode.appendChild(elem.node);
  elem.node.src = scriptURL;
  return elem;
}

module.exports = World;