# Modul Dashboard Admin & Laporan Penjualan

**Status Implementasi:** `[NOT AVAILABLE]` — Belum ada implementasi di `web/admin-web/` maupun `backend/`.

Dokumen ini mencakup **10. Admin Dashboard Module** dan **11. Sales Reporting Module**.

---

## A. Admin Dashboard Module (`[NOT AVAILABLE]` / `[PROPOSED]`)

| Aspek | Keterangan |
|---|---|
| **Tujuan Modul** | Memberikan ringkasan kondisi operasional toko e-book kepada admin dalam satu tampilan terpusat. |
| **Fungsi Utama** | Menampilkan metrik ringkas seperti total pendapatan, jumlah pesanan (per status), jumlah e-book aktif, dan jumlah pelanggan terdaftar (`[PROPOSED]`). |
| **Aktor** | Admin. |
| **Input** | Token sesi admin dengan role `ADMIN`. |
| **Proses** | Verifikasi role `ADMIN` di backend, lalu melakukan agregasi data dari tabel `orders`, `transactions`, `ebooks`, dan `customers`. |
| **Output** | Objek ringkasan statistik dashboard. |
| **Hubungan Modul** | Mengagregasi data dari User Management, E-Book Catalog, Order Management, Payment, dan Transaction Module. |
| **File/Direktori Aktual** | Belum tersedia (`web/admin-web/src/App.jsx` masih berupa template Vite default). |
| **Potensi Masalah / Keterbatasan** | Jika memakai data tiruan selama fase pengembangan UI, wajib diberi label `"DATA SIMULASI"` sesuai aturan proyek (`AGENTS.md`). |

---

## B. Sales Reporting Module (`[NOT AVAILABLE]` / `[PROPOSED]`)

| Aspek | Keterangan |
|---|---|
| **Tujuan Modul** | Menyajikan laporan penjualan terstruktur berdasarkan rentang waktu untuk kebutuhan evaluasi dan pelaporan bisnis. |
| **Fungsi Utama** | Agregasi pendapatan dan jumlah unit terjual per periode (harian/bulanan), daftar e-book terlaris, serta filter berdasarkan rentang tanggal/kategori (`[PROPOSED]`). |
| **Aktor** | Admin. |
| **Input** | `startDate`, `endDate`, `groupBy` (`day|month`). |
| **Proses** | Validasi rentang tanggal di backend, hanya menghitung pesanan/transaksi yang berstatus lunas (`PAID` / tercatat di `transactions`), lalu mengelompokkan hasil per periode. |
| **Output** | Ringkasan total penjualan, seri waktu penjualan, dan daftar e-book terlaris. |
| **Hubungan Modul** | Bergantung pada Transaction Module, Order Management, dan E-Book Catalog. |
| **File/Direktori Aktual** | Belum tersedia. |
| **Potensi Masalah / Keterbatasan** | Pesanan berstatus `PENDING`, `FAILED`, atau `EXPIRED` tidak boleh ikut dihitung sebagai pendapatan pada laporan penjualan. |
