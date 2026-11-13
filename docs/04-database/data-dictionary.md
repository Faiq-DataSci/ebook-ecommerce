# Kamus Data (`Data Dictionary`)

**Status:** `[PROPOSED]` — Rancangan konseptual awal; belum terdapat implementasi aktual di `backend/`.

---

## 1. `customers` (Pelanggan)
**Fungsi:** Menyimpan identitas autentikasi dan profil pelanggan.

| Atribut | Tipe Data Usulan | Key / Constraint | Keterangan |
|---|---|---|---|
| `id` | `UUID` | `PK`, `NOT NULL` | Pengenal unik pelanggan |
| `full_name` | `VARCHAR(120)` | `NOT NULL` | Nama lengkap pelanggan |
| `email` | `VARCHAR(150)` | `UNIQUE`, `NOT NULL` | Email login pelanggan |
| `password_hash` | `TEXT` | `NOT NULL` | Hash password (tidak pernah dikembalikan di API) |
| `phone` | `VARCHAR(25)` | `NULL` | Nomor telepon opsional |
| `is_active` | `BOOLEAN` | `NOT NULL`, `DEFAULT true` | Status aktif akun |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL`, `DEFAULT now()` | Waktu registrasi |
| `updated_at` | `TIMESTAMPTZ` | `NOT NULL` | Waktu pembaruan terakhir |

---

## 2. `admins` (Administrator)
**Fungsi:** Menyimpan identitas akun administrator untuk akses `admin-web`.

| Atribut | Tipe Data Usulan | Key / Constraint | Keterangan |
|---|---|---|---|
| `id` | `UUID` | `PK`, `NOT NULL` | Pengenal unik admin |
| `full_name` | `VARCHAR(120)` | `NOT NULL` | Nama admin |
| `email` | `VARCHAR(150)` | `UNIQUE`, `NOT NULL` | Email login admin |
| `password_hash` | `TEXT` | `NOT NULL` | Hash password |
| `is_active` | `BOOLEAN` | `NOT NULL`, `DEFAULT true` | Status aktif admin |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL`, `DEFAULT now()` | Waktu dibuat |
| `updated_at` | `TIMESTAMPTZ` | `NOT NULL` | Waktu pembaruan terakhir |

---

## 3. `categories` (Kategori E-Book)
**Fungsi:** Mengelompokkan e-book ke dalam kategori.

| Atribut | Tipe Data Usulan | Key / Constraint | Keterangan |
|---|---|---|---|
| `id` | `UUID` | `PK`, `NOT NULL` | Pengenal unik kategori |
| `name` | `VARCHAR(100)` | `UNIQUE`, `NOT NULL` | Nama kategori |
| `slug` | `VARCHAR(120)` | `UNIQUE`, `NOT NULL` | Slug URL-friendly |
| `description` | `TEXT` | `NULL` | Deskripsi singkat kategori |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL`, `DEFAULT now()` | Waktu dibuat |
| `updated_at` | `TIMESTAMPTZ` | `NOT NULL` | Waktu diperbarui |

---

## 4. `ebooks` (Katalog E-Book)
**Fungsi:** Menyimpan metadata produk e-book dan referensi file PDF di storage privat.

| Atribut | Tipe Data Usulan | Key / Constraint | Keterangan |
|---|---|---|---|
| `id` | `UUID` | `PK`, `NOT NULL` | Pengenal unik e-book |
| `category_id` | `UUID` | `FK -> categories(id)`, `NOT NULL` | Relasi ke kategori |
| `title` | `VARCHAR(200)` | `NOT NULL` | Judul e-book |
| `author` | `VARCHAR(150)` | `NOT NULL` | Nama penulis |
| `description` | `TEXT` | `NOT NULL` | Sinopsis / deskripsi e-book |
| `price` | `DECIMAL(12,2)` | `NOT NULL`, `CHECK (price >= 0)` | Harga jual e-book |
| `cover_url` | `TEXT` | `NULL` | URL gambar sampul |
| `storage_path` | `TEXT` | `NOT NULL` | Path objek PDF di bucket privat Supabase |
| `page_count` | `INTEGER` | `NULL`, `CHECK (page_count > 0)` | Jumlah halaman (dapat dipakai kriteria SAW `[ASSUMPTION]`) |
| `published_year` | `INTEGER` | `NULL` | Tahun terbit |
| `is_active` | `BOOLEAN` | `NOT NULL`, `DEFAULT true` | Penanda tampil di katalog (non-hard-delete) |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL`, `DEFAULT now()` | Waktu dibuat |
| `updated_at` | `TIMESTAMPTZ` | `NOT NULL` | Waktu diperbarui |

---

## 5. `orders` (Pesanan)
**Fungsi:** Menyimpan header pesanan pembelian e-book oleh pelanggan.

| Atribut | Tipe Data Usulan | Key / Constraint | Keterangan |
|---|---|---|---|
| `id` | `UUID` | `PK`, `NOT NULL` | Pengenal unik pesanan |
| `customer_id` | `UUID` | `FK -> customers(id)`, `NOT NULL` | Pelanggan pembuat pesanan |
| `order_number` | `VARCHAR(40)` | `UNIQUE`, `NOT NULL` | Nomor referensi pesanan |
| `total_amount` | `DECIMAL(12,2)` | `NOT NULL`, `CHECK (total_amount >= 0)` | Total harga pesanan |
| `status` | `VARCHAR(20)` | `NOT NULL` | `PENDING`, `PAID`, `FAILED`, `EXPIRED`, `CANCELLED` |
| `expires_at` | `TIMESTAMPTZ` | `NOT NULL` | Batas waktu pembayaran |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL`, `DEFAULT now()` | Waktu pesanan dibuat |
| `updated_at` | `TIMESTAMPTZ` | `NOT NULL` | Waktu pembaruan status |

---

## 6. `order_details` (Detail Pesanan)
**Fungsi:** Menyimpan daftar e-book yang dipesan dalam satu pesanan beserta *snapshot* harga.

| Atribut | Tipe Data Usulan | Key / Constraint | Keterangan |
|---|---|---|---|
| `id` | `UUID` | `PK`, `NOT NULL` | Pengenal unik item pesanan |
| `order_id` | `UUID` | `FK -> orders(id)`, `NOT NULL` | Relasi ke pesanan |
| `ebook_id` | `UUID` | `FK -> ebooks(id)`, `NOT NULL` | Relasi ke e-book |
| `unit_price` | `DECIMAL(12,2)` | `NOT NULL`, `CHECK (unit_price >= 0)` | Snapshot harga e-book saat checkout |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL`, `DEFAULT now()` | Waktu dibuat |

*Constraint tambahan usulan:* `UNIQUE (order_id, ebook_id)` karena pembelian produk digital e-book umumnya bernilai kuantitas 1 per judul per pesanan (`[ASSUMPTION]`).

---

## 7. `payments` (Pembayaran)
**Fungsi:** Menyimpan informasi metode, status, dan bukti/referensi verifikasi pembayaran.

| Atribut | Tipe Data Usulan | Key / Constraint | Keterangan |
|---|---|---|---|
| `id` | `UUID` | `PK`, `NOT NULL` | Pengenal unik pembayaran |
| `order_id` | `UUID` | `FK -> orders(id)`, `NOT NULL` | Pesanan yang dibayar |
| `payment_method` | `VARCHAR(50)` | `NOT NULL` | Metode pembayaran (mis. VA, QRIS, simulasi) |
| `amount` | `DECIMAL(12,2)` | `NOT NULL`, `CHECK (amount >= 0)` | Nominal yang dibayarkan |
| `status` | `VARCHAR(20)` | `NOT NULL` | `PENDING`, `VERIFIED`, `FAILED`, `EXPIRED` |
| `external_ref` | `VARCHAR(120)` | `NULL` | ID referensi gateway/simulasi pembayaran |
| `paid_at` | `TIMESTAMPTZ` | `NULL` | Waktu pembayaran terverifikasi |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL`, `DEFAULT now()` | Waktu dibuat |
| `updated_at` | `TIMESTAMPTZ` | `NOT NULL` | Waktu diperbarui |

---

## 8. `transactions` (Transaksi)
**Fungsi:** Mencatat buku besar transaksi yang berhasil diverifikasi sebagai dasar riwayat pembelian dan laporan penjualan.

| Atribut | Tipe Data Usulan | Key / Constraint | Keterangan |
|---|---|---|---|
| `id` | `UUID` | `PK`, `NOT NULL` | Pengenal unik transaksi |
| `order_id` | `UUID` | `FK -> orders(id)`, `UNIQUE`, `NOT NULL` | Pesanan terkait (1-to-1) |
| `payment_id` | `UUID` | `FK -> payments(id)`, `UNIQUE`, `NOT NULL` | Pembayaran terverifikasi terkait |
| `customer_id` | `UUID` | `FK -> customers(id)`, `NOT NULL` | Pelanggan terkait |
| `transaction_code` | `VARCHAR(50)` | `UNIQUE`, `NOT NULL` | Kode transaksi resmi |
| `amount` | `DECIMAL(12,2)` | `NOT NULL` | Nilai transaksi final |
| `recorded_at` | `TIMESTAMPTZ` | `NOT NULL`, `DEFAULT now()` | Waktu transaksi dicatat |

---

## 9. `ebook_accesses` (Hak Akses E-Book)
**Fungsi:** Menyimpan izin akses pelanggan terhadap e-book yang sudah dibeli.

| Atribut | Tipe Data Usulan | Key / Constraint | Keterangan |
|---|---|---|---|
| `id` | `UUID` | `PK`, `NOT NULL` | Pengenal unik hak akses |
| `customer_id` | `UUID` | `FK -> customers(id)`, `NOT NULL` | Pemilik hak akses |
| `ebook_id` | `UUID` | `FK -> ebooks(id)`, `NOT NULL` | E-book yang dapat diakses |
| `order_id` | `UUID` | `FK -> orders(id)`, `NOT NULL` | Pesanan sumber hak akses |
| `granted_at` | `TIMESTAMPTZ` | `NOT NULL`, `DEFAULT now()` | Waktu hak akses aktif |
| `is_revoked` | `BOOLEAN` | `NOT NULL`, `DEFAULT false` | Penanda pencabutan akses jika terjadi sengketa/refund |

*Constraint tambahan usulan:* `UNIQUE (customer_id, ebook_id)`.
