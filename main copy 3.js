import { Template } from "./src/lib/compile/template";

var HelloTemplate = new Template("[template=the-header]", {
  name: "world",
  description: "default value",
  textBinding: "text bindinf",
  counter: 1,
  item: "xxx",
  color: "red",
  counterUpdating: false,
  colors: ["white", "red", "blue"],
});
var OtherTemplate = new Template("[template=the-other]", {
  name: "world",
  description: "default value",
  textBinding: "text bindinf",
  counter: 2,
  item: "xxx",
  counterUpdating: false,
  url: "https://pihh.com"
});
var XTemplate = new Template("[template=the-x]", {
  name: "world",
  description: "default value",
  textBinding: "text bindinf",
  counter: 0,
  item: "xxx",
  counterUpdating: false,
});

let t1 = HelloTemplate.clone({
  name: "xxxx",
  description: "Lorem Ipsum is Lorem Ipsum and    Lorem Ipsum is Lore",
});
t1.onCounterUpdateTimeout = null;
t1.onCounterUpdate = function(){
  
  if(!t1.counterUpdating){
    t1.counterUpdating = true;
  }
  clearTimeout(t1.onCounterUpdateTimeout);
  t1.onCounterUpdateTimeout = setTimeout(()=>{
    t1.counterUpdating = false;
  },1000)
  
}
t1.incrementCounter = function(){
  t1.counter++
  t1.onCounterUpdate()
}
t1.onClick = function(){
  console.log('on Click');
  t1.counter--
}
t1.decrementCounter = function(){
  this.counter--
  t1.onCounterUpdate()
}
let t2 = XTemplate.clone({
  name: "xxxx",
  description: "Lorem Ipsum is Lorem Ipsum and    Lorem Ipsum is Lore",
});

let t3 = OtherTemplate.clone(
  {
    name: "World",
  },
  document.querySelector(".t4")
);

// let t4 =HelloTemplate.clone(
//     {
//         name: "xxxx",
//         description: "Lorem Ipsum is Lorem Ipsum and    Lorem Ipsum is Lore"
//     },document.querySelector('.t4')

//     )

const buttons = [...document.querySelectorAll(".btn")];
let i = -1;
for (let t of [t1, t2, t3]) {
  i++;

  buttons[i].addEventListener("click", function () {
    t.name = "Pihh ";

    console.log(t.name);
    t.counter = Number(t.counter) + parseInt(Math.random() * 100);
  });
}
