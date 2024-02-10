/**
 * Creates a class to connect the current scope to the property
 * based on the type of connection
 */

import { getPath2, modelUpdate, modelValue } from "../../compiler/model/update";

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
      // console.log(newValue,query, instance);
      const value = PropConnector.evaluate(instance, query);
      node.setAttribute(attribute, value);
    };

    instance.connect(keyword, callback);
    return callback;
  }

  static lastRender = Date.now();
  static model(instance, keyword, node, query) {
    let type =
      node.nodeName == "SELECT"
        ? "select"
        : node.getAttribute("type") || "text";

    const cb = ModelConnector[type](instance, node, query, keyword);
    const callback = function () {
      cb();
    };

    instance.connect(keyword, callback);
    return callback;
  }

  static evaluate(instance, query, type = "text") {
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

const setScopeValue = function (instance, property, newValue) {
  let { success, value, path } = getScopeValue(instance.scope, property);
  if (success || value == undefined) {
    if (value !== newValue) {
      const query =
        "`${" + "this." + `${property}` + " = '" + newValue + "'" + "}`";
      PropConnector.evaluate(instance, query);
    }
  }
};

export class ModelConnector {
  static update(instance, property, newValue) {
    setScopeValue(instance, property, newValue);
  }
  static connect(type, instance, node, query, keyword) {
    let attributeName = "value";
    let eventName = "keyup";
    let dataType = "text";
    let getEventValue = function ($event) {
      return $event.target.value;
    };

    if (type === "checkbox") {
      attributeName = "checked";
      eventName = "change";
      dataType = "boolean";
      getEventValue = function ($event) {
        return $event.currentTarget.checked;
      };
    }
    if (type === "number") {
      dataType = "number";
    }

    let callback = function () {
      let result = PropConnector.evaluate(instance, query, dataType);
      node.setAttribute(attributeName, result);
    };

    node.addEventListener(eventName, function ($event) {
      ModelConnector.update(instance, keyword, getEventValue($event));
    });

    return callback;
  }
  static text(instance, node, query, keyword) {
    return ModelConnector.connect("text", instance, node, query, keyword);
  }
  static number(instance, node, query, keyword) {
    return ModelConnector.connect("number", instance, node, query, keyword);
  }
  static checkbox(instance, node, query, keyword) {
    return ModelConnector.connect("checkbox", instance, node, query, keyword);
  }
  static select(instance, node, query, modelName) {
    const updateOptions = function (node, value) {
      [...node.querySelectorAll("option")].forEach((el) => {
        if (value == el.value) {
          el.setAttribute("selected", true);
        } else {
          el.removeAttribute("selected");
        }
      });
    };
    const initialCall = function (element) {
      [...element.querySelectorAll("option")].forEach((el) => {
        el.__didInitialize = el.__didInitialize || [];
        el.__didInitialize.push(() => {
          updateOptions(element, modelValue(instance.scope, modelName));
        });
      });
    };
    const callback = function (value) {
      const elementValue = node.getAttribute("value");
      if (value == elementValue) return;
      // let selected = el.value === value;
      updateOptions(node, value);
    };
    let prevValue = modelValue(instance.scope, modelName) || undefined;
    node.addEventListener("change", (event) => {
      if (event.target.value !== prevValue) {
        prevValue = event.target.value;
        modelUpdate(instance.scope, modelName, event.target.value);
      }
    });

    // connection(modelName, callback);
    initialCall(node);

    // Initial render
    updateOptions(node, modelValue(instance.scope, modelName));

    return callback;
  }
}

export const connectTemplate = function (instance) {
  if (instance.__setup.templateConnected) return;
  const connections = instance.reactiveProps.map;

  for (let key of Object.keys(connections)) {
    const connection = connections[key];
    for (let conn of connection) {
      conn.setup(instance);
    }
  }
  const actions = instance.actions.map;

  for (let key of Object.keys(actions)) {
    // console.log(key)
    const action = actions[key][0];
    action.node.removeAttribute(key);
    action.setup(instance);
  }

  let operations = instance.operations.map.if
  for (let operation of operations) {
    // console.log(key)
    
    operation.setup(instance);
  }
  instance.__setup.templateConnected = true;
};

export class ActionConnector {}
