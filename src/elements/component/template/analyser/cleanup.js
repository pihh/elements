import { getIndexes, getStrBetween, isChar } from "../../../helpers/regex";

let __id= 0;
export const parseTemplateString = function (
  template,
  index,
  originalExpression,
  updatedExpression
) {
  let parsedTemplate = template;
  let nextChar = template.charAt(index + originalExpression.length);
  let prevChar = template.charAt(index - 1);
  let prevValid = index == 0 || (!isChar(prevChar) && prevChar != ".");
  let nextValid =
    index + originalExpression.length > template.length || !isChar(nextChar);
  if (prevValid && nextValid) {
    parsedTemplate = template.split("");
    let leftTemplate = template.slice(0, index);
    let rightTemplate = template.slice(index + originalExpression.length);
    parsedTemplate = leftTemplate + updatedExpression + rightTemplate;
  }
  return parsedTemplate;
};
export const parseTemplatePointers = function(template, props=[], actions = []) {
//   console.log({props})
  let matches = [];


   matches = getStrBetween(template);

   for (let match of matches) {
     let m = match;
     for (let action of actions) {
       let indexes = getIndexes(match, action);
       if (indexes.length > 0) {
         indexes.reverse();
         for (let index of indexes) {
           m = parseTemplateString(
             m,
             index,
             action,
             "this.parent." + action
           );
         }
       }
     }
     template = template.replaceAll("{{" + match + "}}", "{{" + m + "}}");
   }

 template = template == "string" ? template :template.innerHTML
  matches = getStrBetween(template);

  for (let match of matches) {
    let m = match;
    for (let prop of props) {
      let indexes = getIndexes(match, prop);
    /
      if (indexes.length > 0) {
        indexes.reverse();
        for (let index of indexes) {
  
          m = parseTemplateString(m, index, prop, "this." + prop);
        }
      }
    }
    template = template.replaceAll("{{" + match + "}}", "{{" + m + "}}");
  }

  return template
}