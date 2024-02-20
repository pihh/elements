import {  TheComponent } from ".";
import { Component } from "../compiler";

// @if(show){ 
//   <h3> IF/ELSEIF/ELSE CONDITIONAL RENDERING </h3>
// }@elseif(color=='green'){
//   <h4>ELSE IF MET</h4>
// }@else{
//   <h5>All conditions fail
// }
const config = {
    selector: "the-demo",
    template: `<div class="component bg-{{color}}-900">
    <header>
       
        @if(show == false){ 
          <h3> It is suposedly hidden </h3>
        }
        @if(show){
          <h1> It shows </h1>
          <h1>{{title}}</h1>
          <p>{{obj.description}}</p>
          <p>{{items[0].name}}</p>
          <p>{{counter}}</p>
        }
        <button onclick={toggleShow}>Toggle</button>
    </header>
    <main>
    @if(show){ 
      <h3> IF/ELSE CONDITIONAL RENDERING </h3>
    }@else{
      <h3>ELSE CONDITIONS</h3>
    }


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
        <the-child 
          title="{{title}}" 
          @propagate={onInnerTextListen()}
          @update={onChildUpdate()}>
        </the-child>
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
  
    show = true;
    // Methods
    onClickItem() {
      console.log('onClickItem',...arguments);
      console.log(this.items);
    }
    addItem() {
      console.log('addItem',...arguments);
      this.items.push({ name: "Item " + this.items.length });
    }
    removeItem() {
      console.log('removeItem',...arguments);
      this.items.pop();
    }
    increment(event,counter,str,num,bool) {
      console.log('increment',...arguments);
    
      this.counter++;
    }
    decrement() {
      console.log('decrement',...arguments);
      this.counter--;
    }
  
    onInnerTextListen($event){
      console.log('onInnerTextListen',...arguments);
      $event.detail.reference.counter = this.counter;
      this.counter = $event.detail.data.counter;
    }
    onChildUpdate($event){
      console.log('onChildUpdate',...arguments);
      $event.detail.reference.counter = this.counter;
      this.counter += $event.detail.data.counter;
    }

    toggleShow(){
      this.show = !this.show;
    }
  }
  


Component(TheDemoComponent,config)