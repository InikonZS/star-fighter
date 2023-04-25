//let Bullet = require('./bullet.object.js')

import GLCanvas from "./gl-canvas.component";

function mouseMoveHandler(glCanvas:GLCanvas, dx: number, dy: number){
  //glCanvas.camera.rotateCam(dx, dy);
  if (!glCanvas.useControls){return;}
  glCanvas.game.player.camera.rotateCam(dx, dy, false);
}

function mouseUpHandler(glCanvas:GLCanvas, event?: MouseEvent){
  if (!glCanvas.useControls){return;}
  glCanvas.keyboardState.shot = false;
}

function mouseDownHandler(glCanvas:GLCanvas, event?: MouseEvent){
  if (!glCanvas.useControls){return;}
  glCanvas.keyboardState.shot = true;
}

function keyDownHandler(glCanvas:GLCanvas, e: KeyboardEvent){
  if (!glCanvas.useControls){return;}
  if (e.code == 'KeyQ'){
    glCanvas.keyboardState.crenleft = true;
    //keyboardHandler(glCanvas, 'forward', true);
  } 

  if (e.code == 'KeyE'){
    glCanvas.keyboardState.crenright = true;
    //keyboardHandler(glCanvas, 'backward', true);
  } 

  if (e.code == 'KeyW'){
    glCanvas.keyboardState.forward = true;
    //keyboardHandler(glCanvas, 'forward', true);
  } 

  if (e.code == 'KeyS'){
    glCanvas.keyboardState.backward = true;
    //keyboardHandler(glCanvas, 'backward', true);
  } 

  if (e.code == 'KeyA'){
    glCanvas.keyboardState.left = true;
    //keyboardHandler(glCanvas, 'left', true);
  } 

  if (e.code == 'KeyD'){
    glCanvas.keyboardState.right = true;
    //keyboardHandler(glCanvas, 'right', true);
  } 

  if (e.code == 'Space'){
    glCanvas.keyboardState.space = true;
    //keyboardHandler(glCanvas, 'space', true);
  } 
}

function keyUpHandler(glCanvas: GLCanvas, e: KeyboardEvent){
  if (!glCanvas.useControls){return;}// TODO set to false all states when controls are disabled

  if (e.code == 'Backquote'){
    if (!glCanvas.menu.isActive){
      glCanvas.menu.activate();
      glCanvas.keyboardState.shot = false;
      document.exitPointerLock();
    }
  } 

  if (e.code == 'KeyQ'){
    glCanvas.keyboardState.crenleft = false;
    //keyboardHandler(glCanvas, 'forward', true);
  } 

  if (e.code == 'KeyE'){
    glCanvas.keyboardState.crenright = false;
    //keyboardHandler(glCanvas, 'backward', true);
  } 

  if (e.code == 'KeyW'){
    glCanvas.keyboardState.forward = false;
    //keyboardHandler(glCanvas, 'forward', false);
  }  

  if (e.code == 'KeyS'){
    glCanvas.keyboardState.backward = false;
    //keyboardHandler(glCanvas, 'backward', false);
  } 

  if (e.code == 'KeyA'){
    glCanvas.keyboardState.left = false;
    //keyboardHandler(glCanvas, 'left', false);
  } 

  if (e.code == 'KeyD'){
    glCanvas.keyboardState.right = false;
    //keyboardHandler(glCanvas, 'right', false);
  } 

  if (e.code == 'Space'){
    glCanvas.keyboardState.space = false;
    //keyboardHandler(glCanvas, 'space', false);
  }  

  //if (!glCanvas.useControls){return;}
  if (e.code == 'Digit1'){
    glCanvas.game.player.setWeapon(1);
  } 

  if (e.code == 'Digit2'){
    glCanvas.game.player.setWeapon(2);
  } 

  if (e.code == 'Digit3'){
    glCanvas.game.player.setWeapon(3);
  } 

  if (e.code == 'Digit4'){
    glCanvas.game.player.setWeapon(4);
  } 
}

export default {
  mouseMoveHandler,
  mouseDownHandler,
  mouseUpHandler,
  keyUpHandler,
  keyDownHandler
}