import { TemplateManager } from "../component/template/manager";


class _Registry {
  static instance;

  constructor() {
    if (_Registry.instance) return _Registry.instance;
    _Registry.instance = this;
  }

  __components = {};
  __loadingState = {};

  registerComponent(config, component, template) {
    console.log(component)
    const templateString = "";

    this.__components[config.selector] = {
      object: component,
      props: [],
      actions: [],
      template: template,
      templateString: templateString,
      styles: "",
      config: config,
      map: {},
      childTemplates: [],
      loading: false,
      initialized: false,
    };

    // this.__loadingState[config.selector ];

    let stateResolve;
    this.__loadingState[config.selector] = new Promise((resolve) => {
      stateResolve = resolve;
    });
    this.__parseComponent(config,template,component).then((template) => {
      stateResolve(template);
    });
  }

  registerSelector(config, Component) {
    if (customElements.get(config.selector) === undefined) {
      Component.observedActions = Component.prototype.observedActions;
      Component.observedAttributes = Component.prototype.observedAttributes;

      this.registerComponent(config.selector, Component);

      customElements.define(config.selector, Component);
    }
  }

  loadComponent(selector) {
    return this.__loadingState[selector];
  }

  __parseComponent(config,template,scope) {
    console.log(scope,template)
    return new Promise((res) => {
      const $template = new TemplateManager(config,config.template,scope)
      setTimeout(() => {
        console.log(config.selector);
        res($template);
      }, 10);
    });
  }
}

export const Registry = new _Registry();
