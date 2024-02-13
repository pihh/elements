import { Component } from "../../elements/component2";
import Template from "./template.html";
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
    color: "white",
  };
  color = "white";

  callback() {

    this.emit("xxxx");
    this.dispatchEvent(new CustomEvent("emit", {}));
    this.parentElement.dispatchEvent(
      new CustomEvent("childComponentCallbackCalled", {})
    );
  }

  emit(cb) {
    // console.log(this, "emit", cb, ...arguments);
    console.log('vai mandar',this)
    this.__actions.emit({str:'ajnsjnsjns',cb})
  }
}

BtnComponent.register(BtnComponent);
