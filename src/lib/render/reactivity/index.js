import { initSubscriptions } from "../subscribe";
import { connectAttributes, connectController } from "../connect/attributes";
import { State } from "../connect/state";

const connectGetterSetterAttributes = function (instance, clone) {
  const props = instance.__config__.props;

  // Parse this shit
  for (let prop of props) {
    clone.__defineGetter__(prop, function () {
      return clone.__scope__[prop];
    });
    clone.__defineSetter__(prop, function (value) {
      
      clone.__scope__[prop] = value;
      return true;
    });
  }
};

export const connectReactivity = function (instance, clone) {
  const { scope, connect, render } = State(Object.assign({}, instance.scope));

  clone.__scope__ = scope;
  clone.__connection__ = connect;
  clone.__render__ = render;

  clone.parentElement.__scope__ = clone.__scope__;
  clone.parentElement.__connection__ = clone.__connection__;
  clone.parentElement.__render__ = clone.__render__;

  // Connect getters and setters
  connectGetterSetterAttributes(instance, clone);

  // Start subscriptions
  initSubscriptions(clone);

  // Map callbacklist
  connectAttributes(instance, clone);

  // Makes the WebComponent 
  connectController(instance,clone);
};
