# Checklist Pra-Deployment, Saat Deployment, & Pasca-Deployment

**Status:** `[RENCANA]` (digunakan saat sistem memasuki tahap rilis staging/produksi)  
**Referensi Utama:** [`AGENTS.md`](../../AGENTS.md), [`deployment-backend.md`](./deployment-backend.md), [`deployment-database.md`](./deployment-database.md), [`deployment-security.md`](./deployment-security.md).

---

## 1. Checklist Pra-Deployment (`[RENCANA]`)

### A. Keputusan & Kesiapan Kode
- [ ] Keputusan #10 (platform hosting backend produksi) telah disetujui dan dikunci di `keputusan-terbuka.md`.
- [ ] Keputusan #8 (nama resmi aplikasi & logo mobile) telah ditetapkan jika merilis APK/AAB publik.
- [ ] Seluruh perubahan pada `backend/`, `web/`, dan `mobile/` lolos `typecheck`, `lint`, `build`, dan test suite tanpa error.
- [ ] `rate-limit.middleware.ts` sudah terpasang di `backend/src/app.ts` dan *graceful shutdown* sudah aktif di `backend/src/server.ts`.

### B. Database & Storage Supabase
- [ ] Direktori `backend/prisma/migrations/` sudah dibuat dan diuji di lingkungan staging.
- [ ] Bucket `ebooks-private` di Supabase Storage terkonfigurasi sebagai **Private Bucket** (tidak ada akses baca publik).
- [ ] Kebijakan backup otomatis database Supabase telah diaktifkan.

### C. Environment & Keamanan
- [ ] Tidak ada file `.env`, keystore `.jks`, atau secret yang ter-commit ke Git.
- [ ] Semua secret produksi (`DATABASE_URL` port `6543`, `DIRECT_URL` port `5432`, `SUPABASE_SERVICE_ROLE_KEY`, `PAYMENT_GATEWAY_SERVER_KEY`, `PAYMENT_GATEWAY_WEBHOOK_SECRET`) disetel di secret manager platform hosting.
- [ ] `CORS_ORIGINS` diisi domain HTTPS resmi `admin-web` dan `pengunjung-web` (tanpa wildcard `*`).
- [ ] Tidak ada secret pada variabel `VITE_*` maupun di kode Flutter `mobile/ebook_store`.

---

## 2. Urutan Eksekusi Saat Deployment (`[RENCANA]`)

Ikuti urutan ketergantungan resmi proyek (`Backend -> Admin Web -> Mobile`):

1. **Tahap 1 — Database Supabase:**
   - Jalankan `npx prisma migrate deploy` menggunakan `DIRECT_URL` (port `5432`).
   - Verifikasi tabel dan enum terbentuk sesuai `backend/prisma/schema.prisma`.
2. **Tahap 2 — Backend API (`backend/`):**
   - Deploy hasil kompilasi (`dist/server.js` atau handler serverless sesuai Keputusan #10).
   - Verifikasi `GET https://<domain-backend>/api/v1/health` mengembalikan HTTP `200` (`status: "ok"`, `environment: "production"`).
3. **Tahap 3 — Web (`web/admin-web` & `web/pengunjung-web`):**
   - Build masing-masing aplikasi dengan `VITE_API_BASE_URL` mengarah ke domain HTTPS backend produksi.
   - Deploy folder `dist/` dan pastikan fallback SPA ke `/index.html` aktif.
4. **Tahap 4 — Mobile Android (`mobile/ebook_store`):**
   - Build APK/AAB release bertanda tangan dengan `--dart-define=API_BASE_URL=https://<domain-backend>/api/v1`.

---

## 3. Checklist Pasca-Deployment & Smoke Test (`[RENCANA]`)

- [ ] **Health & Auth Check:** `GET /api/v1/health` mengembalikan `200`; login admin & pelanggan berfungsi dan `GET /api/v1/admin/ping` menolak role `CUSTOMER` (`403`).
- [ ] **CORS Check:** `admin-web` dan `pengunjung-web` dapat memanggil API backend dari browser tanpa error CORS.
- [ ] **SAW Check:** Rekomendasi SAW mengembalikan peringkat dan skor yang dihitung di backend.
- [ ] **Checkout & Webhook Check:** Uji transaksi sandbox/live memverifikasi callback `POST /api/v1/payments/webhook` via HTTPS dan otomatis membuat record `ebook_accesses`.
- [ ] **Private PDF Check:** Pengguna yang sudah membayar memperoleh signed URL sementara dan dapat membuka PDF; pengguna tanpa akses ditolak (`403`).
- [ ] **Log & Monitoring:** Tidak ada lonjakan error `5xx` atau kegagalan koneksi pooler PostgreSQL di log server.

---

## 4. Rencana Rollback Darurat (`[RENCANA]`)

1. **Rollback Aplikasi (Backend/Web):** Kembalikan deployment ke rilis/commit stabil sebelumnya melalui fitur rollback platform hosting.
2. **Rollback Database:** Hindari *destructive rollback* pada database produksi yang sudah menampung transaksi; jika migrasi bermasalah, terapkan migrasi perbaikan maju (*forward-fix*) atau pulihkan dari backup/PITR Supabase sesuai prosedur darurat.
3. **Rollback Mobile:** Hentikan distribusi versi bermasalah di kanal rilis dan naikkan `versionCode` untuk build perbaikan.
