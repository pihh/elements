import { ElComponent , Component} from "./src/elements/component";


@Component({
  selector: "el-web-component",
})
class MyWebComponent extends ElComponent {
  static selector = "el-web-component";
  constructor() {
    super();
  }
  checked = true;
  checkedd = true;
  
  text = "text property";
  object = {
    key: "object value",
    title: "Title"
  };
  list = ["list id: 0"];
  objectList = [
    {
      item: "object list item id: 0",
    },
  ];
  color = "yellow";
  colors = ["green", "red", "yellow"];
  items = ["item 1", "item 2"];


  // card = {
  //   title: "Card title",
  //   description: "Lorem Ipsum dolor sit amet, consect id, ullamcorper lorem",
  // }
  cards = [
    // "Card title 1",
    // "Card title 2",
     {title: "Card 1 ", description: "Card 1 description",list: ['list 1','list 2']},
    //  {title: "Card 2 ", description: "Card 2 description"},
    //  {title: "Card 3 ", description: "Card 3 description"},
    
  ]

  onClick(){
    this.items.push("item "+this.items.length)
  }

}

// customElements.define("el-web-component", MyWebComponent);

/*
import { Registry } from "./src/elements/kernel/registry";
import { State } from "./src/elements/compiler/state";
import { connectTemplate } from "./src/elements/component/reactivity/connector";
import { reactivityMap } from "./src/elements/component/template/analyser/map";
import { addGlobalStylesToShadowRoot } from "./src/elements/component/template/styles";

class MyWebComponent extends HTMLElement {
  __setup = {
    templateConnected: false,
    propTracked: false,
  };

  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: "open" });
    this.__shadowRoot = shadowRoot;
    addGlobalStylesToShadowRoot(this.__shadowRoot);
  }
  checked = true;
  checked2 = false;
  
  text = "text property";
  object = {
    key: "object value",
    title: "Title"
  };
  list = ["list id: 0"];
  objectList = [
    {
      item: "object list item id: 0",
    },
  ];
  color = "yellow";
  colors = ["green", "red", "yellow"];
  items = ["item 1", "item 2"];


  card = {
    title: "Card title",
    description: "Lorem Ipsum dolor sit amet, consect id, ullamcorper lorem",
  }
  cards = [
    {title: "Card 1 ", description: "Card 1 description"},
    {title: "Card 2 ", description: "Card 2 description"},
    {title: "Card 3 ", description: "Card 3 description"},
    {title: "Card 4 ", description: "Card 4 description"},
    {title: "Card 5 ", description: "Card 5 description"},
  ]
  connectScope() {
    const _scope = {};
    this.__props = Object.getOwnPropertyNames(this).filter(
      (el) => el.indexOf("_") != 0 && typeof el !=="function"
    );
    this.__props.forEach((key) => {
      _scope[key] = this.getAttribute(key) || this[key];
      this.setAttribute(key, _scope[key]);
    });
 
    const { scope, connect, render, pubsub } = State(_scope);
    this.scope = scope;
    this.connect = connect;

    for(let key of Object.keys(this.scope)){
      this.__defineGetter__(key, function(){
        return this.scope[key]
      })
   
    }
  }

  async connectTemplate() {
    this.__template = await Registry.template("my-button", this.__props);
    this.__shadowRoot.appendChild(this.__template);
    const {props,actions,operations} = reactivityMap(this.__template);
    this.reactiveProps = props;
    this.actions = actions;
    this.operations = operations;
    connectTemplate(this);
  }
  async connectedCallback() {
    if (!this.__didConnect) {
      this.__didConnect = true;
      this.connectScope();
      await this.connectTemplate();
      this.operations.onDidConnect()
    }

    this.render();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    console.log("attributeChangedCallback", name, oldValue, newValue);

  }

  render() {
  }

  fn($event,$index,text,str,num){
    console.log('FN CALLED',{$event,$index,text,str,num})
  }

  addColor(){

    this.colors.push('new-color')
  }

  customFn(){
    console.log('Custom FN CALLED')
  }
}

customElements.define("my-button", MyWebComponent);

*/
