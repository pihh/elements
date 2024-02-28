import { generateRandomDatasetKey } from "./dataset-key";
import { extractVariables } from "./evaluate-expressions";

export const parseTemplateNodes = function (
  element,
  observedAttributes,
  operationFor
) {
  let operations = {};
  let $children = element.childNodes;
  for (let i = 0; i < $children.length; i++) {
    let $node = $children[i];
    if ($node.nodeType === 3) {
      let content = $node.textContent;
      if (content.indexOf("{{") > -1) {
        let dataset = generateRandomDatasetKey("text");
        let ocorrences = content
          .split("{{")
          .map((el) => el.trim())
          .filter((el) => el.length > 0)
          .map((el) => el.split("}}")[0]);
        dataset.childNode = i;
        dataset.expression = content
          .replaceAll("{{", "${")
          .replaceAll("}}", "}");
        element.dataset[dataset.selectorCamel] = true;
        dataset.listeners = [];
        for (let ocorrence of ocorrences) {
          let listeners = extractVariables(ocorrence, observedAttributes);

          dataset.listeners = dataset.listeners.concat(listeners);
        }
        dataset.listeners = [...new Set(dataset.listeners)];
        // console.log(dataset, operationFor, element);

        operations[dataset.key] = dataset;
      }
    }
  }
  return operations;
};
