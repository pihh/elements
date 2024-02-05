import { extractLookedPaths } from "../../helpers/path";
import { AddEventListener } from "../events/listeners";
import { CompileInput } from "../model/input";
import { CompileForOperator } from "../operations/for";
import { CompileIfOperator } from "../operations/if";
import { CompileMutationOperator } from "../operations/mutation";
import { setupElement } from "./setup";

export const CompileAttributes = function (
  element,
  scope,
  connection,
  config = { reset: false }
) {
  config = {
    reset:false,
    customAttributes:[],
    ...config
  }
  if (config.reset) {
    element.__didSetup = false;
  }
  let $forLoops = [...element.querySelectorAll('*')].filter(el => el.getAttributeNames().indexOf('*for') >-1);
  
  while($forLoops.length > 0) { 
    let $for=  $forLoops[0];
    
    CompileForOperator($for,scope,connection,config);
    
    $forLoops = [...element.querySelectorAll('*')].filter(el => el.getAttributeNames().indexOf('*for') >-1);
    
  }

  let $elements = [...element.querySelectorAll("*")];
  if (config.reset) {
    element.__didSetup = false;
  }

  element = setupElement(element);

  for (let $element of $elements) {
    if (!$element.controller) $element.controller = element.controller;
    $element = setupElement($element);
    CompileElementAttributes($element, scope, connection,config);
  }
  CompileElementAttributes(element, scope, connection,config);
};

export const CompileElementAttributes = function (element, scope, connection) {
  const attributes = element.getAttributeNames();
  for (let attribute of attributes) {
    const query = "`" + element.getAttribute(attribute) + "`";
    if (attribute.indexOf("*") == 0) {
      if (attribute == "*if") {
        CompileIfOperator(element, scope, connection);
      } else if (attribute == "*for") {
        CompileForOperator(element, scope, connection);
        
        element.innerHTML = "";
        for (let attr of element.getAttributeNames()) {
          element.removeAttribute(attr);
        }
      } else {
        CompileMutationOperator(element, scope, connection);
      }
    } else if (attribute == "model" || attribute == "[model]") {
      CompileInput(element, attribute, scope, connection);
    } else if (attribute.indexOf("(") > -1) {
    
      AddEventListener(element, scope, attribute);
    } else if (-1 == query.indexOf("{{")) {
      continue;
    }

    const parsedQuery = query.replaceAll("{{", "${").replaceAll("}}", "}");
    const subscriptions = extractLookedPaths(scope, query);

    for (let __sub of subscriptions.map((s) => s.replace("this.", "").trim())) {
      const callback = function () {
        const $fn = Function("return " + parsedQuery);
        const output = $fn.call(scope);
        element.setAttribute(attribute, output);
      };
      element.__subscribe(__sub, scope, connection, callback);
    }
  }
};
