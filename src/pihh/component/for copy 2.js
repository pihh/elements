import { TheComponent } from ".";
import { Component } from "../compiler";
import TemplateCompiler from "../compiler/template";

const config = {
  selector: "the-loop",
  template: `
  <!-- The Loop placeholder -->
 <slot ></slot>
`,
};

class TheLoop extends TheComponent {
  constructor() {
    super();

  }
  
  key="_data"
  
  data = [{
    name: "The loop data",
    description: "The loop description"
  }]

  static get observedAttributes() {
    return ["data","data.length","_data", "key"];
  }

  attributeChangedCallback(name,oldValue,newValue) {
    
    if(name == "data" && newValue && typeof newValue == "string"){
      try{
        this.data = JSON.parse(newValue);
      }catch(ex){
        this.data = newValue.split(',')
        console.log(typeof newValue,newValue,typeof this.data);
      }
    }else if(name =="key" && newValue){
      this.key = newValue
  
    
    }
    
  }


  connectedCallback(){
    super.connectedCallback();
    if(!this.$placeholder){
      // console.log({slot:     });
      const slot = this.__shadow__.querySelector('slot')
      
      // slot.addEventListener("slotchange", (event) => {console.log(event,slot)});
      // // debugger;
      this.$placeholder = this.__shadow__.childNodes[0];
       this.$template = document.createElement('template');
       this.$template.content.appendChild(document.createElement('div'));
       for(let a of slot.assignedElements()){
         this.$template.content.firstElementChild.appendChild(a)
       }
       this.$placeholder.stack = []
  
       this.render()
    }
  }

  generate(i){
    // Create a new object 
    if(this.$placeholder.stack[i])return;
    let template = this.$template.cloneNode(true);

    let configuration = {}
    
    let { input, output, connectors } = TemplateCompiler(
      template.innerHTML.replaceAll(this.key,"data["+i+"]"),
      ["index","data"]
    );
    configuration.template = output;
    configuration.connectors = connectors;
    configuration.props = {data:[],index:i}

    template.content.replaceChildren(document.createElement('div'));
    template.content.firstElementChild.innerHTML = configuration.template;
    // debugger;
    // Connect reactivity
    this.__shadow__.appendChild(template.content)
  
    let elements = [];
    const scope = this.__scope__
    scope._data = this.data[i]
    for(let key of Object.keys(configuration.connectors['data-el-attribute'])){

      configuration.connectors['data-el-attribute'][key].props =configuration.connectors['data-el-attribute'][key].props.map(el => {
        if(el.split('.')[0] == this.key ){
          el = el.replaceAll(this.key,"data["+i+"]")
        }
        return el
      })
    }
    // console.log(template.content,this.__shadow__,configuration.connectors)
    elements = [
      ...this.__shadow__.querySelectorAll("[data-el-attribute]"),
    ];
    
    for (let element of elements) {
      const identifiers = element.dataset.elAttribute
        .split(",")
        .map((el) => el.trim());
      // console.log(identifiers, element, configuration.connectors);
      for (let identifier of identifiers) {
     
        configuration.connectors["data-el-attribute"][
          identifier
        ].connect(this, element);
      }
      delete element.dataset.elAttribute;
    }

    elements = [...this.__shadow__.querySelectorAll("[data-el-text]")];
    for(let key of Object.keys(configuration.connectors['data-el-text'])){

      configuration.connectors['data-el-text'][key].props =configuration.connectors['data-el-text'][key].props.map(el => {
        if(el.split('.')[0] == this.key ){
          el = el.replaceAll(this.key,"data["+i+"]")
        }
        return el
      })
    }
    for (let element of elements) {
      const identifiers = element.dataset.elText
        .split(",")
        .map((el) => el.trim());
      for (let identifier of identifiers) {
        try {
          // console.log('identifier: ' + identifier)
          configuration.connectors["data-el-text"][identifier].connect(
            this,
            element
          );
        } catch (ex) {
          console.log(configuration.connectors["data-el-text"],identifier)
          console.log(ex);
        }
      }
      delete element.dataset.elText;
    }

    // Connect actions
    elements = [
      ...this.__shadow__.querySelectorAll("[data-el-action]"),
    ];
    for (let element of elements) {
      const identifiers = element.dataset.elAction
        .split(",")
        .map((el) => el.trim());
      for (let identifier of identifiers) {
        configuration.connectors["data-el-action"][identifier].setup(
          this,
          element
        );
      }
      delete element.dataset.elAction;
    }
   
   this.$placeholder.stack[i] = template.content
  }

  render(){
    console.log(this.key)
    for(let i = 0 ; i < this.data.length; i++) {
      this.generate(i)
    }
  }
}

Component(TheLoop, config);


class ForLoop extends HTMLElement {
    static observedAttributes = ["fruits","len"]
    ul = document.createElement('ul');
    fruits = ['Apple','Banana','Strawberry','Ananas','Cherry'];
    len = 5;
    constructor() {
      super().attachShadow({mode: 'open'}).append(this.ul);
    }
  
    connectedCallback() {
      this.render();
    }
  
    render() {
      while (this.ul.firstChild) this.ul.firstChild.remove();
      this.ul.append(...this.fruits.map(fruit => {
        const li = document.createElement('li');
        li.textContent = fruit;
        li.appendChild(document.createElement('the-for'))
        return li;
      }));
    }

    attributeChangedCallback(name,oldValue,newValue) {
        let n = Number(newValue)
        if(n !== this.fruits.length) {
            if(n > this.fruits.length){
                while(this.fruits.length < n){
                    this.fruits.push('fruit '+ this.fruits.length)
                }
            }else{
                this.fruits = this.fruits.slice(0,n)
            }
        }
        this.render()
    }
  }


  class TheFor extends HTMLElement {
    static observedAttributes = ["fruits","len"]
    ul = document.createElement('ul');
    fruits = ['A','B','C'];
    len = 3
    
    constructor() {
      super().attachShadow({mode: 'open'}).append(this.ul);
    }
  
    connectedCallback() {
      this.render();
    }
  
    render() {
      while (this.ul.firstChild) this.ul.firstChild.remove();
      this.ul.append(...this.fruits.map(fruit => {
        const li = document.createElement('li');
        li.textContent = fruit;
        return li;
      }));
    }

    attributeChangedCallback(name,oldValue,newValue) {
        let n = Number(newValue)
        if(n !== this.fruits.length) {
            if(n > this.fruits.length){
                while(this.fruits.length < n){
                    this.fruits.push('fruit '+ this.fruits.length)
                }
            }else{
                this.fruits = this.fruits.slice(0,n)
            }
        }
        this.render()
    }
  }
  


  customElements.define("the-for", TheFor);
  customElements.define("for-loop", ForLoop);