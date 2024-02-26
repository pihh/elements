

import { Component } from "../../compile/component";
import { Prop } from "../../compile/component/prop";


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

