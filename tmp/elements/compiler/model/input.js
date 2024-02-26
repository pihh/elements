import { modelUpdate, modelValue } from "./update";

export const CompileInput = function (element, attribute, scope, connection) {
  const modelName = element.getAttribute(attribute).replaceAll("this.", "");
  const nodeName = element.nodeName || "INPUT";
  const inputType = element.getAttribute("type");

  const subscriptions = [modelName];
  const attributeEvent = inputType === "checkbox" ? "checked" : "value";

  for (let __sub of subscriptions.map((s) => s.replace("this.", "").trim())) {
    const callback = function (v) {
      if (inputType === "checkbox") {
        let currentValue = element.getAttribute("checked");

        if (v && !currentValue) {
         
          element.setAttribute("checked", true);
        } else if (!v && currentValue) {
          element.removeAttribute("checked");
        }
      } else {
        let currentValue = element.getAttribute("value");
        if (currentValue !== v) {
          element.setAttribute(attributeEvent, modelValue(scope, modelName));
        }
      }
    };
    element.__subscribe(__sub, scope, connection, callback);
    callback(modelValue(scope, modelName))
  }

  if (nodeName == "SELECT") {
    const updateOptions = function (element, value) {
      [...element.querySelectorAll("option")].forEach((el) => {
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
          updateOptions(element, modelValue(scope, modelName));
        });
      });
    };
    // const callback = function (value) {
    //   const elementValue = element.getAttribute("value");
    //   if (value == elementValue) return;
    //   // let selected = el.value === value;
    //   updateOptions(element, value);
    // };
    let prevValue =modelValue(scope,modelName) || undefined;
    element.addEventListener("change", (event) => {
      if (event.target.value !== prevValue) {
        prevValue = event.target.value;
        modelUpdate(scope, modelName, event.target.value);
      }
    });

    // connection(modelName, callback);
    initialCall(element);
    // Initial render
    updateOptions(element, modelValue(scope, modelName));
  } else if (inputType == "checkbox") {
    let prevValue =modelValue(scope,modelName) || false;
    element.addEventListener("change", (event) => {
      if (event.target.checked != prevValue) {
        prevValue = event.target.checked;
        modelUpdate(scope, modelName, event.target.checked); //== "false" ? false : event.target.checked);
      }
    });
  } else {
    let prevValue =modelValue(scope,modelName) || "";
    element.addEventListener("keyup", (event) => {
      if (event.target.value !== prevValue) {
        prevValue = event.target.value;
        modelUpdate(scope, modelName, event.target.value);
      }
    });
  }
  element.removeAttribute(attribute);
};
