/**
 * Action
 * Makes the observedActions available to the constructor
 * The component becomes aware that exists a method with this name that
 * his purpose is to process data and send the output to be processed in a method of the parent controller
 * @decorator
 * @param {} value
 * @returns
 */

export const Action = function () {
  return function (target, propertyKey, descriptor) {
    // console.log("ACTION", this, target, propertyKey, descriptor);
    if (!target.constructor.observedActions) {
      target.constructor.prototype.observedActions = [];
      target.constructor.observedActions =
        target.constructor.observedActions || [];
    }
    if (
      target.constructor.prototype.observedActions.indexOf(propertyKey) == -1
    ) {
      target.constructor.prototype.observedActions.push(propertyKey);
    }

    const originalFunction = descriptor.value;
    descriptor.value = async function () {
      const parentMethod = this.getAttribute("(" + propertyKey + ")");
      const result = await originalFunction.call(this, ...arguments);
      if (
        parentMethod &&
        this.controller &&
        typeof this.controller[parentMethod] === "function"
      ) {
        this.controller[parentMethod](result);
      }
    };
  };
};
