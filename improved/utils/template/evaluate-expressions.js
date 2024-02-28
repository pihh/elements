import { isChar, replaceAllMultiples } from "../string";

let getFirstVariable = function (expression) {
  return replaceAllMultiples(expression, [
    ["][", "."],
    ["[", "."],
    ["]", "."],
    ["..", "."],
    ["{{", "${"],
    ["}}", " "],
    ["${", " "],
  ])
    .split(" ")
    .map((el) => el.trim())
    .filter((el) => el.length > 0)
    .map((el) => el.split(".")[0]);
};
export const extractVariables = function (_expression, observedAttributes) {
  let expression = _expression.trim();

  expression = expression.trim();
  let expressions = [];
  let validChar = function (char) {
    return [" ","<",">","=",";",",",":","?","-","%","+","/","*",'}',"{","(",")","&","'",'"',"`","#","\\","~","^"].indexOf(char) == -1;
  };
  let str = "";
  for (let i = 0; i < expression.length; i++) {
    let char = expression.charAt(i);
    if (validChar(char)) {
      str += char;
    } else {
      if (str) {
        expressions.push(str);
        str = "";
      }
    }
  }
  if (str) {
    expressions.push(str);
  }
  let variables = expressions.filter(
    (el) => {
        let variable = getFirstVariable(el)[0] || "";
        variable = variable.trim();
        // console.log(observedAttributes,variable,el)
        return observedAttributes.indexOf(variable) > -1
    }).map(el => el.trim());
//   console.log({ expression, _expression, expressions, getFirstVariable });
  
  return variables;
  // expression = expression.replaceAll('][','.').replaceAll('[','.').replaceAll(']', '.').replaceAll('..','.');
};
