import { TheBaseComponent, TheComponent } from ".";
import { Component } from "../compiler";

// <the-inner data-el-attribute="1" data-el-action="4"></the-inner>
const config = {
    selector: "the-demo",
    template:`<style>
            h1 {
              font-weight: 800;
              font-size: 1.75rem;
              letter-spacing: -1px;
              line-height: 2rem;
          }</style>
              <div data-el-attribute="0">
              <!-- comment -->
                  <header>
                      <h1 data-el-text="0">{{this.title}}</h1>
                      <p data-el-text="1">{{this.obj.description}}</p>
                      <p data-el-text="2">{{this.items[0].name}}</p>
                      <small data-el-text="3"><b>Counter:</b> {{this.counter}}</small>
                  </header>
                  <main>
                      <select model="color" class="input">
                          <option data-el-operation="0"></option>
                      </select>
                      <ul>
                         <option data-el-operation="1" ></option>
                      </ul>
                      
                      <slot></slot>
                  </main>
                  <footer>
                          <section>
                              <h5>Update items</h5>
                              <div class="">
                                  <button class="btn" >x2</button>
                                  <button class="btn" data-el-action="1">+</button>
                                  <button class="btn" onclick={this.removeItem}>-</button>
                              </div>
                          </section>
                          <section>
                          <h5>Update counter</h5>
                          <div class="">
                              <button class="btn" data-el-action="2">+</button>
                              <button class="btn" data-el-action="3">-</button>
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
    counter = 0;
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
      // console.log({event,counter,str,num,bool}) // Passa tudo ya
      // console.log({event,counter:this.counter});
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