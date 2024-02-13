import { Registry } from "../../kernel/registry";

export const connectTemplate = async function(component){
    component.__template = await Registry.template(component.constructor.selector, component.__props);
    component.__shadowRoot.appendChild(component.__template);
}