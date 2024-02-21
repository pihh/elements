import { getSelectorPath } from "@dom-utils/selector-path";
import { inspectAttributes } from "./inspect/attributes";
import { inspectCustomEvents, inspectEvents } from "./inspect/events";
import { inspectOperations } from "./inspect/operations";
export const mapDom = function (template, scope = {}) {
  const map = { customEvents: [], events: [], text: [] };
  const config = { map, template, props: Object.keys(scope), scope };
  const $elments = [template].concat([...template.querySelectorAll("*")]);
  const $placeholder = document.createElement("div");
  $placeholder.appendChild(template);

  let templateString = $placeholder.innerHTML;
  /**
   * Step #1
   * Find all ocorrences in the template of:
   *  custom events ,
   *  events,
   *  bindings,
   *  operations
   *  expressions,
   *
   *  Both custom events and events use a string to be parsed
   */
  let customEventMap = inspectCustomEvents(templateString, scope);
  if (customEventMap.success) {
    map.customEvents = customEventMap.data.expressions;
    templateString = customEventMap.data.template;
  }
  let eventMap = inspectEvents(templateString, scope);
  if (eventMap.success) {
    map.events = eventMap.data.expressions;
    templateString = eventMap.data.template;
  }

  let operationMap = inspectOperations(templateString, scope);
  if (operationMap.success) {
    map.operations = operationMap.data.expressions;
    templateString = operationMap.data.template;
  }
  // const _parse = ( template, options={} ) => {

  //     return parse ( template, makeGrammar ( options ), { memoization: false } )[0];

  //   };
  // console.log({_parse,templateString})

  $placeholder.innerHTML = templateString;

  let textMap = inspectAttributes($placeholder, scope);
  if (textMap.success) {
    map.text = textMap.data.expressions;
  }

  template = $placeholder.firstElementChild;

  config.map = map;
  config.template = template.innerHTML;
  console.log({ config, map, template, getSelectorPath });
  return config;
};
