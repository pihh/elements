import {
  getExpressionProperties,
  getStrBetween,
  isChar,
} from "../../../helpers/regex";
import { Registry } from "../../../kernel/registry";
import { PropConnector } from "../../reactivity/connector";
import { parseTemplateString } from "./cleanup";

/**
 * Create an array of the attributes on an element
 * @param  {NamedNodeMap} attributes The attributes on an element
 * @return {Array}                   The attributes on an element as an array of key/value pairs
 */
var getAttributes = function (attributes) {
  return Array.prototype.map.call(attributes, function (attribute) {
    return {
      att: attribute.name,
      value: attribute.value,
      reactive: attribute.value.indexOf("{{") > -1,
      action: attribute.name.indexOf("@") > -1,
      model: attribute.name.indexOf("model") == 0,
    };
  });
};

/**
 * Create a DOM Tree Map for an element
 * @param  {Node}    element The element to map
 * @param  {Boolean} isSVG   If true, node is within an SVG
 * @return {Array}           A DOM tree map
 */
var createDOMMap = function (element, isSVG) {
  const reactiveNodes = [];
  const actionNodes = [];
  const operationNodes = [];
  const reactiveAttributes = [];
  const models = [];
  return Array.prototype.map.call(element.childNodes, function (node) {
    var details = {
      content:
        node.childNodes && node.childNodes.length > 0 ? null : node.textContent,
      atts: node.nodeType !== 1 ? [] : getAttributes(node.attributes),
      operation:
        node.nodeType !== 1 && ["@if", "@endif"].indexOf(node.textContent) > -1
          ? true
          : false,
      type:
        node.nodeType === 3
          ? "text"
          : node.nodeType === 8
          ? "comment"
          : node.tagName.toLowerCase(),
      node: node,
    };
    details.reactive =
      details.content &&
      details.content.indexOf("{{") > -1 &&
      !details.operation;
    details.reactiveAttributes = details.atts.filter((el) => el.reactive);
    details.action = details.atts.filter((el) => el.action > -1);
    //details.operation = details.operation;//.filter((el) => el.operation > -1);
    details.isSVG = isSVG || details.type === "svg";
    details.children = createDOMMap(node, details.isSVG);
    return details;
  });
};

/**
 * Creates the reactivity map based on the properties of the web component
 */

class PropMap {
  map = {};
  constructor() {}
  track(prop, configuration = {}) {
    if (!this.map.hasOwnProperty(prop)) {
      this.map[prop] = [];
    }
    delete configuration.setup;
    this.map[prop].push({
      node: configuration.node,
      type: configuration.type,
      value: configuration.value,
      query: configuration.query,
      connected: false,
      subscriptions: [],
      connect: function (instance) {},
      setup: function (instance) {
        if (this.connected) return this.subscriptions;
        this.subscriptions = this.connect(instance) || [];
        this.connected = true;
      },
      ...configuration,
    });
  }
}
class ActionMap {
  map = {};
  constructor() {}
  track(prop, configuration = {}) {
    if (!this.map.hasOwnProperty(prop)) {
      this.map[prop] = [];
    }
    delete configuration.setup;
    this.map[prop].push({
      node: configuration.node,
      eventName: configuration.eventName,
      value: configuration.value,
      functionName: configuration.query,
      argumentList: [],
      connected: false,
      subscriptions: [],
      connect: function (instance) {},
      setup: function (instance) {
        if (this.connected) return;
        this.connected = true;
        this.connect(instance);
        // this.subscriptions = this.connect(instance) || [];
      },
      ...configuration,
    });
  }
}

class OperationMap {
  stack = { if: [], for: [] };
  map = { if: [], for: [] };
  onDidConnect() {

    this.map.for.forEach((el) => {
      console.log({el})
      debugger;
      el.callback();
    });
    this.map.if.forEach((el) => {
      // console.log({ el });
      el.callback();
    });
  }
  constructor() {}
  feed(node) {
    if (this.stack.if.length > 0) {
      this.stack.if[this.stack.if.length - 1].nodes.push(node);
    }

    if (this.stack.for.length > 0) {
      this.stack.for[this.stack.for.length - 1].nodes.push(node);
    }
  }
  extractQueryIf(node) {
    const content = node.textContent
      .split("@if")
      .map((el) => el.trim())
      .filter((el) => el.length > 0)[0]
      .split(")")[0]
      .replace("(", "");
    let keywords = getExpressionProperties("{{" + content + "}}");
    let query = content;

    for (let keyword of keywords.sort((a, b) => b - a)) {
      query = query.replaceAll("this.scope." + keyword, keyword);
      query = query.replaceAll("this." + keyword, keyword);
      query = query.replaceAll(keyword, "this.scope." + keyword);
    }
    //query = "${" + query + "}";
    return { query, value: content, keywords: keywords };
  }
  extractQueryFor(node) {
    const content = node.textContent
      .split("@for")
      .map((el) => el.trim())
      .filter((el) => el.length > 0)
      .map((el) => {
        for (let exp of ["let ", "const "]) {
          if (el.indexOf(exp) == 0) {
            el = el.replace(exp, "");
          }
        }
        return el;
      })[0]
      .split(")")[0]
      .replace("(", "");
    let split = content
      .split(" of ")
      .map((el) => el.trim())
      .filter((el) => el.length > 0);
    let variable = split[0];
    let source = split[1];
    let keywords = getExpressionProperties("{{" + source + "}}");
    let query = source;

    for (let keyword of keywords.sort((a, b) => b - a)) {
      query = query.replaceAll("this." + keyword, keyword);
      query = query.replaceAll(keyword, "this." + keyword);
    }
    //query = "${" + query + "}";
    return { query, value: content, source, variable, keywords: keywords };
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
      let id = 'if-stack-'+Date.now();
      const entry = {
        operation: "if",
        prop,
        query,
        value,
        keywords,
        nodes: [],
      }
      if(this.stack.if.length > 0) {
        const $container = document.createElement('div');
        $container.setAttribute('id', id);
  
        this.stack.if[this.stack.if.length-1].nodes.push($container);
        entry.connector = "#"+id;
      }
      
        this.stack.if.push(entry);

   
  
    } else if (prop == "@endif") {
      try {
        let last = this.stack.if.pop();
    
        let start = last.nodes[0];
        let end = last.nodes[last.nodes.length - 2];
        let content = last.nodes.slice(1, last.nodes.length - 3);

        let operation = {
          operation: "if",
          start,
          end,
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
            start.replaceWith($placeholder);
       
            for (let node of content) {
              node.remove();
            }
            let callback = function () {
              // console.log('cb',last)
           
       
              const $fn = Function("return `${" + last.query + "}`");
              const output = $fn.call(instance);
              // console.log(output);
              let value = ["true", true].indexOf(output) > -1 ? true : false;
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
      } catch (ex) {}
    } else if (prop == "@for") {
      const { query, value, source, variable, keywords } = this.extractQuery(
        configuration.node
      );
      this.stack.for.push({
        operation: "for",
        prop,
        query,
        value,
        source,
        variable,
        keywords,
        nodes: [],
      });
    } else if (prop == "@endfor") {
      try {
        let depth = this.stack.for.length;
        let last = this.stack.for.pop();

        let indexs = { $index: 0 };
        for (let i = 1; i < depth; i++) {
          indexs["$index" + i] = 0;
        } 
        let start = last.nodes[0];
        let end = last.nodes[last.nodes.length - 2];
        let content = last.nodes.slice(1,last.nodes.length-1);
        content = content.map((el) => {
          el.dataset.elIndex = JSON.stringify(indexs);
          return el;
        });
        let query = last.query;
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
          connect: function (instance) {
            
            const $placeholder = document.createComment("for placeholder");

            $placeholder.content = content;
            $placeholder.stack = [];

            start.replaceWith($placeholder);
            end.remove();

            let $template = document.querySelector(
              "template-for-loop__" + depth
            );
            if (!$template) {
              $template = document.createElement("template");
              document.head.appendChild($template);
              for (let node of content) {
             
                $template.content.appendChild(node);
              }

              
              $template.setAttribute("id", "template-for-loop__" + depth);
            }
            let variable = last.variable;
            let source = last.source;
            let callback = async function () {
              let value = instance.scope.colors.length;
              let _tpl = await Registry.template(
                "for-loop__" + depth,
                instance.__props
              ); //.then((_tpl) => {
              for (let i = $placeholder.stack.length; i < value; i++) {
                
                let tpl = _tpl.cloneNode(true);

                tpl.innerHTML = tpl.innerHTML
                  .replaceAll("${" + variable, "{{" + query + "[$index]")
                  .replaceAll("[$index", "[" + i)
                  .replaceAll("{$index", "{" + i)
                  .replaceAll("`", "")
                  .replaceAll("${", "{{")
                  .replaceAll("}", "}}")
                  .replaceAll("$index", i);

                // .replaceAll("}", "}}");
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
      } catch (ex) {}
    }
  }
}

export const reactivityMap = function (element) {
  const props = new PropMap();
  const actions = new ActionMap();
  const operations = new OperationMap();

  var createDOMMap = function (element, isSVG) {
    return Array.prototype.map.call(element.childNodes, function (node) {
      var details = {
        content:
          node.childNodes && node.childNodes.length > 0
            ? null
            : node.textContent,
        atts: node.nodeType !== 1 ? [] : getAttributes(node.attributes),

        type:
          node.nodeType === 3
            ? "text"
            : node.nodeType === 8
            ? "comment"
            : node.tagName.toLowerCase(),
        node: node,
      };

      let shouldTrack = false;

      for (let op of ["if", "for"]) {
        let operationIdx = node?.data?.indexOf("@" + op) ?? -1;
        let operationEndIdx = node?.data?.indexOf("@end" + op) ?? -1;

        if (operationIdx > -1) {
          operations.track("@" + op, { node });
        } else if (operationEndIdx > -1) {
          // operations.feed(node);
          operations.track("@end" + op);
        }else {

        }
      }
      operations.feed(node);
      // if(node?.textContent && node.textContent && ["@if","@endif"].indexOf(node.textContent) > -1  ){
      //   console.warn(node.textContent)
      // }
      details.reactive =
        details.content &&
        details.content.indexOf("{{") > -1 &&
        !details.operation;
      let reactiveAtts = details.atts.filter((el) => el.reactive);
      if (reactiveAtts.length > 0) {
        shouldTrack = true;
        for (let att of reactiveAtts) {
          let attribute = att.att;
          let value = att.value;
          for (let match of getStrBetween(att.value)) {
            let keywords = getExpressionProperties("{{" + match.trim() + "}}");

            for (let keyword of keywords) {
              let originalKeyword = keyword;
              let query = att.value;

              query = query.replaceAll(
                "{{" + match + "}}",
                "{{" + match.replaceAll(originalKeyword, keyword) + "}}"
              );
              query =
                "`" + query.replaceAll("{{", "${").replaceAll("}}", "}") + "`";
              props.track(keyword, {
                node: node,
                type: "attribute",
                value: value,
                query: query,
                connect: function (instance) {
                  let callback;
                  if (attribute == "model") {
                    callback = PropConnector.model(
                      instance,
                      keyword,
                      node,
                      query
                    );
                  } else {
                    callback = PropConnector.attribute(
                      instance,
                      keyword,
                      node,
                      query,
                      attribute
                    );
                  }
                  callback();
                },
              });
            }
          }
        }
      }

      let models = details.atts.filter((el) => el.model);
      if (models.length > 0) {
        shouldTrack = true;

        let keyword = node.getAttribute("model");
        let value = keyword.indexOf("this.") > -1 ? keyword : "this." + keyword;
        let query = "`${" + value + "}`";
        props.track(keyword, {
          node: node,
          type: "model",
          value: value,
          query: query,
          connect: function (instance) {
            const callback = PropConnector.model(
              instance,
              keyword,
              node,
              query
            );
            callback();
          },
        });
      }

      if (details.reactive) {
        shouldTrack = true;
        for (let match of getStrBetween(details.content)) {
          let keywords = getExpressionProperties("{{" + match.trim() + "}}");

          for (let keyword of keywords) {
            let originalKeyword = keyword;
            let query = details.content;
            query = query.replaceAll(
              "{{" + match + "}}",
              "{{" + match.replaceAll(originalKeyword, keyword) + "}}"
            );
            query =
              "`" + query.replaceAll("{{", "${").replaceAll("}}", "}") + "`";
            props.track(keyword, {
              node: node,
              type: "text",
              value: details.content,
              query: query,
              connect: function (instance) {
                const callback = PropConnector.text(
                  instance,
                  keyword,
                  node,
                  query
                );
                callback();
              },
            });
          }
        }
      }
      let events = details.atts.filter((el) => el.action);
      if (events.length > 0) {
        shouldTrack = true;
       
        for (let evt of events) {
          evt = evt.att;
          const type = node.hasOwnProperty(evt) ? "native" : "custom";
          let eventName = evt.replaceAll("@", "");
          const value = node.getAttribute(evt);
          const query = node.getAttribute(evt).trim().replaceAll(" ", "");
          const split = query
            .split("(")
            .map((el) => el.trim())
            .filter((el) => el.length > 0);
          const actionName = split[0];
          let args = [];
          if (split.length > 1) {
            args = split[1]
              .split(")")
              .map((el) => el.trim())
              .filter((el) => el.length > 0)[0]
              .split(",");
          }
          if (
            eventName.indexOf("on") == 0 &&
            typeof node[eventName.slice(2)] == "function"
          ) {
            eventName = eventName.slice(2);
          }

          actions.track(evt, {
            node,
            type,
            value,
            eventName,
            query,
            actionName,
            args,
            connect: function (instance) {
              node.addEventListener(eventName, function ($event) {
                const customArguments = instance.scope;
                customArguments.$event = $event;
                let $indexList = JSON.parse(
                  node.getAttribute("el-index") || JSON.stringify({ $index: 0 })
                );
                for (let [k, v] of Object.entries($indexList)) {
                  customArguments[k] = v;
                }
                let parsedArguments = args.map((arg) =>
                  customArguments.hasOwnProperty(arg)
                    ? customArguments[arg]
                    : !isNaN(arg)
                    ? Number(arg)
                    : ["'", '"', "`"].indexOf(arg.trim().charAt(0)) > -1
                    ? arg.trim().slice(1, arg.trim().length - 1)
                    : arg
                );

                instance[actionName](...parsedArguments);
              });
            },
          });
        }
      }

      details.isSVG = isSVG || details.type === "svg";
      details.children = createDOMMap(node, details.isSVG);
      return details;
    });
  };
  // console.log(operations);
  
  createDOMMap(element);
  return { props, actions, operations };
};
