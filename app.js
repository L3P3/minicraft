const t=lui,aa=t.hook_callback,z=t.hook_dom,A=t.hook_effect,ba=t.hook_memo,ca=t.hook_reducer,da=t.hook_rerender,F=t.hook_static,G=t.node,H=t.node_dom,ea=t.node_map,fa=t.now,la=[0,8487297,4305266,4349313,8092539,5342114,7039851,3561583,4172910,6384533,15526888,10671324,8092798,16447200,4151672,1970708,8092539,9686227,9126695,15198183,5567485,14541182,7920469,662956,14936813],ma=la.length,na="WEBTSN".split(""),oa=[6,1,1,3,3,3,2],pa=oa.length,O=document,Q=Math,R=Q.PI,qa=.5*R,wa=180/R,S=Q.floor,xa=Q.round,
ya=Q.min,T=Q.max,za=Q.cos,Aa=Q.sin,Ba=Q.sqrt,Ca=String.fromCharCode,Da=JSON,Ea=localStorage,Fa=Uint8Array,Ga=Uint32Array,Y=Map,Ha=setTimeout,Ia=setInterval,Ja=clearInterval,Ka=()=>!1,La=[()=>{const a={M:!0,Z:3,K:10,aa:80,L:64};var e=Ea.getItem("minicraft.config");if(e){e=Da.parse(e);let d=e.flag_textures;null!=d&&(a.M=d);null!=(d=e.mouse_sensitivity)&&(a.Z=d);a.K=e.resolution_scaling;a.aa=e.view_angle;a.L=e.view_distance}return{m:a}},a=>{const e=a.m;Ea.setItem("minicraft.config",Da.stringify({version:"0.4.4",
flag_textures:e.M,mouse_sensitivity:e.Z,resolution_scaling:e.K,view_angle:e.aa,view_distance:e.L}));return a},(a,e)=>Object.assign({},a,{m:Object.assign({},a.m,e)})],Ma=a=>{a+=32;33<a&&39>a?a++:38<a&&44>a?a+=2:43<a&&127>a?a+=3:126<a&&55258>a?a+=37:55295<a&&(a+=8485);return Ca(a)},Na=a=>a-(63743<a?8517:159<a?69:46<a&&130>a?35:40<a&&46>a?34:34<a&&40>a?33:32),Pa=()=>{var a=Oa;const e=a.length,d=new Y,b=r=>{k=k<<1|r&1;15===++m&&(n+=Ma(k),k=m=0)},h=()=>{for(let r=0;r<q;++r)b(0)},l=r=>{b(r);b(r>>1);b(r>>
2);b(r>>3);b(r>>4);b(r>>5);b(r>>6);b(r>>7)},g=()=>{0===--u&&(u=1<<q++)},c=()=>{if(B)B=!1;else{let r=v.id;for(let C=0;C<q;C++)b(r>>C)}};let f=a[0],n="",k=0,m=2,q=2,u=2,w=2,v={id:w++,da:new Y},B=!0;l(f);d.set(f,v);for(let r=1;r<e;++r){const C=v.da.get(f=a[r]);C?v=C:(c(),d.has(f)||(g(),h(),l(f),d.set(f,{id:w++,da:new Y}),B=!0),v.da.set(f,{id:w++,da:new Y}),v=d.get(f),g())}c();d.has(f)||(g(),h(),l(f));g();b(1);--q;h();return n+=Ma(k<<15-m)},Qa=a=>{var e=Oa;if(!a)return null;const d=a.length,b=()=>{m+=
(w>>--v&1)<<q++;0===v&&(v=15,w=Na(a.charCodeAt(u++)))};let h=[0,1],l=1,g=3,c=2,f=null;var n=null;let k=0,m=0;n=2;let q=0,u=0,w=Na(a.charCodeAt(u++)),v=15;for(;q<n;)b();if(1===m)return null;for(m=q=0;8>q;)b();f=[m];h[2]=f;for(e[k++]=m;u<=d;){n=c;for(m=q=0;q<n;)b();if(0===m){for(m=q=0;8>q;)b();h[g]=[m];m=g++;0===--l&&(l=1<<c++)}else if(1===m)return e;n=m<h.length?h[m]:f.concat(f[0]);for(let B=0;B<n.length;B++)e[k++]=n[B];h[g++]=f.concat(n[0]);f=n;0===--l&&(l=1<<c++)}return null},Ra=new Ga(4);
for(let a=0;a<pa;++a)Ra[a>>2]|=oa[a]<<(a<<3);
const Sa=new Ga(1024),Oa=new Fa(Sa.buffer),Ta=new Y,Ua=(a,e,d,b,h)=>{const l=a.G[e>>4<<a.l|b>>4];a.W[(e<<a.l+4|b)<<4|d]=h;l.X=!0},fb=a=>{const e=a.qa,d=a.ra,b=a.l,h=`${b} ${e} ${d}`;let l=Ta.get(h);if(null==l){const g=1<<b;Ta.set(h,l=a.G.map(({x:c,z:f},n)=>{var k=c-e;k*=k;var m=f-d;m*=m;var q=c-e-g;let u=q*q,w=q=0;u<k&&(k=u,q=-g);c=c-e+g;(u=c*c)<k&&(k=u,q=g);c=f-d-g;(u=c*c)<m&&(m=u,w=-g);f=f-d+g;(u=f*f)<m&&(m=u,w=g);return{Ea:Ba(k+m),Ma:n,O:q,P:w}}).sort((c,f)=>c.Ea-f.Ea))}a.oa=l;a.ea=0},gb=(a,e)=>
{const d=a.ma,b=e.x<<4,h=e.z<<4;for(let l=0,g=0;16>l;++l){const c=(b+l<<a.l+4|h)<<2;Sa.set(d.subarray(c,c+64),g);g+=64}Ea.setItem(`minicraft.world.${a.id}:${e.ya}/${e.za}`,Pa());e.X=!1},hb=a=>{var e=a.G,d=a.oa,b=a.O,h=a.P;const l=d.length;for(;a.ea<l;){var g=d[a.ea++];const n=e[g.Ma];var c=n.x,f=n.z;const k=b+g.O+c;g=h+g.P+f;if(k!==n.ya||g!==n.za){n.X&&gb(a,n);d=Qa(Ea.getItem(`minicraft.world.${a.id}:${n.ya=k}/${n.za=g}`));e=a.ma;c<<=4;f<<=4;if(d)for(let m=0,q=0;16>m;++m)e.set(Sa.subarray(q,q+=64),
(c+m<<a.l+4|f)<<2);else for(d=0;16>d;++d)for(b=(c+d<<a.l+4|f)<<2,h=0;16>h;++h)e.set(Ra,b),b+=4;break}}};let ib=null,Z=new Image;Z.crossOrigin="anonymous";Z.onload=()=>{var a=O.createElement("canvas");a.width=256;a.height=26;a=a.getContext("2d");a.drawImage(Z,0,0);Z=null;ib=new Ga(a.getImageData(0,0,256,26).data.buffer)};Z.src=ASSETS+"blocks.png";
const kb=(a,e)=>{const d={na:e,Ba:null,Ca:null,Da:"",ga:!1,Fa:0,sa:0,Na:Ia(()=>(d.Fa=d.sa,d.sa=0),1E3),i:a};jb(d);return d},jb=a=>{var e=a.na.width=a.i.ia,d=a.na.height=a.i.ja;a=(a.Ca=(a.Ba=a.na.getContext("2d")).createImageData(e,d)).data;e=a.length;for(d=3;d<e;d+=4)a[d]=255};let lb=0;
const mb=()=>{const a={W:null,ma:null,G:null,oa:null,ea:0,qa:0,ra:0,id:0,O:0,P:0,l:0,Ia:.5,Ja:pa+1.5,Ka:.5};return{m:null,fa:!1,h:!0,ha:!1,Ga:null,ta:0,Y:new Set,ua:"",j:0,N:[],g:{ka:0,Aa:0,la:0,v:0,ba:0,ca:0,A:0,o:-1,B:0,Ha:9,H:a.Ia,$:a.Ja,J:a.Ka,T:0,U:0,V:0},u:null,va:1,wa:1,ia:0,ja:0,La:null,time:0,xa:0,s:a}},nb=(a,e)=>{a.u=kb(a,e);a.La=Ia(()=>{if(!a.h){a.time=(a.time+1)%24E3;a.xa=1/24E3*(a.time+6E3)%1;var d=a.g,b=a.s,h=S(d.H)>>4;d=S(d.J)>>4;if(b.O+b.qa!==h||b.P+b.ra!==d){const l=1<<b.l;b.O=h-
(b.qa=(65536+h)%l);b.P=d-(b.ra=(65536+d)%l);fb(b)}hb(b)}},50)},ob=a=>{var e=a.g,d=(a=a.Y).has(-12)||a.has(65);a=a.has(-13)||a.has(68);e.ka=d===a?0:.1-.2*d},pb=a=>{var e=a.g,d=(a=a.Y).has(-15)||a.has(16);a=a.has(-14)||a.has(32);e.Aa=d===a?0:.1-.2*d},qb=a=>{var e=a.g,d=(a=a.Y).has(-11)||a.has(83);a=a.has(-10)||a.has(87);e.la=d===a?0:.1-.2*d},rb=(a,e,d)=>{const b=a.Y;if(d){if(b.has(e))return!1;b.add(e);switch(e){case -1:0<=a.g.o&&Ua(a.s,a.g.A,a.g.o,a.g.B,0);break;case -2:case 71:0<=a.g.o&&(e=a.s,d=a.g.o,
a.g.Ha=0>d||16<=d?0:e.W[(a.g.A<<e.l+4|a.g.B)<<4|d]);break;case -3:if(0<=a.g.o){e=a.g.A;d=a.g.o;let h=a.g.B;switch(a.g.ca){case 0:--e;break;case 1:++e;break;case 2:--d;break;case 3:++d;break;case 4:--h;break;default:++h}0<=d&&16>d&&Ua(a.s,e&(1<<4+a.s.l)-1,d,h&(1<<4+a.s.l)-1,a.g.Ha)}break;case 27:a.j?(a.h=!1,a.j=0):(a.h=!0,a.j=1);break;case -15:case -14:case 16:case 32:pb(a);break;case -12:case -13:case 65:case 68:ob(a);break;case 80:a.h=!a.h;break;case 82:a.g.H=a.s.Ia;a.g.$=a.s.Ja;a.g.J=a.s.Ka;break;
case -11:case -10:case 83:case 87:qb(a);break;case 84:a.j||(a.j=2);break;case 114:a.fa=!a.fa;break;default:return!1}}else{if(!b.delete(e))return!1;switch(e){case -15:case -14:case 16:case 32:pb(a);break;case -12:case -13:case 65:case 68:ob(a);break;case -11:case -10:case 83:case 87:qb(a)}}a.ua=[...b].join();return!0},sb=(a,e)=>{a.N=[...a.N.slice(-30),{id:++lb,time:fa(),value:e}]};
function tb({m:a,pa:e,i:d}){z("div[className=menu]");return[H("h1[innerText=Men\u00fc]"),H("div[className=settings]",null,[H("button",{innerText:"Oberfl\u00e4chen: "+(a.M?"Texturiert":"Einfarbig"),onclick:aa(b=>{e(2,{M:!b})},[a.M])}),H("label[innerText=Aufl\u00f6sung:]",null,[H("input[type=range][min=1][max=100][step=1]",{value:101-a.K,onchange:F(b=>e(2,{K:101-Number(b.target.value)}))})]),H("label[innerText=Blickwinkel:]",null,[H("input[type=range][min=1][max=180][step=1]",{value:a.aa,onchange:F(b=>
e(2,{aa:Number(b.target.value)}))})]),H("label[innerText=Sichtweite:]",null,[H("input[type=range][min=1][max=128][step=1]",{value:a.L,onchange:F(b=>e(2,{L:Number(b.target.value)}))})]),H("label[innerText=Mausempfindlichkeit:]",null,[H("input[type=range][min=1][max=15][step=1]",{value:a.Z,onchange:F(b=>e(2,{Z:Number(b.target.value)}))})])]),H("center",null,[H("button[innerText=Zur\u00fcck]",{onclick:F(b=>(d.j=0,"mouse"===b.pointerType?d.Ga.requestPointerLock():d.h=!1))})])]}
const ub=({I:{value:a}})=>(z("div",{innerText:a}),null);
function vb({i:a,N:e}){z("div[className=menu terminal]");const d=F({history:null});A(b=>{b&&Ha(()=>d.history.scrollTop=1E9,0)},[e.length&&e[e.length-1].id]);return[H("div[className=history]",{R:F(b=>{d.history=b})},[ea(ub,e)]),H("input[enterkeyhint=send][mozactionhint=send][name=message][required]",F({onkeydown:b=>{var h=b.keyCode;const l=b.target;if(13===h){if(h=l.value)if("/"===h.charAt(0))switch(h=h.substr(1).split(" ").shift(),h){case "clear":a.N=[];break;case "exit":a.h=!1;a.j=0;break;case "help":sb(a,
"commands: clear, exit, help, version");break;case "version":sb(a,"Minicraft 0.4.4");break;default:sb(a,"unknown command: "+h)}else sb(a,"<me> "+h);l.value=""}else 27===h&&(a.h=!1,a.j=0);b.stopPropagation()},onkeyup:b=>b.stopPropagation(),R:b=>Ha(()=>b.focus(),0)}))]}const wb=[["place",-3],["pick",-2],["up",-14],["down",-15],["R",82],["T",84],["F3",114],["...",27]],xb=[["up",-10],["down",-11],["left",-12],["right",-13],["center",-1]];
function yb({i:a}){const e=a.Y;z("div[className=touch]",F({ontouchstart:d=>{d.preventDefault();const b=Number(d.target.dataset.code);if(null!=b&&rb(a,b,!0)){const h=d.changedTouches[0].identifier,l=g=>{g.changedTouches[0].identifier===h&&(removeEventListener("touchend",l),rb(a,b,!1))};addEventListener("touchend",l)}}}));return[H("div[className=top]",null,wb.map(([d,b])=>H(`div[innerText=${d}]`,{D:{code:b},F:{button:!0,active:e.has(b)}}))),H("div[className=move]",null,xb.map(([d,b])=>H("div",{D:{code:b},
F:{button:!0,[d]:!0,active:e.has(b)}})))]}
function zb({m:a,pa:e,Oa:d}){const b=ba(mb),h=z("div[className=game]",ba(()=>{const g=c=>0!==b.j||(b.ha=!1,O.pointerLockElement===h?b.h||rb(b,-1-c.button,"mousedown"===c.type):b.Ga.requestPointerLock(),c.preventDefault(),!1);return{onmousedown:g,onmousemove:c=>{if(!b.h&&!b.j){const f=b.m.Z*R/T(b.va,b.wa);b.g.v=(b.g.v+c.movementX*f+100*R)%(2*R);b.g.ba=T(-qa,ya(qa,b.g.ba-c.movementY*f))}},onmouseup:g,ontouchstart:c=>{b.ha=!0;b.j||(b.h=!1,c.preventDefault())}}})),l=O.pointerLockElement===h;A(()=>(b.Ga=
h,d.i=b,()=>{Ja(b.La);Ja(b.u.Na);return d.i=null}));A(()=>{b.m=a;b.u&&(b.u.ga=!0);const g=b.s;var c=b.m.L;c=17>c?2:49>c?3:113>c?4:241>c?5:497>c?6:1009>c?7:2033>c?8:4081>c?9:8177>c?10:16369>c?11:32753>c?12:13;if(g.l!==c){if(g.G)for(var f of g.G)f.X&&gb(g,f);g.ma=new Ga((g.W=new Fa(1<<12+(c<<1))).buffer);f=1<<(g.l=c);c=g.G=[];for(let n=0;n<f;++n)for(let k=0;k<f;++k)c.push({X:!1,x:n,z:k,ya:g.O+n+1,za:g.P+k+1});fb(g);hb(g);for(f=1;f<ma;++f)Ua(g,f%9,pa,S(f/9),f)}},[a]);A((g,c)=>{b.va=T(1,g);b.wa=T(1,c);
c=b.m.K;g=T(1,xa(b.va/c));c=T(1,xa(b.wa/c));if(g!==b.ia||c!==b.ja)b.ia=g,b.ja=c,b.u&&(b.u.ga=!0,jb(b.u))},[h.offsetWidth,h.offsetHeight,a.K]);A(()=>{l||b.h||b.j||(b.j=1);b.h=!l},[l]);A(g=>l&&g&&O.exitPointerLock(),[b.h||b.j]);A(g=>{if(b.ta&&!b.h){var c=b.g,f=ya(5,.01*(g-b.ta));c.T-=.1*c.T*f;c.U-=.1*c.U*f;c.V-=.1*c.V*f;c.T+=(za(c.v)*c.ka+Aa(c.v)*c.la)*f;c.U+=c.Aa*f;c.V+=(-Aa(c.v)*c.ka+za(c.v)*c.la)*f;c.H+=c.T*f;c.$+=c.U*f;c.J+=c.V*f}if(b.u){c=b.u;++c.sa;var n=c.Ca;f=c.i;const U=f.m,p=f.g,I=f.ia,J=
f.ja,K=f.s;if(!f.h||c.ga){c.ga=!1;var k=n.data;const Ab=U.L;var m=p.v,q=p.ba;const Bb=p.A,Cb=p.o,Db=p.B,Eb=K.W,Fb=U.M&&null!==ib;var u=1/I,w=1/J;const ra=I>>1,sa=J>>1,Va=za(m);m=Aa(m);const Wa=za(-q);q=Aa(-q);var v=U.aa/45;const Gb=u*(I<J?v*I*w:v);u=w*(J<I?v*J*u:v);w=p.H+65536;v=p.$+65536;const Xa=p.J+65536,Hb=w%1,Ib=v%1,Jb=Xa%1,Ya=4+K.l,Za=(1<<Ya)-1;let $a=5,L=p.A=p.B=p.ca=0;p.o=-1;for(let ha=0;ha<J;++ha){var B=(sa-ha)*u;const ab=B*Wa-q;var r=B*q+Wa;B=r*m;r*=Va;for(let ia=0;ia<I;++ia){var C=(ia-
ra)*Gb;const bb=B+Va*C;C=r-m*C;let V=16757124,ja=1,cb=Ab;for(let x=0;3>x;++x){let E=C;0===x&&(E=bb);1===x&&(E=ab);var M=1/(0>E?-E:E);const ka=bb*M,N=ab*M;M*=C;const db=Ba(ka*ka+N*N+M*M);var y=Jb;0===x&&(y=Hb);1===x&&(y=Ib);0<E&&(y=1-y);let W=w+ka*y,P=v+N*y,X=Xa+M*y;y*=db;0===x&&(W+=.5-(0>E|0));1===x&&(P+=.5-(0>E|0));2===x&&(X+=.5-(0>E|0));for(let ta,ua,va,D;y<cb;W+=ka,P+=N,X+=M,y+=db)if(65536>P){if(0>N)break}else if(65552<=P){if(0<N)break}else if(0!==(D=Eb[((ta=W&Za)<<Ya|(va=X&Za))<<4|(ua=P&15)])){ha===
sa&&ia===ra&&y<=$a&&(p.A=ta,p.o=ua,p.B=va,p.ca=0>E|x<<1,$a=y);if(Fb){--D;1===x?6===D?D=25:13===D?D=4:1===D&&0<N&&(D=2):1===D&&(D=24);const eb=ib[D<<8|(16*(1===x?X:P)&15)<<4|16*(1===x?W:W-X+65536.5)&15];if(0===eb>>>24)continue;V=eb&16777215}else V=la[D];cb=y;ja=(0===x?.8:2===x?.6:0<E?.4:1)+(ua!==Cb||ta!==Bb||va!==Db?0:.2);break}}k[L]=(V&255)*ja;k[++L]=(V>>8&255)*ja;k[++L]=(V>>16)*ja;L+=2}}k[L=I*sa+ra<<2]+=128;k[++L]+=128;k[++L]+=128;c.Ba.putImageData(n,0,0)}f.fa?(n=1<<4+K.l,0>p.o?k=0:(k=p.o,k=p.A+
" "+p.o+" "+p.B+" "+na[p.ca]+": "+(0>k||16<=k?0:K.W[(p.A<<K.l+4|p.B)<<4|k])),f="Minicraft 0.4.4 "+S(c.Fa).toString().padStart(2,"\u00a0")+" fps, T: "+S(24*f.xa).toString().padStart(2,"0")+":"+S(24*f.xa%1*60).toString().padStart(2,"0")+"; "+(f.h&&500>g%1E3?"":f.time)+"\nR: "+I+"x"+J+" (x"+U.K+"), D: "+U.L+", C: "+K.ea+"/"+K.oa.length+", M: "+(n*n*16>>10)+"k\nE: 0/0\n\nPosition: "+p.H.toFixed(2)+" "+p.$.toFixed(2)+" "+p.J.toFixed(2)+"\nAngle: "+(p.v*wa).toFixed(2)+" "+(p.ba*wa).toFixed(2)+"\nBlock: "+
k+"\nChunk: "+(S(p.H)>>4)+" "+(S(p.J)>>4)):f="";c.Da=f}b.ta=g},[fa()]);da();return[H("canvas",{R:F(g=>nb(b,g))}),b.u&&b.fa&&H("div[className=diagnostics]",{innerText:b.u.Da}),b.ha&&G(yb,{i:b,ua:b.ua}),1===b.j&&G(tb,{m:a,pa:e,i:b}),2===b.j&&G(vb,{i:b,N:b.N})]}
t.init(()=>{const [a,e]=ca(La),d=F({i:null});A(()=>{onbeforeunload=()=>{e(1);if(d.i){var h=d.i.s;for(const l of h.G)l.X&&gb(h,l)}}});const b=F(h=>(h.preventDefault(),!d.i||(d.i.ha=!1,rb(d.i,h.keyCode,"keydown"===h.type))));return[{onkeydown:b,onkeyup:b,oncontextmenu:Ka,ondragstart:Ka},[G(zb,{m:a.m,pa:e,Oa:d})]]});
