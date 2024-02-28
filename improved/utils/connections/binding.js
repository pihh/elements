import { parseText, setValue } from "../eval";
import { Parser } from "../parser";

export const connectBinding = function (instance, element, config) {
  // console.log({ instance, element, config });

  if (element.nodeName === "INPUT") {
    let type = element.getAttribute("type") || "text";
    if (type === "text") {
      connectTextInput(instance, element, config);
    } else {
      connectTextInput(instance, element, config);
    }
  } else if (element.nodeName === "SELECT") {
    connectSelectInput(instance, element, config);
  }

  delete element.dataset[config.selectorCamel];
};

const connectTextInput = function (instance, element, config) {
  // console.log('xxx',element,config);
  const callback = function () {
    const oldValue = element.getAttribute("value");
    const newValue = parseText(instance, config.expression);
    // console.log({newValue, oldValue,exp:config.expression});
    // console.log({oldValue, newValue});
    // if (newValue !== oldValue) {
    element.value = newValue;
    element.setAttribute("value", newValue);
    // }
  };

  element.addEventListener("input", function ($event) {
    // console.log(config.listeners,config.expression)
    setValue(instance, config.listeners[0], "'" + $event.target.value + "'");
  });
  const subscription = (expression) => {
    callback();
  };

  instance.subscribe(config.listeners[0], function () {
    subscription(config.expression);
  });
  callback();
};

const connectSelectInput = function (instance, element, config) {
  let callback = function () {
    // console.log();
    // debugger

    let value = parseText(instance, config.expression);
    element.setAttribute("value", value);
    element.value = value;
    // console.log(value,$event)
    for (let option of [...element.querySelectorAll("option")]) {
      let optionValue = option.getAttribute("value");
      if (optionValue == value) {
        option.setAttribute("selected", true);
      } else {
        option.removeAttribute("selected");
      }
    }
  };
  element.addEventListener("change", function ($event) {
    let value = Parser[typeof $event.target.value]($event.target.value);
    let type = typeof value;
    if (type == "string") {
      value = "'" + value + "'";
    }
    setValue(instance, config.listeners[0], value);
  });

  callback();

  const subscription = () => {
    const oldValue = element.getAttribute("value");
    const newValue = parseText(instance, config.expression);
    if (newValue !== oldValue) {
      callback();
    }
  };
  instance.subscribe(config.listeners[0], function () {
    subscription();
  });
};

export const getInputConfigurations = function (element) {
  let nodeName = element.nodeName;
  let type = element.getAttribute("type");
  let eventToListen = "input";
  let value = "value";
  let attribute = "oninput"
  let customConfig = {};
  if (nodeName === "SELECT") {
    eventToListen = "change";
    customConfig.callback = function (oldValue, newValue) {
      if (oldValue !== newValue) {
        let value = newValue;
        element.setAttribute("value", value);
        element.value = value;

        for (let option of [...element.querySelectorAll("option")]) {
          let optionValue = option.getAttribute("value");
          if (optionValue == value) {
            option.setAttribute("selected", true);
          } else {
            option.removeAttribute("selected");
          }
        }
      }
    };
  }else {
    if(["checkbox","radio","number","tel","range"].indexOf(type)>-1){
      alert('TODO ')
      console.log('@todo')
    }else{

    }
  }

  return {nodeName,type,eventToListen,attribute,customConfig,value}
};
