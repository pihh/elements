import { extractComponentConfiguration } from "./component-configuration";

export const compile = async function(component,config){
    const componentConfiguration = extractComponentConfiguration(component,config); 
    // await Registry.set(componentConfiguration.selector,componentConfiguration);
    return componentConfiguration;   
}

// export const createSchemas = function(components = []){
//     for(let component of components){

//     }

// }