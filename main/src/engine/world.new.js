const GameObject = require('./game-object.new.js');
const RenderableShaderList = require('./renderable-shader-list.new.js');
const GLUtils = require('../gl-utils.js');
const Shaders = require('../shaders.const.js');
const rocketModel = require('../tf.model.js');
const calc = require('../calc.utils.js');
const rand = calc.rand;

class World{
  constructor(gl){
    this.gl = gl;
    this.obList = new RenderableShaderList(gl, Shaders);

    let neTest = this.obList.createChild(rocketModel);
    //let neTest = new renList(gl, glCanvas.shaderVariables, rocketModel);
    for (let i=0; i<300; i++){
      let niMat = m4.identity();
      niMat = m4.translate(niMat, rand(100)-50, rand(100)-50, rand(100)-50);
      let ob = neTest.createChild(niMat, calc.makeRGBA('00ff55'));
    }
  }

  render(viewMatrix){
    this.obList.viewMatrix = viewMatrix;
    this.obList.render(this.gl);
  }
}

module.exports = World;