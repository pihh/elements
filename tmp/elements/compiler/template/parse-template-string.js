import { isChar } from "../../helpers/regex";

/**
 * 
 * @param {*} template 
 * @param {*} index 
 * @param {*} originalExpression 
 * @param {*} updatedExpression 
 * @returns 
 */
export const parseTemplateString = function (
    template,
    index,
    originalExpression,
    updatedExpression
  ) {

   
    // @todo ver o que se passa aqui
    let parsedTemplate = template;
    let nextChar = template.charAt(index + originalExpression.length);
    let prevChar = template.charAt(index - 1);
    let prevValid = index == 0 || (!isChar(prevChar) && prevChar != ".") || (!isChar(prevChar) && prevChar == "!" );
    
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