import { filterNonEmpty } from "../array";
import { getStackContent } from "../regex/get-stack-content";

let forLoopKeyIndex = 0;

export const getForLoopSetup = function (expression) {
  // Step #1 -> tirar a porra dos ('s;
  let index;
  let setup = {
    index: index,
    success: false,
  };
  let expressionContent = getStackContent(expression, "(", ")");

  expressionContent.content = expressionContent.content.replace("(", "").trim();
  expressionContent.args = filterNonEmpty(expressionContent.content.split(";"))
    .map((el) => el.trim())
    .map((el) => {
      if (el.indexOf("let ") == 0) {
        el = el.replace("let ", "").trim();
      }
      if (el.indexOf("const ") == 0) {
        el = el.replace("const ", "").trim();
      }
      return el;
    });
  let hasIndex = false;
  expressionContent = expressionContent.args.map((el) => {
    let queryType = el.indexOf(" of ") > -1 ? "query" : "index";
    let query = filterNonEmpty(el.split(queryType == "query" ? " of " : " = "));
    
    el = {
      query: el,
      attribute: query[0].trim(),
      source: query[1].trim(),
      queryType,
    };
    if (queryType == "index") {
      hasIndex = true;
      index = el.source;
      setup.index = el.source;
    } else {
      setup.query = el;
    }
    return el;
  });
  if (!hasIndex) {
    let index = "__index__" + forLoopKeyIndex++;
    setup.index = index;
  }

  return setup;
};
