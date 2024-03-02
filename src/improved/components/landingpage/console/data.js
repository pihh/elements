function magic(input) {
  input = input.replace(/&/g, "&amp;");
  input = input.replace(/</g, "&lt;");
  input = input.replace(/>/g, "&gt;");
  return input;
}
export const DATA = {
  forLoop: [
    {
      idx: 0,
      title: "index.js",
      selected: false,
      language: "javascript",
      content: `import Component from 'pihh';
import template from './template.html?raw';
    
class TheComponent {
    items: [
        {
            title: "The title", 
            description: "The description", 
            src:"https://github.com/pihh" 
        }
    ]
}
Component(TheComponent,{
    selector:"the-component",
    template: template
})
`,
    },
    {
      idx: 1,
      selected: true,
      title: "template.html",
      language: "html",
      content: magic(`@for(let item of items){
<div class="card">
    <div class="card-thumbnail">
        <img src="{{item.src}} />
    </div>
    <div class="card-footer">
        <h4>{{item.title}}</h4>
        <p>{{item.description}}</p>
    </div>
</div>
}`),
    },
  ],
  dataBinding: [
    {
      idx: 0,
      title: "index.js",
      selected: false,
      language: "javascript",
      content: `import Component from 'pihh';
import template from './template.html?raw';
          
class TheComponent {
    title= "The component title";
    color= "white";
    colors= ["white", "black"];
}
Component(TheComponent,{
    selector:"the-component",
    template: template
})`,
    },
    {
      idx: 1,
      selected: true,
      title: "template.html",
      language: "html",
      content: magic(`<section>
      <input type="text" name="title" *value="title" />
      <select *value="color">
        @for(let _color of colors){
          <option value="{{_color}}>{{_color}}</option>
        }
      </select>
    </section>`),
    },
  ],
};
