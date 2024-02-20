import { connectionBoilerplateAction } from "../connect/action";

const actions = {
  search: {
    start: "={",
    end: "}",
  },
};
const text = {
  search: {
    start: "{{",
    end: "}}",
  },
};

const operations = {
  if: {
    search: {
      start: "@if(",
      end: "}",
    },
  },
  for: {
    search: {
      start: "@for(",
      end: "}",
    },
  },
};

const methods = [
  "onClickItem",
  "addItem",
  "removeItem",
  "increment",
  "decrement",
  "onInnerTextListen",
];

let template = `<div class="component bg-{{color}}-900">
    <header>
        <h1>{{title}}</h1>
        <p>{{obj.description}}</p>
        <p>{{items[0].name}}</p>
    </header>
    <main>
        <select model="color" class="input">
            @for(let _color of colors){
                <option value="_color">_color</option>
            }
        </select>
        <ul>
            @for(let item of items; let $index = index){
                <li onclick={onClickItem($event,$index)}>
                {{item.name}}
            </li>
            }
        </ul>
            <the-inner text="{{text}} @propagate={onInnerTextListen} />
    </main>
    <footer>
            <section>
                <h5>Update items</h5>
                <div class="">
                    <button class="btn" onclick={(event)=>{duplicate(event)}}>x2</button>
                    <button class="btn" onclick={addItem}>+</button>
                    <button class="btn" onclick={removeItem}>-</button>
                </div>
            </section>
            <section>
            <h5>Update counter</h5>
            <div class="">
                <button class="btn" onclick={increment($event,counter,'string',2,false)}>+</button>
                <button class="btn" onclick={decrement}>-</button>
            </div>
        </section>
    </footer>
</div>`;



let extractActionArguments = function (expression) {
  let action;
  if (expression.indexOf("=>{") > -1) {
    action = expression.split("=>{")[1];
    action = action.trim();
  }else{
    action = expression;
  }
  let args = action.split("(");
  action = args[0].trim();
  if (args.length > 1) {
    args = args[1]
      .replaceAll(")","")
      .split(",")
      .map((el) => el.trim()).filter(el => el.length > 0);
  }else{
    args = [];
  }
  return {parsedAction: action,parsedArgs: args}

};

let actionIndex = 0;
let idx = template.indexOf(actions.search.start);

let actionConnections = {
  "data-el-action": {},
};

while (idx > -1) {
  let left = template.split(actions.search.start)[0].trim().split(" ");
  let right = template.split(actions.search.start).slice(1);
  let action = left[left.length - 1].trim();
  let selector = 'data-el-action="' + actionIndex + '"';
  right = right.join(actions.search.start);
  left.pop();
  left = left.join(" ") + " " + selector + " ";
  let match = {
    id: actionIndex,
    selector: selector,
    eventName: action,
  };
  actionIndex++;
  let stack = 1;
  for (let i = 0; i < right.length; i++) {
    let char = right.charAt(i);
    if (char === "}") {
      stack--;
    } else if (char === "{") {
      stack++;
    }
    if (stack === 0) {
      match.value = right.slice(0, i);
      match.expression = right.slice(0, i);
      right = right.slice(i + 1);
      template = left + right;
      idx = template.indexOf(actions.search.start);
      let {parsedAction,parsedArgs} =extractActionArguments(match.expression)
      actionConnections["data-el-action"] = {
        ...actionConnections["data-el-action"],
        ...connectionBoilerplateAction(
          match.id,
          [],
          match.value,
          parsedAction,
          match.eventName,
          parsedArgs
        ),
      };
      
      break;
    }
  }
}
console.log({ template, actionConnections });