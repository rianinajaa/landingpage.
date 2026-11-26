# PRD — Situs studio digital premium

Status: fase 1 diimplementasikan di repo ini. Merek kerja tetap Northline sampai diganti di `content/brand.ts`.
Referensi pengalaman: [fraxbit.com](https://fraxbit.com/) (diambil 26 November 2026).
Dokumen pendamping: `docs/design.md`, `AGENTS.md`.

## 1. Ringkasan

Kita membangun situs marketing untuk sebuah studio digital: desain, pengembangan, growth, dan integrasi AI. Pengunjung harus merasa situs ini dibuat oleh tim yang sama yang akan mengerjakan proyek mereka.

Referensi dipakai untuk **struktur, ritme visual, dan pola konversi**, bukan untuk disalin. Nama, copy, proyek, testimoni, logo, video, dan identitas hukum harus milik kita sendiri.

Hasil fase 1 adalah situs yang bisa dijalankan lokal, diisi dari file konten, dan siap diganti merek tanpa menyentuh komponen.

## 2. Masalah yang diselesaikan

Calon klien menilai studio dari situs studio itu sendiri. Situs yang terasa seperti template menurunkan kepercayaan sebelum percakapan pertama.

Situs ini harus, dalam satu kunjungan:

1. Menjelaskan apa yang studio kerjakan, dalam empat disiplin.
2. Membuktikan craft lewat pekerjaan terpilih.
3. Menunjukkan cara kerja, dari strategi sampai growth.
4. Mengumpulkan permintaan penawaran tanpa panggilan wajib.

## 3. Audiens

Pembeli utama adalah pemilik bisnis atau founder yang membutuhkan kehadiran digital yang terlihat terpercaya dan menghasilkan klien. Mereka membandingkan beberapa studio, menilai dari craft, dan tidak sedang mencari harga termurah.

Pengguna sekunder:

- Calon klien yang sudah punya brief dan hanya ingin mengirim detail proyek.
- Orang yang datang dari portofolio atau artikel dan butuh satu jalur ke formulir.
- Mesin pencari dan asisten AI yang membaca judul, deskripsi, dan data terstruktur.

Bukan untuk: pengunjung yang hanya membandingkan harga di tabel paket. Harga tidak dipublikasikan. Penawaran keluar setelah discovery.

## 4. Keputusan yang dikunci

| Keputusan | Pilihan | Alasan |
| --- | --- | --- |
| Bahasa situs v1 | Inggris | Headline referensi pendek dan ketat. Kalimat Indonesia lebih panjang dan akan memecah skala tipe hero. Locale tetap satu field, jadi bisa diganti. |
| Merek v1 | Placeholder `Northline` | Nama, email, dan kota belum diberikan. Semua string merek tinggal di `content/brand.ts`. |
| Harga | Tidak ditampilkan | Sama seperti referensi: fixed quote setelah percakapan. |
| Konten bukti | Sampel berlabel | Testimoni dan studi kasus fraxBIT tidak boleh dipakai. |
| CMS | Tidak ada di v1 | Konten berupa modul TypeScript. |
| Stack | Next.js, TypeScript, Tailwind | Lihat `AGENTS.md`. |

`Northline` hanya nama kerja. Ganti sebelum situs dianggap siap tayang.

## 5. Yang tidak disalin

Jangan masukkan ke repo, ke copy, atau ke aset:

- Nama fraxBIT, FRAXBIT DIGITAL S.R.L., Fraxbot, atau Booked.
- Logo, favicon, showreel, foto proyek, dan gambar share mereka.
- Nama klien, kutipan review, dan angka mereka (240+, 22 negara, 7 tahun) sebagai fakta kita.
- Alamat, email, nomor PPN, dan teks legal mereka.
- Kalimat pemasaran yang diangkat utuh dari halaman mereka.

Boleh meniru pola: empat disiplin, kartu proyek, proses empat langkah, dinding angka, carousel testimoni, formulir penawaran, header yang berganti tema.

## 6. Tujuan dan ukuran

Tujuan fase 1:

- Homepage terasa satu keluarga dengan referensi: hero gelap satu layar, disiplin, karya, proses, prinsip, dinding aksen, testimoni, CTA merah, footer.
- Semua rute fase 1 bisa dibuka, punya metadata, dan berakhir di formulir yang sama.
- Mengganti nama studio hanya lewat `content/brand.ts`.
- Lighthouse aksesibilitas tidak punya kontras yang gagal di teks utama. Motion menghormati `prefers-reduced-motion`.

Bukan ukuran fase 1: ranking SEO, iklan, atau integrasi CRM hidup.

## 7. Arsitektur informasi

```
/                          Home
/services                  Empat disiplin
/services/web-design
/services/web-development
/services/growth
/services/ai
/portfolio                 Indeks karya
/portfolio/[slug]          Studi kasus
/about
/contact                   Formulir + tiga langkah berikutnya
/policies                  Privasi dan syarat, singkat

Fase 2, jangan dibangun dulu
/industries
/industries/[slug]
/blog
/blog/[slug]
/products/receptionist     Setara halaman produk AI telepon
/products/acquisition      Setara sistem akuisisi klien
/referral
```

Navigasi header:

- Kiri: wordmark.
- Tengah, desktop: Portfolio, Services (mega menu), About, Blog. Blog menunjuk ke jangkar atau halaman “segera” di fase 1, bukan blog kosong yang terlihat rusak. Sembunyikan Blog dari header sampai fase 2.
- Kanan: tombol `Let's talk` ke `/contact`, plus tombol menu.
- Mobile: drawer penuh dengan kelompok Design, Development, Growth, AI.

Mega menu Services:

| Kelompok | Item |
| --- | --- |
| Design | Web Design |
| Development | Web Development |
| Growth | SEO & AI Search |
| AI | AI Integration |
|  | Tautan `All services` |

Empat item di atas adalah cakupan fase 1. Mobile app, iklan berbayar, resepsionis AI, dan client acquisition system ada di referensi, tetapi masuk fase 2 supaya v1 selesai sebagai satu situs yang utuh, bukan sepuluh halaman tipis.

Footer, setiap halaman:

- Deskripsi satu kalimat dari brand.
- Status `Available for work` dengan titik hijau.
- Navigasi: Home, Portfolio, Services, About, Contact.
- Layanan: empat slug fase 1.
- Email yang bisa disalin.
- Tautan ke `/policies`.
- Baris hak cipta dengan tahun berjalan.

## 8. Alur utama

### Minta penawaran

1. Pengunjung menekan `Get a free quote` atau `Let's talk`.
2. Form muncul di homepage (`#get-started`) atau di `/contact`.
3. Field: nama, email, minat (Web Design, Development, Growth, AI Integration, Other), anggaran kasar dalam EUR (opsional), cerita proyek, persetujuan syarat.
4. Field honeypot `website` tersembunyi dari pengguna.
5. Validasi gagal menandai field, tanpa menghapus isian.
6. Sukses mengganti form dengan kalimat bahwa permintaan terbaca dan dibalas dalam 12 jam.
7. Jika `RESEND_API_KEY` tidak ada, permintaan tetap sukses di UI dan tercatat di log server. Jangan membuat situs gagal hanya karena email belum dihubungkan.

### Melihat karya

1. Homepage menampilkan empat proyek.
2. `View all projects` membuka `/portfolio`.
3. Kartu membuka `/portfolio/[slug]`.
4. Studi kasus berakhir dengan CTA yang sama.

### Memilih layanan

1. Blok disiplin di homepage menaut ke halaman layanan.
2. Halaman layanan menjelaskan hasil, cara kerja, dan untuk siapa ini cocok.
3. CTA kembali ke formulir, dengan minat terisi sesuai layanan.

## 9. Homepage

Urutan bagian tidak boleh diacak. Ritme latarnya adalah bagian dari desain.

| # | Bagian | Latar | Isi |
| --- | --- | --- | --- |
| 1 | Hero | Ink, min tinggi satu layar | Eyebrow bertitik merah. Headline tiga kata dengan titik terakhir merah. Subjudul maksimal dua baris. Dua tombol: quote (putih) dan karya (outline). Bawah: tiga statistik, penanda scroll, satu baris kepercayaan. |
| 2 | Disiplin | Ink | Empat baris bernomor. Setiap baris: indeks, judul, deskripsi pendek, daftar kemampuan, panah. Seluruh baris adalah tautan. |
| 3 | Karya | Putih | Empat kartu. Gambar rasio 16:10, sudut 20px. Industri dan disiplin di bawah judul. |
| 4 | Cara kerja | Ink | Tiga kolom: apa yang dibangun (marquee), proses empat langkah, alat yang dipakai. |
| 5 | Prinsip | Putih | Empat alasan memilih studio. Boleh statis di v1. Animasi pin adalah peningkatan, bukan syarat rilis. |
| 6 | Showreel | Ink | Hanya dirender jika `brand.showreel` punya poster. Tanpa video, bagian ini tidak muncul dan tidak menyisakan lubang. |
| 7 | Dinding angka | Merah aksen | Satu kalimat besar plus tombol ke portofolio. Angka datang dari `brand.stats`, bukan dari referensi. |
| 8 | Testimoni | Ink | Kartu kutipan, sumber, rating. Panah sebelumnya/berikutnya. Jika kurang dari dua kutipan, carousel menjadi satu kartu. |
| 9 | Logo | Ink, menyatu dengan testimoni | Dua baris: klien dan partner. Tanpa logo asli, pakai nama dalam mono, jangan kotak abu-abu kosong. |
| 10 | CTA | Merah aksen | Judul, email yang bisa disalin, formulir. |
| 11 | Footer | Ink | Lihat bagian 7. |

Hero v1, bahasa Inggris, boleh diganti di konten:

- Eyebrow: `Digital design & growth studio`
- Judul: `Design. Build. Grow.`
- Subjudul: satu kalimat tentang situs, landing page, dan sistem AI yang membuat bisnis terlihat lebih dipercaya.

Statistik v1 harus jujur untuk studio yang baru. Jangan meminjam 240 proyek. Contoh yang boleh dipakai sampai ada angka asli:

- `Projects delivered` / `Selected`
- `Disciplines` / `4`
- `Response time` / `12h`

Saat angka asli ada, ganti isi `brand.stats` saja.

## 10. Halaman dalam

### Services index

Judul satu baris. Empat layanan dalam dua kelompok (Design, Development, Growth, AI), masing-masing dengan satu kalimat dan tiga label. FAQ singkat: bisa sewa satu disiplin, harga setelah discovery, siapa yang mengerjakan. CTA merah di bawah.

### Halaman layanan

Struktur sama untuk empat slug:

1. Hero gelap: judul, satu paragraf, tiga fakta (misalnya durasi khas, putaran revisi, hasil serah terima).
2. Apa yang termasuk: 6 sampai 8 butir, bukan 12 jika belum ada proses nyata.
3. Untuk siapa ini cocok, dan untuk siapa tidak.
4. FAQ tiga sampai lima pertanyaan.
5. CTA.

Fakta durasi yang ditulis harus bisa kita penuhi. Jangan menyalin “4–8 minggu” dan “3 putaran revisi” sebagai janji jika belum diputuskan. Pakai bahasa “scoped after discovery” sampai angkanya dikunci di `content/services.ts`.

### Portfolio

Indeks: judul, jumlah proyek, grid kartu. Filter fase 1 cukup berupa label, bukan filter interaktif, kecuali ada lebih dari delapan proyek.

Studi kasus:

- Klien atau nama proyek, industri, tahun, disiplin.
- Satu paragraf masalah, satu paragraf yang dibuat, satu paragraf hasil.
- Minimal satu gambar sampul. Jika gambar asli belum ada, gunakan komposisi tipografi, bukan tangkapan layar situs orang lain.
- Tandai sampel dengan `sample: true` dan satu baris “Sample project for the studio site” yang terlihat.

Tiga studi kasus sampel cukup untuk fase 1. Empat kartu homepage boleh memakai tiga proyek jika yang keempat belum ada. Jangan mengarang metrik (“+180% leads”).

### About

Hero, empat prinsip (teks yang sama dengan homepage, satu sumber data), satu paragraf tentang cara kerja jarak jauh, CTA. Peta klien fase 1 tidak wajib.

### Contact

Judul, email, status ketersediaan, tiga langkah (dibaca, discovery singkat, proposal tertulis), formulir, FAQ empat pertanyaan: biaya, durasi, klien di luar kota, dukungan setelah tayang.

### Policies

Dua bagian: privasi (data formulir, cookie) dan syarat (permintaan bukan kontrak). Cukup untuk checkbox formulir. Bukan dokumen hukum final.

## 11. Model konten

Semua copy yang terlihat pengguna tinggal di `content/`. Komponen tidak menulis kalimat pemasaran.

`content/brand.ts`

- `name`, `legalName`, `tagline`, `description`
- `email`, `city`, `availability` (`available` atau `booked`)
- `stats[]` dengan `label` dan `value`
- `social[]`
- `showreel` opsional: `poster`, `src`, `duration`
- `locale` default `en`

`content/services.ts`

- `slug`, `group`, `title`, `summary`, `promise`, `includes[]`, `fit[]`, `notFit[]`, `faqs[]`

`content/projects.ts`

- `slug`, `title`, `industry`, `year`, `disciplines[]`, `summary`, `problem`, `work`, `outcome`, `cover`, `sample`

`content/testimonials.ts`

- `quote`, `name`, `role`, `source`, `rating`
- Array boleh kosong. Bagian testimoni disembunyikan jika kosong.

`content/navigation.ts`

- Header, footer, dan mega menu membaca file ini.

## 12. Formulir

- Wajib: nama, email valid, minat, cerita proyek (minimal 20 karakter), persetujuan.
- Anggaran: angka opsional, tidak memblokir kirim.
- Honeypot terisi: balas sukses palsu, jangan kirim email.
- Jangan simpan data di repositori atau di klien.
- Pesan error spesifik per field.
- Tombol menampilkan keadaan mengirim dan tidak bisa ditekan dua kali.

## 13. SEO dan semantik

Setiap rute punya `title` dan `description` unik.

- Home: `{name} | Design, development and AI`
- Layanan: `{service} | {name}`
- Proyek: `{project} | {name}`

JSON-LD fase 1:

- `Organization` dan `WebSite` di layout.
- `ItemList` untuk karya unggulan di home.
- `Service` di setiap halaman layanan.

`sitemap.ts` dan `robots.ts` memuat rute fase 1. Gambar OG boleh berupa kartu tipografi yang dihasilkan dari nama studio, ukuran 1200×630. Jangan mengunduh gambar share referensi.

## 14. Non-fungsional

- Header setinggi 4.5rem, tetap di atas, berganti warna di atas bagian gelap, terang, dan merah.
- Keyboard: skip link, fokus terlihat, menu dan carousel bisa dipakai tanpa tetikus.
- Kontras teks utama minimal WCAG AA.
- Gambar proyek punya `alt` yang menyebut proyek dan jenis pekerjaan.
- Tanpa layout shift dari font: Geist dan Geist Mono lewat `next/font`.
- Cookie banner hanya jika ada analitik. Fase 1 tanpa skrip analitik tidak menampilkan banner.
- Lebar: 390, 768, 1280. Tidak ada scroll horizontal.

## 15. Fase

### Fase 1 — situs yang bisa ditunjukkan

Homepage lengkap, empat halaman layanan, indeks portofolio, tiga studi kasus sampel, about, contact, policies, header, footer, formulir.

### Fase 2 — permukaan yang menambah akuisisi

Industri, blog, dua halaman produk, program referral, filter portofolio, analitik, email produksi, cookie banner.

### Tidak dibangun

Akun klien, pembayaran, CMS visual, blog admin, salinan identitas referensi.

## 16. Kriteria selesai fase 1

- `npm run build` sukses.
- Setiap rute di bagian 7 fase 1 memuat dan memakai token di `docs/design.md`.
- Tidak ada string `fraxbit` di repo.
- Formulir kosong gagal dengan pesan. Formulir valid menampilkan keadaan sukses.
- Homepage di 390px dan 1280px mengikuti urutan bagian di bagian 9.
- Merek bisa diganti dari satu file dan terlihat di header, footer, title, dan email.

## 17. Yang masih menunggu pemilik

Tidak memblokir fase 1, memblokir peluncuran:

- Nama studio, nama hukum, email, kota.
- Apakah pasarnya internasional (Inggris) atau lokal (Indonesia).
- Proyek nyata dan izin menampilkannya.
- Apakah formulir harus masuk email, Spreadsheet, atau keduanya.
