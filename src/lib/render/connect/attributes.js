export const connectAttributes = function (instance, clone) {
  const operationMap = instance.__config__.map.operations || [];
   operationMap.forEach((map) => {

     map.setup(instance, clone, map);
  
    //  map.callback(instance, clone);
   });

  /*
  let loop = 0;
  const operationMap = instance.__config__.map.operations || [];
  let operationMapDirectives = operationMap.map((op) => op.dataset.selector);
  while (operationMapDirectives.length > 0) {
    loop++;
    if(loop >= 25){
      throw new Error("max callstack exceeded");
    }
    
    for (let i = 0; i < operationMapDirectives.length; i++) {
      let hasChildren = false;
      let parentOperationDataset = operationMapDirectives[i];
      let parent = clone.querySelector(parentOperationDataset);

      for (let j = i + 1; j < operationMapDirectives.length; j++) {
        let childOperationDataset = operationMapDirectives[j];
        if (parent.querySelector(childOperationDataset)) {
          hasChildren = true;
          break;
        }
        
      }
      if (!hasChildren) {
        let map = operationMap.filter(el => el.dataset.selector == parentOperationDataset)[0];
        map.setup(instance, clone, map);
        console.log(map)
        debugger;
        operationMapDirectives.splice(i, 1);
      }
    }
  }
*/
  const textMap = instance.__config__.map.text;
  textMap.forEach((map) => {
    map.setup(instance, clone, map);
    map.callback(instance, clone);
  });

  const eventMap = instance.__config__.map.events;
  eventMap.forEach((map) => {
    map.setup(instance, clone, map);
    map.callback(instance, clone);
  });
  console.log(instance.__config__.map)

  /*
  const operationMap = instance.__config__.map.operations || [];

  // let loops = 25
  let loop = 0;
  let operationMapDirectives = operationMap.map((op) => op.dataset.selector);
  while (operationMapDirectives.length > 0) {
    loop++;
    if(loop >= 25){
      throw new Error("max callstack exceeded");
    }
    for (let i = 0; i < operationMapDirectives.length; i++) {
      let hasChildren = false;
      let parentOperationDataset = operationMapDirectives[i];
      let parent = clone.querySelector(parentOperationDataset);

      for (let j = i + 1; j < operationMapDirectives.length; j++) {
        let childOperationDataset = operationMapDirectives[j];
        if (parent.querySelector(childOperationDataset)) {
          hasChildren = true;
          break;
        }
        
      }
      if (!hasChildren) {
        let map = operationMap.filter(el => el.dataset.selector == parentOperationDataset)[0];
        map.setup(instance, clone, map);
        operationMapDirectives.splice(i, 1);
      }
    }
  }
  */
  /*  operationMap.forEach((map) => {
    // console.log({map,operationMap,original: instance.__config__.map.operations})
    map.setup(instance, clone, map);
    map.callback(instance, clone);
  });
  */
};

export const connectController = function (instance, clone) {
  for (let prop of instance.__config__.props) {
    clone.parentElement.__defineGetter__(prop, function () {
      return clone.__scope__[prop];
    });
    clone.parentElement.__defineSetter__(prop, function (value) {
      clone.__scope__[prop] = value;
      return true;
    });
  }
  for (let method of clone.parentElement.__methods__) {
    if (!clone[method] && typeof clone.parentElement[method] == "function") {
      clone[method] = clone.parentElement[method].bind(clone);
    }
  }
};
