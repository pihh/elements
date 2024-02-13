/**
 * Creates a class to connect the current scope to the property
 * based on the type of connection
 */

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
  }
  let ifOps = instance.operations.map.if
  for (let operation of ifOps) {
    // console.log(key)
    
    operation.setup(instance);
  }


  instance.__setup.templateConnected = true;
};


