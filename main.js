//  import { RequirementsComponent } from "./src/components/requirements";

import { Registry } from "./src/elements/kernel/registry";
import { State } from "./src/elements/compiler/state";
import { connectTemplate } from "./src/elements/component/reactivity/connector";
import { reactivityMap } from "./src/elements/component/template/analyser/map";
import { addGlobalStylesToShadowRoot } from "./src/elements/component/template/styles";

class MyWebComponent extends HTMLElement {
  // static observedAttributes = [
  //   "variant",
  //   "text",
  //   "object",
  //   "list",
  //   "objectList",
  //   "color",
  //   "colors",
  //   "checked",
  // ];

  __setup = {
    templateConnected: false,
    propTracked: false,
  };

  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: "open" });
    this.__shadowRoot = shadowRoot;
    addGlobalStylesToShadowRoot(this.__shadowRoot);
  }
  checked = true;
  checked2 = false;
  
  text = "text property";
  object = {
    key: "object value",
  };
  list = ["list id: 0"];
  objectList = [
    {
      item: "object list item id: 0",
    },
  ];
  color = "yellow";
  colors = ["green", "red", "yellow"];
  items = ["item 1", "item 2"];

  connectScope() {
    const _scope = {};
    this.__props = Object.getOwnPropertyNames(this).filter(
      (el) => el.indexOf("_") != 0 && typeof el !=="function"
    );
    this.__props.forEach((key) => {
      _scope[key] = this.getAttribute(key) || this[key];
      this.setAttribute(key, _scope[key]);
    });
 
    const { scope, connect, render, pubsub } = State(_scope);
    this.scope = scope;
    this.connect = connect;

    for(let key of Object.keys(this.scope)){
      this.__defineGetter__(key, function(){
        return this.scope[key]
      })
   
    }
  }

  async connectTemplate() {
    this.__template = await Registry.template("my-button", this.__props);
    this.__shadowRoot.appendChild(this.__template);
    const {props,actions,operations} = reactivityMap(this.__template);
    this.reactiveProps = props;
    this.actions = actions;
    this.operations = operations;
    connectTemplate(this);
  }
  async connectedCallback() {
    if (!this.__didConnect) {
      this.__didConnect = true;
      this.connectScope();
      await this.connectTemplate();
      this.operations.onDidConnect()
    }

    this.render();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    console.log("attributeChangedCallback", name, oldValue, newValue);

  }

  render() {
  }

  fn($event,$index,text,str,num){
    console.log('FN CALLED',{$event,$index,text,str,num})
  }

  addColor(){

    this.colors.push('new-color')
  }

  customFn(){
    console.log('Custom FN CALLED')
  }
}

customElements.define("my-button", MyWebComponent);
