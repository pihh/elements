import { Component } from "../../elements/component";

export class InputComponent extends Component {
  static config = {
    selector: "el-input",
    template: `
    <div >
    <p>{{this.model ? this.model : 'Nothing to show here' }}</p>
    <input class="input" [model]="this.model" />
    
    </div>`,
    styles: ` 
    .example-section-container { 
      padding: 1rem;
      border-radius: 0.75rem;
      border-width: 1px;
      max-width: 680px; 
      margin: 1em auto;
    } 
    .conditional-container{
      padding: 0.5em 1em;
      border-radius: 0.75rem;
      border-width: 1px;
    }
    .input{
      width: -webkit-fill-available
    }
    `,
  };

  constructor() {
    super();
  }
 
  props={
    model: "Default model"
  }
}

InputComponent.register(InputComponent);
