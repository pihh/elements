import { Compile } from "../../../lib";
import templateBlockquote from "./blockquote.html?raw";

class TheBlockQuote{

    src = "/avatar.png"; 
    title = "Filipe sá";
    description = "Autor desta merda toda"
}
Compile(TheBlockQuote,{
    selector: "the-blockquote",
    template: templateBlockquote
}) 