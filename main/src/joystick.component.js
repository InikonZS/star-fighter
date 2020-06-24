const Control = require('./control-js/control.component.js');

class Joy extends Control{
  constructor(parentNode,glCanvas, onChange, onAcc){
    super(parentNode, 'div', 'overlay_panel', '');

    let sh = new Control(parentNode, 'div', 'but', '');
    sh.node.addEventListener('touchstart', (e)=>{
      e.preventDefault();
      glCanvas.keyboardState.shot = true;
    });
    sh.node.addEventListener('touchend', (e)=>{
      e.preventDefault();
      glCanvas.keyboardState.shot = false;
    });

    let we = new Control(parentNode, 'div', 'but', '', ()=>{
      onAcc();
    });

    let but = new Control(parentNode, 'div', 'but');
    let lx =0;
    let ly =0;
    let ax =0;
    let ay =0;
    let lts;
    this.onChange = onChange;

    but.node.addEventListener('touchstart', (e)=>{
      e.preventDefault();
      lts = undefined;
    });

    but.node.addEventListener('touchend', (e)=>{
      e.preventDefault();
      lts=undefined;
    });

    but.node.addEventListener('touchmove', (e)=>{
      e.preventDefault();
      
      let br = but.node.getBoundingClientRect();
      let zt = e.touches[0];
     // console.log (e);
      if (zt){
        lx = ax;
        ly = ay
        if (!lts){
          lts = e.timeStamp;
          ly = zt.clientY-br.top;
          lx = zt.clientX-br.left;
        }
        
        ay = zt.clientY-br.top;
        ax = zt.clientX-br.left;
        let dt = e.timeStamp-lts;
        let dx = (ax-lx)/dt;
        let dy = (ay-ly)/dt;
        let sc = 0.00031;
        if (Math.abs(dx)<0.1 && Math.abs(dy)<0.1){
          //console.log(dx, dy);
          this.onChange(dx/sc, dy/sc);
        }
      }
    });
  }
}

module.exports = Joy;