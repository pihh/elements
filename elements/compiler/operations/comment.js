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