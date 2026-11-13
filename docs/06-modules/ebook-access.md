# Modul Riwayat Pembelian & Hak Akses E-Book

**Status Implementasi:** `[RENCANA]` — Belum ada implementasi di repository.

Dokumen ini mencakup **8. Purchase History Module** dan **9. E-Book Access Module**.

---

## A. Purchase History Module (`[RENCANA]` / `[RENCANA]`)

| Aspek | Keterangan |
|---|---|
| **Tujuan Modul** | Menyediakan daftar riwayat pembelian e-book bagi pelanggan beserta status pesanan/transaksinya. |
| **Fungsi Utama** | Menampilkan daftar pesanan dan transaksi sukses milik pelanggan, detail e-book yang dibeli, tanggal transaksi, serta nominal pembayaran. |
| **Aktor** | Pelanggan (*Customer*). |
| **Input** | Token sesi pelanggan (`req.user.id`) dan parameter filter/paginasi opsional. |
| **Proses** | Query ke tabel `orders` / `transactions` yang difilter ketat berdasarkan `customer_id` dari token terverifikasi. |
| **Output** | Daftar riwayat pembelian pelanggan berpaginasi. |
| **Hubungan Modul** | Mengambil data dari Order Management dan Transaction Module; terhubung ke E-Book Access Module untuk membuka e-book yang sudah lunas. |
| **File/Direktori Aktual** | Belum tersedia. |
| **Potensi Masalah / Keterbatasan** | Harus memastikan filter `customer_id` selalu berasal dari token terautentikasi (bukan parameter query/body) untuk mencegah kebocoran riwayat pembelian pengguna lain. |

---

## B. E-Book Access Module (`[RENCANA]` / `[RENCANA]`)

| Aspek | Keterangan |
|---|---|
| **Tujuan Modul** | Mengontrol dan memberikan akses baca/unduh file PDF e-book secara aman hanya kepada pelanggan yang pembayarannya telah diverifikasi. |
| **Fungsi Utama** | Menyimpan catatan kepemilikan (`ebook_accesses`), memvalidasi hak akses per permintaan, dan menerbitkan *signed URL* sementara dari bucket privat Supabase Storage (`[ADA]` pada `AGENTS.md`). |
| **Aktor** | Pelanggan (pemilik hak akses) dan Sistem (penerbitan akses otomatis pasca-verifikasi pembayaran). |
| **Input** | Token sesi pelanggan + `ebookId`. |
| **Proses** | 1) Cek record di `ebook_accesses` untuk `(customer_id, ebook_id)` dengan `is_revoked = false`. 2) Jika tidak ada atau dicabut, kembalikan `403 Forbidden`. 3) Jika valid, backend meminta *signed URL* berjangka waktu singkat ke Supabase Storage bucket privat menggunakan kredensial server. |
| **Output** | `signedUrl` sementara beserta durasi kedaluwarsa (`expiresInSeconds`). |
| **Hubungan Modul** | Diaktifkan oleh Payment Module; membaca `storage_path` dari E-Book Catalog Module. |
| **File/Direktori Aktual** | Belum tersedia. |
| **Potensi Masalah / Keterbatasan** | Kebijakan apakah PDF hanya dibaca di dalam aplikasi (*in-app reader*) atau boleh diunduh ke perangkat masih menunggu keputusan di [keputusan-terbuka.md](../00-project/keputusan-terbuka.md). |
