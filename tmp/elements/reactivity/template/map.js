import { modelValue } from "../../compiler/model/update";
import { getExpressionProperties, getStrBetween } from "../../helpers/regex";

import { PropConnector } from "./connectors/prop";
import { ActionMap } from "./map/action";
import { OperationMap } from "./map/operation";
import { PropMap } from "./map/prop";

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
      reactive:
        attribute.value.indexOf("{{") > -1 || attribute.name.indexOf("*") > -1,
      action: attribute.name.indexOf("@") > -1,
      model: attribute.name.indexOf("model") == 0,
      propagated: attribute.name.indexOf("*") == 0,
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
    details.propagated = [];
    details.isSVG = isSVG || details.type === "svg";
    details.children = createDOMMap(node, details.isSVG);
    return details;
  });
};

/**
 * Creates the reactivity map based on the properties of the web component
 */

export const reactivityMap = function (element) {
  let controller = element.parentController || element;

  const props = new PropMap();
  const actions = new ActionMap();
  const operations = new OperationMap(element);

  var createDOMMap = function (element, isSVG) {
    element.parentController = controller;
    return Array.prototype.map.call(element.childNodes, function (node) {
      node.parentController = element.parentController;
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
          operations.track("@end" + op);
          // node.remove()
        } else {
        }
      }
      operations.feed(node);

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
          let parent = false;
          if (attribute.indexOf("*") > -1) {
            parent = true;
            node.removeAttribute(attribute);
            attribute = attribute.replaceAll("*", "");
            node.removeAttribute(attribute);
            //att.value = value.replaceAll("this.","this.parentController.");
          }

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
                  let callback = function () {};
                  //let addParentControllerCallback = node.parentController == node ? instance: node.connect ? node : node.parentController;
                  if (parent) {
                    if (
                      instance &&
                      instance == node.parentController &&
                      node != instance &&
                      node.connect
                    ) {
          

                      let parentCtrl = instance;
                      let child = node;

                      let parsedAtt = att.att.replaceAll("*", "").trim();
                      if (!parentCtrl.hasOwnProperty("__propagation")) {
                        parentCtrl.__propagation = {};
                      }
                      if (!parentCtrl.__propagation[parsedAtt]) {
                        parentCtrl.__propagation[parsedAtt] = {};
                      }
                      if (!parentCtrl.__propagation[parsedAtt][child]) {
                        parentCtrl.__propagation[parsedAtt][child] = true;

                        callback = function () {
                          let parentCtrl = instance;
                          let child = node;
                          const fn = Function(
                            "return `${this.child.scope." +
                              parsedAtt +
                              "=this.parentCtrl.scope." +
                              keyword +
                              "}`;"
                          );
                          fn.call({ parentCtrl, child });
                       
                        };

                        parentCtrl.connect(keyword, callback);
                      }
                    }
                  } else {
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
                  }
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
            args = split[1].replaceAll(")", "").trim().split(",");
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
                  node.getAttribute("el-index") || JSON.stringify({})
                );
                for (let [k, v] of Object.entries($indexList)) {
                  customArguments[k] = v;
                }
                let parsedArguments = args.map((arg) => {
                  let argKey = arg;
                  let parsedArg;
                  let value;
                  try {
                    parsedArg = arg
                      .replaceAll("[", ".")
                      .replaceAll("]", "")
                      .trim()
                      .split(".")
                      .map((el) => el.trim())
                      .filter((el) => el.length > 0); //.join('.');
                    argKey = parsedArg[0];
                    value = modelValue(instance, arg);
                    if (!isNaN(value)) {
                      value = Number(value);
                    }
                  } catch (ex) {}
                  return customArguments.hasOwnProperty(argKey)
                    ? value
                    : !isNaN(arg)
                    ? Number(arg)
                    : ["'", '"', "`"].indexOf(arg.trim().charAt(0)) > -1
                    ? arg.trim().slice(1, arg.trim().length - 1)
                    : arg;
                });

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


  createDOMMap(element);

  return { props, actions, operations };
};
