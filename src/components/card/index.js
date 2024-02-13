
@Component({
    selector: "my-card",
})
export class CardComponent extends Component {

    title = "Card title";
    description = "Card description"
    src = "/images/shoe.png"
    items = [
        "item 1",
        "item 2",
    ]
    constructor() {}

    onClick($event){
        console.log($event);
    }

}