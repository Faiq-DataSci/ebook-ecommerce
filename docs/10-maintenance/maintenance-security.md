# Pemeliharaan Keamanan (`Security Maintenance`)

**Status:** `[RENCANA]` — Prosedur pemeliharaan dan audit keamanan operasional pasca-rilis (aturan dasar & middleware awal sudah `[ADA]`).  
**Referensi Utama:** [`SECURITY.md`](../../SECURITY.md), [`.gitignore`](../../.gitignore), [`docs/07-security/security-guidelines.md`](../07-security/security-guidelines.md), [`docs/05-deployment/deployment-security.md`](../05-deployment/deployment-security.md), [`backend/src/app.ts`](../../backend/src/app.ts), [`backend/src/middlewares/error.middleware.ts`](../../backend/src/middlewares/error.middleware.ts).

---

## 1. Jadwal Rotasi Kredensial (`[RENCANA]`)

| Kredensial | Lokasi Penyimpanan | Frekuensi Rotasi | Trigger Darurat | Status |
|---|---|---|---|---|
| `SUPABASE_SERVICE_ROLE_KEY` | Backend `.env` / Secret Manager Hosting | Per 6 bulan | Segera jika ter-commit, bocor di log, atau bucket privat terekspos | `[RENCANA]` |
| `PAYMENT_GATEWAY_SERVER_KEY` | Backend `.env` / Secret Manager Hosting | Per 3 bulan | Segera jika dicurigai bocor atau akses tidak sah di dashboard gateway | `[RENCANA]` |
| `PAYMENT_GATEWAY_WEBHOOK_SECRET` | Backend `.env` / Secret Manager Hosting | Per 3 bulan | Segera jika terdapat indikasi spoofing/bypass signature webhook | `[RENCANA]` |
| `DATABASE_URL` & `DIRECT_URL` | Backend `.env` / Secret Manager Hosting | Saat rotasi password database Supabase | Segera jika connection string terekspos | `[RENCANA]` |
| `SUPABASE_ANON_KEY` | Backend `.env` & `VITE_SUPABASE_ANON_KEY` (publik terbatas) | Saat rotasi proyek/kunci Supabase | Segera bila proyek Supabase di-reset atau kunci direvoke | `[RENCANA]` |

> **Aturan Mutlak:** Tidak ada secret produksi yang boleh disimpan di repository Git, variabel `VITE_*`, maupun kode aplikasi Flutter (`mobile/ebook_store`).

---

## 2. Audit Keamanan Berkala

| ID | Aktivitas | Frekuensi | Tool / Sumber | Cara Verifikasi | Status |
|---|---|---|---|---|---|
| **SEC-01** | Pemindaian secret pada repository & riwayat commit | Per rilis | Gitleaks / GitHub Secret Scanning & Push Protection | `git log --all` bersih dari secret/token/password | `[RENCANA]` |
| **SEC-02** | Audit kerentanan (CVE) dependensi | Mingguan | `npm audit` (backend & web), `flutter pub outdated` | Tidak ada vulnerability berstatus `high` / `critical` yang terbuka | `[RENCANA]` |
| **SEC-03** | Verifikasi bucket Storage PDF berstatus privat | Bulanan | Supabase Dashboard (Storage > Policies) | Bucket `ebooks-private` tidak memiliki akses baca `anon`/publik | `[RENCANA]` |
| **SEC-04** | Verifikasi `storagePath` tidak bocor di respons API publik | Per rilis | Review/test respons `GET /api/v1/ebooks*` | Field `storagePath` tidak pernah muncul di JSON klien | `[RENCANA]` |
| **SEC-05** | Verifikasi `CORS_ORIGINS` hanya mengizinkan domain resmi | Per rilis | Cek konfigurasi `CORS_ORIGINS` & `app.ts` | Tidak ada wildcard `*` di lingkungan produksi | `[RENCANA]` |
| **SEC-06** | Verifikasi header keamanan HTTP (`helmet()`) aktif | Per rilis | Cek [`backend/src/app.ts`](../../backend/src/app.ts) | `app.use(helmet())` terpasang sebelum route API | `[ADA]` |
| **SEC-07** | Verifikasi rate limiter terpasang di `app.ts` | Per rilis | Cek `app.ts` & `rate-limit.middleware.ts` | `sensitiveEndpointLimiter` aktif pada endpoint sensitif | `[RENCANA]` |
| **SEC-08** | Verifikasi sanitasi error handler pada respons `500` | Per rilis | Cek [`backend/src/middlewares/error.middleware.ts`](../../backend/src/middlewares/error.middleware.ts) | Respons error tidak membocorkan stack trace atau detail query DB | `[ADA]` |
| **SEC-09** | Verifikasi `.gitignore` mencegah commit `.env` & kunci | Per rilis | Cek [`.gitignore`](../../.gitignore) & `git status` | File `.env`, `*.pem`, `*.key`, `*.keystore`, `*.jks` terabaikan | `[ADA]` |
| **SEC-10** | Uji penetrasi & validasi otorisasi endpoint (`401`/`403`) | Per rilis besar | Test suite keamanan (`TC-AUTH-*`, `TC-ACC-*`) / uji manual | Seluruh endpoint non-publik menolak token invalid (`401`) & role salah (`403`) | `[RENCANA]` |

---

## 3. Prosedur Patching & Pembaruan Keamanan (`[RENCANA]`)

- **Paket npm (`backend/`, `web/admin-web/`, `web/pengunjung-web/`):** Jalankan `npm audit`, evaluasi tingkat risiko, lalu terapkan `npm update` atau `npm audit fix` pada branch terpisah sebelum diuji ulang.
- **Paket Flutter (`mobile/ebook_store/`):** Jalankan `flutter pub outdated` lalu `flutter pub upgrade` untuk patch keamanan.
- **Prisma 7 (`[ADA]` aturan):** Wajib menjalankan `npm view prisma dist-tags` sebelum memperbarui Prisma agar tidak menginstal versi RC yang bertag `latest`.
- **Runtime Node.js & Flutter SDK:** Pastikan pembaruan versi runtime tetap kompatibel dengan Express 5 (`^5.3.0`), Prisma 7 (`^7.10.x`), dan Dart SDK (`^3.12.0`).

---

## 4. Prosedur Respons Kebocoran Secret (`[RENCANA]`)

Sesuai [`SECURITY.md`](../../SECURITY.md), apabila terdapat secret yang bocor atau ter-commit:
1. **Identifikasi:** Catat jenis secret yang bocor, lokasi file/commit, dan perkiraan waktu paparan.
2. **Cabut & Rotasi Segera:** Lakukan *revoke* dan generate kunci baru di dashboard Supabase atau Payment Gateway sebelum melakukan langkah lain.
3. **Bersihkan Riwayat Git:** Jika secret masuk ke riwayat commit, bersihkan menggunakan `git filter-repo` atau BFG Repo-Cleaner sebelum repository dibagikan/di-push ulang.
4. **Audit Log Akses:** Periksa log Supabase Auth, Storage, Database, dan Payment Gateway untuk mendeteksi aktivitas mencurigakan selama masa paparan.
5. **Notifikasi Pemangku Kepentingan:** Laporkan insiden kepada pengelola proyek / tim sesuai eskalasi insiden.
6. **Perbarui Environment:** Suntikkan secret baru ke `.env` lokal dan *secret manager* platform hosting produksi.
7. **Verifikasi Layanan:** Restart backend dan pastikan `GET /api/v1/health` serta alur integrasi kembali normal.
