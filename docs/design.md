# Design — situs studio

Kontrak visual untuk fase 1. Angka di sini diambil dari pola [fraxbit.com](https://fraxbit.com/), lalu dijadikan sistem kita. Jangan menempel aset mereka.

Prinsip:

1. Sedikit warna. Ink, putih, dan satu merah.
2. Tipe besar, rapat, berat 400. Bukan bold display.
3. Mono kecil untuk indeks, label, dan angka.
4. Gerak pelan dan sekali. Hover menjelaskan, bukan menghias.
5. Bagian bergantian gelap, putih, dan merah. Urutannya ada di PRD.

## Warna

Token di `app/globals.css`.

| Token | Nilai | Pemakaian |
| --- | --- | --- |
| `--color-ink` | `#121517` | Latar gelap, teks di atas putih, tombol gelap |
| `--color-bg` | `#ffffff` | Bagian terang |
| `--color-accent` | `#ef233c` | Titik, titik akhir judul, dinding angka, CTA, isi hover tombol |
| `--color-available` | `#22c55e` | Titik status “available” saja |
| `--color-muted` | `#6f777c` | Teks sekunder di atas putih |
| `--color-line` | `#dde0e2` | Garis pemisah di atas putih |
| `--color-gray-100` | `#eceeef` | Permukaan lembut |
| `--color-gray-300` | `#c3c8cb` | Teks nonaktif |
| `--color-gray-400` | `#9aa1a6` | Label di atas gelap yang lebih senyap |
| `--color-gray-600` | `#50575c` | Paragraf di bagian putih |

Di atas ink:

- Eyebrow: putih 55%.
- Paragraf: putih 60%.
- Garis: putih 12%.
- Judul: putih 100%. Titik terakhir judul memakai aksen.

Di atas aksen:

- Judul dan tombol putih.
- Paragraf putih 85%.

Jangan menambah warna merek kedua. Ungu, biru, dan gradien foto bukan bagian sistem ini. Radial putih 6% di belakang hero boleh, sangat lebar, tanpa terlihat seperti lampu warna.

`theme-color` browser: `#121517`.

## Tipografi

| Peran | Keluarga | Catatan |
| --- | --- | --- |
| Sans | Geist | Satu-satunya sans. `next/font/google` atau paket `geist`. |
| Mono | Geist Mono | Eyebrow, indeks `01`, label statistik, nama alat. |

Skala:

| Peran | Ukuran | Tracking | Line-height | Weight |
| --- | --- | --- | --- | --- |
| Hero | `min(clamp(3.25rem, .9rem + 9.4vw, 11.5rem), 19svh)` | `-0.055em` | `0.95` | 400 |
| Judul bagian | `clamp(2.5rem, 1rem + 5.2vw, 7rem)` | `-0.05em` | `1` | 400 |
| Judul dinding / about | `clamp(3rem, 1rem + 5.6vw, 7.5rem)` | `-0.055em` | `0.95` | 400 |
| Judul kartu | `1.25rem` sampai `1.5rem` | `-0.03em` | `1.2` | 400 |
| Paragraf | `1rem`, `1.125rem` dari `sm` | `0` | `1.6` | 400 |
| Eyebrow | `0.75rem` | `0.18em` | `1` | 400, uppercase |
| Tombol | `0.8125rem` | `0` | `1` | 500 |
| Indeks mono | `0.75rem` | `0.08em` | `1` | 400 |

Hero memecah tiga kata menjadi tiga baris mask, dengan jarak horizontal `0.28em`. Titik pada kata terakhir berwarna aksen. Pola yang sama, lebih kecil, dipakai judul bagian: `Selected work` plus titik aksen.

Jangan set judul ke 600 atau 700. Ketegangan visual datang dari ukuran dan tracking negatif.

## Layout

```
--gutter: clamp(1rem, .6rem + 1.8vw, 2.5rem);
--header-h: 4.5rem;
```

`.container-x` selebar viewport dengan padding inline `--gutter`. Tidak ada max-width sempit yang membuat hero mengambang di tengah kolom 960px. Judul boleh selebar container. Paragraf dibatasi `max-w-xl` (hero) atau `max-w-md` (pengantar bagian).

Padding vertikal bagian: `py-28`, lalu `sm:py-36`, lalu `lg:py-44`.

Grid karya, 12 kolom dari `lg`:

- Kartu ganjil `col-span-7`.
- Kartu genap `col-span-5`, dengan `lg:mt-24` supaya tidak sejajar.
- Di bawah `lg`, satu kolom, jarak `gap-16`.

Gambar kartu: rasio 16/10, `max-h: 72svh`, radius `1.25rem`, latar fallback titik-titik `currentColor` 7%.

## Header

Tinggi 4.5rem, `position: fixed`, isi rata vertikal.

| Zona | Isi |
| --- | --- |
| Kiri | Wordmark, tracking rapat, sekitar `1.05rem`. |
| Tengah | Empat tautan. Hanya dari `lg`. Ukuran kecil, putih atau ink mengikuti tema. |
| Kanan | Pill `Let's talk` plus ikon menu. |

Tema header mengikuti bagian di bawahnya:

| `data-header-theme` | Wordmark dan tautan | Tombol |
| --- | --- | --- |
| `dark` | Putih | Putih dengan chip merah |
| `light` | Ink | Ink dengan chip merah |
| `accent` | Putih | Putih dengan chip ink |

Ganti tema dengan observer, bukan dengan kelas manual per halaman. Di atas 50% header masuk section baru, tema berganti. Transisi warna 200ms.

Menu mobile menutupi layar, latar ink, tautan besar, kelompok layanan di bawah. Tutup dengan tombol yang sama dan dengan Escape.

Skip link terlihat saat fokus, menuju `#main`.

## Tombol

Pill, tinggi default `3.25rem`, padding inline `1.5rem`. Varian `lg` tinggi `3.75rem`. Bentuk penuh (`border-radius: 999px`).

Struktur:

- Lapisan isi yang mengembang dari lingkaran di sisi chip (`clip-path: circle(...)`).
- Label.
- Chip bulat di kanan, berisi panah diagonal (kanan-atas).

Varian:

| `data-variant` | Diam | Isi hover |
| --- | --- | --- |
| `light` | Putih, teks ink, chip aksen | Aksen mengisi, teks putih |
| `outline` | Transparan, garis ink 20%, teks ink | Ink mengisi, teks putih |
| `outline-light` | Transparan, garis putih 38%, teks putih | Putih mengisi, teks ink |
| `accent` | Aksen, teks putih | Ink mengisi |

Hover, 700ms, easing `cubic-bezier(.16, 1, .3, 1)`:

- Isi meluas sampai menutupi pill.
- Label bergeser `0.25rem` ke kanan.
- Chip berputar 45 derajat.

Active: `scale: 0.97`. Disabled: opacity 0.5 dan tidak bisa diklik.

Panah adalah dua SVG yang bertukar posisi, bukan satu ikon yang melompat. Jika itu terlalu mahal di v1, satu panah yang berputar bersama chip sudah cukup, asal chip dan isi tetap ada.

Tautan teks biasa: garis bawah aksen setebal 1.5px, offset `0.2em`. Hover mengubah warna teks menjadi aksen.

## Komponen

### Eyebrow

Mono atau sans uppercase, tracking `0.18em`, ukuran `0.75rem`. Di depan ada titik `6px` berwarna aksen. Contoh: `Digital design & growth studio`.

### Baris disiplin

Satu grid: `2.5rem | 1fr | auto`, lalu daftar kemampuan di baris kedua selebar sisa.

```
01    Web Design                         →
      Interfaces and UX
      Website design · UI/UX · Landing pages · Design systems
```

Pembatas bawah putih 12%. Hover menggeser panah dan menaikkan opacity deskripsi. Seluruh baris satu tautan. Indeks mono.

### Kartu karya

Gambar dengan crop. Di atas gambar tidak ada badge. Di bawah:

- Indeks mono `01`.
- Judul.
- Industri, warna muted.
- Disiplin, satu baris.

Hover gambar: `scale(1.04)` selama 1.2s, easing yang sama. Kursor kustom bertuliskan `View` boleh ditunda. Fokus keyboard: outline offset 6px, radius mengikuti kartu.

### Marquee “what we build”

Dua salinan daftar, bergerak terus, berhenti saat hover dan saat `prefers-reduced-motion`. Item dipisah titik tengah. Tidak boleh memakai daftar ini sebagai satu-satunya cara membaca layanan. Daftar statis yang sama ada untuk pembaca layar.

### Proses

Empat langkah vertikal atau grid 2×2. Nomor mono `01`–`04`. Judul satu kata. Satu kalimat di bawahnya.

### Kelompok alat

Lima label: Design, Development, Platforms, AI & automation, Growth. Isinya chip teks, bukan logo merek pihak ketiga yang diunduh. Nama alat ditulis sebagai teks.

### Prinsip

Empat item bernomor. Judul pendek, satu kalimat. Di v1 mereka boleh mengalir biasa. Pin scroll (`position: sticky` bertahap) hanya jika tidak mengganggu pembacaan di mobile. Di bawah `lg`, jangan di-pin.

### Testimoni

Satu kutipan besar, bukan dua belas kartu sekaligus. Di bawah: nama, peran, sumber, `5 / 5`. Kontrol `01 / 0N` plus tombol sebelumnya dan berikutnya. Tanpa autoplay.

### Dinding angka

Latar aksen penuh. Judul sangat besar, putih. Satu paragraf `max-w-md`. Satu tombol `light`. Tidak ada pola atau foto di belakang.

### Formulir

Di atas CTA merah, form duduk di kartu putih, teks ink, radius `1.5rem`, padding longgar.

Field:

- Label di atas input, ukuran kecil.
- Input garis bawah atau isi `--color-gray-100`, radius `0.75rem`, tinggi minimal 48px.
- Select minat adalah daftar, bukan input bebas.
- Textarea cerita minimal empat baris.
- Honeypot `website` di luar layar (`absolute`, `left: -9999px`), tetap di DOM, `tabIndex={-1}`, `autoComplete="off"`.
- Checkbox syarat dengan tautan ke privasi dan syarat.
- Tombol submit `accent` atau ink, selebar container di mobile.

Kesalahan: teks aksen di bawah field, `aria-invalid`. Sukses: kartu yang sama berganti menjadi satu judul dan satu kalimat. Jangan alert browser.

### Footer

Grid: pernyataan merek di kolom lebar, lalu Navigation, Services, Connect. Email punya aksi salin yang mengganti label menjadi `Copied` selama dua detik. `Back to top` menggulir ke `#main`.

### Cookie

Tidak ada di fase 1.

## Motion

Easing standar: `--ease-out-expo: cubic-bezier(.16, 1, .3, 1)`.

Intro hero, hanya saat load pertama:

- Setiap kata naik dari mask (`overflow: hidden` pada baris) selama 1.4s, tunda 0 / 0.1 / 0.2s.
- Eyebrow, subjudul, dan tombol fade-up 1.2s.

Reveal saat masuk viewport, sekali:

- `fade`: opacity dan `translateY(16px)`.
- `split`: judul per kata, sama seperti intro.
- `clip`: gambar dari `inset` atau clip vertikal.
- `line`: garis tumbuh dari kiri.

Saat `prefers-reduced-motion: reduce`, semua elemen terlihat, tanpa translate, tanpa marquee, tanpa scale hover. Jangan menyembunyikan konten di belakang animasi yang tidak jalan.

Smooth scroll satu halaman (Lenis atau CSS `scroll-behavior`) opsional. Jika dipakai, matikan saat reduced motion. Jangan memasang dua sistem scroll.

## Halaman dalam

Hero halaman dalam lebih pendek dari homepage: `min-h` tidak wajib satu layar. Padding atas minimal `header + 4rem`. Judul memakai skala judul bagian, bukan skala hero 11.5rem, kecuali About jika satu kalimatnya pendek.

Layanan dan kontak memakai eyebrow, judul dengan titik aksen, lalu paragraf `max-w-xl`.

Studi kasus: sampul radius `1.25rem` selebar container, lalu tiga blok teks (problem, work, outcome) dengan label mono. Tidak ada galeri lima belas gambar di v1.

FAQ: daftar tanya-jawab. Boleh `<details>` asli. Jawaban terlihat cukup dengan satu klik. Tanpa animasi tinggi yang memotong teks.

## Responsive

| Lebar | Perilaku |
| --- | --- |
| 390 | Header hanya wordmark, tombol bicara, dan menu. Hero tetap satu layar. Statistik menumpuk atau menjadi satu baris yang diizinkan membungkus. Kartu karya satu kolom. Form satu kolom. |
| 768 | Hero sudah dua tombol sejajar. Proses boleh 2 kolom. |
| 1280 | Nav tengah muncul. Karya 7/5. Disiplin satu baris penuh. |

Tombol sentuh minimal 44px. Jarak antar tautan footer cukup untuk ibu jari.

Tidak ada scrollbar horizontal. Marquee dipotong dengan `overflow: hidden` di section, bukan di `body`.

## Aksesibilitas

- Warna aksen di atas putih hanya untuk titik, garis, dan ikon, bukan untuk paragraf kecil. Teks aksen `#ef233c` di atas putih gagal untuk teks 14px. Pesan error boleh aksen jika ukurannya minimal 16px dan tebal 500, atau pakai ink dengan ikon aksen.
- Fokus: `outline: 2px solid var(--color-accent); outline-offset: 3px`. Jangan menghapus outline tanpa pengganti.
- Gambar dekoratif `alt=""`. Sampul proyek punya alt.
- Menu, dialog video, dan carousel: fokus terperangkap saat terbuka, kembali ke pemicu saat tertutup.
- Status ketersediaan tidak hanya warna. Teks `Available for work` ikut tertulis.
- Form: setiap input punya `label` tersambung, bukan placeholder sebagai label.

## Ikon

Satu gaya: stroke 1.5, ujung bulat, viewBox kecil. Panah tombol adalah garis siku ke kanan-atas. Jangan mencampur ikon isi-penuh dari set lain. Logo sosial boleh glyph sederhana atau teks.

## Suara copy di dalam desain

Kalimat pendek. Satu ide per blok. Angka hanya jika benar. Jangan seru, jangan “unlock”, jangan “cutting-edge”.

Judul berakhir dengan titik aksen, termasuk di tengah kalimat tiga kata: `Design. Build. Grow.`

## Checklist sebelum disebut sesuai desain

- Hero satu layar, judul tidak memotong, titik terakhir merah.
- Header terbaca di atas ink, putih, dan merah.
- Empat disiplin adalah baris, bukan kartu berwarna-warni.
- Karya tidak sejajar kaku di desktop.
- CTA akhir berwarna aksen, form di kartu putih.
- Reduced motion menampilkan semua teks.
- Tidak ada warna di luar token.
