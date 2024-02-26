


import { Component } from "../../lib/compile/component";
import { Prop } from "../../lib/compile/component/prop";

@Component({
  selector: "the-text-binding",
  template: {
    url: "/the-binding/text.html",
  },
})
export class TheTextBinding extends HTMLElement {

  constructor() {
    super();
    // debugger
  }


  @Prop() name = "Name property";
  @Prop() description = "Description property";
  @Prop() obj = {
    name: "Obj name property", 
    list: [
      "Obj list 0  property"]
    };
  @Prop() list = [
    "List 0 property"
  ]
}
@Component({
  selector: "the-checkbox-binding",
  template: {
    url: "/the-binding/checkbox.html",
  },
})
export class TheCheckboxBinding extends HTMLElement {

  constructor() {
    super();
    // debugger
  }

  
  @Prop() isChecked = false;
  @Prop()  isShowing = false;
  @Prop() isTextOne = false;

  onCheckboxClick(){
     alert('Esta não faz nada !')
   }
}



@Component({
  selector: "the-select-binding",
  template: {
    url: "/the-binding/select.html",
  },
})
export class TheSelectBinding extends HTMLElement {
  // static observedAttributes = ["color"]
  
  @Prop() color= "white";
  @Prop() colors = ["white","blue","red","green","yellow"];
  constructor() {
    super();
   
    
  }



  connectedCallback(){
    // console.log('xxx')
    // console.log(this)
 
  }
  attributeChangedCallback(name,oldValue,newValue){
    // super.attributeChangedCallback(name,oldValue,newValue);
    if(oldValue ==newValue) return;

    if(name == 'color'){
      this.updateTheme(newValue);
    }
   
  }
  updateTheme(newValue){
    const $body = document.body
    const $classList = $body.classList
    for(let color of this.colors){
      const $theme = "theme-"+color
      if($classList.contains($theme)){
        $classList.remove($theme);
      }
    
    }
    const $theme = "theme-"+newValue
    $classList.add($theme);
  }
}

