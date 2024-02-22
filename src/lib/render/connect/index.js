import { connectReactivity } from "../reactivity";


export const Connect = function (instance,clone) {
 
  if(!clone || !clone.__connected__ ){    
    if(!clone.innerHTML){
      clone.innerHTML = instance.__config__.template;
    }  
    connectReactivity(instance,clone)
    clone.__connected__ = true;
    
  }
  clone.__render__();
};
