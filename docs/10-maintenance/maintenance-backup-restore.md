# Strategi Backup & Restore (`Backup & Restore`)

**Status:** `[RENCANA]` — Rencana strategi backup dan pemulihan data untuk lingkungan produksi (kontrol versi source code Git sudah `[ADA]`).  
**Referensi Utama:** [`docs/04-database/database-migration-plan.md`](../04-database/database-migration-plan.md), [`docs/05-deployment/deployment-checklist.md`](../05-deployment/deployment-checklist.md), [`.gitignore`](../../.gitignore).

---

## 1. Tujuan

Mencegah kehilangan data transaksi, katalog, dan konfigurasi penting serta memastikan sistem dapat dipulihkan dalam target waktu yang terukur apabila terjadi kegagalan migrasi, kerusakan data, atau insiden infrastruktur.

---

## 2. Strategi Backup per Komponen

| Komponen | Jenis Backup | Frekuensi | Retensi | Tool / Mekanisme | Status |
|---|---|---|---|---|---|
| **PostgreSQL Supabase** | Full database dump / snapshot | Harian + setiap pra-migrasi | 30 hari | Supabase Automated Backup / `pg_dump` | `[RENCANA]` |
| **Supabase Storage (File PDF)** | Metadata `storagePath` di DB wajib ter-backup; file PDF dapat di-reupload oleh Admin (atau mirror storage jika dibutuhkan) | Mengikuti backup DB | 30 hari (metadata DB) | Supabase Dashboard / Storage sync | `[RENCANA]` |
| **Environment Variables** | Salinan terenkripsi di *password/secret manager* tim (wajib di luar Git) | Setiap ada perubahan konfigurasi | Mengikuti siklus rilis aktif | Secret Manager Platform Hosting / Vault terenkripsi | `[RENCANA]` |
| **Source Code Monorepo** | Version control terdistribusi | Setiap commit / push | Permanen di riwayat Git | Git + remote repository privat | `[ADA]` |

---

## 3. Prosedur Backup Manual (`[RENCANA]`)

> **Aturan Pra-Migrasi:** Tim **wajib** mengambil backup database sebelum menjalankan `prisma migrate deploy` atau perubahan skema apa pun pada staging/produksi.

1. **Via Supabase Dashboard:**
   - Masuk ke proyek Supabase > **Settings** > **Database** > **Backups**, lalu picu/unduh snapshot terbaru.
2. **Via `pg_dump` (Windows PowerShell, memakai `DIRECT_URL` port `5432`):**
   ```powershell
   # DATA SIMULASI - gunakan placeholder dan jangan simpan hasil dump di repository Git
   pg_dump "postgresql://USER:PASSWORD@HOST:5432/postgres" -F c -f backup-simulasi.dump
   ```
   Pastikan file backup lokal tidak pernah masuk ke Git (ekstensi `*.sql` dan `*.bak` sudah diabaikan di [`.gitignore`](../../.gitignore) `[ADA]`).

---

## 4. Prosedur Restore (`[RENCANA]`)

1. **Via Supabase Dashboard:**
   - Masuk ke **Settings** > **Database** > **Backups**, pilih titik backup stabil sebelum insiden/migrasi gagal, lalu jalankan *Restore*.
2. **Via `pg_restore` (Windows PowerShell):**
   ```powershell
   # DATA SIMULASI - pastikan target database benar sebelum eksekusi
   pg_restore --clean --if-exists -d "postgresql://USER:PASSWORD@HOST:5432/postgres" backup-simulasi.dump
   ```
3. **Sinkronisasi & Verifikasi Pasca-Restore:**
   - Jalankan `npx --prefix backend prisma generate` untuk memastikan Prisma Client selaras.
   - Restart layanan backend dan verifikasi `GET /api/v1/health` mengembalikan `200 OK` (`[ADA]` endpoint).
   - Jalankan regression test dan pemeriksaan integritas data (`Order`, `Payment`, `Transaction`, `EbookAccess`).

---

## 5. Target RPO & RTO (`[RENCANA]`)

| Metrik | Target | Keterangan | Status |
|---|---|---|---|
| **RPO (*Recovery Point Objective*)** | Maksimal **24 jam** | Mengacu pada jadwal backup penuh harian database Supabase | `[RENCANA]` |
| **RTO (*Recovery Time Objective*)** | Maksimal **2 jam** | Estimasi waktu restore snapshot DB, verifikasi Prisma, restart backend, dan smoke test | `[RENCANA]` |

---

## 6. Pengujian Restore & Pre-Migrasi (`[RENCANA]`)

- **Uji Restore Berkala (Kuartalan):** Lakukan simulasi restore dari backup produksi ke instance database *staging* setiap kuartal untuk memastikan file backup tidak korup dan data relasional (`User`, `Ebook`, `Order`, `Transaction`, `EbookAccess`) utuh.
- **Backup Pra-Migrasi Wajib:** Jika eksekusi `prisma migrate deploy` gagal atau menimbulkan anomali, hentikan pembaruan dan segera pulihkan ke snapshot pra-migrasi.
