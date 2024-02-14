(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))i(n);new MutationObserver(n=>{for(const o of n)if(o.type==="childList")for(const l of o.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&i(l)}).observe(document,{childList:!0,subtree:!0});function r(n){const o={};return n.integrity&&(o.integrity=n.integrity),n.referrerPolicy&&(o.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?o.credentials="include":n.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function i(n){if(n.ep)return;n.ep=!0;const o=r(n);fetch(n.href,o)}})();let D=null;function te(){return D===null&&(D=Array.from(document.styleSheets).map(t=>{const e=new CSSStyleSheet,r=Array.from(t.cssRules).map(i=>i.cssText).join(" ");return e.replaceSync(r),e})),D}function re(t){t.adoptedStyleSheets.push(...te())}function M(t){return t.toUpperCase()!=t.toLowerCase()}function V(t,e="{{",r=[]){let i=t.indexOf(e),n=t;return i>-1?(r.push(i),n=n.split(""),n[i]="*",n[i+1]="*",n=n.join(""),V(n,e,r)):r}function S(t,e="{{",r="}}"){let i=[];try{i=t.split(e).slice(1).map(n=>n.split(r)[0])}catch{}return i||[]}const q=function(t=[]){return t.map(e=>e.trim()).filter(e=>e.length>0)},F=function(t,e=[]){const r=S(t);for(let i of r){const n=q(i.split("this.").map(o=>o.replaceAll(" ","")));for(let o of n){let l=o.split(""),c=!1;for(let s=0;s<l.length;s++){const a=l[s];if(!M(a)){if(a=="."||a=="["||a=="]")continue;if(isNaN(a)){const f=l.slice(0,s).join("");e.indexOf(f)==-1&&e.push(f),c=!0;break}else continue}}if(!c){const s=o.trim();e.indexOf(s)==-1&&e.push(s)}}}return[...new Set(e)]},J=function(t,e,r,i){let n=t,o=t.charAt(e+r.length),l=t.charAt(e-1),c=e==0||!M(l)&&l!=".",s=e+r.length>t.length||!M(o);if(c&&s){n=t.split("");let a=t.slice(0,e),f=t.slice(e+r.length);n=a+i+f}return n},ie=function(t){let e=t.content.firstElementChild.innerHTML,r=S(e);for(let i of r){const n="{{"+i+"}}",o="{{"+i.replaceAll(" ","")+"}}";e=e.replaceAll(n,o)}try{t.innerHTML=e}catch{debugger}return t};function ne(t,e,r){let i=[],n=t.indexOf(e),o=t,l=!1;n>-1&&i.push(n);for(let c=n+1;c<t.length;c++){let s=t.charAt(c);if(s===e&&i.push(c),s===r&&i.pop(),i.length===0){l=!0,i=[n,c],o=t.substring(n+e.length,c);break}}return i==-1&&(l=!1),{indices:i,success:l,content:o}}let oe=0;const Y=function(t){let e="__$index__"+oe++,r={index:e,success:!1},i=ne(t,"(",")");return i.content=i.content.replace("(","").trim(),i.args=q(i.content.split(";")).map(n=>n.trim()).map(n=>(n.indexOf("let ")==0&&(n=n.replace("let ","").trim()),n.indexOf("const ")==0&&(n=n.replace("const ","").trim()),n)),i=i.args.map(n=>{let o=n.indexOf(" of ")>-1?"query":"index",l=q(n.split(o=="query"?" of ":" = "));return n={query:n,attribute:l[0].trim(),source:l[1].trim(),queryType:o},o=="index"?(e=n.source,r.index=n.source):r.query=n,n}),r},z=function(t,e,r,i){for(let n of S(t,'model="'+e,'"'))n==""&&(t=t.replaceAll('model="'+e,'model="'+r+"["+i+"]"));for(let n of S(t)){let o=n.trim();o.indexOf(e)==0&&(!o.replace(e,"").charAt(0)||!M(o.replace(e,"").charAt(0)))&&(t=t.replaceAll("{{"+n+"}}","{{"+n.replace(e,"this."+r+"["+i+"]")+"}}"))}for(let n of S(t,"@for(",")")){let o=n.trim(),l=o.split(" of ")[1].trim();l.indexOf(e)==0&&(!l.replace(e,"").charAt(0)||!M(l.replace(e,"").charAt(0)))&&(l=l.replace(e,r+"["+i+"]"),o=o.split(" of ")[0]+" of "+l,t=t.replaceAll("@for("+n+")","@for("+o+")"))}return t};let se=0;const le=function(t,e,r){let i=0;for(;t.indexOf("@for")>-1&&(i++,!(i>25));){const n=V(t,"@for"),o=V(t,"{");if(n.length==0)break;let l=n[0],c=o.filter(f=>f>l)[0],s=[0],a;for(let f=c+1;f<t.length;f++){let u=t.charAt(f);if(u=="}"&&s.pop(),u=="{"&&s.push(1),s.length==0){let O=t.slice(0,l-1),C=t.slice(f+1),w=t.slice(c+1,f-1),p=e+"_"+Date.now(),_="$index"+se++,d=t.slice(l,c-1)+";index = "+_+")";Y(d);let y=d.split(";")[0].split("(")[1].replaceAll(")",""),h=y.split(" of ")[0].trim(),T=y.split(" of ")[1].trim();w=z(w,h,T,_);const g=S(w,h="@for(",")");for(let H of g){let E=H.split(" of ");if(E.length>1&&(E=E[1].trim(),E.indexOf(h)==0)){let x=E.replace(h,"");if(!(x.length>0&&M(x.charAt(0)))){let K=H.replace(" of "+h," of "+h+"["+_+"]");w=w.replace("@for("+H+")","@for("+K+")")}}}let v='<span data-for-connection="'+p+'" data-for-query="'+d.replace("@for","")+'">@__for()</span>';const k=document.createElement("template"),$=document.createElement("div");document.head.appendChild(k),$.innerHTML=w.replaceAll("\r","").replaceAll(`
`,"").trim(),k.content.appendChild($),k.setAttribute("id","template-"+p),t=O+v+C,t=z(t,h,T,_),a=new G(p,r);break}}a&&a.setup()}return t=t.replaceAll("@__for","@for"),t},ce=function(t,e){return t=le(t,e,[]),t},ae=function(t,e=[],r=[]){let i=[];i=S(t);for(let n of i){let o=n;for(let l of r){let c=V(n,l);if(c.length>0){c.reverse();for(let s of c)o=J(o,s,l,"this.parent."+l)}}t=t.replaceAll("{{"+n+"}}","{{"+o+"}}")}t=t=="string"?t:t.innerHTML,i=S(t);for(let n of i){let o=n;for(let l of e){let c=V(n,l);if(c.length>0){c.reverse();for(let s of c)o=J(o,s,l,"this."+l)}}t=t.replaceAll("{{"+n+"}}","{{"+o+"}}")}return t},m={};class G{constructor(e,r=[]){if(this.__originalId=e,this.__id="template-"+e,this.__scope=r||[],this.initialSetup=!1,m.hasOwnProperty(this.__id))return m[this.__id];this.__original=document.querySelector("#"+this.__id),m[this.__id]=this}setup(){if(!m[this.__id].initialSetup){m[this.__id].initialSetup=!0,m[this.__id].__template=document.createElement("template"),m[this.__id].__cleanedUpInnerHTML=ie(this.__original),m[this.__id].__cleanedUpInnerHTML=ae(m[this.__id].__original,m[this.__id].__scope),m[this.__id].__cleanedUpInnerHTML=ce(m[this.__id].__cleanedUpInnerHTML,this.__originalId),m[this.__id].__placeholder=document.createElement("div"),m[this.__id].__placeholder.innerHTML=m[this.__id].__cleanedUpInnerHTML,m[this.__id].__template.content.appendChild(m[this.__id].__placeholder),m[this.__id].__template.setAttribute("id",m[this.__id].__id),m[this.__id].__children=[],m[this.__id].__customParameters={};for(let e of Object.keys(m[this.__id].__original.dataset))m[this.__id].__template.dataset[e]=m[this.__id].__original.dataset[e];document.querySelector("#"+m[this.__id].__id).replaceWith(m[this.__id].__template)}return m[this.__id]}}function j(t,e,r){return e=ue(e),e in t?Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}):t[e]=r,t}function ue(t){var e=fe(t,"string");return typeof e=="symbol"?e:String(e)}function fe(t,e){if(typeof t!="object"||!t)return t;var r=t[Symbol.toPrimitive];if(r!==void 0){var i=r.call(t,e||"default");if(typeof i!="object")return i;throw new TypeError("@@toPrimitive must return a primitive value.")}return(e==="string"?String:Number)(t)}class I{constructor(){if(j(this,"templates",{}),j(this,"files",{}),j(this,"components",{}),j(this,"prefix","el-"),I.instance)return I.instance;I.instance=this}getName(e){return e.replaceAll("../","")}file(e){}componentSetup(e){let r=e.constructor.name;if(!this.components[r]){let n=Object.assign({},pe),o=Object.assign({},de);o.selector=o.prefix+e.constructor.selector;let l=function(c){return(!c.__setup||!c.__setup.initialSetup)&&(c.__props={},c.__setup=n,c.__config=o,c.__shadowRoot=c.attachShadow({mode:c.__config.shadowRoot}),c.__config.styles=="global"&&re(c.__shadowRoot),c.__setup.initialSetup=!0),c};l(e),this.components[r]={setup:n,configuration:o,callback:l}}return this.components[r]}template(e,r=[]){let i=this.getName(e),n=this.templates[i];return n||(this.templates[i]=new Promise(async o=>{const c=new G(i,r).setup();o(c.__template.content.cloneNode(!0).firstElementChild)}),this.templates[i])}}j(I,"instance",void 0);const pe={didConnect:!1,templateConnected:!1,propertiesTracked:!1,initialSetup:!1},de={selector:"",shadowRoot:"open",styles:"global",prefix:"el-"},Z=new I,he=function(t){return t.replaceAll("this.","").replaceAll("[",".").replaceAll("]",".").replaceAll("..",".").trim().split(".").slice(0).map(e=>(e[0]=="."&&(e=e.slice(1)),e.endsWith(".")&&(e=e.slice(0,-1)),e)).filter(e=>e.length>0)},me=function(t,e,r){let i=typeof r;["boolean","number"].indexOf(i)==-1&&(r="'"+r+"'"),r!==R(t,e)&&Function("return `${this."+e+"="+r+"}`").call(t)},R=function(t,e){try{return Function("return this."+e).call(t)}catch{return Function("return `${this."+e+"}`").call(t)}},_e=function(t,e,r){let{success:i,value:n,path:o}=ye(t.scope,e);if((i||n==null)&&n!==r){const l=`\`\${this.${e} = '`+r+"'}`";P.evaluate(t,l)}},ye=function(t,e){let r=e;Array.isArray(r)||(r=he(r));try{let i=t;for(let n of r)i[n]&&(i=i[n]);return{success:!0,value:i,path:r}}catch{return{success:!1,value:void 0,path:r}}};class N{static update(e,r,i){_e(e,r,i)}static connect(e,r,i,n,o){let l="value",c="keyup",s="text",a=function(u){return u.target.value};e==="checkbox"&&(l="checked",c="change",s="boolean",a=function(u){return u.currentTarget.checked}),e==="number"&&(s="number");let f=function(){let u=P.evaluate(r,n,s);e=="checkbox"?["true",!0].indexOf(u)>-1?i.setAttribute(l,!0):i.removeAttribute(l):i.setAttribute(l,u)};return i.addEventListener(c,function(u){N.update(r,o,a(u))}),f}static text(e,r,i,n){return N.connect("text",e,r,i,n)}static number(e,r,i,n){return N.connect("number",e,r,i,n)}static checkbox(e,r,i,n){return N.connect("checkbox",e,r,i,n)}static select(e,r,i,n){const o=function(a,f){[...a.querySelectorAll("option")].forEach(u=>{f==u.value?u.setAttribute("selected",!0):u.removeAttribute("selected")})},l=function(a){[...a.querySelectorAll("option")].forEach(f=>{f.__didInitialize=f.__didInitialize||[],f.__didInitialize.push(()=>{o(a,R(e.scope,n))})})},c=function(a){const f=r.getAttribute("value");a!=f&&o(r,a)};let s=R(e.scope,n)||void 0;return r.addEventListener("change",a=>{a.target.value!==s&&(s=a.target.value,me(e.scope,n,a.target.value))}),l(r),o(r,R(e.scope,n)),c}}function be(t,e,r){return e=ve(e),e in t?Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}):t[e]=r,t}function ve(t){var e=ge(t,"string");return typeof e=="symbol"?e:String(e)}function ge(t,e){if(typeof t!="object"||!t)return t;var r=t[Symbol.toPrimitive];if(r!==void 0){var i=r.call(t,e||"default");if(typeof i!="object")return i;throw new TypeError("@@toPrimitive must return a primitive value.")}return(e==="string"?String:Number)(t)}class P{static text(e,r,i,n){const o=function(l){const c=P.evaluate(e,n,"text",i);i.textContent=c};return e.connect(r,o),o}static attribute(e,r,i,n,o){const l=function(c){const s=P.evaluate(e,n,"text",i);i.setAttribute(o,s)};return e.connect(r,l),l}static model(e,r,i,n){let o=i.nodeName=="SELECT"?"select":i.getAttribute("type")||"text";const l=N[o](e,i,n,r),c=function(){l()};return e.connect(r,c),c}static evaluate(e,r,i="text",n=!1){try{const o=e;let s=Function("return "+r).call(o.scope);return i=="boolean"?["true",!0].indexOf(s)>-1?s=!0:s=!1:i=="number"&&(s=Number(s)),s}catch(o){return console.log({instance:e,query:r,node:n,type:i}),console.warn(o),r}}}be(P,"lastRender",Date.now());function xe(t,e,r){return e=we(e),e in t?Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}):t[e]=r,t}function we(t){var e=Ae(t,"string");return typeof e=="symbol"?e:String(e)}function Ae(t,e){if(typeof t!="object"||!t)return t;var r=t[Symbol.toPrimitive];if(r!==void 0){var i=r.call(t,e||"default");if(typeof i!="object")return i;throw new TypeError("@@toPrimitive must return a primitive value.")}return(e==="string"?String:Number)(t)}class Oe{constructor(){xe(this,"map",{})}track(e,r={}){this.map.hasOwnProperty(e)||(this.map[e]=[]),delete r.setup,this.map[e].push({node:r.node,eventName:r.eventName,value:r.value,functionName:r.query,argumentList:[],connected:!1,subscriptions:[],connect:function(i){},setup:function(i){this.connected||(this.connected=!0,this.connect(i))},...r})}}function U(t,e,r){return e=Pe(e),e in t?Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}):t[e]=r,t}function Pe(t){var e=Se(t,"string");return typeof e=="symbol"?e:String(e)}function Se(t,e){if(typeof t!="object"||!t)return t;var r=t[Symbol.toPrimitive];if(r!==void 0){var i=r.call(t,e||"default");if(typeof i!="object")return i;throw new TypeError("@@toPrimitive must return a primitive value.")}return(e==="string"?String:Number)(t)}class Ce{async onDidConnect(e){this.map.for.forEach(async r=>{await r.callback()}),this.map.if.forEach(r=>{r.callback()})}constructor(e){U(this,"stack",{if:[],for:[]}),U(this,"map",{if:[],for:[]}),U(this,"__connId",0)}feed(e){}extractQueryIf(e){const r=q(e.textContent.split("@if"))[0].split(")")[0].replace("(","");let i=F("{{"+r+"}}"),n=r;for(let o of i.sort((l,c)=>c-l))n=n.replaceAll("this.scope."+o,o),n=n.replaceAll("this."+o,o),n=n.replaceAll(o,"this."+o);return{query:n,value:r,keywords:i}}extractQueryFor(e){try{const r=q(e.textContent.split("@for"))[0].split(")")[0].replace("(","");let i=q(r.split(" of ")),n=i[0];n.trim().indexOf("let ")==0&&(n=n.trim().replace("let ","")),n.trim().indexOf("const ")==0&&(n=n.trim().replace("const ",""));let o=i[1],l=F("{{"+o+"}}"),c=o;for(let s of l.sort((a,f)=>f-a))c=c.replaceAll("this.scope."+s,s),c=c.replaceAll("this."+s,s),c=c.replaceAll(s,"this."+s);return{query:c,value:r,source:o,variable:n,keywords:l}}catch(r){console.warn(r)}}extractQuery(e){if(e.textContent.indexOf("@if")>-1)return this.extractQueryIf(e)}track(e,r={}){if(e=="@if"){const{query:i,value:n,keywords:o}=this.extractQuery(r.node);let l="if-stack-"+Date.now(),c=r.node.nextElementSibling;c.dataset.elIfContainer=Date.now();const s={operation:"if",prop:e,query:i,value:n,keywords:o,placeholder:c,nodes:[r.node]};if(this.stack.if.length>0){const a=document.createElement("div");a.setAttribute("id",l),this.stack.if[this.stack.if.length-1].nodes.push(a),s.connector="#"+l}this.stack.if.push(s)}else if(e=="@endif")try{let i=this.stack.if.pop(),n=i.nodes[0],o=i.placeholder,l={operation:"if",start:n,content:o,query:i.query,value:i.value,keywords:i.keywords,hasParent:i.connector,connected:!1,callback:function(){},connect:function(c){const s=document.createComment("if placeholder ");s.content=o;const a=c.shadowRoot.querySelector('[data-el-if-container="'+i.placeholder.dataset.elIfContainer+'"]');i.nodes[0].replaceWith(s);try{o.remove()}catch{}let f=function(){const O=Function("return `${"+i.query+"}`").call(c);["true",!0].indexOf(O)>-1?s.after(o):o.remove()};for(let u of i.keywords)c.connect(u,f);this.callback=f},setup:function(c){this.connected||(this.connected=!0,this.connect(c))}};this.map.if.push(l)}catch(i){console.warn(i)}else if(e=="@for"){const i=r.node.parentElement,n=i.dataset.forQuery,o=i.dataset.forConnection;if(!n||n.indexOf("<sp")>-1){r.node.textContent="";return}let l=Y(n);const c={operation:"for",replacement:i,query:n,connection:o,connected:!1,...l,callback:function(){},connect:function(s,a={}){const f=s.shadowRoot.querySelector('[data-for-connection="'+o+'"]');if(!f)return;let u=document.createComment("for placeholder ");f.dataset.forQuery;const O=(a==null?void 0:a.indices)||{};let C=new G(o,s.__props);C=C.setup(),u._setup=l,f.replaceWith(u),u.content=C,u.controller=s,u.stack=[],u.display=[],u._indices={};let w=async function(_){const d=u.content.__template.content.firstElementChild.cloneNode(!0);d.dataset.elIndex=JSON.stringify({...O,[l.index]:_}),u._indices[l.index]=_,d.innerHTML=d.innerHTML.replaceAll(l.index,_);for(let b of Object.keys(O))b!==l.index&&(d.innerHTML=d.innerHTML.replaceAll(b,O[b]));return u.after(d),await Ne(s,d),d.remove(),d};const p=function(_){_===void 0&&(_=R(s,l.query.source+".length"));let d=[];for(let b=u.stack.length;b<_;b++)d.push(new Promise(y=>{w(b).then(h=>{u.after(h),u.stack.push(h),u.display.push(h),y(h)})}));Promise.all(d).then(b=>{for(let h=u.display.length;h<_;h++)u.display.push(u.stack[h]),u.after(u.stack[h]);let y=[];for(let h=_;h<u.display.length;h++)y.push(h);y.reverse();for(let h of y)u.display[h].remove(),u.display.pop()})};u.callback=p,u.generate=w,s.connect(l.query.source+".length",p),this.callback=p},setup:function(s,a={}){this.connected||(this.connected=!0,this.connect(s,a),this.callback())}};this.map.for.push(c)}}}function ke(t,e,r){return e=Te(e),e in t?Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}):t[e]=r,t}function Te(t){var e=$e(t,"string");return typeof e=="symbol"?e:String(e)}function $e(t,e){if(typeof t!="object"||!t)return t;var r=t[Symbol.toPrimitive];if(r!==void 0){var i=r.call(t,e||"default");if(typeof i!="object")return i;throw new TypeError("@@toPrimitive must return a primitive value.")}return(e==="string"?String:Number)(t)}class Ee{constructor(){ke(this,"map",{})}track(e,r={}){this.map.hasOwnProperty(e)||(this.map[e]=[]),delete r.setup,this.map[e].push({node:r.node,type:r.type,value:r.value,query:r.query,connected:!1,subscriptions:[],connect:function(i){},setup:function(i){if(this.connected)return this.subscriptions;this.subscriptions=this.connect(i)||[],this.connected=!0},...r})}}var Le=function(t){return Array.prototype.map.call(t,function(e){return{att:e.name,value:e.value,reactive:e.value.indexOf("{{")>-1,action:e.name.indexOf("@")>-1,model:e.name.indexOf("model")==0}})};const ee=function(t){const e=new Ee,r=new Oe,i=new Ce(t);var n=function(o,l){const c=o.controller||o;return o.controller=c,Array.prototype.map.call(o.childNodes,function(s){var C,w;s.controller=o.controller;var a={content:s.childNodes&&s.childNodes.length>0?null:s.textContent,atts:s.nodeType!==1?[]:Le(s.attributes),type:s.nodeType===3?"text":s.nodeType===8?"comment":s.tagName.toLowerCase(),node:s};for(let p of["if","for"]){let _=((C=s==null?void 0:s.data)==null?void 0:C.indexOf("@"+p))??-1,d=((w=s==null?void 0:s.data)==null?void 0:w.indexOf("@end"+p))??-1;_>-1?i.track("@"+p,{node:s}):d>-1&&i.track("@end"+p)}i.feed(s),a.reactive=a.content&&a.content.indexOf("{{")>-1&&!a.operation;let f=a.atts.filter(p=>p.reactive);if(f.length>0)for(let p of f){let _=p.att,d=p.value;for(let b of S(p.value)){let y=F("{{"+b.trim()+"}}");for(let h of y){let T=h,g=p.value;g=g.replaceAll("{{"+b+"}}","{{"+b.replaceAll(T,h)+"}}"),g="`"+g.replaceAll("{{","${").replaceAll("}}","}")+"`",e.track(h,{node:s,type:"attribute",value:d,query:g,connect:function(v){let k;_=="model"?k=P.model(v,h,s,g):k=P.attribute(v,h,s,g,_),k()}})}}}if(a.atts.filter(p=>p.model).length>0){let p=s.getAttribute("model"),_=p.indexOf("this.")>-1?p:"this."+p,d="`${"+_+"}`";e.track(p,{node:s,type:"model",value:_,query:d,connect:function(b){P.model(b,p,s,d)()}})}if(a.reactive)for(let p of S(a.content)){let _=F("{{"+p.trim()+"}}");for(let d of _){let b=d,y=a.content;y=y.replaceAll("{{"+p+"}}","{{"+p.replaceAll(b,d)+"}}"),y="`"+y.replaceAll("{{","${").replaceAll("}}","}")+"`",e.track(d,{node:s,type:"text",value:a.content,query:y,connect:function(h){P.text(h,d,s,y)()}})}}let O=a.atts.filter(p=>p.action);if(O.length>0)for(let p of O){p=p.att;const _=s.hasOwnProperty(p)?"native":"custom";let d=p.replaceAll("@","");const b=s.getAttribute(p),y=s.getAttribute(p).trim().replaceAll(" ",""),h=y.split("(").map(v=>v.trim()).filter(v=>v.length>0),T=h[0];let g=[];h.length>1&&(g=h[1].split(")").map(v=>v.trim()).filter(v=>v.length>0)[0].split(",")),d.indexOf("on")==0&&typeof s[d.slice(2)]=="function"&&(d=d.slice(2)),r.track(p,{node:s,type:_,value:b,eventName:d,query:y,actionName:T,args:g,connect:function(v){s.addEventListener(d,function(k){const $=v.scope;$.$event=k;let H=JSON.parse(s.getAttribute("el-index")||JSON.stringify({$index:0}));for(let[x,K]of Object.entries(H))$[x]=K;let E=g.map(x=>$.hasOwnProperty(x)?$[x]:isNaN(x)?["'",'"',"`"].indexOf(x.trim().charAt(0))>-1?x.trim().slice(1,x.trim().length-1):x:Number(x));v[T](...E)})}})}return a.isSVG=l||a.type==="svg",a.children=n(s,a.isSVG),a})};return n(t),{props:e,actions:r,operations:i}},Ne=function(t,e){var s;if((s=e==null?void 0:e.__setup)!=null&&s.templateConnected)return;const{props:r,actions:i,operations:n}=ee(e),o=r.map;for(let a of Object.keys(o)){const f=o[a];for(let u of f)a.endsWith("[")||u.setup(t)}for(let a of Object.keys(i.map))for(let f of i.map[a])f.node.removeAttribute(a),f.setup(t);let l=n.map.for;for(let a of l){let f={};e.dataset.elIndex&&(f.indices=JSON.parse(e.dataset.elIndex)),a.setup(t,f)}let c=t.operations.map.if;for(let a of c)a.setup(t);return e.__setup={},e.__setup.templateConnected=!0,e},qe=function(t){if(t.__setup.templateConnected)return;const e=t.reactiveProps.map;for(let o of Object.keys(e)){const l=e[o];for(let c of l)c.setup(t)}const r=t.actions.map;for(let o of Object.keys(r))for(let l of r[o])l.node.removeAttribute(o),l.setup(t);let i=t.operations.map.for;for(let o of i)o.setup(t);let n=t.operations.map.if;for(let o of n)o.setup(t);t.__setup.templateConnected=!0},Ie=function(t){const{props:e,actions:r,operations:i}=ee(t.__template);t.reactiveProps=e,t.actions=r,t.operations=i},L=function(t){return Array.isArray(t)||(t=t.replaceAll("[","."),t=t.split(".").map(e=>e.replaceAll("]","").replaceAll(".","").trim())),t=t.join("."),t};function W(t,e,r){return e=Me(e),e in t?Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}):t[e]=r,t}function Me(t){var e=He(t,"string");return typeof e=="symbol"?e:String(e)}function He(t,e){if(typeof t!="object"||!t)return t;var r=t[Symbol.toPrimitive];if(r!==void 0){var i=r.call(t,e||"default");if(typeof i!="object")return i;throw new TypeError("@@toPrimitive must return a primitive value.")}return(e==="string"?String:Number)(t)}class je{constructor(){W(this,"events",{}),W(this,"prevValues",{}),W(this,"trackTimeout",void 0)}subscribe(e,r){return e=L(e),this.events[e]||(this.events[e]=[],this.prevValues[e]=void 0),this.events[e].push(r),(()=>{let n=!0;return{event:e,callback:r,render:()=>{if(n&&this.events[e])for(let o of this.events[e])o()},unsubscribe:()=>{n&&(n=!1,this.events[e]&&(this.events[e]=this.events[e].filter(o=>o!==r)))}}})()}publish(e,r){this.events[e]?this.prevValues[e]!=r?(this.prevValues[e]=r,this.events[e].forEach(i=>i(r))):console.log("data didnt change:",e):console.log("no events subscribed yet:",e)}unsubscribe(e){console.log("@TODO unsubscribe")}track(){clearTimeout(this.trackTimeout),this.trackTimeout=setTimeout(()=>{console.log("---------------------------"),console.log("Subscription tracking".toUpperCase()),console.log("---------------------------");let e=0;for(let r of Object.keys(this.events)){let i=this.events[r].length;console.log("Sub:",r,i),e+=i}console.log(""),console.log("TOTAL: ",e+" active subscriptions"),console.log("-------------------------------------")},100)}}class Re{constructor(e,r){return this._preproxy=new WeakMap,this._handler=r,this.proxify(e,[])}makeHandler(e){let r=this;return{get(i,n,o){return r._handler.get?r._handler.get(i,[...e,n],o):i[n]},set(i,n,o,l){return typeof o=="object"&&(o=r.proxify(o,[...e,n])),i[n]=o,r._handler.set&&r._handler.set(i,[...e,n],o,l),!0},deleteProperty(i,n){if(Reflect.has(i,n)){r.unproxy(i,n);let o=Reflect.deleteProperty(i,n);return o&&r._handler.deleteProperty&&r._handler.deleteProperty(i,[...e,n]),o}return!1}}}unproxy(e,r){this._preproxy.has(e[r])&&(e[r]=this._preproxy.get(e[r]),this._preproxy.delete(e[r]));for(let i of Object.keys(e[r]))typeof e[r][i]=="object"&&this.unproxy(e[r],i)}proxify(e,r){for(let n of Object.keys(e))typeof e[n]=="object"&&(e[n]=this.proxify(e[n],[...r,n]));let i=new Proxy(e,this.makeHandler(r));return this._preproxy.set(i,e),i}}const Ve=function(t){const e=new je;return t=new Re(t,{set(n,o,l,c){try{let s=L(o),a=typeof n[s];return s.indexOf("__")==0||(a!=="object"||Array.isArray(n[s]))&&e.publish(L(o),l),!0}catch(s){console.warn(s),console.log(o,L(o),l)}},deleteProperty(n,o){delete e.events[L(o)]},getPath(n,o){console.log("getPath",o.split("."),n)}}),[t,function(n,o){return e.subscribe(L(n),o)},function(){for(let n of Object.keys(e.events))e.publish(n)},e]},Fe=function(t={}){let[e,r,i]=Ve(t);return{scope:e,connect:r,render:i}},Ke=function(t){const e={};t.__props=Object.getOwnPropertyNames(t).filter(l=>l.indexOf("_")!=0&&typeof l!="function"),t.__props.forEach(l=>{e[l]=t.getAttribute(l)||t[l],t.setAttribute(l,e[l])});const{scope:r,connect:i,render:n,pubsub:o}=Fe(e);t.scope=r,t.connect=i,t.render=n,t.pubsub=o;for(let l of Object.keys(t.scope))t.__defineGetter__(l,function(){return t.scope[l]});return t},De=async function(t){t.__template=await Z.template(t.constructor.selector,t.__props),t.__shadowRoot.appendChild(t.__template)};function Ue(t,e,r){return e=We(e),e in t?Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}):t[e]=r,t}function We(t){var e=Qe(t,"string");return typeof e=="symbol"?e:String(e)}function Qe(t,e){if(typeof t!="object"||!t)return t;var r=t[Symbol.toPrimitive];if(r!==void 0){var i=r.call(t,e||"default");if(typeof i!="object")return i;throw new TypeError("@@toPrimitive must return a primitive value.")}return(e==="string"?String:Number)(t)}function Ge(t){const e={...t};return function(r){class i extends r{constructor(){super()}}Ue(i,"selector",e.selector);try{customElements.define(e.selector,r)}catch(n){console.warn(n)}return i}}class Je extends HTMLElement{constructor(){super(...arguments),this.__init()}__init(){Z.componentSetup(this)}async __hidrate(){Ke(this),await De(this),await Ie(this),await qe(this)}async __initialConnection(){this.__setup.didConnect||(this.__setup.didConnect=!0,await this.__hidrate(),this.operations.onDidConnect(this))}connectedCallback(){this.__initialConnection(),this.render()}attributeChangedCallback(e,r,i){console.log("attributeChangedCallback",e,r,i)}render(){console.log(this)}fn(e,r,i,n,o){console.log("FN CALLED",{$event:e,$index:r,text:i,str:n,num:o})}addColor(){this.colors.push("new-color")}customFn(){console.log("Custom FN CALLED")}}var B,X,Q;function A(t,e,r){return e=ze(e),e in t?Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}):t[e]=r,t}function ze(t){var e=Be(t,"string");return typeof e=="symbol"?e:String(e)}function Be(t,e){if(typeof t!="object"||!t)return t;var r=t[Symbol.toPrimitive];if(r!==void 0){var i=r.call(t,e||"default");if(typeof i!="object")return i;throw new TypeError("@@toPrimitive must return a primitive value.")}return(e==="string"?String:Number)(t)}B=Ge({selector:"el-web-component"}),B(X=(Q=class extends Je{constructor(){super(),A(this,"checked",!0),A(this,"checkedd",!0),A(this,"text","text property"),A(this,"object",{key:"object value",title:"Title"}),A(this,"list",["list id: 0"]),A(this,"objectList",[{item:"object list item id: 0"}]),A(this,"color","yellow"),A(this,"colors",["green","red","yellow"]),A(this,"items",["item 1","item 2"]),A(this,"cards",[{title:"Card 1 ",description:"Card 1 description",list:["list 1"]},{title:"Card 2 ",description:"Card 2 description",list:["list 1","list 2"]},{title:"Card 3 ",description:"Card 3 description",list:[]}])}onClick(){this.items.push("item "+this.items.length)}},A(Q,"selector","el-web-component"),Q));
