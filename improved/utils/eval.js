export const parseText = function (instance, expression) {
  let vars =
    "var {" +
    instance.constructor.observedAttributes.join(",") +
    "}  = {...this.scope}; ";
    console.log(vars + " return `" + expression + "`",expression,instance)
  var fn = Function(vars + " return `" + expression + "`");
  return fn.call(instance);
};

export const setValue = function(instance, expression,value){
  console.log("return `${this.scope."+expression+" = " + value+"}`",instance)
    var fn = Function("return `${this.scope."+expression+" = " + value+"}`"); 
    return fn.call(instance);
}