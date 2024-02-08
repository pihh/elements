import {
  addCustomListener,
  addModelListener,
  getSelector,
  updateAttribute,
} from "../compiler/elements/dom";
import { findTextNodes } from "../helpers/dom";
import {
  getExpressionProperties,
  getIndexes,
  getStrBetween,
  isChar,
} from "../helpers/regex";

export const hydrate = function () {
  // Get the template of the component
  // Extract the connections
  // Connect to the controller
};

/**
 *
 */
export const connectActions = function (
  $element,
  selector,
  actions = [],
  $connections = { actions: {} }
) {
  for (let action of actions) {
    if (!$connections.actions.hasOwnProperty(selector)) {
      $connections.actions[selector] = [];
    }
    let sourceAttribute = action.replace("@", "").trim();
    let targetAttribute = $element
      .getAttribute(action)
      .trim()
      .replace("this.", "");
    let query = $element
      .getAttribute(action)
      .replaceAll("{{", "${")
      .replaceAll("}}", "}");

    $connections.actions[selector].push({
      type: "action",
      action,
      sourceAttribute,
      targetAttribute,
      query,
      selector: selector,
      setup: function (instance) {
        let element = instance.querySelector(selector);
        if (action.indexOf("model") > -1) {
          const callback = addModelListener(instance, element, targetAttribute);
          element.removeAttribute(action);
          return callback;
        } else {
          let parts = query
            .trim()
            .split("(")
            .map((el) => el.trim())
            .filter((el) => el.length > 0);
          let act = parts[0].replace("this.", "");
          let args = [];
          if (parts.length > 1) {
            args = parts[1]
              .split(")")
              .map((el) => el.trim())
              .filter((el) => el.length > 0)[0]
              .split(",")
              .map((el) => el.trim());
          }
          const callback = () => {
            addCustomListener(
              instance,
              element,
              action.replaceAll("@", ""),
              act,
              args
            );
          };
          callback(instance, element, action.replaceAll("@", ""), act, args);
          element.removeAttribute(action);
          return callback;
        }
      },
    });
  }

  return $connections;
};

export function connectAttributes(
  $element,
  selector,
  attributes = [],
  $connections = { keywords: {} }
){

    for (let attribute of attributes) {
      const value = $element.getAttribute(attribute);
      const query = value.replaceAll("{{", "${").replaceAll("}}", "}");
      let keywords = getExpressionProperties(value);
      
      for (let keyword of keywords) {
        if (!$connections.keywords.hasOwnProperty(keyword)) {
          $connections.keywords[keyword] = [];
        }

        $connections.keywords[keyword].push({
          type: "attribute",
          attribute: attribute,
          query,
          selector,
          setup: function (instance) {
            let element = instance.querySelector(selector);
            const callback = function (instance) {
              try {
                //   let element = instance.querySelector(selector);
                updateAttribute(instance, element, attribute, query);
              } catch (ex) {
                console.warn(ex);
              }
            };
            return callback;
          },
        });
      
      }
    }
    return $connections
}

/**
 * Removes and maps the *operations in order to create their generators in the future
 * @param {} template
 * @param {*} operations
 * @param {*} attribute
 * @param {*} dataset
 * @param {*} config
 * @returns
 */
export const disconnectOperations = function (
  template,
  operations,
  attribute,
  dataset,
  config = {}
) {
  config = {
    initial: false,
    ...config,
  };
  let templateId = template.getAttribute("id"); //+'__ifcontainer__'+i
  if (config.initial) {
    template = template.content;
  }
  const $head = document.querySelector("head");
  const $operations = [];
  for (let i = 0; i < operations.length; i++) {
    let $operation = operations[i].cloneNode(true);
    const $replacement = document.createElement("span");
    const $template = document.createElement("template");
    const $templateId = templateId + "__ifcontainer__" + i;
    $template.setAttribute("id", $templateId);
    $template.appendChild($operation);
    $operation.removeAttribute(attribute);

    $replacement.dataset.elReplacement = attribute;
    $replacement.dataset.elIndex = i;
    $replacement.query = $operation.getAttribute(attribute);
    operations[i].replaceWith($replacement);

    $head.appendChild($template);
    $operations.push({
      id: $templateId,
      operation: "*if",
      selector: '[data-el-replacement="' + i + '"]',
      query: $replacement.query,
      template: $template,
      $replacement: $replacement,
      $operation: $operation,
    });
  }
  return $operations;
};

export function connectTextNodes($node, $connections){
    // findTextNodes(template.content).map(console.log)
  // console.log({ $nodes });
  let $container = $node.parentNode;
  
  if(!$container){
    let $clone = $node.cloneNode(true);
    $container = document.createElement('span')
    $node.replaceWith($container);
    $container.appendChild($clone);
    $node = $clone;
  }
    let parent = getSelector($container);
    let parentChildNodes = $container?.childNodes || [];
  

    for (let i = 0; i <  parentChildNodes.length; i++) {
      let childNode = parentChildNodes[i];
      if (childNode.textContent.indexOf("{{") > -1) {
        const value = childNode.textContent;
        const nodeIndex = i;
        let keywords = getExpressionProperties(value);
        const query = value.replaceAll("{{", "${").replaceAll("}}", "}");
        for (let keyword of keywords) {
          if (!$connections.keywords.hasOwnProperty(keyword)) {
            $connections.keywords[keyword] = [];
          }
          $connections.keywords[keyword].push({
            attribute: "textNode",
            type: "text",
            query,
            originalQuery: value,
            selector: parent, //+"childNodes["+i+"]",
            nodeIndex: nodeIndex,
            setup: function(instance){
              let element =
              instance.querySelector(parent).childNodes[nodeIndex];
              let callback = function(){
                updateTextNode(instance, node, query);
              }
              return callback;
            },
        
          });
        }
      }
      
    }
  return $connections;
}

/**
 * Get's the original template element and creates a map of it's connections so we don't have to map it
 * everytime a component is connected;
 * @param {*} template
 * @returns
 */
export const generateTemplateConnectionMap = function (template) {
  let $clone = template.content;
  let $operationsIf = [...$clone.querySelectorAll("[data-el-if]")];
  let $operationsFor = [...$clone.querySelectorAll("[data-el-for]")];

  const $connections = {};
  $connections.keywords = {};
  $connections.actions = {};
  $connections.operations = {
    "*if": disconnectOperations(template, $operationsIf, "*if", "data-el-if", {
      initial: true,
    }),
    ["*for"]: disconnectOperations(
      template,
      $operationsFor,
      "*for",
      "data-el-for",
      { initial: true }
    ),
  };

  // Now we get the elements with the generators out of the way
  $clone = template.content;
  let $elements = [...$clone.querySelectorAll("*")];

  for (let $element of $elements) {
    const attributes = $element.getAttributeNames();

    const actions = attributes.filter(
      (attribute) => attribute.indexOf("@") > -1
    );
    const bindings = attributes.filter(
      (attribute) => $element.getAttribute(attribute).indexOf("{{") > -1
    );
    let selector = getSelector($element);
    if (actions && actions.length > 0) {
      connectActions($element, selector, actions, $connections);
    }
    if (bindings && bindings.length > 0) {
      connectAttributes($element, selector, bindings, $connections);
    }

  }

  const $nodes = findTextNodes(template.content).filter(
    (el) => el.textContent.indexOf("{{") > -1
  );

  for(let $node of $nodes){
    connectTextNodes($node,$connections)
  }

  return $connections
  // Note that the *if and *for operations require a comment to placehold it's content
  // This comment needs to be initialized on the connectedCallback
  // So, for those operations we will replace the content for a generator function and a
  // placeholder element that will be replaced in the connectedCallback

 
};

/**
 * Checks if the expression is in front of a component defined property
 *
 *
 * @param { String  } template
 * @param { Integer } index
 * @param { String | property on the original template } originalExpression
 * @param { String | property on the parsed template } updatedExpression
 * @returns { String } parsed expression
 */

export const parseTemplateString = function (
  template,
  index,
  originalExpression,
  updatedExpression
) {
  let parsedTemplate = template;
  let nextChar = template.charAt(index + originalExpression.length);
  let prevChar = template.charAt(index - 1);
  let prevValid = index == 0 || (!isChar(prevChar) && prevChar != ".");
  let nextValid =
    index + originalExpression.length > template.length || !isChar(nextChar);
  if (prevValid && nextValid) {
    parsedTemplate = template.split("");
    let leftTemplate = template.slice(0, index);
    let rightTemplate = template.slice(index + originalExpression.length);
    parsedTemplate = leftTemplate + updatedExpression + rightTemplate;
  }
  return parsedTemplate;
};

/**
 * Runs once when needs to call the component/element initial template expression parsing and pointers map.
 * Creates a template element to be reused for later when instanciating new components
 *
 * 1- Creates a template element and attached it to the head
 * 2- With the string representation of the component's template.
 * 2.1 - Finds every place where the component has '{{' and get's what actions/props are being used and where on this template.
 * 2.2 - Replaces simple expressions like {{foo}} by {{this.foo}} which is way easier to connect with bindings and events in the connectedCallback stage.
 * 3- Finds operations placement like *if and *for
 * 3.1 - Parses the operation attribute's expression like described above ( without moustaches - in order to avoid collisions in the future stages )
 * 4- Cleans unecessary whitespace on edges
 * 5- Cleans unecessary text nodes between elements
 * 6- Returns the cleaned template.
 *
 * @Once
 *
 * @param {   String    } template
 * @param {   Component } component
 * @param {   String    } selector
 *
 * @returns { String } $template
 * @returns { Void } adds the new template to the header of the HTML page
 */
export const parseTemplatePointers = function (template, component, selector) {
  // Check if exists
  const $templateId = "el-component-template__" + selector;
  const $head = document.querySelector("head");
  let $template = $head.querySelector($templateId);

  if (!$template) {
    // Component predefined reactivity constants
    const props = component.props || [];
    const actions = component.actions || [];

    // Create the template to be mapped and reused
    $template = document.createElement("template");

    // Find all actions of the template and rewite with the correct synthax
    // if the match is parent tracked, adds the parent pointer
    let matches = getStrBetween(template) || [];

    for (let match of matches) {
      let m = match;
      for (let action of actions) {
        let indexes = getIndexes(match, action);
        if (indexes.length > 0) {
          indexes.reverse();
          for (let index of indexes) {
            m = parseTemplateString(m, index, action, "this.parent." + action);
          }
        }
      }
      template = template.replaceAll("{{" + match + "}}", "{{" + m + "}}");
    }

    // Finds all the ocorrences of the reactive properties and replaces them with the
    // correct synthax {{ this.property ...remainder }}
    matches = getStrBetween(template);
    for (let match of matches) {
      let m = match;
      for (let prop of props) {
        let indexes = getIndexes(match, prop);
        if (indexes.length > 0) {
          indexes.reverse();
          for (let index of indexes) {
            m = parseTemplateString(m, index, prop, "this." + prop);
          }
        }
      }
      template = template.replaceAll("{{" + match + "}}", "{{" + m + "}}");
    }

    // Finds all the ocorrences of the operator *if and replaces with the corresponding expression
    // *if=" this.property ...condition"
    matches = getStrBetween(template, '*if="', '"');
    for (let match of matches) {
      let m = match;
      for (let prop of props) {
        let indexes = getIndexes(match, prop);
        if (indexes.length > 0) {
          indexes.reverse();
          for (let index of indexes) {
            m = parseTemplateString(m, index, prop, "this." + prop);
          }
        }
      }
      template = template.replaceAll(
        '*if="' + match + '"',
        '*if="' + m + '" data-el-if="true"'
      );
    }

    // Finds all the ocorrences of the operator *for and replaces with the corresponding expression
    // *for="targetAttribute of sourceAttribute" - this will require further parsing in the future because of the nested loops
    // let matchIndex
    matches = getStrBetween(template, '*for="', '"');
    for (let match of matches) {
      let m = match.trim();
      let expressionParts = m
        .split(";")
        .map((expression) => expression.trim())
        .filter((expression) => expression.length > 0);
      let queryPart = expressionParts[0];
      let queryParameters = queryPart
        .split(" of ")
        .map((part) => "{" + part.trim() + "}")
        .filter((part) => part.length > 2);

      let targetAttribute = queryParameters[0]
        .replaceAll("{let ", "")
        .replaceAll("{const ", "")
        .replaceAll(" ", "")
        .replaceAll("}", "")
        .replaceAll("{", "");
      let sourceAttribute = queryParameters[1]
        .replaceAll(" ", "")
        .replaceAll("}", "");

      queryPart = targetAttribute + " of " + "this." + sourceAttribute;
      expressionParts[0] = queryPart;
      m = expressionParts.join(";").trim();

      template = template.replaceAll(
        '*for="' + match + '"',
        '*for="' + m + '" data-el-for="true"'
      );
    }

    // Remove unecessary whitespace between elements
    matches = getStrBetween(template, ">", "<");
    for (let match of matches) {
      template = template.replaceAll(
        ">" + match + "<",
        ">" + match.trim() + "<"
      );
    }

    // Remove breakpoints and marginal whitespace
    template = template
      .replaceAll("\\r", "")
      .replaceAll("\\n", "")
      .replaceAll("\r\n", "")
      .replaceAll("  ", " ")
      .trim();

    $template.setAttribute("id", $templateId);
    $template.innerHTML = template;
    $head.appendChild($template);
  }
  return $template;
};
