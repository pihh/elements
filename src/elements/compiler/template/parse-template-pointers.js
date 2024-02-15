import { getOcorrenceIndexes } from "../../helpers/expression/get-ocorrence-indexes";
import {
  getStrBetween,
  getStrBetweenStack,
} from "../../helpers/expression/get-string-between";
import { parseTemplateString } from "./parse-template-string";

/**
 *
 * @param {String} template
 * @param {*} props
 * @param {*} actions
 * @returns
 */
export const parseTemplatePointers = function (
  template,
  props = [],
  actions = []
) {
  let matches = [];
  matches = getStrBetween(template);

  for (let match of matches) {
    let m = match;
    for (let action of actions) {
      let indexes = getOcorrenceIndexes(match, action);
      if (indexes.length > 0) {
        indexes.reverse();
        for (let index of indexes) {
          m = parseTemplateString(m, index, action, "this.parent." + action);
        }
      }
    }
    template = template.replaceAll("{{" + match + "}}", "{{" + m + "}}");
  }

  template = template == "string" ? template : template.innerHTML;
  matches = getStrBetween(template);

  for (let match of matches) {
    let m = match;
    for (let prop of props) {
      let indexes = getOcorrenceIndexes(match, prop);

      if (indexes.length > 0) {
        indexes.reverse();
        for (let index of indexes) {
          m = parseTemplateString(m, index, prop, "this." + prop);
        }
      }
    }
    template = template.replaceAll("{{" + match + "}}", "{{" + m + "}}");
  }
  matches = getStrBetween(template, "@if(", ")");
  // matches = getStrBetweenStack(template);

  for (let match of matches) {
    let m = match;
    for (let prop of props) {
      let indexes = getOcorrenceIndexes(match, prop);

      if (indexes.length > 0) {
        indexes.reverse();
        for (let index of indexes) {
          m = parseTemplateString(m, index, prop, "this." + prop);
        }
      }
    
    }
    template = template.replaceAll("@if(" + match + ")", "@if(" + m + ")");
  }

  return template;
};
