


import { Component } from "../../lib/compile/component";
import { Prop } from "../../lib/compile/component/prop";
import { TheDemo } from ".";

@Component({
  selector: "the-loop",
  template: {
    url: "/the-loop/template.html",
  },
})
export class TheLoop extends TheDemo {

  constructor() {
    super();
    // debugger
  }

  @Prop() _item = TheDemo.prototype.observedAttributeValues["items"][0]
}

