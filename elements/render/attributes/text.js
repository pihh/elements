import { findTextNodes } from "..";
import { setupElement } from "../../utils/element";
import { connectReactivity, textCallback } from "../../utils/eval/callback";
import { parseExpression } from "../../utils/regex";

export const connectTextNodesV2 = function ($element, log = false) {
  for (let $node of findTextNodes($element)) {
    $node = setupElement($node);
    
    if ($node) {
    
     
       
      if ($element.customParameters) {
        $node.customParameters = {
          ...$element.customParameters,
          ...$node.customParameters,
        };
      }
      const originalString = $node.textContent;
      $node.template = originalString;

      if (
        !$node.didConnect &&
        originalString.indexOf("{{") > -1 &&
        !$node.skip
      ) {
        $node.didConnect = true;
        const originalString = $node.textContent;
        
        const expression = parseExpression(originalString);
        const callback = function () {
          textCallback($element.controller, $node, expression, originalString);
        };

        connectReactivity($element.controller, $node, originalString, callback);
      }
    }
  }
};
