import { Compile } from "../../../../lib";
import template from './template.html?raw'
class TheSectionRight {
    constructor() {}
  }
  
  Compile(TheSectionRight, {
    selector: "the-section-right",
    template: template,
  }); 