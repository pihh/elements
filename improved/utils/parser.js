export const parseObject = function (obj) {
  if (typeof obj === "object") {
    Object.keys(obj).forEach(function (key) {
      let type = typeof obj[key];
      if (type === "object") {
        obj[key] = parseObject(obj[key]);
      } else {
        obj[key] = Parser[type](obj[key]);
      }
    });
  } else {
    return Parser[typeof obj](obj);
  }
  return obj;
};
export const Parser = {
  string(value) {
    return value;
  },
  number(value) {
    return Number(value);
  },
  boolean(value) {
    return ["true", true].indexOf(value) > -1 || false;
  },
  object(value) {
    return parseObject(JSON.parse(JSON.stringify(value)));
  },
};
