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
    this.skyboxModelList = this.skyboxShaderList.createModelList(skyboxModel, 'assets/textures/skybox.png');
    let skyboxElement = this.skyboxModelList.createStaticItem(m4.identity());
    skyboxElement.onProcess = (deltaTime)=>{
      let mt = m4.identity();
      mt = m4.scale(mt, 300,300,300);
      skyboxElement.matrix = mt;
    }

    this.animatedShaderList = new AnimatedShaderList(gl, animatedShaderUnit);
    this.explosions = this.animatedShaderList.createModelList(pointSpriteModel, 'assets/textures/explosion.png');

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

  createExplosion (pos, scale){
    let mt = m4.identity();
    mt = m4.translate(mt, pos.x, pos.y, pos.z);
    mt = m4.scale(mt, scale, scale, scale);
    let el = this.explosions.createStaticItem(mt, 5, 4, 0.05);
    el.animation.onFinished = ()=>{
      el.deleteSelf();
    }
  }

  createBullet (pos, speed, lifetime,  color){
    let el = this.boxModelList.createStaticItem(m4.identity(), color);
    el.type = 'bullet';

    el.position = pos.mul(1);
    el.speedVector = speed.mul(1);
    el.lifetime = lifetime;

    el.onProcess = (deltaTime) => {
      el.lifetime-=deltaTime;
      if (isTimeout(el.lifetime)){
        el.deleteSelf();
      } else {
        let mt = m4.identity();
        el.position = el.position.addVector(el.speedVector.mul(1)); //add deltaTime
        mt = m4.translate(mt,  el.position.x, el.position.y, el.position.z);
        el.matrix = mt;
      }
    }

    el.onReact=(ob)=>{
      if (ob.type == 'breakable'){
        if (isCrossedSimple(ob.hitPosition, el.position, el.speedVector, ob.hitDist)){
          if (calc.isCrossedMeshByLine(ob.hitTransformed, el.position, el.position.addVector(el.speedVector))){
            ob.deleteSelf();
            el.deleteSelf();
            this.createExplosion(ob.hitPosition, 15);
          };  
        };
      }

      if (ob.type == 'solid'){
        if (isCrossedSimple(ob.hitPosition, el.position, el.speedVector, ob.hitDist)){
          let reflected = calc.mirrorVectorFromMesh(ob.hitTransformed, el.position, el.speedVector);
          if (reflected){
            el.speedVector = reflected.normalize().mul(el.speedVector.abs());  
          };  
        };
      }

      if (ob.type == 'danger'){
        if (isCrossedSimple(ob.hitPosition, el.position, el.speedVector, ob.hitDist)){
          let hp = calc.hitMeshPoint(ob.hitTransformed, el.position, el.speedVector);
          if (hp){
            el.deleteSelf();
            this.createExplosion(hp, 5);
          };  
        };
      }
    }
    this.bulletList.addChild(el);
  }

  createBreakable (pos, color){
    let niMat = m4.identity();
    niMat = m4.translate(niMat, pos.x, pos.y, pos.z);
    let el = this.boxModelList.createStaticItem(niMat, color);
    el.type = 'breakable';

    el.hitTransformed = el.meshPointer.getTransformedVertexList(el.matrix);
    el.hitPosition = calc.getPosFromMatrix(el.matrix);
    el.hitDist = el.meshPointer.maxDistance;
    //el.pos = pos;
    this.breakableList.addChild(el);
  }

  createSolid (pos, scale, color){
    let niMat = m4.identity();
    niMat = m4.translate(niMat, pos.x, pos.y, pos.z);
    niMat = m4.scale(niMat, scale, scale, scale);
    let el = this.boxModelList.createStaticItem(niMat, color);
    el.type='solid';

    el.hitTransformed = el.meshPointer.getTransformedVertexList(el.matrix);
    el.hitPosition = calc.getPosFromMatrix(el.matrix);
    el.hitDist = el.meshPointer.maxDistance*scale;
    //el.pos = pos;
    this.breakableList.addChild(el);
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
  }

}

/*function attachBulletPhysics(el){
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
*/
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

function isTimeout(time){
  return (time<0 || time>10000); 
}

module.exports = World;