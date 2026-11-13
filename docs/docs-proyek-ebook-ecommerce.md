# Dokumentasi Proyek: Sistem Informasi E-Book dan SPK Berbasis Mobile (Metode SAW)

**Status:** `[RENCANA]` — fondasi monorepo dan kerangka backend sudah `[ADA]`; seluruh fitur bisnis, database, dan SPK SAW masih `[RENCANA]`.

Dokumen ini menjadi indeks dan sumber kebenaran utama proyek (*single source of truth*). Diperbarui: 13 November 2026.

## 1. Ringkasan Eksekutif & Ruang Lingkup — `[ADA]`
- [Ringkasan Proyek](./01-project-overview/project-overview.md)
- [Kebutuhan Bisnis](./01-project-overview/business-requirements.md)
- [Ruang Lingkup Sistem](./01-project-overview/system-scope.md)

Model bisnis single-seller (B2C), aktor Pelanggan dan Admin, serta SPK SAW yang hanya dihitung di backend.

## 2. Arsitektur & Stack Terkunci — `[ADA]` (dokumen) / `[RENCANA]` (implementasi)
- [Arsitektur Sistem](./02-architecture/system-architecture.md)
- [Arsitektur Aplikasi](./02-architecture/application-architecture.md)
- [Technology Stack](./02-architecture/technology-stack.md)
- Stack terkunci dan aturan teknis: [`AGENTS.md`](../AGENTS.md)

## 3. Indeks Dokumen Proyek — `[ADA]`
- [`00-project/`](./00-project/) — Rencana proyek, kebutuhan, dan keputusan
- [`01-project-overview/`](./01-project-overview/) — Ringkasan, kebutuhan bisnis, ruang lingkup
- [`01-design/`](./01-design/) — Use case, diagram, arsitektur, ERD
- [`02-architecture/`](./02-architecture/) — Arsitektur sistem dan aplikasi
- [`02-api/`](./02-api/api-spec.yaml) — Kerangka OpenAPI
- [`03-business-process/`](./03-business-process/) — Alur pelanggan, admin, dan transaksi
- [`03-saw/`](./03-saw/) — Metode SAW dan perhitungan manual
- [`04-database/`](./04-database/) — Rancangan basis data dan kamus data
- [`04-testing/`](./04-testing/test-report.md) — Laporan pengujian (struktur lama)
- [`05-api/`](./05-api/) — Rancangan endpoint API
- [`05-deployment/`](./05-deployment/deployment.md) — Panduan deployment
- [`06-modules/`](./06-modules/) — Dokumentasi per modul
- [`07-security/`](./07-security/) — Kebijakan dan pedoman keamanan
- [`08-development/`](./08-development/) — Instalasi, konfigurasi, konvensi
- [`09-testing/`](./09-testing/) — Strategi, kasus uji, dan hasil pengujian
- [`10-maintenance/`](./10-maintenance/) — Troubleshooting dan pemeliharaan
- [`adr/`](./adr/) — Architecture Decision Records

## 4. Status Implementasi per Modul

| Modul | Status | Bukti / Catatan |
|---|---|---|
| Fondasi backend (Express, env Zod, error handler, validate, Prisma client, health endpoint, unit test) | `[ADA]` | `backend/src/`, `backend/tests/unit/validate.test.ts` |
| Konfigurasi ESM, TypeScript, Prisma, dan dependensi backend | `[ADA]` | `backend/tsconfig.json`, `backend/prisma.config.ts`, `backend/package.json` |
| Skema database dan migrasi | `[RENCANA]` | `prisma/schema.prisma` baru berisi generator & datasource |
| Autentikasi & otorisasi (Supabase Auth) | `[RENCANA]` | Keputusan auth: `docs/00-project/keputusan-terbuka.md` |
| Katalog & kategori e-book | `[RENCANA]` | Belum ada implementasi |
| Pesanan & pembayaran | `[RENCANA]` | Belum ada implementasi |
| Akses e-book (signed URL) | `[RENCANA]` | Helper storage `[ADA]`; endpoint & otorisasi belum |
| SPK SAW | `[RENCANA]` | Hanya backend; belum diimplementasikan |
| Dashboard & laporan admin | `[RENCANA]` | Belum ada implementasi |
| Admin Web (scaffold Vite + React) | `[ADA]` | Template; migrasi TypeScript di working tree belum dikomit |
| Pengunjung Web (scaffold Vite + React) | `[ADA]` | Template default |
| Mobile `ebook_store` (scaffold Flutter) | `[ADA]` | Template; dependensi Riverpod/Dio/secure storage di working tree belum dikomit |

## 5. Hasil Validasi Terakhir — `[ADA]`
Rincian perintah dan keluaran aktual: [Hasil Pengujian](./09-testing/test-results.md).

- Backend typecheck, unit test (3 lulus), build, dan validasi schema Prisma: **PASS**
- Admin Web lint & build: **PASS**; Pengunjung Web lint & build: **PASS**
- Mobile `flutter test`: **PASS**; `flutter analyze`: **FAIL** karena Windows Developer Mode (*symlink*) belum aktif
- Fitur bisnis belum memiliki pengujian otomatis (`[RENCANA]`)

## 6. Dokumen Referensi
- [Indeks dokumentasi](./README.md)
- [Keputusan terbuka & terkonfirmasi](./00-project/keputusan-terbuka.md)
- [Rencana proyek](./00-project/project-plan.md)
