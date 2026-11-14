# Analisis Cakupan Pengujian (`Test Coverage`)

**Status:** `[ADA]` (cakupan fondasi 6 tes lulus + lint/build/analyze) | `[RENCANA]` (cakupan fitur bisnis & laporan coverage Vitest)  
**Referensi Utama:** [`test-results.md`](./test-results.md), [`test-cases.md`](./test-cases.md), [`project-plan.md`](../00-project/project-plan.md).

---

## 1. Metrik Cakupan Aktual (`[ADA]` vs `[RENCANA]`)

| Metrik | Nilai Aktual | Status |
|---|---|---|
| Total tes dieksekusi & lulus | **6** (5 tes Vitest backend + 1 tes template mobile) | `[ADA]` |
| Total tes bisnis yang sudah dieksekusi | **0** | `[RENCANA]` |
| Estimasi test case bisnis terencana | **~60+** (`test-cases.md`, `test-saw.md`, `test-security.md`, `test-integration.md`) | `[RENCANA]` |
| Cakupan Web (`admin-web`, `pengunjung-web`) | Lint & build PASS; 0 tes UI | `[ADA]` (statis) / `[RENCANA]` (tes) |
| Cakupan SAW | 0 dari 16 test case + 20 edge case dieksekusi | `[RENCANA]` |
| Cakupan Keamanan | 1 tes (`401` tanpa token) + `validate.test.ts` | `[ADA]` parsial / `[RENCANA]` penuh |

---

## 2. Matriks Cakupan per Modul

| Modul / Area | Kebutuhan (`FR`/`NFR`) | Terencana | Dieksekusi | Cakupan | Status |
|---|---|---|---|---|---|
| **Fondasi Backend** | `NFR-01`, `NFR-04`, `NFR-08` | 5 | **5** | 100% fondasi | `[ADA]` |
| **Authentication** | `FR-C01..02`, `FR-A01` | 10 | 0 | 0% | `[RENCANA]` |
| **Catalog & Category** | `FR-C03..05`, `FR-A03..04` | 9 | 0 | 0% | `[RENCANA]` |
| **Order Management** | `FR-C07`, `FR-C09` | 9 | 0 | 0% | `[RENCANA]` |
| **Payment & Webhook** | `FR-C08..09`, `NFR-06` | 11 | 0 | 0% | `[RENCANA]` |
| **E-Book Access** | `FR-C11`, `FR-A11`, `NFR-02` | 7 | 0 | 0% | `[RENCANA]` |
| **Admin Dashboard** | `FR-A02..10` | 11 | 0 | 0% | `[RENCANA]` |
| **SPK SAW** | `FR-S01..06`, `FR-C06` | 16 | 0 | 0% | `[RENCANA]` |
| **Security Suite** | `NFR-01..04` | 26 | 2 (`401` & Zod) | ~8% | `[ADA]` parsial / `[RENCANA]` |
| **Web (`admin` & `pengunjung`)** | `NFR-08` | 4 (`lint`+`build`) + UI | 4 (`lint`+`build`) | Statis PASS | `[ADA]` (statis) / `[RENCANA]` (UI) |
| **Mobile (`ebook_store`)** | `NFR-08` | 2 (`analyze`+`test`) + bisnis | 2 (template) | Template PASS | `[ADA]` (template) / `[RENCANA]` (bisnis) |

---

## 3. Faktor Penghambat & Prioritas Cakupan (`project-plan.md`)

- **Penghambat saat ini:** Modul bisnis belum dibangun, `prisma/migrations/` belum ada, payment gateway belum terintegrasi, keputusan terbuka (#5, #6, #7, #9, #11) belum final, belum ada framework tes UI web, dan belum ada konfigurasi coverage Vitest.
- **Prioritas Bertahap:**
  1. **Gate 1:** Backend unit & integration tests (Auth, Catalog, Order, Payment, SAW).
  2. **Gate 2:** Admin Web lint, build, & alur admin.
  3. **Gate 3:** Mobile analyze, widget test, & alur E2E.
  4. **Gate 4:** Security & integration test suite penuh.
