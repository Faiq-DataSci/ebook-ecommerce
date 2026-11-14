# Matriks Keterlacakan Pemeliharaan (`Maintenance Traceability Matrix`)

**Status:** `[ADA]` (pemetaan kebutuhan terhadap dokumen pemeliharaan) | `[RENCANA]` (eksekusi operasional pasca-rilis).  
**Referensi Utama:** [`docs/00-project/requirements.md`](../00-project/requirements.md), [`AGENTS.md`](../../AGENTS.md), seluruh dokumen di `docs/10-maintenance/`.

---

## Matriks Keterlacakan Kebutuhan & Aturan ke Prosedur Pemeliharaan

| Requirement ID / Aturan | Kategori | Prosedur Pemeliharaan | Dokumen Referensi | Frekuensi | Status |
|---|---|---|---|---|---|
| **`NFR-01`** | Keamanan — Autentikasi & RBAC | Rotasi `SUPABASE_SERVICE_ROLE_KEY`, audit middleware `authenticate`/`authorize` & respons `401`/`403` | [`maintenance-security.md`](./maintenance-security.md) | Per 6 bulan / Per rilis | `[RENCANA]` |
| **`NFR-02`** | Keamanan — Perlindungan File PDF | Verifikasi bucket `ebooks-private` tetap privat, audit TTL signed URL (`300s`), pembersihan file orphan | [`maintenance-security.md`](./maintenance-security.md), [`maintenance-database.md`](./maintenance-database.md) | Bulanan / Per rilis | `[RENCANA]` |
| **`NFR-03`** | Keamanan — Kredensial & Secret | Rotasi berkala secret, pemindaian secret pra-rilis, verifikasi `.gitignore` & pemisahan `VITE_*` | [`maintenance-security.md`](./maintenance-security.md) | Per 3–6 bulan / Per rilis | `[ADA]` (aturan & `.gitignore`) / `[RENCANA]` (rotasi & scan) |
| **`NFR-04`** | Keamanan — Input & Rate Limiting | Verifikasi rate limiter terpasang di `app.ts`, audit skema validasi Zod & header Helmet | [`maintenance-security.md`](./maintenance-security.md) | Per rilis | `[ADA]` (Zod & Helmet) / `[RENCANA]` (rate limiter mount) |
| **`NFR-06`** | Keandalan — Atomisitas & Idempotensi | Audit log webhook payment gateway, verifikasi `prisma.$transaction`, job pembersihan order `EXPIRED` | [`maintenance-database.md`](./maintenance-database.md), [`maintenance-incident-response.md`](./maintenance-incident-response.md) | Harian / Mingguan | `[RENCANA]` |
| **`NFR-07`** | Integritas Data — Presisi Numerik | Audit tipe `Decimal(12, 2)` pada transaksi dan verifikasi presisi perhitungan SAW backend | [`maintenance-database.md`](./maintenance-database.md) | Per rilis / Saat perubahan SAW | `[ADA]` (skema `Decimal`) / `[RENCANA]` (audit) |
| **`NFR-08`** | Kepatuhan Kode & Maintainability | Jalankan `typecheck`, `lint`, `test`, `build`, `prisma:validate`, `flutter analyze`, `flutter test` | [`maintenance-checklist.md`](./maintenance-checklist.md), [`maintenance-update-procedures.md`](./maintenance-update-procedures.md) | Per rilis | `[ADA]` (perintah & 5 tes) / `[RENCANA]` (cakupan bisnis) |
| **Health Check** | Ketersediaan Layanan | Pemantauan berkala `GET /api/v1/health` dan fungsi `checkDatabaseConnection()` | [`maintenance-monitoring.md`](./maintenance-monitoring.md) | Harian (tiap 1 menit di prod) | `[ADA]` (endpoint & helper) / `[RENCANA]` (monitoring) |
| **Backup & Pemulihan DB** | Keberlangsungan Data | Backup harian otomatis Supabase, backup manual pra-migrasi, serta uji restore kuartalan | [`maintenance-backup-restore.md`](./maintenance-backup-restore.md) | Harian / Pra-migrasi / Kuartalan | `[RENCANA]` |
| **Incident Response** | Penanganan Gangguan | Klasifikasi `P1`–`P4`, SLA respons, playbook skenario kritis, dan penyusunan post-mortem | [`maintenance-incident-response.md`](./maintenance-incident-response.md) | Saat insiden terjadi | `[RENCANA]` |
| **Aturan `AGENTS.md` #6** | Kejujuran Status Dokumentasi | Sinkronisasi label `[ADA]` / `[RENCANA]` serta catatan `CHANGELOG.md` setelah fitur teruji | [`maintenance-guide.md`](./maintenance-guide.md), [`maintenance-checklist.md`](./maintenance-checklist.md) | Setiap perubahan / Bulanan | `[ADA]` (aturan) |
| **Aturan `AGENTS.md` #7** | Tahapan & Urutan Update | Eksekusi update dan rollback terurut (`Database/Backend -> Admin Web -> Pengunjung Web & Mobile`) | [`maintenance-update-procedures.md`](./maintenance-update-procedures.md) | Per rilis | `[ADA]` (aturan) / `[RENCANA]` (rilis prod) |
