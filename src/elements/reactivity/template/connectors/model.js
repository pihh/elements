import { modelUpdate, modelValue } from "../../../compiler/model/update";
import { getScopeValue, setScopeValue } from "../scope";
import { PropConnector } from "./prop";

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

      getEventValue = function ($event) {
        return Number($event.target.value);
      };
      node.addEventListener('change', function ($event) {
        let value = getEventValue($event);
      
        console.log(value,dataType)
        ModelConnector.update(instance, keyword, value);
      });
    }

    let callback = function () {
      let result = PropConnector.evaluate(instance, query, dataType);
  
      if (type == "checkbox") {
        if (["true", true].indexOf(result) > -1) {
          node.setAttribute(attributeName, true);
        } else {
          node.removeAttribute(attributeName);
        }
      } else {
        node.setAttribute(attributeName, result);
      }
    };

    node.addEventListener(eventName, function ($event) {
      let value = getEventValue($event);
     
      ModelConnector.update(instance, keyword, value);
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
