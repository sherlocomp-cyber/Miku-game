// ================= KENDARAAN =================
let RID=null,camD=14,WRAD=.9;
function mk(g,geo,c,x,y,z){const m=new THREE.Mesh(geo,new THREE.MeshLambertMaterial({color:c}));m.position.set(x,y,z);m.castShadow=true;g.add(m);return m}
function bikeMesh(){const g=new THREE.Group(),w=new THREE.TorusGeometry(.55,.09,8,20);
[1,-1].forEach(z=>{const r=mk(g,w,0x222222,0,.6,z*.95);r.rotation.y=Math.PI/2});
mk(g,new THREE.BoxGeometry(.14,.14,1.9),0xff4d6d,0,.95,0);mk(g,new THREE.BoxGeometry(.14,.7,.14),0xff4d6d,0,1.2,-.3);
mk(g,new THREE.BoxGeometry(.7,.1,.1),0x333333,0,1.6,.95);mk(g,new THREE.BoxGeometry(.3,.1,.5),0x333333,0,1.45,-.4);
mk(g,new THREE.BoxGeometry(.3,.3,.3),0xffd23f,0,1.0,.98);[1,-1].forEach(z=>{const hb=mk(g,new THREE.CylinderGeometry(.12,.12,.22,8),0xcfd3da,0,.6,z*.95);hb.rotation.z=Math.PI/2;[0,Math.PI/4,Math.PI/2,Math.PI*.75].forEach(a=>{const sp=mk(g,new THREE.BoxGeometry(.025,1.0,.025),0xdddddd,0,.6,z*.95);sp.rotation.x=a});mk(g,new THREE.BoxGeometry(.14,.06,.85),0xff4d6d,0,1.2,z*.95)});mk(g,new THREE.BoxGeometry(.06,.45,.06),0x777777,0,.75,-.2);mk(g,new THREE.BoxGeometry(.4,.06,.14),0x333333,0,.55,-.2);mk(g,new THREE.BoxGeometry(.15,.12,.12),0x111111,.38,1.6,.95);mk(g,new THREE.BoxGeometry(.15,.12,.12),0x111111,-.38,1.6,.95);mk(g,new THREE.SphereGeometry(.1,8,6),0xfff3a0,0,1.72,1.02);mk(g,new THREE.SphereGeometry(.09,8,6),0xcfd3da,.25,1.7,.95);mk(g,new THREE.BoxGeometry(.5,.28,.45),0xc58b4a,0,1.3,1.32);mk(g,new THREE.BoxGeometry(.52,.06,.47),0x8a5a2b,0,1.46,1.32);mk(g,new THREE.BoxGeometry(.14,.1,.04),0xff3b3b,0,1.05,-1.45);return g}
function carMesh(){const g=new THREE.Group();
mk(g,new THREE.BoxGeometry(2.2,.7,4.2),0x2a62ff,0,.9,0);mk(g,new THREE.BoxGeometry(1.9,.7,2.1),0x9fd8ff,0,1.55,-.2);
const wg=new THREE.CylinderGeometry(.45,.45,.3,14);
[[-1.1,1.3],[1.1,1.3],[-1.1,-1.3],[1.1,-1.3]].forEach(([x,z])=>{const w=mk(g,wg,0x1a1a1a,x,.45,z);w.rotation.z=Math.PI/2});
[-.7,.7].forEach(x=>{mk(g,new THREE.BoxGeometry(.4,.25,.1),0xfff3a0,x,.95,2.12);mk(g,new THREE.BoxGeometry(.4,.2,.1),0xff3b3b,x,.95,-2.12)});[-1,1].forEach(q=>{const hc=mk(g,new THREE.CylinderGeometry(.24,.24,.1,10),0xcfd3da,q*1.27,.45,1.3);hc.rotation.z=Math.PI/2;const h2=mk(g,new THREE.CylinderGeometry(.24,.24,.1,10),0xcfd3da,q*1.27,.45,-1.3);h2.rotation.z=Math.PI/2;mk(g,new THREE.BoxGeometry(.04,.6,.04),0x1b3fb0,q*1.11,.95,.2);mk(g,new THREE.BoxGeometry(.04,.6,.04),0x1b3fb0,q*1.11,.95,-.9);mk(g,new THREE.BoxGeometry(.22,.15,.3),0x2a62ff,q*1.2,1.4,.6)});mk(g,new THREE.BoxGeometry(2.3,.2,.2),0xcfd3da,0,.65,2.2);mk(g,new THREE.BoxGeometry(2.3,.2,.2),0x333333,0,.65,-2.2);mk(g,new THREE.BoxGeometry(.8,.25,.06),0x222222,0,.9,2.14);mk(g,new THREE.BoxGeometry(1.92,.72,.1),0x2a62ff,0,1.55,-.2);mk(g,new THREE.BoxGeometry(1.95,.08,2.15),0x4f84ff,0,1.94,-.2);mk(g,new THREE.BoxGeometry(1.9,.06,1.1),0x3a72ff,0,1.28,1.4);mk(g,new THREE.BoxGeometry(.6,.2,.04),0xffffff,0,.8,-2.14);return g}
const VEH=[{n:'Sepeda',ar:'دَرَّاجَةٌ',e:'🚲',m:bikeMesh(),mx:15,ac:9,x:6,z:26,hw:.9,hd:1.7,cd:16},
{n:'Mobil',ar:'سَيَّارَةٌ',e:'🚗',m:carMesh(),mx:27,ac:14,x:-7,z:26,hw:1.3,hd:2.3,cd:20}];
VEH.forEach(v=>{v.sp=0;v.m.position.set(v.x,0,v.z);v.m.rotation.y=Math.PI;S.add(v.m)});
function nearVeh(){let b=null,bd=5;VEH.forEach(v=>{const d=Math.hypot(v.m.position.x-pl.x,v.m.position.z-pl.z);if(d<bd){bd=d;b=v}});return b}
function vtoggle(){if(open||CV)return;
if(RID){const v=RID,y=pl.yaw;v.sp=0;pl.x=v.m.position.x+Math.cos(y)*2.8;pl.z=v.m.position.z-Math.sin(y)*2.8;RID=null;P.visible=true;WRAD=.9;ts('Kamu turun dari '+v.n+' '+v.e,1800);snd(300,.08,'sine');return}
const v=nearVeh();if(!v)return;RID=v;v.sp=0;P.visible=v.n=='Sepeda';pl.y=0;pl.vy=0;pl.yaw=v.m.rotation.y-Math.PI;WRAD=Math.max(v.hw,v.hd*.55)+.4;ts(v.e+' Naik '+v.n+'! W/S gas-rem, A/D belok, F turun',3200);snd(520,.1,'triangle')}
function rideStep(ix,iy,dt){const v=RID;
if(iy>.05)v.sp+=v.ac*iy*dt;else if(iy<-.05)v.sp+=(v.sp>0?-30:-v.ac*.6)*(-iy)*dt;else v.sp-=Math.sign(v.sp)*Math.min(Math.abs(v.sp),7*dt);
if(key.shift&&v.sp>0)v.sp=Math.max(0,v.sp-24*dt);
v.sp=Math.max(-v.mx*.3,Math.min(v.mx,v.sp));
const k=Math.min(1,Math.abs(v.sp)/6);pl.yaw-=ix*1.9*k*dt*(v.sp<0?-1:1);
pl.x+=-Math.sin(pl.yaw)*v.sp*dt;pl.z+=-Math.cos(pl.yaw)*v.sp*dt}
$('#vb').onclick=vtoggle;

