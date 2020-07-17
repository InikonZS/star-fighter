const {GameSlideredScreen} = require('../control-js/menu.classes.js');


let gs = new GameSlideredScreen(document.body);
for (let i=0; i<5; i++){
  let sl = gs.slider.addSlide();
  sl.slideContainer.node.innerHTML = mis1;
}

gs.setTitle('Select mission');
gs.addButton('Back');
gs.addButton('Select');