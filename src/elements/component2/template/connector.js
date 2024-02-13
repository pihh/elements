import { getExpressionProperties } from "../../helpers/regex";
import { defineConnection } from "../reactivity/query";


let connectorIndex = 1;
export const appendConnector = function (type, parent, child,callback) {
  let connectionId = connectorIndex++;
  let childTemplate = `<span id=""  el-connection="${connectionId}">${child}</span>`;

  let connectorElement = `<span el-connection="${connectionId}"></span>`;
  let parentTemplate = parent.left + connectorElement + parent.right;
  let connector = {
    attribute: "el-connection",
    id: connectionId,
    type,
    parent: parentTemplate,
    child: childTemplate,
    connectorElement,
    query:parent.query,
    keywords: getExpressionProperties("{{"+parent.query+"}}"),
    
    load:function(instance){
      console.log('tried to load');
   
    }
  };


  return connector;
};

export const connect = function(parent,child){

}
