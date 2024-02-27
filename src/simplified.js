const stringContentType = function (str) {
    if (!isNaN(str)) {
      return {
        type: "number",
        value: Number(str),
      };
    } else if (["true", "false"].indexOf(str) > -1) {
      return {
        type: "boolean",
        value: "true" == str,
      };
    } else {
      return {
        type: "string",
        value: str,
      };
    }
  };
  const parseObject = function (obj) {
    if (typeof obj === "object") {
      Object.keys(obj).forEach(function (key) {
        let type = typeof obj[key];
        if (type === "object") {
          obj[key] = parseObject(obj[key]);
        } else {
          obj[key] = Parser[type](obj[key]);
        }
      });
    } else {
      return Parser[typeof obj](obj);
    }
    return obj;
  };
  const Parser = {
    string(value) {
      return value;
    },
    number(value) {
      return Number(value);
    },
    boolean(value) {
      return ["true", true].indexOf(value) > -1 || false;
    },
    object(value) {
      return parseObject(JSON.parse(JSON.stringify(value)));
    },
  };
  
  const Registry = {};
  const parseText = function (instance, expression) {
    let vars =
      "var {" +
      instance.constructor.observedAttributes.join(",") +
      "}  = {...this.scope}; ";
  
    // console.log(vars + " return `" + expression + "`")
    var fn = Function(vars + " return `" + expression + "`");
    return fn.call(instance);
    // return function (expression) {
    //   var fn = Function(vars + " return `" + expression + "`");
    //   return fn.call(instance);
    // };
  };
  
  function reactive(obj, keys = [], callback, key) {
    let objectIdentifier = JSON.parse(JSON.stringify(keys));
    if (key) {
      objectIdentifier.push(key);
    }
    objectIdentifier = JSON.parse(JSON.stringify(objectIdentifier));
    return new Proxy(obj, {
      get(target, prop, receiver) {
        const value = Reflect.get(target, prop, receiver);
        if (typeof value === "object" && value !== null) {
          return reactive(value, objectIdentifier, callback, prop); // Recursively make nested objects reactive
        }
        return value;
      },
      set(target, prop, value, receiver) {
        const result = Reflect.set(target, prop, value, receiver);
        // Trigger reactivity update (you might add your own logic here)
  
        callback(
          objectIdentifier
            .filter((el) => 0 < el.length)
            .concat(prop)
            .join(".")
        );
        return result;
      },
    });
  }
  
  function Compile(component, config = {}) {
    if (Registry.hasOwnProperty(config.selector)) {
      let ref = Registry[config.selector];
      ref.component = Object.assign({}, ref, component);
      return ref;
    }
    const componentConfiguration = {
      ...config,
    };
    componentConfiguration.template = componentConfiguration.template.trim();
  
    const Instance = new component();
    const observedAttributes = Object.keys(Instance);
    const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(Instance));
  
    let MyBaseClass = class extends HTMLElement {
      constructor() {
        super();
        this.config = Object.assign({}, componentConfiguration);
        this.template = componentConfiguration.template;
        this.scope = {};
        this.localScope = {};
        this.subscriptions = {};
        this.connectScope();
      }
  
      subscribe(listener, callback) {
        if (!this.subscriptions.hasOwnProperty(listener)) {
          this.subscriptions[listener] = [];
        }
  
        this.subscriptions[listener].push(callback);
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
        for (let dataset of Object.keys(componentConfiguration.reactivity)) {
          let config = componentConfiguration.reactivity[dataset];
          let element = this.querySelector("[" + dataset + "]");
          let target = element;
  
          if (config.type === "text" && config.expression) {
            target = element.childNodes[config.childNode];
            for (let listener of config.listeners) {
              const subscription = (expression) => {
                target.textContent = parseText(this, expression);
              };
              this.subscribe(listener, function () {
                subscription(config.expression);
              });
            }
  
            delete element.dataset[config.selectorCamel];
          } else if (config.type === "attribute") {
            for (let listener of config.listeners) {
              const subscription = (expression) => {
                target.setAttribute(
                  config.attribute,
                  parseText(this, expression)
                );
              };
              this.subscribe(listener, function () {
                subscription(config.expression);
              });
            }
  
            delete element.dataset[config.selectorCamel];
          } else if (config.type === "action") {
            element.addEventListener(config.event, ($event) => {
              this[config.expression](
                ...config.args.map((arg) => {
                  if (arg === "$event") return $event;
                  if (
                    componentConfiguration.observedAttributes.indexOf(
                      arg.replaceAll("[", ".").split(".")[0]
                    ) > -1
                  ) {
                    return this[arg];
                  }
                  if (
                    Object.keys(this.localScope).indexOf(
                      arg.replaceAll("[", ".").split(".")[0]
                    ) > -1
                  ) {
                    return this.localScope[arg];
                  }
                  arg = arg.replaceAll('"', "").replaceAll("'", "");
                  let { type, value } = stringContentType(arg);
  
                  return Parser[type](value);
                })
              );
            });
            element.removeAttribute(config.attribute);
            delete element.dataset[config.selectorCamel];
          } else if (config.type === "if") {
            const containers = [];
            for (let condition of config.conditions) {
              let el = this.querySelector(condition.selector);
              let placeholder = document.createComment("if placeholder");
  
              el.before(placeholder);
              placeholder.__content = el;
  
              const subscription = (expression) => {
                let result = parseText(this, expression);
  
                if (Parser.boolean(result) == true) {
                  placeholder.before(placeholder.__content);
                } else {
                  placeholder.__content.remove();
                }
              };
              for (let listener of condition.listeners) {
                this.subscribe(listener, function () {
                  subscription(condition.expression);
                });
              }
              containers.push(placeholder);
            }
          } else if (config.type == "for") {
            this.localScope = { ...this.localScope, ...config.localScope };
            let el = this.querySelector(config.selector);
            let placeholder = document.createComment("for placeholder");
            let div = document.createElement("div");
  
            el.before(placeholder);
            div.appendChild(el);
  
            placeholder.__content = div;
            placeholder.__template = div.innerHTML;
            placeholder.__stack = [];
  
            placeholder.__generator = (i) => {
              if(placeholder.__stack[i]) return placeholder.__stack[i]
  
  
              const $wrapper = placeholder.__content.cloneNode(true);
              let $template = placeholder.__template;
              
              let listener = config.sourceVariable + "[" + i + "]";
  
              $template = $template
                .replaceAll(
                  config.maskVariable,
                  config.sourceVariable + "[" + i + "]"
                )
                .replaceAll("{{", "${")
                .replaceAll("}}", "}");
              $wrapper.innerHTML = $template;
              placeholder.after($wrapper);
  
              for (let key of Object.keys(config.configuration)) {
                const configuration = config.configuration[key];
                let target = $wrapper.querySelector(configuration.selector)
                  .childNodes[0];
  
                let expression = configuration.expression.replaceAll(
                  config.maskVariable,
                  listener
                );
                const subscription = (expression) => {
                  target.textContent = parseText(this, expression);
                };
  
                this.subscribe(listener, function () {
                  subscription(expression);
                });
                subscription(expression);
              }
              placeholder.__stack.push($wrapper)
            };
  
            // placeholder.__generator(0);
  
            
            const subscription = (expression) => {
              const entries = Number(parseText(this,expression));
              console.log(entries)
              if(entries > placeholder.__stack.length){
                for(let i = placeholder.__stack.length; i < entries; i++){
                  placeholder.__generator(i);
                }
              }
              if(entries < placeholder.__stack.length){
                for(let i = entries; i < placeholder.__stack.length; i++){
                  placeholder.__stack [i].remove()
                }
                placeholder.__stack = placeholder.__stack.slice(0,entries);
              }
            }
            this.subscribe(config.sourceVariable+'.length', function () {
              subscription("${"+config.sourceVariable+'.length}');
            });
            subscription("${"+config.sourceVariable+'.length}');
            console.log(placeholder);
          }
        }
  
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
        // console.log(componentConfiguration)
  
        for (let attribute of componentConfiguration.observedAttributes) {
          const baseAttribute = attribute.replaceAll("[", ".").split(".")[0];
          const parse =
            Parser[componentConfiguration.observedAttributeTypes[baseAttribute]];
          /*
          if (
            componentConfiguration.observedAttributeTypes[baseAttribute] ==
            "object"
          ) {
            */
          let value =
            componentConfiguration.observedAttributeDefaultValues[baseAttribute];
          this.scope[baseAttribute] = parse(value);
          this.scopedObjects.push(baseAttribute);
        }
      }
  
      connectedCallback() {
        if (!this.innerHTML) {
       
  
          this.innerHTML = this.template;
          this.connectReactivity(); //.map(path => {this[path] = this.scope[path]});
        }
       
      }
  
      disconnectedCallback() {
        console.log("@todo");
        // Disconnect the observer when the element is removed
        // this.observers.map((observer) => observer.disconnect());
      }
  
      attributeChangedCallback(name, oldValue, newValue) {
        newValue =
          Parser[componentConfiguration.observedAttributeTypes[name]](newValue);
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
  
    MyBaseClass.constructor.prototype.observedAttributes = observedAttributes;
  
    for (let method of methods) {
      if (!MyBaseClass.prototype.hasOwnProperty(method)) {
        MyBaseClass.prototype[method] = Instance.constructor.prototype[method];
      }
    }
  
    componentConfiguration.observedAttributes = observedAttributes;
    componentConfiguration.observedAttributeTypes = {};
    componentConfiguration.observedAttributeDefaultValues = {};
  
    observedAttributes.map((attr) => {
      componentConfiguration.observedAttributeTypes[attr] = typeof Instance[attr];
      try {
        componentConfiguration.observedAttributeDefaultValues[attr] =
          Instance[attr];
      } catch (ex) {
        //console.log(attr, Instance);
      }
    });
    componentConfiguration.methods = methods;
  
    componentConfiguration.reactivity = {
      "data-el-text-1": {
        type: "text",
        selector: "[data-el-text-1]",
        selectorCamel: "elText-1",
        childNode: 0,
        expression: "${title}",
        listeners: ["title"],
      },
      "data-el-text-2": {
        type: "text",
        selector: "[data-el-text-2]",
        selectorCamel: "elText-2",
        childNode: 0,
        expression: "${description}",
        listeners: ["description"],
      },
      "data-el-text-3": {
        type: "text",
        selector: "[data-el-text-3]",
        selectorCamel: "elText-3",
        childNode: 0,
        expression: "Counter: ${counter.value}",
        listeners: ["counter.value"],
      },
      "data-el-text-4": {
        type: "text",
        selector: "[data-el-text-4]",
        selectorCamel: "elText-4",
        childNode: 0,
        expression:
          "${isShowing} | ${isShowing == true} | ${isShowing ? 'it is' : 'it not'}",
        listeners: ["isShowing"],
      },
  
      "data-el-attribute-1": {
        type: "attribute",
        attribute: "class",
        selector: "[data-el-attribute-1]",
        selectorCamel: "elAttribute-1",
        childNode: 0,
        expression: "bg-${color}-100 p-8 text-${textSize}",
        listeners: ["color", "textSize"],
      },
  
      "data-el-action-1": {
        type: "action",
        event: "click",
        attribute: "onclick",
        selector: "[data-el-action-1]",
        selectorCamel: "elAction-1",
        childNode: 0,
        expression: "add",
        args: [],
      },
      "data-el-action-2": {
        type: "action",
        event: "click",
        attribute: "onclick",
        selector: "[data-el-action-2]",
        selectorCamel: "elAction-2",
        childNode: 0,
        expression: "toggleShowing",
        args: ["$event", "'text'", "title", "0", "false"],
      },
      "data-el-operation-1": {
        type: "if",
        conditions: [
          {
            expression: "${isShowing}",
            selector: "[data-el-operation-1]",
            selectorCamel: "elOperation-1",
            listeners: ["isShowing"],
          },
          {
            expression: "${!isShowing}",
            selector: "[data-el-operation-2]",
            selectorCamel: "elOperation-2",
            listeners: ["isShowing"],
          },
        ],
      },
      "data-el-operation-4": {
        type: "for",
  
        // expression: "${isShowing}",
        sourceVariable: "colors",
        maskVariable: "_color",
        selector: "[data-el-operation-4]",
        selectorCamel: "elOperation-4",
        listeners: ["colors"],
        localScope: {
          index: 0,
          _color: "colors[0]",
        },
        configuration: {
          "data-el-text-5": {
            type: "text",
            selector: "[data-el-text-5]",
            selectorCamel: "elText-5",
            childNode: 0,
            expression: "${_color}",
            setup(sourceKey, maskKey) {
              this.expression.replaceAll(maskKey, sourceKey);
              this.listeners.push(sourceKey);
            },
            listeners: [],
          },
        },
      },
    };
    customElements.define(config.selector, MyBaseClass);
    Registry[config.selector] = {
      component: MyBaseClass,
      config: componentConfiguration,
      selector: config.selector,
    };
  
    return {
      component: MyBaseClass,
      config: componentConfiguration,
      selector: config.selector,
    };
  }
  
  class WebComponent {
    constructor() {
      this.xxx = 10;
      // console.log("constructor");
    }
    render() {
      this.innerHTML = this.template;
    }
  
    connectedCallback() {
      if (super.connectedCallback) super.connectedCallback();
      console.log("connected callback");
    }
  
    attributeChangedCallback(name, oldValue, newValue) {
      if (super.attributeChangedCallback)
        super.attributeChangedCallback(name, oldValue, newValue);
      console.log("attribute changed callback", {
        name: name,
        oldValue,
        newValue,
      });
    }
    isShowing = false;
    textSize = "xl";
    color = "yellow";
    colors = ["yellow", "red", "green"];
    title = "Web Component title";
    description =
      "Description Lorem ipsum dolor sit amet con et eu fugiat nulla pariatur n";
    counter = { value: 0 };
    add() {
      // console.log(this.counter);
      this.counter.value++;
      // this.counter.value = Number(this.counter.value) +1;
    }
    toggleShowing($event, text, title, num, bool) {
      console.log($event, this.isShowing, { text, title, num, bool });
      this.isShowing = !this.isShowing;
    }
  }
  
  const PreCompile = Compile(WebComponent, {
    selector: "my-base-component",
    template: `
  <div class="bg-{{color}}-100 p-8 text-{{textSize}}" data-el-attribute-1 data-el-attribute-2 >
    <header>
      <h1 data-el-text-1>{{title}}</h1>
      <p data-el-text-2>{{description}}</p>
      <p data-el-text-4>{{isShowing}} {{isShowing == true}}  {{isShowing ? 'it is' : 'it not'}}</p>
    </header>
    <section>
    <div data-el-text-3>Counter: {{counter.value}}</div>
    <button onclick={add} data-el-action-1>Add</button>
    <button onclick={toggleShowing} data-el-action-2>Toggle Showing</button>
    </section>
  
    <section data-el-operation-4 data-el-text-5>
      {{_color}}
    </section>
  
  
  
    <!-- @if(isShowing){ -->
    <section data-el-operation-1>
      <h1>is Showing alright</h1>
      </section>
    <!-- }else{ -->
    <section data-el-operation-2>
        
        <h1>Is hidden</h1>
  
    </section>
  
    <!-- } -->
  </div>  
    `,
  });
  
  // Define custom element
  // customElements.define( PreCompile.selector,PreCompile.component);
  
  const component = document.createElement(PreCompile.selector);
  const component2 = document.createElement(PreCompile.selector);
  document.body.appendChild(component);
  document.body.appendChild(component2);
  console.log({ component, component2 });
  