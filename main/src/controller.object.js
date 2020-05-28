let Bullet = require('./bullet.object.js')

function mouseMoveHandler(glCanvas, dx, dy){
  glCanvas.camera.rotateCam(dx, dy);
}

function mouseUpHandler(glCanvas, event){

}

function mouseDownHandler(glCanvas, event){
  let bul = new Bullet(glCanvas.glContext, glCanvas.camera.getPosVector().subVector(glCanvas.camera.getCamNormal().mul(2.10)), glCanvas.camera.getCamNormal().mul(-3.10));
  glCanvas.scene.bullets.push(bul);
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
}

module.exports = {
  mouseMoveHandler,
  mouseDownHandler,
  mouseUpHandler,
  keyUpHandler,
  keyDownHandler
}