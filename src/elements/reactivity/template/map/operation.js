import { modelValue } from "../../../compiler/model/update";
import { TemplateManager } from "../../../compiler/template/manager";
import { filterNonEmpty } from "../../../helpers/array";
import { getForLoopSetup } from "../../../helpers/expression/get-for-loop-setup";
import {
  getExpressionProperties,
 
} from "../../../helpers/regex";

import { connectHtmlReactivity } from "../connection";

export class OperationMap {
  stack = { if: [], for: [] };
  map = { if: [], for: [] };
  async onDidConnect(instance) {
    this.map.for.forEach(async (el) => {
      await el.callback();
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
      const query = replacement.dataset.forQuery;

      const connection = replacement.dataset.forConnection;
      if (!query || query.indexOf("<sp") > -1) {
        configuration.node.textContent = "";
        return;
      }
      let _setup = getForLoopSetup(query);

      const operation = {
        operation: "for",
        replacement,
        query,
        connection,
        connected: false,
        ..._setup,
        callback: function () {},
        connect: function (instance, config = {}) {
          const $replacement = instance.shadowRoot.querySelector(
            '[data-for-connection="' + connection + '"]'
          );
          if (!$replacement) return;
          let $placeholder = document.createComment("for placeholder ");
          let originalQuery = $replacement.dataset.forQuery;

        
          let content = new TemplateManager(connection, instance.__props);
          content = content.setup();
          $placeholder._setup = _setup;
          $replacement.replaceWith($placeholder);
          $placeholder.content = content;
          $placeholder.controller = instance;
          $placeholder.stack = [];
          $placeholder.display = [];
          $placeholder._indices = {};
          let generate = async function (index) {
            const indices = config?.indices || {};
            const _template =
              $placeholder.content.__template.content.firstElementChild.cloneNode(
                true
              );
            _template.dataset.elIndex = JSON.stringify({
              ...indices,
              [_setup.index]: index,
            });
           
            $placeholder._indices[_setup.index] = index;
            _template.innerHTML = _template.innerHTML.replaceAll(
              _setup.index,
              index
            );
            for (let key of Object.keys(indices)) {
              if (key !== _setup.index) {
                _template.innerHTML = _template.innerHTML.replaceAll(
                  key,
                  indices[key]
                );
              }
            }
            $placeholder.after(_template);

            const e = await connectHtmlReactivity(instance, _template);

            _template.remove();
            return _template;
          };
          const callback = function (value) {
            if (value === undefined) {
              value = modelValue(instance, _setup.query.source + ".length");
            }
            // console.log({value},_setup.query.source + ".length",value)

            let promises = [];
            for (let i = $placeholder.stack.length; i < value; i++) {
              promises.push(
                new Promise((res) => {
                  generate(i).then(($item) => {
                    $placeholder.after($item);
                    $placeholder.stack.push($item);
                    $placeholder.display.push($item);
                    res($item);
                  });
                })
              );
            }
            Promise.all(promises).then((res) => {
              for (let i = $placeholder.display.length; i < value; i++) {
                $placeholder.display.push($placeholder.stack[i]);
                $placeholder.after($placeholder.stack[i]);
              }
              let pops = [];
              for (let i = value; i < $placeholder.display.length; i++) {
                pops.push(i);
              }
              pops.reverse();

              for (let pop of pops) {
                $placeholder.display[pop].remove();
                $placeholder.display.pop();
              }
            });
          };

          $placeholder.callback = callback;
          $placeholder.generate = generate;

          instance.connect(_setup.query.source + ".length", callback);

          this.callback = callback;
        },
        setup: function (instance, config = {}) {
          if (this.connected) return;
          this.connected = true;
          this.connect(instance, config);
          this.callback();
        },
      };
      this.map.for.push(operation);
    }
  }
}
