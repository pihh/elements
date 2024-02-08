import {
  getPath2,
  modelUpdate,
  modelValue,
} from "../../../../elements/compiler/model/update";
import {
  getExpressionProperties,
  parseTemplateExpressions,
} from "../../helpers/regex";
import {
  CreatePlaceholderElement,
  CreatePlaceholderElementV2,
} from "../operations/comment";

let __selectorId = 0;
export function getSelector(elm) {
  if (elm.tagName === "BODY") return "BODY";
  const names = [];

  while (elm.parentElement && elm.tagName !== "BODY") {
    if (elm.id) {
      names.unshift("#" + elm.getAttribute("id")); // getAttribute, because `elm.id` could also return a child element with name "id"
      break; // Because ID should be unique, no more is needed. Remove the break, if you always want a full path.
    } else {
      let c = 1,
        e = elm;
      for (; e.previousElementSibling; e = e.previousElementSibling, c++);
      names.unshift(elm.tagName + ":nth-child(" + c + ")");
    }
    elm = elm.parentElement;
  }

  let selector = names.join('>');
  if(!selector){
    selector = "[data-el-selector='"+__selectorId+"'";
    elm.dataset.elSelector = __selectorId;
    __selectorId++;

  }
  return selector;//names.join(">");
}

export const updateAttribute = function (instance, element, attribute, query) {
  //console.log({instance})
  try {
    // console.log({instance,color:instance.color,element,attribute,query:"return `"+query+"`"});
    const $fn = Function("return `" + query + "`");
    element.setAttribute(attribute, $fn.call(instance));
  } catch (ex) {
    console.log({
      instance,
      colors: instance.colors,
      attribute,
      query,
      element,
      ex,
    });
  }
};
export const updateTextNode = function (instance, element, query) {
  const $fn = Function("return `" + query + "`");
  element.textContent = $fn.call(instance);
};

export const addModelListener = function (instance, element, attribute) {
  const nodeName = element.nodeName;
  const type = element.getAttribute("type");
  let modelAttribute = "value";
  let eventName = "keyup";

  let callback = function (value) {
    element.setAttribute("value", value);
  };

  if (nodeName === "SELECT" || type === "checkbox") {
    eventName = "change";
  }
  if (type === "checkbox") {
    modelAttribute = "checked";
    callback = function (value) {
      if (value == "true") value = true;
      if (value) {
        element.setAttribute("checked", true);
      } else {
        element.removeAttribute("checked");
      }
    };
  }
  element.addEventListener(eventName, function (e) {
    modelUpdate(instance, attribute, e.target[modelAttribute]);
  });

  instance.__connect(attribute, callback);
  callback(modelValue(instance, attribute));
};

export const addCustomListener = function (instance, element, event, fn, args) {
  if (event.indexOf("on") == 0 && typeof element[event] == "object") {
    event = event.slice(2);
  }

  element.addEventListener(event, function (e) {
    instance[fn](...args);
  });
};

export const setOperationIf = function (element) {
  if (!element.getAttribute("*if")) return;
  let { $comment, query } = CreatePlaceholderElement(element, "*if");
  let value = query;

  query = query.replaceAll("{{", "${").replaceAll("}}", "}");
  $comment.after(element);
  $comment.query = query;

  const setup = function (instance, comment, element) {
    let keywords = getExpressionProperties(value);
    const callback = function () {
      const $fn = Function("return `" + query + "`");
      const output = $fn.call(instance);
   
      if (["true", true].indexOf(output) > -1) {
        if (!element?.isConnected) {
          comment.before(element);
        }
      } else {
        if (element?.isConnected) {
          element.remove();
        }
      }
    };
    for (let keyword of keywords) {
      instance.__connect(keyword, callback);
    }

    return callback;
  };
  $comment.__ifSetup = setup;

  return $comment;
};

export const setOperationFor = function (element, comment, levels = []) {
  /*
   * Add event listener para length;
   * Define a funcão geradora e onde se mapeia os dados;
   * Limpa o template
   */
  let level = 0;
  if (comment) {
    level = comment.level;
  }
  levels.push({
    key: "__level_" + levels.length + "__",
    index: "__index_" + levels.length + "__",
    template: "",
  });

  // const query = "let option of colors";
  const placeholder = document.createElement("div");
  const { $comment, query } = CreatePlaceholderElement(element, "*for");
  placeholder.before(element);
  placeholder.appendChild(element);
  let template = placeholder.innerHTML;

  template = parseTemplateExpressions(
    template,
    "option",
    "this.colors[" + levels[0].index + "]"
  ); 
  levels[level].template = template;
  placeholder.innerHTML = template;
  $comment.before(placeholder);
  $comment.__placeholder = placeholder.cloneNode(true);
  $comment.levels = levels;

  const generator = (self, index = 0) => {
    try {
      while (index >= self.__loopItems.length) {
        try {
          const $len = self.__loopItems.length;
          let $item = $comment.__placeholder.cloneNode(true);
          $item.innerHTML = $comment.__placeholder
            .cloneNode(true)
            .innerHTML.replaceAll("__index_0__", $len);
          $item = $item.firstElementChild;
          $item.id = "item" + index;

          console.log({$item})
          // $item = r.__initAndAppendConnections(t.)
          self.__loopItems.push($item);
          // const r = new Render();
          // const init = function () {
          //   r.__initAndAppendConnections($item, self);
          // };
          // console.log({ init });
        } catch (ex) {
          console.warn(ex);
          break;
        }
      }
      // const $items = self.__visibleItems.length
      // for (let i = $items; i <= index; i++) {
      //   self.__visibleItems.push(self.__loopItems[i]);
      //   self.before(self.__visibleItems[i])
      // }
    } catch (ex) {
      console.log({ placeholder, levels, ex });
    }
  };

  const manager = function (items = [], self) {
    if (items.length > self.__loopItems.length) {
      for (let i = self.__loopItems.length; i < items.length; i++) {
        generator(self, i);
      }
    }
    if (items.length > self.__visibleItems.length) {
      for (let i = self.__visibleItems.length; i < items.length; i++) {
        self.__visibleItems.push(self.__loopItems[i]);
        self.before(self.__visibleItems[i]);
      }
    } else if (items.length < self.__visibleItems.length) {
      for (let i = items.length; i < self.__visibleItems.length; i++) {
        // self.__visibleItems[i].remove();
        //self.__visibleItems.pop()
      }
      // self.__visibleItems= self.__visibleItems.slice(0,items.length);
    }
  };

  const bind = function (element) {
    element.__loopItems = [];
    element.__visibleItems = [];
  };
  $comment.__forLoopBind = bind;
  $comment.__loopItems = [];
  $comment.__visibleItems = [];
  $comment.__forLoopGenerator = generator;
  $comment.__forLoopManager = manager;
  $comment.level = level;
  $comment.child = [];
  if (!comment) {
    comment = $comment;
  }

  placeholder.remove();

  return $comment;
};
