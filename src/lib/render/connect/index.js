
import { connectReactivity } from "./reactivity";

export const Connect = function (instance,clone) {
  
  clone.innerHTML = instance.__config__.template;

  connectReactivity(instance,clone)


};
