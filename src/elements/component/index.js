import { getPath2 } from "../../../elements/compiler/model/update";
import {
  addCustomListener,
  addModelListener,
  setOperationFor,
  setOperationIf,
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
import { generateTemplateConnectionMap, parseTemplatePointers } from "../render/hydration";
import { connectProperties } from "./props";
// import { bindEventBroadcaster } from "../compiler/events/listeners";

function validatorSelector() {}
function validatorTemplate() {}
function loadTemplate() {}

// const defaultConfig = {
//   selector: { required: true, value: "", validations: [validatorSelector] },
//   shadow: { required: false, value: false },
//   template: {
//     required: true,
//     value: "",
//     validations: [validatorTemplate],
//     setup: [loadTemplate],
//   },
//   styles: {
//     required: false,
//     value: "",
//     validations: [validatorTemplate],
//     setup: [loadTemplate],
//   },
// };

class _ComponentRegistry {
  static instance = null;

  __id = 0;
  __registry = {};

  constructor() {
    if (_ComponentRegistry.instance) return _ComponentRegistry.instance;
    _ComponentRegistry.instance = this;
  }
  /*
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
  */
  __parseTemplatePointers(template, component, selector) {

    return parseTemplatePointers(template,component,selector);
  }

  __mapTemplateConnections = function (template) {

    const $connections = generateTemplateConnectionMap(template);
    
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
        const $template = parseTemplatePointers(
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

    for (let keyword of Object.keys(connections.keywords)) {
      for (let connection of connections.keywords[keyword]) {
        const callback = connection.setup(this);
        let subscription = this.__connect(getPath2(keyword), () =>
         
          callback(this)
        );
        this.__subscriptions.push(subscription);
        callback(this);
      }
    }

    for (let selector of Object.keys(connections.actions)) {
      for (let action of connections.actions[selector]) {
        action.setup(this);
      }
    }

    for (let op of Object.keys(connections.operations)) {
        for(let operation of connections.operations[op]) {
          operation.setup(this);
        }
      
    }
    
    // this.[keyword]
    connectProperties(this);

    /*
    for (let prop of Object.keys(connections.keywords).filter(
      (p) => this.constructor.props.indexOf(p) == -1
    )) {

    }
    */
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
