# Register Gap & Keputusan Pengujian (`Test Gap Register`)

> **Status Dokumen:** `[ADA]` (Dokumentasi inventarisasi gap pengujian)
> **Referensi:** [`keputusan-terbuka.md`](../00-project/keputusan-terbuka.md), [`test-results.md`](./test-results.md), [`app.ts`](../../backend/src/app.ts)

---

## 1. Daftar Gap dan Keputusan Terbuka yang Memengaruhi Pengujian

| ID | Gap atau Keputusan | Dampak pada Pengujian | Dokumen Sumber | Status | Tindakan Lanjutan |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TG-01** | **Keputusan #5: Pengubahan bobot SAW** | Memengaruhi test case konfigurasi bobot & apakah ada uji preset bobot pelanggan | [`keputusan-terbuka.md`](../00-project/keputusan-terbuka.md) | `[RENCANA]` | Kunci otorisasi bobot sebelum menulis integration test `/recommendations/saw`. |
| **TG-02** | **Keputusan #6: Ulasan dan rating pembeli** | Memengaruhi ada/tidaknya test case `Review` dan pembaruan `ratingAvg` | [`keputusan-terbuka.md`](../00-project/keputusan-terbuka.md) | `[RENCANA]` | Tetapkan ruang lingkup fitur ulasan. |
| **TG-03** | **Keputusan #7: E-book tanpa rating** | Memengaruhi skenario `TC-SAW-12` dan *edge case* `EC-10` | [`keputusan-terbuka.md`](../00-project/keputusan-terbuka.md) | `[RENCANA]` | Sahkan perlakuan `ratingAvg = 0` di normalisasi SAW. |
| **TG-04** | **Keputusan #9: Jumlah kriteria & bobot SAW** | Memengaruhi dataset uji produksi (4 vs 5 kriteria) dan expected output | [`keputusan-terbuka.md`](../00-project/keputusan-terbuka.md) | `[RENCANA]` | Rekonsiliasi konflik kriteria sebelum unit test produksi final. |
| **TG-05** | **Keputusan #11: Snapshot hasil rekomendasi SAW** | Memengaruhi test penyimpanan & audit `SawCalculationSnapshot` | [`keputusan-terbuka.md`](../00-project/keputusan-terbuka.md) | `[RENCANA]` | Putuskan apakah snapshot historis disimpan di DB. |
| **TG-06** | **Belum adanya migrasi database nyata** | Menghambat integration test yang membutuhkan PostgreSQL Supabase | [`database-migration-plan.md`](../04-database/database-migration-plan.md) | `[RENCANA]` | Jalankan migrasi awal 8 model inti pada DB test/staging. |
| **TG-07** | **Belum adanya seed data (`DATA SIMULASI`)** | Menghambat pengujian yang membutuhkan data awal konsisten | [`database-seeding-plan.md`](../04-database/database-seeding-plan.md) | `[RENCANA]` | Buat skrip seed & fixture factory `"DATA SIMULASI"`. |
| **TG-08** | **Belum adanya model SAW pada `schema.prisma`** | Menghambat test konfigurasi bobot persisten & snapshot | [`schema.prisma`](../../backend/prisma/schema.prisma) | `[RENCANA]` | Tambahkan model SAW setelah Keputusan #5, #9, #11 final. |
| **TG-09** | **Belum adanya implementasi modul bisnis** | Seluruh skenario `TC-AUTH`, `TC-CAT`, `TC-ORD`, `TC-PAY`, `TC-ACC`, `TC-ADM` masih `[RENCANA]` | [`test-results.md`](./test-results.md) | `[RENCANA]` | Implementasikan modul backend bertahap diikuti unit & integration test. |
| **TG-10** | **Belum adanya integrasi payment gateway** | Test webhook signature, nominal, dan idempotency masih `[RENCANA]` | [`webhook-contract.md`](../02-api/webhook-contract.md) | `[RENCANA]` | Integrasikan sandbox payment gateway & tulis `TC-PAY-*`. |
| **TG-11** | **Belum adanya ESLint backend** | Tidak ada lint check otomatis di `backend/package.json` | [`test-results.md`](../09-testing/test-results.md) | `[RENCANA]` | Tambahkan konfigurasi ESLint & skrip `lint` di backend. |
| **TG-12** | **Belum adanya framework tes UI Web** | `admin-web` & `pengunjung-web` baru dicek via lint & Vite build | [`test-automation.md`](./test-automation.md) | `[RENCANA]` | Tambahkan framework tes komponen UI web saat fase web dimulai. |
| **TG-13** | **Belum adanya tes widget Flutter bisnis** | `mobile/ebook_store` baru memiliki 1 tes template `widget_test.dart` | [`test-results.md`](./test-results.md) | `[RENCANA]` | Tulis widget test untuk Auth, Katalog, SAW, Checkout, & Reader. |
| **TG-14** | **Belum adanya pipeline CI/CD** | Automasi `lint -> typecheck -> test -> build` masih berjalan manual | [`test-automation.md`](./test-automation.md) | `[RENCANA]` | Siapkan workflow CI/CD setelah Gate 1 backend terpenuhi. |
| **TG-15** | **Rate limiter belum terpasang di `app.ts`** | Pengujian `429 RATE_LIMITED` (`SEC-12`) belum dapat dijalankan | [`app.ts`](../../backend/src/app.ts) | `[RENCANA]` | Pasang `rate-limit.middleware.ts` pada router backend. |
| **TG-16** | **Kebutuhan kebijakan retensi & cleanup data uji** | Risiko penumpukan data simulasi di lingkungan test/staging | [`test-data-strategy.md`](./test-data-strategy.md) | `[RENCANA]` | Tetapkan mekanisme reset DB test sebelum/sesudah suite. |
| **TG-17** | **Inkonsistensi kode error `UNAUTHORIZED` vs `UNAUTHENTICATED`** | `health.test.ts` mengecek `UNAUTHORIZED`, sedangkan `error-catalog.md` menstandarkan `UNAUTHENTICATED` | [`health.test.ts`](../../backend/tests/health.test.ts), [`error-catalog.md`](../02-api/error-catalog.md) | `[RENCANA]` | Selaraskan `auth.middleware.ts` & `health.test.ts` ke `UNAUTHENTICATED`. |
