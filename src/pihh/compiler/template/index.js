

import './extract-properties'
import { parseTemplateActions } from './actions';
import { parseTemplateOperations } from './operations';

// Deveria entrar porquete e sair chouriço 
export default function TemplateCompiler(input){
    // First the actions -> it's easier to distinguish them;
    let connectors = {}
    let output = input.replaceAll('\n','').trim();
    let parsedActions = parseTemplateActions(output);
    
    output = parsedActions.template;
    connectors = {
        ...connectors,
        ...parsedActions.connections
    }
    let parsedOperations = parseTemplateOperations(output);
    
    output = parsedOperations.template;
    connectors = {
        ...connectors,
        ...parsedOperations.connections
    }


 

    return {input,output,connectors}
}