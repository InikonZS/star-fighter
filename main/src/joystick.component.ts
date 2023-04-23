import Control from './control-js/control.component';
import GLCanvas from './gl-canvas.component';

class Joy extends Control{
  menuButton: TouchButton;
  leftPad: TouchPad;
  touchPad: TouchPad;
  shotButton: TouchButton;
  shieldButton: TouchButton;

  constructor(parentNode: HTMLElement, glCanvas: GLCanvas, onChange: ()=>void, onChangeLeft: ()=> void){
    super(parentNode, 'div', 'joy_panel', '');
    let headPanel = new Control(this.node, 'div', 'joy_panel');
    headPanel.node.style='height:30px; top:0px';
    this.menuButton = new TouchButton (headPanel.node, 'butg', (st)=>{
      if (!glCanvas.menu.isActive){
        glCanvas.menu.activate();
        glCanvas.keyboardState.shot = false;
        document.exitPointerLock();
      } 
    });
    this.menuButton.node.style = 'width:30px';

    let mainPanel = new Control(this.node, 'div', 'joy_panel');
    mainPanel.node.style='height:calc(100% - 30px - 7%); top:30px';
    

    let leftGroup = new Control(mainPanel.node, 'div', 'but_group');
    leftGroup.node.style = 'justify-content: flex-start;';
    let rightGroup = new Control(mainPanel.node, 'div', 'but_group');
    rightGroup.node.style = 'justify-content: flex-end;';
    let rightSubGroup = new Control(rightGroup.node, 'div', 'but_subgroup');


    let weaponSubGroup = new Control(leftGroup.node, 'div', 'but_subgroup');
    for (let i=0; i<4; i++){
      new TouchButton (weaponSubGroup.node, 'butg', (st)=>{
        glCanvas.game.player.setWeapon(i+1);  
      });
    }

/*    let sub1 = new Control(leftGroup.node, 'div', 'but_subgroup');

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
    });*/

    this.leftPad = new TouchPad(leftGroup.node, onChangeLeft);
    this.leftPad.node.className = 'but but_left';

    this.touchPad = new TouchPad(rightGroup.node, onChange);
    this.touchPad.node.className = 'but but_right';
    
    let sub1 = new Control(leftGroup.node, 'div', 'but_subgroup');
    this.shotButton = new TouchButton (sub1.node, 'butg', (st)=>{
      glCanvas.keyboardState.shot= st;  
    });
    this.shotButton.node.style='width:100%';

    this.shieldButton = new TouchButton (sub1.node, 'butg', (st)=>{
      glCanvas.keyboardState.space= st;  
    });
    this.shieldButton.node.style='width:100%';
  }
}

class TouchButton extends Control{
  onChange: (state: boolean) => void;
  constructor (parentNode: HTMLElement, className: string, onChange: (state: boolean)=>void){
    super (parentNode, 'div', className||'but', '');
    this.onChange = onChange;
    let sh = this;
    sh.node.addEventListener('mousedown', (e)=>{
      e.preventDefault();
      this.onChange(true);
      //glCanvas.keyboardState.shot = true;
    });
    sh.node.addEventListener('mouseup', (e)=>{
      e.preventDefault();
      this.onChange(false);
    }); 

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
  onChange: (dx: number, dy: number, cx: number, cy: number)=>void;

  constructor (parentNode: HTMLElement, onChange: (dx: number, dy: number, cx: number, cy: number)=>void, onClick?: ()=>void){
    super (parentNode, 'div', 'but');
    let but = this;
    //let but = new Control(this.node, 'div', 'but');
    let lx =0;
    let ly =0;
    let ax =0;
    let ay =0;

    let sx: number;
    let sy: number;
    let cx, cy;
    let lts: number;
    let touchIndex =-1;
    this.onChange = onChange;

    let tst;

    let downed = false;

   // but.node.addEventListener('click', (e)=>{
   //   onClick();
    //});
    but.node.addEventListener('mousedown', (e)=>{
      if (!(e.buttons==1)){return;}
      e.preventDefault();
      let zt = e;
      downed = true;
      if (zt){
        sx = zt.clientX;
        sy = zt.clientY;
        this.onChange(0,0, 0, 0);
      }
      lts = undefined;  
    });

    let startHandler = (e)=>{
      e.preventDefault();
      let br = but.node.getBoundingClientRect();
      let it;
      for (let i=0; i<e.touches.length; i++){
        it=e.touches[i];
        if (inBox(it.clientX, it.clientY, br)){
          touchIndex = i;
          break;
        };  
      }
      let zt = e.touches[touchIndex];
      if (zt){
        sx = zt.clientX;
        sy = zt.clientY;
        this.onChange(0,0, 0, 0);
      }
      lts = undefined;
    };

    let endHandler = (e)=>{
      e.preventDefault();
      this.onChange(0,0, 0, 0);
      lts=undefined;
      downed = false;
    }

    but.node.addEventListener('touchstart', startHandler);

    but.node.addEventListener('touchend', endHandler);
    document.addEventListener('mouseup', (e)=>{
      if (downed){
        endHandler(e);
      }
    });
    but.node.addEventListener('touchcancel', endHandler);

    but.node.addEventListener('touchmove', (e)=>{
      e.preventDefault();
      let br = but.node.getBoundingClientRect();
      let zt = e.touches[touchIndex];
      //but.node.textContent = e.touches.length;
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

        cx = -sx+zt.clientX;
        cy = -sy+zt.clientY;

        let dt = e.timeStamp-lts;
        let dx = (ax-lx)/dt;
        let dy = (ay-ly)/dt;
        let sc = 0.00031;

        let scc =2;
        if (Math.abs(dx)<0.1 && Math.abs(dy)<0.1){
          this.onChange(dx/sc, dy/sc, cx*scc, cy*scc);
        }
      }
    });

    but.node.addEventListener('mousemove', (e)=>{ //todo, maybe listen document for same behavior like touchmove
      e.preventDefault();
      let br = but.node.getBoundingClientRect();
      let zt = e;
      //but.node.textContent = e.touches.length;
     // console.log (e);
      if (zt&&downed){
        lx = ax;
        ly = ay
        if (!lts){
          lts = e.timeStamp;
          ly = zt.clientY-br.top;
          lx = zt.clientX-br.left;
        }
        
        ay = zt.clientY-br.top;
        ax = zt.clientX-br.left;

        cx = -sx+zt.clientX;
        cy = -sy+zt.clientY;

        let dt = e.timeStamp-lts;
        let dx = (ax-lx)/dt;
        let dy = (ay-ly)/dt;
        let sc = 0.00031;

        let scc =2;
        if (Math.abs(dx)<0.1 && Math.abs(dy)<0.1){
          this.onChange(dx/sc, dy/sc, cx*scc, cy*scc);
        }
      }  
    });
  }
}

function inBox(x: number, y: number, rect){
  return (
    y>rect.top &&
    x>rect.left &&
    y<rect.bottom &&
    x<rect.right
  );
}

export default {
  Joy,
  TouchPad,
  TouchButton
};