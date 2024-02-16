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

export const parseSingleIfOperation = function (
  template,
  id,
  ifIndex,
 scope=[]
) {
  ifIndex = template.indexOf("@if")
  let openIndexes = getOcorrenceIndexes(template, "{");
  let open = openIndexes.filter((openIndex) => openIndex >= ifIndex)[0];
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
          `<option data-if-connection="${replacement_id}" data-if-query="${replacementQuery}">${CONFIG.replacement}()</option>`
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

        //template = left + replacement + right;
        new TemplateManager(replacement_id, scope);

        let elseIndex = right.indexOf('@else');
        let _ifIndex = right.indexOf('@if');
        if( elseIndex > -1 ){
          if(_ifIndex == -1 || elseIndex < _ifIndex ){
            right = right.slice(0,elseIndex )+ ' @if(!'+replacementQuery+')' + right.slice(elseIndex+5);
          }
        }
        template = left+replacement+right;
      
     
        break;
      }else{
   
        return template;
        break;
      }
    }
  }
  return template;
};
