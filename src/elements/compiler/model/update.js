export const getPath = function (path) {
    return path.replaceAll("this.", "")
      .replaceAll("[", ".")
      .replaceAll("]", ".")
      .replaceAll("..", ".")
      .trim()
      .split(".")
      .slice(1).map(el => {
        if(el[0] == "."){
            el = el.slice(1)
        }
        if(el.endsWith(".")){
            el = el.slice(0,-1);
        }
        return el;
      });
  };

  export const getPath2 = function (path) {
    return path.replaceAll("this.", "")
      .replaceAll("[", ".")
      .replaceAll("]", ".")
      .replaceAll("..", ".")
      .trim()
      .split(".")//.map(el => el.trim().length > 0)
      .slice(0)
      .map(el => {
        if(el[0] == "."){
            el = el.slice(1)
        }
        if(el.endsWith(".")){
            el = el.slice(0,-1);
        }
        return el;
      }).filter(el => el.length > 0 );
  };  

export const modelUpdate = function(scope,modelName,value){
    let type = typeof value;
    if(["boolean","number"].indexOf(type) ==-1 ){
        value = "'"+value+"'";
    }
    if(value !== modelValue(scope,modelName)){
        const $fn = Function("return `${this."+modelName+ "="+value+"}`")
        $fn.call(scope)
    }
}

export const modelValue = function(scope,modelName){
  
    try{

        const $fn = Function("return this."+modelName )
        return $fn.call(scope)
    }catch(err){
        const $fn = Function("return `${this."+modelName+"}`" )
        return $fn.call(scope)
    }
}
export const modelSubscriptions = function(modelName){
    return getPath(modelName);
}