# CATATAN PROYEK: Kota Profesi (Miku-game)

Repo: sherlocomp-cyber/Miku-game · dipublish lewat GitHub Pages · struktur: index.html, css/, js/01-30 (js/30 dimuat SEBELUM js/26).

## Tugas 2026-11-11: pesan guru + Mode Guru (SELESAI, belum diuji)
- [x] js/29-pesan-guru.js : siswa yang sedang bermain menerima kartu "Pesan dari Guru" (/pesanGuru/semua atau /pesanGuru/<kelas>)
- [x] js/30-mode-guru.js : layar awal -> "🔑 Masuk guru", kata sandi bawaan `gurumiku` (hash di konstanta PASS). Nama karakter "Guru"; koin 99999, semua warga ⭐⭐⭐, semua kosakata/baju/misi selesai; tombol 📢 Guru untuk kirim pesan (semua / satu kelas). Data guru TIDAK ditulis ke /siswa dan /papan (fetch dicegat + window.FB distub)
- [x] Dasbor guru (ruang-guru-miku.html, file terpisah): kartu "Pesan ke siswa aktif" di tab Online, tanpa login Firebase
- [ ] Pengguna harus pasang aturan Firebase: "pesanGuru": {".read": true, "$target": {".write": true, ".validate": "newData.hasChildren(['id','t']) && newData.child('t').isString() && newData.child('t').val().length <= 160"}}
- Batasan: kunci stasiun Jalur SAS (js/21) belum dibuka oleh mode guru (belum dibaca). Teman online (js/28) tetap aktif: guru terlihat sebagai "Guru" di ruang "umum".
Untuk membatalkan: hapus <script> js/29 dan js/30 di index.html.

## Berikutnya
- Uji: masuk guru di HP, kirim pesan ke akun siswa lain, cek kartu muncul.
- Baca js/21 lalu buka semua stasiun Jalur SAS di mode guru (bila terkunci).

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
