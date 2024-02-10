export const connectProperty = function(instance, prop){

    instance.__defineGetter__(prop, () => {
        return instance.__scope[prop];
      });
      instance.__defineSetter__(prop, (value) => {
        if (typeof instance.__scope[prop] == "object") {
          return instance.__scope[prop];
        }
        instance.__scope[prop] = value;
        return true;
      });

    let rawValue = instance.getAttribute(prop);
    let connectedValue = instance.getAttribute("@"+prop);
    if(rawValue !== null) {
        if(!isNaN(rawValue)) {
            rawValue = Number(rawValue)
        }else if(['true',true].indexOf(rawValue)>-1) {
            rawValue = true
        }else if(['false',false].indexOf(rawValue)>-1){
            rawValue = false
        }else{
            try{
                let obj = JSON.parse(rawValue)
                if(typeof obj === 'object'){
                    rawValue = obj
                }
            }catch(ex){
                // .... Silence is golden
            }
        }
        instance.__scope[prop] = rawValue
    }
    if(connectedValue !== null){
        console.log('@TODO - connect passed value','@'+prop,connectedValue)
    }
}

export const connectProperties = function(instance){
    for (let prop of instance.constructor.props) {
        connectProperty(instance,prop)
    }   
}
