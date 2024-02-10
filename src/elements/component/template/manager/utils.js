import { getStrBetween } from "../../../helpers/regex";

export const cleanTemplateString = function (templateString) {
  templateString = templateString
    .replaceAll("\r", "")
    .replaceAll("\n", "")
    .replaceAll('  ',' ')
    .trim();
  let matches = [];
  matches = getStrBetween(templateString, "@if", "(");
  for (let match of matches) {
    templateString = templateString.replaceAll("@if" + match + "(", "@if(");
  }
  matches = getStrBetween(templateString, "@for", "(");
  for (let match of matches) {
    templateString = templateString.replaceAll("@for" + match + "(", "@for(");
  }
  return templateString;
};

export const createTemplateElement = function (config, uuid = "") {
  const $head = document.head;
  let id = "el-template-" + config.selector + uuid;
  let element = $head.querySelector("#" + id);
  if (!element) {
    element = document.createElement("template");
    $head.appendChild(element);
  }
  return {
    id,
    element,
  };
};
