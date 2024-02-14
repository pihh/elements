import { Registry } from "../kernel/registry";
import { connectTemplateReactivity } from "../reactivity/template/connection";
import { mapTemplate } from "./connection/map";
import { connectScope } from "./connection/scope";
import { connectTemplate } from "./connection/template";

export function Component(config) {
  const _config = {
    ...config,
  };
  if(_config.template){
  const template =   document.createElement('template');
  document.head.appendChild(template);
  template.id = "template-"+_config.selector;
  template.innerHTML = _config.template
  }
  return function (component) {
    class Component extends component {
      static selector = _config.selector;
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

    this.__init();
  }

  __init() {
    const { setup, configuration, callback } = Registry.componentSetup(this);
  }

  async __hidrate() {
    connectScope(this);
    await connectTemplate(this);
    await mapTemplate(this);
    await connectTemplateReactivity(this);
  }

  async __initialConnection() {
    if (!this.__setup.didConnect) {
      this.__setup.didConnect = true;
      await this.__hidrate();
      this.operations.onDidConnect(this);
    }

  }
  connectedCallback() {
    this.__initialConnection();
  
    this.render();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    console.log("attributeChangedCallback", name, oldValue, newValue);
  }

  render() {
    console.log(this);
  }


}

//customElements.define("my-button", MyWebComponent);
