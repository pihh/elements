import "./style.css";
import { Component, ElComponent } from "../../elements/component";
import Template from "./template.html";

@Component({
  selector: "el-text",
  template: Template,
})
export class ElText extends ElComponent {
  static selector = "el-text";

  constructor() {
    super();
  }

}
