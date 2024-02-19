import { ElBtn } from "./src/components/btn";
import { ElCard } from "./src/components/card";
import { ElDemo } from "./src/components/demo";
import { ElInput } from "./src/components/input";
import { ElLayout } from "./src/components/layout";
import { ElText } from "./src/components/text";
import BaseComponent from "./src/elements/component";
import {
  findActions,
  getStrBetweenStack,
} from "./src/elements/helpers/expression/get-string-between";
import { getStrBetween } from "./src/elements/helpers/regex";

const template = `
<div class="component bg-{{color}}-900">
    <header>
        <h1>{{title}}</h1>
        <p>{{description}}</p>
        <small><b>Counter:</b> {{counter}}</small>
    </header>
    <main>
        <select model="color" class="input">
            @for(let _color of colors){
                <option value="_color">_color</option>
            }
        </select>
        <ul>
            @for(let item of items){
                <li onClick={onClickItem(e)}>
                {{item.name}}
            </li>
            }
        </ul>

    </main>
    <footer>
            <section>
                <h5>Update items</h5>
                <div class="">
                    <button class="btn" onClick={addItem}>+</button>
                    <button class="btn" onClick={removeItem}>-</button>
                </div>
            </section>
            <section>
            <h5>Update counter</h5>
            <div class="">
                <button class="btn" onClick={increment}>+</button>
                <button class="btn" onClick={decrement}>-</button>
            </div>
        </section>
    </footer>
</div>`;

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

class TheDemoComponent extends BaseComponent {
  constructor() {
    super();
    
  }
  // Scope
  title = "TheDemoComponent Title";
  description = "TheDemoComponent Description";
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
    console.log(this.items);
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

// Compile phase
const ComponentRegistry = {};
function Component(component, config) {
  const selector = config.selector;

  // Compile and store
  if (!customElements.get(selector)) {
    // Create initial component
    const configuration = {
      actions: {},
      reactivity: {},
      operations: {},
      props: {}
    };
    const _component = new component();

    // Get it's tracked properties
    let parseObject = function(data){
      try{
        return JSON.parse(data);
      }catch(ex){
        return data
      }
    }
    let parseBoolean = function(data){
      return ["true",true].indexOf(data)>-1 ? true : false;
    }
    let parseNumber = function(data){
      let d = Number(data);
      return !isNaN(d) ? d : data
    }
    const props = Object.getOwnPropertyNames(_component).forEach(prop => {
      let key= prop;
      let type= typeof _component[key];
      let defaultValue=_component[key];
      console.log(key)
      configuration.props[key] = {
        key,
        type,
        defaultValue,
        reactivity: [],
        setup(instance){
          instance[key] = instance.getAttribute(key) || instance[key] || defaultValue;
          if(type == "string"){
            instance[key] = instance[key] || "" 
          }else if(type == "object"){
            instance[key] = parseObject(instance[key])
          }else if(type == "number"){
            instance[key] = parseNumber(instance[key])
          }else if(type == "boolean"){
            instance[key] = parseBoolean(instance[key])
          }
        }
      }
    });

    // Get it's actions
    const actions = Object.getOwnPropertyNames(
      Object.getPrototypeOf(_component)
    ).filter((el) => ["constructor"].indexOf(el) == -1);

    // Compile it's template
    // This should be way more well done
    // @TODO

    let parsedTemplate = template;
      
    let len = parsedTemplate.length +1;
    while(len > parsedTemplate.length){
        len = parsedTemplate.length;
       parsedTemplate = parsedTemplate.replaceAll("\n", "")
      .trim()
      .replaceAll("  ", " ")
      .replaceAll("{ ","{").replaceAll(" }","}")
    }
    // Remove whitespace
    let whiteSpaceMatches = getStrBetween(parsedTemplate, ">", "<");
    for (let match of whiteSpaceMatches) {
      parsedTemplate = parsedTemplate.replaceAll(
        ">" + match + "<",
        ">" + match.trim() + "<"
      );
    }

    let matchedAttributes = getStrBetween(parsedTemplate);
    for (let attr of matchedAttributes) {
      parsedTemplate = parsedTemplate.replaceAll(
        "{{" + attr + "}}",
        "${this." + attr.trim() + "}"
      );
    }

    let matchedActions = findActions(selector, parsedTemplate);

    parsedTemplate = matchedActions.parsedTemplate;
    matchedActions = matchedActions.matches;
    for (let match of matchedActions) {
      let action = match.action.toLowerCase();
      let callback = match.callback;
      const randomUUid = match.uuid;
      configuration.actions[randomUUid] = {
        action: action,
        callback: callback,
        dataset: {
          selector: "data-action",
          uuid: match.uuid,
          expression: match.datasetSelector,
          query: `[${match.datasetSelector}]`,
          callback,
        },

        callback: function (instance, e) {
          const fn = Function("return `${" + callback + "}`;");
          fn.call(instance, e);
        },
        setup(instance, node) {
            console.log({node,self:this})
          if (!node["action_" + match.uuid]) {
            node["action_" + match.uuid] = true;
            const cb = this.callback;
            this.callback = function () {
              cb(instance, ...arguments);
            };
            node.addEventListener(action.replace("on", ""), this.callback);
            // delete node.dataset.action;
          }
        },
      };
    }

 

    // Map it's template reactivity to a JSON object with functions and selectors
    //let instance = BaseComponent.prototype.createInstance()



    let div = document.createElement("div");
    document.head.appendChild(div);
    div.innerHTML = parsedTemplate 

    for (let el of [...div.querySelectorAll("*")]) {
      for (let node of [...el.childNodes]) {
        if (node.nodeType === 3) {
          const query = node.textContent;
          if (query.indexOf("${") > -1) {
            let parent = node.parentElement;
            let nodeIndex = 0;
            parent.childNodes.forEach((n,i)=>{
                if(n == node){
                    nodeIndex = i
                }
            })
       
            if (!parent.dataset?.elText) {
                parent.dataset.elText = "[]";
            }
            let pointer =
              selector + "-text-" + Date.now() + parseInt(Math.random() * 1000);
            let ds = JSON.parse(parent.dataset.elText);
            ds.push(pointer);
            parent.dataset.elText = JSON.stringify(ds);
            
            configuration.reactivity[pointer] = configuration.reactivity.pointer || [];
            configuration.reactivity[pointer].push({
              type: "text",
              pointer,
              query,
              nodeIndex:nodeIndex ,
              keys: [],
              callback: function () {},
              setup: function () {},
              //props: el.getAttribute.split('this.').map(el => el.split(' ').map(ell => ell.trim().filter(elll => elll.length > 0).map(ell =>))).map(el => el.trim()).filter(el => el.)
            });
          }
        }
      }
      for (let attr of el.getAttributeNames()) {
        const query = el.getAttribute(attr);
        if (query.indexOf("${") > -1) {
          if (!el.dataset.elAttributes) {
            el.dataset.elAttributes = "[]";
          }
          let pointer =
            selector + "-attribute-" + Date.now() + parseInt(Math.random() * 1000);
          let ds = JSON.parse(el.dataset.elAttributes);
          ds.push(pointer);
          el.dataset.elAttributes = JSON.stringify(ds);
          configuration.reactivity[pointer] = configuration.reactivity.pointer || [];
          configuration.reactivity[pointer].push({
            pointer,
            type: "attribute",
            attribute:attr,
            query,
            callback: function () {},
            setup: function () {},
            //props: el.getAttribute.split('this.').map(el => el.split(' ').map(ell => ell.trim().filter(elll => elll.length > 0).map(ell =>))).map(el => el.trim()).filter(el => el.)
          });
        }
      }
    }



    parsedTemplate = div.innerHTML;
    div.remove();


    function setup(instance) {
        const shadow = instance.attachShadow({ mode: "closed" });
        instance.shadow = shadow;
        instance.shadow.innerHTML = parsedTemplate;
      }
      function connect(instance) {
        console.log({instance})
        for(let key of Object.keys(configuration.props)){
          let prop = configuration.props[key];
          prop.setup(instance) //instance.getAttribute(prop) || _component[prop] 
        }
        const attrElements = [...instance.shadow.querySelectorAll("[data-el-attributes]")]
        attrElements.forEach(el =>{
            let keys = JSON.parse(el.dataset.elAttributes) || [];
            
            for(let key of keys) {
                for(let conf of configuration.reactivity[key]){
                    let attr = conf.attribute
                    let replace = Function ("return `" + conf.query + "`");
                    replace = replace.call(instance);
                    el.setAttribute(attr, replace);
                }
            }
            delete el.dataset.elAttributes 
        })
       const textElements = [...instance.shadow.querySelectorAll("[data-el-text]")].map(el =>{
            let keys = JSON.parse(el.dataset.elText) || [];
            for(let key of keys) {
                for(let conf of configuration.reactivity[key]){
                    try{

                        let node = [...el.childNodes][conf.nodeIndex]//.textContent
                        
                        let replace = Function ("return `" + conf.query + "`");
                        replace = replace.call(instance);
                        node.textContent = replace
                    }catch(ex){
                        console.warn(ex);
                    }
                }
                
            }
            delete el.dataset.elText
        })
  
        try {
          for (let key of Object.keys(configuration.actions)) {
            let action = configuration.actions[key];
      
            let el = instance.shadow.querySelector('[data-el-action="'+key+'"]');
            action.setup(instance, el);
            //    delete el.dataset.action;
          }
        } catch (ex) {
          console.log(ex);
        }
      }
      
    function clone(obj, base) {
      const fn = Function(
        `${base};` +
          "return " +
          "class " +
          obj.constructor.name +
          "Built extends TheBaseComponent {constructor(){super();this.__init__()} __init__(){}}"
      );
      return fn.call({ obj, base });
    }
    let element = clone(_component, TheBaseComponent);
    // for(let prop of props){
    element.prototype.observedAttributes = props;
    element.prototype.__init__ = function () {
      setup(this);
      console.log('setup',this,element);
      // element.
    };
    element.prototype.render = function () {
      // this.__init();
      try {
        connect(this);
      } catch (ex) {
        console.log(ex, this);
      }
    };
    element.prototype.connectedCallback = function () {
      this.render();
      connect(this);
    };

    console.log({ selector, element });
    //Object.assign(Object.create(Object.getPrototypeOf(component)), component)

    customElements.define(selector, element);
    ComponentRegistry[selector] = {
      element: element,
      configuration: configuration,
      template: parsedTemplate,
      setup: setup,
    };
  }
  // console.clear()
  console.log(ComponentRegistry[selector])
  // debugger;
  return ComponentRegistry[selector];
}

export default Component(TheDemoComponent, { selector: "the-demo" });
