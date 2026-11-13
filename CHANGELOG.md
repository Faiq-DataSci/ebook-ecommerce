# Changelog

Seluruh perubahan penting pada repository ini dicatat dalam berkas ini menggunakan format [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

> **Catatan:** Proyek belum memiliki rilis versi stabil (`0.1.0` masih dalam tahap fondasi/pengembangan aktif).

## [Unreleased]

### Added
- Fondasi direktori monorepo, `.gitignore`, `.editorconfig`, aturan agen (`AGENTS.md`, `.agents/`), dan template PR/CI di `.github/`.
- Konfigurasi backend Node.js + Express 5 + TypeScript (ESM) + Zod + Prisma 7 (`backend/src/config/env.ts`, `prisma.config.ts`, `src/app.ts`, `src/server.ts`).
- Skema database Prisma awal di `backend/prisma/schema.prisma` (`User`, `Category`, `Ebook`, `Order`, `OrderItem`, `Payment`, `Transaction`, `EbookAccess`).
- Middleware autentikasi & otorisasi Supabase (`authenticate`, `authorize`), *rate limiting*, *error handler* terpusat, validasi Zod (`validate.ts`), dan helper respons standar (`response.ts`).
- Endpoint awal `GET /api/v1/health` dan `GET /api/v1/admin/ping`, beserta unit & integration tests di `backend/tests/`.
- Template `.env.example` untuk `backend/`, `web/admin-web/`, dan `web/pengunjung-web/`.
- Scaffold proyek `web/admin-web`, `web/pengunjung-web`, dan `mobile/ebook_store` (dengan dependensi `flutter_riverpod`, `dio`, `flutter_secure_storage`).
- Dokumentasi teknis proyek di `docs/`, serta `SECURITY.md`, `CONTRIBUTING.md`, dan `CHANGELOG.md`.

### Changed
- Pembaruan `README.md` utama agar selaras dengan struktur repository dan implementasi aktual (`[ADA]` vs `[RENCANA]`).
- Migrasi entry files `web/admin-web` dari JavaScript ke TypeScript (`main.tsx`, `App.tsx`, `vite.config.ts`).
