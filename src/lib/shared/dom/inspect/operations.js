import { compileRules } from "../../../compile/rules";
import { getterCallback } from "../../../render/reactivity/expressions";
import { output } from "../../output";
import { filterStack } from "../../regex/text";
import { generateRandomDatasetAttribute } from "../indentifiers/dataset";
import { ruleSet } from "./rules";
import { getClone } from "./utils";

const setupIfOperation = function (template, scope = {}, result) {
  // let loopMonitor = compileRules.whileLoop.monitor(3);
  return {
    ...ruleSet.operation.if,
    monitor: compileRules.whileLoop.monitor(100),
    getOcorrences() {},
    success() {},
    cleanup() {},
  };
};
const setupForOperation = function (template, scope = {}, result) {
  // let loopMonitor = compileRules.whileLoop.monitor(3);
  return {
    ...ruleSet.operation.for,
    monitor: compileRules.whileLoop.monitor(100),
    getOcorrences() {},
    success() {},
    cleanup() {},
  };
};

const parseIfOperationOutput = function(){

}

const operationOutput = function (
  operation,
  operationArguments,
  originalExpression,
  parsedExpression,
  dataset
) {
  const out = {
    operation,

    operationArguments,
    originalExpression,
    parsedExpression,
    dataset,
  };

  let callback = function () {};
  let setup = function (instance, element, config) {
    let callback = function () {};
    let clone = getClone(element, out);
    let controller = element.parentElement || element;
    if (out.operation === "if") {
      const expression = parsedExpression;
      const $replacement = controller.querySelector(dataset.selector);

      const $placeholder = document.createComment("if operation placeholder");
      $placeholder.__connected__ = true;
      $placeholder.controller = controller;
      const $content = [...$replacement.childNodes].map(($child) => {
        $child.__comment__ = $placeholder;
        $child.controller = controller;
        return $child;
      });

      $replacement.before($placeholder);
      $replacement.before($placeholder);
      $content.forEach(($node) => $placeholder.after($node));

      let controllerValueLookup = getterCallback(controller, expression);

      const valueListenerCallback = function (newValue) {
        if (typeof newValue == "undefined" || newValue == "undefined") {
          newValue = controllerValueLookup(controller);
        }
        if (typeof newValue == "undefined") return;
        // console.log({ ifOperation: newValue });

        if (["true", true].indexOf(newValue) > -1) {
          $content.forEach(($node) => {
            $placeholder.after($node);
          });
        } else {
          $content.forEach(($node) => {
            $node.remove();
          });
        }
      };

      controller.__connection__(expression, valueListenerCallback);
    }else{

      const expression = parsedExpression;
      const $replacement = controller.querySelector(dataset.selector);

      // const $elements = [...$replacement.querySelectorAll('*')].map($el => {
      //   $el.indexKey = out.operationArguments.data.query.indexKey;
      //   $el.controller = controller; // = out.operationArguments.data.query.indexKey;
      //   $el.controller[$el.indexKey] = 0; // = out.operationArguments.data.query.indexKey;
      //   $el.__useLocalScope__ = true;
      //   $el.__connectorRefereces__ = $el.__connectorRefereces__ || {};
      //   // $el.__connectorRefereces[out.operationArguments.data.query.maskKey] = out.operationArguments.data.query.sourceKey
      //   return $el;
      // });
      
      const $placeholder = document.createComment("for operation placeholder");
      $placeholder.__connected__ = true;
      $placeholder.controller = controller;
      const $content = [...$replacement.childNodes].map(($child) => {
        $child.__comment__ = $placeholder;
        $child.controller = controller;
        return $child;
      });


      $placeholder.$content = $content; 
      $replacement.before($placeholder);
      $replacement.before($placeholder);
      $content.forEach(($node) => $placeholder.after($node));
      $replacement.replaceWith($placeholder);
      console.log($placeholder)
      $placeholder.generate = function(index){
        $placeholder.$content.forEach($node => {
          
          temp1.after($node.cloneNode(true))
        })
      }

    }
  };

  out.setup = setup;
  out.callback = callback;
  return out;
};
const extractOcorrence = function (template, operation) {

 
  operation.monitor();
  let search = template.split(operation.queryStart);
  let result = output();
  result.data = {
    operation,
    query: "",
    template: "",
  };
  if (search.length > 1) {
    let left = search[0];
    let right = search.slice(1);
    right = right.join(operation.queryStart);
    let query = right.split("){")[0].replace("(", "").trim();
    right = right.split("){");
    right = right.slice(1);
    right = right.join("){");
    if (right.charAt(0) != "{") {
      right = "{" + right;
    }

    let ocorrenceType = operation.operation;
    console.log({ocorrenceType})
    if(ocorrenceType == "for"){

      try{

       
        // Extract query, arguments and parameters;
        let queryParts = query.split(';').map(p => {
          p = " "+p +" ";
          p = p.replaceAll(' let ','');
          p = p.replaceAll(' const ','');

          return p.trim()
          
        }).filter(p => p.length > 0)

        query = {
          query,
          queryParts,
          indexKey: "__$$index_"+parseInt(Math.random()*10000)+"$$__",
          sourceKey:"",
          maskKey: "",
          reference: "",
        };
        for(let queryPart of queryParts){
          let separator = queryPart.indexOf(" of ") > -1 ? " of " : "=";
          let left = queryPart.split(separator)[0].trim();
          let right = queryPart.split(separator)[1].trim();
          if(separator ==   "="){
            query.indexKey = right;
          }else{
            query.sourceKey = right.replaceAll('this.','').trim();
            query.maskKey = left.replaceAll("mask.",'').trim();
          }
        }
        // query.setup = function(instance,element,sourceKey,maskKey){
        //   element.instance = instance;
        //   element[maskKey] = instance[sourceKey];
          
        // }
        console.log({query})
      }catch(ex){
        console.warn(ex)
      }
      
      // let expression = ocorrences.data.expression

    }

    
    
    
    let ocorrences = filterStack(right, "{", "}");
    if(ocorrenceType == "for"){
      ocorrences.data.expression = ocorrences.data.expression.replaceAll("{{"+query.maskKey+"}}","{{this."+query.sourceKey+"["+query.indexKey+"]}}")
      query.setup = function(instance,element,query){
        element.instance = instance;
        element.instance[query.indexKey] = 0;
        
      }
    }




    result = output(true, "Found ocorrences", {
      left,
      right: right.slice(1 + ocorrences.data.end),
      query,
      search,
      replacement: ocorrences.data.expression,
      ocorrences,
      operation,
    });

    
  }
  return result;
};
const getOcorrences = function (template, ifOperation, forOperation) {
  let ifIndex = template.indexOf(ifOperation.queryStart);
  let forIndex = template.indexOf(forOperation.queryStart);
  let ocorrences = output();

  if (ifIndex == -1 && forIndex == -1) {
    return ocorrences;
  } else if (ifIndex == -1) {
    ocorrences = extractOcorrence(template, forOperation);
  } else if (forIndex == -1) {
    ocorrences = extractOcorrence(template, ifOperation);
  } else if (ifIndex > forIndex) {
    ocorrences = extractOcorrence(template, ifOperation);
  } else if (forIndex > ifIndex) {
    ocorrences = extractOcorrence(template, forOperation);
  }

  return ocorrences;
};

export const inspectOperations = function (template, scope = {}) {
  let result = output();
  let ifOperation = setupIfOperation(template, scope, result);
  let forOperation = setupForOperation(template, scope, result);
  let ocorrences = getOcorrences(template, ifOperation, forOperation);

  //   result.data = { template, nodeMap: [], expressions: [] };
  result.data = { template, expressions: [] };

  while (ocorrences.success) {
    let left = ocorrences.data.left;

    let dataset = generateRandomDatasetAttribute();

    template =
      left +
      "<option " +
      dataset.directive +
      ">" +
      ocorrences.data.replacement +
      "</option>" +
      ocorrences.data.right;
    // template
    //   .split(ocorrences.data.ocorrences.data.expression)
    //   .map((el) => el.trim())
    //   .filter((el) => el.length > 0)[1]
    //   .slice(1);
    result.success = true;
    result.data.template = template;

    // debugger;
    result.data.expressions.push(
      operationOutput(
        ocorrences.data.operation.operation,
        ocorrences,
        ocorrences.data.replacement,
        ocorrences.data.query,
        dataset
      )
    );
    ocorrences = getOcorrences(template, ifOperation, forOperation);
  }

  return result;
};
