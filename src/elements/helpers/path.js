export const extractLookedPaths = function (_scope, expression,_preffix="this") {
  let map = [];

  let parsedExpressions = expression
    .split("{{")
    .map((e) => e.trim())
    .filter((e) => e.length > 0)
    .map((e) => e.split("}}")[0]);



  function extract(scope,expressions=[],preffix=_preffix,paths=[]){

    let rootKeys = Object.keys(scope).filter(el => el.indexOf('__')==-1);
    // console.log({rootKeys})
    for(let key of rootKeys){
        for(let parsedExpression of parsedExpressions){
            let idx = Math.max(-1,parsedExpression.indexOf(preffix+'.'+key) , parsedExpression.indexOf(preffix+'['));

            let path =preffix+'.'+key.replace(']','')
            if(key == Number(key)){
                path = preffix+'['+key+"]"
            }
            
            // console.log(idx,typeof scope[key] , path);
            if(idx > -1){
                let type = typeof(scope[key]);
                if(type !== "object"){
                    map.push(path)
                    
                }else{
                    map.push(path)
                    extract(scope[key],expressions,preffix+"."+key, paths=[])
                }
                
            }else{
                // if(typeof scope[key] !== "object"){
                //     map.push(path)
                //     console.log(map)
                // }
                // console.log(key,"keyFailed")
            }
        }
      }
  }
  extract(_scope,parsedExpressions);
  if(parsedExpressions[1] && parsedExpressions[1].indexOf(_preffix+".") >-1){
    map.push(parsedExpressions[1])
  }
  return map.sort((a,b)=> a > b).filter(el => Math.max(-1,expression.indexOf(el+' '),expression.indexOf(el+'}'),expression.indexOf('?'))> -1)

};

