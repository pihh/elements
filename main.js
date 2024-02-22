import { Component } from "./src/lib/compile/component";
import { Prop } from "./src/lib/compile/component/prop";

@Component({
  selector: "the-browser",
  template: {
    url: "/the-browser/template.html",
  },
})
class TheBrowser extends HTMLElement {
  constructor() {
    super();
  }
  @Prop() name = "world";
  @Prop() description = "default value";
  @Prop() textBinding = "text binding";
  @Prop() booleanBinding = false;
  @Prop() counter = 0;
  @Prop() item = "xxx";
  @Prop() color = "red";
  @Prop() url = "https://pihh.com";
  @Prop() counterUpdating = false;
  @Prop() colors = ["white", "red", "blue"];
  @Prop() onCounterUpdateTimeout = false;

  
  onCounterUpdate() {
    if (!this.counterUpdating) {
      this.counterUpdating = true;
    }
    clearTimeout(this.onCounterUpdateTimeout);
    this.onCounterUpdateTimeout = setTimeout(() => {
      this.counterUpdating = false;
    }, 1000);
  }

  incrementCounter() {
    this.counter++;
    this.onCounterUpdate();
  }
  
  onClick() {
    console.log("on Click");
    this.counter--;
  }
  
  decrementCounter() {
    this.counter--;
    this.onCounterUpdate();
  }
}

/*
import { Template } from "./src/lib/compile/template";

const props = {
  name: "world",
  description: "default value",
  textBinding: "text bindinf",
  counter: 1,
  item: "xxx",
  color: "red",
  counterUpdating: false,
  colors: ["white", "red", "blue"],
};
const selector = "[template=the-browser]";
const template = document
  .querySelector(selector)
  .content.firstElementChild.firstElementChild.cloneNode(true);
document.head.appendChild(template);
const TheTemplate = new Template(selector, props, template);
class TheBrowser extends HTMLElement {
  props = {
    name: "world",
    description: "default value",
    textBinding: "text bindinf",
    counter: 1,
    item: "xxx",
    color: "red",
    counterUpdating: false,
    colors: ["white", "red", "blue"],
  };
  selector = "[template=the-browser]";
  constructor() {
    super();
  }

  // connect component
  connectedCallback() {
    const shadow = this.attachShadow({ mode: "open" });
    this.template = TheTemplate.clone(this.props, shadow);
    // this.template.bindMethods(this.template,this)
    this.template.onClick = this.onClick.bind(this);
    this.template.onCounterUpdate = this.onCounterUpdate.bind(this);
    this.template.incrementCounter = this.incrementCounter.bind(this);
    this.template.decrementCounter = this.decrementCounter.bind(this);

    // console.log(this.template);
  }

  onCounterUpdateTimeout = null;
  onCounterUpdate() {
    if (!this.template.counterUpdating) {
      this.template.counterUpdating = true;
    }
    clearTimeout(this.onCounterUpdateTimeout);
    this.onCounterUpdateTimeout = setTimeout(() => {
      this.template.counterUpdating = false;
    }, 1000);
  }
  incrementCounter() {
    this.template.counter++;
    this.template.onCounterUpdate();
  }
  onClick() {
    console.log("on Click");
    this.template.counter--;
  }
  decrementCounter() {
    this.template.counter--;
    this.template.onCounterUpdate();
  }
}

customElements.define("the-browser", TheBrowser);

*/
/** 
var HelloTemplate = new Template("[template=the-header]", {
  name: "world",
  description: "default value",
  textBinding: "text bindinf",
  counter: 1,
  item: "xxx",
  color: "red",
  counterUpdating: false,
  colors: ["white", "red", "blue"],
});
var OtherTemplate = new Template("[template=the-other]", {
  name: "world",
  description: "default value",
  textBinding: "text bindinf",
  counter: 2,
  item: "xxx",
  counterUpdating: false,
  url: "https://pihh.com"
});
var XTemplate = new Template("[template=the-x]", {
  name: "world",
  description: "default value",
  textBinding: "text bindinf",
  counter: 0,
  item: "xxx",
  counterUpdating: false,
});

let t1 = HelloTemplate.clone({
  name: "xxxx",
  description: "Lorem Ipsum is Lorem Ipsum and    Lorem Ipsum is Lore",
});
t1.onCounterUpdateTimeout = null;
t1.onCounterUpdate = function(){
  
  if(!t1.counterUpdating){
    t1.counterUpdating = true;
  }
  clearTimeout(t1.onCounterUpdateTimeout);
  t1.onCounterUpdateTimeout = setTimeout(()=>{
    t1.counterUpdating = false;
  },1000)
  
}
t1.incrementCounter = function(){
  t1.counter++
  t1.onCounterUpdate()
}
t1.onClick = function(){
  console.log('on Click');
  t1.counter--
}
t1.decrementCounter = function(){
  this.counter--
  t1.onCounterUpdate()
}
let t2 = XTemplate.clone({
  name: "xxxx",
  description: "Lorem Ipsum is Lorem Ipsum and    Lorem Ipsum is Lore",
});

let t3 = OtherTemplate.clone(
  {
    name: "World",
  },
  document.querySelector(".t4")
);

// let t4 =HelloTemplate.clone(
//     {
//         name: "xxxx",
//         description: "Lorem Ipsum is Lorem Ipsum and    Lorem Ipsum is Lore"
//     },document.querySelector('.t4')

//     )

const buttons = [...document.querySelectorAll(".btn")];
let i = -1;
for (let t of [t1, t2, t3]) {
  i++;

  buttons[i].addEventListener("click", function () {
    t.name = "Pihh ";

    console.log(t.name);
    t.counter = Number(t.counter) + parseInt(Math.random() * 100);
  });
}


*/
