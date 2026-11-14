# Rencana Migrasi Basis Data (`Database Migration Plan`)

> **Status Dokumen:** `[ADA]` (Dokumentasi rencana migrasi) | **Eksekusi Migrasi Nyata:** `[RENCANA]`
> **Peringatan Mutlak:** Dokumen ini adalah rencana konseptual. **Jangan menjalankan migrasi ke database production tanpa persetujuan dan verifikasi koneksi.**

---

## 1. Status Saat Ini (`[ADA]` vs `[RENCANA]`)

- **Sudah `[ADA]`:** [`backend/prisma/schema.prisma`](../../backend/prisma/schema.prisma) (8 model, 3 enum), [`backend/prisma.config.ts`](../../backend/prisma.config.ts) (Prisma 7 menunjuk direktori `prisma/migrations`), dan [`backend/src/config/prisma.ts`](../../backend/src/config/prisma.ts). Perintah `npx prisma validate` telah terbukti lulus di [`test-results.md`](../09-testing/test-results.md).
- **Masih `[RENCANA]`:** Direktori `backend/prisma/migrations/` belum ada dan belum ada migrasi yang dijalankan ke PostgreSQL Supabase.

---

## 2. Prasyarat Koneksi & Persiapan Lingkungan (`[RENCANA]`)

1. Instance PostgreSQL Supabase telah tersedia dan variabel `DATABASE_URL` (serta `DIRECT_URL` untuk operasi migrasi Prisma 7 pada `prisma.config.ts`) terkonfigurasi aman di `.env` lokal/server (tidak pernah di-commit).
2. Verifikasi skema sebelum migrasi dengan `npx prisma validate`.
3. Pastikan kebijakan migrasi memisahkan lingkungan pengembangan/staging dan production.

---

## 3. Tahapan & Urutan Migrasi yang Aman (`[RENCANA]`)

| Tahap | Aktivitas | Prasyarat | Artefak | Validasi | Risiko | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **M-01** | **Migrasi Awal 8 Model Inti** (`User`, `Category`, `Ebook`, `Order`, `OrderItem`, `Payment`, `Transaction`, `EbookAccess`) | `DATABASE_URL` / `DIRECT_URL` valid; `prisma validate` lulus | `prisma/migrations/<timestamp>_init/` | Verifikasi tabel, enum, FK, dan indeks di PostgreSQL | Koneksi gagal atau konflik tabel lama di Supabase | `[RENCANA]` |
| **M-02** | **Sinkronisasi Prisma Client** (`npx prisma generate`) | Migrasi `M-01` atau skema final siap | `backend/src/generated/prisma/` | `npm run typecheck` lulus | Ketidakcocokan versi client dengan schema | `[RENCANA]` |
| **M-03** | **Migrasi Model Tambahan SAW & Ulasan** (`SawCriterionConfig`, `SawCalculationSnapshot`, `Review`) | Keputusan Terbuka #5, #6, #7, #9, #11 telah dikunci | `prisma/migrations/<timestamp>_saw_and_reviews/` | `prisma validate` + unit/integration test backend | Migrasi berulang bila kriteria SAW berubah | `[RENCANA]` |
| **M-04** | **Migrasi Check Constraint / Indeks Lanjutan** (opsional jika diperlukan) | Pengujian beban & kebutuhan laporan penjualan | Migrasi SQL tambahan | Uji query & constraint negatif ditolak | Lock tabel sementara jika data sudah besar | `[RENCANA]` |

---

## 4. Strategi Backup, Rollback Konseptual & Risiko

- **Backup Sebelum Migrasi:** Sebelum menjalankan migrasi pada database bersama atau production, wajib mengambil *snapshot/backup* database Supabase terlebih dahulu (`[RENCANA]`).
- **Rollback Konseptual:** Prisma Migrate bersifat *forward-only* di production. Apabila terjadi kegagalan skema, siapkan skrip migrasi pembalik (*down migration* manual) atau pulihkan dari backup sebelum migrasi.
- **Dampak Keputusan SAW:** Penambahan model `SawCriterionConfig`, `SawCalculationSnapshot`, dan `Review` ditunda hingga Keputusan #5, #6, #7, #9, dan #11 disahkan agar tidak merusak migrasi awal 8 model inti.
- **Larangan Production:** Dilarang keras menjalankan `prisma migrate dev`, `prisma db push --force-reset`, atau `migrate reset` pada database production.
