import { State } from "../../reactivity/state";

/**
 * Will create the scope for state management 
 * Will create a proxy, a pubsub and a connect function 
 * Will also define the getters and setters
 * 
 * @todo -> JSON serialization 
 * @param {ElComponent} component 
 */
export const connectScope = function (component) {
  const _scope = {};
  component.__props = Object.getOwnPropertyNames(component).filter(
    (el) => el.indexOf("_") != 0 && typeof el !== "function"
  );
  component.__props.forEach((key) => {
    _scope[key] = component.getAttribute(key) || component[key];
    component.setAttribute(key, _scope[key]);
  });

  const { scope, connect, render, pubsub } = State(_scope);
  component.scope = scope;
  component.connect = connect;
  component.render = render;
  component.pubsub = pubsub;

  for (let key of Object.keys(component.scope)) {
    component.__defineGetter__(key, function () {
      return component.scope[key];
    });
  }
  return component;
};
