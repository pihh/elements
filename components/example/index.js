import { Component } from "../../elements/component";
import Template from './template.html';
export class ExampleComponent extends Component {
  static config = {
    selector: "my-example",
    template: Template,
    styles: ` 
    .example-section-container { 
      padding: 1rem;
      border-radius: 0.75rem;
      border-width: 1px;
      max-width: 680px; 
      margin: 1em auto;
    } 
    `,
  };
  
  props = {
    counter: 0,
    isOpen: false,
    text: "text input", 
    isOpen: false,
    isSwitchOn: true,
    color: "green",
    options: [
      "red",
      "white",
      "green",
      "blue",
      "indigo",
      "purple",
      "yellow",
      "orange",
    ],
    deepOptions: [
      { id: 0, title: "red", options: [1, 2] },
      { id: 1, title: "white", options: [1, 2] },
    ],
    posts: [{id:1,title:"post 1", photos:[{id:11,title:"photo 1",comments:[{id:1,user:'xxx',comment:"xxx"} ]}]}],
    deepTest: 1,
  };

  counter = 0;
  isOpen = false;
  text = "text input";
  isOpen = false;
  isSwitchOn = true;
  color = "green";
  options = [
    "red",
    "white",
    "green",
    "blue", 
    "indigo",
    "purple",
    "yellow",
    "orange",
  ]; 
  deepOptions = [
    { id: 0, title: "red", options: [1, 2] },
    { id: 1, title: "white", options: [1, 2] },
  ];
  posts = [{id:1,title:"post 1", photos:[{id:11,title:"photo 1",comments:[{id:1,user:'xxx',comment:"xxx"} ]}]}];
  deepTest = 1;
  constructor() {
    super();
  } 

  increment() {
    this.counter++; 
  }
 
  childComponentCallbackCalled() {
    console.log("childComponentCallbackCalled")
  } 
 
  decrement() {
    this.counter--;
  }

  onToggle() {
    this.isOpen = !this.isOpen;
  }

  addDeepOption() {
    let id = this.props.deepOptions.length;
    let option = {
      id: id,
      title: this.props.options[id],
      options: [1, 2, 3],
    };
    this.props.deepOptions.push(option);
  }
  removeDeepOption() {
    this.props.options.pop();
    this.props.deepOptions.pop();
  }
}

ExampleComponent.register(ExampleComponent);
