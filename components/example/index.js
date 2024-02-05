import { Component } from "../component";

export class ExampleComponent extends Component {
  static config = {
    selector: "my-example",
    template: `
    <div
    class="bg-{{this.color}}-100 mb-4 p-4 rounded-lg mt-4  mx-auto"
    style="max-width: 36em"
  >
    <div *if="this.isOpen">
      <h1>It's open!!</h1>
    </div>
    <button (click)="this.onToggle()" class="btn">toggle</button>
    <div class="example">Example {{this.counter}}</div>
    <div class="example">
      <button class="btn" (click)="increment">+</button>
      <button class="btn" (click)="decrement">-</button>
    </div>
  
    <div class="form-control">
      <label for="text">Text {{this.text}}</label>
      <input class="input" type="text" [model]="this.text" name="text" />
    </div>
  
    <div class="form-control"> 
      <label for="text">Options [0] {{this.options[0]}}</label>
      <input class="input" type="text" [model]="this.options[0]" name="text" />
    </div>
    <div class="form-control">
      <label for="color"><b>Options [{{this.options.length}}]:</b> Color {{this.color}} </label>
      <select class="input" [model]="this.color" name="color">
        <option value="{{option}}" *for="option of this.options">
          {{option}}
        </option>
      </select>
    </div>
    <div class="form-control">
    <div class="nested-div-level-1"></div>
      <label for="color"><b>Deep Options  {{this.deepOptions.length}} :</b> {{this.color}} <div class="nested-div-level-2"></div></label>
      <select class="input" [model]="this.color" name="color">
        <option value="{{option.title}}" *for="option of this.deepOptions">
          {{option.title}} - Deep option title
        </option>
      </select>
      <label for="color"><b>Deep Options[0] Options [{{this.deepOptions[0].options.length}}]:</b> {{this.color}} <div class="nested-div-level-2"></div></label>
    
      <select class="input" [model]="this.deepTest" name="color">
        <option value="{{option}}" *for="option of this.deepOptions[0].options">
          {{option}}
        </option>
      </select>
    </div>
    <div class="form-control">
      <label for="check">Check {{this.isOpen}} </label>
      <input
        type="checkbox"
        [model]="this.isOpen"
        name="check"
        class="checkbox"
        checked="{{this.isOpen}}"
      />
      <input type="checkbox" [model]="this.isOpen" name="check" />
    </div>
    <div class="form-control">
      <label for="check">Check {{this.isSwitchOn}} </label>
      <input
        type="checkbox"
        [model]="this.isSwitchOn"
        name="check"
        class="toggle"
 
      />
    </div>

  </div>
  
    `,
    styles: ".example{color:red}",
  };

  /*
      <section *for="post of this.posts">
      <b> {{post.id}} - {{post.title}}</b>
      <article *for="photo of post.photos">
        
      </article>
    </section>
    */
  props = {
    counter: 0,
    isOpen: false,
    text: "text input",
    isOpen: false,
    isSwitchOn: true,
    color: "green",
    options: [
      "red",
      "white",
      "green",
      "blue",
      "indigo",
      "purple",
      "yellow",
      "orange",
    ],
    deepOptions: [
      { id: 0, title: "red", options: [1, 2] },
      { id: 1, title: "white", options: [1, 2] },
    ],
    posts: [{id:1,title:"post 1", photos:[{id:11,title:"photo 1",comments:[{id:1,user:'xxx',comment:"xxx"} ]}]}],
    deepTest: 1,
  };

  counter = 0;
  isOpen = false;
  text = "text input";
  isOpen = false;
  isSwitchOn = true;
  color = "green";
  options = [
    "red",
    "white",
    "green",
    "blue",
    "indigo",
    "purple",
    "yellow",
    "orange",
  ];
  deepOptions = [
    { id: 0, title: "red", options: [1, 2] },
    { id: 1, title: "white", options: [1, 2] },
  ];
  posts = [{id:1,title:"post 1", photos:[{id:11,title:"photo 1",comments:[{id:1,user:'xxx',comment:"xxx"} ]}]}];
  deepTest = 1;
  constructor() {
    super();
  }

  increment() {
    this.counter++;
  }

  decrement() {
    this.counter--;
  }

  onToggle() {
    this.isOpen = !this.isOpen;
  }

  addDeepOption() {
    let id = this.props.deepOptions.length;
    let option = {
      id: id,
      title: this.props.options[id],
      options: [1, 2, 3],
    };
    this.props.deepOptions.push(option);
  }
  removeDeepOption() {
    this.props.options.pop();
    this.props.deepOptions.pop();
  }
}

ExampleComponent.register(ExampleComponent.config.selector);
