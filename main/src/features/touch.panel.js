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
    this.node.style = 'display:none';
  }

  show() {
    this.isHidden = false;
    this.node.style = '';
  }

  animate(animationCssClass, inlineStyle) {
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        if (animationCssClass) {
          this.node.className = animationCssClass;
        }
        if (inlineStyle) {
          this.node.style = inlineStyle;
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
    cur.node.style = `
      top:${dy*sc+50}px;
      left:${dx*sc+50}px;
    `;
  }
});