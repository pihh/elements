

import { Connect } from "../../render/connect";
import  TemplateRegistry  from "../registry";


export const Template = function(selector,scope={},node) {

    node = node ? node :  document.querySelector(selector) 
    console.log(node)
    this.__name__ = selector
    this.node = node;
    this.parent = node.parentNode;
    this.parent.removeChild(node);
    this.html = node.innerHTML;
    this.scope = scope
    this.compile()
};

Template.prototype.compile = function(){
   TemplateRegistry.register(this);
}

Template.prototype.boot = function(clone) {
    Connect(this,clone)
}

Template.prototype.clone = function clone(scope = {},placeholder = null) {
    scope = {
        ...this.scope,
        ...scope
    }
	return new TemplateClone(this, scope || {},placeholder);
};

const TemplateClone = function(template, scope = {},placeholder=false) {
		this.template = template;
		this.scope = {
            ...this.scope || {},
            ...scope
        }
        this.node = template.node.cloneNode(false);
        template.compile();
        return this.append(placeholder)
         
};


TemplateClone.prototype.update = function update(scope={}) {
		scope = {
            ...this.scope,
            ...scope
        }
        this.scope = scope
		this.node.innerHTML = this.template.html.replace(/\{\s*(\w+)\s*\}/g, function(all, key) {
        var value = scope[key];
        return (value === undefined) ? "{" + key + "}" : value;
    });
};

TemplateClone.prototype.append = function append(placeholder) {
    placeholder = placeholder || this.template.parent
    placeholder.appendChild(this.node);
    // console.log(placeholder)
    this.template.boot(this.node);
    return this.node;
};