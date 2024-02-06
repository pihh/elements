(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))n(i);new MutationObserver(i=>{for(const o of i)if(o.type==="childList")for(const s of o.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&n(s)}).observe(document,{childList:!0,subtree:!0});function r(i){const o={};return i.integrity&&(o.integrity=i.integrity),i.referrerPolicy&&(o.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?o.credentials="include":i.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function n(i){if(i.ep)return;i.ep=!0;const o=r(i);fetch(i.href,o)}})();function T(t,e="{{",r="}}"){let n=[];try{n=t.split(e).slice(1).map(i=>i.split(r)[0])}catch{}return n||[]}const tt=function(t){let e=t.innerHTML,r=T(e);for(let n of r){const i="{{"+n+"}}",o="{{"+n.replaceAll(" ","")+"}}";e=e.replaceAll(i,o)}return t.innerHTML=e,t};function O(t){return t.toUpperCase()!=t.toLowerCase()}function j(t,e="{{",r=[]){let n=t.indexOf(e),i=t;return n>-1?(r.push(n),i=i.split(""),i[n]="*",i[n+1]="*",i=i.join(""),j(i,e,r)):r}const F=function(t,e,r="this"){let n=[],i=e.split("{{").map(s=>s.trim()).filter(s=>s.length>0).map(s=>s.split("}}")[0]);function o(s,l=[],c=r,u=[]){let f=Object.keys(s).filter(a=>a.indexOf("__")==-1);for(let a of f)for(let d of i){let b=Math.max(-1,d.indexOf(c+"."+a),d.indexOf(c+"[")),_=c+"."+a.replace("]","");a==Number(a)&&(_=c+"["+a+"]"),b>-1&&(typeof s[a]!=="object"?n.push(_):(n.push(_),o(s[a],l,c+"."+a,u=[])))}}return o(t,i),i[1]&&i[1].indexOf(r+".")>-1&&n.push(i[1]),n.sort((s,l)=>s>l).filter(s=>Math.max(-1,e.indexOf(s+" "),e.indexOf(s+"}"),e.indexOf("?"))>-1)},et=function(t,e,r){const n=r.replaceAll("(","").replaceAll(")","");if(t.__events.indexOf(n)>-1){console.warn({element:t,eventName:n},"Was already added");return}let i=t.getAttribute(r);t.__events.push(n),t.removeAttribute(n);let o=!1;e.__connections.push(()=>{if(o)return;o=!0;let s=function(l){console.log(e,t),console.log(n,l,e,i)};if(i.indexOf("(")==-1)i=i.replace("this.",""),s=function(l){console.log(e,t),t.controller[i](l)};else{let l=i.split("(")[0].trim().replace("this.",""),c=i.split("(")[1].split(")")[0].trim().split(",").filter(f=>f.length>0),u=c.indexOf("$event");s=function(f){let a=c.map(d=>(d=="$event"?d=f:d=="$index"?d=t.$index:e.hasOwnProperty(d)&&(d=e[d]),d));u==-1&&a.push(f),t.controller[l](...a)}}t.addEventListener(n,s)})},rt=function(t,e,r){try{const n=r.replace("@","").toLowerCase(),i=e.getAttribute(r).replaceAll("this.","").split("(").map(o=>o.trim()).filter(o=>o.length>0)[0];e.__actions=e.__actions||{},e.__actions.hasOwnProperty(n)||(e.__actions[n]=function(o){const s=new CustomEvent(n,{detail:{data:o}});t.dispatchEvent(s)}),(!t.__events||t.__events.indexOf(n)==-1)&&(t.__events||(t.__events=[]),t.__events.push(n),t.addEventListener(n,function(o){console.log("did ear this ",{$event:o,parent:t,eventName:n,action:i});const l=Function("return this."+i+"(...arguments)").call(t,o);console.log(l)}))}catch(n){console.warn(n)}},N=function(t,e,r){let n=typeof r;["boolean","number"].indexOf(n)==-1&&(r="'"+r+"'"),r!==g(t,e)&&Function("return `${this."+e+"="+r+"}`").call(t)},g=function(t,e){try{return Function("return this."+e).call(t)}catch{return Function("return `${this."+e+"}`").call(t)}},it=function(t,e,r,n){const i=t.getAttribute(e).replaceAll("this.",""),o=t.nodeName||"INPUT",s=t.getAttribute("type"),l=[i],c=s==="checkbox"?"checked":"value";for(let u of l.map(f=>f.replace("this.","").trim())){const f=function(a){if(s==="checkbox"){let d=t.getAttribute("checked");a&&!d?t.setAttribute("checked",!0):!a&&d&&t.removeAttribute("checked")}else t.getAttribute("value")!==a&&t.setAttribute(c,g(r,i))};t.__subscribe(u,r,n,f),f(g(r,i))}if(o=="SELECT"){const u=function(d,b){[...d.querySelectorAll("option")].forEach(_=>{b==_.value?_.setAttribute("selected",!0):_.removeAttribute("selected")})},f=function(d){[...d.querySelectorAll("option")].forEach(b=>{b.__didInitialize=b.__didInitialize||[],b.__didInitialize.push(()=>{u(d,g(r,i))})})};let a=g(r,i)||void 0;t.addEventListener("change",d=>{d.target.value!==a&&(a=d.target.value,N(r,i,d.target.value))}),f(t),u(t,g(r,i))}else if(s=="checkbox"){let u=g(r,i)||!1;t.addEventListener("change",f=>{f.target.checked!=u&&(u=f.target.checked,N(r,i,f.target.checked))})}else{let u=g(r,i)||"";t.addEventListener("keyup",f=>{f.target.value!==u&&(u=f.target.value,N(r,i,f.target.value))})}t.removeAttribute(e)};function X(t){var e=[];if(t)for(t=t.firstChild;t!=null;)t.nodeType==3?e[e.length]=t:e=e.concat(X(t)),t=t.nextSibling;return e}const nt={__subscribe:function(t,e,r,n){if(t.indexOf("__")==0)return;const i=r(t,n);this.__subscription,i.event,!(this.__subscriptions.map(o=>o.subscription).indexOf(t)>-1)&&(this.__subscriptions.push({unsubscribe:i.unsubscribe,subscription:t,scope:e,connection:r}),this.__subscriptions.push({unsubscribe:i.unsubscribe,subscription:i.event,scope:e,connection:r}),n())},__unsubscribe:function(){this.__subscriptions.map(t=>t.unsubscribe()),this.__subscriptions=[]}},w=function(t){if(t.__didSetup)return t;t.controller||(t.controller=t);for(let e of["__subscriptions","__events","__didInitialize"])t.hasOwnProperty(e)||(t[e]=[]);for(let e of["__actions"])t.hasOwnProperty(e)||(t[e]={});for(let e of["__subscribe","__unsubscribe"])t.hasOwnProperty(e)||(t[e]=nt[e]);return t.__didSetup=!0,t},ot=function(t,e,r){const n="`"+t.textContent+"`",i=n.replaceAll("{{","${").replaceAll("}}","}"),o=F(e,n);t=w(t);for(let s of o.map(l=>l.replace("this.","").trim())){const l=function(){const u=Function("return "+i).call(e);t.textContent=u};t.__subscribe(s,e,r,l)}},D=function(t,e,r){const n=X(t).filter(i=>i.textContent.indexOf("{{")>-1);for(let i of n)i.controller||(i.controller=t.controller),ot(i,e,r)},U=function(t,e){const r=w(document.createComment("["+e+"-container]"));let n=t.getAttribute(e);return n.indexOf("{{")==-1&&(n="{{"+n+"}}"),t.before(r),t.removeAttribute(e),{$comment:r,query:n}},z=function(t,e,r,n={}){if(n={customAttributes:[],level:0,...n},t.__forOperationBound)return;t.__forOperationBound=!0;const{$comment:i,query:o}=U(t,"*for"),s=o.split(";")[0].split(" of ").map(h=>h.trim());let l=s[0].replaceAll("{{","").trim(),c=s[1].replaceAll("}}","").trim().split(";")[0].trim(),u="__$index"+n.level+"__";const f=o.split(";")[1];f&&f.indexOf("$index")>-1&&(u=f.split("=")[0].trim());let a,d,b=document.createElement("div");if(document.body.appendChild(b),b.appendChild(t),d=b.cloneNode(!0),a=b.cloneNode(!0).innerHTML.trim(),t.remove(),b.remove(),!l||!c)return;const _=T(a);for(let h of _){let p="{"+h+"}",$=j(p,l);for(let m of $)if(m>-1){let S=p.charAt(m-1),C=p.charAt(m+l.length);if(!O(S)&&!O(C)){p=p.split("");let L=p.slice(0,m),E=p.slice(m+l.length);p=L.join("")+c+"["+u+"]"+E.join("")}}a=a.replaceAll("{"+h+"}",p)}const B=T(a,'*for="','"');for(let h of B){let p='*for="'+h+'"',$=j(p,l);for(let m of $)if(m>-1){let S=p.charAt(m-1),C=p.charAt(m+l.length);if(!O(S)&&!O(C)){p=p.split("");let L=p.slice(0,m),E=p.slice(m+l.length);p=L.join("")+c+"["+u+"]"+E.join("")}}a=a.replaceAll('*for="'+h+'"',p)}i.__forLoopContainer=i.__forLoopContainer||[],i.__forLoopItemFactory=function(h){if(i.__forLoopContainer.length<=h){let p=d.cloneNode(!1);p.innerHTML=a.replaceAll(u,h),p=p.firstElementChild,i.after(p),i.__forLoopContainer.push(p),w(p),W(p,e,r,{level:n.level+1,reset:!0}),D(p,e,r,{level:n.level+1,reset:!0})}};const G=function(h){h!==void 0&&i.__forLoopItemFactory(h-1)},Y=c.replaceAll("this.","").trim()+".length",Z=g(e,c.replace("this.",""));i.__subscribe(Y,e,r,G);for(let h=0;h<Z.length;h++)i.__forLoopItemFactory(h)},st=function(t,e,r){const{$comment:n,query:i}=U(t,"*if");let o="`"+i.replaceAll("{{","${").replaceAll("}}","}")+"`";const s=F(e,i);for(let l of s.map(c=>c.replace("this.","").trim())){const c=function(){const f=Function("return "+o).call(e);["true",!0].indexOf(f)>-1?t.isConnected||n.after(t):t.isConnected&&t.remove()};t.__subscribe(l,e,r,c),c()}},W=function(t,e,r,n={reset:!1}){n={reset:!1,customAttributes:[],...n},n.reset&&(t.__didSetup=!1);let i=[...t.querySelectorAll("*")].filter(s=>s.getAttributeNames().indexOf("*for")>-1);for(;i.length>0;){let s=i[0];s.parent=t,s.controller=t.controller,z(s,e,r,n),i=[...t.querySelectorAll("*")].filter(l=>l.getAttributeNames().indexOf("*for")>-1)}let o=[...t.querySelectorAll("*")];n.reset&&(t.__didSetup=!1),t=w(t);for(let s of o)s.controller||(s.controller=t),s.parent=t,s=w(s),K(s,e,r);K(t,e,r)},K=function(t,e,r){const n=t.getAttributeNames();for(let i of n){const o="`"+t.getAttribute(i)+"`";if(i.indexOf("*")==0){if(i=="*if")st(t,e,r);else if(i=="*for"){z(t,e,r),t.innerHTML="";for(let c of t.getAttributeNames())t.removeAttribute(c)}}else if(i=="model"||i=="[model]")it(t,i,e,r);else if(!(i.indexOf("@")>-1)){if(i.indexOf("(")>-1)et(t,e,i);else if(o.indexOf("{{")==-1)continue}const s=o.replaceAll("{{","${").replaceAll("}}","}"),l=F(e,o);for(let c of l.map(u=>u.replace("this.","").trim())){const u=function(){const a=Function("return "+s).call(e);t.setAttribute(i,a)};t.__subscribe(c,e,r,u)}}};function V(t,e,r){return e=lt(e),e in t?Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}):t[e]=r,t}function lt(t){var e=ct(t,"string");return typeof e=="symbol"?e:String(e)}function ct(t,e){if(typeof t!="object"||!t)return t;var r=t[Symbol.toPrimitive];if(r!==void 0){var n=r.call(t,e||"default");if(typeof n!="object")return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return(e==="string"?String:Number)(t)}class at{constructor(e,r){return this._preproxy=new WeakMap,this._handler=r,this.proxify(e,[])}makeHandler(e){let r=this;return{get(n,i,o){return r._handler.get?r._handler.get(n,[...e,i],o):n[i]},set(n,i,o,s){return typeof o=="object"&&(o=r.proxify(o,[...e,i])),n[i]=o,r._handler.set&&r._handler.set(n,[...e,i],o,s),!0},deleteProperty(n,i){if(Reflect.has(n,i)){r.unproxy(n,i);let o=Reflect.deleteProperty(n,i);return o&&r._handler.deleteProperty&&r._handler.deleteProperty(n,[...e,i]),o}return!1}}}unproxy(e,r){this._preproxy.has(e[r])&&(e[r]=this._preproxy.get(e[r]),this._preproxy.delete(e[r]));for(let n of Object.keys(e[r]))typeof e[r][n]=="object"&&this.unproxy(e[r],n)}proxify(e,r){for(let i of Object.keys(e))typeof e[i]=="object"&&(e[i]=this.proxify(e[i],[...r,i]));let n=new Proxy(e,this.makeHandler(r));return this._preproxy.set(n,e),n}}const y=(t=[])=>(Array.isArray(t)&&(t=t.join(".")),t=t.replaceAll("[",".").replaceAll("]",".").replaceAll("..",".").trim(),t.endsWith(".")&&(t=t.slice(0,-1)),t);class ut{constructor(){V(this,"events",{}),V(this,"trackTimeout",void 0)}subscribe(e,r){return e=y(e),this.events[e]||(this.events[e]=[]),this.events[e].push(r),(()=>{let i=!0;return{event:e,callback:r,render:()=>{if(i&&this.events[e])for(let o of this.events[e])o()},unsubscribe:()=>{i&&(i=!1,this.events[e]&&(this.events[e]=this.events[e].filter(o=>o!==r)))}}})()}publish(e,r){console.log("PUBLISH",e,r),this.events[e]?this.events[e].forEach(n=>n(r)):console.log("no events subscribed yet:",e)}unsubscribe(e){}track(){clearTimeout(this.trackTimeout),this.trackTimeout=setTimeout(()=>{console.log("---------------------------"),console.log("Subscription tracking".toUpperCase()),console.log("---------------------------");let e=0;for(let r of Object.keys(this.events)){let n=this.events[r].length;console.log("Sub:",r,n),e+=n}console.log(""),console.log("TOTAL: ",e+" active subscriptions"),console.log("-------------------------------------")},100)}}const ft=function(t){const e=new ut;return t=new at(t,{set(i,o,s,l){try{let c=y(o),u=typeof i[c];return c.indexOf("__")==0||(u!=="object"||Array.isArray(i[c]))&&e.publish(y(o),s),!0}catch(c){console.warn(c),console.log(o,y(o),s)}},deleteProperty(i,o){delete e.events[y(o)]},getPath(i,o){console.log("getPath",o.split("."),i)}}),[t,function(i,o){return e.subscribe(y(i),o)},function(){for(let i of Object.keys(e.events))e.publish(i)},e]},pt=function(t={}){let[e,r,n]=ft(t);return{scope:e,connect:r,render:n}},dt=function(t,e,r={}){r={firstConnection:!!t.controller,...r};const{scope:n,connect:i,render:o,pubsub:s}=pt(e);t=tt(t),t.props=n,t.controller=t.controller||t,t.pubsub=s,t.render=o;for(let l of Object.keys(t.props))t.__defineSetter__(l,function(c){return t.props[l]=c,!0}),t.__defineGetter__(l,function(){return t.props[l]});return W(t,n,i),D(t,n,i),t.__onConnect(),{element:t,scope:n}},ht=function(t){const e=new Map(Array.from(t.querySelectorAll("slot").values()).map(n=>[n.name,n])),r=Array.from(t.querySelectorAll(":scope > *[slot]").values()).map(n=>[n.slot,n]);for(const[n,i]of r){const o=e.get(n);o&&(i.removeAttribute("slot"),o.parentElement.replaceChild(i,o))}},bt=function(t){Array.from(t.querySelectorAll("slot")).forEach(e=>e.removeAttribute("slot"))};function Q(t,e,r){return e=mt(e),e in t?Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}):t[e]=r,t}function mt(t){var e=_t(t,"string");return typeof e=="symbol"?e:String(e)}function _t(t,e){if(typeof t!="object"||!t)return t;var r=t[Symbol.toPrimitive];if(r!==void 0){var n=r.call(t,e||"default");if(typeof n!="object")return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return(e==="string"?String:Number)(t)}class x{constructor(){if(Q(this,"__registry",{}),x.instance)return x.instance;x.instance=this}register(e,r){const{selector:n,template:i,styles:o,shadow:s}={...e};if(!this.__registry.hasOwnProperty(n)&&customElements.get(n)===void 0){const l=document.head,c=document.createElement("style");c.innerHTML=o,this.__registry[n]={component:r,template:i,styles:c,shadow:s},s||l.appendChild(c),customElements.define(e.selector,r)}}setup(){}load(e){}}Q(x,"instance",null);const gt=new x;class P extends HTMLElement{static register(e){const r={shadow:!1,template:`<h1>${e.config.selector} is registered</h1>`,styles:"",...e.config};gt.register(r,e)}constructor(){super(),this.__config=this.constructor.config,this.__template=this.constructor.config.template,this.__style=this.constructor.config.styles,this.__templateId="template-container-"+this.__config.selector,this.__templateContent=this.__getTemplateElement(!0),this.dataset.connected||(this.appendChild(this.__templateContent),this.dataset.connected="true"),ht(this),bt(this),this.__template=this.innerHTML}__getTemplateElement(e=!1){let r=this.__templateElement;if(!r){if(r=document.querySelector("#"+this.__templateId),!r){const n=document.querySelector("head");r=document.createElement("template"),r.setAttribute("id",this.__templateId),r.innerHTML=this.__template,n.appendChild(r)}this.__templateElement=r}return e&&(r=this.__templateElement.content.cloneNode(!0)),r}__extractAttributes(){const e=this.props||{};e.__connections=[],this.__onConnect=()=>{try{let i=this.__connections||e.__connections||[];i.map(o=>o()),i=[];for(let o of this.querySelectorAll("*")){const s=o.getAttributeNames().filter(l=>l.indexOf("@")>-1);for(let l of s)rt(this,o,l)}}catch(i){console.log(this,e,i)}};let r=Object.keys(e||{});const n=this.getAttributeNames().filter(i=>r.indexOf(i)>-1);for(let i of n){e[i]=this.getAttribute(i);try{e[i]=JSON.parse(e[i])}catch{isNaN(e[i])?["false",!1].indexOf(e[i])>-1?e[i]=!1:["true",!0].indexOf(e[i])>-1&&(e[i]=!0):e[i]=Number(e[i])}}return e}connectedCallback(){if(!this.__initialSetup){this.__initialSetup=!0;const e=this.__extractAttributes();dt(this,e)}}}const A={list:[1,2,3],color:"indigo",colors:["red","green","yellow","indigo","blue"],object:{title:"Made with ❤️ by pihh",objectList:[{a:"a",b:"b",c:"c",id:0,innerList:[1,2,3,4]},{a:"a",b:"b",c:"c",id:1,innerList:[1,2,3,4]},{a:"a",b:"b",c:"c",id:2,innerList:[1,2,3,4]}].map(t=>(t.a=t.a+"_"+t.id,t.b=t.b+"_"+t.id,t.c=t.c+"_"+t.id,t))}};function v(t,e,r){return e=yt(e),e in t?Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}):t[e]=r,t}function yt(t){var e=vt(t,"string");return typeof e=="symbol"?e:String(e)}function vt(t,e){if(typeof t!="object"||!t)return t;var r=t[Symbol.toPrimitive];if(r!==void 0){var n=r.call(t,e||"default");if(typeof n!="object")return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return(e==="string"?String:Number)(t)}const xt=`<section\r
  class="loop-section-container border-{{this.color == 'white' ? 'gray' : this.color}}-200 bg-{{this.color}}-100 "\r
>\r
  <h1>Colors</h1>\r
  <p>Current color: {{this.color}}</p>\r
  <select class="input w-full" [model]="this.color">\r
    <option [value]="color" *for="color of this.colors">{{color}}</option>\r
  </select>\r
</section>\r
\r
<section\r
  class="loop-section-container border-{{this.color == 'white' ? 'gray' : this.color}}-200 bg-{{this.color}}-100 "\r
>\r
  <h1>List</h1>\r
\r
  <ul class="loop-list-margin-y">\r
    <li *for="l of this.list;  $i = $index">List item {{l}} {{ $i }}</li>\r
    <li>Litem item outside loop {{this.list[0]}}</li>\r
  </ul>\r
  <div class="input-btn-inline">\r
    <button class="btn bg-{{this.color}}-200" (click)="add()">+</button>\r
    <input [model]="this.list[0]" class="input" />\r
  </div>\r
</section>\r
\r
<section\r
  class="loop-section-container border-{{this.color == 'white' ? 'gray' : this.color}}-200 bg-{{this.color}}-100 "\r
>\r
  <h1>{{this.object.title}}</h1>\r
  <div class="input-btn-inline">\r
    <input [model]="this.object.title" class="input" />\r
    <button class="btn bg-{{this.color}}-200" (click)="addObject()">+</button>\r
  </div>\r
  <ul class="loop-list-margin-y">\r
    <li *for="o of this.object.objectList; $j = $index">\r
      <p>\r
        <b class=" class-name-{{o.id}} "\r
          >Object List item id:{{o.id}} index = {{$j}}</b\r
        >\r
        <button class="btn bg-{{this.color}}-200" (click)="addToInnerList($j)">\r
          +\r
        </button>\r
        <i>{{o.id == 0 ? 'first' : 'next'}}</i>\r
      </p>\r
      <ol>\r
        <li *for="l of o.innerList; $k = $index">\r
          Inner List item {{l}} <b>J: $j</b> <b>K: $k </b>\r
        </li>\r
      </ol>\r
    </li>\r
  </ul>\r
</section>\r
`;class I extends P{constructor(){super(),v(this,"props",A),v(this,"list",A.list),v(this,"object",A.object),v(this,"color",A.color),v(this,"colors",A.colors),console.log("add",this)}add(){this.list.push(Math.random()*100)}addToInnerList(e){this.object.objectList[e].innerList.push(Math.random()*10)}addObject(){this.object.objectList.push({a:"a",b:"b",c:"c",id:Math.random()*10,innerList:[1,2,3,4]})}}v(I,"config",{selector:"my-loop",template:xt,styles:`
    .loop-section-container {
      padding: 1rem;
      border-radius: 0.75rem;
      border-width: 1px;
      max-width: 680px;
      margin: 1em auto;
    }
    .input-btn-inline {
      display: flex;
      margin-bottom: 0.5rem;
      margin-top: 1rem;
      gap: 0.5rem;
    } 
    
    .input-btn-inline .input {
      flex: 1 1 0%;
    }
    
    .loop-list-margin-y {
      margin-top: 0.5rem;
      margin-bottom: 0.5rem;
    }
    
    `});I.register(I);function R(t,e,r){return e=At(e),e in t?Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}):t[e]=r,t}function At(t){var e=wt(t,"string");return typeof e=="symbol"?e:String(e)}function wt(t,e){if(typeof t!="object"||!t)return t;var r=t[Symbol.toPrimitive];if(r!==void 0){var n=r.call(t,e||"default");if(typeof n!="object")return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return(e==="string"?String:Number)(t)}const Ot=`<div class="example-section-container bg-{{this.color}}-100 ">\r
  <h1>Slots:</h1>\r
  <h3>\r
    <slot name="el-primary">Default Slot</slot>\r
  </h3>\r
  <div>\r
    <slot name="el-secondary">Secondary slot slot</slot>\r
  </div>\r
</div>\r
\r
<div class="example-section-container bg-{{this.color}}-100 ">\r
  <h1>Data binding:</h1>\r
  <p>{{this.dataBinding}}</p>\r
  <input [model]="this.dataBinding" class="input" />\r
\r
  <p>Background color: {{this.color}}</p>\r
  <select [model]="this.color" class="input" >\r
    <option [value]="color" *for="color of this.colors">{{color}}</option>\r
  </select>\r
\r
  <slot name="el-input">\r
    Input slot\r
  </slot>\r
</div>\r
\r
<div class="example-section-container bg-{{this.color}}-100 ">\r
  <h1>Actions:</h1>\r
  <p>Counter: <b>{{this.counter}}</b><p>\r
  <div>\r
    <button class="btn" (click)="this.increment">+</button>\r
    <button class="btn" (click)="this.decrement">-</button>\r
  </div>\r
</div>\r
\r
<div class="example-section-container bg-{{this.color}}-100 ">\r
  <h1>Loops:</h1>\r
  <div>\r
    <button class="btn" (click)="this.addPost">Add post</button>\r
\r
  </div>\r
  <article *for="post of this.posts" class="bg-white example-section-container">\r
    <h4>#{{post.id}} {{post.title}}</h4>\r
    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores modi quia incidunt dignissimos cupiditate iure repellat aliquam iusto, magni eius asperiores praesentium in recusandae sint esse ad tenetur at perspiciatis.</p>\r
    <div>\r
\r
      <img src="http://placehold.it/" *for="images of post.images" class="image"/>\r
    </div>\r
  </article>\r
</div>\r
\r
<div class="example-section-container bg-{{this.color}}-100 ">\r
  <h1>Conditional Rendering:</h1>\r
  <p><b>Is if condition met?:</b> {{this.condition ? 'YUP' : 'NOPE' }}</p>\r
\r
  <p>\r
    <input\r
      type="checkbox"\r
      [model]="this.condition"\r
      name="check"\r
      class="toggle"\r
      checked="{{this.condition}}"\r
    />\r
  </p>\r
\r
  <br />\r
  <div\r
    *if="this.condition"\r
    class="border-gray-100 bg-white conditional-container"\r
  >\r
    IT SHOWS\r
  </div>\r
</div>\r
`;class M extends P{constructor(){super(),R(this,"props",{dataBinding:"Sample data binding",condition:!0,counter:0,color:"blue",colors:["red","white","green","blue","indigo","purple","yellow","orange"],posts:[{id:1,title:"Sample post 1",images:[1,2,3]},{id:2,title:"Sample post 2",images:[1,2,3]},{id:3,title:"Sample post 3",images:[1,2,3]},{id:4,title:"Sample post 4",images:[1,2,3]}]})}addPost(){this.posts.push({id:"x",title:"XXXXXXX",images:[1,2,3]})}increment(){this.counter++}decrement(){this.counter--}}R(M,"config",{selector:"el-example",template:Ot,styles:` 
    .example-section-container { 
      padding: 1rem;
      border-radius: 0.75rem;
      border-width: 1px; 
      max-width: 680px;    
      margin: 1em auto; 
    } 
    .conditional-container{
      padding: 0.5em 1em; 
      border-radius: 0.75rem;
      border-width: 1px;  
    } 
    .input{
      width: -webkit-fill-available
    }
    `});M.register(M);function J(t,e,r){return e=Pt(e),e in t?Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}):t[e]=r,t}function Pt(t){var e=$t(t,"string");return typeof e=="symbol"?e:String(e)}function $t(t,e){if(typeof t!="object"||!t)return t;var r=t[Symbol.toPrimitive];if(r!==void 0){var n=r.call(t,e||"default");if(typeof n!="object")return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return(e==="string"?String:Number)(t)}class q extends P{constructor(){super(),J(this,"props",{model:"Default model"})}}J(q,"config",{selector:"el-input",template:`
    <div >
    <p>{{this.model ? this.model : 'Nothing to show here' }}</p>
    <input class="input" [model]="this.model" />
    
    </div>`,styles:` 
    .example-section-container { 
      padding: 1rem;
      border-radius: 0.75rem;
      border-width: 1px;
      max-width: 680px; 
      margin: 1em auto;
    } 
    .conditional-container{
      padding: 0.5em 1em;
      border-radius: 0.75rem;
      border-width: 1px;
    }
    .input{
      width: -webkit-fill-available
    }
    `});q.register(q);function k(t,e,r){return e=St(e),e in t?Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}):t[e]=r,t}function St(t){var e=Ct(t,"string");return typeof e=="symbol"?e:String(e)}function Ct(t,e){if(typeof t!="object"||!t)return t;var r=t[Symbol.toPrimitive];if(r!==void 0){var n=r.call(t,e||"default");if(typeof n!="object")return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return(e==="string"?String:Number)(t)}const Lt=`<button class="btn bg-{{this.color}}-200" (click)="callback">\r
  <span>\r
    <slot name="btn-primary">Primary Btn slot</slot>\r
  </span>\r
</button>\r
`;class H extends P{constructor(){super(),k(this,"props",{color:"white"}),k(this,"color","white")}callback(){this.emit("xxxx"),this.dispatchEvent(new CustomEvent("emit",{})),this.parentElement.dispatchEvent(new CustomEvent("childComponentCallbackCalled",{}))}emit(e){console.log("vai mandar",this),this.__actions.emit({str:"ajnsjnsjns",cb:e})}}k(H,"config",{selector:"my-btn",template:Lt,styles:`  
    `});H.register(H);
