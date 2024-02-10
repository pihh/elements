import { getExpressionProperties, getStrBetween } from "../../../helpers/regex";
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
      operation: attribute.name.indexOf("*") > -1,
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
  return Array.prototype.map.call(element.childNodes, function (node) {
    var details = {
      content:
        node.childNodes && node.childNodes.length > 0 ? null : node.textContent,
      atts: node.nodeType !== 1 ? [] : getAttributes(node.attributes),
      type:
        node.nodeType === 3
          ? "text"
          : node.nodeType === 8
          ? "comment"
          : node.tagName.toLowerCase(),
      node: node,
    };
    details.reactive = details.content && details.content.indexOf("{{") > -1;
    details.reactiveAttributes = details.atts.filter((el) => el.reactive);
    details.action = details.atts.filter((el) => el.action > -1);
    details.operation = details.atts.filter((el) => el.operation > -1);
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
export const reactivityMap = function (element) {
  const reactiveNodes = [];
  const actionNodes = [];
  const operationNodes = [];
  const reactiveAttributes = [];
  const props = new PropMap();

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
      details.reactive = details.content && details.content.indexOf("{{") > -1;
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
                  const callback = PropConnector.attribute(
                    instance,
                    keyword,
                    node,
                    query,
                    attribute
                  );
                  callback();
                },
              });
            }
          }
        }
       
     
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
                const callback = PropConnector.text(instance, keyword, node, query);
                callback()
           
              },
            });
          }
        }
      }

      details.isSVG = isSVG || details.type === "svg";
      details.children = createDOMMap(node, details.isSVG);
      return details;
    });
  };
  createDOMMap(element);
  return props;
};
