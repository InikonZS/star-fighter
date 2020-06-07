const GLCanvas = require('./gl-canvas.component.js');

class App{
  constructor(parentNode){
   // let rect = document.documentElement.getBoundingClientRect();
    this.glCanvas = new GLCanvas (parentNode, 640, 480);
   // this.glCanvas.start();
   // this.glCanvas.pause();
    this.glCanvas.setController(this);
    window.addEventListener('resize',()=>{
      
    });
  }
}

module.exports = {App};