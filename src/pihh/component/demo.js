import {  TheComponent } from ".";
import { Component } from "../compiler";

// 
const config = {
    selector: "the-demo",
    template: `<div class="component bg-{{color}}-900">
    <header>
        <h1>{{title}}</h1>
        <p>{{obj.description}}</p>
        <p>{{items[0].name}}</p>
        <p>{{counter}}</p>
    </header>
    <main>
        <select model="color" class="input">
            @for(let _color of colors){
                <option value="_color">_color</option>
            }
        </select>
        <ul>
            @for(let item of items; let $index = index){
                <li onclick={onClickItem(e)}>
                {{item.name}}
            </li>
            }
        </ul>
        <the-child  @propagate={onInnerTextListen()}></the-child>
    </main>
    <footer>
            <section>
                <h5>Update items</h5>
                <div class="">
                    <button class="btn" onclick={(event)=>{duplicate(event)}}>x2</button>
                    <button class="btn" onclick={addItem}>+</button>
                    <button class="btn" onclick={removeItem}>-</button>
                </div>
            </section>
            <section>
            <h5>Update counter</h5>
            <div class="">
                <button class="btn" onclick={increment($event,counter,'string',2,false)}>+</button>
                <button class="btn" onclick={decrement}>-</button>
            </div>
        </section>
    </footer>
</div>`
}
 
class TheDemoComponent extends TheComponent {
    constructor() {
      super();
    }
    // Scope
    title = "TheDemoComponent Title";
    description = "TheDemoComponent Description";
    obj = {description : "TheDemoComponent Description"};
    counter = 1;
    color = "green";
    colors = ["green", "red", "yellow", "blue"];
    items = [{ name: "Item 0" }];
  
    // Methods
    onClickItem() {
      console.log("onClick Item");
      console.log(this.items);
    }
    addItem() {
      this.items.push({ name: "Item " + this.items.length });
    }
    removeItem() {
      console.log(this.items);
      this.items.pop();
    }
    increment(event,counter,str,num,bool) {
    
      this.counter++;
    }
    decrement() {
      // console.log(this.items);
      this.counter--;
    }
  
    onInnerTextListen($event){
      // console.log('onInnerTextListen',$event);
      $event.detail.reference.counter = this.counter;
      this.counter = $event.detail.data.counter;
    }
  }
  


Component(TheDemoComponent,config)