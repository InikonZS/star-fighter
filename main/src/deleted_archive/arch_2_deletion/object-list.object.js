const calc = require('./calc.utils.js');
const Vector3d = require('./vector3d.dev.js');
const Basic = require('./basic.object.js');
const boxModel = require('./box.model.js');
//const PhysPoint = require('./phys-point.object.js');


class ObList{
  constructor(gl, modelSource){
    this.list = [];
    this.matList = [];
    this.model = new Basic(gl, modelSource, m4.identity(), calc.makeRGBA('fff'));
    this.reqFilter = false;
  }

  addItem(physPoint){
    this.list.push(physPoint);
  }

  deleteItem(item){
    item.isExist = false;
    this.reqFilter = true;
  };

  react(a, b, onCrossed){
    if (this.reqFilter){
      this.list = this.list.filter(it=>it.isExist);
    }

    this.matList = this.list.map(it=>{
      it.react(a, b, onCrossed);
      return it.getMatrix();
    })
  }

  render(shaderVariables){
    this.model.renderMany(shaderVariables, this.matList);
  }

}

module.exports = ObList;