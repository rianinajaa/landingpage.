# landingpage.

Situs marketing studio digital, fase 1. Merek kerja: **Northline**, diganti lewat `content/brand.ts`.

- [PRD](docs/PRD.md)
- [Design](docs/design.md)
- [AGENTS.md](AGENTS.md)

## Menjalankan

```bash
npm install
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000).

`npm run build` untuk produksi. `npm run lint` untuk pemeriksaan.

Formulir mencatat permintaan di log server. Email hanya terkirim jika `RESEND_API_KEY` dan `RESEND_FROM` diisi. Alamat situs untuk metadata memakai `NEXT_PUBLIC_SITE_URL`.

Sampel proyek dan review ditandai sebagai sample. Jangan menampilkan angka atau klien yang belum nyata.
