function aa(a){function b(d){return a.next(d)}function c(d){return a.throw(d)}return new Promise(function(d,e){function h(k){k.done?d(k.value):Promise.resolve(k.value).then(b,c).then(h,e)}h(a.next())})}
const r=lui,ea=r.defer,fa=r.defer_end,ha=r.dom_define,ia=r.hook_async,A=r.hook_dom,D=r.hook_effect,ja=r.hook_memo,na=r.hook_model,oa=r.hook_rerender,pa=r.hook_state,E=r.hook_static,F=r.node,H=r.node_dom,qa=r.node_map,ra=r.now,sa=window,ta=document,J=Math,za=J.PI,Aa=.5*za,Ba=180/za,L=J.floor,Ca=J.ceil,Da=J.round,O=J.min,Ea=J.max,Fa=J.cos,Ga=J.sin,Ha=J.sqrt,Ma=J.log2,Na=String.fromCharCode,Oa=Date,Pa=JSON,Qa=Pa.stringify,Ra=Pa.parse,P=localStorage,Sa=P.setItem.bind(P),Ta=P.removeItem.bind(P),Ua=Uint8Array,
Va=Uint32Array,Wa=Map,Q=Number,Xa=Object,Ya=Xa.keys,Za=Xa.entries,db=setTimeout,eb=setInterval,fb=clearInterval,S=a=>a*a,gb=()=>!1,hb=a=>{var b=new Oa;a=new Oa(a);var c=b-a;if(59E3>c)return Da(c/1E3)+"s";if(3E6>c)return Da(c/6E4)+"m";c=a.getFullYear();const d=a.getMonth(),e=a.getDate();let h="";c<b.getFullYear()&&(h=c+"/");if(h||d<b.getMonth())h+=d+1+"/";if(h||e<b.getDate())h+=e+"/";b=h+a.getHours()+":";a=a.getMinutes();a=L(a).toString().padStart(2,"0");return b+a},ib={init:()=>{let a=!1;var b={ia:!0,
ra:3,V:4,za:120,da:64,Ba:0,worlds:[]},c=P.getItem("minicraft.config");if(c){c=Ra(c);let d=c.flag_textures;null!=d&&(b.ia=d);null!=(d=c.mouse_sensitivity)&&(b.ra=d);b.V=c.resolution_scaling;b.za=c.view_angle;b.da=c.view_distance;null!=(d=c.world_last)&&(b.Ba=d);null!=(d=c.worlds)?b.worlds=d:P.getItem("minicraft.world.0:meta")&&(b.worlds[0]={id:0,label:(prompt("There was an unnamed world found. How should it be called?","")||"Unknown world").substring(0,16),mod_l:Date.now(),mod_r:0},a=!0)}b={account:{label:"",
rank:0},g:b,Ua:b};return a?(b.Ua=null,ib.Ta(b)):b},Ta:a=>{const b=a.g;if(b===a.Ua)return a;Sa("minicraft.config",Qa({version:"0.9.6",flag_textures:b.ia,mouse_sensitivity:b.ra,resolution_scaling:b.V,view_angle:b.za,view_distance:b.da,world_last:b.Ba,worlds:b.worlds}));return Object.assign({},a,{Ua:b})},nb:(a,b)=>Object.assign({},a,{account:b}),pb:(a,b)=>ib.Va(a,b(a.g)),Va:(a,b)=>Object.assign({},a,{g:Object.assign({},a.g,b)}),$a:(a,b)=>Object.assign({},a,{g:Object.assign({},a.g,{worlds:[...a.g.worlds,
b]})}),mb:(a,b)=>Object.assign({},a,{g:Object.assign({},a.g,{worlds:a.g.worlds.filter(c=>c.id!==b)})}),W:(a,b,c)=>Object.assign({},a,{g:Object.assign({},a.g,{worlds:a.g.worlds.map(d=>d.id===b?Object.assign({},d,c):d)})})},jb="air stone grass dirt cobble planks bedrock log leaves bricks wool sand gravel glass bookshelf obsidian stone_bricks sandstone lapis_block iron_block gold_block diamond_block emerald_block redstone_block quartz_block".split(" "),kb=[0,8487297,4305266,4349313,8092539,5342114,7039851,
3561583,4172910,6384533,15526888,10671324,8092798,16447200,4151672,1970708,8092539,9686227,9126695,15198183,5567485,14541182,7920469,662956,14936813],lb="WEBTSN".split(""),mb=(a,b=1,c=null)=>({amount:b,data:c,id:a}),nb=(a,b,c=a.content.amount)=>{if(b.content)a.content.id===b.content.id?(c=O(c,b.O-b.content.amount),a.content.amount-=c,b.content.amount+=c,0>=a.content.amount&&(a.content=null)):!(a.content.amount<=c&&a.content.amount<=b.O&&b.content.amount<=a.O)||a.filter&&!a.filter(b.content.id)||b.filter&&
!b.filter(a.content.id)||([b.content,a.content]=[a.content,b.content]);else if(!b.filter||b.filter(a.content.id))a.content.amount<=c&&a.content.amount<=b.O?[b.content,a.content]=[a.content,b.content]:(c=O(c,b.O),a.content.amount-=c,b.content=mb(a.content.id,c),0>=a.content.amount&&(a.content=null))},ob=(a,b)=>{for(const c of a)if(c.content&&c.content.id===b.id){const d=O(b.amount,c.O-c.content.amount);c.content.amount+=d;if(0>=(b.amount-=d))return null}for(const c of a)if(!c.content&&(!c.filter||
c.filter(b.id)))if(a=O(b.amount,c.O),a<=b.amount){if(c.content=mb(b.id,a),0>=(b.amount-=a))return null}else return c.content=b,null;return b},pb=(a,b)=>({Qa:0,ab:0,Ra:0,N:0,ea:0,Da:0,fa:0,X:-1,ga:0,ma:null,na:null,u:1,ib:20,G:Array(36).fill(null).map(()=>({content:null,filter:null,O:64})),La:0,name:b.label||"Player",H:a.wa,J:a.xa,K:a.ya,kb:0,lb:0,M:0,ka:0,aa:0,ba:0,ca:0}),qb=(a,b,c)=>{a.N=(a.N+b+100*za)%(2*za);a.ea=Ea(-Aa,O(Aa,a.ea+c))},rb=a=>{a+=32;33<a&&39>a?a++:38<a&&44>a?a+=2:43<a&&127>a?a+=3:
126<a&&55258>a?a+=37:55295<a&&(a+=8485);return Na(a)},sb=a=>a-(63743<a?8517:159<a?69:46<a&&130>a?35:40<a&&46>a?34:34<a&&40>a?33:32),ub=()=>{var a=tb;const b=a.length,c=new Wa,d=m=>{l=l<<1|m&1;15===++t&&(g+=rb(l),l=t=0)},e=()=>{for(let m=0;m<w;++m)d(0)},h=m=>{d(m);d(m>>1);d(m>>2);d(m>>3);d(m>>4);d(m>>5);d(m>>6);d(m>>7)},k=()=>{0===--v&&(v=1<<w++)},n=()=>{if(q)q=!1;else{let m=u.id;for(let x=0;x<w;x++)d(m>>x)}};let f=a[0],g="",l=0,t=2,w=2,v=2,p=2,u={id:p++,Fa:new Wa},q=!0;h(f);c.set(f,u);for(let m=1;m<
b;++m){const x=u.Fa.get(f=a[m]);x?u=x:(n(),c.has(f)||(k(),e(),h(f),c.set(f,{id:p++,Fa:new Wa}),q=!0),u.Fa.set(f,{id:p++,Fa:new Wa}),u=c.get(f),k())}n();c.has(f)||(k(),e(),h(f));k();d(1);--w;e();return g+=rb(l<<15-t)},vb=a=>{var b=tb;if(!a)return null;const c=a.length,d=()=>{t+=(p>>--u&1)<<w++;0===u&&(u=15,p=sb(a.charCodeAt(v++)))};let e=[0,1],h=1,k=3,n=2,f=null;var g=null;let l=0,t=0;g=2;let w=0,v=0,p=sb(a.charCodeAt(v++)),u=15;for(;w<g;)d();if(1===t)return null;for(t=w=0;8>w;)d();f=[t];e[2]=f;for(b[l++]=
t;v<=c;){g=n;for(t=w=0;w<g;)d();if(0===t){for(t=w=0;8>w;)d();e[k]=[t];t=k++;0===--h&&(h=1<<n++)}else if(1===t)return b;g=t<e.length?e[t]:f.concat(f[0]);for(let q=0;q<g.length;q++)b[l++]=g[q];e[k++]=f.concat(g[0]);f=g;0===--h&&(h=1<<n++)}return null},T=new Va(1024),tb=new Ua(T.buffer),wb=new Wa,xb=(a,b,c,d)=>0>c||63<c?0:a.Y[(b<<a.L+4|d)<<6|c],yb=(a,b,c,d)=>{const e=a.L;a.Y[(b<<e+4|d)<<6|c]=0;a.Z[(b>>4<<e|d>>4)<<2|c>>4].ha=!0},zb=(a,b,c,d,e)=>{const h=a.L,k=(b<<h+4|d)<<6|c;if(0<a.Y[k])return!1;a.Y[k]=
e;return a.Z[(b>>4<<h|d>>4)<<2|c>>4].ha=!0},Cb=(a,b,c)=>{const d=Ea(O(b.J,63),0)>>4,e=L(b.H)>>4;b=L(b.K)>>4;if(c||a.Ja!==d||a.sa+a.Ia!==e||a.ta+a.Ka!==b)c=1<<a.L,a.Ja=d,a.sa=e-(a.Ia=(65536+e)%c),a.ta=b-(a.Ka=(65536+b)%c),Ab(a);Bb(a,!1)},Ab=a=>{const b=a.Ia,c=a.Ja,d=a.Ka,e=a.L,h=`${e} ${b} ${d} ${c}`;let k=wb.get(h);if(null==k){const n=1<<e,f=S(.5*n);wb.set(h,k=a.Z.map(({x:g,y:l,z:t},w)=>{let v=S(g-b),p=S(t-d),u=S(g-b-n),q=0,m=0;u<v&&(v=u,q=-n);(u=S(g-b+n))<v&&(v=u,q=n);(u=S(t-d-n))<p&&(p=u,m=-n);
(u=S(t-d+n))<p&&(p=u,m=n);return{Wa:v+p+S(l-c),cb:w,sa:q,ta:m}}).filter(({Wa:g})=>g<=f).sort((g,l)=>g.Wa-l.Wa))}a.Ga=k;a.oa=0},Pb=(a,b)=>{for(var c of a.Z)c.ha&&Db(a,c);for(c=b.G.map(({content:d})=>d&&[d.id,d.amount,d.data]);0<c.length&&null===c[c.length-1];)c.pop();Sa(`minicraft.world.${a.id}:meta`,Qa({p:{h:b.ib,i:c,m:b.u,p:[b.H,b.J,b.K,b.N,b.ea]},s:[a.wa,a.xa,a.ya],v:1}))},Qb=(a,b)=>{const c=P.getItem(`minicraft.world.${a.id}:meta`);if(c){const {p:d,s:e,v:h}=Ra(c);null!=h&&(d.i.forEach((k,n)=>{k&&
(b.G[n].content=mb(k[0],k[1],k[2]))}),b.ib=d.h,b.u=d.m,b.H=d.p[0],b.J=d.p[1],b.K=d.p[2],b.N=d.p[3],b.ea=d.p[4],a.wa=e[0],a.xa=e[1],a.ya=e[2])}},Rb=(a,b,c,d)=>`minicraft.world.${a.id}:${b}/${c}`+(0<d?"/"+d:""),Db=(a,b)=>{const c=a.Ea;var d=a.L;const e=b.y,h=(256<<d)-256;for(let k=0,n=-1,f=((b.x<<d+4|b.z)<<6|e)<<2;16>k;++k){for(d=0;16>d;++d)T[++n]=c[f],T[++n]=c[++f],T[++n]=c[++f],T[++n]=c[++f],f+=13;f+=h}Sa(Rb(a,b.Ca,b.Pa,e),ub());b.ha=!1},Bb=(a,b)=>{const c=a.Z,d=a.Ga,e=a.sa,h=a.ta,k=d.length;for(;a.oa<
k;){var n=d[a.oa++],f=c[n.cb],g=f.loaded,l=f.x;const v=f.y;var t=f.z,w=e+n.sa+l;n=h+n.ta+t;if(!g||w!==f.Ca||n!==f.Pa)if(f.ha&&Db(a,f),f.loaded=!0,n=vb(P.getItem(Rb(a,f.Ca=w,f.Pa=n,v))),g||0===v||n){f=a.Ea;const p=a.L;w=(256<<p)-256;l=((l<<p+4|t)<<6|v)<<2;if(n)for(let u=0,q=-1;16>u;++u){for(g=0;16>g;++g)f[l]=T[++q],f[++l]=T[++q],f[++l]=T[++q],f[++l]=T[++q],l+=13;l+=w}else for(t=0;16>t;++t){for(n=0;16>n;++n)f[l]=0<v?0:50397446,f[++l]=0<v?0:131843,g?(f[++l]=0,f[++l]=0,l+=13):l+=15;l+=w}if(!b)break}}};
let Sb=null,Tb=null,Ub=new Image;Ub.crossOrigin="anonymous";Ub.onload=()=>{const a=ta.createElement("canvas");a.width=16;a.height=416;const b=a.getContext("2d");b.drawImage(Ub,0,0);ha("tile","div[className=bitmap]",{S:{backgroundImage:`url(${a.toDataURL()})`}});Sb=new Va(b.getImageData(0,0,16,416).data.buffer);Tb&&Tb();Ub=Tb=null};Ub.src=ASSETS+"blocks.webp";
const Wb=(a,b)=>{const c={ob:b,Sa:b.getContext("2d",{alpha:!1,desynchronized:!0}),bb:null,gb:"",P:!1,hb:0,Xa:0,qb:eb(()=>(c.hb=c.Xa,c.Xa=0),1E3),o:a};null===Sb&&(Tb=()=>c.P=!0);Vb(c);return c},Vb=a=>{const b=a.ob,c=a.o;(a.bb=a.Sa.createImageData(b.width=c.ua,b.height=c.va)).data.fill(255);const d=c.ua*c.g.V/c.ja,e=c.va*c.g.V/c.ja;b.style.width=d+"px";b.style.height=e+"px";b.style.left=Da((c.Ma-d)/2)+"px";b.style.top=Da((c.Na-e)/2)+"px";a.Sa.fillStyle="rgba(255,255,255,.5)"};let Xb=0;
const Zb=(a,b,c,d)=>{const e={Y:null,Ea:null,Z:null,Ga:null,oa:0,A:!0,Ia:0,Ja:0,Ka:0,id:c.Ba,sa:0,ta:0,L:0,wa:.5,xa:8.5,ya:.5,time:0,Oa:0},h=pb(e,d);Qb(e,h);a={actions:a,g:c,eb:0,fb:0,Ha:!1,pa:!0,qa:!1,rb:b,$:0,T:new Set,Ya:"",l:0,U:[],j:h,B:null,ja:1,Ma:1,Na:1,ua:0,va:0,tb:eb(()=>{e.A||(e.time=(e.time+1)%24E3,e.Oa=1/24E3*(e.Oa+6E3)%1,Cb(e,h,!1))},50),world:e};Yb(a);return a},$b=a=>{Pb(a.world,a.j);a.actions.W(a.world.id,{mod_l:Date.now()})},Yb=a=>{aa(function*(){try{yield a.rb.requestPointerLock()}catch(b){}}())},
ac=(a,b)=>a===b?0:.1-.2*a,bc=a=>{a.j.Qa=ac((a=a.T).has(-12)||a.has(65),a.has(-13)||a.has(68))},cc=a=>{a.j.ab=ac((a=a.T).has(-15)||a.has(16),a.has(-14)||a.has(32))},dc=a=>{a.j.Ra=ac((a=a.T).has(-11)||a.has(83),a.has(-10)||a.has(87))},ec=a=>{a.j.kb=ac(a.T.has(-18),a.T.has(-19))},fc=a=>{a.j.lb=ac(a.T.has(-17),a.T.has(-16))},X=(a,b,c)=>{if(!a.world)return!1;const d=a.T;var e=a.j;if(c){if(d.has(b))return!1;d.add(b);var h=e.fa,k=e.X;c=e.ga;switch(b){case -18:case -19:ec(a);break;case -17:case -16:fc(a);
break;case -1:2!==e.u&&0<=k&&(0===e.La?0===e.u&&(b=xb(a.world,h,k,c),2===b?b=3:1===b&&(b=4),6===b||8!==b&&13!==b&&null!==ob(e.G,mb(b,1)))||(yb(a.world,h,k,c),e.X=-1):gc(a,[h,k,c],!1));break;case -2:case 71:if(0<=k){const n=xb(a.world,h,k,c);c=e.G.slice(0,9);k=c.findIndex(f=>null!==f.content&&f.content.id===n);0<=k?e.M=k:1===e.u&&(c[e.M].content&&(c=c.findIndex(f=>null===f.content),0<=c&&(e.M=c)),e.G[e.M].content=mb(n));e.ka=a.$}break;case -3:if(2!==e.u&&0<=k)if(0===e.La){if(b=e.G[e.M],b.content){switch(e.Da){case 0:--h;
break;case 1:++h;break;case 2:--k;break;case 3:++k;break;case 4:--c;break;default:++c}0<=k&&64>k&&zb(a.world,h&(1<<4+a.world.L)-1,k,c&(1<<4+a.world.L)-1,b.content.id)&&1!==e.u&&0>=--b.content.amount&&(b.content=null)}}else gc(a,[h,k,c],!0);break;case -4:e.M=(e.M+9-1)%9;e.ka=a.$;break;case -5:e.M=(e.M+1)%9;e.ka=a.$;break;case 27:0===a.l&&(a.world.A=!0,a.l=1);break;case -15:case -14:case 16:case 32:cc(a);break;case 49:case 50:case 51:case 52:case 53:case 54:case 55:case 56:case 57:e.M=b-49;e.ka=a.$;
break;case -12:case -13:case 65:case 68:bc(a);break;case 69:if(0===a.l){a.l=3;for(const n of d)X(a,n,!1)}break;case 80:a.world&&(a.world.A=!a.world.A);break;case 81:e=e.G[e.M];if(d.has(17)||e.content&&0>=--e.content.amount)e.content=null;break;case -11:case -10:case 83:case 87:dc(a);break;case 84:if(0===a.l){a.l=2;for(const n of d)X(a,n,!1)}break;case 112:a.pa=!a.pa;break;case 114:a.Ha=!a.Ha;break;default:return!1}}else{if(!d.delete(b))return!1;switch(b){case -15:case -14:case 16:case 32:cc(a);break;
case -12:case -13:case 65:case 68:bc(a);break;case -11:case -10:case 83:case 87:dc(a);break;case -18:case -19:ec(a);break;case -17:case -16:fc(a)}}a.Ya=[...d].join();return!0},hc=(a,b)=>(b=b.startsWith("~")?a+Q(b.substr(1)):Q(b),isNaN(b)?a:b),Y=(a,b,c=!1)=>{(a.U=a.U.slice(-49)).push({id:++Xb,jb:c,time:ra(),value:b})},gc=(a,b,c)=>{c?a.j.na=b:a.j.ma=b;Y(a,`${c?"Secondary point":"Primary point"}: ${b.join(" ")}`,!0)},ic=({id:a})=>(A("#tile",{S:{backgroundPositionY:`-${2*(a-1)}rem`}}),null);
function jc({amount:a,u:b,id:c}){A("div[className=stack]",{title:jb[c]+(1===b?` (${c})`:"")});return[F(ic,{id:c}),1!==a&&H("div[className=amount]",{innerText:a})]}
function kc({j:a,la:b}){A("div[className=bar]",{ontouchstart:E(d=>{a.M=Number(d.target.closest("[data-slot]").dataset.slot);a.ka=d.timeStamp}),S:{opacity:Ea(.5,O(1,1-5E-4*(b-a.ka-5E3)))}});const c=a.u;return Sb&&a.G.slice(0,9).map(({content:d},e)=>H("div",{D:{slot:e},F:{active:e===a.M}},[d&&F(jc,{amount:d.amount,data:d.data,u:c,id:d.id})]))}
function lc({sb:a}){A("div[className=grid]",{onclick:({target:b})=>{(b=b.closest("[data-id]"))&&nb({content:mb(Q(b.dataset.id)),filter:null,O:64},a)}});return jb.map((b,c)=>0<c&&H("div",{D:{id:c}},[F(jc,{amount:1,data:null,u:1,id:c})]))}
function mc({o:a}){const b=ja(()=>({content:null,filter:null,O:64})),c=a.j.u;A("div[className=menu overlay inventory]",ja(()=>({onclick:({target:d})=>{if("menu overlay inventory"===d.className)b.content?b.content=null:(a.l=0,a.world.A=!1,Yb(a));else if(d=d.closest("[data-slot]"))d=a.j.G[Q(d.dataset.slot)],b.content?nb(b,d):d.content&&nb(d,b)},oncontextmenu:({target:d})=>{if("menu overlay inventory"===d.className)b.content?0>=--b.content.amount&&(b.content=null):(a.l=0,Yb(a));else if(d=d.closest("[data-slot]"))d=
a.j.G[Q(d.dataset.slot)],b.content?nb(b,d,1):d.content&&nb(d,b,Ca(d.content.amount/2))}})));return Sb&&[H("div[className=window]",null,[H("div[innerText=Inventory]"),1===c&&F(lc,{sb:b}),H("div[className=grid]",null,a.j.G.map(({content:d},e)=>H("div",{D:{slot:e},F:{first:9>e}},[d&&F(jc,{amount:d.amount,data:d.data,u:c,id:d.id})])))]),b.content&&H("div[className=hand]",{S:{transform:`translate(${a.eb}px, ${a.fb}px)`}},[F(jc,{amount:b.content.amount,data:b.content.data,u:0,id:b.content.id})])]}
const nc=({I:{jb:a,time:b,value:c},la:d})=>(A(a?"div[className=minor]":"div",{innerText:c,S:{opacity:O(1,1-.001*(d-b-4500))}}),null);function oc({U:a,la:b}){A("div[className=messages]");const c=b-5E3;return[qa(nc,a.slice(-10).filter(d=>d.time>c),{la:b})]}
function pc({actions:{pb:a,Va:b},g:c,o:d,Aa:e}){D(()=>$b(d));A("div[className=menu overlay]");return[H("h1[innerText=Settings]"),E(H("center",null,[H("button[innerText=Back to game]",{onclick:()=>{d.l=0;d.world.A=!1;Yb(d)}})])),H("div[className=settings]",null,[H("button",{innerText:"Surfaces:\n"+(c.ia?"Textured":"Plain"),onclick:E(()=>a(h=>({ia:!h.ia})))}),H("label[innerText=Resolution:]",null,[H("input[type=range][min=1][max=100][step=1]",{value:101-c.V,onchange:E(h=>b({V:101-Number(h.target.value)}))})]),
H("label[innerText=View angle:]",null,[H("input[type=range][min=1][max=180][step=1]",{value:c.za,onchange:E(h=>b({za:Number(h.target.value)}))})]),H("label[innerText=View distance:]",null,[H("input[type=range][min=1][max=128][step=1]",{value:c.da,onchange:E(h=>b({da:Number(h.target.value)}))})]),H("label[innerText=Mouse sensitivity:]",null,[H("input[type=range][min=1][max=15][step=1]",{value:c.ra,onchange:E(h=>b({ra:Number(h.target.value)}))})])]),E(H("center",null,[H("button[innerText=Leave world]",
{onclick:()=>{e(0)}})]))]}const qc=({I:{jb:a,value:b}})=>(A(a?"div[className=minor]":"div",{innerText:b}),null);
function rc({o:a,U:b}){const c=E({history:null,input:null});A("div[className=menu overlay terminal]",{onclick:d=>{d.target!==c.input&&c.input.focus()}});D(d=>{d&&db(()=>c.history.scrollTop=1E9,0)},[b.length&&b[b.length-1].id]);return[E(H("div[className=toolbar]",null,[H("button[innerText=\u274c]",{onclick:()=>{a.l=0;a.world.A=!1;Yb(a)}})])),H("div[className=history]",{R:E(d=>{c.history=d})},[qa(qc,b)]),E(H("input[enterkeyhint=send][mozactionhint=send][name=message][required]",{onkeydown:d=>{var e=
d.keyCode;d=d.target;if(13===e){var h=d.value;e=a.j;const n=a.world;if(h)if("/"===h.charAt(0)){h=h.substr(1).split(" ");const f=h.shift();switch(f){case "clear":a.U=[];break;case "clearinv":for(var k of e.G)k.content=null;Y(a,"Inventory cleared.",!0);break;case "gamemode":case "gm":h=Q(h[0]);!isNaN(h)&&0<=h&&3>h&&0===h%1?(e.u=h,Y(a,"Game mode set to: "+h,!0)):Y(a,"Game mode must be in 0..2!");break;case "give":if(0===h.length){Y(a,"/give <id> [Amount]\n"+jb.join(" "));break}k=jb.indexOf((h[0]||"").toLowerCase());
k=0<=k?k:Q(h[0]);h=Q(h[1]||1);!isNaN(k)&&0<k&&25>k&&0===k%1?!isNaN(h)&&0<h&&0===h%1?Y(a,ob(e.G,mb(k,h))?"Inventory is full!":`${"Gave items"} ${h} ${jb[k]}`,!0):Y(a,"Amount must be at least 1!"):Y(a,"Invalid block type!");break;case "help":Y(a,"Commands: clear, clearinv, gamemode, give, help, load, me, save, spawn, teleport, version");break;case "load":Bb(n,!0);a.B.P=!0;Y(a,"Chunks loaded.",!0);break;case "me":Y(a,e.name+" "+h.join(" "),!0);break;case "save":$b(a);Y(a,"Game saved.",!0);break;case "smart":e.name=
"LFF5644";Y(a,"lff.smart: true",!0);break;case "spawn":n.wa=e.H;n.xa=e.J;n.ya=e.K;Y(a,"Spawn updated.",!0);break;case "teleport":case "tp":0===h.length?(e.H=n.wa,e.J=n.xa,e.K=n.ya,a.B.P=!0,Y(a,"Teleported to spawn.",!0)):3===h.length?(Y(a,"Teleported to"+` ${e.H=hc(e.H,h[0])} ${e.J=hc(e.J,h[1])} ${e.K=hc(e.K,h[2])}`,!0),a.B.P=!0):Y(a,"Pitch!");e.aa=0;e.ba=0;e.ca=0;break;case "version":Y(a,"Minicraft 0.9.6");break;case "/exit":e.La=0;Y(a,"Normal mouse mode.",!0);break;case "/expand":a.j.ma&&a.j.na?
k=!0:(Y(a,"Selection required!"),k=!1);k&&("vert"===h[0]?(e.ma[1]=0,e.na[1]=63,Y(a,"Expanded selection.",!0)):Y(a,'Only "vert" supported!'));break;case "/pos1":case "/pos2":gc(a,[L(e.H),L(e.J),L(e.K)],"/pos2"===f);break;case "/regen":e=n.Z[n.Ga[n.oa=0].cb];Ta(Rb(n,e.Ca,e.Pa,e.y));e.ha=!1;++e.Ca;Bb(n,!1);Y(a,"Chunk regenerated.",!0);a.B.P=!0;break;case "/show":Y(a,`${"Primary"}: ${e.ma?e.ma.join(" "):"none"}, ${"Secondary"}: ${e.na?e.na.join(" "):"none"}`);break;case "/wand":e.La=1;Y(a,"Select using mouse buttons.",
!0);break;default:Y(a,"Unknown command: "+f)}}else Y(a,`<${e.name}> `+h);d.value=""}else 27===e&&(a.A=!1,a.l=0)},R:d=>{c.input=d;db(()=>d.focus(),0)}}))]}const sc=[["pick",-2],["up",-14],["down",-15],["E",69],["T",84],["F1",112],["F3",114],["...",27]],tc=[["up",-10],["down",-11],["left",-12],["right",-13],["center",-1]],uc=[["up",-16],["down",-17],["left",-18],["right",-19],["center",-3]];
function vc({o:a}){const b=a.T,c=([d,e])=>H("div",{D:{code:e},F:{button:!0,[d]:!0,active:b.has(e)}});A("div[className=touch]",E({ontouchstart:d=>{d.preventDefault();const e=Number(d.target.dataset.code);if(null!=e&&X(a,e,!0)){const h=d.changedTouches[0].identifier,k=n=>{n.changedTouches[0].identifier===h&&(removeEventListener("touchend",k),X(a,e,!1))};addEventListener("touchend",k)}}}));return[H("div[className=top]",null,sc.map(([d,e])=>H(`div[innerText=${d}]`,{D:{code:e},F:{button:!0,active:b.has(e)}}))),
H("div[className=move]",null,tc.map(c)),H("div[className=move sec]",null,uc.map(c))]}
function wc({account:a,actions:b,g:c,frame:d,Za:e,Aa:h}){const k=ra(),n=ta.pointerLockElement===d,f=ja(()=>e.o=Zb(b,d,c,a));D(()=>{const g=v=>{if(0!==f.l)return!0;f.qa=!1;ta.pointerLockElement===d?X(f,-1-v.button,"mousedown"===v.type):Yb(f);v.preventDefault();return!1},l=v=>{if(f.world.A)f.eb=v.clientX,f.fb=v.clientY;else{const p=f.g.ra*za/(Ea(f.Ma,f.Na)*f.ja);qb(f.j,v.movementX*p,-v.movementY*p)}},t=v=>{f.qa=!1;if(0===f.l&&!f.world.A&&5<Math.abs(v.deltaY)){const p=0<v.deltaY?-5:-4;X(f,p,!0);X(f,
p,!1);v.preventDefault()}},w=v=>{f.qa=!0;0===f.l&&(f.world.A=!1,v.preventDefault())};d.addEventListener("mousedown",g);d.addEventListener("mouseup",g);d.addEventListener("mousemove",l);d.addEventListener("wheel",t);d.addEventListener("touchstart",w);return()=>{d.removeEventListener("mousedown",g);d.removeEventListener("mouseup",g);d.removeEventListener("mousemove",l);d.removeEventListener("wheel",t);d.removeEventListener("touchstart",w);fb(f.tb);Pb(f.world,f.j);fb(f.B.qb);e.o=null}});D(()=>{f.g=c;
f.B&&(f.B.P=!0);const g=f.world;var l=Ca(Ma(f.g.da/16*2+2));if(g.L!==l){var t=f.j;g.Z&&Pb(g,t);const w=1<<(g.L=l),v=g.Z=[];for(let p=0;p<w;++p)for(let u=0;u<w;++u)for(let q=0;4>q;++q)v.push({ha:!1,loaded:!1,x:p,y:q,z:u,Ca:0,Pa:0});l=w<<l+12+2;null===g.Y||g.Y.length<l?g.Ea=new Va((g.Y=new Ua(l)).buffer):g.Ea.fill(0);Cb(g,t,!0)}},[c]);D((g,l,t)=>{f.ja=t;f.Ma=Ea(1,g);f.Na=Ea(1,l);l=f.g.V;g=Ca(f.Ma*f.ja/l);l=Ca(f.Na*f.ja/l);if(g!==f.ua||l!==f.va)f.ua=g,f.va=l,f.B&&(f.B.P=!0,Vb(f.B))},[d.offsetWidth,d.offsetHeight,
sa.devicePixelRatio||1,c.V]);D(()=>{n||f.world.A||0!==f.l||(f.l=1);f.world.A=!n},[n]);D(g=>n&&g&&ta.exitPointerLock(),[f.world.A||0!==f.l]);D(()=>{if(f.world){if(f.$&&!f.world.A){var g=f.j,l=O(5,.01*(k-f.$));g.aa-=.1*g.aa*l;g.ba-=.1*g.ba*l;g.ca-=.1*g.ca*l;g.aa+=(Fa(g.N)*g.Qa+Ga(g.N)*g.Ra)*l;g.ba+=g.ab*l;g.ca+=(-Ga(g.N)*g.Qa+Fa(g.N)*g.Ra)*l;qb(g,g.kb*l,g.lb*l);g.H+=g.aa*l;g.J+=g.ba*l;g.K+=g.ca*l}if(f.B){g=f.B;++g.Xa;l=g.Sa;var t=g.bb;const ba=g.o,ua=ba.g,$a=ba.pa,y=ba.j,U=ba.ua,Z=ba.va,I=ba.world;
if(!I.A||g.P){g.P=!1;const ka=t.data,xc=ua.da;var w=y.N,v=y.ea;const yc=y.fa,zc=y.ga;var p=y.H,u=y.J,q=y.K;const Ac=$a?y.X:-1,Bc=I.Y;var m=I.L;const Cc=ua.ia&&null!==Sb;var x=1/U,B=1/Z;const la=U>>1,ma=Z>>1,Eb=O(U,Z),Fb=32<Eb,Gb=Fa(w);w=Ga(w);const Hb=Fa(-v);v=Ga(-v);var C=ua.za/45;const Dc=x*(U<Z?C*U*B:C);x=B*(Z<U?C*Z*x:C);p+=65536;u+=65536;q+=65536;B=p%1;C=u%1;const Ec=q%1;m=4+m;const Ib=(1<<m)-1;let Jb=1===y.u?6:4,ca=y.fa=y.ga=y.Da=0;y.X=-1;for(let Ia=0;Ia<Z;++Ia){var z=(ma-Ia)*x;const Kb=z*Hb-
v;var V=z*v+Hb;z=V*w;V*=Gb;for(let Ja=0;Ja<U;++Ja){var R=(Ja-la)*Dc;const Lb=z+Gb*R;R=V-w*R;let va=16757124,Ka=1,Mb=xc;for(let G=0;3>G;++G){let M=R;0===G&&(M=Lb);1===G&&(M=Kb);var W=1/(0>M?-M:M);const La=Lb*W,da=Kb*W;W*=R;const Nb=Ha(La*La+da*da+W*W);var K=Ec;0===G&&(K=B);1===G&&(K=C);0<M&&(K=1-K);let wa=p+La*K-(0===G&0>M|0),xa=u+da*K-(1===G&0>M|0),ya=q+W*K-(2===G&0>M|0);K*=Nb;for(let ab,bb,cb,N;K<Mb;wa+=La,xa+=da,ya+=W,K+=Nb)if(65536>xa){if(0>da)break}else if(65600<=xa){if(0<da)break}else if(0!==
(N=Bc[((ab=wa&Ib)<<m|(cb=ya&Ib))<<6|(bb=xa&63)])){Ia===ma&&Ja===la&&K<=Jb&&(y.fa=ab,y.X=bb,y.ga=cb,y.Da=0>M|G<<1,Jb=K);if(Cc){--N;1===G?6===N?N=25:13===N?N=4:1===N&&0<da&&(N=2):1===N&&(N=24);const Ob=Sb[N<<8|(16*(1===G?ya:xa)&15)<<4|16*(1===G?wa:(0<M?wa-ya:ya-wa)+65536)&15];if(0===Ob>>>24)continue;va=Ob&16777215}else va=kb[N];Mb=K;Ka=(0===G?.8:2===G?.6:0<M?.4:1)+(bb!==Ac||ab!==yc||cb!==zc?0:.2);break}}ka[ca]=(va&255)*Ka;ka[++ca]=(va>>8&255)*Ka;ka[++ca]=(va>>16)*Ka;ca+=2}}$a&&!Fb&&(ka[ca=U*ma+la<<
2]+=128,ka[++ca]+=128,ka[++ca]+=128);l.putImageData(t,0,0);$a&&Fb&&(t=Ca(.05*Eb),l.fillRect(la-t,ma-1,t<<1,2),l.fillRect(la-1,ma-t,2,t-1),l.fillRect(la-1,ma+1,2,t-1))}g.gb=ba.Ha?"Minicraft 0.9.6 "+L(g.hb).toString().padStart(2,"\u00a0")+" fps, T: "+L(24*I.Oa).toString().padStart(2,"0")+":"+L(24*I.Oa%1*60).toString().padStart(2,"0")+"; "+(I.A&&500>k%1E3?"":I.time)+"\nR: "+U+"x"+Z+" (x"+ua.V+"), D: "+ua.da+", C: "+I.oa+"/"+I.Ga.length+", M: "+(64*S(1<<4+I.L)>>10)+"k\nE: 0/0 M: "+y.u+"\n\nPosition: "+
y.H.toFixed(2)+" "+y.J.toFixed(2)+" "+y.K.toFixed(2)+"\nAngle: "+(y.N*Ba).toFixed(2)+" "+(y.ea*Ba).toFixed(2)+"\nBlock: "+(0>y.X?0:y.fa+" "+y.X+" "+y.ga+" "+lb[y.Da]+": "+xb(I,y.fa,y.X,y.ga))+"\nChunk abs: "+(L(y.H)>>4)+" "+(L(y.K)>>4)+" "+(L(y.J)>>4)+" rel: "+I.Ia+" "+I.Ka+" "+I.Ja:""}}f.$=k},[k]);oa();return[H("canvas",{R:E(g=>{f.B=Wb(f,g)})}),f.pa&&2!==f.l&&F(oc,{U:f.U,la:k}),f.B&&f.Ha&&H("div[className=diagnostics]",{innerText:f.B.gb}),f.qa&&F(vc,{o:f,Ya:f.Ya}),f.pa&&3!==f.l&&2!==f.j.u&&F(kc,
{j:f.j,la:k}),3===f.l&&F(mc,{o:f,la:k}),1===f.l&&F(pc,{actions:b,g:c,o:f,Aa:h}),2===f.l&&F(rc,{o:f,U:f.U})]}function Fc({I:a,ub:b,vb:c,wb:d}){A("div",{F:{selected:a===c},onclick:()=>{d(a.id)}});c=`${a.local?"L":"_"}${a.local&&a.remote?a.local>a.remote?">":a.local<a.remote?"<":"=":"_"}${a.remote?"R":"_"}`;b===a.id&&(c=`[${c}]`);return[H("span",{innerText:`${c} ${a.label}`,title:a.account_name?"User: "+a.account_name:"Just a local world"}),H("span",{innerText:hb(Math.max(a.local,a.remote))})]}
function Gc({account:a,actions:b,g:c,Aa:d}){A("div[className=menu]");const [e,h,k]=pa(0),n=E(()=>{h(k()+1)}),f=E({value:null}),g=ia(()=>aa(function*(){try{const q=!f.value&&!e,m=yield fetch("/api/minicraft/"+`world?what=${q?"initial":"meta_all"}`);if(!m.ok)throw Error("Connection error.");const x=yield m.json();if(!q)return x;if("0.9.6"!==x.version_latest)return location.reload(),null;ea();b.nb(x.account);return x.worlds}catch(q){return alert("Error while loading world list: "+q.message),[]}}()),
[e],null),l=ja(()=>{g&&(f.value=g);const q=[];f.value&&q.push(...f.value.map(m=>({account_name:m.account_name,hash:m.hash,id:m.id,label:m.label,local:0,remote:m.modified,writable:m.writable})));for(const m of c.worlds){const x=q.find(B=>B.id===m.id);if(x){const B=x.local=m.mod_l,C=x.remote,z=m.mod_r;B>z&&C>z&&(confirm('Conflict! The world "'+m.label+'" was modified here and somewhere else.\nOK: Take variant from server ('+hb(C)+") | Cancel: Keep local variant ("+hb(B)+")")?b.W(m.id,{mod_l:x.local=
z}):b.W(m.id,{mod_r:x.remote=z}))}else 1<m.mod_r&&g&&g.length&&(alert('The world "'+m.label+'" was not found on the server, so it is a local world now.'),b.W(m.id,{mod_r:0})),q.push({account_name:"",hash:0,id:m.id,label:m.label,local:m.mod_l,remote:1===m.mod_r?1:0,writable:!0})}return q.sort((m,x)=>Math.max(x.local,x.remote)-Math.max(m.local,m.remote))},[g,c.worlds]),[t,w,v]=pa(c.Ba),p=ja(()=>l.find(q=>q.id===t)||null,[t,l]),u=ja(()=>{let q,m;return null!=(m=null==l?void 0:null==(q=l.find(x=>0<x.local&&
0<x.remote&&x.local!==x.remote))?void 0:q.id)?m:null},[l]);D(()=>{if(null!==u){var q=!1,m=l.find(B=>B.id===u),x=`minicraft.world.${u}:`;if(m.local<m.remote)fetch("/static/minicraft/worlds/"+`${m.hash}.json`).then(B=>B.json()).then(B=>{if(!q){for(const [C,z]of Za(B))Sa(x+C,z);Sa("__margin",Array(4097).join("x"));Ta("__margin");b.W(u,{mod_l:m.remote,mod_r:m.remote})}}).catch(B=>{if(!q)if("QuotaExceededError"===B.name){alert("Insufficient storage!");for(const C of Ya(P))C.startsWith(x)&&Ta(C);b.mb(u)}else alert("Error while downloading world: "+
B.message)});else{if(!m.writable){b.W(u,{mod_l:c.worlds.find(z=>z.id===u).mod_r});return}const B=x.length;let C=u;(1===m.remote?fetch("/api/minicraft/world",{method:"POST",headers:{"Content-Type":"application/json"},body:Qa({what:"meta",label:m.label})}).then(z=>{if(!z.ok)throw Error(403===z.status?"Missing permission. Logged in?":"Connection error.");return z.json()}).then(z=>{C=z.id}):Promise.resolve()).then(()=>{if(q)throw null;const z={};for(const V of Ya(P))V.startsWith(x)&&(z[V.substr(B)]=P.getItem(V));
return fetch("/api/minicraft/world",{method:"POST",headers:{"Content-Type":"application/json"},body:Qa({what:"data",world:C,data:z})})}).then(z=>{if(!z.ok)throw Error(403===z.status?"Missing permission. Logged in?":"Connection error.");return z.json()}).then(z=>{ea();if(C===u)b.W(u,{mod_l:z.modified,mod_r:z.modified});else{const V=`minicraft.world.${C}:`;for(const R of Ya(P))if(R.startsWith(x)){const W=P.getItem(R);Ta(R);Sa(V+R.substr(B),W)}b.mb(u);b.$a({id:C,label:m.label,mod_l:z.modified,mod_r:z.modified});
q||v()!==u||w(C)}q||n();fa()}).catch(z=>{q||(alert("Error while uploading world: "+z.message),ea(),b.W(u,{mod_r:0}),fa())})}return()=>{q=!0}}},[u]);return[H("h1[innerText=Worlds]"),H("button[innerText=Refresh][style=position:absolute;left:0;top:0;height:2rem][title=Reload list]",{disabled:!g,onclick:n}),H("button[style=position:absolute;right:0;top:0;height:2rem]",{disabled:0<a.rank,innerText:a.rank?a.label:"Login",onclick:()=>{location.href="/account?redir=minicraft"}}),H("div[className=worlds]",
null,[qa(Fc,l,{xb:e,ub:u,vb:p,wb:w})]),H("center",null,[H("button[innerText=Enter]",{disabled:!p||!p.local||p.remote>p.local,onclick:()=>{ea();b.Va({Ba:p.id});d(1);fa()},title:p?p.local?p.remote>p.local?"The world is still loading!":"Enter selected world":"The world is not downloaded yet!":"No world selected!"}),H("button",{disabled:!g||!p||0<p.local&&0<p.remote||!p.remote&&!a.rank,innerText:p&&!p.local?"Download":g&&p&&!p.remote?"Upload":"Transfer",onclick:()=>{p.local?p.remote||b.W(p.id,{mod_r:1}):
b.$a({id:p.id,label:p.label,mod_l:1,mod_r:p.remote})},title:g?p?p.local?p.remote?"The world is present on both sides!":a.rank?"Upload world to server":"Not logged in!":"Download world from server":"No world selected!":"List is loading!"})]),H("hr"),H("center",null,[H("button[innerText=New world]",{onclick:()=>{const q=prompt("New world's label:\n(max. 16 characters)","New world");q&&(16<q.length?alert("Name is too long!"):b.$a({id:Math.min(0,...c.worlds.map(m=>m.id))-1,label:q,mod_l:Date.now(),mod_r:0}))}}),
H("button[innerText=Project page]",{onclick:()=>{open("//github.com/L3P3/minicraft")}})]),H("center",null,[H("small[innerText=Version 0.9.6 by L3P3]")])]}function Hc({account:a,actions:b,g:c,Za:d}){const [e,h]=pa(0),k=A("div[className=game]");return[0===e&&F(Gc,{account:a,actions:b,g:c,Aa:h}),1===e&&F(wc,{account:a,actions:b,g:c,frame:k,Za:d,Aa:h})]}
r.init(()=>{const [a,b]=na(ib),c=E({o:null});D(()=>{let e=!1;onbeforeunload=onunload=onpagehide=onblur=()=>{e||(e=!0,c.o&&$b(c.o),b.Ta())};onpageshow=onfocus=()=>{e=!1};setInterval(()=>{b.Ta()},500)});const d=E(e=>{if("INPUT"===e.target.tagName||!c.o)return!0;c.o.qa=!1;X(c.o,e.keyCode,"keydown"===e.type);e.preventDefault();return!1});return[{onkeydown:d,onkeyup:d,oncontextmenu:gb,ondragstart:gb},[F(Hc,{account:a.account,actions:b,g:a.g,Za:c})]]});