const Control = require('./control.component.js');

class Pager extends Control{
  constructor(parentNode, thisStyle = '') {
    super(parentNode, 'div', thisStyle);
    this.pages = [];
  }

  selectPage(page, index){
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

  addPage(text, style='menu_background'){
    let page = new Control(this.node, 'div', style, text);
    this.pages.push(page);
    return page;
  }
}

module.exports = Pager;