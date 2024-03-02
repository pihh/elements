import "./nav";
import "./tab";
import "./window";
import { Compile } from "../../../lib";
import template from "./template.html?raw";

import "./vendor/prism/index.js";
import "./vendor/prism/style.css";
import { DATA } from "./data.js";

class TheConsole {
  constructor() {
    this.setData(
      DATA[this.project || "forLoop"].map((el) => {
        return {
          idx: el.idx,
          title: el.title,
          selected: el.selected,
        };
      })
    );
  }

  tabs = DATA.forLoop.map((el) => {
    return {
      idx: el.idx,
      title: el.title,
      selected: el.selected,
    };
  });

  view = 1;
  project = "forLoop";

  setData(tabs) {
    // console.log({tabs},this.view)
    // this.tabs = [];
    for (let tab of tabs) {
      // this.tabs.push(tab);
      if (tab.selected) {
        this.view = tab.idx || 0;
        //  this.tab = tab;
      }
    }
    //this.tabs = tabs;
  }
  changingTab = false;
  onChangeTab($event) {
    if (this.changingTab) return;
    this.changingTab = true;
    const $view = this.querySelector("#console-view");
    let tab = $event.detail;
    $view.style.opacity = 0;
    $view.style.maxHeight = "23dvh";
    setTimeout(() => {
      //const tabs = Object.assign([], this.tabs);

      for (let i = 0; i < this.tabs.length; i++) {
        let _tab = this.tabs[i];
        if (_tab.idx == tab.idx) {
          this.tabs[i].selected = true;
          // tabs.selected = i;
          //this.tab = tabs[i];
        } else {
          this.tabs[i].selected = false;
        }
      }

      this.setData(this.tabs);
    }, 200);
    setTimeout(() => {
      $view.style.opacity = 1;
      $view.style.maxHeight = "34dvh";
      this.changingTab = false;
    }, 500);
  }

  connectedCallback() {
    setTimeout(() => {
      this.setData(
        DATA[this.project || "forLoop"].map((el) => {
          return {
            idx: el.idx,
            title: el.title,
            selected: el.selected == this.view,
          };
        })
      );
    }, 0);
  }
}

Compile(TheConsole, {
  selector: "the-console",
  template: template,
});
