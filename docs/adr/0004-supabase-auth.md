# ADR-0004: Autentikasi Menggunakan Supabase Auth

## Status
Diterima

- **Status Keputusan:** Diterima (Keputusan #2 `[ADA]` di `keputusan-terbuka.md`)
- **Status Implementasi:** `[ADA]` middleware `authenticate` & `authorize` (`auth.middleware.ts`) | `[RENCANA]` sinkronisasi profil ke tabel `users` (`POST /auth/sync`) & lookup role DB
- **Tanggal Keputusan:** 2026-11-14
- **Tanggal Pembaruan:** 2026-11-14
- **Pemutus:** Pemilik Proyek & Tim Pengembang
- **Pengganti:** Tidak ada

## Konteks
Sistem membutuhkan mekanisme autentikasi yang aman untuk registrasi, login, pengelolaan sesi, dan pemulihan kata sandi di seluruh klien (`mobile/ebook_store`, `web/admin-web`, `web/pengunjung-web`). Membangun sistem autentikasi kustom dari nol (hashing password dengan bcrypt/argon2, penerbitan dan rotasi refresh token, serta alur reset password) menambah beban implementasi dan risiko keamanan yang besar bagi tim 3 orang. Di sisi lain, proyek sudah menggunakan Supabase untuk PostgreSQL dan Storage, sehingga Supabase Auth tersedia secara terintegrasi.

### Faktor yang Mempengaruhi
- Kecepatan pengembangan dan pengurangan beban kode keamanan sensitif (hashing & reset password).
- Kebutuhan otorisasi berbasis peran (`CUSTOMER` dan `ADMIN`) yang tetap ditegakkan di backend.
- Ketersediaan SDK klien untuk web dan dukungan API-first untuk aplikasi mobile Flutter.

### Stakeholder
- **Tim Pengembang:** Memerlukan penyedia identitas terkelola agar dapat fokus pada logika bisnis dan SPK SAW.
- **Dosen Pembimbing:** Menilai keamanan autentikasi dan pemisahan peran (`RBAC`) di backend.
- **Pelanggan & Admin:** Membutuhkan alur masuk dan manajemen sesi yang andal.

## Alternatif yang Dipertimbangkan

### Alternatif 1: Supabase Auth + Verifikasi JWT di Backend
- **Deskripsi:** Supabase Auth bertindak sebagai *Identity Provider* (registrasi, login, penerbitan JWT), sementara backend Express memverifikasi Bearer token via `supabase.auth.getUser(token)` dan menegakkan RBAC.
- **Kelebihan:** Tidak perlu menyimpan `password_hash` di database aplikasi, alur reset password & token ditangani Supabase, terintegrasi dengan PostgreSQL & Storage Supabase.
- **Kekurangan:** Ketergantungan pada layanan Supabase Auth eksternal, serta migrasi akun ke penyedia lain memerlukan proses tambahan jika pindah platform.
- **Status:** Dipilih

### Alternatif 2: Sistem JWT + Bcrypt Kustom di Express
- **Deskripsi:** Backend mengelola tabel kredensial (`password_hash`), endpoint register/login, refresh token, dan alur lupa kata sandi secara mandiri.
- **Kelebihan:** Kendali penuh tanpa ketergantungan IdP eksternal.
- **Kekurangan:** Menambah permukaan serangan keamanan, kode boilerplate autentikasi yang panjang, dan waktu pengembangan lebih lama.
- **Status:** Ditolak

### Alternatif 3: OAuth Sosial Langsung Tanpa Email/Password
- **Deskripsi:** Hanya mengizinkan login melalui penyedia OAuth eksternal (mis. Google Sign-In).
- **Kelebihan:** Pengguna tidak perlu mengingat kata sandi baru.
- **Kekurangan:** Tidak semua pengguna atau skenario uji akademik memiliki/menginginkan login akun sosial, serta konfigurasi callback mobile/web lebih kompleks.
- **Status:** Ditolak

### Alternatif 4: Session-Based Authentication (Cookie Server-Side)
- **Deskripsi:** Menggunakan *HTTP session cookie* yang dikelola oleh server Express.
- **Kelebihan:** Umum untuk aplikasi web monolitik tradisional.
- **Kekurangan:** Kurang cocok untuk arsitektur API-first yang dikonsumsi bersamaan oleh aplikasi mobile Flutter (`Dio` + `flutter_secure_storage`) dan dua portal web terpisah.
- **Status:** Ditolak

## Keputusan
Autentikasi sistem menggunakan **Supabase Auth** untuk registrasi, login, dan penerbitan JWT. Backend Express memverifikasi token menggunakan `supabase.auth.getUser(token)` (via `getSupabaseAdmin()`) dan menegakkan otorisasi peran (`RBAC`). Backend **tidak menyimpan `password_hash`** pada tabel `users`.

### Alasan
1. Mengurangi risiko kebocoran kredensial dan kesalahan implementasi kriptografi password di backend.
2. Menyediakan identitas tunggal lintas platform (Mobile Android, Admin Web, Pengunjung Web) dengan verifikasi terpusat di backend.

## Konsekuensi

### Positif
- Backend tidak perlu mengimplementasikan hashing password, verifikasi email, atau rotasi refresh token dari nol.
- Skema `User` pada `schema.prisma` bersih dari kolom password dan hanya menyimpan `supabaseUserId`.
- Middleware awal `authenticate` dan `authorize` sudah dapat diuji fondasinya.

### Negatif
- Ketersediaan alur login/registrasi bergantung pada ketersediaan layanan Supabase Auth.
- Diperlukan mekanisme sinkronisasi (`POST /auth/sync`) agar profil dan peran di tabel PostgreSQL `users` tetap selaras dengan akun Supabase Auth (`[RENCANA]`).

### Netral
- Tabel `users` menyimpan `supabaseUserId` (`@unique`) sebagai penghubung resmi antara identitas Supabase Auth dan data transaksional lokal.

## Dampak Teknis

### Arsitektur
- Supabase Auth berfungsi sebagai *Identity Provider* (IdP); backend Express berperan sebagai verifikator token dan penegak RBAC.

### Database
- Model `User` pada `backend/prisma/schema.prisma` (`[ADA]`) memiliki `supabaseUserId String @unique`, `role UserRole @default(CUSTOMER)`, `isActive Boolean @default(true)`, tanpa kolom `password_hash`.

### API
- Endpoint sinkronisasi profil `POST /api/v1/auth/sync` dan profil pengguna `GET/PATCH /api/v1/users/me` (`[RENCANA]`).
- Endpoint admin terproteksi seperti `GET /api/v1/admin/ping` (`[ADA]`) dan seluruh `/api/v1/admin/*` (`[RENCANA]`).

### Keamanan
- Middleware `authenticate` & `authorize` tersedia di `backend/src/middlewares/auth.middleware.ts` (`[ADA]`).
- Pencegahan IDOR wajib menggunakan `req.user.id` hasil verifikasi token di backend, bukan parameter dari klien (`[RENCANA]` pada endpoint bisnis).
- Token di mobile disimpan dengan `flutter_secure_storage` (`[ADA]` di `pubspec.yaml` / `[RENCANA]` implementasi).

### Pengujian
- Test integrasi fondasi pada `backend/tests/health.test.ts` membuktikan permintaan tanpa token ke `/api/v1/admin/ping` ditolak `401` (`[ADA]`).
- Suite `TC-AUTH-*` untuk sinkronisasi user, token expired, dan `403 Forbidden` antar peran masih `[RENCANA]`.

### Deployment
- Memerlukan variabel environment `SUPABASE_URL`, `SUPABASE_ANON_KEY` (publik klien & backend), dan `SUPABASE_SERVICE_ROLE_KEY` (**khusus backend**, dilarang di `VITE_*` & Flutter).

## Referensi Silang
- **Kebutuhan:** `FR-C01`, `FR-C02`, `FR-A01`, `NFR-01` pada [`requirements.md`](../00-project/requirements.md)
- **Dokumen Arsitektur:** [`security-architecture.md`](../02-architecture/security-architecture.md), [`architecture-decisions-summary.md`](../02-architecture/architecture-decisions-summary.md)
- **Dokumen Desain:** [`authentication-and-authorization.md`](../02-api/authentication-and-authorization.md)
- **Dokumen Modul:** [`authentication.md`](../06-modules/authentication.md)
- **Keputusan Terbuka:** [`keputusan-terbuka.md`](../00-project/keputusan-terbuka.md) (#2 `[ADA]`)
- **ADR Terkait:** [`ADR-0001`](./0001-single-seller-b2c.md), [`ADR-0006`](./0006-pdf-storage-privat-signed-url.md)
- **Bukti Teknis:** [`backend/src/middlewares/auth.middleware.ts`](../../backend/src/middlewares/auth.middleware.ts), [`backend/src/config/supabase.ts`](../../backend/src/config/supabase.ts), [`backend/src/config/env.ts`](../../backend/src/config/env.ts), [`backend/prisma/schema.prisma`](../../backend/prisma/schema.prisma)

## Catatan
Pada implementasi aktual `auth.middleware.ts` saat ini, `role` masih dibaca dari `app_metadata?.role` dan kode error `401` menggunakan `'UNAUTHORIZED'`. Pada fase implementasi penuh (`[RENCANA]`), otorisasi perlu disinkronkan dengan record `User` (`role` dan `isActive`) di database PostgreSQL.
