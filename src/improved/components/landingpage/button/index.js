
import template from './template.html?raw';
import templateSearch from './search.html?raw';
import { Compile } from '../../../lib';
class TheButton{
    constructor(){}
}

class TheSearch{
    constructor(){}
}
Compile(TheButton,{
    selector:"the-button",
    template:template
})

Compile(TheSearch,{
    selector:"the-search",
    template:templateSearch
})