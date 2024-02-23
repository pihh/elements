import { getterCallback, setterCallback } from "../expressions";

const baseInputConnectionConfig = {
  event: "change",
  value: "",
  eventListenerCallback: function () {},
  valueListenerCallback: function () {},
  setup: function () {},
};

const setupInputConnection = function (
  controller,
  element,
  expression,
  configuration = {}
) {
  if (element.hasOwnProperty(configuration.__symbol__)) return;

  // Ensure only one event is binded
  element[configuration.__symbol__] = true;

  controller = controller.parentElement || controller;
  expression = expression.trim();

  configuration.eventListenerCallback(controller, element, expression);
  configuration.valueListenerCallback(controller, element, expression);
};
const validateEventListenerCallback = function (
  controller,
  controllerValueLookup,
  newValue,
  setterFunction
) {
  let oldValue = controllerValueLookup(controller);
  if (newValue != oldValue && newValue != undefined) {
    setterFunction(newValue);
  }
};

export const inputConnectionConfig = {
  event: "input",
  value: "",
  __symbol__: Symbol("TheInputConnection"),
  eventListenerCallback: function (controller, element, expression) {
    const type = element.getAttribute("type") || "text";
    // Base functions
    let eventListenerCallback = setterCallback(controller, expression);
    let controllerValueLookup = getterCallback(controller, expression);

    // Event Listener
    if (type == "text") {
      element.addEventListener("input", function ($event) {
        validateEventListenerCallback(
          controller,
          controllerValueLookup,
          $event.target.value,
          function (newValue) {
            eventListenerCallback(controller, newValue);
          }
        );
      });
    } else if (type == "number") {
      element.addEventListener("input", function ($event) {
        validateEventListenerCallback(
          controller,
          controllerValueLookup,
          $event.target.value,
          function (newValue) {
            eventListenerCallback(controller, newValue);
          }
        );
      });
    } else if (type == "checkbox") {
      element.addEventListener("change", function ($event) {
        if (typeof $event !== "object") return;         
        validateEventListenerCallback(
          controller,
          controllerValueLookup,
          $event.target.checked,
          function (newValue) {
            eventListenerCallback(controller, ["true",true].indexOf(newValue) > -1);
          }
        );
      });
    }
  },
  valueListenerCallback: function (controller, element, expression) {
    let controllerValueLookup = getterCallback(controller, expression);
    const valueListenerCallback = function (newValue) {
      newValue = newValue || controllerValueLookup(controller);
      if (
        element.getAttribute("value") !== newValue &&
        newValue !== undefined
      ) {
        element.setAttribute("value", newValue);
      }
    };

    controller.__connection__(expression, valueListenerCallback);
    valueListenerCallback(controllerValueLookup(controller));
  },
  setup: function (controller, element, expression) {
    setupInputConnection(controller, element, expression, this);
  },
};


export const selectConnectionConfig = {
  event: "change",
  __symbol__: Symbol("TheSelectConnection"),
  eventListenerCallback: function (controller, element, expression) {
    let eventListenerCallback = setterCallback(controller, expression);
    let controllerValueLookup = getterCallback(controller, expression);
    element.addEventListener("change", function ($event) {
      validateEventListenerCallback(
        controller,
        controllerValueLookup,
        $event.target.value,
        function (newValue) {
          eventListenerCallback(controller, newValue);
        }
      );
    });
  },
  valueListenerCallback: function (controller, element, expression) {
    let controllerValueLookup = getterCallback(controller, expression);
    const valueListenerCallback = function (newValue) {
      newValue = newValue || controllerValueLookup(controller);
      let oldValue = element.getAttribute("value");
      if (oldValue !== newValue && newValue !== undefined) {
        [...element.querySelectorAll("option")].map((option) => {
          // setAttribute("value", newValue);
          if (option.getAttribute("value") == newValue) {
            option.setAttribute("selected", true);
          } else {
            option.removeAttribute("selected");
          }
        });
      }
    };

    controller.__connection__(expression, valueListenerCallback);
    valueListenerCallback(controllerValueLookup(controller));
    // valueListenerCallback(getValue(controller));
  },
  setup: function (controller, element, expression) {
    setupInputConnection(controller, element, expression, this);
  },
};
