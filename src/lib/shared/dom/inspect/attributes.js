import {
  evaluationCallback,
  expressionCallback,
  getterCallback,
  setterCallback,
} from "../../../render/reactivity/expressions";
import { inputEventSetup } from "../../../render/reactivity/inputs";
import { checkBoxEventSetup } from "../../../render/reactivity/inputs/checkbox";
import { selectEventSetup } from "../../../render/reactivity/inputs/select";
import { output } from "../../output";
import { findProps } from "../../regex/expressions";
import { makeGrammar } from "../../regex/grammar";
import { generateRandomDatasetAttribute } from "../indentifiers/dataset";
import { ruleSet } from "./rules";
import { getClone, setupCleanup } from "./utils";

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
      expression = expression
        .replaceAll(path.path, "this." + path.path)
        .replaceAll("this.this.", "this.");
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
    let clone = getClone(element, out);
    if (out.type == "text") {
      let cloneContainer = clone;
      clone = clone.childNodes[out.attributeName];

      for (let p of paths) {
        const fn = Function("return `" + out.expression + "`");
        let callback = function () {
          clone.textContent = fn.call(element);
        };
        element.__connection__(p.path, callback);
        callback();
      }

      delete cloneContainer.dataset[out.dataset.path];
    } else if (out.type == "reference") {
   
      let clone = getClone(element, out);
      clone.__reference__ = element.parentElement || element;
      clone.removeAttribute("*ref");
      setupCleanup(element, clone, out);
    } else if (out.type == "model") {
      if (clone.nodeName == "INPUT") {
        let clone = getClone(element, out);
        if (clone.getAttribute("type") == "checkbox") {
          checkBoxEventSetup(element, clone, expression);
        } else {
          inputEventSetup(element, clone, out.value);
        }
      } else if (clone.nodeName === "SELECT") {
        let clone = getClone(element, out);
        selectEventSetup(element, clone, expression);
      }
      setupCleanup(element, clone, out);
      clone.removeAttribute("*bind");
    } else {
      for (let p of paths) {
        if (p.evaluation == "eval") {
          console.log(p,expression);
          let fn = evaluationCallback(element, out.expression);
          p.path = p.path
            .replace("counterUpdating.", "")
            .replaceAll("this.", "");
          callback = function () {
            let result = fn();
            // console.log({result,p})
            clone.setAttribute(out.attributeName, result);
          };
        } else {
          callback = function () {
            clone.setAttribute(
              out.attributeName,
              expressionCallback(element, out.expression)
            );
          };
        }

        element.__connection__(p.path.replace("couterUpdating.", ""), callback);
        callback();
      }
      delete clone.dataset[out.dataset.path];
    }
    // delete clone.dataset[out.dataset.path];
  };

  out.setup = setup;
  out.callback = callback;
  return out;
};

export const inspectAttributes = function (template, scope = {}) {
  const leftRule = ruleSet.expression.leftSearch;
  const rightRule = ruleSet.expression.rightSearch;
  const props = Object.keys(scope);
  let result = output();

  result.data = { template, expressions: [] };

  const getOcorrences = function (value) {
    return [
      ...new Set(
        value
          .split(leftRule)
          .map((el) => el.trim())
          .filter((el) => el.indexOf(rightRule) > 0)
          .map((el) => el.split(rightRule)[0])
      ),
    ];
  };

  for (let element of [...template.querySelectorAll("*")]) {
    for (let attr of element.getAttributeNames()) {
      let value = element.getAttribute(attr);
      let ocorrences = getOcorrences(value);
      if (ocorrences.length > 0) {
        if (ocorrences.length > 1) {
          console.log(element, attr, value, ocorrences);
          debugger;
        }
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
        
        if (attr === "*ref") {
          result.data.expressions.push(
            attributeOutput("reference", attr, value, props, dataset)
          );
        } else {
          result.data.expressions.push(
            attributeOutput("model", attr, value, props, dataset)
          );
        }
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
