const Boilerplate = {
  id: Symbol("attribute connection"),
  props: [],
  attribute: "text",
  value: "{{text}}",
  expression: "${this.text}",
  setup: function (instance, element) {
    if (!instance.__connections__.hasOwnProperty(this.id)) {
      instance.__connections__[this.id] = this.id;
      this.connect(instance, element);
    }
  },
  connect: function (instance, element) {
    const attribute = this.attribute;
    const fn = Function("return `" + this.expression + "`");
    const callback = function (value) {
      const output = fn.call(instance);
      element.setAttribute(attribute, output);
    };
    for (let prop of this.props) {
      instance.__subscriptions__.push(instance.connect(prop, callback));
    }
    callback();
  },
  unsubscribe: [],
};
export let connectionBoilerplateAttribute = function (id, props, value, expression, attribute) {
  let boilerplate = {};
  let setup = Object.assign({}, Boilerplate);
  setup.id = Symbol("attribute connection");
  setup.props = props;
  setup.value = value;
  setup.expression = expression;
  setup.attribute = attribute;
  boilerplate[id] = setup;
  return boilerplate;
};

// Picks up the template, replaces the text entries with data-el-text attributes ;
// Creates the connector object for the template;

export const connectAttribute = function (template, properties) {
  return {
    "data-el-attribute": {
      ...connectionBoilerplateAttribute(
        0,
        ["color"],
        "component bg-{{color}}-900",
        "component bg-${this.color}-900",
        "class"
      ),

      ...connectionBoilerplateAttribute(
        1,
        ["title"],
        "{{title}}",
        "${this.title}",
        "title"
      ),
    },
  };
};
/*
         "data-el-attribute": {
        0: {
          id: Symbol("attribute connection"),
          props: ["color"],
          attribute: "class",
          value: "component bg-{{color}}-900",
          expression: "component bg-${this.color}-900",
          setup: function (instance, element) {
            if (!instance.__connections__.hasOwnProperty(this.id)) {
              instance.__connections__[this.id] = this.id;
              this.connect(instance, element);
            }
          },
          connect: function (instance, element) {
            const attribute = this.attribute;
            const expression = this.expression;
            const fn = Function("return `" + this.expression + "`");
            const callback = function (value) {
              const output = fn.call(instance);
              element.setAttribute(attribute, output);
            };
            for (let prop of this.props) {
              // console.log({instance,prop,callback});
              // debugger;
              instance.__subscriptions__.push(instance.connect(prop, callback));
            }
            callback();
          },
          unsubscribe: [],
        },
        1: {
          id: Symbol("attribute connection"),
          props: ["text"],
          attribute: "text",
          value: "{{text}}",
          expression: "${this.text}",
          setup: function (instance, element) {
            if (!instance.__connections__.hasOwnProperty(this.id)) {
              instance.__connections__[this.id] = this.id;
              this.connect(instance, element);
            }
          },
          connect: function (instance, element) {
            const attribute = this.attribute;
            const fn = Function("return `" + this.expression + "`");
            const callback = function (value) {
              const output = fn.call(instance);
              element.setAttribute(attribute, output);
            };
            for (let prop of this.props) {
              instance.__subscriptions__.push(instance.connect(prop, callback));
            }
            callback();
          },
          unsubscribe: [],
        },
      },
      */
