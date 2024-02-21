import { output } from "../../output";
import { findProps } from "../../regex/expressions";
import { makeGrammar } from "../../regex/grammar";
import { generateRandomDatasetAttribute } from "../indentifiers/dataset";
import { ruleSet } from "./rules";

import { parse } from "grammex";
// import {makeGrammar} from './grammar';
const _parse = (template, options = {}) => {
  return parse(template, makeGrammar(options), { memoization: false })[0];
};

const attributeOutput = function (type, attributeName, value, props, dataset) {
  let expressions = value
    .split("{{")
    .filter((el) => el.indexOf("}}") > -1)
    .map((el) => el.trim())
    .map((el) => el.split("}}")[0]);
  let expression = value;

  let paths = [];
  for (let exp of expressions) {
    paths = paths.concat(findProps(exp, props));

    for (let path of paths) {
      expression = expression.replaceAll(path.path, "this." + path.path);
    }
    // let left =  expression.split(exp)[0];
    // let right =  expression.split(exp).slice(1).join(exp).split('}}').slice(1).join('}}')//.map(r => r.split('}}').slice(1).join();
    // paths.sort((a,b)=>a.path.length > b.path.length);

    // for(let p of paths){
    //   exp = exp.replaceAll(p,'this.'+p)

    // }
  }

  expression = expression.replaceAll("{{", "${").replaceAll("}}", "}");

  let out = {
    type,
    attributeName,
    value,
    props,
    dataset,
    paths,
    expression,
  };
  let setup = function (instance, element, config) {

    if (out.type == "text") {
      // if(out.connected) {
      //   console.log(out)
      //   out.callbacks.map((callback) => callback());
      //   console.log(out.callbacks)
      //   return;
      // }
      // out.connected = true;
      out.clone = element.querySelector(out.dataset.selector).childNodes[
        out.attributeName
      ];
      console.log(out.clone)
      // if(out.clone) return;
      console.log(out.clone)
      out.callbacks = out.callbacks || [];
      for (let p of paths) {
        if (out.type == "text") {
          const fn = Function("return `" + out.expression + "`");
          const callback = function () {
            console.log("CALLBACK CALLED", p.path, out.clone);
            out.clone.textContent = fn.call(element);
          };
          element.__connection__(p.path, callback);
          callback()
        }
      }
      out.callbacks.map((callback) => callback());
    }
  };
  let callback = function () {};

  //   console.log(out.clone,paths)
  // }
  // let callback = function(instance,element,config){
  //   console.log("callback",{instance:instance,element:element,config:config,out})
  // }
  // debugger;
  // const callback
  out.setup = setup;
  out.callback = callback;
  return out;
};

export const inspectAttributes = function (template, scope = {}) {
  const rule = ruleSet.expression.rule;
  const leftRule = ruleSet.expression.leftSearch;
  const rightRule = ruleSet.expression.rightSearch;
  const props = Object.keys(scope);
  let result = output();
  let attributeName;
  let expression;
  let selector;
  result.data = { template, expressions: [] };

  const getOcorrences = function (value) {
    return value
      .split(leftRule)
      .map((el) => el.trim())
      .filter((el) => el.indexOf(rightRule) > 0)
      .map((el) => el.split(rightRule)[0]);
  };

  for (let element of [...template.querySelectorAll("*")]) {
    for (let attr of element.getAttributeNames()) {
      let value = element.getAttribute(attr);
      let ocorrences = getOcorrences(value);
      if (ocorrences.length > 0) {
        result.success = true;
        let dataset = generateRandomDatasetAttribute();
        element.dataset[dataset.path] = true;
        result.data.expressions.push(
          attributeOutput("attribute", attr, value, props, dataset)
        );
      }
    }
    let i = 0;
    for (let node of element.childNodes) {
      if (node.nodeType == 3) {
        let value = node.textContent;
        let ocorrences = getOcorrences(value);
        if (ocorrences.length > 0) {
          result.success = true;
          let dataset = generateRandomDatasetAttribute();
          element.dataset[dataset.path] = true;
          result.data.expressions.push(
            attributeOutput("text", i, value, props, dataset)
          );
        }
      }
      i++;
    }
  }

  return result;
};
