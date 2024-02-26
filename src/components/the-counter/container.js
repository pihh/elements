


import { Component } from "../../lib/compile/component";
import { Prop } from "../../lib/compile/component/prop";

@Component({
  selector: "the-counter-container",
  template: {
    url: "/the-counter/container.html",
  },
})
export class TheCounterContainer extends HTMLElement {

  constructor() {
    super();
    // debugger
  }

  @Prop() isShowing = true;

  toggle(){
    this.isShowing = !this.isShowing;
  }
}

