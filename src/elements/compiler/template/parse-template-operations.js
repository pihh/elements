import { getOcorrenceIndexes } from "../../helpers/expression/get-ocorrence-indexes";
import { parseLoopOperations, parseSingleForOperation } from "./parse-template-operations/for";
import { parseIfOperations, parseSingleIfOperation } from "./parse-template-operations/if";




/**
 *
 * @param {String} template
 */
export const parseTemplateOperations = function (template, id) {
  
  while (template.indexOf('@for') >-1 || template.indexOf('@if') > -1) {
    let forIndex = template.indexOf("@for")
    let ifIndex = template.indexOf("@if")
    let openIndexes = getOcorrenceIndexes(template, "{");
    if(forIndex > -1 && forIndex > ifIndex) {
      template = parseSingleForOperation(template,id, forIndex, openIndexes,[]);
    }else if (ifIndex > -1 && ifIndex > forIndex) {
      template = parseSingleIfOperation(template, id,ifIndex, openIndexes,[]);
    }
    
  }
  template = template.replaceAll('@__for','@for')
   template = template.replaceAll('@__if','@if')
  return template;
};
