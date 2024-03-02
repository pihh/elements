
import { compileTemplate } from "./template-compiler";

export const extractComponentConfiguration = function (component, config) {
  config.template = config.template.trim();

  // Get component default arguments
  const Instance = new component();
  const componentConfiguration = {
    ...config,
  };
  
  const observedAttributes = Object.keys(Instance);
  const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(Instance));

  const { template, operations } = compileTemplate(
    componentConfiguration.template,
    observedAttributes
  );
  componentConfiguration.template = template;

  componentConfiguration.observedAttributes = observedAttributes;
  componentConfiguration.observedAttributeTypes = {};
  componentConfiguration.observedAttributeDefaultValues = {};

  observedAttributes.map((attr) => {
    componentConfiguration.observedAttributeTypes[attr] = typeof Instance[attr];
    try {
      componentConfiguration.observedAttributeDefaultValues[attr] =
        Instance[attr];
    } catch (ex) {
      //console.log(attr, Instance);
    }
  });

  componentConfiguration.methods = methods;

  componentConfiguration.reactivity = operations;

  return componentConfiguration;
};
