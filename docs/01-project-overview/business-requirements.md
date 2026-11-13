# Kebutuhan Bisnis (`Business Requirements`)

**Status:** `[RENCANA]` (daftar kebutuhan dasar) | `[RENCANA]` (implementasi di kode)

---

## 1. Aktor Sistem

| Aktor | Peran | Aplikasi Target |
|---|---|---|
| **Pelanggan (*Customer*)** | Mengakses katalog, mencari e-book, memesan, membayar, melihat riwayat, dan membaca/mengakses e-book yang dibeli. | Mobile (`ebook_store`) `[RENCANA]`, Web Pengunjung (`web/pengunjung-web`) `[RENCANA]` |
| **Admin** | Mengelola katalog e-book, kategori, data pelanggan, memantau pesanan, memverifikasi/memantau pembayaran, serta melihat dashboard dan laporan penjualan. | Admin Web (`web/admin-web`) `[RENCANA]` |

---

## 2. Kebutuhan Fungsional — Pelanggan (`[RENCANA]` sebagai target, `[RENCANA]` di kode)

| Kode | Kebutuhan Fungsional | Status Implementasi |
|---|---|---|
| **BR-C01** | Pelanggan dapat melakukan registrasi akun dan login ke sistem. | `[RENCANA]` |
| **BR-C02** | Pelanggan dapat melihat katalog e-book yang tersedia. | `[RENCANA]` |
| **BR-C03** | Pelanggan dapat mencari e-book (berdasarkan kata kunci/kategori/rekomendasi). | `[RENCANA]` |
| **BR-C04** | Pelanggan dapat melihat detail e-book meliputi informasi penulis, kategori, deskripsi, dan harga. | `[RENCANA]` |
| **BR-C05** | Pelanggan dapat membuat pesanan (*order*) untuk satu atau lebih e-book. | `[RENCANA]` |
| **BR-C06** | Pelanggan dapat melakukan pembayaran sesuai metode yang tersedia. | `[RENCANA]` |
| **BR-C07** | Pelanggan dapat melihat status pesanan dan status pembayaran. | `[RENCANA]` |
| **BR-C08** | Pelanggan dapat melihat riwayat pembelian. | `[RENCANA]` |
| **BR-C09** | Pelanggan dapat mengakses e-book yang telah dibeli setelah pembayaran berhasil diverifikasi. | `[RENCANA]` |

---

## 3. Kebutuhan Fungsional — Admin (`[RENCANA]` sebagai target, `[RENCANA]` di kode)

| Kode | Kebutuhan Fungsional | Status Implementasi |
|---|---|---|
| **BR-A01** | Admin dapat login ke dashboard administrasi dengan hak akses khusus admin. | `[RENCANA]` |
| **BR-A02** | Admin dapat melihat ringkasan informasi pada dashboard. | `[RENCANA]` |
| **BR-A03** | Admin dapat mengelola data e-book (tambah, ubah, nonaktifkan/arsipkan). | `[RENCANA]` |
| **BR-A04** | Admin dapat mengelola kategori e-book. | `[RENCANA]` |
| **BR-A05** | Admin dapat mengelola informasi penulis jika fitur manajemen penulis dipisahkan sebagai entitas tersendiri (`[RENCANA]`). | `[RENCANA]` |
| **BR-A06** | Admin dapat mengelola data pelanggan sesuai kewenangan. | `[RENCANA]` |
| **BR-A07** | Admin dapat memantau daftar dan status pesanan pelanggan. | `[RENCANA]` |
| **BR-A08** | Admin dapat memantau status pembayaran. | `[RENCANA]` |
| **BR-A09** | Admin dapat melihat informasi transaksi. | `[RENCANA]` |
| **BR-A10** | Admin dapat melihat laporan penjualan. | `[RENCANA]` |

---

## 4. Aturan Bisnis & Keputusan Terbuka

Beberapa aturan bisnis penting telah ditetapkan atau masih menunggu keputusan final (lihat [keputusan-terbuka.md](../00-project/keputusan-terbuka.md)):

1. **Model Single-Seller `[RENCANA]`:** Hanya ada satu penjual/toko; tidak ada fitur multi-vendor atau komisi penjual.
2. **Perhitungan SPK (SAW) di Backend `[RENCANA]`:** Perhitungan SAW hanya dilakukan di backend; bobot dari klien tidak dipercaya secara langsung.
3. **Akses PDF E-Book `[RENCANA]` / Menunggu Keputusan:** Perlu diputuskan apakah PDF hanya dapat dibaca melalui *in-app reader* (via signed URL sementara) atau boleh diunduh ke perangkat.
4. **Mekanisme Pembayaran `[RENCANA]` / Menunggu Keputusan:** Perlu diputuskan apakah menggunakan simulasi pembayaran atau integrasi *payment gateway* nyata.
5. **Pengubahan Bobot SAW `[RENCANA]` / Menunggu Keputusan:** Perlu diputuskan apakah bobot kriteria SAW hanya diatur oleh admin atau dapat disesuaikan oleh pelanggan.
