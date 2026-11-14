# Rancangan Basis Data (`Database Design`)

> **Status Dokumen:** `[ADA]` (Dokumentasi desain & audit terhadap `schema.prisma`)
> **Status Fondasi Skema:** `[ADA]` (`backend/prisma/schema.prisma`, `backend/prisma.config.ts`, dan `backend/src/config/prisma.ts` telah tersedia dan lolos `prisma validate`)
> **Status Database Aktual, Migrasi & Seed:** `[RENCANA]` (Belum ada direktori `backend/prisma/migrations/` dan skrip seed)
> **Sumber Kebenaran Utama:** [`docs-proyek-ebook-ecommerce.md`](../docs-proyek-ebook-ecommerce.md) & [`schema.prisma`](../../backend/prisma/schema.prisma)

---

## 1. Tujuan & Teknologi Basis Data

Basis data ini dirancang untuk mengelola seluruh data transaksional, katalog, autentikasi pengguna berbasis peran, hak akses `e-book`, dan atribut pendukung SPK metode SAW pada proyek E-Book E-Commerce.

- **Database Relasional:** PostgreSQL pada **Supabase**.
- **ORM & Konfigurasi:** **Prisma 7** menggunakan [`prisma.config.ts`](../../backend/prisma.config.ts) dan adapter `@prisma/adapter-pg` pada [`prisma.ts`](../../backend/src/config/prisma.ts).
- **Akses Terpusat:** Seluruh pembacaan dan penulisan database hanya dilakukan oleh **backend Express + TypeScript** melalui Prisma Client. Aplikasi klien (`mobile/ebook_store`, `web/admin-web`, `web/pengunjung-web`) dilarang terhubung langsung ke PostgreSQL.

---

## 2. Batasan Data Transaksional & File Storage

1. **Pemisahan Database dan Storage:** PostgreSQL hanya menyimpan metadata `e-book` dan path referensi file (`Ebook.storagePath` dan `Ebook.coverUrl`). **File PDF tidak pernah disimpan sebagai BLOB di dalam PostgreSQL.**
2. **Bucket Privat PDF:** Seluruh file PDF `e-book` wajib disimpan di Supabase Storage **bucket privat** dan hanya dapat diakses melalui *signed URL* berumur pendek yang diterbitkan backend setelah memvalidasi `EbookAccess`.
3. **Presisi Moneter:** Seluruh kolom uang (`Ebook.price`, `Order.totalAmount`, `OrderItem.unitPrice`, `Payment.amount`, `Transaction.amount`) menggunakan `Decimal(12,2)`.
4. **SAW Hanya di Backend:** Basis data menyediakan data mentah kandidat (`Ebook`), sedangkan perhitungan normalisasi dan skor akhir SAW selalu dijalankan di backend.

---

## 3. Daftar Domain Data (`[ADA]` di `schema.prisma` vs `[RENCANA]`)

### 3.1 Domain Model yang Sudah Tersedia pada `schema.prisma` (`[ADA]` di Skema)

| Domain Data | Model Prisma | Nama Tabel (`@@map`) | Peran Utama |
| :--- | :--- | :--- | :--- |
| **Pengguna** | `User` | `users` | Menyimpan identitas pengguna (`CUSTOMER` / `ADMIN`) yang tertaut ke `supabaseUserId`. Tidak menyimpan `password_hash`. |
| **Kategori** | `Category` | `categories` | Mengelompokkan `e-book` berdasarkan `name` dan `slug` unik serta status `isActive`. |
| **E-Book** | `Ebook` | `ebooks` | Menyimpan metadata katalog, `price`, `storagePath` (privat), atribut pendukung SAW (`ratingAvg`, `salesCount`, `pageCount`, `publishedYear`), dan `isActive`. |
| **Pesanan** | `Order` | `orders` | Menyimpan header pesanan (`orderNumber`, `totalAmount`, `OrderStatus`, `expiresAt`). |
| **Item Pesanan** | `OrderItem` | `order_items` | Menyimpan rincian `e-book` per pesanan beserta *snapshot* `unitPrice` saat checkout. |
| **Pembayaran** | `Payment` | `payments` | Menyimpan upaya/metode pembayaran, nominal, `PaymentStatus`, `externalRef` gateway, dan `paidAt`. |
| **Transaksi** | `Transaction` | `transactions` | Mencatat buku besar transaksi resmi 1-to-1 terhadap `Order` dan `Payment` yang telah terverifikasi. |
| **Hak Akses E-Book** | `EbookAccess` | `ebook_accesses` | Menyimpan izin akses Pelanggan terhadap `e-book` tertentu beserta status pencabutan (`isRevoked`). |

### 3.2 Domain Model Rencana (`[RENCANA]` — Belum Ada di `schema.prisma`)

Model berikut **belum tersedia** pada `schema.prisma` dan baru akan ditambahkan apabila keputusan terbuka terkait disahkan:
- **Konfigurasi Bobot SAW (`SawCriterionConfig` — `[RENCANA]`):** Menyimpan kriteria aktif, tipe (`BENEFIT`/`COST`), bobot (`Σ = 1.0`), dan versi konfigurasi (menunggu Keputusan #5 & #9).
- **Snapshot & Audit Hasil SAW (`SawCalculationSnapshot` — `[RENCANA]`):** Menyimpan rekam jejak matriks keputusan, skor, dan ranking historis (menunggu Keputusan #11).
- **Ulasan & Rating (`Review` — `[RENCANA]`):** Menyimpan ulasan pembeli sebagai sumber pembaruan `Ebook.ratingAvg` (menunggu Keputusan #6 & #7).

---

## 4. Penjelasan Relasi Utama (`schema.prisma`)

1. `Category (1) -> (0..N) Ebook` (`onDelete: Restrict`): Kategori yang masih memiliki `e-book` tidak dapat dihapus permanen.
2. `User (1) -> (0..N) Order`, `Transaction`, `EbookAccess` (`onDelete: Restrict`): Riwayat finansial dan hak akses pengguna tetap terjaga.
3. `Order (1) -> (1..N) OrderItem` (`onDelete: Cascade`) & `Ebook (1) -> (0..N) OrderItem` (`onDelete: Restrict`): Item pesanan ikut terhapus hanya jika draft pesanan dihapus, namun `e-book` yang pernah dipesan tidak dapat dihapus keras (`isActive = false` dipakai untuk arsip).
4. `Order (1) -> (0..N) Payment` (`onDelete: Cascade`): Satu pesanan dapat memiliki lebih dari satu upaya pembayaran jika sebelumnya gagal/kedaluwarsa.
5. `Order (1) -> (0..1) Transaction` & `Payment (1) -> (0..1) Transaction` (`onDelete: Restrict`): Satu pesanan dan satu pembayaran terverifikasi hanya menghasilkan **satu** `Transaction` resmi.
6. `User + Ebook -> EbookAccess` (`@@unique([userId, ebookId])`): Mencegah duplikasi kepemilikan `e-book` yang sama untuk satu Pelanggan.

---

## 5. Aturan Integritas Data Inti

- **Harga & Total Backend-Only:** `OrderItem.unitPrice` dan `Order.totalAmount` selalu dihitung ulang oleh backend dari `Ebook.price`.
- **Idempotency Webhook & Transaksi Atomik:** Pembaruan `Payment.status = VERIFIED`, `Order.status = PAID`, pembuatan `Transaction`, dan penerbitan `EbookAccess` dijalankan dalam satu `prisma.$transaction`.
- **Non-Hard-Delete Katalog:** `Ebook` yang sudah memiliki riwayat transaksi diarsipkan dengan `isActive = false` agar `OrderItem` dan `EbookAccess` milik pembeli sebelumnya tetap sah.
