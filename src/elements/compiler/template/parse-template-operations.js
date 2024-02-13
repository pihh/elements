import { getOcorrenceIndexes } from "../../helpers/expression/get-ocorrence-indexes";
import { getStrBetween, isChar } from "../../helpers/regex";
import { TemplateManager } from "./manager";

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
        let content = template.slice(open +1, k-1);
        let replacement_id = id + "_" + Date.now();
        let index = "$index" + indexKeyId++
        let query =
          template.slice(forIndex, open) + ";index = "+index;
        let split = query.split(";");
        let expression =split[0].split('(')[1].replaceAll(')','');
        let variable = expression.split(' of ')[0].trim();
        let source = expression.split(' of ')[1].trim()
     
        for (let match of getStrBetween(content)) {
      
    
          let m = match.trim();
          if (m.indexOf(variable) == 0) {
            if (
              !m.replace(variable, "").charAt(0) ||
              !isChar(m.replace(variable, "").charAt(0))
            ) {
            
              content = content.replace(
                "{{" + match +"}}",
                "{{" + match.replace(variable,"this."+source + "["+index+"]")+"}}"
              ); 
            }
          }
        }

        for (let match of getStrBetween(content,'model="'+variable,'"')) {
      
          console.log({match});
          if(match == ""){
            content =content.replaceAll('model="'+variable,'model="'+source + "["+index+"]")
          }
          // let m = match.trim();
          // if (m.indexOf(variable) == 0) {
          //   if (
          //     !m.replace(variable, "").charAt(0) ||
          //     !isChar(m.replace(variable, "").charAt(0))
          //   ) {
            
          //     content = content.replace(
          //       "{{" + match +"}}",
          //       "{{" + match.replace(variable,"this."+source + "["+index+"]")+"}}"
          //     ); 
          //   }
          // }
        }
       
        let replacement =
          '<span data-for-connection="' +
          replacement_id +
          '" data-for-query="' +
          query +
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
        $wrapper.dataset.forQuery = query;
        $template.dataset.forQuery = query;
        $wrapper.setAttribute("for-query", query);

  
        template = left + replacement + right;
        for (let match of getStrBetween(template,'model="'+variable,'"')) {
      
          // console.log({match});
          if(match == ""){
            template = template.replaceAll('model="'+variable,'model="'+source + "["+index+"]")
          }

        }
        for (let match of getStrBetween(template)) {
          let m = match.trim();
          if (m.indexOf(variable) == 0) {
            if (
              !m.replace(variable, "").charAt(0) ||
              !isChar(m.replace(variable, "").charAt(0))
            ) {
          
              template = template.replaceAll(
                "{{" + match +"}}",
                "{{" + match.replace(variable,"this."+source + "["+index+"]")+"}}"
              ); //.replace('.scope',''));

              
            }
          }
        }
        children = new TemplateManager(replacement_id, scope);
        break
      }
    }
    if(children){
      children.setup()
    }

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

