import { Registry } from "../../kernel/registry";

export const connectTemplate = function(component){
    component.__template = Registry.template(component.constructor.selector, component.__props);
    component.__shadowRoot.appendChild(component.__template);
}