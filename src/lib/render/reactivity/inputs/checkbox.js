import { getterCallback, parseBoolean, setterCallback } from "../expressions";

const InputReactivityConfiguration = {
  delay: 0,
  event: "checked",
};
export const checkBoxEventSetup = function (
  element,
  clone,
  expression,
  config = {}
) {
  config = {
    ...InputReactivityConfiguration,
    ...config,
  };
  let getValue = getterCallback(element, expression.trim());
  let setValue = setterCallback(element, expression.trim());
  element = element.parentNode;
  clone.addEventListener("change", function ($event) {
    if (typeof $event === "object") {
      console.log("did change", $event.target.checked, getValue(element));
      let newValue = $event.target.checked;
      if (newValue !== element) {
        setValue(element, $event.target.checked);
      }
    }
  });

  let callback = function (newValue) {
    try {
      if (typeof newValue == "undefined") {
        newValue = getValue(element);
      }
      if (typeof newValue == "undefined") return;
            
      if (["true", true].indexOf(newValue) > -1  ) {
  
        clone.checked = true
      } else {
        clone.checked = false
      }
    } catch (ex) {
      console.warn(ex);
    }
  };

  element.__connection__(expression.trim(), callback);
  callback(getValue(element));
};
