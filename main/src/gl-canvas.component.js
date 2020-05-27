const Control = require('./control.component.js');

class GLCanvas extends Control{
  constructor(parentNode, width, height){
    super (parentNode, 'canvas', '', '', ()=>{
    });
    this.node.width = width;
    this.node.height = height;
    this.context = this.node.getContext('webgl');
  }
}

module.exports = GLCanvas;