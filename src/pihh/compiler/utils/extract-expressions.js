import { findMatchBetween,findMatchesBetween, removeChars } from "./text"


export const extractAttributeExpression = function(contents, props=[]){
    const matches = findMatchesBetween(contents);
    let result = [];
    for(let match of matches){
        if(match.success){
            let between = match.between;
            let expression = match.between;
            let value = match.match;
            let track = [];
            between = removeChars(between,['!',';','?',':',">","===","==","=","this.","<","&"]," ").split(' ').map(el => el.trim()).filter(el => el.length > 0);
            for(let i = 0; i < between.length; i++){
                let prop = between[i];
          
                let isPropOfInstance = props.indexOf(prop.replaceAll('[','.').split('.')[0]) > -1;
                if(isPropOfInstance ){
                    expression =expression.replace(prop,"this."+prop).replaceAll("this.!", "!this.")
                    track.push(prop)
                }
            }
            track = [...new Set(track)];
            contents = contents.replace(value,'${'+between+'}');
            result.push({
                expression,value,props:track
            })
        }
    }
    return {result,contents}
}


