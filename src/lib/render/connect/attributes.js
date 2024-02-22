export const connectAttributes = function (instance, clone) {
  const textMap = instance.__config__.map.text;
  textMap.forEach((map) => {
    map.setup(instance, clone, map);
    map.callback(instance, clone);
  });

  const eventMap = instance.__config__.map.events;
  eventMap.forEach((map) => {
    map.setup(instance, clone, map);
    map.callback(instance, clone);
  });
};

export const connectController = function (instance,clone) {
  for (let prop of instance.__config__.props) {
    clone.parentElement.__defineGetter__(prop, function () {
      return clone.__scope__[prop];
    });
    clone.parentElement.__defineSetter__(prop, function (value) {
      clone.__scope__[prop] = value;
      return true;
    });
  }
  for (let method of clone.parentElement.__methods__) {
        if (!clone[method] && typeof clone.parentElement[method] == "function") {
          console.log(method,clone,clone.parentElement);
      clone[method] = clone.parentElement[method].bind(clone);
    }
  }
};
