const GLCanvas = require('./gl-canvas.component.js');

class App{
  constructor(parentNode){
    this.glCanvas = new GLCanvas (parentNode, 640, 480);
  }
}

module.exports = {App};