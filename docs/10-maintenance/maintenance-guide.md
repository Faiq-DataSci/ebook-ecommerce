# Panduan Pemeliharaan (`Maintenance Guide`)

**Status:** `[RENCANA]` — Rencana prosedur pemeliharaan rutin setelah sistem memasuki fase produksi (sebagian aturan dokumentasi & perintah build/health check sudah `[ADA]`).  
**Referensi Utama:** [`AGENTS.md`](../../AGENTS.md), [`CHANGELOG.md`](../../CHANGELOG.md), [`SECURITY.md`](../../SECURITY.md), [`docs/05-deployment/deployment-checklist.md`](../05-deployment/deployment-checklist.md), [`docs/07-security/security-guidelines.md`](../07-security/security-guidelines.md).

---

## 1. Tujuan & Lingkup Pemeliharaan

Panduan ini menjadi acuan operasional pasca-rilis untuk menjaga keandalan, keamanan, integritas data, dan kesiapan seluruh komponen sistem **E-Commerce E-Book & SPK (SAW)**:

- **Backend API:** Node.js + Express 5 + TypeScript ESM + Zod + Prisma 7 (`backend/`).
- **Aplikasi Web:** Admin Web (`web/admin-web/`, TypeScript + Vite) dan Web Pengunjung (`web/pengunjung-web/`, Vite).
- **Aplikasi Mobile:** Flutter Android (`mobile/ebook_store/`, Riverpod + Dio).
- **Database & Storage:** PostgreSQL Supabase (pooler port `6543` runtime, direct port `5432` migrasi), Supabase Auth, dan Supabase Storage bucket privat (`ebooks-private`).
- **Layanan Eksternal:** Payment Gateway (Midtrans/Xendit) beserta callback webhook.

> **Catatan Status:** Karena sistem masih berada pada tahap fondasi pra-produksi, seluruh jadwal dan prosedur operasional produksi di bawah ini berstatus `[RENCANA]` kecuali komponen atau aturan yang telah terbukti tersedia di repository (`[ADA]`).

---

## 2. Jadwal Pemeliharaan Rutin (`[RENCANA]`)

| Frekuensi | Aktivitas | Komponen | Penanggung Jawab | Status |
|---|---|---|---|---|
| **Harian** | Cek endpoint `GET /api/v1/health` (`[ADA]`), pantau error log `5xx`, dan cek monitoring uptime | Backend, Web, Database | DevOps / On-Call | `[RENCANA]` |
| **Mingguan** | Audit dependensi (`npm audit`, `flutter pub outdated`), verifikasi backup database terbaru, dan review tren error | Backend, Web, Mobile, Database | Backend / DevOps | `[RENCANA]` |
| **Bulanan** | Rotasi secret sesuai kebijakan keamanan, review metrik performa & ukuran storage, serta sinkronisasi status `[ADA]`/`[RENCANA]` di `docs/` | Seluruh Sistem & Dokumentasi | Security / Tech Lead | `[RENCANA]` |
| **Per Rilis** | Jalankan full regression test, pemindaian secret, backup database pra-migrasi, serta perbarui `CHANGELOG.md` | Seluruh Komponen | Tim Pengembang & QA | `[RENCANA]` |

---

## 3. Rincian Aktivitas Pemeliharaan Rutin

### 1. Audit Keamanan & Dependensi (`[RENCANA]`)
- Jalankan `npm audit` pada `backend/`, `web/admin-web/`, dan `web/pengunjung-web/` (`[RENCANA]`).
- Jalankan `flutter pub outdated` pada `mobile/ebook_store/` (`[RENCANA]`).
- Pantau *Dependabot alerts* dan *Secret scanning* pada repository GitHub (`[RENCANA]`).
- Tinjau CVE terkait dependensi inti: Express 5, Prisma 7, Zod, React, dan Flutter SDK (`[RENCANA]`).

### 2. Rotasi Kredensial (`[RENCANA]`)
- Rotasi berkala `SUPABASE_SERVICE_ROLE_KEY` pada environment backend (`[RENCANA]`).
- Rotasi berkala `PAYMENT_GATEWAY_SERVER_KEY` dan `PAYMENT_GATEWAY_WEBHOOK_SECRET` sesuai jadwal keamanan (`[RENCANA]`).
- Segera cabut (*revoke*) dan ganti kredensial apabila terindikasi atau dicurigai bocor sesuai [`maintenance-security.md`](./maintenance-security.md) (`[RENCANA]`).

> **Catatan Sinkronisasi:** Backend proyek ini menggunakan **Supabase Auth** (`SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`) yang tervalidasi di [`backend/src/config/env.ts`](../../backend/src/config/env.ts) (`[ADA]`), sehingga tidak menggunakan variabel `JWT_SECRET` kustom.

### 3. Pemeliharaan Database (`[RENCANA]`)
- **Scheduled job pesanan kedaluwarsa:** Ubah `Order` berstatus `PENDING` yang melewati `expiresAt` menjadi `EXPIRED` tanpa menyentuh pesanan `PAID`, `FAILED`, atau `CANCELLED` (`[RENCANA]`).
- **Backup pra-migrasi:** Pastikan backup otomatis PostgreSQL Supabase aktif dan lakukan snapshot manual sebelum menjalankan migrasi skema (`[RENCANA]`).
- **Optimasi query:** Lakukan `VACUUM` / `ANALYZE` berkala dan evaluasi indeks pada tabel transaksional (`orders`, `payments`, `transactions`, `ebook_accesses`) (`[RENCANA]`).

### 4. Sinkronisasi Dokumentasi (`[ADA]` Aturan)
- Setiap perubahan skema Prisma, endpoint API, environment variables, atau keputusan arsitektur wajib memperbarui dokumen terkait di `docs/` (`[ADA]` pada [`AGENTS.md`](../../AGENTS.md) & [`CONTRIBUTING.md`](../../CONTRIBUTING.md)).
- Perbarui label status dari `[RENCANA]` ke `[ADA]` hanya setelah fitur diimplementasikan dan teruji (`[ADA]` pada `AGENTS.md`).
- Catat setiap perubahan signifikan pada [`CHANGELOG.md`](../../CHANGELOG.md) (`[ADA]`).

### 5. Pemeliharaan Aplikasi
- **Backend:** Restart layanan backend setelah pembaruan kode/konfigurasi dengan mekanisme *graceful shutdown* memanggil `disconnectDatabase()` dari [`backend/src/config/prisma.ts`](../../backend/src/config/prisma.ts) (`[ADA]` fungsi helper / `[RENCANA]` hook di `server.ts`).
- **Web:** Rebuild aplikasi web statis menggunakan `npm run build` (`vite build`) setelah pembaruan (`[ADA]` skrip tersedia di `web/admin-web/package.json` dan `web/pengunjung-web/package.json`).
- **Mobile:** Rebuild rilis Android (`flutter build appbundle` / `flutter build apk`) setelah pembaruan kode atau konfigurasi endpoint (`[RENCANA]`).
- **Verifikasi Pasca-Restart:** Pastikan `GET /api/v1/health` mengembalikan HTTP `200` (`status: "ok"`) setelah setiap restart (`[ADA]` endpoint di `backend/src/app.ts`).

---

## 4. Matriks Komponen dan Pemeliharaan

| Komponen | Pemeliharaan Rutin | Frekuensi | Tool / Perintah | Status |
|---|---|---|---|---|
| **Backend API (`backend/`)** | Health check, cek error log, typecheck/test sebelum rilis, audit dependensi | Harian / Per Rilis | `GET /api/v1/health` (`[ADA]`), `npm run typecheck`, `npm test`, `npm audit` | `[ADA]` (health & skrip) / `[RENCANA]` (operasional) |
| **Database (`PostgreSQL Supabase`)** | Cek koneksi, backup harian/pra-migrasi, cleanup order `EXPIRED`, `VACUUM`/`ANALYZE` | Harian / Mingguan / Pra-Migrasi | `checkDatabaseConnection()` (`[ADA]`), Supabase Dashboard, `pg_dump`, Prisma CLI | `[ADA]` (helper & `validate`) / `[RENCANA]` (rutin) |
| **Supabase Storage (`ebooks-private`)** | Verifikasi status bucket tetap privat, cek ukuran storage, bersih file orphan | Mingguan / Bulanan | Supabase Dashboard, helper `createPrivatePdfSignedUrl` | `[ADA]` (helper) / `[RENCANA]` (audit) |
| **Web (`admin-web` & `pengunjung-web`)** | Audit dependensi, lint & build sebelum deploy, cek uptime halaman | Mingguan / Per Rilis | `npm run lint`, `npm run build` (`[ADA]`), `npm audit` | `[ADA]` (lint/build) / `[RENCANA]` (monitoring) |
| **Mobile (`mobile/ebook_store`)** | Cek dependensi outdated, analisis statis, unit/widget test, build APK/AAB | Mingguan / Per Rilis | `flutter analyze`, `flutter test` (`[ADA]`), `flutter pub outdated`, `flutter build` | `[ADA]` (analyze/test) / `[RENCANA]` (rilis) |
| **Payment Gateway & Webhook** | Verifikasi webhook success rate, rotasi server key & webhook secret | Harian / Per 3 Bulan | Log backend, Dashboard Gateway | `[RENCANA]` |
