import { getForLoopSetup } from "../../helpers/expression/get-for-loop-setup";
import { getOcorrenceIndexes } from "../../helpers/expression/get-ocorrence-indexes";
import { getStrBetween, isChar } from "../../helpers/regex";
import { TemplateManager } from "./manager";

let replacementIds = [];
const parseIndexItem = function (context, variable, source, indexKey) {
  for (let match of getStrBetween(context, 'model="' + variable, '"')) {
    let m = match.trim();
    if (match == "" || !isChar(m.charAt(0))) {
      context = context.replaceAll(
        'model="' + variable + match + '"',
        'model="' + source + "[" + indexKey + "]" + match + '"'
      );
    }
  }

  for (let match of getStrBetween(context)) {
    let m = match.trim();
    if (m.indexOf(variable) == 0) {
      if (
        !m.replace(variable, "").charAt(0) ||
        !isChar(m.replace(variable, "").charAt(0))
      ) {
        context = context.replaceAll(
          "{{" + match + "}}",
          "{{" +
            match.replace(variable, "this." + source + "[" + indexKey + "]") +
            "}}"
        ); //.replace('.scope',''));
      }
    }
  }

  for (let match of getStrBetween(context, "@for(", ")")) {
    let m = match.trim();
    let query = m.split(" of ")[1].trim();
    if (query.indexOf(variable) == 0) {
      if (
        !query.replace(variable, "").charAt(0) ||
        !isChar(query.replace(variable, "").charAt(0))
      ) {
        query = query.replace(variable, source + "[" + indexKey + "]");
        m = m.split(" of ")[0] + " of " + query;
        context = context.replaceAll("@for(" + match + ")", "@for(" + m + ")"); //.replace('.scope',''));
      }
    }
  }
  for (let match of getStrBetween(context, "@if(", ")")) {
    let m = match.trim();
    if (m.indexOf(variable) == 0) {
      if (
        !m.replace(variable, "").charAt(0) ||
        !isChar(m.replace(variable, "").charAt(0))
      ) {
        context = context.replace(
          "@if(" + match + ")",
          "@if(" +
            match.replace(variable, "this." + source + "[" + indexKey + "]") +
            ")"
        );
      }
    }
  }
  return context;
};

let indexKeyId = 0;
const parseLoopOperations = function (template, id, scope) {
  let loop = true;
  let loops = 0;
  while (template.indexOf("@for") > -1) {
    loops++;

    if (loops > 25) {
      loop = false;
      break;
    }
    // const ifIndexs = getOcorrenceIndexes(template, "@if");
    const forIndexs = getOcorrenceIndexes(template, "@for");
    const openIndexes = getOcorrenceIndexes(template, "{");

    if (forIndexs.length == 0) {
      loop = false;
      break;
    }

    let forIndex = forIndexs[0];
    let open = openIndexes.filter((openIndex) => openIndex > forIndex)[0];
    let stack = [0];
    let children;
    for (let k = open + 1; k < template.length; k++) {
      let char = template.charAt(k);

      if (char == "}") {
        stack.pop();
      }
      if (char == "{") {
        stack.push(1);
      }
      if (stack.length == 0) {
        let left = template.slice(0, forIndex - 1);
        let right = template.slice(k + 1);
        let content = template.slice(open + 1, k - 1);
        let replacement_id = id + "_" + Date.now();
        if (replacementIds.indexOf(replacement_id) == -1) {
          replacementIds.push(replacement_id);

          let index = "$index" + indexKeyId++;
          let query = template.slice(forIndex + 4, open); // + ";index = " + index + ")";

          let setup = getForLoopSetup(query);
          let variable = setup.query.attribute;
          let source = setup.query.source;

          index = setup.index;
          content = parseIndexItem(content, variable, source, index);

          const matches = getStrBetween(content, "@for(", ")");
          for (let match of matches) {
            let newSource = match.split(" of ");
            if (newSource.length > 1) {
              newSource = newSource[1].trim();
              if (newSource.indexOf(variable) == 0) {
                let nextChar = newSource.replace(variable, "");
                if (nextChar.length > 0 && isChar(nextChar.charAt(0))) {
                  // .. continue
                } else {
                  let m = match.replace(
                    " of " + variable,
                    " of " + variable + "[" + index + "]"
                  );
                  content = content.replace(
                    "@for(" + match + ")",
                    "@for(" + m + ")"
                  );
                }
              }
            }
          }
          let replacementQuery =
            "(" + setup.query.query + ";index = " + setup.index + ")";
          let replacement =
            '<span data-for-connection="' +
            replacement_id +
            '" data-for-query="' +
            replacementQuery +
            '">@__for()</span>';

          const $template = document.createElement("template");
          const $wrapper = document.createElement("div");

          document.head.appendChild($template);
          $wrapper.innerHTML = content
            .replaceAll("\r", "")
            .replaceAll("\n", "")
            .trim();

          $template.content.appendChild($wrapper);
          $template.setAttribute("id", "template-" + replacement_id);

          template = left + replacement + right;
          template = parseIndexItem(template, variable, source, index);

          children = new TemplateManager(replacement_id, scope);
          break;
        }
      }
    }
    // if (children) {
    //   children.setup();
    // }
  }
  template = template.replaceAll("@__for", "@for");
  return template;
};
/**
 *
 * @param {String} template
 */
export const parseTemplateOperations = function (template, id) {
  template = parseLoopOperations(template, id, []);
  return template;
};
