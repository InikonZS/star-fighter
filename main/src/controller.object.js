let Bullet = require('./bullet.object.js')

function mouseMoveHandler(glCanvas, dx, dy){
  //glCanvas.camera.rotateCam(dx, dy);
  glCanvas.game.player.camera.rotateCam(dx, dy);
}

function mouseUpHandler(glCanvas, event){
  glCanvas.keyboardState.shot = false;
}

function mouseDownHandler(glCanvas, event){
  glCanvas.keyboardState.shot = true;
}

function keyDownHandler(glCanvas, e){
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

function keyUpHandler(glCanvas, e){
  if (e.code == 'Backquote'){
    if (!glCanvas.menu.isActive){
      glCanvas.menu.activate();
      document.exitPointerLock();
    }
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

  if (e.code == 'Digit1'){
    glCanvas.game.player.weapon = 1;
  } 

  if (e.code == 'Digit2'){
    glCanvas.game.player.weapon = 2;
  } 

  if (e.code == 'Digit3'){
    glCanvas.game.player.weapon = 3;
  } 

  if (e.code == 'Digit4'){
    glCanvas.game.player.weapon = 4;
  } 
}

module.exports = {
  mouseMoveHandler,
  mouseDownHandler,
  mouseUpHandler,
  keyUpHandler,
  keyDownHandler
}