import { Registry } from "../kernel/registry";
import { connectTemplateReactivity } from "../reactivity/template/connection";
import { mapTemplate } from "./connection/map";
import { connectScope } from "./connection/scope";
import { connectTemplate } from "./connection/template";

export function Component(config) {
  const _config = {
    ...config,
  };
  if (_config.template) {
    const template = document.createElement("template");
    document.head.appendChild(template);
    template.id = "template-" + _config.selector;
    template.innerHTML = _config.template;
  }
  return function (component) {
    class Component extends component {
      static selector = _config.selector;
      static get observedAttributes() {
        return this.__props || [];
      }
      constructor() {
        super();
      }
    }
    try {
      customElements.define(_config.selector, component);
    } catch (ex) {
      console.warn(ex);
    }
    return Component;
  };
}

export class ElComponent extends HTMLElement {
  constructor() {
    super(...arguments);

  }

  __init() {
    const { setup, configuration, callback } = Registry.componentSetup(this);

    // callback(this);
    // if (!this.__setup) {
    //    this.__setup = setup;
    //    this.__setup.initialSetup = false;
    //    this.__setup.templateConnected = false;
    //    this.__config = configuration;

    //    callback(this);
    //  }
  }

  async __hidrate() {
    connectScope(this);
    connectTemplate(this);
    mapTemplate(this);
    connectTemplateReactivity(this);
  }

  async __initialConnection() {
    
    if (!this.__setup || !this.__template) {
      delete this.__setup;
      // delete this.controller;
      this.__init(true);
      
    }
    
    if (!this.__setup.didConnect) {
      this.__setup.didConnect = true;
      
      this.__hidrate();
      this.operations.onDidConnect(this);
      // console.log({template:this.__template})
    }
  }
  connectedCallback() {
    this.__init();

    this.__initialConnection();
    this.render();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    console.log("attributeChangedCallback", name, oldValue, newValue);
  }

  render() {}
}

//customElements.define("my-button", MyWebComponent);


export default class {
  constructor(props) {  
    //  view = view || {}; //this is default value for param.
    //  this.id = view.id; 
    //  this.title = view.title;
  }
}