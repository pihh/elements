/**
 * Creates a class to connect the current scope to the property
 * based on the type of connection
 */

import { reactivityMap } from "./map";

export const connectHtmlReactivity = function(instance, element){
  if (element?.__setup?.templateConnected) return;
  const {props,actions,operations} = reactivityMap(element);
  const connections = props.map;

  for (let key of Object.keys(connections)) {
    const connection = connections[key];
    for (let conn of connection) {
 
      if(key.endsWith("[")){

      }else{

        conn.setup(instance);
      }
    }
  }

  for (let key of Object.keys(actions.map)) {
    for(let action of actions.map[key]){
      action.node.removeAttribute(key);
      action.setup(instance);
    }
  }

  let forOps = operations.map.for
  for (let operation of forOps) {
    let config = {}
  if(element.dataset.elIndex){
    config.indices = JSON.parse(element.dataset.elIndex);
  }    
    operation.setup(instance,config);

  }
  let ifOps = instance.operations.map.if
  for (let operation of ifOps) {
    
    operation.setup(instance);
  }
  element.__setup = {}
  element.__setup.templateConnected = true;
  return element;
}
export const connectTemplateReactivity = function (instance) {
  if (instance.__setup.templateConnected) return;
  const connections = instance.reactiveProps.map;

  for (let key of Object.keys(connections)) {
    const connection = connections[key];
    for (let conn of connection) {
 
      conn.setup(instance);
    }
  }
  const actions = instance.actions.map;

  for (let key of Object.keys(actions)) {
    for(let action of actions[key]){
      action.node.removeAttribute(key);
      action.setup(instance);
    }
  }

  let forOps = instance.operations.map.for
  for (let operation of forOps) {
    // console.log(key)
    operation.setup(instance);
    // console.log({operation})
  }
  let ifOps = instance.operations.map.if
  for (let operation of ifOps) {
    // console.log(key)
    
    operation.setup(instance);
  }


  instance.__setup.templateConnected = true;
};


