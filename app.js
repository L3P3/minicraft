const x=lui,da=x.hook_callback,ea=x.hook_dom,z=x.hook_effect,fa=x.hook_memo,ha=x.hook_reducer,ia=x.hook_rerender,C=x.hook_static,ja=x.node,D=x.node_dom,pa=x.now,F=document,G=Math,L=G.PI,qa=.5*L,ra=180/L,M=G.floor,sa=G.round,ta=G.min,P=G.max,Q=G.cos,U=G.sin,ua=G.sqrt,va=String.fromCharCode,wa=JSON,V=localStorage,xa=Uint8Array,W=Uint32Array,X=Map,ya=()=>!1,za=[()=>{const a={L:!0,Y:3,H:10,$:80,J:64};var e=V.getItem("minicraft.config");if(e){e=wa.parse(e);let d=e.flag_textures;null!=d&&(a.L=d);null!=
(d=e.mouse_sensitivity)&&(a.Y=d);a.H=e.resolution_scaling;a.$=e.view_angle;a.J=e.view_distance}return{i:a}},a=>{const e=a.i;V.setItem("minicraft.config",wa.stringify({version:"0.2.0",flag_textures:e.L,mouse_sensitivity:e.Y,resolution_scaling:e.H,view_angle:e.$,view_distance:e.J}));return a},(a,e)=>Object.assign({},a,{i:Object.assign({},a.i,e)})],Aa=[0,7960953,5420927,3757176,8553090,5077911,4539717,31E5,2261551,8424632,14145495],Ba=Aa.length,Ca="WEBTSN".split(""),Da=[6,1,1,3,3,3,2],Ea=Da.length,Fa=
a=>{a+=32;33<a&&39>a?a++:38<a&&44>a?a+=2:43<a&&127>a?a+=3:126<a&&55258>a?a+=37:55295<a&&(a+=8485);return va(a)},Ga=a=>a-(63743<a?8517:159<a?69:46<a&&130>a?35:40<a&&46>a?34:34<a&&40>a?33:32),Ia=()=>{var a=Ha;const e=a.length,d=new X,b=r=>{q=q<<1|r&1;15===++m&&(h+=Fa(q),q=m=0)},k=()=>{for(let r=0;r<n;++r)b(0)},p=r=>{b(r);b(r>>1);b(r>>2);b(r>>3);b(r>>4);b(r>>5);b(r>>6);b(r>>7)},g=()=>{0===--v&&(v=1<<n++)},c=()=>{if(t)t=!1;else{let r=u.id;for(let l=0;l<n;l++)b(r>>l)}};let f=a[0],h="",q=0,m=2,n=2,v=2,
w=2,u={id:w++,da:new X},t=!0;p(f);d.set(f,u);for(let r=1;r<e;++r){const l=u.da.get(f=a[r]);l?u=l:(c(),d.has(f)||(g(),k(),p(f),d.set(f,{id:w++,da:new X}),t=!0),u.da.set(f,{id:w++,da:new X}),u=d.get(f),g())}c();d.has(f)||(g(),k(),p(f));g();b(1);--n;k();return h+=Fa(q<<15-m)},Ja=a=>{var e=Ha;if(!a)return null;const d=a.length,b=()=>{m+=(w>>--u&1)<<n++;0===u&&(u=15,w=Ga(a.charCodeAt(v++)))};let k=[0,1],p=1,g=3,c=2,f=null;var h=null;let q=0,m=0;h=2;let n=0,v=0,w=Ga(a.charCodeAt(v++)),u=15;for(;n<h;)b();
if(1===m)return null;for(m=n=0;8>n;)b();f=[m];k[2]=f;for(e[q++]=m;v<=d;){h=c;for(m=n=0;n<h;)b();if(0===m){for(m=n=0;8>n;)b();k[g]=[m];m=g++;0===--p&&(p=1<<c++)}else if(1===m)return e;h=m<k.length?k[m]:f.concat(f[0]);for(let t=0;t<h.length;t++)e[q++]=h[t];k[g++]=f.concat(h[0]);f=h;0===--p&&(p=1<<c++)}return null},Za=new W(4);for(let a=0;a<Ea;++a)Za[a>>2]|=Da[a]<<(a<<3);
const $a=new W(1024),Ha=new xa($a.buffer),ab=new X,bb=(a,e,d,b,k)=>{const p=a.B[e>>4<<a.h|b>>4];a.W[(e<<a.h+4|b)<<4|d]=k;p.X=!0},cb=a=>{const e=a.na,d=a.oa,b=a.h,k=`${b} ${e} ${d}`;let p=ab.get(k);if(null==p){const g=1<<b;ab.set(k,p=a.B.map(({x:c,z:f},h)=>{let q=Math.pow(c-e,2),m=Math.pow(f-d,2),n=Math.pow(c-e-g,2),v=0,w=0;n<q&&(q=n,v=-g);(n=Math.pow(c-e+g,2))<q&&(q=n,v=g);(n=Math.pow(f-d-g,2))<m&&(m=n,w=-g);(n=Math.pow(f-d+g,2))<m&&(m=n,w=g);return{za:ua(q+m),index:h,M:v,N:w}}).sort((c,f)=>c.za-
f.za))}a.la=p;a.ea=0},db=(a,e)=>{const d=a.ja,b=e.x<<4,k=e.z<<4;for(let p=0,g=0;16>p;++p){const c=((b+p<<a.h+4|k)<<4|0)>>2;$a.set(d.subarray(c,c+64),g);g+=64}V.setItem(`minicraft.world.${a.id}:${e.ua}/${e.va}`,Ia());e.X=!1},eb=a=>{var e=a.B,d=a.la,b=a.M,k=a.N;const p=d.length;for(;a.ea<p;){var g=d[a.ea++];const h=e[g.index];var c=h.x,f=h.z;const q=b+g.M+c;g=k+g.N+f;if(q!==h.ua||g!==h.va){h.X&&db(a,h);d=Ja(V.getItem(`minicraft.world.${a.id}:${h.ua=q}/${h.va=g}`));e=a.ja;c<<=4;f<<=4;if(d)for(let m=
0,n=0;16>m;++m)e.set($a.subarray(n,n+=64),((c+m<<a.h+4|f)<<4|0)>>2);else for(d=0;16>d;++d)for(b=((c+d<<a.h+4|f)<<4|0)>>2,k=0;16>k;++k)e.set(Za,b),b+=4;break}}};let fb=null,Y=new Image;Y.onload=()=>{var a=F.createElement("canvas");const e=a.width=Y.width,d=a.height=Y.height;a=a.getContext("2d");a.drawImage(Y,0,0);Y=fb=new W(a.getImageData(0,0,e,d).data.buffer)};Y.src="data:image/png;base64,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";
const hb=(a,e)=>{const d={ka:e,wa:null,xa:null,ya:"",ga:!1,Aa:0,pa:0,Ha:setInterval(()=>{d.Aa=d.pa;d.pa=0},1E3),m:a};gb(d);return d},gb=a=>{var e=a.ka.width=a.m.ha,d=a.ka.height=a.m.ia;a=(a.xa=(a.wa=a.ka.getContext("2d")).createImageData(e,d)).data;e=a.length;for(d=3;d<e;d+=4)a[d]=255},ib=()=>{const a={W:null,ja:null,B:null,la:null,ea:0,na:0,oa:0,id:0,M:0,N:0,h:0,Da:.5,Ea:Ea+1.5,Fa:.5};return{i:null,fa:!1,K:!1,l:!0,Ba:null,qa:0,g:{U:0,aa:0,V:0,u:0,ba:0,ca:0,v:0,j:-1,A:0,Ca:9,D:a.Da,Z:a.Ea,G:a.Fa,
O:0,P:0,T:0},s:null,ra:1,sa:1,ha:0,ia:0,Ga:null,time:0,ta:0,o:a}},jb=(a,e)=>{a.s=hb(a,e);a.Ga=setInterval(()=>{if(!a.l){a.time=(a.time+1)%24E3;a.ta=1/24E3*(a.time+6E3)%1;var d=a.g,b=a.o,k=M(d.D)>>4;d=M(d.G)>>4;if(b.M+b.na!==k||b.N+b.oa!==d){const p=1<<b.h;b.M=k-(b.na=(65536+k)%p);b.N=d-(b.oa=(65536+d)%p);cb(b)}eb(b)}},50)},kb=(a,e,d)=>{if(d)switch(e){case -1:0<=a.g.j&&bb(a.o,a.g.v,a.g.j,a.g.A,0);break;case -2:case 71:0<=a.g.j&&(e=a.o,d=a.g.j,a.g.Ca=0>d||16<=d?0:e.W[(a.g.v<<e.h+4|a.g.A)<<4|d]);break;
case -3:if(0<=a.g.j){e=a.g.v;d=a.g.j;let b=a.g.A;switch(a.g.ca){case 0:--e;break;case 1:++e;break;case 2:--d;break;case 3:++d;break;case 4:--b;break;default:++b}0<=d&&16>d&&bb(a.o,e&(1<<4+a.o.h)-1,d,b&(1<<4+a.o.h)-1,a.g.Ca)}break;case 27:a.l=a.K=!a.K;break;case 16:a.g.aa=-.1;break;case 32:a.g.aa=.1;break;case 65:a.g.U=-.1;break;case 68:a.g.U=.1;break;case 80:a.l=!a.l;break;case 82:a.g.D=a.o.Da;a.g.Z=a.o.Ea;a.g.G=a.o.Fa;break;case 83:a.g.V=-.1;break;case 87:a.g.V=.1;break;case 114:a.fa=!a.fa;break;
default:return!0}else switch(e){case 16:case 32:a.g.aa=0;break;case 65:case 68:a.g.U=0;break;case 83:case 87:a.g.V=0;break;default:return!0}return!1};
function lb({i:a,ma:e,m:d}){ea("div[className=menu]");return[D("h1[innerText=Men\u00fc]"),D("div[className=settings]",null,[D("button",{innerText:"Oberfl\u00e4chen: "+(a.L?"Texturiert":"Einfarbig"),onclick:da(b=>{e(2,{L:!b})},[a.L])}),D("label[innerText=Aufl\u00f6sung:]",null,[D("input[type=range][min=1][max=100][step=1]",{value:101-a.H,onchange:C(b=>e(2,{H:101-Number(b.target.value)}))})]),D("label[innerText=Blickwinkel:]",null,[D("input[type=range][min=1][max=180][step=1]",{value:a.$,onchange:C(b=>
e(2,{$:Number(b.target.value)}))})]),D("label[innerText=Sichtweite:]",null,[D("input[type=range][min=1][max=128][step=1]",{value:a.J,onchange:C(b=>e(2,{J:Number(b.target.value)}))})]),D("label[innerText=Mausempfindlichkeit:]",null,[D("input[type=range][min=1][max=15][step=1]",{value:a.Y,onchange:C(b=>e(2,{Y:Number(b.target.value)}))})])]),D("div",null,[D("button[innerText=Zur\u00fcck]",{onclick:C(()=>(d.K=!1,d.Ba.requestPointerLock()))})])]}
function mb({i:a,ma:e,Ia:d}){const b=fa(ib),k=ea("div[className=game]",fa(()=>{const g=c=>b.K||(F.pointerLockElement===k?b.l||kb(b,-1-c.button,"mousedown"===c.type):b.Ba.requestPointerLock(),c.preventDefault(),!1);return{onmousedown:g,onmousemove:c=>{if(!b.l){const f=b.i.Y*L/P(b.ra,b.sa);b.g.u=(b.g.u+c.movementX*f+100*L)%(2*L);b.g.ba=P(-qa,ta(qa,b.g.ba-c.movementY*f))}},onmouseup:g}})),p=F.pointerLockElement===k;z(()=>(b.Ba=k,d.m=b,()=>{clearInterval(b.Ga);clearInterval(b.s.Ha);return d.m=null}));
z(()=>{b.i=a;b.s&&(b.s.ga=!0);const g=b.o;var c=b.i.J;c=17>c?2:49>c?3:113>c?4:241>c?5:497>c?6:1009>c?7:2033>c?8:4081>c?9:8177>c?10:16369>c?11:32753>c?12:13;if(g.h!==c){if(g.B)for(var f of g.B)f.X&&db(g,f);g.ja=new W((g.W=new xa(1<<12+(c<<1))).buffer);f=1<<(g.h=c);c=g.B=[];for(let h=0;h<f;++h)for(let q=0;q<f;++q)c.push({X:!1,x:h,z:q,ua:g.M+h+1,va:g.N+q+1});cb(g);eb(g);for(f=0;f<Ba;++f)bb(g,f,Ea,1,f)}},[a]);z((g,c)=>{b.ra=P(1,g);b.sa=P(1,c);c=b.i.H;g=P(1,sa(b.ra/c));c=P(1,sa(b.sa/c));if(g!==b.ha||c!==
b.ia)b.ha=g,b.ia=c,b.s&&(b.s.ga=!0,gb(b.s))},[k.offsetWidth,k.offsetHeight,a.H]);z(()=>{p||b.l||(b.K=!0);b.l=!p},[p]);z(g=>g&&p&&F.exitPointerLock(),[b.l]);z(g=>{if(b.qa&&!b.l){var c=b.g,f=ta(5,.01*(g-b.qa));c.O-=.1*c.O*f;c.P-=.1*c.P*f;c.T-=.1*c.T*f;c.O+=(Q(c.u)*c.U+U(c.u)*c.V)*f;c.P+=c.aa*f;c.T+=(-U(c.u)*c.U+Q(c.u)*c.V)*f;c.D+=c.O*f;c.Z+=c.P*f;c.G+=c.T*f}if(b.s){c=b.s;++c.pa;var h=c.xa;f=c.m;const r=f.i,l=f.g,E=f.ha,H=f.ia,I=f.o;if(!f.l||c.ga){c.ga=!1;const N=h.data,nb=r.J;var q=l.u,m=l.ba;const ob=
l.v,pb=l.j,qb=l.A,rb=I.W,sb=r.L&&null!==fb,Ka=1/E,La=1/H,ka=E>>1,la=H>>1,Ma=Q(q);q=U(q);const Na=Q(-m);m=U(-m);var n=r.$/45;const tb=E<H?n*E*La:n;n=H<E?n*H*Ka:n;const Oa=l.D+65536,Pa=l.Z+65536,Qa=l.G+65536,ub=Oa%1,vb=Pa%1,wb=Qa%1,Ra=4+I.h,Sa=(1<<Ra)-1;let Ta=5,J=l.v=l.A=l.ca=0;l.j=-1;for(let Z=0;Z<H;++Z){var v=(la-Z)*La*n;const Ua=v*Na-m;v=v*m+Na;for(let aa=0;aa<E;++aa){var w=(aa-ka)*Ka*tb;const Va=v*q+w*Ma;w=v*Ma-w*q;let R=16757124,ba=1,Wa=nb;for(let y=0;3>y;++y){let A=w;0===y&&(A=Va);1===y&&(A=
Ua);var u=1/(0>A?-A:A);const ca=Va*u,K=Ua*u;u*=w;const Xa=ua(ca*ca+K*K+u*u);var t=wb;0===y&&(t=ub);1===y&&(t=vb);0<A&&(t=1-t);let S=Oa+ca*t,O=Pa+K*t,T=Qa+u*t;t*=Xa;0===y&&(S+=.5-(0>A|0));1===y&&(O+=.5-(0>A|0));2===y&&(T+=.5-(0>A|0));for(let ma,na,oa,B;t<Wa;S+=ca,O+=K,T+=u,t+=Xa)if(65536>O){if(0>K)break}else if(65552<=O){if(0<K)break}else if(0!==(B=rb[((ma=S&Sa)<<Ra|(oa=T&Sa))<<4|(na=O&15)])){Z===la&&aa===ka&&t<=Ta&&(l.v=ma,l.j=na,l.A=oa,l.ca=0>A|y<<1,Ta=t);if(sb){--B;1===y?6===B?B=11:1===B&&0<K&&
(B=2):1===B&&(B=10);const Ya=fb[B<<8|(16*(1===y?T:O)&15)<<4|16*(1===y?S:S+T)&15];if(0===Ya>>>24)continue;R=Ya&16777215}else R=Aa[B];Wa=t;ba=1-(y+2)%3*.2+(na!==pb||ma!==ob||oa!==qb?0:.1);break}}N[J]=(R&255)*ba;N[++J]=(R>>8&255)*ba;N[++J]=(R>>16)*ba;J+=2}}N[J=E*la+ka<<2]+=128;N[++J]+=128;N[++J]+=128;c.wa.putImageData(h,0,0)}f.fa?(0>l.j?h=0:(h=l.j,h=l.v+" "+l.j+" "+l.A+" "+Ca[l.ca]+": "+(0>h||16<=h?0:I.W[(l.v<<I.h+4|l.A)<<4|h])),f="Minicraft 0.2.0 "+M(c.Aa).toString().padStart(2,"\u00a0")+" fps, T: "+
M(24*f.ta).toString().padStart(2,"0")+":"+M(24*f.ta%1*60).toString().padStart(2,"0")+"; "+(f.l&&500>g%1E3?"":f.time)+"\nR: "+E+"x"+H+" (x"+r.H+"), D: "+r.J+", C: "+I.ea+"/"+I.la.length+", M: "+(16*Math.pow(1<<4+I.h,2)>>10)+"k\nE: 0/0\n\nPosition: "+l.D.toFixed(2)+" "+l.Z.toFixed(2)+" "+l.G.toFixed(2)+"\nAngle: "+(l.u*ra).toFixed(2)+" "+(l.ba*ra).toFixed(2)+"\nBlock: "+h+"\nChunk: "+(M(l.D)>>4)+" "+(M(l.G)>>4)):f="";c.ya=f}b.qa=g},[pa()]);ia();return[D("canvas",{R:C(g=>jb(b,g))}),b.s&&b.fa&&D("div[className=diagnostics]",
{innerText:b.s.ya}),b.K&&ja(lb,{i:a,ma:e,m:b})]}x.init(()=>{const [a,e]=ha(za),d=C({m:null});z(()=>{onbeforeunload=()=>{e(1);if(d.m){var k=d.m.o;for(const p of k.B)p.X&&db(k,p)}}});const b=C(k=>!d.m||kb(d.m,k.keyCode,"keydown"===k.type)||(k.preventDefault(),!1));return[{onkeydown:b,onkeyup:b,oncontextmenu:ya,ondragstart:ya},[ja(mb,{i:a.i,ma:e,Ia:d})]]});
