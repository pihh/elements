/**
 * Sample component that keeps track of the desired coding format
 * and framework features.
 */

import { Action } from "../../elements/component/decorators/action";
import { Component } from "../../elements/component/decorators/component";
import { Prop } from "../../elements/component/decorators/prop";

import "./style.css";
import template from "./template.html";


 
@Component({
  selector: "el-requirements", 
  template: template
}) 
export class RequirementsComponent extends HTMLElement {
  @Prop() title = "the title";
  @Prop() condition = true;
  @Action() onClick($event,$index){
    console.log("onClick",{$event,$index});
  }
  constructor() {
    super();

  }
}

// customElements.define("el-requirements", RequirementsComponent);
