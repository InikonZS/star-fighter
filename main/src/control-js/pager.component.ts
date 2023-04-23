import Control from './control.component';

class Pager extends Control{
  pages: Control[];
  currentPage: any;
  currentPageIndex: number;

  constructor(parentNode: HTMLElement, thisStyle = '') {
    super(parentNode, 'div', thisStyle);
    this.pages = [];
  }

  selectPage(page: Control, index?: number){
    this.pages.forEach((it, i)=>{
      if (page ==it || i==index){
        it.show(); 
        this.currentPage = it;
        this.currentPageIndex = i;
      } else {
        it.hide();
      }
    });
  }

  addPage(text: string, style='menu_background'){
    let page = new Control(this.node, 'div', style, text);
    this.pages.push(page);
    return page;
  }
}

export default Pager;