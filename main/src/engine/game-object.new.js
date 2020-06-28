class GameObject{
  constructor(){
    this.childList = [];
    
    this.isExists = true;
    this.reqFilter = false;

    this.onProcess;
    this.onRender;
    this.onReact;
    this.parents = [];

    this.onDelete = ()=>{
      if (this.mesh){
        this.mesh.deleteBuffers(); 
        console.log('delbuffers');
      }
      if (this.texture){
        app.glCanvas.glContext.deleteTexture(this.texture);
        console.log('deltex'); 
      } 
    }
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

  deleteAllChild(){
    this.childList.forEach(it=>{
      it.deleteSelf();
    });    
  }

  clear(){
    if (this.mesh){
      this.mesh.deleteBuffers(); 
      console.log('delbuffers');
    }
    if (this.texture){
      app.glCanvas.glContext.deleteTexture(this.texture);
      console.log('deltex'); 
    }
    if (this.shaderProgram){
      //app.glCanvas.glContext.deleteProgram(this.shaderProgram);
      console.log('delshader');
    }

    this.childList.forEach(it=>{
      it.clear();
    });
   // this.tryFilter();
  }
 /* clear(){
    this.childList.forEach(it=>{
      it.clear();
    });  
  }*/
}

module.exports = GameObject;