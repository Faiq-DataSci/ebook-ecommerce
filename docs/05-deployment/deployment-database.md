# Panduan Deployment Database & Storage (`PostgreSQL Supabase + Prisma 7`)

**Status:** `[RENCANA]` (migrasi database & konfigurasi produksi belum dijalankan; skema & adapter Prisma 7 `[ADA]`)  
**Target Kode:** `backend/prisma/schema.prisma`, `backend/prisma.config.ts`, `backend/src/config/prisma.ts`, `backend/src/config/supabase.ts`  
**Referensi Utama:** [`AGENTS.md`](../../AGENTS.md), [`docs/04-database/`](../04-database/).

---

## 1. Konfigurasi Prisma 7 & Supabase PostgreSQL (`[ADA]`)

Berdasarkan verifikasi langsung pada file konfigurasi backend:

1. **`backend/prisma.config.ts` (`[ADA]`):**
   - Lokasi skema: `prisma/schema.prisma`.
   - Lokasi migrasi target: `prisma/migrations`.
   - Datasource URL untuk CLI Prisma: `process.env.DIRECT_URL ?? process.env.DATABASE_URL ?? ''`.
2. **`backend/src/config/prisma.ts` (`[ADA]`):**
   - Menggunakan driver adapter `@prisma/adapter-pg` (`PrismaPg`) dan `pg.Pool` yang membaca `env.DATABASE_URL`.
   - Mengekspor `prisma`, `checkDatabaseConnection()`, dan `disconnectDatabase()`.
3. **Pemisahan Port Koneksi Supabase (`[ADA]` di `backend/.env.example`):**
   - **`DATABASE_URL` (Port `6543` — Transaction Pooler / PgBouncer):** Digunakan oleh aplikasi runtime (`?pgbouncer=true`) agar efisien terhadap batas koneksi.
   - **`DIRECT_URL` (Port `5432` — Direct Connection):** Digunakan oleh CLI Prisma (`prisma migrate`, `prisma db push`) karena perintah DDL/migrasi tidak stabil melalui transaction pooler port `6543`.

---

## 2. Status Skema & Migrasi (`[ADA]` vs `[RENCANA]`)

- **Skema (`backend/prisma/schema.prisma` — `[ADA]`):** Berisi 8 model (`User`, `Category`, `Ebook`, `Order`, `OrderItem`, `Payment`, `Transaction`, `EbookAccess`) dan 3 enum (`UserRole`, `OrderStatus`, `PaymentStatus`).
- **Direktori `backend/prisma/migrations/`:** **Belum ada (`[RENCANA]`)**. Belum ada migrasi yang dijalankan ke database Supabase.
- **Aturan Instalasi Prisma 7 (`AGENTS.md`):** Sebelum memperbarui atau menginstal ulang Prisma, wajib memeriksa `npm view prisma dist-tags` agar tidak memasang versi RC yang bertag `latest`.

### Alur Migrasi Target (`[RENCANA]`)

- **Development / Staging Awal:** `npx prisma migrate dev --name init` (menggunakan `DIRECT_URL`).
- **Production / CI:** `npx prisma migrate deploy` (non-interaktif, hanya menerapkan migrasi yang sudah ada di `prisma/migrations/`), diikuti `npx prisma generate`.
- **Validasi Skema:** `npm run prisma:validate` (tanpa koneksi database langsung jika URL tersedia/valid).

---

## 3. Konfigurasi Supabase Storage (`Bucket Privat`)

Berdasarkan `backend/src/config/env.ts`, `backend/src/config/supabase.ts`, dan `backend/src/integrations/storage/supabase-storage.ts` (`[ADA]`):

- **Nama Bucket Default:** `ebooks-private` (dikontrol melalui `SUPABASE_EBOOK_BUCKET`).
- **Status Visibilitas Bucket:** Wajib **PRIVAT** (tidak boleh *public bucket*).
- **Mekanisme Akses File PDF:**
  - Aplikasi klien (`admin-web`, `pengunjung-web`, `ebook_store`) tidak boleh mengakses storage privat secara langsung menggunakan service role key.
  - Backend membuat klien admin menggunakan `SUPABASE_SERVICE_ROLE_KEY` dan menerbitkan **signed URL sementara** hanya setelah memverifikasi hak akses di tabel `ebook_accesses` (`[RENCANA]` endpoint).
- **Kebijakan Upload & Ukuran File (`[RENCANA]`):** Tentukan batas ukuran maksimal file PDF/cover serta tipe MIME yang diizinkan di bucket Supabase dan validasi backend.

---

## 4. Strategi Backup, Pemulihan, & Non-Hard-Delete (`[RENCANA]`)

1. **Backup Database Supabase (`[RENCANA]`):** Aktifkan backup harian otomatis dan Point-in-Time Recovery (PITR) sesuai paket Supabase yang dipilih sebelum go-live produksi.
2. **Uji Restore Berkala (`[RENCANA]`):** Lakukan uji restore backup ke instance staging secara berkala untuk memverifikasi integritas data transaksi dan `ebook_accesses`.
3. **Perlindungan Data Transaksional:** Sesuai aturan keamanan proyek, e-book yang sudah pernah dibeli tidak boleh di-*hard-delete* agar riwayat `OrderItem`, `Transaction`, dan `EbookAccess` pelanggan tetap utuh.
