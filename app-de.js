function ea(a){function b(d){return a.next(d)}function c(d){return a.throw(d)}return new Promise(function(d,e){function k(l){l.done?d(l.value):Promise.resolve(l.value).then(b,c).then(k,e)}k(a.next())})}
const n=lui,fa=n.defer,ha=n.defer_end,ia=n.hook_async,B=n.hook_dom,D=n.hook_effect,la=n.hook_memo,ma=n.hook_model,na=n.hook_rerender,oa=n.hook_state,E=n.hook_static,ta=n.init,F=n.node,G=n.node_dom,ua=n.node_map,xa=n.now,ya=window,za=document,Ca=navigator,J=Math,Da=J.PI,Ea=.5*Da,Fa=180/Da,K=J.floor,Ga=J.ceil,Ha=J.round,L=J.min,M=J.max,Ia=J.cos,Ja=J.sin,Ka=J.sqrt,La=J.log2,Ma=String.fromCharCode,Na=BroadcastChannel,Ta=Date,Ua=JSON,Va=Promise,Wa=Ua.stringify,Xa=Ua.parse,R=localStorage,Ya=R.setItem.bind(R),
Za=R.removeItem.bind(R),$a=ya.indexedDB,S=fetch,ab=Uint8Array,bb=Uint32Array,cb=Set,fb=Map,T=Number,gb=Object,hb=gb.keys,ib=gb.entries,jb=setTimeout,kb=setInterval,lb=clearTimeout,mb=clearInterval,nb=addEventListener,ob=removeEventListener,pb=Ca.userAgent.includes("WebKit"),qb=a=>a*a,rb=()=>!1,sb=(a,b)=>{const c=new Ta;a=new Ta(a);var d=c-a;if(59E3>d)return Ha(d/1E3)+"s";if(3E6>d)return Ha(d/6E4)+"m";d=a.getFullYear();const e=a.getMonth(),k=a.getDate();let l="";d<c.getFullYear()&&(l=d+"/");if(l||
e<c.getMonth())l+=e+1+"/";if(l||k<c.getDate())l+=k;if(b)return l||"heute";l&&(l+="/");b=l+a.getHours()+":";a=a.getMinutes();a=K(a).toString().padStart(2,"0");return b+a};let X=R.getItem("minicraft.config");if((X=X&&Xa(X))&&X.worlds&&X.version.startsWith("0.9.")){const a=new cb(X.worlds.map(b=>"minicraft.world."+b.id));for(const b of hb(R))b.startsWith("minicraft.world.")&&!a.has(b.split(":")[0])&&Za(b)}
const tb={init:()=>{let a=!1;var b={ka:!1,wa:1,ta:3,X:4,T:1,Ca:120,ea:64,Da:0,worlds:[]};if(X){let c=X.pixel_grouping;null!=c&&(b.wa=c);null!=(c=X.mouse_sensitivity)&&(b.ta=c);b.X=X.resolution_scaling;null!=(c=X.textures)?b.T=c:b.T=X.flag_textures?1:0;b.Ca=X.view_angle;b.ea=X.view_distance;null!=(c=X.world_last)&&(b.Da=c);null!=(c=X.worlds)?b.worlds=c:R.getItem("minicraft.world.0:meta")&&(b.worlds[0]={id:0,label:(prompt("Es wurde eine namenlose lokale Welt gefunden. Wie soll sie hei\u00dfen?","")||
"Unbekannte Welt").substring(0,16),mod_l:Ta.now(),mod_r:0},a=!0);X=null}b={account:{label:"",rank:0},config:b,Za:b};return a?(b.Za=null,tb.Ya(b)):b},Ya:a=>{const b=a.config;if(b===a.Za)return a;Ya("minicraft.config",Wa({version:"0.11.1",pixel_grouping:b.wa,mouse_sensitivity:b.ta,resolution_scaling:b.X,textures:b.T,view_angle:b.Ca,view_distance:b.ea,world_last:b.Da,worlds:b.worlds}));return Object.assign({},a,{Za:b})},wb:(a,b)=>Object.assign({},a,{account:b}),Fb:(a,b)=>tb.ia(a,b(a.config)),ia:(a,b)=>
Object.assign({},a,{config:Object.assign({},a.config,b)}),Ja:(a,b)=>a.config.ka===b?a:tb.ia(a,{ka:b}),gb:(a,b)=>Object.assign({},a,{config:Object.assign({},a.config,{worlds:[...a.config.worlds,b]})}),hb:(a,b)=>Object.assign({},a,{config:Object.assign({},a.config,{worlds:a.config.worlds.filter(c=>c.id!==b)})}),U:(a,b,c)=>Object.assign({},a,{config:Object.assign({},a.config,{worlds:a.config.worlds.map(d=>d.id===b?Object.assign({},d,c):d)})})},Ab="air stone grass dirt cobble planks bedrock log leaves bricks wool sand gravel glass bookshelf obsidian stone_bricks sandstone lapis_block iron_block gold_block diamond_block emerald_block redstone_block quartz_block".split(" "),
Bb="Luft Stein Grasblock Erde Bruchstein Holzbretter Grundgestein Stamm Laub Ziegelsteine Wolle Sand Kies Glas B\u00fccherregal Obsidian Steinziegel Sandstein Lapislazuliblock Eisenblock Goldblock Diamantblock Smaragdblock Redstoneblock Quarzblock".split(" "),Cb=[0,8487297,4305266,4349313,8092539,5342114,7039851,3561583,4172910,6384533,15526888,10671324,8092798,16447200,4151672,1970708,8092539,9686227,9126695,15198183,5567485,14541182,7920469,662956,14936813],Db="WEBTSN".split(""),Eb=(a,b=1,c=null)=>
({amount:b,data:c,id:a}),Fb=(a,b,c=a.c.amount)=>{if(b.c)a.c.id===b.c.id?(c=L(c,b.V-b.c.amount),a.c.amount-=c,b.c.amount+=c,0>=a.c.amount&&(a.c=null)):!(a.c.amount<=c&&a.c.amount<=b.V&&b.c.amount<=a.V)||a.filter&&!a.filter(b.c.id)||b.filter&&!b.filter(a.c.id)||([b.c,a.c]=[a.c,b.c]);else if(!b.filter||b.filter(a.c.id))a.c.amount<=c&&a.c.amount<=b.V?[b.c,a.c]=[a.c,b.c]:(c=L(c,b.V),a.c.amount-=c,b.c=Eb(a.c.id,c),0>=a.c.amount&&(a.c=null))},Gb=(a,b)=>{for(const c of a)if(c.c&&c.c.id===b.id){const d=L(b.amount,
c.V-c.c.amount);c.c.amount+=d;if(0>=(b.amount-=d))return null}for(const c of a)if(!c.c&&(!c.filter||c.filter(b.id)))if(a=L(b.amount,c.V),a<=b.amount){if(c.c=Eb(b.id,a),0>=(b.amount-=a))return null}else return c.c=b,null;return b},Hb=(a,b)=>({Va:0,ib:0,Wa:0,O:0,fa:0,Fa:0,ga:0,Y:-1,ha:0,pa:null,qa:null,l:1,qb:20,A:Array(36).fill(null).map(()=>({c:null,filter:null,V:64})),Oa:0,name:b.label||"Spieler",B:a.za,G:a.Aa,H:a.Ba,ub:0,vb:0,K:0,ma:0,ba:0,ca:0,da:0}),Ib=(a,b,c)=>{a.O=(a.O+b+100*Da)%(2*Da);a.fa=
M(-Ea,L(Ea,a.fa+c))},Jb=a=>{a+=32;33<a&&39>a?a++:38<a&&44>a?a+=2:43<a&&127>a?a+=3:126<a&&55258>a?a+=37:55295<a&&(a+=8485);return Ma(a)},Kb=a=>a-(63743<a?8517:159<a?69:46<a&&130>a?35:40<a&&46>a?34:34<a&&40>a?33:32),Mb=()=>{var a=Lb;const b=a.length,c=new fb,d=w=>{g=g<<1|w&1;15===++p&&(x+=Jb(g),g=p=0)},e=()=>{for(let w=0;w<u;++w)d(0)},k=w=>{d(w);d(w>>1);d(w>>2);d(w>>3);d(w>>4);d(w>>5);d(w>>6);d(w>>7)},l=()=>{0===--v&&(v=1<<u++)},m=()=>{if(C)C=!1;else{let w=q.id;for(let H=0;H<u;H++)d(w>>H)}};let f=a[0],
x="",g=0,p=2,u=2,v=2,h=2,q={id:h++,Ha:new fb},C=!0;k(f);c.set(f,q);for(let w=1;w<b;++w){const H=q.Ha.get(f=a[w]);H?q=H:(m(),c.has(f)||(l(),e(),k(f),c.set(f,{id:h++,Ha:new fb}),C=!0),q.Ha.set(f,{id:h++,Ha:new fb}),q=c.get(f),l())}m();c.has(f)||(l(),e(),k(f));l();d(1);--u;e();return x+=Jb(g<<15-p)},Nb=a=>{var b=Lb;if(!a)return null;const c=a.length,d=()=>{p+=(h>>--q&1)<<u++;0===q&&(q=15,h=Kb(a.charCodeAt(v++)))};let e=[0,1],k=1,l=3,m=2,f=null;var x=null;let g=0,p=0;x=2;let u=0,v=0,h=Kb(a.charCodeAt(v++)),
q=15;for(;u<x;)d();if(1===p)return null;for(p=u=0;8>u;)d();f=[p];e[2]=f;for(b[g++]=p;v<=c;){x=m;for(p=u=0;u<x;)d();if(0===p){for(p=u=0;8>u;)d();e[l]=[p];p=l++;0===--k&&(k=1<<m++)}else if(1===p)return b;x=p<e.length?e[p]:f.concat(f[0]);for(let C=0;C<x.length;C++)b[g++]=x[C];e[l++]=f.concat(x[0]);f=x;0===--k&&(k=1<<m++)}return null};let Y=null;
if($a){let a,b;null==(a=Ca.storage)||null==(b=a.persist)||b.call(a);const c=$a.open("minicraft",1);c.onupgradeneeded=d=>{d=d.target.result.createObjectStore("chunks",{keyPath:["world","coords"]});for(const e of hb(R))if(e.startsWith("minicraft.world.")){const [k,l]=e.substr(16).split(":");"meta"!==l&&(d.add({world:T(k),coords:l,data:R.getItem(e)}),Za(e))}};c.onsuccess=d=>{Y=d.target.result}}
const Ob=(a,b)=>ea(function*(){if(!Y)return R.getItem(`minicraft.world.${a}:${b}`);const c=Y.transaction("chunks","readonly").objectStore("chunks").get([a,b]);return new Va(d=>{c.onsuccess=()=>{let e;d(null==(e=c.result)?void 0:e.data)}})}()),Pb=(a,b)=>{var c=Mb();return ea(function*(){if(!Y)return Ya(`minicraft.world.${a}:${b}`,c);const d=Y.transaction("chunks","readwrite").objectStore("chunks").put({world:a,coords:b,data:c});return new Va((e,k)=>{d.onsuccess=()=>{e()};d.onerror=()=>{k(d.error)}})}())},
Qb=(a,b)=>ea(function*(){if(!Y)return Za(`minicraft.world.${a}:${b}`);const c=Y.transaction("chunks","readwrite").objectStore("chunks").delete([a,b]);return new Va(d=>{c.onsuccess=()=>{d()}})}()),Rb=a=>ea(function*(){const b=`minicraft.world.${a}:`;if(!Y){const e={},k=b.length;for(const l of hb(R))l.startsWith(b)&&(e[l.substr(k)]=R.getItem(l));return e}const c=Y.transaction("chunks","readonly").objectStore("chunks").openCursor(),d={meta:R.getItem(b+"meta")};return new Va(e=>{c.onsuccess=()=>{const k=
c.result;k?(k.value.world===a&&(d[k.value.coords]=k.value.data),k.continue()):e(d)}})}()),Sb=(a,b)=>ea(function*(){if(Y){var c=Y.transaction("chunks","readwrite"),d=c.objectStore("chunks");for(const [e,k]of ib(b))"meta"!==e?d.put({world:a,coords:e,data:k}):Ya(`minicraft.world.${a}:meta`,k);return new Va((e,k)=>{c.oncomplete=()=>{e()};c.onerror=()=>{k(c.error)}})}for(const [e,k]of ib(b))Ya(`minicraft.world.${a}:${e}`,k);Ya("__margin",Array(257).join("x"));Za("__margin")}()),Tb=a=>{if(Y){Za(`minicraft.world.${a}:meta`);
var b=Y.transaction("chunks","readwrite").objectStore("chunks").openCursor();b.onsuccess=()=>{const c=b.result;c&&(c.value.world===a&&c.delete(),c.continue())}}else{const c=`minicraft.world.${a}:`;for(const d of hb(R))d.startsWith(c)&&Za(d)}},Ub=(a,b)=>{if(Y){Ya(`minicraft.world.${b}:meta`,R.getItem(`minicraft.world.${a}:meta`));Za(`minicraft.world.${a}:meta`);var c=Y.transaction("chunks","readwrite").objectStore("chunks"),d=c.openCursor();d.onsuccess=()=>{const e=d.result;e&&(e.value.world===a&&
(e.value.world=b,c.put(e.value)),e.continue())}}else{const e=`minicraft.world.${a}:`,k=e.length,l=`minicraft.world.${b}:`;for(const m of hb(R))if(m.startsWith(e)){const f=R.getItem(m);Za(m);Ya(l+m.substr(k),f)}}},Vb=new bb(1024),Lb=new ab(Vb.buffer),Wb=new fb,Xb=(a,b,c,d)=>0>c||63<c?0:a.Z[(b<<a.J+4|d)<<6|c],Yb=(a,b,c,d)=>{const e=a.J;a.Z[(b<<e+4|d)<<6|c]=0;a.$[(b>>4<<e|d>>4)<<2|c>>4].ja=!0},Zb=(a,b,c,d,e)=>{const k=a.J,l=(b<<k+4|d)<<6|c;if(0<a.Z[l])return!1;a.Z[l]=e;return a.$[(b>>4<<k|d>>4)<<2|c>>
4].ja=!0},bc=(a,b,c)=>{const d=M(L(b.G,63),0)>>4,e=K(b.B)>>4;b=K(b.H)>>4;if(c||a.Ma!==d||a.ua+a.La!==e||a.va+a.Na!==b)c=1<<a.J,a.Ma=d,a.ua=e-(a.La=(65536+e)%c),a.va=b-(a.Na=(65536+b)%c),$b(a);a.busy||ac(a,!1)},$b=a=>{const b=a.La,c=a.Ma,d=a.Na,e=a.J,k=`${e} ${b} ${d} ${c}`;let l=Wb.get(k);if(null==l){const m=1<<e,f=qb(.5*m);Wb.set(k,l=a.$.map(({x,y:g,z:p},u)=>{let v=qb(x-b),h=qb(p-d),q=qb(x-b-m),C=0,w=0;q<v&&(v=q,C=-m);(q=qb(x-b+m))<v&&(v=q,C=m);(q=qb(p-d-m))<h&&(h=q,w=-m);(q=qb(p-d+m))<h&&(h=q,w=
m);return{$a:v+h+qb(g-c),lb:u,ua:C,va:w}}).filter(({$a:x})=>x<=f).sort((x,g)=>x.$a-g.$a))}a.Ia=l;a.ra=0},dc=(a,b)=>{const c=b.A.map(({c:d})=>d&&[d.id,d.amount,d.data]);for(;0<c.length&&null===c[c.length-1];)c.pop();Ya(`minicraft.world.${a.id}:meta`,Wa({p:{h:b.qb,i:c,m:b.l,p:[b.B,b.G,b.H,b.O,b.fa]},s:[a.za,a.Aa,a.Ba],v:1}));Va.all(a.$.filter(d=>d.ja).map(d=>cc(a,d)))},ec=(a,b)=>{const c=R.getItem(`minicraft.world.${a.id}:meta`);if(c){const {p:d,s:e,v:k}=Xa(c);null!=k&&(d.i.forEach((l,m)=>{l&&(b.A[m].c=
Eb(l[0],l[1],l[2]))}),b.qb=d.h,b.l=d.m,b.B=d.p[0],b.G=d.p[1],b.H=d.p[2],b.O=d.p[3],b.fa=d.p[4],a.za=e[0],a.Aa=e[1],a.Ba=e[2])}},rc=a=>ea(function*(){const b=a.$[a.Ia[a.ra=0].lb];var c=b.y;yield Qb(a.id,`${b.Ea}/${b.Ua}`+(0<c?"/"+c:""));b.ja=!1;++b.Ea;return ac(a,!1)}()),cc=(a,b)=>{const c=a.Ga;var d=a.J;const e=b.y,k=(256<<d)-256;for(let l=0,m=-1,f=((b.x<<d+4|b.z)<<6|e)<<2;16>l;++l){for(d=0;16>d;++d)Vb[++m]=c[f],Vb[++m]=c[++f],Vb[++m]=c[++f],Vb[++m]=c[++f],f+=13;f+=k}b.ja=!1;return Pb(a.id,`${b.Ea}/${b.Ua}`+
(0<e?"/"+e:""))},ac=(a,b)=>ea(function*(){const c=a.$,d=a.Ia,e=a.ua,k=a.va,l=d.length;for(;a.ra<l;){var m=d[a.ra++],f=c[m.lb],x=f.l,g=f.x;const h=f.y;var p=f.z,u=e+m.ua+g;const q=k+m.va+p;if(!x||u!==f.Ea||q!==f.Ua){f.l=a.busy=!0;m=f.ja&&cc(a,f);var v=a.id;u=f.Ea=u;f=f.Ua=q;f=Nb(yield Ob(v,`${u}/${f}`+(0<h?"/"+h:"")));yield m;a.busy=!1;if(x||0===h||f){m=a.Ga;u=a.J;v=(256<<u)-256;g=((g<<u+4|p)<<6|h)<<2;if(f)for(let C=0,w=-1;16>C;++C){for(x=0;16>x;++x)m[g]=Vb[++w],m[++g]=Vb[++w],m[++g]=Vb[++w],m[++g]=
Vb[++w],g+=13;g+=v}else for(p=0;16>p;++p){for(f=0;16>f;++f)m[g]=0<h?0:50397446,m[++g]=0<h?0:131843,x?(m[++g]=0,m[++g]=0,g+=13):g+=15;g+=v}if(!b)break}}}}());let sc=null,tc=null;
const uc=new cb,vc=a=>{if(a){const b=tc=new Image;b.onload=()=>{if(tc===b){var c=za.createElement("canvas");c.width=16;c.height=416;c=c.getContext("2d");c.scale(1,-1);for(let d=0;26>d;++d)c.drawImage(b,0,d<<4,16,16,0,-(d<<4)-16,16,16);sc=new bb(c.getImageData(0,0,16,416).data.buffer);for(const d of uc)d.P=!0;tc=null}};b.src=`${"/static/minicraft/"}textures/${a}.png`}else sc=null},xc=(a,b)=>{const c={xb:b,Xa:b.getContext("2d",{alpha:!1,desynchronized:!0}),jb:null,kb:null,ob:"",P:!1,pb:0,ab:0,yb:kb(()=>
(c.pb=c.ab,c.ab=0),1E3),j:a};uc.add(c);wc(c);return c},wc=a=>{const b=a.xb,c=a.j;a.kb=new bb((a.jb=a.Xa.createImageData(b.width=c.xa,b.height=c.ya)).data.buffer);const d=c.xa*c.config.X/c.la,e=c.ya*c.config.X/c.la;b.style.width=d+"px";b.style.height=e+"px";b.style.left=Ha((c.Pa-d)/2)+"px";b.style.top=Ha((c.Qa-e)/2)+"px";a.Xa.fillStyle="rgba(255,255,255,.5)"};let yc=0;
const Bc=(a,b,c,d)=>{const e={Z:null,Ga:null,busy:!1,$:null,Ia:null,ra:0,M:!0,La:0,Ma:0,Na:0,id:c.Da,ua:0,va:0,J:0,za:.5,Aa:8.5,Ba:.5,time:0,Ta:0},k=Hb(e,d);ec(e,k);a={a,config:c,mb:0,nb:0,Ka:!1,sa:!0,zb:b,aa:0,W:new cb,bb:"",o:0,N:[],g:k,cb:null,u:null,la:1,Pa:1,Qa:1,xa:0,ya:0,Ra:0,tb:0,Sa:0,Bb:kb(()=>{e.M||(e.time=(e.time+1)%24E3,e.Ta=1/24E3*(e.Ta+6E3)%1,bc(e,k,!1))},50),world:e};zc(a,null);Ac(a);return a},Cc=a=>{dc(a.world,a.g);a.a.U(a.world.id,{mod_l:Ta.now()})},Dc=a=>{a.o=0;a.world.M=!1;Ac(a)},
Ac=a=>{ea(function*(){if(!a.config.ka)try{yield a.zb.requestPointerLock()}catch(b){}}())},Ec=(a,b)=>a===b?0:.1-.2*a,Fc=a=>{a.g.Va=Ec((a=a.W).has(-12)||a.has(65),a.has(-13)||a.has(68))},Gc=a=>{a.g.ib=Ec((a=a.W).has(-15)||a.has(16),a.has(-14)||a.has(32))},Hc=a=>{a.g.Wa=Ec((a=a.W).has(-11)||a.has(83),a.has(-10)||a.has(87))},Ic=a=>{a.g.ub=Ec(a.W.has(-18),a.W.has(-19))},Jc=a=>{a.g.vb=Ec(a.W.has(-17),a.W.has(-16))},Lc=(a,b,c)=>{if(!a.world)return!1;const d=a.W;var e=a.g;if(c){if(d.has(b))return!1;d.add(b);
var k=e.ga,l=e.Y;c=e.ha;switch(b){case -18:case -19:Ic(a);break;case -17:case -16:Jc(a);break;case -1:2!==e.l&&0<=l&&(0===e.Oa?0===e.l&&(b=Xb(a.world,k,l,c),2===b?b=3:1===b&&(b=4),6===b||8!==b&&13!==b&&null!==Gb(e.A,Eb(b,1)))||(Yb(a.world,k,l,c),e.Y=-1):Kc(a,[k,l,c],!1));break;case -2:case 71:if(0<=l){const m=Xb(a.world,k,l,c);c=e.A.slice(0,9);l=c.findIndex(f=>null!==f.c&&f.c.id===m);0<=l?e.K=l:1===e.l&&(c[e.K].c&&(c=c.findIndex(f=>null===f.c),0<=c&&(e.K=c)),e.A[e.K].c=Eb(m));e.ma=a.aa}break;case -3:if(2!==
e.l&&0<=l)if(0===e.Oa){if(b=e.A[e.K],b.c){switch(e.Fa){case 0:--k;break;case 1:++k;break;case 2:--l;break;case 3:++l;break;case 4:--c;break;default:++c}0<=l&&64>l&&Zb(a.world,k&(1<<4+a.world.J)-1,l,c&(1<<4+a.world.J)-1,b.c.id)&&1!==e.l&&0>=--b.c.amount&&(b.c=null)}}else Kc(a,[k,l,c],!0);break;case -4:e.K=(e.K+9-1)%9;e.ma=a.aa;break;case -5:e.K=(e.K+1)%9;e.ma=a.aa;break;case 27:0===a.o&&(a.world.M=!0,a.o=1);break;case -15:case -14:case 16:case 32:Gc(a);break;case 49:case 50:case 51:case 52:case 53:case 54:case 55:case 56:case 57:e.K=
b-49;e.ma=a.aa;break;case -12:case -13:case 65:case 68:Fc(a);break;case 69:if(0===a.o){a.o=3;for(const m of d)Lc(a,m,!1)}break;case 80:a.world&&(a.world.M=!0);break;case 81:e=e.A[e.K];if(d.has(17)||e.c&&0>=--e.c.amount)e.c=null;break;case -11:case -10:case 83:case 87:Hc(a);break;case 84:if(0===a.o){a.o=2;for(const m of d)Lc(a,m,!1)}break;case 112:a.sa=!a.sa;break;case 114:a.Ka=!a.Ka;case 116:case 122:case 123:break;default:return!1}}else{if(!d.delete(b))return!1;switch(b){case -15:case -14:case 16:case 32:Gc(a);
break;case -12:case -13:case 65:case 68:Fc(a);break;case -11:case -10:case 83:case 87:Hc(a);break;case -18:case -19:Ic(a);break;case -17:case -16:Jc(a)}}a.bb=[...d].join();return!0},Mc=(a,b)=>(b=b.startsWith("~")?a+T(b.substr(1)):T(b),isNaN(b)?a:b),Oc=(a,b)=>{const c=a.g;var d=a.world;if(b)if("/"===b.charAt(0)){b=b.substr(1).split(" ");const e=b.shift();switch(e){case "clear":a.N=[];break;case "clearinv":for(const k of c.A)k.c=null;Z(a,"Inventar geleert",!0);break;case "gamemode":case "gm":b=T(b[0]);
!isNaN(b)&&0<=b&&3>b&&0===b%1?(c.l=b,Z(a,"Spielmodus gesetzt auf: "+b,!0)):Z(a,"Spielmodus muss in 0..2 sein!");break;case "give":if(0===b.length){Z(a,"/give <id> [Anzahl]\n"+Ab.join(" "));break}d=Ab.indexOf((b[0]||"").toLowerCase());d=0<=d?d:T(b[0]);b=T(b[1]||1);!isNaN(d)&&0<d&&25>d&&0===d%1?!isNaN(b)&&0<b&&0===b%1?Z(a,Gb(c.A,Eb(d,b))?"Inventar ist voll!":`${"Items gegeben"} ${b} ${Bb[d]}`,!0):Z(a,"Anzahl muss mindestens 1 sein!"):Z(a,"Ung\u00fcltiger Blocktyp!");break;case "help":Z(a,"Befehle: clear, clearinv, gamemode, give, help, load, me, save, spawn, teleport, version");
break;case "load":ac(d,!0).then(()=>{a.u.P=!0;Z(a,"Chunks geladen.",!0)});break;case "me":Z(a,c.name+" "+b.join(" "),!0);break;case "save":Cc(a);Z(a,"Spiel gespeichert.",!0);break;case "spawn":d.za=c.B;d.Aa=c.G;d.Ba=c.H;Z(a,"Startpunkt aktualisiert.",!0);break;case "teleport":case "tp":0===b.length?(c.B=d.za,c.G=d.Aa,c.H=d.Ba,a.u.P=!0,Z(a,"Zum Startpunkt teleportiert.",!0)):3===b.length?(Z(a,"Teleportiert zu"+` ${c.B=Mc(c.B,b[0])} ${c.G=Mc(c.G,b[1])} ${c.H=Mc(c.H,b[2])}`,!0),a.u.P=!0):Z(a,"Pech!");
c.ba=0;c.ca=0;c.da=0;break;case "version":Z(a,"minicraft 0.11.1");break;case "/exit":c.Oa=0;Z(a,"Normaler Mausmodus.",!0);break;case "/expand":a.g.pa&&a.g.qa?d=!0:(Z(a,"Auswahl erforderlich!"),d=!1);d&&("vert"===b[0]?(c.pa[1]=0,c.qa[1]=63,Z(a,"Auswahl erweitert.",!0)):Z(a,'Nur "vert" wird unterst\u00fctzt!'));break;case "/pos1":case "/pos2":Kc(a,[K(c.B),K(c.G),K(c.H)],"/pos2"===e);break;case "/regen":rc(d).then(()=>{a.u.P=!0;Z(a,"Chunk neu generiert.",!0)});break;case "/show":Z(a,`${"Erster"}: ${c.pa?
c.pa.join(" "):"nichts"}, ${"Zweiter"}: ${c.qa?c.qa.join(" "):"nichts"}`);break;case "/wand":c.Oa=1;Z(a,"Auswahl mit Maustasten.",!0);break;default:Z(a,"Ung\u00fcltiger Befehl: "+e)}}else{const e=Z(a,`<${c.name}> `+b);zc(a,b).then(k=>{k&&Nc(a,e)})}},Z=(a,b,c=!1)=>{const d=++yc;(a.N=a.N.slice(-49)).push({id:d,sb:c,time:xa(),value:b});return d},Nc=(a,b)=>{const c=a.N.findIndex(d=>d.id===b);0<=c&&a.N.splice(c,1)},Kc=(a,b,c)=>{c?a.g.qa=b:a.g.pa=b;Z(a,`${c?"Zweiter Auswahlpunkt":"Erster Auswahlpunkt"}: ${b.join(" ")}`,
!0)},zc=(a,b)=>(lb(a.cb),(b?S("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:Wa({msg:b})}):S("/api/chat")).then(c=>{if(c.ok)return c.text()}).then(c=>{if(c){c=c.split("\n").filter(Boolean);for(const d of c)d.startsWith("<")&&Z(a,d);return 0<c.length}return!1}).catch(()=>!1).then(c=>{a.cb=jb(()=>{zc(a,null)},5E3);return c})),Pc=({id:a,L:b})=>(B("div[className=bitmap]",{S:{backgroundImage:`url(${"/static/minicraft/"}textures/${b}.png)`,backgroundPositionY:`-${2*(a-1)}rem`}}),
null);function Qc({amount:a,l:b,id:c,L:d}){B("div[className=stack]",{title:Bb[c]+(1===b?` (${Ab[c]}, ${c})`:"")});return[F(Pc,{id:c,L:d}),1!==a&&G("div[className=amount]",{innerText:a})]}
function Rc({g:a,L:b,na:c}){B("div[className=bar]",{ontouchstart:E(e=>{a.K=Number(e.target.closest("[data-slot]").dataset.slot);a.ma=e.timeStamp}),S:{opacity:M(.5,L(1,1-5E-4*(c-a.ma-5E3)))}});const d=a.l;return a.A.slice(0,9).map(({c:e},k)=>G("div",{D:{slot:k},F:{active:k===a.K}},[e&&F(Qc,{amount:e.amount,data:e.data,l:d,id:e.id,L:b})]))}
function Sc({Ab:a,L:b}){B("div[className=grid]",{onclick:({target:c})=>{(c=c.closest("[data-id]"))&&Fb({c:Eb(T(c.dataset.id)),filter:null,V:64},a)}});return Ab.map((c,d)=>0<d&&G("div",{D:{id:d}},[F(Qc,{amount:1,data:null,l:1,id:d,L:b})]))}
function Tc({j:a,L:b}){const c=la(()=>({c:null,filter:null,V:64})),d=a.g.l;B("div[className=menu overlay inventory]",la(()=>({onclick:({target:e})=>{if("menu overlay inventory"===e.className)c.c?c.c=null:Dc(a);else if(e=e.closest("[data-slot]"))e=a.g.A[T(e.dataset.slot)],c.c?Fb(c,e):e.c&&Fb(e,c)},oncontextmenu:({target:e})=>{if("menu overlay inventory"===e.className)c.c?0>=--c.c.amount&&(c.c=null):Dc(a);else if(e=e.closest("[data-slot]"))e=a.g.A[T(e.dataset.slot)],c.c?Fb(c,e,1):e.c&&Fb(e,c,Ga(e.c.amount/
2))}})));return[G("div[className=window]",null,[G("h2[innerText=Inventar]"),1===d&&F(Sc,{Ab:c,L:b}),G("div[className=grid]",null,a.g.A.map(({c:e},k)=>G("div",{D:{slot:k},F:{first:9>k}},[e&&F(Qc,{amount:e.amount,data:e.data,l:d,id:e.id,L:b})])))]),c.c&&G("div[className=hand]",{S:{transform:`translate(${a.mb}px, ${a.nb}px)`}},[F(Qc,{amount:c.c.amount,data:c.c.data,l:0,id:c.c.id,L:b})])]}
const Uc=({I:{sb:a,time:b,value:c},na:d})=>(B(a?"div[className=minor]":"div",{innerText:c,S:{opacity:L(1,1-.001*(d-b-4500))}}),null);function Vc({N:a,na:b}){B("div[className=messages]");const c=b-5E3;return[ua(Uc,a.slice(-10).filter(d=>d.time>c),{na:b})]}function Wc({I:a,ia:b,current:c}){B("button",{disabled:a.id===c,innerText:`${a.label} (${a.owner})`,onclick:()=>{b({T:a.id})}});return null}
function Xc({a:{ia:a},config:b,j:c,oa:d}){c&&D(()=>Cc(c));const [e,k]=oa(!1),l=ia(()=>e?S("/static/minicraft/textures.json").then(m=>m.ok?m.json():null).catch(()=>null):Va.resolve(null),[e],null);B("div[className=menu overlay]");return[G("h1",{innerText:e?"Oberfl\u00e4chen":"Einstellungen"}),G("center",null,[G("button",{innerText:c&&!e?"Zur\u00fcck zum Spiel":"Zur\u00fcck",onclick:()=>{e?k(!1):c?Dc(c):d(2)}})]),!e&&G("div[className=settings]",null,[G("button[innerText=Oberfl\u00e4chen...]",{onclick:()=>
{k(!0)}}),G("label[innerText=Aufl\u00f6sung:]",null,[G("input[type=range][min=1][max=100][step=1]",{value:101-b.X,onchange:m=>a({X:101-Number(m.target.value)})})]),G("label[innerText=Blickwinkel:]",null,[G("input[type=range][min=1][max=180][step=1]",{value:b.Ca,onchange:m=>a({Ca:Number(m.target.value)})})]),G("label[innerText=Sichtweite:]",null,[G("input[type=range][min=1][max=128][step=1]",{value:b.ea,onchange:m=>a({ea:Number(m.target.value)})})]),G("label[innerText=Pixelgruppierung:]",null,[G("input[type=range][min=1][max=6][step=1]",
{value:b.wa,onchange:m=>a({wa:Number(m.target.value)})})]),G("label[innerText=Mausempfindlichkeit:]",null,[G("input[type=range][min=1][max=15][step=1]",{value:b.ta,onchange:m=>a({ta:Number(m.target.value)})})]),G("button[innerText=Projektseite]",{onclick:()=>{open("//github.com/L3P3/minicraft")}})]),c&&!e&&G("center",null,[G("button[innerText=Welt verlassen]",{onclick:()=>{d(2)}})]),e&&G("div[className=settings]",null,[G("button[innerText=Einfarbig]",{disabled:0===b.T,onclick:()=>{a({T:0})}}),l&&
ua(Wc,l,{ia:a,current:b.T})])]}const Yc=({I:{sb:a,value:b}})=>(B(a?"div[className=minor]":"div",{innerText:b}),null);
function Zc({j:a,N:b}){const c=E({history:null,input:null});B("div[className=menu overlay terminal]",{onclick:d=>{d.target!==c.input&&c.input.focus()}});D(d=>{d&&jb(()=>c.history.scrollTop=1E9,0)},[b.length&&b[b.length-1].id]);return[E(G("div[className=toolbar]",null,[G("button[innerText=\u274c]",{onclick:()=>{Dc(a)}})])),G("div[className=history]",{R:E(d=>{c.history=d})},[ua(Yc,b)]),E(G("input[enterkeyhint=send][mozactionhint=send][name=message][required]",{onkeydown:d=>{const e=d.keyCode;d=d.target;
13===e?(Oc(a,d.value),d.value=""):27===e&&Dc(a)},R:d=>{c.input=d;jb(()=>d.focus(),0)}}))]}const $c=[["pick",-2],["up",-14],["down",-15],["E",69],["T",84],["F1",112],["F3",114],["...",27]],ad=[["up",-10],["down",-11],["left",-12],["right",-13],["center",-1]],bd=[["up",-16],["down",-17],["left",-18],["right",-19],["center",-3]];
function cd({j:a}){const b=a.W,c=([d,e])=>G("div",{D:{code:e},F:{button:!0,[d]:!0,active:b.has(e)}});B("div[className=touch]",E({ontouchstart:d=>{let {code:e}=d.target.dataset;if(null!=e&&Lc(a,e=T(e),!0)){const k=d.changedTouches[0].identifier,l=m=>{m.changedTouches[0].identifier===k&&(ob("touchend",l),Lc(a,e,!1))};nb("touchend",l)}return!1}}));return[G("div[className=top]",null,$c.map(([d,e])=>G(`div[innerText=${d}]`,{D:{code:e},F:{button:!0,active:b.has(e)}}))),G("div[className=move]",null,ad.map(c)),
G("div[className=move sec]",null,bd.map(c))]}
function dd({account:a,a:b,config:c,frame:d,eb:e,oa:k}){const l=xa(),m=za.pointerLockElement===d,f=la(()=>e.j=Bc(b,d,c,a));D(()=>{const g=h=>{if(0!==f.o)return!0;za.pointerLockElement===d?Lc(f,-1-h.button,"mousedown"===h.type):Ac(f);return!1},p=h=>{if(za.pointerLockElement===d){const q=f.config.ta*Da/(M(f.Pa,f.Qa)*f.la);pb&&(f.tb=h.timeStamp);Ib(f.g,f.Ra=h.movementX*q,f.Sa=-h.movementY*q)}else f.mb=h.clientX,f.nb=h.clientY},u=h=>{b.Ja(!1);if(0===f.o&&!f.world.M&&5<Math.abs(h.deltaY))return h=0<h.deltaY?
-5:-4,Lc(f,h,!0),Lc(f,h,!1),!1},v={passive:!0};d.addEventListener("mousedown",g);d.addEventListener("mouseup",g);d.addEventListener("mousemove",p,v);d.addEventListener("wheel",u,v);return()=>{d.removeEventListener("mousedown",g);d.removeEventListener("mouseup",g);d.removeEventListener("mousemove",p,v);d.removeEventListener("wheel",u,v);lb(f.cb);mb(f.Bb);dc(f.world,f.g);var h=f.u;uc.delete(h);mb(h.yb);e.j=null}});D(()=>{f.config=c;f.u&&(f.u.P=!0);const g=f.world;var p=Ga(La(f.config.ea/16*2+2));if(g.J!==
p){var u=f.g;g.$&&dc(g,u);const v=1<<(g.J=p),h=g.$=[];for(let q=0;q<v;++q)for(let C=0;C<v;++C)for(let w=0;4>w;++w)h.push({ja:!1,l:!1,x:q,y:w,z:C,Ea:0,Ua:0});p=v<<p+12+2;null===g.Z||g.Z.length<p?g.Ga=new bb((g.Z=new ab(p)).buffer):g.Ga.fill(0);bc(g,u,!0)}},[c]);D((g,p,u)=>{f.la=u;f.Pa=M(1,g);f.Qa=M(1,p);p=f.config.X;g=Ga(f.Pa*f.la/p);p=Ga(f.Qa*f.la/p);if(g!==f.xa||p!==f.ya)f.xa=g,f.ya=p,f.u&&(f.u.P=!0,wc(f.u))},[d.offsetWidth,d.offsetHeight,ya.devicePixelRatio||1,c.X]);D(g=>{g||f.world.M||0!==f.o||
(f.o=1,pb&&f.Ra|f.Sa&&f.tb>l-100&&(Ib(f.g,-f.Ra,-f.Sa),f.Ra=f.Sa=0,f.u.P=!0));f.world.M=!g},[c.ka&&0===f.o||m]);D(g=>m&&g&&za.exitPointerLock(),[f.world.M||0!==f.o]);D(()=>{if(f.world){if(f.aa&&!f.world.M){var g=f.g,p=L(5,.01*(l-f.aa));g.ba-=.1*g.ba*p;g.ca-=.1*g.ca*p;g.da-=.1*g.da*p;g.ba+=(Ia(g.O)*g.Va+Ja(g.O)*g.Wa)*p;g.ca+=g.ib*p;g.da+=(-Ja(g.O)*g.Va+Ia(g.O)*g.Wa)*p;Ib(g,g.ub*p*1.5,g.vb*p*1.5);g.B+=g.ba*p;g.G+=g.ca*p;g.H+=g.da*p}if(f.u){g=f.u;++g.ab;p=g.Xa;var u=g.jb;const ja=g.kb,va=g.j,Oa=va.config,
ub=va.sa,z=va.g,N=va.xa,pa=va.ya,O=va.world;if(!O.M||g.P){g.P=!1;var v=Oa.wa;const hd=Oa.ea;var h=z.O,q=z.fa;const id=z.ga,jd=z.ha;var C=z.B,w=z.G,H=z.H;const kd=ub?z.Y:-1,ld=O.Z;var P=O.J;const md=null!==sc;var t=1/N,r=1/pa;const ka=N>>1,qa=pa>>1,fc=L(N,pa),gc=32<fc,hc=Ia(h);h=Ja(h);const ic=Ia(-q);q=Ja(-q);var y=Oa.Ca/45;const nd=t*(N<pa?y*N*r:y);t=r*(pa<N?y*pa*t:y);C+=65536;w+=65536;H+=65536;r=C%1;y=w%1;const od=H%1;P=4+P;const jc=(1<<P)-1;v=v<N?v:1;const pd=N-v;let kc=1===z.l?6:4,vb=z.ga=z.ha=
z.Fa=0,lc=0;z.Y=-1;for(let Pa=0;Pa<pa;++Pa){var A=(qa-Pa)*t;const mc=A*ic-q;var Aa=A*q+ic;A=Aa*h;Aa*=hc;let ra=0,Ba=!1;var aa=!1;a:for(let ba=0;ba<N;ba+=v)for(let ca=aa?1:0;ca<v;++ca){if(2>v)var I=ba;else if(0===ba)I=0===ca?0:1===ca?v:ca-1,Ba=1===ca;else if(ba<pd)I=(Ba=1===ca)?ba+v:ba+ca-1;else{if((I=0===ca?ba-1:ba+ca)>=N)break a;Ba=!1}var U=(I-ka)*nd;aa=A+hc*U;const nc=Aa-h*U,qd=lc;U=16757124;let db=1,oc=hd;for(let wb=0;3>wb;++wb){const V=(qd+wb)%3;let da=nc;var Q=od;0===V&&(da=aa,Q=r);1===V&&(da=
mc,Q=y);var sa=-1/da;0<da&&(Q=1-Q,sa*=-1);const eb=aa*sa,wa=mc*sa;sa*=nc;const pc=Ka(eb*eb+wa*wa+sa*sa);let Qa=C+eb*Q-(0===V&0>da|0),Ra=w+wa*Q-(1===V&0>da|0),Sa=H+sa*Q-(2===V&0>da|0);Q*=pc;for(let xb,yb,zb,W;Q<oc;Qa+=eb,Ra+=wa,Sa+=sa,Q+=pc)if(65536>Ra){if(0>wa)break}else if(65600<=Ra){if(0<wa)break}else if(0!==(W=ld[((xb=Qa&jc)<<P|(zb=Sa&jc))<<6|(yb=Ra&63)])){Pa===qa&&I===ka&&Q<=kc&&(z.ga=xb,z.Y=yb,z.ha=zb,z.Fa=0>da|V<<1,kc=Q);if(md){--W;1===V?6===W?W=25:13===W?W=4:1===W&&0<wa&&(W=2):1===W&&(W=24);
const qc=sc[W<<8|(16*(1===V?Sa:Ra)&15)<<4|16*(1===V?Qa:(0<da?Qa-Sa:Sa-Qa)+65536)&15];if(0===qc>>>24)continue;U=qc&16777215}else U=Cb[W];oc=Q;db=(0===V?.8:2===V?.6:0<da?.4:1)+(yb!==kd||xb!==id||zb!==jd?0:.2);lc=V;break}}U=4278190080|L((U>>16)*db,255)<<16|L((U>>8&255)*db,255)<<8|L((U&255)*db,255);if(aa=(Ba=Ba&&(Pa!==qa||I<ka||I>ka+v))&&ra===U){I=vb+ba+1;ja[I]=ra;ja[++I]=ra;if(3>v)break;ja[++I]=ra;if(4>v)break;ja[++I]=ra;if(5>v)break;ja[++I]=ra;if(6>v)break;ja[++I]=ra;break}if(Ba||0===I)ra=U;ja[vb+I]=
U}vb+=N}ub&&!gc&&(ja[N*qa+ka]^=16777215);p.putImageData(u,0,0);ub&&gc&&(u=L(Ga(.05*fc),8),p.fillRect(ka-u,qa-1,u<<1,2),p.fillRect(ka-1,qa-u,2,u-1),p.fillRect(ka-1,qa+1,2,u-1))}g.ob=va.Ka?`minicraft ${"0.11.1"} ${K(g.pb).toString().padStart(2,"\u00a0")} fps, T: ${K(24*O.Ta).toString().padStart(2,"0")}:${K(24*O.Ta%1*60).toString().padStart(2,"0")}; ${O.M&&500>l%1E3?"":O.time}
R: ${N}x${pa} (x${Oa.X}), D: ${Oa.ea}, C: ${O.ra}/${O.Ia.length}, M: ${64*qb(1<<4+O.J)>>10}k
E: 0/0 M: ${z.l}

Position: ${z.B.toFixed(2)} ${z.G.toFixed(2)} ${z.H.toFixed(2)}
Angle: ${(z.O*Fa).toFixed(2)} ${(z.fa*Fa).toFixed(2)}
Block: ${0>z.Y?0:z.ga+" "+z.Y+" "+z.ha+" "+Db[z.Fa]+": "+Xb(O,z.ga,z.Y,z.ha)}
Chunk abs: ${K(z.B)>>4} ${K(z.H)>>4} ${K(z.G)>>4} rel: ${O.La} ${O.Na} ${O.Ma}`:""}}f.aa=l},[l]);na();const x=E({fb:1});c.T&&(x.fb=c.T);return[G("canvas",{R:E(g=>{f.u=xc(f,g)})}),f.sa&&2!==f.o&&F(Vc,{N:f.N,na:l}),f.u&&f.Ka&&G("div[className=diagnostics]",{innerText:f.u.ob}),c.ka&&F(cd,{j:f,bb:f.bb}),f.sa&&3!==f.o&&2!==f.g.l&&F(Rc,{g:f.g,L:x.fb,na:l}),3===f.o&&F(Tc,{j:f,L:x.fb,na:l}),1===f.o&&F(Xc,{a:b,config:c,j:f,oa:k}),2===f.o&&F(Zc,{j:f,N:f.N})]}
function ed({I:a,Cb:b,Db:c,Eb:d}){B("div",{F:{selected:a===c},onclick:()=>{d(a.id)}});c=`${a.local?"L":"_"}${a.local&&a.remote?a.local>a.remote?">":a.local<a.remote?"<":"=":"_"}${a.remote?a.public?"R":"r":"_"}`;b===a.id&&(c=`[${c}]`);return[G("span",{innerText:`${c} ${a.label}`,title:a.account_name?"Besitzer: "+a.account_name:"Nur lokale Welt"}),G("span",{innerText:sb(M(a.local,a.remote),!0)})]}const fd={method:"POST",headers:{"Content-Type":"application/json"}};
function gd({account:a,a:b,config:c,oa:d}){B("div[className=menu]");const [e,k,l]=oa(0),m=E(()=>{k(l()+1)}),f=E({value:null}),x=ia(()=>ea(function*(){try{const t=!f.value&&!e,r=yield S(`${"/api/minicraft/"}world?what=${t?"initial":"meta_all"}`);if(!r.ok)throw Error("Verbindungsfehler.");const y=yield r.json();if(!t)return y;if("0.11.1"!==y.version_latest)return location.reload(!0),null;fa();b.wb(y.account);return y.worlds}catch(t){return alert("Fehler beim Laden der Weltenliste: "+t.message),[]}}()),
[e],null),g=la(()=>{x&&(f.value=x);const t=[];f.value&&t.push(...f.value.map(r=>({account_name:r.account_name,hash:r.hash,id:r.id,label:r.label,local:0,public:r.public,remote:r.modified,writable:r.writable})));for(const r of c.worlds){const y=t.find(A=>A.id===r.id);if(y){const A=y.local=r.mod_l,Aa=y.remote,aa=r.mod_r;A>aa&&Aa>aa&&(confirm('Konflikt! Die Welt "'+r.label+'" wurde sowohl hier als auch woanders ge\u00e4ndert.\nOK: Die vom Server \u00fcbernehmen ('+sb(Aa,!1)+") | Abbrechen: Die hier hochladen ("+
sb(A,!1)+")")?b.U(r.id,{mod_l:y.local=aa}):b.U(r.id,{mod_r:y.remote=aa}))}else 1<r.mod_r&&x&&x.length&&(alert('Die Welt "'+r.label+'" wurde auf dem Server nicht gefunden, ist also jetzt eine lokale!'),b.U(r.id,{mod_r:0})),t.push({account_name:"",hash:0,id:r.id,label:r.label,local:r.mod_l,public:!1,remote:1===r.mod_r?1:0,writable:!0})}return t.sort((r,y)=>M(y.local,y.remote)-M(r.local,r.remote))},[x,c.worlds]),[p,u,v]=oa(c.Da),h=la(()=>g.find(t=>t.id===p)||null,[p,g]),q=la(()=>{let t,r;return null!=
(r=null==g?void 0:null==(t=g.find(y=>0<y.local&&0<y.remote&&y.local!==y.remote))?void 0:t.id)?r:null},[g]);D(()=>{if(null!==q){var t=!1,r=g.find(y=>y.id===q);if(r.local<r.remote)S(`${"/static/minicraft/"}worlds/${r.hash}.json`).then(y=>y.json()).then(y=>{if(!t)return Sb(q,y).then(()=>{b.U(q,{mod_l:r.remote,mod_r:r.remote})})}).catch(y=>{t||("QuotaExceededError"===y.name?(alert("Der Speicherplatz reicht nicht!"),b.hb(q),Tb(q)):alert("Fehler beim Herunterladen der Welt: "+y.message))});else{if(!r.writable){b.U(q,
{mod_l:c.worlds.find(A=>A.id===q).mod_r});return}let y=q;(1===r.remote?S("/api/minicraft/world",Object.assign({},fd,{body:Wa({what:"meta",label:r.label})})).then(A=>{if(!A.ok)throw Error(403===A.status?"Keine Berechtigung. Angemeldet?":"Verbindungsfehler.");return A.json()}).then(A=>{y=A.id}):Va.resolve()).then(()=>{if(t)throw null;return Rb(q)}).then(A=>{if(t)throw null;return S("/api/minicraft/world",Object.assign({},fd,{body:Wa({what:"data",world:y,data:A})}))}).then(A=>{if(!A.ok)throw Error(403===
A.status?"Keine Berechtigung. Angemeldet?":"Verbindungsfehler.");return A.json()}).then(A=>{fa();y===q?b.U(q,{mod_l:A.modified,mod_r:A.modified}):(Ub(q,y),b.hb(q),b.gb({id:y,label:r.label,mod_l:A.modified,mod_r:A.modified}),t||v()!==q||u(y));t||m();ha()}).catch(A=>{t||(alert("Fehler beim Hochladen der Welt: "+A.message),fa(),b.U(q,{mod_r:0}),ha())})}return()=>{t=!0}}},[q]);const [C,w]=oa(!1);h||w(!1);const [H,P]=oa(!1);return[G("h1[innerText=Welten]"),G("button[innerText=Aktualisieren][style=position:absolute;left:0;top:0;height:2rem][title=Liste neu laden]",
{disabled:!x,onclick:m}),G("button[style=position:absolute;right:0;top:0;height:2rem]",{disabled:0<a.rank,innerText:a.rank?a.label:"Anmelden",onclick:()=>{location.href="/account?redir=minicraft"}}),G("div[className=worlds]",null,[ua(ed,g,{Gb:e,Cb:q,Db:h,Eb:u})]),G("center",null,[G("button[innerText=\u00d6ffnen]",{disabled:!h||!h.local||h.remote>h.local,onclick:()=>{fa();b.ia({Da:h.id});d(0);ha()},title:h?h.local?h.remote>h.local?"Die Welt wird noch geladen!":"Ausgew\u00e4hlte Welt betreten":"Die Welt ist noch nicht heruntergeladen!":
"Keine Welt ausgew\u00e4hlt!"}),G("button[innerText=Welt...]",{disabled:!h||C,onclick:()=>{w(!0)},title:h?"Aktionen/Einstellungen zur Welt anzeigen":"Keine Welt ausgew\u00e4hlt!"})]),G("hr"),G("center",null,[G("button[innerText=Neue Welt]",{onclick:()=>{const t=prompt("Name der neuen Welt:\n(max. 16 Zeichen)","Neue Welt");t&&(16<t.length?alert("Der Name ist zu lang!"):b.gb({id:L(0,...c.worlds.map(r=>r.id))-1,label:t,mod_l:Ta.now(),mod_r:0}))}}),G("button[innerText=Einstellungen]",{onclick:()=>{d(1)}})]),
G("center",null,[G("small[innerText=Version 0.11.1 von L3P3]")]),C&&h&&G("div",{F:{"menu overlay advanced":!0,busy:H},onclick:t=>{"menu overlay advanced"===t.target.className&&w(!1)}},[G("div[className=window]",null,[G("h2",{innerText:`"${h.label}"`,title:h.id}),G("table",null,[!!h.account_name&&G("tr",null,[G("td[innerText=Besitzer:]"),G("td",{innerText:h.account_name})]),G("tr",null,[G("td[innerText=\u00c4nderung:]"),G("td",{innerText:sb(M(h.local,h.remote),!1)})])]),G("center",null,[G("button[innerText=Umbenennen]",
{disabled:H||!h.writable,onclick:()=>{const t=prompt("Neuer Name der Welt:\n(max. 16 Zeichen)",h.label);!t||t===h.label||16<t.length||(h.local&&b.U(h.id,{label:t}),h.remote&&(P(!0),S("/api/minicraft/world",{method:"POST",headers:{"Content-Type":"application/json"},body:Wa({what:"meta",world:h.id,label:t})}).then(r=>{if(!r.ok)throw Error(403===r.status?"Keine Berechtigung. Angemeldet?":"Verbindungsfehler.");return r.json()}).catch(r=>{alert("Fehler beim Bearbeiten der Welt: "+r.message)}).then(()=>
{P(!1)})))},title:h.writable?"Welt-Namen \u00e4ndern":"Fehlende Berechtigung!"}),G("button",{disabled:H||!h.local&&!h.writable,innerText:h.local?"L\u00f6schen (lokal)":"L\u00f6schen",onclick:()=>{confirm('Welt "'+h.label+'" wirklich l\u00f6schen?')&&(h.local?(b.hb(h.id),Tb(h.id)):(P(!0),S("/api/minicraft/world",{method:"DELETE",headers:{"Content-Type":"application/json"},body:Wa({what:"world",world:h.id})}).then(t=>{if(!t.ok)throw Error(403===t.status?"Keine Berechtigung. Angemeldet?":"Verbindungsfehler.");
fa();u(null);w(!1);m();P(!1);ha();return t.json()}).catch(t=>{alert("Fehler beim L\u00f6schen der Welt: "+t.message);P(!1)})))},title:h.local||h.writable?"Welt l\u00f6schen":"Fehlende Berechtigung!"})]),G("center",null,[G("button",{disabled:H||!h.remote||!h.writable,innerText:`${"\u00d6ffentlich"}: ${h.public?"Ja":"Nein"}`,onclick:()=>{P(!0);S("/api/minicraft/world",{method:"POST",headers:{"Content-Type":"application/json"},body:Wa({what:"meta",world:h.id,public:!h.public})}).then(t=>{if(!t.ok)throw Error(403===
t.status?"Keine Berechtigung. Angemeldet?":"Verbindungsfehler.");fa();m();P(!1);ha();return t.json()}).catch(t=>{alert("Fehler beim Bearbeiten der Welt: "+t.message);P(!1)})},title:h.remote?h.writable?h.public?"Welt privat machen":"Welt ver\u00f6ffentlichen":"Fehlende Berechtigung!":"Die Welt ist nicht hochgeladen!"}),G("button",{disabled:H||!x||0<h.local&&0<h.remote||!h.remote&&!a.rank,innerText:h.local?x&&h&&!h.remote?"Hochladen":"\u00dcbertragen":"Herunterladen",onclick:()=>{h.local?h.remote||
b.U(h.id,{mod_r:1}):b.gb({id:h.id,label:h.label,mod_l:1,mod_r:h.remote})},title:x?h.local?h.remote?"Die Welt ist schon auf beiden Seiten vorhanden!":a.rank?"Welt auf den Server hochladen":"Nicht angemeldet!":"Welt von Server herunterladen":"Liste wird noch geladen!"})])])])]}
function rd({account:a,a:b,config:c,eb:d}){const [e,k]=oa(2),l=B("div[className=game]");return[(2===e||1===e)&&F(gd,{account:a,a:b,config:c,oa:k}),1===e&&F(Xc,{a:b,config:c,j:null,oa:k}),0===e&&F(dd,{account:a,a:b,config:c,frame:l,eb:d,oa:k})]}
function sd(){const [a,b]=ma(tb),c=E({j:null,rb:0});D(()=>{let m=!1;onbeforeunload=onunload=onpagehide=onblur=()=>{m||(m=!0,c.j&&Cc(c.j),b.Ya())};onpageshow=onfocus=()=>{m=!1};setInterval(()=>(b.Ya(),!Na&&Ya("minicraft.lock",Ta.now())),500);nb("touchend",f=>{c.rb=f.timeStamp},!0)});const d=E(m=>{if("INPUT"===m.target.tagName||!c.j)return!0;b.Ja(!1);Lc(c.j,m.keyCode,"keydown"===m.type);return!1}),e=E(()=>{b.Ja(!0)}),k=E(m=>{999<m.timeStamp-c.rb&&b.Ja(!1)}),l=a.config.ka;D(()=>{l?(nb("mousedown",k,
!0),nb("mouseup",k,!0),ob("touchstart",e,!0)):(ob("mousedown",k,!0),ob("mouseup",k,!0),nb("touchstart",e,!0))},[l]);D(vc,[a.config.T]);B("",{onkeydown:d,onkeyup:d,oncontextmenu:rb,ondragstart:rb});return[F(rd,{account:a.account,a:b,config:a.config,eb:c})]}function td(){close();return[G("h1[innerText=minicraft l\u00e4uft schon!]")]}
if(window.SSR)ta(sd);else if(Na){const a=new Na("minicraft.lock"),b=jb(()=>{ta(sd)},100);a.addEventListener("message",c=>{"yes"===c.data?(lb(b),a.close(),ta(td)):(a.postMessage("yes"),focus())});a.postMessage("anyone there?")}else{const a=T(R.getItem("minicraft.lock")),b=Ta.now()-1E3;a<b?ta(sd):jb(()=>{ta(T(R.getItem("minicraft.lock"))===a?sd:td)},a-b)};
