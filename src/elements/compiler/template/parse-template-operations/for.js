import { getForLoopSetup } from "../../../helpers/expression/get-for-loop-setup";
import { getOcorrenceIndexes } from "../../../helpers/expression/get-ocorrence-indexes";
import { getStrBetween, isChar } from "../../../helpers/regex";
import { TemplateManager } from "../manager";
import { parseIndexItem } from "../parse-index-item";

let indexKeyId = 0;
let replacementIds = [];


export const parseSingleForOperation = function (
  template,
  id,
  forIndex,
  scope=[]
) {
  let openIndexes = getOcorrenceIndexes(template, "{");
  let open = openIndexes.filter((openIndex) => openIndex >= forIndex)[0];
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
 
      let left = template.slice(0, forIndex - 1);
      let right = template.slice(k + 1);
      let content = template.slice(open + 1, k - 1);
      let replacement_id = id + "_for-" + Date.now();
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
                  " of " + source + "[" + index + "]"
                );
                content = content.replace(
                  "@for(" + match + ")",
                  "@for(" + m + ")"
                );
              }
            }
          }
        }

        const matchesIf = getStrBetween(content, "@if(", ")");
  
        for (let match of matchesIf) {
          
          let idx = match.indexOf(variable);
          let nextIdx = idx + variable.length ;
          let prevValid = false;
          let nextValid = false;
          if (idx > -1) {
            if (idx > 0) {
              if (!isChar(match.charAt(idx - 1))) {
                prevValid = true;
              }
            } else {
              prevValid = true;
            }
          }

          if (nextIdx > match.length) {
            nextValid = true;
          } else {
            if (!isChar(match.charAt(nextIdx))) {
              nextValid = true;
            }
          }
          if (prevValid && nextValid) {
       
            let left = match.slice(0, idx );
            let right = match.slice(idx + variable.length);
            let m = left + 'this.'+source+"[" + index + "]" + right;
   
            content = content.replace("@if(" + match + ")", " @if(" + m.trim() + ") ");
            
          }
        }
      
 

  
        let replacementQuery =
          "(" + setup.query.query + ";index = " + setup.index + ")";
        let replacement =
          '<option data-for-connection="' +
          replacement_id +
          '" data-for-query="' +
          replacementQuery +
          '">@__for()</option>';

        const $template = document.createElement("template");
        const $wrapper = document.createElement("div");

        document.head.appendChild($template);
        $wrapper.innerHTML = content
      
          

        $template.content.appendChild($wrapper);
        $template.setAttribute("id", "template-" + replacement_id);

        template = left + replacement + right;
        template = parseIndexItem(template, variable, source, index);

        new TemplateManager(replacement_id, scope);
        
       
      }else{
        /*
     
        */
      //  console.log(template)
      //  debugger;
      }
      break;
    }
  }
  return template
};
