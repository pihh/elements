const validateObservedAttributes = function (target) {
  if (!target.constructor.observedAttributes) {
    target.constructor.prototype.observedAttributes = [];
    target.constructor.observedAttributes =
      target.constructor.observedAttributes || [];
  }
};
export const Prop = function (value) {
  return function (target, propertyKey, descriptor) {
    validateObservedAttributes(target);
    if (
      target.constructor.prototype.observedAttributes.indexOf(propertyKey) == -1
    ) {
      target.constructor.prototype.observedAttributes.push(propertyKey);
    }
    descriptor[propertyKey] = value;
    console.log(target)
  };
};
