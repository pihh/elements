import { TheBaseComponent, TheComponent } from ".";
import { Component } from "../compiler";
import { removeChars } from "../compiler/utils/text";

const createComment = function (parent) {
  let content = "For loop #";
  let $comment = document.createComment(content);
  parent.before($comment);
  return $comment;
};



(() => {
    const config = {
      selector: "the-loop-inner-inner",
      template: `
<li index="{{index}}">
        {{item}}
  </li>
   `,
};
  
    class TheLoopInnerInnerComponent extends TheComponent {
      constructor() {
        super();
      }
      item = { id: 11, title: "item", list: [1, 2, 3] }
      
      index = 0
  
      static get observedAttributes() {
        return ["item", "index"];
      }
    }
  
    Component(TheLoopInnerInnerComponent, config);
  })();

(() => {
    const config = {
      selector: "the-loop-inner",
      template: `
<li index="{{index}}">
      <header>
          <h1>Data #{{item.id}}</h1>
          <p>{{item.title}}</p>
      </header>
      <main> 
          <ol>
              <!-- the second container -->
             <the-loop-inner-inner index={{index}} item="{{item.items[0]}}></the-loop-inner-inner>
          </ol>

      </main>
  </li>
   `,
    };
  
    class TheLoopInnerComponent extends TheComponent {
      constructor() {
        super();
      }
      index = 0;
      item = {
        id: 0,
        title: "title",
        items: [{ id: 11, title: "item", list: [1, 2, 3] }],
      }
      data = [
        
        {
          id: 1,
          title: "title",
          items: [{ id: 22, title: "item", list: [4, 5, 6] }],
        },
      ];
  
      static get observedAttributes() {
        return ["data", "source", "index", "config"];
      }
    }
  
    Component(TheLoopInnerComponent, config);
  })();
(() => {
  const config = {
    selector: "the-loop",
    template: `
  <ul>
    <!-- the first container -->
    <the-loop-inner index="0" item="{{data[0]}}"></the-loop-inner>
  </ul>
 `,
  };

  class TheLoopComponent extends TheComponent {
    constructor() {
      super();
    }
    data = [
      {
        id: 0,
        title: "title",
        items: [{ id: 11, title: "item", list: [1, 2, 3] }],
      },
      {
        id: 1,
        title: "title",
        items: [{ id: 22, title: "item", list: [4, 5, 6] }],
      },
    ];

    static get observedAttributes() {
      return ["data", "source", "index", "config"];
    }
  }

  Component(TheLoopComponent, config);
})();
