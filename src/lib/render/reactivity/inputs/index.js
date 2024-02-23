import { inputConnectionConfig } from "./config";

export const inputEventSetup =function(controller,element,expression,config={}){
  inputConnectionConfig.setup(controller,element,expression)
}
