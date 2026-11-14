# Kamus Data (`Data Dictionary`)

> **Status Dokumen:** `[ADA]` (Diselaraskan penuh dengan [`backend/prisma/schema.prisma`](../../backend/prisma/schema.prisma))
> **Catatan:** Seluruh model dan kolom pada Bagian 1 berstatus `[ADA]` di `schema.prisma`, namun migrasi ke PostgreSQL Supabase masih `[RENCANA]`.

---

## 1. Kamus Data Model Aktif di `schema.prisma` (`[ADA]` di Skema)

### 1.1 `users` (Model `User`)

| Kolom | Nama Prisma | Tipe PostgreSQL/Prisma | Nullable | Default | Key/Constraint | Deskripsi | Sumber Data | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `id` | `UUID` / `String` | Tidak | `uuid()` | `PK` | Pengenal unik internal pengguna | Generated UUID | `[ADA]` di schema |
| `supabase_user_id` | `supabaseUserId` | `TEXT` / `String` | Tidak | — | `UNIQUE` | ID subjek (`sub`) dari Supabase Auth | Supabase Auth JWT | `[ADA]` di schema |
| `full_name` | `fullName` | `VARCHAR(120)` / `String` | Tidak | — | `NOT NULL` | Nama lengkap pengguna | Input registrasi / profil | `[ADA]` di schema |
| `email` | `email` | `VARCHAR(150)` / `String` | Tidak | — | `UNIQUE` | Email unik pengguna | Supabase Auth / input | `[ADA]` di schema |
| `phone` | `phone` | `VARCHAR(25)` / `String?` | Ya | `NULL` | — | Nomor telepon opsional pengguna | Input profil | `[ADA]` di schema |
| `role` | `role` | `UserRole` (`CUSTOMER \| ADMIN`) | Tidak | `CUSTOMER` | Enum `UserRole` | Peran otorisasi sistem *(tidak boleh disetel klien publik)* | Backend / seed Admin | `[ADA]` di schema |
| `is_active` | `isActive` | `BOOLEAN` / `Boolean` | Tidak | `true` | `NOT NULL` | Penanda status aktif akun pengguna | Backend / Admin | `[ADA]` di schema |
| `created_at` | `createdAt` | `TIMESTAMPTZ` / `DateTime` | Tidak | `now()` | `NOT NULL` | Waktu akun dibuat | Sistem DB | `[ADA]` di schema |
| `updated_at` | `updatedAt` | `TIMESTAMPTZ` / `DateTime` | Tidak | `@updatedAt` | `NOT NULL` | Waktu pembaruan terakhir | Prisma / Sistem | `[ADA]` di schema |

### 1.2 `categories` (Model `Category`)

| Kolom | Nama Prisma | Tipe PostgreSQL/Prisma | Nullable | Default | Key/Constraint | Deskripsi | Sumber Data | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `id` | `UUID` / `String` | Tidak | `uuid()` | `PK` | Pengenal unik kategori | Generated UUID | `[ADA]` di schema |
| `name` | `name` | `VARCHAR(100)` / `String` | Tidak | — | `UNIQUE` | Nama kategori e-book | Input Admin | `[ADA]` di schema |
| `slug` | `slug` | `VARCHAR(120)` / `String` | Tidak | — | `UNIQUE` | Slug ramah URL untuk filter | Generated / Input Admin | `[ADA]` di schema |
| `description` | `description` | `TEXT` / `String?` | Ya | `NULL` | — | Deskripsi kategori | Input Admin | `[ADA]` di schema |
| `is_active` | `isActive` | `BOOLEAN` / `Boolean` | Tidak | `true` | `NOT NULL` | Penanda kategori aktif di katalog | Input Admin | `[ADA]` di schema |
| `created_at` | `createdAt` | `TIMESTAMPTZ` / `DateTime` | Tidak | `now()` | `NOT NULL` | Waktu dibuat | Sistem DB | `[ADA]` di schema |
| `updated_at` | `updatedAt` | `TIMESTAMPTZ` / `DateTime` | Tidak | `@updatedAt` | `NOT NULL` | Waktu pembaruan terakhir | Prisma / Sistem | `[ADA]` di schema |

### 1.3 `ebooks` (Model `Ebook`)

| Kolom | Nama Prisma | Tipe PostgreSQL/Prisma | Nullable | Default | Key/Constraint | Deskripsi | Sumber Data | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `id` | `UUID` / `String` | Tidak | `uuid()` | `PK` | Pengenal unik e-book | Generated UUID | `[ADA]` di schema |
| `category_id` | `categoryId` | `UUID` / `String` | Tidak | — | `FK -> categories(id)`, `INDEX` | Kategori induk e-book (`onDelete: Restrict`) | Input Admin | `[ADA]` di schema |
| `title` | `title` | `VARCHAR(200)` / `String` | Tidak | — | `NOT NULL` | Judul e-book | Input Admin | `[ADA]` di schema |
| `author` | `author` | `VARCHAR(150)` / `String` | Tidak | — | `NOT NULL` | Nama penulis e-book | Input Admin | `[ADA]` di schema |
| `description` | `description` | `TEXT` / `String` | Tidak | — | `NOT NULL` | Sinopsis / deskripsi e-book | Input Admin | `[ADA]` di schema |
| `price` | `price` | `DECIMAL(12,2)` / `Decimal` | Tidak | — | `NOT NULL` | Harga jual resmi e-book | Input Admin | `[ADA]` di schema |
| `cover_url` | `coverUrl` | `TEXT` / `String?` | Ya | `NULL` | — | URL sampul e-book | Storage publik / Admin | `[ADA]` di schema |
| `storage_path` | `storagePath` | `TEXT` / `String` | Tidak | — | `NOT NULL` | Path objek PDF di Supabase Storage **bucket privat** *(bukan isi PDF)* | Backend Storage Upload | `[ADA]` di schema |
| `page_count` | `pageCount` | `INTEGER` / `Int?` | Ya | `NULL` | — | Jumlah halaman e-book | Input Admin | `[ADA]` di schema |
| `published_year` | `publishedYear` | `INTEGER` / `Int?` | Ya | `NULL` | — | Tahun terbit e-book | Input Admin | `[ADA]` di schema |
| `rating_avg` | `ratingAvg` | `DECIMAL(3,2)` / `Decimal` | Tidak | `0` | `NOT NULL` | Rata-rata rating (`0.00–5.00`) untuk tampilan & SAW | Sistem *(sumber ulasan `[RENCANA]`)* | `[ADA]` di schema |
| `sales_count` | `salesCount` | `INTEGER` / `Int` | Tidak | `0` | `NOT NULL` | Jumlah penjualan terverifikasi untuk katalog & SAW | Backend atomik saat `PAID` | `[ADA]` di schema |
| `is_active` | `isActive` | `BOOLEAN` / `Boolean` | Tidak | `true` | `INDEX` | Status tampil di katalog & kandidat SAW (`false` = arsip) | Input Admin | `[ADA]` di schema |
| `created_at` | `createdAt` | `TIMESTAMPTZ` / `DateTime` | Tidak | `now()` | `NOT NULL` | Waktu dibuat | Sistem DB | `[ADA]` di schema |
| `updated_at` | `updatedAt` | `TIMESTAMPTZ` / `DateTime` | Tidak | `@updatedAt` | `NOT NULL` | Waktu pembaruan terakhir | Prisma / Sistem | `[ADA]` di schema |

### 1.4 `orders` (Model `Order`)

| Kolom | Nama Prisma | Tipe PostgreSQL/Prisma | Nullable | Default | Key/Constraint | Deskripsi | Sumber Data | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `id` | `UUID` / `String` | Tidak | `uuid()` | `PK` | Pengenal unik pesanan | Generated UUID | `[ADA]` di schema |
| `user_id` | `userId` | `UUID` / `String` | Tidak | — | `FK -> users(id)`, `INDEX` | Pelanggan pembuat pesanan (`onDelete: Restrict`) | Token JWT `User.id` | `[ADA]` di schema |
| `order_number` | `orderNumber` | `VARCHAR(40)` / `String` | Tidak | — | `UNIQUE` | Nomor referensi pesanan | Generated Backend | `[ADA]` di schema |
| `total_amount` | `totalAmount` | `DECIMAL(12,2)` / `Decimal` | Tidak | — | `NOT NULL` | Total tagihan pesanan *(dihitung backend, bukan klien)* | Kalkulasi Backend | `[ADA]` di schema |
| `status` | `status` | `OrderStatus` | Tidak | `PENDING` | `INDEX`, Enum `OrderStatus` | Status: `PENDING \| PAID \| FAILED \| EXPIRED \| CANCELLED` | Backend / Webhook | `[ADA]` di schema |
| `expires_at` | `expiresAt` | `TIMESTAMPTZ` / `DateTime` | Tidak | — | `NOT NULL` | Batas waktu pembayaran pesanan | Backend saat checkout | `[ADA]` di schema |
| `created_at` | `createdAt` | `TIMESTAMPTZ` / `DateTime` | Tidak | `now()` | `NOT NULL` | Waktu pesanan dibuat | Sistem DB | `[ADA]` di schema |
| `updated_at` | `updatedAt` | `TIMESTAMPTZ` / `DateTime` | Tidak | `@updatedAt` | `NOT NULL` | Waktu pembaruan status | Prisma / Sistem | `[ADA]` di schema |

### 1.5 `order_items` (Model `OrderItem`)

| Kolom | Nama Prisma | Tipe PostgreSQL/Prisma | Nullable | Default | Key/Constraint | Deskripsi | Sumber Data | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `id` | `UUID` / `String` | Tidak | `uuid()` | `PK` | Pengenal unik item pesanan | Generated UUID | `[ADA]` di schema |
| `order_id` | `orderId` | `UUID` / `String` | Tidak | — | `FK -> orders(id)`, `UNIQUE(orderId, ebookId)` | Pesanan induk (`onDelete: Cascade`) | Backend | `[ADA]` di schema |
| `ebook_id` | `ebookId` | `UUID` / `String` | Tidak | — | `FK -> ebooks(id)`, `INDEX`, `UNIQUE(orderId, ebookId)` | E-book yang dipesan (`onDelete: Restrict`) | Input `ebookId` | `[ADA]` di schema |
| `unit_price` | `unitPrice` | `DECIMAL(12,2)` / `Decimal` | Tidak | — | `NOT NULL` | Snapshot harga e-book saat checkout *(dihitung backend)* | Salinan `Ebook.price` | `[ADA]` di schema |
| `created_at` | `createdAt` | `TIMESTAMPTZ` / `DateTime` | Tidak | `now()` | `NOT NULL` | Waktu dibuat | Sistem DB | `[ADA]` di schema |

### 1.6 `payments` (Model `Payment`)

| Kolom | Nama Prisma | Tipe PostgreSQL/Prisma | Nullable | Default | Key/Constraint | Deskripsi | Sumber Data | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `id` | `UUID` / `String` | Tidak | `uuid()` | `PK` | Pengenal unik pembayaran | Generated UUID | `[ADA]` di schema |
| `order_id` | `orderId` | `UUID` / `String` | Tidak | — | `FK -> orders(id)`, `INDEX` | Pesanan terkait (`onDelete: Cascade`) | Input Pelanggan / Backend | `[ADA]` di schema |
| `payment_method` | `paymentMethod` | `VARCHAR(50)` / `String` | Tidak | — | `NOT NULL` | Metode pembayaran (VA, QRIS, dll.) | Gateway / Input | `[ADA]` di schema |
| `amount` | `amount` | `DECIMAL(12,2)` / `Decimal` | Tidak | — | `NOT NULL` | Nominal pembayaran | Backend (`Order.totalAmount`) | `[ADA]` di schema |
| `status` | `status` | `PaymentStatus` | Tidak | `PENDING` | Enum `PaymentStatus` | Status: `PENDING \| VERIFIED \| FAILED \| EXPIRED` | Backend / Webhook Gateway | `[ADA]` di schema |
| `external_ref` | `externalRef` | `VARCHAR(120)` / `String?` | Ya | `NULL` | — | ID referensi transaksi dari payment gateway | Payment Gateway | `[ADA]` di schema |
| `paid_at` | `paidAt` | `TIMESTAMPTZ` / `DateTime?` | Ya | `NULL` | — | Waktu pembayaran diverifikasi oleh webhook | Webhook Gateway | `[ADA]` di schema |
| `created_at` | `createdAt` | `TIMESTAMPTZ` / `DateTime` | Tidak | `now()` | `NOT NULL` | Waktu dibuat | Sistem DB | `[ADA]` di schema |
| `updated_at` | `updatedAt` | `TIMESTAMPTZ` / `DateTime` | Tidak | `@updatedAt` | `NOT NULL` | Waktu diperbarui | Prisma / Sistem | `[ADA]` di schema |

### 1.7 `transactions` (Model `Transaction`)

| Kolom | Nama Prisma | Tipe PostgreSQL/Prisma | Nullable | Default | Key/Constraint | Deskripsi | Sumber Data | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `id` | `UUID` / `String` | Tidak | `uuid()` | `PK` | Pengenal unik transaksi | Generated UUID | `[ADA]` di schema |
| `order_id` | `orderId` | `UUID` / `String` | Tidak | — | `FK -> orders(id)`, `UNIQUE` | Pesanan yang dilunasi (1-to-1, `onDelete: Restrict`) | Backend Atomik | `[ADA]` di schema |
| `payment_id` | `paymentId` | `UUID` / `String` | Tidak | — | `FK -> payments(id)`, `UNIQUE` | Pembayaran terverifikasi (1-to-1, `onDelete: Restrict`) | Backend Atomik | `[ADA]` di schema |
| `user_id` | `userId` | `UUID` / `String` | Tidak | — | `FK -> users(id)`, `INDEX` | Pemilik transaksi (`onDelete: Restrict`) | `Order.userId` | `[ADA]` di schema |
| `transaction_code` | `transactionCode` | `VARCHAR(50)` / `String` | Tidak | — | `UNIQUE` | Kode transaksi resmi | Generated Backend | `[ADA]` di schema |
| `amount` | `amount` | `DECIMAL(12,2)` / `Decimal` | Tidak | — | `NOT NULL` | Nilai transaksi final | `Payment.amount` | `[ADA]` di schema |
| `recorded_at` | `recordedAt` | `TIMESTAMPTZ` / `DateTime` | Tidak | `now()` | `NOT NULL` | Waktu transaksi dicatat | Sistem DB | `[ADA]` di schema |

### 1.8 `ebook_accesses` (Model `EbookAccess`)

| Kolom | Nama Prisma | Tipe PostgreSQL/Prisma | Nullable | Default | Key/Constraint | Deskripsi | Sumber Data | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `id` | `UUID` / `String` | Tidak | `uuid()` | `PK` | Pengenal unik hak akses e-book | Generated UUID | `[ADA]` di schema |
| `user_id` | `userId` | `UUID` / `String` | Tidak | — | `FK -> users(id)`, `UNIQUE(userId, ebookId)` | Pemilik hak akses (`onDelete: Restrict`) | `Order.userId` | `[ADA]` di schema |
| `ebook_id` | `ebookId` | `UUID` / `String` | Tidak | — | `FK -> ebooks(id)`, `INDEX`, `UNIQUE(userId, ebookId)` | E-book yang berhak diakses (`onDelete: Restrict`) | `OrderItem.ebookId` | `[ADA]` di schema |
| `order_id` | `orderId` | `UUID` / `String` | Tidak | — | `FK -> orders(id)` | Pesanan sumber hak akses (`onDelete: Restrict`) | `Order.id` | `[ADA]` di schema |
| `granted_at` | `grantedAt` | `TIMESTAMPTZ` / `DateTime` | Tidak | `now()` | `NOT NULL` | Waktu hak akses diterbitkan | Sistem DB | `[ADA]` di schema |
| `is_revoked` | `isRevoked` | `BOOLEAN` / `Boolean` | Tidak | `false` | `NOT NULL` | Penanda pencabutan akses (`true` = ditolak saat minta signed URL) | Admin / Sistem | `[ADA]` di schema |

---

## 2. Kolom & Entitas Rencana (`[RENCANA]`)

Entitas/kolom berikut belum ada di `schema.prisma` dan berstatus `[RENCANA]`:
- `SawCriterionConfig` (`code`, `name`, `type`, `weight`, `isActive`, `version`) — menunggu Keputusan #5 & #9.
- `SawCalculationSnapshot` (`criteriaVersion`, `executedAt`, `resultsJson`) — menunggu Keputusan #11.
- `Review` (`userId`, `ebookId`, `rating`, `comment`) — menunggu Keputusan #6 & #7.

---

## 3. Kolom yang Dilarang Diterima dari Klien Publik

Backend wajib mengabaikan atau menolak apabila klien publik (`mobile` / `pengunjung-web`) mengirim nilai langsung untuk kolom berikut:
1. `User.role` & `User.isActive` (mencegah eskalasi hak akses menjadi `ADMIN`).
2. `Order.totalAmount`, `Order.status`, `OrderItem.unitPrice` (harga & total wajib dihitung di backend).
3. `Payment.status`, `Payment.paidAt`, `Transaction.*` (status lunas hanya berasal dari webhook gateway terverifikasi).
4. `EbookAccess.isRevoked` & `EbookAccess.grantedAt` (akses hanya diterbitkan backend setelah lunas atau diubah oleh `ADMIN`).
5. `Ebook.ratingAvg`, `Ebook.salesCount`, serta bobot/skor akhir SAW.
