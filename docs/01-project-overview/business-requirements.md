# Kebutuhan Bisnis (`Business Requirements`)

**Status:** `[RENCANA]` — Seluruh kebutuhan bisnis di bawah ini merupakan target sistem yang belum diimplementasikan di kode sumber.

Dokumen ini memisahkan kebutuhan bisnis dari detail teknis implementasi (endpoint API maupun skema tabel). Rincian teknis terstruktur mengacu pada [`requirements.md`](../00-project/requirements.md) dan [`docs/01-design/`](../01-design/design-traceability.md).

---

## 1. Kebutuhan Bisnis — Pelanggan (`BR-Cxx`)

| ID | Pernyataan Kebutuhan | Nilai / Masalah yang Diselesaikan | Aktor | Prioritas MoSCoW | Dependensi Utama | Status | Ref. Fungsional |
|---|---|---|---|---|---|---|---|
| **BR-C01** | Pelanggan dapat mendaftar, masuk, dan mengelola profil dasar akunnya. | Memastikan identitas pembeli sah sebelum bertransaksi dan memiliki pustaka pribadi. | Pelanggan | `Must Have` | Keputusan #2 (Supabase Auth) `[ADA]` | `[RENCANA]` | `FR-C01`, `FR-C02` |
| **BR-C02** | Pelanggan dapat menelusuri katalog, memfilter kategori, mencari judul/penulis, dan melihat detail `e-book`. | Memudahkan penemuan `e-book` yang relevan beserta informasi harga sebelum membeli. | Pelanggan | `Must Have` | Katalog dikelola Admin (`BR-A03`, `BR-A04`) | `[RENCANA]` | `FR-C03`–`FR-C05` |
| **BR-C03** | Pelanggan dapat membuat pesanan untuk satu atau lebih `e-book` dengan harga yang terkunci saat *checkout*. | Mencegah ketidaksesuaian tagihan apabila harga katalog berubah setelah pesanan dibuat. | Pelanggan | `Must Have` | `BR-C01`, `BR-C02` | `[RENCANA]` | `FR-C07` |
| **BR-C04** | Pelanggan dapat memantau status pesanan, status pembayaran, dan riwayat pembeliannya. | Memberikan transparansi status transaksi serta bukti kepemilikan `e-book`. | Pelanggan | `Must Have` | `BR-C03`, `BR-T01` | `[RENCANA]` | `FR-C09`, `FR-C10` |
| **BR-C05** | Pelanggan dapat memberikan ulasan/rating pada `e-book` yang telah dibeli. | Menyediakan umpan balik kualitas `e-book` bagi pembeli lain dan data pendukung rekomendasi. | Pelanggan | `Could Have` | Keputusan #6 & #7 `[RENCANA]` | `[RENCANA]` | `FR-C12` |

---

## 2. Kebutuhan Bisnis — Admin (`BR-Axx`)

| ID | Pernyataan Kebutuhan | Nilai / Masalah yang Diselesaikan | Aktor | Prioritas MoSCoW | Dependensi Utama | Status | Ref. Fungsional |
|---|---|---|---|---|---|---|---|
| **BR-A01** | Admin dapat masuk ke panel administrasi dengan hak akses khusus peran `Admin`. | Membatasi pengelolaan katalog, data pelanggan, dan laporan hanya kepada pengelola resmi. | Admin | `Must Have` | Keputusan #2, `BR-O01` | `[RENCANA]` | `FR-A01` |
| **BR-A02** | Admin dapat melihat ringkasan aktivitas toko pada dashboard operasional. | Mempercepat pemantauan kinerja penjualan dan status pesanan harian. | Admin | `Must Have` | `BR-A01`, `BR-T01` | `[RENCANA]` | `FR-A02` |
| **BR-A03** | Admin dapat menambah, mengubah, dan mengarsipkan data `e-book` beserta file PDF-nya. | Menjaga ketersediaan dan akurasi katalog tanpa merusak riwayat pembelian lama. | Admin | `Must Have` | `BR-A01`, `BR-A04`, `BR-K01` | `[RENCANA]` | `FR-A04` |
| **BR-A04** | Admin dapat mengelola kategori pengelompokan `e-book`. | Menjaga struktur navigasi katalog tetap rapi dan konsisten. | Admin | `Must Have` | `BR-A01` | `[RENCANA]` | `FR-A03` |
| **BR-A05** | Admin dapat mengelola data penulis secara terpisah apabila dipisahkan sebagai entitas tersendiri. | Mendukung standarisasi profil penulis jika cakupan diperluas. | Admin | `Could Have` | Konfirmasi kebutuhan entitas penulis (`[RENCANA]`) | `[RENCANA]` | *(Gap — lihat `design-assumptions-and-gaps.md`)* |
| **BR-A06** | Admin dapat memantau daftar pelanggan serta mengaktifkan/menonaktifkan akun sesuai kewenangan. | Mendukung penanganan kendala akun dan kepatuhan operasional. | Admin | `Must Have` | `BR-A01`, `BR-C01` | `[RENCANA]` | `FR-A05` |

---

## 3. Kebutuhan Operasional Sistem (`BR-Oxx`)

| ID | Pernyataan Kebutuhan | Nilai / Masalah yang Diselesaikan | Aktor | Prioritas MoSCoW | Dependensi Utama | Status | Ref. Fungsional |
|---|---|---|---|---|---|---|---|
| **BR-O01** | Sistem menegakkan verifikasi token dan peran (`Pelanggan` / `Admin`) secara terpusat di `backend`. | Mencegah penyalahgunaan akses melalui manipulasi antarmuka klien. | Sistem (`backend`) | `Must Have` | Keputusan #2 `[ADA]` | `[RENCANA]` | `NFR-01` |
| **BR-O02** | Sistem menjaga integritas riwayat pesanan dan hak akses dengan melarang penghapusan permanen `e-book` yang pernah dibeli. | Menjamin pembeli sah tetap memiliki catatan transaksi dan akses konten. | Sistem (`backend`) | `Must Have` | `BR-A03` | `[RENCANA]` | `FR-A04`, `NFR-07` |

---

## 4. Kebutuhan Rekomendasi `SPK SAW` (`BR-Sxx`)

| ID | Pernyataan Kebutuhan | Nilai / Masalah yang Diselesaikan | Aktor | Prioritas MoSCoW | Dependensi Utama | Status | Ref. Fungsional |
|---|---|---|---|---|---|---|---|
| **BR-S01** | Pelanggan dapat memperoleh daftar rekomendasi `e-book` berperingkat dari perhitungan `SPK SAW` di `backend`. | Membantu pelanggan memilih `e-book` secara objektif dan konsisten lintas platform. | Pelanggan, Sistem | `Must Have` | [ADR-0002](../adr/0002-backend-only-saw.md), Keputusan #9 `[RENCANA]` | `[RENCANA]` | `FR-C06`, `FR-S01`–`FR-S04`, `FR-S06` |
| **BR-S02** | Admin dapat mengatur dan memvalidasi bobot kriteria `SPK SAW` (total bobot = `1,0`) serta meninjau riwayat/audit hasil. | Menjaga relevansi rekomendasi terhadap kebijakan bisnis tanpa mempercayai bobot mentah dari klien. | Admin, Sistem | `Should Have` | Keputusan #5 & #11 `[RENCANA]` | `[RENCANA]` | `FR-A10`, `FR-S02`, `FR-S05` |

---

## 5. Kebutuhan Keamanan & Akses `E-Book` (`BR-Kxx`)

| ID | Pernyataan Kebutuhan | Nilai / Masalah yang Diselesaikan | Aktor | Prioritas MoSCoW | Dependensi Utama | Status | Ref. Fungsional |
|---|---|---|---|---|---|---|---|
| **BR-K01** | File PDF `e-book` disimpan pada **`bucket privat`** dan hanya dapat dibaca di dalam aplikasi via **`signed URL`** sementara setelah kepemilikan terverifikasi. | Melindungi hak cipta dan mencegah distribusi bebas file PDF tanpa pembelian sah. | Pelanggan, Sistem | `Must Have` | Keputusan #4 `[ADA]`, `BR-T01` | `[RENCANA]` | `FR-C11`, `NFR-02` |
| **BR-K02** | Admin dapat mencabut atau memulihkan hak akses `e-book` milik pelanggan tertentu bila terjadi sengketa atau pelanggaran. | Memberikan kendali operasional atas kasus pembatalan atau penyalahgunaan akses. | Admin | `Should Have` | `BR-K01` | `[RENCANA]` | `FR-A11` |

---

## 6. Kebutuhan Transaksi & Pembayaran (`BR-Txx`)

| ID | Pernyataan Kebutuhan | Nilai / Masalah yang Diselesaikan | Aktor | Prioritas MoSCoW | Dependensi Utama | Status | Ref. Fungsional |
|---|---|---|---|---|---|---|---|
| **BR-T01** | Pelanggan menyelesaikan pembayaran melalui *payment gateway* nyata, dan `backend` memverifikasi notifikasi *webhook* secara idempoten serta atomik. | Mencegah akses gratis akibat klaim palsu, mencegah pencatatan transaksi ganda, dan memastikan akses aktif begitu pembayaran sah. | Pelanggan, *Payment Gateway*, Sistem | `Must Have` | Keputusan #3 `[ADA]` | `[RENCANA]` | `FR-C08`, `NFR-06` |

---

## 7. Kebutuhan Pelaporan Administrasi (`BR-Rxx`)

| ID | Pernyataan Kebutuhan | Nilai / Masalah yang Diselesaikan | Aktor | Prioritas MoSCoW | Dependensi Utama | Status | Ref. Fungsional |
|---|---|---|---|---|---|---|---|
| **BR-R01** | Admin dapat memantau daftar pesanan, status pembayaran, catatan transaksi resmi, serta menghasilkan laporan penjualan per periode. | Mendukung audit keuangan, rekonsiliasi pembayaran, dan evaluasi kinerja katalog. | Admin | `Must Have` | `BR-A01`, `BR-T01` | `[RENCANA]` | `FR-A06`–`FR-A09` |

---

## 8. Kebutuhan di Luar Ruang Lingkup (*Out-of-Scope*)

Hal-hal berikut **tidak** termasuk kebutuhan bisnis sistem ini (lihat [`system-scope.md`](./system-scope.md)):
1. Fitur *marketplace* multi-penjual, komisi vendor, atau pengelolaan toko pihak ketiga ([ADR-0001](../adr/0001-single-seller-b2c.md)).
2. Penjualan buku fisik, manajemen stok gudang, maupun integrasi pengiriman/kurir fisik.
3. Perhitungan skor `SPK SAW` di sisi aplikasi klien (`mobile` maupun `web`).
4. Pengunduhan bebas file PDF ke penyimpanan publik perangkat di luar *in-app reader* (Keputusan #4 `[ADA]`).

---

## 9. Referensi Keputusan Terbuka (`[RENCANA]`)
Keputusan #5 (hak ubah bobot SAW oleh pelanggan), #6–#7 (cakupan ulasan & `e-book` tanpa rating), #8 (nama/logo final), #9 (konflik 4 vs 5 kriteria SAW), #10 (hosting `backend`), dan #11 (penyimpanan snapshot riwayat SAW) masih berstatus `[RENCANA]` di [`keputusan-terbuka.md`](../00-project/keputusan-terbuka.md).
