import { selectConnectionConfig } from "./config";

export const selectEventSetup = function (
  controller,
  clone,
  expression,
  config = {}
) {

  selectConnectionConfig.setup(controller, clone, expression);
 
};
