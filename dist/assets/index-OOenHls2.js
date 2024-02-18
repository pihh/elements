(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))n(i);new MutationObserver(i=>{for(const l of i)if(l.type==="childList")for(const s of l.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&n(s)}).observe(document,{childList:!0,subtree:!0});function r(i){const l={};return i.integrity&&(l.integrity=i.integrity),i.referrerPolicy&&(l.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?l.credentials="include":i.crossOrigin==="anonymous"?l.credentials="omit":l.credentials="same-origin",l}function n(i){if(i.ep)return;i.ep=!0;const l=r(i);fetch(i.href,l)}})();let ne=null;function Ke(){return ne===null&&(ne=Array.from(document.styleSheets).map(t=>{const e=new CSSStyleSheet,r=Array.from(t.cssRules).map(n=>n.cssText).join(" ");return e.replaceSync(r),e})),ne}function De(t){try{t.adoptedStyleSheets.push(...Ke())}catch(e){console.log(e)}}function T(t){return t.toUpperCase()!=t.toLowerCase()}function D(t,e="{{",r=[]){let n=t.indexOf(e),i=t;return n>-1?(r.push(n),i=i.split(""),i[n]="*",i[n+1]="*",i=i.join(""),D(i,e,r)):r}function O(t,e="{{",r="}}"){let n=[];try{n=t.split(e).slice(1).map(i=>i.split(r)[0])}catch{}return n||[]}const W=function(t=[]){return t.map(e=>e.trim()).filter(e=>e.length>0)},te=function(t,e=[]){const r=O(t);for(let n of r){const i=W(n.split("this.").map(l=>l.replaceAll(" ","")));for(let l of i){let s=l.split(""),c=!1;for(let o=0;o<s.length;o++){const a=s[o];if(!T(a)){if(a=="."||a=="["||a=="]")continue;if(isNaN(a)){const h=s.slice(0,o).join("");e.indexOf(h)==-1&&e.push(h),c=!0;break}else continue}}if(!c){const o=l.trim();e.indexOf(o)==-1&&e.push(o)}}}return[...new Set(e)]},X=function(t,e,r,n){let i=t,l=t.charAt(e+r.length),s=t.charAt(e-1),c=e==0||!T(s)&&s!="."||!T(s)&&s=="!",o=e+r.length>t.length||!T(l);if(c&&o){i=t.split("");let a=t.slice(0,e),h=t.slice(e+r.length);i=a+n+h}return i},We=function(t){let e=t.content.firstElementChild.innerHTML,r=O(e);for(let n of r){const i="{{"+n+"}}",l="{{"+n.replaceAll(" ","")+"}}";e=e.replaceAll(i,l)}e=e.replaceAll("}@","} @").replaceAll("{@","{ @"),e=e.replaceAll("@else{","@else {").replaceAll("}@else","} @else");try{t.innerHTML=e}catch{}return t};function Ge(t,e,r){let n=[],i=t.indexOf(e),l=t,s=!1;i>-1&&n.push(i);for(let c=i+1;c<t.length;c++){let o=t.charAt(c);if(o===e&&n.push(c),o===r&&n.pop(),n.length===0){s=!0,n=[i,c],l=t.substring(i+e.length,c);break}}return n==-1&&(s=!1),{indices:n,success:s,content:l}}let ze=0;const je=function(t){let e,r={index:e,success:!1};if(!t)return r;let n=Ge(t,"(",")");n.content=n.content.replace("(","").trim(),n.args=W(n.content.split(";")).map(l=>l.trim()).map(l=>(l.indexOf("let ")==0&&(l=l.replace("let ","").trim()),l.indexOf("const ")==0&&(l=l.replace("const ","").trim()),l));let i=!1;if(n=n.args.map(l=>{let s=l.indexOf(" of ")>-1?"query":"index",c=W(l.split(s=="query"?" of ":"="));return l={query:l,attribute:c[0].trim(),source:c[1].trim(),queryType:s},s=="index"?(i=!0,e=l.source,r.index=l.source):r.query=l,l}),!i){let l="__index__"+ze++;r.index=l}return r},me=function(t,e,r,n){for(let i of O(t,'model="'+e,'"')){let l=i.trim();(i==""||!T(l.charAt(0)))&&(t=t.replaceAll('model="'+e+i+'"','model="'+r+"["+n+"]"+i+'"'))}for(let i of O(t)){let l=i.trim();l.indexOf(e)==0&&(!l.replace(e,"").charAt(0)||!T(l.replace(e,"").charAt(0)))&&(t=t.replaceAll("{{"+i+"}}","{{"+i.replace(e,"this."+r+"["+n+"]")+"}}"))}for(let i of O(t,"@for(",")")){let l=i.trim(),s=l.split(" of ")[1].trim();s.indexOf(e)==0&&(!s.replace(e,"").charAt(0)||!T(s.replace(e,"").charAt(0)))&&(s=s.replace(e,r+"["+n+"]"),l=l.split(" of ")[0]+" of "+s,t=t.replaceAll("@for("+i+")","@for("+l+")"))}for(let i of O(t,"@if(",")")){let l=i.trim();l.indexOf(e)==0&&(!l.replace(e,"").charAt(0)||!T(l.replace(e,"").charAt(0)))&&(t=t.replace("@if("+i+")","@if("+i.replace(e,"this."+r+"["+n+"]")+")"))}return t};let Ue=0,be=[];const ie=function(t,e,r,n=[]){let l=D(t,"{").filter(c=>c>=r)[0],s=[0];for(let c=l+1;c<t.length;c++){let o=t.charAt(c);if(o=="}"&&s.pop(),o=="{"&&s.push(1),s.length==0){let a=t.slice(0,r-1),h=t.slice(c+1),u=t.slice(l+1,c-1),k=e+"_for-"+Date.now();if(be.indexOf(k)==-1){be.push(k);let A="$index"+Ue++,E=t.slice(r+4,l),f=je(E),m=f.query.attribute,p=f.query.source;A=f.index,u=me(u,m,p,A);const _=O(u,"@for(",")");for(let b of _){let g=b.split(" of ");if(g.length>1&&(g=g[1].trim(),g.indexOf(m)==0)){let I=g.replace(m,"");if(!(I.length>0&&T(I.charAt(0)))){let y=b.replace(" of "+m," of "+p+"["+A+"]");u=u.replace("@for("+b+")","@for("+y+")")}}}const d=O(u,"@if(",")");for(let b of d){let g=b.indexOf(m),I=g+m.length,y=!1,P=!1;if(g>-1&&(g>0&&T(b.charAt(g-1))||(y=!0)),I>b.length?P=!0:T(b.charAt(I))||(P=!0),y&&P){let L=b.slice(0,g),q=b.slice(g+m.length),M=L+"this."+p+"["+A+"]"+q;u=u.replace("@if("+b+")"," @if("+M.trim()+") ")}}let x=O(u,'="','"').filter(b=>b.indexOf("(")>-1&&b.indexOf(";")==-1&&b.indexOf(",")>-1);x.length>0&&(x=x.map(b=>{let g=b.trim();if(g.charAt(g.length-1)===")"&&g.indexOf(",")>-1){g=g.split("(");let I=g[0],y=g.slice(1).join("(").trim().slice(0,-1).trim();return y=y.split(",").map(P=>{let L=P.indexOf(m),q=!1,M=!1;if(L>-1){if(L==0)q=!0;else{let he=P.charAt(L-1);T(he)||[" ",".","!","?",":"].indexOf(he)>-1&&(q=!0)}let re=P.charAt(L+m.length+1);re?T(re)||[".","["," "].indexOf(re)>-1&&(M=!0):M=!0,q&&M&&(P=P.replace(m,p+"["+A+"]"))}return P}),{original:b,replacement:I+"("+y.join(",")+")"}}return{original:b,replacement:original}}),x.forEach(b=>{u=u.replaceAll('="'+b.original+'"','="'+b.replacement+'"')}));let C="("+f.query.query+";index = "+f.index+")",H='<option data-for-connection="'+k+'" data-for-query="'+C+'">@__for()</option>';const w=document.createElement("template"),N=document.createElement("div");document.head.appendChild(w),N.innerHTML=u,w.content.appendChild(N),w.setAttribute("id","template-"+k),t=a+H+h,t=me(t,m,p,A),new J(k,n)}break}}return t},Me=function(t,e=[]){let r=t.replace("(","").trim();r.charAt(r.length-1)===")"&&(r=r.substring(0,r.length-1));let n=r.split(" ").map(l=>l.trim()).filter(l=>l.length>0).filter(l=>["?",":",'"',"'","`"].reduce((s,c)=>{let o=l.indexOf(c)>-1?1:0;return s+o},0)==0).filter(l=>isNaN(l)).map(l=>l.trim().replaceAll("this.","").replaceAll("!",""));return{success:!0,query:r,attribute:n}},ge={operation:"@if",indexKey:"",datasetConnection:"data-if-connection",datasetQuery:"data-if-query",replacement:"@__if"};let _e=[];const le=function(t,e,r,n=[]){r=t.indexOf("@if");let l=D(t,"{").filter(c=>c>=r)[0],s=[0];for(let c=l+1;c<t.length;c++){let o=t.charAt(c);if(o=="}"&&s.pop(),o=="{"&&s.push(1),s.length==0){let a=t.slice(0,r-1),h=t.slice(c+1),u=t.slice(l+1,c-1),k=e+"_if-"+Date.now();if(_e.indexOf(k)==-1){_e.push(k);let A=t.slice(r+ge.operation.length,l),f=`${Me(A).query}`,m=`<option data-if-connection="${k}" data-if-query="${f}">${ge.replacement}()</option>`.replaceAll("@endif()","").replaceAll("@endif","").replaceAll("}","").replaceAll("{","");const p=document.createElement("template"),_=document.createElement("div");document.head.appendChild(p),_.innerHTML=u.replaceAll("\r","").replaceAll(`
`,"").trim(),p.content.appendChild(_),p.setAttribute("id","template-"+k),new J(k,n);let d=h.indexOf("@else"),x=h.indexOf("@if");d>-1&&(x==-1||d<x)&&(h=h.slice(0,d)+" @if(!"+f+")"+h.slice(d+5)),t=a+m+h;break}else return t}}return t},Qe=function(t,e){for(;t.indexOf("@for")>-1||t.indexOf("@if")>-1;){let r=t.indexOf("@for"),n=t.indexOf("@if");r>-1?n==-1?t=ie(t,e,r,[]):r<n?t=ie(t,e,r,[]):t=le(t,e,n,[]):n>-1&&(r==-1?t=le(t,e,n,[]):n<r?t=le(t,e,n,[]):t=ie(t,e,r,[]))}return t=t.replaceAll("@__for","@for"),t=t.replaceAll("@__if","@if"),t},Be=function(t,e=[],r=[]){let n=[];n=O(t);for(let i of n){let l=i;for(let s of r){let c=D(i,s);if(c.length>0){c.reverse();for(let o of c)l=X(l,o,s,"this.parent."+s)}}t=t.replaceAll("{{"+i+"}}","{{"+l+"}}")}t=t=="string"?t:t.innerHTML,n=O(t);for(let i of n){let l=i;for(let s of e){let c=D(i,s);if(c.length>0){c.reverse();for(let o of c)if(o>0){let a=i.charAt(o-1);[" ",".","!","?",":"].indexOf(a)>-1&&(l=X(l,o,s,"this."+s))}else l=X(l,o,s,"this."+s)}}t=t.replaceAll("{{"+i+"}}","{{"+l+"}}")}n=O(t,"@if(",")");for(let i of n){let l=i;for(let s of e){let c=D(i,s);if(c.length>0){c.reverse();for(let o of c)l=X(l,o,s,"this."+s)}}t=t.replaceAll("@if("+i+")","@if("+l+")")}return t},v={};class J{constructor(e,r=[]){return this.__originalId=e,this.__id="template-"+e,this.__scope=r||[],this.initialSetup=!1,v.hasOwnProperty(this.__id)?v[this.__id]:(v[this.__id]=this,v[this.__id].setup())}setup(){if(!v[this.__id].initialSetup){v[this.__id].initialSetup=!0,this.__original=document.querySelector("#"+this.__id),v[this.__id].__template=document.createElement("template"),v[this.__id].__cleanedUpInnerHTML=We(this.__original),v[this.__id].__cleanedUpInnerHTML=Be(v[this.__id].__original,v[this.__id].__scope),v[this.__id].__cleanedUpInnerHTML=Qe(v[this.__id].__cleanedUpInnerHTML,this.__originalId),v[this.__id].__placeholder=document.createElement("div"),v[this.__id].__placeholder.innerHTML=v[this.__id].__cleanedUpInnerHTML,v[this.__id].__template.content.appendChild(v[this.__id].__placeholder),v[this.__id].__template.setAttribute("id",v[this.__id].__id),v[this.__id].__children=[],v[this.__id].__customParameters={};for(let e of Object.keys(v[this.__id].__original.dataset))v[this.__id].__template.dataset[e]=v[this.__id].__original.dataset[e];document.querySelector("#"+v[this.__id].__id).replaceWith(v[this.__id].__template)}return v[this.__id]}}function Q(t,e,r){return e=Je(e),e in t?Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}):t[e]=r,t}function Je(t){var e=Xe(t,"string");return typeof e=="symbol"?e:String(e)}function Xe(t,e){if(typeof t!="object"||!t)return t;var r=t[Symbol.toPrimitive];if(r!==void 0){var n=r.call(t,e||"default");if(typeof n!="object")return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return(e==="string"?String:Number)(t)}class G{constructor(){if(Q(this,"templates",{}),Q(this,"files",{}),Q(this,"components",{}),Q(this,"prefix","el-"),G.instance)return G.instance;G.instance=this}getName(e){return e.replaceAll("../","")}file(e){}componentSetup(e,r=!1){let n=e.constructor.name;if(!this.components[n]||r){let l=Object.assign({},ve),s=Object.assign({},ye),c=s.prefix+e.constructor.selector;s.selector=c;let o=function(a){return(!a.__setup||!a.__setup.initialSetup)&&(l=Object.assign({},ve),s=Object.assign({},ye),s.selector=c,a.__props={},a.__setup=l,a.__config=s,a.__config.templateConnected=!1,a.__shadowRoot=a.shadowRoot||a.attachShadow({mode:a.__config.shadowRoot}),a.__config.styles=="global"&&De(a.__shadowRoot),a.__setup.initialSetup=!0),a};o(e),this.components[n]={setup:l,configuration:s,callback:o}}return this.components[n]}template(e,r=[]){let n=this.getName(e),i=this.templates[n];if(i)return i;const l=new J(n,r);return this.templates[n]=l.__template.content.cloneNode(!0).firstElementChild,this.templates[n]}}Q(G,"instance",void 0);const ve={didConnect:!1,templateConnected:!1,propertiesTracked:!1,initialSetup:!1},ye={selector:"",shadowRoot:"open",styles:"global",prefix:"el-"},He=new G,Ye=function(t){return t.replaceAll("this.","").replaceAll("[",".").replaceAll("]",".").replaceAll("..",".").trim().split(".").slice(0).map(e=>(e[0]=="."&&(e=e.slice(1)),e.endsWith(".")&&(e=e.slice(0,-1)),e)).filter(e=>e.length>0)},Ze=function(t,e,r){let n=typeof r;["boolean","number"].indexOf(n)==-1&&(r="'"+r+"'"),r!==z(t,e)&&Function("return `${this."+e+"="+r+"}`").call(t)},z=function(t,e){try{return Function("return this."+e).call(t)}catch{return Function("return `${this."+e+"}`").call(t)}},et=function(t,e,r){let{success:n,value:i,path:l}=tt(t.scope,e);if((n||i==null)&&i!==r){const s=`\`\${this.${e} = '`+r+"'}`";j.evaluate(t,s)}},tt=function(t,e){let r=e;Array.isArray(r)||(r=Ye(r));try{let n=t;for(let i of r)n[i]&&(n=n[i]);return{success:!0,value:n,path:r}}catch{return{success:!1,value:void 0,path:r}}};class R{static update(e,r,n){et(e,r,n)}static connect(e,r,n,i,l){let s="value",c="keyup",o="text",a=function(u){return u.target.value};e==="checkbox"&&(s="checked",c="change",o="boolean",a=function(u){return u.currentTarget.checked}),e==="number"&&(o="number",a=function(u){return Number(u.target.value)},n.addEventListener("change",function(u){let k=a(u);console.log(k,o),R.update(r,l,k)}));let h=function(){let u=j.evaluate(r,i,o);e=="checkbox"?["true",!0].indexOf(u)>-1?n.setAttribute(s,!0):n.removeAttribute(s):n.setAttribute(s,u)};return n.addEventListener(c,function(u){let k=a(u);R.update(r,l,k)}),h}static text(e,r,n,i){return R.connect("text",e,r,n,i)}static number(e,r,n,i){return R.connect("number",e,r,n,i)}static checkbox(e,r,n,i){return R.connect("checkbox",e,r,n,i)}static select(e,r,n,i){const l=function(a,h){[...a.querySelectorAll("option")].forEach(u=>{h==u.value?u.setAttribute("selected",!0):u.removeAttribute("selected")})},s=function(a){[...a.querySelectorAll("option")].forEach(h=>{h.__didInitialize=h.__didInitialize||[],h.__didInitialize.push(()=>{l(a,z(e.scope,i))})})},c=function(a){const h=r.getAttribute("value");a!=h&&l(r,a)};let o=z(e.scope,i)||void 0;return r.addEventListener("change",a=>{a.target.value!==o&&(o=a.target.value,Ze(e.scope,i,a.target.value))}),s(r),l(r,z(e.scope,i)),c}}function rt(t,e,r){return e=nt(e),e in t?Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}):t[e]=r,t}function nt(t){var e=it(t,"string");return typeof e=="symbol"?e:String(e)}function it(t,e){if(typeof t!="object"||!t)return t;var r=t[Symbol.toPrimitive];if(r!==void 0){var n=r.call(t,e||"default");if(typeof n!="object")return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return(e==="string"?String:Number)(t)}class j{static text(e,r,n,i){const l=function(s){const c=j.evaluate(e,i,"text",n);n.textContent=c};return e.connect(r,l),l}static attribute(e,r,n,i,l){const s=function(c){const o=j.evaluate(e,i,"text",n);n.setAttribute(l,o)};return e.connect(r,s),s}static model(e,r,n,i){let l=n.nodeName=="SELECT"?"select":n.getAttribute("type")||"text";const s=R[l](e,n,i,r),c=function(){s()};return e.connect(r,c),c}static evaluate(e,r,n="text",i=!1){try{const l=e;let o=Function("return "+r).call(l.scope);return n=="boolean"?["true",!0].indexOf(o)>-1?o=!0:o=!1:n=="number"&&(o=Number(o)),o}catch(l){return console.log({instance:e,query:r,node:i,type:n}),console.warn(l),r}}}rt(j,"lastRender",Date.now());function lt(t,e,r){return e=ot(e),e in t?Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}):t[e]=r,t}function ot(t){var e=st(t,"string");return typeof e=="symbol"?e:String(e)}function st(t,e){if(typeof t!="object"||!t)return t;var r=t[Symbol.toPrimitive];if(r!==void 0){var n=r.call(t,e||"default");if(typeof n!="object")return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return(e==="string"?String:Number)(t)}class ct{constructor(){lt(this,"map",{})}track(e,r={}){this.map.hasOwnProperty(e)||(this.map[e]=[]),delete r.setup,this.map[e].push({node:r.node,eventName:r.eventName,value:r.value,functionName:r.query,argumentList:[],connected:!1,subscriptions:[],connect:function(n){},setup:function(n){this.connected||(this.connected=!0,this.connect(n))},...r})}}const de=function(t,e=[]){const r=t.node.parentElement;if(!r)return;const n=r.dataset.ifQuery,i=r.dataset.ifConnection;if(!n)return;let l=Me(n);const s={operation:"if",replacement:r,query:n,connection:i,connected:!1,...l,callback:function(){},connect:async function(c,o={}){try{this.connected=!0;const a=[],h=c.shadowRoot.querySelector('[data-if-connection="'+i+'"]');if(!h){console.log("failed if",{connection:i,_setup:l});return}let u=document.createComment("if placeholder "),k=new J(i,c.__props);u._setup=l,h.replaceWith(u),u.content=k,u.controller=c,u.template=u.content.__template.content.firstElementChild.cloneNode(!0);const A=await Fe(c,u.template);u.after(u.template);let E=[...u.template.querySelectorAll("[data-if-connection]")],f=[...u.template.querySelectorAll("[data-for-connection]")];if(E.length>0||f.length>0){for(let p of E){let _=[];de({node:p.childNodes[0]},_),a.push(_[0])}for(let p of f){let _=[],d=operationFor({node:p.childNodes[0]},_);a.push(_[0])}}u.template.firstElementChild.__setup=u.template.__setup,u.template.firstElementChild.controller=u.template.controller;const m=function(p){p=j.evaluate(c,l.query),[!0,"true"].indexOf(p)>-1?u.template.isConnected||u.after(u.template):u.template.isConnected&&u.template.remove()};this.callback=m;for(let p of a)p.setup(c,o={});u.callback=m;for(let p of l.attribute)c.connect(p,m);m()}catch(a){console.log(n,i),console.warn(a)}},setup:function(c,o={}){this.connected||(this.connected=!0,this.connect(c,o),this.callback())}};e.push(s)},Re=function(t,e=[]){const r=t.node.parentElement,n=r.dataset.forQuery,i=r.dataset.forConnection;let l=je(n);const s={operation:"for",replacement:r,query:n,connection:i,connected:!1,...l,callback:function(){},connect:function(c,o={}){this.connected=!0;let a=[];const h=c.shadowRoot.querySelector('[data-for-connection="'+i+'"]');if(!h)return;let u=document.createComment("for placeholder "),k=new J(i,c.__props);u._setup=l,h.replaceWith(u),u.content=k,u.controller=c,u.stack=[],u.display=[],u._indices={};let A=async function(f){const m=(o==null?void 0:o.indices)||{},p=u.content.__template.content.firstElementChild.cloneNode(!0);p.dataset.elIndex=JSON.stringify({...m,[l.index]:f}),u._indices[l.index]=f,p.innerHTML=p.innerHTML.replaceAll(l.index,f);for(let x of Object.keys(m))x!==l.index&&(p.innerHTML=p.innerHTML.replaceAll(x,m[x]));u.before(p),await Fe(c,p);let _=[...p.querySelectorAll("[data-if-connection]")],d=[...p.querySelectorAll("[data-for-connection]")];if(_.length>0||d.length>0){for(let x of _){let C=[];de({node:x.childNodes[0]},C),a.push(C[0])}for(let x of d){let C=[];Re({node:x.childNodes[0]},C),a.push(C[0])}}return p.firstElementChild.__setup=p.__setup,p.firstElementChild.controller=p.controller,p.firstElementChild.dataset.elIndex=p.dataset.elIndex,p.remove(),p.firstElementChild};const E=function(f){f===void 0&&(f=z(c,l.query.source+".length"));let m=[];for(let p=u.stack.length;p<f;p++)m.push(new Promise(_=>{A(p).then(d=>{u.before(d),u.stack.push(d),u.display.push(d),_(d)})}));Promise.all(m).then(p=>{for(let d=u.display.length;d<f;d++){let x=u.stack[d];u.display.push(x)}for(let d of u.display.reverse())u.before(d);for(let d of a)d.setup(c,o={});a=[];let _=[];for(let d=f;d<u.display.length;d++)_.push(d);_.reverse();for(let d of _)u.display[d].remove(),u.display.pop(),u.stack.pop()})};u.callback=E,u.generate=A,c.connect(l.query.source+".length",E),this.callback=E},setup:function(c,o={}){this.connected||(this.connected=!0,this.connect(c,o),this.callback())}};e.push(s)};function oe(t,e,r){return e=at(e),e in t?Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}):t[e]=r,t}function at(t){var e=ut(t,"string");return typeof e=="symbol"?e:String(e)}function ut(t,e){if(typeof t!="object"||!t)return t;var r=t[Symbol.toPrimitive];if(r!==void 0){var n=r.call(t,e||"default");if(typeof n!="object")return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return(e==="string"?String:Number)(t)}class pt{async onDidConnect(e){this.map.for.forEach(async r=>{await r.callback()}),this.map.if.forEach(async r=>{await r.callback()})}constructor(e){oe(this,"stack",{if:[],for:[]}),oe(this,"map",{if:[],for:[]}),oe(this,"__connId",0)}feed(e){}extractQueryIf(e){const r=W(e.textContent.split("@if"))[0].split(")")[0].replace("(","");let n=te("{{"+r+"}}"),i=r;for(let l of n.sort((s,c)=>c-s))i=i.replaceAll("this.scope."+l,l),i=i.replaceAll("this."+l,l),i=i.replaceAll(l,"this."+l);return{query:i,value:r,keywords:n}}extractQueryFor(e){try{const r=W(e.textContent.split("@for"))[0].split(")")[0].replace("(","");let n=W(r.split(" of ")),i=n[0];i.trim().indexOf("let ")==0&&(i=i.trim().replace("let ","")),i.trim().indexOf("const ")==0&&(i=i.trim().replace("const ",""));let l=n[1],s=te("{{"+l+"}}"),c=l;for(let o of s.sort((a,h)=>h-a))c=c.replaceAll("this.scope."+o,o),c=c.replaceAll("this."+o,o),c=c.replaceAll(o,"this."+o);return{query:c,value:r,source:l,variable:i,keywords:s}}catch(r){console.warn(r)}}extractQuery(e){}track(e,r={}){e=="@for"?Re(r,this.map.for):e=="@if"&&de(r,this.map.if)}}function ft(t,e,r){return e=dt(e),e in t?Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}):t[e]=r,t}function dt(t){var e=ht(t,"string");return typeof e=="symbol"?e:String(e)}function ht(t,e){if(typeof t!="object"||!t)return t;var r=t[Symbol.toPrimitive];if(r!==void 0){var n=r.call(t,e||"default");if(typeof n!="object")return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return(e==="string"?String:Number)(t)}class mt{constructor(){ft(this,"map",{})}track(e,r={}){this.map.hasOwnProperty(e)||(this.map[e]=[]),delete r.setup,this.map[e].push({node:r.node,type:r.type,value:r.value,query:r.query,connected:!1,subscriptions:[],connect:function(n){},setup:function(n){if(this.connected)return this.subscriptions;this.subscriptions=this.connect(n)||[],this.connected=!0},...r})}}var bt=function(t){return Array.prototype.map.call(t,function(e){return{att:e.name,value:e.value,reactive:e.value.indexOf("{{")>-1||e.name.indexOf("*")>-1,action:e.name.indexOf("@")>-1,model:e.name.indexOf("model")==0,propagated:e.name.indexOf("*")==0}})};const Ve=function(t){let e=t.parentController||t;const r=new mt,n=new ct,i=new pt(t);var l=function(s,c){return s.parentController=e,Array.prototype.map.call(s.childNodes,function(o){var A,E;o.parentController=s.parentController;var a={content:o.childNodes&&o.childNodes.length>0?null:o.textContent,atts:o.nodeType!==1?[]:bt(o.attributes),type:o.nodeType===3?"text":o.nodeType===8?"comment":o.tagName.toLowerCase(),node:o};for(let f of["if","for"]){let m=((A=o==null?void 0:o.data)==null?void 0:A.indexOf("@"+f))??-1,p=((E=o==null?void 0:o.data)==null?void 0:E.indexOf("@end"+f))??-1;m>-1?i.track("@"+f,{node:o}):p>-1&&i.track("@end"+f)}i.feed(o),a.reactive=a.content&&a.content.indexOf("{{")>-1&&!a.operation;let h=a.atts.filter(f=>f.reactive);if(h.length>0)for(let f of h){let m=f.att,p=f.value,_=!1;m.indexOf("*")>-1&&(_=!0,o.removeAttribute(m),m=m.replaceAll("*",""),o.removeAttribute(m));for(let d of O(f.value)){let x=te("{{"+d.trim()+"}}");for(let C of x){let H=C,w=f.value;w=w.replaceAll("{{"+d+"}}","{{"+d.replaceAll(H,C)+"}}"),w="`"+w.replaceAll("{{","${").replaceAll("}}","}")+"`",r.track(C,{node:o,type:"attribute",value:p,query:w,connect:function(N){let b=function(){};if(_){if(N&&N==o.parentController&&o!=N&&o.connect){let g=N,I=o,y=f.att.replaceAll("*","").trim();g.hasOwnProperty("__propagation")||(g.__propagation={}),g.__propagation[y]||(g.__propagation[y]={}),g.__propagation[y][I]||(g.__propagation[y][I]=!0,b=function(){let P=N,L=o;Function("return `${this.child.scope."+y+"=this.parentCtrl.scope."+C+"}`;").call({parentCtrl:P,child:L})},g.connect(C,b))}}else m=="model"?b=j.model(N,C,o,w):b=j.attribute(N,C,o,w,m),b()}})}}}if(a.atts.filter(f=>f.model).length>0){let f=o.getAttribute("model"),m=f.indexOf("this.")>-1?f:"this."+f,p="`${"+m+"}`";r.track(f,{node:o,type:"model",value:m,query:p,connect:function(_){j.model(_,f,o,p)()}})}if(a.reactive)for(let f of O(a.content)){let m=te("{{"+f.trim()+"}}");for(let p of m){let _=p,d=a.content;d=d.replaceAll("{{"+f+"}}","{{"+f.replaceAll(_,p)+"}}"),d="`"+d.replaceAll("{{","${").replaceAll("}}","}")+"`",r.track(p,{node:o,type:"text",value:a.content,query:d,connect:function(x){j.text(x,p,o,d)()}})}}let k=a.atts.filter(f=>f.action);if(k.length>0)for(let f of k){f=f.att;const m=o.hasOwnProperty(f)?"native":"custom";let p=f.replaceAll("@","");const _=o.getAttribute(f),d=o.getAttribute(f).trim().replaceAll(" ",""),x=d.split("(").map(w=>w.trim()).filter(w=>w.length>0),C=x[0];let H=[];x.length>1&&(H=x[1].replaceAll(")","").trim().split(",")),p.indexOf("on")==0&&typeof o[p.slice(2)]=="function"&&(p=p.slice(2)),n.track(f,{node:o,type:m,value:_,eventName:p,query:d,actionName:C,args:H,connect:function(w){o.addEventListener(p,function(N){const b=w.scope;b.$event=N;let g=JSON.parse(o.getAttribute("el-index")||JSON.stringify({}));for(let[y,P]of Object.entries(g))b[y]=P;let I=H.map(y=>{let P=y,L,q;try{L=y.replaceAll("[",".").replaceAll("]","").trim().split(".").map(M=>M.trim()).filter(M=>M.length>0),P=L[0],q=z(w,y),isNaN(q)||(q=Number(q))}catch{}return b.hasOwnProperty(P)?q:isNaN(y)?["'",'"',"`"].indexOf(y.trim().charAt(0))>-1?y.trim().slice(1,y.trim().length-1):y:Number(y)});w[C](...I)})}})}return a.isSVG=c||a.type==="svg",a.children=l(o,a.isSVG),a})};return l(t),{props:r,actions:n,operations:i}},Fe=function(t,e){var o;if((o=e==null?void 0:e.__setup)!=null&&o.templateConnected)return;const{props:r,actions:n,operations:i}=Ve(e),l=r.map;for(let a of Object.keys(l)){const h=l[a];for(let u of h)a.endsWith("[")||u.setup(t)}for(let a of Object.keys(n.map))for(let h of n.map[a])h.node.removeAttribute(a),h.setup(t);let s=i.map.for;for(let a of s){let h={};e.dataset.elIndex&&(h.indices=JSON.parse(e.dataset.elIndex)),a.setup(t,h)}let c=t.operations.map.if;for(let a of c)a.setup(t);return e.__setup={},e.__setup.templateConnected=!0,e},gt=function(t){if(t.__setup.templateConnected)return;const e=t.reactiveProps.map;for(let l of Object.keys(e)){const s=e[l];for(let c of s)c.setup(t)}const r=t.actions.map;for(let l of Object.keys(r))for(let s of r[l])s.node.removeAttribute(l),s.setup(t);let n=t.operations.map.for;for(let l of n)l.setup(t);let i=t.operations.map.if;for(let l of i)l.setup(t);t.__setup.templateConnected=!0},_t=function(t){t.__template.parentController=t.parentController||t;const{props:e,actions:r,operations:n}=Ve(t.__template);t.reactiveProps=e,t.actions=r,t.operations=n},B=function(t){return Array.isArray(t)||(t=t.replaceAll("[","."),t=t.split(".").map(e=>e.replaceAll("]","").replaceAll(".","").trim())),t=t.join("."),t};function se(t,e,r){return e=vt(e),e in t?Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}):t[e]=r,t}function vt(t){var e=yt(t,"string");return typeof e=="symbol"?e:String(e)}function yt(t,e){if(typeof t!="object"||!t)return t;var r=t[Symbol.toPrimitive];if(r!==void 0){var n=r.call(t,e||"default");if(typeof n!="object")return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return(e==="string"?String:Number)(t)}class xt{constructor(){se(this,"events",{}),se(this,"prevValues",{}),se(this,"trackTimeout",void 0)}subscribe(e,r){return e=B(e),this.events[e]||(this.events[e]=[],this.prevValues[e]=void 0),this.events[e].push(r),(()=>{let i=!0;return{event:e,callback:r,render:()=>{if(i&&this.events[e])for(let l of this.events[e])l()},unsubscribe:()=>{i&&(i=!1,this.events[e]&&(this.events[e]=this.events[e].filter(l=>l!==r)))}}})()}publish(e,r){console.log(e),this.events[e]?this.events[e].forEach(n=>n(r)):console.log("no events subscribed yet:",e)}unsubscribe(e){console.log("@TODO unsubscribe")}track(){clearTimeout(this.trackTimeout),this.trackTimeout=setTimeout(()=>{console.log("---------------------------"),console.log("Subscription tracking".toUpperCase()),console.log("---------------------------");let e=0;for(let r of Object.keys(this.events)){let n=this.events[r].length;console.log("Sub:",r,n),e+=n}console.log(""),console.log("TOTAL: ",e+" active subscriptions"),console.log("-------------------------------------")},100)}}class kt{constructor(e,r){return this._preproxy=new WeakMap,this._handler=r,this.proxify(e,[])}makeHandler(e){let r=this;return{get(n,i,l){return r._handler.get?r._handler.get(n,[...e,i],l):n[i]},set(n,i,l,s){return typeof l=="object"&&(l=r.proxify(l,[...e,i])),n[i]=l,r._handler.set&&r._handler.set(n,[...e,i],l,s),!0},deleteProperty(n,i){if(Reflect.has(n,i)){r.unproxy(n,i);let l=Reflect.deleteProperty(n,i);return l&&r._handler.deleteProperty&&r._handler.deleteProperty(n,[...e,i]),l}return!1}}}unproxy(e,r){this._preproxy.has(e[r])&&(e[r]=this._preproxy.get(e[r]),this._preproxy.delete(e[r]));for(let n of Object.keys(e[r]))typeof e[r][n]=="object"&&this.unproxy(e[r],n)}proxify(e,r){for(let i of Object.keys(e))typeof e[i]=="object"&&(e[i]=this.proxify(e[i],[...r,i]));let n=new Proxy(e,this.makeHandler(r));return this._preproxy.set(n,e),n}}const Ct=function(t){const e=new xt;return t=new kt(t,{set(i,l,s,c){try{let o=B(l),a=typeof i[o];return o.indexOf("__")==0||(a!=="object"||Array.isArray(i[o]))&&e.publish(B(l),s),!0}catch(o){console.warn(o),console.log(l,B(l),s)}},deleteProperty(i,l){},getPath(i,l){console.log("getPath",l.split("."),i)}}),[t,function(i,l){return e.subscribe(B(i),l)},function(){for(let i of Object.keys(e.events))e.publish(i)},e]},wt=function(t={}){let[e,r,n]=Ct(t);return{scope:e,connect:r,render:n}},Pt=function(t){const e={};t.__props=Object.getOwnPropertyNames(t).filter(s=>s.indexOf("_")!=0&&typeof s!="function"),t.__props.forEach(s=>{e[s]=t.getAttribute(s)||t[s],t.setAttribute(s,e[s])});const{scope:r,connect:n,render:i,pubsub:l}=wt(e);t.scope=r,t.connect=n,t.render=i,t.pubsub=l;for(let s of Object.keys(t.scope))t.__defineGetter__(s,function(){return t.scope[s]});return t},At=function(t){t.__template=He.template(t.constructor.selector,t.__props),t.__shadowRoot.appendChild(t.__template)};function Ot(t,e,r){return e=St(e),e in t?Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}):t[e]=r,t}function St(t){var e=$t(t,"string");return typeof e=="symbol"?e:String(e)}function $t(t,e){if(typeof t!="object"||!t)return t;var r=t[Symbol.toPrimitive];if(r!==void 0){var n=r.call(t,e||"default");if(typeof n!="object")return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return(e==="string"?String:Number)(t)}function V(t){const e={...t};if(e.template){const r=document.createElement("template");document.head.appendChild(r),r.id="template-"+e.selector,r.innerHTML=e.template}return function(r){class n extends r{static get observedAttributes(){return this.__props||[]}constructor(){super()}}Ot(n,"selector",e.selector);try{customElements.define(e.selector,r)}catch(i){console.warn(i)}return n}}class F extends HTMLElement{constructor(){super(...arguments),this.__init()}__init(){const{setup:e,configuration:r,callback:n}=He.componentSetup(this);this.__setup||(this.__setup=e,this.__setup.initialSetup=!1,this.__setup.templateConnected=!1,this.__config=r,n(this))}async __hidrate(){Pt(this),At(this),_t(this),gt(this)}async __initialConnection(){(!this.__setup||!this.__template)&&(delete this.__setup,this.__init(!0)),this.__setup.didConnect||(this.__setup.didConnect=!0,this.__hidrate(),this.operations.onDidConnect(this))}connectedCallback(){this.__initialConnection(),this.render()}attributeChangedCallback(e,r,n){console.log("attributeChangedCallback",e,r,n)}render(){}}var xe,ke,Y;function U(t,e,r){return e=Tt(e),e in t?Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}):t[e]=r,t}function Tt(t){var e=Et(t,"string");return typeof e=="symbol"?e:String(e)}function Et(t,e){if(typeof t!="object"||!t)return t;var r=t[Symbol.toPrimitive];if(r!==void 0){var n=r.call(t,e||"default");if(typeof n!="object")return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return(e==="string"?String:Number)(t)}const Nt=`<div>\r
  <div>\r
    <button\r
      class="btn bg-{{color}}-200 border border-{{border}}-500"\r
      @onClick="onClick()"\r
    >\r
    {{color}} - \r
    <slot> </slot>\r
    - {{placeholder}}\r
    </button>\r
  </div>\r
</div>\r
`;xe=V({selector:"el-btn",template:Nt}),xe(ke=(Y=class extends F{constructor(){super(),U(this,"color","white"),U(this,"border","gray"),U(this,"placeholder","El Btn Component")}onClick(){console.log("callback ",this)}borderChangeCallback(){this.border=this.color=="white"?"gray":this.color}attributeChangedCallback(){console.log("attributeChangedCallback",...arguments)}},U(Y,"selector","el-btn"),U(Y,"observedAttributes",["color"]),Y));var Ce,we,ce;function Pe(t,e,r){return e=It(e),e in t?Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}):t[e]=r,t}function It(t){var e=qt(t,"string");return typeof e=="symbol"?e:String(e)}function qt(t,e){if(typeof t!="object"||!t)return t;var r=t[Symbol.toPrimitive];if(r!==void 0){var n=r.call(t,e||"default");if(typeof n!="object")return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return(e==="string"?String:Number)(t)}Ce=V({selector:"el-card-expanded",template:`<div>
    <figure style="display: {{expanded ? '' : 'none'}}">
        <img
            src="https://daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg"
        />
    </figure>
    <a class="card-collapser sidebar-collapser" @onClick="onToggleCard()">
        @if(expanded){
            <span> - </span>
        }@else{
            <span> + </span>
        }
    </a>  
  </div>`}),Ce(we=(ce=class extends F{constructor(){super(),Pe(this,"expanded",!0)}onToggleCard(){this.scope.expanded=!this.scope.expanded}},Pe(ce,"selector","el-card-expanded"),ce));var Ae,Oe,Z;function ee(t,e,r){return e=Lt(e),e in t?Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}):t[e]=r,t}function Lt(t){var e=jt(t,"string");return typeof e=="symbol"?e:String(e)}function jt(t,e){if(typeof t!="object"||!t)return t;var r=t[Symbol.toPrimitive];if(r!==void 0){var n=r.call(t,e||"default");if(typeof n!="object")return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return(e==="string"?String:Number)(t)}const Mt=`<div>\r
    <input type="{{type}}" model="value"  class="input" />\r
</div>`;Ae=V({selector:"el-input",template:Mt}),Ae(Oe=(Z=class extends F{constructor(){super(),ee(this,"value","El Input Component"),ee(this,"type","text")}attributeChangedCallback(e,r,n){console.log("attribute changed",{name:e,oldValue:r,newValue:n})}},ee(Z,"selector","el-input"),ee(Z,"observedAttributes",["value"]),Z));var Se,$e,ae;function S(t,e,r){return e=Ht(e),e in t?Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}):t[e]=r,t}function Ht(t){var e=Rt(t,"string");return typeof e=="symbol"?e:String(e)}function Rt(t,e){if(typeof t!="object"||!t)return t;var r=t[Symbol.toPrimitive];if(r!==void 0){var n=r.call(t,e||"default");if(typeof n!="object")return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return(e==="string"?String:Number)(t)}const Vt=`<div>\r
  <div\r
    class="card preview border-base-300 bg-base-100 rounded-b-box rounded-se-box flex min-h-[6rem] min-w-[18rem] max-w-4xl flex-wrap items-center justify-center gap-2 overflow-x-hidden bg-cover bg-top p-4 [border-width:var(--tab-border)] undefined"\r
    style="\r
      background-image: url(https://daisyui.com/images/stock/photo-1481026469463-66327c86e544.jpg);\r
      background-size: cover;\r
      border-radius: 1em;\r
    "\r
  >\r
    <div class="card w-96 glass">\r
 \r
      <el-card-expanded *expanded="{{card.expanded}}"></el-card-expanded>\r
      <div class="card-body">\r
        <h2 class="card-title">{{card.title}}</h2>\r
\r
        <p>\r
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dolores\r
          magnam quisquam iusto, autem eveniet, veniam vitae maiores optio\r
          facilis velit, omnis hic ea ipsam voluptates sequi nostrum tempore\r
          perspiciatis est!\r
        </p>\r
        <div>\r
          @for(l of card.list; let index = $cardListIndex){\r
          <li>\r
            {{l}} {{$cardListIndex}} {{num}}\r
            <input model="l" class="input" />\r
          </li>\r
          }\r
        </div>\r
\r
        <div class="justify-end card-actions">\r
          <el-btn *color="{{color}}">Push {{color}}</el-btn>\r
      \r
          <button class="btn btn-primary" @onClick="onPop()">Pop</button>\r
        </div>\r
\r
        <div>\r
          @for(item of items){\r
          <li>\r
            {{item.name}}\r
            <input model="item.name" class="input" />\r
            <el-input *value="item.name" ></el-input>\r
          </li>\r
          }\r
        </div>\r
        <div class="justify-end card-actions">\r
          <button class="btn btn-primary" @onClick="onPushItem()">Push</button>\r
          <button class="btn btn-primary" @onClick="onPopItem()">Pop</button>\r
        </div>\r
      </div>\r
    </div>\r
  </div>\r
</div>\r
`;Se=V({selector:"el-card",template:Vt}),Se($e=(ae=class extends F{constructor(){super(),S(this,"checked",!0),S(this,"checkedd",!0),S(this,"num",10),S(this,"listNumbers",[10,20,40]),S(this,"text","text property"),S(this,"object",{key:"object value",title:"Title"}),S(this,"list",["list id: 0"]),S(this,"objectList",[{item:"object list item id: 0"}]),S(this,"color","yellow"),S(this,"colors",["green","red","yellow"]),S(this,"items",[{name:"item 0"},{name:"item 1"}]),S(this,"card",{id:1,title:"Card 1 ",expanded:!1,description:"Card 1 description",list:["list 0"]}),console.log(this.__template)}onToggleChecked(){this.scope.checked=!this.scope.checked}onToggleCheckedV2(){this.scope.checkedd=!this.scope.checkedd}onToggleCard(){this.card.expanded=!this.card.expanded}onPush(e,r,n,i){console.log("xxx")}onPop(e){}onPushItem(){}onPopItem(){console.log(this.items,this.items.length),this.items.pop()}onClickWithData(e,r){console.log({color:e,colors:r},...arguments)}},S(ae,"selector","el-card"),ae));var Te,Ee,ue;function $(t,e,r){return e=Ft(e),e in t?Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}):t[e]=r,t}function Ft(t){var e=Kt(t,"string");return typeof e=="symbol"?e:String(e)}function Kt(t,e){if(typeof t!="object"||!t)return t;var r=t[Symbol.toPrimitive];if(r!==void 0){var n=r.call(t,e||"default");if(typeof n!="object")return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return(e==="string"?String:Number)(t)}const Dt=`<div>\r
  <select class="input border border-gray-100 w-full pb-4" model="color">\r
    @for(__color of colors){\r
    <option value="{{__color}}" class="text-{{__color}}-900">\r
      {{__color}}\r
    </option>\r
    }\r
  </select>\r
\r
  <div class="lil-card bg-{{color}}-50 border border-{{color}}-300">\r
    @if(checked){\r
    <div class="lil-card bg-{{color}}-50 border border-{{color}}-300">\r
      Checked @if(checkedd){\r
      <div class="lil-card bg-{{color}}-50 border border-{{color}}-300">\r
        Checked v2\r
      </div>\r
      <input model="listNumbers[2]" type="number" class="input" />\r
      }\r
      <div class="lil-card-button">\r
        <button class="btn" @onClick="onToggleCheckedV2">CheckedV2</button>\r
      </div>\r
    </div>\r
    }\r
    <div class="lil-card-button">\r
      <button class="btn" @onClick="onToggleChecked">Checked</button>\r
    </div>\r
  </div>\r
\r
  <input model="num" type="number" class="input" />\r
  @if( items.length > 0 ){\r
  <div class="lil-card">\r
    If there are items: items.length > 0\r
    <input type="checkbox" checked="{{items.length >0}}" disabled />\r
    <i class="text-green-900">V</i>\r
  </div>\r
  } @else {\r
  <div class="lil-card">\r
    If there are no items: items.length == 0\r
    <input type="checkbox" checked="{{items.length ==0}}" disabled />\r
    <i class="text-red-900">X</i>\r
  </div>\r
\r
  }\r
  <button class="btn" @onClick="onClickWithData(color,colors)">\r
    Click With Colors\r
  </button>\r
\r
  @for(card of cards;index = $i){\r
\r
  <div\r
    class="card preview border-base-300 bg-base-100 rounded-b-box rounded-se-box flex min-h-[6rem] min-w-[18rem] max-w-4xl flex-wrap items-center justify-center gap-2 overflow-x-hidden bg-cover bg-top p-4 [border-width:var(--tab-border)] undefined"\r
    style="\r
      background-image: url(https://daisyui.com/images/stock/photo-1481026469463-66327c86e544.jpg);\r
      background-size: cover;\r
      border-radius: 1em;\r
    "\r
  >\r
    <div class="card w-96 glass">\r
      <figure style="display: {{card.expanded ? '' : 'none'}}">\r
        <img\r
          src="https://daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg"\r
        />\r
      </figure>\r
      <a class="card-collapser sidebar-collapser" @onClick="onToggleCard($i)">\r
        @if(card.expanded){\r
        <span> - </span>\r
        }@else{\r
        <span> + </span>\r
        }\r
      </a>\r
      <div class="card-body">\r
        <h2 class="card-title">{{card.title}}</h2>\r
\r
        <p>\r
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dolores\r
          magnam quisquam iusto, autem eveniet, veniam vitae maiores optio\r
          facilis velit, omnis hic ea ipsam voluptates sequi nostrum tempore\r
          perspiciatis est!\r
        </p>\r
        <div>\r
          @for(l of card.list; let index = $cardListIndex){\r
          <li>\r
            {{l}} {{$cardListIndex}} {{num}}\r
            <input model="l" class="input" />\r
          </li>\r
          }\r
        </div>\r
\r
        <div class="justify-end card-actions">\r
          <button\r
            class="btn btn-primary"\r
            @onClick="onPush($i, card,'text',listNumbers[2])"\r
          >\r
            Push\r
          </button>\r
          <button class="btn btn-primary" @onClick="onPop($i)">Pop</button>\r
        </div>\r
\r
        <div>\r
          @for(item of items){\r
          <li>\r
            {{item.name}}\r
            <input model="item.name" class="input" />\r
          </li>\r
          }\r
        </div>\r
        <div class="justify-end card-actions">\r
          <button class="btn btn-primary" @onClick="onPushItem()">Push</button>\r
          <button class="btn btn-primary" @onClick="onPopItem()">Pop</button>\r
        </div>\r
      </div>\r
    </div>\r
  </div>\r
  }\r
</div>\r
`;Te=V({selector:"el-demo",template:Dt}),Te(Ee=(ue=class extends F{constructor(){super(),$(this,"checked",!0),$(this,"checkedd",!0),$(this,"num",10),$(this,"listNumbers",[10,20,40]),$(this,"text","text property"),$(this,"object",{key:"object value",title:"Title"}),$(this,"list",["list id: 0"]),$(this,"objectList",[{item:"object list item id: 0"}]),$(this,"color","yellow"),$(this,"colors",["green","red","yellow"]),$(this,"items",[{name:"item 0"},{name:"item 1"}]),$(this,"cards",[{id:1,title:"Card 1 ",expanded:!1,description:"Card 1 description",list:["list 0"]},{id:2,title:"Card 2 ",expanded:!0,description:"Card 2 description",list:["list 0","list 1"]},{id:3,title:"Card 3 ",expanded:!0,description:"Card 3 description",list:[]}])}onToggleChecked(){this.scope.checked=!this.scope.checked}onToggleCheckedV2(){this.scope.checkedd=!this.scope.checkedd}onToggleCard(e){this.cards[e].expanded=!this.cards[e].expanded}onPush(e,r,n,i){console.log({card:r,text:n,num:i,cardList:this.cards[e].list,cardIndex:e}),this.cards[e].list.push("list "+this.cards[e].list.length),console.log(r.list.length+i+r.id,{a:r.list.length,b:i,c:r.id})}onPop(e){this.cards[e].list.pop()}onPushItem(){this.items.push({name:"item "+this.items.length})}onPopItem(){console.log(this.items,this.items.length),this.items.pop()}onClickWithData(e,r){console.log({color:e,colors:r},...arguments)}},$(ue,"selector","el-demo"),ue));var Ne,Ie,pe;function K(t,e,r){return e=Wt(e),e in t?Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}):t[e]=r,t}function Wt(t){var e=Gt(t,"string");return typeof e=="symbol"?e:String(e)}function Gt(t,e){if(typeof t!="object"||!t)return t;var r=t[Symbol.toPrimitive];if(r!==void 0){var n=r.call(t,e||"default");if(typeof n!="object")return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return(e==="string"?String:Number)(t)}const zt=`<div>\r
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
            <h5>{{headlines.title}}</h5>\r
          </div>\r
        </div>\r
        <div class="sidebar-content">\r
          <nav class="menu open-current-submenu">\r
            <ul>\r
              @for(separator of menu;index = $separator){\r
              <div>\r
                <li class="menu-header"><span> {{separator.title}} </span></li>\r
                @for(link of separator.links;index = $link){\r
                <li class="menu-item sub-menu {{link.open ? 'open': ''}}" @onClick="toggleSeparator($separator, $link)">\r
                  <a href="#">\r
                    <span class="menu-icon">\r
                      <i class="{{link.icon}}"></i>\r
                    </span>\r
                    <span class="menu-title">{{link.title}}</span>\r
                    <span class="menu-suffix">\r
                      <!-- <span class="badge primary">Hot</span> -->\r
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
\r
            </ul>\r
          </nav>\r
        </div>\r
        <div class="sidebar-footer">\r
        \r
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
          <h1 style="margin-bottom: 0">{{headlines.title}}</h1>\r
          <span style="display: inline-block">\r
            {{headlines.description}}\r
          </span>\r
          <br />\r
          <span>\r
            <slot></slot>\r
            Full Code and documentation available on \r
            <a\r
              href="{{links.github.href}}"\r
              target="_blank"\r
              >Github</a\r
            >\r
          </span>\r
          <div style="margin-top: 10px">\r
            <a\r
            href="{{links.github.href}}"\r
              target="_blank"\r
            >\r
              <img\r
                alt="GitHub stars"\r
                src="https://img.shields.io/github/stars/azouaoui-med/pro-sidebar-template?style=social"\r
              />\r
            </a>\r
            <a\r
            href="{{links.github.href}}"\r
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
   \r
          </ul>\r
        </div>\r
        <footer class="footer">\r
          <small style="margin-bottom: 20px; display: inline-block">\r
            {{year}}\r
            <span style="color: red; font-size: 18px">&#10084;</span> by -\r
            <a target="_blank" href="{{links.github.href}}">\r
              Filipe Sá - Pihh\r
            </a>\r
          </small>\r
          <br />\r
          <div class="social-links">\r
            @for(link of linkList){\r
\r
              <a href="{{link.href}}" target="_blank">\r
                <i class="{{link.icon}} ri-xl"></i>\r
              </a>\r
           \r
            </a>\r
          }\r
          </div>\r
        </footer>\r
      </main>\r
      <div class="overlay"></div>\r
    </div>\r
  </div>\r
</div>\r
`;Ne=V({selector:"el-layout",template:zt}),Ne(Ie=(pe=class extends F{constructor(){super(),K(this,"headlines",{title:"El framework",description:"Reactive custom web components simplified "}),K(this,"links",{github:{href:"https://github.com/pihh",icon:"ri-github-fill"},twitter:{href:"https://twitter.com/pihh",icon:"ri-twitter-fill"},linkedin:{href:"https://linkedin.com/pihh",icon:"ri-linkedin-fill"}}),K(this,"year",new Date().getFullYear()),K(this,"linkList",Object.keys(this.links).map(e=>this.links[e])),K(this,"menu",[{title:"EL FRAMEWORK",links:[{title:"Get started",open:!0,link:"#",icon:"ri-terminal-box-fill",submenus:[{link:"#",title:"Install"},{link:"#",title:"Write your first component"}]}]},{title:"FEATURES",links:[{title:"Simple",open:!1,link:"#",icon:"ri-code-box-fill",submenus:[{link:"#",title:"Intuitive markup"},{link:"#",title:"Reúsable"}]},{title:"Data binding",open:!1,link:"#",icon:"ri-links-line",submenus:[{link:"#",title:"Input"},{link:"#",title:"Select"},{link:"#",title:"Checkbox"}]},{title:"Conditional rendering",open:!1,link:"#",icon:"ri-toggle-fill",submenus:[{link:"#",title:"@if"},{link:"#",title:"@for"}]}]},{title:"EXTRAS",links:[{title:"Documentation",open:!1,link:"#",icon:"ri-book-2-fill",submenus:[]}]}])}attributeChangedCallback(e,r,n){console.log("attribute",e)}toggleSeparator(e,r){for(let n=0;n<this.menu.length;n++)for(let i=0;i<this.menu[n].links.length;i++)n==e&&i==r?this.menu[n].links[i].open=!this.menu[n].links[i].open:this.menu[n].links[i].open=!1}},K(pe,"selector","el-layout"),pe));var qe,Le,fe;function Ut(t,e,r){return e=Qt(e),e in t?Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}):t[e]=r,t}function Qt(t){var e=Bt(t,"string");return typeof e=="symbol"?e:String(e)}function Bt(t,e){if(typeof t!="object"||!t)return t;var r=t[Symbol.toPrimitive];if(r!==void 0){var n=r.call(t,e||"default");if(typeof n!="object")return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return(e==="string"?String:Number)(t)}const Jt=`<slot>\r
  \r
</slot>`;qe=V({selector:"el-text",template:Jt}),qe(Le=(fe=class extends F{constructor(){super()}},Ut(fe,"selector","el-text"),fe));
