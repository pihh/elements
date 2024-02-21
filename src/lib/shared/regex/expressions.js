import { cleanAll, replaceAll, separateAll } from "./text"

export const validateProp = function(string,prop){
    string = replaceAll(string,[['[','.'],[']','.']])
    string = separateAll(string,['!',"<",">","?",":","+","-","="],'.')
    string = string.split('.').map(el => el.trim()).filter(el => el.length > 0).filter(el => el.indexOf(prop)>-1)

    return string.includes(prop)
}
export const extractPath = function(string,prop){
    let delimiter = '__&&__'
    string = replaceAll(string,[['[','.['],[']','].']]).replaceAll('..','.')
    string = separateAll(string,['!',"<",">","?",":","+","-","="],delimiter).split('.').map(el => el.trim())//.replaceAll('..','. ').split('.').map(el =>el.trim())
 
    let idx = string.indexOf(prop);
    let path = prop;
    for(let i = idx+1; i < string.length; i++){
        let p = string[i];
        path+='.' + p;
        if(p.indexOf(delimiter)>-1){
            break;
        }
    }
    if(path.indexOf(delimiter)>-1){
        path = path.slice(0,path.indexOf(delimiter))
    }
    path = path.trim().replaceAll('.[','[');
    if(path.charAt(path.length-1)=='.'){
        path = path.substr(0,path.length-1)
    }
    return path
}

extractPath('colors[0].name="red"','colors')
export const findProps = function(string,props=[]){
    string = cleanAll(['{{',"}}","${"]);
    for(let prop of props){

    }
}