const w=lui,x=w.hook_dom,A=w.hook_effect,ba=w.hook_memo,ca=w.hook_model,da=w.hook_rerender,C=w.hook_static,ea=w.node,F=w.node_dom,fa=w.node_map,ha=w.now,ia=window,ma=document,I=Math,na=I.PI,oa=.5*na,ua=180/na,J=I.floor,va=I.ceil,wa=I.round,xa=I.min,K=I.max,ya=I.cos,za=I.sin,Aa=I.sqrt,Fa=String.fromCharCode,Ga=JSON,Ha=localStorage,Ia=Uint8Array,Ja=Uint32Array,Ka=Map,La=Number,Ma=setTimeout,Na=setInterval,Oa=clearInterval,M=a=>a*a,Pa=()=>!1,Qa=({I:{time:a,value:c},Fa:g})=>(x("div",{innerText:c,S:{opacity:xa(1,
1-.001*(g-a-4500))}}),null);function Ra({G:a,Fa:c}){x("div[className=messages]");const g=c-5E3;return[fa(Qa,a.slice(-10).filter(b=>b.time>g),{Fa:c})]}
const Sa=[0,8487297,4305266,4349313,8092539,5342114,7039851,3561583,4172910,6384533,15526888,10671324,8092798,16447200,4151672,1970708,8092539,9686227,9126695,15198183,5567485,14541182,7920469,662956,14936813],Ta=Sa.length,Ua="WEBTSN".split(""),Va=(a,c,g)=>{a.H=(a.H+c+100*na)%(2*na);a.ga=K(-oa,xa(oa,a.ga+g))},Wa=a=>{a+=32;33<a&&39>a?a++:38<a&&44>a?a+=2:43<a&&127>a?a+=3:126<a&&55258>a?a+=37:55295<a&&(a+=8485);return Fa(a)},Xa=a=>a-(63743<a?8517:159<a?69:46<a&&130>a?35:40<a&&46>a?34:34<a&&40>a?33:32),
Za=()=>{var a=Ya;const c=a.length,g=new Ka,b=r=>{q=q<<1|r&1;15===++n&&(h+=Wa(q),q=n=0)},d=()=>{for(let r=0;r<m;++r)b(0)},k=r=>{b(r);b(r>>1);b(r>>2);b(r>>3);b(r>>4);b(r>>5);b(r>>6);b(r>>7)},l=()=>{0===--u&&(u=1<<m++)},f=()=>{if(y)y=!1;else{let r=t.id;for(let G=0;G<m;G++)b(r>>G)}};let e=a[0],h="",q=0,n=2,m=2,u=2,v=2,t={id:v++,ia:new Ka},y=!0;k(e);g.set(e,t);for(let r=1;r<c;++r){const G=t.ia.get(e=a[r]);G?t=G:(f(),g.has(e)||(l(),d(),k(e),g.set(e,{id:v++,ia:new Ka}),y=!0),t.ia.set(e,{id:v++,ia:new Ka}),
t=g.get(e),l())}f();g.has(e)||(l(),d(),k(e));l();b(1);--m;d();return h+=Wa(q<<15-n)},$a=a=>{var c=Ya;if(!a)return null;const g=a.length,b=()=>{n+=(v>>--t&1)<<m++;0===t&&(t=15,v=Xa(a.charCodeAt(u++)))};let d=[0,1],k=1,l=3,f=2,e=null;var h=null;let q=0,n=0;h=2;let m=0,u=0,v=Xa(a.charCodeAt(u++)),t=15;for(;m<h;)b();if(1===n)return null;for(n=m=0;8>m;)b();e=[n];d[2]=e;for(c[q++]=n;u<=g;){h=f;for(n=m=0;m<h;)b();if(0===n){for(n=m=0;8>m;)b();d[l]=[n];n=l++;0===--k&&(k=1<<f++)}else if(1===n)return c;h=n<
d.length?d[n]:e.concat(e[0]);for(let y=0;y<h.length;y++)c[q++]=h[y];d[l++]=e.concat(h[0]);e=h;0===--k&&(k=1<<f++)}return null},O=new Ja(1024),Ya=new Ia(O.buffer),ab=new Ka,bb=(a,c,g,b,d)=>{const k=a.s;a.$[(c<<k+4|b)<<6|g]=d;a.K[(c>>4<<k|b>>4)<<2|g>>4].T=!0},pb=(a,c,g)=>{const b=K(xa(c.v,63),0)>>4,d=J(c.u)>>4;c=J(c.A)>>4;if(g||a.na!==b||a.ca+a.ma!==d||a.da+a.oa!==c)g=1<<a.s,a.na=b,a.ca=d-(a.ma=(65536+d)%g),a.da=c-(a.oa=(65536+c)%g),cb(a);db(a)},cb=a=>{const c=a.ma,g=a.na,b=a.oa,d=a.s,k=`${d} ${c} ${b} ${g}`;
let l=ab.get(k);if(null==l){const f=1<<d,e=M(.5*f);ab.set(k,l=a.K.map(({x:h,y:q,z:n},m)=>{let u=M(h-c),v=M(n-b),t=M(h-c-f),y=0,r=0;t<u&&(u=t,y=-f);(t=M(h-c+f))<u&&(u=t,y=f);(t=M(n-b-f))<v&&(v=t,r=-f);(t=M(n-b+f))<v&&(v=t,r=f);return{xa:u+v+M(q-g),Ja:m,ca:y,da:r}}).filter(({xa:h})=>h<=e).sort((h,q)=>h.xa-q.xa))}a.ja=l;a.aa=0},rb=a=>{for(const c of a.K)c.T&&qb(a,c)},sb=(a,c,g,b)=>`minicraft.world.${a.id}:${c}/${g}`+(0<b?"/"+b:""),qb=(a,c)=>{const g=a.va;var b=a.s;const d=c.y,k=(256<<b)-256;for(let l=
0,f=-1,e=((c.x<<b+4|c.z)<<6|d)<<2;16>l;++l){for(b=0;16>b;++b)O[++f]=g[e],O[++f]=g[++e],O[++f]=g[++e],O[++f]=g[++e],e+=13;e+=k}Ha.setItem(sb(a,c.fa,c.sa,d),Za());c.T=!1},db=a=>{var c=a.K,g=a.ja,b=a.ca;const d=a.da,k=g.length;for(;a.aa<k;){var l=g[a.aa++];const m=c[l.Ja];var f=m.loaded,e=m.x,h=m.y,q=m.z;const u=b+l.ca+e;l=d+l.da+q;if(!f||u!==m.fa||l!==m.sa){m.T&&qb(a,m);m.loaded=!0;var n=$a(Ha.getItem(sb(a,m.fa=u,m.sa=l,h)));if(f||0===h||n){c=a.va;b=a.s;g=(256<<b)-256;e=((e<<b+4|q)<<6|h)<<2;if(n)for(let v=
0,t=-1;16>v;++v){for(f=0;16>f;++f)c[e]=O[++t],c[++e]=O[++t],c[++e]=O[++t],c[++e]=O[++t],e+=13;e+=g}else for(q=0;16>q;++q){for(n=0;16>n;++n)c[e]=0<h?0:50397446,c[++e]=0<h?0:131843,f?(c[++e]=0,c[++e]=0,e+=13):e+=15;e+=g}if(0===(u|l|h)){for(h=1;h<Ta;++h)bb(a,h%9,7,J(h/9),h);m.T=!1}break}}}};let tb=null,ub=new Image;ub.crossOrigin="anonymous";ub.onload=()=>{var a=ma.createElement("canvas");a.width=256;a.height=26;a=a.getContext("2d");a.drawImage(ub,0,0);ub=null;tb=new Ja(a.getImageData(0,0,256,26).data.buffer)};
ub.src=ASSETS+"blocks.png";const wb=(a,c)=>{const g={Ha:c,wa:c.getContext("2d",{alpha:!1,desynchronized:!0}),Ia:null,La:"",L:!1,Ma:0,ya:0,Wa:Na(()=>(g.Ma=g.ya,g.ya=0),1E3),h:a};vb(g);return g},vb=a=>{(a.Ia=a.wa.createImageData(a.Ha.width=a.h.qa,a.Ha.height=a.h.ra)).data.fill(255);a.wa.fillStyle="rgba(255,255,255,.5)"};let xb=0;
const yb=()=>{const a={$:null,va:null,K:null,ja:null,aa:0,ma:0,na:0,oa:0,id:0,ca:0,da:0,s:0,Qa:.5,Ra:8.5,Sa:.5};return{l:null,ka:!1,g:!0,la:!1,Na:null,za:0,B:new Set,Ba:"",i:0,G:[],j:{ta:0,Ga:0,ua:0,H:0,ga:0,ha:0,O:0,J:-1,P:0,Y:null,Z:null,Aa:9,pa:0,name:"Gast",u:a.Qa,v:a.Ra,A:a.Sa,Oa:0,Pa:0,V:0,W:0,X:0},m:null,Ca:1,Da:1,qa:0,ra:0,Ta:null,time:0,Ea:0,o:a}},zb=(a,c)=>{a.m=wb(a,c);a.Ta=Na(()=>{a.g||(a.time=(a.time+1)%24E3,a.Ea=1/24E3*(a.time+6E3)%1,pb(a.o,a.j,!1))},50)},P=(a,c)=>a===c?0:.1-.2*a,Ab=
a=>{a.j.ta=P((a=a.B).has(-12)||a.has(65),a.has(-13)||a.has(68))},Bb=a=>{a.j.Ga=P((a=a.B).has(-15)||a.has(16),a.has(-14)||a.has(32))},Cb=a=>{a.j.ua=P((a=a.B).has(-11)||a.has(83),a.has(-10)||a.has(87))},Eb=(a,c,g)=>{const b=a.B,d=a.j;if(g){if(b.has(c))return!1;b.add(c);const l=d.O;var k=d.J;g=d.P;switch(c){case -18:case -19:a.j.Oa=P(a.B.has(-18),a.B.has(-19));break;case -17:case -16:a.j.Pa=P(a.B.has(-17),a.B.has(-16));break;case -1:0<=k&&(0===d.pa?bb(a.o,l,k,g,0):Db(a,[l,k,g],!1));break;case -2:case 71:0<=
k&&(c=a.o,d.Aa=0>k||63<k?0:c.$[(l<<c.s+4|g)<<6|k]);break;case -3:if(0<=k)if(0===d.pa){c=l;switch(d.ha){case 0:--c;break;case 1:++c;break;case 2:--k;break;case 3:++k;break;case 4:--g;break;default:++g}0<=k&&64>k&&bb(a.o,c&(1<<4+a.o.s)-1,k,g&(1<<4+a.o.s)-1,d.Aa)}else Db(a,[l,k,g],!0);break;case 27:a.i?(a.g=!1,a.i=0):(a.g=!0,a.i=1);break;case -15:case -14:case 16:case 32:Bb(a);break;case -12:case -13:case 65:case 68:Ab(a);break;case 80:a.g=!a.g;break;case -11:case -10:case 83:case 87:Cb(a);break;case 84:if(!a.i){a.i=
2;for(const f of b)Eb(a,f,!1)}break;case 114:a.ka=!a.ka;break;default:return!1}}else{if(!b.delete(c))return!1;switch(c){case -15:case -14:case 16:case 32:Bb(a);break;case -12:case -13:case 65:case 68:Ab(a);break;case -11:case -10:case 83:case 87:Cb(a);break;case -18:case -19:a.j.Oa=P(a.B.has(-18),a.B.has(-19));break;case -17:case -16:a.j.Pa=P(a.B.has(-17),a.B.has(-16))}}a.Ba=[...b].join();return!0},Fb=(a,c)=>(c=c.startsWith("~")?a+La(c.substr(1)):La(c),isNaN(c)?a:c),Q=(a,c)=>{(a.G=a.G.slice(-49)).push({id:++xb,
time:ha(),value:c})},Db=(a,c,g)=>{g?a.j.Z=c:a.j.Y=c;Q(a,`${g?"second":"first"} position: ${c.join(" ")}`)};
function Gb({actions:{Ua:a,Ka:c},l:g,h:b}){x("div[className=menu]");return[F("h1[innerText=Men\u00fc]"),F("div[className=settings]",null,[F("button",{innerText:"Oberfl\u00e4chen: "+(g.U?"Texturiert":"Einfarbig"),onclick:C(()=>a(d=>({U:!d.U})))}),F("label[innerText=Aufl\u00f6sung:]",null,[F("input[type=range][min=1][max=100][step=1]",{value:101-g.M,onchange:C(d=>c({M:101-Number(d.target.value)}))})]),F("label[innerText=Blickwinkel:]",null,[F("input[type=range][min=1][max=180][step=1]",{value:g.ea,
onchange:C(d=>c({ea:Number(d.target.value)}))})]),F("label[innerText=Sichtweite:]",null,[F("input[type=range][min=1][max=128][step=1]",{value:g.N,onchange:C(d=>c({N:Number(d.target.value)}))})]),F("label[innerText=Mausempfindlichkeit:]",null,[F("input[type=range][min=1][max=15][step=1]",{value:g.ba,onchange:C(d=>c({ba:Number(d.target.value)}))})])]),F("center",null,[F("button[innerText=Zur\u00fcck]",{onclick:C(d=>(b.i=0,"mouse"===d.pointerType?b.Na.requestPointerLock():b.g=!1))})])]}
const Hb=({I:{value:a}})=>(x("div",{innerText:a}),null);
function Ib({h:a,G:c}){x("div[className=menu terminal]");const g=C({history:null});A(b=>{b&&Ma(()=>g.history.scrollTop=1E9,0)},[c.length&&c[c.length-1].id]);return[F("div[className=history]",{R:C(b=>{g.history=b})},[fa(Hb,c)]),F("input[enterkeyhint=send][mozactionhint=send][name=message][required]",C({onkeydown:b=>{var d=b.keyCode;b=b.target;if(13===d){var k=b.value;d=a.j;if(k)if("/"===k.charAt(0)){k=k.substr(1).split(" ");var l=k.shift();switch(l){case "clear":a.G=[];break;case "exit":a.g=!1;a.i=
0;break;case "give":k=parseInt(k[0]);!isNaN(k)&&0<k&&25>k?(d.Aa=k,Q(a,"selected block "+k)):Q(a,"invalid block id");break;case "help":Q(a,"commands: clear, exit, give, help, save, spawn, tp, version, /regen");break;case "save":rb(a.o);Q(a,"world saved.");break;case "smart":d.name="LFF5644";Q(a,"lff.smart: true");break;case "spawn":d.u=a.o.Qa;d.v=a.o.Ra;d.A=a.o.Sa;a.m.L=!0;break;case "teleport":case "tp":3===k.length?(Q(a,`teleported to ${d.u=Fb(d.u,k[0])} ${d.v=Fb(d.v,k[1])} ${d.A=Fb(d.A,k[2])}`),
a.m.L=!0):Q(a,"PITCH");break;case "version":Q(a,"Minicraft 0.5.8");break;case "/exit":d.pa=0;Q(a,"normal mouse mode");break;case "/expand":a.j.Y&&a.j.Z?l=!0:(Q(a,"selection required"),l=!1);l&&("vert"===k[0]?(d.Y[1]=0,d.Z[1]=63,Q(a,"selection expanded")):Q(a,"only vert supported"));break;case "/pos1":case "/pos2":Db(a,[J(d.u),J(d.v),J(d.A)],"/pos2"===l);break;case "/regen":d=a.o;k=d.K[d.ja[d.aa=0].Ja];Ha.removeItem(sb(d,k.fa,k.sa,k.y));k.T=!1;++k.fa;db(d);Q(a,"regenerate chunk");a.m.L=!0;break;case "/show":Q(a,
`first: ${d.Y?d.Y.join(" "):"none"}, second: ${d.Z?d.Z.join(" "):"none"}`);break;case "/wand":d.pa=1;Q(a,"primary+secondary button for selection");break;default:Q(a,"unknown command: "+l)}}else Q(a,`<${d.name}> `+k);b.value=""}else 27===d&&(a.g=!1,a.i=0)},R:b=>Ma(()=>b.focus(),0)}))]}const Jb=[["pick",-2],["up",-14],["down",-15],["T",84],["F3",114],["...",27]],Kb=[["up",-10],["down",-11],["left",-12],["right",-13],["center",-1]],Lb=[["up",-16],["down",-17],["left",-18],["right",-19],["center",-3]];
function Mb({h:a}){const c=a.B,g=([b,d])=>F("div",{D:{code:d},F:{button:!0,[b]:!0,active:c.has(d)}});x("div[className=touch]",C({ontouchstart:b=>{b.preventDefault();const d=Number(b.target.dataset.code);if(null!=d&&Eb(a,d,!0)){const k=b.changedTouches[0].identifier,l=f=>{f.changedTouches[0].identifier===k&&(removeEventListener("touchend",l),Eb(a,d,!1))};addEventListener("touchend",l)}}}));return[F("div[className=top]",null,Jb.map(([b,d])=>F(`div[innerText=${b}]`,{D:{code:d},F:{button:!0,active:c.has(d)}}))),
F("div[className=move]",null,Kb.map(g)),F("div[className=move sec]",null,Lb.map(g))]}
function Nb({actions:a,l:c,Xa:g}){const b=ba(yb),d=ha(),k=x("div[className=game]",ba(()=>{const f=e=>0!==b.i||(b.la=!1,ma.pointerLockElement===k?b.g||Eb(b,-1-e.button,"mousedown"===e.type):b.Na.requestPointerLock(),e.preventDefault(),!1);return{onmousedown:f,onmousemove:e=>{if(!b.g&&!b.i){const h=b.l.ba*na/K(b.Ca,b.Da);Va(b.j,e.movementX*h,-e.movementY*h)}},onmouseup:f,ontouchstart:e=>{b.la=!0;b.i||(b.g=!1,e.preventDefault())}}})),l=ma.pointerLockElement===k;A(()=>(b.Na=k,g.h=b,()=>{Oa(b.Ta);Oa(b.m.Wa);
return g.h=null}));A(()=>{b.l=c;b.m&&(b.m.L=!0);const f=b.j,e=b.o;var h=b.l.N;h=17>h?2:49>h?3:113>h?4:241>h?5:497>h?6:1009>h?7:2033>h?8:4081>h?9:8177>h?10:16369>h?11:32753>h?12:13;if(e.s!==h){e.K&&rb(e);const q=1<<(e.s=h),n=e.K=[];for(let m=0;m<q;++m)for(let u=0;u<q;++u)for(let v=0;4>v;++v)n.push({T:!1,loaded:!1,x:m,y:v,z:u,fa:0,sa:0});e.$=new Ia((e.va=new Ja(q<<h+12+2-2)).buffer);pb(e,f,!0)}},[c]);A((f,e,h)=>{b.Ca=K(1,f*h);b.Da=K(1,e*h);e=b.l.M;f=K(1,wa(b.Ca/e));e=K(1,wa(b.Da/e));if(f!==b.qa||e!==
b.ra)b.qa=f,b.ra=e,b.m&&(b.m.L=!0,vb(b.m))},[k.offsetWidth,k.offsetHeight,ia.devicePixelRatio||1,c.M]);A(()=>{l||b.g||b.i||(b.i=1);b.g=!l},[l]);A(f=>l&&f&&ma.exitPointerLock(),[b.g||b.i]);A(()=>{if(b.za&&!b.g){var f=b.j,e=xa(5,.01*(d-b.za));f.V-=.1*f.V*e;f.W-=.1*f.W*e;f.X-=.1*f.X*e;f.V+=(ya(f.H)*f.ta+za(f.H)*f.ua)*e;f.W+=f.Ga*e;f.X+=(-za(f.H)*f.ta+ya(f.H)*f.ua)*e;Va(f,f.Oa*e,f.Pa*e);f.u+=f.V*e;f.v+=f.W*e;f.A+=f.X*e}if(b.m){f=b.m;++f.ya;var h=f.wa,q=f.Ia;e=f.h;const ja=e.l,p=e.j,L=e.qa,N=e.ra,H=e.o;
if(!e.g||f.L){f.L=!1;const U=q.data,Pb=ja.N;var n=p.H,m=p.ga;const Qb=p.O,Rb=p.J,Sb=p.P;var u=p.u,v=p.v,t=p.A;const Tb=H.$;var y=H.s;const Ub=ja.U&&null!==tb;var r=1/L,G=1/N;const V=L>>1,W=N>>1,eb=xa(L,N),fb=32<eb,gb=ya(n);n=za(n);const hb=ya(-m);m=za(-m);var X=ja.ea/45;const Vb=r*(L<N?X*L*G:X);r=G*(N<L?X*N*r:X);u+=65536;v+=65536;t+=65536;G=u%1;X=v%1;const Wb=t%1;y=4+y;const ib=(1<<y)-1;let jb=5,R=p.O=p.P=p.ha=0;p.J=-1;for(let pa=0;pa<N;++pa){var qa=(W-pa)*r;const kb=qa*hb-m;var Ba=qa*m+hb;qa=Ba*
n;Ba*=gb;for(let ra=0;ra<L;++ra){var ka=(ra-V)*Vb;const lb=qa+gb*ka;ka=Ba-n*ka;let la=16757124,sa=1,mb=Pb;for(let z=0;3>z;++z){let D=ka;0===z&&(D=lb);1===z&&(D=kb);var S=1/(0>D?-D:D);const ta=lb*S,T=kb*S;S*=ka;const nb=Aa(ta*ta+T*T+S*S);var B=Wb;0===z&&(B=G);1===z&&(B=X);0<D&&(B=1-B);let Y=u+ta*B,Z=v+T*B,aa=t+S*B;B*=nb;0===z&&(Y+=.5-(0>D|0));1===z&&(Z+=.5-(0>D|0));2===z&&(aa+=.5-(0>D|0));for(let Ca,Da,Ea,E;B<mb;Y+=ta,Z+=T,aa+=S,B+=nb)if(65536>Z){if(0>T)break}else if(65600<=Z){if(0<T)break}else if(0!==
(E=Tb[((Ca=Y&ib)<<y|(Ea=aa&ib))<<6|(Da=Z&63)])){pa===W&&ra===V&&B<=jb&&(p.O=Ca,p.J=Da,p.P=Ea,p.ha=0>D|z<<1,jb=B);if(Ub){--E;1===z?6===E?E=25:13===E?E=4:1===E&&0<T&&(E=2):1===E&&(E=24);const ob=tb[E<<8|(16*(1===z?aa:Z)&15)<<4|16*(1===z?Y:(0<D?Y-aa:aa-Y)+65536.5)&15];if(0===ob>>>24)continue;la=ob&16777215}else la=Sa[E];mb=B;sa=(0===z?.8:2===z?.6:0<D?.4:1)+(Da!==Rb||Ca!==Qb||Ea!==Sb?0:.2);break}}U[R]=(la&255)*sa;U[++R]=(la>>8&255)*sa;U[++R]=(la>>16)*sa;R+=2}}fb||(U[R=L*W+V<<2]+=128,U[++R]+=128,U[++R]+=
128);h.putImageData(q,0,0);fb&&(q=va(.05*eb),h.fillRect(V-q,W-1,q<<1,2),h.fillRect(V-1,W-q,2,q-1),h.fillRect(V-1,W+1,2,q-1))}e.ka?(0>p.J?h=0:(h=p.J,h=p.O+" "+p.J+" "+p.P+" "+Ua[p.ha]+": "+(0>h||63<h?0:H.$[(p.O<<H.s+4|p.P)<<6|h])),e="Minicraft 0.5.8 "+J(f.Ma).toString().padStart(2,"\u00a0")+" fps, T: "+J(24*e.Ea).toString().padStart(2,"0")+":"+J(24*e.Ea%1*60).toString().padStart(2,"0")+"; "+(e.g&&500>d%1E3?"":e.time)+"\nR: "+L+"x"+N+" (x"+ja.M+"), D: "+ja.N+", C: "+H.aa+"/"+H.ja.length+", M: "+(64*
M(1<<4+H.s)>>10)+"k\nE: 0/0\n\nPosition: "+p.u.toFixed(2)+" "+p.v.toFixed(2)+" "+p.A.toFixed(2)+"\nAngle: "+(p.H*ua).toFixed(2)+" "+(p.ga*ua).toFixed(2)+"\nBlock: "+h+"\nChunk abs: "+(J(p.u)>>4)+" "+(J(p.A)>>4)+" "+(J(p.v)>>4)+" rel: "+H.ma+" "+H.oa+" "+H.na):e="";f.La=e}b.za=d},[d]);da();return[F("canvas",{R:C(f=>zb(b,f))}),2!==b.i&&ea(Ra,{G:b.G,Fa:d}),b.m&&b.ka&&F("div[className=diagnostics]",{innerText:b.m.La}),b.la&&ea(Mb,{h:b,Ba:b.Ba}),1===b.i&&ea(Gb,{actions:a,l:c,h:b}),2===b.i&&ea(Ib,{h:b,
G:b.G})]}
const Ob={init:()=>{const a={U:!0,ba:3,M:10,ea:80,N:64};var c=Ha.getItem("minicraft.config");if(c){c=Ga.parse(c);let g=c.flag_textures;null!=g&&(a.U=g);null!=(g=c.mouse_sensitivity)&&(a.ba=g);a.M=c.resolution_scaling;a.ea=c.view_angle;a.N=c.view_distance}return{l:a}},Va:a=>{const c=a.l;Ha.setItem("minicraft.config",Ga.stringify({version:"0.5.8",flag_textures:c.U,mouse_sensitivity:c.ba,resolution_scaling:c.M,view_angle:c.ea,view_distance:c.N}));return a},Ua:(a,c)=>Ob.Ka(a,c(a.l)),Ka:(a,c)=>Object.assign({},
a,{l:Object.assign({},a.l,c)})};w.init(()=>{const [a,c]=ca(Ob),g=C({h:null});A(()=>{onbeforeunload=()=>{c.Va();g.h&&rb(g.h.o)}});const b=C(d=>"INPUT"===d.target.tagName||!g.h||(d.preventDefault(),Eb(g.h,d.keyCode,"keydown"===d.type),g.h.la=!1));return[{onkeydown:b,onkeyup:b,oncontextmenu:Pa,ondragstart:Pa},[ea(Nb,{actions:c,l:a.l,Xa:g})]]});
