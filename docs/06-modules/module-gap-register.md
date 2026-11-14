# Register Kesenjangan Modul (`Module Gap Register`)

**Status:** `[ADA]` (hasil audit aktual modul & keputusan terbuka)  
**Tujuan:** Mencatat seluruh kesenjangan implementasi dan keputusan terbuka yang memengaruhi modul-modul pada `docs/06-modules/` agar tidak ada klaim kesiapan palsu.

---

## Daftar Gap & Keputusan Terbuka yang Memengaruhi Modul

| ID | Gap atau Keputusan | Dampak pada Modul | Dokumen Sumber | Status | Tindakan Lanjutan |
|---|---|---|---|---|---|
| **GAP-MOD-01** | **Keputusan #5:** Hak pengubahan bobot SAW (Admin vs tetap) | Modul Katalog & SAW (`ebook-catalog.md`) — akses endpoint `PUT /admin/saw/weights` | [`keputusan-terbuka.md`](../00-project/keputusan-terbuka.md) | `[RENCANA]` | Kunci keputusan sebelum membangun endpoint admin SAW |
| **GAP-MOD-02** | **Keputusan #6:** Fitur review & rating pelanggan | Modul Katalog (`ebook-catalog.md`) — butuh model `Review` baru di luar 8 model awal | [`keputusan-terbuka.md`](../00-project/keputusan-terbuka.md) | `[RENCANA]` | Tetapkan apakah masuk fase 1 atau fase lanjut |
| **GAP-MOD-03** | **Keputusan #7:** Perlakuan e-book tanpa rating (`ratingAvg = 0`) | Modul Katalog & SAW (`ebook-catalog.md`) — normalisasi SAW saat `ratingAvg = 0` | [`keputusan-terbuka.md`](../00-project/keputusan-terbuka.md) | `[RENCANA]` | Pastikan aturan penanganan nilai nol diterapkan di fungsi SAW |
| **GAP-MOD-04** | **Keputusan #9:** Jumlah kriteria SAW (4 vs 5 kriteria) | Modul Katalog & SAW (`ebook-catalog.md`) — struktur vektor bobot | [`keputusan-terbuka.md`](../00-project/keputusan-terbuka.md) | `[RENCANA]` | Selaraskan definisi kriteria sebelum unit test final SAW |
| **GAP-MOD-05** | **Keputusan #11:** Penyimpanan snapshot historis hasil SAW | Modul Katalog & SAW (`ebook-catalog.md`) — audit trail hasil rekomendasi | [`keputusan-terbuka.md`](../00-project/keputusan-terbuka.md) | `[RENCANA]` | Tentukan kebutuhan tabel snapshot di `schema.prisma` |
| **GAP-MOD-06** | Belum adanya implementasi endpoint bisnis | Seluruh 6 modul bisnis (`docs/06-modules/*.md`) berstatus `[RENCANA]` | `backend/src/app.ts` | `[RENCANA]` | Implementasi bertahap sesuai urutan `Backend -> Admin Web -> Mobile` |
| **GAP-MOD-07** | Belum adanya migrasi database (`prisma/migrations/`) | Semua modul tidak dapat dijalankan terhadap database PostgreSQL nyata | `backend/prisma/` | `[RENCANA]` | Jalankan `prisma migrate dev` saat koneksi DB Supabase siap |
| **GAP-MOD-08** | Belum adanya integrasi Payment Gateway nyata | Modul Pembayaran (`payment-management.md`) belum bisa memproses transaksi & webhook | `backend/src/` | `[RENCANA]` | Bangun adapter gateway + handler webhook terverifikasi signature |
| **GAP-MOD-09** | Belum adanya package PDF viewer di mobile | Modul E-Book Access (`ebook-access.md`) belum dapat merender PDF di `ebook_store` | `mobile/ebook_store/pubspec.yaml` | `[RENCANA]` | Tambahkan package PDF viewer Flutter saat fase mobile |
| **GAP-MOD-10** | Belum adanya sinkronisasi `User` ke PostgreSQL | Modul Autentikasi (`authentication.md`) belum menyimpan/memperbarui profil di `users` | `backend/src/middlewares/auth.middleware.ts` | `[RENCANA]` | Implementasi `POST /api/v1/auth/sync` dan integrasi `getUser` |
| **GAP-MOD-11** | `rate-limit.middleware.ts` belum dipasang di `app.ts` | Modul Autentikasi & Order belum terlindungi dari brute-force/abuse | `backend/src/app.ts` | `[RENCANA]` | Pasang rate limiter pada route auth, orders, dan payments |
| **GAP-MOD-12** | `web/pengunjung-web` masih memakai `.jsx` | Klien web pengunjung belum memiliki keamanan tipe TypeScript | `web/pengunjung-web/package.json` | `[RENCANA]` | Migrasi bertahap ke TypeScript atau jaga validasi respons API |
| **GAP-MOD-13** | `web/admin-web` masih berupa template Vite awal | Modul Admin Dashboard (`admin-dashboard.md`) belum memiliki UI bisnis | `web/admin-web/src/` | `[RENCANA]` | Bangun UI neo-brutalism setelah endpoint backend siap |
| **GAP-MOD-14** | `mobile/ebook_store` masih berupa template counter app | Modul pelanggan di mobile belum memiliki layar katalog, SAW, order, maupun reader | `mobile/ebook_store/lib/main.dart` | `[RENCANA]` | Bangun arsitektur Riverpod + Dio 3 lapis setelah backend & admin web |
