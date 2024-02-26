import { getPath2 } from "../../compiler/model/update";
import { PropConnector } from "./connectors/prop";


export const setScopeValue = function (instance, property, newValue) {
  let { success, value, path } = getScopeValue(instance.scope, property);
  if (success || value == undefined) {
    if (value !== newValue) {
      const query =
        "`${" + "this." + `${property}` + " = '" + newValue + "'" + "}`";
      PropConnector.evaluate(instance, query);
    }
  }
};

export const getScopeValue = function (scope, property) {
  let path = property;

  if (!Array.isArray(path)) {
    path = getPath2(path);
  }
  try {
    let value = scope;
    for (let p of path) {
      if (value[p]) {
        value = value[p];
      }
    }
    return { success: true, value, path };
  } catch (ex) {
    return { success: false, value: undefined, path };
  }
};
