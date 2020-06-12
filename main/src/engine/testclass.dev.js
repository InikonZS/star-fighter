class tst{
  constructor(world){
    let niMat = m4.identity();
    niMat = m4.translate(niMat, pos.x, pos.y, pos.z);
    niMat = m4.scale(niMat, scale, scale, scale);
    this.model = world.boxModelList.createStaticItem(niMat, color);
  }
}

module.exports = tst;