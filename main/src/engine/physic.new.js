const Vector3d = require('../vector3d.dev.js');
const calc = require('../calc.utils.js');

class Physic{
  constructor(vertexList){
    this.triangles = [];
    let v;
    let ind;
    for (let i=0; i<vertexList.length; i+=9){
      v=[];
      for (let j=0; j<3; j+=1){
        ind = i+j*3;
        v[j] = new Vector3d(vertexList[ind+0], vertexList[ind+1], vertexList[ind+2]);
      }
      let tri = new Triangle(v[0], v[1], v[2]);  
      this.triangles.push(tri);
    }
  }

  destroy(){
    this.triangles.forEach(it=>{
      it.destroy();
      it = undefined;
    });
    this.triangles = undefined;
  }

  crossByLine (a, b){
    let res =[];
    let point;
    this.triangles.forEach(it=>{
      point = it.crossByLine(a, b);
      if (point){
        res.push({dv:point, triangle:it});
      }
    });
    return res;
  }

  hitMeshPoint(p, v){
    let b = p.addVector(v);
    return getNearest(p, this.crossByLine(p, b));
  }

  mirrorVector(p, v){
    let b = p.addVector(v);
    let cpl = this.crossByLine(p, b);
    if (cpl.length){///reflection
      let tr = getNearest(p, cpl).triangle;
      let dtt = v.subVector(tr.normal.mul(2*v.dot(tr.normal)));
      return dtt;
    }
    return false;
  }

  isCrossedByTriangle(tr){
    for (let i = 0; i<this.triangles.length; i++){
      if (this.triangles[i].isCrossedByTriangle(tr)){
        return true;
      }
    }  
  }

  crossByTriangle(tr){
    for (let i = 0; i<this.triangles.length; i++){
      if (this.triangles[i].isCrossedByTriangle(tr)){
        return tr;
      }
    }  
  }

  isCrossedByPhys(ms){
    for (let i = 0; i<ms.triangles.length; i++){
      if (this.isCrossedByTriangle(ms.triangles[i])){
        return true;
      }
    }    
  }

  crossByPhys(ms){
    for (let i = 0; i<ms.triangles.length; i++){
      let tr = this.crossByTriangle(ms.triangles[i]);
      if (tr){
        return tr;
      }
    }    
  }
}

function getNearest(p, list){
  let minit;
  let minlen = 9999999;
  let dist;
  list.forEach(it=>{
    dist = p.subVector(it.dv).abq();
    if (dist<minlen){
      dist = minlen;
      minit = it;
    }
  });
  return minit;
}

class Triangle{
  constructor(u, v, w){
    this.u = u;
    this.v = v;
    this.w = w;
    let norm = calc.getNormal (u, v, w)
    this.normal = new Vector3d(norm.x, norm.y, norm.z);
    this.dValue = calc.getValueD(u, norm);
    this.a = u;
    this.b = v;
    this.c = w;
    this.al = u.subVector(v).abs();
    this.bl = v.subVector(w).abs();
    this.cl = w.subVector(u).abs();
    this.pr = (this.al+this.bl+this.cl)/2;
    let pr = this.pr;
    this.prq = (pr*pr/4);
    this.s = Math.sqrt(pr*(pr-this.al)*(pr-this.bl)*(pr-this.cl));
    this.center = u.addVector(v).addVector(w).mul(1/3);
  }
  destroy(){
    this.normal = undefined;
  }

  solveLinear(v1, v2){
    let n = this.normal;
    let d = this.dValue;
    let nv = v1.subVector(v2);
    let h = (n.x*v1.x + n.y*v1.y + n.z*v1.z +d) / (-(n.x*nv.x + n.y*nv.y + n.z*nv.z));
    return {x: v1.x + h*nv.x, y: v1.y + h*nv.y, z: v1.z + h*nv.z}
  }

  inTriangle(p){
    if (p.subVector(this.center).abq()>this.prq) {return false;}

    let ap = this.a.subVector(p).abs();
    let bp = this.b.subVector(p).abs();
    let cp = this.c.subVector(p).abs();
    let pa = (ap+bp+this.al)/2;
    let pb = (bp+cp+this.bl)/2;
    let pc = (cp+ap+this.cl)/2;
    let sa = Math.sqrt(pa*(pa-ap)*(pa-bp)*(pa-this.al));
    let sb = Math.sqrt(pb*(pb-bp)*(pb-cp)*(pb-this.bl));
    let sc = Math.sqrt(pc*(pc-cp)*(pc-ap)*(pc-this.cl));
  
    return (sa+sb+sc)<=(this.s+0.00001);
  }

  crossByLine(a, b){
    let res;
    let dv = this.solveLinear(a, b, this.a, this.b, this.c);
    let dVector = new Vector3d(dv.x, dv.y, dv.z);
    if (this.inTriangle(dVector)){
      if (calc.onLine(a, b, dVector)){
        res = dVector;
      }
    }
    return res;
  }

  isCrossedByTriangle(tr){
    let res = false;
    if (this.crossByLine(tr.a, tr.b) || this.crossByLine(tr.b, tr.c) || this.crossByLine(tr.c, tr.a)){
      res = true;
    }
    return res;
  }
}

module.exports = Physic;