class GameObject{
  constructor(){
    this.childList = [];
    
    this.isExists = true;
    this.reqFilter = false;

    this.onProcess;
    this.onRender;
    this.onReact;
    this.parents = [];
  }

  render(gl, props){
    if (this.onRender){
      this.onRender(gl, props);
    }
    if (this.reqFilter){
      this.childList = this.childList.filter(it=>it.isExists);
      this.reqFilter = false;
    }
    this.childList.forEach(it=>{
      it.render(gl, props);
    });
  }

  process(deltaTime, props){
  
    if (this.onProcess){
      this.onProcess(deltaTime, props);
    }
    if (this.reqFilter){
      this.childList = this.childList.filter(it=>it.isExists);
      this.reqFilter = false;
    }
    this.childList.forEach(it=>{
      it.process(deltaTime, props);
    });
  }

  tryFilter(){
    if (this.reqFilter){
      this.childList = this.childList.filter(it=>it.isExists);
      this.reqFilter = false;
    }
  }

  react(gameObject){
    if (gameObject.isExists && this.isExists){
      if (this.onReact){
        this.onReact(gameObject);
        gameObject.childList.forEach(it=>{
          if (it.isExists && this.isExists){
            this.onReact(it);
          }
        });
      }
      this.childList.forEach(it=>{
        it.react(gameObject);
      });
    }
  }

  addChild(gameObject){
    gameObject.parents.push(this);
    this.childList.push(gameObject);
    return gameObject;
  }

  deleteSelf(){
    if (this.parents.length){
      this.isExists = false;
      //console.log('delet', this.parents[0]);
      this.parents.forEach(it => {it.reqFilter = true});
      if (this.onDelete){
        this.onDelete();
      }
    }
  }

  clear(){
    this.childList.forEach(it=>{
      it.deleteSelf();
    });
  }
}

module.exports = GameObject;