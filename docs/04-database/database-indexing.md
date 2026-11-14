# Strategi Indeks Basis Data (`Database Indexing`)

> **Status Dokumen:** `[ADA]` (Dokumentasi verifikasi indeks)
> **Sumber Verifikasi:** [`backend/prisma/schema.prisma`](../../backend/prisma/schema.prisma)

---

## 1. Indeks yang Sudah Terdefinisi pada `schema.prisma` (`[ADA]` di Skema)

Selain indeks otomatis dari Primary Key (`@id`) dan Unique Constraint (`@unique` / `@@unique`), berikut seluruh `@@index` yang telah didefinisikan pada `schema.prisma`:

| Tabel | Kolom Indeks | Jenis | Tujuan Query | Bukti Schema | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `ebooks` | `category_id` (`categoryId`) | B-Tree Index (`@@index`) | Mempercepat filter katalog berdasarkan kategori | `@@index([categoryId])` pada model `Ebook` | `[ADA]` di schema |
| `ebooks` | `is_active` (`isActive`) | B-Tree Index (`@@index`) | Mempercepat pengambilan e-book aktif untuk katalog publik & kandidat SAW | `@@index([isActive])` pada model `Ebook` | `[ADA]` di schema |
| `orders` | `user_id` (`userId`) | B-Tree Index (`@@index`) | Mempercepat riwayat pesanan milik Pelanggan | `@@index([userId])` pada model `Order` | `[ADA]` di schema |
| `orders` | `status` | B-Tree Index (`@@index`) | Mempercepat filter pesanan (`PENDING`, `PAID`, dll.) di Admin Web | `@@index([status])` pada model `Order` | `[ADA]` di schema |
| `order_items` | `ebook_id` (`ebookId`) | B-Tree Index (`@@index`) | Mempercepat agregasi penjualan per e-book dan cek ketergantungan FK | `@@index([ebookId])` pada model `OrderItem` | `[ADA]` di schema |
| `payments` | `order_id` (`orderId`) | B-Tree Index (`@@index`) | Mempercepat pencarian riwayat pembayaran suatu pesanan | `@@index([orderId])` pada model `Payment` | `[ADA]` di schema |
| `transactions` | `user_id` (`userId`) | B-Tree Index (`@@index`) | Mempercepat riwayat transaksi keuangan Pelanggan | `@@index([userId])` pada model `Transaction` | `[ADA]` di schema |
| `ebook_accesses` | `ebook_id` (`ebookId`) | B-Tree Index (`@@index`) | Mempercepat pengecekan kepemilikan & audit akses per e-book | `@@index([ebookId])` pada model `EbookAccess` | `[ADA]` di schema |

---

## 2. Rencana Indeks Tambahan di Masa Depan (`[RENCANA]`)

Indeks berikut **belum ada** di `schema.prisma` dan baru dipertimbangkan bila volume data atau pola query membutuhkannya:

| Tabel | Kolom Indeks Usulan | Jenis | Tujuan Query | Bukti Schema | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `ebooks` | `(is_active, category_id)` | Composite Index | Filter kategori pada katalog aktif dalam satu indeks gabungan | Belum ada | `[RENCANA]` |
| `ebooks` | `title` / GIN trigram (`pg_trgm`) | Text / Search Index | Pencarian teks judul/penulis pada katalog besar | Belum ada | `[RENCANA]` |
| `transactions` | `recorded_at` | B-Tree Index | Filter rentang tanggal laporan penjualan Admin | Belum ada | `[RENCANA]` |
| `payments` | `external_ref` | B-Tree / Unique Index | Pencarian cepat transaksi berdasarkan referensi webhook gateway | Belum ada | `[RENCANA]` |
| `saw_calculation_snapshots` `[RENCANA]` | `executed_at` | B-Tree Index | Audit riwayat perhitungan SAW terbaru di Admin Web | Model belum ada | `[RENCANA]` |
