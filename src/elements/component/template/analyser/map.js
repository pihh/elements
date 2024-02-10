import {
  getExpressionProperties,
  getStrBetween,
  isChar,
} from "../../../helpers/regex";
import { PropConnector } from "../../reactivity/connector";

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
  stack = [];
  map = { if: [] };
  onDidConnect(){
    this.map.if.forEach(el => {
      console.log(el)
      el.callback()
    })
  }
  constructor() {}
  feed(node) {
    if (this.stack[this.stack.length - 1]) {
      this.stack[this.stack.length - 1].nodes.push(node);
    }
  }
  track(prop, configuration = {}) {
    if (prop == "@if") {
      this.stack.push({ prop, nodes: [] });
    } else {
      try {
        let last = this.stack.pop();

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
          callback:function(){},
          connect: function (instance) {
            const $placeholder = document.createComment("if placeholder ");
            $placeholder.content = content;
            start.replaceWith($placeholder);
            end.remove();
            for (let node of content) {
              node.remove();
            }
            let callback = function () {
              let value = ["true",true].indexOf(instance.scope.checked) >-1 ? true:false;
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

      let operationIdx = node?.data?.indexOf("@if") ?? -1;
      let operationEndIdx = node?.data?.indexOf("@endif") ?? -1;

      if (operationIdx > -1) {
        operations.track("@if");
      }
      if (operationEndIdx > -1) {
        operations.feed(node);
        operations.track("@endif");
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
        // console.log(events);
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
  console.log(operations);
  createDOMMap(element);
  return { props, actions ,operations};
};
