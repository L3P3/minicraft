const l=lui,n=l.hook_dom,r=l.hook_effect,aa=l.hook_memo,ba=l.hook_reducer,ca=l.hook_rerender,t=l.hook_static,z=l.node,H=l.node_dom,da=l.now,I=Math,J=I.PI,ea=180/J,Q=I.floor,fa=I.round,ha=I.min,R=I.max,Y=I.cos,Z=I.sin,Ca=JSON,Da=localStorage,Ea=()=>!1,Fa=[()=>{const a={u:10,N:80,H:64};var c=Da.getItem("minicraft.config");c&&(c=Ca.parse(c),a.u=c.resolution_scaling,a.N=c.view_angle,a.H=c.view_distance);return{h:a}},a=>{const c=a.h;Da.setItem("minicraft.config",Ca.stringify({version:"0.1.11",resolution_scaling:c.u,
view_angle:c.N,view_distance:c.H}));return a},(a,c)=>Object.assign({},a,{h:Object.assign({},a.h,c)})];
function Ga({h:a,$:c,l:d}){n("div[className=menu]");return[H("h1[innerText=Men\u00fc]"),H("div[className=settings]",null,[H("label[innerText=Aufl\u00f6sung:]",null,[H("input[type=range][min=1][max=100][step=1]",{value:101-a.u,onchange:t(h=>c(2,{u:101-Number(h.target.value)}))})]),H("label[innerText=Blickwinkel:]",null,[H("input[type=range][min=1][max=180][step=1]",{value:a.N,onchange:t(h=>c(2,{N:Number(h.target.value)}))})]),H("label[innerText=Sichtweite:]",null,[H("input[type=range][min=1][max=128][step=1]",
{value:a.H,onchange:t(h=>c(2,{H:Number(h.target.value)}))})])]),H("div",null,[H("button[innerText=Zur\u00fcck]",{onclick:t(()=>{d.j=d.U=!1})})])]}
const Ha=[0,7960953,8370002,7885881,8553090,9927501,4539717,6311215,3113506,12094592,14145495],Ia="WEBTSN".split(""),Ka=()=>{const a={s:Ja(),oa:8,pa:32,qa:8};for(let c=0;16>c;c+=2)a.s[1024+(c<<4)]=3,a.s[1024+c]=3;["X   XXX XXX XXX","X     X X X   X","X   XXX XXX XXX","X     X X     X","XXX XXX X   XXX"].forEach((c,d,h)=>{d=h.length-d;c.split("").forEach((e,k)=>{"X"===e&&(a.s[1024+(k+1<<4)+d]=6)})});return a},Ja=()=>{const a=new Uint8Array(16384),c=[6,3,3,3,2];for(let d=-1,h=0;h<c.length;++h){const e=
c[h];for(let k=0;16>k;++k)for(let b=0;16>b;++b)a[++d]=e}return a},Ma=(a,c)=>{const d={canvas:c,ga:null,ha:null,ia:"",T:!1,ja:0,aa:0,la:setInterval(()=>{d.ja=d.aa;d.aa=0},1E3),l:a};La(d);return d},La=a=>{var c=a.canvas.width=a.l.L,d=a.canvas.height=a.l.M;a=(a.ha=(a.ga=a.canvas.getContext("2d")).createImageData(c,d)).data;c=a.length;for(d=3;d<c;d+=4)a[d]=255},Na=()=>({h:null,P:!1,U:!1,j:!1,ba:0,g:{J:0,O:0,K:0,V:0,W:10,X:0,B:0,D:0,G:0,o:0,Y:0,v:0,m:-1,A:0,Z:0},i:null,ca:1,da:1,L:0,M:0,ka:null,time:0,
ea:0,fa:Ka()}),Pa=(a,c)=>{onmousemove=d=>{a.j||(a.g.o=2*(d.clientX/a.ca-.5)*J,a.g.Y=(.5-d.clientY/a.da)*J)};onmousedown=onmouseup=d=>a.j||(Oa(a,-1-d.button,"mousedown"===d.type),d.preventDefault(),!1);a.i=Ma(a,c);a.ka=setInterval(()=>{a.j||(a.time=(a.time+1)%24E3,a.ea=1/24E3*(a.time+6E3)%1)},50)},Oa=(a,c,d)=>{if(d)switch(c){case -1:0<=a.g.m&&(a.fa.s[(a.g.m<<8)+(a.g.v<<4)+a.g.A]=0);break;case -3:if(a.g.m){c=a.g.v;d=a.g.m;let h=a.g.A;switch(a.g.Z){case 0:--c;break;case 1:++c;break;case 2:--d;break;
case 3:++d;break;case 4:--h;break;default:++h}0<=d&&64>d&&(a.fa.s[(d<<8)+((c&15)<<4)+(h&15)]=9)}break;case 27:a.j=a.U=!a.U;break;case 16:a.g.O=-.1;break;case 32:a.g.O=.1;break;case 65:a.g.J=-.1;break;case 68:a.g.J=.1;break;case 80:a.j=!a.j;break;case 83:a.g.K=-.1;break;case 87:a.g.K=.1;break;case 114:a.P=!a.P;break;default:return!0}else switch(c){case 16:case 32:a.g.O=0;break;case 65:case 68:a.g.J=0;break;case 83:case 87:a.g.K=0;break;default:return!0}return!1};
function Qa({h:a,$:c,ma:d}){const h=n("div[className=game]"),e=aa(Na);r(()=>(d.l=e,()=>{onmousemove=onmousedown=onmouseup=null;clearInterval(e.ka);clearInterval(e.i.la);return d.l=null}));r(()=>{e.h=a;e.i&&(e.i.T=!0)},[a]);r((k,b)=>{e.ca=R(1,k);e.da=R(1,b);b=e.h.u;k=R(1,fa(e.ca/b));b=R(1,fa(e.da/b));if(k!==e.L||b!==e.M)e.L=k,e.M=b,e.i&&(e.i.T=!0,La(e.i))},[h.offsetWidth,h.offsetHeight,a.u]);r(k=>{if(e.ba&&!e.j){var b=e.g,f=ha(5,.01*(k-e.ba));b.B-=.1*b.B*f;b.D-=.1*b.D*f;b.G-=.1*b.G*f;b.B+=(Y(b.o)*
b.J+Z(b.o)*b.K)*f;b.D+=b.O*f;b.G+=(-Z(b.o)*b.J+Y(b.o)*b.K)*f;b.V+=b.B*f;b.W+=b.D*f;b.X+=b.G*f}if(e.i){b=e.i;++b.aa;var u=b.ha;f=b.l;const K=f.h,g=f.g;var A=f.fa;if(!f.j||b.T){b.T=!1;const S=u.data,Ra=K.H,v=f.L,w=f.M,ia=.5*v,ja=.5*w,ka=1/v,la=1/w,Sa=ia|0,Ta=ja|0;var B=g.o,C=g.Y;const ma=Y(B);B=Z(B);const na=Y(-C);C=Z(-C);var x=K.N/45;const Ua=v<w?x*v*la:x;x=w<v?x*w*ka:x;const oa=g.V+1073741824,pa=g.W+1073741824,qa=g.X+1073741824,Va=g.v,Wa=g.m,Xa=g.A;let L=0,ra=0,sa=-1,ta=0,ua=0;for(let M=0;M<w;++M){const Ya=
M===Ta;var D=(ja-M)*la*x;const va=D*na-C;D=D*C+na;for(let N=0;N<v;++N){var O=N===Sa;O=Ya&&O;var E=(N-ia)*ka*Ua;const wa=D*B+E*ma;E=D*ma-E*B;let P=8696319,y=1,xa=Ra;for(let p=0;3>p;++p){const q=0===p?wa:1===p?va:E,F=1/(0>q?-q:q),ya=wa*F,za=va*F,Aa=E*F;var m=0===p?oa%1:1===p?pa%1:qa%1;m=0<q?1-m:m;let T=oa+ya*m,U=pa+za*m,V=qa+Aa*m;m*=F;for(0===p?T+=0>q?-.5:.5:1===p?U+=0>q?-.5:.5:V+=0>q?-.5:.5;m<xa;){const W=T&15,G=U&1073741823,X=V&15,Ba=0>G||64<=G?0:A.s[(G<<8)+(W<<4)+X];if(0===Ba)T+=ya,U+=za,V+=Aa,m+=
F;else{xa=m;P=Ha[Ba];y=1-(p+2)%3*.2;G===Wa&&W===Va&&X===Xa&&(y+=.1);O&&5>=m&&(ra=W,sa=G,ta=X,ua=p<<1|0>q);break}}}O&&(y*=2);S[L]=(P>>16&255)*y;S[++L]=(P>>8&255)*y;S[++L]=(P&255)*y;L+=2}}b.ga.putImageData(u,0,0);g.v=ra;g.m=sa;g.A=ta;g.Z=ua}f.P?(0>g.m?A=0:(u=g.m,A=g.v+" "+g.m+" "+g.A+" "+Ia[g.Z]+": "+(0>u||64<=u?0:A.s[(u<<8)+(g.v<<4)+g.A])),f="Minicraft 0.1.11 "+Q(b.ja).toString().padStart(2,"\u00a0")+" fps, T: "+Q(24*f.ea).toString().padStart(2,"0")+":"+Q(24*f.ea%1*60).toString().padStart(2,"0")+"; "+
(f.j&&500>k%1E3?"":f.time)+"\nR: "+f.L+"x"+f.M+" (x"+K.u+"), C: 1, D: "+K.H+"\nE: 0/0\n\nPosition: "+g.V.toFixed(2)+" "+g.W.toFixed(2)+" "+g.X.toFixed(2)+"\nAngle: "+(g.o*ea).toFixed(2)+" "+(g.Y*ea).toFixed(2)+"\nBlock: "+A+"\nChunk: 0 0"):f="";b.ia=f}e.ba=k},[da()]);ca();return[H("canvas",{R:t(k=>Pa(e,k))}),e.i&&e.P&&H("div[className=diagnostics]",{innerText:e.i.ia}),e.U&&z(Ga,{h:a,$:c,l:e})]}
l.init(()=>{const [a,c]=ba(Fa),d=t({l:null});r(()=>{onbeforeunload=()=>{c(1)}});const h=t(e=>!d.l||Oa(d.l,e.keyCode,"keydown"===e.type)||(e.preventDefault(),!1));return[{onkeydown:h,onkeyup:h,oncontextmenu:Ea,na:Ea},[z(Qa,{h:a.h,$:c,ma:d})]]});
