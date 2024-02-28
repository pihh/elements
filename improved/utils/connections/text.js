import { parseText } from "../eval";

export const connectText = function (instance, element, config) {
  let target = element.childNodes[config.childNode];
  for (let listener of config.listeners) {
    // console.log(listener,config.expression)
    const subscription = (expression) => {
      target.textContent = parseText(instance, expression);
      // console.log(this)
    };
    instance.subscribe(listener, function () {
        subscription(config.expression);
      });
    subscription(config.expression);
  }

  delete element.dataset[config.selectorCamel];
};
