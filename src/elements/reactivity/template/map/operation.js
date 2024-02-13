import { TemplateManager } from "../../../compiler/template/manager";
import { filterNonEmpty } from "../../../helpers/array";
import { findTextNodes } from "../../../helpers/dom";
import {
  getExpressionProperties,
  getStrBetween,
  isChar,
} from "../../../helpers/regex";
import { Registry } from "../../../kernel/registry";
import { connectHtmlReactivity } from "../connection";
import { reactivityMap } from "../map";

export class OperationMap {
  stack = { if: [], for: [] };
  map = { if: [], for: [] };
  async onDidConnect(instance) {
    this.map.for.reverse().forEach(async (el) => {
      // console.log(el.query, el);
      
      // let fn = Function("return `${" + el.query + "}`;");
      // let output = Number(fn.apply(instance));
      // let n = output || 0;
       await el.callback(1);
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
      // return this.extractQueryFor(node);
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

            last.nodes[0].replaceWith($placeholder);

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
 
      const replacement = configuration.node.parentElement;
      const query = replacement.dataset.forQuery
      const connection = replacement.dataset.forConnection


      const operation = {
        operation: "for",
        replacement,
        query,
        connection,
        connected: false,
        callback: function () {},
        connect: async function (instance) {
          const $replacement = instance.shadowRoot.querySelector('[data-for-connection="'+connection+'"]');
          const $placeholder = document.createComment("for placeholder ");
          $replacement.replaceWith($placeholder);
          $placeholder.content = new TemplateManager(connection,instance.__props);
         
          let generate = function(id){
         
           const _template = $placeholder.content.__template.content.firstElementChild.cloneNode(true);
           _template.innerHTML = _template.innerHTML.replaceAll('$index0',id);
           _template.innerHTML = _template.innerHTML.replaceAll('$index1',id);
       
            $placeholder.after(_template);
            connectHtmlReactivity(instance,_template)

          }
          generate(0)
    
          
      
        },
        setup: function (instance) {
          if (this.connected) return;
          this.connected = true;
          this.connect(instance);
        },
      }
      this.map.for.push(operation);
    }
  }
}
