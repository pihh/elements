import { Compile } from "../../../../lib";
import template from "./template.html?raw";
class TheSectionLeft {
  constructor() {}
  title = "The component title";
  color = "white";
  colors = ["white", "black"];
  tabs = ["simple", "reactive", "conditionals", "cli"];

  currentTab = "simple";
  onTabChange(tab) {
    this.currentTab = tab;
  }
}

Compile(TheSectionLeft, {
  selector: "the-section-left",
  template: template,
});
