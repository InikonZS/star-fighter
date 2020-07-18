const Control = require('./control.component.js');

class Ring{
  constructor(ctx, color, rad1, rad2, cx, cy, val, maxVal, segments, onChange){
    this.ctx = ctx;
    this.color=color;
    this.rad1=rad1;
    this.rad2=rad2;
    this.cx=cx;
    this.cy=cy;
    this.segments=segments;
    
    this.onChange = onChange;
    this.value=val;
    this.maxValue = maxVal; //????
  }

  render(){
    drawSegmentedRing(this.ctx, this.color, this.rad1, this.rad2, this.cx, this.cy, this.value, this.segments);
  }

  setValue(val){
    this.value = val;
    this.render();
    if (this.onChange){
      this.onChange();
    }
  }

  setPercent(percent){
    this.setValue(this.segments*percent/100 );
  }

}

class RingIndicator extends Control{
  constructor(parentNode, width, height){
    super(parentNode, 'canvas');
    this.node.width = width;
    this.node.height = height;


    this.cx = Math.round(this.node.width/2);
    this.cy = Math.round(this.node.height/2);

    let ctx = this.node.getContext('2d');
    this.ctx=ctx;
    setpixelated(ctx);

    this.rings = [];
  }

  addRing(color, rad1, rad2, val, maxVal, segments){
    let ring = new Ring(this.ctx, color, rad1, rad2, this.cx, this.cy, val, maxVal, segments, ()=>{
      this.render();
    });
    this.rings.push(ring);
    this.render();
    return ring;
  }

  render(){
    clear(this.ctx);
    this.rings.forEach(it=>it.render());
  }
}

function setpixelated(context){
  context['imageSmoothingEnabled'] = false;       /* standard */
  context['mozImageSmoothingEnabled'] = false;    /* Firefox */
  context['oImageSmoothingEnabled'] = false;      /* Opera */
  context['webkitImageSmoothingEnabled'] = false; /* Safari */
  context['msImageSmoothingEnabled'] = false;     /* IE */
}

/*let tb = document.querySelector('.joy_weap1_ico');
tb.addEventListener('click',()=>{console.log('btt')});

let canvas = document.querySelector('#gam-central-canvas');
canvas.width = 150;
canvas.height = 150;
let cx = Math.round(canvas.width/2);
let cy = Math.round(canvas.height/2);

let ctx = canvas.getContext('2d');
setpixelated(ctx);*/

function clear(ctx){
  ctx.fillStyle='#000f';
  ctx.globalCompositeOperation='destination-out';
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

function drawSegmentedRing(ctx, color, rad1, rad2, cx, cy, val, segments_){
  let segments = segments_;
  
  ctx.fillStyle=color;
  ctx.strokeStyle='#fff';

  ctx.globalCompositeOperation='source-over';
  for (let i=0; i<segments; i++){
    ctx.beginPath();
    let ang1 = (i-1)*Math.PI*2/segments;
    let ang2 = (i)*Math.PI*2/segments - 3*Math.PI/180 ;

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

//drawSegmentedRing(ctx, '#55b', cx-10, cx-15, cx, cy, 16);
//drawSegmentedRing(ctx, '#0b0', cx-1, cx-5, cx, cy, 20);

module.exports = RingIndicator;


