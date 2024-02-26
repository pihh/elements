


import { Component } from "../../lib/compile/component";
import { Prop } from "../../lib/compile/component/prop";
import { TheTextBinding, TheSelectBinding } from ".";




@Component({
  selector: "the-input",
  template: {
    url: "/the-input/template.html",
    // local: "/the-demo/template.html",
  },
})
export class TheInput extends HTMLElement {
  constructor() {
    super();
  
  }
  @Prop() label = "Input component"
  @Prop() value = "Pihh";

}

@Component({
  selector: "the-binding-container",
  template: {
    url: "/the-binding/container.html",
  },
})
export class TheBindingContainer extends HTMLElement {

  constructor() {
    super();
    // debugger
  }




}

