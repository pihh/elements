import { modelUpdate, modelValue } from "./update";

export const CompileInput = function (element, attribute, scope, connection) {
  const modelName = element.getAttribute(attribute).replaceAll("this.", "");
  const nodeName = element.nodeName || "INPUT";
  const inputType = element.getAttribute("type");

  const subscriptions = [modelName];
  const attributeEvent = inputType === "checkbox" ? "checked" : "value";
  for (let __sub of subscriptions.map((s) => s.replace("this.", "").trim())) {
    const callback = function (v) {
     
      element.setAttribute(attributeEvent, modelValue(scope, modelName));
    };
    element.__subscribe(__sub, scope, connection, callback);
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
    const initialCall = function(element){
        [...element.querySelectorAll("option")].forEach(el => {
            
            el.__didInitialize = el.__didInitialize || [];
            el.__didInitialize.push(()=>{
                updateOptions(element,modelValue(scope, modelName));
            })
        })
    }
    const callback = function (value) {
      const elementValue = element.getAttribute("value");
      if (value == elementValue) return;
      // let selected = el.value === value;
      updateOptions(element, value);
    };

    element.addEventListener("change", (event) => {
      modelUpdate(scope, modelName, event.target.value);
    });

    connection(modelName, callback);
    initialCall(element);
    // Initial render
    updateOptions(element, modelValue(scope, modelName));

  } else if (inputType == "checkbox") {
    element.addEventListener("change", (event) => {
      modelUpdate(scope, modelName, event.target.checked); //== "false" ? false : event.target.checked);
    });
    const callback = function (value) {
      value = ["true",true].indexOf(value) > -1 ? true : false; 
      if (value && !element.getAttribute("checked")) {
        element.setAttribute("checked", true);
      } else {
        element.removeAttribute("checked");
      }
    };
    connection(modelName, callback);
    callback(modelValue(scope,modelName));
  } else {

    element.addEventListener("keyup", (event) => {
      modelUpdate(scope, modelName, event.target.value);
    });
    const callback = function (value) {
    //   const value = modelValue(scope, modelName);
      const elementValue = element.getAttribute("value");
      if (value == elementValue) return;
      element.setAttribute("value", value);
    };
    connection(modelName, callback);
    callback(modelValue(scope,modelName))
  }
  element.removeAttribute(attribute);
};

