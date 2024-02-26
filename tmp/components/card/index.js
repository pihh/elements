import "./style.css";
import { Component, ElComponent } from "../../elements/component";
import { ElCardExpanded } from "./card-expand"; 
import { ElBtn } from "../btn";  
import { ElInput } from "../input"; 

 
import Template from "./template.html";
 
@Component({ 
  selector: "el-card",
  template: Template,
})
export class ElCard extends ElComponent {
  static selector = "el-card"; 
  constructor() {
    super(); 
    
  }
 
  checked = true;
  checkedd = true;

  num = 10;

  listNumbers = [10, 20, 40];
 
  text = "text property";
  object = {
    key: "object value",
    title: "Title",
  };
  list = ["list id: 0"];
  objectList = [
    {
      item: "object list item id: 0",
    },
  ];
  color = "yellow"; 
  colors = ["green", "red", "yellow"];
  items = [
    {
      name: "item 0",
    },
    {
      name: "item 1",
    },
  ];
  card = {
    id: 1,
    title: "Card 1 ",
    expanded: false,
    description: "Card 1 description",
    list: ["list 0"],
  };

  
  onToggleChecked() {  
    this.scope.checked = !this.scope.checked;
  }
  onToggleCheckedV2() {
    this.scope.checkedd = !this.scope.checkedd;
  }
    
  onToggleCard() {  
    this.card.expanded = !this.card.expanded;
  }  
  onPush(cardIndex, card, text, num) { 
    console.log('xxx')
    // console.log({
    //   card,
    //   text,
    //   num,
    //   cardList: this.cards[cardIndex].list,
    //   cardIndex,
    // });
    // this.cards[cardIndex].list.push(
    //   "list " + this.cards[cardIndex].list.length
    // );
    // console.log(card.list.length + num + card.id ,{a:card.list.length,b:num,c:card.id});
  }
  onPop(cardIndex) {
    // this.cards[cardIndex].list.pop();
  }
  onPushItem() {
    // this.items.push({ name: "item " + this.items.length });
  }
  onPopItem() {
    console.log(this.items, this.items.length);
    this.items.pop();
  }

  onClickWithData(color, colors) {
    console.log({ color, colors }, ...arguments);
  }
}
