const Boilerplate = {
  id: Symbol("operation connection"),
  props: [],
  value: "",
  expression: "",
  type: "for",
  childTemplates: [],
  configurations: {},
  setup: function (instance, element) {
    // if (!instance.__connections__.hasOwnProperty(this.id)) {
    //   instance.__connections__[this.id] = this.id;
    //   let eventName = this.eventName;
    //   let isNative =
    //     element[eventName?.slice(2)]?.toString()?.indexOf("[native code]") >
    //       -1 || false;
    //   if (isNative) {
    //     this.type = "native";
    //     eventName = eventName.slice(2);
    //   } else {
    //     this.type = "broadcast";
    //   }
    //   this.connect(instance, element, eventName);
    // }
  },
  connect: function (instance, element, eventName) {
    // const action = instance[this.value];
    // const args = this.args || [];
    // const callback = function (event) {
    //   console.log(extractArguments(instance, event, args));
    //   action.call(instance, ...extractArguments(instance, event, args));
    // };
    // // console.log(this.eventName, this.type,callback, element);
    // if (this.type === "native") {
    //   element.addEventListener(eventName, callback);
    // } else {
    // //     // console.log(this,element)
    // let timeout;
    // let timeoutFn = () =>
    //   setTimeout(() => {
    //     if (!element.isConnected) {
    //       clearTimeout(timeout);
    //       timeout = timeoutFn();
    //     } else {
    //       element.__addEmitListener__(this.eventName, instance, callback);
    //     }
    //   }, 10);
    // //   timeout = timeoutFn();
    // timeout = timeoutFn();
    // }
  },
  unsubscribe: [],
};
export let connectionBoilerplateOperation = function (
  id,
  props,
  value,
  expression,
  type,
  childTemplates,
  configurations
) {
  let boilerplate = {};
  let setup = Object.assign({}, Boilerplate);
  setup.id = Symbol(type + " operation connection");
  setup.props = props;
  setup.value = value;
  setup.expression = expression;
  setup.type = type;
  setup.childTemplates = childTemplates;
  setup.configurations = configurations;
  boilerplate[id] = setup;
  return boilerplate;
};
/*
  id: "for connection",
        type: "for",
        props: [],
        map: {
          self: { index: "$index", origin: "colors", replacement: "_color" },
        },
        value: "@for(let _color of colors)",
        expression: "let _color of this.colors; let $index = index",
        template: `
                            <option value="{{this.colors[$index]}}">{{this.colors[$index]}}</option>
                        `,
        setup: function (instance, element) {},
        connect() {},
  boilerplate[id] = setup;
  return boilerplate;
  */
// };

export const connectOperations = function () {
  return {
    "data-el-operation": {
      0: {
        id: "for connection",
        type: "for",
        props: [],
        map: {
          self: { index: "$index", origin: "colors", replacement: "_color" },
        },
        value: "@for(let _color of colors)",
        expression: "let _color of this.colors; let $index = index",
        template: `
                            <option value="{{this.colors[$index]}}">{{this.colors[$index]}}</option>
                        `,
        setup: function (instance, element) {},
        connect() {},
      },
      1: {
        template: `@for(let item of items;let $index = index){
                            <li onclick={onClickItem($index)}>
                            {{item.name}}
                        </li>`,
      },
    },
  };
};
