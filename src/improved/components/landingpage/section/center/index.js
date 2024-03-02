

import { Compile } from "../../../../lib";
import template from "./template.html?raw";

class TheSectionCenter {
  constructor() {}
}

Compile(TheSectionCenter, {
  selector: "the-section-center",
  template: template,
});