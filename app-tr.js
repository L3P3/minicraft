function ba(a){function b(d){return a.next(d)}function c(d){return a.throw(d)}return new Promise(function(d,e){function h(l){l.done?d(l.value):Promise.resolve(l.value).then(b,c).then(h,e)}h(a.next())})}
const p=lui,ca=p.defer,da=p.defer_end,ha=p.dom_define,ia=p.hook_async,B=p.hook_dom,D=p.hook_effect,ja=p.hook_memo,ka=p.hook_model,qa=p.hook_rerender,ra=p.hook_state,F=p.hook_static,H=p.node,I=p.node_dom,ua=p.node_map,va=p.now,wa=window,xa=document,J=Math,Aa=J.PI,Ba=.5*Aa,Ca=180/Aa,K=J.floor,Da=J.ceil,Ea=J.round,L=J.min,Fa=J.max,Ga=J.cos,Ha=J.sin,Ia=J.sqrt,Ja=J.log2,Ka=String.fromCharCode,La=Date,Qa=JSON,Ra=Promise,Sa=Qa.stringify,Ta=Qa.parse,M=localStorage,Ua=M.setItem.bind(M),Va=M.removeItem.bind(M),
Wa=wa.indexedDB,Xa=Uint8Array,Ya=Uint32Array,Za=Map,R=Number,bb=Object,cb=bb.keys,db=bb.entries,eb=setTimeout,fb=setInterval,gb=clearTimeout,hb=clearInterval,ib=addEventListener,jb=removeEventListener,kb=a=>a*a,rb=()=>!1,sb=(a,b)=>{const c=new La;a=new La(a);var d=c-a;if(59E3>d)return Ea(d/1E3)+"s";if(3E6>d)return Ea(d/6E4)+"m";d=a.getFullYear();const e=a.getMonth(),h=a.getDate();let l="";d<c.getFullYear()&&(l=d+"/");if(l||e<c.getMonth())l+=e+1+"/";if(l||h<c.getDate())l+=h;if(b)return l||"bug\u00fcn";
l&&(l+="/");b=l+a.getHours()+":";a=a.getMinutes();a=K(a).toString().padStart(2,"0");return b+a};let V=M.getItem("minicraft.config");if((V=V&&Ta(V))&&V.worlds&&V.version.startsWith("0.9.")){const a=new Set(V.worlds.map(b=>"minicraft.world."+b.id));for(const b of cb(M))b.startsWith("minicraft.world.")&&!a.has(b.split(":")[0])&&Va(b)}
const tb={init:()=>{let a=!1;var b={ha:!0,ia:!1,ta:1,qa:3,V:4,za:120,ca:64,Ba:0,worlds:[]};if(V){let c=V.flag_textures;null!=c&&(b.ha=c);null!=(c=V.pixel_grouping)&&(b.ta=c);null!=(c=V.mouse_sensitivity)&&(b.qa=c);b.V=V.resolution_scaling;b.za=V.view_angle;b.ca=V.view_distance;null!=(c=V.world_last)&&(b.Ba=c);null!=(c=V.worlds)?b.worlds=c:M.getItem("minicraft.world.0:meta")&&(b.worlds[0]={id:0,label:(prompt("Bilinmeyen d\u00fcnya bulundu. Nas\u0131l adland\u0131r\u0131ls\u0131n?","")||"Bilinmeyen d\u00fcnya").substring(0,
16),mod_l:Date.now(),mod_r:0},a=!0);V=null}b={account:{label:"",rank:0},config:b,Wa:b};return a?(b.Wa=null,tb.Va(b)):b},Va:a=>{const b=a.config;if(b===a.Wa)return a;Ua("minicraft.config",Sa({version:"0.10.0",flag_textures:b.ha,pixel_grouping:b.ta,mouse_sensitivity:b.qa,resolution_scaling:b.V,view_angle:b.za,view_distance:b.ca,world_last:b.Ba,worlds:b.worlds}));return Object.assign({},a,{Wa:b})},rb:(a,b)=>Object.assign({},a,{account:b}),tb:(a,b)=>tb.Ha(a,b(a.config)),Ha:(a,b)=>Object.assign({},a,{config:Object.assign({},
a.config,b)}),Ia:(a,b)=>a.config.ia===b?a:tb.Ha(a,{ia:b}),bb:(a,b)=>Object.assign({},a,{config:Object.assign({},a.config,{worlds:[...a.config.worlds,b]})}),cb:(a,b)=>Object.assign({},a,{config:Object.assign({},a.config,{worlds:a.config.worlds.filter(c=>c.id!==b)})}),O:(a,b,c)=>Object.assign({},a,{config:Object.assign({},a.config,{worlds:a.config.worlds.map(d=>d.id===b?Object.assign({},d,c):d)})})},ub="air stone grass dirt cobble planks bedrock log leaves bricks wool sand gravel glass bookshelf obsidian stone_bricks sandstone lapis_block iron_block gold_block diamond_block emerald_block redstone_block quartz_block".split(" "),
vb="Hava;Ta\u015f;\u00c7imen;Toprak;Parke Ta\u015f\u0131;Kalas;Katman Kayas\u0131;K\u00fct\u00fck;Yapraklar;Tu\u011flalar;Y\u00fcn;Kum;\u00c7ak\u0131l;Cam;Kitapl\u0131k;Obsidyen;Lapis Lazuli;Ta\u015f Tu\u011flalar;Kumta\u015f\u0131;Lapis Lazuli Blo\u011fu;Demir Blok;Alt\u0131n Blok;Elmas Blok;Z\u00fcmr\u00fct Blok;K\u0131z\u0131lta\u015f Blok;Kuvars Blok".split(";"),wb=[0,8487297,4305266,4349313,8092539,5342114,7039851,3561583,4172910,6384533,15526888,10671324,8092798,16447200,4151672,1970708,8092539,
9686227,9126695,15198183,5567485,14541182,7920469,662956,14936813],xb="WEBTSN".split(""),yb=(a,b=1,c=null)=>({amount:b,data:c,id:a}),zb=(a,b,c=a.content.amount)=>{if(b.content)a.content.id===b.content.id?(c=L(c,b.P-b.content.amount),a.content.amount-=c,b.content.amount+=c,0>=a.content.amount&&(a.content=null)):!(a.content.amount<=c&&a.content.amount<=b.P&&b.content.amount<=a.P)||a.filter&&!a.filter(b.content.id)||b.filter&&!b.filter(a.content.id)||([b.content,a.content]=[a.content,b.content]);else if(!b.filter||
b.filter(a.content.id))a.content.amount<=c&&a.content.amount<=b.P?[b.content,a.content]=[a.content,b.content]:(c=L(c,b.P),a.content.amount-=c,b.content=yb(a.content.id,c),0>=a.content.amount&&(a.content=null))},Ab=(a,b)=>{for(const c of a)if(c.content&&c.content.id===b.id){const d=L(b.amount,c.P-c.content.amount);c.content.amount+=d;if(0>=(b.amount-=d))return null}for(const c of a)if(!c.content&&(!c.filter||c.filter(b.id)))if(a=L(b.amount,c.P),a<=b.amount){if(c.content=yb(b.id,a),0>=(b.amount-=a))return null}else return c.content=
b,null;return b},Bb=(a,b)=>({Sa:0,eb:0,Ta:0,N:0,da:0,Da:0,ea:0,W:-1,fa:0,ma:null,na:null,l:1,mb:20,A:Array(36).fill(null).map(()=>({content:null,filter:null,P:64})),Na:0,name:b.label||"Oyuncu",B:a.wa,G:a.xa,H:a.ya,pb:0,qb:0,K:0,ka:0,$:0,aa:0,ba:0}),Cb=(a,b,c)=>{a.N=(a.N+b+100*Aa)%(2*Aa);a.da=Fa(-Ba,L(Ba,a.da+c))},Db=a=>{a+=32;33<a&&39>a?a++:38<a&&44>a?a+=2:43<a&&127>a?a+=3:126<a&&55258>a?a+=37:55295<a&&(a+=8485);return Ka(a)},Eb=a=>a-(63743<a?8517:159<a?69:46<a&&130>a?35:40<a&&46>a?34:34<a&&40>a?
33:32),Gb=()=>{var a=Fb;const b=a.length,c=new Za,d=x=>{m=m<<1|x&1;15===++v&&(g+=Db(m),m=v=0)},e=()=>{for(let x=0;x<q;++x)d(0)},h=x=>{d(x);d(x>>1);d(x>>2);d(x>>3);d(x>>4);d(x>>5);d(x>>6);d(x>>7)},l=()=>{0===--z&&(z=1<<q++)},n=()=>{if(C)C=!1;else{let x=u.id;for(let G=0;G<q;G++)d(x>>G)}};let f=a[0],g="",m=0,v=2,q=2,z=2,k=2,u={id:k++,Fa:new Za},C=!0;h(f);c.set(f,u);for(let x=1;x<b;++x){const G=u.Fa.get(f=a[x]);G?u=G:(n(),c.has(f)||(l(),e(),h(f),c.set(f,{id:k++,Fa:new Za}),C=!0),u.Fa.set(f,{id:k++,Fa:new Za}),
u=c.get(f),l())}n();c.has(f)||(l(),e(),h(f));l();d(1);--q;e();return g+=Db(m<<15-v)},Hb=a=>{var b=Fb;if(!a)return null;const c=a.length,d=()=>{v+=(k>>--u&1)<<q++;0===u&&(u=15,k=Eb(a.charCodeAt(z++)))};let e=[0,1],h=1,l=3,n=2,f=null;var g=null;let m=0,v=0;g=2;let q=0,z=0,k=Eb(a.charCodeAt(z++)),u=15;for(;q<g;)d();if(1===v)return null;for(v=q=0;8>q;)d();f=[v];e[2]=f;for(b[m++]=v;z<=c;){g=n;for(v=q=0;q<g;)d();if(0===v){for(v=q=0;8>q;)d();e[l]=[v];v=l++;0===--h&&(h=1<<n++)}else if(1===v)return b;g=v<
e.length?e[v]:f.concat(f[0]);for(let C=0;C<g.length;C++)b[m++]=g[C];e[l++]=f.concat(g[0]);f=g;0===--h&&(h=1<<n++)}return null};let W=null;
if(Wa){let a,b;null==(a=navigator.storage)||null==(b=a.persist)||b.call(a);const c=Wa.open("minicraft",1);c.onupgradeneeded=d=>{d=d.target.result.createObjectStore("chunks",{keyPath:["world","coords"]});for(const e of cb(M))if(e.startsWith("minicraft.world.")){const [h,l]=e.substr(16).split(":");"meta"!==l&&(d.add({world:R(h),coords:l,data:M.getItem(e)}),Va(e))}};c.onsuccess=d=>{W=d.target.result}}
const Ib=(a,b)=>ba(function*(){if(!W)return M.getItem(`minicraft.world.${a}:${b}`);const c=W.transaction("chunks","readonly").objectStore("chunks").get([a,b]);return new Ra(d=>{c.onsuccess=()=>{let e;d(null==(e=c.result)?void 0:e.data)}})}()),Jb=(a,b)=>{var c=Gb();return ba(function*(){if(!W)return Ua(`minicraft.world.${a}:${b}`,c);const d=W.transaction("chunks","readwrite").objectStore("chunks").put({world:a,coords:b,data:c});return new Ra((e,h)=>{d.onsuccess=()=>{e()};d.onerror=()=>{h(d.error)}})}())},
Kb=(a,b)=>ba(function*(){if(!W)return Va(`minicraft.world.${a}:${b}`);const c=W.transaction("chunks","readwrite").objectStore("chunks").delete([a,b]);return new Ra(d=>{c.onsuccess=()=>{d()}})}()),Lb=a=>ba(function*(){const b=`minicraft.world.${a}:`;if(!W){const e={},h=b.length;for(const l of cb(M))l.startsWith(b)&&(e[l.substr(h)]=M.getItem(l));return e}const c=W.transaction("chunks","readonly").objectStore("chunks").openCursor(),d={meta:M.getItem(b+"meta")};return new Ra(e=>{c.onsuccess=()=>{const h=
c.result;h?(h.value.world===a&&(d[h.value.coords]=h.value.data),h.continue()):e(d)}})}()),Mb=(a,b)=>ba(function*(){if(W){var c=W.transaction("chunks","readwrite"),d=c.objectStore("chunks");for(const [e,h]of db(b))"meta"!==e?d.put({world:a,coords:e,data:h}):Ua(`minicraft.world.${a}:meta`,h);return new Ra((e,h)=>{c.oncomplete=()=>{e()};c.onerror=()=>{h(c.error)}})}for(const [e,h]of db(b))Ua(`minicraft.world.${a}:${e}`,h);Ua("__margin",Array(257).join("x"));Va("__margin")}()),Nb=a=>{if(W){Va(`minicraft.world.${a}:meta`);
var b=W.transaction("chunks","readwrite").objectStore("chunks").openCursor();b.onsuccess=()=>{const c=b.result;c&&(c.value.world===a&&c.delete(),c.continue())}}else{const c=`minicraft.world.${a}:`;for(const d of cb(M))d.startsWith(c)&&Va(d)}},Ob=(a,b)=>{if(W){Ua(`minicraft.world.${b}:meta`,M.getItem(`minicraft.world.${a}:meta`));Va(`minicraft.world.${a}:meta`);var c=W.transaction("chunks","readwrite").objectStore("chunks"),d=c.openCursor();d.onsuccess=()=>{const e=d.result;e&&(e.value.world===a&&
(e.value.world=b,c.put(e.value)),e.continue())}}else{const e=`minicraft.world.${a}:`,h=e.length,l=`minicraft.world.${b}:`;for(const n of cb(M))if(n.startsWith(e)){const f=M.getItem(n);Va(n);Ua(l+n.substr(h),f)}}},Pb=new Ya(1024),Fb=new Xa(Pb.buffer),Qb=new Za,Rb=(a,b,c,d)=>0>c||63<c?0:a.X[(b<<a.J+4|d)<<6|c],Sb=(a,b,c,d)=>{const e=a.J;a.X[(b<<e+4|d)<<6|c]=0;a.Y[(b>>4<<e|d>>4)<<2|c>>4].ga=!0},Tb=(a,b,c,d,e)=>{const h=a.J,l=(b<<h+4|d)<<6|c;if(0<a.X[l])return!1;a.X[l]=e;return a.Y[(b>>4<<h|d>>4)<<2|c>>
4].ga=!0},hc=(a,b,c)=>{const d=Fa(L(b.G,63),0)>>4,e=K(b.B)>>4;b=K(b.H)>>4;if(c||a.La!==d||a.ra+a.Ka!==e||a.sa+a.Ma!==b)c=1<<a.J,a.La=d,a.ra=e-(a.Ka=(65536+e)%c),a.sa=b-(a.Ma=(65536+b)%c),Ub(a);a.busy||Vb(a,!1)},Ub=a=>{const b=a.Ka,c=a.La,d=a.Ma,e=a.J,h=`${e} ${b} ${d} ${c}`;let l=Qb.get(h);if(null==l){const n=1<<e,f=kb(.5*n);Qb.set(h,l=a.Y.map(({x:g,y:m,z:v},q)=>{let z=kb(g-b),k=kb(v-d),u=kb(g-b-n),C=0,x=0;u<z&&(z=u,C=-n);(u=kb(g-b+n))<z&&(z=u,C=n);(u=kb(v-d-n))<k&&(k=u,x=-n);(u=kb(v-d+n))<k&&(k=
u,x=n);return{Xa:z+k+kb(m-c),hb:q,ra:C,sa:x}}).filter(({Xa:g})=>g<=f).sort((g,m)=>g.Xa-m.Xa))}a.Ga=l;a.oa=0},jc=(a,b)=>{const c=b.A.map(({content:d})=>d&&[d.id,d.amount,d.data]);for(;0<c.length&&null===c[c.length-1];)c.pop();Ua(`minicraft.world.${a.id}:meta`,Sa({p:{h:b.mb,i:c,m:b.l,p:[b.B,b.G,b.H,b.N,b.da]},s:[a.wa,a.xa,a.ya],v:1}));Ra.all(a.Y.filter(d=>d.ga).map(d=>ic(a,d)))},kc=(a,b)=>{const c=M.getItem(`minicraft.world.${a.id}:meta`);if(c){const {p:d,s:e,v:h}=Ta(c);null!=h&&(d.i.forEach((l,n)=>
{l&&(b.A[n].content=yb(l[0],l[1],l[2]))}),b.mb=d.h,b.l=d.m,b.B=d.p[0],b.G=d.p[1],b.H=d.p[2],b.N=d.p[3],b.da=d.p[4],a.wa=e[0],a.xa=e[1],a.ya=e[2])}},lc=a=>ba(function*(){const b=a.Y[a.Ga[a.oa=0].hb];var c=b.y;yield Kb(a.id,`${b.Ca}/${b.Ra}`+(0<c?"/"+c:""));b.ga=!1;++b.Ca;return Vb(a,!1)}()),ic=(a,b)=>{const c=a.Ea;var d=a.J;const e=b.y,h=(256<<d)-256;for(let l=0,n=-1,f=((b.x<<d+4|b.z)<<6|e)<<2;16>l;++l){for(d=0;16>d;++d)Pb[++n]=c[f],Pb[++n]=c[++f],Pb[++n]=c[++f],Pb[++n]=c[++f],f+=13;f+=h}b.ga=!1;return Jb(a.id,
`${b.Ca}/${b.Ra}`+(0<e?"/"+e:""))},Vb=(a,b)=>ba(function*(){const c=a.Y,d=a.Ga,e=a.ra,h=a.sa,l=d.length;for(;a.oa<l;){var n=d[a.oa++],f=c[n.hb],g=f.loaded,m=f.x;const k=f.y;var v=f.z,q=e+n.ra+m;const u=h+n.sa+v;if(!g||q!==f.Ca||u!==f.Ra){f.loaded=a.busy=!0;n=f.ga&&ic(a,f);var z=a.id;q=f.Ca=q;f=f.Ra=u;f=Hb(yield Ib(z,`${q}/${f}`+(0<k?"/"+k:"")));yield n;a.busy=!1;if(g||0===k||f){n=a.Ea;q=a.J;z=(256<<q)-256;m=((m<<q+4|v)<<6|k)<<2;if(f)for(let C=0,x=-1;16>C;++C){for(g=0;16>g;++g)n[m]=Pb[++x],n[++m]=
Pb[++x],n[++m]=Pb[++x],n[++m]=Pb[++x],m+=13;m+=z}else for(v=0;16>v;++v){for(f=0;16>f;++f)n[m]=0<k?0:50397446,n[++m]=0<k?0:131843,g?(n[++m]=0,n[++m]=0,m+=13):m+=15;m+=z}if(!b)break}}}}());let mc=null,nc=null,oc=new Image;oc.crossOrigin="anonymous";
oc.onload=()=>{const a=xa.createElement("canvas");a.width=16;a.height=416;const b=a.getContext("2d");b.drawImage(oc,0,0);ha("tile","div[className=bitmap]",{S:{backgroundImage:`url(${a.toDataURL()})`}});mc=new Ya(b.getImageData(0,0,16,416).data.buffer);nc&&nc();oc=nc=null};oc.src=ASSETS+"blocks.webp";
const qc=(a,b)=>{const c={sb:b,Ua:b.getContext("2d",{alpha:!1,desynchronized:!0}),fb:null,gb:null,kb:"",T:!1,lb:0,Ya:0,ub:fb(()=>(c.lb=c.Ya,c.Ya=0),1E3),o:a};mc||(nc=()=>c.T=!0);pc(c);return c},pc=a=>{const b=a.sb,c=a.o;a.gb=new Ya((a.fb=a.Ua.createImageData(b.width=c.ua,b.height=c.va)).data.buffer);const d=c.ua*c.config.V/c.ja,e=c.va*c.config.V/c.ja;b.style.width=d+"px";b.style.height=e+"px";b.style.left=Ea((c.Oa-d)/2)+"px";b.style.top=Ea((c.Pa-e)/2)+"px";a.Ua.fillStyle="rgba(255,255,255,.5)"};
let rc=0;
const uc=(a,b,c,d)=>{const e={X:null,Ea:null,busy:!1,Y:null,Ga:null,oa:0,L:!0,Ka:0,La:0,Ma:0,id:c.Ba,ra:0,sa:0,J:0,wa:.5,xa:8.5,ya:.5,time:0,Qa:0},h=Bb(e,d);kc(e,h);a={actions:a,config:c,ib:0,jb:0,Ja:!1,pa:!0,vb:b,Z:0,U:new Set,Za:"",j:0,M:[],g:h,$a:null,u:null,ja:1,Oa:1,Pa:1,ua:0,va:0,xb:fb(()=>{e.L||(e.time=(e.time+1)%24E3,e.Qa=1/24E3*(e.Qa+6E3)%1,hc(e,h,!1))},50),world:e};sc(a,null);tc(a);return a},vc=a=>{jc(a.world,a.g);a.actions.O(a.world.id,{mod_l:Date.now()})},wc=a=>{a.j=0;a.world.L=!1;tc(a)},
tc=a=>{ba(function*(){if(!a.config.ia)try{yield a.vb.requestPointerLock()}catch(b){}}())},xc=(a,b)=>a===b?0:.1-.2*a,yc=a=>{a.g.Sa=xc((a=a.U).has(-12)||a.has(65),a.has(-13)||a.has(68))},zc=a=>{a.g.eb=xc((a=a.U).has(-15)||a.has(16),a.has(-14)||a.has(32))},Ac=a=>{a.g.Ta=xc((a=a.U).has(-11)||a.has(83),a.has(-10)||a.has(87))},Bc=a=>{a.g.pb=xc(a.U.has(-18),a.U.has(-19))},Cc=a=>{a.g.qb=xc(a.U.has(-17),a.U.has(-16))},Ec=(a,b,c)=>{if(!a.world)return!1;const d=a.U;var e=a.g;if(c){if(d.has(b))return!1;d.add(b);
var h=e.ea,l=e.W;c=e.fa;switch(b){case -18:case -19:Bc(a);break;case -17:case -16:Cc(a);break;case -1:2!==e.l&&0<=l&&(0===e.Na?0===e.l&&(b=Rb(a.world,h,l,c),2===b?b=3:1===b&&(b=4),6===b||8!==b&&13!==b&&null!==Ab(e.A,yb(b,1)))||(Sb(a.world,h,l,c),e.W=-1):Dc(a,[h,l,c],!1));break;case -2:case 71:if(0<=l){const n=Rb(a.world,h,l,c);c=e.A.slice(0,9);l=c.findIndex(f=>null!==f.content&&f.content.id===n);0<=l?e.K=l:1===e.l&&(c[e.K].content&&(c=c.findIndex(f=>null===f.content),0<=c&&(e.K=c)),e.A[e.K].content=
yb(n));e.ka=a.Z}break;case -3:if(2!==e.l&&0<=l)if(0===e.Na){if(b=e.A[e.K],b.content){switch(e.Da){case 0:--h;break;case 1:++h;break;case 2:--l;break;case 3:++l;break;case 4:--c;break;default:++c}0<=l&&64>l&&Tb(a.world,h&(1<<4+a.world.J)-1,l,c&(1<<4+a.world.J)-1,b.content.id)&&1!==e.l&&0>=--b.content.amount&&(b.content=null)}}else Dc(a,[h,l,c],!0);break;case -4:e.K=(e.K+9-1)%9;e.ka=a.Z;break;case -5:e.K=(e.K+1)%9;e.ka=a.Z;break;case 27:0===a.j&&(a.world.L=!0,a.j=1);break;case -15:case -14:case 16:case 32:zc(a);
break;case 49:case 50:case 51:case 52:case 53:case 54:case 55:case 56:case 57:e.K=b-49;e.ka=a.Z;break;case -12:case -13:case 65:case 68:yc(a);break;case 69:if(0===a.j){a.j=3;for(const n of d)Ec(a,n,!1)}break;case 80:a.world&&(a.world.L=!0);break;case 81:e=e.A[e.K];if(d.has(17)||e.content&&0>=--e.content.amount)e.content=null;break;case -11:case -10:case 83:case 87:Ac(a);break;case 84:if(0===a.j){a.j=2;for(const n of d)Ec(a,n,!1)}break;case 112:a.pa=!a.pa;break;case 114:a.Ja=!a.Ja;case 116:case 122:case 123:break;
default:return!1}}else{if(!d.delete(b))return!1;switch(b){case -15:case -14:case 16:case 32:zc(a);break;case -12:case -13:case 65:case 68:yc(a);break;case -11:case -10:case 83:case 87:Ac(a);break;case -18:case -19:Bc(a);break;case -17:case -16:Cc(a)}}a.Za=[...d].join();return!0},Fc=(a,b)=>(b=b.startsWith("~")?a+R(b.substr(1)):R(b),isNaN(b)?a:b),Hc=(a,b)=>{const c=a.g;var d=a.world;if(b)if("/"===b.charAt(0)){b=b.substr(1).split(" ");const e=b.shift();switch(e){case "clear":a.M=[];break;case "clearinv":for(const h of c.A)h.content=
null;X(a,"Envanter temizlendi.",!0);break;case "gamemode":case "gm":b=R(b[0]);!isNaN(b)&&0<=b&&3>b&&0===b%1?(c.l=b,X(a,"Oyun modu ayarland\u0131: "+b,!0)):X(a,"Oyun modu 0..2 aras\u0131nda olmal\u0131d\u0131r!");break;case "give":if(0===b.length){X(a,"/give <id> [Miktar]\n"+ub.join(" "));break}d=ub.indexOf((b[0]||"").toLowerCase());d=0<=d?d:R(b[0]);b=R(b[1]||1);!isNaN(d)&&0<d&&25>d&&0===d%1?!isNaN(b)&&0<b&&0===b%1?X(a,Ab(c.A,yb(d,b))?"Envanter dolu!":`${"Verilen e\u015fyalar: "} ${b} ${vb[d]}`,!0):
X(a,"Miktar en az 1 olmal\u0131d\u0131r!"):X(a,"Ge\u00e7ersiz blok tipi!");break;case "help":X(a,"Komutlar: clear, clearinv, gamemode, give, help, load, me, save, spawn, teleport, version");break;case "load":Vb(d,!0).then(()=>{a.u.T=!0;X(a,"Par\u00e7alar y\u00fcklendi.",!0)});break;case "me":X(a,c.name+" "+b.join(" "),!0);break;case "save":vc(a);X(a,"Oyun kaydedildi.",!0);break;case "spawn":d.wa=c.B;d.xa=c.G;d.ya=c.H;X(a,"Spawn g\u00fcncellendi.",!0);break;case "teleport":case "tp":0===b.length?(c.B=
d.wa,c.G=d.xa,c.H=d.ya,a.u.T=!0,X(a,"Spawn'a \u0131\u015f\u0131nland\u0131.",!0)):3===b.length?(X(a,"\u015euraya \u0131\u015f\u0131nland\u0131: "+` ${c.B=Fc(c.B,b[0])} ${c.G=Fc(c.G,b[1])} ${c.H=Fc(c.H,b[2])}`,!0),a.u.T=!0):X(a,"Kahretsin!");c.$=0;c.aa=0;c.ba=0;break;case "version":X(a,"Minicraft 0.10.0");break;case "/exit":c.Na=0;X(a,"Normal fare modu.",!0);break;case "/expand":a.g.ma&&a.g.na?d=!0:(X(a,"Se\u00e7im gerekli!"),d=!1);d&&("vert"===b[0]?(c.ma[1]=0,c.na[1]=63,X(a,"Se\u00e7imi geni\u015flet",
!0)):X(a,'Sadece "vert" desteklenir!'));break;case "/pos1":case "/pos2":Dc(a,[K(c.B),K(c.G),K(c.H)],"/pos2"===e);break;case "/regen":lc(d).then(()=>{a.u.T=!0;X(a,"Par\u00e7a yenilendi.",!0)});break;case "/show":X(a,`${"Birinci"}: ${c.ma?c.ma.join(" "):"hi\u00e7birini se\u00e7me"}, ${"\u0130kinci"}: ${c.na?c.na.join(" "):"hi\u00e7birini se\u00e7me"}`);break;case "/wand":c.Na=1;X(a,"Fareyi kullanarak se\u00e7in.",!0);break;default:X(a,"Bilinmeyen komut: "+e)}}else{const e=X(a,`<${c.name}> `+b);sc(a,
b).then(h=>{h&&Gc(a,e)})}},X=(a,b,c=!1)=>{const d=++rc;(a.M=a.M.slice(-49)).push({id:d,ob:c,time:va(),value:b});return d},Gc=(a,b)=>{const c=a.M.findIndex(d=>d.id===b);0<=c&&a.M.splice(c,1)},Dc=(a,b,c)=>{c?a.g.na=b:a.g.ma=b;X(a,`${c?"\u0130kince se\u00e7im noktas\u0131":"Birinci se\u00e7im noktas\u0131"}: ${b.join(" ")}`,!0)},sc=(a,b)=>(gb(a.$a),(b?fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:Sa({msg:b})}):fetch("/api/chat")).then(c=>{if(c.ok)return c.text()}).then(c=>
{if(c){c=c.split("\n").filter(Boolean);for(const d of c)d.startsWith("<")&&X(a,d);return 0<c.length}return!1}).catch(()=>!1).then(c=>{a.$a=eb(()=>{sc(a,null)},5E3);return c})),Ic=({id:a})=>(B("#tile",{S:{backgroundPositionY:`-${2*(a-1)}rem`}}),null);function Jc({amount:a,l:b,id:c}){B("div[className=stack]",{title:vb[c]+(1===b?` (${ub[c]}, ${c})`:"")});return[H(Ic,{id:c}),1!==a&&I("div[className=amount]",{innerText:a})]}
function Kc({g:a,la:b}){B("div[className=bar]",{ontouchstart:F(d=>{a.K=Number(d.target.closest("[data-slot]").dataset.slot);a.ka=d.timeStamp}),S:{opacity:Fa(.5,L(1,1-5E-4*(b-a.ka-5E3)))}});const c=a.l;return mc&&a.A.slice(0,9).map(({content:d},e)=>I("div",{D:{slot:e},F:{active:e===a.K}},[d&&H(Jc,{amount:d.amount,data:d.data,l:c,id:d.id})]))}
function Lc({wb:a}){B("div[className=grid]",{onclick:({target:b})=>{(b=b.closest("[data-id]"))&&zb({content:yb(R(b.dataset.id)),filter:null,P:64},a)}});return ub.map((b,c)=>0<c&&I("div",{D:{id:c}},[H(Jc,{amount:1,data:null,l:1,id:c})]))}
function Mc({o:a}){const b=ja(()=>({content:null,filter:null,P:64})),c=a.g.l;B("div[className=menu overlay inventory]",ja(()=>({onclick:({target:d})=>{if("menu overlay inventory"===d.className)b.content?b.content=null:wc(a);else if(d=d.closest("[data-slot]"))d=a.g.A[R(d.dataset.slot)],b.content?zb(b,d):d.content&&zb(d,b)},oncontextmenu:({target:d})=>{if("menu overlay inventory"===d.className)b.content?0>=--b.content.amount&&(b.content=null):wc(a);else if(d=d.closest("[data-slot]"))d=a.g.A[R(d.dataset.slot)],
b.content?zb(b,d,1):d.content&&zb(d,b,Da(d.content.amount/2))}})));return mc&&[I("div[className=window]",null,[I("h2[innerText=Envanter]"),1===c&&H(Lc,{wb:b}),I("div[className=grid]",null,a.g.A.map(({content:d},e)=>I("div",{D:{slot:e},F:{first:9>e}},[d&&H(Jc,{amount:d.amount,data:d.data,l:c,id:d.id})])))]),b.content&&I("div[className=hand]",{S:{transform:`translate(${a.ib}px, ${a.jb}px)`}},[H(Jc,{amount:b.content.amount,data:b.content.data,l:0,id:b.content.id})])]}
const Nc=({I:{ob:a,time:b,value:c},la:d})=>(B(a?"div[className=minor]":"div",{innerText:c,S:{opacity:L(1,1-.001*(d-b-4500))}}),null);function Oc({M:a,la:b}){B("div[className=messages]");const c=b-5E3;return[ua(Nc,a.slice(-10).filter(d=>d.time>c),{la:b})]}
function Pc({actions:{tb:a,Ha:b},config:c,o:d,Aa:e}){D(()=>vc(d));B("div[className=menu overlay]");return[I("h1[innerText=Ayarlar]"),F(I("center",null,[I("button[innerText=Oyuna geri d\u00f6n]",{onclick:()=>{wc(d)}})])),I("div[className=settings]",null,[I("button",{innerText:"Y\u00fczeyler:\n"+(c.ha?"Dokulu":"Sade"),onclick:F(()=>a(h=>({ha:!h.ha})))}),I("label[innerText=\u00c7\u00f6z\u00fcn\u00fcrl\u00fck:]",null,[I("input[type=range][min=1][max=100][step=1]",{value:101-c.V,onchange:F(h=>b({V:101-
Number(h.target.value)}))})]),I("label[innerText=G\u00f6r\u00fc\u015f a\u00e7\u0131s\u0131:]",null,[I("input[type=range][min=1][max=180][step=1]",{value:c.za,onchange:F(h=>b({za:Number(h.target.value)}))})]),I("label[innerText=G\u00f6r\u00fc\u015f mesafesi:]",null,[I("input[type=range][min=1][max=128][step=1]",{value:c.ca,onchange:F(h=>b({ca:Number(h.target.value)}))})]),I("label[innerText=Piksel gruplamas\u0131:]",null,[I("input[type=range][min=1][max=6][step=1]",{value:c.ta,onchange:F(h=>b({ta:Number(h.target.value)}))})]),
I("label[innerText=Fare hassasiyeti:]",null,[I("input[type=range][min=1][max=15][step=1]",{value:c.qa,onchange:F(h=>b({qa:Number(h.target.value)}))})])]),F(I("center",null,[I("button[innerText=D\u00fcnyadan ayr\u0131l]",{onclick:()=>{e(0)}})]))]}const Qc=({I:{ob:a,value:b}})=>(B(a?"div[className=minor]":"div",{innerText:b}),null);
function Rc({o:a,M:b}){const c=F({history:null,input:null});B("div[className=menu overlay terminal]",{onclick:d=>{d.target!==c.input&&c.input.focus()}});D(d=>{d&&eb(()=>c.history.scrollTop=1E9,0)},[b.length&&b[b.length-1].id]);return[F(I("div[className=toolbar]",null,[I("button[innerText=\u274c]",{onclick:()=>{wc(a)}})])),I("div[className=history]",{R:F(d=>{c.history=d})},[ua(Qc,b)]),F(I("input[enterkeyhint=send][mozactionhint=send][name=message][required]",{onkeydown:d=>{const e=d.keyCode;d=d.target;
13===e?(Hc(a,d.value),d.value=""):27===e&&wc(a)},R:d=>{c.input=d;eb(()=>d.focus(),0)}}))]}const Sc=[["pick",-2],["up",-14],["down",-15],["E",69],["T",84],["F1",112],["F3",114],["...",27]],Tc=[["up",-10],["down",-11],["left",-12],["right",-13],["center",-1]],Uc=[["up",-16],["down",-17],["left",-18],["right",-19],["center",-3]];
function Vc({o:a}){const b=a.U,c=([d,e])=>I("div",{D:{code:e},F:{button:!0,[d]:!0,active:b.has(e)}});B("div[className=touch]",F({ontouchstart:d=>{let {code:e}=d.target.dataset;if(null!=e&&Ec(a,e=R(e),!0)){const h=d.changedTouches[0].identifier,l=n=>{n.changedTouches[0].identifier===h&&(jb("touchend",l),Ec(a,e,!1))};ib("touchend",l)}return!1}}));return[I("div[className=top]",null,Sc.map(([d,e])=>I(`div[innerText=${d}]`,{D:{code:e},F:{button:!0,active:b.has(e)}}))),I("div[className=move]",null,Tc.map(c)),
I("div[className=move sec]",null,Uc.map(c))]}
function Wc({account:a,actions:b,config:c,frame:d,ab:e,Aa:h}){const l=va(),n=xa.pointerLockElement===d,f=ja(()=>e.o=uc(b,d,c,a));D(()=>{const g=q=>{if(0!==f.j)return!0;xa.pointerLockElement===d?Ec(f,-1-q.button,"mousedown"===q.type):tc(f);return!1},m=q=>{if(0!==f.j||xa.pointerLockElement===d)if(f.world.L)f.ib=q.clientX,f.jb=q.clientY;else{const z=f.config.qa*Aa/(Fa(f.Oa,f.Pa)*f.ja);Cb(f.g,q.movementX*z,-q.movementY*z)}},v=q=>{b.Ia(!1);if(0===f.j&&!f.world.L&&5<Math.abs(q.deltaY))return q=0<q.deltaY?
-5:-4,Ec(f,q,!0),Ec(f,q,!1),!1};d.addEventListener("mousedown",g);d.addEventListener("mouseup",g);d.addEventListener("mousemove",m);d.addEventListener("wheel",v);return()=>{d.removeEventListener("mousedown",g);d.removeEventListener("mouseup",g);d.removeEventListener("mousemove",m);d.removeEventListener("wheel",v);gb(f.$a);hb(f.xb);jc(f.world,f.g);hb(f.u.ub);e.o=null}});D(()=>{f.config=c;f.u&&(f.u.T=!0);const g=f.world;var m=Da(Ja(f.config.ca/16*2+2));if(g.J!==m){var v=f.g;g.Y&&jc(g,v);const q=1<<
(g.J=m),z=g.Y=[];for(let k=0;k<q;++k)for(let u=0;u<q;++u)for(let C=0;4>C;++C)z.push({ga:!1,loaded:!1,x:k,y:C,z:u,Ca:0,Ra:0});m=q<<m+12+2;null===g.X||g.X.length<m?g.Ea=new Ya((g.X=new Xa(m)).buffer):g.Ea.fill(0);hc(g,v,!0)}},[c]);D((g,m,v)=>{f.ja=v;f.Oa=Fa(1,g);f.Pa=Fa(1,m);m=f.config.V;g=Da(f.Oa*f.ja/m);m=Da(f.Pa*f.ja/m);if(g!==f.ua||m!==f.va)f.ua=g,f.va=m,f.u&&(f.u.T=!0,pc(f.u))},[d.offsetWidth,d.offsetHeight,wa.devicePixelRatio||1,c.V]);D(g=>{g||f.world.L||0!==f.j||(f.j=1);f.world.L=!g},[c.ia&&
0===f.j||n]);D(g=>n&&g&&xa.exitPointerLock(),[f.world.L||0!==f.j]);D(()=>{if(f.world){if(f.Z&&!f.world.L){var g=f.g,m=L(5,.01*(l-f.Z));g.$-=.1*g.$*m;g.aa-=.1*g.aa*m;g.ba-=.1*g.ba*m;g.$+=(Ga(g.N)*g.Sa+Ha(g.N)*g.Ta)*m;g.aa+=g.eb*m;g.ba+=(-Ha(g.N)*g.Sa+Ga(g.N)*g.Ta)*m;Cb(g,g.pb*m*1.5,g.qb*m*1.5);g.B+=g.$*m;g.G+=g.aa*m;g.H+=g.ba*m}if(f.u){g=f.u;++g.Ya;m=g.Ua;var v=g.fb;const ea=g.gb,sa=g.o,ya=sa.config,lb=sa.pa,y=sa.g,N=sa.ua,la=sa.va,O=sa.world;if(!O.L||g.T){g.T=!1;var q=ya.ta;const Xc=ya.ca;var z=y.N,
k=y.da;const Yc=y.ea,Zc=y.fa;var u=y.B,C=y.G,x=y.H;const $c=lb?y.W:-1,ad=O.X;var G=O.J;const bd=ya.ha&&null!==mc;var P=1/N,t=1/la;const fa=N>>1,ma=la>>1,Wb=L(N,la),Xb=32<Wb,Yb=Ga(z);z=Ha(z);const Zb=Ga(-k);k=Ha(-k);var r=ya.za/45;const cd=P*(N<la?r*N*t:r);P=t*(la<N?r*la*P:r);u+=65536;C+=65536;x+=65536;t=u%1;r=C%1;const dd=x%1;G=4+G;const $b=(1<<G)-1;q=q<N?q:1;const ed=N-q;let ac=1===y.l?6:4,mb=y.ea=y.fa=y.Da=0,bc=0;y.W=-1;for(let Ma=0;Ma<la;++Ma){var w=(ma-Ma)*P;const cc=w*Zb-k;var A=w*k+Zb;w=A*z;
A*=Yb;let na=0,za=!1;var oa=!1;a:for(let Y=0;Y<N;Y+=q)for(let Z=oa?1:0;Z<q;++Z){if(2>q)var E=Y;else if(0===Y)E=0===Z?0:1===Z?q:Z-1,za=1===Z;else if(Y<ed)E=(za=1===Z)?Y+q:Y+Z-1;else{if((E=0===Z?Y-1:Y+Z)>=N)break a;za=!1}var S=(E-fa)*cd;oa=w+Yb*S;const dc=A-z*S,fd=bc;S=16757124;let $a=1,ec=Xc;for(let nb=0;3>nb;++nb){const T=(fd+nb)%3;let aa=dc;var Q=dd;0===T&&(aa=oa,Q=t);1===T&&(aa=cc,Q=r);var pa=-1/aa;0<aa&&(Q=1-Q,pa*=-1);const ab=oa*pa,ta=cc*pa;pa*=dc;const fc=Ia(ab*ab+ta*ta+pa*pa);let Na=u+ab*Q-
(0===T&0>aa|0),Oa=C+ta*Q-(1===T&0>aa|0),Pa=x+pa*Q-(2===T&0>aa|0);Q*=fc;for(let ob,pb,qb,U;Q<ec;Na+=ab,Oa+=ta,Pa+=pa,Q+=fc)if(65536>Oa){if(0>ta)break}else if(65600<=Oa){if(0<ta)break}else if(0!==(U=ad[((ob=Na&$b)<<G|(qb=Pa&$b))<<6|(pb=Oa&63)])){Ma===ma&&E===fa&&Q<=ac&&(y.ea=ob,y.W=pb,y.fa=qb,y.Da=0>aa|T<<1,ac=Q);if(bd){--U;1===T?6===U?U=25:13===U?U=4:1===U&&0<ta&&(U=2):1===U&&(U=24);const gc=mc[U<<8|(16*(1===T?Pa:Oa)&15)<<4|16*(1===T?Na:(0<aa?Na-Pa:Pa-Na)+65536)&15];if(0===gc>>>24)continue;S=gc&16777215}else S=
wb[U];ec=Q;$a=(0===T?.8:2===T?.6:0<aa?.4:1)+(pb!==$c||ob!==Yc||qb!==Zc?0:.2);bc=T;break}}S=4278190080|L((S>>16)*$a,255)<<16|L((S>>8&255)*$a,255)<<8|L((S&255)*$a,255);if(oa=(za=za&&(Ma!==ma||E<fa||E>fa+q))&&na===S){E=mb+Y+1;ea[E]=na;ea[++E]=na;if(3>q)break;ea[++E]=na;if(4>q)break;ea[++E]=na;if(5>q)break;ea[++E]=na;if(6>q)break;ea[++E]=na;break}if(za||0===E)na=S;ea[mb+E]=S}mb+=N}lb&&!Xb&&(ea[N*ma+fa]^=16777215);m.putImageData(v,0,0);lb&&Xb&&(v=L(Da(.05*Wb),8),m.fillRect(fa-v,ma-1,v<<1,2),m.fillRect(fa-
1,ma-v,2,v-1),m.fillRect(fa-1,ma+1,2,v-1))}g.kb=sa.Ja?"Minicraft 0.10.0 "+K(g.lb).toString().padStart(2,"\u00a0")+" fps, T: "+K(24*O.Qa).toString().padStart(2,"0")+":"+K(24*O.Qa%1*60).toString().padStart(2,"0")+"; "+(O.L&&500>l%1E3?"":O.time)+"\nR: "+N+"x"+la+" (x"+ya.V+"), D: "+ya.ca+", C: "+O.oa+"/"+O.Ga.length+", M: "+(64*kb(1<<4+O.J)>>10)+"k\nE: 0/0 M: "+y.l+"\n\nPosition: "+y.B.toFixed(2)+" "+y.G.toFixed(2)+" "+y.H.toFixed(2)+"\nAngle: "+(y.N*Ca).toFixed(2)+" "+(y.da*Ca).toFixed(2)+"\nBlock: "+
(0>y.W?0:y.ea+" "+y.W+" "+y.fa+" "+xb[y.Da]+": "+Rb(O,y.ea,y.W,y.fa))+"\nChunk abs: "+(K(y.B)>>4)+" "+(K(y.H)>>4)+" "+(K(y.G)>>4)+" rel: "+O.Ka+" "+O.Ma+" "+O.La:""}}f.Z=l},[l]);qa();return[I("canvas",{R:F(g=>{f.u=qc(f,g)})}),f.pa&&2!==f.j&&H(Oc,{M:f.M,la:l}),f.u&&f.Ja&&I("div[className=diagnostics]",{innerText:f.u.kb}),c.ia&&H(Vc,{o:f,Za:f.Za}),f.pa&&3!==f.j&&2!==f.g.l&&H(Kc,{g:f.g,la:l}),3===f.j&&H(Mc,{o:f,la:l}),1===f.j&&H(Pc,{actions:b,config:c,o:f,Aa:h}),2===f.j&&H(Rc,{o:f,M:f.M})]}
function gd({I:a,yb:b,zb:c,Ab:d}){B("div",{F:{selected:a===c},onclick:()=>{d(a.id)}});c=`${a.local?"L":"_"}${a.local&&a.remote?a.local>a.remote?">":a.local<a.remote?"<":"=":"_"}${a.remote?a.public?"R":"r":"_"}`;b===a.id&&(c=`[${c}]`);return[I("span",{innerText:`${c} ${a.label}`,title:a.account_name?"Sahip: "+a.account_name:"Sadece yerel"}),I("span",{innerText:sb(Math.max(a.local,a.remote),!0)})]}
function hd({account:a,actions:b,config:c,Aa:d}){B("div[className=menu]");const [e,h,l]=ra(0),n=F(()=>{h(l()+1)}),f=F({value:null}),g=ia(()=>ba(function*(){try{const t=!f.value&&!e,r=yield fetch("/api/minicraft/"+`world?what=${t?"initial":"meta_all"}`);if(!r.ok)throw Error("Ba\u011flant\u0131 hatas\u0131.");const w=yield r.json();if(!t)return w;if("0.10.0"!==w.version_latest)return location.reload(!0),null;ca();b.rb(w.account);return w.worlds}catch(t){return alert("D\u00fcnya listesini y\u00fcklemede hata olu\u015ftu: "+
t.message),[]}}()),[e],null),m=ja(()=>{g&&(f.value=g);const t=[];f.value&&t.push(...f.value.map(r=>({account_name:r.account_name,hash:r.hash,id:r.id,label:r.label,local:0,public:r.public,remote:r.modified,writable:r.writable})));for(const r of c.worlds){const w=t.find(A=>A.id===r.id);if(w){const A=w.local=r.mod_l,oa=w.remote,E=r.mod_r;A>E&&oa>E&&(confirm('\u00c7ak\u0131\u015fma! "'+r.label+'" isimli d\u00fcnya burada ve ba\u015fka bir yerde de\u011fi\u015ftirildi.\nOK: Sunucudaki versiyonu al ('+
sb(oa,!1)+") | \u0130ptal: Yerel versiyonu sakla ("+sb(A,!1)+")")?b.O(r.id,{mod_l:w.local=E}):b.O(r.id,{mod_r:w.remote=E}))}else 1<r.mod_r&&g&&g.length&&(alert('"'+r.label+'" isimli d\u00fcnya sunucuda bulunamad\u0131, bu y\u00fczden art\u0131k yerel bir d\u00fcnya.'),b.O(r.id,{mod_r:0})),t.push({account_name:"",hash:0,id:r.id,label:r.label,local:r.mod_l,public:!1,remote:1===r.mod_r?1:0,writable:!0})}return t.sort((r,w)=>Math.max(w.local,w.remote)-Math.max(r.local,r.remote))},[g,c.worlds]),[v,q,z]=
ra(c.Ba),k=ja(()=>m.find(t=>t.id===v)||null,[v,m]),u=ja(()=>{let t,r;return null!=(r=null==m?void 0:null==(t=m.find(w=>0<w.local&&0<w.remote&&w.local!==w.remote))?void 0:t.id)?r:null},[m]);D(()=>{if(null!==u){var t=!1,r=m.find(w=>w.id===u);if(r.local<r.remote)fetch("/static/minicraft/worlds/"+`${r.hash}.json`).then(w=>w.json()).then(w=>{if(!t)return Mb(u,w).then(()=>{b.O(u,{mod_l:r.remote,mod_r:r.remote})})}).catch(w=>{t||("QuotaExceededError"===w.name?(alert("Yetersiz depolama alan\u0131!"),b.cb(u),
Nb(u)):alert("D\u00fcnyay\u0131 indirirken hata olu\u015ftu: "+w.message))});else{if(!r.writable){b.O(u,{mod_l:c.worlds.find(A=>A.id===u).mod_r});return}let w=u;(1===r.remote?fetch("/api/minicraft/world",{method:"POST",headers:{"Content-Type":"application/json"},body:Sa({what:"meta",label:r.label})}).then(A=>{if(!A.ok)throw Error(403===A.status?"\u0130zniniz yok. Giri\u015f yapt\u0131n\u0131z m\u0131?":"Ba\u011flant\u0131 hatas\u0131.");return A.json()}).then(A=>{w=A.id}):Ra.resolve()).then(()=>{if(t)throw null;
return Lb(u)}).then(A=>{if(t)throw null;return fetch("/api/minicraft/world",{method:"POST",headers:{"Content-Type":"application/json"},body:Sa({what:"data",world:w,data:A})})}).then(A=>{if(!A.ok)throw Error(403===A.status?"\u0130zniniz yok. Giri\u015f yapt\u0131n\u0131z m\u0131?":"Ba\u011flant\u0131 hatas\u0131.");return A.json()}).then(A=>{ca();w===u?b.O(u,{mod_l:A.modified,mod_r:A.modified}):(Ob(u,w),b.cb(u),b.bb({id:w,label:r.label,mod_l:A.modified,mod_r:A.modified}),t||z()!==u||q(w));t||n();da()}).catch(A=>
{t||(alert("D\u00fcnyay\u0131 y\u00fcklerken hata olu\u015ftu: "+A.message),ca(),b.O(u,{mod_r:0}),da())})}return()=>{t=!0}}},[u]);const [C,x]=ra(!1);k||x(!1);const [G,P]=ra(!1);return[I("h1[innerText=D\u00fcnyalar]"),I("button[innerText=Yenile][style=position:absolute;left:0;top:0;height:2rem][title=Listeyi yenile]",{disabled:!g,onclick:n}),I("button[style=position:absolute;right:0;top:0;height:2rem]",{disabled:0<a.rank,innerText:a.rank?a.label:"Giri\u015f yap",onclick:()=>{location.href="/account?redir=minicraft"}}),
I("div[className=worlds]",null,[ua(gd,m,{Bb:e,yb:u,zb:k,Ab:q})]),I("center",null,[I("button[innerText=A\u00e7]",{disabled:!k||!k.local||k.remote>k.local,onclick:()=>{ca();b.Ha({Ba:k.id});d(1);da()},title:k?k.local?k.remote>k.local?"D\u00fcnya hala y\u00fckleniyor!":"Se\u00e7ili d\u00fcnyaya kat\u0131l":"D\u00fcnya hen\u00fcz indirilmedi!":"Hi\u00e7bir d\u00fcnya se\u00e7ilmedi!"}),I("button[innerText=D\u00fcnya...]",{disabled:!k||C,onclick:()=>{x(!0)},title:k?"D\u00fcnya ayarlar\u0131n\u0131 g\u00f6ster":
"Hi\u00e7bir d\u00fcnya se\u00e7ilmedi!"})]),I("hr"),I("center",null,[I("button[innerText=Yeni d\u00fcnya]",{onclick:()=>{const t=prompt("Yeni d\u00fcnya'n\u0131n ad\u0131:\n(maks. 16 karakter)","Yeni d\u00fcnya");t&&(16<t.length?alert("\u0130sim \u00e7ok uzun!"):b.bb({id:Math.min(0,...c.worlds.map(r=>r.id))-1,label:t,mod_l:Date.now(),mod_r:0}))}}),I("button[innerText=Proje sayfas\u0131]",{onclick:()=>{open("//github.com/L3P3/minicraft")}})]),I("center",null,[I("small[innerText=L3P3 taraf\u0131ndan 0.10.0 s\u00fcr\u00fcm\u00fc]")]),
C&&k&&I("div",{F:{"menu overlay advanced":!0,busy:G},onclick:t=>{"menu overlay advanced"===t.target.className&&x(!1)}},[I("div[className=window]",null,[I("h2",{innerText:'"'+k.label+'"',title:k.id}),I("table",null,[!!k.account_name&&I("tr",null,[I("td[innerText=Sahip:]"),I("td",{innerText:k.account_name})]),I("tr",null,[I("td[innerText=De\u011fi\u015ftirildi:]"),I("td",{innerText:sb(Math.max(k.local,k.remote),!1)})])]),I("center",null,[I("button[innerText=Yeniden adland\u0131r]",{disabled:G||!k.writable,
onclick:()=>{const t=prompt("D\u00fcnya'n\u0131n yeni ad\u0131:\n(maks. 16 karakter)",k.label);!t||t===k.label||16<t.length||(k.local&&b.O(k.id,{label:t}),k.remote&&(P(!0),fetch("/api/minicraft/world",{method:"POST",headers:{"Content-Type":"application/json"},body:Sa({what:"meta",world:k.id,label:t})}).then(r=>{if(!r.ok)throw Error(403===r.status?"\u0130zniniz yok. Giri\u015f yapt\u0131n\u0131z m\u0131?":"Ba\u011flant\u0131 hatas\u0131.");return r.json()}).catch(r=>{alert("D\u00fcnyay\u0131 d\u00fczenlerken hata olu\u015ftu: "+
r.message)}).then(()=>{P(!1)})))},title:k.writable?"D\u00fcnyay\u0131 de\u011fi\u015ftir":"\u0130zniniz yok!"}),I("button",{disabled:G||!k.local&&!k.writable,innerText:k.local?"Sil (yerel)":"Sil",onclick:()=>{confirm('"'+k.label+'" isimli d\u00fcnya ger\u00e7ekten silinsin mi?')&&(k.local?(b.cb(k.id),Nb(k.id)):(P(!0),fetch("/api/minicraft/world",{method:"DELETE",headers:{"Content-Type":"application/json"},body:Sa({what:"world",world:k.id})}).then(t=>{if(!t.ok)throw Error(403===t.status?"\u0130zniniz yok. Giri\u015f yapt\u0131n\u0131z m\u0131?":
"Ba\u011flant\u0131 hatas\u0131.");ca();q(null);x(!1);n();P(!1);da();return t.json()}).catch(t=>{alert("D\u00fcnyay\u0131 silerken hata olu\u015ftu: "+t.message);P(!1)})))},title:k.local||k.writable?"D\u00fcnyayl\u0131 sil":"\u0130zniniz yok!"})]),I("center",null,[I("button",{disabled:G||!k.remote||!k.writable,innerText:`${"Genel"}: ${k.public?"Evet":"Hay\u0131r"}`,onclick:()=>{P(!0);fetch("/api/minicraft/world",{method:"POST",headers:{"Content-Type":"application/json"},body:Sa({what:"meta",world:k.id,
public:!k.public})}).then(t=>{if(!t.ok)throw Error(403===t.status?"\u0130zniniz yok. Giri\u015f yapt\u0131n\u0131z m\u0131?":"Ba\u011flant\u0131 hatas\u0131.");ca();n();P(!1);da();return t.json()}).catch(t=>{alert("D\u00fcnyay\u0131 d\u00fczenlerken hata olu\u015ftu: "+t.message);P(!1)})},title:k.remote?k.writable?k.public?"D\u00fcnyay\u0131 yay\u0131ndan kald\u0131r":"D\u00fcnyay\u0131 yay\u0131nla":"\u0130zniniz yok!":"D\u00fcnya hen\u00fcz y\u00fcklenmedi!"}),I("button",{disabled:G||!g||0<k.local&&
0<k.remote||!k.remote&&!a.rank,innerText:k.local?g&&k&&!k.remote?"Y\u00fckle":"Transfer":"\u0130ndir",onclick:()=>{k.local?k.remote||b.O(k.id,{mod_r:1}):b.bb({id:k.id,label:k.label,mod_l:1,mod_r:k.remote})},title:g?k.local?k.remote?"D\u00fcnya hem cihaz\u0131n\u0131zda hem de sunucuda mevcut!":a.rank?"D\u00fcnyay\u0131 sunucuya y\u00fckle":"Giri\u015f yap\u0131lmam\u0131\u015f!":"D\u00fcnyay\u0131 sunucudan indir":"Liste y\u00fckleniyor!"})])])])]}
function id({account:a,actions:b,config:c,ab:d}){const [e,h]=ra(0),l=B("div[className=game]");return[0===e&&H(hd,{account:a,actions:b,config:c,Aa:h}),1===e&&H(Wc,{account:a,actions:b,config:c,frame:l,ab:d,Aa:h})]}
p.init(()=>{const [a,b]=ka(tb),c=F({o:null,nb:0});D(()=>{let n=!1;onbeforeunload=onunload=onpagehide=onblur=()=>{n||(n=!0,c.o&&vc(c.o),b.Va())};onpageshow=onfocus=()=>{n=!1};setInterval(b.Va,500);ib("touchend",f=>{c.nb=f.timeStamp},!0)});const d=F(n=>{if("INPUT"===n.target.tagName||!c.o)return!0;b.Ia(!1);Ec(c.o,n.keyCode,"keydown"===n.type);return!1}),e=F(()=>{b.Ia(!0)}),h=F(n=>{999<n.timeStamp-c.nb&&b.Ia(!1)}),l=a.config.ia;D(()=>{l?(ib("mousedown",h,!0),ib("mouseup",h,!0),jb("touchstart",e,!0)):
(jb("mousedown",h,!0),jb("mouseup",h,!0),ib("touchstart",e,!0))},[l]);return[{onkeydown:d,onkeyup:d,oncontextmenu:rb,ondragstart:rb},[H(id,{account:a.account,actions:b,config:a.config,ab:c})]]});
