(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))n(i);new MutationObserver(i=>{for(const s of i)if(s.type==="childList")for(const l of s.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&n(l)}).observe(document,{childList:!0,subtree:!0});function r(i){const s={};return i.integrity&&(s.integrity=i.integrity),i.referrerPolicy&&(s.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?s.credentials="include":i.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function n(i){if(i.ep)return;i.ep=!0;const s=r(i);fetch(i.href,s)}})();let G=null;function ae(){return G===null&&(G=Array.from(document.styleSheets).map(t=>{const e=new CSSStyleSheet,r=Array.from(t.cssRules).map(n=>n.cssText).join(" ");return e.replaceSync(r),e})),G}function oe(t){try{t.adoptedStyleSheets.push(...ae())}catch(e){console.log(e)}}function L(t){return t.toUpperCase()!=t.toLowerCase()}function z(t,e="{{",r=[]){let n=t.indexOf(e),i=t;return n>-1?(r.push(n),i=i.split(""),i[n]="*",i[n+1]="*",i=i.join(""),z(i,e,r)):r}function S(t,e="{{",r="}}"){let n=[];try{n=t.split(e).slice(1).map(i=>i.split(r)[0])}catch{}return n||[]}const I=function(t=[]){return t.map(e=>e.trim()).filter(e=>e.length>0)},V=function(t,e=[]){const r=S(t);for(let n of r){const i=I(n.split("this.").map(s=>s.replaceAll(" ","")));for(let s of i){let l=s.split(""),o=!1;for(let a=0;a<l.length;a++){const c=l[a];if(!L(c)){if(c=="."||c=="["||c=="]")continue;if(isNaN(c)){const f=l.slice(0,a).join("");e.indexOf(f)==-1&&e.push(f),o=!0;break}else continue}}if(!o){const a=s.trim();e.indexOf(a)==-1&&e.push(a)}}}return[...new Set(e)]},J=function(t,e,r,n){let i=t,s=t.charAt(e+r.length),l=t.charAt(e-1),o=e==0||!L(l)&&l!=".",a=e+r.length>t.length||!L(s);if(o&&a){i=t.split("");let c=t.slice(0,e),f=t.slice(e+r.length);i=c+n+f}return i},ce=function(t){let e=t.content.firstElementChild.innerHTML,r=S(e);for(let n of r){const i="{{"+n+"}}",s="{{"+n.replaceAll(" ","")+"}}";e=e.replaceAll(i,s)}try{t.innerHTML=e}catch{debugger}return t};function ue(t,e,r){let n=[],i=t.indexOf(e),s=t,l=!1;i>-1&&n.push(i);for(let o=i+1;o<t.length;o++){let a=t.charAt(o);if(a===e&&n.push(o),a===r&&n.pop(),n.length===0){l=!0,n=[i,o],s=t.substring(i+e.length,o);break}}return n==-1&&(l=!1),{indices:n,success:l,content:s}}let pe=0;const re=function(t){let e,r={index:e,success:!1},n=ue(t,"(",")");n.content=n.content.replace("(","").trim(),n.args=I(n.content.split(";")).map(s=>s.trim()).map(s=>(s.indexOf("let ")==0&&(s=s.replace("let ","").trim()),s.indexOf("const ")==0&&(s=s.replace("const ","").trim()),s));let i=!1;if(n=n.args.map(s=>{let l=s.indexOf(" of ")>-1?"query":"index",o=I(s.split(l=="query"?" of ":" = "));return s={query:s,attribute:o[0].trim(),source:o[1].trim(),queryType:l},l=="index"?(i=!0,e=s.source,r.index=s.source):r.query=s,s}),!i){let s="__index__"+pe++;r.index=s}return r},B=function(t,e,r,n){for(let i of S(t,'model="'+e,'"')){let s=i.trim();(i==""||!L(s.charAt(0)))&&(t=t.replaceAll('model="'+e+i+'"','model="'+r+"["+n+"]"+i+'"'))}for(let i of S(t)){let s=i.trim();s.indexOf(e)==0&&(!s.replace(e,"").charAt(0)||!L(s.replace(e,"").charAt(0)))&&(t=t.replaceAll("{{"+i+"}}","{{"+i.replace(e,"this."+r+"["+n+"]")+"}}"))}for(let i of S(t,"@for(",")")){let s=i.trim(),l=s.split(" of ")[1].trim();l.indexOf(e)==0&&(!l.replace(e,"").charAt(0)||!L(l.replace(e,"").charAt(0)))&&(l=l.replace(e,r+"["+n+"]"),s=s.split(" of ")[0]+" of "+l,t=t.replaceAll("@for("+i+")","@for("+s+")"))}return t};let fe=0;const de=function(t,e,r){let n=0;for(;t.indexOf("@for")>-1&&(n++,!(n>25));){const i=z(t,"@for"),s=z(t,"{");if(i.length==0)break;let l=i[0],o=s.filter(f=>f>l)[0],a=[0],c;for(let f=o+1;f<t.length;f++){let u=t.charAt(f);if(u=="}"&&a.pop(),u=="{"&&a.push(1),a.length==0){let A=t.slice(0,l-1),C=t.slice(f+1),v=t.slice(o+1,f-1),p=e+"_"+Date.now(),y="$index"+fe++,d=t.slice(l+4,o),b=re(d),m=b.query.attribute,_=b.query.source;y=b.index,v=B(v,m,_,y);const T=S(v,"@for(",")");for(let H of T){let E=H.split(" of ");if(E.length>1&&(E=E[1].trim(),E.indexOf(m)==0)){let x=E.replace(m,"");if(!(x.length>0&&L(x.charAt(0)))){let F=H.replace(" of "+m," of "+m+"["+y+"]");v=v.replace("@for("+H+")","@for("+F+")")}}}let g="("+b.query.query+";index = "+b.index+")",w='<span data-for-connection="'+p+'" data-for-query="'+g+'">@__for()</span>';const k=document.createElement("template"),$=document.createElement("div");document.head.appendChild(k),$.innerHTML=v.replaceAll("\r","").replaceAll(`
`,"").trim(),k.content.appendChild($),k.setAttribute("id","template-"+p),t=A+w+C,t=B(t,m,_,y),c=new U(p,r);break}}c&&c.setup()}return t=t.replaceAll("@__for","@for"),t},me=function(t,e){return t=de(t,e,[]),t},he=function(t,e=[],r=[]){let n=[];n=S(t);for(let i of n){let s=i;for(let l of r){let o=z(i,l);if(o.length>0){o.reverse();for(let a of o)s=J(s,a,l,"this.parent."+l)}}t=t.replaceAll("{{"+i+"}}","{{"+s+"}}")}t=t=="string"?t:t.innerHTML,n=S(t);for(let i of n){let s=i;for(let l of e){let o=z(i,l);if(o.length>0){o.reverse();for(let a of o)s=J(s,a,l,"this."+l)}}t=t.replaceAll("{{"+i+"}}","{{"+s+"}}")}return t},h={};class U{constructor(e,r=[]){if(this.__originalId=e,this.__id="template-"+e,this.__scope=r||[],this.initialSetup=!1,h.hasOwnProperty(this.__id))return h[this.__id];this.__original=document.querySelector("#"+this.__id),h[this.__id]=this}setup(){if(!h[this.__id].initialSetup){h[this.__id].initialSetup=!0,h[this.__id].__template=document.createElement("template"),h[this.__id].__cleanedUpInnerHTML=ce(this.__original),h[this.__id].__cleanedUpInnerHTML=he(h[this.__id].__original,h[this.__id].__scope),h[this.__id].__cleanedUpInnerHTML=me(h[this.__id].__cleanedUpInnerHTML,this.__originalId),h[this.__id].__placeholder=document.createElement("div"),h[this.__id].__placeholder.innerHTML=h[this.__id].__cleanedUpInnerHTML,h[this.__id].__template.content.appendChild(h[this.__id].__placeholder),h[this.__id].__template.setAttribute("id",h[this.__id].__id),h[this.__id].__children=[],h[this.__id].__customParameters={};for(let e of Object.keys(h[this.__id].__original.dataset))h[this.__id].__template.dataset[e]=h[this.__id].__original.dataset[e];document.querySelector("#"+h[this.__id].__id).replaceWith(h[this.__id].__template)}return h[this.__id]}}function R(t,e,r){return e=be(e),e in t?Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}):t[e]=r,t}function be(t){var e=ye(t,"string");return typeof e=="symbol"?e:String(e)}function ye(t,e){if(typeof t!="object"||!t)return t;var r=t[Symbol.toPrimitive];if(r!==void 0){var n=r.call(t,e||"default");if(typeof n!="object")return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return(e==="string"?String:Number)(t)}class M{constructor(){if(R(this,"templates",{}),R(this,"files",{}),R(this,"components",{}),R(this,"prefix","el-"),M.instance)return M.instance;M.instance=this}getName(e){return e.replaceAll("../","")}file(e){}componentSetup(e){let r=e.constructor.name;if(console.log({name:r}),!this.components[r]){let i=Object.assign({},_e),s=Object.assign({},ve);s.selector=s.prefix+e.constructor.selector;let l=function(o){return(!o.__setup||!o.__setup.initialSetup)&&(o.__props={},o.__setup=i,o.__config=s,o.__shadowRoot=o.attachShadow({mode:o.__config.shadowRoot}),o.__config.styles=="global"&&(console.log(o),oe(o.__shadowRoot)),o.__setup.initialSetup=!0),o};l(e),this.components[r]={setup:i,configuration:s,callback:l}}return this.components[r]}template(e,r=[]){let n=this.getName(e),i=this.templates[n];return i||(this.templates[n]=new Promise(async s=>{const o=new U(n,r).setup();s(o.__template.content.cloneNode(!0).firstElementChild)}),this.templates[n])}}R(M,"instance",void 0);const _e={didConnect:!1,templateConnected:!1,propertiesTracked:!1,initialSetup:!1},ve={selector:"",shadowRoot:"open",styles:"global",prefix:"el-"},ne=new M,ge=function(t){return t.replaceAll("this.","").replaceAll("[",".").replaceAll("]",".").replaceAll("..",".").trim().split(".").slice(0).map(e=>(e[0]=="."&&(e=e.slice(1)),e.endsWith(".")&&(e=e.slice(0,-1)),e)).filter(e=>e.length>0)},xe=function(t,e,r){let n=typeof r;["boolean","number"].indexOf(n)==-1&&(r="'"+r+"'"),r!==j(t,e)&&Function("return `${this."+e+"="+r+"}`").call(t)},j=function(t,e){try{return Function("return this."+e).call(t)}catch{return Function("return `${this."+e+"}`").call(t)}},we=function(t,e,r){let{success:n,value:i,path:s}=Pe(t.scope,e);if((n||i==null)&&i!==r){const l=`\`\${this.${e} = '`+r+"'}`";O.evaluate(t,l)}},Pe=function(t,e){let r=e;Array.isArray(r)||(r=ge(r));try{let n=t;for(let i of r)n[i]&&(n=n[i]);return{success:!0,value:n,path:r}}catch{return{success:!1,value:void 0,path:r}}};class N{static update(e,r,n){we(e,r,n)}static connect(e,r,n,i,s){let l="value",o="keyup",a="text",c=function(u){return u.target.value};e==="checkbox"&&(l="checked",o="change",a="boolean",c=function(u){return u.currentTarget.checked}),e==="number"&&(a="number");let f=function(){let u=O.evaluate(r,i,a);e=="checkbox"?["true",!0].indexOf(u)>-1?n.setAttribute(l,!0):n.removeAttribute(l):n.setAttribute(l,u)};return n.addEventListener(o,function(u){N.update(r,s,c(u))}),f}static text(e,r,n,i){return N.connect("text",e,r,n,i)}static number(e,r,n,i){return N.connect("number",e,r,n,i)}static checkbox(e,r,n,i){return N.connect("checkbox",e,r,n,i)}static select(e,r,n,i){const s=function(c,f){[...c.querySelectorAll("option")].forEach(u=>{f==u.value?u.setAttribute("selected",!0):u.removeAttribute("selected")})},l=function(c){[...c.querySelectorAll("option")].forEach(f=>{f.__didInitialize=f.__didInitialize||[],f.__didInitialize.push(()=>{s(c,j(e.scope,i))})})},o=function(c){const f=r.getAttribute("value");c!=f&&s(r,c)};let a=j(e.scope,i)||void 0;return r.addEventListener("change",c=>{c.target.value!==a&&(a=c.target.value,xe(e.scope,i,c.target.value))}),l(r),s(r,j(e.scope,i)),o}}function Ae(t,e,r){return e=Oe(e),e in t?Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}):t[e]=r,t}function Oe(t){var e=Se(t,"string");return typeof e=="symbol"?e:String(e)}function Se(t,e){if(typeof t!="object"||!t)return t;var r=t[Symbol.toPrimitive];if(r!==void 0){var n=r.call(t,e||"default");if(typeof n!="object")return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return(e==="string"?String:Number)(t)}class O{static text(e,r,n,i){const s=function(l){const o=O.evaluate(e,i,"text",n);n.textContent=o};return e.connect(r,s),s}static attribute(e,r,n,i,s){const l=function(o){const a=O.evaluate(e,i,"text",n);n.setAttribute(s,a)};return e.connect(r,l),l}static model(e,r,n,i){let s=n.nodeName=="SELECT"?"select":n.getAttribute("type")||"text";const l=N[s](e,n,i,r),o=function(){l()};return e.connect(r,o),o}static evaluate(e,r,n="text",i=!1){try{const s=e;let a=Function("return "+r).call(s.scope);return n=="boolean"?["true",!0].indexOf(a)>-1?a=!0:a=!1:n=="number"&&(a=Number(a)),a}catch(s){return console.log({instance:e,query:r,node:i,type:n}),console.warn(s),r}}}Ae(O,"lastRender",Date.now());function ke(t,e,r){return e=Ce(e),e in t?Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}):t[e]=r,t}function Ce(t){var e=Te(t,"string");return typeof e=="symbol"?e:String(e)}function Te(t,e){if(typeof t!="object"||!t)return t;var r=t[Symbol.toPrimitive];if(r!==void 0){var n=r.call(t,e||"default");if(typeof n!="object")return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return(e==="string"?String:Number)(t)}class $e{constructor(){ke(this,"map",{})}track(e,r={}){this.map.hasOwnProperty(e)||(this.map[e]=[]),delete r.setup,this.map[e].push({node:r.node,eventName:r.eventName,value:r.value,functionName:r.query,argumentList:[],connected:!1,subscriptions:[],connect:function(n){},setup:function(n){this.connected||(this.connected=!0,this.connect(n))},...r})}}function K(t,e,r){return e=Ee(e),e in t?Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}):t[e]=r,t}function Ee(t){var e=Le(t,"string");return typeof e=="symbol"?e:String(e)}function Le(t,e){if(typeof t!="object"||!t)return t;var r=t[Symbol.toPrimitive];if(r!==void 0){var n=r.call(t,e||"default");if(typeof n!="object")return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return(e==="string"?String:Number)(t)}class qe{async onDidConnect(e){this.map.for.forEach(async r=>{await r.callback()}),this.map.if.forEach(r=>{r.callback()})}constructor(e){K(this,"stack",{if:[],for:[]}),K(this,"map",{if:[],for:[]}),K(this,"__connId",0)}feed(e){}extractQueryIf(e){const r=I(e.textContent.split("@if"))[0].split(")")[0].replace("(","");let n=V("{{"+r+"}}"),i=r;for(let s of n.sort((l,o)=>o-l))i=i.replaceAll("this.scope."+s,s),i=i.replaceAll("this."+s,s),i=i.replaceAll(s,"this."+s);return{query:i,value:r,keywords:n}}extractQueryFor(e){try{const r=I(e.textContent.split("@for"))[0].split(")")[0].replace("(","");let n=I(r.split(" of ")),i=n[0];i.trim().indexOf("let ")==0&&(i=i.trim().replace("let ","")),i.trim().indexOf("const ")==0&&(i=i.trim().replace("const ",""));let s=n[1],l=V("{{"+s+"}}"),o=s;for(let a of l.sort((c,f)=>f-c))o=o.replaceAll("this.scope."+a,a),o=o.replaceAll("this."+a,a),o=o.replaceAll(a,"this."+a);return{query:o,value:r,source:s,variable:i,keywords:l}}catch(r){console.warn(r)}}extractQuery(e){if(e.textContent.indexOf("@if")>-1)return this.extractQueryIf(e)}track(e,r={}){if(e=="@if"){const{query:n,value:i,keywords:s}=this.extractQuery(r.node);let l="if-stack-"+Date.now(),o=r.node.nextElementSibling;o.dataset.elIfContainer=Date.now();const a={operation:"if",prop:e,query:n,value:i,keywords:s,placeholder:o,nodes:[r.node]};if(this.stack.if.length>0){const c=document.createElement("div");c.setAttribute("id",l),this.stack.if[this.stack.if.length-1].nodes.push(c),a.connector="#"+l}this.stack.if.push(a)}else if(e=="@endif")try{let n=this.stack.if.pop(),i=n.nodes[0],s=n.placeholder,l={operation:"if",start:i,content:s,query:n.query,value:n.value,keywords:n.keywords,hasParent:n.connector,connected:!1,callback:function(){},connect:function(o){const a=document.createComment("if placeholder ");a.content=s;const c=o.shadowRoot.querySelector('[data-el-if-container="'+n.placeholder.dataset.elIfContainer+'"]');n.nodes[0].replaceWith(a);try{s.remove()}catch{}let f=function(){const A=Function("return `${"+n.query+"}`").call(o);["true",!0].indexOf(A)>-1?a.after(s):s.remove()};for(let u of n.keywords)o.connect(u,f);this.callback=f},setup:function(o){this.connected||(this.connected=!0,this.connect(o))}};this.map.if.push(l)}catch(n){console.warn(n)}else if(e=="@for"){const n=r.node.parentElement,i=n.dataset.forQuery,s=n.dataset.forConnection;if(!i||i.indexOf("<sp")>-1){r.node.textContent="";return}let l=re(i);const o={operation:"for",replacement:n,query:i,connection:s,connected:!1,...l,callback:function(){},connect:function(a,c={}){const f=a.shadowRoot.querySelector('[data-for-connection="'+s+'"]');if(!f)return;let u=document.createComment("for placeholder ");f.dataset.forQuery;let A=new U(s,a.__props);A=A.setup(),u._setup=l,f.replaceWith(u),u.content=A,u.controller=a,u.stack=[],u.display=[],u._indices={};let C=async function(p){const y=(c==null?void 0:c.indices)||{},d=u.content.__template.content.firstElementChild.cloneNode(!0);d.dataset.elIndex=JSON.stringify({...y,[l.index]:p}),u._indices[l.index]=p,d.innerHTML=d.innerHTML.replaceAll(l.index,p);for(let b of Object.keys(y))b!==l.index&&(d.innerHTML=d.innerHTML.replaceAll(b,y[b]));return u.after(d),await je(a,d),d.remove(),d};const v=function(p){p===void 0&&(p=j(a,l.query.source+".length"));let y=[];for(let d=u.stack.length;d<p;d++)y.push(new Promise(b=>{C(d).then(m=>{u.after(m),u.stack.push(m),u.display.push(m),b(m)})}));Promise.all(y).then(d=>{for(let m=u.display.length;m<p;m++)u.display.push(u.stack[m]),u.after(u.stack[m]);let b=[];for(let m=p;m<u.display.length;m++)b.push(m);b.reverse();for(let m of b)u.display[m].remove(),u.display.pop()})};u.callback=v,u.generate=C,a.connect(l.query.source+".length",v),this.callback=v},setup:function(a,c={}){this.connected||(this.connected=!0,this.connect(a,c),this.callback())}};this.map.for.push(o)}}}function Ne(t,e,r){return e=Ie(e),e in t?Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}):t[e]=r,t}function Ie(t){var e=Me(t,"string");return typeof e=="symbol"?e:String(e)}function Me(t,e){if(typeof t!="object"||!t)return t;var r=t[Symbol.toPrimitive];if(r!==void 0){var n=r.call(t,e||"default");if(typeof n!="object")return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return(e==="string"?String:Number)(t)}class He{constructor(){Ne(this,"map",{})}track(e,r={}){this.map.hasOwnProperty(e)||(this.map[e]=[]),delete r.setup,this.map[e].push({node:r.node,type:r.type,value:r.value,query:r.query,connected:!1,subscriptions:[],connect:function(n){},setup:function(n){if(this.connected)return this.subscriptions;this.subscriptions=this.connect(n)||[],this.connected=!0},...r})}}var Re=function(t){return Array.prototype.map.call(t,function(e){return{att:e.name,value:e.value,reactive:e.value.indexOf("{{")>-1,action:e.name.indexOf("@")>-1,model:e.name.indexOf("model")==0}})};const ie=function(t){const e=new He,r=new $e,n=new qe(t);var i=function(s,l){const o=s.controller||s;return s.controller=o,Array.prototype.map.call(s.childNodes,function(a){var C,v;a.controller=s.controller;var c={content:a.childNodes&&a.childNodes.length>0?null:a.textContent,atts:a.nodeType!==1?[]:Re(a.attributes),type:a.nodeType===3?"text":a.nodeType===8?"comment":a.tagName.toLowerCase(),node:a};for(let p of["if","for"]){let y=((C=a==null?void 0:a.data)==null?void 0:C.indexOf("@"+p))??-1,d=((v=a==null?void 0:a.data)==null?void 0:v.indexOf("@end"+p))??-1;y>-1?n.track("@"+p,{node:a}):d>-1&&n.track("@end"+p)}n.feed(a),c.reactive=c.content&&c.content.indexOf("{{")>-1&&!c.operation;let f=c.atts.filter(p=>p.reactive);if(f.length>0)for(let p of f){let y=p.att,d=p.value;for(let b of S(p.value)){let m=V("{{"+b.trim()+"}}");for(let _ of m){let T=_,g=p.value;g=g.replaceAll("{{"+b+"}}","{{"+b.replaceAll(T,_)+"}}"),g="`"+g.replaceAll("{{","${").replaceAll("}}","}")+"`",e.track(_,{node:a,type:"attribute",value:d,query:g,connect:function(w){let k;y=="model"?k=O.model(w,_,a,g):k=O.attribute(w,_,a,g,y),k()}})}}}if(c.atts.filter(p=>p.model).length>0){let p=a.getAttribute("model"),y=p.indexOf("this.")>-1?p:"this."+p,d="`${"+y+"}`";e.track(p,{node:a,type:"model",value:y,query:d,connect:function(b){O.model(b,p,a,d)()}})}if(c.reactive)for(let p of S(c.content)){let y=V("{{"+p.trim()+"}}");for(let d of y){let b=d,m=c.content;m=m.replaceAll("{{"+p+"}}","{{"+p.replaceAll(b,d)+"}}"),m="`"+m.replaceAll("{{","${").replaceAll("}}","}")+"`",e.track(d,{node:a,type:"text",value:c.content,query:m,connect:function(_){O.text(_,d,a,m)()}})}}let A=c.atts.filter(p=>p.action);if(A.length>0)for(let p of A){p=p.att;const y=a.hasOwnProperty(p)?"native":"custom";let d=p.replaceAll("@","");const b=a.getAttribute(p),m=a.getAttribute(p).trim().replaceAll(" ",""),_=m.split("(").map(w=>w.trim()).filter(w=>w.length>0),T=_[0];let g=[];_.length>1&&(g=_[1].replaceAll(")","").trim().split(",")),d.indexOf("on")==0&&typeof a[d.slice(2)]=="function"&&(d=d.slice(2)),r.track(p,{node:a,type:y,value:b,eventName:d,query:m,actionName:T,args:g,connect:function(w){a.addEventListener(d,function(k){const $=w.scope;$.$event=k;let H=JSON.parse(a.getAttribute("el-index")||JSON.stringify({$index:0}));for(let[x,F]of Object.entries(H))$[x]=F;let E=g.map(x=>$.hasOwnProperty(x)?$[x]:isNaN(x)?["'",'"',"`"].indexOf(x.trim().charAt(0))>-1?x.trim().slice(1,x.trim().length-1):x:Number(x));w[T](...E)})}})}return c.isSVG=l||c.type==="svg",c.children=i(a,c.isSVG),c})};return i(t),{props:e,actions:r,operations:n}},je=function(t,e){var a;if((a=e==null?void 0:e.__setup)!=null&&a.templateConnected)return;const{props:r,actions:n,operations:i}=ie(e),s=r.map;for(let c of Object.keys(s)){const f=s[c];for(let u of f)c.endsWith("[")||u.setup(t)}for(let c of Object.keys(n.map))for(let f of n.map[c])f.node.removeAttribute(c),f.setup(t);let l=i.map.for;for(let c of l){let f={};e.dataset.elIndex&&(f.indices=JSON.parse(e.dataset.elIndex)),c.setup(t,f)}let o=t.operations.map.if;for(let c of o)c.setup(t);return e.__setup={},e.__setup.templateConnected=!0,e},ze=function(t){if(t.__setup.templateConnected)return;const e=t.reactiveProps.map;for(let s of Object.keys(e)){const l=e[s];for(let o of l)o.setup(t)}const r=t.actions.map;for(let s of Object.keys(r))for(let l of r[s])l.node.removeAttribute(s),l.setup(t);let n=t.operations.map.for;for(let s of n)s.setup(t);let i=t.operations.map.if;for(let s of i)s.setup(t);t.__setup.templateConnected=!0},Ve=function(t){const{props:e,actions:r,operations:n}=ie(t.__template);t.reactiveProps=e,t.actions=r,t.operations=n},q=function(t){return Array.isArray(t)||(t=t.replaceAll("[","."),t=t.split(".").map(e=>e.replaceAll("]","").replaceAll(".","").trim())),t=t.join("."),t};function D(t,e,r){return e=Fe(e),e in t?Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}):t[e]=r,t}function Fe(t){var e=Ge(t,"string");return typeof e=="symbol"?e:String(e)}function Ge(t,e){if(typeof t!="object"||!t)return t;var r=t[Symbol.toPrimitive];if(r!==void 0){var n=r.call(t,e||"default");if(typeof n!="object")return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return(e==="string"?String:Number)(t)}class Ke{constructor(){D(this,"events",{}),D(this,"prevValues",{}),D(this,"trackTimeout",void 0)}subscribe(e,r){return e=q(e),this.events[e]||(this.events[e]=[],this.prevValues[e]=void 0),this.events[e].push(r),(()=>{let i=!0;return{event:e,callback:r,render:()=>{if(i&&this.events[e])for(let s of this.events[e])s()},unsubscribe:()=>{i&&(i=!1,this.events[e]&&(this.events[e]=this.events[e].filter(s=>s!==r)))}}})()}publish(e,r){this.events[e]?this.prevValues[e]!=r?(this.prevValues[e]=r,this.events[e].forEach(n=>n(r))):console.log("data didnt change:",e):console.log("no events subscribed yet:",e)}unsubscribe(e){console.log("@TODO unsubscribe")}track(){clearTimeout(this.trackTimeout),this.trackTimeout=setTimeout(()=>{console.log("---------------------------"),console.log("Subscription tracking".toUpperCase()),console.log("---------------------------");let e=0;for(let r of Object.keys(this.events)){let n=this.events[r].length;console.log("Sub:",r,n),e+=n}console.log(""),console.log("TOTAL: ",e+" active subscriptions"),console.log("-------------------------------------")},100)}}class De{constructor(e,r){return this._preproxy=new WeakMap,this._handler=r,this.proxify(e,[])}makeHandler(e){let r=this;return{get(n,i,s){return r._handler.get?r._handler.get(n,[...e,i],s):n[i]},set(n,i,s,l){return typeof s=="object"&&(s=r.proxify(s,[...e,i])),n[i]=s,r._handler.set&&r._handler.set(n,[...e,i],s,l),!0},deleteProperty(n,i){if(Reflect.has(n,i)){r.unproxy(n,i);let s=Reflect.deleteProperty(n,i);return s&&r._handler.deleteProperty&&r._handler.deleteProperty(n,[...e,i]),s}return!1}}}unproxy(e,r){this._preproxy.has(e[r])&&(e[r]=this._preproxy.get(e[r]),this._preproxy.delete(e[r]));for(let n of Object.keys(e[r]))typeof e[r][n]=="object"&&this.unproxy(e[r],n)}proxify(e,r){for(let i of Object.keys(e))typeof e[i]=="object"&&(e[i]=this.proxify(e[i],[...r,i]));let n=new Proxy(e,this.makeHandler(r));return this._preproxy.set(n,e),n}}const We=function(t){const e=new Ke;return t=new De(t,{set(i,s,l,o){try{let a=q(s),c=typeof i[a];return a.indexOf("__")==0||(c!=="object"||Array.isArray(i[a]))&&e.publish(q(s),l),!0}catch(a){console.warn(a),console.log(s,q(s),l)}},deleteProperty(i,s){delete e.events[q(s)]},getPath(i,s){console.log("getPath",s.split("."),i)}}),[t,function(i,s){return e.subscribe(q(i),s)},function(){for(let i of Object.keys(e.events))e.publish(i)},e]},Qe=function(t={}){let[e,r,n]=We(t);return{scope:e,connect:r,render:n}},Ue=function(t){const e={};t.__props=Object.getOwnPropertyNames(t).filter(l=>l.indexOf("_")!=0&&typeof l!="function"),t.__props.forEach(l=>{e[l]=t.getAttribute(l)||t[l],t.setAttribute(l,e[l])});const{scope:r,connect:n,render:i,pubsub:s}=Qe(e);t.scope=r,t.connect=n,t.render=i,t.pubsub=s;for(let l of Object.keys(t.scope))t.__defineGetter__(l,function(){return t.scope[l]});return t},Je=async function(t){t.__template=await ne.template(t.constructor.selector,t.__props),t.__shadowRoot.appendChild(t.__template)};function Be(t,e,r){return e=Xe(e),e in t?Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}):t[e]=r,t}function Xe(t){var e=Ye(t,"string");return typeof e=="symbol"?e:String(e)}function Ye(t,e){if(typeof t!="object"||!t)return t;var r=t[Symbol.toPrimitive];if(r!==void 0){var n=r.call(t,e||"default");if(typeof n!="object")return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return(e==="string"?String:Number)(t)}function se(t){const e={...t};if(e.template){const r=document.createElement("template");document.head.appendChild(r),r.id="template-"+e.selector,r.innerHTML=e.template}return function(r){class n extends r{constructor(){super()}}Be(n,"selector",e.selector);try{customElements.define(e.selector,r)}catch(i){console.warn(i)}return n}}class le extends HTMLElement{constructor(){super(...arguments),this.__init()}__init(){ne.componentSetup(this)}async __hidrate(){Ue(this),await Je(this),await Ve(this),await ze(this)}async __initialConnection(){this.__setup.didConnect||(this.__setup.didConnect=!0,await this.__hidrate(),this.operations.onDidConnect(this))}connectedCallback(){this.__initialConnection(),this.render()}attributeChangedCallback(e,r,n){console.log("attributeChangedCallback",e,r,n)}render(){console.log(this)}}var X,Y,W;function Z(t,e,r){return e=Ze(e),e in t?Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}):t[e]=r,t}function Ze(t){var e=et(t,"string");return typeof e=="symbol"?e:String(e)}function et(t,e){if(typeof t!="object"||!t)return t;var r=t[Symbol.toPrimitive];if(r!==void 0){var n=r.call(t,e||"default");if(typeof n!="object")return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return(e==="string"?String:Number)(t)}const tt=`<div>\r
  <div class="layout has-sidebar fixed-sidebar fixed-header">\r
    <aside id="sidebar" class="sidebar break-point-sm has-bg-image">\r
      <a id="btn-collapse" class="sidebar-collapser"\r
        ><i class="ri-arrow-left-s-line"></i\r
      ></a>\r
      <div class="image-wrapper">\r
        <img src="assets/images/sidebar-bg.jpg" alt="sidebar background" />\r
      </div>\r
      <div class="sidebar-layout">\r
        <div class="sidebar-header">\r
          <div class="pro-sidebar-logo">\r
            <div>P</div>\r
            <h5>Pro Sidebar</h5>\r
          </div>\r
        </div>\r
        <div class="sidebar-content">\r
          <nav class="menu open-current-submenu">\r
            <ul>\r
              @for(separator of menu){\r
              <div>\r
                <li class="menu-header"><span> {{separator.title}} </span></li>\r
                @for(link of separator.links){\r
                <li class="menu-item sub-menu {{separator.open ? 'open': ''}}">\r
                  <a href="#">\r
                    <span class="menu-icon">\r
                      <i class="ri-vip-diamond-fill"></i>\r
                    </span>\r
                    <span class="menu-title">Components</span>\r
                    <span class="menu-suffix">\r
                      <span class="badge primary">Hot</span>\r
                    </span>\r
                  </a>\r
                  <div class="sub-menu-list">\r
                    <ul>\r
                      @for(submenu of link.submenus){\r
                      <li class="menu-item">\r
                        <a href="#">\r
                          <span class="menu-title">{{submenu.title}}</span>\r
                        </a>\r
                      </li>\r
                      }\r
                    </ul>\r
                  </div>\r
                </li>\r
                }\r
              </div>\r
              }\r
              <li class="menu-header"><span> GENERAL </span></li>\r
              <li class="menu-item sub-menu">\r
                <a href="#">\r
                  <span class="menu-icon">\r
                    <i class="ri-vip-diamond-fill"></i>\r
                  </span>\r
                  <span class="menu-title">Components</span>\r
                  <span class="menu-suffix">\r
                    <span class="badge primary">Hot</span>\r
                  </span>\r
                </a>\r
                <div class="sub-menu-list">\r
                  <ul>\r
                    <li class="menu-item">\r
                      <a href="#">\r
                        <span class="menu-title">Grid</span>\r
                      </a>\r
                    </li>\r
                    <li class="menu-item">\r
                      <a href="#">\r
                        <span class="menu-title">Layout</span>\r
                      </a>\r
                    </li>\r
                    <li class="menu-item sub-menu">\r
                      <a href="#">\r
                        <span class="menu-title">Forms</span>\r
                      </a>\r
                      <div class="sub-menu-list">\r
                        <ul>\r
                          <li class="menu-item">\r
                            <a href="#">\r
                              <span class="menu-title">Input</span>\r
                            </a>\r
                          </li>\r
                          <li class="menu-item">\r
                            <a href="#">\r
                              <span class="menu-title">Select</span>\r
                            </a>\r
                          </li>\r
                          <li class="menu-item sub-menu">\r
                            <a href="#">\r
                              <span class="menu-title">More</span>\r
                            </a>\r
                            <div class="sub-menu-list">\r
                              <ul>\r
                                <li class="menu-item">\r
                                  <a href="#">\r
                                    <span class="menu-title">CheckBox</span>\r
                                  </a>\r
                                </li>\r
                                <li class="menu-item">\r
                                  <a href="#">\r
                                    <span class="menu-title">Radio</span>\r
                                  </a>\r
                                </li>\r
                                <li class="menu-item sub-menu">\r
                                  <a href="#">\r
                                    <span class="menu-title">Want more ?</span>\r
                                    <span class="menu-suffix">&#x1F914;</span>\r
                                  </a>\r
                                  <div class="sub-menu-list">\r
                                    <ul>\r
                                      <li class="menu-item">\r
                                        <a href="#">\r
                                          <span class="menu-prefix"\r
                                            >&#127881;</span\r
                                          >\r
                                          <span class="menu-title"\r
                                            >You made it\r
                                          </span>\r
                                        </a>\r
                                      </li>\r
                                    </ul>\r
                                  </div>\r
                                </li>\r
                              </ul>\r
                            </div>\r
                          </li>\r
                        </ul>\r
                      </div>\r
                    </li>\r
                  </ul>\r
                </div>\r
              </li>\r
              <li class="menu-item sub-menu">\r
                <a href="#">\r
                  <span class="menu-icon">\r
                    <i class="ri-bar-chart-2-fill"></i>\r
                  </span>\r
                  <span class="menu-title">Charts</span>\r
                </a>\r
                <div class="sub-menu-list">\r
                  <ul>\r
                    <li class="menu-item">\r
                      <a href="#">\r
                        <span class="menu-title">Pie chart</span>\r
                      </a>\r
                    </li>\r
                    <li class="menu-item">\r
                      <a href="#">\r
                        <span class="menu-title">Line chart</span>\r
                      </a>\r
                    </li>\r
                    <li class="menu-item">\r
                      <a href="#">\r
                        <span class="menu-title">Bar chart</span>\r
                      </a>\r
                    </li>\r
                  </ul>\r
                </div>\r
              </li>\r
              <li class="menu-item sub-menu">\r
                <a href="#">\r
                  <span class="menu-icon">\r
                    <i class="ri-shopping-cart-fill"></i>\r
                  </span>\r
                  <span class="menu-title">E-commerce</span>\r
                </a>\r
                <div class="sub-menu-list">\r
                  <ul>\r
                    <li class="menu-item">\r
                      <a href="#">\r
                        <span class="menu-title">Products</span>\r
                      </a>\r
                    </li>\r
                    <li class="menu-item">\r
                      <a href="#">\r
                        <span class="menu-title">Orders</span>\r
                      </a>\r
                    </li>\r
                    <li class="menu-item">\r
                      <a href="#">\r
                        <span class="menu-title">credit card</span>\r
                      </a>\r
                    </li>\r
                  </ul>\r
                </div>\r
              </li>\r
              <li class="menu-item sub-menu">\r
                <a href="#">\r
                  <span class="menu-icon">\r
                    <i class="ri-global-fill"></i>\r
                  </span>\r
                  <span class="menu-title">Maps</span>\r
                </a>\r
                <div class="sub-menu-list">\r
                  <ul>\r
                    <li class="menu-item">\r
                      <a href="#">\r
                        <span class="menu-title">Google maps</span>\r
                      </a>\r
                    </li>\r
                    <li class="menu-item">\r
                      <a href="#">\r
                        <span class="menu-title">Open street map</span>\r
                      </a>\r
                    </li>\r
                  </ul>\r
                </div>\r
              </li>\r
              <li class="menu-item sub-menu">\r
                <a href="#">\r
                  <span class="menu-icon">\r
                    <i class="ri-paint-brush-fill"></i>\r
                  </span>\r
                  <span class="menu-title">Theme</span>\r
                </a>\r
                <div class="sub-menu-list">\r
                  <ul>\r
                    <li class="menu-item">\r
                      <a href="#">\r
                        <span class="menu-title">Dark</span>\r
                      </a>\r
                    </li>\r
                    <li class="menu-item">\r
                      <a href="#">\r
                        <span class="menu-title">Light</span>\r
                      </a>\r
                    </li>\r
                  </ul>\r
                </div>\r
              </li>\r
              <li class="menu-header" style="padding-top: 20px">\r
                <span> EXTRA </span>\r
              </li>\r
              <li class="menu-item">\r
                <a href="#">\r
                  <span class="menu-icon">\r
                    <i class="ri-book-2-fill"></i>\r
                  </span>\r
                  <span class="menu-title">Documentation</span>\r
                  <span class="menu-suffix">\r
                    <span class="badge secondary">Beta</span>\r
                  </span>\r
                </a>\r
              </li>\r
              <li class="menu-item">\r
                <a href="#">\r
                  <span class="menu-icon">\r
                    <i class="ri-calendar-fill"></i>\r
                  </span>\r
                  <span class="menu-title">Calendar</span>\r
                </a>\r
              </li>\r
              <li class="menu-item">\r
                <a href="#">\r
                  <span class="menu-icon">\r
                    <i class="ri-service-fill"></i>\r
                  </span>\r
                  <span class="menu-title">Examples</span>\r
                </a>\r
              </li>\r
            </ul>\r
          </nav>\r
        </div>\r
        <div class="sidebar-footer">\r
          <div class="footer-box">\r
            <div>\r
              <img\r
                class="react-logo"\r
                src="https://user-images.githubusercontent.com/25878302/213938106-ca8f0485-3f30-4861-9188-2920ed7ab284.png"\r
                alt="react"\r
              />\r
            </div>\r
            <div style="padding: 0 10px">\r
              <span style="display: block; margin-bottom: 10px"\r
                >Pro sidebar is also available as a react package\r
              </span>\r
              <div style="margin-bottom: 15px">\r
                <img\r
                  alt="preview badge"\r
                  src="https://img.shields.io/github/stars/azouaoui-med/react-pro-sidebar?style=social"\r
                />\r
              </div>\r
              <div>\r
                <a\r
                  href="https://github.com/azouaoui-med/react-pro-sidebar"\r
                  target="_blank"\r
                  >Check it out!</a\r
                >\r
              </div>\r
            </div>\r
          </div>\r
        </div>\r
      </div>\r
    </aside>\r
    <div id="overlay" class="overlay"></div>\r
    <div class="layout">\r
      <main class="content">\r
        <div>\r
          <a id="btn-toggle" href="#" class="sidebar-toggler break-point-sm">\r
            <i class="ri-menu-line ri-xl"></i>\r
          </a>\r
          <h1 style="margin-bottom: 0">Pro Sidebar</h1>\r
          <span style="display: inline-block">\r
            Responsive layout with advanced sidebar menu built with SCSS and\r
            vanilla Javascript\r
          </span>\r
          <br />\r
          <span>\r
            <slot></slot>\r
            Full Code and documentation available on\r
            <a\r
              href="https://github.com/azouaoui-med/pro-sidebar-template"\r
              target="_blank"\r
              >Github</a\r
            >\r
          </span>\r
          <div style="margin-top: 10px">\r
            <a\r
              href="https://github.com/azouaoui-med/pro-sidebar-template"\r
              target="_blank"\r
            >\r
              <img\r
                alt="GitHub stars"\r
                src="https://img.shields.io/github/stars/azouaoui-med/pro-sidebar-template?style=social"\r
              />\r
            </a>\r
            <a\r
              href="https://github.com/azouaoui-med/pro-sidebar-template"\r
              target="_blank"\r
            >\r
              <img\r
                alt="GitHub forks"\r
                src="https://img.shields.io/github/forks/azouaoui-med/pro-sidebar-template?style=social"\r
              />\r
            </a>\r
          </div>\r
        </div>\r
        <div>\r
          <h2>Features</h2>\r
          <ul>\r
            <li>Fully responsive</li>\r
            <li>Collapsable sidebar</li>\r
            <li>Multi level menu</li>\r
            <li>RTL support</li>\r
            <li>Customizable</li>\r
          </ul>\r
        </div>\r
        <div>\r
          <h2>Resources</h2>\r
          <ul>\r
            <li>\r
              <a\r
                target="_blank"\r
                href="https://github.com/azouaoui-med/css-pro-layout"\r
              >\r
                Css Pro Layout</a\r
              >\r
            </li>\r
            <li>\r
              <a target="_blank" href="https://github.com/popperjs/popper-core">\r
                Popper Core</a\r
              >\r
            </li>\r
            <li>\r
              <a target="_blank" href="https://remixicon.com/"> Remix Icons</a>\r
            </li>\r
          </ul>\r
        </div>\r
        <footer class="footer">\r
          <small style="margin-bottom: 20px; display: inline-block">\r
            © 2023 made with\r
            <span style="color: red; font-size: 18px">&#10084;</span> by -\r
            <a target="_blank" href="https://azouaoui.netlify.com">\r
              Mohamed Azouaoui\r
            </a>\r
          </small>\r
          <br />\r
          <div class="social-links">\r
            <a href="https://github.com/azouaoui-med" target="_blank">\r
              <i class="ri-github-fill ri-xl"></i>\r
            </a>\r
            <a href="https://twitter.com/azouaoui_med" target="_blank">\r
              <i class="ri-twitter-fill ri-xl"></i>\r
            </a>\r
            <a href="https://codepen.io/azouaoui-med" target="_blank">\r
              <i class="ri-codepen-fill ri-xl"></i>\r
            </a>\r
            <a\r
              href="https://www.linkedin.com/in/mohamed-azouaoui/"\r
              target="_blank"\r
            >\r
              <i class="ri-linkedin-box-fill ri-xl"></i>\r
            </a>\r
          </div>\r
        </footer>\r
      </main>\r
      <div class="overlay"></div>\r
    </div>\r
  </div>\r
</div>\r
`;X=se({selector:"el-layout",template:tt}),X(Y=(W=class extends le{constructor(){super(),Z(this,"menu",[{title:"Geral",links:[{title:"Componentes",open:!1,link:"#",submenus:[{link:"#",title:"Submenu"}]}]}])}},Z(W,"selector","el-layout"),W));var ee,te,Q;function P(t,e,r){return e=rt(e),e in t?Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}):t[e]=r,t}function rt(t){var e=nt(t,"string");return typeof e=="symbol"?e:String(e)}function nt(t,e){if(typeof t!="object"||!t)return t;var r=t[Symbol.toPrimitive];if(r!==void 0){var n=r.call(t,e||"default");if(typeof n!="object")return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return(e==="string"?String:Number)(t)}ee=se({selector:"el-web-component"}),ee(te=(Q=class extends le{constructor(){super(),P(this,"checked",!0),P(this,"checkedd",!0),P(this,"text","text property"),P(this,"object",{key:"object value",title:"Title"}),P(this,"list",["list id: 0"]),P(this,"objectList",[{item:"object list item id: 0"}]),P(this,"color","yellow"),P(this,"colors",["green","red","yellow"]),P(this,"items",[{name:"item 1"},{name:"item 2"}]),P(this,"cards",[{title:"Card 1 ",description:"Card 1 description",list:["list 1"]},{title:"Card 2 ",description:"Card 2 description",list:["list 1","list 2"]},{title:"Card 3 ",description:"Card 3 description",list:[]}])}onPush(e){this.cards[e].list.push("list "+this.cards[e].list.length)}onPop(e){this.cards[e].list.pop()}},P(Q,"selector","el-web-component"),Q));
