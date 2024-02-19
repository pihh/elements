// SAI CHOURIÇO -------------------------------
// -------------------------------

import { State } from "../../elements/reactivity/state";
import { TheBaseComponent } from "../component";


const configuration = {
  template: `
  <style>
  h1 {
    font-weight: 800;
    font-size: 1.75rem;
    letter-spacing: -1px;
    line-height: 2rem;
}</style>
            <h1 data-el-text="0">{{this.title}} inner</h1>
            <small data-el-text="1"><b>Counter:</b> {{this.counter}}</small>
            <input type="text" name="title" model="{{this.title}}" class="input"/>
            <button class="btn" data-el-action="0">Propagate</button>
            `,
  props: {
    title: {
      defaultValue: "TheDemoComponent Title",
      type: "text",
    },
    counter: {
      defaultValue: 0,
      type: "number",
    },

  },

  connectors: {
    "data-el-operation": {
    },

    "data-el-action": {
      // onclick={addItem}
      // onclick={(event)=>{duplicate(event)}}
      0: {
        id: Symbol("action connection"),
        props: [],
        eventName: "click",
        value: "propagate",
        expression: "this.propagate",

        setup: function (instance, element) {
          if (!instance.__connections__.hasOwnProperty(this.id)) {
            instance.__connections__[this.id] = this.id;
            this.connect(instance, element);
          }
        },
        connect: function (instance, element) {
          const fn = Function("return `" + this.expression + "`");
          const action = instance[this.value];
          const callback = function (event) {
            action.call(instance, event);
          };
          element.addEventListener(this.eventName, callback);
        },
        unsubscribe: [],
      },
    },
    "data-el-text": {
      0: {
        id: Symbol("text connection"),
        props: ["title"],
        attribute: "textContent",
        value: "{{title}} inner",
        expression: "${this.title} inner",
        childNode: 0,
        setup: function (instance, element) {
          if (!instance.__connections__.hasOwnProperty(this.id)) {
            instance.__connections__[this.id] = this.id;
            this.connect(instance, element);
          }
        },
        connect: function (instance, element) {
          const node = [...element.childNodes][this.childNode];
          const fn = Function("return `" + this.expression + "`");
          const attribute = this.attribute;
          const expression = this.expression;
          const callback = function (value) {
            try {
              const output = fn.call(instance);
              node[attribute] = output;
            } catch (ex) {
              console.warn(ex);
            }
            // node.setAttribute(attribute, output);
          };

          for (let prop of this.props) {
            instance.__subscriptions__.push(instance.connect(prop, callback));
            // console.log({ instance, prop, callback });
          }

          callback();
        },
        unsubscribe: [],
      },
      1: {
        id: Symbol("text connection"),
        props: ["counter"],
        attribute: "textContent",
        value: "{{counter}} inner",
        expression: "${this.counter} inner",
        childNode: 1,
        setup: function (instance, element) {
          if (!instance.__connections__.hasOwnProperty(this.id)) {
            instance.__connections__[this.id] = this.id;
            this.connect(instance, element);
          }
        },
        connect: function (instance, element) {
          const node = [...element.childNodes][this.childNode];
          const fn = Function("return `" + this.expression + "`");
          const attribute = this.attribute;
          const expression = this.expression;
      
          const callback = function (value) {
            try {
      
              const output = fn.call(instance);
              node[attribute] = output;
            } catch (ex) {
              console.warn(ex);
            }
            // node.setAttribute(attribute, output);
          };

          for (let prop of this.props) {
            instance.__subscriptions__.push(instance.connect(prop, callback));
          
          }

          callback();
        },
        unsubscribe: [],
      },

    },
    "data-el-attribute": {
 
    },
  },

  actions: {
    // onClickItem: function() {
    //   console.log("onClick Item");
    //   console.log(this.items);
    // }
    // addItem() {
    //   this.items.push({ name: "Item " + this.items.length });
    // }
    // removeItem() {
    //   console.log(this.items);
    //   this.items.pop();
    // }
    // increment() {
    //   console.log(this.items);
    //   this.counter++;
    // }
    // decrement() {
    //   console.log(this.items);
    //   this.counter--;
    // }
  },
};

class TheInnerComponent extends TheBaseComponent{
  constructor(){
    super();
  }

  title = "The Inner Component";
  counter = 1;
  propagate(){
    
    this.emit("propagate", {
       name: "John",counter:this.counter 
    });
  }
}

export class TheInnerComponentCompiled extends TheInnerComponent {
  static get observedAttributes() {
    return Object.keys(configuration.props);
  }
  constructor() {
    super();
    this.__init__();
  }

  connect() {
    console.log("Connecting", ...arguments);
  }

  connectedCallback() {
    super.connectedCallback();
    this.__setup__();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    console.log("disconnected");
  }

  __connections__ = {};
  __subscriptions__ = [];
  __init__() {
    // Add shadow root
    if (this.shadowRoot) {
      this.__shadow__ = this.shadowRoot;
    } else {
      this.__shadow__ = this.attachShadow({ mode: "open" });
    }
    this.__shadow__.innerHTML = configuration.template;

    // Create reactivity
    const __scope__ = {};
    for (let prop of Object.keys(configuration.props)) {
      let propConfiguration = configuration.props[prop];
      __scope__[prop] = propConfiguration.defaultValue;
    }

    const { scope, connect, render } = State(__scope__);
    this.__scope__ = scope;
    this.connect = connect;
    // Parse this shit
    for (let prop of Object.keys(configuration.props)) {
      this.__defineGetter__(prop, function () {
        return this.__scope__[prop];
      });
      this.__defineSetter__(prop, function (value) {
        this.__scope__[prop] = value;
        return true;
      });
    }
  }

  __setup__() {
    if (!this.__setupComplete__) {
      if (!this.__setupOngoing__) {
        this.__setupOngoing__ = true;

        // Connect properties
        for (let prop of Object.keys(configuration.props)) {
          //this[prop] = this.getAttribute(prop) || this[prop];
        }
        // debugger;
        // Connect reactivity
        let elements = [];
        elements = [...this.__shadow__.querySelectorAll("[data-el-attribute]")];
        for (let element of elements) {
          const identifiers = element.dataset.elAttribute
            .split(",")
            .map((el) => el.trim());
          for (let identifier of identifiers) {
            configuration.connectors["data-el-attribute"][identifier].connect(
              this,
              element
            );
          }
          delete element.dataset.elAttribute;
        }

        elements = [...this.__shadow__.querySelectorAll("[data-el-text]")];
        for (let element of elements) {
          const identifiers = element.dataset.elText
            .split(",")
            .map((el) => el.trim());
          for (let identifier of identifiers) {
            try {
              configuration.connectors["data-el-text"][identifier].connect(
                this,
                element
              );
            } catch (ex) {
              console.log;
            }
          }
          delete element.dataset.elText;
        }

        // Connect actions
        elements = [...this.__shadow__.querySelectorAll("[data-el-action]")];
        for (let element of elements) {
          const identifiers = element.dataset.elAction
            .split(",")
            .map((el) => el.trim());
          for (let identifier of identifiers) {
            configuration.connectors["data-el-action"][identifier].connect(
              this,
              element
            );
          }
          delete element.dataset.elAction;
        }

        this.__setupOngoing__ = false;
        this.__setupComplete__ = true;
      }
    }
  }
}

customElements.define("the-inner", TheInnerComponentCompiled);
