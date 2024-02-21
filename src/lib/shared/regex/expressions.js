import { cleanAll, isChar, replaceAll, separateAll } from "./text"

export const validateProp = function(string,prop){
    string = replaceAll(string,[['[','.'],[']','.']])
    string = separateAll(string,['!',"<",">","?",":","+","-","="],'.')
    string = string.split('.').map(el => el.trim()).filter(el => el.length > 0).filter(el => el.indexOf(prop)>-1)

    return string.includes(prop)
}

export const extractPath = function(string,prop){
    let delimiter = '__&&__'
    let originalString = string;
    string = replaceAll(string,[['[','.['],[']','].']]).replaceAll('..','.')
    string = separateAll(string,['!',"<",">","?",":","+","-","=","*","/","%","'",'"','`','}','{',')','('],delimiter).split('.').map(el => el.trim())//.replaceAll('..','. ').split('.').map(el =>el.trim())
 
    let idx = string.indexOf(prop);
    let path = prop;
    for(let i = idx+1; i < string.length; i++){
        let p = string[i];
        path+='.' + p;
        if(p.indexOf(delimiter)>-1){
            break;
        }
    }

    let evaluation = "expression";
    if(path.indexOf(delimiter)>-1){
        path = path.slice(0,path.indexOf(delimiter))
        evaluation = "eval"
    }
    path = path.trim().replaceAll('.[','[');
    if(path.charAt(path.length-1)=='.'){
        path = path.substr(0,path.length-1)
    }
    let lastBracket = path.lastIndexOf(']');
    let lastDot = path.lastIndexOf('.');
    if(lastDot > -1 && lastDot < path.length - 1) {
        if(!isChar(path[lastDot+1])){
            path = path.slice(0,lastDot);
        }
    }
    if(lastBracket > -1 && lastBracket < path.length - 1) {
        if(!isChar(path[lastBracket+1]) && path.charAt(lastBracket+1) !== '.'){
            path = path.slice(0,lastBracket);
        }
    }
    return {path,evaluation}
}


export const findProps = function(string,props=[]){
    // string = cleanAll(['{{',"}}","${"]);
    let paths = [];
    for(let prop of props){
        if(validateProp(string,prop)){
            paths.push(prop)
            
        }
    }
  
    paths = paths.map(path => path.trim()).filter(path => path.length > 0).map(path => extractPath(string,path))
    return paths;
}



export const pathName = function(path){
    if(!Array.isArray(path)){
      path = path.replaceAll('[','.');
      path = path.split('.').map(el => el.replaceAll(']','').replaceAll('.','').trim());
    }
    path = path.join('.')
    return path
  }
  