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


var aggregation = (BaseClass,...mixins)=>{
    class base extends BaseClass {
        constructor(...args){
            super(...args);
            mixins.forEach(mixin => {
                copyProps(this,(new mixin))
            })
        }
    }
    let copyProps = (target,source) => {
        Object.getOwnPropertyNames(source)
        .concat(Object.getOwnPropertySymbols(source))
        .forEach(prop =>{
            if(!prop.match(/^(?:constructor|prototype|arguments|caller|name|bind|call|apply|toString|length)$/)) Object.defineProperty(target,prop,Object.getOwnPropertyDescriptor(source,prop))
        })
    }

    mixins.forEach(mixin => {copyProps(base.prototype,mixin.prototype); copyProps(base,mixin)})
    return base 
}
               