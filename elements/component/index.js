import { Compile } from "../compiler";

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
    required: true,
    value: "",
    validations: [validatorTemplate],
    setup: [loadTemplate],
  },
};

class _ComponentRegistry {
  static instance = null;

  __registry = {};

  constructor() {
    if (_ComponentRegistry.instance) return _ComponentRegistry.instance;
    _ComponentRegistry.instance = this;
  }

  register(config, component) {
    const { selector, template, styles, shadow } = { ...config };
    if (!this.__registry.hasOwnProperty(selector)) {
      if (customElements.get(selector) === undefined) {
        const $head = document.head;
        const $style = document.createElement("style");
        $style.innerHTML = styles;
        this.__registry[selector] = {
          component,
          template,
          styles: $style,
          shadow: shadow,
        };
        if (!shadow) {
          $head.appendChild($style);
        }
        customElements.define(config.selector, component);
      }
    }
    // customElements.define(selector, component);
  }

  setup() {}
  load(componentName) {}
}

const ComponentRegistry = new _ComponentRegistry();

export class Component extends HTMLElement {
  // component implementation goes here

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
    this.__template = this.constructor.config.template;
    this.__style = this.constructor.config.styles;
  }

  __extractAttributes() {
    const props = this.props || {};
    props.__connections = [];
    // this.__connections = [];

    this.__onConnect = () => {
      try {
        let connections = this.__connections || props.__connections || [];
        connections.map((connection) => connection());
        connections = [];
      } catch (ex) {
        console.log(this, props, ex);
      }
    };
    let propkeys = Object.keys(props || {});
    const attributes = this.getAttributeNames().filter(
      (attr) => propkeys.indexOf(attr) > -1
    );

    for (let attribute of attributes) {
      props[attribute] = this.getAttribute(attribute);
      try {
        props[attribute] = JSON.parse(props[attribute]);
      } catch (ex) {
        if (!isNaN(props[attribute])) {
          props[attribute] = Number(props[attribute]);
        } else if (["false", false].indexOf(props[attribute]) > -1) {
          props[attribute] = false;
        } else if (["true", true].indexOf(props[attribute]) > -1) {
          props[attribute] = true;
        }
      }
    }

    return props;
  }

  connectedCallback() {

    if (!this.__initialSetup) {

      this.__initialSetup = true;
      this.innerHTML = this.__template;
      const props = this.__extractAttributes();
      
      Compile(this, props);
    }
  }
}
