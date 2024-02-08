import './style.css';
import Template from './template.html';
import { Component } from "../../src/elements/component";

export class UpgradeComponent extends Component { 
  static config = {
    selector: "el-upgrade", 
    template: Template, 
    styles: "", 
  };

  static props = ["title","description","caption","propagation","color","colors", "counter","visible"];
  static actions = [];
  constructor(){
    super()
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
      name: color
    }
  });

  counter = 0; 
  visible = false;

  onClick($event){
    console.log('onclick',$event);  
    this.counter++;
  }

  // Computed properties



}
 

UpgradeComponent.register(UpgradeComponent);
