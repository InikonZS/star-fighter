import Mesh from "../mesh.object";
import Vector3d from "d:/works/star-fighter/star-fighter/main/src/vector3d.dev";

export default class GameObject{
  hitTransformed: Array<number>;
  position: Vector3d;
  sx: number;
  sy: number;
  sz: number;
  matrix: Array<number>;
  speedVector: Vector3d
  /*hitPosition(hitPosition: any, lastPos: any, arg2: any, arg3: number) {
    throw new Error('Method not implemented.');
  }*/
  hitPosition: Vector3d;
  childList: GameObject[];
  isExists: boolean;
  reqFilter: boolean;
  onProcess: (deltaTime: number, props:any )=>void;
  onRender: (gl: WebGLRenderingContext, props: any)=>void;
  onReact: (gameObject: GameObject)=>void;
  parents: GameObject[];
  onDelete: () => void;
  mesh: Mesh;
  texture: WebGLTexture;
  shaderProgram: WebGLProgram;
  type: string;
  hitDist: number;
  physicList: any;
  onContact: (gameObject: GameObject)=>void;
  bonus: string;
  bonus_count: any;
  onCollect: (gameObject: GameObject)=>void;

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
        (window as any).app.glCanvas.glContext.deleteTexture(this.texture);
        console.log('deltex'); 
      } 
    }
  }

  render(gl: WebGLRenderingContext, props: any){
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

  process(deltaTime: number, props?:any ){
  
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

  react(gameObject: GameObject){
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

  addChild(gameObject: GameObject){
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
      (window as any).app.glCanvas.glContext.deleteTexture(this.texture);
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
