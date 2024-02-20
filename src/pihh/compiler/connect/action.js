const extractArguments = function (instance, event, args) {
  let _args = [...args].map((arg) => {
    if (arg == "$event") {
      return event;
    } else if (arg.indexOf("this.") > -1) {
      return instance[arg.replace("this.", "")];
    } else if (!isNaN(arg)) {
      return Number(arg);
    } else if (["true", true].indexOf(arg) > -1) {
      return true;
    } else if (["false", false].indexOf(arg) > -1) {
      return false;
    } else {
      return arg;
    }
  });
  if (_args.length == 0) {
    _args.push(event);
  }
  return _args;
};
const Boilerplate = {
  id: Symbol("action connection"),
  props: [],
  args: [],
  type: "native",
  eventName: "onclick",
  value: "decrement",
  expression: "this.decrement()",
  setup: function (instance, element) {
    if (!instance.__connections__.hasOwnProperty(this.id)) {
      instance.__connections__[this.id] = this.id;
      let eventName = this.eventName;

      let isNative =
        element[eventName?.slice(2)]?.toString()?.indexOf("[native code]") >
          -1 || false;
  
      if (isNative) {
        this.type = "native";
        eventName = eventName.slice(2);
      } else {
        this.type = "broadcast";
      }

      this.connect(instance, element, eventName);
    }
  },
  connect: function (instance, element, eventName) {
    const action = instance[this.expression];
    const args = this.args || [];

    let self = this;
    const callback = function (event) {
      console.log(self,action,instance)
      //   console.log(extractArguments(instance, event, args));
      action.call(instance, ...extractArguments(instance, event, args));
    };
    // console.log(this.eventName, this.type,callback, element);
    if (this.type === "native") {
      
      element.addEventListener(eventName, callback);
    } else {
      //     // console.log(this,element)

      let timeout;
      let timeoutFn = () =>
        setTimeout(() => {
          if (!element.isConnected) {
            clearTimeout(timeout);
            timeout = timeoutFn();
          } else {
        
            element.__addEmitListener__(this.eventName, instance, callback);
          }
        }, 10);
      //   timeout = timeoutFn();

      timeout = timeoutFn();
    }
  },
  unsubscribe: [],
};
export let connectionBoilerplateAction = function (
  id,
  props,
  value,
  expression,
  eventName,
  args
) {
  let boilerplate = {};
  let setup = Object.assign({}, Boilerplate);
  setup.id = Symbol("action connection");
  setup.props = props;
  setup.value = value;
  setup.expression = expression;
  setup.eventName = eventName;
  setup.args = args;
  if (eventName === "propagate") {
    setup.type = "broadcast";
  }
  boilerplate[id] = setup;
  return boilerplate;
};

// Picks up the template, replaces the text entries with data-el-text attributes ;
// Creates the connector object for the template;

export const connectAction = function (template, properties) {
  return {
    "data-el-action": {
      ...connectionBoilerplateAction(
        0,
        [],
        "(event)=>{duplicate(event)}}",
        "(event)=>{this.duplicate(event)}}",
        "onclick",
        ["$event"]
      ),
      ...connectionBoilerplateAction(
        1,
        [],

        "addItem",
        "this.addItem()",
        "onclick",
        []
      ),
      ...connectionBoilerplateAction(
        2,
        [],

        "increment",
        "this.increment($event, this.counter, 'string', 2, false)",
        "onclick",
        ["$event", "this.counter", "string", "2", "false"]
      ),
      ...connectionBoilerplateAction(
        3,
        [],
        "decrement",
        "this.decrement()",
        "onclick",
        []
      ),
      ...connectionBoilerplateAction(
        4,
        [],
        "onInnerTextListen",
        "this.onInnerTextListen()",
        "propagate",
        []
      ),
    },
  };
};

/*
"data-el-action": {
    0: {
      id: Symbol("action connection"),
      props: [],
      type: "native",
      eventName: "click",
      value: "(event)=>{duplicate(event))}",
      expression: "(event)=>{this.duplicate(event))}",
      args: [],
      setup: function (instance, element) {
        if (!instance.__connections__.hasOwnProperty(this.id)) {
          instance.__connections__[this.id] = this.id;
          this.connect(instance, element);
        }
      },
      connect: function (instance, element) {
        /*
              const fn = Function("return `" + this.expression + "`");
              const callback = function (event) {
                fn.call(instance, event);
              };
              element.addEventListener(this.eventName, callback);
              *
      },
      unsubscribe: [],
    },
    1: {
      id: Symbol("action connection"),
      props: [],
      eventName: "click",
      value: "addItem",
      expression: "this.addItem()",
      args: [],
      type: "native",
      setup: function (instance, element) {
        if (!instance.__connections__.hasOwnProperty(this.id)) {
          instance.__connections__[this.id] = this.id;
          this.connect(instance, element);
        }
      },
      connect: function (instance, element) {
        const fn = Function("return `" + this.expression + "`");
        const action = instance[this.value];
        const callback = function (event) {
          action.call(instance, event);
        };
        element.addEventListener(this.eventName, callback);
      },
      unsubscribe: [],
    },
    2: {
      id: Symbol("action connection"),
      props: [],
      args: ["$event", "this.counter", "string", "2", "false"],
      eventName: "click",
      value: "increment",
      expression: "this.increment()",
      type: "native",
      setup: function (instance, element) {
        if (!instance.__connections__.hasOwnProperty(this.id)) {
          instance.__connections__[this.id] = this.id;
          this.connect(instance, element);
        }
      },
      connect: function (instance, element) {
        const action = instance[this.value];
        let args = this.args;
        const callback = function (event) {
          let _args = [...args].map((arg) => {
            if (arg == "$event") {
              return event;
            } else if (arg.indexOf("this.") > -1) {
              return instance[arg.replace("this.", "")];
            } else if (!isNaN(arg)) {
              return Number(arg);
            } else if (["true", true].indexOf(arg) > -1) {
              return true;
            } else if (["false", false].indexOf(arg) > -1) {
              return false;
            } else {
              return arg;
            }
          });
          if (_args.length == 0) {
            _args.push(event);
          }

          action.call(instance, ..._args);
        };
        element.addEventListener(this.eventName, callback);
      },
      unsubscribe: [],
    },
    3: {
      id: Symbol("action connection"),
      props: [],
      type: "native",
      eventName: "click",
      value: "decrement",
      expression: "this.decrement()",

      setup: function (instance, element) {
        if (!instance.__connections__.hasOwnProperty(this.id)) {
          instance.__connections__[this.id] = this.id;
          this.connect(instance, element);
        }
      },
      connect: function (instance, element) {
        const action = instance[this.value];
        const callback = function (event) {
          action.call(instance, event);
        };
        element.addEventListener(this.eventName, callback);
      },
      unsubscribe: [],
    },
    4: {
      id: Symbol("action connection"),
      props: [],
      type: "broadcast",
      eventName: "propagate",
      value: "onInnerTextListen",
      expression: "this.onInnerTextListen()",
      args: ["$event"],
      setup: function (instance, element) {
        if (!instance.__connections__.hasOwnProperty(this.id)) {
          instance.__connections__[this.id] = this.id;
          this.connect(instance, element);
        }
      },
      connect: function (instance, element) {
        const action = instance[this.value];
        const callback = function (event) {
          // console.log('here')
          action.call(instance, event);
        };

        console.log({ instance, element });
        element.__addEmitListener__(this.eventName, instance, callback);
      },
      unsubscribe: [],
    },
  },
  */
