import { getPath, getPath2 } from "../../../elements/compiler/model/update";
import { getSelector, updateAttribute } from "../compiler/elements/dom";
import { findTextNodes } from "../helpers/dom";
import { getExpressionProperties, getIndexes, getStrBetween } from "../helpers/regex";

export class Render{
  __id= 0;
  __parseTemplateString = function (
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
  __parseTemplatePointers(template, instance) {

    let matches = [];
    const props = instance.props || [];
    const actions = instance.actions || [];
    const $template = document.createElement("template");
    const $head = document.querySelector("head");
    matches = getStrBetween(template);

    for (let match of matches) {
      let m = match;
      for (let action of actions) {
        let indexes = getIndexes(match, action);
        if (indexes.length > 0) {
          indexes.reverse();
          for (let index of indexes) {
            m = this.__parseTemplateString(
              m,
              index,
              action,
              "this.parent." + action
            );
          }
        }
      }
      template = template.replaceAll("{{" + match + "}}", "{{" + m + "}}");
    }

    matches = getStrBetween(template);
    for (let match of matches) {
      let m = match;
      for (let prop of props) {
        let indexes = getIndexes(match, prop);
        if (indexes.length > 0) {
          indexes.reverse();
          for (let index of indexes) {
            m = this.__parseTemplateString(m, index, prop, "this." + prop);
          }
        }
      }
      template = template.replaceAll("{{" + match + "}}", "{{" + m + "}}");
    }

    // $template.setAttribute("id", "el-component-template__" + selector);
    $template.innerHTML = template;
    $head.appendChild($template);

    return $template;
  }

  __mapTemplateConnections = function (template) {
    let $clone = template//.content; //.cloneNode(true);
    let $elements = [...$clone.querySelectorAll("*")];

    const $connections = {};
    $connections.keywords = {};
    $connections.actions = {};
    $connections.operations = {};

    let $forLoops = $elements.filter(
      (el) => el.getAttributeNames().indexOf("*for") > -1
    );
    for (let $for of $forLoops) {
      const $comment = setOperationFor($for);

      let parent = getSelector($comment.parentElement);
      let parentElement = $comment.parentElement;
      let nodeIndex = 0;
      for (let $child of parentElement.childNodes) {
        if ($child == $comment) {
          break;
        }
        nodeIndex++;
      }
      // $comment.__forLoopGenerator($comment)
      if (!$connections.operations.hasOwnProperty("*for")) {
        $connections.operations["*for"] = [];
      }
      let query;
      let originalQuery;
      let value;
      $connections.operations["*for"].push({
        attribute: "comment",
        type: "*for",
        query,
        originalQuery: value,
        selector: parent, //+"childNodes["+i+"]",
        nodeIndex: nodeIndex,
        setup: function (instance) {
          try {
            let element = instance.controller.parentElement.querySelector(parent).childNodes[nodeIndex];
            element.controller = instance
            element.__loopItems = [];
            element.__visibleItems = [];
            element.callback = (instance)=>{
              $comment.__forLoopManager(instance.colors,element) 
            }
            instance.controller.__connect("colors.length",function(v){
              console.log('cb',instance.colors)
              element.callback(instance);
            })
            // $comment.__forLoopGenerator(instance,element,instance.colors.length)
            element.callback(instance.colors.length);

          } catch (ex) {
            console.warn(ex);
          }
        },
      });
    }

    $clone = template.content; //.cloneNode(true);
    $elements = [...$clone.querySelectorAll("*")];

    for (let $element of $elements) {
      const attributes = $element.getAttributeNames();
      const operations = attributes.filter(
        (attribute) => attribute.indexOf("*") == 0
      );
      const actions = attributes.filter(
        (attribute) => attribute.indexOf("@") > -1
      );
      const bindings = attributes.filter(
        (attribute) => $element.getAttribute(attribute).indexOf("{{") > -1
      );

      if (operations.length > 0 || actions.length > 0 || bindings.length > 0) {
        let selector = getSelector($element);

        if (!selector) {
          $element.setAttribute(
            "id",
            $element.getAttribute("id") || "el-component-" + this.__id + Date.now()
          );

          selector = $element.nodeName + "#" + $element.id;
          this.__id++;
        }

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
              let element = instance.controller.parentElement.querySelector(selector);
              if (action.indexOf("model") > -1) {
                const callback = addModelListener(
                  instance,
                  element,
                  targetAttribute
                );
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
                callback(
                  instance,
                  element,
                  action.replaceAll("@", ""),
                  act,
                  args
                );
                element.removeAttribute(action);
                return callback;
              }
            },
          });
        }
        for (let attribute of bindings) {
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
              callback: function (instance) {
                try {
                  let element = instance.parentElement.querySelector(selector);
                  console.log({instance:instance.parentElement,element,selector});
                  updateAttribute(instance.controller, element.parentElement, attribute, query);
                } catch (ex) {
                  console.log(instance)
                  console.log(instance.parentElement)
                  console.warn(ex);
                }
              },
            });
          }
        }
      }
    }

    const $nodes = findTextNodes(template.content).filter(
      (el) => el.textContent.indexOf("{{") > -1
    );

    // findTextNodes(template.content).map(console.log)
    // console.log({ $nodes });

    $nodes.forEach((node) => {
      let parent = getSelector(node.parentElement);
      let parentElement = node.parentElement;
      let parentChildNodes = parentElement?.childNodes || [];
      let i = 0;

      for (let childNode of parentChildNodes) {
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
              callback: function (instance) {
                try {
                  let element =
                    instance.controller.parentElement.querySelector(parent).childNodes[nodeIndex];
                  updateTextNode(instance, element, query);
                } catch (ex) {
                  console.warn(ex);
                }
              },
            });
          }
        }
        i++;
      }
    });
    // console.log({$connections})
    return $connections;
  };

  __initAndAppendConnections(template,instance){
     console.log(template)
     const $div = document.createElement('div');
     document.head.appendChild($div)
     $div.innerHTML = template.outerHTML;
     ;

    const $template = this.__parseTemplatePointers(
      $div.innerHTML,
      instance,
      
    );
    const connections = this.__mapTemplateConnections(
      $template,
      instance
    );
  
    console.log({template,connections,$template})
    for (let selector of Object.keys(connections.operations)) {
      // for (let keyword of Object.keys(connections[selector].keywords)) {
      for (let operation of connections.operations[selector]) {
        operation.setup(instance);
      }
    }

    for (let keyword of Object.keys(connections.keywords)) {
      // for (let keyword of Object.keys(connections[selector].keywords)) {
      for (let connection of connections.keywords[keyword]) {
        let subscription = instance.controller.__connect(getPath2(keyword), () =>
          connection.callback(instance)
        );
        instance.controller.__subscriptions.push(subscription);
        connection.callback(instance);
      }
    }

    for (let selector of Object.keys(connections.actions)) {
      // for (let keyword of Object.keys(connections[selector].keywords)) {
      for (let action of connections.actions[selector]) {
        action.setup(instance);
      }
    }
    $div.remove()
  }
}