import { getterCallback } from "../expressions";
import { inputConnectionConfig } from "./config";

export const checkBoxEventSetup = function (
  element,
  clone,
  expression,
  config = {}
) {

  const checkboxInputConnectionConfig = {
    ...inputConnectionConfig,
    valueListenerCallback: function (controller, element, expression) {
      let controllerValueLookup = getterCallback(controller, expression);
      const valueListenerCallback = function (newValue) {

        if (typeof newValue == "undefined" || newValue == "undefined") {
          newValue = controllerValueLookup(controller);
        }
        if (typeof newValue == "undefined") return;
              
        if (["true", true].indexOf(newValue) > -1  ) {
          element.checked = true
        } else {
          element.checked = false
        }
      }

      controller.__connection__(expression, valueListenerCallback);
      valueListenerCallback(controllerValueLookup(controller))
    
    }
  }
  checkboxInputConnectionConfig.setup(element,clone,expression);
 
};
