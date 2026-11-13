# Modul Manajemen Pesanan (`Order Management Module`)

**Status Implementasi:** `[NOT AVAILABLE]` — Belum ada implementasi di repository.

---

## Ringkasan Modul (`[PROPOSED]`)

| Aspek | Keterangan |
|---|---|
| **Tujuan Modul** | Mengelola pembuatan pesanan e-book oleh pelanggan, mengunci harga saat checkout, serta memantau status pesanan. |
| **Fungsi Utama** | Membuat pesanan baru, menghitung total tagihan di server, menetapkan batas waktu kedaluwarsa pesanan, menampilkan daftar/detail pesanan pelanggan, dan pemantauan seluruh pesanan oleh admin. |
| **Aktor** | Pelanggan (buat & lihat pesanan sendiri) dan Admin (pantau semua pesanan). |
| **Input** | Daftar `ebookIds` dari pelanggan; filter status/paginasi untuk daftar pesanan. |
| **Proses** | 1) Validasi token & role `CUSTOMER`. 2) Cek ketersediaan e-book aktif di database. 3) Cek apakah pelanggan sudah memiliki `Ebook Access` untuk e-book tersebut (cegah pembelian ganda `[ASSUMPTION]`). 4) Ambil harga dari DB (`unit_price` snapshot) dan hitung `total_amount` di backend. 5) Simpan `orders` (`PENDING`) dan `order_details` dalam satu transaksi database. |
| **Output** | Objek pesanan beserta `orderNumber`, `totalAmount`, `status`, dan `expiresAt`. |
| **Hubungan Modul** | Bergantung pada Authentication & E-Book Catalog; menjadi masukan bagi Payment Module dan Admin Dashboard. |
| **File/Direktori Aktual** | Belum tersedia di `backend/`, `web/admin-web/`, maupun `mobile/ebook_store/`. |
| **Potensi Masalah / Keterbatasan** | Tanpa *snapshot* harga di `order_details`, perubahan harga oleh admin akan merusak akurasi tagihan pesanan yang sedang berjalan. Selain itu, perlu mekanisme penanganan pesanan `PENDING` yang melewati `expiresAt`. |
