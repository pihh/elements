import { ElLayout } from "./src/components/layout";
import { ElComponent, Component } from "./src/elements/component";

@Component({
  selector: "el-web-component",
})
class MyWebComponent extends ElComponent {
  static selector = "el-web-component";
  constructor() {
    super();
  }
  checked = true;
  checkedd = true;

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
      name: "item 1",
    },
    {
      name: "item 2",
    },
  ];


  cards = [
 
    { title: "Card 1 ", expanded:false, description: "Card 1 description", list: ["list 1"] },
    {
      title: "Card 2 ",expanded:true,
      description: "Card 2 description",
      list: ["list 1", "list 2"],
    },
    { title: "Card 3 ",expanded:true, description: "Card 3 description", list: [] },
  ];

  onToggleChecked(){
    this.scope.checked = !this.scope.checked;
  }
  onToggleCheckedV2(){
    this.scope.checkedd = !this.scope.checkedd;
  }

  onToggleCard(cardIndex) {
    console.log(cardIndex)
    this.cards[cardIndex].expanded = !this.cards[cardIndex].expanded;
  }
  onPush(cardIndex) {
    this.cards[cardIndex].list.push(
      "list " + this.cards[cardIndex].list.length
    );
  }
  onPop(cardIndex) {
    this.cards[cardIndex].list.pop();
  }
  onPushItem() {
    this.items.push(
      "item " + this.items.length
    );
  }
  onPopItem() {
    this.items.pop();
  }
}
