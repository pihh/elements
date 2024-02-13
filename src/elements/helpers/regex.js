
export { isChar } from "./validation/is-char";
export { getIndexes } from "./regex/get-indexes";

export { getStrBetween } from "./expression/get-string-between";
export { getExpressionProperties } from "./expression/get-expression-properties";
export { parseTemplateString } from "../compiler/template/parse-template-string";
export const initialExpressionCleanup = function (element) {
  // INITIAL CLEANUP

  let innerHTML = element.innerHTML;
  let matches = getStrBetween(innerHTML);
  for (let match of matches) {
    const original = "{{" + match + "}}";
    const replacement = "{{" + match.replaceAll(" ", "") + "}}";
    innerHTML = innerHTML.replaceAll(original, replacement);
  }
  try {
    element.innerHTML = innerHTML;
  } catch (e) {
    const placeholder = document.createElement("div");
    placeholder.innerHTML = innerHTML;
    const tmp = document.createElement("template");
    tmp.setAttribute("id", element.id);
    element.replaceWith(tmp);
    tmp.appendChild(placeholder);
    // return element;
    element = placeholder;
  }

  return element;
};





export const parseTemplateExpressions = function (
  template,
  sourceExpression,
  targetExpression
) {
  let matches = [];
  matches = getStrBetween(template);

  for (let match of matches) {
    let m = match;

    let indexes = getIndexes(match, sourceExpression);
    if (indexes.length > 0) {
      indexes.reverse();
      for (let index of indexes) {
        m = parseTemplateString(m, index, sourceExpression, targetExpression);
      }
    }
    template = template.replaceAll("{{" + match + "}}", "{{" + m + "}}");
  }

  matches = getStrBetween(template, "(", ")");
  for (let match of matches) {
    let m = match;

    let indexes = getIndexes(match, sourceExpression);
    if (indexes.length > 0) {
      indexes.reverse();
      for (let index of indexes) {
        m = parseTemplateString(m, index, sourceExpression, targetExpression);
      }
    }

    template = template.replaceAll("(" + match + ")", "(" + m + ")");
  }
  return template;
};
