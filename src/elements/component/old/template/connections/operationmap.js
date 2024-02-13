export class OperationMap {
    stack = { if: [], for: [] };
    map = { if: [], for: [] };
    onDidConnect() {
      this.map.for.forEach((el) => {
        
        el.callback();
      });
      this.map.if.forEach((el) => {
        // console.log(el);
        el.callback();
      });
    }
    constructor() {}
    feed(node) {
      if (this.stack.if[this.stack.if.length - 1]) {
        this.stack.if[this.stack.if.length - 1].nodes.push(node);
      }
      if (this.stack.for[this.stack.for.length - 1]) {
        this.stack.for[this.stack.for.length - 1].nodes.push(node);
      }
    }
    track(prop, configuration = {}) {
      if (prop == "@if") {
        this.stack.if.push({ prop, nodes: [] });
      } else if (prop == "@endif") {
        try {
          let last = this.stack.if.pop();
  
          let start = last.nodes[0];
          let end = last.nodes[last.nodes.length - 1];
          let content = last.nodes.slice(1, last.nodes.length - 2);
          let operation = {
            start,
            end,
            content,
            query: "this.condition",
            value: "this.condition",
            connected: false,
            callback: function () {},
            connect: function (instance) {
              const $placeholder = document.createComment("if placeholder ");
              $placeholder.content = content;
              start.replaceWith($placeholder);
              end.remove();
              for (let node of content) {
                node.remove();
              }
              let callback = function () {
                let value =
                  ["true", true].indexOf(instance.scope.checked) > -1
                    ? true
                    : false;
                if (value) {
                  for (let node of $placeholder.content) {
                    $placeholder.after(node);
                  }
                } else {
                  for (let node of $placeholder.content) {
                    node.remove();
                  }
                }
              };
              instance.connect("checked", callback);
              this.callback = callback;
            },
            setup: function (instance) {
              if (this.connected) return;
              this.connected = true;
              this.connect(instance);
            },
          };
          this.map.if.push(operation);
        } catch (ex) {}
      } else if (prop == "@for") {
        this.stack.for.push({ prop, nodes: [] });
      } else if (prop == "@endfor") {
        try {
          let depth = this.stack.for.length;
          let last = this.stack.for.pop();
          let indexs = { $index: 0 };
          for (let i = 1; i < depth; i++) {
            indexs["$index" + i] = 0;
          }
          let start = last.nodes[0];
          let end = last.nodes[last.nodes.length - 1];
          let content = last.nodes.slice(1, last.nodes.length - 2);
          content = content.map((el) => {
            el.dataset.elIndex = JSON.stringify(indexs);
            return el;
          });
          let operation = {
            start,
            end,
            content,
            query: "this.colors.length",
            value: "this.colors.length",
            stack: [],
            connected: false,
            callback: function () {},
            connect: function (instance) {
              const $template = document.createElement("template");
              const $placeholder = document.createComment("for placeholder ");
              let $boilerplate = "";
              $placeholder.content = content;
              $placeholder.stack = [];
  
              start.replaceWith($placeholder);
              end.remove();
  
              for (let node of content) {        
                $template.content.appendChild(node);
              }
  
              // $boilerplate = $boilerplate.replaceAll('${c','${this.colors[$index]')document.head.appendChild($template);
              $template.setAttribute("id", "template-for-loop");
             
  
              let callback = async function () {
                let value = instance.scope.colors.length;
                for (let i = 0; i < value; i++) {
                  let _tpl = await Registry.template("for-loop", this.__props); //.then((_tpl) => {
               
                  let tpl = _tpl.cloneNode(true);
               
                  tpl.innerHTML = tpl.innerHTML
                    .replaceAll("${c", "{{this.colors[$index]")
                    .replaceAll("[$index", "[" + i)
                    .replaceAll("{$index", "{" + i)
                    .replaceAll("`", "")
                    .replaceAll("${", "{{")
                    .replaceAll("}", "}}")
                    .replaceAll("$index", i);
  
          
                    // .replaceAll("}", "}}");
                  let { props, actions, operations } = reactivityMap(tpl);
                  const connections = props.map;
                  // console.log(props,actions,operations)
                  for (let key of Object.keys(connections)) {
                    const connection = connections[key];
                    for (let conn of connection) {
                      conn.setup(instance);
                    }
                  }
  
                  actions = actions.map;
                  for (let key of Object.keys(actions)) {
                    for (let action of actions[key]) {
                      action.node.removeAttribute(key);
                      action.setup(instance);
                    }
                  }
  
                  $placeholder.after(tpl.firstElementChild);
                }
                // for(let i = 0; i < value; i++) {
                //   if(!$placeholder.stack[i]){
  
                //     // const $wrapper = document.createElement('div');
                //     // $wrapper.innerHTML = $placeholder.boilerplate.replaceAll('$index',i);
                //     // $placeholder.after($wrapper.firstElementChild);
                //     // $placeholder.stack.push($wrapper.firstElementChild);
  
                //   }
                // }
                // for(let node)
                //   ["true", true].indexOf(instance.scope.checked) > -1
                //     ? true
                //     : false;
                // if (value) {
                //   for (let node of $placeholder.content) {
                //     $placeholder.after(node);
                //   }
                // } else {
                //   for (let node of $placeholder.content) {
                //     node.remove();
                //   }
                // }
              };
              instance.connect("colors.length", callback);
              this.callback = callback;
            },
            setup: function (instance) {
              if (this.connected) return;
              this.connected = true;
              this.connect(instance);
            },
          };
          this.map.for.push(operation);
        } catch (ex) {}
      }
    }
  }
  