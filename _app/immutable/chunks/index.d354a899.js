function $(){}function W(t,e){for(const n in e)t[n]=e[n];return t}function D(t){return t()}function j(){return Object.create(null)}function g(t){t.forEach(D)}function O(t){return typeof t=="function"}function st(t,e){return t!=t?e==e:t!==e||t&&typeof t=="object"||typeof t=="function"}function z(t){return Object.keys(t).length===0}function F(t,...e){if(t==null)return $;const n=t.subscribe(...e);return n.unsubscribe?()=>n.unsubscribe():n}function at(t,e,n){t.$$.on_destroy.push(F(e,n))}function ft(t,e,n,i){if(t){const r=P(t,e,n,i);return t[0](r)}}function P(t,e,n,i){return t[1]&&i?W(n.ctx.slice(),t[1](i(e))):n.ctx}function dt(t,e,n,i){if(t[2]&&i){const r=t[2](i(n));if(e.dirty===void 0)return r;if(typeof r=="object"){const o=[],l=Math.max(e.dirty.length,r.length);for(let s=0;s<l;s+=1)o[s]=e.dirty[s]|r[s];return o}return e.dirty|r}return e.dirty}function _t(t,e,n,i,r,o){if(r){const l=P(e,n,i,o);t.p(l,r)}}function ht(t){if(t.ctx.length>32){const e=[],n=t.ctx.length/32;for(let i=0;i<n;i++)e[i]=-1;return e}return-1}function mt(t){const e={};for(const n in t)e[n]=!0;return e}const R=typeof window<"u"?window:typeof globalThis<"u"?globalThis:global;"WeakMap"in R;let w=!1;function G(){w=!0}function I(){w=!1}function J(t,e,n,i){for(;t<e;){const r=t+(e-t>>1);n(r)<=i?t=r+1:e=r}return t}function K(t){if(t.hydrate_init)return;t.hydrate_init=!0;let e=t.childNodes;if(t.nodeName==="HEAD"){const c=[];for(let u=0;u<e.length;u++){const f=e[u];f.claim_order!==void 0&&c.push(f)}e=c}const n=new Int32Array(e.length+1),i=new Int32Array(e.length);n[0]=-1;let r=0;for(let c=0;c<e.length;c++){const u=e[c].claim_order,f=(r>0&&e[n[r]].claim_order<=u?r+1:J(1,r,b=>e[n[b]].claim_order,u))-1;i[c]=n[f]+1;const a=f+1;n[a]=c,r=Math.max(a,r)}const o=[],l=[];let s=e.length-1;for(let c=n[r]+1;c!=0;c=i[c-1]){for(o.push(e[c-1]);s>=c;s--)l.push(e[s]);s--}for(;s>=0;s--)l.push(e[s]);o.reverse(),l.sort((c,u)=>c.claim_order-u.claim_order);for(let c=0,u=0;c<l.length;c++){for(;u<o.length&&l[c].claim_order>=o[u].claim_order;)u++;const f=u<o.length?o[u]:null;t.insertBefore(l[c],f)}}function Q(t,e){if(w){for(K(t),(t.actual_end_child===void 0||t.actual_end_child!==null&&t.actual_end_child.parentNode!==t)&&(t.actual_end_child=t.firstChild);t.actual_end_child!==null&&t.actual_end_child.claim_order===void 0;)t.actual_end_child=t.actual_end_child.nextSibling;e!==t.actual_end_child?(e.claim_order!==void 0||e.parentNode!==t)&&t.insertBefore(e,t.actual_end_child):t.actual_end_child=e.nextSibling}else(e.parentNode!==t||e.nextSibling!==null)&&t.appendChild(e)}function pt(t,e,n){w&&!n?Q(t,e):(e.parentNode!==t||e.nextSibling!=n)&&t.insertBefore(e,n||null)}function U(t){t.parentNode&&t.parentNode.removeChild(t)}function yt(t,e){for(let n=0;n<t.length;n+=1)t[n]&&t[n].d(e)}function V(t){return document.createElement(t)}function S(t){return document.createTextNode(t)}function gt(){return S(" ")}function bt(){return S("")}function xt(t,e,n,i){return t.addEventListener(e,n,i),()=>t.removeEventListener(e,n,i)}function $t(t,e,n){n==null?t.removeAttribute(e):t.getAttribute(e)!==n&&t.setAttribute(e,n)}function X(t){return Array.from(t.childNodes)}function Y(t){t.claim_info===void 0&&(t.claim_info={last_index:0,total_claimed:0})}function q(t,e,n,i,r=!1){Y(t);const o=(()=>{for(let l=t.claim_info.last_index;l<t.length;l++){const s=t[l];if(e(s)){const c=n(s);return c===void 0?t.splice(l,1):t[l]=c,r||(t.claim_info.last_index=l),s}}for(let l=t.claim_info.last_index-1;l>=0;l--){const s=t[l];if(e(s)){const c=n(s);return c===void 0?t.splice(l,1):t[l]=c,r?c===void 0&&t.claim_info.last_index--:t.claim_info.last_index=l,s}}return i()})();return o.claim_order=t.claim_info.total_claimed,t.claim_info.total_claimed+=1,o}function Z(t,e,n,i){return q(t,r=>r.nodeName===e,r=>{const o=[];for(let l=0;l<r.attributes.length;l++){const s=r.attributes[l];n[s.name]||o.push(s.name)}o.forEach(l=>r.removeAttribute(l))},()=>i(e))}function wt(t,e,n){return Z(t,e,n,V)}function tt(t,e){return q(t,n=>n.nodeType===3,n=>{const i=""+e;if(n.data.startsWith(i)){if(n.data.length!==i.length)return n.splitText(i.length)}else n.data=i},()=>S(e),!0)}function vt(t){return tt(t," ")}function Et(t,e){e=""+e,t.data!==e&&(t.data=e)}function Nt(t,e){t.value=e??""}function At(t,e,n,i){n==null?t.style.removeProperty(e):t.style.setProperty(e,n,i?"important":"")}function et(t,e,{bubbles:n=!1,cancelable:i=!1}={}){const r=document.createEvent("CustomEvent");return r.initCustomEvent(t,n,i,e),r}function St(t,e){const n=[];let i=0;for(const r of e.childNodes)if(r.nodeType===8){const o=r.textContent.trim();o===`HEAD_${t}_END`?(i-=1,n.push(r)):o===`HEAD_${t}_START`&&(i+=1,n.push(r))}else i>0&&n.push(r);return n}function kt(t,e){return new t(e)}let y;function p(t){y=t}function k(){if(!y)throw new Error("Function called outside component initialization");return y}function Ct(t){k().$$.on_mount.push(t)}function Mt(t){k().$$.after_update.push(t)}function jt(){const t=k();return(e,n,{cancelable:i=!1}={})=>{const r=t.$$.callbacks[e];if(r){const o=et(e,n,{cancelable:i});return r.slice().forEach(l=>{l.call(t,o)}),!o.defaultPrevented}return!0}}const h=[],T=[];let m=[];const E=[],B=Promise.resolve();let N=!1;function H(){N||(N=!0,B.then(L))}function Tt(){return H(),B}function A(t){m.push(t)}function Dt(t){E.push(t)}const v=new Set;let _=0;function L(){if(_!==0)return;const t=y;do{try{for(;_<h.length;){const e=h[_];_++,p(e),nt(e.$$)}}catch(e){throw h.length=0,_=0,e}for(p(null),h.length=0,_=0;T.length;)T.pop()();for(let e=0;e<m.length;e+=1){const n=m[e];v.has(n)||(v.add(n),n())}m.length=0}while(h.length);for(;E.length;)E.pop()();N=!1,v.clear(),p(t)}function nt(t){if(t.fragment!==null){t.update(),g(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(A)}}function it(t){const e=[],n=[];m.forEach(i=>t.indexOf(i)===-1?e.push(i):n.push(i)),n.forEach(i=>i()),m=e}const x=new Set;let d;function Ot(){d={r:0,c:[],p:d}}function Pt(){d.r||g(d.c),d=d.p}function rt(t,e){t&&t.i&&(x.delete(t),t.i(e))}function qt(t,e,n,i){if(t&&t.o){if(x.has(t))return;x.add(t),d.c.push(()=>{x.delete(t),i&&(n&&t.d(1),i())}),t.o(e)}else i&&i()}const lt=["allowfullscreen","allowpaymentrequest","async","autofocus","autoplay","checked","controls","default","defer","disabled","formnovalidate","hidden","inert","ismap","loop","multiple","muted","nomodule","novalidate","open","playsinline","readonly","required","reversed","selected"];[...lt];function Bt(t,e,n){const i=t.$$.props[e];i!==void 0&&(t.$$.bound[i]=n,n(t.$$.ctx[i]))}function Ht(t){t&&t.c()}function Lt(t,e){t&&t.l(e)}function ct(t,e,n,i){const{fragment:r,after_update:o}=t.$$;r&&r.m(e,n),i||A(()=>{const l=t.$$.on_mount.map(D).filter(O);t.$$.on_destroy?t.$$.on_destroy.push(...l):g(l),t.$$.on_mount=[]}),o.forEach(A)}function ut(t,e){const n=t.$$;n.fragment!==null&&(it(n.after_update),g(n.on_destroy),n.fragment&&n.fragment.d(e),n.on_destroy=n.fragment=null,n.ctx=[])}function ot(t,e){t.$$.dirty[0]===-1&&(h.push(t),H(),t.$$.dirty.fill(0)),t.$$.dirty[e/31|0]|=1<<e%31}function Wt(t,e,n,i,r,o,l,s=[-1]){const c=y;p(t);const u=t.$$={fragment:null,ctx:[],props:o,update:$,not_equal:r,bound:j(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(e.context||(c?c.$$.context:[])),callbacks:j(),dirty:s,skip_bound:!1,root:e.target||c.$$.root};l&&l(u.root);let f=!1;if(u.ctx=n?n(t,e.props||{},(a,b,...C)=>{const M=C.length?C[0]:b;return u.ctx&&r(u.ctx[a],u.ctx[a]=M)&&(!u.skip_bound&&u.bound[a]&&u.bound[a](M),f&&ot(t,a)),b}):[],u.update(),f=!0,g(u.before_update),u.fragment=i?i(u.ctx):!1,e.target){if(e.hydrate){G();const a=X(e.target);u.fragment&&u.fragment.l(a),a.forEach(U)}else u.fragment&&u.fragment.c();e.intro&&rt(t.$$.fragment),ct(t,e.target,e.anchor,e.customElement),I(),L()}p(c)}class zt{$destroy(){ut(this,1),this.$destroy=$}$on(e,n){if(!O(n))return $;const i=this.$$.callbacks[e]||(this.$$.callbacks[e]=[]);return i.push(n),()=>{const r=i.indexOf(n);r!==-1&&i.splice(r,1)}}$set(e){this.$$set&&!z(e)&&(this.$$.skip_bound=!0,this.$$set(e),this.$$.skip_bound=!1)}}export{dt as A,T as B,Bt as C,Dt as D,bt as E,Ot as F,Pt as G,Mt as H,At as I,kt as J,Tt as K,Nt as L,xt as M,g as N,mt as O,jt as P,yt as Q,St as R,zt as S,gt as a,X as b,wt as c,tt as d,V as e,U as f,vt as g,pt as h,Wt as i,Q as j,Et as k,at as l,Ht as m,$ as n,Ct as o,Lt as p,$t as q,ct as r,st as s,S as t,rt as u,qt as v,ut as w,ft as x,_t as y,ht as z};
