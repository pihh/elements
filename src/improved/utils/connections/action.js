import { Parser } from "../parser";
import { stringContentType } from "../string-content-type";

export const connectAction = function(instance,element,config) {
    element.addEventListener(config.event, ($event) => {
      
      instance[config.expression](
          ...config.args.map((arg) => {
            if (arg === "$event") return $event;
            if (
              instance.constructor.observedAttributes.indexOf(
                arg.trim().replaceAll("[", ".").split(".")[0]
              ) > -1
            ) {
              if(arg.indexOf('.') > -1 || arg.indexOf('[') > -1){

                let fn = Function("return `${JSON.stringify(this."+arg+")}`")
                return JSON.parse(fn.call(instance));
              }else {
                let fn = Function("return `${this."+arg+"}`");  
                return fn.call(instance);
              }
              
              return ""
            }
            if (
              Object.keys(instance.localScope).indexOf(
                arg.replaceAll("[", ".").split(".")[0]
              ) > -1
            ) {
              return instance.localScope[arg];
            }
            arg = arg.replaceAll('"', "").replaceAll("'", "");
            let { type, value } = stringContentType(arg);

            return Parser[type](value);
          })
        );
      });
      element.removeAttribute(config.attribute);
      delete element.dataset[config.selectorCamel];
}