(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))n(i);new MutationObserver(i=>{for(const o of i)if(o.type==="childList")for(const s of o.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&n(s)}).observe(document,{childList:!0,subtree:!0});function r(i){const o={};return i.integrity&&(o.integrity=i.integrity),i.referrerPolicy&&(o.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?o.credentials="include":i.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function n(i){if(i.ep)return;i.ep=!0;const o=r(i);fetch(i.href,o)}})();function Q(e,t="{{",r="}}"){let n=[];try{n=e.split(t).slice(1).map(i=>i.split(r)[0])}catch{}return n||[]}const Pt=function(e){let t=e.innerHTML,r=Q(t);for(let n of r){const i="{{"+n+"}}",o="{{"+n.replaceAll(" ","")+"}}";t=t.replaceAll(i,o)}return e.innerHTML=t,e};function F(e){return e.toUpperCase()!=e.toLowerCase()}function Y(e,t="{{",r=[]){let n=e.indexOf(t),i=e;return n>-1?(r.push(n),i=i.split(""),i[n]="*",i[n+1]="*",i=i.join(""),Y(i,t,r)):r}const it=function(e,t,r="this"){let n=[],i=t.split("{{").map(s=>s.trim()).filter(s=>s.length>0).map(s=>s.split("}}")[0]);function o(s,c=[],a=r,u=[]){let l=Object.keys(s).filter(p=>p.indexOf("__")==-1);for(let p of l)for(let f of i){let d=Math.max(-1,f.indexOf(a+"."+p),f.indexOf(a+"[")),h=a+"."+p.replace("]","");p==Number(p)&&(h=a+"["+p+"]"),d>-1&&(typeof s[p]!=="object"?n.push(h):(n.push(h),o(s[p],c,a+"."+p,u=[])))}}return o(e,i),i[1]&&i[1].indexOf(r+".")>-1&&n.push(i[1]),n.sort((s,c)=>s>c).filter(s=>Math.max(-1,t.indexOf(s+" "),t.indexOf(s+"}"),t.indexOf("?"))>-1)},$t=function(e,t,r){const n=r.replaceAll("(","").replaceAll(")","");if(e.__events.indexOf(n)>-1){console.warn({element:e,eventName:n},"Was already added");return}let i=e.getAttribute(r);e.__events.push(n),e.removeAttribute(n);let o=!1;t.__connections.push(()=>{if(o)return;o=!0;let s=function(c){console.log(t,e),console.log(n,c,t,i)};if(i.indexOf("(")==-1)i=i.replace("this.",""),s=function(c){console.log(t,e),e.controller[i](c)};else{let c=i.split("(")[0].trim().replace("this.",""),a=i.split("(")[1].split(")")[0].trim().split(",").filter(l=>l.length>0),u=a.indexOf("$event");s=function(l){let p=a.map(f=>(f=="$event"?f=l:f=="$index"?f=e.$index:t.hasOwnProperty(f)&&(f=t[f]),f));u==-1&&p.push(l),e.controller[c](...p)}}e.addEventListener(n,s)})},Ot=function(e,t,r){try{const n=r.replace("@","").toLowerCase(),i=t.getAttribute(r).replaceAll("this.","").split("(").map(o=>o.trim()).filter(o=>o.length>0)[0];t.__actions=t.__actions||{},t.__actions.hasOwnProperty(n)||(t.__actions[n]=function(o){const s=new CustomEvent(n,{detail:{data:o}});e.dispatchEvent(s)}),(!e.__events||e.__events.indexOf(n)==-1)&&(e.__events||(e.__events=[]),e.__events.push(n),e.addEventListener(n,function(o){console.log("did ear this ",{$event:o,parent:e,eventName:n,action:i});const c=Function("return this."+i+"(...arguments)").call(e,o);console.log(c)}))}catch(n){console.warn(n)}},St=function(e){return e.replaceAll("this.","").replaceAll("[",".").replaceAll("]",".").replaceAll("..",".").trim().split(".").slice(0).map(t=>(t[0]=="."&&(t=t.slice(1)),t.endsWith(".")&&(t=t.slice(0,-1)),t)).filter(t=>t.length>0)},B=function(e,t,r){let n=typeof r;["boolean","number"].indexOf(n)==-1&&(r="'"+r+"'"),r!==C(e,t)&&Function("return `${this."+t+"="+r+"}`").call(e)},C=function(e,t){try{return Function("return this."+t).call(e)}catch{return Function("return `${this."+t+"}`").call(e)}},Tt=function(e,t,r,n){const i=e.getAttribute(t).replaceAll("this.",""),o=e.nodeName||"INPUT",s=e.getAttribute("type"),c=[i],a=s==="checkbox"?"checked":"value";for(let u of c.map(l=>l.replace("this.","").trim())){const l=function(p){if(s==="checkbox"){let f=e.getAttribute("checked");p&&!f?e.setAttribute("checked",!0):!p&&f&&e.removeAttribute("checked")}else e.getAttribute("value")!==p&&e.setAttribute(a,C(r,i))};e.__subscribe(u,r,n,l),l(C(r,i))}if(o=="SELECT"){const u=function(f,d){[...f.querySelectorAll("option")].forEach(h=>{d==h.value?h.setAttribute("selected",!0):h.removeAttribute("selected")})},l=function(f){[...f.querySelectorAll("option")].forEach(d=>{d.__didInitialize=d.__didInitialize||[],d.__didInitialize.push(()=>{u(f,C(r,i))})})};let p=C(r,i)||void 0;e.addEventListener("change",f=>{f.target.value!==p&&(p=f.target.value,B(r,i,f.target.value))}),l(e),u(e,C(r,i))}else if(s=="checkbox"){let u=C(r,i)||!1;e.addEventListener("change",l=>{l.target.checked!=u&&(u=l.target.checked,B(r,i,l.target.checked))})}else{let u=C(r,i)||"";e.addEventListener("keyup",l=>{l.target.value!==u&&(u=l.target.value,B(r,i,l.target.value))})}e.removeAttribute(t)};function pt(e){var t=[];if(e)for(e=e.firstChild;e!=null;)e.nodeType==3?t[t.length]=e:t=t.concat(pt(e)),e=e.nextSibling;return t}const Et={__subscribe:function(e,t,r,n){if(e.indexOf("__")==0)return;const i=r(e,n);this.__subscription,i.event,!(this.__subscriptions.map(o=>o.subscription).indexOf(e)>-1)&&(this.__subscriptions.push({unsubscribe:i.unsubscribe,subscription:e,scope:t,connection:r}),this.__subscriptions.push({unsubscribe:i.unsubscribe,subscription:i.event,scope:t,connection:r}),n())},__unsubscribe:function(){this.__subscriptions.map(e=>e.unsubscribe()),this.__subscriptions=[]}},j=function(e){if(e.__didSetup)return e;e.controller||(e.controller=e);for(let t of["__subscriptions","__events","__didInitialize"])e.hasOwnProperty(t)||(e[t]=[]);for(let t of["__actions"])e.hasOwnProperty(t)||(e[t]={});for(let t of["__subscribe","__unsubscribe"])e.hasOwnProperty(t)||(e[t]=Et[t]);return e.__didSetup=!0,e},Nt=function(e,t,r){const n="`"+e.textContent+"`",i=n.replaceAll("{{","${").replaceAll("}}","}"),o=it(t,n);e=j(e);for(let s of o.map(c=>c.replace("this.","").trim())){const c=function(){const u=Function("return "+i).call(t);e.textContent=u};e.__subscribe(s,t,r,c)}},dt=function(e,t,r){const n=pt(e).filter(i=>i.textContent.indexOf("{{")>-1);for(let i of n)i.controller||(i.controller=e.controller),Nt(i,t,r)},ht=function(e,t){const r=j(document.createComment("["+t+"-container]"));let n=e.getAttribute(t);return n.indexOf("{{")==-1&&(n="{{"+n+"}}"),e.before(r),e.removeAttribute(t),{$comment:r,query:n}},bt=function(e,t,r,n={}){if(n={customAttributes:[],level:0,...n},e.__forOperationBound)return;e.__forOperationBound=!0;const{$comment:i,query:o}=ht(e,"*for"),s=o.split(";")[0].split(" of ").map(m=>m.trim());let c=s[0].replaceAll("{{","").trim(),a=s[1].replaceAll("}}","").trim().split(";")[0].trim(),u="__$index"+n.level+"__";const l=o.split(";")[1];l&&l.indexOf("$index")>-1&&(u=l.split("=")[0].trim());let p,f,d=document.createElement("div");if(document.body.appendChild(d),d.appendChild(e),f=d.cloneNode(!0),p=d.cloneNode(!0).innerHTML.trim(),e.remove(),d.remove(),!c||!a)return;const h=Q(p);for(let m of h){let b="{"+m+"}",x=Y(b,c);for(let y of x)if(y>-1){let P=b.charAt(y-1),k=b.charAt(y+c.length);if(!F(P)&&!F(k)){b=b.split("");let $=b.slice(0,y),O=b.slice(y+c.length);b=$.join("")+a+"["+u+"]"+O.join("")}}p=p.replaceAll("{"+m+"}",b)}const v=Q(p,'*for="','"');for(let m of v){let b='*for="'+m+'"',x=Y(b,c);for(let y of x)if(y>-1){let P=b.charAt(y-1),k=b.charAt(y+c.length);if(!F(P)&&!F(k)){b=b.split("");let $=b.slice(0,y),O=b.slice(y+c.length);b=$.join("")+a+"["+u+"]"+O.join("")}}p=p.replaceAll('*for="'+m+'"',b)}i.__forLoopContainer=i.__forLoopContainer||[],i.__forLoopItemFactory=function(m){if(i.__forLoopContainer.length<=m){let b=f.cloneNode(!1);b.innerHTML=p.replaceAll(u,m),b=b.firstElementChild,i.after(b),i.__forLoopContainer.push(b),j(b),mt(b,t,r,{level:n.level+1,reset:!0}),dt(b,t,r,{level:n.level+1,reset:!0})}};const g=function(m){m!==void 0&&i.__forLoopItemFactory(m-1)},_=a.replaceAll("this.","").trim()+".length",A=C(t,a.replace("this.",""));i.__subscribe(_,t,r,g);for(let m=0;m<A.length;m++)i.__forLoopItemFactory(m)},Lt=function(e,t,r){const{$comment:n,query:i}=ht(e,"*if");let o="`"+i.replaceAll("{{","${").replaceAll("}}","}")+"`";const s=it(t,i);for(let c of s.map(a=>a.replace("this.","").trim())){const a=function(){const l=Function("return "+o).call(t);["true",!0].indexOf(l)>-1?e.isConnected||n.after(e):e.isConnected&&e.remove()};e.__subscribe(c,t,r,a),a()}},mt=function(e,t,r,n={reset:!1}){n={reset:!1,customAttributes:[],...n},n.reset&&(e.__didSetup=!1);let i=[...e.querySelectorAll("*")].filter(s=>s.getAttributeNames().indexOf("*for")>-1);for(;i.length>0;){let s=i[0];s.parent=e,s.controller=e.controller,bt(s,t,r,n),i=[...e.querySelectorAll("*")].filter(c=>c.getAttributeNames().indexOf("*for")>-1)}let o=[...e.querySelectorAll("*")];n.reset&&(e.__didSetup=!1),e=j(e);for(let s of o)s.controller||(s.controller=e),s.parent=e,s=j(s),lt(s,t,r);lt(e,t,r)},lt=function(e,t,r){const n=e.getAttributeNames();for(let i of n){const o="`"+e.getAttribute(i)+"`";if(i.indexOf("*")==0){if(i=="*if")Lt(e,t,r);else if(i=="*for"){bt(e,t,r),e.innerHTML="";for(let a of e.getAttributeNames())e.removeAttribute(a)}}else if(i=="model"||i=="[model]")Tt(e,i,t,r);else if(!(i.indexOf("@")>-1)){if(i.indexOf("(")>-1)$t(e,t,i);else if(o.indexOf("{{")==-1)continue}const s=o.replaceAll("{{","${").replaceAll("}}","}"),c=it(t,o);for(let a of c.map(u=>u.replace("this.","").trim())){const u=function(){const p=Function("return "+s).call(t);e.setAttribute(i,p)};e.__subscribe(a,t,r,u)}}};function ct(e,t,r){return t=kt(t),t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function kt(e){var t=qt(e,"string");return typeof t=="symbol"?t:String(t)}function qt(e,t){if(typeof e!="object"||!e)return e;var r=e[Symbol.toPrimitive];if(r!==void 0){var n=r.call(e,t||"default");if(typeof n!="object")return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return(t==="string"?String:Number)(e)}let It=class{constructor(t,r){return this._preproxy=new WeakMap,this._handler=r,this.proxify(t,[])}makeHandler(t){let r=this;return{get(n,i,o){return r._handler.get?r._handler.get(n,[...t,i],o):n[i]},set(n,i,o,s){return typeof o=="object"&&(o=r.proxify(o,[...t,i])),n[i]=o,r._handler.set&&r._handler.set(n,[...t,i],o,s),!0},deleteProperty(n,i){if(Reflect.has(n,i)){r.unproxy(n,i);let o=Reflect.deleteProperty(n,i);return o&&r._handler.deleteProperty&&r._handler.deleteProperty(n,[...t,i]),o}return!1}}}unproxy(t,r){this._preproxy.has(t[r])&&(t[r]=this._preproxy.get(t[r]),this._preproxy.delete(t[r]));for(let n of Object.keys(t[r]))typeof t[r][n]=="object"&&this.unproxy(t[r],n)}proxify(t,r){for(let i of Object.keys(t))typeof t[i]=="object"&&(t[i]=this.proxify(t[i],[...r,i]));let n=new Proxy(t,this.makeHandler(r));return this._preproxy.set(n,t),n}};const S=(e=[])=>(Array.isArray(e)&&(e=e.join(".")),e=e.replaceAll("[",".").replaceAll("]",".").replaceAll("..",".").trim(),e.endsWith(".")&&(e=e.slice(0,-1)),e);let jt=class{constructor(){ct(this,"events",{}),ct(this,"trackTimeout",void 0)}subscribe(t,r){return t=S(t),this.events[t]||(this.events[t]=[]),this.events[t].push(r),(()=>{let i=!0;return{event:t,callback:r,render:()=>{if(i&&this.events[t])for(let o of this.events[t])o()},unsubscribe:()=>{i&&(i=!1,this.events[t]&&(this.events[t]=this.events[t].filter(o=>o!==r)))}}})()}publish(t,r){console.log("PUBLISH",t,r),this.events[t]?this.events[t].forEach(n=>n(r)):console.log("no events subscribed yet:",t)}unsubscribe(t){}track(){clearTimeout(this.trackTimeout),this.trackTimeout=setTimeout(()=>{console.log("---------------------------"),console.log("Subscription tracking".toUpperCase()),console.log("---------------------------");let t=0;for(let r of Object.keys(this.events)){let n=this.events[r].length;console.log("Sub:",r,n),t+=n}console.log(""),console.log("TOTAL: ",t+" active subscriptions"),console.log("-------------------------------------")},100)}};const Mt=function(e){const t=new jt;return e=new It(e,{set(i,o,s,c){try{let a=S(o),u=typeof i[a];return a.indexOf("__")==0||(u!=="object"||Array.isArray(i[a]))&&t.publish(S(o),s),!0}catch(a){console.warn(a),console.log(o,S(o),s)}},deleteProperty(i,o){delete t.events[S(o)]},getPath(i,o){console.log("getPath",o.split("."),i)}}),[e,function(i,o){return t.subscribe(S(i),o)},function(){for(let i of Object.keys(t.events))t.publish(i)},t]},Ht=function(e={}){let[t,r,n]=Mt(e);return{scope:t,connect:r,render:n}},Ft=function(e,t,r={}){r={firstConnection:!!e.controller,...r};const{scope:n,connect:i,render:o,pubsub:s}=Ht(t);e=Pt(e),e.props=n,e.controller=e.controller||e,e.pubsub=s,e.render=o;for(let c of Object.keys(e.props))e.__defineSetter__(c,function(a){return e.props[c]=a,!0}),e.__defineGetter__(c,function(){return e.props[c]});return mt(e,n,i),dt(e,n,i),e.__onConnect(),{element:e,scope:n}},Bt=function(e){const t=new Map(Array.from(e.querySelectorAll("slot").values()).map(n=>[n.name,n])),r=Array.from(e.querySelectorAll(":scope > *[slot]").values()).map(n=>[n.slot,n]);for(const[n,i]of r){const o=t.get(n);o&&(i.removeAttribute("slot"),o.parentElement.replaceChild(i,o))}},Vt=function(e){Array.from(e.querySelectorAll("slot")).forEach(t=>t.removeAttribute("slot"))};function _t(e,t,r){return t=Dt(t),t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function Dt(e){var t=Kt(e,"string");return typeof t=="symbol"?t:String(t)}function Kt(e,t){if(typeof e!="object"||!e)return e;var r=e[Symbol.toPrimitive];if(r!==void 0){var n=r.call(e,t||"default");if(typeof n!="object")return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return(t==="string"?String:Number)(e)}let gt=class V{constructor(){if(_t(this,"__registry",{}),V.instance)return V.instance;V.instance=this}register(t,r){const{selector:n,template:i,styles:o,shadow:s}={...t};if(!this.__registry.hasOwnProperty(n)&&customElements.get(n)===void 0){const c=document.head,a=document.createElement("style");a.innerHTML=o,this.__registry[n]={component:r,template:i,styles:a,shadow:s},s||c.appendChild(a),customElements.define(t.selector,r)}}setup(){}load(t){}};_t(gt,"instance",null);const Rt=new gt;let R=class extends HTMLElement{static register(t){const r={shadow:!1,template:`<h1>${t.config.selector} is registered</h1>`,styles:"",...t.config};Rt.register(r,t)}constructor(){super(),this.__config=this.constructor.config,this.__template=this.constructor.config.template,this.__style=this.constructor.config.styles,this.__templateId="template-container-"+this.__config.selector,this.__templateContent=this.__getTemplateElement(!0),this.dataset.connected||(this.appendChild(this.__templateContent),this.dataset.connected="true"),Bt(this),Vt(this),this.__template=this.innerHTML}__getTemplateElement(t=!1){let r=this.__templateElement;if(!r){if(r=document.querySelector("#"+this.__templateId),!r){const n=document.querySelector("head");r=document.createElement("template"),r.setAttribute("id",this.__templateId),r.innerHTML=this.__template,n.appendChild(r)}this.__templateElement=r}return t&&(r=this.__templateElement.content.cloneNode(!0)),r}__extractAttributes(){const t=this.props||{};t.__connections=[],this.__onConnect=()=>{try{let i=this.__connections||t.__connections||[];i.map(o=>o()),i=[];for(let o of this.querySelectorAll("*")){const s=o.getAttributeNames().filter(c=>c.indexOf("@")>-1);for(let c of s)Ot(this,o,c)}}catch(i){console.log(this,t,i)}};let r=Object.keys(t||{});const n=this.getAttributeNames().filter(i=>r.indexOf(i)>-1);for(let i of n){t[i]=this.getAttribute(i);try{t[i]=JSON.parse(t[i])}catch{isNaN(t[i])?["false",!1].indexOf(t[i])>-1?t[i]=!1:["true",!0].indexOf(t[i])>-1&&(t[i]=!0):t[i]=Number(t[i])}}return t}connectedCallback(){if(!this.__initialSetup){this.__initialSetup=!0;const t=this.__extractAttributes();Ft(this,t)}}};const q={list:[1,2,3],color:"indigo",colors:["red","green","yellow","indigo","blue"],object:{title:"Made with ❤️ by pihh",objectList:[{a:"a",b:"b",c:"c",id:0,innerList:[1,2,3,4]},{a:"a",b:"b",c:"c",id:1,innerList:[1,2,3,4]},{a:"a",b:"b",c:"c",id:2,innerList:[1,2,3,4]}].map(e=>(e.a=e.a+"_"+e.id,e.b=e.b+"_"+e.id,e.c=e.c+"_"+e.id,e))}};function T(e,t,r){return t=Wt(t),t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function Wt(e){var t=Ut(e,"string");return typeof t=="symbol"?t:String(t)}function Ut(e,t){if(typeof e!="object"||!e)return e;var r=e[Symbol.toPrimitive];if(r!==void 0){var n=r.call(e,t||"default");if(typeof n!="object")return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return(t==="string"?String:Number)(e)}const Xt=`<section\r
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
`;class J extends R{constructor(){super(),T(this,"props",q),T(this,"list",q.list),T(this,"object",q.object),T(this,"color",q.color),T(this,"colors",q.colors),console.log("add",this)}add(){this.list.push(Math.random()*100)}addToInnerList(t){this.object.objectList[t].innerList.push(Math.random()*10)}addObject(){this.object.objectList.push({a:"a",b:"b",c:"c",id:Math.random()*10,innerList:[1,2,3,4]})}}T(J,"config",{selector:"my-loop",template:Xt,styles:`
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
    
    `});J.register(J);function yt(e,t,r){return t=zt(t),t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function zt(e){var t=Qt(e,"string");return typeof t=="symbol"?t:String(t)}function Qt(e,t){if(typeof e!="object"||!e)return e;var r=e[Symbol.toPrimitive];if(r!==void 0){var n=r.call(e,t||"default");if(typeof n!="object")return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return(t==="string"?String:Number)(e)}const Yt=`<div class="example-section-container bg-{{this.color}}-100 ">\r
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
`;class G extends R{constructor(){super(),yt(this,"props",{dataBinding:"Sample data binding",condition:!0,counter:0,color:"blue",colors:["red","white","green","blue","indigo","purple","yellow","orange"],posts:[{id:1,title:"Sample post 1",images:[1,2,3]},{id:2,title:"Sample post 2",images:[1,2,3]},{id:3,title:"Sample post 3",images:[1,2,3]},{id:4,title:"Sample post 4",images:[1,2,3]}]})}addPost(){this.posts.push({id:"x",title:"XXXXXXX",images:[1,2,3]})}increment(){this.counter++}decrement(){this.counter--}}yt(G,"config",{selector:"el-example",template:Yt,styles:""});G.register(G);function vt(e,t,r){return t=Jt(t),t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function Jt(e){var t=Gt(e,"string");return typeof t=="symbol"?t:String(t)}function Gt(e,t){if(typeof e!="object"||!e)return e;var r=e[Symbol.toPrimitive];if(r!==void 0){var n=r.call(e,t||"default");if(typeof n!="object")return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return(t==="string"?String:Number)(e)}class Z extends R{constructor(){super(),vt(this,"props",{model:"Default model"})}}vt(Z,"config",{selector:"el-input",template:`
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
    `});Z.register(Z);function tt(e,t,r){return t=Zt(t),t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function Zt(e){var t=te(e,"string");return typeof t=="symbol"?t:String(t)}function te(e,t){if(typeof e!="object"||!e)return e;var r=e[Symbol.toPrimitive];if(r!==void 0){var n=r.call(e,t||"default");if(typeof n!="object")return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return(t==="string"?String:Number)(e)}const ee=`<button class="btn bg-{{this.color}}-200" (click)="callback">\r
  <span>\r
    <slot name="btn-primary">Primary Btn slot</slot>\r
  </span>\r
</button>\r
`;class et extends R{constructor(){super(),tt(this,"props",{color:"white"}),tt(this,"color","white")}callback(){this.emit("xxxx"),this.dispatchEvent(new CustomEvent("emit",{})),this.parentElement.dispatchEvent(new CustomEvent("childComponentCallbackCalled",{}))}emit(t){console.log("vai mandar",this),this.__actions.emit({str:"ajnsjnsjns",cb:t})}}tt(et,"config",{selector:"my-btn",template:ee,styles:`  
    `});et.register(et);function E(e,t="{{",r="}}"){let n=[];try{n=e.split(t).slice(1).map(i=>i.split(r)[0])}catch{}return n||[]}function rt(e){return e.toUpperCase()!=e.toLowerCase()}function D(e,t="{{",r=[]){let n=e.indexOf(t),i=e;return n>-1?(r.push(n),i=i.split(""),i[n]="*",i[n+1]="*",i=i.join(""),D(i,t,r)):r}const K=function(e,t=[]){const r=E(e);for(let n of r){const i=n.split("this.").map(o=>o.replaceAll(" ","")).filter(o=>o.length>0);for(let o of i){let s=o.split(""),c=!1;for(let a=0;a<s.length;a++){const u=s[a];if(!rt(u)){if(u=="."||u=="["||u=="]")continue;if(isNaN(u)){const l=s.slice(0,a).join("");t.indexOf(l)==-1&&t.push(l),c=!0;break}else continue}}if(!c){const a=o.trim();t.indexOf(a)==-1&&t.push(a)}}}return t};let W=0;function At(e){if(e.tagName==="BODY")return"BODY";const t=[];for(;e.parentElement&&e.tagName!=="BODY";){if(e.id){t.unshift("#"+e.getAttribute("id"));break}else{let n=1,i=e;for(;i.previousElementSibling;i=i.previousElementSibling,n++);t.unshift(e.tagName+":nth-child("+n+")")}e=e.parentElement}let r=t.join(">");return r||(r="[data-el-selector='"+W+"'",e.dataset.elSelector=W,W++),r}const re=function(e,t,r,n){try{const i=Function("return `"+n+"`");t.setAttribute(r,i.call(e))}catch(i){console.log({instance:e,colors:e.colors,attribute:r,query:n,element:t,ex:i})}},ie=function(e,t,r){const n=Function("return `"+r+"`");t.textContent=n.call(e)},ne=function(e,t,r){const n=t.nodeName,i=t.getAttribute("type");let o="value",s="keyup",c=function(a){t.setAttribute("value",a)};(n==="SELECT"||i==="checkbox")&&(s="change"),i==="checkbox"&&(o="checked",c=function(a){a=="true"&&(a=!0),a?t.setAttribute("checked",!0):t.removeAttribute("checked")}),t.addEventListener(s,function(a){B(e,r,a.target[o])}),e.__connect(r,c),c(C(e,r))},oe=function(e,t,r,n,i){r.indexOf("on")==0&&typeof t[r]=="object"&&(r=r.slice(2)),t.addEventListener(r,function(o){e[n](...i)})};function U(e,t,r){return t=se(t),t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function se(e){var t=le(e,"string");return typeof t=="symbol"?t:String(t)}function le(e,t){if(typeof e!="object"||!e)return e;var r=e[Symbol.toPrimitive];if(r!==void 0){var n=r.call(e,t||"default");if(typeof n!="object")return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return(t==="string"?String:Number)(e)}class ce{constructor(t,r){return this._preproxy=new WeakMap,this._handler=r,this.proxify(t,[])}makeHandler(t){let r=this;return{get(n,i,o){return r._handler.get?r._handler.get(n,[...t,i],o):n[i]},set(n,i,o,s){return typeof o=="object"&&(o=r.proxify(o,[...t,i])),n[i]=o,r._handler.set&&r._handler.set(n,[...t,i],o,s),!0},deleteProperty(n,i){if(Reflect.has(n,i)){r.unproxy(n,i);let o=Reflect.deleteProperty(n,i);return o&&r._handler.deleteProperty&&r._handler.deleteProperty(n,[...t,i]),o}return!1}}}unproxy(t,r){this._preproxy.has(t[r])&&(t[r]=this._preproxy.get(t[r]),this._preproxy.delete(t[r]));for(let n of Object.keys(t[r]))typeof t[r][n]=="object"&&this.unproxy(t[r],n)}proxify(t,r){for(let i of Object.keys(t))typeof t[i]=="object"&&(t[i]=this.proxify(t[i],[...r,i]));let n=new Proxy(t,this.makeHandler(r));return this._preproxy.set(n,t),n}}const N=(e=[])=>(Array.isArray(e)&&(e=e.join(".")),e=e.replaceAll("[",".").replaceAll("]",".").replaceAll("..",".").trim(),e.endsWith(".")&&(e=e.slice(0,-1)),e);class ae{constructor(){U(this,"events",{}),U(this,"prevValues",{}),U(this,"trackTimeout",void 0)}subscribe(t,r){return t=N(t),this.events[t]||(this.events[t]=[],this.prevValues[t]=void 0),this.events[t].push(r),(()=>{let i=!0;return{event:t,callback:r,render:()=>{if(i&&this.events[t])for(let o of this.events[t])o()},unsubscribe:()=>{i&&(i=!1,this.events[t]&&(this.events[t]=this.events[t].filter(o=>o!==r)))}}})()}publish(t,r){this.events[t]?this.prevValues[t]!=r?(this.prevValues[t]=r,this.events[t].forEach(n=>n(r))):console.log("data didnt change:",t):console.log("no events subscribed yet:",t)}unsubscribe(t){}track(){clearTimeout(this.trackTimeout),this.trackTimeout=setTimeout(()=>{console.log("---------------------------"),console.log("Subscription tracking".toUpperCase()),console.log("---------------------------");let t=0;for(let r of Object.keys(this.events)){let n=this.events[r].length;console.log("Sub:",r,n),t+=n}console.log(""),console.log("TOTAL: ",t+" active subscriptions"),console.log("-------------------------------------")},100)}}const ue=function(e){const t=new ae;return e=new ce(e,{set(i,o,s,c){try{let a=N(o),u=typeof i[a];return a.indexOf("__")==0||(u!=="object"||Array.isArray(i[a]))&&t.publish(N(o),s),!0}catch(a){console.warn(a),console.log(o,N(o),s)}},deleteProperty(i,o){delete t.events[N(o)]},getPath(i,o){console.log("getPath",o.split("."),i)}}),[e,function(i,o){return t.subscribe(N(i),o)},function(){for(let i of Object.keys(t.events))t.publish(i)},t]},fe=function(e={}){let[t,r,n]=ue(e);return{scope:t,connect:r,render:n}};function xt(e){var t=[];if(e)for(e=e.firstChild;e!=null;)e.nodeType==3?t[t.length]=e:t=t.concat(xt(e)),e=e.nextSibling;return t}const pe=function(e,t,r=[],n={actions:{}}){for(let i of r){n.actions.hasOwnProperty(t)||(n.actions[t]=[]);let o=i.replace("@","").trim(),s=e.getAttribute(i).trim().replace("this.",""),c=e.getAttribute(i).replaceAll("{{","${").replaceAll("}}","}");n.actions[t].push({type:"action",action:i,sourceAttribute:o,targetAttribute:s,query:c,selector:t,setup:function(a){let u=a.querySelector(t);if(i.indexOf("model")>-1){const l=ne(a,u,s);return u.removeAttribute(i),l}else{let l=c.trim().split("(").map(h=>h.trim()).filter(h=>h.length>0),p=l[0].replace("this.",""),f=[];l.length>1&&(f=l[1].split(")").map(h=>h.trim()).filter(h=>h.length>0)[0].split(",").map(h=>h.trim()));const d=()=>{oe(a,u,i.replaceAll("@",""),p,f)};return d(a,u,i.replaceAll("@","")),u.removeAttribute(i),d}}})}return n};function de(e,t,r=[],n={keywords:{}}){for(let i of r){const o=e.getAttribute(i),s=o.replaceAll("{{","${").replaceAll("}}","}");let c=K(o);for(let a of c)n.keywords.hasOwnProperty(a)||(n.keywords[a]=[]),n.keywords[a].push({type:"attribute",attribute:i,query:s,selector:t,setup:function(u){let l=u.querySelector(t);return function(f){try{re(f,l,i,s)}catch(d){console.warn(d)}}}})}return n}let X=0;const at=function(e,t,r,n,i={}){i={initial:!1,...i};let o=e.getAttribute("id");i.initial&&(e=e.content);const s=document.querySelector("head"),c=[];r.replace("*","").trim();const a="data-el-template-connection",u="["+a+"]";let l={connectionSelector:a,template:e,templateId:o,identifiers:{}};const p=function(f,d,h={}){h={root:!1,...h};const v=[...f.querySelectorAll("*")].filter(g=>g.getAttributeNames().indexOf(r)>-1);for(let g of v){X++;try{let _=g.getAttribute("id");if(_){console.log("has child id already",g);continue}else _=d+"__"+X;p(g,_),g.setAttribute("id",_);const A=d+"__nested-operation-map__"+X,m=document.createElement("div"),b=g.cloneNode(!0),x=document.createElement("template"),y=g.getAttribute(r);m.dataset.elTemplateConnection=A,x.setAttribute("id",A),x.appendChild(b),s.appendChild(x),f.querySelector("#"+_).replaceWith(m),l.identifiers.hasOwnProperty(A)||(l.identifiers[A]={}),l.identifiers[A].query=y,c.push({placeholder:m,childTemplate:x,parent:e,parentId:o})}catch{}}};return p(e,o,{root:!0}),l.childOperations=c,l.id=o,l.operation=r,l.selector,l.template=e,l.initialized=!1,l.setup=function(f,d){d=d||f;for(let h of[...d.querySelectorAll(u)])if(l[0].identifiers[h.dataset.elTemplateConnection]&&l[0].operation=="*if"){const v=document.createComment("");v.identifiers=Object.assign({},l[0].identifiers);const g=l[0].identifiers[h.dataset.elTemplateConnection].query;delete v.identifiers[h.dataset.elTemplateConnection];const A=document.head.querySelector("#"+h.dataset.elTemplateConnection).firstElementChild.cloneNode(!0),m=K("{{"+g+"}}");h.replaceWith(v);const b=function(){const y=Function("return `${"+g+"}`;").call(f);["true",!0].indexOf(y)>-1?A.isConnected||v.after(A):A.isConnected&&A.remove();for(let P of Object.keys(v.identifiers)){let k=[...f.querySelectorAll("[data-el-template-connection]")];for(let $ of k)if($.dataset.elTemplateConnection==P){const O=v.identifiers[P].query;delete v.identifiers[P];const H=document.head.querySelector("#"+$.dataset.elTemplateConnection).firstElementChild.cloneNode(!0),nt=document.createComment(""),wt=K("{{"+O+"}}");$.replaceWith(nt);const ot=function(){const Ct=Function("return `${"+O+"}`;").call(f);["true",!0].indexOf(Ct)>-1?H.isConnected||nt.after(H):H.isConnected&&H.remove()};for(let st of wt)f.__connect(st,ot);ot()}}};for(let x of m)f.__connect(x,b);A.removeAttribute("*if"),b();for(let x of[...A.querySelectorAll(u)])l[0].setup(f,x)}console.log("setup",l)},l=[l],console.log(l),l};function he(e,t){let r=e.parentNode;if(!r){let o=e.cloneNode(!0);r=document.createElement("span"),e.replaceWith(r),r.appendChild(o),e=o}let n=At(r),i=(r==null?void 0:r.childNodes)||[];for(let o=0;o<i.length;o++){let s=i[o];if(s.textContent.indexOf("{{")>-1){const c=s.textContent,a=o;let u=K(c);const l=c.replaceAll("{{","${").replaceAll("}}","}");for(let p of u)t.keywords.hasOwnProperty(p)||(t.keywords[p]=[]),t.keywords[p].push({attribute:"textNode",type:"text",query:l,originalQuery:c,selector:n,nodeIndex:a,setup:function(f){let d=f.querySelector(n).childNodes[a];return function(){ie(f,d,l)}}})}}return t}const be=function(e){let t=e.content,r=[...t.querySelectorAll("[data-el-if]")],n=[...t.querySelectorAll("[data-el-for]")];const i={};i.keywords={},i.actions={},i.operations={"*if":at(e,r,"*if","data-el-if",{initial:!0}),"*for":at(e,n,"*for","data-el-for",{initial:!0})},n.map(c=>c.remove()),t=e.content;let o=[...t.querySelectorAll("*")];for(let c of o){const a=c.getAttributeNames(),u=a.filter(f=>f.indexOf("@")>-1),l=a.filter(f=>c.getAttribute(f).indexOf("{{")>-1);let p=At(c);u&&u.length>0&&pe(c,p,u,i),l&&l.length>0&&de(c,p,l,i)}const s=xt(e.content).filter(c=>c.textContent.indexOf("{{")>-1);for(let c of s)he(c,i);return i},z=function(e,t,r,n){let i=e,o=e.charAt(t+r.length),s=e.charAt(t-1),c=t==0||!rt(s)&&s!=".",a=t+r.length>e.length||!rt(o);if(c&&a){i=e.split("");let u=e.slice(0,t),l=e.slice(t+r.length);i=u+n+l}return i},ut=function(e,t,r,n={}){n={templateId:!1,...n};const i=n.templateId||"el-component-template__"+r,o=document.querySelector("head");let s=o.querySelector("#"+i);if(!s){const c=t.props||[],a=t.actions||[];s=document.createElement("template");let u=E(e)||[];for(let l of u){let p=l;for(let f of a){let d=D(l,f);if(d.length>0){d.reverse();for(let h of d)p=z(p,h,f,"this.parent."+f)}}e=e.replaceAll("{{"+l+"}}","{{"+p+"}}")}u=E(e);for(let l of u){let p=l;for(let f of c){let d=D(l,f);if(d.length>0){d.reverse();for(let h of d)p=z(p,h,f,"this."+f)}}e=e.replaceAll("{{"+l+"}}","{{"+p+"}}")}u=E(e,'*if="','"');for(let l of u){let p=l;for(let f of c){let d=D(l,f);if(d.length>0){d.reverse();for(let h of d)p=z(p,h,f,"this."+f)}}e=e.replaceAll('*if="'+l+'"','*if="'+p+'" data-el-if="true"')}u=E(e,'*for="','"');for(let l of u){let p=l.trim(),f=p.split(";").map(_=>_.trim()).filter(_=>_.length>0),d=f[0],h=d.split(" of ").map(_=>"{"+_.trim()+"}").filter(_=>_.length>2),v=h[0].replaceAll("{let ","").replaceAll("{const ","").replaceAll(" ","").replaceAll("}","").replaceAll("{",""),g=h[1].replaceAll(" ","").replaceAll("}","");d=v+" of this."+g,f[0]=d,p=f.join(";").trim(),e=e.replaceAll('*for="'+l+'"','*for="'+p+'" data-el-for="true"')}u=E(e,">","<");for(let l of u)e=e.replaceAll(">"+l+"<",">"+l.trim()+"<");e=e.replaceAll("\\r","").replaceAll("\\n","").replaceAll(`\r
`,"").replaceAll("  "," ").trim(),s.setAttribute("id",i),s.innerHTML=e,o.appendChild(s)}return s},me=function(e,t){e.__defineGetter__(t,()=>e.__scope[t]),e.__defineSetter__(t,i=>typeof e.__scope[t]=="object"?e.__scope[t]:(e.__scope[t]=i,!0));let r=e.getAttribute(t),n=e.getAttribute("@"+t);if(r!==null){if(!isNaN(r))r=Number(r);else if(["true",!0].indexOf(r)>-1)r=!0;else if(["false",!1].indexOf(r)>-1)r=!1;else try{let i=JSON.parse(r);typeof i=="object"&&(r=i)}catch{}e.__scope[t]=r}n!==null&&console.log("@TODO - connect passed value","@"+t,n)},_e=function(e){for(let t of e.constructor.props)me(e,t)};function I(e,t,r){return t=ge(t),t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function ge(e){var t=ye(e,"string");return typeof t=="symbol"?t:String(t)}function ye(e,t){if(typeof e!="object"||!e)return e;var r=e[Symbol.toPrimitive];if(r!==void 0){var n=r.call(e,t||"default");if(typeof n!="object")return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return(t==="string"?String:Number)(e)}class L{constructor(){if(I(this,"__id",0),I(this,"__registry",{}),I(this,"__mapTemplateConnections",function(t){return be(t)}),L.instance)return L.instance;L.instance=this}__parseTemplatePointers(t,r,n){return ut(t,r,n)}register(t,r){let{selector:n,template:i,styles:o,shadow:s}={...t};if(!this.__registry.hasOwnProperty(n)&&customElements.get(n)===void 0){const c=document.head;let a;o&&(a=document.createElement("style"),a.innerHTML=o);const u=ut(i,r,n),l=this.__mapTemplateConnections(u,r);this.__registry[n]={component:r,template:u,connections:l,styles:a,shadow:s},!s&&a&&c.appendChild(a),customElements.define(t.selector,r)}}setup(){}load(t){const r=this.__registry[t],n=r.template.content.cloneNode(!0),i=r.connections;this.setup(n,i);const o=r.id;return{template:n,connections:i,id:o}}}I(L,"instance",null);const ft=new L;class ve extends HTMLElement{static register(t){const r={shadow:!1,template:`<h1>${t.config.selector} is registered</h1>`,styles:"",...t.config};ft.register(r,t)}constructor(){super(),I(this,"__initAndApplyConnections",function(){const n=this.__templateConnections;this.scope={},this.__subscriptions=[];for(let i of Object.keys(n.keywords))for(let o of n.keywords[i]){const s=o.setup(this);let c=this.__connect(St(i),()=>s(this));this.__subscriptions.push(c),s(this)}for(let i of Object.keys(n.actions))for(let o of n.actions[i])o.setup(this);for(let i of Object.keys(n.operations))for(let o of n.operations[i])o.setup(this);_e(this)}),this.__config=this.constructor.config;const{template:t,connections:r}=ft.load(this.__config.selector);this.__template=t,this.__templateConnections=r,this.appendChild(this.__template)}__getTemplateElement(t=!1){let r=this.__templateElement;if(!r){if(r=document.querySelector("#"+this.__templateId),!r){const n=document.querySelector("head");r=document.createElement("template"),r.setAttribute("id",this.__templateId),r.innerHTML=this.__template,n.appendChild(r)}this.__templateElement=r}return t&&(r=this.__templateElement.content.cloneNode(!0)),r}connectedCallback(){if(!this.getAttribute("el-connected")){this.setAttribute("el-connected",!0);const t=this.constructor.props,r={};for(let c of t)r[c]=this.getAttribute(c)??this[c];const{scope:n,connect:i,render:o,pubsub:s}=fe(r);this.__scope=n,this.__connect=i,this.__initAndApplyConnections()}}}function w(e,t,r){return t=Ae(t),t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function Ae(e){var t=xe(e,"string");return typeof t=="symbol"?t:String(t)}function xe(e,t){if(typeof e!="object"||!e)return e;var r=e[Symbol.toPrimitive];if(r!==void 0){var n=r.call(e,t||"default");if(typeof n!="object")return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return(t==="string"?String:Number)(e)}const we=`\r
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
    <div class="subsection bg-white border border-{{color == 'white' ? 'gray' : color}}-400 " *if="caption == 'render'">\r
      It Renders inside shows {{title}}\r
    </div>\r
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
</section>`;class M extends ve{constructor(){super(),w(this,"title","El Upgrade"),w(this,"description","Element framework made with ❤️ by Pihh"),w(this,"caption","Edit this caption!!"),w(this,"propagation","Propagated data"),w(this,"color","blue"),w(this,"colors",["white","yellow","green","red","blue"].map(t=>({id:t,name:t}))),w(this,"counter",0),w(this,"visible",!1)}onClick(t){console.log("onclick",t),this.counter++}}w(M,"config",{selector:"el-upgrade",template:we,styles:""});w(M,"props",["title","description","caption","propagation","color","colors","counter","visible"]);w(M,"actions",[]);M.register(M);
