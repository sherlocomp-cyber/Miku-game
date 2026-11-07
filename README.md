# Kota Profesi – Petualangan Bahasa Arab

Buka `index.html` (GitHub Pages memakainya otomatis). Semua file `js/` adalah skrip biasa
yang dimuat **berurutan**. Urutan muat ada di `index.html` dan **tidak sama dengan urutan nomor**:

```
01 → 02 → 07 → 03 → 04 → 05 → 06 → 08 → 09 → 10 → 11 → 12 → 13 → 14 → 15 → 16 → 17 → 18 → 19 → 20
```

**Kenapa `07` dimuat lebih awal:** `04` memanggil `person()` (di `02`) saat dimuat, dan `person()` memakai
`KIT()`/`CH()` yang ada di `07`. Di satu file, fungsi otomatis bisa dipakai dari mana saja; setelah dipecah,
fungsi hanya ada setelah file-nya dimuat. Jadi: kode yang **langsung dijalankan saat dimuat** hanya boleh
memanggil fungsi dari file yang **sudah dimuat sebelumnya**. Fungsi yang baru dipanggil nanti (saat
`loop()` atau saat tombol ditekan) bebas.

`debug.html` = salinan `index.html` dengan kotak merah yang menampilkan error JS di layar (untuk HP).
Kalau layar hitam atau ada yang tidak jalan, buka `debug.html` dan lihat kotak merahnya.

## Peta file

| File | Isi |
|---|---|
| `js/01-data-soal.js` | Data profesi `D`, bank soal, materi, pembuat soal (`gen`) |
| `js/02-kota-dunia.js` | Renderer 3D, kamera, bahan, bangunan dasar, `person()` |
| `js/03-npc-extra.js` | Detail tambahan NPC (tangan, perlengkapan, wajah, perhiasan) |
| `js/04-kota-bangun.js` | Dekorasi, `build()`, pohon/hiasan, pemain, seragam |
| `js/05-karakter-data.js` | Data karakter dan aksesoris dasar |
| `js/06-aksesoris-v39.js` | Aksesoris v39 dan tabel harga bertingkat (`HG`) |
| `js/07-karakter-model.js` | Model karakter `CH()`, `HERO()`, detail halus `fineChar()`, animasi hidup `charLife()` (dimuat setelah `02`) |
| `js/08-karakter-kustom.js` | Layar kustomisasi karakter |
| `js/09-audio-state-misi.js` | Audio dan suara, state, misi (`MS`), quest (`QS`), simpan/muat |
| `js/10-materi-kuis.js` | Kartu materi dan kuis |
| `js/11-laporan.js` | Refleksi, laporan guru, dunia nyata, laporan PDF |
| `js/12-buku-input.js` | Buku (misi/kata/tata/toko/laporan) dan input joystick/keyboard |
| `js/13-animasi-warga.js` | Animasi kerja warga |
| `js/14-item.js` | Koin dan item di kota |
| `js/15-kendaraan.js` | Sepeda dan mobil |
| `js/16-loop-interior.js` | Interior bangunan dan loop utama |
| `js/17-detail-pack.js` | Detail pack v37 (bangunan, jalan, pohon, interior) |
| `js/18-mulai-minigame.js` | Mulai game dan mini game Pasangan Profesi |
| `js/19-ujian-akhir.js` | Ujian akhir 40 soal (menara jawaban) |
| `js/20-landscape-backup.js` | Mode landscape, cadangan ke file, fokus dialog |
| `css/base.css` | Gaya dasar |
| `css/minigame.css` | Gaya mini game |
| `css/ui.css` | HUD, dialog, layar awal, layar pendek |
| `css/ujian-akhir.css` | Gaya ujian akhir |

## Cara update

1. Ubah file yang sesuai di tabel di atas.
2. Naikkan angka `?v=40` di `index.html` (misalnya jadi `?v=41`) agar browser memuat versi baru.
3. Jangan mengubah urutan `<script>` tanpa alasan (lihat bagian urutan muat di atas).
