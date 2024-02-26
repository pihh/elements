export const AddEventListener = function (element, scope, attribute) {
  const eventName = attribute.replaceAll("(", "").replaceAll(")", "");
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
      console.log(scope, element);
      console.log(eventName, $event, scope, functionName);
    };
    if (functionName.indexOf("(") == -1) {
      functionName = functionName.replace("this.", "");
      callback = function ($event) {
    
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
        .split(",")
        .filter((el) => el.length > 0);
      let eventIndex = functionArguments.indexOf("$event");
      callback = function ($event) {
        let args = functionArguments.map((arg) => {
          if (arg == "$event") {
            arg = $event;
          } else if (arg == "$index") {
            // console.log({arg,element})
            // arg = element.$index;
          } else if (scope.hasOwnProperty(arg)) {
            arg = scope[arg];
          }
          return arg;
        });
        if (eventIndex == -1) {
          args.push($event);
        }
        element.controller[functionDeclaration](...args);
      };
    }
    element.addEventListener(eventName, callback);
  });
};

export const bindEventBroadcaster = function (parent, child, attribute) {
  try {
    const eventName = attribute.replace("@", "").toLowerCase();
    const action = child
      .getAttribute(
        attribute //tr.replaceAll("this.", "").trim().
      )
      .replaceAll("this.", "")
      .split("(")
      .map((el) => el.trim())
      .filter((el) => el.length > 0)[0];

    child.__actions = child.__actions || {};

    if (!child.__actions.hasOwnProperty(eventName)) {
    
      child.__actions[eventName] = function (data) {
        const evt = new CustomEvent(eventName, {
          detail: { data: data },
        });
        // console.log("child will call parent",{evt,eventName});
        parent.dispatchEvent(evt);
      };
    }

    if (!parent.__events || parent.__events.indexOf(eventName) == -1) {
      if (!parent.__events) parent.__events = [];
      parent.__events.push(eventName);
      parent.addEventListener(eventName,function ($event) {
     
        const $fn = Function("return this." + action+'(...arguments)');
        const output = $fn.call(parent, $event)//.call(parent,$event);
  
      });
    }
  } catch (ex) {
    console.warn(ex);
  }
};
