import { filterNonEmpty } from "../../../helpers/array";
import { findTextNodes } from "../../../helpers/dom";
import { getExpressionProperties, getStrBetween, isChar } from "../../../helpers/regex";
import { Registry } from "../../../kernel/registry";
import { reactivityMap } from "../map";

export class OperationMap {
  stack = { if: [], for: [] };
  map = { if: [], for: [] };
  onDidConnect() {
    this.map.for.forEach((el) => {
      el.callback();
    });
    this.map.if.forEach((el) => {
      el.callback();
    });
  }
  constructor(instance) {}
  feed(node) {
    // @deprecated
  }
  extractQueryIf(node) {
    const content = filterNonEmpty(node.textContent.split("@if"))[0]
      .split(")")[0]
      .replace("(", "");
    let keywords = getExpressionProperties("{{" + content + "}}");
    let query = content;

    for (let keyword of keywords.sort((a, b) => b - a)) {
      query = query.replaceAll("this.scope." + keyword, keyword);
      query = query.replaceAll("this." + keyword, keyword);
      query = query.replaceAll(keyword, "this." + keyword);
    }
    //query = "${" + query + "}";
    return { query, value: content, keywords: keywords };
  }
  extractQueryFor(node) {
    try {
      const content = filterNonEmpty(node.textContent.split("@for"))[0]
        .split(")")[0]
        .replace("(", "");
      let split = filterNonEmpty(content.split(" of "));

      let variable = split[0];
      if (variable.trim().indexOf("let ") == 0) {
        variable = variable.trim().replace("let ", "");
      }
      if (variable.trim().indexOf("const ") == 0) {
        variable = variable.trim().replace("const ", "");
      }
      let source = split[1];
      let keywords = getExpressionProperties("{{" + source + "}}");
      let query = source;

      for (let keyword of keywords.sort((a, b) => b - a)) {
        query = query.replaceAll("this.scope." + keyword, keyword);
        query = query.replaceAll("this." + keyword, keyword);
        query = query.replaceAll(keyword, "this." + keyword);
      }

      //query = "${" + query + "}";
      return { query, value: content, source, variable, keywords: keywords };
    } catch (ex) {
      console.warn(ex);
    }
  }
  extractQuery(node) {
    if (node.textContent.indexOf("@if") > -1) {
      return this.extractQueryIf(node);
    } else {
      return this.extractQueryFor(node);
    }
  }
  __connId = 0;
  track(prop, configuration = {}) {
    if (prop == "@if") {
      const { query, value, keywords } = this.extractQuery(configuration.node);
      let id = "if-stack-" + Date.now();
      let $placeholder = configuration.node.nextElementSibling;
      $placeholder.dataset.elIfContainer = Date.now();
      const entry = {
        operation: "if",
        prop,
        query,
        value,
        keywords,
        placeholder: $placeholder,
        nodes: [configuration.node],
      };
      if (this.stack.if.length > 0) {
        const $container = document.createElement("div");
        $container.setAttribute("id", id);

        this.stack.if[this.stack.if.length - 1].nodes.push($container);
        entry.connector = "#" + id;
      }

      this.stack.if.push(entry);
      
    } else if (prop == "@endif") {
      try {
  
        let last = this.stack.if.pop();

        let start = last.nodes[0];
        let content = last.placeholder;

        let operation = {
          operation: "if",
          start,
          content,
          query: last.query,
          value: last.value,
          keywords: last.keywords,
          hasParent: last.connector,
          connected: false,
          callback: function () {},
          connect: function (instance) {
            const $placeholder = document.createComment("if placeholder ");
            $placeholder.content = content;
       
            const $parent = instance.shadowRoot.querySelector(
              '[data-el-if-container="' +
                last.placeholder.dataset.elIfContainer +
                '"]'
            );
  
      
            last.nodes[0].replaceWith($placeholder)
            
            try {
          
              content.remove();
            } catch (ex) {}
        

            let callback = function () {
              const $fn = Function("return `${" + last.query + "}`");
              const output = $fn.call(instance);

              let value = ["true", true].indexOf(output) > -1 ? true : false;
              if (value) {
                $placeholder.after(content);
              } else {
                content.remove();
              }
            };
            for (let keyword of last.keywords) {
              instance.connect(keyword, callback);
            }
            this.callback = callback;
          },
          setup: function (instance) {
            if (this.connected) return;
            this.connected = true;
            this.connect(instance);
          },
        };
        this.map.if.push(operation);
      } catch (ex) {
        console.warn(ex);
      }
    } else if (prop == "@for") {
      const { query, value, source, variable, keywords } = this.extractQuery(
        configuration.node
      );
      let start = configuration.node;

      let $placeholder = configuration.node.nextElementSibling;
 
      // $placeholder.dataset.elForItem = 1;
      const $parent = $placeholder.parentElement;

      $parent.dataset.elForContainer = true;
      for (let match of getStrBetween($parent.innerHTML)) {
        let m = match.trim();
        if (m.indexOf(variable) == 0) {
          if (
            !m.replace(variable, "").charAt(0) ||
            !isChar(m.replace(variable, "").charAt(0))
          ) {
            $parent.innerHTML = $parent.innerHTML.replace(
              "{{" + match,
              "{{" + query + "[$index]"
            ); //.replace('.scope',''));
          }
        }
      }

      //)

      // $placeholder = $parent.querySelector("[data-el-for-item]");
      // delete $placeholder.dataset.elForItem;


      this.stack.for.push({
        operation: "for",
        prop,
        query,
        value,
        source,
        variable,
        keywords,
        nodes: [start],
        placeholder: $placeholder,
      });
    } else if (prop == "@endfor") {
      try {
        // // debugger;

        let depth = this.stack.for.length;
        let last = this.stack.for.pop();
        let start = last.nodes[0];
        let indexs = { $index: 0 };
        for (let i = 1; i < depth; i++) {
          indexs["$index" + i] = 0;
        }

        let content = last.placeholder;
        let variable = last.variable
        let query = last.query
        let id = "for-stack-" + Date.now();
        let $template = document.querySelector("#template-" + id);
        if (!$template) {
          const $wrapper = document.createElement("div");
          $template = document.createElement("template");

          $template.content.appendChild($wrapper);
          $wrapper.appendChild(content);
            $template.setAttribute("id", "template-" + id);
          document.head.appendChild($template);
    
          for (let match of getStrBetween($template.content.firstChild.innerHTML)) {
            let m = match.trim();
            if (m.indexOf(variable) == 0) {
              if (
                !m.replace(variable, "").charAt(0) ||
                !isChar(m.replace(variable, "").charAt(0))
              ) {
        
                $template.content.firstChild.innerHTML = $template.content.firstChild.innerHTML.replace(
                  "{{" + match,
                  "{{" + query + "[$index]"
                ); //.replace('.scope',''));
              }
            }
          }
          $template.content.firstChild.replaceWith( $template.content.firstChild.firstChild)
        
        }
        let end = last.nodes[0];

        // let query = last.query;
        let operation = {
          start,
          end,
          content,
          query: query + ".length",
          value: query + ".length",
          stack: [],
          keywords: last.keywords,
          connected: false,
          callback: function () {},
          connect: async function (instance) {
            
            let _tpl = await Registry.template(id, instance.__props);
            const $placeholder = document.createComment("for placeholder");
            const $parent = instance.shadowRoot.querySelector(
              "[data-el-for-container]"
              );
         
              
            $placeholder.content = content;
   
            $placeholder.stack = [];

            $parent.innerHTML = "";
            $parent.appendChild($placeholder);

            let variable = last.variable;
            let source = last.source;
            let callback = function (value) {
            
              $placeholder.scope = instance.scope;
              $placeholder.scope.$index = "$index";
              $parent.appendChild($placeholder);
              for (let i = $placeholder.stack.length; i < value; i++) {
                let tpl = _tpl.cloneNode(true);
  
                tpl.innerHTML = tpl.innerHTML.replaceAll("$index", i);

                [...tpl.querySelectorAll("*")].forEach(($el) => {
                  $el.$index = 0;
                });
                for (let $node of findTextNodes(tpl)) {
                  $node.$index = 0;
                }
                let { props, actions, operations } = reactivityMap(tpl);
                const connections = props.map;

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
                $placeholder.stack.push(tpl.firstElementChild);
              }
              for (let i = $placeholder.stack.length; i > value; i--) {
                $placeholder.stack[i].remove();
                $placeholder.stack.pop();
              }
            };
            for (let keyword of last.keywords) {
              
              instance.connect(keyword + ".length", callback);
            }
            this.callback = callback;
          },
          setup: function (instance) {

            if (this.connected) return;
            this.connected = true;
            this.connect(instance);
          },
        };
        this.map.for.push(operation);
      } catch (ex) {
        console.warn(ex);
      }
    }
  }
}
