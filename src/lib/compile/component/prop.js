const validateObservedAttributes = function (target) {
  if (!target.constructor.observedAttributes) {
    target.constructor.prototype.observedAttributes = [];
    target.constructor.observedAttributes =
      target.constructor.observedAttributes || [];
  }
  if (!target.constructor.observedAttributeTypes) {
    target.constructor.prototype.observedAttributeTypes = {};
    target.constructor.observedAttributeTypes =
      target.constructor.observedAttributeTypes || {};
  }
  if (!target.constructor.observedAttributeValues) {
    target.constructor.prototype.observedAttributeValues = {};
    target.constructor.observedAttributeValues =
      target.constructor.observedAttributeValues || {};
  }
  return target;
};
export const Prop = function (value) {
  return function (target, propertyKey, descriptor) {
    target = validateObservedAttributes(target);

    if (
      target.constructor.prototype.observedAttributes.indexOf(propertyKey) == -1
    ) {
      target.constructor.prototype.observedAttributes.push(propertyKey);
    }
    descriptor[propertyKey] = value;
    if (
      !target.constructor.prototype.observedAttributeTypes.hasOwnProperty(
        propertyKey
      )
    ) {
      let v = descriptor.initializer();
      if (v !== undefined) {
        target.constructor.prototype.observedAttributeTypes[propertyKey] = typeof v
        target.constructor.prototype.observedAttributeValues[propertyKey] = v;
        
      }
    }
  };
};
