function aa(a){function b(d){return a.next(d)}function c(d){return a.throw(d)}return new Promise(function(d,f){function n(l){l.done?d(l.value):Promise.resolve(l.value).then(b,c).then(n,f)}n(a.next())})}
const m=lui,ba=m.defer,da=m.defer_end,ha=m.dom_define,ia=m.hook_async,A=m.hook_dom,F=m.hook_effect,ja=m.hook_memo,ka=m.hook_model,la=m.hook_rerender,ma=m.hook_state,H=m.hook_static,I=m.node,K=m.node_dom,qa=m.node_map,ra=m.now,sa=window,ta=document,M=Math,ua=M.PI,va=.5*ua,wa=180/ua,P=M.floor,xa=M.ceil,Da=M.round,S=M.min,Ea=M.max,Fa=M.cos,Ga=M.sin,Ha=M.sqrt,Ia=M.log2,Ja=String.fromCharCode,Ka=Date,La=JSON,T=La.stringify,Qa=La.parse,U=localStorage,Ra=U.setItem.bind(U),Sa=U.removeItem.bind(U),Ta=Uint8Array,
Ua=Uint32Array,Va=Map,Wa=Number,Xa=Object,Ya=Xa.keys,Za=Xa.entries,$a=setTimeout,ab=setInterval,bb=clearTimeout,fb=clearInterval,W=a=>a*a,gb=()=>!1,hb=(a,b)=>{const c=new Ka;a=new Ka(a);var d=c-a;if(59E3>d)return Da(d/1E3)+"s";if(3E6>d)return Da(d/6E4)+"m";d=a.getFullYear();const f=a.getMonth(),n=a.getDate();let l="";d<c.getFullYear()&&(l=d+"/");if(l||f<c.getMonth())l+=f+1+"/";if(l||n<c.getDate())l+=n;if(b)return l||"heute";l&&(l+="/");b=l+a.getHours()+":";a=a.getMinutes();a=P(a).toString().padStart(2,
"0");return b+a},ib={init:()=>{let a=!1;var b={ia:!0,ra:3,W:4,za:120,da:64,Ba:0,worlds:[]},c=U.getItem("minicraft.config");if(c){c=Qa(c);let d=c.flag_textures;null!=d&&(b.ia=d);null!=(d=c.mouse_sensitivity)&&(b.ra=d);b.W=c.resolution_scaling;b.za=c.view_angle;b.da=c.view_distance;null!=(d=c.world_last)&&(b.Ba=d);null!=(d=c.worlds)?b.worlds=d:U.getItem("minicraft.world.0:meta")&&(b.worlds[0]={id:0,label:(prompt("Es wurde eine namenlose lokale Welt gefunden. Wie soll sie hei\u00dfen?","")||"Unbekannte Welt").substring(0,
16),mod_l:Date.now(),mod_r:0},a=!0)}b={account:{label:"",rank:0},g:b,Ua:b};return a?(b.Ua=null,ib.Ta(b)):b},Ta:a=>{const b=a.g;if(b===a.Ua)return a;Ra("minicraft.config",T({version:"0.9.8",flag_textures:b.ia,mouse_sensitivity:b.ra,resolution_scaling:b.W,view_angle:b.za,view_distance:b.da,world_last:b.Ba,worlds:b.worlds}));return Object.assign({},a,{Ua:b})},ob:(a,b)=>Object.assign({},a,{account:b}),qb:(a,b)=>ib.Va(a,b(a.g)),Va:(a,b)=>Object.assign({},a,{g:Object.assign({},a.g,b)}),ab:(a,b)=>Object.assign({},
a,{g:Object.assign({},a.g,{worlds:[...a.g.worlds,b]})}),bb:(a,b)=>Object.assign({},a,{g:Object.assign({},a.g,{worlds:a.g.worlds.filter(c=>c.id!==b)})}),P:(a,b,c)=>Object.assign({},a,{g:Object.assign({},a.g,{worlds:a.g.worlds.map(d=>d.id===b?Object.assign({},d,c):d)})})},jb="air stone grass dirt cobble planks bedrock log leaves bricks wool sand gravel glass bookshelf obsidian stone_bricks sandstone lapis_block iron_block gold_block diamond_block emerald_block redstone_block quartz_block".split(" "),
kb="Luft Stein Grasblock Erde Bruchstein Holzbretter Grundgestein Stamm Laub Ziegelsteine Wolle Sand Kies Glas B\u00fccherregal Obsidian Steinziegel Sandstein Lapislazuliblock Eisenblock Goldblock Diamantblock Smaragdblock Redstoneblock Quarzblock".split(" "),lb=[0,8487297,4305266,4349313,8092539,5342114,7039851,3561583,4172910,6384533,15526888,10671324,8092798,16447200,4151672,1970708,8092539,9686227,9126695,15198183,5567485,14541182,7920469,662956,14936813],mb="WEBTSN".split(""),nb=(a,b=1,c=null)=>
({amount:b,data:c,id:a}),ob=(a,b,c=a.content.amount)=>{if(b.content)a.content.id===b.content.id?(c=S(c,b.T-b.content.amount),a.content.amount-=c,b.content.amount+=c,0>=a.content.amount&&(a.content=null)):!(a.content.amount<=c&&a.content.amount<=b.T&&b.content.amount<=a.T)||a.filter&&!a.filter(b.content.id)||b.filter&&!b.filter(a.content.id)||([b.content,a.content]=[a.content,b.content]);else if(!b.filter||b.filter(a.content.id))a.content.amount<=c&&a.content.amount<=b.T?[b.content,a.content]=[a.content,
b.content]:(c=S(c,b.T),a.content.amount-=c,b.content=nb(a.content.id,c),0>=a.content.amount&&(a.content=null))},pb=(a,b)=>{for(const c of a)if(c.content&&c.content.id===b.id){const d=S(b.amount,c.T-c.content.amount);c.content.amount+=d;if(0>=(b.amount-=d))return null}for(const c of a)if(!c.content&&(!c.filter||c.filter(b.id)))if(a=S(b.amount,c.T),a<=b.amount){if(c.content=nb(b.id,a),0>=(b.amount-=a))return null}else return c.content=b,null;return b},qb=(a,b)=>({Qa:0,cb:0,Ra:0,O:0,ea:0,Da:0,fa:0,X:-1,
ga:0,ma:null,na:null,u:1,kb:20,G:Array(36).fill(null).map(()=>({content:null,filter:null,T:64})),La:0,name:b.label||"Spieler",H:a.wa,J:a.xa,K:a.ya,mb:0,nb:0,M:0,ka:0,aa:0,ba:0,ca:0}),rb=(a,b,c)=>{a.O=(a.O+b+100*ua)%(2*ua);a.ea=Ea(-va,S(va,a.ea+c))},sb=a=>{a+=32;33<a&&39>a?a++:38<a&&44>a?a+=2:43<a&&127>a?a+=3:126<a&&55258>a?a+=37:55295<a&&(a+=8485);return Ja(a)},tb=a=>a-(63743<a?8517:159<a?69:46<a&&130>a?35:40<a&&46>a?34:34<a&&40>a?33:32),vb=()=>{var a=ub;const b=a.length,c=new Va,d=z=>{k=k<<1|z&1;
15===++t&&(g+=sb(k),k=t=0)},f=()=>{for(let z=0;z<x;++z)d(0)},n=z=>{d(z);d(z>>1);d(z>>2);d(z>>3);d(z>>4);d(z>>5);d(z>>6);d(z>>7)},l=()=>{0===--v&&(v=1<<x++)},p=()=>{if(C)C=!1;else{let z=u.id;for(let G=0;G<x;G++)d(z>>G)}};let e=a[0],g="",k=0,t=2,x=2,v=2,h=2,u={id:h++,Fa:new Va},C=!0;n(e);c.set(e,u);for(let z=1;z<b;++z){const G=u.Fa.get(e=a[z]);G?u=G:(p(),c.has(e)||(l(),f(),n(e),c.set(e,{id:h++,Fa:new Va}),C=!0),u.Fa.set(e,{id:h++,Fa:new Va}),u=c.get(e),l())}p();c.has(e)||(l(),f(),n(e));l();d(1);--x;
f();return g+=sb(k<<15-t)},wb=a=>{var b=ub;if(!a)return null;const c=a.length,d=()=>{t+=(h>>--u&1)<<x++;0===u&&(u=15,h=tb(a.charCodeAt(v++)))};let f=[0,1],n=1,l=3,p=2,e=null;var g=null;let k=0,t=0;g=2;let x=0,v=0,h=tb(a.charCodeAt(v++)),u=15;for(;x<g;)d();if(1===t)return null;for(t=x=0;8>x;)d();e=[t];f[2]=e;for(b[k++]=t;v<=c;){g=p;for(t=x=0;x<g;)d();if(0===t){for(t=x=0;8>x;)d();f[l]=[t];t=l++;0===--n&&(n=1<<p++)}else if(1===t)return b;g=t<f.length?f[t]:e.concat(e[0]);for(let C=0;C<g.length;C++)b[k++]=
g[C];f[l++]=e.concat(g[0]);e=g;0===--n&&(n=1<<p++)}return null},X=new Ua(1024),ub=new Ta(X.buffer),xb=new Va,yb=(a,b,c,d)=>0>c||63<c?0:a.Y[(b<<a.L+4|d)<<6|c],zb=(a,b,c,d)=>{const f=a.L;a.Y[(b<<f+4|d)<<6|c]=0;a.Z[(b>>4<<f|d>>4)<<2|c>>4].ha=!0},Ab=(a,b,c,d,f)=>{const n=a.L,l=(b<<n+4|d)<<6|c;if(0<a.Y[l])return!1;a.Y[l]=f;return a.Z[(b>>4<<n|d>>4)<<2|c>>4].ha=!0},Db=(a,b,c)=>{const d=Ea(S(b.J,63),0)>>4,f=P(b.H)>>4;b=P(b.K)>>4;if(c||a.Ja!==d||a.sa+a.Ia!==f||a.ta+a.Ka!==b)c=1<<a.L,a.Ja=d,a.sa=f-(a.Ia=(65536+
f)%c),a.ta=b-(a.Ka=(65536+b)%c),Bb(a);Cb(a,!1)},Bb=a=>{const b=a.Ia,c=a.Ja,d=a.Ka,f=a.L,n=`${f} ${b} ${d} ${c}`;let l=xb.get(n);if(null==l){const p=1<<f,e=W(.5*p);xb.set(n,l=a.Z.map(({x:g,y:k,z:t},x)=>{let v=W(g-b),h=W(t-d),u=W(g-b-p),C=0,z=0;u<v&&(v=u,C=-p);(u=W(g-b+p))<v&&(v=u,C=p);(u=W(t-d-p))<h&&(h=u,z=-p);(u=W(t-d+p))<h&&(h=u,z=p);return{Wa:v+h+W(k-c),fb:x,sa:C,ta:z}}).filter(({Wa:g})=>g<=e).sort((g,k)=>g.Wa-k.Wa))}a.Ga=l;a.oa=0},Fb=(a,b)=>{for(var c of a.Z)c.ha&&Eb(a,c);for(c=b.G.map(({content:d})=>
d&&[d.id,d.amount,d.data]);0<c.length&&null===c[c.length-1];)c.pop();Ra(`minicraft.world.${a.id}:meta`,T({p:{h:b.kb,i:c,m:b.u,p:[b.H,b.J,b.K,b.O,b.ea]},s:[a.wa,a.xa,a.ya],v:1}))},Gb=(a,b)=>{const c=U.getItem(`minicraft.world.${a.id}:meta`);if(c){const {p:d,s:f,v:n}=Qa(c);null!=n&&(d.i.forEach((l,p)=>{l&&(b.G[p].content=nb(l[0],l[1],l[2]))}),b.kb=d.h,b.u=d.m,b.H=d.p[0],b.J=d.p[1],b.K=d.p[2],b.O=d.p[3],b.ea=d.p[4],a.wa=f[0],a.xa=f[1],a.ya=f[2])}},Sb=(a,b,c,d)=>`minicraft.world.${a.id}:${b}/${c}`+(0<
d?"/"+d:""),Tb=a=>{const b=a.Z[a.Ga[a.oa=0].fb];Sa(Sb(a,b.Ca,b.Pa,b.y));b.ha=!1;++b.Ca;Cb(a,!1)},Eb=(a,b)=>{const c=a.Ea;var d=a.L;const f=b.y,n=(256<<d)-256;for(let l=0,p=-1,e=((b.x<<d+4|b.z)<<6|f)<<2;16>l;++l){for(d=0;16>d;++d)X[++p]=c[e],X[++p]=c[++e],X[++p]=c[++e],X[++p]=c[++e],e+=13;e+=n}Ra(Sb(a,b.Ca,b.Pa,f),vb());b.ha=!1},Cb=(a,b)=>{const c=a.Z,d=a.Ga,f=a.sa,n=a.ta,l=d.length;for(;a.oa<l;){var p=d[a.oa++],e=c[p.fb],g=e.loaded,k=e.x;const v=e.y;var t=e.z,x=f+p.sa+k;p=n+p.ta+t;if(!g||x!==e.Ca||
p!==e.Pa)if(e.ha&&Eb(a,e),e.loaded=!0,p=wb(U.getItem(Sb(a,e.Ca=x,e.Pa=p,v))),g||0===v||p){e=a.Ea;const h=a.L;x=(256<<h)-256;k=((k<<h+4|t)<<6|v)<<2;if(p)for(let u=0,C=-1;16>u;++u){for(g=0;16>g;++g)e[k]=X[++C],e[++k]=X[++C],e[++k]=X[++C],e[++k]=X[++C],k+=13;k+=x}else for(t=0;16>t;++t){for(p=0;16>p;++p)e[k]=0<v?0:50397446,e[++k]=0<v?0:131843,g?(e[++k]=0,e[++k]=0,k+=13):k+=15;k+=x}if(!b)break}}};let Ub=null,Vb=null,Wb=new Image;Wb.crossOrigin="anonymous";
Wb.onload=()=>{const a=ta.createElement("canvas");a.width=16;a.height=416;const b=a.getContext("2d");b.drawImage(Wb,0,0);ha("tile","div[className=bitmap]",{S:{backgroundImage:`url(${a.toDataURL()})`}});Ub=new Ua(b.getImageData(0,0,16,416).data.buffer);Vb&&Vb();Wb=Vb=null};Wb.src=ASSETS+"blocks.webp";
const Yb=(a,b)=>{const c={pb:b,Sa:b.getContext("2d",{alpha:!1,desynchronized:!0}),eb:null,ib:"",U:!1,jb:0,Xa:0,rb:ab(()=>(c.jb=c.Xa,c.Xa=0),1E3),o:a};null===Ub&&(Vb=()=>c.U=!0);Xb(c);return c},Xb=a=>{const b=a.pb,c=a.o;(a.eb=a.Sa.createImageData(b.width=c.ua,b.height=c.va)).data.fill(255);const d=c.ua*c.g.W/c.ja,f=c.va*c.g.W/c.ja;b.style.width=d+"px";b.style.height=f+"px";b.style.left=Da((c.Ma-d)/2)+"px";b.style.top=Da((c.Na-f)/2)+"px";a.Sa.fillStyle="rgba(255,255,255,.5)"};let Zb=0;
const bc=(a,b,c,d)=>{const f={Y:null,Ea:null,Z:null,Ga:null,oa:0,A:!0,Ia:0,Ja:0,Ka:0,id:c.Ba,sa:0,ta:0,L:0,wa:.5,xa:8.5,ya:.5,time:0,Oa:0},n=qb(f,d);Gb(f,n);a={actions:a,g:c,gb:0,hb:0,Ha:!1,pa:!0,qa:!1,sb:b,$:0,V:new Set,Ya:"",l:0,N:[],j:n,Za:null,B:null,ja:1,Ma:1,Na:1,ua:0,va:0,ub:ab(()=>{f.A||(f.time=(f.time+1)%24E3,f.Oa=1/24E3*(f.Oa+6E3)%1,Db(f,n,!1))},50),world:f};$b(a,null);ac(a);return a},cc=a=>{Fb(a.world,a.j);a.actions.P(a.world.id,{mod_l:Date.now()})},ac=a=>{aa(function*(){try{yield a.sb.requestPointerLock()}catch(b){}}())},
dc=(a,b)=>a===b?0:.1-.2*a,ec=a=>{a.j.Qa=dc((a=a.V).has(-12)||a.has(65),a.has(-13)||a.has(68))},fc=a=>{a.j.cb=dc((a=a.V).has(-15)||a.has(16),a.has(-14)||a.has(32))},gc=a=>{a.j.Ra=dc((a=a.V).has(-11)||a.has(83),a.has(-10)||a.has(87))},hc=a=>{a.j.mb=dc(a.V.has(-18),a.V.has(-19))},ic=a=>{a.j.nb=dc(a.V.has(-17),a.V.has(-16))},kc=(a,b,c)=>{if(!a.world)return!1;const d=a.V;var f=a.j;if(c){if(d.has(b))return!1;d.add(b);var n=f.fa,l=f.X;c=f.ga;switch(b){case -18:case -19:hc(a);break;case -17:case -16:ic(a);
break;case -1:2!==f.u&&0<=l&&(0===f.La?0===f.u&&(b=yb(a.world,n,l,c),2===b?b=3:1===b&&(b=4),6===b||8!==b&&13!==b&&null!==pb(f.G,nb(b,1)))||(zb(a.world,n,l,c),f.X=-1):jc(a,[n,l,c],!1));break;case -2:case 71:if(0<=l){const p=yb(a.world,n,l,c);c=f.G.slice(0,9);l=c.findIndex(e=>null!==e.content&&e.content.id===p);0<=l?f.M=l:1===f.u&&(c[f.M].content&&(c=c.findIndex(e=>null===e.content),0<=c&&(f.M=c)),f.G[f.M].content=nb(p));f.ka=a.$}break;case -3:if(2!==f.u&&0<=l)if(0===f.La){if(b=f.G[f.M],b.content){switch(f.Da){case 0:--n;
break;case 1:++n;break;case 2:--l;break;case 3:++l;break;case 4:--c;break;default:++c}0<=l&&64>l&&Ab(a.world,n&(1<<4+a.world.L)-1,l,c&(1<<4+a.world.L)-1,b.content.id)&&1!==f.u&&0>=--b.content.amount&&(b.content=null)}}else jc(a,[n,l,c],!0);break;case -4:f.M=(f.M+9-1)%9;f.ka=a.$;break;case -5:f.M=(f.M+1)%9;f.ka=a.$;break;case 27:0===a.l&&(a.world.A=!0,a.l=1);break;case -15:case -14:case 16:case 32:fc(a);break;case 49:case 50:case 51:case 52:case 53:case 54:case 55:case 56:case 57:f.M=b-49;f.ka=a.$;
break;case -12:case -13:case 65:case 68:ec(a);break;case 69:if(0===a.l){a.l=3;for(const p of d)kc(a,p,!1)}break;case 80:a.world&&(a.world.A=!a.world.A);break;case 81:f=f.G[f.M];if(d.has(17)||f.content&&0>=--f.content.amount)f.content=null;break;case -11:case -10:case 83:case 87:gc(a);break;case 84:if(0===a.l){a.l=2;for(const p of d)kc(a,p,!1)}break;case 112:a.pa=!a.pa;break;case 114:a.Ha=!a.Ha;break;default:return!1}}else{if(!d.delete(b))return!1;switch(b){case -15:case -14:case 16:case 32:fc(a);
break;case -12:case -13:case 65:case 68:ec(a);break;case -11:case -10:case 83:case 87:gc(a);break;case -18:case -19:hc(a);break;case -17:case -16:ic(a)}}a.Ya=[...d].join();return!0},lc=(a,b)=>(b=b.startsWith("~")?a+Wa(b.substr(1)):Wa(b),isNaN(b)?a:b),nc=(a,b)=>{const c=a.j;var d=a.world;if(b)if("/"===b.charAt(0)){b=b.substr(1).split(" ");const f=b.shift();switch(f){case "clear":a.N=[];break;case "clearinv":for(const n of c.G)n.content=null;Z(a,"Inventar geleert",!0);break;case "gamemode":case "gm":b=
Wa(b[0]);!isNaN(b)&&0<=b&&3>b&&0===b%1?(c.u=b,Z(a,"Spielmodus gesetzt auf: "+b,!0)):Z(a,"Spielmodus muss in 0..2 sein!");break;case "give":if(0===b.length){Z(a,"/give <id> [Anzahl]\n"+jb.join(" "));break}d=jb.indexOf((b[0]||"").toLowerCase());d=0<=d?d:Wa(b[0]);b=Wa(b[1]||1);!isNaN(d)&&0<d&&25>d&&0===d%1?!isNaN(b)&&0<b&&0===b%1?Z(a,pb(c.G,nb(d,b))?"Inventar ist voll!":`${"Items gegeben"} ${b} ${kb[d]}`,!0):Z(a,"Anzahl muss mindestens 1 sein!"):Z(a,"Ung\u00fcltiger Blocktyp!");break;case "help":Z(a,
"Befehle: clear, clearinv, gamemode, give, help, load, me, save, spawn, teleport, version");break;case "load":Cb(d,!0);a.B.U=!0;Z(a,"Chunks geladen.",!0);break;case "me":Z(a,c.name+" "+b.join(" "),!0);break;case "save":cc(a);Z(a,"Spiel gespeichert.",!0);break;case "smart":c.name="LFF5644";Z(a,"lff.smart: true",!0);break;case "spawn":d.wa=c.H;d.xa=c.J;d.ya=c.K;Z(a,"Startpunkt aktualisiert.",!0);break;case "teleport":case "tp":0===b.length?(c.H=d.wa,c.J=d.xa,c.K=d.ya,a.B.U=!0,Z(a,"Zum Startpunkt teleportiert.",
!0)):3===b.length?(Z(a,"Teleportiert zu"+` ${c.H=lc(c.H,b[0])} ${c.J=lc(c.J,b[1])} ${c.K=lc(c.K,b[2])}`,!0),a.B.U=!0):Z(a,"Pech!");c.aa=0;c.ba=0;c.ca=0;break;case "version":Z(a,"Minicraft 0.9.8");break;case "/exit":c.La=0;Z(a,"Normaler Mausmodus.",!0);break;case "/expand":a.j.ma&&a.j.na?d=!0:(Z(a,"Auswahl erforderlich!"),d=!1);d&&("vert"===b[0]?(c.ma[1]=0,c.na[1]=63,Z(a,"Auswahl erweitert.",!0)):Z(a,'Nur "vert" wird unterst\u00fctzt!'));break;case "/pos1":case "/pos2":jc(a,[P(c.H),P(c.J),P(c.K)],
"/pos2"===f);break;case "/regen":Tb(d);Z(a,"Chunk neu generiert.",!0);a.B.U=!0;break;case "/show":Z(a,`${"Erster"}: ${c.ma?c.ma.join(" "):"nichts"}, ${"Zweiter"}: ${c.na?c.na.join(" "):"nichts"}`);break;case "/wand":c.La=1;Z(a,"Auswahl mit Maustasten.",!0);break;default:Z(a,"Ung\u00fcltiger Befehl: "+f)}}else{const f=Z(a,`<${c.name}> `+b);$b(a,b).then(n=>{n&&mc(a,f)})}},Z=(a,b,c=!1)=>{const d=++Zb;(a.N=a.N.slice(-49)).push({id:d,lb:c,time:ra(),value:b});return d},mc=(a,b)=>{const c=a.N.findIndex(d=>
d.id===b);0<=c&&a.N.splice(c,1)},jc=(a,b,c)=>{c?a.j.na=b:a.j.ma=b;Z(a,`${c?"Zweiter Auswahlpunkt":"Erster Auswahlpunkt"}: ${b.join(" ")}`,!0)},$b=(a,b)=>(bb(a.Za),(b?fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:T({msg:b})}):fetch("/api/chat")).then(c=>{if(c.ok)return c.text()}).then(c=>{if(c){c=c.split("\n").filter(Boolean);for(const d of c)d.startsWith("<")&&Z(a,d);return 0<c.length}return!1}).catch(()=>!1).then(c=>{a.Za=$a(()=>{$b(a,null)},5E3);return c})),oc=
({id:a})=>(A("#tile",{S:{backgroundPositionY:`-${2*(a-1)}rem`}}),null);function pc({amount:a,u:b,id:c}){A("div[className=stack]",{title:kb[c]+(1===b?` (${jb[c]}, ${c})`:"")});return[I(oc,{id:c}),1!==a&&K("div[className=amount]",{innerText:a})]}
function qc({j:a,la:b}){A("div[className=bar]",{ontouchstart:H(d=>{a.M=Number(d.target.closest("[data-slot]").dataset.slot);a.ka=d.timeStamp}),S:{opacity:Ea(.5,S(1,1-5E-4*(b-a.ka-5E3)))}});const c=a.u;return Ub&&a.G.slice(0,9).map(({content:d},f)=>K("div",{D:{slot:f},F:{active:f===a.M}},[d&&I(pc,{amount:d.amount,data:d.data,u:c,id:d.id})]))}
function rc({tb:a}){A("div[className=grid]",{onclick:({target:b})=>{(b=b.closest("[data-id]"))&&ob({content:nb(Wa(b.dataset.id)),filter:null,T:64},a)}});return jb.map((b,c)=>0<c&&K("div",{D:{id:c}},[I(pc,{amount:1,data:null,u:1,id:c})]))}
function sc({o:a}){const b=ja(()=>({content:null,filter:null,T:64})),c=a.j.u;A("div[className=menu overlay inventory]",ja(()=>({onclick:({target:d})=>{if("menu overlay inventory"===d.className)b.content?b.content=null:(a.l=0,a.world.A=!1,ac(a));else if(d=d.closest("[data-slot]"))d=a.j.G[Wa(d.dataset.slot)],b.content?ob(b,d):d.content&&ob(d,b)},oncontextmenu:({target:d})=>{if("menu overlay inventory"===d.className)b.content?0>=--b.content.amount&&(b.content=null):(a.l=0,ac(a));else if(d=d.closest("[data-slot]"))d=
a.j.G[Wa(d.dataset.slot)],b.content?ob(b,d,1):d.content&&ob(d,b,xa(d.content.amount/2))}})));return Ub&&[K("div[className=window]",null,[K("div[innerText=Inventar]"),1===c&&I(rc,{tb:b}),K("div[className=grid]",null,a.j.G.map(({content:d},f)=>K("div",{D:{slot:f},F:{first:9>f}},[d&&I(pc,{amount:d.amount,data:d.data,u:c,id:d.id})])))]),b.content&&K("div[className=hand]",{S:{transform:`translate(${a.gb}px, ${a.hb}px)`}},[I(pc,{amount:b.content.amount,data:b.content.data,u:0,id:b.content.id})])]}
const tc=({I:{lb:a,time:b,value:c},la:d})=>(A(a?"div[className=minor]":"div",{innerText:c,S:{opacity:S(1,1-.001*(d-b-4500))}}),null);function uc({N:a,la:b}){A("div[className=messages]");const c=b-5E3;return[qa(tc,a.slice(-10).filter(d=>d.time>c),{la:b})]}
function vc({actions:{qb:a,Va:b},g:c,o:d,Aa:f}){F(()=>cc(d));A("div[className=menu overlay]");return[K("h1[innerText=Einstellungen]"),H(K("center",null,[K("button[innerText=Zur\u00fcck zum Spiel]",{onclick:()=>{d.l=0;d.world.A=!1;ac(d)}})])),K("div[className=settings]",null,[K("button",{innerText:"Oberfl\u00e4chen:\n"+(c.ia?"Texturiert":"Einfarbig"),onclick:H(()=>a(n=>({ia:!n.ia})))}),K("label[innerText=Aufl\u00f6sung:]",null,[K("input[type=range][min=1][max=100][step=1]",{value:101-c.W,onchange:H(n=>
b({W:101-Number(n.target.value)}))})]),K("label[innerText=Blickwinkel:]",null,[K("input[type=range][min=1][max=180][step=1]",{value:c.za,onchange:H(n=>b({za:Number(n.target.value)}))})]),K("label[innerText=Sichtweite:]",null,[K("input[type=range][min=1][max=128][step=1]",{value:c.da,onchange:H(n=>b({da:Number(n.target.value)}))})]),K("label[innerText=Mausempfindlichkeit:]",null,[K("input[type=range][min=1][max=15][step=1]",{value:c.ra,onchange:H(n=>b({ra:Number(n.target.value)}))})])]),H(K("center",
null,[K("button[innerText=Welt verlassen]",{onclick:()=>{f(0)}})]))]}const wc=({I:{lb:a,value:b}})=>(A(a?"div[className=minor]":"div",{innerText:b}),null);
function xc({o:a,N:b}){const c=H({history:null,input:null});A("div[className=menu overlay terminal]",{onclick:d=>{d.target!==c.input&&c.input.focus()}});F(d=>{d&&$a(()=>c.history.scrollTop=1E9,0)},[b.length&&b[b.length-1].id]);return[H(K("div[className=toolbar]",null,[K("button[innerText=\u274c]",{onclick:()=>{a.l=0;a.world.A=!1;ac(a)}})])),K("div[className=history]",{R:H(d=>{c.history=d})},[qa(wc,b)]),H(K("input[enterkeyhint=send][mozactionhint=send][name=message][required]",{onkeydown:d=>{const f=
d.keyCode;d=d.target;13===f?(nc(a,d.value),d.value=""):27===f&&(a.A=!1,a.l=0)},R:d=>{c.input=d;$a(()=>d.focus(),0)}}))]}const yc=[["pick",-2],["up",-14],["down",-15],["E",69],["T",84],["F1",112],["F3",114],["...",27]],zc=[["up",-10],["down",-11],["left",-12],["right",-13],["center",-1]],Ac=[["up",-16],["down",-17],["left",-18],["right",-19],["center",-3]];
function Bc({o:a}){const b=a.V,c=([d,f])=>K("div",{D:{code:f},F:{button:!0,[d]:!0,active:b.has(f)}});A("div[className=touch]",H({ontouchstart:d=>{d.preventDefault();const f=Number(d.target.dataset.code);if(null!=f&&kc(a,f,!0)){const n=d.changedTouches[0].identifier,l=p=>{p.changedTouches[0].identifier===n&&(removeEventListener("touchend",l),kc(a,f,!1))};addEventListener("touchend",l)}}}));return[K("div[className=top]",null,yc.map(([d,f])=>K(`div[innerText=${d}]`,{D:{code:f},F:{button:!0,active:b.has(f)}}))),
K("div[className=move]",null,zc.map(c)),K("div[className=move sec]",null,Ac.map(c))]}
function Cc({account:a,actions:b,g:c,frame:d,$a:f,Aa:n}){const l=ra(),p=ta.pointerLockElement===d,e=ja(()=>f.o=bc(b,d,c,a));F(()=>{const g=v=>{if(0!==e.l)return!0;e.qa=!1;ta.pointerLockElement===d?kc(e,-1-v.button,"mousedown"===v.type):ac(e);v.preventDefault();return!1},k=v=>{if(e.world.A)e.gb=v.clientX,e.hb=v.clientY;else{const h=e.g.ra*ua/(Ea(e.Ma,e.Na)*e.ja);rb(e.j,v.movementX*h,-v.movementY*h)}},t=v=>{e.qa=!1;if(0===e.l&&!e.world.A&&5<Math.abs(v.deltaY)){const h=0<v.deltaY?-5:-4;kc(e,h,!0);kc(e,
h,!1);v.preventDefault()}},x=v=>{e.qa=!0;0===e.l&&(e.world.A=!1,v.preventDefault())};d.addEventListener("mousedown",g);d.addEventListener("mouseup",g);d.addEventListener("mousemove",k);d.addEventListener("wheel",t);d.addEventListener("touchstart",x);return()=>{d.removeEventListener("mousedown",g);d.removeEventListener("mouseup",g);d.removeEventListener("mousemove",k);d.removeEventListener("wheel",t);d.removeEventListener("touchstart",x);bb(e.Za);fb(e.ub);Fb(e.world,e.j);fb(e.B.rb);f.o=null}});F(()=>
{e.g=c;e.B&&(e.B.U=!0);const g=e.world;var k=xa(Ia(e.g.da/16*2+2));if(g.L!==k){var t=e.j;g.Z&&Fb(g,t);const x=1<<(g.L=k),v=g.Z=[];for(let h=0;h<x;++h)for(let u=0;u<x;++u)for(let C=0;4>C;++C)v.push({ha:!1,loaded:!1,x:h,y:C,z:u,Ca:0,Pa:0});k=x<<k+12+2;null===g.Y||g.Y.length<k?g.Ea=new Ua((g.Y=new Ta(k)).buffer):g.Ea.fill(0);Db(g,t,!0)}},[c]);F((g,k,t)=>{e.ja=t;e.Ma=Ea(1,g);e.Na=Ea(1,k);k=e.g.W;g=xa(e.Ma*e.ja/k);k=xa(e.Na*e.ja/k);if(g!==e.ua||k!==e.va)e.ua=g,e.va=k,e.B&&(e.B.U=!0,Xb(e.B))},[d.offsetWidth,
d.offsetHeight,sa.devicePixelRatio||1,c.W]);F(()=>{p||e.world.A||0!==e.l||(e.l=1);e.world.A=!p},[p]);F(g=>p&&g&&ta.exitPointerLock(),[e.world.A||0!==e.l]);F(()=>{if(e.world){if(e.$&&!e.world.A){var g=e.j,k=S(5,.01*(l-e.$));g.aa-=.1*g.aa*k;g.ba-=.1*g.ba*k;g.ca-=.1*g.ca*k;g.aa+=(Fa(g.O)*g.Qa+Ga(g.O)*g.Ra)*k;g.ba+=g.cb*k;g.ca+=(-Ga(g.O)*g.Qa+Fa(g.O)*g.Ra)*k;rb(g,g.mb*k,g.nb*k);g.H+=g.aa*k;g.J+=g.ba*k;g.K+=g.ca*k}if(e.B){g=e.B;++g.Xa;k=g.Sa;var t=g.eb;const N=g.o,V=N.g,ya=N.pa,y=N.j,Y=N.ua,ca=N.va,L=
N.world;if(!L.A||g.U){g.U=!1;const na=t.data,Dc=V.da;var x=y.O,v=y.ea;const Ec=y.fa,Fc=y.ga;var h=y.H,u=y.J,C=y.K;const Gc=ya?y.X:-1,Hc=L.Y;var z=L.L;const Ic=V.ia&&null!==Ub;var G=1/Y,O=1/ca;const oa=Y>>1,pa=ca>>1,Hb=S(Y,ca),Ib=32<Hb,Jb=Fa(x);x=Ga(x);const Kb=Fa(-v);v=Ga(-v);var q=V.za/45;const Jc=G*(Y<ca?q*Y*O:q);G=O*(ca<Y?q*ca*G:q);h+=65536;u+=65536;C+=65536;O=h%1;q=u%1;const Kc=C%1;z=4+z;const Lb=(1<<z)-1;let Mb=1===y.u?6:4,ea=y.fa=y.ga=y.Da=0;y.X=-1;for(let Ma=0;Ma<ca;++Ma){var r=(pa-Ma)*G;const Nb=
r*Kb-v;var B=r*v+Kb;r=B*x;B*=Jb;for(let Na=0;Na<Y;++Na){var D=(Na-oa)*Jc;const Ob=r+Jb*D;D=B-x*D;let za=16757124,Oa=1,Pb=Dc;for(let J=0;3>J;++J){let Q=D;0===J&&(Q=Ob);1===J&&(Q=Nb);var E=1/(0>Q?-Q:Q);const Pa=Ob*E,fa=Nb*E;E*=D;const Qb=Ha(Pa*Pa+fa*fa+E*E);var w=Kc;0===J&&(w=O);1===J&&(w=q);0<Q&&(w=1-w);let Aa=h+Pa*w-(0===J&0>Q|0),Ba=u+fa*w-(1===J&0>Q|0),Ca=C+E*w-(2===J&0>Q|0);w*=Qb;for(let cb,db,eb,R;w<Pb;Aa+=Pa,Ba+=fa,Ca+=E,w+=Qb)if(65536>Ba){if(0>fa)break}else if(65600<=Ba){if(0<fa)break}else if(0!==
(R=Hc[((cb=Aa&Lb)<<z|(eb=Ca&Lb))<<6|(db=Ba&63)])){Ma===pa&&Na===oa&&w<=Mb&&(y.fa=cb,y.X=db,y.ga=eb,y.Da=0>Q|J<<1,Mb=w);if(Ic){--R;1===J?6===R?R=25:13===R?R=4:1===R&&0<fa&&(R=2):1===R&&(R=24);const Rb=Ub[R<<8|(16*(1===J?Ca:Ba)&15)<<4|16*(1===J?Aa:(0<Q?Aa-Ca:Ca-Aa)+65536)&15];if(0===Rb>>>24)continue;za=Rb&16777215}else za=lb[R];Pb=w;Oa=(0===J?.8:2===J?.6:0<Q?.4:1)+(db!==Gc||cb!==Ec||eb!==Fc?0:.2);break}}na[ea]=(za&255)*Oa;na[++ea]=(za>>8&255)*Oa;na[++ea]=(za>>16)*Oa;ea+=2}}ya&&!Ib&&(na[ea=Y*pa+oa<<
2]+=128,na[++ea]+=128,na[++ea]+=128);k.putImageData(t,0,0);ya&&Ib&&(t=xa(.05*Hb),k.fillRect(oa-t,pa-1,t<<1,2),k.fillRect(oa-1,pa-t,2,t-1),k.fillRect(oa-1,pa+1,2,t-1))}g.ib=N.Ha?"Minicraft 0.9.8 "+P(g.jb).toString().padStart(2,"\u00a0")+" fps, T: "+P(24*L.Oa).toString().padStart(2,"0")+":"+P(24*L.Oa%1*60).toString().padStart(2,"0")+"; "+(L.A&&500>l%1E3?"":L.time)+"\nR: "+Y+"x"+ca+" (x"+V.W+"), D: "+V.da+", C: "+L.oa+"/"+L.Ga.length+", M: "+(64*W(1<<4+L.L)>>10)+"k\nE: 0/0 M: "+y.u+"\n\nPosition: "+
y.H.toFixed(2)+" "+y.J.toFixed(2)+" "+y.K.toFixed(2)+"\nAngle: "+(y.O*wa).toFixed(2)+" "+(y.ea*wa).toFixed(2)+"\nBlock: "+(0>y.X?0:y.fa+" "+y.X+" "+y.ga+" "+mb[y.Da]+": "+yb(L,y.fa,y.X,y.ga))+"\nChunk abs: "+(P(y.H)>>4)+" "+(P(y.K)>>4)+" "+(P(y.J)>>4)+" rel: "+L.Ia+" "+L.Ka+" "+L.Ja:""}}e.$=l},[l]);la();return[K("canvas",{R:H(g=>{e.B=Yb(e,g)})}),e.pa&&2!==e.l&&I(uc,{N:e.N,la:l}),e.B&&e.Ha&&K("div[className=diagnostics]",{innerText:e.B.ib}),e.qa&&I(Bc,{o:e,Ya:e.Ya}),e.pa&&3!==e.l&&2!==e.j.u&&I(qc,
{j:e.j,la:l}),3===e.l&&I(sc,{o:e,la:l}),1===e.l&&I(vc,{actions:b,g:c,o:e,Aa:n}),2===e.l&&I(xc,{o:e,N:e.N})]}
function Lc({I:a,vb:b,wb:c,xb:d}){A("div",{F:{selected:a===c},onclick:()=>{d(a.id)}});c=`${a.local?"L":"_"}${a.local&&a.remote?a.local>a.remote?">":a.local<a.remote?"<":"=":"_"}${a.remote?a.public?"R":"r":"_"}`;b===a.id&&(c=`[${c}]`);return[K("span",{innerText:`${c} ${a.label}`,title:a.account_name?"Besitzer: "+a.account_name:"Nur lokale Welt"}),K("span",{innerText:hb(Math.max(a.local,a.remote),!0)})]}
function Mc({account:a,actions:b,g:c,Aa:d}){A("div[className=menu]");const [f,n,l]=ma(0),p=H(()=>{n(l()+1)}),e=H({value:null}),g=ia(()=>aa(function*(){try{const q=!e.value&&!f,r=yield fetch("/api/minicraft/"+`world?what=${q?"initial":"meta_all"}`);if(!r.ok)throw Error("Verbindungsfehler.");const B=yield r.json();if(!q)return B;if("0.9.8"!==B.version_latest)return location.reload(),null;ba();b.ob(B.account);return B.worlds}catch(q){return alert("Fehler beim Laden der Weltenliste: "+q.message),[]}}()),
[f],null),k=ja(()=>{g&&(e.value=g);const q=[];e.value&&q.push(...e.value.map(r=>({account_name:r.account_name,hash:r.hash,id:r.id,label:r.label,local:0,public:r.public,remote:r.modified,writable:r.writable})));for(const r of c.worlds){const B=q.find(D=>D.id===r.id);if(B){const D=B.local=r.mod_l,E=B.remote,w=r.mod_r;D>w&&E>w&&(confirm('Konflikt! Die Welt "'+r.label+'" wurde sowohl hier als auch woanders ge\u00e4ndert.\nOK: Die vom Server \u00fcbernehmen ('+hb(E,!1)+") | Abbrechen: Die hier hochladen ("+
hb(D,!1)+")")?b.P(r.id,{mod_l:B.local=w}):b.P(r.id,{mod_r:B.remote=w}))}else 1<r.mod_r&&g&&g.length&&(alert('Die Welt "'+r.label+'" wurde auf dem Server nicht gefunden, ist also jetzt eine lokale!'),b.P(r.id,{mod_r:0})),q.push({account_name:"",hash:0,id:r.id,label:r.label,local:r.mod_l,public:!1,remote:1===r.mod_r?1:0,writable:!0})}return q.sort((r,B)=>Math.max(B.local,B.remote)-Math.max(r.local,r.remote))},[g,c.worlds]),[t,x,v]=ma(c.Ba),h=ja(()=>k.find(q=>q.id===t)||null,[t,k]),u=ja(()=>{let q,r;
return null!=(r=null==k?void 0:null==(q=k.find(B=>0<B.local&&0<B.remote&&B.local!==B.remote))?void 0:q.id)?r:null},[k]);F(()=>{if(null!==u){var q=!1,r=k.find(D=>D.id===u),B=`minicraft.world.${u}:`;if(r.local<r.remote)fetch("/static/minicraft/worlds/"+`${r.hash}.json`).then(D=>D.json()).then(D=>{if(!q){for(const [E,w]of Za(D))Ra(B+E,w);Ra("__margin",Array(4097).join("x"));Sa("__margin");b.P(u,{mod_l:r.remote,mod_r:r.remote})}}).catch(D=>{if(!q)if("QuotaExceededError"===D.name){alert("Der Speicherplatz reicht nicht!");
for(const E of Ya(U))E.startsWith(B)&&Sa(E);b.bb(u)}else alert("Fehler beim Herunterladen der Welt: "+D.message)});else{if(!r.writable){b.P(u,{mod_l:c.worlds.find(w=>w.id===u).mod_r});return}const D=B.length;let E=u;(1===r.remote?fetch("/api/minicraft/world",{method:"POST",headers:{"Content-Type":"application/json"},body:T({what:"meta",label:r.label})}).then(w=>{if(!w.ok)throw Error(403===w.status?"Keine Berechtigung. Angemeldet?":"Verbindungsfehler.");return w.json()}).then(w=>{E=w.id}):Promise.resolve()).then(()=>
{if(q)throw null;const w={};for(const N of Ya(U))N.startsWith(B)&&(w[N.substr(D)]=U.getItem(N));return fetch("/api/minicraft/world",{method:"POST",headers:{"Content-Type":"application/json"},body:T({what:"data",world:E,data:w})})}).then(w=>{if(!w.ok)throw Error(403===w.status?"Keine Berechtigung. Angemeldet?":"Verbindungsfehler.");return w.json()}).then(w=>{ba();if(E===u)b.P(u,{mod_l:w.modified,mod_r:w.modified});else{const N=`minicraft.world.${E}:`;for(const V of Ya(U))if(V.startsWith(B)){const ya=
U.getItem(V);Sa(V);Ra(N+V.substr(D),ya)}b.bb(u);b.ab({id:E,label:r.label,mod_l:w.modified,mod_r:w.modified});q||v()!==u||x(E)}q||p();da()}).catch(w=>{q||(alert("Fehler beim Hochladen der Welt: "+w.message),ba(),b.P(u,{mod_r:0}),da())})}return()=>{q=!0}}},[u]);const [C,z]=ma(!1);h||z(!1);const [G,O]=ma(!1);return[K("h1[innerText=Welten]"),K("button[innerText=Aktualisieren][style=position:absolute;left:0;top:0;height:2rem][title=Liste neu laden]",{disabled:!g,onclick:p}),K("button[style=position:absolute;right:0;top:0;height:2rem]",
{disabled:0<a.rank,innerText:a.rank?a.label:"Anmelden",onclick:()=>{location.href="/account?redir=minicraft"}}),K("div[className=worlds]",null,[qa(Lc,k,{yb:f,vb:u,wb:h,xb:x})]),K("center",null,[K("button[innerText=\u00d6ffnen]",{disabled:!h||!h.local||h.remote>h.local,onclick:()=>{ba();b.Va({Ba:h.id});d(1);da()},title:h?h.local?h.remote>h.local?"Die Welt wird noch geladen!":"Ausgew\u00e4hlte Welt betreten":"Die Welt ist noch nicht heruntergeladen!":"Keine Welt ausgew\u00e4hlt!"}),K("button[innerText=Welt...]",
{disabled:!h||C,onclick:()=>{z(!0)},title:h?"Aktionen/Einstellungen zur Welt anzeigen":"Keine Welt ausgew\u00e4hlt!"})]),K("hr"),K("center",null,[K("button[innerText=Neue Welt]",{onclick:()=>{const q=prompt("Name der neuen Welt:\n(max. 16 Zeichen)","Neue Welt");q&&(16<q.length?alert("Der Name ist zu lang!"):b.ab({id:Math.min(0,...c.worlds.map(r=>r.id))-1,label:q,mod_l:Date.now(),mod_r:0}))}}),K("button[innerText=Projektseite]",{onclick:()=>{open("//github.com/L3P3/minicraft")}})]),K("center",null,
[K("small[innerText=Version 0.9.8 von L3P3]")]),C&&h&&K("div",{F:{"menu overlay advanced":!0,busy:G},onclick:q=>{"menu overlay advanced"===q.target.className&&z(!1)}},[K("div[className=window]",null,[K("h2",{innerText:'"'+h.label+'"'}),K("table",null,[!!h.account_name&&K("tr",null,[K("td[innerText=Besitzer:]"),K("td",{innerText:h.account_name})]),K("tr",null,[K("td[innerText=\u00c4nderung:]"),K("td",{innerText:hb(Math.max(h.local,h.remote),!1)})])]),K("center",null,[K("button[innerText=Umbenennen]",
{disabled:G||!h.writable,onclick:()=>{const q=prompt("Neuer Name der Welt:\n(max. 16 Zeichen)",h.label);!q||q===h.label||16<q.length||(h.local&&b.P(h.id,{label:q}),h.remote&&(O(!0),fetch("/api/minicraft/world",{method:"POST",headers:{"Content-Type":"application/json"},body:T({what:"meta",world:h.id,label:q})}).then(r=>{if(!r.ok)throw Error(403===r.status?"Keine Berechtigung. Angemeldet?":"Verbindungsfehler.");return r.json()}).catch(r=>{alert("Fehler beim Bearbeiten der Welt: "+r.message)}).then(()=>
{O(!1)})))},title:h.writable?"Welt-Namen \u00e4ndern":"Fehlende Berechtigung!"}),K("button",{disabled:G||!h.local&&!h.writable,innerText:h.local?"L\u00f6schen (lokal)":"L\u00f6schen",onclick:()=>{confirm('Welt "'+h.label+'" wirklich l\u00f6schen?')&&(h.local?b.bb(h.id):(O(!0),fetch("/api/minicraft/world",{method:"DELETE",headers:{"Content-Type":"application/json"},body:T({what:"world",world:h.id})}).then(q=>{if(!q.ok)throw Error(403===q.status?"Keine Berechtigung. Angemeldet?":"Verbindungsfehler.");
ba();x(null);z(!1);p();O(!1);da();return q.json()}).catch(q=>{alert("Fehler beim L\u00f6schen der Welt: "+q.message);O(!1)})))},title:h.local||h.writable?"Welt l\u00f6schen":"Fehlende Berechtigung!"})]),K("center",null,[K("button",{disabled:G||!h.remote||!h.writable,innerText:`${"\u00d6ffentlich"}: ${h.public?"Ja":"Nein"}`,onclick:()=>{O(!0);fetch("/api/minicraft/world",{method:"POST",headers:{"Content-Type":"application/json"},body:T({what:"meta",world:h.id,public:!h.public})}).then(q=>{if(!q.ok)throw Error(403===
q.status?"Keine Berechtigung. Angemeldet?":"Verbindungsfehler.");ba();p();O(!1);da();return q.json()}).catch(q=>{alert("Fehler beim Bearbeiten der Welt: "+q.message);O(!1)})},title:h.remote?h.writable?h.public?"Welt privat machen":"Welt ver\u00f6ffentlichen":"Fehlende Berechtigung!":"Die Welt ist nicht hochgeladen!"}),K("button",{disabled:G||!g||0<h.local&&0<h.remote||!h.remote&&!a.rank,innerText:h.local?g&&h&&!h.remote?"Hochladen":"\u00dcbertragen":"Herunterladen",onclick:()=>{h.local?h.remote||
b.P(h.id,{mod_r:1}):b.ab({id:h.id,label:h.label,mod_l:1,mod_r:h.remote})},title:g?h.local?h.remote?"Die Welt ist schon auf beiden Seiten vorhanden!":a.rank?"Welt auf den Server hochladen":"Nicht angemeldet!":"Welt von Server herunterladen":"Liste wird noch geladen!"})])])])]}function Nc({account:a,actions:b,g:c,$a:d}){const [f,n]=ma(0),l=A("div[className=game]");return[0===f&&I(Mc,{account:a,actions:b,g:c,Aa:n}),1===f&&I(Cc,{account:a,actions:b,g:c,frame:l,$a:d,Aa:n})]}
m.init(()=>{const [a,b]=ka(ib),c=H({o:null});F(()=>{let f=!1;onbeforeunload=onunload=onpagehide=onblur=()=>{f||(f=!0,c.o&&cc(c.o),b.Ta())};onpageshow=onfocus=()=>{f=!1};setInterval(()=>{b.Ta()},500)});const d=H(f=>{if("INPUT"===f.target.tagName||!c.o)return!0;c.o.qa=!1;kc(c.o,f.keyCode,"keydown"===f.type);f.preventDefault();return!1});return[{onkeydown:d,onkeyup:d,oncontextmenu:gb,ondragstart:gb},[I(Nc,{account:a.account,actions:b,g:a.g,$a:c})]]});
