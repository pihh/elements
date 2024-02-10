import { appendConnector } from "../connector";
import { TemplateManager } from "../manager";
import { TemplateModel } from "../manager/model";

export const parseIfConditions = function (obj,scope) {

  let template = obj.template;
  let index = template.indexOf("@if(");

  if (index > -1) {
    let { success, connector } = extractIfConditions(obj, index ,scope);

    if (success) {
      const selector = "[" + connector.attribute + '="' + connector.id + '"]';
      const attribute = connector.attribute + "_" + connector.id;
      let childId = obj.id + "_" + connector.attribute + "_" + connector.id;
      obj.template = connector.parent;
      obj.child[attribute] = TemplateModel(childId, connector.child);

      obj.connectors[attribute] = obj.child[attribute];

      obj.connectors[attribute].type = "if";
      obj.connectors[attribute].connectorElement = connector.connectorElement;
      obj.connectors[attribute].selector = selector;
      obj.connectors[attribute].query = connector.query;
      obj.connectors[attribute].keywords = connector.keywords || [];
      obj.connectors[attribute].load = function  (parent, child) {
        child = child.content.firstElementChild;
        const $comment = document.createComment("--");
        const $replace = parent.querySelector(selector);
        obj.child[attribute].childd = new TemplateManager({id: childId,template: connector.child.replaceAll('el-connection','el-connected')}, connector.child.replaceAll('el-connection','el-connected'), scope);
        obj.child[attribute].childd.output.then(data => {
          console.log(data);
          debugger
        })
        $replace.replaceWith($comment);
        $comment.__element = child;
        $comment.__callback = function (condition) {
          console.log(child);
          if(!child){
            console.log('NO CHILD', parent)
            console.log('NO CHILD', parent.querySelectorAll('[el-connection]'))
            if([...parent.querySelectorAll('[el-connection]')].length >0){
              child = parent.querySelector('[el-connection]')
              parent.querySelector('[el-connection]').removeAttribute('el-connection')
            }else{
              console.log('failed bad')
              return
            }
            
          }
          if (condition && !child.isConnected) {
            $comment.after(child);
            console.log(parent)
          
          } else {
            child.remove();
          }
        };
        $comment.__subscriptions = [];
        // $comment.__callback(false);
        for(let keyword of connector.keywords){
          $comment.__subscriptions.push(parent.__connect(keyword,$comment.__callback))
        }
        // $comment.__callback = function (condition) {
      };
      return parseIfConditions(obj,scope);
    }
  } else {
    return obj;
  }
};

export const extractIfConditions = function (obj, index,scope) {
  let template = obj.template;
  let start = -1;
  let end = template.length;

  let stack = [];
  let success = false;
  let started = false;

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
    let parent = {};
    let child = "";
    parent.left = template.slice(0, index - 3);
    parent.right = template.slice(end);
    parent.query = template.slice(index).split(')')[0].replaceAll('@if(','').trim();
    child = template.slice(start + 1, end - 1);

    const callbackSetup = function(instance,query, positiveCb,negativeCb){

      const callback = function(){
        const fn = Function("return "+ query);
        const out = fn.call(instance,...arguments);
        if(["true",true].indexOf(out) >-1){
          positiveCb()
        }else{
          negativeCb

        }
      }
      return callback
      
    }
    let connector = appendConnector("if", parent, child, callbackSetup);
    return {
      success: true,
      connector: connector,
    };
  } else {
    return { success: false };
  }
};
