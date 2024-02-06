import { findTextNodes } from "../helpers/dom";
import { Reactive } from "../signals/proxy";

const templates = {};
const extractArguments = function (query) {
  let params = query
    .replaceAll("\n", "")
    .trim()
    .split("{{")
    .filter((el) => el.trim().length > 0)
    .map((el) => el.split("}}")[0]);

    console.log('extract',params)
  params = params
    .map(
      (el) =>
        el
          .replaceAll("?", " ")
          .replaceAll(":", " ")
          .replaceAll("<", " ")
          .replaceAll(">", " ")
          .replaceAll("+", " ")
          .replaceAll("-", " ")
          .replaceAll("%", " ")
          .replaceAll('"', " ")
          .replaceAll('"', " ")
          .split(" ")[0]
    )
    .map((el) => el.replaceAll("this.", ""));
  query = "`" + query.replaceAll("{{", "${").replaceAll("}}", "}") + "`";
  return { query, params };
};
const markTemplate = function (template, element, id, config = {}) {
  var query = config.query;
  var params;
  let callback;
  let connect;
  let attribute;
  let __id__ = ++id;
  if (element.nodeType === 3) {
    if (!query) query = element.textContent;
    let container = element.parentNode;
    container.innerText = element.textContent;
    element.remove();
    element = container;

    var { query, params } = extractArguments(query);
    callback = function (element, context) {
      try {
        const $node = element.childNodes[1] || element;
        const $fn = Function("return " + query);
        $node.textContent = $fn.apply(context);
      } catch (ex) {
        console.log(element, context);
        console.warn(ex);
      }
    };
    connect = function (context, scope, newpath) {
      const oldCallback = this.callback;
      const element = context.querySelector(
        '[data-fw="' + this.dataset.__id__ + '"]'
      );
      this.controller = context;
      this.element = element;

      const callback = () => {
        oldCallback.call(context, element, scope, newpath);
      };
      this.callback = callback;
      this.callback();
    };
  } else {
    console.log([...arguments]);
    query = [...arguments][3].query
    attribute = [...arguments][3].attribute
    var params;
    
    if(attribute.indexOf('class')>-1){
      
      var { query, params } = extractArguments(query);
    }else{

      console.log({query,attribute,params});
    }
    connect = function (context, scope, newpath) {
      const oldCallback = this.callback;
      const element = context.querySelector(
        '[data-fw="' + this.dataset.__id__ + '"]'
      );
      this.controller = context;
      this.element = element;
        console.log(this,query)
      const callback = () => {
        oldCallback.call(context, element, scope, newpath);
      };
      this.callback = callback;
      this.callback();
    };
    callback = function (element, context) {
      
      console.log("cb", element, context, ...arguments,this);
      console.log(this,query,params,attribute)
     
    };
  }

  element.dataset.fw = __id__;
  templates[template.id].watchers.push({
    type: config.type,
    element,
    query: query,
    params: params,
    callback: callback,
    connect: connect,
    dataset: { __id__, key: "data-fw" },
  });
  return element;
};
const mapTemplate = function (template) {
  let id = 0;
  const elements = [...template.content.querySelectorAll("*")];
  elements.forEach((el) => {
    const attributes = el.getAttributeNames();
    for (let attribute of attributes) {
      if (attribute == "if" || attribute == "for") {
        markTemplate(template, el, ++id, {
          type: attribute,
          query: el.getAttribute(attribute),
        });
        el.removeAttribute(attribute);
      } else
      if (attribute.indexOf("@") == 0) {
        markTemplate(template, el, ++id, {
          type: "action",
          attribute: attribute,
        });
        el.removeAttribute(attribute);
      }else
      if (el.getAttribute(attribute).indexOf("{{") > -1) {
        markTemplate(template, el, ++id, {
          type: "attribute",
          attribute: attribute,
          query: el.getAttribute(attribute)
        });
      }
    }
  });
  const nodes = findTextNodes(template.content).filter(
    (el) => el.textContent.indexOf("{{") > -1
  );
  for (let node of nodes) {
    markTemplate(template, node, ++id, { type: "text" });
  }
};

const BindTemplate = function (
  template,
  schema = { isShowing: true, texteNode: "textnode aqui", color: "red" }
) {
  let element =
    templates[template.id].origin.content.children[0].cloneNode(true);
  // element.innerHTML = templates[template.id].origin.content.cloneNode(true).innerHTML;

  document.body.appendChild(element);

  const [scope, connect, render] = Reactive(schema);

  element.$scope = scope;
  element.connector = connect;
  element.render = render;
  element.subscriptions = [];
  element.unsubscribe = function () {
    element.subscriptions.map((el) => el.unsubscribe());
    element.subscriptions = [];
  };

  const __internals = Object.assign(
    {},
    { watchers: templates[template.id].watchers }
  );
  element.__internals = __internals;
  for (let watcher of element.__internals.watchers) {
    watcher.connect(element, scope, element.connector);
  }

  return element;
};
export const Compile = function (template) {
  if (templates.hasOwnProperty(template.id)) return templates[template.id];
  templates[template.id] = {
    load(
      schema = { isShowing: true, texteNode: "textnode aqui", color: "red" }
    ) {
      return new Promise((res) => {
        let element = BindTemplate(template, schema);
        // element.$scope.isShowing = true;
        res(element);
        element.template.watchers.map((w) => w.connect());
      });
    },
    origin: template,
    watchers: [],
  };
  mapTemplate(template);
  document.body.appendChild(templates[template.id].origin);
  templates[template.id].load().then(console.log);
  return templates[template.id];
};


console.log({Reactive})