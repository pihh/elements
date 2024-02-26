// import { getOcorrenceIndexes } from "../../helpers/expression/get-ocorrence-indexes";
import { parseSingleForOperation } from "./parse-template-operations/for";
import { parseSingleIfOperation } from "./parse-template-operations/if";

/**
 *
 * @param {String} template
 */
export const parseTemplateOperations = function (template, id) {
  while (template.indexOf("@for") > -1 || template.indexOf("@if") > -1) {
    let forIndex = template.indexOf("@for");
    let ifIndex = template.indexOf("@if");

    if (forIndex > -1) {
      if (ifIndex == -1) {
        template = parseSingleForOperation(template, id, forIndex, []);
      } else if (forIndex < ifIndex) {
        template = parseSingleForOperation(template, id, forIndex, []);
      } else {
        template = parseSingleIfOperation(template, id, ifIndex, []);
      }
    } else if (ifIndex > -1) {
      if (forIndex == -1) {
        template = parseSingleIfOperation(template, id, ifIndex, []);
      } else if (ifIndex < forIndex) {
        template = parseSingleIfOperation(template, id, ifIndex, []);
      } else {
        template = parseSingleForOperation(template, id, forIndex, []);
      }

 
    }
  }
  template = template.replaceAll("@__for", "@for");
  template = template.replaceAll("@__if", "@if");
  return template;
};
