import { State } from "../../../elements/reactivity/state";
import { initSubscriptions } from "../subscribe";
import { connectAttributes } from "./attributes";

const connectGetterSetterAttributes = function(instance,clone){
    const props  = instance.__config__.props;
;
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
}

export const connectReactivity = function(instance,clone){
    const { scope, connect, render } = State(instance.scope);

    clone.__scope__ = scope;
    clone.__connection__ = connect;
    clone.__render__ = render;

    // Connect getters and setters 
    connectGetterSetterAttributes(instance, clone)
    
    // Start subscriptions
    initSubscriptions(clone);

    // Map callbacklist
    connectAttributes(instance,clone)
}