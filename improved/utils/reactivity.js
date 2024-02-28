export function reactive(obj, keys = [], callback, key) {
  let objectIdentifier = JSON.parse(JSON.stringify(keys));
  let lastValue;
  if (key) {
    if (!isNaN(key)) key = "[" + key + "]";
    objectIdentifier.push(key);
  }
  objectIdentifier = JSON.parse(JSON.stringify(objectIdentifier));

  return new Proxy(obj, {
    get(target, prop, receiver) {
      const value = Reflect.get(target, prop, receiver);

      if (typeof value === "object" && value !== null) {
        return reactive(value, objectIdentifier, callback, prop); // Recursively make nested objects reactive
      }
      return value;
    },
    set(target, prop, value, receiver) {
      const result = Reflect.set(target, prop, value, receiver);

      callback(
        objectIdentifier
          .filter((el) => 0 < el.length)
          .concat(prop)
          .map((el) => (!isNaN(el) ? "[" + el + "]" : el))
          .join(".")
          .replaceAll(".[", "[")
      );

      lastValue = result;
      return result;
    },
  });
}
