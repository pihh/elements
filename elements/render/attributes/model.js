import {
  connectReactivity,
  inputEventListenerCallback,
} from "../../utils/eval/callback";
import { evaluatePath, extractProps, parseProps } from "../../utils/eval/props";
import { strToPath } from "../../utils/regex";
import { extractArguments } from "./methods";
import { getPath } from "./operation-for";

export function setupModel(context, target) {
  if (target.__didBindModel) return target;

  const model = {
    key: "",
    callbacks: [],
    inputType: "",
    events: [],
    attribute: "",
    controller: context,
    value: undefined,
    required: false,
    validators: [],
    actionDelayTimeoutFn: "",
    actionDelayTimeoutMs: 0,
  };

  const possibleAttributes = [
    { key: "model", controller: context },
    { key: "[model]", controller: context.controller ?? controller },
  ];

  for (let attribute of possibleAttributes) {
    if (target.hasAttribute(attribute.key)) {
      model.key = target.getAttribute(attribute.key);
      model.controller = attribute.controller;
      model.attribute = attribute.key;
      break;
    }
  }

  if (!model.key) {
    console.warn("No model attribute found, will skip binding");
    return target;
  }

  model.inputType = target.getAttribute("type") || "";
  model.inputType = model.inputType.trim(); //.split('.')
  //model.inputType =model.inputType[model.inputType.length - 1]  ;

  const inputTypeIndex = Object.keys(INPUT_TYPES).indexOf(model.inputType);
  if (inputTypeIndex > -1) {
    // model.inputType = model.inputType;
    // model.callbacks.push();
    model.baseCallback = INPUT_TYPES[model.inputType].baseCallback;
  } else {
    model.inputType = "none";
    model.baseCallback = baseModelCallback;
  }

  let value = evaluatePath(context, strToPath(model.key)); //extractProps(model.controller, model.key);
  if (value == undefined) {
    if (target.hasAttribute("value")) {
      value = target.getAttribute("value");
    }
  }
  value = value == undefined ? null : value;

  model.value = value;

  target.removeAttribute(model.attribute);
  //target.setAttribute("value", model.value);
  target.__model = model;

  let { event, callback } = model.baseCallback(context, target, model.key);

  bindEventListener(target, event, callback);
  target.__didBindModel = true;
  return target;
}

export function bindEventListener(target, event, callback) {
  if (target.__model.events.indexOf(event) > -1) return;

  target.__model.events.push(event);
  target.addEventListener(event, ($event) => {
    callback($event);
  });
}

export function connectModel(context, target) {
  return setupModel(context, target);
}

const baseModelCallback = function (context, target) {
  // @TODO
  console.log("will bind base callback");

  const event = "change";
  const callback = function ($event) {
    //console.log(context, target, target.__model.key, $event);
  };
  return { event, callback };
};

let getOrSetModel = function (newValue, context, target) {
  let path = strToPath(target.__model.key);
  let oldValue = context;

  for (let p of path) {
    oldValue = oldValue[p];
  }

  if (oldValue != newValue) {
    setToValue(context, newValue, path);
    target.setAttribute("value", newValue);
  }
};

function setToValue(obj, value, path) {
  var i = 0;
  for (i = 0; i < path.length - 1; i++) obj = obj[path[i]];

  obj[path[i]] = value;

  return value;
}

const bindInputTextCallback = function (context, target) {
  const event = "keyup";

  const callback = function ($event) {
    if (!$event) return;

    let newValue = $event.target.value;

    getOrSetModel(newValue, context, target);
  };
  return { event, callback };
};
const bindInputNumberCallback = function (context, target) {
  const event = "keyup";

  const callback = function ($event) {
    if (!$event) return;

    let newValue = $event.target.value;
    if (!isNaN(newValue)) {
      newValue = Number(newValue);
    }
    getOrSetModel(newValue, context, target);
  }; 
  return { event, callback };
};
const bindInputCheckboxCallback = function (context, target) {
  console.log("@TODO");
  return baseModelCallback(context, target);
};
const bindInputRadioCallback = function (context, target) {
  console.log("@TODO");
  return baseModelCallback(context, target);
};
const bindInputSelectCallback = function (context, target) {
  console.log("@TODO");
  return baseModelCallback(context, target);
};

const INPUT_TYPES = {
  button: {
    coded: false,
    baseCallback: baseModelCallback,
    validators: [],
    delayTimeout: "",
  },

  checkbox: {
    coded: true,
    baseCallback: baseModelCallback,
    validators: [],
    delayTimeout: "",
  },

  color: {
    coded: false,
    baseCallback: baseModelCallback,
    validators: [],
    delayTimeout: "",
  },

  date: {
    coded: false,
    baseCallback: baseModelCallback,
    validators: [],
    delayTimeout: "",
  },

  "datetime-local": {
    coded: false,
    baseCallback: baseModelCallback,
    validators: [],
  },

  email: {
    coded: true,
    baseCallback: baseModelCallback,
    validators: [],
    delayTimeout: "",
  },

  file: {
    coded: false,
    baseCallback: baseModelCallback,
    validators: [],
    delayTimeout: "",
  },

  hidden: {
    coded: true,
    baseCallback: baseModelCallback,
    validators: [],
    delayTimeout: "",
  },

  image: {
    coded: false,
    baseCallback: baseModelCallback,
    validators: [],
    delayTimeout: "",
  },

  month: {
    coded: false,
    baseCallback: baseModelCallback,
    validators: [],
    delayTimeout: "",
  },

  number: {
    coded: true,
    baseCallback: bindInputNumberCallback,
    validators: [],
    delayTimeout: "",
  },

  password: {
    coded: true,
    baseCallback: baseModelCallback,
    validators: [],
    delayTimeout: "",
  },

  radio: {
    coded: false,
    baseCallback: baseModelCallback,
    validators: [],
    delayTimeout: "",
  },

  range: {
    coded: false,
    baseCallback: baseModelCallback,
    validators: [],
    delayTimeout: "",
  },

  reset: {
    coded: false,
    baseCallback: baseModelCallback,
    validators: [],
    delayTimeout: "",
  },

  search: {
    coded: false,
    baseCallback: baseModelCallback,
    validators: [],
    delayTimeout: "",
  },

  submit: {
    coded: false,
    baseCallback: baseModelCallback,
    validators: [],
    delayTimeout: "",
  },

  tel: {
    coded: true,
    baseCallback: baseModelCallback,
    validators: [],
    delayTimeout: "",
  },

  text: {
    coded: true,
    baseCallback: bindInputTextCallback,
    validators: [],
    delayTimeout: "",
  },

  teste: {
    coded: true,
    baseCallback: bindInputTextCallback,
    validators: [],
    delayTimeout: "",
  },

  time: {
    coded: false,
    baseCallback: baseModelCallback,
    validators: [],
    delayTimeout: "",
  },

  url: {
    coded: false,
    baseCallback: baseModelCallback,
    validators: [],
    delayTimeout: "",
  },

  week: {
    coded: false,
    baseCallback: baseModelCallback,
    validators: [],
    delayTimeout: "",
  },
};
