# Lingkungan Pengujian (`Test Environment`)

> **Status Dokumen:** `[ADA]` (Dokumentasi prasyarat & lingkungan aktual) | **Lingkungan Integrasi Penuh:** `[RENCANA]`
> **Referensi:** [`docs/09-testing/test-results.md`](../09-testing/test-results.md), [`backend/vitest.config.ts`](../../backend/vitest.config.ts), [`AGENTS.md`](../../AGENTS.md)

---

## 1. Lingkungan Eksekusi Aktual (`[ADA]`)

- **Sistem Operasi & Shell:** Windows PowerShell 5.1
- **Runtime Node.js & npm:** Node.js `v24.15.0`, npm `11.12.1`
- **Flutter & Dart SDK:** Flutter `3.44.0`, Dart `3.12.0`
- **Konfigurasi Test Backend (`backend/vitest.config.ts`):** `environment: 'node'`, `include: ['tests/**/*.test.ts']`

---

## 2. Matriks Prasyarat & Konfigurasi per Komponen

| Komponen | Prasyarat | Konfigurasi | Catatan | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Backend (`backend/`)** | `npm --prefix backend install`, `backend/.env` (dari `.env.example`), `DATABASE_URL` & `DIRECT_URL` (untuk uji DB) | `vitest.config.ts` (`node`, `tests/**/*.test.ts`), ESM `.js` import | Saat ini baru 2 file tes fondasi berjalan tanpa koneksi DB nyata | `[ADA]` (fondasi) / `[RENCANA]` (DB integrasi) |
| **Admin Web (`web/admin-web/`)** | `npm --prefix web/admin-web install`, `web/admin-web/.env` | `package.json` (`eslint`, `tsc --noEmit`, `vite build`) | Variabel `VITE_*` hanya boleh berisi konfigurasi publik | `[ADA]` (lint/build) / `[RENCANA]` (UI test) |
| **Pengunjung Web (`web/pengunjung-web/`)** | `npm --prefix web/pengunjung-web install`, `web/pengunjung-web/.env` | `package.json` (`eslint`, `vite build`) | Tidak ada secret di bundle frontend | `[ADA]` (lint/build) / `[RENCANA]` (UI test) |
| **Mobile (`mobile/ebook_store/`)** | `flutter pub get` pada `mobile/ebook_store` | `pubspec.yaml` (`flutter_test`, `flutter_lints`, `Dart ^3.12.0`) | Pada Windows, `flutter analyze` / build symlink plugin mungkin memerlukan **Windows Developer Mode** aktif | `[ADA]` (analyze/template) / `[RENCANA]` (bisnis) |
| **Integrasi Eksternal (`[RENCANA]`)** | Sandbox payment gateway (Midtrans/Xendit), tunneling lokal webhook (mis. ngrok), PostgreSQL Supabase test/staging, bucket Storage test | `.env.test` terpisah dengan `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `WEBHOOK_SECRET` sandbox | Terpisah total dari lingkungan production | `[RENCANA]` |

---

## 3. Pemisahan Lingkungan & Larangan Mutlak

1. **Dilarang menggunakan secret production di lingkungan test.** Gunakan kredensial sandbox dan file `.env.test` lokal yang tidak di-commit.
2. **Dilarang menjalankan tes integrasi terhadap database production.** Gunakan instance PostgreSQL Supabase test/staging terpisah.
3. **Dilarang menggunakan akun nyata atau email nyata** dalam data uji; gunakan identitas simulasi berlabel `"DATA SIMULASI"`.
