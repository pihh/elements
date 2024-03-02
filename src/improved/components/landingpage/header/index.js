import { Compile } from "../../../lib";
import template from "./template.html?raw";
import templateNav from "./nav.html?raw";
import templatePunchline from "./punchline.html?raw";

class TheHeader{
    constructor(){}
    connectedCallback(){
        if(super.connectedCallback) super.connectedCallback()
        console.log('here')
    }
    punchline = "O meu framework!"
}

class TheHeaderNav{
    constructor(){}
}

class TheHeaderPunchline{
    constructor(){}
    title = "The header punchline title"
}


Compile(TheHeader,{
    selector: "the-header",
    template: template
})

Compile(TheHeaderNav,{
    selector: "the-header-nav",
    template: templateNav
})
Compile(TheHeaderPunchline,{
    selector: "the-header-punchline",
    template: templatePunchline
})