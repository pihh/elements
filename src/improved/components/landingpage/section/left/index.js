import { Compile } from "../../../../lib";
import template from "./template.html?raw";
class TheSectionLeft {
  constructor() {}

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
