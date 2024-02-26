import { isChar } from "../../../elements/helpers/validation/is-char";

/**
 * Testes:
 *
 * {{prop}}
 * {{texto}}
 * {{fakeProp}} -> prop = color -> fakeProp = colors
 * {{prop ? 'xxx':'yyy'}} -> conditional
 *
 * @param {} expression
 * @param {*} props
 */
export function getStringBetween(str, start = "{{", end = "}}") {
  const result = str.match(new RegExp(start + "(.*)" + end));

  return result[1];
}
export const includesAny = (arr, values) => values.some(v => arr.includes(v));
export const evaluateExpression = function (expression, props = []) {
  let matches = [];
  let find = expression;
  let result = getStringBetween(find).trim();
  let match = ""
  let start = 0;
  let end = 0;
  for(let i = 0; i < result.length; i++) {
    end = i;
    let char = result.charAt(i);
    if(!isChar(char)) {
        if(char == "!") { start = i;}else{ end = i; break}
    }
  }

  
  match = result.substr(start, end+1).trim();
  if(props.includes(match)){
    let type = "argument";
    if(includesAny(result.split(""),['!',"?",":",">","=","<","(",")"])){
        type = "function"
    }
    matches.push({
        match,expression,type
    })
  }
  console.log({match,props,is:props.includes(match),matches})

//   while (result) {
//     let tmp = result;
//     tmp = tmp.replaceAll("[", ".").replaceAll("]", ".").split(".");
//     if (props.includes(tmp[0])) {
//       matches.push({
//         expression,
//         result,
//         prop: tmp[0],
//       });
//     }else{
//         find = find.replaceAll(tmp.join(".").split(" ")[0],'');
//     }
//     find = find.replaceAll(tmp.join(".").split(" ")[0],'');

//     console.log(props,find)
//     result = getStringBetween(find);
   
//   }
  return matches;
};
