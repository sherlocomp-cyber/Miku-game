// ================= AKSESORIS v39: desain lebih detail, item baru, harga bertingkat =================
const kRB=(w,h,d,c,x,y,z,r,p)=>k3(RB(w,h,d),c,x,y,z,r,p),
kGl=c=>new THREE.MeshBasicMaterial({color:c}),
kGx=(c,o)=>new THREE.MeshBasicMaterial({color:c,transparent:true,opacity:o}),
kGs=(c,o)=>new THREE.MeshLambertMaterial({color:c,transparent:true,opacity:o}),
kUp=(id,f)=>{const a=ACC.find(x=>x.id==id);if(a)a.f=f},
kGrp=(x,y,z,rz)=>{const g=new THREE.Group();g.position.set(x,y,z);g.rotation.z=rz||0;P.add(g);return g},
kStar=(x,y,z,c,s,p)=>{kBx(s,s,.04,c,x,y,z,[0,0,kPI/4],p);kBx(s,s,.04,c,x,y,z,null,p)},
// sayap berlapis: baris bulu panjang + baris penutup pendek
kWg=(k,cols,mk,L,n)=>{for(let r=0;r<2;r++)for(let j=0;j<n;j++){const th=.25+j*.3,l=(L-j*.14)*(r?.55:1),cx=k*(.5+Math.sin(th)*l/2),cy=2.75+Math.cos(th)*l/2;kRB(r?.3:.34,l,.05,mk(cols[Math.min(j,cols.length-1)]),cx,cy,-.72-j*.015-r*.03,[0,0,-k*th])}};

// ---- TOPI: desain ulang ----
kUp('mahkota',()=>{kCy(.72,.72,.34,0xffcf3f,0,4.58,-.05);kCy(.75,.75,.07,0xe8a820,0,4.42,-.05);kCy(.75,.75,.07,0xe8a820,0,4.74,-.05);kSp(.6,0xb02a2a,0,4.8,-.05,[1,.5,1]);
 for(let i=0;i<8;i++){const a=i*kPI/4,x=Math.sin(a)*.64,z=-.05+Math.cos(a)*.64,u=i%2?0:.12;kCo(.15,.5+u,0xffcf3f,x,5+u/2,z);kSp(.07,0xfff3a0,x,5.27+u,z)}
 [[0,.68,0xd9294a],[.72,-.05,0x3d6fd6],[-.72,-.05,0x2fbf85],[0,-.78,0xd9294a]].forEach(([x,z,c])=>kSp(.1,c,x,4.58,z));kSp(.13,0xffcf3f,0,5.08,-.05)});
kUp('penyihir',()=>{kCy(1.15,1.15,.07,0x3a2470,0,4.45,0);kCy(1,1,.05,0x4b2e83,0,4.5,0);kCo(.72,1.1,0x4b2e83,0,5.1,0);kCo(.5,.9,0x4b2e83,.1,5.85,0,[0,0,-.15]);kCo(.28,.75,0x4b2e83,.3,6.5,0,[0,0,-.5]);kCy(.74,.74,.2,0x1f1040,0,4.65,0);kBx(.3,.26,.05,0xffcf3f,0,4.65,.76);kBx(.16,.14,.06,0x1f1040,0,4.65,.77);
 [[.1,5,.43],[-.2,5.4,.3],[.12,5.75,.24]].forEach(([x,y,z])=>kStar(x,y,z,kGl(0xfff3a0),.14))});
kUp('koboi',()=>{kCy(1.2,1.2,.08,0x8a5a2b,0,4.4,0);both(k=>kRB(.5,.1,1.5,0x8a5a2b,k,4.52,0,[0,0,k*-.45]));kRB(1.3,.1,.5,0x8a5a2b,0,4.44,.98,[.2,0,0]);kRB(1.3,.1,.5,0x8a5a2b,0,4.44,-.98,[-.2,0,0]);kCy(.6,.7,.7,0x9c6a34,0,4.8,0);kRB(.22,.2,.9,0x6f4620,0,5.17,0);kCy(.72,.72,.14,0x3a2414,0,4.52,0);
 [-.5,-.25,.25,.5].forEach(a=>kSp(.06,0xffe27a,Math.sin(a)*.72,4.52,Math.cos(a)*.72));kBx(.22,.22,.05,0xffcf3f,0,4.52,.74,[0,0,kPI/4]);kBx(.06,.6,.03,0xf6f6f6,.62,5.05,.2,[0,0,-.3]);kBx(.06,.3,.03,0xd02a2a,.72,5.38,.2,[0,0,-.3])});
kUp('headphone',()=>{kRB(1.3,.14,.2,0x2b2b36,0,4.84,0);both(k=>{kRB(.14,.55,.2,0x2b2b36,k*.76,4.55,0,[0,0,k*-.5]);kBx(.08,.5,.1,0xcfcfcf,k*.8,4.22,0);kRB(.34,.7,.72,0xd9594c,k*.8,3.74,-.02);kRB(.14,.58,.6,0x1b1b1b,k*.66,3.74,-.02);kRB(.06,.5,.5,0xff8a7a,k*.98,3.74,-.02);kSp(.08,0xffcf3f,k*1.02,3.74,-.02)});kBx(.05,.05,.7,0x2b2b36,-.9,3.4,.3);kSp(.09,0x1b1b1b,-.9,3.4,.68)});
kA('h','tarbus','Tarbus Merah','🔴',25,()=>{kCy(.52,.64,.62,0xc0302a,0,4.76,-.05);kCy(.52,.52,.04,0x9c2420,0,5.08,-.05);kCy(.65,.65,.08,0xffcf3f,0,4.48,-.05);kBx(.04,.55,.04,0xffcf3f,.4,4.9,-.05,[0,0,-.5]);kBx(.1,.32,.1,0x1b1b1b,.64,4.6,-.05)});
kA('h','ghutrah','Ghutra & Igal','🧣',50,()=>{kRB(1.66,.56,1.56,0xf6f6f6,0,4.52,-.02);[-.6,-.2,.2,.6].forEach(x=>kBx(.07,.02,1.58,0xd02a2a,x,4.81,-.02));kRB(1.6,1.3,.3,0xf6f6f6,0,3.95,-.72);both(k=>kRB(.22,1,1.2,0xf6f6f6,k*.78,3.95,-.05));kRB(1.62,.1,.2,0xd02a2a,0,4.22,.66);kTo(.82,.07,0x1b1b1b,0,4.64,-.02,[kPI/2,0,0]);kTo(.82,.07,0x1b1b1b,0,4.46,-.02,[kPI/2,0,0])});
kA('h','lampuhelm','Helm Tambang','⛏️',100,()=>{kSp(.5,0xff8a3d,0,4.5,-.05,[1.5,.95,1.4]);kBx(1.3,.07,.55,0xff8a3d,0,4.4,.6);kBx(.15,.1,1.2,0xe05f10,0,4.97,0);kBx(1,.1,.06,0xdfe6ea,0,4.55,.75);kCy(.2,.2,.22,0x444444,0,4.8,.7,[kPI/2,0,0]);kCy(.14,.14,.05,kGl(0xfff3a0),0,4.8,.83,[kPI/2,0,0]);both(k=>kBx(.12,.12,.12,0xe05f10,k*.72,4.5,0))});
kA('h','ksatria','Helm Ksatria','🛡️',100,()=>{kRB(1.55,.9,1.5,0xb8c2cc,0,4.62,-.02);kBx(.12,.9,.06,0x9aa6b2,0,3.95,.68);both(k=>{kBx(.14,.7,.8,0x9aa6b2,k*.72,3.7,.1);kSp(.06,0xffcf3f,k*.5,4.45,.77)});kRB(.18,.5,1.2,0xd02a2a,0,5.25,0);kRB(.18,.14,1.4,0xb02020,0,5.02,0);kBx(1.5,.08,.06,0xe8c050,0,4.2,.76)});
kA('h','firaun','Nemes Firaun','🏺',200,()=>{kRB(1.64,.75,1.56,0xffcf3f,0,4.5,-.02);kRB(1.66,.1,1.58,0x2f6fd6,0,4.86,-.02);[0,1,2].forEach(i=>kBx(1.66,.07,1.58,0x2f6fd6,0,4.3+i*.17,-.02));
 both(k=>{kRB(.4,1.45,.7,0xffcf3f,k*.8,3.55,.2);[0,1,2,3,4].forEach(j=>kBx(.42,.09,.72,0x2f6fd6,k*.8,2.95+j*.26,.2))});kRB(1.3,1.5,.4,0xffcf3f,0,3.65,-.82);[0,1,2,3,4].forEach(j=>kBx(1.32,.09,.42,0x2f6fd6,0,3+j*.28,-.82));kSp(.1,0x2fbf85,0,4.58,.82);kCo(.07,.3,0xffcf3f,0,4.82,.82)});
kA('h','astronot','Helm Astronot','🧑‍🚀',200,()=>{kSp(1.2,kGs(0xaee6ff,.32),0,3.85,0,[1,1.02,1]);kTo(.86,.14,0xeeeeee,0,3.12,0,[kPI/2,0,0]);kTo(.86,.05,0xd9594c,0,3,0,[kPI/2,0,0]);both(k=>{kRB(.2,.42,.34,0xe8e8e8,k*.98,3.6,0);kSp(.07,kGl(0xff5a4a),k*.98,3.9,.14)});kCy(.03,.03,.5,0xcfcfcf,.98,4.15,0);kSp(.07,0xd9594c,.98,4.42,0)});

// ---- WAJAH ----
kUp('kacahitam',()=>{both(k=>{kRB(.56,.42,.05,0x1b1b1b,k*.3,3.78,.72);kRB(.5,.36,.06,0x14182a,k*.3,3.78,.75);kBx(.14,.04,.07,0x6a7a9a,k*.4,3.9,.79,[0,0,.5]);kBx(.05,.07,.8,0x1b1b1b,k*.67,3.86,.35)});kBx(.16,.07,.06,0x1b1b1b,0,3.86,.74)});
kA('f','kacaaviator','Kacamata Aviator','😎',50,()=>{const g=0xe8c050;both(k=>{kRB(.46,.36,.06,kGs(0x7a5a2a,.6),k*.3,3.78,.75);kBx(.5,.04,.05,g,k*.3,3.98,.75);kBx(.5,.04,.05,g,k*.3,3.58,.75);kBx(.04,.4,.05,g,k*.54,3.78,.75);kBx(.04,.4,.05,g,k*.06,3.78,.75);kBx(.04,.04,.74,g,k*.66,3.88,.38)});kBx(.14,.04,.05,g,0,3.92,.75)});
kA('f','kacalab','Kacamata Lab','🥽',50,()=>{kBx(1.4,.16,1.3,0x2b3550,0,3.85,0);kRB(1.16,.46,.2,0x2fa36b,0,3.82,.68);both(k=>{kRB(.46,.3,.08,kGs(0xcfeeff,.55),k*.3,3.82,.79);kSp(.04,0x1b1b1b,k*.62,3.98,.8)})});
kA('f','stiker','Stiker Bintang','⭐',25,()=>{kStar(.4,3.58,.64,0xffcf3f,.14);kStar(-.4,3.58,.64,0xff6b9a,.1)});
kA('f','visor','Visor Robot','🤖',100,()=>{kRB(1.5,.34,.26,0x1b2230,0,3.82,.64);kBx(1.3,.12,.06,kGl(0x39e6ff),0,3.82,.8);both(k=>{kBx(.12,.3,.3,0x2b3550,k*.76,3.82,.45);kBx(.04,.18,.07,0xffffff,k*.35,3.82,.82)})});

// ---- LEHER & DADA ----
kUp('medali',()=>{both(k=>kBx(.2,.85,.04,k>0?0xee3333:0x3d6fd6,k*.17,2.98,.47,[0,0,k*-.22]));kCy(.26,.26,.07,0xffcf3f,0,2.45,.5,[kPI/2,0,0]);kTo(.26,.03,0xe8b020,0,2.45,.54);kCy(.18,.18,.08,0xffe27a,0,2.45,.52,[kPI/2,0,0]);kStar(0,2.45,.57,0xe8a820,.14)});
kA('n','mutiara','Kalung Mutiara','🦪',50,()=>{for(let i=-4;i<=4;i++){const a=i/4;kSp(.075,0xf4f0ff,a*.62,2.78+a*a*.38,.52)}kSp(.11,0xd9594c,0,2.62,.54)});
kA('n','selempang','Selempang Juara','🎗️',100,()=>{kBx(.38,2.1,.1,0x2f9e6b,0,2.3,.5,[0,0,.6]);kBx(.06,2.1,.11,0xffcf3f,.1,2.3,.51,[0,0,.6]);kBx(.06,2.1,.11,0xffcf3f,-.1,2.3,.51,[0,0,.6]);kStar(-.52,2.8,.58,0xffcf3f,.2)});
kA('n','kristal','Kalung Kristal','💠',100,()=>{both(k=>kBx(.04,.7,.03,0xe8c050,k*.3,2.95,.5,[0,0,k*-.4]));kCo(.2,.4,kGl(0x5ee0ff),0,2.55,.54,[kPI,0,0]);kCo(.2,.25,kGl(0x9af0ff),0,2.82,.54)});
kA('n','bintangkehormatan','Bintang Kehormatan','🎖️',200,()=>{both(k=>{kBx(.3,.7,.04,0xd02a2a,k*.16,2.95,.5,[0,0,k*-.22]);kBx(.06,.7,.045,0xffffff,k*.16,2.95,.51,[0,0,k*-.22])});kCy(.3,.3,.06,0xffcf3f,0,2.35,.52,[kPI/2,0,0]);for(let i=0;i<5;i++){const a=i*kPI*2/5;kCo(.1,.22,0xffcf3f,Math.sin(a)*.36,2.35+Math.cos(a)*.36,.52,[0,0,-a])}kSp(.1,0xd02a2a,0,2.35,.58)});

// ---- PUNGGUNG ----
kUp('sayapm',()=>{both(k=>{kWg(k,[0xffffff,0xf4f6fa,0xe8eef5,0xdde6f0,0xd0dcea],c=>c,1.9,5);kSp(.12,0xe8c050,k*.5,2.75,-.62)});kBx(1,.14,.1,0xe8c050,0,2.75,-.56)});
kA('k','sayapcahaya','Sayap Cahaya','✨',350,()=>{both(k=>kWg(k,[0xffffff,0xd8f6ff,0xb4ecff,0x8fe0ff,0x6ad0ff],c=>kGx(c,.85),2.1,5));kSp(.15,kGl(0xfff3a0),0,2.6,-.66);kTo(.45,.05,kGx(0xfff3a0,.9),0,3.5,-.8)});
kUp('sayapk',()=>{both(k=>{kRB(1.62,1.42,.04,0x3a2470,k*1.2,3.3,-.74,[0,0,k*-.55]);kRB(1.5,1.3,.06,0x9b6bd6,k*1.2,3.3,-.72,[0,0,k*-.55]);kRB(1.1,1,.04,0x3a2470,k*.95,2.2,-.76,[0,0,k*.5]);kRB(1,.9,.06,0xff8ac8,k*.95,2.2,-.74,[0,0,k*.5]);kCy(.2,.2,.07,0xfff3a0,k*1.35,3.45,-.77,[kPI/2,0,0]);kCy(.14,.14,.07,0xffffff,k*.95,2.2,-.77,[kPI/2,0,0])});kRB(.14,1.5,.14,0x3a2414,0,2.8,-.6)});
kUp('sayapn',()=>{both(k=>{kBx(.1,1.7,.1,0x3a1414,k*.85,3.25,-.68,[0,0,-k*.75]);kRB(1.1,1,.04,0xd33a3a,k*1.15,3,-.74,[0,0,-k*.55]);kRB(.9,.9,.04,0xb02a2a,k,2.3,-.75,[0,0,k*.15]);kRB(.7,.8,.04,0x8c2f3e,k*.7,1.8,-.76,[0,0,k*.35]);kCo(.07,.3,0xe8d8b0,k*1.55,4.05,-.68,[0,0,-k*.75])});for(let i=0;i<4;i++)kCo(.12,.32,0x2f6f4f,0,3-i*.4,-.58,[-kPI/2,0,0])});
kUp('jubah',()=>{kRB(1.7,.5,.14,0xd02a2a,0,3,-.58,[.05,0,0]);kRB(1.95,2.2,.12,0xd02a2a,0,1.95,-.62,[.1,0,0]);kRB(1.85,2.1,.05,0x8a1414,0,1.95,-.53,[.1,0,0]);kRB(2,.12,.14,0xffcf3f,0,.84,-.66,[.1,0,0]);kRB(1.5,.22,.5,0xd02a2a,0,3.2,.1);both(k=>{kBx(.05,2,.03,0xa01818,k*.5,1.95,-.69,[.1,0,0]);kCy(.14,.14,.06,0xffcf3f,k*.55,3.12,.5,[kPI/2,0,0])});kBx(1,.05,.04,0xffcf3f,0,3.08,.52);kBx(.5,.5,.04,0xffcf3f,0,2.2,-.7,[.1,0,kPI/4]);kBx(.3,.3,.05,0xd02a2a,0,2.2,-.71,[.1,0,kPI/4])});
kA('k','jubahroyal','Jubah Raja','👑',350,()=>{kRB(2.05,2.8,.14,0x5b2a86,0,1.95,-.6,[.08,0,0]);kRB(1.95,2.7,.05,0xd02a2a,0,1.95,-.52,[.08,0,0]);kRB(2.1,.28,.16,0xf6f6f6,0,.62,-.62,[.08,0,0]);[-.7,-.2,.3,.8].forEach(x=>kBx(.1,.14,.17,0x1b1b1b,x,.62,-.63,[.08,0,0]));both(k=>kRB(.55,.3,.5,0xf6f6f6,k*.45,3.2,.3));kRB(1.4,.28,.3,0xf6f6f6,0,3.22,-.3);kSp(.12,0xffcf3f,0,3.08,.55);kBx(.7,.05,.05,0xffcf3f,0,3.05,.52)});
kUp('jetpack',()=>{kRB(1.2,1.3,.25,0x3d4756,0,2.4,-.6);both(k=>{kCy(.3,.3,1.5,0xcfd6de,k*.38,2.4,-.8);kSp(.3,0xcfd6de,k*.38,3.15,-.8,[1,.6,1]);kCy(.32,.32,.12,0xd9594c,k*.38,2.7,-.8);kCy(.22,.14,.3,0x555e68,k*.38,1.55,-.8);kCo(.17,.7,kGl(0xff9a2f),k*.38,1,-.8,[kPI,0,0]);kCo(.1,.45,kGl(0xfff3a0),k*.38,1.2,-.8,[kPI,0,0]);kBx(.1,.16,.1,0xffcf3f,k*.38,3.4,-.8);kBx(.12,1.6,.04,0x2b2b36,k*.55,2.4,.47)})});
kUp('gitar',()=>{const g=kGrp(.1,2.2,-.74,.5);kSp(.42,0xc0302a,0,-.15,0,[1,1.1,.32],g);kSp(.55,0xc0302a,0,-.85,0,[1,1.05,.32],g);kCy(.16,.16,.06,0x1b1b1b,0,-.6,.2,[kPI/2,0,0],g);kBx(.5,.3,.05,0xf6f6f6,.1,-.9,.2,null,g);kBx(.5,.06,.07,0x3a2414,0,-1.25,.2,null,g);kBx(.16,1.5,.1,0x3a2414,0,.9,0,null,g);kBx(.24,.4,.1,0x1b1b1b,0,1.8,0,null,g);both(k=>kSp(.05,0xe8c050,k*.1,1.8,.08,null,g));kBx(.025,2.6,.02,0xf6f6f6,0,.2,.09,null,g)});
kA('k','oud','Oud (Gambus)','🪕',200,()=>{const g=kGrp(.1,2.3,-.74,.55);kSp(.62,0xa8602a,0,-.55,0,[1,1.2,.5],g);kCy(.16,.16,.06,0x1b1b1b,0,-.45,.28,[kPI/2,0,0],g);kTo(.2,.03,0xe8c050,0,-.45,.29,null,g);kBx(.2,1.3,.12,0x3a2414,0,.75,0,null,g);kBx(.26,.4,.12,0x3a2414,0,1.55,-.04,null,g);both(k=>kBx(.1,.06,.1,0xe8c050,k*.17,1.5,0,null,g));kBx(.025,1.9,.02,0xf6f6f6,0,.3,.07,null,g)});
kA('k','perisai','Perisai Punggung','🛡️',100,()=>{kCy(.85,.85,.12,0xc0302a,0,2.3,-.62,[kPI/2,0,0]);kCy(.6,.6,.04,0xf6f6f6,0,2.3,-.69,[kPI/2,0,0]);kTo(.85,.07,0xe8c050,0,2.3,-.68);kSp(.22,0xffcf3f,0,2.3,-.74,[1,1,.6]);kBx(1.4,.1,.04,0xf6e8b0,0,2.3,-.73);kBx(.1,1.4,.04,0xf6e8b0,0,2.3,-.73)});

// ---- TANGAN (HD) ----
kUp('bendera',()=>{kCy(.045,.045,2.4,0xcfcfcf,0,1.05,0,null,HD);kSp(.09,0xffcf3f,0,2.3,0,null,HD);[0,1,2].forEach(i=>{const z=Math.sin(i*1.6)*.08,x=.2+i*.3;kBx(.3,.3,.04,0xe02020,x,2.1,z,null,HD);kBx(.3,.3,.04,0xffffff,x,1.8,z,null,HD)})});
kUp('tongkat',()=>{kCy(.05,.06,1.4,0x5a3a22,0,.5,0,null,HD);for(let i=0;i<4;i++)kTo(.07,.02,0xffcf3f,0,.1+i*.3,0,[kPI/2,0,0],HD);kCo(.16,.36,kGl(0xfff3a0),0,1.56,0,null,HD);kCo(.16,.36,kGl(0xfff3a0),0,1.2,0,[kPI,0,0],HD);[[.3,1.5],[-.3,1.35],[.25,1]].forEach(([x,y])=>kBx(.08,.08,.04,kGl(0xfff3a0),x,y,0,[0,0,kPI/4],HD))});
kA('w','pedang','Pedang Ksatria','⚔️',100,()=>{kCy(.06,.06,.5,0x5a3a22,0,.05,0,null,HD);kBx(.7,.12,.14,0xffcf3f,0,.35,0,null,HD);kBx(.2,1.8,.06,0xdfe6ee,0,1.3,0,null,HD);kBx(.05,1.5,.07,0xaab6c2,0,1.25,0,null,HD);kBx(.14,.14,.06,0xdfe6ee,0,2.25,0,[0,0,kPI/4],HD);kSp(.1,0xffcf3f,0,-.25,0,null,HD)});
kA('w','teleskop','Teleskop','🔭',50,()=>{kCy(.2,.2,.7,0x2f4f8f,0,.1,.5,[kPI/2,0,0],HD);kCy(.15,.15,.6,0xe8c050,0,.1,1.15,[kPI/2,0,0],HD);kCy(.12,.12,.5,0xc0c8d0,0,.1,1.7,[kPI/2,0,0],HD);kCy(.15,.15,.05,kGs(0x9fe0ff,.7),0,.1,1.97,[kPI/2,0,0],HD);kTo(.2,.03,0x1b1b1b,0,.1,.2,null,HD);kTo(.2,.03,0x1b1b1b,0,.1,.82,null,HD)});
kA('w','tasbih','Tasbih','📿',25,()=>{for(let i=0;i<18;i++){const t=i*kPI*2/18;kSp(i%6?.06:.09,i%6?0x2fb5b0:0xffcf3f,Math.sin(t)*.22,-.45-Math.cos(t)*.45,0,null,HD)}kBx(.08,.3,.08,0xe8c050,0,-1.1,0,null,HD)});
kA('w','trofi','Piala Juara','🏆',200,()=>{kRB(.5,.14,.5,0x3a2414,0,.1,0,null,HD);kCy(.07,.07,.35,0xffcf3f,0,.35,0,null,HD);kCy(.38,.2,.5,0xffcf3f,0,.8,0,null,HD);kTo(.38,.04,0xfff3a0,0,1.05,0,[kPI/2,0,0],HD);both(k=>kTo(.18,.04,0xffcf3f,k*.42,.85,0,null,HD));kStar(0,.82,.33,0xd02a2a,.14,HD);kBx(.05,.3,.04,0xfff8c8,-.18,.8,.3,null,HD)});
kA('w','bola','Bola Sepak','⚽',25,()=>{kSp(.42,0xffffff,0,.35,.1,null,HD);kBx(.2,.2,.04,0x1b1b1b,0,.38,.52,[0,0,kPI/4],HD);[[.3,.6,.22],[-.3,.6,.22],[.36,.1,.22],[-.36,.1,.22],[0,.72,-.1]].forEach(([x,y,z])=>kSp(.11,0x1b1b1b,x,y,z,[1,1,.5],HD))});
kA('w','palu','Palu Insinyur','🔨',50,()=>{kCy(.07,.07,1.2,0x8a5a2b,0,.4,0,null,HD);kRB(.8,.3,.3,0x7b8a99,0,1.1,0,null,HD);kRB(.16,.36,.34,0x4a5560,.36,1.1,0,null,HD);kBx(.32,.2,.22,0x4a5560,-.52,1.1,0,[0,0,.4],HD);kBx(.16,.08,.16,0xffcf3f,0,.1,0,null,HD);kBx(.16,.08,.16,0xffcf3f,0,.3,0,null,HD)});

// ---- HARGA BERTINGKAT (satu tabel; ubah angka di sini bila perlu) ----
const HG={25:'ultah caping natal beanie hjhijau hjbiru hjungu kacahitam kacahati kaca3d kumis badut masker dasi lei idcard lonceng balon payung eskrim lolipop pensil tarbus stiker tasbih bola',
50:'imamah koboi helm koki kucing kelinci pilot polisi dokter beret antena jamur ghutrah monokel jenggot eyepatch renang medali steto pelangi bintangk mutiara ekor skate bendera mic lentera globe kacaaviator kacalab teleskop palu',
100:'penyihir toga bintang lampuhelm ksatria topeng headphone kalung selempang kristal jubah gitar perisai tongkat visor pedang',
200:'halo tiara firaun astronot bintangkehormatan sayapm sayapk jetpack oud trofi',
350:'mahkota sayapn sayapcahaya jubahroyal'};
Object.entries(HG).forEach(([p,s])=>s.split(' ').forEach(id=>{const a=ACC.find(x=>x.id==id);if(a)a.p=+p}));
const kTN=['Dasar','Biasa','Keren','Langka','Epik','Legenda'],kTier=a=>a.p>=350?5:a.p>=200?4:a.p>=100?3:a.p>=50?2:a.p>0?1:0;

// ---- RAKIT KARAKTER ----
