import { mapDom } from "../shared/dom/map";

export class TemplateRegistry {
    store = {}
    constructor(){
      
       
    
    }
    register(instance){
        const clone = instance.node.cloneNode(false);
        let name = instance.__name__;
        if(!this.store.hasOwnProperty(name)){
            clone.innerHTML = instance.html;
            console.log('Registry will compile',name)
            this.store[name] = mapDom(clone,instance.scope)
            instance.__config__ = this.store[name]
        }
        
        clone.innerHTML = instance.__config__.template;
        
        return  clone
    }
    load(name){
        return this.store[name]
    }
}


export default new TemplateRegistry()