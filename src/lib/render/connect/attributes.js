export const connectAttributes = function (instance, clone) {

  const textMap = instance.__config__.map.text;
  textMap.forEach((map) => {    
        map.setup(instance,clone,map)
        map.callback(instance,clone)
  });
};
