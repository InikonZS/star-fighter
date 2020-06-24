const Control = require('./control-js/control.component.js');

class Joy extends Control{
  constructor(parentNode,glCanvas, onChange){
    super(parentNode, 'div', 'joy_panel', '');

    let leftGroup = new Control(this.node, 'div', 'but_group');

    let weaponSubGroup = new Control(leftGroup.node, 'div', 'but_subgroup');
    for (let i=0; i<4; i++){
      new TouchButton (weaponSubGroup.node, 'butg', (st)=>{
        glCanvas.game.player.setWeapon(i+1);  
      });
    }

    let sub1 = new Control(leftGroup.node, 'div', 'but_subgroup');

    this.speedButton = new TouchButton (sub1.node, 'butg', (st)=>{
      glCanvas.keyboardState.forward = st;  
    });

    let sub2 = new Control(leftGroup.node, 'div', 'but_subgroup');
    this.leftButton = new TouchButton (sub2.node, 'butg', (st)=>{
      glCanvas.keyboardState.crenleft = st;  
    });

    this.rightButton = new TouchButton (sub2.node, 'butg', (st)=>{
      glCanvas.keyboardState.crenright = st;  
    });

    let sub3 = new Control(leftGroup.node, 'div', 'but_subgroup');
    this.stopButton = new TouchButton (sub3.node, 'butg', (st)=>{
      glCanvas.keyboardState.backward = st;  
    });

    this.shotButton = new TouchButton (this.node, 'but', (st)=>{
      glCanvas.keyboardState.shot = st;  
    });

    this.touchPad = new TouchPad(this.node, onChange);
    
  }
}

class TouchButton extends Control{
  constructor (parentNode, className, onChange){
    super (parentNode, 'div', className||'but', '');
    this.onChange = onChange;
    let sh = this;
    sh.node.addEventListener('touchstart', (e)=>{
      e.preventDefault();
      this.onChange(true);
      //glCanvas.keyboardState.shot = true;
    });
    sh.node.addEventListener('touchend', (e)=>{
      e.preventDefault();
      this.onChange(false);
    });  
  }
}

class TouchPad extends Control{
  constructor (parentNode, onChange){
    super (parentNode, 'div', 'but');
    let but = this;
    //let but = new Control(this.node, 'div', 'but');
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
          this.onChange(dx/sc, dy/sc);
        }
      }
    });
  }
}

module.exports = Joy;