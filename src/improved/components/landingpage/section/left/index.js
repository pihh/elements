import { Compile } from "../../../../lib";
import template from './template.html?raw'
class TheSectionLeft {
    constructor() {}
  }
  
  Compile(TheSectionLeft, {
    selector: "the-section-left",
    template: template,
  }); 