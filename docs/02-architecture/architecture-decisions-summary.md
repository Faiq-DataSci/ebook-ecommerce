# Ringkasan Keputusan Arsitektur (`Architecture Decisions Summary`)

**Status:** `[ADA]` (3 ADR dan 4 keputusan proyek terkunci) | `[RENCANA]` (7 keputusan terbuka yang belum ditetapkan final)

Dokumen ini merangkum seluruh keputusan arsitektur yang mengikat pengembangan sistem tanpa menetapkan keputusan terbuka yang masih menunggu konfirmasi pemilik proyek.

---

## Ringkasan Keputusan Terkunci (`[ADA]`) & Terbuka (`[RENCANA]`)

| ID | Keputusan | Alasan | Dampak Teknis | Status | Dokumen Detail |
|---|---|---|---|---|---|
| **ADR-0001** | Model bisnis **Single-Seller B2C** (2 aktor: Pelanggan & Admin) | Fokus pada ruang lingkup tim 3 orang tanpa kompleksitas marketplace/komisi vendor. | Tidak ada entitas toko/vendor; seluruh katalog dikelola Admin. | `[ADA]` | [`0001-single-seller-b2c.md`](../adr/0001-single-seller-b2c.md) |
| **ADR-0002** | Perhitungan **SPK SAW hanya di backend** | Mencegah manipulasi bobot di klien dan menjamin konsistensi hasil & snapshot historis. | Klien hanya menerima peringkat & skor; bobot mentah klien ditolak. | `[ADA]` | [`0002-backend-only-saw.md`](../adr/0002-backend-only-saw.md) |
| **ADR-0003** | Urutan pengembangan **`Backend -> Admin Web -> Mobile`** | Menstabilkan kontrak API dan data katalog nyata sebelum UI pelanggan dibangun. | API & admin CRUD dibangun lebih dulu dengan uji konektivitas di tiap gate. | `[ADA]` | [`0003-admin-web-sebelum-mobile.md`](../adr/0003-admin-web-sebelum-mobile.md) |
| **KEP-1** | `web/pengunjung-web/` dipertahankan sebagai portal web pelanggan | Melengkapi aplikasi mobile `ebook_store` di platform web. | Mengonsumsi REST API backend yang sama dengan mobile (`CUSTOMER`). | `[ADA]` | [`keputusan-terbuka.md`](../00-project/keputusan-terbuka.md) (#1) |
| **KEP-2** | Autentikasi menggunakan **Supabase Auth** + verifikasi JWT di backend | Mengurangi risiko pengelolaan password lokal dan menyatukan identitas sesi. | Backend memverifikasi JWT via `getUser(token)` dan menyimpan `supabaseUserId`. | `[ADA]` | [`keputusan-terbuka.md`](../00-project/keputusan-terbuka.md) (#2) |
| **KEP-3** | Pembayaran menggunakan **Payment Gateway nyata** dengan webhook | Menjamin alur transaksi realistis dan verifikasi pembayaran terpercaya. | Memerlukan endpoint *webhook* bertanda tangan, idempoten, dan transaksi atomik. | `[ADA]` | [`keputusan-terbuka.md`](../00-project/keputusan-terbuka.md) (#3) |
| **KEP-4** | Storage PDF pada **bucket privat** + akses *in-app reader* via **signed URL** | Melindungi aset digital PDF dari unduhan bebas dan tautan publik permanen. | Backend memvalidasi `EbookAccess` aktif sebelum menerbitkan `signed URL` TTL singkat. | `[ADA]` | [`keputusan-terbuka.md`](../00-project/keputusan-terbuka.md) (#4) |
| **KEP-5** | Hak pengubahan bobot SAW (hanya Admin vs juga Pelanggan) | Menentukan apakah pelanggan dapat memilih preferensi/preset bobot. | Memengaruhi parameter `GET /recommendations/saw` dan kontrol UI klien. | `[RENCANA]` | [`keputusan-terbuka.md`](../00-project/keputusan-terbuka.md) (#5) |
| **KEP-6 & #7** | Cakupan fitur ulasan/rating & perlakuan e-book tanpa rating (`ratingAvg = 0`) | Menjaga integritas data rating dan stabilitas normalisasi SAW untuk produk baru. | Menentukan penambahan model `Review` di Prisma dan aturan *edge case* SAW. | `[RENCANA]` | [`keputusan-terbuka.md`](../00-project/keputusan-terbuka.md) (#6–#7) |
| **KEP-8** | Identitas & logo final aplikasi | Penyeragaman merek di seluruh klien dan laporan akademik. | Memengaruhi label UI dan aset visual tanpa mengubah arsitektur backend. | `[RENCANA]` | [`keputusan-terbuka.md`](../00-project/keputusan-terbuka.md) (#8) |
| **KEP-9** | Konflik jumlah kriteria SAW (4 kriteria `0,35/0,30/0,20/0,15` vs 5 kriteria) | Memastikan 100% kriteria SAW memiliki kolom data nyata di database dan cocok dengan hitung manual. | Menentukan skema kriteria SAW, perhitungan manual, dan unit test backend. | `[RENCANA]` | [`keputusan-terbuka.md`](../00-project/keputusan-terbuka.md) (#9) |
| **KEP-10** | Pilihan platform hosting backend (Vercel Functions vs layanan Node.js lain) | Menjamin kompatibilitas Prisma 7, koneksi pool PostgreSQL, dan keandalan *webhook*. | Memengaruhi konfigurasi server, pooling DB, dan panduan deployment. | `[RENCANA]` | [`keputusan-terbuka.md`](../00-project/keputusan-terbuka.md) (#10) |
| **KEP-11** | Penyimpanan riwayat / snapshot hasil rekomendasi SAW | Kebutuhan audit historis peringkat rekomendasi per sesi/pengguna. | Menentukan penambahan tabel `SawCalculationSnapshot` di `schema.prisma`. | `[RENCANA]` | [`keputusan-terbuka.md`](../00-project/keputusan-terbuka.md) (#11) |
