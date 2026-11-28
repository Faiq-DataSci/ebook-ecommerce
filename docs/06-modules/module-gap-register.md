# Register Kesenjangan Modul (`Module Gap Register`)

**Status:** `[ADA]` (hasil audit aktual modul & keputusan terbuka)  
**Tujuan:** Mencatat seluruh kesenjangan implementasi dan keputusan terbuka yang memengaruhi modul-modul pada `docs/06-modules/` agar tidak ada klaim kesiapan palsu.

---

## Daftar Gap & Keputusan Terbuka yang Memengaruhi Modul

| ID | Gap atau Keputusan | Dampak pada Modul | Dokumen Sumber | Status Aktual | Keterangan Penyelesaian |
|---|---|---|---|---|---|
| **GAP-MOD-01** | **Keputusan #5:** Hak pengubahan bobot SAW | Modul Admin SAW — akses endpoint `PUT /api/v1/admin/saw/weights` | [`keputusan-terbuka.md`](../00-project/keputusan-terbuka.md) | `[ADA]` | Selesai diimplementasikan di `admin.routes.ts` & `saw.service.ts` dengan validasi total bobot = 1.0. |
| **GAP-MOD-02** | **Keputusan #6:** Fitur review & rating pelanggan | Modul Katalog — model `Review` | [`keputusan-terbuka.md`](../00-project/keputusan-terbuka.md) | `[ADA]` di mobile / `[RENCANA]` di DB live | UI seksi ulasan & rating bintang selesai di `mobile/ebook_store` (teruji; 150 dari 151 skenario Flutter lulus). |
| **GAP-MOD-03** | **Keputusan #7:** Perlakuan e-book tanpa rating (`ratingAvg = 0`) | Modul Katalog & SAW — normalisasi Benefit | [`keputusan-terbuka.md`](../00-project/keputusan-terbuka.md) | `[ADA]` | Selesai diuji di `saw.service.test.ts` (nilai 0 dinormalisasi aman menjadi 0 tanpa memicu division by zero). |
| **GAP-MOD-04** | **Keputusan #9:** Jumlah kriteria SAW | Modul Katalog & SAW — struktur bobot | [`keputusan-terbuka.md`](../00-project/keputusan-terbuka.md) | `[ADA]` | 5 kriteria terdefinisi di `seed-data.ts` dan diuji pada `saw.service.test.ts` persis dengan `perhitungan-manual.md`. |
| **GAP-MOD-05** | **Keputusan #11:** Penyimpanan snapshot historis SAW | Modul Katalog & SAW — audit trail | [`keputusan-terbuka.md`](../00-project/keputusan-terbuka.md) | `[RENCANA]` | Perhitungan dieksekusi on-demand murni di server. |
| **GAP-MOD-06** | Belum adanya implementasi endpoint bisnis | Seluruh modul bisnis API backend | `backend/src/app.ts` | `[ADA]` | Seluruh endpoint inti bisnis (katalog, pesanan, transaksi, webhook, signed URL, rekomendasi SAW, admin dashboard) telah diimplementasikan dan lulus 104 Vitest test. |
| **GAP-MOD-07** | Belum adanya migrasi database live | Database PostgreSQL | `backend/prisma/` | `[ADA]` | Migrasi `20261116000000_init` terdeploy ke Supabase live dan seeding `seed.ts` terverifikasi via `npm run test:cloud`. |
| **GAP-MOD-08** | Integrasi Payment Gateway Xendit QRIS | Modul Pembayaran | `backend/src/` | `[ADA]` kontrak & handler / `[RENCANA]` server key aktif | Handler webhook idempoten HMAC SHA512 selesai & teruji; Xendit Dynamic QRIS Test Mode terverifikasi live (`npm run test:cloud` 4/4 PASS) dan terintegrasi di backend, admin-web, pengunjung-web, & mobile. |
| **GAP-MOD-09** | Package PDF viewer di mobile | Modul E-Book Access di `ebook_store` | `mobile/ebook_store/pubspec.yaml` | `[ADA]` | Selesai diimplementasikan via `flutter_pdfview` pada `in_app_pdf_reader_screen.dart` dengan fitur resume progres baca & pencarian teks. |
| **GAP-MOD-10** | Sinkronisasi `User` ke PostgreSQL | Modul Autentikasi | `backend/src/middlewares/auth.middleware.ts` | `[ADA]` | Selesai diimplementasikan pada `POST /api/v1/auth/sync` dan teruji pada Vitest & verifikasi cloud Supabase. |
| **GAP-MOD-11** | `rate-limit.middleware.ts` dipasang di `app.ts` | Modul Autentikasi & Order | `backend/src/app.ts` | `[RENCANA]` | Rate limiting global dan endpoint sensitif. |
| **GAP-MOD-12** | `web/pengunjung-web` migrasi ke TypeScript | Klien web pengunjung | `web/pengunjung-web/` | `[ADA]` | Selesai 100% menggunakan TypeScript + React + Vite (9 layar lulus `typecheck` dan `build`). |
| **GAP-MOD-13** | `web/admin-web` konsol UI Neo-Brutalism | Modul Admin | `web/admin-web/src/` | `[ADA]` | Selesai dibangun bergaya Neo-Brutalism lengkap (Dashboard, Ebook Catalog, Category Catalog) dan lulus `build` serta `lint`. |
| **GAP-MOD-14** | `mobile/ebook_store` fitur lengkap | Modul Pelanggan Mobile | `mobile/ebook_store/` | `[ADA]` | Selesai dibangun (Splash, Auth, Katalog, Beranda, Keranjang, Checkout, Library, Ulasan, Profil & Transaksi, Peringkat SAW); 150 dari 151 skenario Flutter lulus (1 gagal pada `splash_screen_test.dart`). |
