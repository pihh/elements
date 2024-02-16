import { modelValue } from "../../../../compiler/model/update";
import { TemplateManager } from "../../../../compiler/template/manager";
import { getForLoopSetup } from "../../../../helpers/expression/get-for-loop-setup";
import { connectHtmlReactivity } from "../../connection";
import { operationIf } from "./if";

export const operationFor = function (configuration, stack = []) {
    // get container and query

  const replacement = configuration.node.parentElement;

  const query = replacement.dataset.forQuery;
// get info
  const connection = replacement.dataset.forConnection;
  // extract information

  
  let _setup = getForLoopSetup(query);

  // Create info object
  const operation = {
    operation: "for",
    replacement,
    query,
    connection,
    connected: false,
    ..._setup,
    callback: function () {},
    connect: function (instance, config = {}) {
      
      this.connected = true;
      let childStack = [];
      const $replacement = instance.shadowRoot.querySelector(
        '[data-for-connection="' + connection + '"]'
      );

      if (!$replacement) {
        // console.log("failed for", {connection,_setup,configuration});
        // debugger
        return;
      }
      let $placeholder = document.createComment("for placeholder ");

      let content = new TemplateManager(connection, instance.__props);
      
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
        $placeholder.before(_template);

        const e = await connectHtmlReactivity(instance, _template);

        let ifConnections = [
          ..._template.querySelectorAll("[data-if-connection]"),
        ];
        let forConnections = [
          ..._template.querySelectorAll("[data-for-connection]"),
        ];
        if (ifConnections.length > 0 || forConnections.length > 0) {
    
  
          for (let ifConnection of ifConnections) {
            let wraper = [];
            operationIf({ node: ifConnection.childNodes[0] }, wraper);
            childStack.push(wraper[0]);
          }
          for (let forConnection of forConnections) {
            let wraper = [];
            operationFor(
              { node: forConnection.childNodes[0] },
              wraper
            );
            childStack.push(wraper[0]);
          }
        }
       
        _template.firstElementChild.__setup = _template.__setup;
        _template.firstElementChild.controller = _template.controller;
        _template.firstElementChild.dataset.elIndex = _template.dataset.elIndex;
        _template.remove();
        return _template.firstElementChild;
      };
      const callback = function (value) {
        if (value === undefined) {
          value = modelValue(instance, _setup.query.source + ".length");
        }

        let promises = [];
        for (let i = $placeholder.stack.length; i < value; i++) {
          promises.push(
            new Promise((res) => {
              generate(i).then(($item) => {
                $placeholder.before($item);
                $placeholder.stack.push($item);
                
                $placeholder.display.push($item);
                res($item);
              });
            })
          );
        }
        Promise.all(promises).then((res) => {
          for (let i = $placeholder.display.length; i < value; i++) {
           
            let $display = $placeholder.stack[i];
           
        
            // $display.__i = i
            $placeholder.display.push($display);
            
          }
          // console.log($placeholder.display.length ,' len after',value)
          for(let $display of $placeholder.display.reverse()) {
            $placeholder.before($display);
          }
          for (let con of childStack) {
            con.setup(instance, (config = {}));
          }
          childStack = []
          let pops = [];
          for (let i = value; i < $placeholder.display.length; i++) {
            pops.push(i);
          }
          pops.reverse();

          for (let pop of pops) {
            $placeholder.display[pop].remove();
            $placeholder.display.pop();
            $placeholder.stack.pop();
            
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
  stack.push(operation);
};

