import { Compile } from "../../../lib";
import template from "./template.html?raw";

class TheFooter {
  constructor() {}

  sections = [
    [
      {
        title: "Getting Started",
        links: [
          {
            title: "Instalation",
            url: "#",
          },
        ],
      },
    ],
  ];
}

Compile(TheFooter, {
  selector: "the-footer",
  template: template,
});
