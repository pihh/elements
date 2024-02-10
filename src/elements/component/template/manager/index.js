import { getStrBetween } from "../../../helpers/regex";
import { Registry } from "../../../kernel/registry";
import {
  initialExpressionCleanup,
  parseTemplatePointers,
} from "../analyser/cleanup";
import { parseIfConditions } from "../analyser/if";
import { TemplateModel } from "./model";
import { cleanTemplateString, createTemplateElement } from "./utils";

export const TemplateGenerator = function (template) {};

/**
 * Desmonta em templates e placeholders para operações caso necessário
 * Cria template elements para serem reútilizados} template
 * Retorna um objecto de configuração de template para
 * o framework gerir futuramente e não precisar de
 * fazer isto várias vezes
 * @param {*} scope
 */

export class TemplateManager {
  // If already configured in registry, send configuration
  // Returns promise;

  output;

  __initialized = false;
  __loading = false;
  __templates = {};
  __elements = {};
  __connectors = {};

  constructor(config, template, scope) {
    // 1 - go for the break of the template
    // 2 - go for the dissemble of the template
    // 3 - map elements and properties
    // 4 - save configurations;
    // if(document.head.querySelector(''))
    this.__config = config;
    this.__template = template;
    this.__scope = scope;
    this.__loading = true;

    this.output = this.__parse();
  }

  __parse() {
    return new Promise(async (resolve, reject) => {
      await this.__breakTemplate(this.__template, true);
      await this.__dissembleTemplates();
      await this.__mapTemplates();

      // let id = gene

      this.__templates.main.element.innerHTML = this.__templates.main.template;

      resolve(this);
    });
  }

  async __breakTemplate(templateString, main = false) {
    const Template = {
      main: templateString,
      children: [],
    };

    const sliceTemplate = function (template) {
      let index = template.indexOf("@if(");
      let start = -1;
      let end = template.length;

      let stack = [];
      let success = false;
      let started = false;
      if (index == -1) return { success: false, template: template };
      for (let i = index; i < template.length; i++) {
        if (started && stack.length == 0) {
          success = true;
          end = i;
          break;
        }

        let char = template.charAt(i);
        if ("{" == char) {
          if (!started) {
            start = i;
            started = true;
          }
          stack.push(char);
        }
        if (char == "}") {
          if (stack.length > 0) {
            end = i - 1;
            stack.pop();
          } else {
            break;
          }
        }
      }

      if (success) {
        let left = template.slice(0, index - 3);
        let right = template.slice(end);
        let child =
          '<template id="el-connector-' +
          Template.children.length +
          '">' +
          template.slice(start, end) +
          "</template>";
        template =
          left +
          '<span el-connector="' +
          Template.children.length +
          '"  id="el-connector-' +
          Template.children.length +
          '"></span>' +
          right;
        Template.children.push(child);
        sliceTemplate(child);

        return {
          success: true,
          template,
        };
      }
      return { success: false, template };
    };
    let keep = true;
    while (keep) {
      let { success, template } = sliceTemplate(Template.main);
      Template.main = template;
      keep = success;
    }

    console.log(Template);
    debugger;
    // const {element,id} = createTemplateElement(this.__config)
    // console.log(id,this.__config);
    // let currentTemplate;
    // if (main) {
    //   this.__templates.main = TemplateModel(
    //     id,
    //     templateString,
    //     this.__scope
    //   )

    //   currentTemplate = this.__templates.main;
    // }

    // //(currentTemplate = this.__templates.main)
    // // this.__templates.main = this.__template;
    // this.__templates.main = this.__parseIfConditions(
    //     currentTemplate,this.__scope
    // );
  }
  __mapTemplates() {}
  __dissembleTemplates() {}

  __parseIfConditions(obj, scope) {
    obj = parseIfConditions(obj, scope);
    return obj;
  }

  load() {
    const template = this.__templates.main.element.cloneNode(true).content;
    const connectors = this.__templates.main.connectors;

    return {
      template,
      connectors,
    };
  }
}
/**
 * Pega numa string de template, avalia o conteúdo da mesma,
 * Reescreve o código que for necessário.
 * @param {*} template
 * @param {*} scope
 */
export const TemplateParser = function (config, template, scope) {};


const templateRegistry = {}
export class TemplateManagerV2 {

  
  constructor(
    id,
    scope = [
      "variant",
      "text",
      "object",
      "list",
      "objectList",
      "color",
      "colors",
    ]
  ) {
    
    this.__id = "template-" + id;

    this.__scope = scope || [];
    this.__set = false;
    if(templateRegistry.hasOwnProperty(this.__id)){
      return templateRegistry[this.__id];
    }else{
      this.__original = document.querySelector("#" + this.__id);
      templateRegistry[this.__id] = this;
    }
  }

  setup() {
    
    if (!templateRegistry[this.__id].__set) {
      templateRegistry[this.__id].__set = true;
      templateRegistry[this.__id].__template = document.createElement("template");
      templateRegistry[this.__id].__cleanedUpInnerHTML = initialExpressionCleanup(this.__original);
      templateRegistry[this.__id].__cleanedUpInnerHTML = parseTemplatePointers(
        templateRegistry[this.__id].__original,
        templateRegistry[this.__id].__scope
      );
      templateRegistry[this.__id].__placeholder = document.createElement("div");
      templateRegistry[this.__id].__placeholder.innerHTML = templateRegistry[this.__id].__cleanedUpInnerHTML;
      templateRegistry[this.__id].__template.content.appendChild(templateRegistry[this.__id].__placeholder);
      templateRegistry[this.__id].__template.setAttribute("id", templateRegistry[this.__id].__id);
      document.querySelector("#" + templateRegistry[this.__id].__id).replaceWith(templateRegistry[this.__id].__template);
    }

    //console.log(templateRegistry[this.__id].__template)
    
    return templateRegistry[this.__id]//.__template.content.cloneNode(true); // .content.cloneNode(true);
  }
}
