
export const Prop = function (value) {
    return function (target, propertyKey, descriptor) {
      if (!target.constructor.observedAttributes) {
        target.constructor.prototype.observedAttributes = [];
        target.constructor.observedAttributes =
          target.constructor.observedAttributes || [];
      }
      if (
        target.constructor.prototype.observedAttributes.indexOf(propertyKey) == -1
      ) {
        target.constructor.prototype.observedAttributes.push(propertyKey);
      }
      descriptor[propertyKey] = value;
    };
  }; 