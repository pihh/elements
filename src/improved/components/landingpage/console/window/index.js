import { Compile } from "../../../../lib";
import { DATA } from "../data";
import "../vendor/prism/index.js";
import "../vendor/prism/style.css";
import template from "./template.html?raw";

class TheConsoleWindow {
  constructor() {}

  views = DATA;
  view = 0;
  project = "forLoop";
  language = "html";
  content = "";

  attributeChangedCallback(name, oldValue, newValue) {
    // if(name == "project")
    if (oldValue !== newValue) {
      if (name == "view") {
        this.updateView();
      }
    }
  }

  connectedCallback() {
    this.updateView();
  }
  lastUpdated = 0;
  updateView() {
    if (Date.now() - this.lastUpdated < 100) {
      return;
    }
    this.lastUpdated = Date.now();
    try {
      const view = !isNaN(this.view) ? Number(this.view) : 0;
      const project = DATA[this.project] ? this.project : "forLoop";

      this.language = DATA[project][view].language;

      this.content = `${DATA[project][view].content}`;
      this.querySelector("#console-window-content").innerHTML = this.content;
      Prism.highlightAll();
    } catch (ex) {
      console.log(ex);
    }
  }
}

Compile(TheConsoleWindow, {
  selector: "the-console-window",
  template: template,
});
