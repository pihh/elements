import { filterNonEmpty } from "../../../../helpers/array";
import { getIfSetup } from "../../../../helpers/expression/get-if-setup";
import { getExpressionProperties } from "../../../../helpers/regex";
import { TemplateManager } from "../../../../compiler/template/manager";
import { modelValue } from "../../../../compiler/model/update";
import { connectHtmlReactivity } from "../../connection";
import { PropConnector } from "../../connectors/prop";

export const extractQueryIf = function (node) {
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
};

export const operationIf = function (configuration, stack = []) {
  const replacement = configuration.node.parentElement;
  if (!replacement) return;
  const query = replacement.dataset.ifQuery;
  // get info
  const connection = replacement.dataset.ifConnection;

  // extract information

  if (!query) return;
  let _setup = getIfSetup(query);

  // Create info object
  const operation = {
    operation: "if",
    replacement,
    query,
    connection,
    connected: false,
    ..._setup,
    callback: function () {},
    connect: async function (instance, config = {}) {
      try{
      this.connected = true;
      const childStack = [];
      const $replacement = instance.shadowRoot.querySelector(
        '[data-if-connection="' + connection + '"]'
      );


      if (!$replacement) {
        console.log("failed if", { connection, _setup });
        return;
      }
      let $placeholder = document.createComment("if placeholder ");

      let content = new TemplateManager(connection, instance.__props);

      $placeholder._setup = _setup;
      $replacement.replaceWith($placeholder);
      $placeholder.content = content;
      $placeholder.controller = instance;

      $placeholder.template =
        $placeholder.content.__template.content.firstElementChild.cloneNode(
          true
        );
      const e = await connectHtmlReactivity(instance, $placeholder.template);
      $placeholder.after($placeholder.template);

      let ifConnections = [
        ...$placeholder.template.querySelectorAll("[data-if-connection]"),
      ];
      let forConnections = [
        ...$placeholder.template.querySelectorAll("[data-for-connection]"),
      ];
      if (ifConnections.length > 0 || forConnections.length > 0) {
   

        for (let ifConnection of ifConnections) {
          let wraper = [];
         
       operationIf({ node: ifConnection.childNodes[0] }, wraper);
          childStack.push(wraper[0]);
        }
        for (let forConnection of forConnections) {
          let wraper = [];
          let setup = operationFor(
            { node: forConnection.childNodes[0] },
            wraper
          );
          childStack.push(wraper[0]);
        }
      }
  
      $placeholder.template.firstElementChild.__setup =
        $placeholder.template.__setup;
      $placeholder.template.firstElementChild.controller =
        $placeholder.template.controller;

      const callback = function (value) {

        value = PropConnector.evaluate(instance, _setup.query);
        
        if ([true, "true"].indexOf(value) > -1) {
          if (!$placeholder.template.isConnected) {
            $placeholder.after($placeholder.template);
          }
        } else {
          if ($placeholder.template.isConnected) {
            $placeholder.template.remove();
          }
        }
      };

      this.callback = callback;
      for (let con of childStack) {
        con.setup(instance, (config = {}));
      }
      $placeholder.callback = callback;

      for (let attribute of _setup.attribute) {
        instance.connect(attribute, callback);
      }
      callback();
    }catch(ex){
      console.log(query,connection)
      console.warn(ex)
    }
    },
    setup: function (instance, config = {}) {
      if (this.connected) {
        return;
      }
      this.connected = true;
      this.connect(instance, config);
      this.callback();
    },
  };
  stack.push(operation);
};
