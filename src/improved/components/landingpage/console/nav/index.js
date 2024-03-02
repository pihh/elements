import { Compile } from "../../../../lib";

import template from "./template.html?raw";

class TheConsoleNav {
  constructor() {}

  tabs = [];

  onChangeTab(tab) {
    this.broadcast("onChangeTab", tab);
    /*
    for (let _tab of this.tabs) {
      if (_tab.idx == tab.idx) {
        _tab.selected = true;
      } else {
        _tab.selected = false;
      }
    }
    */
  }

  connectedCallback() {
    setTimeout(() => {
      this.broadcast("onChangeTab", this.tabs.filter((el) => el.selected)[0]);
    });
  }
}

Compile(TheConsoleNav, {
  selector: "the-console-nav",
  template: template,
});
