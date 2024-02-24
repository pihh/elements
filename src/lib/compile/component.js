import { ComponentSetup } from "./component/setup";
import { Template } from "./template";
/**
 * Component decorators
 * @param {*} config
 * @returns
 */

const $head = document.head;
const BaseController = function (config, props) {
  return new Promise(async (res, rej) => {
    let result = await fetch(config.template.url);
    let template = await result.text();
    let $placeholder = document.createElement("template");
    let $wrapper = document.createElement("div");
    $placeholder.content.appendChild($wrapper);
    $wrapper.innerHTML = template;
    $head.appendChild($placeholder);

    const TheTemplate = new Template(
      config.selector,
      props,
      $placeholder.content.firstElementChild.firstElementChild.cloneNode(true)
    );
    $placeholder.remove();
    res(TheTemplate);
  });
};

export function Component(config = {}) {
  return function (component) {
    let Controller;
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
      console.log("Loading ", config.selector);
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
      
        this.baseController.then((setup) => {
       
          this.__init__(setup);
        });
      }

      __init__(controller) {
        if (this.isConnected && !this.__instanciated__) {
     
          const props = {}
          const initialAttributes = this.getAttributeNames();
          const bindings = initialAttributes.filter(el => el.indexOf('*') == 0).filter(el => el !== "*ref").map(el => {
            return {key:el, value: this.getAttribute(el)};
          })
          bindings.forEach(attribute => this.removeAttribute(attribute));
          for(let attribute of this.getAttributeNames()){
            props[attribute] = this.getAttribute(attribute);
          }
       
          this.template = controller.clone(props, this);
          this.__instanciated__ = true;
          for(let key of Object.keys(props)){
         
            this[key] = props[key]
          }

     
          for(let key of Object.keys(bindings)){
            const parentKey = bindings[key].value;
            const childKey = bindings[key].key.replace('*','');
            const callback = ()=>{
              if(this.__reference__[parentKey] == this[childKey]){
                return;
              }  
              this[childKey] = this.__reference__[parentKey]
            }
           
            this.removeAttribute('*'+childKey);
            const callback2 = ()=>{ 
              if(this.__reference__[parentKey] == this[childKey]){
                return;
              } 
              this.__reference__[parentKey] = this[childKey] 
            }
            this.__connection__(childKey,callback2)
            this.__reference__.__connection__(parentKey,callback)
            callback();
            callback2();

          }

          this.style.visibility = "initial";
          delete this.style.visibility;
          const slots = [...this.querySelectorAll("slot")];
          if (this.slotContent && slots) {
            const slotMap = {};

            // let namedSlots =
            slots.forEach((slot) => {
              let name = slot.getAttribute("name") || "main";
              slotMap[name] = slot; //this.slotContent;
            });
            slotMap.main.innerHTML = this.slotContent;
            let namedSlots = [...slotMap.main.querySelectorAll("[slot]")];
            namedSlots.forEach((slot) => {
              let name = slot.getAttribute("slot");
              slot.remove();
              slotMap[name].appendChild(slot);
            });
            // let mainSlot =
          }
        }
      }
      connectedCallback() {
        this.baseController.then((controller) => {
          this.__init__(controller);
        });
      }
    }

    // Register component
    if(!customElements.get(config.selector)){

      customElements.define(config.selector, Component);
    }


    return Component;
  };
}
