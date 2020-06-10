const GameObject = require('./game-object.new.js');
const RenderableShaderList = require('./renderable-shader-list.new.js');
const RenderableModelList = require('./renderable-model-list.new.js');
const RenderableItem = require('./renderable-item.new.js');
const BulletList = require('./bullet-list.new.js');
const GLUtils = require('../gl-utils.js');

const solidUntexturedShaderUnit = require('./solid-untextured.shader.js');

const SkyboxShader = require('../skybox.shader.js');
const AniTextureShader = require('../ani-texture.shader.js');

const rocketModel = require('../tf.model.js');
const boxModel = require('../box.model.js');
const calc = require('../calc.utils.js');
const rand = calc.rand;
const Vector3d = require('../vector3d.dev.js');

/*class SolidUntexturedStaticItem extends RenderableItem{
  constructor(gl, shaderVariables, modelSource){
    super(gl, shaderVariables, modelSource, 
      (gl, props, mesh, vars)=>{
        GLUtils.setBuffer(gl, mesh.positionBuffer, vars.positionAttr,3);
        GLUtils.setBuffer(gl, mesh.normBuffer, vars.normalAttr,3); 
      }
    );
  }
}*/

class SolidUntexturedModelList extends RenderableModelList{
  constructor(gl, shaderVariables, modelSource){
    super(gl, shaderVariables, modelSource); 
    this.onRender = (gl, props)=>{
      GLUtils.setBuffer(gl, this.mesh.positionBuffer, this.shaderVariables.positionAttr, 3);
      GLUtils.setBuffer(gl, this.mesh.normBuffer, this.shaderVariables.normalAttr, 3); 
    }
  }

  createStaticItem(matrix, color){
    return this.addChild(new RenderableItem(this.shaderVariables, this.mesh, matrix, color));  
  }

  createRotatingItem(position, sx, sy, sz, color){
    let el = this.addChild(new RenderableItem(this.shaderVariables, this.mesh, m4.identity(), color)); 
    el.position = position;
    el.sx = 0;
    el.sy = 0;
    el.sz = 0;
    el.onProcess = (deltaTime)=>{
      let mt = m4.identity();
      mt = m4.translate(mt, el.position.x, el.position.y, el.position.z);
      el.sx +=sx*deltaTime;
      el.sy +=sy*deltaTime;
      el.sz +=sz*deltaTime;
      mt = m4.xRotate(mt, el.sx);
      mt = m4.yRotate(mt, el.sy);
      mt = m4.zRotate(mt, el.sz);
      el.matrix = mt;
    }
    return el;
  }
  
  createMovingItem(posVector, speedVector, color){
    let el = this.addChild(new RenderableItem(this.shaderVariables, this.mesh, m4.identity(), color));
    el.position = posVector.mul(1);
    el.speedVector = speedVector.mul(1);
    el.onProcess = (deltaTime) => {
      let mt = m4.identity();
      el.position = el.position.addVector(el.speedVector.mul(1)); //add deltaTime
      mt = m4.translate(mt,  el.position.x, el.position.y, el.position.z);
      el.matrix = mt;
    }
    return el;
  }
}

class SolidUntexturedShaderList extends RenderableShaderList{
  constructor(gl, shaderUnit){
    super(gl, shaderUnit);
    this.onRender = (gl, props)=>{
      shaderUnit.initShader(gl, this.shaderProgram, this.shaderVariables);
      gl.uniformMatrix4fv(this.shaderVariables.viewUniMat4, false, props.viewMatrix);
    }
  }

  createModelList(modelSource){
    return this.addChild(new SolidUntexturedModelList(this.gl, this.shaderVariables, modelSource));
  }
}



class World{
  constructor(gl){
    this.gl = gl;
    this.viewMatrix = m4.identity();

    

    this.graphicList = new GameObject();
    this.solidUntexturedShaderList = new SolidUntexturedShaderList(gl, solidUntexturedShaderUnit);
    let bList = this.solidUntexturedShaderList.createModelList(boxModel);
    let oList = this.solidUntexturedShaderList.createModelList(rocketModel);
    this.bulList = bList;
    
    this.physicsList = new GameObject();
    this.bulListP = new GameObject();
    this.tarList = new GameObject();

    this.createBullet = (pos, speed, color)=>{
      let el = this.bulList.createMovingItem(pos, speed, color);
      attachBulletPhysics(el);
      this.bulListP.addChild(el);
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

    for (let i=0; i<100; i++){
      let niMat = m4.identity();
      niMat = m4.translate(niMat, rand(100)-50, rand(100)-50, rand(100)-50);
       niMat = m4.scale(niMat, 5,5,5);
      let ob = bList.createStaticItem(niMat, {r:Math.random(),g:Math.random(),b:0.5});
      this.tarList.addChild(ob);
    }
    for (let i=0; i<100; i++){
      let ob = bList.createRotatingItem({x: rand(100)-50, y:  rand(100)-50, z: rand(100)-50}, 10,20,30, {r:Math.random(),g:Math.random(),b:0.5});
    }
    for (let i=0; i<100; i++){
      let ob = oList.createRotatingItem({x: rand(100)-50, y:  rand(100)-50, z: rand(100)-50}, 0.1,0.4,0.1, {r:Math.random(),g:Math.random(),b:0.5});
    }
    /*new RenderableShaderList(this.gl, solidUntexturedShaderUnit, 
      (gl, props, shader, vars)=>{
        this.shaderUnit.initShader(gl, shader, vars.positionAttr, vars.normalAttr);
        gl.uniformMatrix4fv(vars.viewUniMat4, false, props.viewMatrix);
      }
    );*/

    //this.boxModelList = new RenderableModelList(this.gl,)
    
    /*GLUtils.setBuffer(gl, this.mesh.positionBuffer, shaderVariables.positionAttr,3);
      GLUtils.setBuffer(gl, this.mesh.normBuffer, shaderVariables.normalAttr,3); 
      */

    //this.skyboxShader = new RenderableShaderList(this.gl, SkyboxShader);
    //this.transparentAnimatedShader = new RenderableShaderList(this.gl, AniTextureShader);
    /*
    this.physList = new GameObject();
    this.bule = new GameObject();
    this.cras = new GameObject();
    this.cras1 = new GameObject();
    
    this.physList.addChild(this.bule);
    this.physList.addChild(this.cras);

    this.obList = new RenderableShaderList(gl, Shaders);

    let neTest = this.obList.createChild(boxModel);
    //let neTest = new renList(gl, glCanvas.shaderVariables, rocketModel);
    for (let i=0; i<1000; i++){
      let niMat = m4.identity();
     
      niMat = m4.translate(niMat, rand(100)-50, rand(100)-50, rand(100)-50);
       niMat = m4.scale(niMat, 5,5,5);
      let ob = neTest.createChild(niMat, calc.makeNormRGBA('00ff55'));
      this.cras.addChild(ob);
    }

    for (let i=0; i<1000; i++){
      let niMat = m4.identity();
     
      niMat = m4.translate(niMat, rand(100)-50, rand(100)-50 + 200, rand(100)-50);
       niMat = m4.scale(niMat, 5,5,5);
      let ob = neTest.createChild(niMat, calc.makeNormRGBA('ff0055'));
      this.cras1.addChild(ob);
    }
    this.hitList = neTest;

    this.bulList = new BulletList(this.gl, this.obList.shaderVariables, boxModel);
    this.obList.addChild(this.bulList);*/
  }

  render(viewMatrix, deltaTime){
   // this.graphicList.render(this.gl, {viewMatrix, deltaTime});
    this.solidUntexturedShaderList.process(deltaTime);
    this.bulListP.react(this.tarList);
    this.solidUntexturedShaderList.render(this.gl, {viewMatrix, deltaTime});
    //this.obList.process(deltaTime);
    //this.bulList.react(this.hitList);
    //this.obList.react(this.obList);
 /*   this.obList.viewMatrix = viewMatrix;
    this.obList.render(this.gl);

    this.physList.process(deltaTime);
    this.bule.react(this.cras);
    this.bule.react(this.cras1);
  }*/
  }
}

module.exports = World;