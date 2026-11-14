# Register Kesenjangan Pengujian (`Test Gap Register`)

**Status:** `[ADA]` (hasil audit aktual kesiapan pengujian repository)  
**Tujuan:** Mencatat seluruh gap pengujian, infrastruktur tes yang belum tersedia, dan keputusan terbuka yang memengaruhi pembuatan maupun eksekusi suite pengujian.

---

## Daftar Gap & Keputusan Pengujian

| ID | Gap atau Keputusan | Dampak pada Pengujian | Dokumen Sumber | Status | Tindakan Lanjutan |
|---|---|---|---|---|---|
| **GAP-TST-01** | **Keputusan #5:** Hak ubah bobot SAW | Test otorisasi `PUT /admin/saw/weights` & preset belum final | `keputusan-terbuka.md` | `[RENCANA]` | Kunci keputusan sebelum menulis integration test SAW |
| **GAP-TST-02** | **Keputusan #6:** Fitur review & rating | Test case model `Review` belum dapat dirancang | `keputusan-terbuka.md` | `[RENCANA]` | Tetapkan ruang lingkup `Review` |
| **GAP-TST-03** | **Keputusan #7:** E-book tanpa rating (`ratingAvg = 0`) | Memengaruhi ekspektasi `TC-SAW-12` & `EC-10` | `keputusan-terbuka.md` | `[RENCANA]` | Finalisasi kebijakan rating nol |
| **GAP-TST-04** | **Keputusan #9:** Jumlah kriteria SAW (4 vs 5) | Memengaruhi dataset uji & expected output | `keputusan-terbuka.md` | `[RENCANA]` | Finalisasi kriteria sebelum implementasi `saw.test.ts` |
| **GAP-TST-05** | **Keputusan #11:** Snapshot historis SAW | Memengaruhi test penyimpanan snapshot (`EC-20`) | `keputusan-terbuka.md` | `[RENCANA]` | Tetapkan kebutuhan tabel snapshot |
| **GAP-TST-06** | Belum adanya migrasi database (`prisma/migrations/`) | Integration test DB nyata (`TC-INT-01..07`) belum bisa dijalankan | `backend/prisma/` | `[RENCANA]` | Jalankan migrasi ke DB test sebelum fase integrasi |
| **GAP-TST-07** | Belum adanya seed data (`"DATA SIMULASI"`) | Suite integration test belum punya data awal | `database-seeding-plan.md` | `[RENCANA]` | Buat seed & fixture `"DATA SIMULASI"` |
| **GAP-TST-08** | Belum adanya model konfigurasi bobot SAW di schema | Test konfigurasi bobot persisten belum bisa diuji terhadap DB | `schema.prisma` | `[RENCANA]` | Tetapkan penyimpanan bobot SAW |
| **GAP-TST-09** | Belum adanya implementasi modul bisnis | Seluruh `TC-AUTH`, `CAT`, `ORD`, `PAY`, `ACC`, `ADM`, `SAW` masih `[RENCANA]` | `backend/src/app.ts` | `[RENCANA]` | Implementasi bertahap `Backend -> Admin Web -> Mobile` |
| **GAP-TST-10** | Belum adanya integrasi payment gateway | Test webhook & sandbox (`TC-PAY-*`) belum bisa dijalankan | `backend/src/` | `[RENCANA]` | Bangun adapter gateway + sandbox test |
| **GAP-TST-11** | Belum adanya ESLint di `backend/` | Tidak ada static lint check otomatis pada kode backend | `backend/package.json` | `[RENCANA]` | Tambahkan ESLint TypeScript di `backend/` |
| **GAP-TST-12** | Belum adanya framework tes UI di `web/*` | `admin-web` & `pengunjung-web` baru diuji `lint` & `build` | `web/*/package.json` | `[RENCANA]` | Tambahkan Vitest/Testing Library saat UI bisnis dibangun |
| **GAP-TST-13** | Belum adanya tes widget Flutter bisnis | Mobile baru memiliki 1 tes template `widget_test.dart` | `mobile/ebook_store/test/` | `[RENCANA]` | Tambahkan widget & Riverpod test untuk fitur bisnis |
| **GAP-TST-14** | `.github/workflows/ci.yml` masih placeholder | Regresi otomatis pada push/PR belum berjalan | `.github/workflows/ci.yml` | `[ADA]` placeholder | Aktifkan job CI backend, web, dan mobile |
| **GAP-TST-15** | `sensitiveEndpointLimiter` belum dipasang di `app.ts` | `TC-SEC-23` (rate limiting `429`) belum dapat diuji | `backend/src/app.ts` | `[RENCANA]` | Pasang rate limiter lalu tambah integration test |
| **GAP-TST-16** | Tidak ada konfigurasi coverage di `vitest.config.ts` | Persentase line/branch coverage belum dilaporkan | `backend/vitest.config.ts` | `[RENCANA]` | Tambahkan konfigurasi coverage Vitest |
| **GAP-TST-17** | Belum ada direktori `backend/tests/fixtures/` | Belum ada factory data uji terstruktur | `backend/tests/` | `[RENCANA]` | Buat factory fixture `"DATA SIMULASI"` |
| **GAP-TST-18** | Belum ada direktori `backend/tests/integration/` | Integration test bisnis belum terorganisasi terpisah | `backend/tests/` | `[RENCANA]` | Buat struktur `tests/integration/` saat modul dibangun |
| **GAP-TST-19** | Inkonsistensi kode error `UNAUTHORIZED` vs `UNAUTHENTICATED` | Test perlu menyelaraskan ekspektasi kode `401` | `auth.middleware.ts`, `error-catalog.md` | `[ADA]` konflik | Seragamkan kode error `401` sebelum suite auth |
