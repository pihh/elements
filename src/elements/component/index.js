//  import { RequirementsComponent } from "./src/components/requirements";

// import { addGlobalStylesToShadowRoot } from "../compiler/styles/global-styles";
import { Registry } from "../kernel/registry";
import { connectTemplateReactivity } from "../reactivity/template/connection";
import { mapTemplate } from "./connection/map";
import { connectScope } from "./connection/scope";
import { connectTemplate } from "./connection/template";

// import { Registry } from "./src/elements/kernel/registry";
// import { State } from "./src/elements/compiler/state";
// import { connectTemplate } from "./src/elements/component/reactivity/connector";
// import { reactivityMap } from "./src/elements/component/template/analyser/map";
// import { addGlobalStylesToShadowRoot } from "./src/elements/component/template/styles";



export class ElComponent extends HTMLElement {
  constructor() {
    super(...arguments);
 
    this.__init();
  }

  __init(){
     const {setup,configuration,callback} = Registry.componentSetup(this);
  }
 

  async __hidrate() {

    connectScope(this)
    await connectTemplate(this);
  await    mapTemplate(this);
    await connectTemplateReactivity(this);

  }

  async __initialConnection(){
    if (!this.__setup.didConnect) {
        this.__setup.didConnect = true;
        await this.__hidrate()
        // this.connectScope();
        // await this.connectTemplate();
        this.operations.onDidConnect(this)
      }
  }
  async connectedCallback() {
    
    
    this.__initialConnection()
    this.render();
    
  }

  attributeChangedCallback(name, oldValue, newValue) {
    console.log("attributeChangedCallback", name, oldValue, newValue);

  }

  render() {
  }

  fn($event,$index,text,str,num){
    console.log('FN CALLED',{$event,$index,text,str,num})
  }

  addColor(){

    this.colors.push('new-color')
  }

  customFn(){
    console.log('Custom FN CALLED')
  }
}

//customElements.define("my-button", MyWebComponent);
