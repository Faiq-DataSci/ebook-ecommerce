# Technology Stack

**Status:** `[ADA]` (stack terkunci di `AGENTS.md` dan paket terpasang di `backend/package.json`, `web/*/package.json`, `mobile/ebook_store/pubspec.yaml`) | `[RENCANA]` (integrasi runtime fitur bisnis, database migrasi, dan payment gateway)

---

## 1. Daftar Teknologi Terkunci & Status Aktual

| Area | Teknologi | Fungsi | Status | Bukti atau Dokumen Referensi |
|---|---|---|---|---|
| **Runtime Backend** | **Node.js** | Lingkungan eksekusi server JavaScript/TypeScript ESM | `[ADA]` | `backend/package.json` (`"type": "module"`) |
| **Framework API** | **Express** (`^5.3.0`) | Routing REST API dan pipeline middleware | `[ADA]` | `backend/package.json`, `backend/src/app.ts` |
| **Bahasa Backend** | **TypeScript** (`^7.0.2`) | Pengetikan statis & kompilasi `dist/` | `[ADA]` | `backend/tsconfig.json`, `npm run typecheck` PASS |
| **Validasi Input** | **Zod** (`^4.6.7`) | Validasi environment (`env.ts`) dan payload API | `[ADA]` | `backend/src/config/env.ts`, `middleware/validate.ts` |
| **ORM & Migrasi** | **Prisma 7** (`^7.10.x` + `@prisma/adapter-pg`) | Pemodelan skema & akses database *type-safe* | `[ADA]` skema / `[RENCANA]` migrasi | `backend/prisma.config.ts`, `prisma/schema.prisma` |
| **Database** | **PostgreSQL Supabase** | Penyimpanan relasional transaksional | `[ADA]` skema / `[RENCANA]` koneksi & migrasi | `AGENTS.md`, `backend/prisma/schema.prisma` |
| **Autentikasi** | **Supabase Auth** | Registrasi, login, dan penerbitan JWT pengguna | `[ADA]` keputusan & middleware / `[RENCANA]` sinkronisasi | `keputusan-terbuka.md` (#2), `auth.middleware.ts` |
| **Object Storage** | **Supabase Storage** (`bucket privat`) | Penyimpanan file PDF `e-book` & penerbitan `signed URL` | `[ADA]` helper dasar / `[RENCANA]` integrasi penuh | `integrations/storage/supabase-storage.ts` |
| **Frontend Web** | **React** (`^19.3.1`) + **TypeScript** (`admin-web`) | Antarmuka `web/admin-web` (Neo-Brutalism) & `web/pengunjung-web` | `[ADA]` template / `[RENCANA]` UI bisnis | `web/admin-web/package.json`, `web/pengunjung-web/package.json` |
| **Build Tool Web** | **Vite** (`^8.3.6`) | Dev server dan bundler produksi web | `[ADA]` | `web/*/package.json` (`npm run build` PASS) |
| **Mobile Framework** | **Flutter** (Dart `^3.12.0`, target Android) | Aplikasi mobile pelanggan `ebook_store` | `[ADA]` template / `[RENCANA]` fitur | `mobile/ebook_store/pubspec.yaml` |
| **State Management** | **Riverpod** (`flutter_riverpod ^2.6.1`) | Pengelolaan state & DI di aplikasi Flutter | `[ADA]` paket terpasang / `[RENCANA]` kode | `mobile/ebook_store/pubspec.yaml` |
| **HTTP Client Mobile** | **Dio** (`^5.8.0+1`) | Komunikasi REST API Flutter ke backend | `[ADA]` paket terpasang / `[RENCANA]` kode | `mobile/ebook_store/pubspec.yaml` |
| **Pembayaran** | **Payment Gateway** (Midtrans / Xendit) | Pemrosesan transaksi nyata & *webhook* | `[ADA]` keputusan #3 / `[RENCANA]` integrasi | `keputusan-terbuka.md` (#3), `webhook-contract.md` |
| **Pengujian** | **Vitest** (`^5.1.0`), **Supertest**, **Flutter Test** | Pengujian unit & integrasi otomatis | `[ADA]` 5 tes backend + 1 tes template Flutter | `backend/vitest.config.ts`, `test-results.md` |
| **Diagram Dokumentasi** | **Mermaid** | Diagram arsitektur, UML, ERD, dan DFD pada Markdown | `[ADA]` | `docs/01-design/`, `docs/02-architecture/` |

---

## 2. Stack yang Dilarang Diganti Tanpa Persetujuan
Sesuai [`AGENTS.md`](../../AGENTS.md), seluruh komponen stack inti berikut **terkunci**: Flutter + Riverpod + Dio (Android), React + TypeScript + Vite (Admin Web Neo-Brutalism), Node.js + Express + TypeScript + Zod + Prisma 7 (ESM), PostgreSQL Supabase, Supabase Storage bucket privat, serta `SPK SAW` hanya di backend.

---

## 3. Ketergantungan Eksternal, Kesenjangan `[RENCANA]`, & Catatan ESM / Prisma 7
- **Ketergantungan Eksternal:** Ketersediaan layanan **Supabase** (Auth, PostgreSQL, Storage) dan **Payment Gateway** (Midtrans/Xendit).
- **Kesenjangan `[RENCANA]`:** `web/pengunjung-web` masih memakai `.jsx` (belum migrasi TypeScript), belum ada *package* PDF viewer di `pubspec.yaml`, belum ada ESLint di `backend/`, serta paket provider *payment gateway* belum ditambahkan ke `backend/package.json`.
- **Kompatibilitas ESM & Prisma 7:**
  - `backend/package.json` menggunakan `"type": "module"`; seluruh import relatif di file `.ts` **wajib** memakai ekstensi `.js` (`AGENTS.md`).
  - Prisma 7 memakai `prisma.config.ts` dan `@prisma/adapter-pg` dengan `pg` (*driver adapter*) alih-alih URL koneksi langsung di `schema.prisma`.
