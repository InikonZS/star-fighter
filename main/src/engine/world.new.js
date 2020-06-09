const GameObject = require('./game-object.new.js');
const RenderableShaderList = require('./renderable-shader-list.new.js');
const BulletList = require('./bullet-list.new.js');
const GLUtils = require('../gl-utils.js');
const Shaders = require('../shaders.const.js');
const rocketModel = require('../tf.model.js');
const boxModel = require('../box.model.js');
const calc = require('../calc.utils.js');
const rand = calc.rand;

class World{
  constructor(gl){
    this.gl = gl;

    this.physList = new GameObject();
    this.bule = new GameObject();
    this.cras = new GameObject();
    
    this.physList.addChild(this.bule);
    this.physList.addChild(this.cras);

    this.obList = new RenderableShaderList(gl, Shaders);

    let neTest = this.obList.createChild(boxModel);
    //let neTest = new renList(gl, glCanvas.shaderVariables, rocketModel);
    for (let i=0; i<1000; i++){
      let niMat = m4.identity();
      niMat = m4.scale(niMat, 5,5,5);
      niMat = m4.translate(niMat, rand(100)-50, rand(100)-50, rand(100)-50);
      let ob = neTest.createChild(niMat, calc.makeNormRGBA('00ff55'));
      this.cras.addChild(ob);
    }
    this.hitList = neTest;

    this.bulList = new BulletList(this.gl, this.obList.shaderVariables, boxModel);
    this.obList.addChild(this.bulList);
  }

  render(viewMatrix, deltaTime){
    //this.obList.process(deltaTime);
    //this.bulList.react(this.hitList);
    //this.obList.react(this.obList);
    this.obList.viewMatrix = viewMatrix;
    this.obList.render(this.gl);

    this.physList.process(deltaTime);
    this.bule.react(this.cras);

  }
}

module.exports = World;