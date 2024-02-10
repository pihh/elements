import { parseTemplatePointers } from "../component/template/analyser/cleanup";
import { initialExpressionCleanup } from "../helpers/regex";

export class Registry {
  static instance;
  static templates = {};
  constructor() {
    if (Registry.instance) return Registry.instance;
    Registry.instance = this;
  }

  static parse(name, template, observedAttributes, id) {
    if (this.templates.hasOwnProperty(name)) {
      return this.templates[name].content.cloneNode(true);
    }

    template = initialExpressionCleanup(template);

    template = parseTemplatePointers(template, observedAttributes);

    const $tpl = document.createElement("template");
    let $content = document.createElement("div");
    $content.innerHTML = template;

    document.querySelector("#" + id).replaceWith($tpl);
    $tpl.setAttribute("id", id);
    $tpl.content.appendChild($content);

    this.templates[name] = $tpl;

    return this.templates[name].content.cloneNode(true);
  }

  static load(name) {
    try {
      return this.templates[name].content.cloneNode(true);
    } catch (ex) {
      return false;
    }
  }
}
