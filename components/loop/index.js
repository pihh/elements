import { Component } from "../component";
import { data } from "./data";

export class LoopComponent extends Component {
  static config = {
    selector: "my-loop",
    template: `
    <div
    class="{{this.theme}} mb-4 p-4 rounded-lg mt-4  mx-auto border border-{{this.theme =='light' ? 'gray' : 'black'}}-400"
    style="max-width: 36em"
    >
    <button (click)="add()" class="btn">Add</button>
    <section>
    <ul>
      <li *for="level of this.levels" class=" {{  level.title  }}" >
        level {{level.title}}  
        <input class="input" [model]="level.title" />
      
        <ul>
          <li *for="sublevel of level.sublevels">
            Sublevel {{sublevel.title}}
            <button (click)="addSublevel()" class="btn">+</button>
            <button (click)="removeSublevel()" class="btn">-</button>
            <ul>
              <li *for="_level of sublevel.levels">
                _Level {{_level.title}}
                <input class="input" [model]="_level.title" />
              </li>
            </ul>
          </li>
        </ul>
      </li>
    </ul>
    </section>
    <section>
    <h1>Change the theme</h1>
    <p>Current theme: {{this.theme}}</p>
    <select [model]="theme" class="input w-full input-bordered">
      <option value="{{_theme}}" *for="_theme of this.themes">
        {{_theme}}
      </option>
    </select>
    </section>
    <section
    class="color-section bg-{{this.color == 'white' ? 'white' : this.color+'-200'}} mb-4 p-4 rounded-lg mt-4  mx-auto border border-{{this.color =='white' ? 'gray' : this.color}}-400"
    style="max-width: 36em"
    >
    <h1>Change this colors</h1>
    <p>Current color: {{this.color}}</p>
    <select
      [model]="color"
      class="input w-full input-bordered bg-{{this.color == 'white' ? 'white' : this.color+'-100'}}"
    >
      <option value="{{_color}}" *for="_color of this.colors">
        {{_color}}
      </option>
    </select>
    </section>
    <section>
      <h1>Nested Loops</h1>
      <p>Posts: {{this.posts.length}}</p>
      <article *for="post of this.posts">
        <header>
          <b>#{{post.id}} {{post.title}}</b>
        </header>
        <main>
          <p>{{post.content}}</p>
          
          <div class="grid  gap-4">
            <div class="grid gap-4 grid-cols-3" >
              <div *for="photo of post.photos">
                <img
                  class="h-auto max-w-full rounded-lg"
                  src="{{photo.url}}"
                  alt=""
                />
                
              </div>
            </div>
          </div>
        </main>
      </article>
    </section>
    <section>
    <h1>Loop Component</h1>
    
    <pre
      class="code-block border border-{{this.theme =='light' ? 'gray' : 'black'}}-200"
    >
    {{JSON.stringify(this.posts, true,' ')}}</pre
    >
    </section>
    
    </div>
  
    `,
    styles: `
    .dark, .dark *:not(.color-section , .color-section *){
        color: #FFFFFF !important;
        background-color: rgb(15 23 42);
        
    }
    
    pre.code-block {
        scrollbar-color: transparent;
        background-color: hsl(0,0%,96.5%);
        border-radius: 6px;
        color: black;
        font-size: 13px;
        line-height: calc( ( 13 + 4 ) / 13)px;
        margin: 0;
        overflow: auto;
        padding: 12px;
        margin-top: 1rem;
    } 
    
    .dark pre.code-block{
        color: greenyellow !important;
        background-color: rgb(30 41 59);
    }

    `,
  };


  props = data

  color =  data.color 
  theme =  data.theme 
  colors = data.colors 
  themes = data.themes 
  posts =  data.posts 
  levels = data.levels 
  constructor() {
    super();
    console.log('add',this)
  }

  add(){
    this.levels.push({title:this.levels.length,sublevels:[]})
    // this.levels[0].sublevels[0].levels.push({title:"xxx"})
    // this.levels[0].sublevels.push({title:"xxx",levels:[]})
  }

  addSublevel(sublevel){
    console.log(this,sublevel)
    this.levels[0].sublevels[0].levels.push({title:"xxx"})
  }
  removeSublevel(){
    console.log(this)
    this.levels[0].sublevels[0].levels.pop()
  }
}

LoopComponent.register(LoopComponent);
