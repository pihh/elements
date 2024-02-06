import './style.css';
import Template from './template.html';
import { Component } from "../../elements/component";

export class ExampleComponent extends Component {
  static config = {
    selector: "el-example",
    template: Template,
    styles: "",
  };
  constructor(){
    super()
  } 

  props = {
    dataBinding: "Sample data binding",
    condition: true,
    counter: 0, 
    color: "blue",
    colors: [
      "red", 
      "white",
      "green",
      "blue", 
      "indigo", 
      "purple", 
      "yellow",
      "orange",
    ], 
    posts: [
      {id: 1 ,title:"Sample post 1", images:[1,2,3]}, 
      {id: 2 ,title:"Sample post 2", images:[1,2,3]},
      {id: 3 ,title:"Sample post 3", images:[1,2,3]},
      {id: 4 ,title:"Sample post 4", images:[1,2,3]},
    ]
  }

  addPost(){
    this.posts.push({id:'x',title: "XXXXXXX", images:[1,2,3]})
  }
 
  increment(){
    this.counter++
  }

  decrement(){
    this.counter--
  }

 
}
 

ExampleComponent.register(ExampleComponent);
