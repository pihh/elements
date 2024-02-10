/**
 * Creates a class to connect the current scope to the property
 * based on the type of connection
 */

import { getPath2 } from "../../compiler/model/update";

export class PropConnector {
  static text(instance, keyword, node, query) {
    const callback = function (val) {
      const value = PropConnector.evaluate(instance, query);
      node.textContent = value;
    };

    instance.connect(keyword, callback);
    return callback;
  }

  static attribute(instance, keyword, node, query, attribute) {
    const callback = function (newValue) {
      console.log(newValue,query, instance);
      const value = PropConnector.evaluate(instance, query);
      node.setAttribute(attribute, value);
    };
    console.log('conn',attribute)
    
    instance.connect(keyword, callback);
    return callback;
  }

  static model(instance, node, attribute) {}

  static evaluate(instance, query, type = "text") {
    console.log({instance, query, type})
    const fn = Function("return " + query);

    const output = fn.call(instance.scope);
    let value = output;
    if (type == "boolean") {
      if (["true", true].indexOf(value) > -1) {
        value = true;
      } else {
        value = false;
      }
    } else if (type == "number") {
      value = Number(value);
    }

    return value;
  }
}

const getScopeValue = function (scope, property) {
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

const setScopeValue = function (scope, property, newValue) {
  let { success, value, path } = getScopeValue(scope, property);
  if (success || value == undefined) {
    if (value !== newValue) {
      let update = scope;
      for (let p of path) {
        update = update[p];
      }
      updatte[p] = newValue;
    }
  }
};

export class ModelConnector {
  static update(instance, property, newValue) {
    setScopeValue(instance, property, newValue);
  }
  static text(instance, node, property) {
    let attributeName = "value";
    let eventName = "input";
    const callback = function () {
      let result = PropConnector.evaluate(instance, property);
      node.setAttribute(attributeName, result);
    };

    node.addEventListener(eventName, function (event) {
      this.update(instance, property, event.target.value);
    });
    const subscription = instance.__connect(property, callback);
    return subscription;
    vm;
  }
  static number(instance, node, property) {}
  static checkbox(instance, node, property) {}
  static select(instance, node, property) {
    // if (nodeName === "SELECT" || type === "checkbox") {
    //     eventName = "change";
    //   }
    if (type === "checkbox") {
      modelAttribute = "checked";
      callback = function (value) {
        if (value == "true") value = true;
        if (value) {
          element.setAttribute("checked", true);
        } else {
          element.removeAttribute("checked");
        }
      };
    }
    element.addEventListener(eventName, function (e) {
      modelUpdate(instance, attribute, e.target[modelAttribute]);
    });

    instance.__connect(attribute, callback);
    callback(modelValue(instance, attribute));
  }
}


export const connectTemplate = function(instance){
  if (instance.__setup.templateConnected) return;
  const connections = instance.reactiveProps.map;

  for (let key of Object.keys(connections)) {
    const connection = connections[key];
    for (let conn of connection) {
      conn.setup(instance);
    }
  }
  instance.__setup.templateConnected = true;
}
