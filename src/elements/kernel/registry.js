// import { parseTemplatePointers } from "../component/template/analyser/cleanup";

import { TemplateManager, TemplateManagerV2 } from "../component/template/manager";

// import { initialExpressionCleanup } from "../helpers/regex";

export class Registry {
  static instance;
  static templates = {};
  static files = {}
  constructor() {
    if (Registry.instance) return Registry.instance;
    Registry.instance = this;
  }

  static getName(path){
    let name = path.replaceAll('../','');
    return name
  }
  static file(path){
    

  }

  static template(path){

    let name = this.getName(path);
    let template = this.templates[name];
    if(template) return template;
    this.templates[name] = new Promise(async(res)=>{
      
      // const element = document.querySelector("#template-"+name);
      const templateObject = new TemplateManagerV2(name);
      const $template = templateObject.setup();

      res($template.__template.content.cloneNode(true).firstElementChild)
  
    });
    return this.templates[name]
  }

}
