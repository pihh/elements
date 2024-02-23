import { ComponentSetup } from "./component/setup";
import { Template } from "./template";
/**
 * Component decorators
 * @param {*} config
 * @returns
 */

const BaseController = function (config, props) {
  return new Promise(async (res, rej) => {
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
      config.selector,
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
  return function (component) {
    const methods = Object.getOwnPropertyNames(component.prototype).filter(
      (method) =>
        [
          "constructor",
          "length",
          "prototype",
          "observedAttributes",
          "observedAttributeTypes",
          "observedAttrbuteValues",
        ].indexOf(method) == -1
    );

    if (!Controller) {
      const scopeMap = {
        values: component.prototype.observedAttributeValues,
        types: component.prototype.observedAttributeTypes,
      };
      Controller = BaseController(config, scopeMap);
    }

    class Component extends component {
      __instanciated__ = false;
      __methods__ = methods;

      constructor() {
        super();
        this.slotContent = this.innerHTML;
        this.innerHTML = "";
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

          this.style.visibility = "initial";
          delete this.style.visibility;
          const slots = [...this.querySelectorAll("slot")];
          if (this.slotContent && slots) {
            const slotMap = {};
            
            // let namedSlots =
            slots.forEach((slot) => {
              
              let name = slot.getAttribute("name") || "main";
              slotMap[name] = slot //this.slotContent;
            });
            slotMap.main.innerHTML = this.slotContent
            let namedSlots = [...slotMap.main.querySelectorAll("[slot]")];
            namedSlots.forEach(slot => {
              let name = slot.getAttribute("slot");
              slot.remove();
              slotMap[name].appendChild(slot);
            })
            // let mainSlot =
          }
        }
      }
      connectedCallback() {
        this.__init__();
      }
    }

    // Register component
    if (!registered) {
      customElements.define("the-browser", Component);
      registered = true;
    }

    return Component;
  };
}
