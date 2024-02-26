/**
 * Handles the cleanup of the expression string
 * @param {String} template 
 * @param {String} sourceExpression 
 * @param {String} targetExpression 
 * @returns 
 * @note @todo ver se é p apgar
 */

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