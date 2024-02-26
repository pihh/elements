import { TheBaseComponent, TheComponent } from ".";
import { Component } from "../compiler";

const config = {
  selector: "the-child",
  template: `
  <style>
  h1 {
    font-weight: 800;
    font-size: 1.75rem;
    letter-spacing: -1px;
    line-height: 2rem;
}</style>
            <h1 >{{title}} inner</h1>
            <small ><b>Counter:</b> {{counter}}</small>
            <input type="text" name="title" model="{{title}}" class="input"/>
            <button class="btn" onclick={propagate}>Propagate</button>
            <button class="btn" onclick={update}>Update</button>
            `,
  // props: {
  //   title: {
  //     defaultValue: "TheDemoComponent Title",
  //     type: "text",
  //   },
  //   counter: {
  //     defaultValue: 0,
  //     type: "number",
  //   },
  // },

  // connectors: {
  //   "data-el-operation": {},

  //   "data-el-action": {
  //     // onclick={addItem}
  //     // onclick={(event)=>{duplicate(event)}}
  //     0: {
  //       id: Symbol("action connection"),
  //       props: [],
  //       eventName: "click",
  //       value: "propagate",
  //       expression: "this.propagate",

  //       setup: function (instance, element) {
  //         if (!instance.__connections__.hasOwnProperty(this.id)) {
  //           instance.__connections__[this.id] = this.id;
  //           this.connect(instance, element);
  //         }
  //       },
  //       connect: function (instance, element) {
  //         const fn = Function("return `" + this.expression + "`");
  //         const action = instance[this.value];
  //         const callback = function (event) {
  //           action.call(instance, event);
  //         };
  //         element.addEventListener(this.eventName, callback);
  //       },
  //       unsubscribe: [],
  //     },
  //   },
  //   "data-el-text": {
  //     0: {
  //       id: Symbol("text connection"),
  //       props: ["title"],
  //       attribute: "textContent",
  //       value: "{{title}} inner",
  //       expression: "${this.title} inner",
  //       childNode: 0,
  //       setup: function (instance, element) {
  //         if (!instance.__connections__.hasOwnProperty(this.id)) {
  //           instance.__connections__[this.id] = this.id;
  //           this.connect(instance, element);
  //         }
  //       },
  //       connect: function (instance, element) {
  //         const node = [...element.childNodes][this.childNode];
  //         const fn = Function("return `" + this.expression + "`");
  //         const attribute = this.attribute;
  //         const expression = this.expression;
  //         const callback = function (value) {
  //           try {
  //             const output = fn.call(instance);
  //             node[attribute] = output;
  //           } catch (ex) {
  //             console.warn(ex);
  //           }
  //           // node.setAttribute(attribute, output);
  //         };

  //         for (let prop of this.props) {
  //           instance.__subscriptions__.push(instance.connect(prop, callback));
  //           // console.log({ instance, prop, callback });
  //         }

  //         callback();
  //       },
  //       unsubscribe: [],
  //     },
  //     1: {
  //       id: Symbol("text connection"),
  //       props: ["counter"],
  //       attribute: "textContent",
  //       value: "{{counter}} inner",
  //       expression: "${this.counter} inner",
  //       childNode: 1,
  //       setup: function (instance, element) {
  //         if (!instance.__connections__.hasOwnProperty(this.id)) {
  //           instance.__connections__[this.id] = this.id;
  //           this.connect(instance, element);
  //         }
  //       },
  //       connect: function (instance, element) {
  //         const node = [...element.childNodes][this.childNode];
  //         const fn = Function("return `" + this.expression + "`");
  //         const attribute = this.attribute;
  //         const expression = this.expression;

  //         const callback = function (value) {
  //           try {
  //             const output = fn.call(instance);
  //             node[attribute] = output;
  //           } catch (ex) {
  //             console.warn(ex);
  //           }
  //           // node.setAttribute(attribute, output);
  //         };

  //         for (let prop of this.props) {
  //           instance.__subscriptions__.push(instance.connect(prop, callback));
  //         }

  //         callback();
  //       },
  //       unsubscribe: [],
  //     },
  //   },
  //   "data-el-attribute": {},
  // },

  // actions: {
  //   // onClickItem: function() {
  //   //   console.log("onClick Item");
  //   //   console.log(this.items);
  //   // }
  //   // addItem() {
  //   //   this.items.push({ name: "Item " + this.items.length });
  //   // }
  //   // removeItem() {
  //   //   console.log(this.items);
  //   //   this.items.pop();
  //   // }
  //   // increment() {
  //   //   console.log(this.items);
  //   //   this.counter++;
  //   // }
  //   // decrement() {
  //   //   console.log(this.items);
  //   //   this.counter--;
  //   // }
  // },
};

class TheChildComponent extends TheComponent {
  constructor() {
    super();
  }

  title = "The Inner Component";
  counter = 1;
  propagate() {
    this.emit("propagate", {
      name: "John",
      counter: this.counter,
    });
  }
  update() {
    this.emit("update", {
      name: "John",
      counter: this.counter,
    });
  }
  attributeChangedCallback(name,oldValue,newValue) {
    super.attributeChangedCallback(...arguments);
    // console.log("attributeChangedCallback",name,oldValue,newValue);
  }
}

Component(TheChildComponent, config);
