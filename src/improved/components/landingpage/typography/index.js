import { Compile } from '../../../lib';

import templateTitle from './h1.html?raw';
import templateH2 from './h2.html?raw';

class TheTitle{
    constructor(){
        console.log(this)
    }

    text = "text"
    title = "title"

}
class TheSubtitle{
    constructor(){
        console.log(this)
    }

    theTitle = "theTitle"

    connectedCallback(){
        // console.log('xxx',this)
        // debugger;

    }

}


Compile(TheTitle,{
    selector:"the-title",
    template:templateTitle
})

Compile(TheSubtitle,{
    selector:"the-subtitle",
    template:templateH2
})
/**
 * Connect the templates , no need for a full component here
 *
const $head = document.querySelector('head');
const $placeholder = document.createElement('div');
$head.appendChild($placeholder);
$placeholder.innerHTML = template;

class TheA{
    constructor(){
    }
    url ="/"
    description = "The link description"
}
class TheTitle{
    constructor(){}
}
 
Compile(TheA,{
    selector: "the-a",
    template: '<span><a href="{{url}}" class="text-sky-500 font-semibold dark:text-sky-400"><slot></slot>{{description}}</a></span>'
})
class TheP{}
 
Compile(TheP,{
    selector: "the-p",
    template: `<span>
    <p class="mt-4 max-w-3xl space-y-6">
    <slot>
      Tailwind UI is a collection of beautiful, fully responsive UI components,
      designed and developed by us, the creators of Tailwind CSS. It's got
      hundreds of ready-to-use examples to choose from, and is guaranteed to
      help you find the perfect starting point for what you want to build.
    </slot>
  </p></span>`
})

Compile(TheTitle,{
    selector:"the-title",
    template: `<div><h1
    class="text-slate-900 font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight text-center dark:text-white inline"
  >Y</h1></div>`
})
  
/*
class TheH2 extends HTMLElement{
    constructor(){
        super();
        // this.attachShadow({mode:"open"})
        // this.shadowRoot.appendChild(document.head.querySelector("#the-h2").content.firstElementChild.cloneNode(true))
        let template = document.getElementById("the-h2");
        let templateContent = template.content;
  
        const shadowRoot = this.attachShadow({ mode: "open" });
        shadowRoot.appendChild(templateContent.cloneNode(true));
    }
}
class TheH3 extends HTMLElement{
    constructor(){
        super();
        this.attachShadow({mode:"open"})
        this.shadowRoot.appendChild(document.head.querySelector("#the-h3").content.firstElementChild.cloneNode(true))
    }
}

// customElements.define('the-h1',TheH1)

customElements.define('the-h2',TheH2)
customElements.define('the-h3',TheH3)
// customElements.define('the-p',TheP)
*/