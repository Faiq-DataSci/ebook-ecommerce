# Rancangan Basis Data (`Database Design`)

**Status:** `[RENCANA]` (belum ada `schema.prisma` atau migrasi di repository) | `[RENCANA]` (rancangan konseptual) | `[RENCANA]` (target: PostgreSQL Supabase via Prisma 7)

---

## 1. Catatan Status Implementasi

Hingga saat ini, direktori `backend/` belum memiliki `prisma/schema.prisma`, `prisma.config.ts`, maupun berkas migrasi SQL. Seluruh desain tabel, tipe data, dan relasi di bawah ini merupakan **rancangan konseptual (`[RENCANA]`)** yang perlu divalidasi sebelum implementasi migrasi.

---

## 2. Prinsip Perancangan Basis Data (`[RENCANA]`)

1. **Primary Key UUID:** Seluruh tabel utama menggunakan `UUID` untuk menghindari enumerasi ID secara berurutan pada API publik.
2. **Tipe Data Moneter Presisi:** Harga e-book, total pesanan, dan nominal pembayaran menggunakan `DECIMAL(12,2)` (atau `NUMERIC`) agar tidak terjadi galat pembulatan *floating-point*.
3. **Integritas Referensial & Non-Hard-Delete:**
   - E-book yang sudah pernah dibeli tidak boleh dihapus permanen (`DELETE`), melainkan menggunakan *soft delete* / status arsip (`is_active = false` atau `deleted_at`) agar riwayat transaksi dan `ebook_accesses` tetap utuh.
   - `order_details` menyimpan `unit_price` (*snapshot* harga saat checkout) sehingga perubahan harga katalog di kemudian hari tidak mengubah nilai historis pesanan.
4. **Pemisahan Aktor / Role:** Akun pengguna dapat dimodelkan melalui satu tabel `users` dengan kolom `role` (`CUSTOMER` | `ADMIN`) atau dipisahkan antara `customers` dan `admins`. Rancangan berikut menggunakan pendekatan **entitas terpisah secara konseptual** (`customers` dan `admins` atau `users` berbasis role) yang mudah dipetakan ke Prisma.
5. **Kunci Unik Hak Akses:** Tabel `ebook_accesses` memiliki *unique constraint* pada `(customer_id, ebook_id)` untuk mencegah duplikasi hak akses pada e-book yang sama.

---

## 3. Ringkasan Entitas Konseptual (`[RENCANA]`)

| Entitas | Nama Tabel Usulan | Fungsi Utama |
|---|---|---|
| **Customer** | `customers` | Menyimpan data akun dan profil pelanggan. |
| **Admin** | `admins` | Menyimpan data akun administrator pengelola sistem. |
| **Category** | `categories` | Menyimpan kategori pengelompokan e-book. |
| **Ebook** | `ebooks` | Menyimpan metadata e-book, harga, dan path file PDF di bucket privat. |
| **Order** | `orders` | Menyimpan header pesanan pelanggan beserta status dan total tagihan. |
| **Order Detail** | `order_details` | Menyimpan rincian item e-book dalam satu pesanan beserta *snapshot* harga. |
| **Payment** | `payments` | Menyimpan data upaya/metode pembayaran dan status verifikasinya. |
| **Transaction** | `transactions` | Menyimpan catatan transaksi keuangan final yang sah setelah pembayaran valid. |
| **Ebook Access** | `ebook_accesses` | Menyimpan hak akses pelanggan terhadap e-book yang telah dibeli. |
