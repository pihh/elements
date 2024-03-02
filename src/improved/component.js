/**
 * Not compiled
 */
export class WebComponent {
  constructor() {}

  connectedCallback() {
    if (super.connectedCallback) super.connectedCallback();
    console.log("connected callback");
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (super.attributeChangedCallback)
      super.attributeChangedCallback(name, oldValue, newValue);
    console.log("attribute changed callback", {
      name: name,
      oldValue,
      newValue,
    });
  }

  isShowing = false;
  textSize = "xl";
  color = "yellow";
  colors = ["yellow", "red", "green"];
  title = "Web Component title";
  obj = [{name:"xxx"}]
  description =
    "Description Lorem ipsum dolor sit amet con et eu fugiat nulla pariatur n";
  counter = { value: 0 };
  
  add() {
    this.counter.value++
  }
  
  toggleShowing($event, text, title, num, bool) {
    console.log($event, this.isShowing, { text, title, num, bool });
    this.isShowing = !this.isShowing;
  }
  pushColor(){
    this.colors.push(Math.random()*255);
    console.log(this.colors,'push',this.colors.length)
    this.colors = [...this.colors]
  }
  popColor(){
    this.colors.pop();
    // this.colors = [...this.colors]
    console.log(this.colors,'pop',this.colors.length)
  }
}


export class CustomElement {
  constructor() {}

  hidden= false
  colors = ["purple", "red","orange","slate", "green"];
  color = "purple";
  newTitle = "The new title";
  title ="Custom Element"
  
  onClickAlert() {
  alert('hey')
  }
  onToggleHidden(){
    this.hidden = !this.hidden
  }  

}
