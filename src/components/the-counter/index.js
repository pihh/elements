


import { Component } from "../../lib/compile/component";
import { Prop } from "../../lib/compile/component/prop";

@Component({
  selector: "the-counter",
  template: {
    url: "/the-counter/template.html",
  },
})
export class TheCounter extends HTMLElement {

  constructor() {
    super();
    // debugger
  }

  connectedCallback() {
    // super.connectedCallback();
    this.counter = Number(this.counter)
  }

  @Prop() counter = 0;

  increment(){

    this.counter = Number(this.counter) + 1;
  }
  decrement(){
    // this.counter -= 1;
    this.counter = Math.max(0,Number(this.counter)-1);
  }
}

