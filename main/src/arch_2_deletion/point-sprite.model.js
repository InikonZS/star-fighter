let model = `
# Blender v2.82 (sub 7) OBJ File: ''
# www.blender.org
mtllib point_sprite.mtl
o Plane
v -1.000000 -1.000000 0.000000
v 1.000000 -1.000000 0.000000
v -1.000000 1.000000 -0.000000
v 1.000000 1.000000 -0.000000
vt 1.000000 0.000000
vt 0.000000 1.000000
vt 0.000000 0.000000
vt 1.000000 1.000000
vn 0.0000 0.0000 1.0000
usemtl None
s off
f 2/1/1 3/2/1 1/3/1
f 2/1/1 4/4/1 3/2/1
o Plane.001
v -0.000000 1.000000 1.000000
v 0.000000 -1.000000 1.000000
v -0.000000 1.000000 -1.000000
v 0.000000 -1.000000 -1.000000
vt 1.000000 0.000000
vt 0.000000 1.000000
vt 0.000000 0.000000
vt 1.000000 1.000000
vn 1.0000 0.0000 0.0000
usemtl None
s off
f 6/5/2 7/6/2 5/7/2
f 6/5/2 8/8/2 7/6/2
o Plane.002
v -1.000000 0.000000 1.000000
v 1.000000 0.000000 1.000000
v -1.000000 0.000000 -1.000000
v 1.000000 0.000000 -1.000000
vt 1.000000 0.000000
vt 0.000000 1.000000
vt 0.000000 0.000000
vt 1.000000 1.000000
vn 0.0000 1.0000 0.0000
usemtl None
s off
f 10/9/3 11/10/3 9/11/3
f 10/9/3 12/12/3 11/10/3
`;

module.exports = model;