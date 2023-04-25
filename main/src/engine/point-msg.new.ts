import Control from '../control-js/control.component';
import calc from '../calc.utils';
//const getScreenPos = calc.getScreenPos;
import GameObject from './game-object.new';
import Vector3d from '../vector3d.dev';
import GLCanvas from '../gl-canvas.component';

class Message extends Control{
  parentNode: HTMLElement;
  color: string;
  constructor(parentNode: HTMLElement, text: string, colorHex: string){
    super(parentNode, 'div');
    this.parentNode = parentNode;
    this.color = colorHex || 'fff';
    this.node.style.cssText = `position:absolute; top:${0}px; left:${0}px; color:#${colorHex};`;
    if (text){
      this.node.textContent = text;
    }
  }

  refresh(viewMatrix: Array<number>, vector: Vector3d, text: string){
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
    this.node.style.cssText =`position:absolute; top:${ps.y}px; left:${ps.x}px; color:#${this.color};`;
  }
}

class MessageGamed extends GameObject{
  textPref: string;
  text: string;
  messageNode: Message;
  vector: Vector3d;
  constructor(glCanvas: GLCanvas, text: string, colorHex: string, vector: Vector3d){
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


function getScreenPos(viewMatrix: number[], vector: Vector3d, clipRect: { top: any; left: any; right: any; bottom: any; }){
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

export default MessageGamed;