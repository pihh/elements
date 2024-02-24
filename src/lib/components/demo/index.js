
import { Component } from "../../compile/component";
import { Prop } from "../../compile/component/prop";


@Component({
  selector: "the-demo",
  template: {
    url: "/the-browser/template.html",
    // local: "/the-demo/template.html",
  },
})
export class TheDemo extends HTMLElement {
  constructor() {
    super();
  }

  @Prop() name = "Pihh";
  @Prop() description = "This is a default value for the description";
  @Prop() textBinding = "text binding";
  @Prop() isShowing = false;
  @Prop() isShowingNextLevel = false;
  @Prop() isShowingThirdLevel = false;
  @Prop() isChecked = false;
  @Prop() counter = 0;
  @Prop() item = "xxx";
  @Prop() color = "yellow";
  @Prop() url = "https://pihh.com";
  @Prop() counterUpdating = false;
  @Prop() colors = ["white", "red", "blue"];
  @Prop() onCounterUpdateTimeout = false;

  
  onCounterUpdate() {
    if (!this.counterUpdating) {
      this.counterUpdating = true;
    }
    clearTimeout(this.onCounterUpdateTimeout);
    this.onCounterUpdateTimeout = setTimeout(() => {
      this.counterUpdating = false;
    }, 1000);
  }

  incrementCounter() {
    this.counter++;
    this.onCounterUpdate();
  }
  
  onClick() {
    console.log("on Click");
    this.counter--;
  }
  
  decrementCounter() {
    this.counter--;
    this.onCounterUpdate();
  }

  toggleShowing(){
    this.isShowing = !this.isShowing;
  }
  toggleShowingNextLevel(){
    this.isShowingNextLevel = !this.isShowingNextLevel;
  }
  toggleShowingThirdLevel(){
    this.isShowingThirdLevel = !this.isShowingThirdLevel;
  }
}

