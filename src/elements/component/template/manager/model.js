import { cleanTemplateString } from "./utils";

export const TemplateStruct = {
  template: "",
  id: "",
  connectors: [],
  childTemplates: [],
  map: {},
  trackedObjects: {},
};


export const TemplateModel = function(id,template,child={},connectors={},map={}) {
    const model =  {
      id,
      template: cleanTemplateString(template),
      child,
      connectors,
      map
    }

    const element = document.createElement("template");
    element.id = id;
    element.innerHTML = model.template;
    model.element = element;
    document.head.appendChild(element);
    
    return model;
}