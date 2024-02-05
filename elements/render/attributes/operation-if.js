import { initCommentContainer, setupElement } from "../../utils/element";
import { conditionCallback, connectReactivity } from "../../utils/eval/callback";
import { extractProps, extractPropsFromCondition } from "../../utils/eval/props";

export function parseIf(context,target){
    if (target.didBindIf) return;
    setupElement(target)
    target.didBindIf = true;
  
    let query = target.getAttribute("if");
    if (query.indexOf('this.') == -1){
        query = 'this.'+query
    }
    target.removeAttribute("if");
    let props = extractPropsFromCondition(context,query)
    let $comment = initCommentContainer(context,target,{removeElement:false,placeholderComment:'IF CONTAINER'}) 
    
    
    
    const callback = function(e){
        try{
            const success = conditionCallback(context,query);
            if(success){
                $comment.before(target);
            }else{
                target.remove();
            }
        }catch(e){
            console.warn(e)
        }
    }
    connectReactivity(context,target,query,callback,{
        extractPropsFrom: extractPropsFromCondition
    })
}