import { Parser } from "../parser";
import { stringContentType } from "../string-content-type";

export const connectAction = function(instance,element,config,) {
    element.addEventListener(config.event, ($event) => {
      console.log(instance,config)  
      instance[config.expression](
          ...config.args.map((arg) => {
            if (arg === "$event") return $event;
            if (
              instance.constructor.observedAttributes.indexOf(
                arg.replaceAll("[", ".").split(".")[0]
              ) > -1
            ) {
              return instance[arg];
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