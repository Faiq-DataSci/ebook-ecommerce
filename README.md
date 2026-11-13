# Sistem Informasi E-Commerce E-Book & SPK (Metode SAW)

Aplikasi e-commerce *single-seller* (B2C) untuk pencarian, pemilihan, pembelian, dan akses e-book secara daring, dilengkapi rencana integrasi Sistem Pendukung Keputusan (SPK) berbasis metode Simple Additive Weighting (SAW) di backend.

> **Status Proyek:** `[RENCANA]` (Tahap Fondasi & Skema Awal) — Kerangka monorepo, skema Prisma awal, autentikasi guard Supabase, endpoint dasar (`/api/v1/health`, `/api/v1/admin/ping`), dan scaffold aplikasi web/mobile sudah `[ADA]`; fitur bisnis e-commerce dan SPK SAW masih `[RENCANA]`.

---

## 1. Tujuan Proyek
- Menyediakan platform penjualan e-book digital B2C dengan dua aktor utama: **Customer** dan **Admin**.
- Menjamin hak akses file PDF e-book dari bucket privat hanya diberikan setelah pembayaran terverifikasi valid.
- Memisahkan perhitungan SPK SAW di sisi backend agar bobot dan peringkat tetap konsisten dan dapat diaudit (`[RENCANA]`).

## 2. Fitur Utama

### Sudah Tersedia (`[ADA]`)
- Fondasi backend Express 5 + TypeScript (ESM) + Zod + Prisma 7.
- Endpoint pemeriksaan kesehatan (`GET /api/v1/health`) dan contoh endpoint terproteksi admin (`GET /api/v1/admin/ping`).
- Middleware autentikasi token Supabase (`authenticate`), otorisasi peran (`authorize`), *rate limiting*, dan *error handler* terpusat.
- Skema database Prisma awal (`users`, `categories`, `ebooks`, `orders`, `order_items`, `payments`, `transactions`, `ebook_accesses`).
- Scaffold aplikasi `web/admin-web`, `web/pengunjung-web`, dan `mobile/ebook_store`.

### Dalam Pengembangan / Rencana (`[RENCANA]`)
- Modul katalog, pencarian, dan detail e-book.
- Pembuatan pesanan, integrasi payment gateway nyata (Midtrans/Xendit), dan verifikasi webhook pembayaran.
- Pemberian hak akses & *in-app PDF reader* menggunakan *signed URL* sementara dari Supabase Storage bucket privat.
- Dashboard Admin, manajemen katalog/kategori/pengguna, serta laporan penjualan.
- Modul SPK metode SAW di backend.

## 3. Peran Pengguna
- **Customer:** Melihat katalog dan detail e-book, mencari e-book, membuat pesanan, melakukan pembayaran, melihat riwayat pembelian, dan membaca e-book yang sudah dibeli setelah pembayaran terverifikasi (`[RENCANA]`).
- **Admin:** Mengelola katalog e-book dan kategori, mengelola pengguna sesuai kewenangan, memantau transaksi, dan melihat informasi penjualan (`[RENCANA]`).

## 4. Ringkasan Arsitektur Sistem
- **Backend API (`backend/`):** Express + TypeScript (ESM), memvalidasi input dengan Zod, berinteraksi dengan PostgreSQL Supabase via Prisma 7 (`@prisma/adapter-pg`), memverifikasi token Supabase Auth, serta menerbitkan *signed URL* untuk bucket Storage privat.
- **Admin Web (`web/admin-web/`):** React + TypeScript + Vite.
- **Pengunjung Web (`web/pengunjung-web/`):** React + Vite (portal web pelanggan).
- **Mobile App (`mobile/ebook_store/`):** Flutter + Dart + Riverpod + Dio + `flutter_secure_storage`.

Detail arsitektur lengkap tersedia di [`docs/02-architecture/system-architecture.md`](./docs/02-architecture/system-architecture.md).

## 5. Technology Stack
- **Backend:** Node.js, Express `^5.3.0`, TypeScript, Zod, Prisma `7.10.x` (`@prisma/client`, `@prisma/adapter-pg`, `pg`), `@supabase/supabase-js`, `helmet`, `cors`, `express-rate-limit`, Vitest, Supertest.
- **Web (`web/admin-web` & `web/pengunjung-web`):** React `^19.3.1`, Vite `^8.3.6`, ESLint (ditambah TypeScript pada `web/admin-web`).
- **Mobile (`mobile/ebook_store`):** Flutter (Dart SDK `^3.12.0`), `flutter_riverpod`, `dio`, `flutter_secure_storage`.
- **Database & Storage:** PostgreSQL Supabase & Supabase Storage bucket privat.

## 6. Struktur Proyek

```text
ebook-ecommerce/
├── AGENTS.md                   # Aturan kerja & konvensi agen proyek
├── CHANGELOG.md                # Catatan perubahan aktual
├── CONTRIBUTING.md             # Panduan kontribusi & Conventional Commits
├── SECURITY.md                 # Kebijakan keamanan & pelaporan kerentanan
├── README.md                   # Dokumentasi utama proyek
├── backend/                    # API Node.js + Express + TypeScript + Prisma 7
│   ├── prisma/schema.prisma    # Skema database PostgreSQL
│   ├── src/                    # Source code backend (ESM)
│   └── tests/                  # Unit & integration tests (Vitest)
├── web/
│   ├── admin-web/              # Aplikasi Web Admin (React + TS + Vite)
│   └── pengunjung-web/         # Aplikasi Web Pengunjung (React + Vite)
├── mobile/
│   └── ebook_store/            # Aplikasi Mobile Flutter (Android)
└── docs/                       # Dokumentasi teknis, arsitektur, API, & ADR
```

## 7. Prasyarat
- **Node.js** & **npm** (teruji di lingkungan pengembangan dengan Node `v24.15.0` dan npm `11.12.1`)
- **Flutter SDK** (untuk proyek `mobile/ebook_store`, Dart SDK `^3.12.0`)
- **Git**
- Proyek **Supabase** (PostgreSQL & Storage bucket privat)

## 8. Panduan Instalasi

```powershell
# 1. Pasang dependensi backend
npm --prefix backend install

# 2. Pasang dependensi web
npm --prefix web/admin-web install
npm --prefix web/pengunjung-web install

# 3. Pasang dependensi mobile (di dalam mobile/ebook_store)
Push-Location mobile/ebook_store; flutter pub get; Pop-Location
```

## 9. Konfigurasi Environment
Salin template `.env.example` di masing-masing direktori tanpa melakukan commit file `.env`:
- Backend: salin [`backend/.env.example`](./backend/.env.example) ke `backend/.env`.
- Admin Web: salin [`web/admin-web/.env.example`](./web/admin-web/.env.example) ke `web/admin-web/.env`.
- Pengunjung Web: salin [`web/pengunjung-web/.env.example`](./web/pengunjung-web/.env.example) ke `web/pengunjung-web/.env`.

> **Catatan Keamanan:** Jangan pernah menaruh `SUPABASE_SERVICE_ROLE_KEY`, secret JWT, atau kunci server payment gateway ke variabel `VITE_*` maupun kode Flutter.

## 10. Setup Database
1. Pastikan `DATABASE_URL` (transaction pooler port `6543`) dan `DIRECT_URL` (session pooler port `5432`) terisi di `backend/.env`.
2. Validasi skema Prisma dan generate client:
   ```powershell
   Push-Location backend
   npx prisma validate
   npx prisma generate
   Pop-Location
   ```
3. Migrasi database dijalankan setelah konfigurasi database siap (`[RENCANA]`).

## 11. Menjalankan Aplikasi

```powershell
# Backend (mode development)
npm --prefix backend run dev

# Web Admin
npm --prefix web/admin-web run dev

# Web Pengunjung
npm --prefix web/pengunjung-web run dev

# Mobile Flutter (dari mobile/ebook_store)
Push-Location mobile/ebook_store; flutter run; Pop-Location
```

## 12. Pengujian

```powershell
# Backend typecheck & tests (Vitest)
npm --prefix backend run typecheck
npm --prefix backend test

# Web Admin lint & build
npm --prefix web/admin-web run lint
npm --prefix web/admin-web run build

# Web Pengunjung lint & build
npm --prefix web/pengunjung-web run lint
npm --prefix web/pengunjung-web run build

# Mobile tests (dari mobile/ebook_store)
Push-Location mobile/ebook_store; flutter test; Pop-Location
```

Catatan hasil pengujian aktual dicatat di [`docs/09-testing/test-results.md`](./docs/09-testing/test-results.md).

## 13. Daftar Script Tersedia (`backend/package.json`)
- `npm --prefix backend run dev` — Menjalankan server development (`tsx watch src/server.ts`)
- `npm --prefix backend run build` — Kompilasi TypeScript ke `dist/`
- `npm --prefix backend run start` — Menjalankan hasil build (`node dist/server.js`)
- `npm --prefix backend run typecheck` — Pemeriksaan tipe TypeScript (`tsc --noEmit`)
- `npm --prefix backend run test` — Menjalankan unit & integration test (`vitest run`)
- `npm --prefix backend run prisma:validate` — Validasi `prisma/schema.prisma`

## 14. Referensi Dokumentasi API & Teknis
- Indeks dokumentasi lengkap: [`docs/README.md`](./docs/README.md)
- Sumber kebenaran status fitur: [`docs/docs-proyek-ebook-ecommerce.md`](./docs/docs-proyek-ebook-ecommerce.md)
- Gambaran API & rancangan endpoint: [`docs/05-api/api-overview.md`](./docs/05-api/api-overview.md) dan [`docs/05-api/api-endpoints.md`](./docs/05-api/api-endpoints.md)
- Daftar keputusan proyek: [`docs/00-project/keputusan-terbuka.md`](./docs/00-project/keputusan-terbuka.md)

## 15. Catatan Keamanan
Lihat [`SECURITY.md`](./SECURITY.md) untuk kebijakan keamanan, perlindungan kredensial, dan pelaporan kerentanan.

## 16. Panduan Kontribusi
Lihat [`CONTRIBUTING.md`](./CONTRIBUTING.md) untuk aturan branching, Conventional Commits, dan pembaruan dokumentasi.

## 17. Lisensi
Belum tersedia dalam implementasi atau sumber proyek yang diperiksa (jenis lisensi belum diputuskan oleh pemilik proyek).

## 18. Status Proyek
- **Tahap saat ini:** Fondasi monorepo, skema database awal, *auth guard* backend, serta kerangka pengujian dasar (`[ADA]`).
- **Tahap berikutnya:** Implementasi modul bisnis backend (katalog, pesanan, pembayaran, akses e-book, dan SPK SAW) setelah keputusan terbuka di [`docs/00-project/keputusan-terbuka.md`](./docs/00-project/keputusan-terbuka.md) difinalisasi (`[RENCANA]`).
