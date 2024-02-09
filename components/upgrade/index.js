import './style.css';
import Template from './template.html';
import { Component } from "../../src/elements/component";

export class UpgradeComponent extends Component { 
  static config = {
    selector: "el-upgrade", 
    template: Template, 
    styles: "", 
  };

  static props = ["title","description","caption","propagation","color","colors", "counter","visible","v1","v2","v3"];
  static actions = []; 
  constructor(){
    super()
    console.log(this.colors)
  }   
   
  // Properties 
  title = "El Upgrade";
  description="Element framework made with ❤️ by Pihh";
  caption = "Edit this caption!!" 
  propagation = "Propagated data"   
 
  color = "blue";
  colors = ["white","yellow","green","red","blue"].map(color => {
    return {
      id:color,  
      name: color,
      list: [{id:1},{id:2},{id:3}]
    }
  });

  counter = 0; 
  visible = false;
  v1 = false;
  v2 = false;
  v3 = false;

  onClick($event){
    console.log('onclick',$event,...arguments);  
    this.counter++;
  }

  // Computed properties



}
 

UpgradeComponent.register(UpgradeComponent);
