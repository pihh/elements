


import { Template } from "./src/lib/compile/template";


var HelloTemplate = new Template("[template=the-header]",{name:"world",description:"default value",textBinding:"text bindinf",counter:0, item: "xxx"});
var OtherTemplate = new Template("[template=the-other]",{name:"world",description:"default value",textBinding:"text bindinf",counter:0, item: "xxx"});
HelloTemplate.clone(
    { 
        name: "xxxx",
        description: "Lorem Ipsum is Lorem Ipsum and    Lorem Ipsum is Lore" 
    }
).append();

OtherTemplate.clone(
    { 
        name: "World",
    
    }
).append();
//clone.update({ name: "John Update", description: "Lorem Ipsum e o crl"  });



const button = document.querySelector("button");
button.addEventListener("click",function(){
    clone.update({ name: Date.now()})
})