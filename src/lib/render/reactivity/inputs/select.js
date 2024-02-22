import { getterCallback, setterCallback } from "../expressions";

const InputReactivityConfiguration = {
  delay: 0,
  event: "checked",
};
export const selectEventSetup = function (
  element,
  clone,
  expression,
  config = {}
) {
  config = {
    ...InputReactivityConfiguration,
    ...config,
  };

  element = element.parentElement || element
  console.log('Select event setup',clone, expression, config,element);
  let fn2 = setterCallback(element.parentElement, expression.trim());
  clone.addEventListener("change", function ($event) {
    fn2(element, $event.target.value);
  });

  let callback = function (newValue) {
    if (clone.getAttribute("value") != newValue && newValue) {
      [...clone.querySelectorAll('option')].map(option => {
        // setAttribute("value", newValue);
        if(option.getAttribute("value") == newValue) {
          option.setAttribute("selected", true);
        }else{
          option.removeAttribute("selected");
        }
      })
    }
  };
  let getValue = getterCallback(element, expression.trim());

  element.__connection__(expression.trim(), callback);
  callback(getValue(element));
};
