// ================= AKSESORIS v50: tabel harga (ubah angka di sini saja) =================
// Item interaktif/baru dibuat lebih mahal dari aksesoris biasa. Tier mengikuti kTier: 50 Keren, 100 Langka, 200 Epik, 350+ Legenda.
(()=>{const HP={
 balon:75,payung:100,bola:100,        // interaktif sederhana
 rebana:150,seruling:200,kamera:250,kompas:200,lampuhelm:200,gitar:250,   // alat & gadget
 oud:400,bambu:450,sayapm:450,sayapk:450,hoverboard:500,                  // premium
 jetpack:600,sayapn:800,sayapcahaya:800,roketx:900};                      // legendaris
Object.keys(HP).forEach(id=>{const a=ACC.find(x=>x.id==id);if(a)a.p=HP[id]});
})();
