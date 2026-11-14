# Pemeliharaan Basis Data & Storage (`Database Maintenance`)

**Status:** `[RENCANA]` — Prosedur pemeliharaan operasional pasca-rilis (konfigurasi dasar koneksi & skema Prisma 7 sudah `[ADA]`).  
**Referensi Utama:** [`backend/prisma/schema.prisma`](../../backend/prisma/schema.prisma), [`backend/prisma.config.ts`](../../backend/prisma.config.ts), [`backend/src/config/prisma.ts`](../../backend/src/config/prisma.ts), [`docs/04-database/database-migration-plan.md`](../04-database/database-migration-plan.md), [`docs/04-database/database-security.md`](../04-database/database-security.md).

---

## 1. Arsitektur Koneksi Database (`[ADA]` Konfigurasi / `[RENCANA]` Operasional)

- **Engine & ORM:** PostgreSQL Supabase dengan Prisma 7 (`@prisma/adapter-pg` + `pg` Pool) pada [`backend/src/config/prisma.ts`](../../backend/src/config/prisma.ts) (`[ADA]`).
- **`DATABASE_URL` (Port `6543` — Transaction Pooler):** Digunakan oleh aplikasi backend saat runtime (`?pgbouncer=true`) (`[ADA]` di `backend/.env.example`).
- **`DIRECT_URL` (Port `5432` — Direct Connection):** Digunakan oleh Prisma CLI (`prisma.config.ts`) untuk menjalankan migrasi skema (`[ADA]` di `backend/prisma.config.ts`).

> **Aturan Keras:** Jangan pernah memakai `DATABASE_URL` port `6543` untuk perintah `prisma migrate`, karena koneksi migrasi dapat menggantung atau gagal.

---

## 2. Pemeliharaan Rutin Database

| ID | Aktivitas | Frekuensi | Perintah / Tool | Prasyarat | Status |
|---|---|---|---|---|---|
| **DB-01** | Verifikasi backup otomatis Supabase berjalan sukses | Harian / Mingguan | Supabase Dashboard (Database > Backups) | Proyek Supabase produksi aktif | `[RENCANA]` |
| **DB-02** | Manual backup sebelum setiap migrasi skema | Setiap sebelum migrasi | `pg_dump` atau Supabase Dashboard Snapshot | Akses `DIRECT_URL` & otorisasi DBA | `[RENCANA]` |
| **DB-03** | Optimasi statistik & ruang tabel (`VACUUM` / `ANALYZE`) | Mingguan / Bulanan | PostgreSQL / Supabase SQL Editor | Pemantauan bloat & performa query | `[RENCANA]` |
| **DB-04** | Cek kesehatan koneksi database dari aplikasi | Berkala / Saat Startup | Fungsi `checkDatabaseConnection()` (`SELECT 1`) di `prisma.ts` | `DATABASE_URL` terkonfigurasi valid | `[ADA]` (fungsi) / `[RENCANA]` (jadwal) |
| **DB-05** | Pantau ukuran tabel, indeks, dan kuota penyimpanan DB | Mingguan | Supabase Dashboard (Database Reports) | Akses dashboard proyek Supabase | `[RENCANA]` |
| **DB-06** | Tinjau *slow queries* pada katalog, order, dan laporan | Mingguan | Supabase Query Performance / `pg_stat_statements` | Beban trafik produksi aktif | `[RENCANA]` |
| **DB-07** | Cleanup / arsip data lama (pesanan `EXPIRED` lama, log lama) | Bulanan / Kuartalan | Script pemeliharaan terjadwal sesuai kebijakan retensi | Kebijakan retensi data disetujui | `[RENCANA]` |

---

## 3. Scheduled Job: Pesanan Kedaluwarsa (`[RENCANA]`)

Sesuai alur transaksi proyek dan skema `Order` (`status`, `expiresAt`) pada `schema.prisma`:
1. **Target Data:** Record `Order` dengan `status = PENDING` dan `expiresAt < NOW()`.
2. **Aksi:** Perbarui `Order.status` menjadi `EXPIRED` (dan selaraskan `Payment` terkait yang masih `PENDING` menjadi `EXPIRED` dalam transaksi atomik jika belum kedaluwarsa).
3. **Eksekutor:** Cron job backend atau *Supabase Scheduled Function* berkala (mis. setiap 5–15 menit).
4. **Batasan Mutlak:** Job **dilarang keras** mengubah status pesanan yang sudah bernilai `PAID`, `FAILED`, atau `CANCELLED`.

---

## 4. Prosedur Migrasi & Rollback Database (`[RENCANA]`)

### A. Prosedur Migrasi Aman
1. **Backup Database:** Ambil backup/snapshot database sebelum menyentuh skema (lihat [`maintenance-backup-restore.md`](./maintenance-backup-restore.md)).
2. **Validasi Skema:** Jalankan `npm --prefix backend run prisma:validate` (`npx prisma validate`) (`[ADA]` skrip terbukti lulus).
3. **Eksekusi Migrasi:**
   - Di *development*: `npx --prefix backend prisma migrate dev --name <nama_migrasi>` (`[RENCANA]`).
   - Di *staging/production*: `npx --prefix backend prisma migrate deploy` menggunakan `DIRECT_URL` port `5432` (`[RENCANA]`).
4. **Generate Client:** Jalankan `npx --prefix backend prisma generate` untuk menyinkronkan `backend/src/generated/prisma/` (`[RENCANA]`).
5. **Verifikasi Kesehatan:** Pastikan `GET /api/v1/health` mengembalikan `200 OK` (`[ADA]`) dan `checkDatabaseConnection()` sukses.
6. **Regression Test:** Jalankan `npm --prefix backend test` dan smoke test endpoint kritis (`[RENCANA]`).

### B. Prosedur Rollback Migrasi (`[RENCANA]`)
- Prisma Migrate bersifat *forward-only* di produksi.
- Jika migrasi gagal tercatat sebelum perubahan diterapkan atau perlu ditandai batal: evaluasi `npx prisma migrate resolve --rolled-back <migration_name>` (`[RENCANA]`).
- Jika perubahan skema sudah telanjur merusak data/relasi di produksi: hentikan trafik penulisan dan lakukan **restore dari backup pra-migrasi** atau terapkan migrasi perbaikan maju (*forward-fix*).
- **Larangan:** Dilarang menjalankan `prisma migrate dev`, `prisma db push --force-reset`, atau `prisma migrate reset` pada database produksi.

---

## 5. Keamanan Basis Data

| Kontrol Keamanan | Deskripsi | Status |
|---|---|---|
| **Akses DB Eksklusif Backend** | Klien web & mobile dilarang terhubung langsung ke PostgreSQL; seluruh query melalui backend | `[ADA]` (arsitektur) |
| **Isolasi `SUPABASE_SERVICE_ROLE_KEY`** | Service role key hanya berada di environment backend, dilarang di `VITE_*` & Flutter | `[ADA]` (aturan) |
| **Query Terparameter Prisma** | Menghindari SQL injection melalui ORM Prisma | `[ADA]` (ORM) |
| **Integritas Relasi `onDelete: Restrict`** | Mencegah penghapusan permanen `Category`, `Ebook`, `User`, `Order`, atau `Payment` yang terikat transaksi | `[ADA]` (di `schema.prisma`) |

---

## 6. Pemeliharaan Supabase Storage (`ebooks-private`)

- **Privasi Bucket:** Bucket `SUPABASE_EBOOK_BUCKET` (`ebooks-private`) wajib berstatus **Private** tanpa policy baca publik (`[ADA]` keputusan & aturan).
- **Pemantauan Ukuran Storage:** Cek kapasitas pemakaian file PDF & cover secara berkala di dashboard Supabase (`[RENCANA]`).
- **Pembersihan File Orphan:** Identifikasi dan hapus file PDF di storage yang tidak lagi dirujuk oleh `Ebook.storagePath` mana pun (khususnya untuk draf yang dibatalkan, **bukan** e-book yang sudah dibeli pelanggan) (`[RENCANA]`).
- **Audit TTL Signed URL:** Pastikan durasi *signed URL* dari helper `createPrivatePdfSignedUrl` tetap pendek (default `300` detik) (`[ADA]` helper / `[RENCANA]` audit runtime).

---

## 7. Ringkasan Status Komponen Database

| Komponen | Status | Pemeliharaan | Catatan |
|---|---|---|---|
| `backend/prisma/schema.prisma` (8 model, 3 enum) | `[ADA]` | Validasi dengan `prisma:validate` sebelum migrasi | Belum ada folder `prisma/migrations/` |
| `backend/src/config/prisma.ts` (`pg` Pool & helper) | `[ADA]` | Gunakan `checkDatabaseConnection()` & `disconnectDatabase()` | Hook `disconnectDatabase()` di `server.ts` masih `[RENCANA]` |
| `backend/prisma.config.ts` (`DIRECT_URL`) | `[ADA]` | Pastikan selalu memakai port `5432` untuk migrasi | Jangan pakai pooler `6543` untuk CLI |
| Backup, Cleanup Job, & Audit Log DB | `[RENCANA]` | Aktifkan sebelum go-live produksi | Menunggu Keputusan #10 & kesiapan produksi |
