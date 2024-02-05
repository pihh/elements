import { Component } from "../../elements/component";
import Template from './template.html';
export class BtnComponent extends Component {
  static config = {
    selector: "my-btn", 
    template: Template,
    styles: `
    `, 
  };

  constructor() {
    super();   
  }
  
  props = {
    color: "white"
  };
  color= "white";

  callback(){
    console.log('callback', this)
    // this.emit('callback')
    this.emit("xxxx")
    this.dispatchEvent(new CustomEvent("emit",{}));
    this.parentElement.dispatchEvent(new CustomEvent("childComponentCallbackCalled",{}));
  }

  emit(cb){
    console.log(this,"emit",cb,...arguments)
  }


}

BtnComponent.register(BtnComponent);
