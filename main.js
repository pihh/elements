//  import { RequirementsComponent } from "./src/components/requirements";

import { State } from "./src/elements/compiler/state";
import { parseTemplatePointers } from "./src/elements/component/template/analyser/cleanup";
import { reactivityMap } from "./src/elements/component/template/analyser/map";
import { initialExpressionCleanup } from "./src/elements/helpers/regex";

class Registry {
    static instance;
    static templates = {}
    constructor(){
        if(Registry.instance) return Registry.instance;
        Registry.instance = this;
    }

    static parse(name,template,observedAttributes,id){
        if(this.templates.hasOwnProperty(name)){
            return this.templates[name].content.cloneNode(true);
        }
      
        template  = initialExpressionCleanup(template);
        console.log(observedAttributes);
        template = parseTemplatePointers(template,observedAttributes)
   
     
        const $tpl = document.createElement('template');
        let $content = document.createElement('div');
        $content.innerHTML = template;
        // $tpl.id = id;
        // $tpl.innerHTML = this.templates[name];
        document.querySelector('#'+id).replaceWith($tpl);
        $tpl.setAttribute('id',id);
        $tpl.content.appendChild($content)

        this.templates[name] =$tpl
        // console.log()
        return this.templates[name].content.cloneNode(true);
    }

    static load(name){
        try{
            console.log( this.templates)
            // debugger;
            return this.templates[name].content.cloneNode(true);
        }catch(ex){
            return false;
        }
    }
}


class MyWebComponent extends HTMLElement {
  static observedAttributes = ["variant", ,"text","object","list","objectList","color","colors"];

  __setup = {
    templateConnected: false,
    propTracked:false
  };

  constructor() {
    super();
    if(!Registry.load('my-button')){
        document
        .getElementById("my-button-template")
        .content.innerHTML = Registry.parse('my-button',document
        .getElementById("my-button-template"),MyWebComponent.observedAttributes,"my-button-template")

    }
    const template = Registry.load('my-button')
    console.log(template)
    //   .getElementById("my-button-template")
    //   .content.cloneNode(true);
    const shadowRoot = this.attachShadow({ mode: "open" });
    this.reactiveProps = reactivityMap(template);

    const { scope, connect, render, pubsub } = State({
      text: "text property",
      object: {
        key: "object value",
      },
      list: ["list id: 0"],
      objectList: [
        {
          item: "object list item id: 0",
        },
      ],
      color: "yellow",
      colors: ["green","red","yellow"]
    });
    this.scope = scope;
    this.connect = connect;

    shadowRoot.appendChild(template);
  }

  connectTemplate() {
    if (this.__setup.templateConnected) return;
    const connections = this.reactiveProps.map;

    for (let key of Object.keys(connections)) {
      const connection = connections[key];
      for (let conn of connection) {
        conn.setup(this);
      }
    }
    this.__setup.templateConnected = true;
  }
  connectedCallback() {
      this.connectTemplate();
      this.render();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    // console.log("xxxxx", { name, oldValue, newValue });
    // this.render();
  }

  render() {
    // console.log("render");
    // let list = this.getAttribute("list") || "[1,2,3,4,5,6]";
    // list = JSON.parse(list);
    // console.log(list);
    // const variant = this.getAttribute("variant") || "";
    // this.shadowRoot.querySelector("button").className = variant;
  }
}

customElements.define("my-button", MyWebComponent);
