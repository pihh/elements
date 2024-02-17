import { Component, ElComponent } from "../../elements/component";
import "./style.css";

import Template from "./template.html";

@Component({
  selector: "el-btn",
  template: Template,  
})
export class ElBtn extends ElComponent {
  static selector = "el-btn"; 
  static observedAttributes = ["color"]
  constructor() {  
    super();
  }
 
  color = "white";
  border = "gray";

  placeholder = "El Btn Component";
 
  onClick(){
    console.log('callback ',this);
  }


  borderChangeCallback(){
    this.border = this.color == "white" ? "gray" :this.color;
  }
  attributeChangedCallback(){
    
    console.log('attributeChangedCallback',...arguments)
  }
}
/*
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

*/