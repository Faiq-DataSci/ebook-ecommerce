# Register Kesenjangan Pengembangan (`Development Gap Register`)

**Status:** `[ADA]` (hasil audit aktual struktur, konfigurasi, & tooling pengembangan)  
**Tujuan:** Mencatat inkonsistensi, komponen yang belum tersedia, dan keputusan terbuka yang memengaruhi alur kerja pengembangan sehari-hari.

---

## Daftar Gap & Inkonsistensi Pengembangan

| ID | Gap / Inkonsistensi / Keputusan | Dampak pada Pengembangan | Dokumen Sumber | Status | Tindakan Lanjutan |
|---|---|---|---|---|---|
| **GAP-DEV-01** | Inkonsistensi folder `src/middleware/` (singular: `validate.ts`) vs `src/middlewares/` (plural: `auth`, `error`, `rate-limit`) | Developer baru dapat bingung saat menempatkan middleware baru | `backend/src/` | `[ADA]` konflik | Satukan ke satu konvensi folder pada refactor terencana |
| **GAP-DEV-02** | Inkonsistensi `backend/.env.example` vs `env.ts` (dan dokumen lama `JWT_SECRET`): `CORS_ORIGINS` belum ada di `.env.example` | Setup `.env` lokal bisa melewatkan konfigurasi CORS | `backend/.env.example`, `env.ts` | `[ADA]` konflik | Selaraskan `.env.example` dengan seluruh field `env.ts` |
| **GAP-DEV-03** | `web/pengunjung-web` masih memakai `.jsx` | Belum ada type-checking TypeScript di `pengunjung-web` | `web/pengunjung-web/package.json` | `[ADA]` kondisi | Pertimbangkan migrasi ke TypeScript seperti `admin-web` |
| **GAP-DEV-04** | Belum ada ESLint di `backend/` | Pemeriksaan gaya kode backend baru bergantung pada `tsc` | `backend/package.json` | `[RENCANA]` | Tambahkan konfigurasi ESLint TypeScript di `backend/` |
| **GAP-DEV-05** | Belum ada struktur `routes/`, `controllers/`, `services/`, `validators/` di `backend/src/` | Endpoint bisnis belum memiliki struktur folder implementasi | `backend/src/` | `[RENCANA]` | Buat struktur lapis sesuai fase implementasi backend |
| **GAP-DEV-06** | Belum ada `backend/prisma/migrations/` | Skema database belum termigrasi ke PostgreSQL | `backend/prisma/` | `[RENCANA]` | Jalankan `prisma migrate dev` saat koneksi Supabase siap |
| **GAP-DEV-07** | Belum ada seed data `"DATA SIMULASI"` | Pengembangan UI butuh data awal yang konsisten | `database-seeding-plan.md` | `[RENCANA]` | Buat `prisma/seed.ts` sesuai urutan FK |
| **GAP-DEV-08** | Belum ada `backend/tests/fixtures/` | Belum ada data uji terstruktur untuk test bisnis & SAW | `backend/tests/` | `[RENCANA]` | Tambahkan fixtures berlabel `"DATA SIMULASI"` |
| **GAP-DEV-09** | Belum ada konfigurasi test coverage di Vitest | Persentase cakupan pengujian belum terukur otomatis | `backend/vitest.config.ts` | `[RENCANA]` | Tambahkan `@vitest/coverage-v8` bila diperlukan |
| **GAP-DEV-10** | `.github/workflows/ci.yml` masih berupa placeholder | Build & test belum berjalan otomatis pada PR | `.github/workflows/ci.yml` | `[ADA]` placeholder | Implementasikan pipeline CI sesuai `deployment-ci-cd.md` |
| **GAP-DEV-11** | Belum ada Husky / `lint-staged` | Pre-commit check masih dijalankan manual | Root repository | `[RENCANA]` | Pertimbangkan setup pre-commit hook |
| **GAP-DEV-12** | Belum ada package PDF viewer di `mobile/ebook_store/pubspec.yaml` | Fitur baca PDF in-app belum bisa dibangun | `pubspec.yaml` | `[RENCANA]` | Pilih & tambahkan package PDF viewer saat fase mobile |
| **GAP-DEV-13** | Mobile masih berupa template counter app (`main.dart`) | Belum ada layar bisnis, Riverpod provider, & Dio client | `mobile/ebook_store/lib/` | `[RENCANA]` | Bangun arsitektur 3 lapis setelah backend & admin-web siap |
| **GAP-DEV-14** | Web (`admin-web` & `pengunjung-web`) masih template Vite | Belum ada halaman & komponen bisnis | `web/*/src/` | `[RENCANA]` | Bangun UI neo-brutalism sesuai urutan `AGENTS.md` |
| **GAP-DEV-15** | Belum ada SDK/integrasi payment gateway di `backend/package.json` | Pembayaran & webhook belum bisa dikembangkan | `backend/package.json` | `[RENCANA]` | Pasang/implementasikan adapter Midtrans/Xendit |
| **GAP-DEV-16** | **Keputusan #10:** Platform hosting backend | Memengaruhi setup environment & entry point produksi | `keputusan-terbuka.md` | `[RENCANA]` | Kunci keputusan sebelum setup CD produksi |
| **GAP-DEV-17** | **Keputusan #8:** Nama resmi aplikasi & logo | Memengaruhi branding & `applicationId` mobile | `keputusan-terbuka.md` | `[RENCANA]` | Kunci sebelum rilis UI/mobile |
| **GAP-DEV-18** | **Keputusan #5 & #9:** Bobot & jumlah kriteria SAW | Memengaruhi struktur `saw.service` & test manual match | `keputusan-terbuka.md` | `[RENCANA]` | Finalisasi sebelum implementasi SAW |
| **GAP-DEV-19** | **Keputusan #11:** Snapshot historis SAW | Memengaruhi kebutuhan model database tambahan | `keputusan-terbuka.md` | `[RENCANA]` | Tentukan kebutuhan tabel snapshot |
