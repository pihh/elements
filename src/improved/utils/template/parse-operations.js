import { generateRandomDatasetKey } from "./dataset-key";
import { createPlaceholder } from "./operations/placeholder";
import { extractOperationForVariables } from "./operations/for";
import { extractVariables } from "./evaluate-expressions";

const findStackInstance = function (string, leftSearch, rightSearch) {
  let stack = 0;
  let index = string.indexOf(leftSearch);
  if (index > -1) {
    stack++;
    index++;
  }
  let result = {
    success: false,
    start: index,
    end: -1,
    expression: "",
  };
  for (let i = index; i < string.length; i++) {
    let char = string.charAt(i);
    if (char === leftSearch) {
      stack++;
    }
    if (char === rightSearch) {
      stack--;
    }
    if (stack === 0) {
      result.success = true;
      result.start = index;
      result.end = i + 1;
      result.expression = string.substring(index, i);
      break;
    }
  }

  return result;
};

const findBraketIndiceMatches = function (string) {
  return findStackInstance(string, "{", "}");
};

const findParethesisIndiceMatches = function (string) {
  return findStackInstance(string, "(", ")");
};
export const parseTemplateOperations = function (template, observedAttributes) {
  let operations = {};

  let forIndex = template.indexOf("@for(");

  while (forIndex !== -1) {
    let wrapperLeftIndex = forIndex;
    let wrapperRightIndex = forIndex;
    let tmp = template.slice(forIndex);
    let parenthesisResult = findParethesisIndiceMatches(tmp);
    wrapperRightIndex += parenthesisResult.end;
    tmp = template.slice(wrapperRightIndex);
    let bracketsResult = findBraketIndiceMatches(tmp);
    wrapperRightIndex += bracketsResult.end;
    // console.log({ parenthesisResult, bracketsResult });
    let left = template.slice(0, wrapperLeftIndex);
    let right = template.slice(wrapperRightIndex);
    let dataset = generateRandomDatasetKey("for");
    let query = parenthesisResult.expression;
    let content = bracketsResult.expression;
    const placeholder = createPlaceholder(dataset, content);
    template = left + placeholder + right;
    operations[dataset.key] = dataset;

    const { sourceVariable, maskVariable } =
      extractOperationForVariables(query);
    operations[dataset.key].sourceVariable = sourceVariable;
    operations[dataset.key].maskVariable = maskVariable;

    operations[dataset.key].listeners = [sourceVariable + ".length"];
    operations[dataset.key].localScope = {
      index: 0,
    };
    operations[dataset.key].localScope[maskVariable] = sourceVariable + "[0]";
    operations[dataset.key].configuration = {};
    forIndex = template.indexOf("@for(");
  }

  let ifIndex = template.indexOf("@if(");
  while (ifIndex !== -1) {
    let wrapperLeftIndex = ifIndex;
    let wrapperRightIndex = ifIndex;
    let tmp = template.slice(ifIndex);
    let parenthesisResult = findParethesisIndiceMatches(tmp);
    wrapperRightIndex += parenthesisResult.end;
    tmp = template.slice(wrapperRightIndex);
    let bracketsResult = findBraketIndiceMatches(tmp);
    wrapperRightIndex += bracketsResult.end;
    let left = template.slice(0, wrapperLeftIndex);
    let right = template.slice(wrapperRightIndex);
    let query = parenthesisResult.expression;
    let content = bracketsResult.expression;
    let dataset = generateRandomDatasetKey("if");

    dataset.listeners = extractVariables(query, observedAttributes) || [];

    dataset.expression = query;

    let placeholder = createPlaceholder(dataset, content);
    template = left + placeholder + right;
    operations[dataset.key] = {
      type: "if",
      conditions: [dataset],
    };
    let originalKey = dataset.key;
    let originalCondition = dataset.expression;
    let originalListeners = dataset.listeners;
    if (right.trim().indexOf("else") < 3) {
      ifIndex = template.indexOf(right);
      wrapperLeftIndex = ifIndex;
      wrapperRightIndex = ifIndex;
      tmp = template.slice(ifIndex);

      bracketsResult = findBraketIndiceMatches(tmp);
      wrapperRightIndex += bracketsResult.end;
      left = template.slice(0, wrapperLeftIndex);
      right = template.slice(wrapperRightIndex);
      dataset = generateRandomDatasetKey("if");
      dataset.expression = "!" + originalCondition;

      query = "!" + query;
      content = bracketsResult.expression;
      placeholder = createPlaceholder(dataset, content);
      template = left + placeholder + right;

      operations[originalKey].conditions.push(dataset);
      operations[originalKey].conditions.forEach((el) => {
        el.expression = "${" + el.expression + "}";
      });
    }
    ifIndex = template.indexOf("@if(");
  }

  return { template, operations };
};
