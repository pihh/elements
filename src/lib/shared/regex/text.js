import { ruleSet } from "../dom/inspect/rules";
import { output } from "../output";

export const filterStack = (search, left="{{",right="}}") =>{
    let start = search.indexOf(left);
    let result = output(false,"No ocorrences",{})
    let end = start;
   
    let stack = 1;
    if(start > -1){
        for(let i = Math.max(start+left.length+1,start+right.length+1); i < search.length; i++){
            let charLeft = search.substring(i,i-left.length);
            let charRight = search.substring(i,i-right.length);
            if(charLeft == left){
                stack++
            }else if(charRight == right){
                stack--
            }
            if(stack == 0){
                result.success = true;
                end = i-right.length;
                result.data = {
                    start,
                    end,
                    expression: search.slice(start+1,end),
                    search
                }
                result.message = "Found a successfull match"
                break;
            }
        }
    }
    return result;
}

// capitalize the first letter
export const capitalizeFirstLetter =(str)=>{
    return str.charAt(0).toUpperCase() + str.slice(1);
}
export const lowerCaseFirstLetter =(str)=>{
    return str.charAt(0).toLowerCase() + str.slice(1);
}

export const replaceAll = function(str, keyValuePairs = []){
    for(let kvp of keyValuePairs){
        let key = kvp[0]
        let value = kvp[1]
        str = str.replaceAll(key, value)
    }
    return str;
}

export const cleanAll = function(str, search= []){
    for(let find of search){
        
        
        str = str.replaceAll(find, "");
    }
    return str;
}
export const separateAll = function(str, search= [],delimiter= " "){
    for(let find of search){
    
        str = str.replaceAll(find, delimiter);
    }
    return str;
}