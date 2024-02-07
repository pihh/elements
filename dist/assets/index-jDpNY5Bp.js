(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))n(o);new MutationObserver(o=>{for(const i of o)if(i.type==="childList")for(const l of i.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&n(l)}).observe(document,{childList:!0,subtree:!0});function r(o){const i={};return o.integrity&&(i.integrity=o.integrity),o.referrerPolicy&&(i.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?i.credentials="include":o.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function n(o){if(o.ep)return;o.ep=!0;const i=r(o);fetch(o.href,i)}})();function X(e,t="{{",r="}}"){let n=[];try{n=e.split(t).slice(1).map(o=>o.split(r)[0])}catch{}return n||[]}const gt=function(e){let t=e.innerHTML,r=X(t);for(let n of r){const o="{{"+n+"}}",i="{{"+n.replaceAll(" ","")+"}}";t=t.replaceAll(o,i)}return e.innerHTML=t,e};function H(e){return e.toUpperCase()!=e.toLowerCase()}function z(e,t="{{",r=[]){let n=e.indexOf(t),o=e;return n>-1?(r.push(n),o=o.split(""),o[n]="*",o[n+1]="*",o=o.join(""),z(o,t,r)):r}const et=function(e,t,r="this"){let n=[],o=t.split("{{").map(l=>l.trim()).filter(l=>l.length>0).map(l=>l.split("}}")[0]);function i(l,s=[],c=r,f=[]){let d=Object.keys(l).filter(u=>u.indexOf("__")==-1);for(let u of d)for(let a of o){let p=Math.max(-1,a.indexOf(c+"."+u),a.indexOf(c+"[")),h=c+"."+u.replace("]","");u==Number(u)&&(h=c+"["+u+"]"),p>-1&&(typeof l[u]!=="object"?n.push(h):(n.push(h),i(l[u],s,c+"."+u,f=[])))}}return i(e,o),o[1]&&o[1].indexOf(r+".")>-1&&n.push(o[1]),n.sort((l,s)=>l>s).filter(l=>Math.max(-1,t.indexOf(l+" "),t.indexOf(l+"}"),t.indexOf("?"))>-1)},yt=function(e,t,r){const n=r.replaceAll("(","").replaceAll(")","");if(e.__events.indexOf(n)>-1){console.warn({element:e,eventName:n},"Was already added");return}let o=e.getAttribute(r);e.__events.push(n),e.removeAttribute(n);let i=!1;t.__connections.push(()=>{if(i)return;i=!0;let l=function(s){console.log(t,e),console.log(n,s,t,o)};if(o.indexOf("(")==-1)o=o.replace("this.",""),l=function(s){console.log(t,e),e.controller[o](s)};else{let s=o.split("(")[0].trim().replace("this.",""),c=o.split("(")[1].split(")")[0].trim().split(",").filter(d=>d.length>0),f=c.indexOf("$event");l=function(d){let u=c.map(a=>(a=="$event"?a=d:a=="$index"?a=e.$index:t.hasOwnProperty(a)&&(a=t[a]),a));f==-1&&u.push(d),e.controller[s](...u)}}e.addEventListener(n,l)})},vt=function(e,t,r){try{const n=r.replace("@","").toLowerCase(),o=t.getAttribute(r).replaceAll("this.","").split("(").map(i=>i.trim()).filter(i=>i.length>0)[0];t.__actions=t.__actions||{},t.__actions.hasOwnProperty(n)||(t.__actions[n]=function(i){const l=new CustomEvent(n,{detail:{data:i}});e.dispatchEvent(l)}),(!e.__events||e.__events.indexOf(n)==-1)&&(e.__events||(e.__events=[]),e.__events.push(n),e.addEventListener(n,function(i){console.log("did ear this ",{$event:i,parent:e,eventName:n,action:o});const s=Function("return this."+o+"(...arguments)").call(e,i);console.log(s)}))}catch(n){console.warn(n)}},lt=function(e){return e.replaceAll("this.","").replaceAll("[",".").replaceAll("]",".").replaceAll("..",".").trim().split(".").slice(0).map(t=>(t[0]=="."&&(t=t.slice(1)),t.endsWith(".")&&(t=t.slice(0,-1)),t)).filter(t=>t.length>0)},V=function(e,t,r){let n=typeof r;["boolean","number"].indexOf(n)==-1&&(r="'"+r+"'"),r!==$(e,t)&&Function("return `${this."+t+"="+r+"}`").call(e)},$=function(e,t){try{return Function("return this."+t).call(e)}catch{return Function("return `${this."+t+"}`").call(e)}},xt=function(e,t,r,n){const o=e.getAttribute(t).replaceAll("this.",""),i=e.nodeName||"INPUT",l=e.getAttribute("type"),s=[o],c=l==="checkbox"?"checked":"value";for(let f of s.map(d=>d.replace("this.","").trim())){const d=function(u){if(l==="checkbox"){let a=e.getAttribute("checked");u&&!a?e.setAttribute("checked",!0):!u&&a&&e.removeAttribute("checked")}else e.getAttribute("value")!==u&&e.setAttribute(c,$(r,o))};e.__subscribe(f,r,n,d),d($(r,o))}if(i=="SELECT"){const f=function(a,p){[...a.querySelectorAll("option")].forEach(h=>{p==h.value?h.setAttribute("selected",!0):h.removeAttribute("selected")})},d=function(a){[...a.querySelectorAll("option")].forEach(p=>{p.__didInitialize=p.__didInitialize||[],p.__didInitialize.push(()=>{f(a,$(r,o))})})};let u=$(r,o)||void 0;e.addEventListener("change",a=>{a.target.value!==u&&(u=a.target.value,V(r,o,a.target.value))}),d(e),f(e,$(r,o))}else if(l=="checkbox"){let f=$(r,o)||!1;e.addEventListener("change",d=>{d.target.checked!=f&&(f=d.target.checked,V(r,o,d.target.checked))})}else{let f=$(r,o)||"";e.addEventListener("keyup",d=>{d.target.value!==f&&(f=d.target.value,V(r,o,d.target.value))})}e.removeAttribute(t)};function ct(e){var t=[];if(e)for(e=e.firstChild;e!=null;)e.nodeType==3?t[t.length]=e:t=t.concat(ct(e)),e=e.nextSibling;return t}const At={__subscribe:function(e,t,r,n){if(e.indexOf("__")==0)return;const o=r(e,n);this.__subscription,o.event,!(this.__subscriptions.map(i=>i.subscription).indexOf(e)>-1)&&(this.__subscriptions.push({unsubscribe:o.unsubscribe,subscription:e,scope:t,connection:r}),this.__subscriptions.push({unsubscribe:o.unsubscribe,subscription:o.event,scope:t,connection:r}),n())},__unsubscribe:function(){this.__subscriptions.map(e=>e.unsubscribe()),this.__subscriptions=[]}},q=function(e){if(e.__didSetup)return e;e.controller||(e.controller=e);for(let t of["__subscriptions","__events","__didInitialize"])e.hasOwnProperty(t)||(e[t]=[]);for(let t of["__actions"])e.hasOwnProperty(t)||(e[t]={});for(let t of["__subscribe","__unsubscribe"])e.hasOwnProperty(t)||(e[t]=At[t]);return e.__didSetup=!0,e},wt=function(e,t,r){const n="`"+e.textContent+"`",o=n.replaceAll("{{","${").replaceAll("}}","}"),i=et(t,n);e=q(e);for(let l of i.map(s=>s.replace("this.","").trim())){const s=function(){const f=Function("return "+o).call(t);e.textContent=f};e.__subscribe(l,t,r,s)}},at=function(e,t,r){const n=ct(e).filter(o=>o.textContent.indexOf("{{")>-1);for(let o of n)o.controller||(o.controller=e.controller),wt(o,t,r)},ut=function(e,t){const r=q(document.createComment("["+t+"-container]"));let n=e.getAttribute(t);return n.indexOf("{{")==-1&&(n="{{"+n+"}}"),e.before(r),e.removeAttribute(t),{$comment:r,query:n}},ft=function(e,t,r,n={}){if(n={customAttributes:[],level:0,...n},e.__forOperationBound)return;e.__forOperationBound=!0;const{$comment:o,query:i}=ut(e,"*for"),l=i.split(";")[0].split(" of ").map(b=>b.trim());let s=l[0].replaceAll("{{","").trim(),c=l[1].replaceAll("}}","").trim().split(";")[0].trim(),f="__$index"+n.level+"__";const d=i.split(";")[1];d&&d.indexOf("$index")>-1&&(f=d.split("=")[0].trim());let u,a,p=document.createElement("div");if(document.body.appendChild(p),p.appendChild(e),a=p.cloneNode(!0),u=p.cloneNode(!0).innerHTML.trim(),e.remove(),p.remove(),!s||!c)return;const h=X(u);for(let b of h){let _="{"+b+"}",O=z(_,s);for(let A of O)if(A>-1){let x=_.charAt(A-1),D=_.charAt(A+s.length);if(!H(x)&&!H(D)){_=_.split("");let R=_.slice(0,A),U=_.slice(A+s.length);_=R.join("")+c+"["+f+"]"+U.join("")}}u=u.replaceAll("{"+b+"}",_)}const m=X(u,'*for="','"');for(let b of m){let _='*for="'+b+'"',O=z(_,s);for(let A of O)if(A>-1){let x=_.charAt(A-1),D=_.charAt(A+s.length);if(!H(x)&&!H(D)){_=_.split("");let R=_.slice(0,A),U=_.slice(A+s.length);_=R.join("")+c+"["+f+"]"+U.join("")}}u=u.replaceAll('*for="'+b+'"',_)}o.__forLoopContainer=o.__forLoopContainer||[],o.__forLoopItemFactory=function(b){if(o.__forLoopContainer.length<=b){let _=a.cloneNode(!1);_.innerHTML=u.replaceAll(f,b),_=_.firstElementChild,o.after(_),o.__forLoopContainer.push(_),q(_),pt(_,t,r,{level:n.level+1,reset:!0}),at(_,t,r,{level:n.level+1,reset:!0})}};const v=function(b){b!==void 0&&o.__forLoopItemFactory(b-1)},y=c.replaceAll("this.","").trim()+".length",g=$(t,c.replace("this.",""));o.__subscribe(y,t,r,v);for(let b=0;b<g.length;b++)o.__forLoopItemFactory(b)},$t=function(e,t,r){const{$comment:n,query:o}=ut(e,"*if");let i="`"+o.replaceAll("{{","${").replaceAll("}}","}")+"`";const l=et(t,o);for(let s of l.map(c=>c.replace("this.","").trim())){const c=function(){const d=Function("return "+i).call(t);["true",!0].indexOf(d)>-1?e.isConnected||n.after(e):e.isConnected&&e.remove()};e.__subscribe(s,t,r,c),c()}},pt=function(e,t,r,n={reset:!1}){n={reset:!1,customAttributes:[],...n},n.reset&&(e.__didSetup=!1);let o=[...e.querySelectorAll("*")].filter(l=>l.getAttributeNames().indexOf("*for")>-1);for(;o.length>0;){let l=o[0];l.parent=e,l.controller=e.controller,ft(l,t,r,n),o=[...e.querySelectorAll("*")].filter(s=>s.getAttributeNames().indexOf("*for")>-1)}let i=[...e.querySelectorAll("*")];n.reset&&(e.__didSetup=!1),e=q(e);for(let l of i)l.controller||(l.controller=e),l.parent=e,l=q(l),ot(l,t,r);ot(e,t,r)},ot=function(e,t,r){const n=e.getAttributeNames();for(let o of n){const i="`"+e.getAttribute(o)+"`";if(o.indexOf("*")==0){if(o=="*if")$t(e,t,r);else if(o=="*for"){ft(e,t,r),e.innerHTML="";for(let c of e.getAttributeNames())e.removeAttribute(c)}}else if(o=="model"||o=="[model]")xt(e,o,t,r);else if(!(o.indexOf("@")>-1)){if(o.indexOf("(")>-1)yt(e,t,o);else if(i.indexOf("{{")==-1)continue}const l=i.replaceAll("{{","${").replaceAll("}}","}"),s=et(t,i);for(let c of s.map(f=>f.replace("this.","").trim())){const f=function(){const u=Function("return "+l).call(t);e.setAttribute(o,u)};e.__subscribe(c,t,r,f)}}};function nt(e,t,r){return t=Ot(t),t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function Ot(e){var t=Pt(e,"string");return typeof t=="symbol"?t:String(t)}function Pt(e,t){if(typeof e!="object"||!e)return e;var r=e[Symbol.toPrimitive];if(r!==void 0){var n=r.call(e,t||"default");if(typeof n!="object")return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return(t==="string"?String:Number)(e)}let Ct=class{constructor(t,r){return this._preproxy=new WeakMap,this._handler=r,this.proxify(t,[])}makeHandler(t){let r=this;return{get(n,o,i){return r._handler.get?r._handler.get(n,[...t,o],i):n[o]},set(n,o,i,l){return typeof i=="object"&&(i=r.proxify(i,[...t,o])),n[o]=i,r._handler.set&&r._handler.set(n,[...t,o],i,l),!0},deleteProperty(n,o){if(Reflect.has(n,o)){r.unproxy(n,o);let i=Reflect.deleteProperty(n,o);return i&&r._handler.deleteProperty&&r._handler.deleteProperty(n,[...t,o]),i}return!1}}}unproxy(t,r){this._preproxy.has(t[r])&&(t[r]=this._preproxy.get(t[r]),this._preproxy.delete(t[r]));for(let n of Object.keys(t[r]))typeof t[r][n]=="object"&&this.unproxy(t[r],n)}proxify(t,r){for(let o of Object.keys(t))typeof t[o]=="object"&&(t[o]=this.proxify(t[o],[...r,o]));let n=new Proxy(t,this.makeHandler(r));return this._preproxy.set(n,t),n}};const S=(e=[])=>(Array.isArray(e)&&(e=e.join(".")),e=e.replaceAll("[",".").replaceAll("]",".").replaceAll("..",".").trim(),e.endsWith(".")&&(e=e.slice(0,-1)),e);let St=class{constructor(){nt(this,"events",{}),nt(this,"trackTimeout",void 0)}subscribe(t,r){return t=S(t),this.events[t]||(this.events[t]=[]),this.events[t].push(r),(()=>{let o=!0;return{event:t,callback:r,render:()=>{if(o&&this.events[t])for(let i of this.events[t])i()},unsubscribe:()=>{o&&(o=!1,this.events[t]&&(this.events[t]=this.events[t].filter(i=>i!==r)))}}})()}publish(t,r){console.log("PUBLISH",t,r),this.events[t]?this.events[t].forEach(n=>n(r)):console.log("no events subscribed yet:",t)}unsubscribe(t){}track(){clearTimeout(this.trackTimeout),this.trackTimeout=setTimeout(()=>{console.log("---------------------------"),console.log("Subscription tracking".toUpperCase()),console.log("---------------------------");let t=0;for(let r of Object.keys(this.events)){let n=this.events[r].length;console.log("Sub:",r,n),t+=n}console.log(""),console.log("TOTAL: ",t+" active subscriptions"),console.log("-------------------------------------")},100)}};const Tt=function(e){const t=new St;return e=new Ct(e,{set(o,i,l,s){try{let c=S(i),f=typeof o[c];return c.indexOf("__")==0||(f!=="object"||Array.isArray(o[c]))&&t.publish(S(i),l),!0}catch(c){console.warn(c),console.log(i,S(i),l)}},deleteProperty(o,i){delete t.events[S(i)]},getPath(o,i){console.log("getPath",i.split("."),o)}}),[e,function(o,i){return t.subscribe(S(o),i)},function(){for(let o of Object.keys(t.events))t.publish(o)},t]},Et=function(e={}){let[t,r,n]=Tt(e);return{scope:t,connect:r,render:n}},Lt=function(e,t,r={}){r={firstConnection:!!e.controller,...r};const{scope:n,connect:o,render:i,pubsub:l}=Et(t);e=gt(e),e.props=n,e.controller=e.controller||e,e.pubsub=l,e.render=i;for(let s of Object.keys(e.props))e.__defineSetter__(s,function(c){return e.props[s]=c,!0}),e.__defineGetter__(s,function(){return e.props[s]});return pt(e,n,o),at(e,n,o),e.__onConnect(),{element:e,scope:n}},Nt=function(e){const t=new Map(Array.from(e.querySelectorAll("slot").values()).map(n=>[n.name,n])),r=Array.from(e.querySelectorAll(":scope > *[slot]").values()).map(n=>[n.slot,n]);for(const[n,o]of r){const i=t.get(n);i&&(o.removeAttribute("slot"),i.parentElement.replaceChild(o,i))}},kt=function(e){Array.from(e.querySelectorAll("slot")).forEach(t=>t.removeAttribute("slot"))};function dt(e,t,r){return t=It(t),t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function It(e){var t=qt(e,"string");return typeof t=="symbol"?t:String(t)}function qt(e,t){if(typeof e!="object"||!e)return e;var r=e[Symbol.toPrimitive];if(r!==void 0){var n=r.call(e,t||"default");if(typeof n!="object")return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return(t==="string"?String:Number)(e)}let ht=class B{constructor(){if(dt(this,"__registry",{}),B.instance)return B.instance;B.instance=this}register(t,r){const{selector:n,template:o,styles:i,shadow:l}={...t};if(!this.__registry.hasOwnProperty(n)&&customElements.get(n)===void 0){const s=document.head,c=document.createElement("style");c.innerHTML=i,this.__registry[n]={component:r,template:o,styles:c,shadow:l},l||s.appendChild(c),customElements.define(t.selector,r)}}setup(){}load(t){}};dt(ht,"instance",null);const Mt=new ht;let K=class extends HTMLElement{static register(t){const r={shadow:!1,template:`<h1>${t.config.selector} is registered</h1>`,styles:"",...t.config};Mt.register(r,t)}constructor(){super(),this.__config=this.constructor.config,this.__template=this.constructor.config.template,this.__style=this.constructor.config.styles,this.__templateId="template-container-"+this.__config.selector,this.__templateContent=this.__getTemplateElement(!0),this.dataset.connected||(this.appendChild(this.__templateContent),this.dataset.connected="true"),Nt(this),kt(this),this.__template=this.innerHTML}__getTemplateElement(t=!1){let r=this.__templateElement;if(!r){if(r=document.querySelector("#"+this.__templateId),!r){const n=document.querySelector("head");r=document.createElement("template"),r.setAttribute("id",this.__templateId),r.innerHTML=this.__template,n.appendChild(r)}this.__templateElement=r}return t&&(r=this.__templateElement.content.cloneNode(!0)),r}__extractAttributes(){const t=this.props||{};t.__connections=[],this.__onConnect=()=>{try{let o=this.__connections||t.__connections||[];o.map(i=>i()),o=[];for(let i of this.querySelectorAll("*")){const l=i.getAttributeNames().filter(s=>s.indexOf("@")>-1);for(let s of l)vt(this,i,s)}}catch(o){console.log(this,t,o)}};let r=Object.keys(t||{});const n=this.getAttributeNames().filter(o=>r.indexOf(o)>-1);for(let o of n){t[o]=this.getAttribute(o);try{t[o]=JSON.parse(t[o])}catch{isNaN(t[o])?["false",!1].indexOf(t[o])>-1?t[o]=!1:["true",!0].indexOf(t[o])>-1&&(t[o]=!0):t[o]=Number(t[o])}}return t}connectedCallback(){if(!this.__initialSetup){this.__initialSetup=!0;const t=this.__extractAttributes();Lt(this,t)}}};const I={list:[1,2,3],color:"indigo",colors:["red","green","yellow","indigo","blue"],object:{title:"Made with ❤️ by pihh",objectList:[{a:"a",b:"b",c:"c",id:0,innerList:[1,2,3,4]},{a:"a",b:"b",c:"c",id:1,innerList:[1,2,3,4]},{a:"a",b:"b",c:"c",id:2,innerList:[1,2,3,4]}].map(e=>(e.a=e.a+"_"+e.id,e.b=e.b+"_"+e.id,e.c=e.c+"_"+e.id,e))}};function T(e,t,r){return t=jt(t),t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function jt(e){var t=Ht(e,"string");return typeof t=="symbol"?t:String(t)}function Ht(e,t){if(typeof e!="object"||!e)return e;var r=e[Symbol.toPrimitive];if(r!==void 0){var n=r.call(e,t||"default");if(typeof n!="object")return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return(t==="string"?String:Number)(e)}const Vt=`<section\r
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
`;class Y extends K{constructor(){super(),T(this,"props",I),T(this,"list",I.list),T(this,"object",I.object),T(this,"color",I.color),T(this,"colors",I.colors),console.log("add",this)}add(){this.list.push(Math.random()*100)}addToInnerList(t){this.object.objectList[t].innerList.push(Math.random()*10)}addObject(){this.object.objectList.push({a:"a",b:"b",c:"c",id:Math.random()*10,innerList:[1,2,3,4]})}}T(Y,"config",{selector:"my-loop",template:Vt,styles:`
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
    
    `});Y.register(Y);function bt(e,t,r){return t=Bt(t),t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function Bt(e){var t=Ft(e,"string");return typeof t=="symbol"?t:String(t)}function Ft(e,t){if(typeof e!="object"||!e)return e;var r=e[Symbol.toPrimitive];if(r!==void 0){var n=r.call(e,t||"default");if(typeof n!="object")return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return(t==="string"?String:Number)(e)}const Kt=`<div class="example-section-container bg-{{this.color}}-100 ">\r
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
    <div class="gallery">\r
\r
      <img src="https://placehold.co/150x100/png" *for="images of post.images" class="image"/>\r
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
`;class G extends K{constructor(){super(),bt(this,"props",{dataBinding:"Sample data binding",condition:!0,counter:0,color:"blue",colors:["red","white","green","blue","indigo","purple","yellow","orange"],posts:[{id:1,title:"Sample post 1",images:[1,2,3]},{id:2,title:"Sample post 2",images:[1,2,3]},{id:3,title:"Sample post 3",images:[1,2,3]},{id:4,title:"Sample post 4",images:[1,2,3]}]})}addPost(){this.posts.push({id:"x",title:"XXXXXXX",images:[1,2,3]})}increment(){this.counter++}decrement(){this.counter--}}bt(G,"config",{selector:"el-example",template:Kt,styles:""});G.register(G);function mt(e,t,r){return t=Dt(t),t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function Dt(e){var t=Rt(e,"string");return typeof t=="symbol"?t:String(t)}function Rt(e,t){if(typeof e!="object"||!e)return e;var r=e[Symbol.toPrimitive];if(r!==void 0){var n=r.call(e,t||"default");if(typeof n!="object")return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return(t==="string"?String:Number)(e)}class J extends K{constructor(){super(),mt(this,"props",{model:"Default model"})}}mt(J,"config",{selector:"el-input",template:`
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
    `});J.register(J);function Z(e,t,r){return t=Ut(t),t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function Ut(e){var t=Qt(e,"string");return typeof t=="symbol"?t:String(t)}function Qt(e,t){if(typeof e!="object"||!e)return e;var r=e[Symbol.toPrimitive];if(r!==void 0){var n=r.call(e,t||"default");if(typeof n!="object")return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return(t==="string"?String:Number)(e)}const Wt=`<button class="btn bg-{{this.color}}-200" (click)="callback">\r
  <span>\r
    <slot name="btn-primary">Primary Btn slot</slot>\r
  </span>\r
</button>\r
`;class tt extends K{constructor(){super(),Z(this,"props",{color:"white"}),Z(this,"color","white")}callback(){this.emit("xxxx"),this.dispatchEvent(new CustomEvent("emit",{})),this.parentElement.dispatchEvent(new CustomEvent("childComponentCallbackCalled",{}))}emit(t){console.log("vai mandar",this),this.__actions.emit({str:"ajnsjnsjns",cb:t})}}Z(tt,"config",{selector:"my-btn",template:Wt,styles:`  
    `});tt.register(tt);function P(e,t="{{",r="}}"){let n=[];try{n=e.split(t).slice(1).map(o=>o.split(r)[0])}catch{}return n||[]}function M(e){return e.toUpperCase()!=e.toLowerCase()}function C(e,t="{{",r=[]){let n=e.indexOf(t),o=e;return n>-1?(r.push(n),o=o.split(""),o[n]="*",o[n+1]="*",o=o.join(""),C(o,t,r)):r}const F=function(e,t=[]){const r=P(e);for(let n of r){const o=n.split("this.").map(i=>i.replaceAll(" ","")).filter(i=>i.length>0);for(let i of o){let l=i.split(""),s=!1;for(let c=0;c<l.length;c++){const f=l[c];if(!M(f)){if(f=="."||f=="["||f=="]")continue;if(isNaN(f)){const d=l.slice(0,c).join("");t.indexOf(d)==-1&&t.push(d),s=!0;break}else continue}}if(!s){const c=i.trim();t.indexOf(c)==-1&&t.push(c)}}}return t},it=function(e,t,r,n){let o=e,i=e.charAt(t+r.length),l=e.charAt(t-1),s=t==0||!M(l)&&l!=".",c=t+r.length>e.length||!M(i);if(s&&c){o=e.split("");let f=e.slice(0,t),d=e.slice(t+r.length);o=f+n+d}return o},Xt=function(e,t,r){let n=[];n=P(e);for(let o of n){let i=o,l=C(o,t);if(l.length>0){l.reverse();for(let s of l)i=it(i,s,t,r)}e=e.replaceAll("{{"+o+"}}","{{"+i+"}}")}n=P(e,"(",")");for(let o of n){let i=o,l=C(o,t);if(l.length>0){l.reverse();for(let s of l)i=it(i,s,t,r)}e=e.replaceAll("("+o+")","("+i+")")}return e};function rt(e){var t=[];if(e)for(e=e.firstChild;e!=null;)e.nodeType==3?t[t.length]=e:t=t.concat(rt(e)),e=e.nextSibling;return t}function Q(e,t,r){return t=zt(t),t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function zt(e){var t=Yt(e,"string");return typeof t=="symbol"?t:String(t)}function Yt(e,t){if(typeof e!="object"||!e)return e;var r=e[Symbol.toPrimitive];if(r!==void 0){var n=r.call(e,t||"default");if(typeof n!="object")return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return(t==="string"?String:Number)(e)}class Gt{constructor(){Q(this,"__id",0),Q(this,"__parseTemplateString",function(t,r,n,o){let i=t,l=t.charAt(r+n.length),s=t.charAt(r-1),c=r==0||!isChar(s)&&s!=".",f=r+n.length>t.length||!isChar(l);if(c&&f){i=t.split("");let d=t.slice(0,r),u=t.slice(r+n.length);i=d+o+u}return i}),Q(this,"__mapTemplateConnections",function(t){let r=t,n=[...r.querySelectorAll("*")];const o={};o.keywords={},o.actions={},o.operations={};let i=n.filter(s=>s.getAttributeNames().indexOf("*for")>-1);for(let s of i){const c=setOperationFor(s);let f=N(c.parentElement),d=c.parentElement,u=0;for(let h of d.childNodes){if(h==c)break;u++}o.operations.hasOwnProperty("*for")||(o.operations["*for"]=[]),o.operations["*for"].push({attribute:"comment",type:"*for",query:void 0,originalQuery:void 0,selector:f,nodeIndex:u,setup:function(h){try{let m=h.controller.parentElement.querySelector(f).childNodes[u];m.controller=h,m.__loopItems=[],m.__visibleItems=[],m.callback=v=>{c.__forLoopManager(v.colors,m)},h.controller.__connect("colors.length",function(v){console.log("cb",h.colors),m.callback(h)}),m.callback(h.colors.length)}catch(m){console.warn(m)}}})}r=t.content,n=[...r.querySelectorAll("*")];for(let s of n){const c=s.getAttributeNames(),f=c.filter(a=>a.indexOf("*")==0),d=c.filter(a=>a.indexOf("@")>-1),u=c.filter(a=>s.getAttribute(a).indexOf("{{")>-1);if(f.length>0||d.length>0||u.length>0){let a=N(s);a||(s.setAttribute("id",s.getAttribute("id")||"el-component-"+this.__id+Date.now()),a=s.nodeName+"#"+s.id,this.__id++);for(let p of d){o.actions.hasOwnProperty(a)||(o.actions[a]=[]);let h=p.replace("@","").trim(),m=s.getAttribute(p).trim().replace("this.",""),v=s.getAttribute(p).replaceAll("{{","${").replaceAll("}}","}");o.actions[a].push({type:"action",action:p,sourceAttribute:h,targetAttribute:m,query:v,selector:a,setup:function(y){let g=y.controller.parentElement.querySelector(a);if(p.indexOf("model")>-1){const b=addModelListener(y,g,m);return g.removeAttribute(p),b}else{let b=v.trim().split("(").map(x=>x.trim()).filter(x=>x.length>0),_=b[0].replace("this.",""),O=[];b.length>1&&(O=b[1].split(")").map(x=>x.trim()).filter(x=>x.length>0)[0].split(",").map(x=>x.trim()));const A=()=>{addCustomListener(y,g,p.replaceAll("@",""),_,O)};return A(y,g,p.replaceAll("@","")),g.removeAttribute(p),A}}})}for(let p of u){const h=s.getAttribute(p),m=h.replaceAll("{{","${").replaceAll("}}","}");let v=F(h);for(let y of v)o.keywords.hasOwnProperty(y)||(o.keywords[y]=[]),o.keywords[y].push({type:"attribute",attribute:p,query:m,selector:a,callback:function(g){try{let b=g.parentElement.querySelector(a);console.log({instance:g.parentElement,element:b,selector:a}),_t(g.controller,b.parentElement,p,m)}catch(b){console.log(g),console.log(g.parentElement),console.warn(b)}}})}}}return rt(t.content).filter(s=>s.textContent.indexOf("{{")>-1).forEach(s=>{let c=N(s.parentElement),f=s.parentElement,d=(f==null?void 0:f.childNodes)||[],u=0;for(let a of d){if(a.textContent.indexOf("{{")>-1){const p=a.textContent,h=u;let m=F(p);const v=p.replaceAll("{{","${").replaceAll("}}","}");for(let y of m)o.keywords.hasOwnProperty(y)||(o.keywords[y]=[]),o.keywords[y].push({attribute:"textNode",type:"text",query:v,originalQuery:p,selector:c,nodeIndex:h,callback:function(g){try{let b=g.controller.parentElement.querySelector(c).childNodes[h];updateTextNode(g,b,v)}catch(b){console.warn(b)}}})}u++}}),o})}__parseTemplatePointers(t,r){console.log({template:t,instance:r});let n=[];const o=r.props||[],i=r.actions||[],l=document.createElement("template"),s=document.querySelector("head");n=P(t);for(let c of n){let f=c;for(let d of i){let u=C(c,d);if(u.length>0){u.reverse();for(let a of u)f=this.__parseTemplateString(f,a,d,"this.parent."+d)}}t=t.replaceAll("{{"+c+"}}","{{"+f+"}}")}n=P(t);for(let c of n){let f=c;for(let d of o){let u=C(c,d);if(u.length>0){u.reverse();for(let a of u)f=this.__parseTemplateString(f,a,d,"this."+d)}}t=t.replaceAll("{{"+c+"}}","{{"+f+"}}")}return l.innerHTML=t,s.appendChild(l),l}__initAndAppendConnections(t,r){console.log(t);const n=document.createElement("div");document.head.appendChild(n),n.innerHTML=t.outerHTML;const o=this.__parseTemplatePointers(n.innerHTML,r),i=this.__mapTemplateConnections(o,r);console.log({template:t,connections:i,$template:o});for(let l of Object.keys(i.operations))for(let s of i.operations[l])s.setup(r);for(let l of Object.keys(i.keywords))for(let s of i.keywords[l]){let c=r.controller.__connect(lt(l),()=>s.callback(r));r.controller.__subscriptions.push(c),s.callback(r)}for(let l of Object.keys(i.actions))for(let s of i.actions[l])s.setup(r);n.remove()}}const Jt={__subscribe:function(e,t,r,n){if(e.indexOf("__")==0)return;const o=r(e,n);this.__subscription,o.event,!(this.__subscriptions.map(i=>i.subscription).indexOf(e)>-1)&&(this.__subscriptions.push({unsubscribe:o.unsubscribe,subscription:e,scope:t,connection:r}),this.__subscriptions.push({unsubscribe:o.unsubscribe,subscription:o.event,scope:t,connection:r}),n())},__unsubscribe:function(){this.__subscriptions.map(e=>e.unsubscribe()),this.__subscriptions=[]}},Zt=function(e){if(e.__didSetup)return e;e.controller||(e.controller=e);for(let t of["__subscriptions","__events","__didInitialize"])e.hasOwnProperty(t)||(e[t]=[]);for(let t of["__actions"])e.hasOwnProperty(t)||(e[t]={});for(let t of["__subscribe","__unsubscribe"])e.hasOwnProperty(t)||(e[t]=Jt[t]);return e.__didSetup=!0,e},te=function(e,t){const r=Zt(document.createComment("["+t+"-container]"));let n=e.getAttribute(t);return n.indexOf("{{")==-1&&(n="{{"+n+"}}"),e.before(r),e.removeAttribute(t),{$comment:r,query:n}};function N(e){if(e.tagName==="BODY")return"BODY";const t=[];for(;e.parentElement&&e.tagName!=="BODY";){if(e.id){t.unshift("#"+e.getAttribute("id"));break}else{let r=1,n=e;for(;n.previousElementSibling;n=n.previousElementSibling,r++);t.unshift(e.tagName+":nth-child("+r+")")}e=e.parentElement}return t.join(">")}const _t=function(e,t,r,n){try{const o=Function("return `"+n+"`");t.setAttribute(r,o.call(e))}catch(o){console.log({instance:e,colors:e.colors,attribute:r,query:n,element:t,ex:o})}},ee=function(e,t,r){const n=Function("return `"+r+"`");t.textContent=n.call(e)},re=function(e,t,r){const n=t.nodeName,o=t.getAttribute("type");let i="value",l="keyup",s=function(c){t.setAttribute("value",c)};(n==="SELECT"||o==="checkbox")&&(l="change"),o==="checkbox"&&(i="checked",s=function(c){c=="true"&&(c=!0),c?t.setAttribute("checked",!0):t.removeAttribute("checked")}),t.addEventListener(l,function(c){V(e,r,c.target[i])}),e.__connect(r,s),s($(e,r))},oe=function(e,t,r,n,o){r.indexOf("on")==0&&typeof t[r]=="object"&&(r=r.slice(2)),t.addEventListener(r,function(i){e[n](...o)})},ne=function(e,t,r=[]){let n=0;t&&(n=t.level),r.push({key:"__level_"+r.length+"__",index:"__index_"+r.length+"__",template:""});const o=document.createElement("div"),{$comment:i,query:l}=te(e,"*for");o.before(e),o.appendChild(e);let s=o.innerHTML;s=Xt(s,"option","colors["+r[0].index+"]"),r[n].template=s,o.innerHTML=s,i.before(o),i.__placeholder=o.cloneNode(!0),i.levels=r;const c=(u,a=0)=>{try{for(;a>=u.__loopItems.length;)try{const p=u.__loopItems.length;let h=i.__placeholder.cloneNode(!0);h.innerHTML=i.__placeholder.cloneNode(!0).innerHTML.replaceAll("__index_0__",p),h=h.firstElementChild,h.id="item"+a;const m=new Gt;u.__loopItems.push(h),console.log({init:function(){m.__initAndAppendConnections(h,u)}})}catch(p){console.warn(p);break}}catch(p){console.log({placeholder:o,levels:r,ex:p})}},f=function(u=[],a){if(u.length>a.__loopItems.length)for(let p=a.__loopItems.length;p<u.length;p++)c(a,p);if(u.length>a.__visibleItems.length)for(let p=a.__visibleItems.length;p<u.length;p++)a.__visibleItems.push(a.__loopItems[p]),a.before(a.__visibleItems[p]);else if(u.length<a.__visibleItems.length)for(let p=u.length;p<a.__visibleItems.length;p++);},d=function(u){u.__loopItems=[],u.__visibleItems=[]};return i.__forLoopBind=d,i.__loopItems=[],i.__visibleItems=[],i.__forLoopGenerator=c,i.__forLoopManager=f,i.level=n,i.child=[],t||(t=i),o.remove(),i};function W(e,t,r){return t=ie(t),t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function ie(e){var t=se(e,"string");return typeof t=="symbol"?t:String(t)}function se(e,t){if(typeof e!="object"||!e)return e;var r=e[Symbol.toPrimitive];if(r!==void 0){var n=r.call(e,t||"default");if(typeof n!="object")return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return(t==="string"?String:Number)(e)}class le{constructor(t,r){return this._preproxy=new WeakMap,this._handler=r,this.proxify(t,[])}makeHandler(t){let r=this;return{get(n,o,i){return r._handler.get?r._handler.get(n,[...t,o],i):n[o]},set(n,o,i,l){return typeof i=="object"&&(i=r.proxify(i,[...t,o])),n[o]=i,r._handler.set&&r._handler.set(n,[...t,o],i,l),!0},deleteProperty(n,o){if(Reflect.has(n,o)){r.unproxy(n,o);let i=Reflect.deleteProperty(n,o);return i&&r._handler.deleteProperty&&r._handler.deleteProperty(n,[...t,o]),i}return!1}}}unproxy(t,r){this._preproxy.has(t[r])&&(t[r]=this._preproxy.get(t[r]),this._preproxy.delete(t[r]));for(let n of Object.keys(t[r]))typeof t[r][n]=="object"&&this.unproxy(t[r],n)}proxify(t,r){for(let o of Object.keys(t))typeof t[o]=="object"&&(t[o]=this.proxify(t[o],[...r,o]));let n=new Proxy(t,this.makeHandler(r));return this._preproxy.set(n,t),n}}const E=(e=[])=>(Array.isArray(e)&&(e=e.join(".")),e=e.replaceAll("[",".").replaceAll("]",".").replaceAll("..",".").trim(),e.endsWith(".")&&(e=e.slice(0,-1)),e);class ce{constructor(){W(this,"events",{}),W(this,"prevValues",{}),W(this,"trackTimeout",void 0)}subscribe(t,r){return t=E(t),this.events[t]||(this.events[t]=[],this.prevValues[t]=void 0),this.events[t].push(r),(()=>{let o=!0;return{event:t,callback:r,render:()=>{if(o&&this.events[t])for(let i of this.events[t])i()},unsubscribe:()=>{o&&(o=!1,this.events[t]&&(this.events[t]=this.events[t].filter(i=>i!==r)))}}})()}publish(t,r){this.events[t]?this.prevValues[t]!=r?(this.prevValues[t]=r,this.events[t].forEach(n=>n(r))):console.log("data didnt change:",t):console.log("no events subscribed yet:",t)}unsubscribe(t){}track(){clearTimeout(this.trackTimeout),this.trackTimeout=setTimeout(()=>{console.log("---------------------------"),console.log("Subscription tracking".toUpperCase()),console.log("---------------------------");let t=0;for(let r of Object.keys(this.events)){let n=this.events[r].length;console.log("Sub:",r,n),t+=n}console.log(""),console.log("TOTAL: ",t+" active subscriptions"),console.log("-------------------------------------")},100)}}const ae=function(e){const t=new ce;return e=new le(e,{set(o,i,l,s){try{let c=E(i),f=typeof o[c];return c.indexOf("__")==0||(f!=="object"||Array.isArray(o[c]))&&t.publish(E(i),l),!0}catch(c){console.warn(c),console.log(i,E(i),l)}},deleteProperty(o,i){delete t.events[E(i)]},getPath(o,i){console.log("getPath",i.split("."),o)}}),[e,function(o,i){return t.subscribe(E(o),i)},function(){for(let o of Object.keys(t.events))t.publish(o)},t]},ue=function(e={}){let[t,r,n]=ae(e);return{scope:t,connect:r,render:n}},fe=function(e,t){e.__defineGetter__(t,()=>e.__scope[t]),e.__defineSetter__(t,o=>typeof e.__scope[t]=="object"?e.__scope[t]:(e.__scope[t]=o,!0));let r=e.getAttribute(t),n=e.getAttribute("@"+t);if(r!==null){if(!isNaN(r))r=Number(r);else if(["true",!0].indexOf(r)>-1)r=!0;else if(["false",!1].indexOf(r)>-1)r=!1;else try{let o=JSON.parse(r);typeof o=="object"&&(r=o)}catch{}e.__scope[t]=r}n!==null&&console.log("@TODO - connect passed value","@"+t,n)},pe=function(e){for(let t of e.constructor.props)fe(e,t)};function L(e,t,r){return t=de(t),t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function de(e){var t=he(e,"string");return typeof t=="symbol"?t:String(t)}function he(e,t){if(typeof e!="object"||!e)return e;var r=e[Symbol.toPrimitive];if(r!==void 0){var n=r.call(e,t||"default");if(typeof n!="object")return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return(t==="string"?String:Number)(e)}class k{constructor(){if(L(this,"__registry",{}),L(this,"__id",0),L(this,"__parseTemplateString",function(t,r,n,o){let i=t,l=t.charAt(r+n.length),s=t.charAt(r-1),c=r==0||!M(s)&&s!=".",f=r+n.length>t.length||!M(l);if(c&&f){i=t.split("");let d=t.slice(0,r),u=t.slice(r+n.length);i=d+o+u}return i}),L(this,"__mapTemplateConnections",function(t){let r=t.content,n=[...r.querySelectorAll("*")];const o={};o.keywords={},o.actions={},o.operations={};let i=n.filter(s=>s.getAttributeNames().indexOf("*for")>-1);for(let s of i){const c=ne(s);let f=N(c.parentElement),d=c.parentElement,u=0;for(let h of d.childNodes){if(h==c)break;u++}o.operations.hasOwnProperty("*for")||(o.operations["*for"]=[]),o.operations["*for"].push({attribute:"comment",type:"*for",query:void 0,originalQuery:void 0,selector:f,nodeIndex:u,setup:function(h){try{let m=h.querySelector(f).childNodes[u];m.controller=h,m.__loopItems=[],m.__visibleItems=[],m.callback=v=>{c.__forLoopManager(v.colors,m)},h.__connect("colors.length",function(v){console.log("cb",h.colors),m.callback(h)}),console.log("conn"),m.callback(h)}catch(m){console.warn(m)}}})}r=t.content,n=[...r.querySelectorAll("*")];for(let s of n){const c=s.getAttributeNames(),f=c.filter(a=>a.indexOf("*")==0),d=c.filter(a=>a.indexOf("@")>-1),u=c.filter(a=>s.getAttribute(a).indexOf("{{")>-1);if(f.length>0||d.length>0||u.length>0){let a=N(s);a||(s.setAttribute("id",s.getAttribute("id")||"el-component-"+this.__id),a=s.nodeName+"#"+s.id,this.__id++);for(let p of d){o.actions.hasOwnProperty(a)||(o.actions[a]=[]);let h=p.replace("@","").trim(),m=s.getAttribute(p).trim().replace("this.",""),v=s.getAttribute(p).replaceAll("{{","${").replaceAll("}}","}");o.actions[a].push({type:"action",action:p,sourceAttribute:h,targetAttribute:m,query:v,selector:a,setup:function(y){let g=y.querySelector(a);if(p.indexOf("model")>-1){const b=re(y,g,m);return g.removeAttribute(p),b}else{let b=v.trim().split("(").map(x=>x.trim()).filter(x=>x.length>0),_=b[0].replace("this.",""),O=[];b.length>1&&(O=b[1].split(")").map(x=>x.trim()).filter(x=>x.length>0)[0].split(",").map(x=>x.trim()));const A=()=>{oe(y,g,p.replaceAll("@",""),_,O)};return A(y,g,p.replaceAll("@","")),g.removeAttribute(p),A}}})}for(let p of u){const h=s.getAttribute(p),m=h.replaceAll("{{","${").replaceAll("}}","}");let v=F(h);for(let y of v)o.keywords.hasOwnProperty(y)||(o.keywords[y]=[]),o.keywords[y].push({type:"attribute",attribute:p,query:m,selector:a,callback:function(g){try{let b=g.querySelector(a);_t(g,b,p,m)}catch(b){console.warn(b)}}})}}}return rt(t.content).filter(s=>s.textContent.indexOf("{{")>-1).forEach(s=>{let c=N(s.parentElement),f=s.parentElement,d=(f==null?void 0:f.childNodes)||[],u=0;for(let a of d){if(a.textContent.indexOf("{{")>-1){const p=a.textContent,h=u;let m=F(p);const v=p.replaceAll("{{","${").replaceAll("}}","}");for(let y of m)o.keywords.hasOwnProperty(y)||(o.keywords[y]=[]),o.keywords[y].push({attribute:"textNode",type:"text",query:v,originalQuery:p,selector:c,nodeIndex:h,callback:function(g){try{let b=g.querySelector(c).childNodes[h];ee(g,b,v)}catch(b){console.warn(b)}}})}u++}}),o}),k.instance)return k.instance;k.instance=this}__parseTemplatePointers(t,r,n){let o=[];const i=r.props||[],l=r.actions||[],s=document.createElement("template"),c=document.querySelector("head");o=P(t);for(let f of o){let d=f;for(let u of l){let a=C(f,u);if(a.length>0){a.reverse();for(let p of a)d=this.__parseTemplateString(d,p,u,"this.parent."+u)}}t=t.replaceAll("{{"+f+"}}","{{"+d+"}}")}o=P(t);for(let f of o){let d=f;for(let u of i){let a=C(f,u);if(a.length>0){a.reverse();for(let p of a)d=this.__parseTemplateString(d,p,u,"this."+u)}}t=t.replaceAll("{{"+f+"}}","{{"+d+"}}")}return s.setAttribute("id","el-component-template__"+n),s.innerHTML=t,c.appendChild(s),s}register(t,r){let{selector:n,template:o,styles:i,shadow:l}={...t};if(!this.__registry.hasOwnProperty(n)&&customElements.get(n)===void 0){const s=document.head;let c;i&&(c=document.createElement("style"),c.innerHTML=i);const f=this.__parseTemplatePointers(o,r,n),d=this.__mapTemplateConnections(f,r);this.__registry[n]={component:r,template:f,connections:d,styles:c,shadow:l},!l&&c&&s.appendChild(c),customElements.define(t.selector,r)}}setup(){}load(t){const r=this.__registry[t],n=r.template.content.cloneNode(!0),o=r.connections;this.setup(n,o);const i=r.id;return{template:n,connections:o,id:i}}}L(k,"instance",null);const st=new k;class be extends HTMLElement{static register(t){const r={shadow:!1,template:`<h1>${t.config.selector} is registered</h1>`,styles:"",...t.config};st.register(r,t)}constructor(){super(),L(this,"__initAndApplyConnections",function(){const n=this.__templateConnections;this.scope={},this.__subscriptions=[];for(let o of Object.keys(n.operations))for(let i of n.operations[o])i.setup(this);for(let o of Object.keys(n.keywords))for(let i of n.keywords[o]){let l=this.__connect(lt(o),()=>i.callback(this));this.__subscriptions.push(l),i.callback(this)}for(let o of Object.keys(n.actions))for(let i of n.actions[o])i.setup(this);pe(this)}),this.__config=this.constructor.config;const{template:t,connections:r}=st.load(this.__config.selector);this.__template=t,this.__templateConnections=r,this.appendChild(this.__template)}__getTemplateElement(t=!1){let r=this.__templateElement;if(!r){if(r=document.querySelector("#"+this.__templateId),!r){const n=document.querySelector("head");r=document.createElement("template"),r.setAttribute("id",this.__templateId),r.innerHTML=this.__template,n.appendChild(r)}this.__templateElement=r}return t&&(r=this.__templateElement.content.cloneNode(!0)),r}connectedCallback(){if(!this.getAttribute("el-connected")){this.setAttribute("el-connected",!0);const t=this.constructor.props,r={};for(let s of t)r[s]=this.getAttribute(s)??this[s];const{scope:n,connect:o,render:i,pubsub:l}=ue(r);this.__scope=n,this.__connect=o,this.__initAndApplyConnections()}}}function w(e,t,r){return t=me(t),t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function me(e){var t=_e(e,"string");return typeof t=="symbol"?t:String(t)}function _e(e,t){if(typeof e!="object"||!e)return e;var r=e[Symbol.toPrimitive];if(r!==void 0){var n=r.call(e,t||"default");if(typeof n!="object")return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return(t==="string"?String:Number)(e)}const ge=`\r
<section \r
  class="bg-{{color =='white' ? color: color+'-100'}} border border-{{color == 'white' ? 'gray' : color}}-400" \r
>\r
  <h1>{{title}}</h1>\r
  <p>{{description}}</p>\r
  <small>{{caption}} {{counter}}</small>\r
\r
  <br>\r
  <input class="input" @model="caption" />\r
  <button @onClick="onClick($event)" class="btn bg-white border border-{{color == 'white' ? 'gray' : color}}-400 text-{{color == 'white' ? 'black' : color}}-900" >Click</button>\r
  <br>\r
  <small>Open your devtools and update the input above to see that Elements updates it's data with surgical percision <b>{{caption}}</b></small>\r
</section>\r
\r
<section \r
  class="bg-{{color =='white' ? color: color+'-100'}} border border-{{color == 'white' ? 'gray' : color}}-400" \r
>\r
  <h1>Background</h1>\r
  <p>Feel free to change the background color of the sections</p>\r
  <small>Current color: \r
    <b>\r
      {{color}}\r
    </b>\r
  </small>\r
  <br>\r
  <select class="input" @model="color" >\r
    <option value="{{option.id}}" *for="let option of colors">\r
      {{option.name}}\r
    </option>\r
  </select> \r
</section>\r
\r
<section \r
  class="bg-{{color =='white' ? color: color+'-100'}} border border-{{color == 'white' ? 'gray' : color}}-400" \r
>\r
  <h1>Conditional rendering</h1>\r
  <p>Based on a true/false condition it renders the following code block.</p>\r
  <small>\r
    Also, if you input the word "render", another block will show\r
  </small>\r
\r
  <p>\r
    <label class="visible">\r
      Visible: {{visible}}\r
      <input type="checkbox" class="checkbox" @model="visible" />\r
    </label>\r
  </p>\r
 \r
  <div class="subsection bg-white border border-{{color == 'white' ? 'gray' : color}}-400 " *if="visible">\r
    It shows\r
  </div>\r
  <p>\r
    <label class="visible">\r
      Is the input displaying "render"?: {{caption == "render" }} {{caption.indexOf("render") > -1 }} {{caption.trim() == "render" }}\r
      \r
    </label>\r
  </p>\r
  <div class="subsection bg-white border border-{{color == 'white' ? 'gray' : color}}-400 " *if="caption == 'render'">\r
    It Renders\r
  </div>\r
</section>\r
<section \r
  class="bg-{{color =='white' ? color: color+'-100'}} border border-{{color == 'white' ? 'gray' : color}}-400" \r
>\r
  <h1>Data propagation</h1>\r
  <p>Data and action propagation is written with "@" synthax</p>\r
  <small>\r
    For example: if you have the following code: &lt;el-parent title=&quot;el-title&quot;&gt;\\n &lt;el-child @childTitle=&quot;title&quot; /&gt;\\n&lt;/el-parent&gt;\r
    The child component will have childTitle data synchronized with the parent title data\r
  </small>\r
  <small>\r
    <b>\r
      Propagated data: {{propagation}}\r
    </b>\r
\r
  </small>\r
  <br>\r
  <el-child [childPropagation]="this.propagation" [propagation]="this.propagation"></el-child> \r
</section>`;class j extends be{constructor(){super(),w(this,"title","El Upgrade"),w(this,"description","Element framework made with ❤️ by Pihh"),w(this,"caption","Edit this caption!!"),w(this,"propagation","Propagated data"),w(this,"color","blue"),w(this,"colors",["white","yellow","green","red","blue"].map(t=>({id:t,name:t}))),w(this,"counter",0),w(this,"visible",!1)}onClick(t){console.log("onclick",t),this.counter++}}w(j,"config",{selector:"el-upgrade",template:ge,styles:""});w(j,"props",["title","description","caption","propagation","color","colors","counter","visible"]);w(j,"actions",[]);j.register(j);
