import { output } from "../../output";
import { makeGrammar } from "../../regex/grammar";
import { generateRandomDatasetAttribute } from "../indentifiers/dataset";
import { ruleSet } from "./rules";

import {parse} from 'grammex';
// import {makeGrammar} from './grammar';
  const _parse = ( template, options={} ) => {

       return parse ( template, makeGrammar ( options ), { memoization: false } )[0];

     };

  
const attributeOutput = function (
  type,
  attributeName,
  value,
  props,
  dataset,

) {
  
  let expressions = value.split('{{').filter(el => el.indexOf('}}')>-1).map(el => el.trim()).map(el =>el.split('}}')[0])
  let expression = value.replaceAll("{{", "${" ).replaceAll("}}", "}");
  for(let prop of props){
    expression= expression.replaceAll(prop,'this.'+prop);
  }


  let out = {
    type,
    attributeName,
    value,
    props,
    dataset,
    expression,
  };
  let setup = function(instance,element,config){
    console.log("setup",{instance:instance,element:element,config:config,out})
    out.clone = element.querySelector(out.dataset.selector);
    console.log(out,_parse,expressions)
    debugger;
  }
  let callback = function(instance,element,config){
    console.log("callback",{instance:instance,element:element,config:config,out})
  }

  out.setup = setup;
  out.callback = callback;  
  return out;
};

export const inspectAttributes = function (template, scope = {}) {
  const rule = ruleSet.expression.rule;
  const leftRule = ruleSet.expression.leftSearch;
  const rightRule = ruleSet.expression.rightSearch;

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
          attributeOutput("attribute", attr, value, ocorrences, dataset)
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
            attributeOutput("text", i, value, ocorrences, dataset)
          );
        }
      }
      i++;
    }
  }

  return result;
};
