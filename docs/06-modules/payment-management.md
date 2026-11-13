# Modul Pembayaran & Transaksi

**Status Implementasi:** `[NOT AVAILABLE]` — Belum ada implementasi di repository.

Dokumen ini mencakup **6. Payment Module** dan **7. Transaction Module**.

---

## A. Payment Module (`[NOT AVAILABLE]` / `[PROPOSED]`)

| Aspek | Keterangan |
|---|---|
| **Tujuan Modul** | Memproses inisiasi pembayaran dan memverifikasi keabsahan pembayaran sebelum pesanan dinyatakan lunas. |
| **Fungsi Utama** | Membuat tagihan/catatan pembayaran, memantau status pembayaran (`PENDING`, `VERIFIED`, `FAILED`, `EXPIRED`), dan memproses callback/verifikasi pembayaran (`[PROPOSED]`). |
| **Aktor** | Pelanggan (melakukan & memantau pembayaran) dan Admin / Sistem Pembayaran (memantau & memverifikasi). |
| **Input** | `orderId`, `paymentMethod` (saat inisiasi); `paymentId`, status verifikasi, dan `externalRef`/signature (saat verifikasi). |
| **Proses** | 1) Validasi kepemilikan pesanan dan pastikan status pesanan `PENDING` serta belum kedaluwarsa. 2) Catat `payments` dengan nominal sesuai `orders.total_amount` di server. 3) Saat verifikasi valid, jalankan transaksi database atomik: ubah `payments.status = VERIFIED`, `orders.status = PAID`, buat `transactions`, dan aktifkan `ebook_accesses`. |
| **Output** | Status pembayaran terbaru dan referensi pembayaran. |
| **Hubungan Modul** | Bergantung pada Order Management; memicu Transaction Module dan E-Book Access Module. |
| **File/Direktori Aktual** | Belum tersedia. |
| **Potensi Masalah / Keterbatasan** | Mekanisme pembayaran (simulasi vs *payment gateway* nyata) masih tercatat sebagai keputusan terbuka di [keputusan-terbuka.md](../00-project/keputusan-terbuka.md). Callback tanpa verifikasi tanda tangan dan idempotensi berisiko menimbulkan aktivasi akses palsu atau transaksi ganda. |

---

## B. Transaction Module (`[NOT AVAILABLE]` / `[PROPOSED]`)

| Aspek | Keterangan |
|---|---|
| **Tujuan Modul** | Mencatat setiap transaksi pembayaran yang telah terverifikasi secara permanen sebagai catatan keuangan resmi. |
| **Fungsi Utama** | Pencatatan transaksi otomatis saat pembayaran valid, pengambilan daftar transaksi oleh admin, serta penyediaan data bagi riwayat pembelian dan laporan penjualan. |
| **Aktor** | Sistem (otomatis), Admin (pantau transaksi), Pelanggan (melihat transaksi miliknya melalui riwayat pembelian). |
| **Input** | `orderId`, `paymentId`, `customerId`, `amount` (dipicu internal oleh Payment Module setelah verifikasi). |
| **Proses** | Pembuatan kode transaksi unik (`transaction_code`) dan penyimpanan record ke tabel `transactions` dalam satu transaksi database bersama pembaruan status pembayaran. |
| **Output** | Catatan transaksi terverifikasi (`transaction_code`, `amount`, `recorded_at`). |
| **Hubungan Modul** | Dihasilkan oleh Payment Module; menjadi sumber data utama Purchase History Module dan Sales Reporting Module. |
| **File/Direktori Aktual** | Belum tersedia. |
| **Potensi Masalah / Keterbatasan** | Data transaksi tidak boleh dimodifikasi atau dihapus secara sembarangan demi integritas audit keuangan. |
