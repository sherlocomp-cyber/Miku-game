// ================= ANIMASI WARGA =================
function props(p){const n=p.n,T=(w,h,e,c,x,y,z,a)=>box(w,h,e,c,x,y-.75,z,a);
switch(p.i){case 0:T(.15,3,.15,0x7a5230,0,-.8,.6,n.armR);T(.9,.2,.4,0x888888,0,-2.3,.6,n.armR);break;case 1:T(1.6,1.2,.08,0xbfe0ff,0,-.5,.5,n.armL);break;case 2:T(.9,.9,.5,0xffd23f,0,-1.2,.4,n.armL);break;case 3:T(.15,1.3,.15,0xff5533,0,-1,.4,n.armR);break;case 4:T(.9,1.1,.1,0xc9a36b,0,-.9,.5,n.armR);break;case 6:T(.1,2.4,.1,0x7a5230,0,-1,.5,n.armR);break;case 8:T(1.4,.2,1.4,0x333333,0,-1.2,.8,n.armL);T(.15,.15,1.6,0x333333,0,-1.2,1.7,n.armL);break;case 9:T(.8,.1,1,0x2f9e6b,0,-1.1,.5,n.armL);break;case 10:T(2,.1,1.2,0xe86ca0,0,-1.3,.8,n.armL);break;case 12:case 16:T(.9,1.1,.1,0xc9a36b,0,-.9,.5,n.armR);break;case 13:T(.8,.1,1,0x3d6fd6,0,-1.1,.5,n.armL);break;case 18:T(.6,.9,.6,0x7fe0a8,0,-1.2,.6,n.armR);break;case 21:T(1.6,1.2,.08,0xbfe0ff,0,-.5,.5,n.armL)}
const L=n.armL,R=n.armR,bp=()=>{T(1.2,.05,.1,0x3d6fd6,0,-.3,.55,L);T(1.2,.05,.1,0x3d6fd6,0,-.6,.55,L);T(.5,.05,.1,0xd9594c,-.3,-.9,.55,L);T(1.7,.08,.1,0xffffff,0,.12,.5,L);T(1.7,.08,.1,0xffffff,0,-1.12,.5,L)},
cb=()=>{T(.7,.9,.04,0xffffff,0,-.9,.56,R);T(.4,.12,.12,0x888888,0,-.35,.52,R);[-.7,-.95,-1.2].forEach(y=>T(.5,.04,.05,0x666666,0,y,.6,R))},
bk=(c)=>{T(.7,.12,.9,0xfff8e7,0,-1.1,.5,L);T(.1,.12,1,c,-.4,-1.1,.5,L)};
switch(p.i){case 0:T(.5,.12,.3,0xaaaaaa,0,-2.45,.6,R);T(.2,.2,.2,0x5a3a1c,0,-.9,.6,R);break;
case 1:case 21:bp();break;
case 2:T(.95,.1,.55,0xb5532f,0,-1.2,.4,L);T(.3,.3,.3,0xe74c3c,-.2,-.7,.4,L);T(.3,.3,.3,0x2fbf85,.2,-.7,.4,L);break;
case 3:T(.17,.25,.17,0xffffff,0,-1.4,.4,R);T(.17,.25,.17,0xffffff,0,-.6,.4,R);break;
case 4:case 12:case 16:cb();break;
case 6:T(.14,.3,.14,0xd9594c,0,-2.25,.5,R);break;
case 7:T(.12,.5,.12,0x333333,0,-1.3,.5,R);T(.3,.3,.3,0xe74c3c,0,-1.7,.5,R);T(.34,.06,.34,0xcccccc,0,-1.55,.5,R);break;
case 8:T(1.5,.12,1.5,0x555555,0,-1.15,.8,L);T(.7,.15,.7,0xe0a43a,0,-1,.8,L);T(.25,.12,.25,0xd9594c,.2,-.9,.8,L);T(.25,.12,.25,0x2fbf85,-.2,-.9,.7,L);break;
case 9:bk(0x2f9e6b);break;case 13:bk(0x3d6fd6);break;
case 10:T(1.8,.04,.05,0xffffff,0,-1.25,.8,L);T(.3,.4,.3,0xffd23f,.7,-1.1,1.2,L);break;
case 18:T(.55,.45,.55,0xff6bd6,0,-1.4,.6,R);T(.25,.35,.25,0xdddddd,0,-.6,.6,R);break}
p.pr=1}
function work(p,t){if(!p.pr)props(p);const n=p.n,i=p.i,s=Math.sin;let wx=0,y=0;n.rotation.set(0,Math.PI,0);n.armL.rotation.set(0,0,0);n.armR.rotation.set(0,0,0);n.legL.rotation.x=n.legR.rotation.x=0;
const walk=(a,sp)=>{wx=s(t*sp)*a;n.rotation.y=Math.cos(t*sp)>0?Math.PI/2:-Math.PI/2;const w=s(t*9)*.7;n.legL.rotation.x=w;n.legR.rotation.x=-w;n.armL.rotation.x=-w*.8;n.armR.rotation.x=w*.8};
switch(i){case 0:n.armL.rotation.x=n.armR.rotation.x=-1.4+s(t*3)*.9;y=Math.max(0,s(t*3))*.2;break;
case 1:walk(4,.5);n.armL.rotation.x=-1.3;break;
case 2:n.armR.rotation.x=-2.6+s(t*5)*.4;n.rotation.y=Math.PI+s(t*.8)*.5;break;
case 3:n.rotation.y=Math.PI+s(t*1.4)*.8;n.armR.rotation.x=-1.57;n.armL.rotation.x=s(t*1.4)>0?-1.57:-.2;break;
case 4:n.armR.rotation.x=-1.1+s(t*8)*.12;n.rotation.y=Math.PI+s(t*.7)*.3;break;
case 5:{const w=s(t*7)*.8;n.legL.rotation.x=w;n.legR.rotation.x=-w;n.armL.rotation.x=-w;n.armR.rotation.x=w;y=Math.abs(s(t*7))*.25;break}
case 6:walk(3,.4);n.armR.rotation.x=-2.7+s(t*6)*.15;break;
case 7:n.armR.rotation.x=-1.5;n.rotation.y=Math.PI+s(t*1.1)*.35;break;
case 8:n.armL.rotation.x=-1.2;n.armR.rotation.x=-1.3+s(t*7)*.35;y=Math.abs(s(t*3.5))*.08;break;
case 9:n.armL.rotation.x=-1+s(t*2.5)*.8;n.armR.rotation.x=-1-s(t*2.5)*.8;n.rotation.y=Math.PI+s(t*.9)*.3;break;
case 10:n.armL.rotation.x=-1.2;n.armR.rotation.x=-1.2+s(t*14)*.12;y=Math.abs(s(t*2))*.05;break;
case 11:walk(5,.35);n.armR.rotation.x=-2.5;break;
case 12:n.armL.rotation.x=-1.2+s(t*12)*.1;n.armR.rotation.x=-1.2-s(t*12)*.1;break;
case 13:n.armR.rotation.x=-2.8+s(t*3)*.15;n.rotation.y=Math.PI+s(t*.8)*.3;break;
case 14:n.armL.rotation.x=-1.1+s(t*5)*.4;n.armR.rotation.x=-1.1-s(t*5)*.4;y=Math.abs(s(t*2.5))*.06;break;
case 15:n.armL.rotation.x=n.armR.rotation.x=-1.4;n.rotation.y=Math.PI+s(t*.6)*.4;break;
case 16:walk(3,.45);n.armR.rotation.x=-1.2;break;
case 17:walk(6,.7);n.legR.rotation.x=s(t*9)*1.1;break;
case 18:n.armL.rotation.x=-1.2;n.armR.rotation.x=-1.4+s(t*2)*.4;break;
case 19:n.armL.rotation.x=-1.1+s(t*1.5)*.5;n.rotation.y=Math.PI+s(t*.7)*.4;break;
case 20:n.armL.rotation.x=-1.2;n.armR.rotation.x=-1.3+s(t*7)*.35;y=Math.abs(s(t*3.5))*.08;break;
case 21:walk(4,.5);n.armL.rotation.x=-1.3;break;
case 22:n.armR.rotation.x=-2.6+s(t*5)*.4;n.rotation.y=Math.PI+s(t*.8)*.5;break;
case 23:n.armL.rotation.x=-1+s(t*2.5)*.8;n.armR.rotation.x=-1-s(t*2.5)*.8;n.rotation.y=Math.PI+s(t*.9)*.3}
n.position.set(p.nx+wx*(p.rm??1),y,p.nz);p.mk.position.x=p.nx+wx*(p.rm??1);p.mk.position.z=p.nz}
function polisi(p,t){const n=p.n,s=Math.sin,ph=(t%16)<8?0:1;POL.allow=ph?'z':'x';n.rotation.set(0,ph?Math.PI/2:0,0);n.armL.rotation.set(0,0,0);n.armR.rotation.set(0,0,0);n.legL.rotation.x=n.legR.rotation.x=0;n.armR.rotation.x=-1.57;n.armL.rotation.z=-1.2+s(t*5)*.4;n.position.set(p.nx,.4,p.nz);p.mk.position.x=p.nx;p.mk.position.z=p.nz}
function npcAct(p,t){if(p.i==3)return polisi(p,t);const T=(t+p.i*3.7)%26,MO=[[0,1,2,3,4],[0,2,4,1,3],[0,3,1,4,2]][p.i%3],B=[0,10,15,18,21,26],k=T<10?0:T<15?1:T<18?2:T<21?3:4,m=MO[k],u=T-B[k],DU=B[k+1]-B[k];
if(m==0){p.rm=Math.min(1,T/2,(10-T)/2);return work(p,t)}
const n=p.n,s=Math.sin,PI=Math.PI;n.rotation.set(0,PI,0);n.armL.rotation.set(0,0,0);n.armR.rotation.set(0,0,0);n.legL.rotation.x=n.legR.rotation.x=0;let x=p.nx,z=p.nz,y=0;
if(m==1){const th=p.i*1.1,dx=Math.cos(th),dz=Math.abs(Math.sin(th))+.3,q=s(PI*u/DU)*7,f=u<DU/2?1:-1;x+=dx*q;z+=dz*q*(p.zs||1);n.rotation.y=Math.atan2(dx*f,dz*f);const w=s(u*9)*.7;n.legL.rotation.x=w;n.legR.rotation.x=-w;n.armL.rotation.x=-w*.8;n.armR.rotation.x=w*.8}
else if(m==2){n.rotation.y=PI+s(u*1.3)*1.1;n.armL.rotation.z=-.6;n.armR.rotation.z=.6;y=Math.abs(s(u*.8))*.04}
else if(m==3){n.rotation.y=Math.atan2(pl.x-x,pl.z-z);n.armR.rotation.z=2.6+s(u*8)*.35;n.armL.rotation.z=-.2}
else{n.armL.rotation.z=-2.7+s(u*5)*.2;n.armR.rotation.z=2.7-s(u*5)*.2;if(p.i%2==0)y=Math.abs(s(u*6))*.5;else n.rotation.x=-.12}
n.position.set(x,y,z);p.mk.position.x=x;p.mk.position.z=z}
