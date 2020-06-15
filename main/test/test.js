const {inTriangle} = require('../src/calc.utils.js');
const Vector3d = require('../src/vector3d.dev.js');
const calc = require('../src/calc.utils.js');

describe("Vector inside triangle or not", () => {
  test("it should return true", () => {
    let a = new Vector3d(0, 0, 0);
    let b = new Vector3d(15, 0, 0);
    let c = new Vector3d(0, 15, 0);
    let p = new Vector3d(1, 1, 0);
    allCombo(a, b, c, p, true);

    a = new Vector3d(0, 0, 0);
    b = new Vector3d(15, 0, 0);
    c = new Vector3d(0, 1, 0);
    p = new Vector3d(1, 0.1, 0);
    allCombo(a, b, c, p, true);

    //bad triangle
    a = new Vector3d(10, 10, 0);
    b = new Vector3d(20, 0, 0);
    c = new Vector3d(0, 20, 0);
    p = new Vector3d(10, 10, 0);
    allCombo(a, b, c, p, true);

    a = new Vector3d(11, 11, 0);
    b = new Vector3d(20, 0, 0);
    c = new Vector3d(0, 20, 0);
    p = new Vector3d(10, 10, 0);
    allCombo(a, b, c, p, true);

    //bad triangle
    a = new Vector3d(10, 10, 0);
    b = new Vector3d(10, 10, 0);
    c = new Vector3d(10, 10, 0);
    p = new Vector3d(10, 10, 0);
    allCombo(a, b, c, p, true);

    a = new Vector3d(0, 0, 0);
    b = new Vector3d(105, 0, 0);
    c = new Vector3d(0, 15, 0);
    allCombo(a, b, c, a, true);
    allCombo(a, b, c, b, true);
    allCombo(a, b, c, c, true);

    for (let i=0; i<1000; i++){
      a = randVector(100);
      b = randVector(100);
      c = randVector(100);
      p = a.addVector(b).addVector(c).mul(1/3);
      allCombo(a, b, c, p, true);

      //bad triangles
      a = randVector(100);
      b = randVector(100);
      c = b.addVector(new Vector3d(0.00001, 0.00001, 0.00001));
      p = a.addVector(b).addVector(c).mul(1/3);
      allCombo(a, b, c, p, true);
    }
  });

  test("it should return false", () => {
    let a = new Vector3d(0, 0, 0);
    let b = new Vector3d(15, 0, 0);
    let c = new Vector3d(0, 15, 0);
    let p = new Vector3d(16, 1, 0);
    allCombo(a, b, c, p, false);

    a = new Vector3d(0, 0, 0);
    b = new Vector3d(20, 0, 0);
    c = new Vector3d(0, 20, 0);
    p = new Vector3d(15, 15, 0);
    allCombo(a, b, c, p, false);

    for (let i=0; i<1000; i++){
      a = randVector(100);
      b = randVector(100);
      c = randVector(100);
      p = a.addVector(b).addVector(c).mul(1/3).addVector(a);
      allCombo(a, b, c, p, false);
    }
  });
});

function randVector(range){
  let r = range;
  let rh = range/2;
  return new Vector3d(calc.rand(r)-rh, calc.rand(r)-rh, calc.rand(r)-rh);
}

function allCombo(a, b, c, p ,truel){
  expect(inTriangle(a,b,c,p)).toEqual(truel);
  expect(inTriangle(b,a,c,p)).toEqual(truel);
  expect(inTriangle(c,b,a,p)).toEqual(truel);
  expect(inTriangle(c,a,b,p)).toEqual(truel);
  expect(inTriangle(b,c,a,p)).toEqual(truel);
  expect(inTriangle(a,c,b,p)).toEqual(truel);
}
