import { Component } from "../../elements/component";
import Template from './template.html';
import data from './data'

export class BoilerplateComponent extends Component {
  static config = {
    selector: "my-component",
    template: Template,
    styles: `
    .section-container {   
      padding: 1rem;
      border-radius: 0.75rem;
      border-width: 1px; 
      max-width: 680px;
      margin: 1em auto;
    }

    select, .input{
        width: -webkit-fill-available;
    } 

    .conditional-container{
        border-radius: 0.75rem;
        padding: 1rem;
        margin: 0.25rem;
    }
    `, 
  };   
 
  props = data; 
  items = data.items; 
  title = data.title;
  color = data.color; 
  colors = data.colors; 
  condition = data.condition 
  counter = data.counter      
 
  constructor() {
    super();
  
  }
  add() {
    this.items.push(this.items.length+1);
  }

  increment(data) {
    console.log(...arguments,data);
    this.counter++
  }
  decrement() {
    this.counter--;
  }  
 
  toggle(){
    this.condition = !this.condition  
  } 

  onBroadcast($event){
    console.log('Broadcast',$event)
  }


}
BoilerplateComponent.register(BoilerplateComponent); 
