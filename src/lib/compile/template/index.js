

import { Connect } from "../../render/connect";
import  TemplateRegistry  from "../registry";


export const Template = function(selector,scope={}) {
    const node = document.querySelector(selector);
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

Template.prototype.clone = function clone(scope = {}) {
    scope = {
        ...this.scope,
        ...scope
    }
	return new TemplateClone(this, scope || {});
};

const TemplateClone = function(template, scope = {}) {
		this.template = template;
		this.scope = {
            ...this.scope || {},
            ...scope
        }
        this.node = template.node.cloneNode(false);
        template.compile();
        // this.append()
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

TemplateClone.prototype.append = function append() {
    console.log("append",this)
    this.template.parent.appendChild(this.node);
    this.template.boot(this.node);
    return this;
};