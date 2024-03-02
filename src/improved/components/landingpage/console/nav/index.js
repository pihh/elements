import { Compile } from "../../../../lib";

import template from "./template.html?raw";

class TheConsoleNav {
  constructor() {
    console.log(this)
  }

  tabs = [];

  onChangeTab(tab) {
    this.broadcast("onChangeTab", tab);
  }
 
  connectedCallback(){
    console.log(this);
  }
  attributeChangedCallback(name,oldValue,newValue) {
    if(name ==="tabs" && oldValue !== newValue){
     
      for(let value of [oldValue,newValue]){
        try{
          //value = value || [];
          if(value){
            console.log(value)
            if(typeof value == "object"){
              
              // this.tabs = JSON.parse(JSON.stringify(value))
            }else if(typeof value == "string"){
              //this.tabs = JSON.parse(value) || []
              
            }
          }else{
            this.tabs = [];
          }
          console.log(this)
        }catch(ex){
          
        }
      }
    }
    // console.log(this,this.tabs,name,oldValue,newValue);
  }
}

Compile(TheConsoleNav, {
  selector: "the-console-nav",
  template: template,
});
