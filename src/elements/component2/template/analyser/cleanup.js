import { getIndexes, getStrBetween, isChar } from "../../../helpers/regex";

export const initialExpressionCleanup = function (element) {

  // INITIAL CLEANUP
if(!element) return;
  let innerHTML = element.innerHTML;
  let matches = getStrBetween(innerHTML);
  for (let match of matches) {
    const original = "{{" + match + "}}";
    const replacement = "{{" + match.replaceAll(" ", "") + "}}";
    innerHTML = innerHTML.replaceAll(original, replacement);
  }

  // matches = getStrBetween(innerHTML, '@for','@endfor');
  // while(matches.length > 0){
  //   for (let match of matches) {
  //     const original = "@for" + match + "@endfor";
  //     const replacement = "@for" + match.replaceAll(" ", "") + "@endfor";
      
  //     innerHTML = innerHTML.replaceAll(original, replacement);
  //   }
  // }
  try{

    element.innerHTML = innerHTML;
  }catch(e){
    const placeholder = document.createElement("div");
    placeholder.innerHTML = innerHTML;
    const tmp =document.createElement("template");
    tmp.setAttribute('id',element.id);
    element.replaceWith(tmp);
    tmp.appendChild(placeholder);
    
    element = placeholder
  }

  return element

};

export const parseTemplateString = function (
  template,
  index,
  originalExpression,
  updatedExpression
) {
  

  if(!template) return
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