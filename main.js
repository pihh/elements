//  import { RequirementsComponent } from "./src/components/requirements";

import { Registry } from "./src/elements/kernel/registry";
import { State } from "./src/elements/compiler/state";
import { connectTemplate } from "./src/elements/component/reactivity/connector";
import { reactivityMap } from "./src/elements/component/template/analyser/map";



class MyWebComponent extends HTMLElement {
  static observedAttributes = ["variant", ,"text","object","list","objectList","color","colors"];

  __setup = {
    templateConnected: false,
    propTracked:false
  };

  constructor() {
    super();
    if(!Registry.load('my-button')){
        document
        .getElementById("my-button-template")
        .content.innerHTML = Registry.parse('my-button',document
        .getElementById("my-button-template"),MyWebComponent.observedAttributes,"my-button-template")
    }
    const template = Registry.load('my-button')

    const shadowRoot = this.attachShadow({ mode: "open" });
    this.reactiveProps = reactivityMap(template);

    const { scope, connect, render, pubsub } = State({
      text: "text property",
      object: {
        key: "object value",
      },
      list: ["list id: 0"],
      objectList: [
        {
          item: "object list item id: 0",
        },
      ],
      color: "yellow",
      colors: ["green","red","yellow"]
    });
    this.scope = scope;
    this.connect = connect;

    shadowRoot.appendChild(template);
  }

  connectTemplate() {
    connectTemplate(this)
  }
  connectedCallback() {
      this.connectTemplate();
      this.render();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    // console.log("xxxxx", { name, oldValue, newValue });
    // this.render();
  }

  render() {
    // console.log("render");
    // let list = this.getAttribute("list") || "[1,2,3,4,5,6]";
    // list = JSON.parse(list);
    // console.log(list);
    // const variant = this.getAttribute("variant") || "";
    // this.shadowRoot.querySelector("button").className = variant;
  }
}

customElements.define("my-button", MyWebComponent);
