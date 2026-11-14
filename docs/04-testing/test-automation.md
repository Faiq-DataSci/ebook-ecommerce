# Rencana Automasi Pengujian (`Test Automation`)

> **Status Dokumen:** `[ADA]` (Dokumentasi rencana automasi) | **Pipeline CI/CD & Suite Bisnis:** `[RENCANA]`
> **Referensi:** [`backend/package.json`](../../backend/package.json), [`backend/vitest.config.ts`](../../backend/vitest.config.ts), [`project-plan.md`](../00-project/project-plan.md)

---

## 1. Framework & Struktur Direktori Pengujian

### 1.1 Status Framework Saat Ini
- **Backend:** Vitest `^5.1.0` + Supertest `^7.3.2` (`backend/vitest.config.ts`) `[ADA]`.
- **Web (`admin-web` & `pengunjung-web`):** ESLint + Vite build `[ADA]`. Framework tes UI web (mis. Vitest + Testing Library / Playwright) belum dipasang `[RENCANA]`.
- **Mobile (`ebook_store`):** `flutter_test` + `flutter analyze` `[ADA]` (baru 1 template `widget_test.dart`); tes widget bisnis masih `[RENCANA]`.

### 1.2 Struktur Direktori Backend Aktual vs Rencana
- **Aktual (`[ADA]`):**
  - `backend/tests/health.test.ts` — integration test dasar (Supertest)
  - `backend/tests/unit/validate.test.ts` — unit test middleware `validate` & helper `sendSuccess`
- **Rencana Masa Depan (`[RENCANA]`):**
  - `tests/unit/` — unit test murni (engine SAW, validasi Zod, kalkulasi harga)
  - `tests/integration/` — integration test endpoint (`/api/v1/*`, RBAC, webhook, `EbookAccess`)
  - `tests/fixtures/` — factory & dataset `"DATA SIMULASI"`

---

## 2. Ringkasan Komponen, Skrip Automasi & Gate

| Komponen | Framework | Skrip Automasi | Gate | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Backend** | Vitest `^5.1.0` + Supertest `^7.3.2` | `npm ci && npm run typecheck && npm test && npm run build` | **Gate 1:** Unit & integration test backend PASS + uji konektivitas DB | `[ADA]` (fondasi) / `[RENCANA]` (CI & bisnis) |
| **Admin Web** | ESLint + Vite (`tsc` + `vite build`) + UI test `[RENCANA]` | `npm ci && npm run lint && npm run build` | **Gate 2:** Lint & build PASS + tes alur admin | `[ADA]` (lint/build) / `[RENCANA]` (UI test & CI) |
| **Pengunjung Web** | ESLint + Vite (`vite build`) + UI test `[RENCANA]` | `npm ci && npm run lint && npm run build` | **Gate 3:** Lint & build PASS + alur katalog/SAW publik | `[ADA]` (lint/build) / `[RENCANA]` (UI test & CI) |
| **Mobile** | `flutter analyze` + `flutter_test` | `flutter pub get && flutter analyze && flutter test` | **Gate 3 & 4:** Analyze & test PASS + alur E2E | `[ADA]` (template) / `[RENCANA]` (bisnis & CI) |

---

## 3. Strategi Mock, Stub, dan Test Database (`[RENCANA]`)

1. **Strategi Mock & Stub untuk Unit/Integration Terisolasi:**
   - **Mock Prisma Client** pada unit test agar logika bisnis & SAW teruji cepat tanpa menyentuh DB nyata.
   - **Mock Supabase Auth `getUser()`** untuk menguji middleware `authenticate` & `authorize` (`CUSTOMER` vs `ADMIN`).
   - **Mock Supabase Storage `createSignedUrl()`** untuk menguji penerbitan *signed URL* sementara tanpa dependensi jaringan.
   - **Mock HTTP Request Payment Gateway** untuk menguji verifikasi signature dan *idempotency* webhook.
2. **Strategi Test Database (`[RENCANA]`):**
   - Gunakan database Supabase test terpisah dari production.
   - Reset data test sebelum/sesudah suite atau bungkus tiap test case dalam transaksi yang di-rollback.
