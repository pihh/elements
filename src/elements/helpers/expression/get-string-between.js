/**
 * Gets all the substrings between two substrings
 * @param {String} str
 * @param {String} start
 * @param {String} end
 * @returns Array
 */

import { getIndexes } from "../regex";

export function getStrBetween(str, start = "{{", end = "}}") {
  let matches = [];
  try {
    matches = str
      .split(start)
      .slice(1)
      .map((el) => el.split(end)[0]); //.trim());
  } catch (e) {}

  return matches || [];
}

export function getStrBetweenStack(
  str,
  search = "@if",
  start = "(",
  end = ")"
) {
  let matches = [];
  
  let idx = str.indexOf(search);
  str = str.substring(idx + search.length);
  str = str.substring(str.indexOf(start) + 1);
  while (idx > -1) {
    let stack = [1];
    for (let i = 0; i < str.length; i++) {
      let char = str.charAt(i);

      if (char == start) {
        stack.push(i);
      } else if (char == end) {
        stack.pop();
      }
      if (stack.length == 0) {
        
        matches.push(str.slice(0, i));
        idx = str.indexOf(search);
        str = str.substring(idx + search.length);
        str = str.substring(str.indexOf(start) + 1);
        break;
      }
    }
  }

  return matches
}


export function findActions(
  selector,
  parsedTemplate,
  search = "={",
  start = "{",
  end = "}"
) {

  /*
  let parsedTemplate = str;
  let matches = [];
  let idx = str.indexOf(search);

  // str = str.substring(idx );
  // str = str.substring(str.indexOf(start)+1).trim();
  
  let left = str.slice(0, idx) || "";
  let split = left.split(' ');
  let actionName = ""
  if(split.length >0){
    actionName = split[split.length - 1].split('={')[0];
  }



  while (idx > -1) {

    let stack = [1];
    for (let i = 0; i < str.length; i++) {
      let char = str.charAt(i);
     
      if (char == start) {
        stack.push(i);
      } else if (char == end) {
        stack.pop();
      }
      console.log(stack)
      if (stack.length == 0) {
        let randomUUid =
        selector + "-" + Date.now() + parseInt(Math.random() * 1000);
        let match = {
          idx,i,
          action: actionName,
          callback: "this."+str.slice(0, i-1).trim(),
          expression: actionName+'={'+str.slice(0, i)+"}",
          query:randomUUid
        }
        matches.push(match);
      
        str
        
        left = str.slice(0, idx) || "";
        split = left.split(' ');
        actionName = split[split.length-1].trim();
        
        str = 
        /*
        idx = str.indexOf(search+search.length);
        str = str.slice(idx)
        let l = parsedTemplate.length;
        
        parsedTemplate= parsedTemplate.replaceAll( match.expression,'[data-action="'+randomUUid+'"]');
        if(l == parsedTemplate.length){
          console.log({match})
          debugger
        }*
        break;
      }
    }
    if(idx != -1){

      console.log(str,idx)
      throw new Error();
    }
  }

  */
  let matches = []

  return {parsedTemplate,matches};
}
