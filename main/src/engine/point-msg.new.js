const Control = require('../control-js/control.component.js');
const calc = require('../calc.utils.js');
//const getScreenPos = calc.getScreenPos;
const GameObject = require('./game-object.new.js');

class Message extends Control{
  constructor(parentNode, text, colorHex){
    super(parentNode, 'div');
    this.parentNode = parentNode;
    this.color = colorHex || 'fff';
    this.node.style = `position:absolute; top:${0}px; left:${0}px; color:#${colorHex};`;
    if (text){
      this.node.textContent = text;
    }
  }

  refresh(viewMatrix, vector, text){
    let rect = this.parentNode.getBoundingClientRect();
    let relt = {top:0, left:0, right:rect.width, bottom:rect.height}
    let ps = getScreenPos(viewMatrix, vector, relt);
    if (text){
      this.node.textContent = text;
    }
    if (ps.y+this.node.clientHeight>relt.bottom){
      ps.y = ps.y-this.node.clientHeight;
    }
    if (ps.x+this.node.clientWidth>relt.right){
      ps.x = ps.x-this.node.clientWidth;
    }
    this.node.style=`position:absolute; top:${ps.y}px; left:${ps.x}px; color:#${this.color};`;
  }
}

class MessageGamed extends GameObject{
  constructor(glCanvas, text, colorHex, vector){
    super();
    let parentNode = glCanvas.gamePanel.view.node;
    this.messageNode = new Message(parentNode, text, colorHex);
    this.vector = vector;
    this.text = text;
    this.onRender = (gl, props) =>{
      this.messageNode.refresh(props.viewMatrix, this.vector, this.text);
    }
    this.onDelete = () =>{
      parentNode.removeChild(this.messageNode.node);
    }
  }
}


function getScreenPos(viewMatrix, vector, clipRect){
  var point = [vector.x, vector.y, vector.z, 1];  
  // это верхний правый угол фронтальной части
  // вычисляем координаты пространства отсечения,
  // используя матрицу, которую мы вычисляли для F
  var clipspace = m4.transformVector(viewMatrix, point);
  // делим X и Y на W аналогично видеокарте
  clipspace[0] /= clipspace[3];
  clipspace[1] /= clipspace[3];
  // конвертация из пространства отсечения в пиксели
  //var pixelX = (clipspace[0] *  0.5 + 0.5) * clipRect.right;
  //var pixelY = (clipspace[1] * -0.5 + 0.5) * clipRect.bottom;
  var pixelX = (clipspace[0] *  0.5 + 0.5) * window.app.glCanvas.node.width;
  var pixelY = (clipspace[1] * -0.5 + 0.5) * window.app.glCanvas.node.height;

  if (clipspace[3]<0){
    pixelX*=-10000;
    pixelY*=-10000;
  }
  pixelY = pixelY > clipRect.bottom ? clipRect.bottom : pixelY;
  pixelX = pixelX > clipRect.right ? clipRect.right : pixelX;
  pixelY = pixelY < clipRect.top ? clipRect.top : pixelY;
  pixelX = pixelX < clipRect.left ? clipRect.left : pixelX;
  return {x:pixelX, y:pixelY, back:(clipspace[3]<0)}
}

module.exports = MessageGamed;