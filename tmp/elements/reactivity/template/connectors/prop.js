import { ModelConnector } from "./model";

export class PropConnector {
    static text(instance, keyword, node, query) {
      const callback = function (val) {
        //console.log({instance, keyword, node, query});
        const value = PropConnector.evaluate(instance, query,"text", node);
        node.textContent = value;
      };
  
      
      instance.connect(keyword, callback);
      return callback;
    }
  
    static attribute(instance, keyword, node, query, attribute) {
      const callback = function (newValue) {
        // console.log(newValue,query, instance);
        const value = PropConnector.evaluate(instance, query,"text",node);
        node.setAttribute(attribute, value);
      };
  
      instance.connect(keyword, callback);
      return callback;
    }
  
    static lastRender = Date.now();
    static model(instance, keyword, node, query) {
      let type =
        node.nodeName == "SELECT"
          ? "select"
          : node.getAttribute("type") || "text";

  
  
      const cb = ModelConnector[type](instance, node, query, keyword);
      const callback = function () {
        cb();
      };
  
      instance.connect(keyword, callback);
      return callback;
    }
  
    static evaluate(instance, query, type = "text",node=false) {
     
      try{
   
        const ist = instance;
    
        const fn = Function("return " + query);
        const output = fn.call(ist.scope,);
        let value = output;
        if (type == "boolean") {
          if (["true", true].indexOf(value) > -1) {
            value = true;
          } else {
            value = false;
          }
        } else if (type == "number") {
          value = Number(value);

        }
        return value;
      }catch(ex){
        console.log({instance,query,node,type})
        console.warn(ex);
        return query
       
      }
    }
  }
  