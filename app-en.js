function aa(a){function b(d){return a.next(d)}function c(d){return a.throw(d)}return new Promise(function(d,e){function l(m){m.done?d(m.value):Promise.resolve(m.value).then(b,c).then(l,e)}l(a.next())})}
const n=lui,ba=n.defer,fa=n.defer_end,ha=n.hook_async,A=n.hook_dom,D=n.hook_effect,ia=n.hook_memo,ja=n.hook_model,na=n.hook_rerender,oa=n.hook_state,F=n.hook_static,pa=n.init,G=n.node,H=n.node_dom,qa=n.node_map,ua=n.now,va=window,wa=document,ya=navigator,K=Math,za=K.PI,Aa=.5*za,Ba=180/za,Fa=K.random,L=K.floor,Ga=K.ceil,Ha=K.round,M=K.min,Ia=K.max,Ja=K.cos,Ka=K.sin,La=K.sqrt,Ma=K.log2,Na=String.fromCharCode,Oa=BroadcastChannel,Pa=Date,Xa=JSON,Ya=Promise,Za=Xa.stringify,$a=Xa.parse,N=localStorage,ab=
N.setItem.bind(N),bb=N.removeItem.bind(N),cb=va.indexedDB,db=fetch,eb=Uint8Array,fb=Uint32Array,gb=Set,kb=Map,P=Number,lb=Object,mb=lb.keys,nb=lb.entries,ob=setTimeout,pb=setInterval,qb=clearTimeout,rb=clearInterval,sb=addEventListener,tb=removeEventListener,ub=ya.userAgent.includes("WebKit"),vb=a=>a*a,wb=()=>!1,xb=(a,b)=>{const c=new Pa;a=new Pa(a);var d=c-a;if(59E3>d)return Ha(d/1E3)+"s";if(3E6>d)return Ha(d/6E4)+"m";d=a.getFullYear();const e=a.getMonth(),l=a.getDate();let m="";d<c.getFullYear()&&
(m=d+"/");if(m||e<c.getMonth())m+=e+1+"/";if(m||l<c.getDate())m+=l;if(b)return m||"today";m&&(m+="/");b=m+a.getHours()+":";a=a.getMinutes();a=L(a).toString().padStart(2,"0");return b+a};let Q=N.getItem("minicraft.config");if((Q=Q&&$a(Q))&&Q.worlds&&Q.version.startsWith("0.9.")){const a=new gb(Q.worlds.map(b=>"minicraft.world."+b.id));for(const b of mb(N))b.startsWith("minicraft.world.")&&!a.has(b.split(":")[0])&&bb(b)}
const Db={init:()=>{let a=!1;var b={ka:!1,xa:1,ua:3,Y:4,T:1,Da:120,ga:64,Ea:0,worlds:[]};if(Q){let c=Q.pixel_grouping;null!=c&&(b.xa=c);null!=(c=Q.mouse_sensitivity)&&(b.ua=c);b.Y=Q.resolution_scaling;null!=(c=Q.textures)?b.T=c:b.T=Q.flag_textures?1:0;b.Da=Q.view_angle;b.ga=Q.view_distance;null!=(c=Q.world_last)&&(b.Ea=c);null!=(c=Q.worlds)?b.worlds=c:N.getItem("minicraft.world.0:meta")&&(b.worlds[0]={id:0,label:(prompt("There was an unnamed world found. How should it be called?","")||"Unknown world").substring(0,
16),mod_l:Pa.now(),mod_r:0},a=!0);Q=null}b={account:{label:"",rank:0},config:b,Ya:b};return a?(b.Ya=null,Db.Xa(b)):b},Xa:a=>{const b=a.config;if(b===a.Ya)return a;ab("minicraft.config",Za({version:"0.11.4",pixel_grouping:b.xa,mouse_sensitivity:b.ua,resolution_scaling:b.Y,textures:b.T,view_angle:b.Da,view_distance:b.ga,world_last:b.Ea,worlds:b.worlds}));return Object.assign({},a,{Ya:b})},xb:(a,b)=>Object.assign({},a,{account:b}),Gb:(a,b)=>Db.ia(a,b(a.config)),ia:(a,b)=>Object.assign({},a,{config:Object.assign({},
a.config,b)}),Ja:(a,b)=>a.config.ka===b?a:Db.ia(a,{ka:b}),gb:(a,b)=>Object.assign({},a,{config:Object.assign({},a.config,{worlds:[...a.config.worlds,b]})}),hb:(a,b)=>Object.assign({},a,{config:Object.assign({},a.config,{worlds:a.config.worlds.filter(c=>c.id!==b)})}),U:(a,b,c)=>Object.assign({},a,{config:Object.assign({},a.config,{worlds:a.config.worlds.map(d=>d.id===b?Object.assign({},d,c):d)})})},Eb="air stone grass dirt cobble planks bedrock log leaves bricks wool sand gravel glass bookshelf obsidian stone_bricks sandstone lapis_block iron_block gold_block diamond_block emerald_block redstone_block quartz_block".split(" "),
Fb=[0,8487297,4305266,4349313,8092539,5342114,7039851,3561583,4172910,6384533,15526888,10671324,8092798,16447200,4151672,1970708,8092539,9686227,9126695,15198183,5567485,14541182,7920469,662956,14936813],Gb=(a,b=1,c=null)=>({amount:b,data:c,id:a}),Hb=(a,b,c=a.c.amount)=>{if(b.c)a.c.id===b.c.id?(c=M(c,b.W-b.c.amount),a.c.amount-=c,b.c.amount+=c,0>=a.c.amount&&(a.c=null)):!(a.c.amount<=c&&a.c.amount<=b.W&&b.c.amount<=a.W)||a.filter&&!a.filter(b.c.id)||b.filter&&!b.filter(a.c.id)||([b.c,a.c]=[a.c,b.c]);
else if(!b.filter||b.filter(a.c.id))a.c.amount<=c&&a.c.amount<=b.W?[b.c,a.c]=[a.c,b.c]:(c=M(c,b.W),a.c.amount-=c,b.c=Gb(a.c.id,c),0>=a.c.amount&&(a.c=null))},Ib=(a,b)=>{for(const c of a)if(c.c&&c.c.id===b.id){const d=M(b.amount,c.W-c.c.amount);c.c.amount+=d;if(0>=(b.amount-=d))return null}for(const c of a)if(!c.c&&(!c.filter||c.filter(b.id)))if(a=M(b.amount,c.W),a<=b.amount){if(c.c=Gb(b.id,a),0>=(b.amount-=a))return null}else return c.c=b,null;return b},Jb=(a,b)=>({Ua:0,ib:0,Va:0,O:0,ha:0,pa:0,aa:0,
V:-1,ba:0,qa:null,ra:null,l:1,rb:20,B:Array(36).fill(null).map(()=>({c:null,filter:null,W:64})),Oa:0,name:b.label||"Player",G:a.Aa,H:a.Ba,J:a.Ca,vb:0,wb:0,L:0,ma:0,da:0,ea:0,fa:0}),Kb=(a,b,c)=>{a.O=(a.O+b+100*za)%(2*za);a.ha=Ia(-Aa,M(Aa,a.ha+c))},Lb=a=>{a+=32;33<a&&39>a?a++:38<a&&44>a?a+=2:43<a&&127>a?a+=3:126<a&&55258>a?a+=37:55295<a&&(a+=8485);return Na(a)},Mb=a=>a-(63743<a?8517:159<a?69:46<a&&130>a?35:40<a&&46>a?34:34<a&&40>a?33:32),Ob=()=>{var a=Nb;const b=a.length,c=new kb,d=u=>{h=h<<1|u&1;15===
++p&&(w+=Lb(h),h=p=0)},e=()=>{for(let u=0;u<v;++u)d(0)},l=u=>{d(u);d(u>>1);d(u>>2);d(u>>3);d(u>>4);d(u>>5);d(u>>6);d(u>>7)},m=()=>{0===--z&&(z=1<<v++)},k=()=>{if(C)C=!1;else{let u=r.id;for(let E=0;E<v;E++)d(u>>E)}};let f=a[0],w="",h=0,p=2,v=2,z=2,g=2,r={id:g++,Ha:new kb},C=!0;l(f);c.set(f,r);for(let u=1;u<b;++u){const E=r.Ha.get(f=a[u]);E?r=E:(k(),c.has(f)||(m(),e(),l(f),c.set(f,{id:g++,Ha:new kb}),C=!0),r.Ha.set(f,{id:g++,Ha:new kb}),r=c.get(f),m())}k();c.has(f)||(m(),e(),l(f));m();d(1);--v;e();
return w+=Lb(h<<15-p)},Pb=a=>{var b=Nb;if(!a)return null;const c=a.length,d=()=>{p+=(g>>--r&1)<<v++;0===r&&(r=15,g=Mb(a.charCodeAt(z++)))};let e=[0,1],l=1,m=3,k=2,f=null;var w=null;let h=0,p=0;w=2;let v=0,z=0,g=Mb(a.charCodeAt(z++)),r=15;for(;v<w;)d();if(1===p)return null;for(p=v=0;8>v;)d();f=[p];e[2]=f;for(b[h++]=p;z<=c;){w=k;for(p=v=0;v<w;)d();if(0===p){for(p=v=0;8>v;)d();e[m]=[p];p=m++;0===--l&&(l=1<<k++)}else if(1===p)return b;w=p<e.length?e[p]:f.concat(f[0]);for(let C=0;C<w.length;C++)b[h++]=
w[C];e[m++]=f.concat(w[0]);f=w;0===--l&&(l=1<<k++)}return null};let T=null;if(cb){let a,b;null==(a=ya.storage)||null==(b=a.persist)||b.call(a);const c=cb.open("minicraft",1);c.onupgradeneeded=d=>{d=d.target.result.createObjectStore("chunks",{keyPath:["world","coords"]});for(const e of mb(N))if(e.startsWith("minicraft.world.")){const [l,m]=e.substr(16).split(":");"meta"!==m&&(d.add({world:P(l),coords:m,data:N.getItem(e)}),bb(e))}};c.onsuccess=d=>{T=d.target.result}}
const Qb=(a,b)=>aa(function*(){if(!T)return N.getItem(`minicraft.world.${a}:${b}`);const c=T.transaction("chunks","readonly").objectStore("chunks").get([a,b]);return new Ya(d=>{c.onsuccess=()=>{let e;d(null==(e=c.result)?void 0:e.data)}})}()),Rb=(a,b)=>{var c=Ob();return aa(function*(){if(!T)return ab(`minicraft.world.${a}:${b}`,c);const d=T.transaction("chunks","readwrite").objectStore("chunks").put({world:a,coords:b,data:c});return new Ya((e,l)=>{d.onsuccess=()=>{e()};d.onerror=()=>{l(d.error)}})}())},
Sb=(a,b)=>aa(function*(){if(!T)return bb(`minicraft.world.${a}:${b}`);const c=T.transaction("chunks","readwrite").objectStore("chunks").delete([a,b]);return new Ya(d=>{c.onsuccess=()=>{d()}})}()),Tb=a=>aa(function*(){const b=`minicraft.world.${a}:`;if(!T){const e={},l=b.length;for(const m of mb(N))m.startsWith(b)&&(e[m.substr(l)]=N.getItem(m));return e}const c=T.transaction("chunks","readonly").objectStore("chunks").openCursor(),d={meta:N.getItem(b+"meta")};return new Ya(e=>{c.onsuccess=()=>{const l=
c.result;l?(l.value.world===a&&(d[l.value.coords]=l.value.data),l.continue()):e(d)}})}()),Ub=(a,b)=>aa(function*(){if(T){var c=T.transaction("chunks","readwrite"),d=c.objectStore("chunks");for(const [e,l]of nb(b))"meta"!==e?d.put({world:a,coords:e,data:l}):ab(`minicraft.world.${a}:meta`,l);return new Ya((e,l)=>{c.oncomplete=()=>{e()};c.onerror=()=>{l(c.error)}})}for(const [e,l]of nb(b))ab(`minicraft.world.${a}:${e}`,l);ab("__margin",Array(257).join("x"));bb("__margin")}()),Vb=a=>{if(T){bb(`minicraft.world.${a}:meta`);
var b=T.transaction("chunks","readwrite").objectStore("chunks").openCursor();b.onsuccess=()=>{const c=b.result;c&&(c.value.world===a&&c.delete(),c.continue())}}else{const c=`minicraft.world.${a}:`;for(const d of mb(N))d.startsWith(c)&&bb(d)}},Wb=(a,b)=>{if(T){ab(`minicraft.world.${b}:meta`,N.getItem(`minicraft.world.${a}:meta`));bb(`minicraft.world.${a}:meta`);var c=T.transaction("chunks","readwrite").objectStore("chunks"),d=c.openCursor();d.onsuccess=()=>{const e=d.result;e&&(e.value.world===a&&
(e.value.world=b,c.put(e.value)),e.continue())}}else{const e=`minicraft.world.${a}:`,l=e.length,m=`minicraft.world.${b}:`;for(const k of mb(N))if(k.startsWith(e)){const f=N.getItem(k);bb(k);ab(m+k.substr(l),f)}}},Xb=new fb(1024),Nb=new eb(Xb.buffer),Yb=new kb,Zb=(a,b,c,d)=>0>c||63<c?0:a.Z[(b<<a.K+4|d)<<6|c],$b=(a,b,c,d)=>{const e=a.K;a.Z[(b<<e+4|d)<<6|c]=0;a.$[(b>>4<<e|d>>4)<<2|c>>4].ja=!0},ac=(a,b,c,d,e)=>{const l=a.K,m=(b<<l+4|d)<<6|c;if(0<a.Z[m])return!1;a.Z[m]=e;return a.$[(b>>4<<l|d>>4)<<2|c>>
4].ja=!0},dc=(a,b,c)=>{const d=Ia(M(b.H,63),0)>>4,e=L(b.G)>>4;b=L(b.J)>>4;if(c||a.Ma!==d||a.va+a.La!==e||a.wa+a.Na!==b)c=1<<a.K,a.Ma=d,a.va=e-(a.La=(65536+e)%c),a.wa=b-(a.Na=(65536+b)%c),bc(a);a.busy||cc(a,!1)},bc=a=>{const b=a.La,c=a.Ma,d=a.Na,e=a.K,l=`${e} ${b} ${d} ${c}`;let m=Yb.get(l);if(null==m){const k=1<<e,f=vb(.5*k);Yb.set(l,m=a.$.map(({x:w,y:h,z:p},v)=>{let z=vb(w-b),g=vb(p-d),r=vb(w-b-k),C=0,u=0;r<z&&(z=r,C=-k);(r=vb(w-b+k))<z&&(z=r,C=k);(r=vb(p-d-k))<g&&(g=r,u=-k);(r=vb(p-d+k))<g&&(g=
r,u=k);return{Za:z+g+vb(h-c),lb:v,va:C,wa:u}}).filter(({Za:w})=>w<=f).sort((w,h)=>w.Za-h.Za))}a.Ia=m;a.sa=0},fc=(a,b)=>{if(!a.pb){for(var c=b.B.map(({c:d})=>d&&[d.id,d.amount,d.data]);0<c.length&&null===c[c.length-1];)c.pop();ab(`minicraft.world.${a.id}:meta`,Za({p:{h:b.rb,i:c,m:b.l,p:[b.G,b.H,b.J,b.O,b.ha]},s:[a.Aa,a.Ba,a.Ca],t:a.time,v:1}));Ya.all(a.$.filter(d=>d.ja).map(d=>ec(a,d)))}},hc=(a,b)=>{const c=N.getItem(`minicraft.world.${a.id}:meta`);if(c){const {p:d,s:e,t:l,v:m}=$a(c);null!=m&&(d.i.forEach((k,
f)=>{k&&(b.B[f].c=Gb(k[0],k[1],k[2]))}),b.rb=d.h,b.l=d.m,b.G=d.p[0],b.H=d.p[1],b.J=d.p[2],b.O=d.p[3],b.ha=d.p[4],a.Aa=e[0],a.Ba=e[1],a.Ca=e[2],null!=l&&gc(a,l))}},gc=(a,b)=>{a.time=b%24E3;a.eb=(b+6E3)/24E3%1},tc=a=>aa(function*(){const b=a.$[a.Ia[a.sa=0].lb];var c=b.y;yield Sb(a.id,`${b.Fa}/${b.Ta}`+(0<c?"/"+c:""));b.ja=!1;++b.Fa;return cc(a,!1)}()),ec=(a,b)=>{const c=a.Ga;var d=a.K;const e=b.y,l=(256<<d)-256;for(let m=0,k=-1,f=((b.x<<d+4|b.z)<<6|e)<<2;16>m;++m){for(d=0;16>d;++d)Xb[++k]=c[f],Xb[++k]=
c[++f],Xb[++k]=c[++f],Xb[++k]=c[++f],f+=13;f+=l}b.ja=!1;return Rb(a.id,`${b.Fa}/${b.Ta}`+(0<e?"/"+e:""))},cc=(a,b)=>aa(function*(){const c=a.$,d=a.Ia,e=a.va,l=a.wa,m=d.length;for(;a.sa<m;){var k=d[a.sa++],f=c[k.lb],w=f.l,h=f.x;const g=f.y;var p=f.z,v=e+k.va+h;const r=l+k.wa+p;if(!w||v!==f.Fa||r!==f.Ta){f.l=a.busy=!0;k=f.ja&&ec(a,f);var z=a.id;v=f.Fa=v;f=f.Ta=r;f=Pb(yield Qb(z,`${v}/${f}`+(0<g?"/"+g:"")));yield k;a.busy=!1;if(w||0===g||f){k=a.Ga;v=a.K;z=(256<<v)-256;h=((h<<v+4|p)<<6|g)<<2;if(f)for(let C=
0,u=-1;16>C;++C){for(w=0;16>w;++w)k[h]=Xb[++u],k[++h]=Xb[++u],k[++h]=Xb[++u],k[++h]=Xb[++u],h+=13;h+=z}else for(p=0;16>p;++p){for(f=0;16>f;++f)k[h]=0<g?0:50397446,k[++h]=0<g?0:131843,w?(k[++h]=0,k[++h]=0,h+=13):h+=15;h+=z}if(!b)break}}}}());let uc=null,vc=null;
const wc=new gb,xc=a=>{if(a){const b=vc=new Image;b.onload=()=>{if(vc===b){var c=wa.createElement("canvas");c.width=16;c.height=416;c=c.getContext("2d");c.scale(1,-1);for(let d=0;26>d;++d)c.drawImage(b,0,d<<4,16,16,0,-(d<<4)-16,16,16);uc=new fb(c.getImageData(0,0,16,416).data.buffer);for(const d of wc)d.P=!0;vc=null}};b.src=`${"/static/minicraft/"}textures/${a}.png`}else uc=null},zc=(a,b)=>{const c={yb:b,Wa:b.getContext("2d",{alpha:!1,desynchronized:!0}),jb:null,kb:null,ob:"",P:!1,qb:0,$a:0,zb:pb(()=>
(c.qb=c.$a,c.$a=0),1E3),o:a};wc.add(c);yc(c);return c},yc=a=>{const b=a.yb,c=a.o;a.kb=new fb((a.jb=a.Wa.createImageData(b.width=c.ya,b.height=c.za)).data.buffer);const d=c.ya*c.config.Y/c.la,e=c.za*c.config.Y/c.la;b.style.width=d+"px";b.style.height=e+"px";b.style.left=Ha((c.Pa-d)/2)+"px";b.style.top=Ha((c.Qa-e)/2)+"px";a.Wa.fillStyle="rgba(255,255,255,.5)"};let Ac=0;
const Dc=(a,b,c,d)=>{const e={Z:null,Ga:null,busy:!1,$:null,Ia:null,sa:0,pb:!1,La:0,Ma:0,Na:0,id:c.Ea,va:0,wa:0,K:0,Aa:.5,Ba:8.5,Ca:.5,time:0,eb:0},l=Jb(e,d);hc(e,l);const m={a,config:c,mb:0,nb:0,Ka:!1,ta:!0,A:!0,Ab:b,ca:0,X:new gb,ab:"",j:0,N:[],g:l,bb:null,u:null,la:1,Pa:1,Qa:1,ya:0,za:0,Ra:0,ub:0,Sa:0,Cb:pb(()=>{var k;(k=m.A)||(gc(e,e.time+1),dc(e,l,!1),k=void 0);return k},50),world:e};Bc(m,null);Cc(m);return m},Ec=a=>{a.world.pb||(fc(a.world,a.g),a.a.U(a.world.id,{mod_l:Pa.now()}))},Cc=a=>{aa(function*(){if(!a.config.ka)try{yield a.Ab.requestPointerLock()}catch(b){}}())},
Fc=(a,b)=>a===b?0:.1-.2*a,Gc=a=>{a.g.Ua=Fc((a=a.X).has(-12)||a.has(65),a.has(-13)||a.has(68))},Hc=a=>{a.g.ib=Fc((a=a.X).has(-15)||a.has(16),a.has(-14)||a.has(32))},Ic=a=>{a.g.Va=Fc((a=a.X).has(-11)||a.has(83),a.has(-10)||a.has(87))},Jc=a=>{a.g.vb=Fc(a.X.has(-18),a.X.has(-19))},Kc=a=>{a.g.wb=Fc(a.X.has(-17),a.X.has(-16))},Mc=(a,b,c)=>{if(!a.world)return!1;const d=a.X;var e=a.g;if(c){if(d.has(b))return!1;d.add(b);var l=e.aa,m=e.V;c=e.ba;switch(b){case -18:case -19:Jc(a);break;case -17:case -16:Kc(a);
break;case -1:2!==e.l&&0<=m&&(0===e.Oa?0===e.l&&(b=Zb(a.world,l,m,c),2===b?b=3:1===b&&(b=4),6===b||8!==b&&13!==b&&null!==Ib(e.B,Gb(b,1)))||($b(a.world,l,m,c),e.V=-1):Lc(a,[l,m,c],!1));break;case -2:case 71:if(0<=m){const k=Zb(a.world,l,m,c);c=e.B.slice(0,9);m=c.findIndex(f=>null!==f.c&&f.c.id===k);0<=m?e.L=m:1===e.l&&(c[e.L].c&&(c=c.findIndex(f=>null===f.c),0<=c&&(e.L=c)),e.B[e.L].c=Gb(k));e.ma=a.ca}break;case -3:if(2!==e.l&&0<=m)if(0===e.Oa){if(b=e.B[e.L],b.c){switch(e.pa){case 0:--l;break;case 1:++l;
break;case 2:--m;break;case 3:++m;break;case 4:--c;break;case 5:++c}0<=m&&64>m&&ac(a.world,l&(1<<4+a.world.K)-1,m,c&(1<<4+a.world.K)-1,b.c.id)&&1!==e.l&&0>=--b.c.amount&&(b.c=null)}}else Lc(a,[l,m,c],!0);break;case -4:e.L=(e.L+9-1)%9;e.ma=a.ca;break;case -5:e.L=(e.L+1)%9;e.ma=a.ca;break;case 27:0===a.j&&(a.A=!0,a.j=1);break;case -15:case -14:case 16:case 32:Hc(a);break;case 49:case 50:case 51:case 52:case 53:case 54:case 55:case 56:case 57:e.L=b-49;e.ma=a.ca;break;case -12:case -13:case 65:case 68:Gc(a);
break;case 69:if(0===a.j){a.j=3;for(const k of d)Mc(a,k,!1)}break;case 80:a.world&&(a.A=!0);break;case 81:e=e.B[e.L];if(d.has(17)||e.c&&0>=--e.c.amount)e.c=null;break;case -11:case -10:case 83:case 87:Ic(a);break;case 84:if(0===a.j){a.j=2;for(const k of d)Mc(a,k,!1)}break;case 112:a.ta=!a.ta;break;case 114:a.Ka=!a.Ka;case 116:case 122:case 123:break;default:return!1}}else{if(!d.delete(b))return!1;switch(b){case -15:case -14:case 16:case 32:Hc(a);break;case -12:case -13:case 65:case 68:Gc(a);break;
case -11:case -10:case 83:case 87:Ic(a);break;case -18:case -19:Jc(a);break;case -17:case -16:Kc(a)}}a.ab=[...d].join();return!0},Nc=(a,b)=>(b=b.startsWith("~")?a+P(b.substr(1)):P(b),isNaN(b)?a:b),Pc=(a,b)=>{var c=a.g,d=a.world;if(b)if("/"===b.charAt(0)){b=b.substr(1).split(" ");const e=b.shift();switch(e){case "clear":a.N=[];break;case "clearinv":for(const l of c.B)l.c=null;Y(a,"Inventory cleared.",!0);break;case "gamemode":case "gm":b=P(b[0]);!isNaN(b)&&0<=b&&3>b&&0===b%1?(c.l=b,Y(a,"Game mode set to: "+
b,!0)):Y(a,"Game mode must be in 0..2!");break;case "give":if(0===b.length){Y(a,"/give <id> [Amount]\n"+Eb.join(" "));break}d=Eb.indexOf((b[0]||"").toLowerCase());d=0<=d?d:P(b[0]);b=P(b[1]||1);!isNaN(d)&&0<d&&25>d&&0===d%1?!isNaN(b)&&0<b&&0===b%1?Y(a,Ib(c.B,Gb(d,b))?"Inventory is full!":`${"Gave items"} ${b} ${Eb[d]}`,!0):Y(a,"Amount must be at least 1!"):Y(a,"Invalid block type!");break;case "help":Y(a,"Commands: clear, clearinv, gamemode, give, help, load, me, save, spawn, teleport, time, version");
break;case "load":cc(d,!0).then(()=>{a.u.P=!0;Y(a,"Chunks l.",!0)});break;case "me":Y(a,c.name+" "+b.join(" "),!0);break;case "save":Ec(a);Y(a,"Game saved.",!0);break;case "spawn":d.Aa=c.G;d.Ba=c.H;d.Ca=c.J;Y(a,"Spawn updated.",!0);break;case "teleport":case "tp":0===b.length?(c.G=d.Aa,c.H=d.Ba,c.J=d.Ca,a.u.P=!0,Y(a,"Teleported to spawn.",!0)):3===b.length?(Y(a,"Teleported to"+` ${c.G=Nc(c.G,b[0])} ${c.H=Nc(c.H,b[1])} ${c.J=Nc(c.J,b[2])}`,!0),a.u.P=!0):Y(a,"Pitch!");c.da=0;c.ea=0;c.fa=0;break;case "time":c=
b[1];if(!c){Y(a,"Parameter missing!");break}if("day"===c)c=1E3;else if("night"===c)c=13E3;else if(isNaN(c=L(P(c))))break;switch(b[0]){case "add":c+=d.time;case "set":gc(d,c);Y(a,"Time set to: "+d.time,!0);break;default:Y(a,"Unknown command: time "+b[0])}break;case "version":Y(a,"minicraft 0.11.4");break;case "/exit":c.Oa=0;Y(a,"Normal mouse mode.",!0);break;case "/expand":a.g.qa&&a.g.ra?d=!0:(Y(a,"Selection required!"),d=!1);d&&("vert"===b[0]?(c.qa[1]=0,c.ra[1]=63,Y(a,"Expanded selection.",!0)):Y(a,
'Only "vert" supported!'));break;case "/pos1":case "/pos2":Lc(a,[L(c.G),L(c.H),L(c.J)],"/pos2"===e);break;case "/regen":tc(d).then(()=>{a.u.P=!0;Y(a,"Chunk regenerated.",!0)});break;case "/show":Y(a,`${"Primary"}: ${c.qa?c.qa.join(" "):"none"}, ${"Secondary"}: ${c.ra?c.ra.join(" "):"none"}`);break;case "/wand":c.Oa=1;Y(a,"Select using mouse buttons.",!0);break;default:Y(a,"Unknown command: "+e)}}else{const e=Y(a,`<${c.name}> `+b);Bc(a,b).then(l=>{l&&Oc(a,e)})}},Y=(a,b,c=!1)=>{const d=++Ac;(a.N=a.N.slice(-49)).push({id:d,
tb:c,time:ua(),value:b});return d},Oc=(a,b)=>{const c=a.N.findIndex(d=>d.id===b);0<=c&&a.N.splice(c,1)},Lc=(a,b,c)=>{c?a.g.ra=b:a.g.qa=b;Y(a,`${c?"Secondary point":"Primary point"}: ${b.join(" ")}`,!0)},Bc=(a,b)=>(qb(a.bb),(b?db("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:Za({msg:b})}):db("/api/chat")).then(c=>{if(c.ok)return c.text()}).then(c=>{if(c){c=c.split("\n").filter(Boolean);for(const d of c)d.startsWith("<")&&Y(a,d);return 0<c.length}return!1}).catch(()=>!1).then(c=>
{a.bb=ob(()=>{Bc(a,null)},5E3);return c})),Qc=({id:a,M:b})=>(A("div[className=bitmap]",{S:{backgroundImage:`url(${"/static/minicraft/"}textures/${b}.png)`,backgroundPositionY:`-${2*(a-1)}rem`}}),null);function Rc({amount:a,l:b,id:c,M:d}){A("div[className=stack]",{title:Eb[c]+(1===b?` (${c})`:"")});return[G(Qc,{id:c,M:d}),1!==a&&H("div[className=amount]",{innerText:a})]}
function Sc({g:a,M:b,na:c}){A("div[className=bar]",{ontouchstart:F(e=>{a.L=Number(e.target.closest("[data-slot]").dataset.slot);a.ma=e.timeStamp}),S:{opacity:Ia(.5,M(1,1-5E-4*(c-a.ma-5E3)))}});const d=a.l;return a.B.slice(0,9).map(({c:e},l)=>H("div",{D:{slot:l},F:{active:l===a.L}},[e&&G(Rc,{amount:e.amount,data:e.data,l:d,id:e.id,M:b})]))}
function Tc({Bb:a,M:b}){A("div[className=grid]",{onclick:({target:c})=>{(c=c.closest("[data-id]"))&&Hb({c:Gb(P(c.dataset.id)),filter:null,W:64},a)}});return Eb.map((c,d)=>0<d&&H("div",{D:{id:d}},[G(Rc,{amount:1,data:null,l:1,id:d,M:b})]))}
function Uc({o:a,M:b}){const c=ia(()=>({c:null,filter:null,W:64})),d=a.g.l;A("div[className=menu overlay inventory]",ia(()=>({onclick:({target:e})=>{if("menu overlay inventory"===e.className)c.c?c.c=null:(a.j=0,a.A=!1,Cc(a));else if(e=e.closest("[data-slot]"))e=a.g.B[P(e.dataset.slot)],c.c?Hb(c,e):e.c&&Hb(e,c)},oncontextmenu:({target:e})=>{if("menu overlay inventory"===e.className)c.c?0>=--c.c.amount&&(c.c=null):(a.j=0,a.A=!1,Cc(a));else if(e=e.closest("[data-slot]"))e=a.g.B[P(e.dataset.slot)],c.c?
Hb(c,e,1):e.c&&Hb(e,c,Ga(e.c.amount/2))}})));return[H("div[className=window]",null,[H("h2[innerText=Inventory]"),1===d&&G(Tc,{Bb:c,M:b}),H("div[className=grid]",null,a.g.B.map(({c:e},l)=>H("div",{D:{slot:l},F:{first:9>l}},[e&&G(Rc,{amount:e.amount,data:e.data,l:d,id:e.id,M:b})])))]),c.c&&H("div[className=hand]",{S:{transform:`translate(${a.mb}px, ${a.nb}px)`}},[G(Rc,{amount:c.c.amount,data:c.c.data,l:0,id:c.c.id,M:b})])]}
const Vc=({I:{tb:a,time:b,value:c},na:d})=>(A(a?"div[className=minor]":"div",{innerText:c,S:{opacity:M(1,1-.001*(d-b-4500))}}),null);function Wc({N:a,na:b}){A("div[className=messages]");const c=b-5E3;return[qa(Vc,a.slice(-10).filter(d=>d.time>c),{na:b})]}function Xc({I:a,ia:b,current:c}){A("button",{disabled:a.id===c,innerText:`${a.label} (${a.owner})`,onclick:()=>{b({T:a.id})}});return null}
function Yc({a:{ia:a},config:b,o:c,oa:d}){c&&D(()=>Ec(c));const [e,l]=oa(!1),m=ha(()=>e?db("/static/minicraft/textures.json").then(k=>k.ok?k.json():null).catch(()=>null):Ya.resolve(null),[e],null);A("div[className=menu overlay]");return[H("h1",{innerText:e?"Surfaces":"Settings"}),H("center",null,[H("button",{innerText:c&&!e?"Back to game":"Back",onclick:()=>{e?l(!1):c?(c.j=0,c.A=!1,Cc(c)):d(2)}})]),!e&&H("div[className=settings]",null,[H("button[innerText=Surfaces...]",{onclick:()=>{l(!0)}}),H("label[innerText=Resolution:]",
null,[H("input[type=range][min=1][max=100][step=1]",{value:101-b.Y,onchange:k=>a({Y:101-Number(k.target.value)})})]),H("label[innerText=View angle:]",null,[H("input[type=range][min=1][max=180][step=1]",{value:b.Da,onchange:k=>a({Da:Number(k.target.value)})})]),H("label[innerText=View distance:]",null,[H("input[type=range][min=1][max=128][step=1]",{value:b.ga,onchange:k=>a({ga:Number(k.target.value)})})]),H("label[innerText=Pixel grouping:]",null,[H("input[type=range][min=1][max=8][step=1]",{value:b.xa,
onchange:k=>a({xa:Number(k.target.value)})})]),H("label[innerText=Mouse sensitivity:]",null,[H("input[type=range][min=1][max=15][step=1]",{value:b.ua,onchange:k=>a({ua:Number(k.target.value)})})]),H("button[innerText=Project page]",{onclick:()=>{open("//github.com/L3P3/minicraft")}})]),c&&!e&&H("center",null,[H("button[innerText=Leave world]",{onclick:()=>{d(2)}})]),e&&H("div[className=settings]",null,[H("button[innerText=Plain]",{disabled:0===b.T,onclick:()=>{a({T:0})}}),m&&qa(Xc,m,{ia:a,current:b.T})])]}
const Zc=({I:{tb:a,value:b}})=>(A(a?"div[className=minor]":"div",{innerText:b}),null);
function $c({o:a,N:b}){const c=F({history:null,input:null});A("div[className=menu overlay terminal]",{onclick:d=>{d.target!==c.input&&c.input.focus()}});D(d=>{d&&ob(()=>c.history.scrollTop=1E9,0)},[b.length&&b[b.length-1].id]);return[F(H("div[className=toolbar]",null,[H("button[innerText=\u274c]",{onclick:()=>{a.j=0;a.A=!1;Cc(a)}})])),H("div[className=history]",{R:F(d=>{c.history=d})},[qa(Zc,b)]),F(H("input[enterkeyhint=send][mozactionhint=send][name=message][required]",{onkeydown:d=>{const e=d.keyCode;
d=d.target;13===e?(Pc(a,d.value),d.value=""):27===e&&(a.j=0,a.A=!1,Cc(a))},R:d=>{c.input=d;ob(()=>d.focus(),0)}}))]}const ad=[["pick",-2],["up",-14],["down",-15],["E",69],["T",84],["F1",112],["F3",114],["...",27]],bd=[["up",-10],["down",-11],["left",-12],["right",-13],["center",-1]],cd=[["up",-16],["down",-17],["left",-18],["right",-19],["center",-3]];
function dd({o:a}){const b=a.X,c=([d,e])=>H("div",{D:{code:e},F:{button:!0,[d]:!0,active:b.has(e)}});A("div[className=touch]",F({ontouchstart:d=>{let {code:e}=d.target.dataset;if(null!=e&&Mc(a,e=P(e),!0)){const l=d.changedTouches[0].identifier,m=k=>{k.changedTouches[0].identifier===l&&(tb("touchend",m),Mc(a,e,!1))};sb("touchend",m)}return!1}}));return[H("div[className=top]",null,ad.map(([d,e])=>H(`div[innerText=${d}]`,{D:{code:e},F:{button:!0,active:b.has(e)}}))),H("div[className=move]",null,bd.map(c)),
H("div[className=move sec]",null,cd.map(c))]}
function ed({account:a,a:b,config:c,frame:d,cb:e,oa:l}){const m=ua(),k=wa.pointerLockElement===d,f=ia(()=>e.o=Dc(b,d,c,a));D(()=>{const h=g=>{if(0!==f.j)return!0;wa.pointerLockElement===d?Mc(f,-1-g.button,"mousedown"===g.type):Cc(f);return!1},p=g=>{if(wa.pointerLockElement===d){const r=f.config.ua*za/(Ia(f.Pa,f.Qa)*f.la);ub&&(f.ub=g.timeStamp);Kb(f.g,f.Ra=g.movementX*r,f.Sa=-g.movementY*r)}else f.mb=g.clientX,f.nb=g.clientY},v=g=>{b.Ja(!1);if(0===f.j&&!f.A&&5<Math.abs(g.deltaY))return g=0<g.deltaY?
-5:-4,Mc(f,g,!0),Mc(f,g,!1),!1},z={passive:!0};d.addEventListener("mousedown",h);d.addEventListener("mouseup",h);d.addEventListener("mousemove",p,z);d.addEventListener("wheel",v,z);return()=>{d.removeEventListener("mousedown",h);d.removeEventListener("mouseup",h);d.removeEventListener("mousemove",p,z);d.removeEventListener("wheel",v,z);qb(f.bb);rb(f.Cb);fc(f.world,f.g);var g=f.u;wc.delete(g);rb(g.zb);e.o=null}});D(()=>{f.config=c;f.u&&(f.u.P=!0);const h=f.world;var p=Ga(Ma(f.config.ga/16*2+2));if(h.K!==
p){var v=f.g;h.$&&fc(h,v);const z=1<<(h.K=p),g=h.$=[];for(let r=0;r<z;++r)for(let C=0;C<z;++C)for(let u=0;4>u;++u)g.push({ja:!1,l:!1,x:r,y:u,z:C,Fa:0,Ta:0});p=z<<p+12+2;null===h.Z||h.Z.length<p?h.Ga=new fb((h.Z=new eb(p)).buffer):h.Ga.fill(0);dc(h,v,!0)}},[c]);D((h,p,v)=>{f.la=v;f.Pa=Ia(1,h);f.Qa=Ia(1,p);p=f.config.Y;h=Ga(f.Pa*f.la/p);p=Ga(f.Qa*f.la/p);if(h!==f.ya||p!==f.za)f.ya=h,f.za=p,f.u&&(f.u.P=!0,yc(f.u))},[d.offsetWidth,d.offsetHeight,va.devicePixelRatio||1,c.Y]);D(h=>{h||f.A||0!==f.j||(f.j=
1,ub&&f.Ra|f.Sa&&f.ub>m-100&&(Kb(f.g,-f.Ra,-f.Sa),f.Ra=f.Sa=0,f.u.P=!0));f.A=!h},[c.ka&&0===f.j||k]);D(h=>k&&h&&wa.exitPointerLock(),[f.A||0!==f.j]);D(()=>{if(f.world){if(f.ca&&!f.A){var h=f.g,p=M(5,.01*(m-f.ca));h.da-=.1*h.da*p;h.ea-=.1*h.ea*p;h.fa-=.1*h.fa*p;h.da+=(Ja(h.O)*h.Ua+Ka(h.O)*h.Va)*p;h.ea+=h.ib*p;h.fa+=(-Ka(h.O)*h.Ua+Ja(h.O)*h.Va)*p;Kb(h,h.vb*p*1.5,h.wb*p*1.5);h.G+=h.da*p;h.H+=h.ea*p;h.J+=h.fa*p}if(f.u){h=f.u;++h.$a;p=h.Wa;var v=h.jb;const Z=h.kb,ka=h.o,Qa=ka.config,yb=ka.ta,y=ka.g,O=
ka.ya,ra=ka.za,R=ka.world;var z=0;if(!ka.A||h.P){h.P=!1;var g=Qa.xa;const id=Qa.ga;var r=y.O,C=y.ha;const jd=y.aa,kd=y.ba,Ra=y.l;var u=y.G;z=y.H;var E=y.J;const ld=yb?y.V:-1,md=R.Z;var S=R.K;const nd=null!==uc;var t=1/O,q=1/ra;const la=O>>1,sa=ra>>1,ic=M(O,ra),jc=32<ic,kc=Ja(r);r=Ka(r);const lc=Ja(-C);C=Ka(-C);var x=Qa.Da/45;const od=t*(O<ra?x*O*q:x);t=q*(ra<O?x*ra*t:x);u+=65536;q=z+65536;E+=65536;x=u%1;const pd=q%1,qd=E%1;S=4+S;const Ca=(1<<S)-1;g=g<O?g:1;const rd=O-g;let mc=1===y.l?6:4,Sa=y.aa=
y.ba=y.pa=0,nc=0;y.V=-1;z=0>z||64<=z?0:Zb(R,u&Ca,q&63,E&Ca);if(2!==Ra&&0<z)y.aa=u&Ca,y.V=q&63,y.ba=E&Ca,y.pa=6,Z.fill(Fb[z]|4278190080);else{for(let Ta=0;Ta<ra;++Ta){var B=(sa-Ta)*t;const oc=B*lc-C;var Da=B*C+lc;B=Da*r;Da*=kc;let ma=0,Ea=!1;var ca=!1;a:for(let U=0;U<O;U+=g)for(let da=ca?1:0;da<g;++da){if(2>g)var I=U;else if(0===U)I=0===da?0:1===da?g:da-1,Ea=1===da;else if(U<rd)I=(Ea=1===da)?U+g:U+da-1;else{if((I=0===da?U-1:U+da)>=O)break a;Ea=!1}var V=(I-la)*od;ca=B+kc*V;const pc=Da-r*V,sd=nc;V=16757124;
let hb=1,qc=id,ib=0;2===Ra&&0<z&&(ib=10*Fa());for(let zb=0;3>zb;++zb){const W=(sd+zb)%3;let ea=pc;var J=qd;0===W&&(ea=ca,J=x);1===W&&(ea=oc,J=pd);var ta=-1/ea;0<ea&&(J=1-J,ta*=-1);const jb=ca*ta,xa=oc*ta;ta*=pc;const rc=La(jb*jb+xa*xa+ta*ta);let Ua=u+jb*J-(0===W&0>ea|0),Va=q+xa*J-(1===W&0>ea|0),Wa=E+ta*J-(2===W&0>ea|0);J*=rc;for(let Ab,Bb,Cb,X;J<qc;Ua+=jb,Va+=xa,Wa+=ta,J+=rc)if(!(2===Ra&&J<ib))if(65536>Va){if(0>xa)break}else if(65600<=Va){if(0<xa)break}else if(0!==(X=md[((Ab=Ua&Ca)<<S|(Cb=Wa&Ca))<<
6|(Bb=Va&63)])){2!==Ra&&Ta===sa&&I===la&&J<=mc&&(y.aa=Ab,y.V=Bb,y.ba=Cb,y.pa=0>ea|W<<1,mc=J);if(nd){--X;1===W?6===X?X=25:13===X?X=4:1===X&&0<xa&&(X=2):1===X&&(X=24);const sc=uc[X<<8|(16*(1===W?Wa:Va)&15)<<4|16*(1===W?Ua:(0<ea?Ua-Wa:Wa-Ua)+65536)&15];if(0===sc>>>24)continue;V=sc&16777215}else V=Fb[X];qc=J;hb=(0===W?.8:2===W?.6:0<ea?.4:1)+(Bb!==ld||Ab!==jd||Cb!==kd?0:.2);nc=W;break}else 2===Ra&&J<ib&&(ib=J)}V=4278190080|M((V>>16)*hb,255)<<16|M((V>>8&255)*hb,255)<<8|M((V&255)*hb,255);if(ca=(Ea=Ea&&(Ta!==
sa||I<la||I>la+g))&&ma===V){if(6<g){Z.fill(ma,Sa+U+1,Sa+U+g+1);break}I=Sa+U+1;Z[I]=ma;Z[++I]=ma;if(3>g)break;Z[++I]=ma;if(4>g)break;Z[++I]=ma;if(5>g)break;Z[++I]=ma;if(6>g)break;Z[++I]=ma;break}if(Ea||0===I)ma=V;Z[Sa+I]=V}Sa+=O}yb&&!jc&&(Z[O*sa+la]^=16777215)}p.putImageData(v,0,0);yb&&jc&&(v=M(Ga(.05*ic),8),p.fillRect(la-v,sa-1,v<<1,2),p.fillRect(la-1,sa-v,2,v-1),p.fillRect(la-1,sa+1,2,v-1))}h.ob=ka.Ka?`minicraft ${"0.11.4"} ${L(h.qb).toString().padStart(2,"\u00a0")} fps, T: ${L(24*R.eb).toString().padStart(2,
"0")}:${L(24*R.eb%1*60).toString().padStart(2,"0")}; ${ka.A&&500>m%1E3?"":R.time}
R: ${O}x${ra} (x${Qa.Y}), D: ${Qa.ga}, C: ${R.sa}/${R.Ia.length}, M: ${64*vb(1<<4+R.K)>>10}k
E: 0/0, M: ${y.l}, I: ${z}

Position: ${y.G.toFixed(2)} ${y.H.toFixed(2)} ${y.J.toFixed(2)}
Angle: ${(y.O*Ba).toFixed(2)} ${(y.ha*Ba).toFixed(2)}
Focus: ${0>y.V?"":y.aa+" "+y.V+" "+y.ba+" "+"WEBTSNI"[y.pa]+": "+Eb[Zb(R,y.aa,y.V,y.ba)]}
Chunk abs: ${L(y.G)>>4} ${L(y.J)>>4} ${L(y.H)>>4} rel: ${R.La} ${R.Na} ${R.Ma}`:""}}f.ca=m},[m]);na();const w=F({fb:1});c.T&&(w.fb=c.T);return[H("canvas",{R:F(h=>{f.u=zc(f,h)})}),f.ta&&2!==f.j&&G(Wc,{N:f.N,na:m}),f.u&&f.Ka&&H("div[className=diagnostics]",{innerText:f.u.ob}),c.ka&&G(dd,{o:f,ab:f.ab}),f.ta&&3!==f.j&&2!==f.g.l&&G(Sc,{g:f.g,M:w.fb,na:m}),3===f.j&&G(Uc,{o:f,M:w.fb,na:m}),1===f.j&&G(Yc,{a:b,config:c,o:f,oa:l}),2===f.j&&G($c,{o:f,N:f.N})]}
function fd({I:a,Db:b,Eb:c,Fb:d}){A("div",{F:{selected:a===c},onclick:()=>{d(a.id)}});c=`${a.local?"L":"_"}${a.local&&a.remote?a.local>a.remote?">":a.local<a.remote?"<":"=":"_"}${a.remote?a.public?"R":"r":"_"}`;b===a.id&&(c=`[${c}]`);return[H("span",{innerText:`${c} ${a.label}`,title:a.account_name?"Owner: "+a.account_name:"Just a local world"}),H("span",{innerText:xb(Ia(a.local,a.remote),!0)})]}const gd={method:"POST",headers:{"Content-Type":"application/json"}};
function hd({account:a,a:b,config:c,oa:d}){A("div[className=menu]");const [e,l,m]=oa(0),k=F(()=>{l(m()+1)}),f=F({value:null}),w=ha(()=>aa(function*(){try{const t=!f.value&&!e,q=yield db(`${"/api/minicraft/"}world?what=${t?"initial":"meta_all"}`);if(!q.ok)throw Error("Connection error.");const x=yield q.json();if(!t)return x;if("0.11.4"!==x.version_latest)return location.reload(!0),null;ba();b.xb(x.account);return x.worlds}catch(t){return alert("Error while loading world list: "+t.message),[]}}()),
[e],null),h=ia(()=>{w&&(f.value=w);const t=[];f.value&&t.push(...f.value.map(q=>({account_name:q.account_name,hash:q.hash,id:q.id,label:q.label,local:0,public:q.public,remote:q.modified,writable:q.writable})));for(const q of c.worlds){const x=t.find(B=>B.id===q.id);if(x){const B=x.local=q.mod_l,Da=x.remote,ca=q.mod_r;B>ca&&Da>ca&&(confirm('Conflict! The world "'+q.label+'" was modified here and somewhere else.\nOK: Take variant from server ('+xb(Da,!1)+") | Cancel: Keep local variant ("+xb(B,!1)+
")")?b.U(q.id,{mod_l:x.local=ca}):b.U(q.id,{mod_r:x.remote=ca}))}else 1<q.mod_r&&w&&w.length&&(alert('The world "'+q.label+'" was not found on the server, so it is a local world now.'),b.U(q.id,{mod_r:0})),t.push({account_name:"",hash:0,id:q.id,label:q.label,local:q.mod_l,public:!1,remote:1===q.mod_r?1:0,writable:!0})}return t.sort((q,x)=>Ia(x.local,x.remote)-Ia(q.local,q.remote))},[w,c.worlds]),[p,v,z]=oa(c.Ea),g=ia(()=>h.find(t=>t.id===p)||null,[p,h]),r=ia(()=>{let t,q;return null!=(q=null==h?void 0:
null==(t=h.find(x=>0<x.local&&0<x.remote&&x.local!==x.remote))?void 0:t.id)?q:null},[h]);D(()=>{if(null!==r){var t=!1,q=h.find(x=>x.id===r);if(q.local<q.remote)db(`${"/static/minicraft/"}worlds/${q.hash}.json`).then(x=>x.json()).then(x=>{if(!t)return Ub(r,x).then(()=>{b.U(r,{mod_l:q.remote,mod_r:q.remote})})}).catch(x=>{t||("QuotaExceededError"===x.name?(alert("Insufficient storage!"),b.hb(r),Vb(r)):alert("Error while downloadedoading world: "+x.message))});else{if(!q.writable){b.U(r,{mod_l:c.worlds.find(B=>
B.id===r).mod_r});return}let x=r;(1===q.remote?db("/api/minicraft/world",Object.assign({},gd,{body:Za({what:"meta",label:q.label})})).then(B=>{if(!B.ok)throw Error(403===B.status?"Missing permission. Logged in?":"Connection error.");return B.json()}).then(B=>{x=B.id}):Ya.resolve()).then(()=>{if(t)throw null;return Tb(r)}).then(B=>{if(t)throw null;return db("/api/minicraft/world",Object.assign({},gd,{body:Za({what:"data",world:x,data:B})}))}).then(B=>{if(!B.ok)throw Error(403===B.status?"Missing permission. Logged in?":
"Connection error.");return B.json()}).then(B=>{ba();x===r?b.U(r,{mod_l:B.modified,mod_r:B.modified}):(Wb(r,x),b.hb(r),b.gb({id:x,label:q.label,mod_l:B.modified,mod_r:B.modified}),t||z()!==r||v(x));t||k();fa()}).catch(B=>{t||(alert("Error while uploading world: "+B.message),ba(),b.U(r,{mod_r:0}),fa())})}return()=>{t=!0}}},[r]);const [C,u]=oa(!1);g||u(!1);const [E,S]=oa(!1);return[H("h1[innerText=Worlds]"),H("button[innerText=Refresh][style=position:absolute;left:0;top:0;height:2rem][title=Reload list]",
{disabled:!w,onclick:k}),H("button[style=position:absolute;right:0;top:0;height:2rem]",{disabled:0<a.rank,innerText:a.rank?a.label:"Login",onclick:()=>{location.href="/account?redir=minicraft"}}),H("div[className=worlds]",null,[qa(fd,h,{Hb:e,Db:r,Eb:g,Fb:v})]),H("center",null,[H("button[innerText=Enter]",{disabled:!g||!g.local||g.remote>g.local,onclick:()=>{ba();b.ia({Ea:g.id});d(0);fa()},title:g?g.local?g.remote>g.local?"The world is still loading!":"Enter selected world":"The world is not downloaded yet!":
"No world selected!"}),H("button[innerText=World...]",{disabled:!g||C,onclick:()=>{u(!0)},title:g?"Show world settings":"No world selected!"})]),H("hr"),H("center",null,[H("button[innerText=New world]",{onclick:()=>{const t=prompt("New world's label:\n(max. 16 characters)","New world");t&&(16<t.length?alert("Name is too long!"):b.gb({id:M(0,...c.worlds.map(q=>q.id))-1,label:t,mod_l:Pa.now(),mod_r:0}))}}),H("button[innerText=Settings]",{onclick:()=>{d(1)}})]),H("center",null,[H("small[innerText=Version 0.11.4 by L3P3]")]),
C&&g&&H("div",{F:{"menu overlay advanced":!0,busy:E},onclick:t=>{"menu overlay advanced"===t.target.className&&u(!1)}},[H("div[className=window]",null,[H("h2",{innerText:`"${g.label}"`,title:g.id}),H("table",null,[!!g.account_name&&H("tr",null,[H("td[innerText=Owner:]"),H("td",{innerText:g.account_name})]),H("tr",null,[H("td[innerText=Modified:]"),H("td",{innerText:xb(Ia(g.local,g.remote),!1)})])]),H("center",null,[H("button[innerText=Rename]",{disabled:E||!g.writable,onclick:()=>{const t=prompt("World's new label:\n(max. 16 characters)",
g.label);!t||t===g.label||16<t.length||(g.local&&b.U(g.id,{label:t}),g.remote&&(S(!0),db("/api/minicraft/world",{method:"POST",headers:{"Content-Type":"application/json"},body:Za({what:"meta",world:g.id,label:t})}).then(q=>{if(!q.ok)throw Error(403===q.status?"Missing permission. Logged in?":"Connection error.");return q.json()}).catch(q=>{alert("Error while editing world: "+q.message)}).then(()=>{S(!1)})))},title:g.writable?"Change world name":"No permission!"}),H("button",{disabled:E||!g.local&&
!g.writable,innerText:g.local?"Delete (local)":"Delete",onclick:()=>{confirm('Really delete world "'+g.label+'"?')&&(g.local?(b.hb(g.id),Vb(g.id)):(S(!0),db("/api/minicraft/world",{method:"DELETE",headers:{"Content-Type":"application/json"},body:Za({what:"world",world:g.id})}).then(t=>{if(!t.ok)throw Error(403===t.status?"Missing permission. Logged in?":"Connection error.");ba();v(null);u(!1);k();S(!1);fa();return t.json()}).catch(t=>{alert("Error while deleting world: "+t.message);S(!1)})))},title:g.local||
g.writable?"Delete world":"No permission!"})]),H("center",null,[H("button",{disabled:E||!g.remote||!g.writable,innerText:`${"Public"}: ${g.public?"Yes":"No"}`,onclick:()=>{S(!0);db("/api/minicraft/world",{method:"POST",headers:{"Content-Type":"application/json"},body:Za({what:"meta",world:g.id,public:!g.public})}).then(t=>{if(!t.ok)throw Error(403===t.status?"Missing permission. Logged in?":"Connection error.");ba();k();S(!1);fa();return t.json()}).catch(t=>{alert("Error while editing world: "+t.message);
S(!1)})},title:g.remote?g.writable?g.public?"Unpublish world":"Publish world":"No permission!":"The world is not upl!"}),H("button",{disabled:E||!w||0<g.local&&0<g.remote||!g.remote&&!a.rank,innerText:g.local?w&&g&&!g.remote?"Upload":"Transfer":"Download",onclick:()=>{g.local?g.remote||b.U(g.id,{mod_r:1}):b.gb({id:g.id,label:g.label,mod_l:1,mod_r:g.remote})},title:w?g.local?g.remote?"The world is present on both sides!":a.rank?"Upload world to server":"Not logged in!":"Download world from server":
"List is loading!"})])])])]}function td({account:a,a:b,config:c,cb:d}){const [e,l]=oa(2),m=A("div[className=game]");return[(2===e||1===e)&&G(hd,{account:a,a:b,config:c,oa:l}),1===e&&G(Yc,{a:b,config:c,o:null,oa:l}),0===e&&G(ed,{account:a,a:b,config:c,frame:m,cb:d,oa:l})]}
function ud(){const [a,b]=ja(Db),c=F({o:null,sb:0});D(()=>{let k=!1;onbeforeunload=onunload=onpagehide=onblur=()=>{k||(k=!0,c.o&&Ec(c.o),b.Xa())};onpageshow=onfocus=()=>{k=!1};setInterval(()=>(b.Xa(),!Oa&&ab("minicraft.lock",Pa.now())),500);sb("touchend",f=>{c.sb=f.timeStamp},!0)});const d=F(k=>{if("INPUT"===k.target.tagName||!c.o)return!0;b.Ja(!1);Mc(c.o,k.keyCode,"keydown"===k.type);return!1}),e=F(()=>{b.Ja(!0)}),l=F(k=>{999<k.timeStamp-c.sb&&b.Ja(!1)}),m=a.config.ka;D(()=>{m?(sb("mousedown",l,
!0),sb("mouseup",l,!0),tb("touchstart",e,!0)):(tb("mousedown",l,!0),tb("mouseup",l,!0),sb("touchstart",e,!0))},[m]);D(xc,[a.config.T]);A("",{onkeydown:d,onkeyup:d,oncontextmenu:wb,ondragstart:wb});return[G(td,{account:a.account,a:b,config:a.config,cb:c})]}function vd(){close();return[H("h1[innerText=minicraft already running!]")]}
if(window.SSR)pa(ud);else if(Oa){const a=new Oa("minicraft.lock"),b=ob(()=>{pa(ud)},100);a.addEventListener("message",c=>{"yes"===c.data?(qb(b),a.close(),pa(vd)):(a.postMessage("yes"),focus())});a.postMessage("anyone there?")}else{const a=P(N.getItem("minicraft.lock")),b=Pa.now()-1E3;a<b?pa(ud):ob(()=>{pa(P(N.getItem("minicraft.lock"))===a?ud:vd)},a-b)};
