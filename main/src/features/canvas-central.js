function setpixelated(context){
  context['imageSmoothingEnabled'] = false;       /* standard */
  context['mozImageSmoothingEnabled'] = false;    /* Firefox */
  context['oImageSmoothingEnabled'] = false;      /* Opera */
  context['webkitImageSmoothingEnabled'] = false; /* Safari */
  context['msImageSmoothingEnabled'] = false;     /* IE */
}

let tb = document.querySelector('.joy_weap1_ico');
tb.addEventListener('click',()=>{console.log('btt')});

let canvas = document.querySelector('#gam-central-canvas');
canvas.width = 150;
canvas.height = 150;
let cx = Math.round(canvas.width/2);
let cy = Math.round(canvas.height/2);

let ctx = canvas.getContext('2d');
setpixelated(ctx);

function drawSegmentedRing(ctx, color, rad1, rad2, cx, cy, val){
  let segments = 36;
  ctx.fillStyle=color;
  ctx.strokeStyle='#fff';
  //ctx.st
  ctx.globalCompositeOperation='source-over';
  for (let i=0; i<segments; i++){
    ctx.beginPath();
    let ang1 = (i-1)*Math.PI*2/segments;
    let ang2 = (i)*Math.PI*2/segments - 3*Math.PI/180 ;
    //let rad1 = cx-1;
    //let rad2 = cx-5;
    ctx.arc(cx, cy, rad1, ang1, ang2); 
    ctx.lineTo(Math.cos(ang2)*(rad2)+cx, Math.sin(ang2)*(rad2)+cy);
    ctx.arc(cx, cy, rad2, ang2, ang1, true); 
    ctx.lineTo(Math.cos(ang1)*(rad1)+cx, Math.sin(ang1)*(rad1)+cy);
    //ctx.closePath();
    if (i<val){
      ctx.fill();
    } else {
      ctx.fillStyle='#4449';
      ctx.fill();
      //ctx.stroke();
    }
  }  
}

drawSegmentedRing(ctx, '#55b', cx-10, cx-15, cx, cy, 16);
drawSegmentedRing(ctx, '#0b0', cx-1, cx-5, cx, cy, 20);




/*ctx.beginPath();
ctx.arc(cx, cy, cx-10, 0, Math.PI*2);
ctx.fillStyle='#000f';
ctx.globalCompositeOperation='destination-out';
ctx.fill();*/


