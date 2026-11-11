# CATATAN PROYEK: Kota Profesi (Miku-game)

Repo: sherlocomp-cyber/Miku-game · dipublish lewat GitHub Pages · struktur: index.html, css/, js/01-29.

## Tugas 2026-11-11: pesan guru ke semua siswa aktif (LANGKAH 1 SELESAI, belum diuji dengan siswa)
- [x] js/29-pesan-guru.js : game memeriksa /pesanGuru tiap 7 detik, menampilkan kartu "Pesan dari Guru" (semua / per kelas), menunggu bila sedang Ujian Akhir
- [x] index.html : memasang js/29 (?v=52)
- [x] Dasbor guru (ruang-guru-miku.html, file terpisah, bukan di repo): kartu "Pesan ke siswa aktif" di tab Online, kirim ke semua atau satu kelas
- [ ] Pengguna perlu memasang aturan Firebase: "pesanGuru": {".read": true, ".write": "auth != null && auth.uid == 'UID_GURU'"}
Untuk membatalkan: hapus <script> js/29 di index.html.

## Berikutnya
- Langkah 2: Mode Guru di game (karakter/akun khusus guru, semua fitur terbuka, tidak tercatat sebagai siswa di /siswa dan tidak mengotori statistik kelas, kirim pesan dari dalam game). Perlu dipastikan dulu maksud "semua fitur" (semua stasiun/kostum/ujian terbuka?) dan cara masuk (login guru Firebase).

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
