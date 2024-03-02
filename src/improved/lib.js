import { extractComponentConfiguration } from "./utils/compile/component-configuration";
import { connectAction } from "./utils/connections/action";
import { connectAttribute } from "./utils/connections/attribute";
import { connectBinding } from "./utils/connections/binding";
import { connectEmitter } from "./utils/connections/emiters";
import { connectFor } from "./utils/connections/for";
import { connectIf } from "./utils/connections/if";
import { connectText } from "./utils/connections/text";
import { Parser } from "./utils/parser";
import { reactive } from "./utils/reactivity";
import { Registry } from "./utils/registry";

export async function Compile(component, config = {}, mode = "live") {
  let componentConfiguration = false; //await Registry.get(config.selector);
  if (!componentConfiguration) {
    componentConfiguration = extractComponentConfiguration(component, config);
  }
  const Instance = new component();

  async function Generate() {
    return class extends HTMLElement {
      static get observedAttributes() {
        return componentConfiguration.observedAttributes;
      }
      static observedAttributeDefaultValues =
        componentConfiguration.observedAttributeDefaultValues;
      static observedAttributeTypes =
        componentConfiguration.observedAttributeTypes;
      static componentConfiguration = componentConfiguration;
      reactivity = componentConfiguration.reactivity;

      constructor() {
        super();
        if (this.innerHTML && !this.__slotContent) {
          this.__slotContent = [...this.childNodes].map((node) =>
            node.cloneNode(true)
          );
        }
        this.scope = {};
        this.localScope = {};
        this.subscriptions = {};
        this.parentListeners = {};

        this.connectScope();

        for (let method of componentConfiguration.methods) {
          if (!this.constructor.prototype.hasOwnProperty(method)) {
            this.constructor.prototype[method] =
              Instance.constructor.prototype[method];
          }
        }
        this.innerHTML = this.constructor.componentConfiguration.template;
        // console.log(this.innerHTML);
      }

      broadcast(eventName, data) {
        for (let parentListener of this.parentListeners[eventName] || []) {
          const event = new CustomEvent(eventName, { detail: { ...data } });
          parentListener.dispatchEvent(event);
        }
      }

      registerParentListener(eventName, parent) {
        if (!this.parentListeners.hasOwnProperty(eventName)) {
          this.parentListeners[eventName] = [];
        }
        this.parentListeners[eventName].push(parent);
      }

      subscribe(listener, callback) {
        if (!this.subscriptions.hasOwnProperty(listener)) {
          this.subscriptions[listener] = [];
        }

        this.subscriptions[listener].push(callback);
      }

      connectElements(reactivityConfiguration, baseElement) {
        baseElement = baseElement || this;
        for (let dataset of Object.keys(reactivityConfiguration)) {
          let config = reactivityConfiguration[dataset];
          let element = baseElement.querySelector("[" + dataset + "]");
          if (!element) continue;
          let target = element;

          /* if(element.nodeName =="THE-CONSOLE-NAV"){
            if(element.tabbed){
              // element.scope.tabs = this.scope.tabs
              
            }else{
              console.log(baseElement,element)
              element.tabs = this.tabs
              element.scope.tabs = this.scope.tabs
              element.tabbed = true;
              this.subscriptions['tabs'] = this.subscriptions['tabs'] || [];
              this.subscriptions['tabs.length'] = this.subscriptions['tabs.length'] || [];
              element.subscriptions['tabs.length'] = element.subscriptions['tabs.length'] || []
               element.subscriptions['tabs'] =  element.subscriptions['tabs'] || []
              // this.subscriptions['tabs.length']
              this.subscriptions['tabs'] = this.subscriptions['tabs'].concat(element.subscriptions['tabs'])
              this.subscriptions['tabs.length'] = this.subscriptions['tabs.length'].concat(element.subscriptions['tabs.length'])
             delete element.subscriptions['tabs']
             delete element.subscriptions['tabs.length']
             

            }
          }*/
          if (config.type == "for") {
            connectFor(this, baseElement, config, reactivityConfiguration);
          } else if (config.type === "text" && config.expression) {
            connectText(this, element, config);
          } else if (config.type === "attribute") {
            connectAttribute(this, element, target, config);
          } else if (config.type === "action") {
            connectAction(this, element, config, this.constructor);
          } else if (config.type === "if") {
            connectIf(this, baseElement, config);
          } else if (config.type === "bind") {
            connectBinding(this, element, config);
          } else if (config.type === "emitter") {
            connectEmitter(this, element, config);
          }
        }
      }

      connectReactivity() {
        if (this.__connected) return;
        this.__connected = true;
        this.scope = reactive(this.scope, [], (path) => {
          this.update(path);
        });
        for (let key of Object.keys(this.scope)) {
          this.__defineGetter__(key, function () {
            return this.scope[key];
          });
          this.__defineSetter__(key, function (value) {
            this.scope[key] = value;
            return true;
          });
        }
        this.connectElements(this.reactivity);
        this.firstRender();
      }

      firstRender() {
        for (let key of Object.keys(this.subscriptions)) {
          this.update(key);
        }
      }

      connectScope() {
        this.scope = Object.assign({}, {});
        this.scopedObjects = [];

        for (let attribute of this.constructor.observedAttributes) {
          const baseAttribute = attribute.replaceAll("[", ".").split(".")[0];
          // console.log(baseAttribute,[this,this.constructor.observedAttributeTypes]);
          const parse =
            Parser[this.constructor.observedAttributeTypes[baseAttribute]];

          let value =
            this.constructor.observedAttributeDefaultValues[baseAttribute];
          this.scope[baseAttribute] = parse(value);
          this.scopedObjects.push(baseAttribute);
        }
      }

      connectedCallback() {
        if (this.__slotContent) {
          let slot = this.querySelector("slot");
          if (slot) {
            for (let node of this.__slotContent) {
              slot.parentElement.appendChild(node);
            }
            slot.remove();
          }
        }
        if (!this.innerHTML) {
          this.innerHTML =
            this.constructor.prototype.componentConfiguration.template;

          // this.connectReactivity(); //.map(path => {this[path] = this.scope[path]});
        }
        this.connectReactivity();

        if (Instance.constructor.prototype.connectedCallback) {
          setTimeout(() => {
            Instance.constructor.prototype.connectedCallback.call(this);
          });
        }
      }

      disconnectedCallback() {
        console.log("@todo");

        this.__connected = false;
        // Disconnect the observer when the element is removed
        // componentconfiguration.observers.map((observer) => observer.disconnect());
        if (Instance.constructor.prototype.disconnectedCallback) {
          Instance.constructor.prototype.disconnectedCallback.call(this);
        }
      }

      attributeChangedCallback(name, oldValue, newValue) {
        newValue =
          Parser[componentConfiguration.observedAttributeTypes[name]](newValue);
        if (newValue !== oldValue) {
          this.scope[name] = newValue;
        }
        setTimeout(() => {
          if (Instance.constructor.prototype.attributeChangedCallback) {
            Instance.constructor.prototype.attributeChangedCallback.call(
              this,
              name,
              oldValue,
              newValue
            );
          }
        });
        setTimeout(() => {
          this.update(name);
        });
      }

      update(name) {
        const subscriptions = this.subscriptions[name] || [];
        subscriptions.map((subscription) => {
          subscription();
        });
      }
    };
  }

  let el = await Generate();
  customElements.define(config.selector, el);

  Registry.set(config.selector, componentConfiguration);
  return {
    component: el,
    config: config,
    selector: config.selector,
  };
}
