import { findTextNodes } from "../../helpers/dom";
import { extractLookedPaths } from "../../helpers/path";
import { setupElement } from "./setup";

export const CompileTextNode = function (node, scope, connection) {
  const query = "`" + node.textContent + "`";
  const parsedQuery = query.replaceAll("{{", "${").replaceAll("}}", "}");
  const subscriptions = extractLookedPaths(scope, query);

  node = setupElement(node);

  for (let __sub of subscriptions.map((s) => s.replace("this.", "").trim())) {
    const callback = function () {
      const $fn = Function("return " + parsedQuery);
      const output = $fn.call(scope);
      node.textContent = output;
    };
    node.__subscribe(__sub, scope, connection, callback);
  }
};

export const CompileTextNodes = function (element, scope, connection) {
  const $nodes = findTextNodes(element).filter(
    ($node) => $node.textContent.indexOf("{{") > -1
  );

  for (let $node of $nodes) {
    CompileTextNode($node, scope, connection);
  }
};
