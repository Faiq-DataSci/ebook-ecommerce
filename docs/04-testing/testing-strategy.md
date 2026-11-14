# Strategi Pengujian (`Testing Strategy`)

> **Status Dokumen:** `[ADA]` (Dokumentasi strategi pengujian)
> **Status Implementasi Pengujian:** `[ADA]` (Fondasi backend: 5 tes Vitest lulus; lint & build web lulus; `flutter analyze` & 1 tes template mobile lulus) | `[RENCANA]` (Seluruh pengujian fitur bisnis, SAW, integrasi, keamanan penuh, UI web, & E2E)
> **Referensi Utama:** [`AGENTS.md`](../../AGENTS.md), [`test-results.md`](../09-testing/test-results.md), [`backend/package.json`](../../backend/package.json), [`vitest.config.ts`](../../backend/vitest.config.ts)

---

## 1. Tujuan & Lingkup Pengujian

Strategi pengujian ini menjadi acuan utama penjaminan mutu bagi seluruh komponen proyek Sistem Informasi E-Commerce E-Book & SPK Metode SAW:
1. **Backend (`backend/`):** Pengujian unit dan integrasi API REST `/api/v1/*` menggunakan **Vitest `^5.1.0`** dan **Supertest `^7.3.2`** dengan **TypeScript `^7.0.2` (ESM)**.
2. **Admin Web (`web/admin-web/`):** Pemeriksaan statis **ESLint**, `tsc --noEmit`, dan **Vite build** (`[ADA]`), serta pengujian komponen/alur admin (`[RENCANA]`).
3. **Portal Pengunjung Web (`web/pengunjung-web/`):** Pemeriksaan statis **ESLint** dan **Vite build** (`[ADA]`), serta pengujian komponen UI publik (`[RENCANA]`).
4. **Aplikasi Mobile (`mobile/ebook_store/`):** Analisis statis **`flutter analyze`** dan **`flutter_test`** (`Dart ^3.12.0`).
5. **Integrasi Layanan Eksternal (`[RENCANA]`):** Supabase Auth (JWT), Supabase Storage bucket privat (*signed URL*), PostgreSQL Supabase via Prisma 7, serta webhook payment gateway.
6. **Modul SPK SAW (`[RENCANA]`):** Pengujian fungsi murni backend terhadap perhitungan manual `"DATA SIMULASI"` dan 20 *edge case*.

---

## 2. Piramida & Lapisan Pengujian

| Lapisan | Target Komponen | Alat / Framework | Status |
| :--- | :--- | :--- | :--- |
| **Unit Test** | Logika murni SAW, validasi Zod, kalkulasi total pesanan, helper respons & storage | Vitest `^5.1.0` (`backend/vitest.config.ts`) | `[ADA]` (3 tes helper/validate) / `[RENCANA]` (SAW & bisnis) |
| **Integration / API Test** | Endpoint REST `/api/v1/*`, otorisasi RBAC (`401`/`403`), transaksi Prisma, webhook idempoten, hak akses `EbookAccess` | Vitest `^5.1.0` + Supertest `^7.3.2` | `[ADA]` (2 tes `/health` & `401`) / `[RENCANA]` (endpoint bisnis) |
| **Widget / UI Test** | Komponen UI Flutter (`mobile/ebook_store`), komponen React `admin-web` & `pengunjung-web` | `flutter_test` (mobile); framework UI test web `[RENCANA]` | `[ADA]` (1 template `widget_test.dart`) / `[RENCANA]` (bisnis) |
| **Security & Static Check** | Linting (`eslint`, `flutter analyze`), typecheck (`tsc --noEmit`), validasi skema (`prisma validate`), audit secret `.gitignore` | ESLint, TypeScript, Flutter Analyzer, Prisma CLI | `[ADA]` (lint/build/typecheck/analyze) / `[RENCANA]` (lint backend & audit dinamis) |
| **End-to-End (E2E) Test** | Alur lengkap registrasi/login → katalog → checkout → bayar webhook → akses & baca PDF di in-app reader | Integrasi lintas klien & backend | `[RENCANA]` |

---

## 3. Konfigurasi & Prinsip Pengujian Wajib

### 3.1 Konfigurasi Aktual Backend (`[ADA]`)
Berdasarkan [`backend/vitest.config.ts`](../../backend/vitest.config.ts):
- `environment: 'node'`
- `include: ['tests/**/*.test.ts']`
- Seluruh import relatif di file `.ts` (termasuk file tes) wajib memakai ekstensi `.js` (konvensi ESM `"type": "module"`).

### 3.2 Lima Prinsip Pengujian Wajib (`AGENTS.md`)
1. Tidak ada klaim fitur selesai tanpa implementasi **dan** pengujian yang benar-benar dijalankan.
2. Tidak ada endpoint palsu atau tombol tanpa aksi.
3. Data placeholder/uji wajib berlabel **`"DATA SIMULASI"`**.
4. SPK SAW hanya dihitung di backend; bobot mentah dari klien publik tidak dipercaya.
5. Otorisasi ditegakkan di backend (verifikasi token JWT + role); menyembunyikan menu di UI hanya kosmetik.

---

## 4. Strategi Pengujian per Modul Bisnis & Gate Keluar

### 4.1 Strategi per Modul (`[RENCANA]`)
- **Autentikasi & RBAC:** Verifikasi token Supabase Auth, penolakan `401` tanpa/kedaluwarsa token, penolakan `403` untuk non-`ADMIN` pada `/api/v1/admin/*`, serta pencegahan eskalasi `role`.
- **Katalog & Kategori:** Filter `isActive = true`, paginasi, penolakan hapus kategori ber-e-book (`onDelete: Restrict`), serta memastikan `storagePath` PDF privat tidak terekspos.
- **Pesanan & Checkout:** Perhitungan `totalAmount` dan `unitPrice` murni dari `Ebook.price` di database, pencegahan duplikasi item (`@@unique([orderId, ebookId])`), dan pencegahan pembelian ulang `EbookAccess` aktif.
- **Pembayaran & Webhook:** Verifikasi signature webhook (`401`), kecocokan nominal (`400`), *idempotency* pengiriman ganda (`200`), dan atomisitas `prisma.$transaction` (`Payment -> VERIFIED`, `Order -> PAID`, `Transaction`, `EbookAccess`).
- **Akses E-Book & Signed URL:** Verifikasi `EbookAccess` dan `!isRevoked` sebelum menerbitkan *signed URL* sementara, serta blokir akses bila dicabut Admin (`403`).
- **SPK SAW:** Pengujian fungsi murni terhadap [`perhitungan-manual.md`](../03-saw/perhitungan-manual.md) dengan toleransi $10^{-6}$, *tie-breaker* judul A–Z, serta pencegahan `NaN`/`Infinity`.
- **Dashboard & Laporan Admin:** Konsistensi agregasi penjualan dari `Transaction`/`Order` berstatus `PAID` dan validasi konfigurasi bobot (`Σ = 1.0`).

### 4.2 Kriteria Penerimaan per Fase (`project-plan.md`)
- **Gate 1 (Backend):** Unit test SAW & modul bisnis + integration test Supertest PASS + uji konektivitas DB & migrasi Prisma.
- **Gate 2 (Admin Web):** `npm run lint` & `npm run build` PASS + verifikasi alur manajemen katalog, PDF privat, bobot SAW, dan pencabutan akses.
- **Gate 3 (Mobile & Pengunjung Web):** `flutter analyze` & `flutter test` PASS + `pengunjung-web` lint/build PASS + verifikasi alur E2E transaksi dan in-app reader.
- **Gate 4 (Pra-Rilis):** Seluruh skenario pada [`test-cases.md`](./test-cases.md) dan [`security-testing.md`](./security-testing.md) lulus tanpa temuan kritis.

---

## 5. Status Pengujian Aktual (`docs/09-testing/test-results.md`)

- **Backend:** 2 file (`health.test.ts`, `unit/validate.test.ts`), **5 tes lulus** (Vitest 5.1.0, `0.64 s`) `[ADA]`.
- **Admin Web:** `eslint` & `vite build` PASS, tanpa tes otomatis `[ADA]` (lint/build) / `[RENCANA]` (tes bisnis).
- **Pengunjung Web:** `eslint` & `vite build` PASS, tanpa tes otomatis `[ADA]` (lint/build) / `[RENCANA]` (tes bisnis).
- **Mobile:** `flutter analyze` PASS, `flutter test` 1 tes template (`widget_test.dart`) lulus `[ADA]` (template) / `[RENCANA]` (tes bisnis).
