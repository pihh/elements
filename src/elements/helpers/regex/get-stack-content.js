export function getStackContent(string,open,close){
    let stack = [];
    let start = string.indexOf(open);
    let content = string;
    let success = false;
    if(start > -1){
        stack.push(start);
    }
    for(let i = start+1; i < string.length; i++){
        let char = string.charAt(i);
        if(char === open){
            stack.push(i)
        }
        if(char === close){
            stack.pop()
        }
        if(stack.length === 0){
            success = true;
            stack = [start,i]
            content = string.substring(start+open.length,i)
            break;
        }
    }
    if(stack == -1){
        success = false;
    }
    return {
        indices: stack,
        success,
        content
    }
}