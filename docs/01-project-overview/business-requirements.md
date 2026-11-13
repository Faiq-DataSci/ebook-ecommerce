# Kebutuhan Bisnis (`Business Requirements`)

**Status:** `[CONFIRMED]` (daftar kebutuhan dasar) | `[NOT AVAILABLE]` (implementasi di kode)

---

## 1. Aktor Sistem

| Aktor | Peran | Aplikasi Target |
|---|---|---|
| **Pelanggan (*Customer*)** | Mengakses katalog, mencari e-book, memesan, membayar, melihat riwayat, dan membaca/mengakses e-book yang dibeli. | Mobile (`ebook_store`) `[CONFIRMED]`, Web Pengunjung (`web/pengunjung-web`) `[ASSUMPTION]` |
| **Admin** | Mengelola katalog e-book, kategori, data pelanggan, memantau pesanan, memverifikasi/memantau pembayaran, serta melihat dashboard dan laporan penjualan. | Admin Web (`web/admin-web`) `[CONFIRMED]` |

---

## 2. Kebutuhan Fungsional — Pelanggan (`[CONFIRMED]` sebagai target, `[NOT AVAILABLE]` di kode)

| Kode | Kebutuhan Fungsional | Status Implementasi |
|---|---|---|
| **BR-C01** | Pelanggan dapat melakukan registrasi akun dan login ke sistem. | `[NOT AVAILABLE]` |
| **BR-C02** | Pelanggan dapat melihat katalog e-book yang tersedia. | `[NOT AVAILABLE]` |
| **BR-C03** | Pelanggan dapat mencari e-book (berdasarkan kata kunci/kategori/rekomendasi). | `[NOT AVAILABLE]` |
| **BR-C04** | Pelanggan dapat melihat detail e-book meliputi informasi penulis, kategori, deskripsi, dan harga. | `[NOT AVAILABLE]` |
| **BR-C05** | Pelanggan dapat membuat pesanan (*order*) untuk satu atau lebih e-book. | `[NOT AVAILABLE]` |
| **BR-C06** | Pelanggan dapat melakukan pembayaran sesuai metode yang tersedia. | `[NOT AVAILABLE]` |
| **BR-C07** | Pelanggan dapat melihat status pesanan dan status pembayaran. | `[NOT AVAILABLE]` |
| **BR-C08** | Pelanggan dapat melihat riwayat pembelian. | `[NOT AVAILABLE]` |
| **BR-C09** | Pelanggan dapat mengakses e-book yang telah dibeli setelah pembayaran berhasil diverifikasi. | `[NOT AVAILABLE]` |

---

## 3. Kebutuhan Fungsional — Admin (`[CONFIRMED]` sebagai target, `[NOT AVAILABLE]` di kode)

| Kode | Kebutuhan Fungsional | Status Implementasi |
|---|---|---|
| **BR-A01** | Admin dapat login ke dashboard administrasi dengan hak akses khusus admin. | `[NOT AVAILABLE]` |
| **BR-A02** | Admin dapat melihat ringkasan informasi pada dashboard. | `[NOT AVAILABLE]` |
| **BR-A03** | Admin dapat mengelola data e-book (tambah, ubah, nonaktifkan/arsipkan). | `[NOT AVAILABLE]` |
| **BR-A04** | Admin dapat mengelola kategori e-book. | `[NOT AVAILABLE]` |
| **BR-A05** | Admin dapat mengelola informasi penulis jika fitur manajemen penulis dipisahkan sebagai entitas tersendiri (`[ASSUMPTION]`). | `[NOT AVAILABLE]` |
| **BR-A06** | Admin dapat mengelola data pelanggan sesuai kewenangan. | `[NOT AVAILABLE]` |
| **BR-A07** | Admin dapat memantau daftar dan status pesanan pelanggan. | `[NOT AVAILABLE]` |
| **BR-A08** | Admin dapat memantau status pembayaran. | `[NOT AVAILABLE]` |
| **BR-A09** | Admin dapat melihat informasi transaksi. | `[NOT AVAILABLE]` |
| **BR-A10** | Admin dapat melihat laporan penjualan. | `[NOT AVAILABLE]` |

---

## 4. Aturan Bisnis & Keputusan Terbuka

Beberapa aturan bisnis penting telah ditetapkan atau masih menunggu keputusan final (lihat [keputusan-terbuka.md](../00-project/keputusan-terbuka.md)):

1. **Model Single-Seller `[CONFIRMED]`:** Hanya ada satu penjual/toko; tidak ada fitur multi-vendor atau komisi penjual.
2. **Perhitungan SPK (SAW) di Backend `[CONFIRMED]`:** Perhitungan SAW hanya dilakukan di backend; bobot dari klien tidak dipercaya secara langsung.
3. **Akses PDF E-Book `[ASSUMPTION]` / Menunggu Keputusan:** Perlu diputuskan apakah PDF hanya dapat dibaca melalui *in-app reader* (via signed URL sementara) atau boleh diunduh ke perangkat.
4. **Mekanisme Pembayaran `[ASSUMPTION]` / Menunggu Keputusan:** Perlu diputuskan apakah menggunakan simulasi pembayaran atau integrasi *payment gateway* nyata.
5. **Pengubahan Bobot SAW `[ASSUMPTION]` / Menunggu Keputusan:** Perlu diputuskan apakah bobot kriteria SAW hanya diatur oleh admin atau dapat disesuaikan oleh pelanggan.
