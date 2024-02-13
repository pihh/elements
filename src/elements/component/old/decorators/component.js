import { Registry } from "../../kernel/registry";

const defaultConfig = {
  selector: "",
  template: "",
  shadow: false,
};
export const Component = function (config = {}) {
  config = {
    ...defaultConfig,
    ...config,
  };

  return function (component, context) {
    class Component extends component {
      static observedAttributes = [];
      static observedActions = [];

      instance;
      __subscriptions= [];
      __connect(keyword,callback){
        // console.log('toodo') 
        // return "xxx"+keyword;
        console.log({callback})
        callback(true)
      }
      constructor() {
        super(...arguments);

        Registry.registerComponent(config, this,this);
        this.instance = Registry.loadComponent(config.selector);
        this.instance.then((manager) => {
          const { template, connectors } = manager.load();

          this.template = template;
          this.connectors = connectors;
          this.manager = manager;
        });
      }

      connectedCallback() {
        this.instance.then((template, connectors) => {
          console.log("did conn", this.template);
          // this.connectConnectors();
          this.innerHTML = "";
          this.appendChild(this.template);

          for (let [k, connector] of Object.entries(this.connectors)) {
           
            console.log({ connector },connector.selector, connector.load(this,connector.element));
           
            
            connector.load(this,connector.element)
            
          }

        
        });
      }

      //connectConnectors() {
      //   for (let conn of Object.keys(
      //     this.template.__templates.main.connectors
      //   )) {
      //     // console.log({ conn, el: this.querySelectorAll("[el-connection") });
      //     const connId = conn.split('_')[1];
      //     const el = this.querySelector('[el-connection="'+connId+'"]');
      //     const placeholder = document.createElement('div');
      //     placeholder.innerHTML = this.template.__templates.main.connectors[conn].child.template;

      //     el.replaceWith(placeholder)
      //   }
      // }
      /*
        __init() {
          this.__loadAssets();
          this.__initParentController();
          this.__initWatchers();
          this.__initVariables();
        }
        __loadAssets() {
          let styleConfig = {
            ...this.__config,
            text: this.__config.styles,
          };
          let templateConfig = {
            ...this.__config,
            text: this.__config.template,
          };
          return (this.__assetsLoaded = Promise.all([
            TheFramework.loadStylesheet(this.__config.selector, styleConfig),
            TheFramework.loadTemplate(this.__config.selector, templateConfig),
          ]));
        }
        __initParentController() {
          if (this.controller) {
            let attributes = this.getAttributeNames();
  
            for (let attrName of attributes) {
              if (attrName.indexOf("*") == 0) {
                if ($attrName.indexOf("if") > -1) {
                }
              } else if (attrName.indexOf("[") == 0) {
                let $targetAttr = attrName
                  .replaceAll("[", "")
                  .replaceAll("]", "");
                let $sourceAttr = this.getAttribute(attrName).replace(
                  "this.",
                  ""
                );
  
                this.controller.__connector($sourceAttr, () => {
                  this[$targetAttr] = this.controller[$sourceAttr];
                  this.setAttribute($targetAttr, this.controller[$sourceAttr]);
                });
                this[$targetAttr] = this.controller[$sourceAttr];
                this.setAttribute($targetAttr, this.controller[$sourceAttr]);
  
                this.removeAttribute(attrName);
              } else if (attrName.indexOf("(") == 0) {
                let attrEvent = attrName.replaceAll("(", "").replaceAll(")", "");
                if (
                  this.constructor.observedAttributes
                    .map((a) => a.toLowerCase())
                    .indexOf(attrEvent) == -1
                ) {
                  this.addEventListener(attrName, () => {
                    this.controller[this.getAttribute(attrEvent)](...arguments);
                  });
                }
              }
            }
          } else {
            this.controller = this;
          }
        }
  
        registerListener(callback) {
          const eventName = callback.toLowerCase();
          if (!this.__eventListeners[eventName]) {
            this.__eventListeners[eventName] = true;
            this.addEventListener(eventName, this[callback]);
          }
        }
        onDidRender;
        __initVariables() {
          this.onDidRenderPromise = new Promise((res) => {
            this.onDidRender = res;
            [...this.querySelectorAll("[slot]")].forEach(($slot) =>
              $slot.classList.add("the-slot-has-loaded")
            );
          });
          this.$template = this.__config.template;
        }
  
        __initWatchers() {
          const attributeList = {};
          const observedAttributes = this.observedAttributes || [];
  
          for (let attr of observedAttributes) {
            let value = this[attr];
  
            if (value != undefined && typeof value != "object") {
              if ([true, "true"].indexOf(value) > -1) {
                value = true;
              } else if ([false, "false"].indexOf(value) > -1) {
                value = false;
              }
              attributeList[attr] = value;
            }
            if (typeof value == "object") {
              this.removeAttribute(attr);
            }
            attributeList[attr] = value;
          }
  
          const [scope, connection, render] = Reactive(attributeList);
          this.scope = scope;
  
          this.__connector = function (path, name) {
            // const subscribe = connection(...arguments);
            // this.__subscriptions.push(subscribe);
  
            return connection(path, name);
          };
          this.render = render;
  
          for (let attr of observedAttributes) {
            this.__defineGetter__(attr, function () {
              this.getAttribute(attr);
              return this.scope[attr];
            });
            this.__defineSetter__(attr, function (value) {
              // console.clear();
              // console.log(attr,value,typeof value )
  
              this.scope[attr] = value;
              this.setAttribute(attr, value);
              return true;
            });
          }
        }
  
        // didConnect = false;
        // @Once("didConnect")
        connectedCallback() {
          // if (this.didConnect) return;
          // this.didConnect = true;
  
          const observedAttributes = this.observedAttributes || [];
  
          for (let attr of observedAttributes) {
            const $value = this.getAttribute(attr);
            if ($value !== undefined && $value !== null) {
              this[attr] = $value;
            }
          }
          if (this.nodeName === "THE-WRAPPER") {
            this.innerHTML = "";
          }
          // let attributes = this.getAttributeNames();
          // if(attributes.indexOf('for')>-1){
          //   console.log('xxxx')
          //   connectForLoop(this)
  
          //   // attributes = this.getAttributeNames();
          // }
          $bind(this);
  
          this.onDidLoad();
        }
  
        // @Once("isLoaded")
        onAfterLoadCallback() {
          afterLoadCallbackHandleIfOperation(this);
          afterLoadCallbackHandleForOperation(this);
          const __overrideFunctions = this.__overrideFunctions || [];
          // for (let $evtLower of __overrideFunctions) {
          //   const $allMethods = Object.getOwnPropertyNames(
          //     Object.getPrototypeOf(this.constructor.prototype)
          //   );
  
          //   const $allMethodsLowerCase = $allMethods.map((m) => m.toLowerCase());
          //   const index = $allMethodsLowerCase.indexOf($evtLower);
  
          //   if (index > -1) {
          //     const method = $allMethods[index];
          //     const methodFn = this[method];
          //     this[method] = async (input) => {
          //       // console.log(input);
          //       const data = await methodFn(...arguments);
          //       this.controller.dispatchEvent(
          //         new CustomEvent($evtLower, { detail: { data: 1 } })
          //       );
          //     };
          //     this[method]({ xxx: 1 });
          //   }
          // }
        }
  
        onDidLoad() {
          if (this.nodeName === "THE-WRAPPER") {
            console.log("did load");
          }
  
          // this.render();
          if (this.onAfterLoadCallback) {
            this.onAfterLoadCallback();
          }
        }
        unsubscribe() {
          this.__subscriptions.map((s) => s.unsubscribe());
        }
        disconnectCallback() {
          this.unsubscribe();
        }
        */
    }
    if (customElements.get(config.selector) === undefined) {
      Component.observedActions = Component.prototype.observedActions;
      Component.observedAttributes = Component.prototype.observedAttributes;
      customElements.define(config.selector, Component);
    }
    return Component;
  };
};
