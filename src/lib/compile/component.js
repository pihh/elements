import { ComponentSetup } from "./component/setup";
import { Template } from "./template";
/**
 * Component decorators
 * @param {*} config
 * @returns
 */

// const props = {
//     name: "world",
//     description: "default value",
//     textBinding: "text bindinf",
//     counter: 1,
//     item: "xxx",
//     color: "red",
//     counterUpdating: false,
//     colors: ["white", "red", "blue"],
//   };
//   const selector = "[template=the-browser]";
//   const template = document
//     .querySelector(selector)
//     .content.firstElementChild.firstElementChild.cloneNode(true);
//   document.head.appendChild(template);
//   const TheTemplate = new Template(selector, props, template);
const props = {
  name: "world",
  description: "default value",
  textBinding: "text binding",
  booleanBinding: false,
  counter: 0,
  item: "xxx",
  color: "red",
  url: "https://pihh.com",
  counterUpdating: false,
  colors: ["white", "red", "blue"],
};
const selector = "[template=the-browser]";

const BaseController = function (config, props) {
  return new Promise(async (res, rej) => {
    // const template = document
    // .querySelector(selector)
    // .content.firstElementChild.firstElementChild.cloneNode(true);
    let result = await fetch("/the-browser/template.html");
    let placeholder = document.createElement("template");
    document.head.appendChild(placeholder);
    let wrapper = document.createElement("div");
    placeholder.content.appendChild(wrapper);
    let template = await result.text();
    wrapper.innerHTML = template;

    //placeholder.innerHTML = template
    //   document.head.appendChild(template);
    const TheTemplate = new Template(
      selector,
      props,
      placeholder.content.firstElementChild.firstElementChild.cloneNode(true)
    );
    res(TheTemplate);
    //     return TheTemplate;
  });
};
let registered = false;

let Controller;
export function Component(config = {}) {
  //   console.log("component fn");
  if (!Controller) Controller = BaseController(config, props);
  //   const componentSetup = ComponentSetup(config);

  
  return function (component) {
  const methods = Object.getOwnPropertyNames(component.prototype).filter(m => ['constructor','length','prototype','observedAttributes'].indexOf(m)==-1);
  
    class Component extends component {
      static selector = selector;
      //   // static get observedAttributes() {
      //   //   return this.__props || [];
      //   // }
      __instanciated__ = false;
      __methods__ = methods
      constructor() {
        super();
        // console.log(Object.getOwnPropertyNames(Component))
        // debugger
        this.baseController = Controller;
        this.baseController.then((controller) => {
          this.controller = controller;
          this.__init__();
        });
      }

      __init__() {
        if (this.isConnected && !this.__instanciated__ && this.controller) {
          
          this.template = this.controller.clone(this.props, this);
          this.__instanciated__ = true;
        }
      }
      connectedCallback() {
        this.__init__();
        // super.connectedCallback();
      }
      //   async didConnect(){
      //    return componentSetup.load(this).then((data)=>{console.log(data)})
    }
    if (!registered) {
      customElements.define("the-browser", Component);
      registered = true;
    }
    // componentSetup.registerComponent(Component);
    return Component;
  };
}
