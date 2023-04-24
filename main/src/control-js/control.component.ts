export default class Control<T extends HTMLElement = HTMLElement> {
  isDisabled: boolean;
  isHidden: boolean;
  node: T;
  click: (ev: MouseEvent) => void;
  
  constructor(parentNode: HTMLElement, tagName: string="div", className: string ="", textContent: string = "", click?: (ev: MouseEvent)=>void, fromParent?: boolean) {
    const classNameV = className || '';
    const textContentV = textContent || '';
    const tagNameV = tagName || 'div';
    this.isDisabled = false;
    this.isHidden = false;

    if (!fromParent) {
      this.node = document.createElement(tagNameV) as T;
      parentNode.appendChild(this.node);
      this.node.className = classNameV;
      this.node.textContent = textContentV;
    } else {
      this.node = parentNode as T;
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

  /*setClick(click){
    if (this.click) {return;}
    if (click) {
      this.click = click;
      this.node.addEventListener('click', (e) => {
        if (!this.isDisabled) {
          this.click(e);
        }
      });
    }  
  }*/

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

  animate(animationCssClass: string, inlineStyle: string) {
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

