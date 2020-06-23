const GLCanvas = require('./gl-canvas.component.js');
const Loader = require('./res-loader.js');

class App{
  constructor(parentNode){
    Loader((res)=>{
      console.log('loaded', res);
      window.gameResource = res;
      this.glCanvas = new GLCanvas (parentNode, 640, 480);
      this.glCanvas.setController(this);
      window.addEventListener('resize',()=>{
        
      });
    });
  }
}

module.exports = {App};