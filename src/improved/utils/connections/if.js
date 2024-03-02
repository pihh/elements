import { parseText } from "../eval";
import { Parser } from "../parser";

export const connectIf = function (instance, baseElement, config) {
  const containers = [];
  console.log({config,instance,baseElement})
  // debugger
  for (let condition of config.conditions) {
    let el = baseElement.querySelector(condition.selector);
    let placeholder = document.createComment("if placeholder");

    el.before(placeholder);
    placeholder.__content = el;

    const subscription = (expression) => {
      let result = parseText(instance, expression);

      if (Parser.boolean(result) == true) {
        placeholder.before(placeholder.__content);
      } else {
        placeholder.__content.remove();
      }
    };
    for (let listener of condition.listeners) {
      instance.subscribe(listener, function () {
        subscription(condition.expression);
      });
    }
    containers.push(placeholder);
  }
};
