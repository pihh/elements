import { getIfSetup } from "../../../helpers/expression/get-if-setup";
import { getOcorrenceIndexes } from "../../../helpers/expression/get-ocorrence-indexes";
import { getStrBetween } from "../../../helpers/regex";
import { TemplateManager } from "../manager";
import { parseIndexItem } from "../parse-index-item";

const CONFIG = {
  operation: "@if",
  indexKey: "",
  datasetConnection: "data-if-connection",
  datasetQuery: "data-if-query",
  replacement: "@__if",
};
let indexKeyId = 0;
let replacementIds = [];
export const parseIfOperations = function (template, id, scope) {
  let loop = true;
  let loops = 0;

  while (template.indexOf(CONFIG.operation) > -1) {
    // console.log(template, template.indexOf(CONFIG.operation))
    loops++;

    if (loops > 25) {
      loop = false;
      break;
    }

    let ifIndexs = getOcorrenceIndexes(template, CONFIG.operation);
    const openIndexes = getOcorrenceIndexes(template, "{");

    if (ifIndexs.length == 0) {
      loop = false;
      break;
    }

    let ifIndex = ifIndexs[0];
    let open = openIndexes.filter((openIndex) => openIndex > ifIndex)[0];
    let stack = [0];
    for (let k = open + 1; k < template.length; k++) {
      let char = template.charAt(k);

      if (char == "}") {
        stack.pop();
      }
      if (char == "{") {
        stack.push(1);
      }
      if (stack.length == 0) {
        let left = template.slice(0, ifIndex - 1);
        let right = template.slice(k + 1);
        let content = template.slice(open + 1, k - 1);
        let replacement_id = id + "_if-" + Date.now();
        if (replacementIds.indexOf(replacement_id) == -1) {
          replacementIds.push(replacement_id);
          let query = template.slice(ifIndex + CONFIG.operation.length, open);
          let setup = getIfSetup(query);

          let replacementQuery = `${setup.query}`;

          let replacement =
            `<span data-if-connection="${replacement_id}" data-if-query="${replacementQuery}">${CONFIG.replacement}()</span>`
              .replaceAll("@endif()", "")
              .replaceAll("@endif", "")
              .replaceAll("}", "")
              .replaceAll("{", "")
              .trim();

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

          // Create a new template
          new TemplateManager(replacement_id, scope);
          break;
        }
      }
    }
  }

  template = template.replaceAll("@__if", "@if");
  return template;
};

export const parseSingleIfOperation = function (
  template,
  id,
  ifIndex,
  openIndexes,scope=[]
) {
  ifIndex = template.indexOf("@if")
  let open = openIndexes.filter((openIndex) => openIndex > ifIndex)[0];
  let stack = [0];
  for (let k = open + 1; k < template.length; k++) {
    let char = template.charAt(k);

    if (char == "}") {
      stack.pop();
    }
    if (char == "{") {
      stack.push(1);
    }
    if (stack.length == 0) {
      
  
      let left = template.slice(0, ifIndex - 1);
      let right = template.slice(k +1 );
      

      let content = template.slice(open + 1, k - 1);
      let replacement_id = id + "_if-" + Date.now();
      if (replacementIds.indexOf(replacement_id) == -1) {
        replacementIds.push(replacement_id);
        let query = template.slice(ifIndex + CONFIG.operation.length, open);
        let setup = getIfSetup(query);

        let replacementQuery = `${setup.query}`;

        let replacement =
          `<span data-if-connection="${replacement_id}" data-if-query="${replacementQuery}">${CONFIG.replacement}()</span>`
            .replaceAll("@endif()", "")
            .replaceAll("@endif", "")
            .replaceAll("}", "")
            .replaceAll("{", "")

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
        new TemplateManager(replacement_id, scope);

        let elseIndex = template.indexOf('@else');
        let _ifIndex = template.indexOf('@if');
        if( elseIndex > -1 ){
          if(_ifIndex == -1 || elseIndex < _ifIndex ){
            
            // console.log('will parse else ',template)
            template = template.slice(0,elseIndex )+ ' @if(!'+replacementQuery+')' + template.slice(elseIndex+5);
            let openIndexes = getOcorrenceIndexes(template, "{");
            console.log('will replace else')
            return parseSingleIfOperation(template,replacement_id+'_'+(parseInt(Math.random()*100)),elseIndex-1,openIndexes)
          }
        }
      
     
        break;
      }
    }
  }
  return template;
};
