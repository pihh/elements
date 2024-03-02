import { parseText } from "../eval";

export const connectAttribute = function (instance, element, target, config) {
  for (let listener of config.listeners) {
    const subscription = (expression) => {
      target.setAttribute(config.attribute, parseText(instance, expression));
    };
    instance.subscribe(listener, function () {
      subscription(config.expression);
    });
  }

  delete element.dataset[config.selectorCamel];
};
