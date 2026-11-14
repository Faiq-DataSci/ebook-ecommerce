# Strategi Pengujian Operasional (`Testing Strategy`)

**Status:** `[ADA]` (cek fondasi backend, lint/build web, analyze/test template mobile) | `[RENCANA]` (suite pengujian fitur bisnis, SAW, keamanan penuh, dan E2E)  
**Referensi Utama:** [`AGENTS.md`](../../AGENTS.md), [`docs/04-testing/testing-strategy.md`](../04-testing/testing-strategy.md), [`test-results.md`](./test-results.md), [`backend/vitest.config.ts`](../../backend/vitest.config.ts).

> **Pemisahan Lingkup:** Folder `docs/04-testing/` memuat strategi perencanaan komprehensif, sedangkan `docs/09-testing/` berfokus pada **eksekusi operasional** (apa yang diuji, bagaimana menjalankannya, dan hasil aktual yang diperoleh).

---

## 1. Tujuan & Lingkup Pengujian Operasional

Menjamin setiap perubahan pada `backend/`, `web/admin-web/`, `web/pengunjung-web/`, dan `mobile/ebook_store/` diverifikasi secara terukur sebelum dinyatakan selesai, mencakup unit logic (termasuk SPK SAW), integrasi API/DB/Storage/Gateway, keamanan, serta static check lint/typecheck/build.

---

## 2. Piramida & Lapisan Pengujian

| Lapisan | Target Komponen | Alat / Framework | Konfigurasi | Status |
|---|---|---|---|---|
| **Unit Test** | Logika murni SAW, validasi Zod, kalkulasi total, helper | Vitest `^5.1.0` | `backend/vitest.config.ts` | `[ADA]` (3 tes helper/validate) / `[RENCANA]` (SAW & bisnis) |
| **Integration / API Test** | Endpoint REST, otorisasi `401`/`403`, transaksi DB, webhook | Vitest `^5.1.0` + Supertest `^7.3.2` | `backend/vitest.config.ts` | `[ADA]` (2 tes `/health` & `/admin/ping`) / `[RENCANA]` (bisnis) |
| **Widget / UI Test** | Aplikasi mobile & dashboard web | `flutter_test` (mobile); UI test web `[RENCANA]` | `mobile/ebook_store/test/` | `[ADA]` (1 tes template) / `[RENCANA]` (bisnis) |
| **Security & Static Check** | Linting, typecheck, validasi skema, audit secret | ESLint, `tsc --noEmit`, `flutter analyze`, `prisma validate` | `tsconfig.json`, `eslint.config.js`, `analysis_options.yaml` | `[ADA]` (lint/build/typecheck/analyze) |
| **End-to-End (E2E)** | Alur registrasi -> katalog -> checkout -> bayar -> baca PDF | Lintas klien & backend | `[RENCANA]` | `[RENCANA]` |

---

## 3. Framework & Konfigurasi Aktual (`[ADA]`)

- **Backend:** Vitest `^5.1.0` + Supertest `^7.3.2` dengan `backend/vitest.config.ts` (`environment: 'node'`, `include: ['tests/**/*.test.ts']`).
- **Web:** ESLint `^10.14.0` + Vite `^8.3.6` build (`tsc --noEmit` + `vite build` di `admin-web`; `vite build` di `pengunjung-web`); belum ada framework tes UI.
- **Mobile:** `flutter_test` + `flutter analyze` (memerlukan Windows Developer Mode aktif).

---

## 4. Prinsip Pengujian Wajib (`AGENTS.md`)

1. Tidak ada klaim fitur selesai tanpa implementasi **dan** pengujian yang benar-benar dijalankan.
2. Tidak ada endpoint palsu atau tombol tanpa aksi.
3. Data placeholder/uji wajib berlabel **`"DATA SIMULASI"`**.
4. SPK SAW hanya dihitung dan diuji di backend (`ADR-0002`).
5. Otorisasi ditegakkan di backend (token JWT + role).

---

## 5. Skenario Kritis Wajib Otomatis Sebelum Rilis (`[RENCANA]`)

1. Otorisasi admin vs pelanggan (`401` tanpa token, `403` role `CUSTOMER` ke `/admin/*`).
2. Snapshot harga (total pesanan & `unitPrice` dari DB, abaikan harga klien).
3. Idempotensi verifikasi pembayaran (`DUPLICATE_WEBHOOK` tanpa mutasi ganda).
4. Penolakan akses PDF tanpa `EbookAccess` aktif (`403 EBOOK_ACCESS_DENIED`).
5. Perhitungan SAW backend-only (tolak bobot klien publik, identik perhitungan manual).
6. Transaksi atomik `prisma.$transaction` (rollback penuh bila salah satu langkah gagal).

---

## 6. Status Pengujian Aktual & Gate Keluar per Fase

| Komponen | Tes Dieksekusi | Hasil | Cakupan | Status |
|---|---|---|---|---|
| **Backend** | 5 tes (`health.test.ts`, `validate.test.ts`) | **PASS** (0.64 s) | Fondasi `/health`, `401`, `validate`, `sendSuccess` | `[ADA]` |
| **Admin Web** | 0 tes otomatis | **Lint & Build PASS** | Statis & bundle | `[ADA]` (statis) / `[RENCANA]` (tes) |
| **Pengunjung Web** | 0 tes otomatis | **Lint & Build PASS** | Statis & bundle | `[ADA]` (statis) / `[RENCANA]` (tes) |
| **Mobile** | 1 tes template (`widget_test.dart`) | **Analyze & Test PASS** | Template counter app | `[ADA]` (template) / `[RENCANA]` (bisnis) |

- **Gate 1 (Backend):** Unit & integration test backend PASS + uji konektivitas DB.
- **Gate 2 (Admin Web):** Lint & build PASS + verifikasi alur admin.
- **Gate 3 (Mobile & Web Pengunjung):** Analyze & test PASS + alur E2E transaksi dan *in-app reader*.
- **Gate 4 (Pra-Rilis):** Seluruh skenario [`test-cases.md`](./test-cases.md) dan [`test-security.md`](./test-security.md) lulus.
