import { capitalizeFirstLetter } from "../string";

const datasetBaseModel = {
        key: "data-el-bind-2",
        symbol: Symbol('xxx'),
        type: "bind",
        // event: "change",
        // attribute: "value",
        selector: "[data-el-bind-2]",
        selectorCamel: "elBind-2",
        expression: "${color}",
        // args: "${colors}",
        listeners: [],
    
}

export const generateRandomDatasetKey = function(type){
    const preffix = "el";
    const left = generateString(3);
    const right = generateString(3);
    const key =["data",preffix,type,left,right];
    let model = Object.assign({},datasetBaseModel);
    model.key = key.join("-");
    model.symbol = Symbol(model.key)    
    model.type = type;
    model.selector = "["+model.key+"]";
    model.selectorCamel = preffix+capitalizeFirstLetter(type)+capitalizeFirstLetter(left)+capitalizeFirstLetter(right);
    model.expression = ""
    model.listeners = [];        
    if(type == "for"){
        model.typeSelector = "[el-for-operation]";
        model.typeSelectorCamel = "elForOperation";
    }
    return model
}
const randomInteger = function(length){
   return Math.floor(Math.random() * length)

}

function generateString(length) {
    let result = '';
    let characters = "qwertyuiopasdfghjklzxcvbnm";
    const charactersLength = characters.length;
    
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(randomInteger(charactersLength));
    }

    return result;
};