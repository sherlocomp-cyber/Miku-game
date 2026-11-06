/* ===== DETAIL PACK v37 — detail aset: bangunan, jalan, pohon, kendaraan, interior =====
   Semua detail digabung (merged) per area + vertex color => sedikit draw call, aman untuk HP.
   Dibungkus try/catch saat dipanggil: kalau gagal, game tetap jalan seperti v36. */
let KPVM=null;const kpVM=()=>KPVM||(KPVM=new THREE.MeshLambertMaterial({vertexColors:true}));
function kpMB(){
 let cap=1<<13,P=new Float32Array(cap*3),N=new Float32Array(cap*3),C=new Float32Array(cap*3),len=0;
 const m=new THREE.Matrix4(),bs=new THREE.Matrix4(),nm=new THREE.Matrix3(),q=new THREE.Quaternion(),e=new THREE.Euler(),pv=new THREE.Vector3(),sv=new THREE.Vector3(),v=new THREE.Vector3(),n=new THREE.Vector3(),cc=new THREE.Color(),GC=new Map();
 const G=(k,f)=>{let g=GC.get(k);if(!g){g=f();if(g.index)g=g.toNonIndexed();GC.set(k,g)}return g};
 const ensure=k=>{if(len+k<=cap)return;while(len+k>cap)cap*=2;const gr=a=>{const t=new Float32Array(cap*3);t.set(a.subarray(0,len*3));return t};P=gr(P);N=gr(N);C=gr(C)};
 const b={
  base(x,y,z,ry){bs.makeRotationY(ry||0);bs.setPosition(x||0,y||0,z||0)},
  reset(){bs.identity()},
  add(g,col,x,y,z,rx,ry,rz,sx,sy,sz){
   e.set(rx||0,ry||0,rz||0);q.setFromEuler(e);pv.set(x||0,y||0,z||0);sv.set(sx==null?1:sx,sy==null?1:sy,sz==null?1:sz);
   m.compose(pv,q,sv).premultiply(bs);nm.getNormalMatrix(m);cc.setHex(col);
   const pa=g.attributes.position,na=g.attributes.normal,cnt=pa.count;ensure(cnt);
   for(let i=0;i<cnt;i++){v.fromBufferAttribute(pa,i).applyMatrix4(m);n.fromBufferAttribute(na,i).applyMatrix3(nm).normalize();const o=(len+i)*3;
    P[o]=v.x;P[o+1]=v.y;P[o+2]=v.z;N[o]=n.x;N[o+1]=n.y;N[o+2]=n.z;C[o]=cc.r;C[o+1]=cc.g;C[o+2]=cc.b}
   len+=cnt},
  box(w,h,d,col,x,y,z,rx,ry,rz){b.add(G('b',()=>new THREE.BoxGeometry(1,1,1)),col,x,y,z,rx,ry,rz,w,h,d)},
  cyl(rt,rb,h,sg,col,x,y,z,rx,ry,rz,sx,sy,sz){b.add(G('c'+rt+'_'+rb+'_'+h+'_'+sg,()=>new THREE.CylinderGeometry(rt,rb,h,sg)),col,x,y,z,rx,ry,rz,sx,sy,sz)},
  sph(r,col,x,y,z,sx,sy,sz){b.add(G('s'+r,()=>new THREE.SphereGeometry(r,6,4)),col,x,y,z,0,0,0,sx,sy,sz)},
  cap(r,col,x,y,z,rx,ry,rz){b.add(G('p'+r,()=>new THREE.SphereGeometry(r,10,5,0,Math.PI*2,0,Math.PI/2)),col,x,y,z,rx,ry,rz)},
  tor(r,t,arc,col,x,y,z,rx,ry,rz){b.add(G('t'+r+'_'+t+'_'+arc,()=>new THREE.TorusGeometry(r,t,5,14,arc)),col,x,y,z,rx,ry,rz)},
  count(){return len},
  mesh(mt){if(!len)return null;const g=new THREE.BufferGeometry();
   g.setAttribute('position',new THREE.BufferAttribute(P.slice(0,len*3),3));g.setAttribute('normal',new THREE.BufferAttribute(N.slice(0,len*3),3));g.setAttribute('color',new THREE.BufferAttribute(C.slice(0,len*3),3));
   g.computeBoundingSphere();const o=new THREE.Mesh(g,mt||kpVM());o.receiveShadow=true;o.castShadow=false;return o}
 };return b}
function kpGrid(){const C=new Map();return{at(x,z){const k=Math.floor(x/110)+'_'+Math.floor(z/110);let b=C.get(k);if(!b){b=kpMB();C.set(k,b)}return b},
 verts(){let t=0;C.forEach(b=>t+=b.count());return t},flush(par){C.forEach(b=>{const o=b.mesh();if(o)par.add(o)});C.clear()}}}
const kpCO=(c,t,k)=>new THREE.Color(c).lerp(new THREE.Color(t),k).getHex(),kpLt=(c,k)=>kpCO(c,0xffffff,k),kpDk=(c,k)=>kpCO(c,0x000000,k);
const kpPk=a=>a[Math.floor(Math.random()*a.length)];
const KPFL=[0xff6b8b,0xffcf3f,0xffffff,0xff9a3c,0xc77dff,0xff5a5f];
function kpBunt(M,x0,x1,y,z,cols,sag,n=14){let px=x0,py=y;for(let k=0;k<=n;k++){const t=k/n,xx=x0+(x1-x0)*t,yy=y-sag*(1-Math.pow(2*t-1,2));
 if(k>0){const dx=xx-px,dy=yy-py;M.box(Math.hypot(dx,dy),.04,.04,0xe8e0d0,(xx+px)/2,(yy+py)/2,z,0,0,Math.atan2(dy,dx))}
 if(k>0&&k<n)M.cyl(.3,0,.6,3,cols[k%cols.length],xx,yy-.32,z,0,0,0,1,1,.16);px=xx;py=yy}}
function detailPack(){
 let sd=20261106;const R=()=>(sd=(sd*16807)%2147483647)/2147483647,ri=n=>(R()*n)|0,pk=a=>a[ri(a.length)];
 const DQ=(typeof LOW!=='undefined'&&LOW)?.6:1,lt=kpLt,dk=kpDk;
 const free=(x,z,m)=>!walls.some(w=>Math.abs(x-w.x)<w.hw+m&&Math.abs(z-w.z)<w.hd+m);
 const stats={};
 /* ---------- 1. BANGUNAN PROFESI (24) ---------- */
 {const G=kpGrid();
 BLD.forEach(bd=>{const x=bd.x,z=bd.z,c=bd.d.c,M=G.at(x,z),l1=lt(c,.6),d1=dk(c,.28),W=0xfffaf0,PL=0x9a9fab;
  M.box(4.85,.7,.3,PL,x-4.83,.35,z+6.12);M.box(4.85,.7,.3,PL,x+4.83,.35,z+6.12);M.box(14.5,.7,.3,PL,x,.35,z-6.12);
  M.box(.3,.7,12.5,PL,x-7.12,.35,z);M.box(.3,.7,12.5,PL,x+7.12,.35,z);
  [-1,1].forEach(sx=>[-1,1].forEach(sz=>{M.box(.9,8.2,.9,l1,x+sx*6.95,4.1,z+sz*5.95);M.box(1.1,.3,1.1,W,x+sx*6.95,.15,z+sz*5.95);M.box(1.1,.3,1.1,W,x+sx*6.95,8.15,z+sz*5.95)}));
  [-1,1].forEach(sg=>{const wx=x+sg*4.7;
   M.box(.12,2.6,.1,W,wx,2.6,z+6.22);M.box(2.6,.12,.1,W,wx,2.6,z+6.22);
   M.box(3.3,.3,.4,W,wx,4.05,z+6.2);M.box(.55,.5,.45,d1,wx,4.3,z+6.2);
   [-1,1].forEach(s2=>{const sx2=wx+s2*1.75;M.box(.55,2.6,.12,l1,sx2,2.6,z+6.12);for(let k=0;k<5;k++)M.box(.45,.05,.06,d1,sx2,1.55+k*.5,z+6.2)});
   M.box(2.7,.38,.5,0x8a5a2b,wx,1.55,z+6.42);M.box(2.5,.06,.4,0x4a3320,wx,1.76,z+6.42);
   for(let k=0;k<7;k++)M.sph(.17,pk(KPFL),wx-1.1+k*.37,1.9+(k%2)*.1,z+6.42);
   for(let k=0;k<4;k++)M.sph(.2,0x3fa35d,wx-.9+k*.6,1.82,z+6.5);
   M.cyl(.3,.25,.5,8,0xb5532f,x+sg*2.75,.25,z+7.5);M.cyl(.04,.04,.6,5,0x6b4a2b,x+sg*2.75,.8,z+7.5);M.sph(.46,0x3fa35d,x+sg*2.75,1.35,z+7.5,1,1.1,1);
   M.cyl(.12,.12,8,6,0x9aa3b2,x+sg*7.05,4,z+5.5)});
  for(let k=-4;k<=4;k++){M.box(.9,.6,.45,W,x+k*1.7,9.31,z+6.4);M.box(.9,.6,.45,W,x+k*1.7,9.31,z-6.4)}
  for(let k=-3;k<=3;k++){M.box(.45,.6,.9,W,x-7.4,9.31,z+k*1.7);M.box(.45,.6,.9,W,x+7.4,9.31,z+k*1.7)}
  M.box(1,2.4,1,0xa4523a,x+2,10.2,z+2.5);M.box(1.3,.2,1.3,0x6b4a2b,x+2,11.5,z+2.5);M.cyl(.3,.3,.3,6,0x555b6b,x+2,11.75,z+2.5);
  M.cyl(.06,.06,1.2,5,0x9aa3b2,x-2.5,9.6,z+2.6);M.cap(.9,0xf0f0f0,x-2.5,10.3,z+2.6,-1.0,0,0);M.cyl(.04,.04,.9,5,0x555b6b,x-2.5,10.5,z+3.1,.9,0,0);
  [0,1].forEach(k=>{M.box(2,.08,1.3,0x1f3a6b,x+5.1+k*0,9.6,z+3.4-k*1.5,-.5,0,0);M.box(1.9,.04,.05,0x6e8bb8,x+5.1,9.62+(-k*.03),z+3.4-k*1.5,-.5,0,0);M.box(.1,.5,.1,0x777,x+5.1,9.3,z+3.4-k*1.5)});
  M.cyl(.18,.18,1.2,6,0x9aa3b2,x-1,9.6,z-4.5);M.cyl(0,.4,.3,6,0x7a8396,x-1,10.35,z-4.5);M.cyl(.18,.18,1,6,0x9aa3b2,x+1.5,9.5,z-4.5);M.cyl(0,.4,.3,6,0x7a8396,x+1.5,10.15,z-4.5);
  [-1,1].forEach(sg=>M.cyl(.05,.05,2.3,5,0x7a5a3a,x+sg*7.3,10.15,z+6.3));
  kpBunt(M,x-7.3,x+7.3,11.25,z+6.3,[c,0xffffff,0xffcf3f,0xff6b5e],1.1)});
 STN.forEach(s=>{const M=G.at(s.x,s.z),x=s.x,z=s.z;
  M.box(5.8,.35,.9,0xcfc9bc,x,.18,z+1.75);M.box(5.3,.7,.55,0xdcd6c9,x,.35,z+1.55);
  [-1,1].forEach(sg=>{M.cyl(.4,.3,.6,8,0xb5532f,x+sg*3.5,.3,z+2.2);M.sph(.5,0x3fa35d,x+sg*3.5,.95,z+2.2,1,1.1,1);for(let k=0;k<4;k++)M.sph(.12,pk(KPFL),x+sg*3.5+(k-1.5)*.25,1.2+(k%2)*.12,z+2.35);
   M.cyl(.02,.02,.5,4,0x333333,x+sg*1.7,5.55,z+.7);M.sph(.25,0xfff0b0,x+sg*1.7,5.2,z+.7,1,1.2,1)});
  kpBunt(M,x-3.5,x+3.5,5.85,z+1.78,[s.c,0xffffff,0xffcf3f],.5,10);
  M.box(7.6,.12,3.6,s.c,x,5.82,z);M.box(7.6,.14,.14,0xffffff,x,6.25,z+1.75)});
 stats.pro=G.verts();G.flush(S)}
 /* ---------- 2. GEDUNG UMUM ---------- */
 {const G=kpGrid(),pc=0x8d93a3;
 GB.forEach(([x,z,h,c])=>{const M=G.at(x,z),top=h+.5,fl=Math.max(2,Math.round(h/3.2)),hf=h/fl,l1=lt(c,.5);
  M.box(9.6,.7,.35,pc,x,h+.85,z+4.62);M.box(9.6,.7,.35,pc,x,h+.85,z-4.62);M.box(.35,.7,8.9,pc,x+4.62,h+.85,z);M.box(.35,.7,8.9,pc,x-4.62,h+.85,z);
  [-1,1].forEach(sx=>[-1,1].forEach(sz=>M.box(.55,h,.55,l1,x+sx*4.35,h/2,z+sz*4.35)));
  for(let f=1;f<fl;f+=2)M.box(9.2,.16,9.2,l1,x,h-f*hf,z);
  const slots=[[-2.6,-2.6],[-2.6,2.3],[2.6,2.5],[0,2.8],[3,-3.2]];
  slots.forEach(([ox,oz])=>{if(R()<.45)return;const sx=x+ox,sz=z+oz,t=ri(6);
   if(t==0){M.box(1.5,.8,1.1,0xb7bcc7,sx,top+.4,sz);M.cyl(.4,.4,.05,8,0x333a4d,sx,top+.83,sz)}
   else if(t==1){[-.5,.5].forEach(a=>[-.5,.5].forEach(b2=>M.cyl(.05,.05,1.1,4,0x555b6b,sx+a,top+.55,sz+b2)));M.cyl(.8,.8,1.3,8,0x8d98ab,sx,top+1.75,sz);M.cyl(0,.9,.5,8,0x6e7686,sx,top+2.65,sz)}
   else if(t==2){M.cyl(.18,.18,1.3,6,0x9aa3b2,sx,top+.65,sz);M.cyl(0,.4,.3,6,0x7a8396,sx,top+1.45,sz)}
   else if(t==3){M.cyl(.04,.04,3,4,0x555b6b,sx,top+1.5,sz);M.box(1.2,.04,.04,0x555b6b,sx,top+2.7,sz);M.box(.8,.04,.04,0x555b6b,sx,top+2.2,sz)}
   else if(t==4){M.box(1.6,.3,1.6,0xd8dde6,sx,top+.15,sz);M.box(1.4,.1,1.4,0x9fd6f0,sx,top+.33,sz)}
   else{M.box(2,.08,1.3,0x1f3a6b,sx,top+.55,sz,-.5,0,0);M.box(.1,.5,.1,0x777777,sx,top+.25,sz)}});
  const tone=pk([0xe85d4a,0x2fbf85,0xffb81f,0x3d9bff,0xff8a3d,0xb06bff,0x14b8a6]),dx=(R()<.5?-1:1)*1.7;
  M.box(9.2,.5,.2,0x6a7080,x,.25,z+4.52);
  M.box(1.5,2.5,.1,0x4a3322,x+dx,1.25,z+4.55);M.box(1.1,1.5,.06,0x9fd6f0,x+dx,1.55,z+4.6);M.box(.1,.1,.08,0xe8c050,x+dx+.5,1.2,z+4.62);
  M.box(3.4,.7,.14,0xfffaf0,x-dx*.4,4.15,z+4.6);M.box(3.4,.12,.16,tone,x-dx*.4,4.5,z+4.6);M.box(3.4,.12,.16,tone,x-dx*.4,3.8,z+4.6);
  for(let k=0;k<4;k++)M.box(1.9,.07,1.45,k%2?0xffffff:tone,x-2.85+k*1.9,3.3,z+5.2,.5,0,0);
  M.box(2,.15,.7,0xcfc9bc,x+dx,.08,z+4.9);
  const cnt=1+ri(3);for(let a=0;a<cnt&&fl>3;a++){const f=1+ri(fl-3),k=ri(3),ox=(k-1)*2.67,sill=hf*(fl-f-.925)-.45;
   M.box(.85,.5,.5,0xdfe3ea,x+ox,sill,z+4.75);M.box(.6,.3,.04,0x555b6b,x+ox,sill,z+5.02)}
  if(h>11&&R()<.4&&fl>3){const f=1+ri(fl-3),sill=hf*(fl-f-.925)+.2,bz=z+4.5;
   M.box(2.6,.16,.95,0xd8d0c0,x,sill,bz+.47);M.box(2.6,.05,.05,0x555b6b,x,sill+.9,bz+.95);
   for(let j=0;j<5;j++)M.box(.05,.9,.05,0x555b6b,x-1.25+j*.625,sill+.45,bz+.95);M.box(.05,.9,.9,0x555b6b,x-1.3,sill+.45,bz+.47);M.box(.05,.9,.9,0x555b6b,x+1.3,sill+.45,bz+.47);
   M.box(.8,.25,.3,0xb5532f,x-.6,sill+1.05,bz+.9);M.sph(.2,0xff6b8b,x-.6,sill+1.3,bz+.9)}
  M.cyl(.1,.1,h-.4,6,0x8d93a3,x-4.55,(h-.4)/2,z+4.58)});
 stats.gen=G.verts();G.flush(S)}
 /* ---------- 3. POHON ---------- */
 {const G=kpGrid();
 TR.forEach(([x,z,sc,pine])=>{if(R()>DQ)return;const M=G.at(x,z);
  for(let k=0;k<3;k++){const a=R()*6.28;M.sph(.45*sc,0x5a3d22,x+Math.cos(a)*.55*sc,.12,z+Math.sin(a)*.55*sc,1.3,.45,.8)}
  if(!pine){[-1,1].forEach(s=>M.cyl(.09*sc,.15*sc,1.8*sc,5,0x6b4a2b,x+s*.55*sc,3.7*sc,z,0,0,s*-.7));
   for(let k=0;k<5;k++){const a=R()*6.28,r=(2+R()*1.2)*sc;M.sph(.11,pk(KPFL),x+Math.cos(a)*r,.13,z+Math.sin(a)*r,1,.7,1)}}
  else{for(let k=0;k<3;k++){const a=R()*6.28,r=(1.4+R())*sc;M.cyl(0,.1,.28,5,0x7a4a24,x+Math.cos(a)*r,.14,z+Math.sin(a)*r,1.5,0,0)}}
  for(let k=0;k<3;k++){const a=R()*6.28,r=(1.5+R()*1.5)*sc;M.cyl(.45,.45,.02,6,pk([0xe0a050,0xc98a3a,0xd9b45a]),x+Math.cos(a)*r,.05,z+Math.sin(a)*r)}
  if(R()<.15){const a=R()*6.28,r=2.3*sc,mx=x+Math.cos(a)*r,mz=z+Math.sin(a)*r;M.cyl(.06,.07,.2,5,0xf3e9d2,mx,.1,mz);M.sph(.17,0xd9453a,mx,.24,mz,1,.6,1);M.sph(.04,0xffffff,mx+.07,.3,mz)}});
 stats.tree=G.verts();G.flush(S)}
 /* ---------- 4. JALAN: trotoar paving, kerb, zebra cross, lampu, perabot jalan ---------- */
 {const pts=(cross,lo,hi,g)=>{const a=[lo];cross.forEach(c=>{a.push(c-g,c+g)});a.push(hi);const o=[];for(let i=0;i<a.length;i+=2)if(a[i+1]-a[i]>1)o.push([a[i],a[i+1]]);return o};
 const G=kpGrid(),px=[],pu=[];
 const quad=(x0,z0,x1,z1)=>{const y=.078;[[x0,z0],[x1,z0],[x1,z1],[x0,z0],[x1,z1],[x0,z1]].forEach(([a,b])=>{px.push(a,y,b);pu.push(a/2.5,b/2.5)})};
 const KB=0xb9b5aa;
 RX.forEach(r=>pts(RZ,-190,190,5.3).forEach(([a,b])=>{[-1,1].forEach(s=>G.at(r,(a+b)/2).box(.3,.2,b-a,KB,r+s*5.15,.1,(a+b)/2))}));
 RZ.forEach(r=>pts(RX,-220,220,5.3).forEach(([a,b])=>{[-1,1].forEach(s=>G.at((a+b)/2,r).box(b-a,.2,.3,KB,(a+b)/2,.1,r+s*5.15))}));
 RX.forEach(r=>pts(RZ,-190,190,5).forEach(([a,b])=>{quad(r+5,a,r+7.5,b);quad(r-7.5,a,r-5,b)}));
 RZ.forEach(r=>pts(RX,-220,220,7.5).forEach(([a,b])=>{quad(a,r+5,b,r+7.5);quad(a,r-7.5,b,r-5)}));
 if(px.length){const tc=document.createElement('canvas');tc.width=tc.height=64;const g=tc.getContext('2d');g.fillStyle='#ddd6c6';g.fillRect(0,0,64,64);
  for(let i=0;i<260;i++){g.fillStyle=Math.random()<.5?'rgba(120,110,90,.10)':'rgba(255,255,245,.12)';g.fillRect(Math.random()*64,Math.random()*64,2,2)}
  g.fillStyle='#b9b2a2';g.fillRect(0,0,64,2);g.fillRect(0,0,2,64);g.fillRect(0,31,64,2);g.fillRect(31,0,2,64);g.fillStyle='rgba(255,255,255,.35)';g.fillRect(2,2,29,1);g.fillRect(33,2,29,1);g.fillRect(2,33,29,1);g.fillRect(33,33,29,1);
  const tx=new THREE.CanvasTexture(tc);tx.wrapS=tx.wrapT=THREE.RepeatWrapping;tx.anisotropy=4;
  const gg=new THREE.BufferGeometry();gg.setAttribute('position',new THREE.Float32BufferAttribute(px,3));gg.setAttribute('uv',new THREE.Float32BufferAttribute(pu,2));
  const nn=[];for(let i=0;i<px.length/3;i++)nn.push(0,1,0);gg.setAttribute('normal',new THREE.Float32BufferAttribute(nn,3));
  const pm=new THREE.Mesh(gg,new THREE.MeshLambertMaterial({map:tx,polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-2}));pm.receiveShadow=true;S.add(pm)}
 const ZB=0xf4f1e8,pol=window.POL||{x:1e9,z:1e9};
 RX.forEach(X=>RZ.forEach(Z=>{if(X==pol.x&&Z==pol.z)return;const M=G.at(X,Z);
  for(let k=-3;k<=3;k++){[-1,1].forEach(s=>{M.box(.6,.03,2.3,ZB,X+k*1.3,.115,Z+s*6.8);M.box(2.3,.03,.6,ZB,X+s*6.8,.115,Z+k*1.3)})}
  M.box(.14,3.4,.14,0x555b6b,X+6.3,1.7,Z+6.3);M.box(1.3,.3,.06,0x1f7a4d,X+6.3,3.15,Z+6.3);M.box(.06,.3,1.3,0x1f7a4d,X+6.3,2.75,Z+6.3);M.box(1.1,.08,.07,0xffffff,X+6.3,3.15,Z+6.34);M.box(.07,.08,1.1,0xffffff,X+6.3,2.75,Z+6.34)}));
 for(let k=0;k<18&&DQ>.7;k++){const r=pk(RX),z=-150+R()*300;if(RZ.some(q=>Math.abs(q-z)<8))continue;const mx=r+pk([-2.4,2.4]),M=G.at(mx,z);M.cyl(.6,.6,.03,10,0x3a3d46,mx,.1,z);M.cyl(.45,.45,.04,10,0x4a4e59,mx,.11,z)}
 RX.forEach(x=>{let i=0;for(let z=-120;z<=120;z+=40,i++){const M=G.at(x,z),col=[0xe85d4a,0x3d9bff,0xffcf3f,0x2fbf85][i%4];
  M.cyl(.24,.24,.22,8,0x4b5262,x+8,1.0,z);M.cyl(.2,.2,.1,8,0x4b5262,x+8,5.95,z);M.box(.55,.05,.05,0x3a3f4a,x+8.28,5.1,z);M.box(.05,1.6,.65,col,x+8.55,4.25,z);M.box(.06,1.4,.45,0xffffff,x+8.58,4.25,z);
  M.cyl(.3,.22,.3,8,0xb5532f,x+7.55,3.2,z+.4);M.sph(.32,0x3fa35d,x+7.55,3.55,z+.4,1,.8,1);M.sph(.1,pk(KPFL),x+7.45,3.8,z+.5);M.sph(.1,pk(KPFL),x+7.7,3.75,z+.3)}});
 const bench=M=>{M.box(2.2,.07,.28,0x8a5a2b,0,.56,.17);M.box(2.2,.07,.28,0x8a5a2b,0,.56,-.17);M.box(2.2,.1,.06,0x8a5a2b,0,.98,-.32);M.box(2.2,.1,.06,0x8a5a2b,0,.8,-.32);
  [-1,1].forEach(s=>{M.box(.1,.55,.6,0x2f343f,s*.95,.28,0);M.box(.1,.55,.08,0x2f343f,s*.95,.8,-.32);M.box(.08,.06,.6,0x2f343f,s*1.05,.8,0)})};
 const bin=M=>{M.cyl(.32,.27,.85,10,0x2f7a55,0,.43,0);M.cyl(.34,.34,.08,10,0x24604a,0,.88,0);M.cyl(.325,.325,.12,10,0xffcf3f,0,.5,0);M.cyl(.12,.12,.1,8,0x111111,0,.9,0)};
 const hyd=M=>{M.cyl(.26,.26,.08,8,0x8a8f9c,0,.04,0);M.cyl(.2,.22,.6,8,0xd93a2f,0,.38,0);M.sph(.2,0xd93a2f,0,.68,0,1,.8,1);M.cyl(.07,.07,.1,6,0xcfd3da,0,.84,0);M.cyl(.09,.09,.6,6,0xcfd3da,0,.45,0,0,0,Math.PI/2);M.cyl(.1,.1,.22,6,0xcfd3da,0,.35,.2,Math.PI/2,0,0)};
 const mail=M=>{M.cyl(.05,.05,.9,6,0x555b6b,0,.45,0);M.box(.6,.45,.45,0x2a62ff,0,1.1,0);M.cyl(.225,.225,.6,8,0x2a62ff,0,1.325,0,0,0,Math.PI/2);M.box(.35,.04,.04,0x111111,0,1.15,.23);M.box(.04,.3,.04,0xe33b3b,.33,1.4,0)};
 const busstop=M=>{M.box(3.6,.12,1.6,0x3d6fd6,0,2.6,0);M.box(3.7,.06,1.7,0xffffff,0,2.7,0);
  [-1,1].forEach(s=>{M.cyl(.05,.05,2.55,6,0x555b6b,s*1.7,1.28,.7);M.cyl(.05,.05,2.55,6,0x555b6b,s*1.7,1.28,-.7)});
  M.box(3.4,1.9,.06,0xbfe0ff,0,1.55,-.72);M.box(.06,1.9,1.4,0xbfe0ff,-1.7,1.55,0);M.box(2.4,.1,.5,0x8a5a2b,0,.55,-.42);[-1,1].forEach(s=>M.box(.08,.5,.4,0x2f343f,s*1.0,.28,-.42));
  M.box(.9,.6,.04,0xffcf3f,1.0,1.9,-.68);M.box(.7,.05,.05,0x1d2b53,1.0,2.05,-.65);M.box(.5,.05,.05,0x1d2b53,.9,1.9,-.65);
  M.cyl(.04,.04,3.2,6,0x555b6b,2.2,1.6,.9);M.cyl(.36,.36,.06,12,0x3d6fd6,2.2,3.0,.9,Math.PI/2,0,0);M.box(.1,.34,.08,0xffffff,2.2,3.0,.95);M.box(.3,.09,.08,0xffffff,2.2,3.06,.95)};
 const planter=M=>{M.box(.9,.55,.9,0xb5532f,0,.28,0);M.box(1,.1,1,0xc9643f,0,.6,0);M.box(.8,.05,.8,0x4a3320,0,.64,0);M.cyl(.06,.08,.5,5,0x6b4a2b,0,.9,0);M.sph(.55,0x3fa35d,0,1.3,0,1,1.1,1);M.sph(.4,0x4fb85a,.3,1.1,.2);M.sph(.38,0x2f8f4e,-.3,1.15,-.2);for(let k=0;k<5;k++)M.sph(.1,pk(KPFL),(R()-.5)*.9,1.4+R()*.5,(R()-.5)*.9)};
 const bollards=M=>{for(let k=-1;k<=1;k+=.667){M.cyl(.12,.12,.7,8,0x4b5262,k,.35,0);M.cyl(.125,.125,.12,8,0xffcf3f,k,.55,0);M.sph(.12,0x4b5262,k,.7,0,1,.6,1)}};
 const rack=M=>{for(let k=-1;k<=1;k++)M.tor(.38,.03,Math.PI,0xcfd3da,k*.6,.02,0,0,0,0);M.box(1.8,.03,.04,0xcfd3da,0,.4,0)};
 const fns=[[bench,.26],[bin,.2],[planter,.18],[hyd,.1],[mail,.08],[busstop,.07],[bollards,.06],[rack,.05]];
 const choose=()=>{let t=R(),a=0;for(const f of fns){a+=f[1];if(t<a)return f[0]}return bench};
 const place=(px0,pz0,ry)=>{if(!free(px0,pz0,.8))return;const M=G.at(px0,pz0),f=choose();M.base(px0,0,pz0,ry);f(M);M.reset()};
 RX.forEach(r=>{[-1,1].forEach(s=>{for(let z=-170;z<170;z+=14+R()*28){if(R()>DQ)continue;if(RZ.some(q=>Math.abs(q-z)<11))continue;place(r+s*6.4,z,s>0?-Math.PI/2:Math.PI/2)}})});
 RZ.forEach(r=>{[-1,1].forEach(s=>{for(let x=-200;x<200;x+=14+R()*28){if(R()>DQ)continue;if(RX.some(q=>Math.abs(q-x)<11))continue;place(x,r+s*6.4,s>0?Math.PI:0)}})});
 stats.road=G.verts();G.flush(S)}
 /* ---------- 5. KENDARAAN ---------- */
 {const cars=window.cars||[];cars.forEach((c,idx)=>{const M=kpMB();
  [-1,1].forEach(s=>{M.box(4.3,.05,.04,0xcfd3da,.0,.98,s*1.012);M.box(.03,.7,.04,0x151515,.15,.92,s*1.012);M.box(.03,.7,.04,0x151515,-1.1,.92,s*1.012);
   M.box(.22,.07,.06,0xcfd3da,.35,1.12,s*1.03);M.box(.22,.07,.06,0xcfd3da,-.8,1.12,s*1.03);M.box(2.4,.1,.07,0x1a1a1a,-.1,.6,s*1.02);
   M.box(.05,.6,.05,0x202830,-1.5,1.72,s*.92);M.box(.05,.6,.05,0x202830,.95,1.72,s*.92);M.box(2.2,.06,.05,0xcfd3da,-.2,2.2,s*.6);
   M.box(.03,.04,.7,0x111111,1.17,1.55,s*.35);M.box(.06,.36,.58,0xcfd3da,2.18,1,s*.6)});
  M.box(.04,.28,.74,0x1a1a1a,2.365,.5,0);M.box(.03,.22,.68,0xfffaf0,2.385,.5,0);M.box(.04,.28,.74,0x1a1a1a,-2.365,.55,0);M.box(.03,.22,.68,0xfffaf0,-2.385,.55,0);
  M.box(.06,.22,.5,0x151515,2.23,.9,0);for(let k=-1;k<=1;k++)M.box(.07,.2,.03,0x333a4d,2.235,.9,k*.18);
  M.cyl(.015,.015,.9,4,0x222222,-1.3,2.6,.7);M.cyl(.06,.06,.3,6,0x888888,-2.3,.4,.6,0,0,Math.PI/2);
  if(idx%3==0){M.box(.7,.25,.35,0xffd23f,-.2,2.3,0);M.box(.72,.06,.37,0x111111,-.2,2.22,0)}
  M.box(4.2,.1,1.9,0x111111,0,.4,0);
  const o=M.mesh();if(o)c.o.add(o)});
 VEH.forEach(v=>{const M=kpMB();
  if(v.n=='Mobil'){M.box(.9,.22,.05,0x1a1a1a,0,.85,2.13);for(let k=-2;k<=2;k++)M.box(.04,.2,.06,0x333a4d,k*.18,.85,2.14);
   M.box(.7,.2,.03,0xfffaf0,0,.65,2.33);M.box(.7,.2,.03,0xfffaf0,0,.65,-2.33);
   [-1,1].forEach(s=>{M.box(.03,.62,.03,0x1b3fb0,s*1.11,.9,.2);M.box(.03,.62,.03,0x1b3fb0,s*1.11,.9,-.9);M.box(.05,.06,.22,0xcfd3da,s*1.13,1.1,.45);M.box(.05,.06,.22,0xcfd3da,s*1.13,1.1,-.55);M.box(.03,.04,3.4,0xcfd3da,s*1.115,1.0,0);
    M.box(.05,.05,1.5,0xcfd3da,s*.62,1.94,-.2);M.box(.55,.04,.03,0x111111,s*.45,1.3,.87,0,0,s*.15)});
   M.box(1.3,.05,.05,0xcfd3da,0,1.94,-.7);M.box(1.3,.05,.05,0xcfd3da,0,1.94,.3);M.cyl(.015,.015,.8,4,0x222222,.7,2.3,-.95);M.cyl(.06,.06,.3,6,0x888888,.6,.45,-2.25,Math.PI/2,0,0);M.box(2,.1,3.8,0x111111,0,.4,0)}
  else{[-.95,.95].forEach(z=>{M.tor(.72,.035,Math.PI*.85,0xff4d6d,0,.6,z,0,Math.PI/2,Math.PI/2-Math.PI*.85/2)});
   M.cyl(.28,.28,.04,12,0xcfd3da,.1,.58,-.2,0,0,Math.PI/2);M.box(.04,.06,.9,0x333333,0,.58,-.2,0,0,0);M.box(.4,.07,.14,0x222222,.22,.5,-.2);M.box(.4,.07,.14,0x222222,-.22,.68,-.2);
   M.box(.04,.5,.04,0x777777,-.12,.28,-.6,.5,0,0);M.box(.4,.05,.6,0x333333,0,1.1,-.95);M.sph(.08,0xdd2222,0,1.05,-1.28);}
  const o=M.mesh();if(o)v.m.add(o)})}
 try{window.KPSTAT=stats}catch(e){}
}
/* ---------- INTERIOR: detail permanen ruangan (sekali) + detail per profesi (cache) ---------- */
let KPR=0;const KPI={};
function kpRoomDetail(){if(KPR)return;KPR=1;const M=kpMB(),X=RMX,Z=RMZ;
 for(let k=-7;k<=7;k++)M.box(.03,.014,13.6,0xcdb78c,X+k,.097,Z);
 M.box(.3,.3,14,0x8a6a40,X-7.62,5.85,Z);M.box(.3,.3,14,0x8a6a40,X+7.62,5.85,Z);
 [-1,1].forEach(s=>{M.box(.3,6,.3,0x8a6a40,X+s*7.62,3,Z-6.72);M.box(.3,.5,14,0x7a5a36,X+s*7.62,.35,Z)});
 [-5.8,5.8].forEach(o=>{M.box(3.6,.16,.55,0xf5f0e0,X+o,2.15,Z-6.5);M.cyl(.2,.16,.3,8,0xb5532f,X+o+1.1,2.38,Z-6.5);M.sph(.28,0x3fa35d,X+o+1.1,2.82,Z-6.5,1,1.1,1);M.sph(.09,0xff6b8b,X+o+1.2,3.0,Z-6.45);M.sph(.09,0xffcf3f,X+o+1.0,3.05,Z-6.5)});
 [-1,1].forEach(s=>{const px=X+s*6.9,pz=Z+5.4;M.cyl(.45,.35,.7,8,0xb5532f,px,.35,pz);M.cyl(.47,.47,.08,8,0xc9643f,px,.72,pz);M.cyl(.4,.4,.04,8,0x4a3320,px,.72,pz);
  [[0,0,.9,.2,.2,1.2],[.3,.2,.2,.18,.18,1.0],[-.3,-.1,.3,.16,.16,.9],[.1,-.3,.1,.16,.16,.8],[-.2,.25,-.1,.15,.15,.85]].forEach((a,k)=>M.sph(.5,k%2?0x3fa35d:0x2f8f4e,px+a[0],1.35+a[2]*.4,pz+a[1],a[3],a[5],a[4]))});
 M.cyl(.8,.8,.1,20,0x5a3a1c,X+7.74,4.7,Z-4.9,0,0,Math.PI/2);
 for(let k=0;k<6;k++)M.sph(.07,0xffe9a8,X-7.55,4.1,Z-5+k*.01);
 [-1,1].forEach(s=>{M.box(.25,.3,.25,0x8a6a40,X-7.58,4.1,Z+s*1.0);M.sph(.24,0xffe9a8,X-7.45,4.35,Z+s*1.0)});
 const o=M.mesh();if(o)S.add(o);
 const lm=new THREE.MeshBasicMaterial({vertexColors:true,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide});
 [-5.8,5.8].forEach(x0=>{const w=1.3,zt=Z-6.6,zb=Z-2.2,sh=x0<0?1.2:-1.2,pos=[],col=[];
  const tq=(a,b,c2,d,ca,cb)=>{[a,b,c2,a,c2,d].forEach((p,i)=>{pos.push(p[0],p[1],p[2]);const cc=[a,b].includes(p)?ca:cb;col.push(cc,cc*.9,cc*.5)})};
  tq([X+x0-w,4.5,zt],[X+x0+w,4.5,zt],[X+x0+w+sh,.12,zb],[X+x0-w+sh,.12,zb],.16,.0);
  const fl=[[X+x0-w+sh,.115,zb-1.6],[X+x0+w+sh,.115,zb-1.6],[X+x0+w+sh,.115,zb+.6],[X+x0-w+sh,.115,zb+.6]];tq(fl[0],fl[1],fl[2],fl[3],.1,.1);
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('color',new THREE.Float32BufferAttribute(col,3));g.computeBoundingSphere();const m=new THREE.Mesh(g,lm);m.renderOrder=3;S.add(m)});
 const cv=document.createElement('canvas');cv.width=cv.height=128;const g=cv.getContext('2d'),d=new Date();
 g.fillStyle='#fffaf0';g.beginPath();g.arc(64,64,60,0,7);g.fill();g.strokeStyle='#1d2b53';g.lineWidth=5;g.stroke();
 for(let k=0;k<12;k++){const a=k*Math.PI/6;g.lineWidth=k%3?2:4;g.beginPath();g.moveTo(64+Math.sin(a)*50,64-Math.cos(a)*50);g.lineTo(64+Math.sin(a)*57,64-Math.cos(a)*57);g.stroke()}
 const hh=((d.getHours()%12)+d.getMinutes()/60)*Math.PI/6,mm2=d.getMinutes()*Math.PI/30;g.lineCap='round';g.lineWidth=6;g.beginPath();g.moveTo(64,64);g.lineTo(64+Math.sin(hh)*30,64-Math.cos(hh)*30);g.stroke();g.lineWidth=4;g.beginPath();g.moveTo(64,64);g.lineTo(64+Math.sin(mm2)*45,64-Math.cos(mm2)*45);g.stroke();g.fillStyle='#ff6b5e';g.beginPath();g.arc(64,64,5,0,7);g.fill();
 const ck=new THREE.Mesh(new THREE.CircleGeometry(.7,24),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(cv)}));ck.position.set(X+7.68,4.7,Z-4.9);ck.rotation.y=-Math.PI/2;S.add(ck)}
const KPP={
 med(M,c){M.box(2.6,.12,1.3,0xdfe6ee,-4.9,.75,-4.3);[[-1.2,-.55],[1.2,-.55],[-1.2,.55],[1.2,.55]].forEach(a=>M.box(.1,.7,.1,0x9aa3b2,-4.9+a[0],.38,-4.3+a[1]));M.box(2.5,.25,1.2,0x7fc4e8,-4.9,.92,-4.3);M.box(.6,.15,.9,0xffffff,-5.8,1.1,-4.3);M.box(1.5,.12,1.25,0xffffff,-4.4,1.12,-4.3);M.box(1.5,.02,.2,0xe33b3b,-4.4,1.19,-4.3);
  M.cyl(.04,.04,2.6,6,0xcfd3da,-3.5,1.3,-5.3);M.box(.8,.06,.08,0x9aa3b2,-3.5,.05,-5.3);M.box(.08,.06,.8,0x9aa3b2,-3.5,.05,-5.3);M.box(.3,.45,.12,0xbfe9ff,-3.5,2.5,-5.3);M.cyl(.015,.015,1.2,4,0xbfe9ff,-3.5,1.7,-5.3);M.box(.7,.7,.06,0xffffff,-4.9,3.5,-6.2);M.box(.5,.14,.07,0xe33b3b,-4.9,3.5,-6.18);M.box(.14,.5,.07,0xe33b3b,-4.9,3.5,-6.18)},
 teach(M){M.box(2.4,1.6,.08,0x2f5d4a,-4.9,2.1,-5.5);M.box(2.6,.1,.12,0x8a5a2b,-4.9,2.95,-5.5);M.box(2.6,.1,.12,0x8a5a2b,-4.9,1.25,-5.5);M.box(.1,1.8,.12,0x8a5a2b,-6.15,2.1,-5.5);M.box(.1,1.8,.12,0x8a5a2b,-3.65,2.1,-5.5);M.box(2.4,.08,.22,0x8a5a2b,-4.9,1.15,-5.4);
  M.box(1.3,.04,.02,0xffffff,-5.3,2.55,-5.44);M.box(.9,.04,.02,0xffffff,-5.5,2.3,-5.44);M.box(1.1,.04,.02,0xffe08a,-5.4,2.05,-5.44);M.box(.2,.06,.07,0xffffff,-4.3,1.22,-5.4);[-1,1].forEach(s=>M.box(.1,1.2,.1,0x8a5a2b,-4.9+s*1.4,.6,-5.1));M.sph(.28,0x3d9bff,-3.5,1.25,-3.2);M.box(.6,.05,.5,0xc9a36b,-3.5,.9,-3.2)},
 lib(M){M.box(1.9,.08,.8,0x8a5a2b,-4.9,.9,-4.6);M.box(1.9,.08,.8,0x8a5a2b,-4.9,.4,-4.6);[-.9,.9].forEach(s=>[-.35,.35].forEach(t=>M.box(.07,.9,.07,0x5a3a1c,-4.9+s,.5,-4.6+t)));[-.9,.9].forEach(s=>M.cyl(.12,.12,.08,8,0x222222,-4.9+s,.1,-4.2,0,0,Math.PI/2));
  for(let k=0;k<7;k++){M.box(.2,.5+(k%3)*.08,.4,kpPk([0xd9594c,0x3d6fd6,0xffcf3f,0x2fbf85,0x9b6bd6]),-5.7+k*.26,1.2+(k%3)*.04,-4.6);M.box(.2,.4,.4,kpPk([0xd9594c,0x3d6fd6,0xffcf3f,0x2fbf85]),-5.7+k*.26,.65,-4.6)}},
 cook(M){M.box(2.6,.9,1.1,0xdfe6ee,-4.9,.45,-5.4);M.box(2.7,.08,1.2,0x8a8f9c,-4.9,.94,-5.4);[-.6,.6].forEach(s=>{M.cyl(.28,.28,.04,10,0x222222,-4.9+s,.99,-5.4)});M.cyl(.3,.3,.4,10,0xc0392b,-5.5,1.2,-5.4);M.cyl(.32,.32,.05,10,0x8a8f9c,-5.5,1.42,-5.4);M.cyl(.32,.28,.1,10,0x333a4d,-4.3,1.04,-5.4);M.box(.6,.05,.08,0x333a4d,-3.85,1.04,-5.4);
  M.box(2.6,.5,.9,0xcfd3da,-4.9,3.3,-5.85);M.box(.7,1.6,.6,0xcfd3da,-4.9,4.35,-5.9);[-1,0,1].forEach(s=>{M.cyl(.015,.015,.5,4,0x777777,-4.9+s*.7,2.8,-5.9);M.sph(.12,0x777777,-4.9+s*.7,2.5,-5.9)});[-1,1].forEach(s=>M.box(.05,.5,.05,0x8a8f9c,-4.9+s*1.0,.25,-4.9))},
 imam(M){M.box(1.4,1.5,1,0x7a5230,-4.9,.75,-5.4);M.box(1.6,.12,1.2,0x8a6040,-4.9,1.55,-5.4);M.box(1.2,.3,.6,0x7a5230,-4.9,.15,-4.6);M.box(1.2,.3,.4,0x7a5230,-4.9,.3,-4.85);M.box(.9,.06,.7,0xf5e6c8,-4.9,1.65,-5.3,-.3,0,0);
  M.box(1.5,.03,2.2,0x2f9e6b,-4.9,.1,-3.3);M.box(1.3,.04,2.0,0xf5e6c8,-4.9,.11,-3.3);M.cyl(0,.4,.6,3,0x2f9e6b,-4.9,.13,-2.5,Math.PI/2,0,0);M.box(.5,.02,.5,0x2f9e6b,-4.9,.125,-3.5,0,Math.PI/4,0)},
 tail(M,c){M.box(2.2,.1,1.1,0x8a5a2b,-4.9,1.05,-5.2);[[-1,-.45],[1,-.45],[-1,.45],[1,.45]].forEach(a=>M.box(.1,1,.1,0x5a3a1c,-4.9+a[0],.5,-5.2+a[1]));M.box(.9,.35,.4,0xf2f2f2,-5.3,1.4,-5.2);M.box(.18,.7,.28,0xf2f2f2,-4.95,1.65,-5.2);M.box(.04,.4,.04,0x888,-4.88,1.4,-5.0);M.box(.6,.08,.6,c,-4.0,1.15,-5.2);
  M.cyl(.28,.4,1.2,8,0xe8d9c0,-3.6,1.5,-3.8);M.sph(.2,0xe8d9c0,-3.6,2.3,-3.8);M.cyl(.04,.04,1,5,0x333,-3.6,.5,-3.8);M.cyl(.3,.3,.06,8,0x333,-3.6,.04,-3.8);[0,1,2,3].forEach(k=>M.cyl(.16,.16,1,8,[0xff6b8b,0x3d9bff,0xffcf3f,0x2fbf85][k],-6.3,.5+k*.34,-4.2,0,0,Math.PI/2))},
 pilot(M){M.cyl(.06,.06,1.8,5,0x777777,-4.9,.9,-5);M.box(.9,.1,.9,0x555b6b,-4.9,.05,-5);M.cyl(.2,.13,2.2,8,0xf2f2f2,-4.9,2.1,-5,0,0,Math.PI/2);M.cyl(0,.2,.5,8,0xff6b5e,-3.7,2.1,-5,0,0,-Math.PI/2);M.box(.6,.06,2.8,0xff6b5e,-4.9,2.1,-5);M.box(.4,.05,1.1,0xff6b5e,-5.8,2.15,-5);M.box(.05,.5,.35,0xff6b5e,-5.8,2.4,-5);M.box(.5,.16,.3,0x9fd6f0,-4.4,2.28,-5);
  M.box(1.2,.35,.6,0x3d6fd6,-3.4,.2,-3.2);M.box(.9,.3,.02,0xffffff,-3.4,.2,-2.88);M.cyl(.3,.3,.35,10,0xffcf3f,-6.1,.18,-3.6)},
 bank(M){M.box(1.4,1.7,1.1,0x555b6b,-4.9,.85,-5.5);M.box(1.1,1.35,.07,0x6e7686,-4.9,.85,-4.93);M.cyl(.22,.22,.08,10,0xe8c050,-4.9,1.0,-4.88,Math.PI/2,0,0);M.box(.1,.4,.08,0xe8c050,-4.4,.8,-4.88);
  for(let k=0;k<5;k++)M.cyl(.22,.22,.09,10,0xffd23f,-3.4,.15+k*.1,-4.6);for(let k=0;k<3;k++)M.cyl(.22,.22,.09,10,0xffd23f,-3.0,.15+k*.1,-4.9);M.box(1.2,.7,.5,0x2fbf85,-6.1,.35,-4.4);M.box(1.0,.03,.3,0xe8f5e0,-6.1,.72,-4.4)},
 mer(M){[0,1].forEach(k=>{M.box(1,.55,.9,0xb5532f,-5.6+k*1.15,.28,-5.2);M.box(1.06,.08,.96,0xc9643f,-5.6+k*1.15,.58,-5.2);for(let j=0;j<5;j++)M.sph(.17,kpPk([0xe33b3b,0xffb81f,0x6fc45a]),-5.85+k*1.15+(j%3)*.25,.72+(j>2?.15:0),-5.3+(j%2)*.2)});
  M.box(.9,.1,.7,0x8a5a2b,-3.8,1.0,-5.2);M.cyl(.05,.05,.8,5,0x777777,-3.8,.6,-5.2);M.box(1.2,.05,.06,0xcfd3da,-3.8,1.55,-5.2);M.box(.04,.5,.04,0xcfd3da,-4.35,1.3,-5.2);M.box(.04,.5,.04,0xcfd3da,-3.25,1.3,-5.2);M.cyl(.25,.25,.04,8,0xe8c050,-4.35,1.03,-5.2);M.cyl(.25,.25,.04,8,0xe8c050,-3.25,1.03,-5.2);M.cyl(.015,.015,.5,4,0x777,-3.8,1.8,-5.2)},
 farm(M){[0,1,2].forEach(k=>{M.cyl(.4,.45,.9,8,0xd9c79a,-6.0+k*.9,.45,-5.3);M.cyl(.15,.3,.25,8,0xc9b684,-6.0+k*.9,1.0,-5.3)});M.box(1.2,.7,.8,0xe0c060,-3.8,.35,-5.3);for(let k=0;k<4;k++)M.box(1.22,.03,.82,0xb8943a,-3.8,.15+k*.15,-5.3);
  M.box(.08,2.2,.05,0x7a5230,-4.5,1.2,-4.2,0,0,.18);M.box(.4,.5,.04,0x888,-4.2,.3,-4.2,0,0,.18);M.cyl(0,.35,.6,6,0xf5e6c8,-6.2,.3,-3.8);M.sph(.2,0xe33b3b,-6.0,.2,-3.6)},
 eng(M,c){M.box(1.9,.08,1.3,0xffffff,-4.9,1.45,-5.0,.4,0,0);[0,1,2].forEach(k=>M.box(1.3-k*.2,.02,.03,0x3d6fd6,-4.9,1.5+.02*k,-5.0+k*.0+.1,.4,0,0));[-.85,.85].forEach(s=>{M.box(.08,1.3,.08,0x5a3a1c,-4.9+s,.65,-5.0)});
  M.sph(.3,0xffcf3f,-3.6,.45,-3.5,1,.7,1);M.box(.8,.06,.8,0xffcf3f,-3.6,.18,-3.5);M.cyl(.04,.04,1.4,4,0xdddddd,-6.3,.7,-3.5,0,0,.3);M.box(.9,.04,.5,0xe3eefc,-3.2,.95,-5.4);M.cyl(.15,.15,.9,8,0xffffff,-6.1,.5,-5.4,0,0,Math.PI/2)},
 jour(M){for(let k=0;k<3;k++)M.cyl(.04,.04,1.6,5,0x333a4d,-4.9+Math.sin(k*2.1)*.3,.8,-5+Math.cos(k*2.1)*.3,Math.sin(k*2.1)*.2,0,Math.cos(k*2.1)*.2);M.box(.7,.5,.6,0x2b2f38,-4.9,1.8,-5);M.cyl(.18,.18,.4,10,0x1a1a1a,-4.9,1.8,-4.55,Math.PI/2,0,0);M.cyl(.12,.12,.04,10,0x9fd6f0,-4.9,1.8,-4.34,Math.PI/2,0,0);M.sph(.07,0xff3b3b,-4.7,2.1,-4.7);
  M.box(1.6,.5,.1,0xdd3333,-3.3,3.6,-6.15);M.box(1.3,.12,.12,0xffffff,-3.3,3.6,-6.1);M.cyl(.04,.04,1.8,5,0x333,-6.0,.9,-4.0);M.sph(.14,0x333a4d,-6.0,1.9,-4.0);M.box(1.4,.8,.5,0x555b6b,-3.4,.4,-3.4);M.box(1.3,.4,.05,0x9fd6f0,-3.4,.7,-3.14)},
 home(M,c){M.box(2.1,.1,1.3,0x8a5a2b,-4.9,1.1,-5);[[-.95,-.55],[.95,-.55],[-.95,.55],[.95,.55]].forEach(a=>M.box(.1,1.05,.1,0x5a3a1c,-4.9+a[0],.53,-5+a[1]));[-.6,.6].forEach(s=>{M.cyl(.24,.24,.03,10,0xfffaf0,-4.9+s,1.17,-4.8);M.cyl(.14,.14,.02,10,c,-4.9+s,1.19,-4.8)});M.cyl(.1,.08,.3,8,0x3d9bff,-4.9,1.3,-5.3);for(let k=0;k<3;k++)M.sph(.1,kpPk(KPFL),-4.9+(k-1)*.1,1.55,-5.3);
  [-1,1].forEach(s=>{M.box(.6,.08,.6,0xc9a36b,-4.9+s*1.5,.65,-5);M.box(.6,.7,.08,0xc9a36b,-4.9+s*1.5,1.0,-5.3);[[-.25,-.25],[.25,-.25],[-.25,.25],[.25,.25]].forEach(a=>M.box(.06,.6,.06,0x8a5a2b,-4.9+s*1.5+a[0],.3,-5+a[1]))})},
 drive(M){M.box(.9,.1,.9,0x555b6b,-5.0,.05,-5);M.cyl(.06,.06,1.2,6,0x333a4d,-5.0,.7,-5);M.tor(.5,.07,Math.PI*2,0x2b2f38,-5.0,1.5,-5,-1.1,0,0);M.cyl(.12,.12,.08,8,0xe8c050,-5.0,1.5,-5,-1.1,0,0);
  [0,1,2].forEach(k=>M.tor(.4,.16,Math.PI*2,0x1a1a1a,-3.4,.16+k*.32,-5.2,Math.PI/2,0,0));M.box(.3,.4,.3,0xff7a2f,-3.2,.2,-3.6);M.cyl(0,.25,.7,8,0xff7a2f,-6.2,.35,-3.5);M.cyl(.28,.28,.05,8,0xffffff,-6.2,.4,-3.5);M.box(1.2,.5,.5,0x2a62ff,-3.3,.25,-2.6)},
 pol(M){[0,1].forEach(k=>{M.cyl(0,.28,.7,8,0xff7a2f,-5.8+k*.8,.35,-3.6);M.cyl(.2,.2,.1,8,0xffffff,-5.8+k*.8,.4,-3.6);M.box(.62,.05,.62,0xff7a2f,-5.8+k*.8,.03,-3.6)});[0,1,2,3].forEach(k=>M.box(.45,.35,.14,k%2?0xffffff:0xdd3333,-4.6+k*.45,.9,-5.4));[-1,1].forEach(s=>M.box(.08,.9,.08,0x555b6b,-3.8+s*1.0,.45,-5.4));
  M.box(.7,.4,.5,0x2b2f38,-3.2,1.25,-2.8);M.box(.1,.5,.1,0x2b2f38,-3.0,1.7,-2.8);M.sph(.1,0xdd3333,-3.0,1.98,-2.8);M.box(1.1,.7,.1,0xfffaf0,-6.0,3.2,-6.15);M.box(.5,.4,.12,0x1d2b53,-6.0,3.2,-6.12)},
 army(M){M.cyl(.05,.05,3.4,6,0x777777,-6.2,1.7,-5.6);M.sph(.1,0xe8c050,-6.2,3.45,-5.6);M.box(1.2,.75,.04,0x6b7a4a,-5.58,3.0,-5.6);M.box(1.2,.12,.05,0xe8c050,-5.58,3.0,-5.58);M.box(1,2.6,.8,0x6b7a4a,-4.2,1.3,-5.7);M.box(.9,2.4,.04,0x59673c,-4.2,1.3,-5.28);M.box(.08,.4,.06,0xcfd3da,-3.85,1.4,-5.25);
  [0,1,2].forEach(k=>M.sph(.5,0xb8a574,-3.0+k*.1,.2+k*.35,-3.6-k*.2,1.3,.5,.9));M.box(.5,.3,.3,0x4a5238,-6.0,.15,-3.6)},
 ball(M){M.sph(.45,0xffffff,-6.2,.45,-3.2,1,1,1);[[0,.45,.4],[.4,.7,.1],[-.4,.7,.1],[0,.1,.4]].forEach(a=>M.sph(.14,0x222222,-6.2+a[0],a[1],-3.2+a[2]));
  [-1,1].forEach(s=>M.cyl(.06,.06,2,6,0xffffff,-4.9+s*1.5,1,-5.5));M.cyl(.06,.06,3.1,6,0xffffff,-4.9,2,-5.5,0,0,Math.PI/2);for(let k=-6;k<=6;k++)M.box(.015,1.9,.015,0xe8ecf0,-4.9+k*.23,1,-5.8);for(let k=0;k<6;k++)M.box(3.0,.015,.015,0xe8ecf0,-4.9,.3+k*.35,-5.8);M.box(1.6,.04,.4,0x2fbf85,-4.9,.1,-4.4)},
 sci(M){M.box(2.4,.1,1,0xdfe6ee,-4.9,1.1,-5.2);[[-1.1,-.4],[1.1,-.4],[-1.1,.4],[1.1,.4]].forEach(a=>M.box(.1,1.05,.1,0x9aa3b2,-4.9+a[0],.53,-5.2+a[1]));
  [[0xff6b8b,-5.6],[0x7fe0a8,-5.1],[0x3d9bff,-4.6]].forEach(a=>{M.cyl(.2,.2,.35,8,a[0],a[1],1.35,-5.2);M.cyl(.07,.07,.25,6,0xdfe6ee,a[1],1.68,-5.2)});M.box(.5,.06,.4,0x333a4d,-3.9,1.18,-5.2);M.box(.1,.5,.1,0x333a4d,-3.9,1.45,-5.3);M.cyl(.06,.06,.4,6,0x9aa3b2,-3.9,1.65,-5.1,.5,0,0);
  M.sph(.45,0x3d9bff,-6.2,.5,-3.3);M.tor(.5,.03,Math.PI*2,0xe8c050,-6.2,.5,-3.3,Math.PI/2,0,0);M.cyl(.04,.04,.4,5,0xe8c050,-6.2,.08,-3.3)},
 def(M,c){M.box(1.6,.9,.5,0x8a5a2b,-5.2,.45,-5.5);M.cyl(.4,.4,.06,10,0x555b6b,-3.6,.9,-5.5);M.cyl(.04,.04,.9,5,0x555b6b,-3.6,.45,-5.5);M.sph(.38,c,-3.6,1.2,-5.5);M.tor(.4,.03,Math.PI*2,0xe8c050,-3.6,1.2,-5.5,Math.PI/2,0,0)}
};
const KPM={0:'farm',1:'eng',21:'eng',2:'mer',22:'mer',3:'pol',4:'med',16:'med',19:'med',5:'army',6:'teach',7:'jour',8:'cook',20:'cook',9:'imam',23:'imam',10:'tail',11:'pilot',12:'bank',13:'lib',14:'home',15:'drive',17:'ball',18:'sci'};
function kpIntDetail(b){let o=KPI[b.i];if(!o){const M=kpMB(),c=b.d.c,i=b.i;M.base(RMX,0,RMZ,0);
  [-1,1].forEach(s=>{M.box(.65,2.9,.18,c,s*7.45,3.4,-6.5);M.box(.7,.14,.22,kpDk(c,.35),s*7.45,3.05,-6.48);M.box(.75,.1,.25,kpLt(c,.4),s*7.45,4.9,-6.48)});
  for(let k=-3.75;k<=3.76;k+=.5){M.box(.12,.02,.4,0xffffff,k,.1,-3.67);M.box(.12,.02,.4,0xffffff,k,.1,1.67)}
  [[-2.6,-1],[0,-1],[2.6,-1],[-1.3,-2.3],[1.3,-2.3],[-1.3,.3],[1.3,.3]].forEach(a=>M.box(.9,.012,.9,kpLt(c,.45),a[0],.133,a[1],0,Math.PI/4,0));
  M.box(1.1,.25,.1,0xffffff,1.0,1.72,-2.2);M.box(1.1,.06,.12,c,1.0,1.57,-2.2);M.cyl(.14,.12,.3,8,0xd9594c,-2.4,1.77,-3.4);[0xffcf3f,0x3d9bff,0x2fbf85].forEach((cl,k)=>M.cyl(.015,.015,.45,4,cl,-2.4+(k-1)*.06,2.05,-3.4,0,0,(k-1)*.25));
  M.cyl(.14,.12,.25,8,0xfffaf0,.6,1.73,-3.5);M.box(.14,.1,.04,0xfffaf0,.76,1.76,-3.5);M.cyl(.3,.25,.6,10,0x555b6b,3.5,.3,-3.2);M.cyl(.31,.31,.05,10,0x333a4d,3.5,.62,-3.2);
  M.cyl(.05,.05,3.2,6,0x333a4d,-6.5,1.6,-5.9);M.cyl(.3,.45,.6,8,kpLt(c,.55),-6.5,3.4,-5.9);M.cyl(.3,.3,.06,8,0x333a4d,-6.5,.03,-5.9);
  const pr=KPP[KPM[i]]||KPP.def;pr(M,c);
  o=KPI[b.i]=M.mesh()}
 if(o)IGR.add(o)}
