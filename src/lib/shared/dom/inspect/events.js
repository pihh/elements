import { compileRules } from "../../../compile/rules";
import { actionCallback } from "../../../render/reactivity/expressions";
import { output } from "../../output";
import { filterStack } from "../../regex/text";
import { generateRandomDatasetAttribute } from "../indentifiers/dataset";
import { ruleSet } from "./rules";

const eventOutput = function (
  eventName,
  eventType,
  eventArguments,
  originalExpression,
  parsedExpression,
  dataset
) {
  let out = {
    eventName,
    eventType,
    eventArguments,
    originalExpression,
    parsedExpression,
    dataset,
  };
  out.setup = function (instance, element, map) {
    let clone = element.querySelector(out.dataset.selector);

    let callback = actionCallback(element, parsedExpression, eventArguments);
    if ("touchstart" in window) {
      clone.addEventListener("touchstart", callback);
    } else {
      clone.addEventListener("click", callback);
    }

    delete element.dataset[out.dataset.path];
  };
  out.callback = function () {};
  return out;
};

export const inspectEvents = function (template, scope = {}) {
  const rule = ruleSet.event.rule;
  const leftRule = ruleSet.event.leftSearch;
  const rightRule = ruleSet.event.rightSearch;

  let result = output();
  let eventName;
  let eventExpression;
  result.data = { template, expressions: [] };

  const getOcorrences = function (template) {
    let ocorrences = template.split(rule);
    let parsedOcorences = [];
    if (ocorrences.length > 1) {
      for (let i = 1; i < ocorrences.length; i++) {
        let left = ocorrences[i - 1];
        let right = ocorrences[i];
        if (right.charAt(0) != "{") {
          parsedOcorences.push(left);
          parsedOcorences.push(right);
          break;
        }
      }
    }
    return parsedOcorences;
  };
  let loopMonitor = compileRules.whileLoop.monitor(3);
  let ocorrences = getOcorrences(template);

  while (ocorrences.length > 0) {
    loopMonitor();

    let left = ocorrences[0];
    let right = ocorrences[1].trim();
    let originalExpression;
    let dataset = generateRandomDatasetAttribute();
    let parsedExpression;

    eventName = left.split(leftRule);
    eventName = eventName[eventName.length - 1];
    eventExpression = filterStack("{" + right, "{", rightRule);

    originalExpression =
      leftRule + eventName + rule + eventExpression.data.expression + rightRule;
    template = template.replace(originalExpression, dataset.directive);
    parsedExpression = eventOutput(
      eventName,
      "native",
      [],
      originalExpression,
      eventExpression.data.expression,
      dataset
    );
    result.success = true;
    result.message = "found ocurrences";

    result.data.template = template;
    result.data.expressions.push(parsedExpression);
    ocorrences = getOcorrences(template);
  }

  return result;
};

export const inspectCustomEvents = function (template, scope = {}) {
  const rule = ruleSet.customEvent.rule;
  const leftRule = ruleSet.customEvent.leftSearch;
  const rightRule = ruleSet.customEvent.rightSearch;
  let eventName;
  let eventExpression;

  let result = output();
  let ocorrences = template.split(rule);
  let loopMonitor = compileRules.whileLoop.monitor(3);

  result.data = { template, expressions: [] };
  while (ocorrences.length > 1) {
    loopMonitor();
    let left = ocorrences[0];
    let right = ocorrences[1].trim();
    let originalExpression;
    let dataset = generateRandomDatasetAttribute();
    let parsedExpression;

    eventName = left.split(leftRule);
    eventName = eventName[eventName.length - 1];
    eventExpression = filterStack("{" + right, "{", rightRule);

    originalExpression =
      leftRule + eventName + rule + eventExpression.data.expression + rightRule;
    template = template.replace(originalExpression, dataset.directive);
    parsedExpression = eventOutput(
      eventName,
      "custom",
      [],
      originalExpression,
      eventExpression.data.expression,
      dataset
    );
    result.success = true;
    result.message = "found ocurrences";

    result.data.template = template;
    result.data.expressions.push(parsedExpression);
    ocorrences = template.split(rule);
  }

  return result;
};
