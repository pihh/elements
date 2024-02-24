export const expressionCallback = function (
  instance,
  expression,
  datatype = "string"
) {
  const fn = Function("return `" + expression + "`");
  try {
    datatype = typeof fn.call(instance);
  } catch (ex) {
    console.info({
      instance,
      expression,
      datatype,
    });
    console.log(expression,instance);
    console.warn(ex);
  }

  
   return  fn.call(instance)
  
};

export const actionCallback = function(instance,expression,args){
  const fn = eval('()=>{let args = [...arguments]; console.log(args); let self = args[0].parentElement; let action=args[1]; self[action](...[args.slice(2)])}')

  return function(){
    fn.bind(instance)()
  }
}

export const evaluationCallback = function (
  instance,
  expression,
  datatype = "string"
) {
  const fn = Function("return `" + expression + "`");
  try {
    datatype = typeof fn.call(instance);
  } catch (ex) {
    console.info({
      instance,
      expression,
      datatype,
    });
    console.warn(ex);
  }

  return function () {
    return fn.call(instance, ...arguments);
  };
};
export const setterCallback = function (instance, expression) {
  const fn = eval("(instance,value)=> instance." + expression + " = value");
  try {
    let datatype = typeof Function("return `${this." + expression + "}`").call(
      instance
    );
  } catch (ex) {
    console.info({
      instance,
      expression,
    });
    console.warn(ex);
  }
  return fn;
};

const selectCallbackOutput = function (instance, expression) {
  const fn = eval("(instance) => instance." + expression);
  let datatype = typeof fn(instance);

  return datatype;
};
export const getterCallback = function (instance, expression) {
//   let datatype = selectCallbackOutput(instance, expression);
  const fn = eval("(instance) => instance." + expression);

  return fn;
};

let parseNumber = function (callback) {
  return function () {
    return Number(callback(...arguments));
  };
};
export const parseBoolean = function (value) {
  return function () {
    return ["true", true].indexOf(value) > -1;
  };
};
let parseObject = function (callback) {
  return function () {
    return JSON.parse(callback(...arguments));
  };
};
export const parseResult = function (result, datatype) {
  if (datatype === "number") {
    return Number(result);
  } else if (datatype === "boolean") {
    return ["true", true].indexOf(result);
  } else if (datatype === "object") {
    if (typeof result !== "object") {
      return JSON.parse(result);
    }
  }
  return result;
};
