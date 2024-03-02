import { generateRandomDatasetKey } from "./dataset-key";
import { extractVariables } from "./evaluate-expressions";

export const parseTemplateAttributes = function (
  element,
  observedAttributes,
) {
  let operations = {};
  let attributeNames = element.getAttributeNames();
  for (let attr of attributeNames) {
    let value = element.getAttribute(attr);
    if (value.indexOf("{{") > -1) {
      let dataset = generateRandomDatasetKey("attribute");
      let ocorrences = value
        .split("{{")
        .map((el) => el.trim())
        .filter((el) => el.length > 0)
        .map((el) => el.split("}}")[0]);
      dataset.attr = attr; //attribute
      dataset.expression = value.replaceAll("{{", "${").replaceAll("}}", "}");
      dataset.listeners = [];
      for (let ocorrence of ocorrences) {
        let listeners = extractVariables(ocorrence, observedAttributes);

        dataset.listeners = dataset.listeners.concat(listeners);
      }
      dataset.listeners = [...new Set(dataset.listeners)];
      operations[dataset.key] = dataset;
      element.dataset[dataset.selectorCamel] = true;
    }
   
  }
  return operations;
};
