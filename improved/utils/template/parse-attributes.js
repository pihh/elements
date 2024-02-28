import { getInputConfigurations } from "../connections/binding";
import { generateRandomDatasetKey } from "./dataset-key";
import { extractVariables } from "./evaluate-expressions";

export const parseTemplateAttributes = function (element, observedAttributes) {
  let operations = {};
  let attributeNames = element.getAttributeNames();
  for (let attr of attributeNames) {
    let value = element.getAttribute(attr).trim();
    if (value.indexOf("{{") > -1) {
      let dataset = generateRandomDatasetKey("attribute");
      let ocorrences = value
        .split("{{")
        .map((el) => el.trim())
        .filter((el) => el.length > 0)
        .map((el) => el.split("}}")[0]);
      dataset.attr = attr; //attribute
      dataset.expression = value.replaceAll("{{", "${").replaceAll("}}", "}}");
      dataset.listeners = [];
      for (let ocorrence of ocorrences) {
        let listeners = extractVariables(ocorrence, observedAttributes);

        dataset.listeners = dataset.listeners.concat(listeners);
      }
      dataset.listeners = [...new Set(dataset.listeners)];
      operations[dataset.key] = dataset;
      element.dataset[dataset.selectorCamel] = true;
    } else if (
      value.charAt(0) === "{" &&
      value.charAt(value.length - 1) === "}"
    ) {
      let expression = value.slice(0, value.length - 1).slice(1);
      let dataset = generateRandomDatasetKey("action");
      let action = expression.split("(")[0].trim();
      let args = expression.split("(")[1] || "";
      args = args.split(")")[0] || "";
      args = args.trim();
      args = args.split(",");
      dataset.attribute = attr;
      dataset.event = attr.indexOf("on") == 0 ? attr.slice(2) : attr;
      dataset.expression = action;
      dataset.args = args;
      element.dataset[dataset.selectorCamel] = true;
      operations[dataset.key] = dataset;
    } else if (attr.charAt(0) == "*") {
      let dataset = generateRandomDatasetKey("bind");
      let inputInfo = getInputConfigurations(element);
      dataset.event = inputInfo.eventToListen;
      dataset.attribute = inputInfo.value;
      dataset.expression = "${" + value + "}";
      dataset.listeners = [value];
      element.dataset[dataset.selectorCamel] = true;
      operations[dataset.key] = dataset;
    }
  }
  return operations;
};
