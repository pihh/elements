import { Compile } from "../../../../lib";

import template from "./template.html?raw";

class TheConsoleNav {
  constructor() {}

  tabs = [];

  onChangeTab(tab) {
    this.broadcast("onChangeTab", tab);
  }

  connectedCallback() {
    this.broadcast("onChangeTab", this.tabs.filter((el) => el.selected)[0]);
  }
}

Compile(TheConsoleNav, {
  selector: "the-console-nav",
  template: template,
});
