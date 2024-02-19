import { ElBtn } from "./src/components/btn";
import { ElCard } from "./src/components/card";
import { ElDemo } from "./src/components/demo";
import { ElInput } from "./src/components/input";
import { ElLayout } from "./src/components/layout";
import { State } from "./src/elements/reactivity/state";

class TheBaseComponent extends HTMLElement {
  constructor() {
    super();
    // element created
  }

  connectedCallback() {
    // browser calls this method when the element is added to the document
    // (can be called many times if an element is repeatedly added/removed)
  }

  disconnectedCallback() {
    // browser calls this method when the element is removed from the document
    // (can be called many times if an element is repeatedly added/removed)
  }

  static get observedAttributes() {
    return [
      /* array of attribute names to monitor for changes */
    ];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    // called when one of attributes listed above is modified
  }

  adoptedCallback() {
    // called when the element is moved to a new document
    // (happens in document.adoptNode, very rarely used)
  }

  // there can be other element methods and properties

  // connectedCallback(){
  //     console.log('Demo connected')
  // }

  // attributeChangedCallback(name,oldValue,newValue){

  //     // Generated code
  //     if (oldValue === newValue) return;
  //     this[ property ] = newValue;
  //     console.log("Demo changed",{name:name,oldValue:oldValue,newValue:newValue});
  // }
}

// ENTRA PORCO -------------------------------
// -------------------------------
const template = `
<div class="component bg-{{color}}-900">
    <header>
        <h1>{{title}}</h1>
        <p>{{obj.description}}</p>
        <p>{{items[0].name}}</p>
    </header>
    <main>
        <select model="color" class="input">
            @for(let _color of colors){
                <option value="_color">_color</option>
            }
        </select>
        <ul>
            @for(let item of items; let $index = index){
                <li onclick={onClickItem(e)}>
                {{item.name}}
            </li>
            }
        </ul>

    </main>
    <footer>
            <section>
                <h5>Update items</h5>
                <div class="">
                    <button class="btn" onclick={(event)=>{duplicate(event)}}>x2</button>
                    <button class="btn" onclick={addItem}>+</button>
                    <button class="btn" onclick={removeItem}>-</button>
                </div>
            </section>
            <section>
            <h5>Update counter</h5>
            <div class="">
                <button class="btn" onclick={increment}>+</button>
                <button class="btn" onclick={decrement}>-</button>
            </div>
        </section>
    </footer>
</div>`;

// ENTRA PORCO -------------------------------
// -------------------------------
class TheDemoComponent extends TheBaseComponent {
  constructor() {
    super();
  }
  // Scope
  title = "TheDemoComponent Title";
  description = "TheDemoComponent Description";
  obj = {description : "TheDemoComponent Description"};
  counter = 0;
  color = "green";
  colors = ["green", "red", "yellow", "blue"];
  items = [{ name: "Item 0" }];

  // Methods
  onClickItem() {
    console.log("onClick Item");
    console.log(this.items);
  }
  addItem() {
    this.items.push({ name: "Item " + this.items.length });
  }
  removeItem() {
    console.log(this.items);
    this.items.pop();
  }
  increment() {
    console.log(this.items);
    this.counter++;
  }
  decrement() {
    console.log(this.items);
    this.counter--;
  }
}

// SAI CHOURIÇO -------------------------------
// -------------------------------

const configuration = {
  template: `
  <div data-el-attribute="0">
      <header>
          <h1 data-el-text="0">{{title}}</h1>
          <p data-el-text="1">{{obj.description}}</p>
          <p data-el-text="2">{{items[0].name}}</p>
          <small data-el-text="3"><b>Counter:</b> {{counter}}</small>
      </header>
      <main>
          <select model="color" class="input">
              @for(let _color of colors){
                  <option value="_color">_color</option>
              }
          </select>
          <ul>
              @for(let item of items;let $index = index){
                  <li onclick={onClickItem($index)}>
                  {{item.name}}
              </li>
              }
          </ul>
  
      </main>
      <footer>
              <section>
                  <h5>Update items</h5>
                  <div class="">
                      <button class="btn" data-el-action="0">x2</button>
                      <button class="btn" data-el-action="1">+</button>
                      <button class="btn" onclick={removeItem}>-</button>
                  </div>
              </section>
              <section>
              <h5>Update counter</h5>
              <div class="">
                  <button class="btn" onclick={increment}>+</button>
                  <button class="btn" onclick={decrement}>-</button>
              </div>
          </section>
      </footer>

  </div>`,
  props: {
    title: {
      defaultValue: "TheDemoComponent Title",
      type: "text",
    },
    obj: {
      defaultValue: {description: "TheDemoComponent Description"},
      type: "object",
    },
    description: {
      defaultValue: "TheDemoComponent Description",
      type: "text",
    },
    counter: {
      defaultValue: 0,
      type: "number",
    },
    color: {
      defaultValue: "green",
      type: "text",
    },
    colors: {
      defaultValue: ["green", "red", "yellow", "blue"],
      type: "object",
    },
    items: {
      defaultValue: [{ name: "Item 0" }],
      type: "object",
    },
  },

  connectors: {
    "data-el-action": {
      // onclick={addItem}
      // onclick={(event)=>{duplicate(event)}}
      0: {
        id: Symbol("action connection"),
        props: [],
        eventName: "click",
        value: "(event)=>{duplicate(event))}",
        expression: "(event)=>{this.duplicate(event))}",

        setup: function (instance, element) {
          if (!instance.__connections__.hasOwnProperty(this.id)) {
            instance.__connections__[this.id] = this.id;
            this.connect(instance, element);
          }
        },
        connect: function (instance, element) {
          const fn = Function("return `" + this.expression + "`");
          const callback = function (event) {
            fn.call(instance, event);
          };
          element.addEventListener(this.eventName, callback);
        },
        unsubscribe: [],
      },
      1: {
        id: Symbol("action connection"),
        props: [],
        eventName: "click",
        value: "addItem",
        expression: "this.addItem()",

        setup: function (instance, element) {
          if (!instance.__connections__.hasOwnProperty(this.id)) {
            instance.__connections__[this.id] = this.id;
            this.connect(instance, element);
          }
        },
        connect: function (instance, element) {
          const fn = Function("return `" + this.expression + "`");
          const callback = function (event) {
            fn.call(instance, event);
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
        value: "{{title}}",
        expression: "${this.title}",
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
            try{
              const output = fn.call(instance);
              node[attribute] = output;
            }catch(ex){
              console.warn(ex)
            }
            // node.setAttribute(attribute, output);
          };
          
          for (let prop of this.props) {
            instance.__subscriptions__.push(instance.connect(prop, callback));
            console.log({instance,prop,callback});
          }
          

          callback();
        },
        unsubscribe: [],
      },
      1: {
        id: Symbol("text connection"),
        props: ["obj.description"],
        attribute: "textContent",
        value: "{{obj.description}}",
        expression: "${this.obj.description}",
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
            try{
              const output = fn.call(instance);
              node[attribute] = output;
            }catch(ex){
              console.warn(ex)
            }
            // node.setAttribute(attribute, output);
          };
          
          for (let prop of this.props) {
            instance.__subscriptions__.push(instance.connect(prop, callback));
            console.log({instance,prop,callback});
          }
          

          callback();
        },
        unsubscribe: [],
      },
      2: {
        id: Symbol("text connection"),
        props: ["items.0.name"],
        attribute: "textContent",
        value: "{{items[0].name}}",
        expression: "${this.items[0].name}",
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
            try{
              const output = fn.call(instance);
              node[attribute] = output;
            }catch(ex){
              console.warn(ex)
            }
            // node.setAttribute(attribute, output);
          };
          
          for (let prop of this.props) {
            instance.__subscriptions__.push(instance.connect(prop, callback));
            console.log({instance,prop,callback});
          }
          

          callback();
        },
        unsubscribe: [],
      },
      
    },
    "data-el-attribute": {
      0: {
        id: Symbol("attribute connection"),
        props: ["color"],
        attribute: "class",
        value: "component bg-{{color}}-900",
        expression: "component bg-${this.color}-900",
        setup: function (instance, element) {
          if (!instance.__connections__.hasOwnProperty(this.id)) {
            instance.__connections__[this.id] = this.id;
            this.connect(instance, element);
          }
        },
        connect: function (instance, element) {
          const attribute = this.attribute;
          const expression = this.expression;
          const fn = Function("return `" + this.expression + "`");
          const callback = function (value) {
            const output = fn.call(instance);
            element.setAttribute(attribute, output);
          };
          for (let prop of this.props) {
            // console.log({instance,prop,callback});
            // debugger;
            instance.__subscriptions__.push(instance.connect(prop, callback));
          }
          callback();
        },
        unsubscribe: [],
      },
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

class TheDemoComponentCompiled extends TheDemoComponent {
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
      // this[prop] = propConfiguration.defaultValue;
      // this.__defineGetter__(prop, function () {
      //   return this.__scope__[prop];
      // });
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
        return true
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
            try{

              configuration.connectors["data-el-text"][identifier].connect(
                this,
                element
                );
              }catch(ex){
                console.log
              }
          }
          delete element.dataset.elText;
        }
        /*
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
        */
        this.__setupOngoing__ = false;
        this.__setupComplete__ = true;
      }
    }
  }
}

customElements.define("the-demo", TheDemoComponentCompiled);
