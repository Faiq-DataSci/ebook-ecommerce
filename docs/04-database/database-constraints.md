# Constraint Basis Data (`Database Constraints`)

> **Status Dokumen:** `[ADA]` (Dokumentasi audit constraint)
> **Sumber Verifikasi:** [`backend/prisma/schema.prisma`](../../backend/prisma/schema.prisma)
> **Catatan:** Constraint yang tertulis pada `schema.prisma` berstatus `[ADA]` di schema, namun belum diterapkan ke PostgreSQL Supabase sebelum migrasi dijalankan (`[RENCANA]`). `CHECK` constraint DB belum ada di `schema.prisma` dan dicatat sebagai `[RENCANA]`.

---

## 1. Daftar Constraint Terstruktur

| Entitas | Constraint | Jenis | Implementasi Saat Ini | Alasan | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Semua 8 Model** | `id` (`@id @default(uuid()) @db.Uuid`) | Primary Key | Ada di `schema.prisma` | Pengenal unik UUID yang tidak mudah ditebak pada API publik | `[ADA]` di schema |
| **`User`** | `supabaseUserId` (`@unique`), `email` (`@unique`) | Unique Constraint | Ada di `schema.prisma` | Mencegah duplikasi akun dan subjek Supabase Auth | `[ADA]` di schema |
| **`User`** | `role` (`UserRole`, default `CUSTOMER`), `isActive` (default `true`) | Enum & Default Value | Ada di `schema.prisma` | Membatasi nilai peran hanya `CUSTOMER` atau `ADMIN` | `[ADA]` di schema |
| **`Category`** | `name` (`@unique`), `slug` (`@unique`), `isActive` (default `true`) | Unique & Default Value | Ada di `schema.prisma` | Mencegah kategori/slug ganda dan mendukung status aktif | `[ADA]` di schema |
| **`Ebook`** | `categoryId -> Category.id` (`onDelete: Restrict`) | Foreign Key & Referential Action | Ada di `schema.prisma` | Menjaga integritas kategori; mencegah hapus kategori yang ber-e-book | `[ADA]` di schema |
| **`Ebook`** | `ratingAvg` (default `0`), `salesCount` (default `0`), `isActive` (default `true`) | Default & Not-Null | Ada di `schema.prisma` | Menjamin atribut numerik SAW memiliki nilai awal aman | `[ADA]` di schema |
| **`Order`** | `orderNumber` (`@unique`), `status` (`OrderStatus`, default `PENDING`), `userId -> User.id` (`Restrict`) | Unique, Enum, Default, FK | Ada di `schema.prisma` | Nomor pesanan unik, status terkontrol enum, riwayat user terlindungi | `[ADA]` di schema |
| **`OrderItem`** | `@@unique([orderId, ebookId])` | Composite Unique | Ada di `schema.prisma` | Satu e-book tidak boleh muncul dua kali dalam satu pesanan | `[ADA]` di schema |
| **`OrderItem`** | `orderId -> Order.id` (`Cascade`), `ebookId -> Ebook.id` (`Restrict`) | FK & Referential Action | Ada di `schema.prisma` | Item ikut terhapus bila pesanan dihapus, tetapi e-book bertransaksi tidak boleh terhapus keras | `[ADA]` di schema |
| **`Payment`** | `status` (`PaymentStatus`, default `PENDING`), `orderId -> Order.id` (`Cascade`) | Enum, Default, FK | Ada di `schema.prisma` | Membatasi status pembayaran dan menautkannya ke pesanan | `[ADA]` di schema |
| **`Transaction`** | `orderId` (`@unique`), `paymentId` (`@unique`), `transactionCode` (`@unique`) | Unique Constraint (1-to-1) | Ada di `schema.prisma` | Menjamin 1 pesanan & 1 pembayaran hanya menghasilkan 1 transaksi resmi | `[ADA]` di schema |
| **`Transaction`** | `orderId`, `paymentId`, `userId` (`onDelete: Restrict`) | FK & Referential Action | Ada di `schema.prisma` | Melindungi buku besar transaksi keuangan dari penghapusan | `[ADA]` di schema |
| **`EbookAccess`** | `@@unique([userId, ebookId])` | Composite Unique | Ada di `schema.prisma` | Satu Pelanggan hanya memiliki satu rekaman hak akses per e-book | `[ADA]` di schema |
| **`EbookAccess`** | `userId`, `ebookId`, `orderId` (`onDelete: Restrict`), `isRevoked` (default `false`) | FK, Referential Action, Default | Ada di `schema.prisma` | Menjaga jejak kepemilikan dan mendukung pencabutan akses | `[ADA]` di schema |
| **`Ebook`, `Order`, `OrderItem`, `Payment`, `Transaction`** | `price >= 0`, `totalAmount >= 0`, `unitPrice >= 0`, `amount >= 0` | Check Constraint / Validasi Moneter | Belum ada `CHECK` SQL; dijaga Zod backend | Mencegah nilai uang negatif | `[RENCANA]` |
| **`Ebook`** | `0 <= ratingAvg <= 5`, `salesCount >= 0`, `pageCount > 0` | Check Constraint / Validasi SAW | Belum ada `CHECK` SQL; dijaga backend | Menjaga validitas matriks keputusan SAW | `[RENCANA]` |
| **`SawCriterionConfig`** `[RENCANA]` | `Σ weight = 1.0`, `weight >= 0` | Constraint Aplikasi & Backend | Belum ada di `schema.prisma` | Menjamin skor preferensi SAW tetap valid pada rentang `[0, 1]` | `[RENCANA]` |
