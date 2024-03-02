import { HTMLToJSON } from "html-to-json-parser"; // ES6

/*
const element =
  '<div><ul> @for(let item of items;let index = $index){ <li onClick={onClick}>Hello <strong>World</strong><input *bind="name"></li> } </ul></div>'; // HTML string

  function htmlToJson(div, obj) {
  if (!obj) {
    obj = [];
  }
  var tag = {};
  tag["tagName"] = div.tagName;
  tag["children"] = [];
  for (var i = 0; i < div.children.length; i++) {
    tag["children"].push(htmlToJson(div.children[i]));
  }
  for (var i = 0; i < div.attributes.length; i++) {
    var attr = div.attributes[i];
    tag[attr.name] = attr.value;
  }
  return tag;
}

function add(object,text){
  const span = document.createElement('span');
  span.innerText = text;
  object.appendChild(span);
}
function bind(object, key, value) {

  add(object,`Bind: ${key} => ${value} `);
}
function addEvent(object, key, value) {

  add(object,`Event: ${key} => ${value} `);
}
function parse(object, key, value) {

  add(object,`Parse: ${key} => ${value} `);
}

function jsonToHtml(json, obj) {
  var fns = [];
  function _jsonToHtml(_json, _obj) {
    let tagname = _json.tagName;
    let attributes = Object.keys(_json).filter(
      (attribute) => ["children", "tagName"].indexOf(attribute) ==-1
    );

    if (tagname === "BODY") {
      _obj =document.createDocumentFragment();
    }else{
      _obj = document.createElement(tagname); 

    }
      

    for (let attribute of attributes) {
      let value = _json[attribute];
      console.log(attribute, value);
      if (attribute.indexOf("*") > -1) {
        fns.push(function(){bind(_obj, attribute, value)});
      } else if (
        value.indexOf("{") == 0 &&
        value.indexOf("}") == value.length - 1
      ) {
        fns.push(function(){addEvent(_obj, attribute, value)});
      } else if (value.indexOf("{{") > -1) {
        fns.push(function(){parse(_obj, attribute, value)});
      }
    }
    _json.children.forEach((child) => {
      _obj.appendChild(_jsonToHtml(child, _obj));
    });
    return _obj;
  }

  let template = _jsonToHtml(json, obj);

  return { template, fns };
}
console.log({ htmlToJson, jsonToHtml, element });

*/

const element = `
<div>
  <header>
    <h1 data-abcde> {{name}}</h1>
    <p data-efgh> {{description}}</p>
  </header>
</div>
`
const map = {
  elements: {
    abcde:{
      keys: ['name'],
      action: replaceText,
      expression: "`${this.name}`",
    },
    efgh: {
      keys: ['description'],
      action: replaceText,
      expression: "`${this.description}`",
    }
  },
  props: {
    name: [
      {
        element: "abcde",
        action: replaceText,
        expression: "`${this.name}`",
      }
    ]
  }, description: [
    {
      element : "efgh",
      action: replaceText,
      expression: "`${this.description}`",
    }
  ]
}

const scope = {
  name: "The name",
  description: "The description",
}

export {map,element,scope};