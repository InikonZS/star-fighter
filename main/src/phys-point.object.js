const calc = require('./calc.utils.js');
const Vector3d = require('./vector3d.dev.js');
const Basic = require('./basic.object.js');
const boxModel = require('./box.model.js');

class PhysPoint{
  constructor(matrix){
    this.matrix = matrix;
    this.isExist = true;
  }

  getMatrix(){
    return this.matrix;
  }
}

module.exports = PhysPoint;