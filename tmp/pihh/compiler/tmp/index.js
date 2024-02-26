const configuration = {
    template: `
    <style>
    h1 {
      font-weight: 800;
      font-size: 1.75rem;
      letter-spacing: -1px;
      line-height: 2rem;
  }</style>
      <div data-el-attribute="0">
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
              <the-inner data-el-attribute="1" data-el-action="4"></the-inner>
              <slot></slot>
          </main>
          <footer>
                  <section>
                      <h5>Update items</h5>
                      <div class="">
                          <button class="btn" data-el-action="0">x2</button>
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
    
      </div>`,
    props: {
      title: {
        defaultValue: "TheDemoComponent Title",
        type: "text",
      },
      obj: {
        defaultValue: { description: "TheDemoComponent Description" },
        type: "object",
      },
      description: {
        defaultValue: "TheDemoComponent Description",
        type: "text",
      },
      counter: {
        defaultValue: 0,
        type: "number",
      },
      color: {
        defaultValue: "green",
        type: "text",
      },
      colors: {
        defaultValue: ["green", "red", "yellow", "blue"],
        type: "object",
      },
      items: {
        defaultValue: [{ name: "Item 0" }],
        type: "object",
      },
    },
  
    connectors: {
   
      "data-el-operation": {
        0: {
          id: "for connection",
          type: "for",
          props: [],
          map: {
            self: { index: "$index", origin: "colors", replacement: "_color" },
          },
          value: "@for(let _color of colors)",
          expression: "let _color of this.colors; let $index = index",
          template: `
                  <option value="{{this.colors[$index]}}">{{this.colors[$index]}}</option>
              `,
          setup: function (instance, element) {},
          connect() {},
        },
        1: {
          template: `@for(let item of items;let $index = index){
                  <li onclick={onClickItem($index)}>
                  {{item.name}}
              </li>`,
        },
      },
  
      "data-el-action": {
        // onclick={addItem}
        // onclick={(event)=>{duplicate(event)}}
        0: {
          id: Symbol("action connection"),
          props: [],
          type:"native",
          eventName: "click",
          value: "(event)=>{duplicate(event))}",
          expression: "(event)=>{this.duplicate(event))}",
          args:[],
          setup: function (instance, element) {
            if (!instance.__connections__.hasOwnProperty(this.id)) {
              instance.__connections__[this.id] = this.id;
              this.connect(instance, element);
            }
          },
          connect: function (instance, element) {
            /*
            const fn = Function("return `" + this.expression + "`");
            const callback = function (event) {
              fn.call(instance, event);
            };
            element.addEventListener(this.eventName, callback);
            */
          },
          unsubscribe: [],
        },
        1: {
          id: Symbol("action connection"),
          props: [],
          eventName: "click",
          value: "addItem",
          expression: "this.addItem()",
          args:[],
          type:"native",
          setup: function (instance, element) {
            if (!instance.__connections__.hasOwnProperty(this.id)) {
              instance.__connections__[this.id] = this.id;
              this.connect(instance, element);
            }
          },
          connect: function (instance, element) {
            const fn = Function("return `" + this.expression + "`");
            const action = instance[this.value];
            const callback = function (event) {
              action.call(instance, event);
            };
            element.addEventListener(this.eventName, callback);
          },
          unsubscribe: [],
        },
        2: {
          id: Symbol("action connection"),
          props: [],
          args: ["$event","this.counter","string","2","false"],
          eventName: "click",
          value: "increment",
          expression: "this.increment()",
          type:"native",
          setup: function (instance, element) {
            if (!instance.__connections__.hasOwnProperty(this.id)) {
              instance.__connections__[this.id] = this.id;
              this.connect(instance, element);
            }
          },
          connect: function (instance, element) {
            const action = instance[this.value];
            let args = this.args;
            const callback = function (event) {
         
              let _args = [...args].map(arg => {
                  if(arg == "$event"){
                      return event
                  }else if(arg.indexOf("this.")> -1){
                      return instance[arg.replace('this.','')];
                  }else if(!isNaN(arg) ){
                      return Number(arg)
                  }else if(["true",true].indexOf(arg) > -1){
                      return true
                  }else if(["false",false].indexOf(arg) >-1 ){
                      return false
                  }else {
                      return arg;
                  }
              })
              if(_args.length == 0){
                  _args.push(event)
              }
             
              action.call(instance, ..._args);
            };
            element.addEventListener(this.eventName, callback);
          },
          unsubscribe: [],
        },
        3: {
          id: Symbol("action connection"),
          props: [],
          type:"native",
          eventName: "click",
          value: "decrement",
          expression: "this.decrement()",
          
          setup: function (instance, element) {
            if (!instance.__connections__.hasOwnProperty(this.id)) {
              instance.__connections__[this.id] = this.id;
              this.connect(instance, element);
            }
          },
          connect: function (instance, element) {
            const action = instance[this.value];
            const callback = function (event) {
              action.call(instance, event);
            };
            element.addEventListener(this.eventName, callback);
          },
          unsubscribe: [],
        },
        4: {
          id: Symbol("action connection"),
          props: [],
          type: "broadcast",
          eventName: "propagate",
          value: "onInnerTextListen",
          expression: "this.onInnerTextListen()",
          args:['$event'],
          setup: function (instance, element) {
            if (!instance.__connections__.hasOwnProperty(this.id)) {
              instance.__connections__[this.id] = this.id;
              this.connect(instance, element);
            }
          },
          connect: function (instance, element) {
            const action = instance[this.value];
            const callback = function (event) {
              // console.log('here')
              action.call(instance, event);
            };
            
            element.__addEmitListener__(this.eventName, instance,callback);
            
          },
          unsubscribe: [],
        },
      },
      "data-el-text": {
        0: {
          id: Symbol("text connection"),
          props: ["title"],
          attribute: "textContent",
          value: "{{title}}",
          expression: "${this.title}",
          childNode: 0,
          setup: function (instance, element) {
            if (!instance.__connections__.hasOwnProperty(this.id)) {
              instance.__connections__[this.id] = this.id;
              this.connect(instance, element);
            }
          },
          connect: function (instance, element) {
            const node = [...element.childNodes][this.childNode];
            const fn = Function("return `" + this.expression + "`");
            const attribute = this.attribute;
            const expression = this.expression;
            const callback = function (value) {
              try {
                const output = fn.call(instance);
                node[attribute] = output;
              } catch (ex) {
                console.warn(ex);
              }
              // node.setAttribute(attribute, output);
            };
  
            for (let prop of this.props) {
              instance.__subscriptions__.push(instance.connect(prop, callback));
              // console.log({ instance, prop, callback });
            }
  
            callback();
          },
          unsubscribe: [],
        },
        1: {
          id: Symbol("text connection"),
          props: ["obj.description"],
          attribute: "textContent",
          value: "{{obj.description}}",
          expression: "${this.obj.description}",
          childNode: 0,
          setup: function (instance, element) {
            if (!instance.__connections__.hasOwnProperty(this.id)) {
              instance.__connections__[this.id] = this.id;
              this.connect(instance, element);
            }
          },
          connect: function (instance, element) {
            const node = [...element.childNodes][this.childNode];
            const fn = Function("return `" + this.expression + "`");
            const attribute = this.attribute;
            const expression = this.expression;
            const callback = function (value) {
              try {
                const output = fn.call(instance);
                node[attribute] = output;
              } catch (ex) {
                console.warn(ex);
              }
              // node.setAttribute(attribute, output);
            };
  
            for (let prop of this.props) {
              instance.__subscriptions__.push(instance.connect(prop, callback));
              // console.log({ instance, prop, callback });
            }
  
            callback();
          },
          unsubscribe: [],
        },
        2: {
          id: Symbol("text connection"),
          props: ["items.0.name"],
          attribute: "textContent",
          value: "{{items[0].name}}",
          expression: "${this.items[0].name}",
          childNode: 0,
          setup: function (instance, element) {
            if (!instance.__connections__.hasOwnProperty(this.id)) {
              instance.__connections__[this.id] = this.id;
              this.connect(instance, element);
            }
          },
          connect: function (instance, element) {
            const node = [...element.childNodes][this.childNode];
            const fn = Function("return `" + this.expression + "`");
            const attribute = this.attribute;
            const expression = this.expression;
            const callback = function (value) {
              try {
                const output = fn.call(instance);
                node[attribute] = output;
              } catch (ex) {
                console.warn(ex);
              }
              // node.setAttribute(attribute, output);
            };
  
            for (let prop of this.props) {
              instance.__subscriptions__.push(instance.connect(prop, callback));
              // console.log({ instance, prop, callback });
            }
  
            callback();
          },
          unsubscribe: [],
        },
        3: {
          id: Symbol("text connection"),
          props: ["counter"],
          attribute: "textContent",
          value: "{{counter}}",
          expression: "${this.counter}",
          childNode: 1,
          setup: function (instance, element) {
            if (!instance.__connections__.hasOwnProperty(this.id)) {
              instance.__connections__[this.id] = this.id;
              this.connect(instance, element);
            }
          },
          connect: function (instance, element) {
            const node = [...element.childNodes][this.childNode];
            const fn = Function("return `" + this.expression + "`");
            const attribute = this.attribute;
            const expression = this.expression;
            const callback = function (value) {
              try {
                const output = fn.call(instance);
                node[attribute] = output;
              } catch (ex) {
                console.warn(ex);
              }
              // node.setAttribute(attribute, output);
            };
  
            for (let prop of this.props) {
              instance.__subscriptions__.push(instance.connect(prop, callback));
              // console.log({ instance, prop, callback });
            }
  
            callback();
          },
          unsubscribe: [],
        },
      },
      "data-el-attribute": {
        0: {
          id: Symbol("attribute connection"),
          props: ["color"],
          attribute: "class",
          value: "component bg-{{color}}-900",
          expression: "component bg-${this.color}-900",
          setup: function (instance, element) {
            if (!instance.__connections__.hasOwnProperty(this.id)) {
              instance.__connections__[this.id] = this.id;
              this.connect(instance, element);
            }
          },
          connect: function (instance, element) {
            const attribute = this.attribute;
            const expression = this.expression;
            const fn = Function("return `" + this.expression + "`");
            const callback = function (value) {
              const output = fn.call(instance);
              element.setAttribute(attribute, output);
            };
            for (let prop of this.props) {
              // console.log({instance,prop,callback});
              // debugger;
              instance.__subscriptions__.push(instance.connect(prop, callback));
            }
            callback();
          },
          unsubscribe: [],
        },
        1: {
          id: Symbol("attribute connection"),
          props: ["text"],
          attribute: "text",
          value: "{{text}}",
          expression: "${this.text}",
          setup: function (instance, element) {
            if (!instance.__connections__.hasOwnProperty(this.id)) {
              instance.__connections__[this.id] = this.id;
              this.connect(instance, element);
            }
          },
          connect: function (instance, element) {
            const attribute = this.attribute;
            const fn = Function("return `" + this.expression + "`");
            const callback = function (value) {
              const output = fn.call(instance);
              element.setAttribute(attribute, output);
            };
            for (let prop of this.props) {
        
              instance.__subscriptions__.push(instance.connect(prop, callback));
            }
            callback();
          },
          unsubscribe: [],
        },
      },
    },
  
    actions: {
      // onClickItem: function() {
      //   console.log("onClick Item");
      //   console.log(this.items);
      // }
      // addItem() {
      //   this.items.push({ name: "Item " + this.items.length });
      // }
      // removeItem() {
      //   console.log(this.items);
      //   this.items.pop();
      // }
      // increment() {
      //   console.log(this.items);
      //   this.counter++;
      // }
      // decrement() {
      //   console.log(this.items);
      //   this.counter--;
      // }
    },
  };