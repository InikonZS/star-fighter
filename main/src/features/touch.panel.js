class Control {
  
  constructor(parentNode, tagName, className, textContent, click, fromParent) {
    const classNameV = className || '';
    const textContentV = textContent || '';
    const tagNameV = tagName || 'div';
    this.isDisabled = false;
    this.isHidden = false;

    if (!fromParent) {
      this.node = document.createElement(tagNameV);
      parentNode.appendChild(this.node);
      this.node.className = classNameV;
      this.node.textContent = textContentV;
    } else {
      this.node = parentNode;
      this.node.className = classNameV;
    }

    if (click) {
      this.click = click;
      this.node.addEventListener('click', (e) => {
        if (!this.isDisabled) {
          this.click(e);
        }
      });
    }
  }

  clear() {
    this.node.innerHTML = '';
  }

  hide() {
    this.isHidden = true;
    this.node.style.cssText = 'display:none';
  }

  show() {
    this.isHidden = false;
    this.node.style.cssText = '';
  }

  animate(animationCssClass, inlineStyle) {
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        if (animationCssClass) {
          this.node.className = animationCssClass;
        }
        if (inlineStyle) {
          this.node.style.cssText = inlineStyle;
        }
      });
    });
  }
}


const mainNode = document.querySelector('#app-main');

let scre = new Control(mainNode, 'div', 'scre');
let cur = new Control(scre.node, 'div', 'cur');

let but = new Control(mainNode, 'div', 'but');
let lx =0;
let ly =0;
let ax =0;
let ay =0;
let lts;
but.node.addEventListener('touchmove', (e)=>{
  if (!lts){
    lts = e.timeStamp;
  }
  let br = but.node.getBoundingClientRect();
  let zt = e.touches[0];
  console.log (e);
  if (zt){
    lx = ax;
    ly = ay
    ay = zt.clientY-br.top;
    ax = zt.clientX-br.left;
    let dt = e.timeStamp-lts;
    let dx = (ax-lx)/dt;
    let dy = (ay-ly)/dt;

    let sc = 20000.1;
    cur.node.style.cssText = `
      top:${dy*sc+50}px;
      left:${dx*sc+50}px;
    `;
  }
});


//////
class BarIndicator extends Control{
  constructor (parentNode, count, wrapperClass, activeClass, inactiveClass, demiClass){
    super(parentNode, 'div', wrapperClass);
    this.wrapperClass=wrapperClass;
    this.activeClass=activeClass;
    this.inactiveClass=inactiveClass;
    this.demiClass = demiClass;
    this.maxValue = count;

    this.value=0;
    this.demiValue=0;
    this.bars = [];
    for (let i=0; i<count; i++){
      let bar = new Control(this.node, 'div', inactiveClass);
      this.bars.push(bar);
    }
  }

  setValue(value, demiValue){
    this.value = value;
    this.demiValue = demiValue;
    let minValue = Math.min(this.demiValue, this.value);
    let maxValue = Math.max(this.demiValue, this.value);
    for (let i=0; i<this.maxValue; i++){
      if (i<minValue){
        this.bars[i].node.className=this.activeClass;
      } else if (i<maxValue){
        this.bars[i].node.className=this.demiClass;
      } else {
        this.bars[i].node.className=this.inactiveClass;
      }
    }  
  }
}

let bi =new BarIndicator(mainNode, 24, 'bar-indicator', 'bar-indicator_bar bar-indicator_bar__active', 'bar-indicator_bar bar-indicator_bar__inactive', 'bar-indicator_bar bar-indicator_bar__demi');
bi.setValue(5,3);

