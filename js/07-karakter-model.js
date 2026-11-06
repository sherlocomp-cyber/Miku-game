// ================= KARAKTER v2: model rapi & detail (dipakai hero + NPC) =================
function RB(w,h,d){const k=w+','+h+','+d;const RBC=RB.c||(RB.c={});if(RBC[k])return RBC[k];const r=Math.min(.14,Math.min(w,h,d)*.32),g=new THREE.BoxGeometry(w,h,d,2,2,2),p=g.attributes.position,v=new THREE.Vector3(),c=new THREE.Vector3(),iw=w/2-r,ih=h/2-r,id=d/2-r;for(let i=0;i<p.count;i++){v.fromBufferAttribute(p,i);c.set(Math.max(-iw,Math.min(iw,v.x)),Math.max(-ih,Math.min(ih,v.y)),Math.max(-id,Math.min(id,v.z)));v.sub(c);if(v.lengthSq()>1e-9)v.normalize().multiplyScalar(r);v.add(c);p.setXYZ(i,v.x,v.y,v.z)}g.computeVertexNormals();return RBC[k]=g}
function KIT(g){const SH=KIT.s||(KIT.s=new THREE.MeshBasicMaterial({color:0,transparent:true,opacity:.17,depthWrite:false})),HL=KIT.h||(KIT.h=new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.24,depthWrite:false}));
 const dk=(c,t)=>new THREE.Color(c).lerp(new THREE.Color(0),t).getHex();
 const M=(G,c,x,y,z,r,p,s)=>{const m=new THREE.Mesh(G,typeof c=='number'?mat(c):c);m.position.set(x,y,z);if(r)m.rotation.set(r[0]||0,r[1]||0,r[2]||0);if(s)m.scale.set(s[0],s[1],s[2]);m.castShadow=c!==SH&&c!==HL;(p||g).add(m);return m};
 const B=(w,h,d,c,x,y,z,r,p)=>M(RB(w,h,d),c,x,y,z,r,p),
 Co=(q,h,c,x,y,z,r)=>M(new THREE.ConeGeometry(q,h,4),c,x,y,z,r),
 TX=(t,col,w,h,x,y,z,ry)=>{const c=document.createElement('canvas');c.width=c.height=64;const q=c.getContext('2d');q.font='bold 54px sans-serif';q.textAlign='center';q.textBaseline='middle';q.fillStyle=col;q.fillText(t,32,36);const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(c),transparent:true}));m.position.set(x,y,z);m.rotation.y=ry||0;g.add(m);return m},
 both=fn=>[-1,1].forEach(fn);
 return{SH,HL,dk,M,B,Co,TX,both}}
function CH(g,o){const K=KIT(g),{B,Co,both,dk,SH,HL}=K;
 const f=o.f,sk=o.sk,hc=o.hc,ec=o.ec,pc=o.pc,sc=o.sc,hs=o.hs,mo=o.om||(()=>mat(o.top??o.oc)),S=o.sl=='s'?.62:1;
 // kaki: celana / celana pendek + kaos kaki, sepatu
 both(k=>{const l=new THREE.Group();l.position.set(k*.42,1.45,0);g.add(l);
  if(o.sh){B(.58,.74,.58,o.sh,0,-.37,0,null,l);B(.5,.34,.5,sk,0,-.91,0,null,l);B(.56,.5,.56,o.sock||0xf5f5f5,0,-1.15,0,null,l);B(.58,.07,.58,0xffffff,0,-.98,0,null,l)}
  else{B(.56,1.4,.56,pc,0,-.7,0,null,l);B(.04,1.15,.02,SH,0,-.62,.285,null,l);B(.6,.14,.6,SH,0,-1.31,0,null,l)}
  B(.64,.3,.95,sc,0,-1.3,.18,null,l);B(.66,.1,.97,0xf3f3f3,0,-1.5,.18,null,l);B(.5,.05,.28,HL,0,-1.14,.5,null,l);
  const a=new THREE.Group();a.position.set(k*1.1,3,0);g.add(a);
  B(.5,1.4*S,.5,mo(),0,-.7*S,0,null,a);B(.52,.06,.52,SH,0,-.1,0,null,a);
  if(S<1){B(.44,1.4*(1-S),.44,sk,0,-1.4*S-.7*(1-S),0,null,a);B(.54,.1,.54,SH,0,-1.4*S+.05,0,null,a)}else B(.54,.12,.54,o.cuff??0xf3f3f3,0,-1.3,0,null,a);
  B(.4,.4,.4,sk,0,-1.52,.02,null,a);B(.1,.16,.12,sk,-k*.22,-1.48,.1,null,a);[-1.62,-1.7].forEach(y=>B(.3,.03,.03,dk(sk,.25),0,y,.225,null,a));
  if(k<0){g.legL=l;g.armL=a}else{g.legR=l;g.armR=a;g.HD=new THREE.Group();g.HD.position.set(0,-1.45,.15);a.add(g.HD)}});
 // badan: torso, detail kemeja, rok/ikat pinggang
 B(1.7,1.7,.92,mo(),0,2.3,0);
 if(o.col)both(k=>B(.34,.12,.05,o.col,k*.22,3.04,.475,[0,0,-k*.7]));
 B(.96,.13,.64,o.col??SH,0,3.14,.03);
 if(o.btn){B(.07,1.45,.02,SH,0,2.4,.47);for(let q=0;q<4;q++)B(.1,.1,.03,0xefefef,0,2.9-q*.34,.48)}
 if(o.pk){const xs=o.pk==2?[-.42,.42]:[-.42];xs.forEach(x=>{B(.4,.36,.02,SH,x,2.62,.47);B(.4,.07,.03,HL,x,2.8,.475)})}
 const tr=!f||o.tr,by=tr?1.6:2.28;
 if(!tr){const sc2=o.skc!=null?mat(o.skc):null,ln=o.ln||1,h=.55*ln,yc=1.825-h/2;
  B(1.55,.5,.96,sc2||mo(),0,2,0);B(1.95,h,1.16,sc2||mo(),0,yc,0);B(1.97,.1,1.18,SH,0,yc-h/2+.05,0);
  if(ln<2)[-.6,-.2,.2,.6].forEach(x=>B(.03,h-.1,.02,SH,x,yc,.585))}
 if(o.belt!==false){B(tr?1.72:1.58,.15,.97,o.bc??0x3b2a20,0,by,0);B(.22,.15,.05,0xe8c050,0,by,.5)}else if(tr)B(1.72,.16,.94,SH,0,1.56,0);
 B(.4,.32,.4,dk(sk,.08),0,3.28,0);
 // kepala kotak + wajah simpel
 B(1.3,1.4,1.2,sk,0,3.75,0);both(k=>B(.1,.3,.2,sk,k*.67,3.72,0));B(.12,.18,.12,dk(sk,.08),0,3.6,.64);
 both(k=>{const x=k*.28;B(.34,.3,.06,0xffffff,x,3.8,.62);B(.15,.22,.06,ec,x+k*.02,3.79,.655);B(.05,.05,.06,0xffffff,x+k*.05,3.85,.69);
  B(.42,.1,.08,dk(hc,.2),x,4.06,.63,[0,0,k*.1]);if(f){B(.38,.05,.06,0x111111,x,3.97,.64);B(.2,.1,.04,0xff9aa0,k*.46,3.5,.61)}});
 B(f?.26:.3,f?.08:.05,.05,f?0xd04a5a:0x8a2f3a,0,3.38,.62);
 // hijab (NPC) atau rambut balok
 if(o.hjc!=null){const h=o.hjc,c2=dk(h,.12);B(1.5,.6,1.45,h,0,4.5,-.02);B(1.5,1.6,.3,h,0,3.6,-.68);both(k=>B(.2,1.25,1.3,h,k*.76,3.82,.02));B(1.3,.22,.2,h,0,4.33,.66);B(1.5,.45,.3,h,0,3.0,.56);
  B(1.8,.9,1.0,h,0,2.85,.02);both(k=>B(.03,.8,.02,SH,k*.4,2.85,.525));if(o.hjl){B(1.9,1.3,1.02,h,0,2.5,.02);B(.04,1.2,.02,SH,0,2.5,.54)}B(.14,.14,.05,0xe8c050,.5,3.05,.6)}
 else if(!o.hj&&hs!=4){const fr=()=>B(1.42,.26,.3,hc,0,4.2,.52);
  B(1.42,.5,1.36,hc,0,4.38,-.02);B(1.42,1,.22,hc,0,3.95,-.62);both(k=>B(.2,.9,1.1,hc,k*.7,3.98,-.05));
  switch(hs){case 0:fr();break;case 1:fr();B(.8,.5,.9,hc,0,4.85,.3);break;
  case 2:[-.45,-.22,0,.22,.45].forEach((x,i)=>Co(.2,.6,hc,x,4.8+(i%2?0:.1),.05,[0,Math.PI/4,-x*.8]));break;
  case 3:B(1.1,.24,.3,hc,-.15,4.2,.52,[0,0,.1]);break;
  case 5:B(1.5,2.3,.5,hc,0,3,-.55);both(k=>B(.25,1.9,.55,hc,k*.72,3.2,-.05));fr();break;
  case 6:both(k=>{B(.4,.4,.4,hc,k*.95,3.9,-.1);B(.3,1.2,.3,hc,k*1,3,-.1);B(.18,.18,.18,0xff6b9a,k*.85,4.15,-.1)});fr();break;
  case 7:B(1.55,1.1,1.35,hc,0,3.55,-.2);fr();break;
  case 8:B(.6,.6,.6,hc,0,4.95,-.2);B(.7,.14,.7,0xff6b9a,0,4.65,-.2);fr();break;
  case 9:[3.05,2.5,1.95].forEach((y,i)=>B(.5-i*.06,.5,.4,hc,0,y,-.8));B(.2,.2,.2,0xff6b9a,0,1.65,-.8);fr();break}}
 // detail tambahan: senyum, kilau mata, pipi, bayangan, tali sepatu, kilau rambut
 {const mc=f?0xd04a5a:0x8a2f3a;both(k=>{B(.07,.07,.05,mc,k*.17,3.41,.625,[0,0,k*.5]);B(.04,.04,.06,0xffffff,k*.24,3.73,.69);B(.05,.1,.04,dk(hc,.25),k*.28,4.0,.645)});
  if(!f){const bl=new THREE.Color(sk).lerp(new THREE.Color(0xff8a8a),.35).getHex();both(k=>B(.16,.08,.04,bl,k*.46,3.5,.61))}
  both(k=>{B(.04,.16,.1,dk(sk,.14),k*.725,3.72,0);B(.04,1.4,.94,SH,k*.855,2.3,0)});
  B(.9,.08,.02,HL,0,3.0,.475);
  const lh=new THREE.Color(hc).lerp(new THREE.Color(0xffffff),.22).getHex(),lp=new THREE.Color(mc).lerp(new THREE.Color(0xffffff),.28).getHex();
  both(k=>{B(.07,.12,.03,0x111111,k*.3,3.79,.69);B(.03,.06,.03,dk(ec,.35),k*.3,3.74,.7);B(.04,.04,.04,dk(sk,.3),k*.07,3.57,.7);B(.3,.03,.02,SH,k*.4,2.15,.47)});
  if(f){both(k=>{B(.06,.1,.04,0x111111,k*.44,3.94,.64,[0,0,-k*.5]);B(.08,.12,.08,0xe8c050,k*.71,3.55,.05)});B(.22,.04,.05,lp,0,3.44,.625)}
  else both(k=>B(.32,.04,.05,dk(sk,.18),k*.28,3.97,.64));
  if(o.hjc==null&&!o.hj&&hs!=4)[-.42,0,.42].forEach(x=>B(.06,.03,1.1,lh,x,4.65,-.02));
  [g.legL,g.legR].forEach(l=>{B(.34,.04,.04,0xf3f3f3,0,-1.18,.45,null,l);B(.34,.04,.04,0xf3f3f3,0,-1.25,.38,null,l);B(.5,.14,.12,SH,0,-1.43,.62,null,l)});
  if(o.hjc==null&&!o.hj&&hs!=4)B(.8,.05,.5,HL,-.2,4.64,.2)}
}
function HERO(){
 const h=G.hero,f=h.g=='f',sk=SKN[h.sk]??SKN[1],hc=HRC[h.hc]??HRC[1],ec=EYC[h.ey]??EYC[0],oc=(OUT[G.cur]||OUT[0]).c,w=h.a||{};
 [...P.children].forEach(c=>P.remove(c));PM.length=0;
  if(h.pf!=null&&PFG[h.pf]){const ix=pfIdx(PFG[h.pf],h.g);person(D[ix].c,ix,sk,{f,hc,ec,hs:h.hs},P);HD=P.HD;return}
 const om=()=>{const m=new THREE.MeshLambertMaterial({color:oc});PM.push(m);return m};
 CH(P,{f,sk,hc,ec,pc:PCC[h.pc]??PCC[0],sc:SCC[h.sc]??SCC[0],hs:h.hs,hj:String(w.h).startsWith('hj'),om,col:0xf6f6f6,btn:1,pk:f?0:1});HD=P.HD;
 ACC.forEach(a=>{if(w[a.s]===a.id)a.f()})}
