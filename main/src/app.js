const GLCanvas = require('./gl-canvas.component.js');

class App{
  constructor(parentNode){
   // let rect = document.documentElement.getBoundingClientRect();
    this.glCanvas = new GLCanvas (parentNode, 640, 480);
    this.glCanvas.start();
    window.addEventListener('resize',()=>{
      
    });
  }
}

module.exports = {App};