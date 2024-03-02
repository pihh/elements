import { parseTemplateAttributes } from "../template/parse-attributes"
import { parseTemplateEmiters } from "../template/parse-emiters"
import { parseTemplateNodes } from "../template/parse-nodes"
import { parseTemplateOperations } from "../template/parse-operations"

export const compileTemplate = function(template,observedAttributes=[]){
    let operations = {}
    let operationResult =  parseTemplateOperations(template,observedAttributes)
    template = operationResult.template
    operations = {
        ...operations,
        ...operationResult.operations
    }
    let emiterResult =  parseTemplateEmiters(template)
    template = emiterResult.template
    operations = {
        ...operations,
        ...emiterResult.operations
    }

    let $head = document.head;
    let $wrapper = document.createElement('div');
    $head.appendChild($wrapper)
    $wrapper.innerHTML = template;

    const findForElements = function($element ){
        return [...$element.querySelectorAll('[data-el-for-operation]')];
    }
    let forOperationElements =  findForElements($wrapper)
    while (forOperationElements.length > 0){
        
        let $forElement = forOperationElements[0];
        let $innerForElements = findForElements($forElement);
        while($innerForElements.length>0){
            $forElement = $innerForElements[0]
            $innerForElements = findForElements($forElement);
        }

        delete $forElement.dataset.elForOperation;
        let forKey = Object.keys($forElement.dataset).filter(key => key.indexOf('For')>-1).map(el => el.trim()).join(',');
        
        let forOperationConfig = operations[Object.keys(operations).filter(key => operations[key].selectorCamel == forKey)[0]]
        
        // operations[forOperationConfig.key].configuration.elements =  operations[forOperationConfig.key].configuration.elements ||  []
        let $forElements = [...$forElement.querySelectorAll('*')];
        let attrs = [...observedAttributes, operations[forOperationConfig.key].maskVariable]
        $forElements.forEach($e => {
            if(!$e.dataset.hasOwnProperty('elForCompiled')){
                
                $e.dataset.elForCompiled = forKey;
                
                let textOperations = parseTemplateNodes($e,attrs);
                let attributeOperations = parseTemplateAttributes($e,attrs);
                operations[forOperationConfig.key].configuration = {
                    ...operations[forOperationConfig.key].configuration,
                    ...textOperations,
                    ...attributeOperations
                }
            }
        })     
        forOperationElements =  findForElements($wrapper); //
    }

    const $elements = [...$wrapper.querySelectorAll('*')];
    $elements.forEach($element => {
        if(!$element.dataset.hasOwnProperty('elForCompiled')){
            let textOperations = parseTemplateNodes($element,observedAttributes);
            let attributeOperations = parseTemplateAttributes($element,observedAttributes);
            operations = {
                ...operations,
                ...textOperations,
                ...attributeOperations,
            }
        }else {
            delete $element.dataset.elForCompiled
        }
    })

    $wrapper.remove()
    return {template:$wrapper.innerHTML,operations}
}