import { Parser } from "../parser";
import { stringContentType } from "../string-content-type";

export const connectEmitter = function(instance,element,config) {
    // const listeners = getEventListeners(instance);
    // if()
    instance.addEventListener(config.eventName,instance[config.parentAction]);
    element.registerParentListener(config.eventName,instance)
    try{

        element.removeAttribute("("+config.eventName+")");
        delete element.dataset[config.selectorCamel];
    }catch(ex){
        console.warn(ex)
    }


    // element.addEventListener(config.event, ($event) => {
      
    //   instance[config.expression](
    //       ...config.args.map((arg) => {
    //         if (arg === "$event") return $event;
    //         if (
    //           instance.constructor.observedAttributes.indexOf(
    //             arg.trim().replaceAll("[", ".").split(".")[0]
    //           ) > -1
    //         ) {
    //           if(arg.indexOf('.') > -1 || arg.indexOf('[') > -1){

    //             let fn = Function("return `${JSON.stringify(this."+arg+")}`")
    //             return JSON.parse(fn.call(instance));
    //           }else {
    //             let fn = Function("return `${this."+arg+"}`");  
    //             return fn.call(instance);
    //           }
              
    //           return ""
    //         }
    //         if (
    //           Object.keys(instance.localScope).indexOf(
    //             arg.replaceAll("[", ".").split(".")[0]
    //           ) > -1
    //         ) {
    //           return instance.localScope[arg];
    //         }
    //         arg = arg.replaceAll('"', "").replaceAll("'", "");
    //         let { type, value } = stringContentType(arg);

    //         return Parser[type](value);
    //       })
    //     );
    //   });
    //   element.removeAttribute(config.attribute);
    //   delete element.dataset[config.selectorCamel];
}