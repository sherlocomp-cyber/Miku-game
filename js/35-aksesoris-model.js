// ================= AKSESORIS v50: model baru & detail lebih kaya (pasangan: 36-aksesoris-musik.js, 37-aksesoris-gerak.js) =================
// Dimuat setelah 06-aksesoris-v39.js. Menambah item toko baru, menggambar ulang item interaktif, dan memberi kilap logam/pernis ke SEMUA aksesoris.
const KX=window.KX={ref:{},fl:[],noz:[],worn:[],wings:null};
const kxFlame=(x,y,z,r,h,c)=>{const m=kCo(r,h,kGl(c),x,y,z,[kPI,0,0]);m.geometry.translate(0,h/2,0);m.castShadow=false;m.scale.setScalar(.01);KX.fl.push(m);return m};
const kxHD=(x,y,z)=>{const g=new THREE.Group();g.position.set(x,y,z);HD.add(g);return g};
const kxSide=(k,x,y,z)=>{const g=new THREE.Group();g.position.set(x,y,z);P.add(g);return g};

// ---- GITAR: badan berlapis pernis, rosette, fret, senar, pasak, tali bahu ----
kUp('gitar',()=>{const g=kGrp(.1,2.2,-.74,.5),W=0xc0302a;g.userData.b={x:.1,y:2.2,z:-.74,rz:.5};KX.ref.gitar=g;
 kSp(.42,W,0,-.12,0,[1,1.1,.34],g);kSp(.56,W,0,-.85,0,[1,1.05,.34],g);
 k3(new THREE.TorusGeometry(.5,.028,6,26),0xf6e8b0,0,-.85,.12,null,g,[1,1.05,1]);k3(new THREE.TorusGeometry(.4,.028,6,26),0xf6e8b0,0,-.12,.12,null,g,[1,1.1,1]);
 kCy(.17,.17,.05,0x111111,0,-.62,.13,[kPI/2,0,0],g);kTo(.2,.025,0xe8c050,0,-.62,.15,null,g);kTo(.25,.012,0x3a2414,0,-.62,.15,null,g);
 kRB(.5,.34,.03,0xf6f6f6,.14,-.98,.14,[0,0,.25],g);kRB(.52,.08,.07,0x3a2414,0,-1.28,.16,null,g);kBx(.42,.03,.08,0xf6f6f6,0,-1.24,.19,null,g);
 kBx(.17,1.55,.09,0x3a2414,0,.9,0,null,g);kBx(.19,1.5,.03,0x1b1b1b,0,.92,.06,null,g);
 for(let i=0;i<8;i++)kBx(.2,.022,.04,0xcfd6de,0,.3+i*.18,.085,null,g);[3,5].forEach(i=>kSp(.03,0xf6f6f6,0,.39+i*.18,.09,null,g));
 kBx(.28,.46,.1,0x1b1b1b,0,1.86,0,null,g);both(k=>[0,1,2].forEach(j=>kSp(.045,0xcfd6de,k*.17,1.74+j*.13,.04,null,g)));
 for(let i=0;i<6;i++)kBx(.011+(5-i)*.0015,2.7,.012,i<3?0xe8d8a0:0xf1f1f1,(i-2.5)*.027,.2,.1,null,g);
 both(k=>kBx(.08,1.8,.04,0x2b2b2b,k*.1,2.5,.48,[0,0,k*-.3]));kBx(.2,.1,.05,0xe8c050,0,3.1,.5)});

// ---- OUD: mangkuk bulat, rosette berlubang, pegbox melengkung ----
kUp('oud',()=>{const g=kGrp(.1,2.3,-.74,.55);g.userData.b={x:.1,y:2.3,z:-.74,rz:.55};KX.ref.oud=g;
 kSp(.64,0xa8602a,0,-.55,-.04,[1,1.2,.55],g);kSp(.6,0xc98a4a,0,-.55,.08,[1,1.18,.3],g);
 kCy(.18,.18,.04,0x111111,0,-.4,.2,[kPI/2,0,0],g);kTo(.22,.025,0xe8c050,0,-.4,.22,null,g);kTo(.3,.02,0x3a2414,0,-.4,.22,null,g);
 for(let i=0;i<8;i++){const a=i*kPI/4;kSp(.035,0x2b1a0e,Math.cos(a)*.38,-.4+Math.sin(a)*.38,.21,null,g)}
 kRB(.5,.08,.07,0x3a2414,0,-.98,.2,null,g);kBx(.22,1.3,.1,0x3a2414,0,.75,0,null,g);kBx(.24,1.3,.03,0x1b1b1b,0,.76,.06,null,g);
 for(let i=0;i<5;i++)kBx(.24,.02,.04,0xcfd6de,0,.3+i*.22,.085,null,g);
 kRB(.3,.5,.12,0x3a2414,0,1.55,-.03,[.35,0,0],g);kRB(.3,.34,.12,0x3a2414,0,1.9,-.22,[.8,0,0],g);
 both(k=>[0,1,2].forEach(j=>kSp(.05,0xe8c050,k*.19,1.42+j*.14,0,null,g)));
 for(let i=0;i<5;i++)kBx(.011,1.95,.012,0xf6f6f6,-.08+i*.04,.3,.1,null,g);
 both(k=>kBx(.08,1.8,.04,0x2b2b2b,k*.1,2.5,.48,[0,0,k*-.3]))});

// ---- REBANA HADROH (baru, tangan) ----
kA('w','rebana','Rebana Hadroh','🥁',50,()=>{const g=kxHD(0,.5,.35);KX.ref.rebana=g;
 kCy(.62,.62,.2,0x7a4a24,0,0,0,[kPI/2,0,0],g);kCy(.56,.56,.06,0xf2e3c0,0,0,.1,[kPI/2,0,0],g);kTo(.62,.04,0xe8c050,0,0,.11,null,g);
 for(let i=0;i<8;i++){const a=i*kPI/4;kBx(.1,.1,.03,i%2?0xd02a2a:0x2f9e6b,Math.cos(a)*.48,Math.sin(a)*.48,.14,[0,0,a],g)}
 for(let i=0;i<6;i++){const a=i*kPI/3+.3;kCy(.09,.09,.02,0xe8c050,Math.cos(a)*.64,Math.sin(a)*.64,0,null,g)}
 kSp(.09,0xd02a2a,0,0,.15,[1,1,.4],g)});

// ---- SERULING BAMBU (baru, tangan) ----
kA('w','seruling','Seruling Bambu','🎶',100,()=>{const g=kxHD(0,.2,.4);KX.ref.seruling=g;
 kCy(.075,.075,1.7,0xc9a15a,0,0,0,[kPI/2,0,0],g);[-.7,-.25,.25,.7].forEach(z=>kTo(.08,.014,0x7a5a22,0,0,z,null,g));
 for(let i=0;i<6;i++)kSp(.032,0x1b1b1b,0,.075,-.35+i*.16,[1,.4,1],g);kSp(.04,0x1b1b1b,0,.075,.7,[1,.4,1.3],g);
 kBx(.05,.34,.05,0xd02a2a,0,-.2,-.88,null,g);kSp(.06,0xffcf3f,0,-.4,-.88,null,g)});

// ---- KAMERA FOTO (baru, tangan) ----
kA('w','kamera','Kamera Foto','📷',100,()=>{const g=kxHD(0,.3,.3);KX.ref.kamera=g;
 kRB(.78,.5,.36,0x2b2b36,0,0,0,null,g);kRB(.8,.2,.37,0xdfe6ee,0,.16,0,null,g);
 kCy(.2,.22,.24,0x1b1b1b,0,-.02,.28,[kPI/2,0,0],g);kCy(.15,.15,.05,kGs(0x5ea8ff,.8),0,-.02,.42,[kPI/2,0,0],g);kTo(.22,.025,0xcfd6de,0,-.02,.4,null,g);
 kBx(.22,.12,.1,0xfff3a0,.25,.34,.05,null,g);kCy(.07,.07,.08,0xd02a2a,-.28,.32,0,null,g);kBx(.04,.5,.04,0x3a2414,.4,.15,0,[0,0,.2],g)});

// ---- JETPACK: tangki, nosel, api (disembunyikan sampai mesin menyala), strap ----
kUp('jetpack',()=>{KX.noz=[[-.42,1.2,-.9],[.42,1.2,-.9]];
 kRB(1.3,1.4,.22,0x3d4756,0,2.4,-.62);kRB(1,.5,.1,0x2b3340,0,2.9,-.76);
 both(k=>{const x=k*.42;kCy(.3,.3,1.55,0xcfd6de,x,2.45,-.9);kSp(.3,0xcfd6de,x,3.22,-.9,[1,.6,1]);kCy(.32,.32,.1,0xd9594c,x,2.8,-.9);kCy(.32,.32,.1,0xd9594c,x,2,-.9);
  kCy(.2,.3,.34,0x555e68,x,1.5,-.9);kTo(.28,.03,0xe8c050,x,1.34,-.9,[kPI/2,0,0]);kBx(.08,.3,.08,0xffcf3f,x,3.5,-.9);kSp(.07,kGl(0x2fff7a),x,2.45,-1.21);
  kBx(.12,1.6,.04,0x2b2b36,k*.55,2.4,.47);kxFlame(x,1.32,-.9,.2,1.1,0xff9a2f);kxFlame(x,1.32,-.9,.11,.7,0xfff3a0)});
 kBx(.8,.14,.22,0x555e68,0,2.75,-.82);kBx(.5,.08,.06,0xffcf3f,0,2.4,-1.06)});

// ---- ROKET ANTARIKSA (baru, punggung, legendaris) ----
kA('k','roketx','Roket Antariksa','🚀',350,()=>{const z=-.95;KX.noz=[[0,1,z],[-.62,1.05,z+.1],[.62,1.05,z+.1]];
 kBx(1.3,.2,.3,0x3d4756,0,2.1,-.6);both(k=>kBx(.1,1.6,.04,0x2b2b36,k*.55,2.4,.47));
 kCy(.42,.46,2.4,0xf6f6f6,0,2.5,z);kCo(.42,.9,0xd02a2a,0,4.15,z);kTo(.44,.035,0xd02a2a,0,3.6,z,[kPI/2,0,0]);kTo(.46,.035,0xd02a2a,0,1.7,z,[kPI/2,0,0]);
 kTo(.2,.03,0xe8c050,0,3,z-.42);kCy(.16,.16,.06,kGs(0x7fd6ff,.85),0,3,z-.42,[kPI/2,0,0]);kBx(.3,.12,.04,0x2b3550,0,2.2,z-.45);
 both(k=>{kBx(.08,.9,.55,0xd02a2a,k*.5,1.6,z,[0,0,k*-.3]);kCy(.17,.2,1.7,0xcfd6de,k*.62,2.1,z+.1);kCo(.17,.4,0xd02a2a,k*.62,3.15,z+.1);kCy(.15,.1,.2,0x555e68,k*.62,1.15,z+.1);kxFlame(k*.62,1.05,z+.1,.17,.9,0xff9a2f)});
 kBx(.08,.9,.55,0xd02a2a,0,1.6,z-.5);kCy(.2,.34,.4,0x555e68,0,1.15,z);kTo(.34,.03,0xe8c050,0,.95,z,[kPI/2,0,0]);
 kxFlame(0,.95,z,.3,1.7,0xff9a2f);kxFlame(0,.95,z,.16,1.1,0xfff3a0)});

// ---- BALING-BALING BAMBU (baru, topi) ----
kA('h','bambu','Baling-baling Bambu','🚁',200,()=>{kSp(.5,0xffcf3f,0,4.5,-.05,[1.4,.5,1.35]);kCy(.1,.1,.4,0x2fa36b,0,4.85,-.05);kSp(.14,0xe8c050,0,5.05,-.05);
 both(k=>kBx(.1,.12,.12,0xe8a820,k*.72,4.45,-.05));const g=kGrp(0,5.15,-.05);KX.ref.bambu=g;kCy(.12,.12,.12,0xcfd6de,0,0,0,null,g);
 [0,1].forEach(i=>{kRB(2.2,.05,.34,i?0x3d6fd6:0xd02a2a,0,i*.02,0,[0,i*kPI/2,0],g)});both(k=>{kBx(.3,.056,.34,0xffcf3f,k*1.05,0,0,null,g);kBx(.34,.056,.3,0xffcf3f,0,.02,k*1.05,null,g)})});

// ---- PAPAN HOVER (baru, punggung; papan turun ke kaki saat dipakai) ----
kA('k','hoverboard','Papan Hover','🛹',200,()=>{const c=kGrp(.2,2.4,-.78,.25);KX.ref.carry=c;
 kRB(.55,1.9,.1,0x2b3550,0,0,0,null,c);both(k=>kBx(.03,1.9,.11,kGl(0x39e6ff),k*.27,0,0,null,c));kCy(.16,.16,.04,0x1b1b1b,0,.5,-.07,[kPI/2,0,0],c);kTo(.16,.02,kGl(0x39e6ff),0,.5,-.09,null,c);kCy(.16,.16,.04,0x1b1b1b,0,-.5,-.07,[kPI/2,0,0],c);kTo(.16,.02,kGl(0x39e6ff),0,-.5,-.09,null,c);
 const d=new THREE.Group();d.position.set(0,-.12,.05);d.visible=false;P.add(d);KX.ref.hover=d;
 kRB(1.1,.14,2.4,0x2b3550,0,0,0,null,d);kRB(.9,.12,.5,0x3d4756,0,0,1.35,null,d);both(k=>kBx(.04,.16,2.42,kGl(0x39e6ff),k*.55,0,0,null,d));
 [-.7,.7].forEach(z=>{kCy(.32,.32,.06,0x1b1b1b,0,-.1,z,null,d);kTo(.3,.03,kGl(0x39e6ff),0,-.14,z,[kPI/2,0,0],d)})});

// ---- KOMPAS PETUALANG (baru, leher) ----
kA('n','kompas','Kompas Petualang','🧭',100,()=>{both(k=>kBx(.04,.75,.03,0xe8c050,k*.3,2.95,.5,[0,0,k*-.4]));
 kCy(.34,.34,.1,0xe8c050,0,2.4,.52,[kPI/2,0,0]);kTo(.34,.035,0xfff3a0,0,2.4,.58);kCy(.28,.28,.1,0xfff8e0,0,2.4,.55,[kPI/2,0,0]);
 [0,1,2,3].forEach(i=>{const a=i*kPI/2;kBx(.04,.07,.03,i?0x1b1b1b:0xd02a2a,Math.sin(a)*.22,2.4+Math.cos(a)*.22,.61,[0,0,-a])});
 const n=new THREE.Group();n.position.set(0,2.4,.64);P.add(n);KX.ref.needle=n;kCo(.045,.3,0xd02a2a,0,.15,0,null,n);kCo(.045,.3,0xf6f6f6,0,-.15,0,[kPI,0,0],n);kSp(.04,0xe8c050,0,0,.02,null,n)});

// ---- SAYAP: sepasang grup sendiri supaya bisa mengepak (sayapm, sayapcahaya, sayapk, sayapn) ----
const kxWg=(k,g,cols,mk,L,n)=>{for(let r=0;r<2;r++)for(let j=0;j<n;j++){const th=.25+j*.3,l=(L-j*.14)*(r?.55:1);kRB(r?.3:.34,l,.05,mk(cols[Math.min(j,cols.length-1)]),k*Math.sin(th)*l/2,Math.cos(th)*l/2,-.02-j*.015-r*.03,[0,0,-k*th],g)}},
kxW=fn=>{const w=[];both(k=>{const g=kxSide(k,k*.5,2.75,-.7);w.push(g);fn(k,g)});KX.wings=w};
kUp('sayapm',()=>{kxW((k,g)=>{kxWg(k,g,[0xffffff,0xf4f6fa,0xe8eef5,0xdde6f0,0xd0dcea],c=>c,1.9,5);kSp(.12,0xe8c050,0,0,.08,null,g)});kBx(1,.14,.1,0xe8c050,0,2.75,-.56)});
kUp('sayapcahaya',()=>{kxW((k,g)=>kxWg(k,g,[0xffffff,0xd8f6ff,0xb4ecff,0x8fe0ff,0x6ad0ff],c=>kGx(c,.85),2.1,5));kSp(.15,kGl(0xfff3a0),0,2.6,-.66);kTo(.45,.05,kGx(0xfff3a0,.9),0,3.5,-.8)});
kUp('sayapk',()=>{kxW((k,g)=>{kRB(1.62,1.42,.04,0x3a2470,k*.7,.55,-.04,[0,0,k*-.55],g);kRB(1.5,1.3,.06,0x9b6bd6,k*.7,.55,-.02,[0,0,k*-.55],g);kRB(1.1,1,.04,0x3a2470,k*.45,-.55,-.06,[0,0,k*.5],g);kRB(1,.9,.06,0xff8ac8,k*.45,-.55,-.04,[0,0,k*.5],g);kCy(.2,.2,.07,0xfff3a0,k*.85,.7,-.07,[kPI/2,0,0],g);kCy(.14,.14,.07,0xffffff,k*.45,-.55,-.07,[kPI/2,0,0],g)});kRB(.14,1.5,.14,0x3a2414,0,2.8,-.6)});
kUp('sayapn',()=>{kxW((k,g)=>{kBx(.1,1.7,.1,0x3a1414,k*.35,.5,-.02,[0,0,-k*.75],g);kRB(1.1,1,.04,0xd33a3a,k*.65,.25,-.04,[0,0,-k*.55],g);kRB(.9,.9,.04,0xb02a2a,k*.5,-.45,-.05,[0,0,k*.15],g);kRB(.7,.8,.04,0x8c2f3e,k*.2,-.95,-.06,[0,0,k*.35],g);kCo(.07,.3,0xe8d8b0,k*1.05,1.3,-.02,[0,0,-k*.75],g)});for(let i=0;i<4;i++)kCo(.12,.32,0x2f6f4f,0,3-i*.4,-.58,[-kPI/2,0,0])});

// ---- PAYUNG: kanopi bisa dibuka/ditutup ----
kUp('payung',()=>{const g=kxHD(0,0,0),can=new THREE.Group();can.position.set(0,1.55,0);g.add(can);KX.ref.payung={can};
 kCy(.04,.04,1.7,0x333333,0,.75,0,null,g);kCo(1,.62,0xee3333,0,.3,0,null,can);kTo(1,.025,0xffffff,0,0,0,[kPI/2,0,0],can);kSp(.07,0xe8c050,0,.64,0,null,can);
 for(let i=0;i<8;i++){const a=i*kPI/4;kBx(.03,.66,.03,0xdddddd,Math.cos(a)*.5,.3,Math.sin(a)*.5,[Math.sin(a)*.84,0,-Math.cos(a)*.84],can)}
 kTo(.12,.035,0x8a5a2b,.1,-.12,0,null,g);kBx(.05,.4,.05,0x8a5a2b,.2,-.04,0,null,g)});

// ---- BOLA: pentagon hitam di titik ikosahedron ----
kUp('bola',()=>{const g=kxHD(0,.35,.1);KX.ref.bola=g;kSp(.42,0xffffff,0,0,0,null,g);const f=(1+Math.sqrt(5))/2,V=[[0,1,f],[0,-1,f],[0,1,-f],[0,-1,-f],[1,f,0],[-1,f,0],[1,-f,0],[-1,-f,0],[f,0,1],[-f,0,1],[f,0,-1],[-f,0,-1]];
 V.forEach(v=>{const d=new THREE.Vector3(v[0],v[1],v[2]).normalize(),m=kCy(.15,.15,.05,0x1b1b1b,d.x*.41,d.y*.41,d.z*.41,null,g);m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),d);m.geometry=new THREE.CylinderGeometry(.15,.13,.05,5)})});

// ---- BALON: warna bisa berganti setelah diletuskan ----
kUp('balon',()=>{const g=kxHD(0,0,0),bm=new THREE.MeshPhongMaterial({color:0xee3333,shininess:80});KX.ref.balon={g,bm,t:0};
 for(let i=0;i<4;i++)kCy(.012,.012,.42,0xffffff,Math.sin(i*1.3)*.05,.2+i*.4,0,[0,0,Math.sin(i*1.3)*.08],g);
 k3(new THREE.SphereGeometry(.55,16,12),bm,0,2.1,0,null,g,[1,1.2,1]);kCo(.08,.14,bm,0,1.45,0,[kPI,0,0],g);kSp(.1,0xffffff,-.2,2.35,.4,[1,1.2,.5],g);kBx(.2,.05,.05,0xffcf3f,0,.05,0,null,g)});

// ---- HELM TAMBANG: lensa lampu bisa menyala ----
kUp('lampuhelm',()=>{kSp(.5,0xff8a3d,0,4.5,-.05,[1.5,.95,1.4]);kBx(1.3,.07,.55,0xff8a3d,0,4.4,.6);kBx(.15,.1,1.2,0xe05f10,0,4.97,0);kBx(1,.1,.06,0xdfe6ea,0,4.55,.75);both(k=>kBx(.12,.12,.12,0xe05f10,k*.72,4.5,0));
 kRB(.34,.3,.26,0x444444,0,4.8,.7);const lm=new THREE.MeshBasicMaterial({color:0x7a7a60});KX.ref.lens=lm;kCy(.14,.14,.06,lm,0,4.8,.86,[kPI/2,0,0]);kTo(.16,.02,0xe8c050,0,4.8,.87)});

// ---- Kilap logam & pernis untuk SEMUA aksesoris (emas, perak, kayu pernis) ----
const kxGS={0xffcf3f:90,0xe8c050:90,0xe8b020:90,0xffd23f:90,0xe8a820:80,0xfff3a0:70,0xcfd6de:110,0xdfe6ee:110,0xb8c2cc:100,0xc0c8d0:100,0xcfcfcf:100,0xaab6c2:90,0xdfe6ea:100,0x9aa6b2:90,0xc0302a:60,0xa8602a:45,0xc98a4a:50,0xd02a2a:50,0x2f6fd6:40},kxGM={};
const kxGleam=o=>{const m=o.material;if(!m||!m.isMeshLambertMaterial||m.transparent)return;const c=m.color.getHex(),s=kxGS[c];if(s)o.material=kxGM[c]||(kxGM[c]=new THREE.MeshPhongMaterial({color:c,shininess:s,specular:0x998866}))};
ACC.forEach(a=>{const f=a.f;a.f=function(){const seen=new Set();P.traverse(o=>seen.add(o));f.apply(this,arguments);P.traverse(o=>{if(o.isMesh&&!seen.has(o))kxGleam(o)})}});
{const H0=HERO;HERO=function(){KX.ref={};KX.fl=[];KX.noz=[];KX.wings=null;const r=H0.apply(this,arguments);try{if(KX.after)KX.after()}catch(e){console.warn('aksesoris',e)}return r}}
try{HERO()}catch(e){}
