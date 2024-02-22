import {
  evaluationCallback,
  expressionCallback,
  getterCallback,
  setterCallback,
} from "../../../render/reactivity/expressions";
import { output } from "../../output";
import { findProps } from "../../regex/expressions";
import { makeGrammar } from "../../regex/grammar";
import { generateRandomDatasetAttribute } from "../indentifiers/dataset";
import { ruleSet } from "./rules";

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
  let callback = function () {};
  let setup = function (instance, element, config) {
    let callback = function () {};
    let clone = element.querySelector(out.dataset.selector);
    if (out.type == "text") {
      clone = clone.childNodes[out.attributeName];

      for (let p of paths) {
        const fn = Function("return `" + out.expression + "`");
        let callback = function () {
          clone.textContent = fn.call(element);
        };
        element.__connection__(p.path, callback);
        callback();
      }
      delete element.dataset[out.dataset.path];
    } else if (out.type == "model") {
      if (clone.nodeName == "INPUT") {
        let fn2 = setterCallback(element, value.trim());
        clone.addEventListener("input", function ($event) {
          fn2(element, $event.target.value);
        });

        let callback = function (newValue) {
          if (clone.getAttribute("value") != newValue && newValue) {
            clone.setAttribute("value", newValue);
          }
        };
        let getValue = getterCallback(element, value.trim());

        element.__connection__(value.trim(), callback);
        callback(getValue(element));
        delete element.dataset[out.dataset.path];
      }
    } else {
      for (let p of paths) {
        if (p.evaluation == "eval") {
          let fn = evaluationCallback(element, out.expression);
        p.path = p.path.replace('counterUpdating.','').replaceAll('this.','')
          callback = function () {
            let result = fn();
            // console.log({result,p})
            clone.setAttribute(out.attributeName, result);
          };
        } else {
          let result = expressionCallback(element, out.expression);
          callback = function () {
            clone.setAttribute(out.attributeName, result);
          };
        }

        element.__connection__(p.path.replace('couterUpdating.',''), callback);
        callback();
      }
      delete element.dataset[out.dataset.path];
    }
    delete element.dataset[out.dataset.path];
  };

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
      if (attr.indexOf("*") > -1) {
        result.success = true;
        let dataset = generateRandomDatasetAttribute();
        element.dataset[dataset.path] = true;
        result.data.expressions.push(
          attributeOutput("model", attr, value, props, dataset)
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
