import { setupElement } from "../elements/setup";

export const CreatePlaceholderElement = function(element,attribute){
    const $comment = setupElement(document.createComment("["+attribute+"-container]"));
    let query = element.getAttribute(attribute);
    if (query.indexOf("{{") == -1) {
      query = "{{" + query + "}}";
    }
  
    element.before($comment);
    element.removeAttribute(attribute);
    return {$comment,query}
}

export const CreatePlaceholderElementV2 = function(instance,element,attribute){
  const $comment = setupElement(document.createComment("["+attribute+"-container]"));
  let query = element.getAttribute(attribute);
  if (query.indexOf("{{") == -1) {
    query = "{{" + query + "}}";
  }

  element.before($comment);
  element.removeAttribute(attribute);
  $comment.controller = instance;
  return {$comment,query}
}