# Checklist Pemeliharaan Berkala (`Maintenance Checklist`)

**Status:** `[RENCANA]` — Checklist operasional pasca-rilis (item perintah verifikasi lokal dan aturan dokumentasi sudah `[ADA]`).  
**Referensi Utama:** [`docs/05-deployment/deployment-checklist.md`](../05-deployment/deployment-checklist.md), [`docs/09-testing/test-results.md`](../09-testing/test-results.md), [`CHANGELOG.md`](../../CHANGELOG.md), [`AGENTS.md`](../../AGENTS.md).

---

## 1. Checklist Harian (`[RENCANA]`)

| ID | Item Pemeriksaan | Cara Cek | Status |
|---|---|---|---|
| **CHK-D01** | Endpoint health check backend merespons normal | Panggil `GET /api/v1/health` -> pastikan HTTP `200 OK` (`status: "ok"`) | `[ADA]` (endpoint) / `[RENCANA]` (rutin) |
| **CHK-D02** | Tidak ada lonjakan error `5xx` di backend | Periksa error log server / agregator log | `[RENCANA]` |
| **CHK-D03** | Uptime web & API berada di atas target SLA | Periksa dashboard uptime monitoring | `[RENCANA]` |
| **CHK-D04** | Callback webhook payment gateway berjalan sukses | Cek log `POST /api/v1/payments/webhook` dan rekonsiliasi transaksi harian | `[RENCANA]` |

---

## 2. Checklist Mingguan (`[RENCANA]`)

| ID | Item Pemeriksaan | Cara Cek | Status |
|---|---|---|---|
| **CHK-W01** | Tidak ada kerentanan tinggi pada paket Node.js | Jalankan `npm audit` di `backend/`, `web/admin-web/`, dan `web/pengunjung-web/` | `[RENCANA]` |
| **CHK-W02** | Status paket mobile Flutter terpantau | Jalankan `flutter pub outdated` di `mobile/ebook_store/` | `[RENCANA]` |
| **CHK-W03** | Backup database otomatis Supabase berhasil | Cek riwayat backup harian di Supabase Dashboard | `[RENCANA]` |
| **CHK-W04** | Tren error dan *slow query* ditinjau | Review grafik error rate dan *Query Performance* Supabase | `[RENCANA]` |
| **CHK-W05** | Kapasitas disk database & Storage mencukupi | Cek metrik penggunaan DB & bucket `ebooks-private` (< 80%) | `[RENCANA]` |

---

## 3. Checklist Bulanan (`[RENCANA]`)

| ID | Item Pemeriksaan | Cara Cek | Status |
|---|---|---|---|
| **CHK-M01** | Rotasi secret sesuai jadwal kebijakan keamanan | Periksa umur kunci di secret manager; rotasi jika jatuh tempo | `[RENCANA]` |
| **CHK-M02** | Review metrik performa (latensi P95 < 500 ms) | Evaluasi laporan performa API & database | `[RENCANA]` |
| **CHK-M03** | Sinkronisasi status `[ADA]`/`[RENCANA]` di dokumentasi | Cocokkan `docs/docs-proyek-ebook-ecommerce.md` dengan kondisi repository | `[RENCANA]` |
| **CHK-M04** | Evaluasi paket outdated & rencana upgrade minor | Tinjau hasil `npm outdated` & `flutter pub outdated` | `[RENCANA]` |
| **CHK-M05** | Catatan perubahan di `CHANGELOG.md` terawat | Pastikan perubahan signifikan bulan berjalan tercatat di `CHANGELOG.md` | `[RENCANA]` |

---

## 4. Checklist Per Rilis (`[RENCANA]` Eksekusi Rilis / `[ADA]` Perintah Verifikasi)

| ID | Item Pemeriksaan | Cara Cek | Status |
|---|---|---|---|
| **CHK-R01** | Backup database diambil sebelum migrasi skema | Ambil snapshot manual di Supabase Dashboard / `pg_dump` | `[RENCANA]` |
| **CHK-R02** | Validasi skema Prisma lolos | `npm --prefix backend run prisma:validate` -> PASS | `[ADA]` |
| **CHK-R03** | Typecheck backend lolos tanpa error | `npm --prefix backend run typecheck` -> PASS | `[ADA]` |
| **CHK-R04** | Suite pengujian backend lolos | `npm --prefix backend test` -> PASS | `[ADA]` |
| **CHK-R05** | Build produksi backend lolos | `npm --prefix backend run build` -> PASS | `[ADA]` |
| **CHK-R06** | Lint & build aplikasi web (`admin-web` & `pengunjung-web`) lolos | `npm run lint` dan `npm run build` pada masing-masing folder web -> PASS | `[ADA]` |
| **CHK-R07** | Analisis statis mobile Flutter lolos | `flutter analyze` di `mobile/ebook_store/` -> PASS | `[ADA]` |
| **CHK-R08** | Pengujian mobile Flutter lolos | `flutter test` di `mobile/ebook_store/` -> PASS | `[ADA]` |
| **CHK-R09** | Pemindaian secret sebelum rilis bersih | Jalankan Gitleaks / cek GitHub Secret Scanning -> 0 temuan | `[RENCANA]` |
| **CHK-R10** | `CHANGELOG.md` diperbarui untuk rilis terkait | Periksa entri perubahan terbaru di [`CHANGELOG.md`](../../CHANGELOG.md) | `[ADA]` (file & aturan) |
| **CHK-R11** | Health check pasca-deploy merespons `200 OK` | Panggil `GET /api/v1/health` pada URL produksi | `[ADA]` (endpoint) / `[RENCANA]` (prod) |

---

## 5. Checklist Kuartalan (`[RENCANA]`)

| ID | Item Pemeriksaan | Cara Cek | Status |
|---|---|---|---|
| **CHK-Q01** | Simulasi uji restore database dari backup berhasil | Restore backup ke lingkungan staging dan verifikasi integritas data | `[RENCANA]` |
| **CHK-Q02** | Audit keamanan menyeluruh (*full security audit*) | Jalankan daftar audit `SEC-01`–`SEC-10` di [`maintenance-security.md`](./maintenance-security.md) | `[RENCANA]` |
| **CHK-Q03** | Review *threat model* keamanan | Tinjau [`docs/07-security/security-threat-model.md`](../07-security/security-threat-model.md) | `[RENCANA]` |
| **CHK-Q04** | Pembaruan *threat model* jika ada perubahan arsitektur | Perbarui daftar ancaman/mitigasi bila ada fitur/integrasi baru | `[RENCANA]` |
| **CHK-Q05** | Review rencana respons insiden & simulasi *tabletop* | Tinjau SLA & kontak eskalasi pada [`maintenance-incident-response.md`](./maintenance-incident-response.md) | `[RENCANA]` |
