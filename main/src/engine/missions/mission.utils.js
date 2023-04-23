import anyutils from '../../any.utils';
import basics from '../basic-objects.gmob';
import Vector3d from '../../vector3d.dev';
import calc from '../../calc.utils';
const rand =calc.rand;
import Enemy from '../enemy.new';

function starChunk(game, center, size, count){
  for (let i=0; i<count; i++){
    
    let a = new Vector3d(Math.random()-0.5, Math.random()-0.5, Math.random()-0.5);
   // a = a.normalize();
    a = a.mul(size).addVector(center);
    
    let mt = m4.identity();
    mt = m4.translate(mt, a.x, a.y, a.z);
    mt = m4.xRotate(mt, Math.random()*Math.PI*2);
    mt = m4.yRotate(mt, Math.random()*Math.PI);
    game.world.chunkList.createStaticItem(mt, {r:Math.random(),g:Math.random(),b:0.5}, 1000);//del magic num
  }  
}

function randVector(center, size){
  let a = new Vector3d(Math.random()-0.5, Math.random()-0.5, Math.random()-0.5);
  a = a.mul(size).addVector(center);  
  return a;
}

export default {
  starChunk,
  randVector
}