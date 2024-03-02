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

  view = 0;
  project = "forLoop";

  setData( tabs) {
    // console.log({tabs},this.view)
    // this.tabs = [];
    for (let tab of tabs) {
      // this.tabs.push(tab);
      if (tab.selected) {
        
        this.view = tab.idx || 0;
      }
    }
    this.tabs = tabs;
    // this.update('tabs.length')
    console.log(this.view, this.tabs)
    // this.project = project;
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
      const tabs = Object.assign([],this.tabs)
 
      for (let i = 0; i < tabs.length; i++) {
        let _tab = tabs[i];
        if (_tab.title == tab.title) {
          tabs[i].selected = true;
          // tabs.selected = i;
        } else {
          tabs[i].selected = false;
        }
      }
    
      this.setData(tabs);
    }, 200);
    setTimeout(() => {
      $view.style.opacity = 1;
      $view.style.maxHeight = "34dvh";
      this.changingTab = false;
    }, 500);
  }

  connectedCallback() {
    // this.tabs = []
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
}

Compile(TheConsole, {
  selector: "the-console",
  template: template,
});
