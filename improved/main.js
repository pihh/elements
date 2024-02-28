import { CustomElement, WebComponent } from "./component";
import { compile } from "./utils/compile";
import { connectAction } from "./utils/connections/action";
import { connectAttribute } from "./utils/connections/attribute";
import { connectBinding } from "./utils/connections/binding";
import { connectFor } from "./utils/connections/for";
import { connectIf } from "./utils/connections/if";
import { connectText } from "./utils/connections/text";
import { Parser } from "./utils/parser";
import { reactive } from "./utils/reactivity";
const Registry = {};

function Compile(component, config = {}) {
  if (Registry.hasOwnProperty(config.selector)) {
    let ref = Registry[config.selector];
    ref.component = Object.assign({}, ref, component);
    return ref;
  }
  
  function Generate(){
    // Setup component configuration
    const componentConfiguration = {
      ...config,
    };
  
    componentConfiguration.template = componentConfiguration.template.trim();
    
    // Get component default arguments
    const Instance = new component();
    const observedAttributes = Object.keys(Instance);
    const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(Instance));
    const {template,operations} = compile(componentConfiguration.template,observedAttributes);

    
  // MyBaseClass.constructor.prototype.observedAttributes = observedAttributes;

  // for (let method of methods) {
  //   if (!MyBaseClass.prototype.hasOwnProperty(method)) {
  //     MyBaseClass.prototype[method] = Instance.constructor.prototype[method];
  //   }
  // }

 componentConfiguration.obbservedAttributes = observedAttributes;
 componentConfiguration.obbservedAttributeTypes = {};
 componentConfiguration.obbservedAttributeDefaultValues = {};

  observedAttributes.map((attr) => {
    componentConfiguration.obbservedAttributeTypes[attr] = typeof Instance[attr];
    try {
     componentConfiguration.obbservedAttributeDefaultValues[attr] =
        Instance[attr];
    } catch (ex) {
      //console.log(attr, Instance);
    }
  });

  componentConfiguration.methods = methods;
  
  componentConfiguration.reactivity =operations;
  
    return class extends HTMLElement {
      static get observedAttributes () {return  componentConfiguration.obbservedAttributes };
      static observedAttributeDefaultValues = componentConfiguration.obbservedAttributeDefaultValues;
      static observedAttributeTypes = componentConfiguration.obbservedAttributeTypes;
      static componentConfiguration = componentConfiguration
      reactivity =operations;
      
      constructor() {
        super();
  
        this.scope = {};
        this.localScope = {};
        this.subscriptions = {};
        this.connectScope();
        for(let method of methods){
          /*if(!this.hasOwnProperty(method)){
            this[method] = Instance.constructor.prototype[method];
            // this[method] = Instance.constructor.prototype[method];
          }
          */
         if(!this.constructor.prototype.hasOwnProperty(method)){
          this.constructor.prototype[method] = Instance.constructor.prototype[method];
         }
        //  console.log(this.constructor)
        //  console.log(method)
        //  debugger
        }      
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
            // console.log("connect binding", reactivityConfiguration);
            connectBinding(this, element, config);
          }
        }
      }
  
      connectReactivity() {
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
          const parse =
            Parser[this.constructor.observedAttributeTypes[baseAttribute]];
  
          let value =
            this.constructor.observedAttributeDefaultValues[baseAttribute];
          this.scope[baseAttribute] = parse(value);
          this.scopedObjects.push(baseAttribute);
        }
      }
  
      connectedCallback() {
        if (!this.innerHTML) {
          this.innerHTML = template;
          this.connectReactivity(); //.map(path => {this[path] = this.scope[path]});
        }
      }
  
      disconnectedCallback() {
        console.log("@todo");
  
        // Disconnect the observer when the element is removed
        // componentconfiguration.observers.map((observer) => observer.disconnect());
      }
  
      attributeChangedCallback(name, oldValue, newValue) {
        newValue =
          Parser[componentconfiguration.observedAttributeTypes[name]](newValue);
        if (newValue !== oldValue) {
          this.scope[name] = newValue;
        }
        this.update(name);
      }
  
      update(name) {
        const subscriptions = this.subscriptions[name] || [];
        subscriptions.map((subscription) => {
          subscription();
        });
      }
    };
  }
 
  let el = Generate()
  customElements.define(config.selector, el);

  Registry[config.selector] = {
    component: el,
    config: el.componentConfiguration,
    selector: config.selector,
  };

  return {
    component: el,
    config: config,
    selector: config.selector,
  };
}

const PreCompileWebComponent = Compile(WebComponent, {
  selector: "my-base-component",
   template: `<div class="bg-{{color}}-100 p-8 text-{{textSize}}" >
  <header>
    <h1 >{{title}}</h1>
    <p >{{description}}</p>
    <p >{{isShowing}} {{isShowing == true}}  {{isShowing ? 'it is' : 'it not'}}</p>
    <p >{{color}}</p>
    </header>
  <section>
  <section>
    <input type="text" *value="title"  />
    <select *value="color"  >
      <option value="yellow">Yellow</option>
      <option value="green">Green</option>
      <option value="blue">Blue</option>
    </select>
  </section>
  <div >Counter: {{counter.value}}</div>
    <button onclick={add} >Increment</button>
    <button onclick={toggleShowing} >Toggle Showing</button>
    <button onclick={pushColor} >Push</button>
    <button onclick={popColor} >Pop</button>
  </section>
  
  @for(let _color of colors){
    <section >
    <div>

      {{_color}} <b >{{title}} {{colors[2]}}</b>
        <div >
          <input type="text" *value="_color" />  
        </div>
        </div>
    </section>
  }



  @if(isShowing){
    <section >
      <h1>is Showing alright</h1>
    </section>
  }else{
    <section >
        <h1>Is hidden</h1>
    </section>
  }

</div>  
`
});
const PreCompileCustomElement = Compile(CustomElement, {
  selector: "my-custom-element",
   template: `<div class="bg-{{color}}-100 p-8 " >
  <header>
    <h1 >{{newTitle}}</h1>
    <p >{{color}}</p>
    </header>
  <section>

  
  <section>
    <select *value="color"  >
    @for(let _color of colors){
      <option value="{{_color}}">{{_color}}</option>

    }
    </select>
  </section>
 
    <button onclick={onClickAlert} >Alert!!</button>
    <button onclick={onToggleHidden} >{{hidden ? 'show' : 'hide' }}</button>
{{hidden}}
  </section>
   @if(hidden){
    <section >
      <h1>HELLO BITCH</h1>
    </section>
  }else{
    <section >
        <h1></h1>
    </section>
  }

</div>  
`
});
// Define custom element
// customElements.define( PreCompile.selector,PreCompile.component);

const component = document.createElement(PreCompileWebComponent.selector);
const component3 = document.createElement(PreCompileWebComponent.selector);
const component2 = document.createElement(PreCompileCustomElement.selector);
console.log({ component, component2,component3 });
document.body.appendChild(component);
document.body.appendChild(component2);
document.body.appendChild(component3)
