import { generateRandomDatasetKey } from "./dataset-key";


export const parseTemplateEmiters = function (template) {
  let operations = {};

  let emiterIndex = template.indexOf(')="');
  let left = emiterIndex;
  let right = emiterIndex;
  let wrapperLeftIndex = left;
  let wrapperRightIndex = right;

  while (emiterIndex > -1) {
    
    let left = emiterIndex;
    let right = emiterIndex;
    let eventName = "";
    let parentAction = ""

    for (let i = left; i > 0; i--) {
      if (template.charAt(i) == "(") {
        wrapperLeftIndex = i;
        eventName = template.slice( i+1,emiterIndex);
        break;
      }
    }
    
    let tmp = template.slice(right);

    let searchStart = tmp.indexOf('"')+1
    for(let i = searchStart; i < tmp.length; i++){
      let char = tmp.charAt(i);
      if(char == '"'){
        wrapperRightIndex = i+1;
        parentAction = tmp.slice(searchStart,i).trim();
        break;
      }

    }

    if(parentAction && eventName){
      let dataset = generateRandomDatasetKey('emitter');
      dataset.eventName = eventName;
      dataset.parentAction = parentAction;
      template = template.slice(0,wrapperLeftIndex-1) + " "+dataset.key+ "=true " + tmp.slice(wrapperRightIndex);
      operations[dataset.key] = dataset;
    }else{
      throw new Error('Invalid emmiter settings')
    }
    
    emiterIndex = template.indexOf(')="');
    

  }

  return { template, operations };
};
