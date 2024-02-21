import { compileRules } from "../../../compile/rules";
import { output } from "../../output";
import { filterStack } from "../../regex/text";
import { generateRandomDatasetAttribute } from "../indentifiers/dataset";
import { ruleSet } from "./rules";

const setupIfOperation = function (template, scope = {}, result) {
  let loopMonitor = compileRules.whileLoop.monitor(3);
  return {
    ...ruleSet.operation.if,
    monitor: loopMonitor(3),
    getOcorrences() {},
    success() {},
    cleanup() {},
  };
};
const setupForOperation = function (template, scope = {}, result) {
  let loopMonitor = compileRules.whileLoop.monitor(3);
  return {
    ...ruleSet.operation.for,
    monitor: compileRules.whileLoop.monitor(3),
    getOcorrences() {},
    success() {},
    cleanup() {},
  };
};

const operationOutput = function (
  operation,
  operationArguments,
  originalExpression,
  parsedExpression,
  dataset
) {
  return {
    operation,

    operationArguments,
    originalExpression,
    parsedExpression,
    dataset,
  };
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
    let right = search[1];

    let query = filterStack("(" + right, "(", ")");

    let replacement =
      operation.queryStart +
      query.data.search.slice(query.data.start + 1, query.data.end);
    let ocorrences = search.slice(1).join(operation.queryStart);
    ocorrences = ocorrences.split("){").slice(1).join("){");

    ocorrences = filterStack("{" + ocorrences, "{", "}");

    result = output(true, "Found ocorrences", {
      left,
      right,
      query,
      search,
      replacement,
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
      ocorrences.data.ocorrences.data.expression +
      "</option>" +
      template
        .split(ocorrences.data.ocorrences.data.expression)
        .map((el) => el.trim())
        .filter((el) => el.length > 0)[1].slice(1);
        result.success = true;
    result.data.template = template;

    result.data.expressions.push(
      operationOutput(
        ocorrences.data.operation.operation,
        [],
        ocorrences.data.query.data.search,
        ocorrences.data.query.data.expression,
        dataset
      )
    );
    ocorrences = getOcorrences(template, ifOperation, forOperation);

 
  }

  return result;
};
