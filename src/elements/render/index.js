import { setupElement } from "../compiler/elements/setup"
import { strToPath } from "../helpers/regex";
// import { connectModel } from "./attributes/model";
// import { connectForLoop } from "./attributes/operation-for";
// import { parseIf } from "./attributes/operation-if";
// import { parseSkipAttribute } from "./attributes/operation-skip";
// import { parseSlots } from "./slots";

export function findTextNodes(node) {
  var A = [];
  if (node) {
    node = node.firstChild;
    while (node != null) {
      if (node.nodeType == 3) A[A.length] = node;
      else A = A.concat(findTextNodes(node));
      node = node.nextSibling;
    }
  }
  return A;
}

/*
export function connectTextNode($node, $instance, $observedAttributes) {
  const $value = $node.textContent;
  $node.__subscriptions = $node.__subscriptions || [];
  for (let subscription of $node.__subscriptions) {
    subscription.unsubscribe();
  }
  $node.__subscriptions = [];
  if ($value.indexOf("{{") > -1 && !$node.skip) {
    const $expression = extractExpression($value);

    const $callback = () => {
      function x() {
        // console.log($expression,this)
        return eval($expression);
      }
      try {
        const res = x.call($instance);
        // console.log({ res });
        $node.textContent = res;
      } catch (ex) {
        console.warn(ex);
      }
    };
    const $props = extractProps($value, $observedAttributes);
    for (let $prop of $props.map(($p) => $p.replaceAll("controller.", ""))) {
      let conn = $instance.controller.__connector($prop, $callback);
      $node.__subscriptions.push(conn);
    }
  }
}
export function connectTextNodes($instance, debug = false) {
  $instance = $instance.controller || $instance;
  const $observedAttributes = $instance.observedAttributes || [];

  const $nodes = findTextNodes($instance.$wrapper || $instance);

  $nodes.forEach(($node) => {
    const $value = $node.textContent;

    if ($value.indexOf("{{") > -1 && !$node.skip) {
      // if ($value.indexOf("theForm.inputs") > -1) {
      //   console.log("here ");
      // }
      const $expression = extractExpression($value);

      const $callback = () => {
        try {
          function x() {
            // console.log(...arguments);
            return eval($expression, ...arguments);
          }
          let $arguments = $node.customParameters ?? {};
          // $arguments = $arguments;
          // console.log($arguments);
          let argKeys = Object.keys($arguments).map((el) => {
            el: undefined;
          });
          argKeys = {
            ...argKeys,
            ...$node.customParameters,
          };

          const res = x.call($instance, ...arguments);

          $node.textContent = res; //x.call($instance);
        } catch (ex) {
          console.log($node, $arguments);
          console.warn(ex);
        }
      };

      const $props = extractProps($value, $observedAttributes);
      for (let $prop of $props) {
        $instance.__connector($prop, $callback);
      }
    }
  });
}
export function evaluate(config = {}) {
  const { $instance, $expression, $value, $el } = { config };

  let $fn = Function("return " + $expression);
  let $result = $fn.call(...config);
  return $result;
}

export function connectCheckbox($instance, $el, $value, $observedAttributes) {
  // Basic callback to ensure the checkbox and the value are synchronized
  function $callback() {
    let $fn = Function("return " + $value);
    let $result = $fn.call($instance);
    if ($result != $el.getAttribute("checked")) {
      if ($result) {
        $el.setAttribute("checked", true);
      } else {
        $el.removeAttribute("checked");
      }
    }
  }
  // Add Change event
  $el.addEventListener("change", ($event) => {
    const $checked = $el.checked;
    let $fn = Function("return " + $value);
    let $result = $fn.call($instance);
    if ($result != $checked) {
      $fn = Function("return " + $value + "=" + $checked);
      $result = $fn.call($instance);
      if ($result) {
        $el.setAttribute("checked", true);
      } else {
        $el.removeAttribute("checked");
      }
    }
  });

  // First run
  let $fn = Function("return " + $value);
  const $checked = $fn.call($instance);

  if ($checked) {
    $el.setAttribute("checked", true);
  }

  return $callback;
}

export function connectTextInput($instance, $el, $value) {
  function $callback() {
    let $fn = Function("return " + $value);
    let $result = $fn.call($instance);
    let $inputValue = $el.getAttribute("value");
    if ($result != $inputValue) {
      if ($result) {
        $el.setAttribute("value", $result);
      }
    }
  }

  $el.addEventListener("keyup", ($event) => {

    const $inputValue = $event.target.value;
    let $fn = Function("return " + $value);
    let $result = $fn.call($instance);
    if ($result != $inputValue) {
      $fn = Function("return " + $value + "='" + $inputValue + "'");
      $result = $fn.call($instance);
    }
  });
  let $fn = Function("return " + $value);
  let $result = $fn.call($instance);
  $el.setAttribute("value", $result);

  return $callback;
}

/*
export function connectModel($instance, $el, $value, $observedAttributes) {
  const $props = extractProps($value, $observedAttributes);

  if (!$el.didBindModel) {
    $el.didBindModel = true;
    let $callback;
    if ($el.getAttribute("type") === "checkbox") {
      $callback = connectCheckbox($instance, $el, $value);
    } else {
      $callback = connectTextInput($instance, $el, $value);
    }
    if ($callback) {
      for (let $prop of $props) {
        $instance.__connector($prop, $callback);
      }
    }
  }
}
*
export const connectNativeEvent = function () {};

const getAllMethods = (obj) => {
  let properties = new Set();
  let currentObj = obj;
  do {
    Object.getOwnPropertyNames(currentObj).map((item) => properties.add(item));
  } while ((currentObj = Object.getPrototypeOf(currentObj)));
  return [...properties.keys()].filter(
    (item) => typeof obj[item] === "function"
  );
};

const parseArgEvent = function (arg, instance, $event, element) {
  if (arg == "$event") {
    return {
      success: true,
      value: $event,
    };
  }
  return { success: false };
};
const parseArgController = function (arg, instance, $event, element) {
  let success = true;
  let value = "";

  const path = strToPath(arg);

  let loop = instance;

  try {
    for (let p of path) {
      if (loop.hasOwnProperty(p)) {
        loop = loop[p];
      } else {
        throw new Error("Invalid");
      }
    }
    value = loop;
  } catch (ex) {
    success = false;
  }

  return {
    success,
    value,
  };
};

const parseArgValue = function (arg, instance, $event, element) {
  /*@TODO *
  if (!isNaN(arg)) return { success: true, value: Number(arg) };

  if ([true, false, "true", "false"].indexOf(arg) > -1) {
    return { success: true, value: [true, "true"].indexOf(arg) > -1 };
  }

  return { success: true, value: arg };
};
const parseEventParameters = function (args, instance, $event, element) {
  let argNames = args;
  let argValues = [];

  for (let arg of argNames) {
    for (let parse of [parseArgController, parseArgEvent, parseArgValue]) {
      let parsedArg = parse(arg, instance, $event, element);

      if (parsedArg.success) {
        argValues.push(parsedArg.value);
        break;
      }
    }
  }

  return argValues;
};

export const extractMethodAndArgListFromElement = function (
  context,
  element,
  attribute,
  value
) {
  let parsedEventName = attribute.replaceAll("(", "").replaceAll("(", ")");
  if (parsedEventName == attribute) {
    attribute = "(" + parsedEventName + ")";
  }
  element.__events.push(attribute);
  element.__events.push(parsedEventName);
  element.__eventInfo = element.__eventInfo || {};
  element.__eventInfo[parsedEventName] = {};

  let params = [];
  let method = value.trim().split("("); //[0]
  if (method.length > 1) {
    try {

      params = method[1]
        .split(")")[0]
        .replaceAll("(", "")
        .replaceAll(")", "")
        .split(",")
        .map((el) => el.trim())
        .filter((el) => el.length > 0);
    } catch (ex) {
      throw new Error("xx");
    }
  } else {
  }

  method = method[0].replaceAll("(", "").replaceAll(")", "").trim();

  return { method, params };
};
export const connectEventListener = function ($instance, $el, $attr, $value) {

  $el.__events = $el.__events ?? [];
  if ($el.__events.indexOf($attr) > -1) return;

  let $eventAction = $attr.replaceAll("(", "").replaceAll(")", "");
  $el.__events.push($attr);
  $el.__events.push($eventAction);

  $el.$instance = $instance;
  $el.$value = $value;
  $el.$attr = $attr;
  const { method, params } = extractMethodAndArgListFromElement(
    $instance,
    $el,
    $attr,
    $value
  );

  if (method.trim().length == 0) return;

  $el.addEventListener($eventAction, function ($event) {
    let parsedParams = parseEventParameters(params, $instance, $event, $el);
    if (parsedParams.length == 0) {
      parsedParams.push($event);
    }
    $instance[method](...parsedParams);
  });
};

export function handleIfOperation($instance, $el, $attr) {
  /*
  $el.classList.add("the-if-container");
  $el.ifProp = $el.getAttribute($attr);
  $el.controller[$attr] =
    ["true", true].indexOf($el.controller[$attr]) > -1 ? true : false;
  $el.removeAttribute($attr);
  return {
    $stack: $el,
  };
  *
}

export function afterLoadCallbackHandleIfOperation(instance) {}

export function handleRefOperation($instance, $el, $value) {}

export function handleForOperation($instance, $el, $value) {}

export function afterLoadCallbackHandleForOperation(instance) {}
export function handleOperation($instance, $el, $attr) {
  if ($attr == "for") {
    $el.controller = $instance;
    connectForLoop($el, $instance);
    return { $stack: $el };
  } else if ($attr == "if") {
    $el.controller = $instance;
    parseIf($instance, $el);
    return { $stack: $el };
  } else if ($attr == "*if") {
    return handleIfOperation($instance, $el, $attr);
  } else if ($attr == "*ref") {
    const $value = $el.getAttribute($attr);

    $instance[$value] = $el;



    return {};
  } else if ($attr == "*for") {
    $el.forQuery = $el.getAttribute($attr);
    $el.removeAttribute($attr);
    $el.forProp = $el.innerHTML;
    $el.innerHTML = "";
    $el.classList.add("the-for-container");

    return { $stack: $el };
  }
}
export function connectElement($instance, $el, $observedAttributes) {
  let $stack = false;
  let $attrs = $el.getAttributeNames();
  const $skip = parseSkipAttribute($attrs, $el);
  if ($skip) {
    return $stack;
  }

  for (let $attr of $attrs) {
    // If is data binding:
    let $value = $el.getAttribute($attr);

    if ($attr.indexOf("*") == 0 || $attr == "for" || $attr == "if") {
      const res = handleOperation($instance, $el, $attr);
      if (res.$stack) {
        $stack = $el;
        return $stack;
      }
    } else if ($attr.indexOf("[") == 0) {
      if ($attr == "[model]") {
        connectModel($instance, $target);
        //connectModel($instance, $el, $value);
      }
    } else if ($attr.indexOf("(") > -1) {
      connectEventListener($instance, $el, $attr, $value);

      //$el.removeAttribute($attr);
    } else if ($value.indexOf("{{") > -1) {
      if ($attr === "model" || $attr == "[model]") {
        // connectModel($instance, $el, $value);
        connectModel($instance, $target);
      } else {
        //const $expression = extractExpression($value);
        const $expression =
          "`" + $value.replaceAll("{{", "${").replaceAll("}}", "}") + "`";
        const $callback = () => {
          let $fn = Function("return " + $expression);
          let $result = $fn.call($instance);

          if ($el.getAttribute($attr) !== $result) {
            $el.setAttribute($attr, $result);
          }
        };
        const $props = extractProps($value, $observedAttributes);

        for (let $prop of $props) {
          $instance.__connector($prop, $callback);
        }
      }
    }
  }

  return $stack;
}
export function connectElements($instance) {
  if (!$instance.$wrapper) {
    if ($instance.controller == $instance) {
      $instance.$wrapper = $instance;
    } else {
      $instance.$wrapper = document.createElement("span");
      $instance.appendChild($instance.$wrapper);
    }
    $instance.$wrapper.innerHTML = $instance.$template;
  }
  const $observedAttributes = $instance.observedAttributes || [];

  parseSlots($instance);
  // Parse all elements and search for attributes

  [...$instance.$wrapper.querySelectorAll("[for]")].forEach(($el) => {
    connectForLoop($el, $instance);
  });
  // Parse all elements and search for attributes
  [...$instance.$wrapper.querySelectorAll("[if]")].forEach(($el) => {
    parseIf($instance, $el);
  });

  [...$instance.$wrapper.querySelectorAll("[model]")].forEach(($el) => {
    connectModel($instance, $el);
  });

  [...$instance.$wrapper.querySelectorAll("*")].forEach(($el) => {
    setupElement($el);
    if (!$el.controller) {
      $el.controller = $instance;
    }
    connectElement($instance, $el, $observedAttributes);
  });
}

export function $bind($instance, render = true) {
  connectElements($instance);
  connectTextNodes($instance);
  if (render) {
    $instance.render();
  }
}

function extractProps(string, observedAttributes = []) {
  let props = observedAttributes
    .filter((attr) => string.indexOf(`this.${attr}`) > -1)
    .map((el) => el.replaceAll("this.", ""));

  if (string.indexOf("theForm") > -1) {
    let nestedProps = extractNestedKeys(string, props);
    props = props.concat(nestedProps);
    console.log(props);
  }

  return props;
}
function extractExpression(string) {
  return "`" + string.replaceAll("{{", "${").replaceAll("}}", "}") + "`";
}

function addDidLoadCallback($el, $callback) {
  $el.didLoad = $el.didLoad || [];
  $el.didLoad.push($callback);
}

const extractNestedKeys = function (string, props) {
  // Check for nested attributes
  let separators = props.map((o) => o + ".").concat(props.map((o) => o + "["));

  // Step 1 -> Split into watchlist
  let targets = string
    .split("{{")
    .filter((s) => s.indexOf("}}") > 0)
    .map((s) => s.split("}}")[0].trim())
    .filter((t) => {
      for (let s of separators) {
        if (t.indexOf(s) > -1) {
          return true;
        }
      }
      return false;
    });

  // console.log({separators,targets,string})

  // Step 2 -> Verify if exists watched attributes
  let nestedProperties = [];
  for (let target of targets) {
    target = target
      .replaceAll("?", " ")
      .replaceAll(":", " ")
      .replaceAll("*", " ")
      .replaceAll("%", " ")
      .replaceAll("/", " ")
      .replaceAll("+", " ")
      .replaceAll("-", " ");

    for (let s of separators) {
      if (target.indexOf(s) > -1) {
        let t = target.split(s)[1].trim().split(" ")[0];

        if (t.length > 0) {
          nestedProperties.push(s + t);
        }
      }
    }
    console.log(nestedProperties);
  }
  return nestedProperties;
};

/*

  for (let prop of props) {
    if (string.indexOf("theForm") > -1) {
    let customProps = [];
    
    }
    }
    
    /*

    // .map((el) =>
    //   el
    //     .split(".")
    //     .filter((s) => s.trim().length > 0)
    //     .map((s) =>
    //       s.split(' ')
    //         .replaceAll("\\", " ")
    //         .replaceAll("/", " ")
    //         .replaceAll("?", " ")
    //         .replaceAll(":", " ")
    //         .replaceAll("}", " ")
    //         .trim()
    //     )

    // );
    if (string.indexOf("theForm") > -1) {
      // console.log(string.split(prop));
      // console.log("AQUI");
      // console.log(customProps);
      // props.concat(customProps);
    }
    

    */
