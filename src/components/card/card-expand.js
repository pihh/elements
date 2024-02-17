
import { Component, ElComponent } from "../../elements/component";
 

@Component({
  selector: "el-card-expanded",
  template: `<div>
    <figure style="display: {{expanded ? '' : 'none'}}">
        <img
            src="https://daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg"
        />
    </figure>
    <a class="card-collapser sidebar-collapser" @onClick="onToggleCard()">
        @if(expanded){
            <span> - </span>
        }@else{
            <span> + </span>
        }
    </a>  
  </div>`,
})
export class ElCardExpanded extends ElComponent {
  static selector = "el-card-expanded";
  
  constructor() {
    super();
  }

  expanded = true;


  onToggleCard() {
    this.scope.expanded = !this.scope.expanded;
  }

}
