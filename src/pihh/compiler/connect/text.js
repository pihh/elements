const Boilerplate = {
  id: Symbol("text connection"),
  props: ["title"],
  attribute: "textContent",
  value: "{{title}}",
  expression: "${this.title}",
  childNode: 0,
  setup: function (instance, element) {
    if (!instance.__connections__.hasOwnProperty(this.id)) {
      instance.__connections__[this.id] = this.id;
      this.connect(instance, element);
    }
  },
  connect: function (instance, element) {
    const node = [...element.childNodes][this.childNode];
    const fn = Function("return `" + this.expression + "`");
    const attribute = this.attribute;
    const expression = this.expression;
    const callback = function (value) {
      try {
        const output = fn.call(instance);
        node[attribute] = output;
      } catch (ex) {
        console.warn(ex);
      }
      // node.setAttribute(attribute, output);
    };

    for (let prop of this.props) {
      instance.__subscriptions__.push(instance.connect(prop, callback));
      // console.log({ instance, prop, callback });
    }

    callback();
  },
  unsubscribe: [],
};
let connectionBoilerplate = function (id, props, value, expression, childNode) {
  let boilerplate = {};
  let setup = Object.assign({}, Boilerplate);
  setup.id = Symbol("text connection");
  setup.props = props;
  setup.value = value;
  setup.expression = expression;
  setup.childNode = childNode;
  boilerplate[id] = setup;
  return boilerplate;
};

// Picks up the template, replaces the text entries with data-el-text attributes ;
// Creates the connector object for the template;

export const connectText = function (template, properties) {

  return {
    "data-el-text": {
      ...connectionBoilerplate(
        0,
        ["title"],
        "{{title}}",
        "${this.title}",
        0
      ),
      ...connectionBoilerplate(
        1,
        ["obj.description"],
        "{{obj.description}}",
        "${this.obj.description}",
        0
      ),
      ...connectionBoilerplate(
        2,
        ["items.0.name"],
        "{{items[0].name}",
        "${this.items[0].name}",
        0
      ),
      ...connectionBoilerplate(
        3,
        ["counter"],
        "{{counter}",
        "${this.counter}",
        1
      ),
    },
  };
};
/*
return {
  "data-el-text": {
    0: {
      id: Symbol("text connection"),
      props: ["title"],
      attribute: "textContent",
      value: "{{title}}",
      expression: "${this.title}",
      childNode: 0,
      setup: function (instance, element) {
        if (!instance.__connections__.hasOwnProperty(this.id)) {
          instance.__connections__[this.id] = this.id;
          this.connect(instance, element);
        }
      },
      connect: function (instance, element) {
        const node = [...element.childNodes][this.childNode];
        const fn = Function("return `" + this.expression + "`");
        const attribute = this.attribute;
        const expression = this.expression;
        const callback = function (value) {
          try {
            const output = fn.call(instance);
            node[attribute] = output;
          } catch (ex) {
            console.warn(ex);
          }
          // node.setAttribute(attribute, output);
        };

        for (let prop of this.props) {
          instance.__subscriptions__.push(instance.connect(prop, callback));
          // console.log({ instance, prop, callback });
        }

        callback();
      },
      unsubscribe: [],
    },
    1: {
      id: Symbol("text connection"),
      props: ["obj.description"],
      attribute: "textContent",
      value: "{{obj.description}}",
      expression: "${this.obj.description}",
      childNode: 0,
      setup: function (instance, element) {
        if (!instance.__connections__.hasOwnProperty(this.id)) {
          instance.__connections__[this.id] = this.id;
          this.connect(instance, element);
        }
      },
      connect: function (instance, element) {
        const node = [...element.childNodes][this.childNode];
        const fn = Function("return `" + this.expression + "`");
        const attribute = this.attribute;
        const expression = this.expression;
        const callback = function (value) {
          try {
            const output = fn.call(instance);
            node[attribute] = output;
          } catch (ex) {
            console.warn(ex);
          }
          // node.setAttribute(attribute, output);
        };

        for (let prop of this.props) {
          instance.__subscriptions__.push(instance.connect(prop, callback));
          // console.log({ instance, prop, callback });
        }

        callback();
      },
      unsubscribe: [],
    },
    2: {
      id: Symbol("text connection"),
      props: ["items.0.name"],
      attribute: "textContent",
      value: "{{items[0].name}}",
      expression: "${this.items[0].name}",
      childNode: 0,
      setup: function (instance, element) {
        if (!instance.__connections__.hasOwnProperty(this.id)) {
          instance.__connections__[this.id] = this.id;
          this.connect(instance, element);
        }
      },
      connect: function (instance, element) {
        const node = [...element.childNodes][this.childNode];
        const fn = Function("return `" + this.expression + "`");
        const attribute = this.attribute;
        const expression = this.expression;
        const callback = function (value) {
          try {
            const output = fn.call(instance);
            node[attribute] = output;
          } catch (ex) {
            console.warn(ex);
          }
          // node.setAttribute(attribute, output);
        };

        for (let prop of this.props) {
          instance.__subscriptions__.push(instance.connect(prop, callback));
          // console.log({ instance, prop, callback });
        }

        callback();
      },
      unsubscribe: [],
    },
    3: {
      id: Symbol("text connection"),
      props: ["counter"],
      attribute: "textContent",
      value: "{{counter}}",
      expression: "${this.counter}",
      childNode: 1,
      setup: function (instance, element) {
        if (!instance.__connections__.hasOwnProperty(this.id)) {
          instance.__connections__[this.id] = this.id;
          this.connect(instance, element);
        }
      },
      connect: function (instance, element) {
        const node = [...element.childNodes][this.childNode];
        const fn = Function("return `" + this.expression + "`");
        const attribute = this.attribute;
        const expression = this.expression;
        const callback = function (value) {
          try {
            const output = fn.call(instance);
            node[attribute] = output;
          } catch (ex) {
            console.warn(ex);
          }
          // node.setAttribute(attribute, output);
        };

        for (let prop of this.props) {
          instance.__subscriptions__.push(instance.connect(prop, callback));
          // console.log({ instance, prop, callback });
        }

        callback();
      },
      unsubscribe: [],
    },
    
  },
};
*/
