export const defineConnection = function(instance, query, callback, keywords){
    
    const callbackFn = function(){

        const fn = Function("return `"+query+"`");
        const outcome = fn.call(instance,...arguments);
        callback(outcome)

    }
    const subscriptions = [];
    for(let keyword of keywords) {
        subscriptions.push(instance.__connect(keyword, callbackFn));
    }
    return subscriptions;
}

