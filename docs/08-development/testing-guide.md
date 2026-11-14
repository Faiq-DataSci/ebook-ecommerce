# Panduan Pengujian Development (`Testing Guide`)

**Status:** `[ADA]` (5 tes backend + lint/build web + analyze/test mobile) | `[RENCANA]` (suite uji fitur bisnis & coverage)  
**Referensi Utama:** [`backend/vitest.config.ts`](../../backend/vitest.config.ts), [`docs/09-testing/test-results.md`](../09-testing/test-results.md), [`docs/04-testing/`](../04-testing/testing-strategy.md).

---

## 1. Framework Pengujian per Komponen

| Komponen | Framework / Tool | Versi | File Config | Status |
|---|---|---|---|---|
| **Backend (`backend/`)** | Vitest + Supertest | `^5.1.0` / `^7.3.2` | `backend/vitest.config.ts` | `[ADA]` (fondasi) / `[RENCANA]` (bisnis) |
| **Admin Web (`web/admin-web/`)** | ESLint + `tsc` + Vite build | `^10.14.0` / `^8.3.6` | `eslint.config.js`, `tsconfig.json` | `[ADA]` (lint/build) / `[RENCANA]` (tes UI) |
| **Pengunjung Web (`web/pengunjung-web/`)** | ESLint + Vite build | `^10.14.0` / `^8.3.6` | `eslint.config.js` | `[ADA]` (lint/build) / `[RENCANA]` (tes UI) |
| **Mobile (`mobile/ebook_store/`)** | `flutter_test` + `flutter analyze` | Dart `^3.12.0` | `analysis_options.yaml` | `[ADA]` (template) / `[RENCANA]` (bisnis) |

---

## 2. Konfigurasi & 5 Tes Aktual Backend (`[ADA]`)

- **Konfigurasi (`backend/vitest.config.ts`):** `environment: 'node'`, `include: ['tests/**/*.test.ts']`. *(Konfigurasi coverage masih `[RENCANA]`.)*
- **Hasil Aktual (`docs/09-testing/test-results.md`):** 2 berkas, 5 tes **PASS** (0.64 s):

| No | Nama Tes | File | Tipe | Status |
|---|---|---|---|---|
| 1 | `GET /api/v1/health returns 200 OK` | `tests/health.test.ts` | Integration (Supertest) | `[ADA]` PASS |
| 2 | `GET /api/v1/admin/ping without token returns 401 Unauthorized` | `tests/health.test.ts` | Integration (Supertest) | `[ADA]` PASS |
| 3 | `validate middleware parses body valid` | `tests/unit/validate.test.ts` | Unit | `[ADA]` PASS |
| 4 | `validate middleware passes ZodError on invalid body` | `tests/unit/validate.test.ts` | Unit | `[ADA]` PASS |
| 5 | `sendSuccess helper sends standard response` | `tests/unit/validate.test.ts` | Unit | `[ADA]` PASS |

---

## 3. Cara Menulis & Menjalankan Test

### Menulis Test Baru (`backend/`)
- **Unit test:** `tests/unit/<nama>.test.ts` (fungsi murni seperti SAW, validasi, helper).
- **Integration test:** `tests/<nama>.test.ts` (endpoint Express dengan Supertest).
- Gunakan `describe`, `it`, `expect`, dan `vi.fn()` dari Vitest; seluruh import relatif wajib memakai ekstensi `.js`.

### Perintah Menjalankan Test (PowerShell)
```powershell
npm --prefix backend test
npm --prefix web/admin-web run lint; npm --prefix web/admin-web run build
npm --prefix web/pengunjung-web run lint; npm --prefix web/pengunjung-web run build
cd mobile\ebook_store; flutter analyze; flutter test
```

---

## 4. Rencana Test & Strategi Mock (`[RENCANA]`)

- **Direktori Target:** `tests/unit/saw.test.ts`, `tests/integration/auth.test.ts`, `catalog.test.ts`, `orders.test.ts`, `payments.test.ts`, `access.test.ts`, serta `tests/fixtures/` berlabel `"DATA SIMULASI"`.
- **Strategi Mock:** Mock Prisma Client untuk unit test; mock `supabase.auth.getUser()` untuk middleware auth; mock `createSignedUrl()` untuk akses PDF; mock adapter Payment Gateway untuk webhook.
