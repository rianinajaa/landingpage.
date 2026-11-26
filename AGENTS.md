<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# AGENTS.md

Situs marketing studio digital. Spesifikasi ada di `docs/PRD.md` dan `docs/design.md`. Ikuti keduanya. Jika kode dan dokumen bentrok, dokumen menang sampai ada perubahan yang disengaja di dokumen itu.

## Misi fase 1

Bangun situs yang terasa seperti [fraxbit.com](https://fraxbit.com/) dalam struktur dan craft, dengan merek, copy, dan bukti yang bukan milik mereka.

Fase 1 mencakup:

- `/`
- `/services` dan empat slug: `web-design`, `web-development`, `growth`, `ai`
- `/portfolio` dan `/portfolio/[slug]`
- `/about`, `/contact`, `/policies`

Jangan membangun blog, industri, referral, atau halaman produk sampai fase 1 lulus kriteria di PRD bagian 16.

## Stack

- Next.js App Router, TypeScript.
- Tailwind CSS v4, token di `app/globals.css` sesuai `docs/design.md`.
- Font: Geist dan Geist Mono.
- Konten: modul di `content/`. Tanpa CMS dan tanpa MDX di fase 1.
- Formulir: Server Action. Email hanya jika `RESEND_API_KEY` ada.

Jangan menambah GSAP, Three.js, atau Lenis pada langkah pertama. Intro CSS dan reveal IntersectionObserver sudah cukup. Tambah pustaka gerak hanya jika satu interaksi di design.md tidak bisa dicapai dengan CSS.

## Perintah

```bash
npm run dev
npm run build
npm run lint
```

Periksa homepage di lebar 390 dan 1280 sebelum menyelesaikan tugas UI.

## Struktur

```
app/
  layout.tsx
  page.tsx
  globals.css
  sitemap.ts
  robots.ts
  services/page.tsx
  services/[slug]/page.tsx
  portfolio/page.tsx
  portfolio/[slug]/page.tsx
  about/page.tsx
  contact/page.tsx
  policies/page.tsx
components/
  site/        header, footer, tombol, form, bagian homepage
content/
  brand.ts
  navigation.ts
  services.ts
  projects.ts
  testimonials.ts
public/
  og.png
  work/        sampul proyek, dibuat sendiri
```

Komponen bagian homepage tinggal di `components/site/` dan menerima data. Jangan menaruh array proyek di dalam JSX.

## Aturan konten

- Semua string yang terlihat pengguna dibaca dari `content/`.
- Merek default `Northline` hanya placeholder. Jangan mengarang alamat hukum, nomor pajak, atau klien nyata.
- Statistik harus sesuai `content/brand.ts`. Jangan menulis 240 proyek, 22 negara, atau 7 tahun.
- Testimoni kosong berarti bagian itu tidak dirender.
- Proyek `sample: true` menampilkan label sampel.
- Dilarang menyalin teks, gambar, logo, video, atau review fraxBIT. Dilarang ada string `fraxbit` di repo.
- Jangan mengarang metrik hasil proyek.

## Perilaku yang harus ada

- `data-header-theme` pada setiap section: `dark`, `light`, atau `accent`. Header membaca section di bawahnya.
- Titik terakhir pada judul hero dan judul bagian berwarna `--color-accent`.
- Tombol mengikuti varian di design.md, termasuk chip panah.
- Form: validasi field, honeypot, keadaan kirim, keadaan sukses. Tanpa kunci email, sukses tetap tampil dan server mencatat permintaan.
- `prefers-reduced-motion: reduce` menampilkan semua konten tanpa animasi masuk.
- Metadata, sitemap, dan JSON-LD sesuai PRD bagian 13.

## Hal yang sering rusak

- Header putih di atas hero gelap, atau header ink di atas CTA merah.
- Judul hero yang terpotong di 390px. Skala memakai `min(..., 19svh)` dan `text-wrap: balance`.
- Marquee yang membuat scroll horizontal di halaman.
- Pesan error aksen 12px di atas putih. Ikuti aturan kontras di design.md.
- Menyembunyikan Blog yang belum ada dengan tautan mati. Hapus dari navigasi sampai fase 2.
- Memasang cookie banner tanpa analitik.

## Saat mengubah desain

Ubah `docs/design.md` dulu, baru kode. Jangan menambah warna, ukuran judul, atau urutan section homepage di luar dokumen.

## Selesai berarti

`npm run build` lulus, rute fase 1 terbuka, dan kriteria PRD bagian 16 terpenuhi. Jangan menyatakan UI selesai hanya dari tangkapan layar satu layar hero.
