const defaultConfig = {
  shadow: false,
  styles: "",
};

export const Component = function (config = {}) {
  config = {
    ...defaultConfig,
    ...config,
  };

  return function (component, context) {
    console.log(...arguments);
    class Component extends component {
      static observedAttributes = ["if", "for", "skip"];
      static observedActions = [];

      constructor() {
        super();
        console.log({ component, context });
      }
    }

    if (customElements.get(config.selector) === undefined) {
      // Component.observedActions = Component.prototype.observedActions;
      // Component.observedAttributes = Component.prototype.observedAttributes;
      customElements.define(config.selector, Component);
    }
    return Component;
  };
};
