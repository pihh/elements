import { Compile } from "../../../../lib";
import template from './template.html?raw'

class TheConsoleTab{
    selected = false;
    language = "html";
    content= ``
}

Compile(TheConsoleTab,{
    selector:"the-console-tab",
    template:template
})