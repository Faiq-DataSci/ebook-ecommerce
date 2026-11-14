# Aturan Integritas & Bisnis Basis Data (`Database Rules`)

> **Status Dokumen:** `[ADA]` (Dokumentasi aturan database) | **Penegakan Runtime:** `[RENCANA]` (Sebagian constraint sudah didefinisikan pada `schema.prisma`)

---

## 1. Tabel Aturan Integritas Basis Data

| ID | Aturan | Entitas Terkait | Validasi Backend/Database | Dampak Bila Dilanggar | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **DB-R01** | **Email pengguna unik** | `User` | `@unique` pada `User.email` di `schema.prisma` | Error duplikasi (`P2002` / `409 Conflict`) | `[ADA]` di schema / `[RENCANA]` migrasi |
| **DB-R02** | **`supabaseUserId` unik** | `User` | `@unique` pada `User.supabaseUserId` | Mencegah akun ganda untuk satu subjek Supabase Auth | `[ADA]` di schema / `[RENCANA]` migrasi |
| **DB-R03** | **Role pengguna hanya sesuai enum** | `User` | Enum PostgreSQL `UserRole` (`CUSTOMER \| ADMIN`) | Input role tidak valid ditolak DB/Zod | `[ADA]` di schema |
| **DB-R04** | **Kategori memiliki nama dan slug unik** | `Category` | `@unique` pada `Category.name` dan `Category.slug` | Error `409 Conflict` saat buat/ubah kategori | `[ADA]` di schema / `[RENCANA]` API |
| **DB-R05** | **E-book harus memiliki kategori valid** | `Ebook`, `Category` | FK `categoryId` (`onDelete: Restrict`) + cek backend | E-book yatim ditolak; kategori ber-e-book tidak bisa dihapus | `[ADA]` di schema |
| **DB-R06** | **Harga e-book tidak boleh ditentukan klien saat checkout** | `Order`, `OrderItem`, `Ebook` | Backend mengambil `Ebook.price` dan menyalin ke `OrderItem.unitPrice` | Manipulasi harga checkout dicegah total | `[RENCANA]` |
| **DB-R07** | **Satu e-book tidak boleh muncul dua kali dalam satu pesanan** | `OrderItem` | `@@unique([orderId, ebookId])` + validasi array input | Duplikasi item pada satu pesanan ditolak | `[ADA]` di schema |
| **DB-R08** | **Satu pelanggan tidak boleh memiliki `EbookAccess` duplikat terhadap e-book yang sama** | `EbookAccess` | `@@unique([userId, ebookId])` + cek sebelum checkout | Mencegah pembelian/akses ganda pada judul yang sama | `[ADA]` di schema |
| **DB-R09** | **Pembayaran terverifikasi hanya boleh menghasilkan satu transaksi untuk satu payment** | `Transaction`, `Payment` | `@unique` pada `Transaction.paymentId` + transaksi atomik | Webhook ganda tidak menggandakan pencatatan transaksi | `[ADA]` di schema / `[RENCANA]` webhook |
| **DB-R10** | **Satu pesanan hanya memiliki satu transaksi resmi** | `Transaction`, `Order` | `@unique` pada `Transaction.orderId` | Mencegah pencatatan ganda pendapatan pada satu pesanan | `[ADA]` di schema |
| **DB-R11** | **Hak akses e-book hanya diberikan setelah pembayaran valid** | `EbookAccess`, `Order`, `Payment` | Penerbitan `EbookAccess` hanya di dalam `prisma.$transaction` webhook `PAID` | Pelanggan tidak bisa membuka PDF sebelum pembayaran sah | `[RENCANA]` |
| **DB-R12** | **`isRevoked` menentukan kelayakan penerbitan signed URL** | `EbookAccess` | Backend memeriksa `EbookAccess` ada dan `isRevoked === false` | Akses PDF ditolak (`403`) jika dicabut Admin | `[ADA]` kolom / `[RENCANA]` endpoint |
| **DB-R13** | **E-book tidak aktif tidak boleh menjadi kandidat katalog maupun SAW** | `Ebook` | Query publik & SAW memfilter `where: { isActive: true }` | E-book arsip tidak muncul di katalog baru atau ranking SAW | `[RENCANA]` |
| **DB-R14** | **Nilai `ratingAvg`, `salesCount`, dan data kriteria SAW harus tervalidasi** | `Ebook` | Validasi non-negatif (`>= 0`, rating `0..5`) di backend/Zod | Mencegah `NaN`, `Infinity`, atau skor korup pada SAW | `[RENCANA]` |
| **DB-R15** | **Konfigurasi bobot SAW tidak boleh disimpan atau digunakan sebelum keputusan terkait final** | `SawCriterionConfig` `[RENCANA]` | Schema & endpoint konfigurasi SAW ditahan sebagai `[RENCANA]` hingga Keputusan #5 & #9 dikunci | Menghindari migrasi berulang akibat konflik 4 vs 5 kriteria | `[RENCANA]` |
