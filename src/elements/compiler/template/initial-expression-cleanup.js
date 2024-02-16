import { getStrBetween } from "../../helpers/regex";

/**
 * 
 * @param {HTMLElement} element 
 * @returns 
 */
export const initialExpressionCleanup = function (element) {
    // Step 1: Wrap the element so we can evaluate it as a whole then extract it's innerHTML   
    // let $placeholder = document.createElement("div");
    // $placeholder.appendChild = element;
    
    // Get innerHTML for evaluation
    let innerHTML = element.content.firstElementChild.innerHTML;
    
    // Find all ocorrences of the mustache expression
    let matches = getStrBetween(innerHTML);

    // Remove whitespace on {{'s
    for (let match of matches) {
      const original = "{{" + match + "}}";
      const replacement = "{{" + match.replaceAll(" ", "") + "}}";
      innerHTML = innerHTML.replaceAll(original, replacement);
    }
    // $placeholder.innerHTML = innerHTML;
    innerHTML = innerHTML.replaceAll('}@', '} @').replaceAll('{@', '{ @');
    innerHTML = innerHTML.replaceAll('@else{', '@else {').replaceAll('}@else','} @else')
    try {
      element.innerHTML = innerHTML
    } catch (e) {
      // debugger
      // const tmp = document.createElement("template");
      // tmp.setAttribute("id", element.id);
      // element.replaceWith(tmp);
      // tmp.appendChild($placeholder.firstChild);
      // // return element;
      // element = $placeholder.firstChild;
    }
  
    return element;
  };