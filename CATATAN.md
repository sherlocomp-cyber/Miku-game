# CATATAN PROYEK: Kota Profesi (Miku-game)

Repo: sherlocomp-cyber/Miku-game · dipublish lewat GitHub Pages · struktur: index.html, css/, js/01-23.

## Tugas 2026-11-07: rapikan HUD "terlalu rame" (SELESAI, belum diuji di HP)
- [x] css/ringkas.css : HUD ringkas untuk layar sentuh / lebar <= 900px
- [x] js/23-ringkas-hud.js : tombol ☰ Menu (🔁 🃏 🎓 🎨 🔊 ⛶ masuk menu), kartu misi hanya 2 baris
- [x] index.html : memasang keduanya (?v=44)
- [x] CATATAN.md

Efek: chip arah ganda di kiri atas (#cp) disembunyikan; kartu panduan (#gc) jadi 1 baris di dasar layar antara joystick dan tombol Bicara; tombol Bicara dan peta lebih kecil.
Untuk membatalkan: hapus <link> css/ringkas.css dan <script> js/23 di index.html.

## Berikutnya (tunggu hasil uji pengguna)
- Cek di HP: apakah tombol ☰ terbuka, kartu panduan tidak menimpa tombol Bicara, teks Arab di tombol Bicara masih terbaca.
- Kalau masih ramai: sembunyikan juga penunjuk tepi layar (#gp) saat jarak < 15 m, atau gabungkan kartu misi ke tombol 📋.
