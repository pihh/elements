import {
  addCustomListener,
  addModelListener,
  getSelector,
  updateAttribute,
  updateTextNode,
} from "../compiler/elements/dom";
import { findTextNodes } from "../helpers/dom";
import {
  getExpressionProperties,
  getIndexes,
  getStrBetween,
  isChar,
} from "../helpers/regex";
import { pathName } from "../signals/proxy";

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
) {
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
  return $connections;
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
let id = 0;

/*
export const applyConnections = function (instance, connections) {
  instance.scope = instance.scope || {};
  instance.__subscriptions = instance.__subscriptions || [];

  for (let keyword of Object.keys(connections.keywords)) {
    for (let connection of connections.keywords[keyword]) {
      const callback = connection.setup(instance);
      let subscription = instance.__connect(getPath2(keyword), () =>
        callback(instance)
      );
      instance.__subscriptions.push(subscription);
      callback(instance);
    }
  }

  for (let selector of Object.keys(connections.actions)) {
    for (let action of connections.actions[selector]) {
      action.setup(instance);
    }
  }

  for (let op of Object.keys(connections.operations)) {
    for (let operation of connections.operations[op]) {
      console.log(operation);

      operation.setup(instance);
    }
  }
};
*/
export function connectTextNodes($node, $connections) {
  let $container = $node.parentNode;

  if (!$container) {
    let $clone = $node.cloneNode(true);
    $container = document.createElement("span");
    $node.replaceWith($container);
    $container.appendChild($clone);
    $node = $clone;
  }
  let parent = getSelector($container);
  let parentChildNodes = $container?.childNodes || [];

  for (let i = 0; i < parentChildNodes.length; i++) {
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
          setup: function (instance) {
            let element = instance.querySelector(parent).childNodes[nodeIndex];
            let callback = function () {
              updateTextNode(instance, element, query);
            };
            return callback;
          },
        });
      }
    }
  }
  return $connections;
}

const connectIfOperations = function ($container, operations = []) {
  const query = $container.getAttribute("*if");
  $container.removeAttribute("*if");
  $container.dataset.elIfDone = operations.length + Date.now();
  delete $container.dataset.elIf;
  if (query) {
    operations.push({
      $container,
      query,
      setup: function (instance) {
        const $placeholder = document.createComment("#if placeholder#");
        const $$container = instance.querySelector(
          '[data-el-if-done="' + $container.dataset.elIfDone + '"]'
        );

        const keywords = getExpressionProperties("{{" + query.trim() + "}}");
        if (!$$container) return;
        const callback = function (forceTrue = false) {
          const fn = Function("return `${" + query + "}`");
          const output = fn.call(instance);
          if (["true", true].indexOf(output) !== -1 || forceTrue) {
            $placeholder.after($$container);
          } else {
            if ($$container.isConnected) {
              $$container.remove();
            }
          }
        };
        $placeholder.before($$container);

        for (let keyword of keywords) {
          instance.__connect(keyword, callback);
        }
        
        return callback;
      },
    });
  }

  for (let op of [...$container.querySelectorAll("[data-el-if]")]) {
    operations = connectIfOperations(op, operations); //
  }

  return operations;
};

/**
 * Get's the original template element and creates a map of it's connections so we don't have to map it
 * everytime a component is connected;
 * @param {*} template
 * @returns
 */
export const generateTemplateConnectionMap = function (template) {
  let $clone = template.content;
  let $operationsIf = [...template.content.querySelectorAll("[data-el-if]")];
  let $operationsFor = [...template.content.querySelectorAll("[data-el-for]")];
  const $connections = {};
  $connections.keywords = {};
  $connections.actions = {};
  $connections.operations = {
    "*if": [],
    "*for": [],
  };

  let operations = [];

  for (let $container of $operationsIf) {
    const query = $container.getAttribute("*if");
    $container.removeAttribute("*if");
    $container.dataset.elIf = operations.length + Date.now();
    if (query) {
      operations.push({
        $container,
        query,
        setup: function (instance) {
          const $placeholder = document.createComment("#if placeholder#");
          const $$container = instance.querySelector(
            '[data-el-if="' + $container.dataset.elIf + '"]'
          );
          $$container.before($placeholder);
      
          const keywords = getExpressionProperties("{{" + query.trim() + "}}");
          const callback = function () {
            const fn = Function("return `${" + query + "}`");
            const output = fn.call(instance);
            if (["true", true].indexOf(output) > -1) {
              $placeholder.before($$container);
            } else {
              $$container.remove();
            }
          };

          for (let keyword of keywords) {
            instance.__connect(keyword, callback);
          }

          delete $$container.dataset.elIf;
          return callback;
        },
      });
    }
  }
  $connections.operations["*if"] = operations;

  operations = [];
  for (let $container of $operationsFor) {
    const query = $container.getAttribute("*for");
    let $template = $container.cloneNode(true);
    let $wrapper = document.createElement("div");
    $wrapper.before($template);
    $template.removeAttribute("*for");
    $wrapper.appendChild($template);

    $container.dataset.elFor = operations.length + Date.now();
    $container.removeAttribute("*for");
    $container.innerHTML = "";
    // console.log($wrapper);
    const $indexKey = "__$index__";
    let matches = getStrBetween($wrapper.innerHTML);
  
    for (let match of matches) {
      // if (match.indexOf($container.dataset.elForQueryFind) > -1) {

      let m = match.replaceAll(
        $container.dataset.elForQueryFind,
        $container.dataset.elForQueryReplace + "[" + $indexKey + "]"
      );

      $wrapper.innerHTML = $wrapper.innerHTML.replaceAll(match, m);
     
    }

    $template = $wrapper.firstElementChild;
 
    if (query) {
      operations.push({
        $container,
        query,
        $template: $template,
        setup: function (instance) {
          const $placeholder = document.createComment("#for placeholder#");
          const $$container = instance.querySelector(
            '[data-el-for="' + $container.dataset.elFor + '"]'
          );
          $$container.replaceWith($placeholder);
          // $$container.before($placeholder);
          $placeholder.__forStore = [];
          $placeholder.__forDisplay = [];
          $placeholder.__generateForItem = function (index) {
            const $item = $template.cloneNode(true);
            let $wrapper = document.createElement("div");
            $wrapper.appendChild($item);
            $wrapper.innerHTML = $wrapper.innerHTML.replaceAll(
              $indexKey,
              index
            );
            $wrapper.innerHTML = $wrapper.innerHTML;
           $wrapper = $wrapper.firstElementChild

             $placeholder.before($wrapper);
             $placeholder.__forStore.push($wrapper);
            let $wcons = generateTemplateConnectionMap({ content: $wrapper });
      
              
            for (let keyword of Object.keys($wcons.keywords)) {
              for (let connection of $wcons.keywords[keyword]) {
                const callback = connection.setup(instance);
       
                let subscription = instance.__connect(pathName(keyword), () => {
                  
                  callback(instance);
                });

             

                instance.__subscriptions.push(subscription);
                callback(instance);
              }
            }

            for (let selector of Object.keys($wcons.actions)) {
              for (let action of $wcons.actions[selector]) {
                action.setup(instance);
              }
            }

            const operationCallbackList = [];
            for (let op of Object.keys($wcons.operations)) {
              for (let operation of $wcons.operations[op]) {
                operationCallbackList.push(operation.setup(instance));
              }
            }

            operationCallbackList.map((e) => e());
            return $wrapper;
          };

          // $placeholder.before($wrapper);
          $placeholder.__balanceItems = function (len) {
            if (len > $placeholder.__forStore.length) {
              for (let i = $placeholder.__forStore.length; i < len; i++) {
                $placeholder.__generateForItem(i);
              }
            }
            if (len > $placeholder.__forDisplay.length) {
              for (let i = $placeholder.__forDisplay.length; i < len; i++) {
                let $item = $placeholder.__forStore[i];
                $placeholder.__forDisplay.push($item);
                $placeholder.after($item);
              }
            } else if (len < $placeholder.__forDisplay.length) {
              for (let i = $placeholder.__forDisplay.length; i > len; i--) {
                $placeholder.__forDisplay[i].remove();
              }
              $placeholder.__forDisplay = $placeholder.__forDisplay.slice(
                0,
                len
              );
            }
            // console.log(len);
          };

          const callback = function () {
            const query =
              "`${" + $container.dataset.elForQueryReplace + ".length}`";
            const fn = Function("return " + query);
            const output = fn.call(instance);
            $placeholder.__balanceItems(Number(output));
          };
       
          instance.__connect(
            $container.dataset.elForQueryReplace +
              ".length".replaceAll("this.", ""),
            callback
          );
          callback();
          delete $$container.dataset.elFor;
          return callback;

        },
      });
    }
  }

  $connections.operations["*for"] = operations;

  // $operationsFor.map((el) => el.remove());
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
    
    
  for (let $node of $nodes) {
    
    connectTextNodes($node, $connections);
  }

  return $connections;
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
export const parseTemplatePointers = function (
  template,
  component,
  selector,
  config = {}
) {
  config = {
    templateId: false,
    ...config,
  };
  // Check if exists
  const $templateId = config.templateId || "el-component-template__" + selector;
  const $head = document.querySelector("head");
  let $template = $head.querySelector("#" + $templateId);

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
        ' data-el-if="true"  *if="' + m + '" '
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
      // console.log(expressionParts, queryPart);


      let queryParameters = queryPart
        .split(" of ")
        .map((part) => "{ " + part.trim() + " }")
        .filter((part) => part.length > 2);

      let targetAttribute = queryParameters[0]
        .replaceAll("{ let ", "")
        .replaceAll("{ const ", "")
        .replaceAll(" ", "")
        .replaceAll("}", "")
        .replaceAll("{", "")
        .trim();

      let sourceAttribute = queryParameters[1]
        .replaceAll(" ", "")
        .replaceAll("}", "")
        .replaceAll("{", "")
        .trim();

      

      queryPart = targetAttribute + " of " + "this." + sourceAttribute;
      expressionParts[0] = queryPart;
      m = expressionParts.join(";").trim();

      template = template.replaceAll(
        '*for="' + match + '"',
        'data-el-for="true" *for="' +
          m +
          '"  data-el-for-query-find="' +
          targetAttribute +
          '" data-el-for-query-replace="this.' +
          sourceAttribute +
          '"'
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
