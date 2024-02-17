
import { ElComponent, Component } from "../../elements/component";
import Template from "./template.html";
@Component({
  selector: "el-demo",
  template: Template
})
export class ElDemo extends ElComponent {
  static selector = "el-demo";
  constructor() {
    super();

  }
  checked = true;
  checkedd = true;

  num = 10;

  listNumbers = [10,20,40]

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


  cards = [
    {
      id:1,
      title: "Card 1 ",
      expanded: false,
      description: "Card 1 description",
      list: ["list 0"],
    },
    {
      id:2,
      title: "Card 2 ",
      expanded: true,
      description: "Card 2 description",
      list: ["list 0", "list 1"],
    },
    {
      id:3,
      title: "Card 3 ",
      expanded: true,
      description: "Card 3 description",
      list: [],
    },
  ];

  onToggleChecked() {
    this.scope.checked = !this.scope.checked;
  }
  onToggleCheckedV2() {
    this.scope.checkedd = !this.scope.checkedd;
  }

  onToggleCard(cardIndex) {
    this.cards[cardIndex].expanded = !this.cards[cardIndex].expanded;
  }
  onPush(cardIndex, card, text, num) {
    console.log({
      card,
      text,
      num,
      cardList: this.cards[cardIndex].list,
      cardIndex,
    });
    this.cards[cardIndex].list.push(
      "list " + this.cards[cardIndex].list.length
    );
    console.log(card.list.length + num + card.id ,{a:card.list.length,b:num,c:card.id});
  }
  onPop(cardIndex) {
    this.cards[cardIndex].list.pop();
  }
  onPushItem() {
    this.items.push({ name: "item " + this.items.length });
  }
  onPopItem() {
    console.log(this.items, this.items.length);
    this.items.pop();
  }

  onClickWithData(color, colors) {
    console.log({ color, colors }, ...arguments);
  }
}
