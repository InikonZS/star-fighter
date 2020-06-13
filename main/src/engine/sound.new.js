const anyutils = require('../any.utils.js');
// todo: make sound array with category key and array of file names or URL values;
// make function to select random sound URL from category;
// calc volume or set vol to 1 if point is undefined or false
// use anyutils.preloadSound to preload all sounds in constructor;
// calculate count of sounds, dont play more than MaxCount sounds, maybe count each category and ..

const sounds = {
  'explosion': ['expl1', 'expl2'],
  'hit': ['hit1', 'hit2'],

}

class Sound{
  constructor(game){
    this.game = game;
    //preload here
  }
  playSoundAt(type, point){
    let vol = 130/(point.subVector(this.game.player.camera.getPosVector()).abs());

    //play here
    //rand(10)<5 ? anyutils.playSoundUrl('assets/sounds/expl1.mp3', vol) : anyutils.playSoundUrl('assets/sounds/expl2.mp3', vol);
   // anyutils.playSoundUrl() 
  }
}

module.exports = Sound;