import "./style.css";
import { Component, ElComponent } from "../../elements/component";
import Template from "./template.html";

@Component({
  selector: "el-input",
  template: Template, 
}) 
export class ElInput extends ElComponent { 
  static selector = "el-input";
  static observedAttributes = ["value"]
  constructor() {
    super();
  }

  value = "El Input Component";
  type = "text";

  attributeChangedCallback(name,oldValue,newValue) {
    // console.log("attribute changed", {name, oldValue, newValue});
  }
}

