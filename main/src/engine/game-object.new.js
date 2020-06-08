class GameObject{
  constructor(){
    this.childList = [];
    
    this.isExists = true;
    this.reqFilter = false;

    this.onProcess;
    this.onRender;
    this.onReact;
  }

  render(gl){
    if (this.onRender){
      this.onRender(gl);
    }
    if (this.reqFilter){
      this.childList = this.childList.filter(it=>it.isExists);
    }
    this.childList.forEach(it=>{
      it.render(gl);
    });
  }

  process(deltaTime){
    if (this.onProcess){
      this.onProcess(deltaTime);
    }
    if (this.reqFilter){
      this.childList = this.childList.filter(it=>it.isExists);
    }
    this.childList.forEach(it=>{
      it.process(deltaTime);
    });
  }

  react(gameObject){
    if (this.onReact){
      this.onReact(gameObject);
      gameObject.childList.forEach(it=>{
        this.onReact(it);
      });
    }
    this.childList.forEach(it=>{
      it.react(gameObject);
    });
  }

  addChild(gameObject){
    gameObject.parentObject = this;
    this.childList.push(gameObject);
  }

  deleteSelf(){
    if (this.parentObject){
      this.isExists = false;
      this.parentObject.reqFilter = true;
    }
  }
}

module.exports = GameObject;