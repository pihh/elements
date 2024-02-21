import { connectReactivity } from "../reactivity";


export const Connect = function (instance,clone) {
  if(!clone.innerHTML){
    clone.innerHTML = instance.__config__.template;
  }  

  connectReactivity(instance,clone)


};
