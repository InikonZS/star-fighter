import Vector3d from './vector3d.dev';

const m4 = (window as any).m4;

export function radToDeg(r: number) {
  return r * 180 / Math.PI;
}

export function degToRad(d: number) {
  return d * Math.PI / 180;
}

export function rand(lim: number){
  return Math.trunc(Math.random()*lim);
}

export function makeCameraMatrix1(aspect: number, rx: number, ry: number, rz: number, px: number, py: number, pz: number){
  let matrix = m4.perspective(1, aspect, 0.1, 2000); 
  matrix = m4.xRotate(matrix, ry);
  matrix = m4.yRotate(matrix, rz);
  matrix = m4.zRotate(matrix, rx);
  matrix = m4.scale(matrix, 1, 1, 1);
  matrix = m4.translate(matrix, px, py, pz);
  return matrix;
}

export function makeCameraMatrix(aspect: number, mv: number){
  let matrix = m4.perspective(1, aspect, 0.1, 2000); 
  return m4.multiply(matrix, mv);
}

export function getNormal(u: { x: number; y: number; z: number; }, v: { x: number; y: number; z: number; }, w: { x: number; y: number; z: number; }){
  let nv = {x: v.x-u.x, y: v.y-u.y, z: v.z-u.z}  
  let nw = {x: w.x-u.x, y: w.y-u.y, z: w.z-u.z}  
  let n = {x: nv.y*nw.z - nv.z*nw.y, y: nv.z * nw.x - nv.x * nw.z, z: nv.x * nw.y - nv.y * nw.x}
  let d = Math.hypot(n.x, n.y, n.z);
  return {x: n.x/d, y: n.y/d, z: n.z/d}
}

export function getValueD(v: { x: number; y: number; z: number; }, n: { x: any; y: any; z: any; }){
  let d = -(v.x*n.x + v.y*n.y + v.z*n.z);
  return d;
}

export function solveLinear(v1: Vector3d, v2: Vector3d, u: Vector3d, v: Vector3d, w: Vector3d){
  let n = getNormal (u, v, w);
  let d = getValueD(u, n);
  let nv = {x: v1.x-v2.x, y: v1.y-v2.y, z: v1.z-v2.z};
  let h = (n.x*v1.x + n.y*v1.y + n.z*v1.z +d) / (-(n.x*nv.x + n.y*nv.y + n.z*nv.z));
  return {x: v1.x + h*nv.x, y: v1.y + h*nv.y, z: v1.z + h*nv.z}
}

export function getMatrixProduct(m1: number[][], m2: number[][]) {
  const res = [];
  const resl = m1.length;
  for (let i = 0; i < m1.length; i += 1) {
    const rw = [];
    for (let j = 0; j < m2[0].length; j += 1) {
      let rws = 0;
      for (let k = 0; k < m2.length; k += 1) {
        rws += m1[i][k] * m2[k][j];
      }
      rw.push(rws);
    }
    res.push(rw);
  }
  return res;
}

export function vecMul(a:Vector3d, b:Vector3d){
  let vm = (a.y*b.z - a.z*b.y, a.z*b.x - a.x*b.z, a.x*b.y - a.y*b.x);
  return vm;
}

export function inTriangle(a:Vector3d, b:Vector3d, c:Vector3d, p:Vector3d){
  let al = a.subVector(b).abs();
  let bl = b.subVector(c).abs();
  let cl = c.subVector(a).abs();
  let ap = a.subVector(p).abs();
  let bp = b.subVector(p).abs();
  let cp = c.subVector(p).abs();
  let pa = (ap+bp+al)/2;
  let pb = (bp+cp+bl)/2;
  let pc = (cp+ap+cl)/2;
  let sa = Math.sqrt(pa*(pa-ap)*(pa-bp)*(pa-al));
  let sb = Math.sqrt(pb*(pb-bp)*(pb-cp)*(pb-bl));
  let sc = Math.sqrt(pc*(pc-cp)*(pc-ap)*(pc-cl));

  let pr = (al+bl+cl)/2;
  let s = Math.sqrt(pr*(pr-al)*(pr-bl)*(pr-cl));

  return (sa+sb+sc)<=(s+0.00001);
}

export function onLine(a:Vector3d, b:Vector3d, p:Vector3d){
  let al = a.subVector(b).abs();
  let ap = a.subVector(p).abs();  
  let bp = b.subVector(p).abs();
  return (ap+bp)<=(al+0.00001);
}

export function lineCrossTriangle(a:Vector3d, b:Vector3d, u:Vector3d, v:Vector3d, w:Vector3d){
  let res;
  let dv = solveLinear(a, b, u, v, w);
  let dVector = new Vector3d(dv.x, dv.y, dv.z);
  if (inTriangle(u, v, w, dVector)){
    if (onLine(a, b, dVector)){
      res = dVector;
    }
  }
  return res;
}

export function transformVertexList(vertexList:Array<number>, matrix: Array<number>){
  let ot =[];
  let mtx = matFromM4(matrix);
  for (let i=0; i<vertexList.length/3; i++){
    let v =[[vertexList[i*3+0]],[vertexList[i*3+1]],[vertexList[i*3+2]], [1]];
    let res = getMatrixProduct(mtx,v);
    ot.push(res[0][0]);
    ot.push(res[1][0]);
    ot.push(res[2][0]);
  }
  return ot;  
}

export function crossMeshByLine(vertexList:Array<number>, lineVectorA:Vector3d, lineVectorB:Vector3d){
  let res =[];
  for (let i=0; i<vertexList.length; i+=9){
    let v=[];
    for (let j=0; j<3; j+=1){
      v[j] = new Vector3d(vertexList[i+j*3+0], vertexList[i+j*3+1], vertexList[i+j*3+2]);
    }
    let dv = lineCrossTriangle(lineVectorA, lineVectorB, v[0], v[1], v[2]); 
    if (dv){
      res.push(dv)
    }
  }
  return res;
}

export function crossMeshByLineT(vertexList:Array<number>, lineVectorA:Vector3d, lineVectorB:Vector3d){
  let res: Array<{dv: Vector3d, triangle: [Vector3d, Vector3d, Vector3d]}> =[];
  for (let i=0; i<vertexList.length; i+=9){
    let v=[];
    for (let j=0; j<3; j+=1){
      v[j] = new Vector3d(vertexList[i+j*3+0], vertexList[i+j*3+1], vertexList[i+j*3+2]);
    }
    let dv = lineCrossTriangle(lineVectorA, lineVectorB, v[0], v[1], v[2]); 
    if (dv){
      res.push({dv:dv, triangle:[v[0], v[1], v[2]]});
    }
  }
  return res;
}

export function mirrorVectorFromMesh(vertexList: Array<number>, p: Vector3d, v:Vector3d){ //abs of result differents
  let b = p.addVector(v);
  let cpl = crossMeshByLineT(vertexList,p,b);
  if (cpl.length){///reflection
    let tr = getNearest(p, cpl).triangle;
    let nor = getNormal(tr[0], tr[1], tr[2]);
    let norm = new Vector3d(nor.x, nor.y, nor.z);
    let dtt = v.subVector(norm.mul(2*v.dot(norm)));
    return dtt;
  }
  return false;
}

export function getNearest(point: Vector3d, list: Array<{dv: Vector3d, triangle: [Vector3d, Vector3d, Vector3d]}>){
  let minit: {dv: Vector3d, triangle: [Vector3d, Vector3d, Vector3d]};
  let minlen = 999999;
  let p = new Vector3d(point.x, point.y, point.z);
  list.forEach(it=>{
    let v = new Vector3d(it.dv.x, it.dv.y, it.dv.z);
    let dist = p.subVector(v).abs();
    if (dist<minlen){
      dist = minlen;
      minit = it;
    }
  });
  return minit;
}

export function hitMeshPoint(vertexList: Array<number>, p: Vector3d, v: Vector3d){
  let b = p.addVector(v);
  let cpl = crossMeshByLineT(vertexList,p,b);
  if (cpl.length){
    let cp = getNearest(p, cpl);
    return cp.dv;
  }
  return false;
}

export function isCrossedMeshByLine(vertexList: Array<number>, lineVectorA: Vector3d, lineVectorB: Vector3d){
  let res =[];
  for (let i=0; i<vertexList.length; i+=9){
    let v=[];
    for (let j=0; j<3; j+=1){
      v[j] = new Vector3d(vertexList[i+j*3+0], vertexList[i+j*3+1], vertexList[i+j*3+2]);
    }
    let dv = lineCrossTriangle(lineVectorA, lineVectorB, v[0], v[1], v[2]); 
    if (dv) {return true;}
  }
  return false;
}

export function isCrossedSimple(pos: Vector3d, a:Vector3d, v: Vector3d, d: number){
  if (!v){return false;}
  return (pos.subVector(a).abs()<(v.abs()+d));
}

export function matFromM4(m: Array<number>){
  let res = [];
  for (let i=0; i<4; i++){
    //res.push([m[i*4+0],m[i*4+1],m[i*4+2],m[i*4+3]]);
    res.push([m[0*4+i],m[1*4+i],m[2*4+i],m[3*4+i]]);
  }
  return res;
}

export function makeRGBA(color?:string){
  let result = {r:rand(255), g:rand(255), b: rand(255), a:255};
  if (color!==undefined){
    let num = Number.parseInt('0x'+color);
    if (!Number.isNaN(num)){
      if (color.length==3){
        result.r = Number.parseInt('0x'+color[0]+'0');
        result.g = Number.parseInt('0x'+color[1]+'0');
        result.b = Number.parseInt('0x'+color[2]+'0');
      }

      if (color.length==4){
        result.r = Number.parseInt('0x'+color[0]+'0');
        result.g = Number.parseInt('0x'+color[1]+'0');
        result.b = Number.parseInt('0x'+color[2]+'0');
        result.a = Number.parseInt('0x'+color[3]+'0');
      }

      if (color.length==6){
        result.r = Number.parseInt('0x'+color[0]+color[1]);
        result.g = Number.parseInt('0x'+color[2]+color[3]);
        result.b = Number.parseInt('0x'+color[4]+color[5]);
      }

      if (color.length==8){
        result.r = Number.parseInt('0x'+color[0]+color[1]);
        result.g = Number.parseInt('0x'+color[2]+color[3]);
        result.b = Number.parseInt('0x'+color[4]+color[5]);
        result.a = Number.parseInt('0x'+color[6]+color[7]);
      }
    }
  return result;
  }
  return result;
}

export function makeNormRGBA(color?: string){
  let res = makeRGBA(color);
  return {r:res.r/255, g:res.g/255, b:res.b/255, a:res.a/255}
}

export function getMaxDistance(vertexList: Array<number>){
  let max = 0;
  for (let i=0; i<vertexList.length; i+=3){
    let v = new Vector3d(vertexList[i+0], vertexList[i+1], vertexList[i+2]);
    let dist = v.abs();
    if (dist>max){
      max = dist;
    }
  }
  return max;
}

export function getPosFromMatrix(matrix: Array<number>){
  return new Vector3d(matrix[12], matrix[13], matrix[14]);
}

export function isTimeout(time: number){
  return (time<0 || time>1000); 
}

export function matrixFromPos(pos: Vector3d, scale=1, azi=0, theta=0){
  let mt = m4.identity();
  mt = m4.translate(mt, pos.x, pos.y, pos.z);
  mt = m4.scale(mt, scale, scale, scale);
  mt = m4.zRotate(mt, azi);
  mt = m4.xRotate(mt, theta);
  return mt;
}

export default {
  makeCameraMatrix,
  getNormal,
  getValueD,
  solveLinear,
  getMatrixProduct,
  vecMul,
  inTriangle,
  onLine,
  lineCrossTriangle,
  transformVertexList,
  crossMeshByLine,
  isCrossedMeshByLine,
  crossMeshByLineT,
  getNearest,
  mirrorVectorFromMesh,
  radToDeg,
  degToRad,
  rand,
  makeRGBA,
  makeNormRGBA,
  getMaxDistance,
  getPosFromMatrix,
  hitMeshPoint,
  isCrossedSimple,
  isTimeout,
  matrixFromPos
}