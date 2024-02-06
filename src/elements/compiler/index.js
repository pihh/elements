import { initialExpressionCleanup } from "../helpers/regex";
import { CompileAttributes } from "./elements/attributes";
import { CompileTextNodes } from "./elements/nodes";
import { State } from "./state";

export const Compile = function (element, state,config={}) {
  config= {
    firstConnection: element.controller? true:false,
    ...config
  }
  const { scope, connect, render, pubsub } = State(state);
  
  element = initialExpressionCleanup(element);
  element.props = scope;
  element.controller = element.controller || element;
  element.pubsub = pubsub;
  element.render = render;
  for (let key of Object.keys(element.props)) {
    element.__defineSetter__(key, function (value) {
      element.props[key] = value;
      return true;
    });
    element.__defineGetter__(key, function () {
      return element.props[key];
      // return true;
    });
  }


  CompileAttributes(element, scope, connect);
  CompileTextNodes(element, scope, connect);

  element.__onConnect();
  return { element, scope };
};
