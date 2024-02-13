import { Component } from "../../elements/component2";
import Template from './template.html';
import data from './data'

export class LoopComponent extends Component {
  static config = {
    selector: "my-loop",
    template: Template,
    styles: `
    .loop-section-container {
      padding: 1rem;
      border-radius: 0.75rem;
      border-width: 1px;
      max-width: 680px;
      margin: 1em auto;
    }
    .input-btn-inline {
      display: flex;
      margin-bottom: 0.5rem;
      margin-top: 1rem;
      gap: 0.5rem;
    } 
    
    .input-btn-inline .input {
      flex: 1 1 0%;
    }
    
    .loop-list-margin-y {
      margin-top: 0.5rem;
      margin-bottom: 0.5rem;
    }
    
    `,
  };

  props = data;
  list = data.list;
  object = data.object;
  color = data.color;
  colors = data.colors;

  constructor() {
    super();
    console.log("add", this);
  }
  add() {
    this.list.push(Math.random()*100);
  }

  addToInnerList(index) {
    this.object.objectList[index].innerList.push(Math.random() * 10);

  }
  addObject() {
    this.object.objectList.push({
      a: "a",
      b: "b",
      c: "c",
      id: Math.random() * 10,
      innerList: [1, 2, 3, 4],
    });
  }

  /*
  addSublevel(sublevel){
    console.log(this,sublevel)
    this.levels[0].sublevels[0].levels.push({title:"xxx"})
  }
  removeSublevel(){
    console.log(this)
    this.levels[0].sublevels[0].levels.pop()
  }
  */
}

LoopComponent.register(LoopComponent);
