import {
  addCustomListener,
  addModelListener,
  setOperationFor,
  updateAttribute,
  updateTextNode,
} from "../compiler/elements/dom";
import { getSelector } from "../compiler/elements/dom";
import { State } from "../compiler/state";

import { findTextNodes } from "../helpers/dom";
import {
  getExpressionProperties,
  getIndexes,
  getStrBetween,
  isChar,
} from "../helpers/regex";
// import { bindEventBroadcaster } from "../compiler/events/listeners";

function validatorSelector() {}
function validatorTemplate() {}
function loadTemplate() {}

const defaultConfig = {
  selector: { required: true, value: "", validations: [validatorSelector] },
  shadow: { required: false, value: false },
  template: {
    required: true,
    value: "",
    validations: [validatorTemplate],
    setup: [loadTemplate],
  },
  styles: {
    required: false,
    value: "",
    validations: [validatorTemplate],
    setup: [loadTemplate],
  },
};

class _ComponentRegistry {
  static instance = null;

  __registry = {};
  __id = 0;
  constructor() {
    if (_ComponentRegistry.instance) return _ComponentRegistry.instance;
    _ComponentRegistry.instance = this;
  }
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
  __parseTemplatePointers(template, component, selector) {
    let matches = [];
    const props = component.props || [];
    const actions = component.actions || [];
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

    $template.setAttribute("id", "el-component-template__" + selector);
    $template.innerHTML = template;
    $head.appendChild($template);

    return $template;
  }

  __mapTemplateConnections = function (template) {
    let $clone = template.content; //.cloneNode(true);
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
            let element = instance.querySelector(parent).childNodes[nodeIndex];
            element.controller = instance
            element.__loopItems = [];
            element.__visibleItems = [];
            element.callback = (instance)=>{
              $comment.__forLoopManager(instance.colors,element) 
            }
            instance.__connect("colors.length",function(v){
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
            $element.getAttribute("id") || "el-component-" + this.__id
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
              let element = instance.querySelector(selector);
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
                  let element = instance.querySelector(selector);
                  updateAttribute(instance, element, attribute, query);
                } catch (ex) {
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
                    instance.querySelector(parent).childNodes[nodeIndex];
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

  register(config, component) {
    let { selector, template, styles, shadow } = { ...config };
    if (!this.__registry.hasOwnProperty(selector)) {
      if (customElements.get(selector) === undefined) {
        const $head = document.head;
        let $style;
        if (styles) {
          $style = document.createElement("style");
          $style.innerHTML = styles;
        }
        const $template = this.__parseTemplatePointers(
          template,
          component,
          selector
        );
        const $connections = this.__mapTemplateConnections(
          $template,
          component
        );
        this.__registry[selector] = {
          component,
          template: $template,
          connections: $connections,
          styles: $style,
          shadow: shadow,
        };
        if (!shadow && $style) {
          $head.appendChild($style);
        }

        customElements.define(config.selector, component);
      }
    }
  }

  setup() {}
  load(selector) {
    const registry = this.__registry[selector];
    const template = registry.template.content.cloneNode(true);
    const connections = registry.connections;
    this.setup(template, connections);
    const id = registry.id;
    return {
      template,
      connections,
      id,
    };
  }
}

const ComponentRegistry = new _ComponentRegistry();

export class Component extends HTMLElement {
  static register(component) {
    const config = {
      shadow: false,
      template: `<h1>${component.config.selector} is registered</h1>`,
      styles: ``,
      ...component.config,
    };
    ComponentRegistry.register(config, component);
  }

  constructor() {
    super();
    this.__config = this.constructor.config;
    const { template, connections } = ComponentRegistry.load(
      this.__config.selector
    );

    this.__template = template;
    this.__templateConnections = connections;
    this.appendChild(this.__template);

    // for(let )
    // this.innerHTML = this.__template;
    /*
    this.__config = this.constructor.config;
    this.__template = this.constructor.config.template;

    this.__style = this.constructor.config.styles;
    this.__templateId = "template-container-" + this.__config.selector;
    this.__templateContent = this.__getTemplateElement(true);

    if (!this.dataset.connected) {
      this.appendChild(this.__templateContent);
      this.dataset.connected = "true";
    }
  

    CompileSlots(this);
    DisconnectSlots(this);

    this.__template = this.innerHTML;
    */
  }

  __getTemplateElement(clone = false) {
    let $template = this.__templateElement;
    if (!$template) {
      $template = document.querySelector("#" + this.__templateId);
      if (!$template) {
        const $head = document.querySelector("head");
        $template = document.createElement("template");
        $template.setAttribute("id", this.__templateId);
        $template.innerHTML = this.__template;
        $head.appendChild($template);
      }
      this.__templateElement = $template;
    }
    if (clone) {
      $template = this.__templateElement.content.cloneNode(true);
    }
    return $template;
  }

  __initAndApplyConnections = function () {
    const connections = this.__templateConnections;
    
    this.scope = {};
    this.__subscriptions = [];

    for (let selector of Object.keys(connections.operations)) {
      // for (let keyword of Object.keys(connections[selector].keywords)) {
      for (let operation of connections.operations[selector]) {
        operation.setup(this);
      }
    }

    for (let keyword of Object.keys(connections.keywords)) {
      // for (let keyword of Object.keys(connections[selector].keywords)) {
      for (let connection of connections.keywords[keyword]) {
        let subscription = this.__connect(keyword, () =>
          connection.callback(this)
        );
        this.__subscriptions.push(subscription);
        connection.callback(this);
      }
    }

    for (let selector of Object.keys(connections.actions)) {
      // for (let keyword of Object.keys(connections[selector].keywords)) {
      for (let action of connections.actions[selector]) {
        action.setup(this);
      }
    }

    // this.[keyword]
    for (let prop of this.constructor.props) {
      this.__defineGetter__(prop, () => {
        return this.__scope[prop];
      });
      this.__defineSetter__(prop, (value) => {
        if (typeof this.__scope[prop] == "object") {
          return this.__scope[prop];
        }
        this.__scope[prop] = value;
        return true;
      });
    }
    for (let prop of Object.keys(connections.keywords).filter(
      (p) => this.constructor.props.indexOf(p) == -1
    )) {
      // this.__defineGetter__(prop, ()=>{
      //   return this.__scope[prop];
      // })
      // this.__defineSetter__(prop, (value)=>{
      //   if(typeof this.__scope[prop]== "object"){
      //     return this.__scope[prop];
      //   }
      //   this.__scope[prop] = value
      //    return true
      // })
    }
    // delete this.__templateConnections[keyword];
  };

  connectedCallback() {
    if (!this.getAttribute("el-connected")) {
      this.setAttribute("el-connected", true);
      const props = this.constructor.props;
      const state = {};
      for (let prop of props) {
        // console.log({prop,self:this[prop]})
        state[prop] = this.getAttribute(prop) ?? this[prop];
      }

      const { scope, connect, render, pubsub } = State(state);

      this.__scope = scope;
      this.__connect = connect;
      this.__initAndApplyConnections();
    }
  }
}
