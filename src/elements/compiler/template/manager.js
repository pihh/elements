import { initialExpressionCleanup } from "./initial-expression-cleanup";
import { parseTemplateOperations } from "./parse-template-operations";
import { parseTemplatePointers } from "./parse-template-pointers";

const templateRegistry = {}

/**
 * Requires a template with given ID already in the document
 * Creates a template instance to get reused
 * @todo -> manage the template creation process here also
 */
export class TemplateManager {

    constructor(
      id,
      scope = []
    ) {
      this.__originalId = id;
      this.__id = "template-" + id;
  
      this.__scope = scope || [];
      this.initialSetup = false;
      if(templateRegistry.hasOwnProperty(this.__id)){
        return templateRegistry[this.__id];
      }else{
        this.__original = document.querySelector("#" + this.__id);
        templateRegistry[this.__id] = this;
      }
    }
  
    setup() {
      if (!templateRegistry[this.__id].initialSetup) {
        templateRegistry[this.__id].initialSetup = true;
        templateRegistry[this.__id].__template = document.createElement("template");
       
        templateRegistry[this.__id].__cleanedUpInnerHTML = initialExpressionCleanup(this.__original);
        templateRegistry[this.__id].__cleanedUpInnerHTML = parseTemplatePointers(
          templateRegistry[this.__id].__original,
          templateRegistry[this.__id].__scope,
          );
          templateRegistry[this.__id].__cleanedUpInnerHTML = parseTemplateOperations(
            templateRegistry[this.__id].__cleanedUpInnerHTML,
            this.__originalId
        );

        templateRegistry[this.__id].__placeholder = document.createElement("div");
        templateRegistry[this.__id].__placeholder.innerHTML = templateRegistry[this.__id].__cleanedUpInnerHTML;
        templateRegistry[this.__id].__template.content.appendChild(templateRegistry[this.__id].__placeholder);
        templateRegistry[this.__id].__template.setAttribute("id", templateRegistry[this.__id].__id);
        templateRegistry[this.__id].__children = [];
        templateRegistry[this.__id].__customParameters = {}
        for(let key of Object.keys( templateRegistry[this.__id].__original.dataset)){
          templateRegistry[this.__id].__template.dataset[key] =  templateRegistry[this.__id].__original.dataset[key]
        }
        document.querySelector("#" + templateRegistry[this.__id].__id).replaceWith(templateRegistry[this.__id].__template);
      }      
      return templateRegistry[this.__id]
    }
  }
  