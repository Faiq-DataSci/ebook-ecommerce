# Analisis Cakupan Pengujian & Gap (`Test Coverage`)

> **Status Dokumen:** `[ADA]` (Dokumentasi analisis cakupan berdasarkan bukti aktual)
> **Sumber Data Aktual:** [`test-results.md`](./test-results.md) & [`docs/09-testing/test-results.md`](../09-testing/test-results.md)

---

## 1. Ringkasan Metrik Cakupan Aktual

- **Backend (`Vitest`):** 2 file tes, **5 tes lulus** (hanya lapisan fondasi: `/health`, `validate`, `sendSuccess`, `401` pada `/admin/ping`). **Modul bisnis: 0 tes.**
- **Web (`admin-web` & `pengunjung-web`):** ESLint & Vite build **PASS**, **0 tes otomatis bisnis/UI**.
- **Mobile (`ebook_store`):** `flutter analyze` **PASS**, **1 tes template** (`widget_test.dart`) lulus, **0 tes fitur bisnis**.
- **SPK SAW:** **0 tes dieksekusi** (16 skenario unit/integration + 20 *edge case* telah didokumentasikan pada `docs/03-saw/`).
- **Keamanan:** Baru **1 tes** (`401` tanpa token) + validasi input Zod. RBAC penuh (`403`), IDOR, *signed URL*, dan *signature webhook*: **0 tes**.
- **Integrasi Eksternal:** **0 tes** (Payment Gateway, Supabase Auth, Supabase Storage, PostgreSQL DB migrasi).

---

## 2. Matriks Cakupan per Modul

| Modul | Kebutuhan (FR/NFR) | Test Case Terencana | Test Case Dieksekusi | Cakupan | Status |
| :--- | :--- | :---: | :---: | :--- | :--- |
| **Fondasi Backend** | `NFR-01`, `NFR-04`, `NFR-07`, `NFR-08` | 5 | **5** | 100% fondasi dasar | `[ADA]` |
| **Autentikasi & RBAC Penuh** | `FR-C01`, `FR-C02`, `FR-A01`, `NFR-01` | 10 (`TC-AUTH-01`–`10`) | 0 *(selain `401` ping)* | 0% bisnis | `[RENCANA]` |
| **Katalog & Kategori** | `FR-C03`–`C05`, `FR-A03` | 9 (`TC-CAT-01`–`09`) | 0 | 0% | `[RENCANA]` |
| **Pesanan & Checkout** | `FR-C07`, `FR-C10` | 9 (`TC-ORD-01`–`09`) | 0 | 0% | `[RENCANA]` |
| **Pembayaran & Webhook** | `FR-C08`, `FR-C09`, `NFR-06` | 11 (`TC-PAY-01`–`11`) | 0 | 0% | `[RENCANA]` |
| **Akses E-Book & Signed URL** | `FR-C11`, `FR-A11`, `NFR-02` | 7 (`TC-ACC-01`–`07`) | 0 | 0% | `[RENCANA]` |
| **Admin & Laporan** | `FR-A02`–`A10` | 10 (`TC-ADM-01`–`10`) | 0 | 0% | `[RENCANA]` |
| **SPK SAW** | `FR-C06`, `FR-S01`–`S06` | 16 (`TC-SAW-01`–`16`) | 0 | 0% | `[RENCANA]` |
| **Web (`admin-web` & `pengunjung-web`)** | `NFR-08`, UI Admin/Publik | 3 (`TC-WEB-01`–`03`) | 2 (`lint` & `build`) | Lint/Build `[ADA]`, UI 0% | `[ADA]` (build) / `[RENCANA]` (UI) |
| **Mobile (`ebook_store`)** | `FR-C01`–`C11`, `NFR-08` | 3 (`TC-MOB-01`–`03`) | 2 (`analyze` + template) | Template `[ADA]`, Bisnis 0% | `[ADA]` (template) / `[RENCANA]` (bisnis) |

---

## 3. Target Cakupan Masa Depan (`[RENCANA]`) & Faktor Penghambat

### 3.1 Target Cakupan (`[RENCANA]`)
- **Fungsi Murni SAW & Kalkulasi Harga:** 100% cabang logika & *edge case* (`EC-01`–`EC-20`).
- **Endpoint Kritis Keamanan & Finansial:** 100% skenario `401`/`403`/IDOR, webhook signature & idempotency, dan validasi `EbookAccess`.

### 3.2 Faktor Penghambat Saat Ini
1. Modul bisnis backend belum diimplementasikan.
2. Migrasi database PostgreSQL Supabase belum dibuat.
3. Integrasi payment gateway (sandbox) belum tersedia.
4. Keputusan Terbuka #5, #6, #7, #9, dan #11 belum dikunci.

### 3.3 Rekomendasi Prioritas Pengujian (`project-plan.md`)
1. **Prioritas 1 (Gate 1 — Backend):** Unit test engine SAW (`perhitungan-manual.md`), integrasi Auth/RBAC, Katalog, Order, Webhook atomik, dan `EbookAccess`.
2. **Prioritas 2 (Gate 2 — Admin Web):** Pengujian alur manajemen katalog, unggah PDF privat, dan pengaturan bobot SAW.
3. **Prioritas 3 (Gate 3 — Mobile & Pengunjung Web):** Pengujian widget/UI mobile, alur E2E transaksi, dan in-app PDF reader.
