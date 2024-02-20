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



               