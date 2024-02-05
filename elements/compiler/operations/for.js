
import { getIndexes, getStrBetween, isChar } from "../../helpers/regex";
import {
  CompileAttributes,
} from "../elements/attributes";
import { CompileTextNodes } from "../elements/nodes";
import { setupElement } from "../elements/setup";
import { modelValue } from "../model/update";

import { CreatePlaceholderElement } from "./comment";

function getForBetween(str) {
  let matches = [];
  try {
    matches = str
      .split('*for="')
      .slice(1)
      .map((el) => el.split('"')[0].trim());
  } catch (e) {}

  return matches || [];
}

export const CompileForOperator = function (
  element,
  scope,
  connection,
  config = {}
) {
  config = {
    customAttributes: [],
    level: 0,
    ...config,
  };
  /*
   * Nada mais que um template para criar novos elementos
   * Step 1: O query
   * Step 2: A factory
   * Step 3: Os eventos
   */

  if (element.__forOperationBound) return;
  element.__forOperationBound = true;

  const { $comment, query } = CreatePlaceholderElement(element, "*for");
  const split = query
    .split(";")[0]
    .split(" of ")
    .map((el) => el.trim()); 
  let descriptor = split[0].replaceAll("{{", "").trim(); 
  let reference = split[1]
    .replaceAll("}}", "")
    .trim()
    .split(";")[0]
    // .replaceAll("this.", "")
    .trim();

  let indexKey = "__$index" + config.level + "__";
  const indexSplit = query.split(';')[1];
  if(indexSplit && indexSplit.indexOf("$index")> -1){
    indexKey = indexSplit.split('=')[0].trim()
  }

  // Get the template;
  let template;
  let container;
  let placeholder = document.createElement("div");
  document.body.appendChild(placeholder);
  placeholder.appendChild(element);
  container = placeholder.cloneNode(true);
  template = placeholder.cloneNode(true).innerHTML.trim();
  element.remove();
  placeholder.remove();
  if (!descriptor || !reference) return;
  // We now have the template cleaned, a container, the descriptor and the reference

  // Will parse the template;
  const matches = getStrBetween(template);

  for (let match of matches) {
    let m = "{" + match + "}";
    let indexes = getIndexes(m, descriptor);

    for (let index of indexes) {
      if (index > -1) {
        let before = m.charAt(index - 1);
        let after = m.charAt(index + descriptor.length);
        if (!isChar(before) && !isChar(after)) {
          m = m.split("");
          let l = m.slice(0, index);
          let r = m.slice(index + descriptor.length);
          m = l.join("") + reference + "[" + indexKey + "]" + r.join("");
        }
      }
    }
    template = template.replaceAll("{" + match + "}", m);
  }

  const forMatches = getStrBetween(template, '*for="', '"'); // "+descriptor);
  for (let match of forMatches) {
    let m = '*for="' + match + '"';
    let indexes = getIndexes(m, descriptor);
    // console.log(indexes, m, descriptor);
    for (let index of indexes) {
      if (index > -1) {
        let before = m.charAt(index - 1);
        let after = m.charAt(index + descriptor.length);
        if (!isChar(before) && !isChar(after)) {
          m = m.split("");
          let l = m.slice(0, index);
          let r = m.slice(index + descriptor.length);
          m = l.join("") + reference + "[" + indexKey + "]" + r.join("");
        }
      }
    }
    template = template.replaceAll('*for="' + match + '"', m);
  }

  $comment.__forLoopContainer = $comment.__forLoopContainer || [];
  $comment.__forLoopItemFactory = function (index) {
    if ($comment.__forLoopContainer.length <= index) {
      let instance = container.cloneNode(false);

      instance.innerHTML = template.replaceAll(indexKey, index);
      instance = instance.firstElementChild;
      $comment.after(instance);
      $comment.__forLoopContainer.push(instance);
      setupElement(instance);
      
      CompileAttributes(instance, scope, connection, {
        level: config.level + 1,
        reset: true,
      });
      CompileTextNodes(instance, scope, connection, {
        level: config.level + 1,
        reset: true,
      });
    }
  };

  const callback = function (value) {
    if (value !== undefined) {
      $comment.__forLoopItemFactory(value - 1);
    }
  };

  const eventName = reference.replaceAll("this.", "").trim() + ".length";
  const expressionValue = modelValue(scope, reference.replace("this.", ""));

  $comment.__subscribe(eventName, scope, connection, callback);
  for (let i = 0; i < expressionValue.length; i++) {
    $comment.__forLoopItemFactory(i);
  }
 
};
