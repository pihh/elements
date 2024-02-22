import { getterCallback, setterCallback } from "../expressions";

const InputReactivityConfiguration = {
  delay: 0,
  event: "input",
};
export const inputEventSetup = function (
  element,
  clone,
  expression,
  config = {}
) {
  config = {
    ...InputReactivityConfiguration,
    ...config,
  };

  let fn2 = setterCallback(element, expression.trim());
  clone.addEventListener("input", function ($event) {
    fn2(element, $event.target.value);
  });

  let callback = function (newValue) {
    if (clone.getAttribute("value") != newValue && newValue) {
      clone.setAttribute("value", newValue);
    }
  };
  let getValue = getterCallback(element, expression.trim());

  element.__connection__(expression.trim(), callback);
  callback(getValue(element));
  
};

const inputEventListener = function (element, clone, expression, config = {}) {
  let fn = setterCallback(clone, expression);
  let timeout;

  clone.addEventListener("input", function ($event) {
    let newValue = $event.target.value;
    console.log({ newValue, clone });
    if (validateInputUpdate(clone, newValue)) fn(clone, newValue);
  });
};

const validateInputUpdate = function (clone, newValue) {
  console.log(clone, typeof newValue);
  return (
    clone.getAttribute("value") != newValue &&
    typeof newValue !== "function" &&
    typeof newValue != "undefined"
  );
};
