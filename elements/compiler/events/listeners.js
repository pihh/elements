
export const AddEventListener = function (element, scope, attribute) {
  const eventName = attribute.replaceAll("(", "").replaceAll(")", "");
  console.log(element,attribute,eventName,element.getAttribute(attribute));
  if (element.__events.indexOf(eventName) > -1) {
    console.warn({ element, eventName }, "Was already added");
    return;
  }

    let functionName = element.getAttribute(attribute);
    element.__events.push(eventName);
    element.removeAttribute(eventName);
    let isLoaded = false;
  
    scope.__connections.push(() => {
      if (isLoaded) return;
      isLoaded = true;
      let callback = function ($event) {
        console.log(scope,element)
        console.log(eventName, $event, scope, functionName);
      };
      if (functionName.indexOf("(") == -1) {
        functionName = functionName.replace("this.", "");
        callback = function ($event) {
          console.log(scope,element)
          element.controller[functionName]($event);
        };
      } else {
        let functionDeclaration = functionName
          .split("(")[0]
          .trim()
          .replace("this.", "");
        let functionArguments = functionName
          .split("(")[1]
          .split(")")[0]
          .trim()
          .split(",").filter(el => el.length > 0);
        let eventIndex = functionArguments.indexOf("$event");
        callback = function ($event) {
      
          let args = functionArguments.map((arg) => {
            if (arg == "$event") {
              arg = $event;
            } else if (arg == "$index") {
              arg = element.$index;
            } else if (scope.hasOwnProperty(arg)) {
              arg = scope[arg];
            }
            return arg;
          });
          if (eventIndex == -1) {
            args.push($event);
          }
          console.log(functionDeclaration)
          element.controller[functionDeclaration](...args);
        };
      }
      element.addEventListener(eventName, callback);
    });
  };