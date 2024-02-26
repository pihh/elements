import { extractLookedPaths } from "../../helpers/path";
import { CreatePlaceholderElement } from "./comment";

export const CompileIfOperator = function (element, scope, connection) {
    const {$comment,query} = CreatePlaceholderElement(element,'*if')
    let parsedQuery =
      "`" + query.replaceAll("{{", "${").replaceAll("}}", "}") + "`";
  
    const subscriptions = extractLookedPaths(scope, query);
  
    for (let __sub of subscriptions.map((s) => s.replace("this.", "").trim())) {
      const callback = function () {
        const $fn = Function("return " + parsedQuery);
        const output = $fn.call(scope);
      
        if (["true", true].indexOf(output) > -1) {
          if (!element.isConnected) {
            $comment.after(element);
          }
        } else {
          if (element.isConnected) {
            element.remove();
          }
        }
      };
      element.__subscribe(__sub, scope, connection, callback);
      callback();
    }
  };