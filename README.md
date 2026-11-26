# FORMA — Progress & Possibility

Situs portfolio studio yang berjalan sebagai satu adegan scroll: cincin segitiga metal, panel karya, kepala batu kapur yang terpecah, lalu inti geometris. Dibangun dengan HTML, CSS, dan JavaScript vanilla serta Three.js. Tidak ada langkah build untuk menjalankannya.

## Menjalankan secara lokal

Dari akar repositori:

```bash
python3 -m http.server 8080
```

Buka `http://127.0.0.1:8080/`. Jangan membuka `index.html` lewat `file://` — modul dan tekstur membutuhkan server.

## GitHub Pages

Situs ini memakai path relatif (`./css`, `./js`, `./assets`, `./vendor`) supaya jalan sebagai project site.

1. Push cabang ke GitHub.
2. Settings → Pages → Build and deployment → Deploy from a branch.
3. Branch `main`, folder `/ (root)`.
4. Alamatnya berbentuk `https://USERNAME.github.io/landingpage/`.

Berkas `.nojekyll` sudah ada supaya Pages tidak mengabaikan berkas tertentu. Halaman yang terbit adalah `index.html`, bukan README.

## Struktur

- `index.html` — halaman, menu, dialog
- `css/styles.css` — tampilan dan susunan responsif
- `js/scene.js` — scene Three.js
- `js/phases.js` — peta fase scroll
- `js/scroll.js` — progres scroll
- `js/cursor.js` — kursor khusus
- `js/dialogs.js` — menu, percakapan, dan detail karya
- `js/main.js` — penyambung
- `assets/models/head.glb` — kepala dan pecahannya
- `assets/art/` — sampul karya
- `vendor/three/` — Three.js r170

## Aset dan lisensi

- **Patung.** *Limestone head of a bearded man*, awal abad ke-6 SM, The Metropolitan Museum of Art, The Cesnola Collection, nomor objek 74.51.2857. Pindaian 3D dirilis CC0. Diunduh dari aset web Met (Vntana), lalu disederhanakan dan dipotong menjadi lima fragmen besar dengan tutup bagian dalam yang padat. Kredit tidak diwajibkan oleh CC0; tetap dicantumkan.
  - Catatan: [halaman koleksi Met](https://www.metmuseum.org/art/collection/search/242408)
- **Font.** [Outfit](https://fonts.google.com/specimen/Outfit) oleh Rodrigo Fuenzalida, SIL Open Font License. Berkas lisensi ada di `assets/fonts/OFL.txt`.
- **Three.js.** Revisi 170, lisensi MIT. Lihat `vendor/three/LICENSE`.
- **Sampul karya** di `assets/art/` digambar untuk proyek ini dan bukan foto pihak ketiga.

Model sumber punya sekitar 100.000 segitiga. Setelah pengelasan dan penyederhanaan, jaring utuh berada di kisaran 70.000 segitiga supaya siluet, rambut, dan janggut tetap terbaca tanpa membebani pecahan. Tidak ada patung versi sebelumnya di repositori ini.

Skrip `tools/prepare-bust.mjs` dan `tools/make-art.py` hanya untuk membuat ulang aset. Situs yang sudah terbit tidak membutuhkannya.
