import { TheBaseComponent, TheComponent } from ".";
import { Component } from "../compiler";

const config = {
  selector: "the-if",
  template: `
  <style>
    :host {
      display: block;
    }
  </style>
  <slot></slot>
 `
};

class TheIfComponent extends TheComponent {
  constructor() {
    super();
  }
  condition =true

  static get observedAttributes() {
    return ['condition'];
  }


  attributeChangedCallback(name, oldValue, newValue) {

    super.attributeChangedCallback(...arguments)
    if(["true",true].indexOf(newValue)>-1){
        newValue = true
    }else{
        newValue = false
    }
    this[name] = newValue;
    if(newValue){
        this.style.display = "block"
    }else{
        this.style.display = "none";
    }
  }
}

Component(TheIfComponent, config);
